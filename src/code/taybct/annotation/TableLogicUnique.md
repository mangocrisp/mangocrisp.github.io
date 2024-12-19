---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: TableLogicUnique
# 当前页面内容描述
description: TableLogicUnique
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
order: 17
dir:
  order: 17
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

# TableLogicUnique

标识实体类对应的表是唯一逻辑删除的

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| columnName | String | 否 | "unique_key" | 数据库表字段名 |
| value | String | 否 | "uniqueKey" | 用于标识唯一逻辑删除的字段 |

## 使用说明

注解到实体类上，来标识这个实体类对应的表是唯一逻辑删除的，当使用 `MyBatis`/`MyBatisPlus` 的方法逻辑删除数据时，会根据这个注解里面信息来自动更新唯一逻辑删除标识字段，一般是将当前行的`unique_key`更新成当前行的`id`(唯一值)的值

## 唯一逻辑删除

顾名思义，就是说，如果某个表的数据是逻辑删除的，但是这个表里面的数据又有些字段是有唯一性的，比如：用户表，用户名，可以是唯一的，但是又有要求这张表的数据是逻辑删除的，删除用户的时候不能直接把用户的信息删除掉，那么下次再添加一个同用户名的用户时，就会报唯一键错误了，所以通常的解决方案是，把用户和和一个字段比如`unique_key`,组合起来作为唯一键

| id | name | unique_key | is_deleted |
|:----:|:----:|:----:|:----:|
| 1 | admin | 0 | 0 |

比如：admin + 0 是唯一的，`unique_key` 默认值就是 0

| id | name | unique_key | is_deleted |
|:----:|:----:|:----:|:----:|
| 1 | admin | 1 | 1 |

删除之后，把`unique_key`设置成 id 或者是一个随机值

| id | name | unique_key | is_deleted |
|:----:|:----:|:----:|:----:|
| 1 | admin | 1 | 1 |
| 2 | admin | 0 | 0 |

| id | name | unique_key | is_deleted |
|:----:|:----:|:----:|:----:|
| 1 | admin | 1 | 1 |
| 2 | admin | 2 | 1 |
| 3 | admin | 0 | 0 |

...

这样再继续添加新数据的时候就不会报唯一键异常了，所以，`@TableLogicUnique`注解的工作就是自动完成这个将`unique_key`设置成`id`(唯一值)的值

::: tip
有了`unique_key`还可以绑定这个表所有需要确定唯一键的列，比如，用户名和这个绑定了，还可以绑定身份证，绑定手机号，绑定各种唯一列，因为只要是和`unique_key`组合唯一键，`unique_key`改变了，也就意味着是另一个新的数据了，这样来确定`未被删除的唯一性`，即永远只有一个唯一的未删除的列
:::

## 参考

框架自带了这样的实体类父类：`UniqueDeleteLogic`，如果按标准的来，可以考虑使用这个
