---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: ApiVersion
# 当前页面内容描述
description: ApiVersion
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
order: 2
dir:
  order: 2
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

# ApiVersion

接口版本控制注解

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | int | 否 | 1 | 标识接口版本号 |

## 使用说明

可以放在`Controller`的类上面，也可以是接口的方法上面来控制整个`Controller`的接口版本或者是单独某个接口的版本

::: tip

其实这个注解作用并不大，如果要控制版本，建议是直接写死接口的版本，还少一步接口版本注解的解释，减少接口调用时间 😑😑

:::
