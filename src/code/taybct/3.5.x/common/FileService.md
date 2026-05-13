---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 文件服务
# 当前页面内容描述
description: 文件服务
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
icon: "codicon:code-oss"
# 是否原创
isOriginal: false
# 日期
date: 2025-10-31
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 轮子
  - MinIO
  - OSS
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 文件服务

在实际项目中，我们需要保存文件，比如用户上传的头像，或者上传的文档，一般不会保存到数据库中，而是保存到文件系统，比如本地文件系统，或者云存储。文件服务整合`本地文件系统`、`阿里云OSS`、`MinIO`、`FastDFS`，提供统一的接口操作文件的上传和下载删除操作，开发者后续也可以自行实现接口扩展。

::: tip
在实际开发中，如果没有统一的文件服务（如 MinIO），可以修改 `taybct.file.type` 为 `local`，直接本地开发就行了，到了生产环境，再修改为 `minio`或者其他文件服务，减少资源占用，毕竟我们要的是逻辑正确，而不是实现细节不同
:::

## 如何使用文件服务

### 一、使用统一的文件服务模块

一般我们上传保存文件，直接上传文件的路径就行了，并不需要把文件的表单数据一起上传，Spring TayBct 已经开发了文件服务模块`spring-taybct-admin-file`，提供了文件上传和下载的接口，直接启动就行了，通过文件服务模块，上传的文件会保存在指定的目录下，并返回文件路径，用户可以通过文件路径下载文件。

- [修改配置文件](../guide/Properties.html#taybct-file)

### 二、在模块中使用文件服务

有些接口的业务需求就是数据和文件一起上传，这个时候光使用文件服务模块并不能实现业务需求，需要自己实现上传和下载接口。参考：在线文件的文档操作[::mdi:github::](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/controller/OnlineDocControllerRegister.java#L69-L129)[::simple-icons:gitee::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/controller/OnlineDocControllerRegister.java#L69-L129)

1. 引入依赖

```xml
<dependency>
    <groupId>io.github.taybct</groupId>
    <artifactId>spring-taybct-tool-file</artifactId>
</dependency>
```

2. [配置文件](../guide/Properties.html#taybct-file)

## 文件操作 FileServiceBuilder

FileServiceBuilder 提供了常见的文件操作方法，详见：[接口文档](https://8.148.188.198/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/file/util/FileServiceBuilder.html)

### IFileService

如果这个工具类并不能实现需要的业务功能，可以通过调用 `IFileService` 来实现自己的功能，[接口文档](https://8.148.188.198/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/file/service/IFileService.html)，

- 实现

实现可以参考：
[::mdi:github:: FileServiceMinioImpl.java](https://github.com/taybct/spring-taybct-tools/tree/main/spring-taybct-tool-file/src/main/java/io/github/taybct/tool/file/service/impl/FileServiceMinioImpl.java)
[::simple-icons:gitee:: FileServiceMinioImpl.java](https://gitee.com/taybct/spring-taybct-tools/tree/main/spring-taybct-tool-file/src/main/java/io/github/taybct/tool/file/service/impl/FileServiceMinioImpl.java)

- 使用

可以通过 FileServiceBuilder.build() 获取来统一调用文件服务。

## 文件访问下载接口

### 本地文件系统

如果是本地文件存储，虽然可以使用 `FileServiceBuilder` 获取文件访问下载接口，但是 `FileServiceBuilder` 是会多一些转换过程步骤，需要把文件读取出来，做一系列的转换，然后又输出二进制到前端。所以文件服务对本地存储文件做了 `WebMvc` 配置：

[::mdi:github:: FileServiceMinioImpl.java](https://github.com/taybct/spring-taybct-tools/tree/main/spring-taybct-tool-file/src/main/java/io/github/taybct/tool/file/config/ResourcesConfig.java)
[::simple-icons:gitee:: FileServiceMinioImpl.java](https://gitee.com/taybct/spring-taybct-tools/tree/main/spring-taybct-tool-file/src/main/java/io/github/taybct/tool/file/config/ResourcesConfig.java)

可以直接通过 `taybct.file.local.local-file-prefix` 来访问本地文件系统下的文件。例如：`taybct.file.local.local-file-prefix=statics`

那么，可以直接通过浏览器来访问：`{host}/{context-path}/{statics}/{filePath}`

- host：服务地址
- context-path：项目的 `server.servlet.context-path`，一般默认是 `/`
- statics：本地文件系统配置的 `local-file-prefix`
- filePath：文件路径（通过文件服务上传后返回的文件路径）

### 云存储服务器

本地文件系统只适合本地开发使用，如果文件涉及到保密、安全，或者需要上传的文件比较大，那么就只能使用云存储服务器了。云存储服务器的文件访问，只能通过将文件下载下来，然后通过浏览器来访问，可以在返回前端的时候做鉴权。

::: warning
文件服务是 `spring-taybct-tools` 提供的 `spring-taybct-tool-file`，需要自行引入的依赖，文件服务模块是 `spring-taybct-admin-file` 基于文件服务开发的 MVC 接口。
:::
