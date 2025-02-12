---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: RESTful 接口
# 当前页面内容描述
description: RESTful 接口
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
order: 13
dir:
  order: 13
# 页面图标
icon: "charm:git-request"
# 是否原创
isOriginal: false
# 日期
date: 2025-02-12
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

# RESTful 接口

::: info
REST 即 Representational State Transfer 的缩写。
:::

## Resource（资源）

对象的单个实例。 例如，一只动物。它可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的实在。你可以用一个URI（统一资源定位符）指向它，每种资源对应一个特定的URI。要获取这个资源，访问它的URI就可以，因此URI就成了每一个资源的地址或独一无二的识别符。   

## 表现层（Representation）

"资源"是一种信息实体，它可以有多种外在表现形式。我们把"资源"具体呈现出来的形式，叫做它的"表现层"（Representation）。

## 状态转化（State Transfer）

访问一个网站，就代表了客户端和服务器的一个互动过程。在这个过程中，势必涉及到数据和状态的变化。互联网通信协议HTTP协议，是一个无状态协议。这意味着，所有的状态都保存在服务器端。因此，如果客户端想要操作服务器，必须通过某种手段，让服务器端发生"状态转化"（State Transfer）。而这种转化是建立在表现层之上的，所以就是"表现层状态转化"。    

客户端用到的手段，只能是HTTP协议。具体来说，就是HTTP协议里面，四个表示操作方式的动词：GET、POST、PUT、DELETE。它们分别对应四种基本操作：GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源。  

比如，文本可以用txt格式表现，也可以用HTML格式、XML格式、JSON格式表现，甚至可以采用二进制格式；图片可以用JPG格式表现，也可以用PNG格式表现。  

URI只代表资源的实体，不代表它的形式。严格地说，有些网址最后的".html"后缀名是不必要的，因为这个后缀名表示格式，属于"表现层"范畴，而URI应该只代表"资源"的位置。它的具体表现形式，应该在HTTP请求的头信息中用Accept和Content-Type字段指定，这两个字段才是对"表现层"的描述。

## 总结什么是RESTful架构

1. 每一个URI代表一种资源；
2. 客户端和服务器之间，传递这种资源的某种表现层；
3. 客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"。

# 二、REST接口规范

## 1、动作

- GET （SELECT）：从服务器检索特定资源，或资源列表。
- POST （CREATE）：在服务器上创建一个新的资源。
- PUT （UPDATE）：更新服务器上的资源，提供整个资源。
- PATCH （UPDATE）：更新服务器上的资源，仅提供更改的属性。
- DELETE （DELETE）：从服务器删除资源。

所有 [HTTP 请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)

## 2、路径（接口命名）

路径又称"终点"（endpoint），表示API的具体网址。 在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

示例：

```
GET         /zoos/list：列出所有动物园
GET         /zoos/page：分页获取动物园
POST        /zoos：新建一个动物园
GET         /zoos/{ID}：获取某个指定动物园的信息
PUT         /zoos/{ID}：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH       /zoos/{ID}：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE      /zoos/{ID}：删除某个动物园
GET         /zoos/{ID}/animals：列出某个指定动物园的所有动物
DELETE      /zoos/{ID}/animals/{animalsID}：删除某个指定动物园的指定动物
```

## 3、版本（Versioning）

应该将API的版本号放入URL

```
https://api.example.com/v1/
```

## 4、过滤信息（Filtering）

API应该提供参数，过滤返回结果，例如分页条件。

## 5、状态码（Status Codes）

这个在 ResultCode 里面有定义。
