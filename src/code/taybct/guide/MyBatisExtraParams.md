---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: MyBatis 额外参数配置
# 当前页面内容描述
description: MyBatis 额外参数配置
# 是否在侧边栏或目录中索引当前页面
index: true
# 当前页面是否开启评论功能
comment: true
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# 是否显示页面最后更新时间
lastUpdated: true
# 是否显示编辑链接
editLink: true
# 是否显示贡献者
contributors: true
# 指定当前页面在侧边栏或目录中的排序
order: 21
dir:
  order: 21
# 页面图标
icon: "token:extra"
# 是否原创
isOriginal: false
# 日期
date: 2025-02-13
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 指南
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# MyBatis 额外参数配置

::: info
我们在做数据库操作，写 xml sql 语句的时候，一些通用的参数，或者我们想添加一个并不是实体类里面有的参数，我们的处理方式可能是加一个 VO，或者 DTO 类来实现，或者是在方法里面多写一些的参数，但是，其实可以把这些参数，通过 MyBatis 拦截器的方式添加到参数里面，然后就可以在 XML 里面调用来写动态 SQL 了，框架使用了 MyBatisExtraParamsInterceptor 拦截器用来添加额外参数
:::

## MyBatisExtraParamsInterceptor

用来拦截增删改查操作添加额外参数，核心代码如下：

```java
@RequiredArgsConstructor
@Slf4j
@Intercepts(
        {
                @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}),
                @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}),
                @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class, CacheKey.class, BoundSql.class}),
        }
)
public class MyBatisExtraParamsInterceptor implements Interceptor {

    private List<MyBatisExtraParamsHandle> myBatisExtraParamsHandle = new ArrayList<>();

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        if (ArrayUtil.isEmpty(args)) {
            return invocation.proceed();
        }
        MappedStatement ms = (MappedStatement) args[0];
        Method method = MyBatisUtil.getMethod(ms);
        if (method == null) {
            return invocation.proceed();
        }
        Map<String, Object> paramMap;
        if (MyBatisUtil.checkTableFieldDefault(args[1])) {
            // 如果查检出来需要设置默认值的方法，就会根据注解设置默认值
            paramMap = MyBatisUtil.getParamMap(ms, args[1], true);
        } else {
            paramMap = MyBatisUtil.getParamMap(ms, args[1]);
        }

        myBatisExtraParamsHandle.forEach(handle -> args[1] = handle.apply(ms, paramMap));

        return invocation.proceed();
    }

    /**
     * 添加处理器
     *
     * @param handler 处理器
     */
    public void addHandler(MyBatisExtraParamsHandle handler) {
        myBatisExtraParamsHandle.add(handler);
    }

}
```



可以看得出来，最关键的就是这个  myBatisExtraParamsHandle，拦截器会在拿到参数后经过 myBatisExtraParamsHandle 再添加一遍开发人员需要的更多的参数，所以，开发人员还可以继续添加 handle 往里面添加参数，至于是怎么添加参数，该怎么添加，可以看一下下面两个示例：

> 注意，这里拿参数的时候会根据，如果有添加了 @TableFieldDefault 注解的话，会先把默认值设置上去，这里注意一下就好了

## 使用示例1 @DataScope

基于部门这个功能的数据权限范围的功能，如果要动态的插入到操作里面，可以通过额外参数的形式加入到请求参数里面进行过滤，所以这里的大致实现核心代码如下：

```java
@RequiredArgsConstructor
@Slf4j
public class DataScopeMethodInterceptor implements MethodInterceptor, MyBatisExtraParamsHandle {
    
    @SneakyThrows
    @Override
    public Map<String, Object> apply(MappedStatement ms, Map<String, Object> stringObjectMap) {
        Method method = MyBatisUtil.getMethod(ms);
        // 获取到注解
        DataScope dataScope = method.getAnnotation(DataScope.class);
        if (dataScope == null || ignore(dataScope)) {
            // 如果判断条件不满足就真的返回
            return stringObjectMap;
        }
        // 先默认拿注解上的自定义过滤规则，然后再拿全局配置的规则，最后使用默认的规则
        String conditionSql = Optional.ofNullable(dataScope.custom().newInstance().apply(dataScope))
                .orElseGet(() -> Optional.ofNullable(dataScopeCustom.apply(dataScope))
                        .orElseGet(() -> getConditionSql(dataScope)));
        stringObjectMap.put("_data_scope_", conditionSql);
        return stringObjectMap;
    }
    
}
```

这里，数据权限，可以见 [数据权限范围](AnnotationDataScope)

>  MappedStatement ms 里面可以拿到执行的什么方法，操作的类型等，这个可以详见 MyBatisUtil 里面的方法有写一些获取这些数据的方式，可以根据这些来判断该如何添加额外参数

## 使用示例2 往参数里面添加登录用户信息

```java
    /**
     * 添加用户信息处理
     *
     * @param securityUtil                  安全工具，用来获取用户信息
     * @param myBatisExtraParamsInterceptor 额外参数拦截器
     * @return MyBatisExtraParamsHandle
     */
    @Bean
    public MyBatisExtraParamsHandle myBatisExtraParamsLoginUserHandle(ISecurityUtil securityUtil
            , MyBatisExtraParamsInterceptor myBatisExtraParamsInterceptor) {
        MyBatisExtraParamsHandle handle = (mappedStatement, stringObjectMap) -> {

            try {
                stringObjectMap.put("_login_user_", securityUtil.getLoginUser().getPayload());
            } catch (Exception e) {
                log.trace("获取用户失败！", e);
            }
            return stringObjectMap;
        };
        // 添加用户信息
        myBatisExtraParamsInterceptor.addHandler(handle);
        return handle;
    }
```

可以随便找个配置类，配置这些 MyBatisExtraParamsHandle 然后把他加入到 MyBatisExtraParamsInterceptor 里面

> 注意，配置类的配置顺序：@AutoConfigureAfter({MybatisPlusConfig.class})