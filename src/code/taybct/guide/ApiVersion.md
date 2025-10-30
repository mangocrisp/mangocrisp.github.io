---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 接口版本
# 当前页面内容描述
description: 接口版本
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
order: 24
dir:
  order: 24
# 页面图标
icon: "qlementine-icons:version-control-16"
# 是否原创
isOriginal: false
# 日期
date: 2025-10-29
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Boot"
  - "Spring Cloud"
  - 开发框架
  - 指南
  - 接口版本
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 接口版本

在实际开发过程中，如果有涉及到和第三方的对接，我们会提供一些接口出去，但是，如果有很多对接方，那么，后续升级接口，就会导致接口的版本问题，所以，这边建议写接口的时候呢，加上版本号，
对接旧接口的继续使用，不会影响，新接口的，则需要加上更高的版本号，这样，当对接方升级的时候，就会自动使用新的接口，而不会影响到旧接口的使用。

## 目录结构来区分

```bash
.
`-- controller
    |-- v1
    |   `-- SysUserController.java
    |-- v2
    |   `-- SysUserController.java
    `-- v3
        `-- SysUserController.java
```

## 直接在接口方法中指定

```java
@RequestMapping("/v1/sysUser")
```

也可以使用注解 [@ApiVersion](/code/taybct/annotation/ApiVersion.html)
