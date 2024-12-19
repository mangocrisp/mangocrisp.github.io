---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: CacheTimeOut
# 当前页面内容描述
description: CacheTimeOut
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
order: 3
dir:
  order: 3
# 页面图标
icon: "catppuccin:java-annotation"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-19
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

# CacheTimeOut

由于`@Cacheable`注解暂时是没有可以支持单独设置某个缓存数据的缓存时长，所以才开发了这个注解

- 可以设置单独某个缓存的缓存时长，防止一些数据更新了，但是缓存没及时更新
- 可以和`@CacheEvict`、`@CachePut`一起使用
- 结合了以上两个注解的功能到这一个注解里面
- 自定义缓存机制，不仅仅是放在 Redis 里面，可以是任何形式的缓存
- SpEL 输入条件

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| cacheName | String | 是 |  | 缓存名 |
| key | String | 是 |  | 缓存键 |
| timeout | long | 否 | 60L | 超时时间 |
| timeUnit | long | 否 | TimeUnit.SECONDS | 时间单位 |
| condition | String | 否 | "" | 缓存条件 |
| unless | String | 否 | "" | 对返回结果做处理的条件 |
| removeCondition | String | 否 | "" | 删除 key 的条件 |
| updateCondition | String | 否 | "" | 更新 key 的条件 |
| updateObject | String | 否 | "" | 参数名 |

### key (SpEL)

SqEL 表达式获取 key 名，在查询参数里面去获取，可以是多个 key，使用`,`隔开

### condition (SpEL)

缓存条件，与 @Cacheable 里面的 condition 一样，用来判定是否决定要缓存数据 这里要求表达式最终得到的结果要是一个 boolean 即 "true" 或者 "false"，不过不管怎么样，只要不是 "true" 或者 "" 就都不会缓存

### unless (SpEL)

当 unless 指定的条件为 true ，方法的返回值就不会被缓存，这里可以使用 #result 来引用返回结果

### removeCondition (SpEL)

删除 key 的条件，即当条件为 true 的时候，删除 key，并且不再执行缓存操作

### updateCondition (SpEL)

更新 key 的条件，即当条件为 true 的时候更新 key，并且直接返回

### updateObject

更新的对象的参数名，这里如果不指定，默认拿第一个参数

## 使用说明

[SpEL 表达式（官网）](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html)
[SpEL 表达式（中文）](https://itmyhome.com/spring/expressions.html)


所有的缓存条件的判断顺序是：

```java
condition < removeCondition < updateCondition < key < unless
```

- condition: 放入缓存的条件判断，就是如果已经符合了，才会进行缓存操作
- removeCondition: 如果删除了，就不需要更新了
- updateCondition: 获取了结果，才能对结果进行更新，这里如果需要更行更新才会去获取结果，就可以直接返回了
- key: 这里如果缓存里面没有 key 才会去获取结果
- unless: 这里肯定是缓存里没有 key，然后并且已经获取到了结果，才能对结果进行判断，判断是否要存入缓存，在判断之前如果缓存里面有数据，就直接获取缓存里面的数据

所以，removeCondition 和其他的条件如果使用了，后面的条件就无效了

::: details 使用示例

```java
    @CacheTimeOut(cacheName = "taybct:test", key = "#id", condition = "!#id.equals('1')", unless = "#result.getId()==3L", timeout = 90L)
    public SysUser getUser(String id) {
        SysUser sysUser = new SysUser();
        sysUser.setUsername("小明");
        sysUser.setId(Long.valueOf(id));
        return sysUser;
    }
    @CacheTimeOut(cacheName = "taybct:test", key = "#user.getId()", condition = "#user.getId()!=1L"
            , updateCondition = "true", updateObject = "user", unless = "#result==false", timeout = 90L)
    public boolean saveOrUpdateUser(SysUser user) {
        return false;
    }
    @CacheTimeOut(cacheName = "taybct:test", key = "T(cn.hutool.core.util.StrUtil).join(',', #id)", removeCondition = "true"
            , unless = "#result==false")
    public boolean deleteUser(Set<String> id) {
        return true;
    }
```

:::

## 配置

可以重写框架的默认实现来使用合适的缓存机制`CacheTimeOutMethodInterceptor`
