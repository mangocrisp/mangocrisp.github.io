---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Enhance*
# 当前页面内容描述
description: Enhance*
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
order: 6
dir:
  order: 6
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
  - 注解
  - 接口增强
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# Enhance*

数据增强注解，与`Encrypted`不同的是：`EnhanceMethod`不仅仅能加解密数据，只要是有入参和出参都能进行加解密或者其他一些对数据进行修改的操作

## 参数说明

### EnhanceMethod

在方法调用的时候对方法里面的输入参数和输出结果做一些处理

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| handler | `Class<? extends IMethodEnhanceHandler>[]` | 否 | `{}` | 处理器（bean）,可以有多个处理器，按顺序处理数据 |

### EnhanceElements

类型/方法等包含很多字段的字段需要处理 

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | `String[]` | 否 | `{}` | 如果是放在`EnhanceElements`注解里面需要指定是哪个字段要操作处理，如果是放在参数里面就是指定如果这个类型是一个`Map`集合，就是`Map`集合的`key` |
| map | `EnhanceElementMap` | 否 | `{}` | 指定返回结果如果是`Map`集合，就是`Map`集合的参数名 |
| enDecryptedElements | `EnhanceElement[]` | 否 | `{}` | 这个只作用在注解在类型上，用来指定这个类型里面的哪些字段去用同一组加解密方式去处理 |
| parameterHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 参数处理器，作为参数时处理，可以添加多个按顺序处理 |
| resultHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 结果处理器，作为返回结果时处理，可以添加多个按顺序执行处理 |

### EnhanceElement

方法参数/ 字段等元素需要增强处理

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | `String[]` | 否 | `{}` | 如果是放在`EnhanceElements`注解里面需要指定是哪个字段要操作处理，如果是放在参数里面就是指定如果这个类型是一个`Map`集合，就是`Map`集合的`key` |
| map | `EnhanceElementMap` | 否 | `{}` | 指定返回结果如果是`Map`集合，就是`Map`集合的参数名 |
| parameterHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 参数处理器，作为参数时处理，可以添加多个按顺序处理 |
| resultHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 结果处理器，作为返回结果时处理，可以添加多个按顺序执行处理 |

### EnhanceElementMap

如果参数或者返回结果是 map 对象，针对 map 里面的每个 key 值进行不同的处理

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | `String[]` | 否 | `{}` | `Map`的`Key` |
| parameterHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 参数处理器，作为参数时处理，可以添加多个按顺序处理 |
| resultHandler | `Class<? extends Function<Object, Object>>[]` | 否 | `{}` | 结果处理器，作为返回结果时处理，可以添加多个按顺序执行处理 |


## 使用说明

::: details 示例

```java

public interface SysUserMapper extends BaseMapper<SysUser> {
    @Override
    @EnhanceMethod
    SysUser selectById(Serializable id);
}

@EnhanceElements
public class SysUser extends UniqueDeleteLogic<Long, Long> implements Serializable {
    @EnhanceElement(parameterHandler = {PasswordHandler.En.class}, resultHandler = {PasswordHandler.De.class})
    private String password;
}

public class PasswordHandler {
    /**
     * 加密
     */
    public static class En implements Function<Object, Object> {

        @SneakyThrows
        @Override
        public Object apply(Object s) {
            return SM4Coder.getSM4().encryptBase64((String) s, StandardCharsets.UTF_8);
        }
    }

    /**
     * 解密
     */
    public static class De implements Function<Object, Object> {

        @SneakyThrows
        @Override
        public String apply(Object s) {
            return SM4Coder.getSM4().decryptStr((String) s, StandardCharsets.UTF_8);
        }
    }
}

```

这样，存到数据库的密码就是经过 SM4 加密的密码了，拿出来又会自动解密

:::

::: warning 注意

如果需要处理的是集合对象,不要使用 `Arrays. asList()` 传参,这样会导致无法调用 `collection. clear()` 方法 ,你应该是 `new ArrayList(Arrays. asList())` 这样使用

:::
