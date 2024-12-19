---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: TableFieldDefault
# 当前页面内容描述
description: TableFieldDefault
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
order: 15
dir:
  order: 15
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
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# TableFieldDefault

表字段默认值，由于我们在实际开发中，会需要对数据表字段设置默认值，但是数据库的设置默认值的方式不是很方便和自由，所以有了这个注解，并且，这个默认值是写死在`Java`代码里面的，数据不需要去额外的设置，更适配业务需求

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | String | 否 | "" | 值 |
| isBlank | boolean | 否 | false | 是否设置为空字符串 |
| isTimeNow | boolean | 否 | false | 是否设置为当前时间 |
| isRandom | boolean | 否 | false | 是否随机，这里默认随机是 uuid |
| expression | String | 否 | "" | Spring Expression Language (SpEL) expression. 用来生成默认值 |
| handler | `Class<? extends TableFieldDefaultHandler>` | 否 | `DefaultTableFieldDefaultHandler.class` | 自定义默认值该如何设置 |
| fill | `SqlCommandType[]` | 否 | `{SqlCommandType.INSERT}` | 字段自动填充策略,默认只在新增插入操作的时候自动填充 |

### TableFieldDefaultHandler

自定义默认值规则，可以实现这个接口，然后注入到`Spring`容器就可以实现自定义这个默认值如何生成了，例如，需要将某个字段值设置成当前登录用户的`id`：

::: details 示例

```java
public interface TableFieldDefaultLoginUserIdHandler extends TableFieldDefaultHandler<Serializable> {

    @Override
    default Serializable get(Object entity) {
        try {
            ISecurityUtil securityUtil = SpringUtil.getBean(ISecurityUtil.class);
            return (Long) securityUtil.getLoginUser().getUserId();
        } catch (Exception e) {
            return null;
        }
    }

}

@AutoConfiguration
public class ApplicationConfig {
    @Bean
    @ConditionalOnMissingBean
    public TableFieldDefaultLoginUserIdHandler tableFieldDefaultLoginUserIdHandler() {
        return new TableFieldDefaultLoginUserIdHandler() {
        };
    }
}

@Data
public class Entity implements Serializable {
    /**
     * 创建人
     */
    @JsonSerialize(using = ToStringSerializer.class)
    @Schema(description = "创建人")
    @TableFieldDefault(handler = TableFieldDefaultLoginUserIdHandler.class)
    private Long createUser;
}
```

这样，当前使用`MyBatisPlus`的`insert`方法时就会自动将当前登录用户的`id`设置进这个字段，然后保存到数据库

:::

### SqlCommandType

数据库操作枚举

| 值 | 说明 |
|:--:|:--:|
|INSERT|新增|
|UPDATE|修改|
|DELETE|删除|

## 使用说明

[SpEL 表达式（官网）](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html)
[SpEL 表达式（中文）](https://itmyhome.com/spring/expressions.html)

直接注解到需要设置默认值的数据库实体类的字段上

```java
    /**
     * 创建时间
     */
    @Schema(description = "创建时间")
    @TableFieldDefault(isTimeNow = true)
    private LocalDateTime createTime;
```
