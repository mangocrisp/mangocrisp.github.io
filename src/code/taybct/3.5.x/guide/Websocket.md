---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 即时通讯（WebSocket）
# 当前页面内容描述
description: 即时通讯（WebSocket）
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
order: 26
dir:
  order: 26
# 页面图标
icon: "clarity:talk-bubbles-solid-badged"
# 是否原创
isOriginal: false
# 日期
date: 2026-09-21
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
  - WebSocket
  - 即时通讯
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 即时通讯（WebSocket）

即时通讯（WebSocket）在项目里面很常见，例如消息通知，实时翻译，语音转译等等。本框架在集成了 WebSocket 的基础上，实现了简单的消息通知以及角标统计功能，并且对于集成的 WebSocket 功能做了抽象优化，后续你可以自己实现自己的 WebSocket 功能。

## 消息通知

框架已经实现了简单的消息通知功能，并且加上了实时通知，这需要前端先连接上服务器，然后，服务端会向前端推送消息。

### 前端连接服务器

参考：[示例项目的 WebSocket 配置](https://gitee.com/mangocrisp/vue-pure-admin/blob/main/src/store/modules/websocket.ts)

### 服务器发送消息

3.5.3 版本之后，将 WebSocket 单独做为一个服务模块来做统一的 WebSocket 入口，算是一个中转，所有的请求到这个服务，然后分发给各个需要使用到的服务模块，各个服务模块也可以通过 RPC 来把消息传递到中转服务，然后统一发送给前端，所以事情就简单了，可以参考 [系统消息通知](https://gitee.com/taybct/spring-taybct/blob/cloud/spring-taybct-modules/spring-taybct-module-system/src/main/java/io/github/taybct/module/system/service/impl/SysNoticeServiceImpl.java#L94-L110)

## 角标统计

在已经集成了 WebSocket 功能和单独做成中转服务的基础上，结合系统的路由配置做了角标统计功能，举个例子，需要统一菜单里面的总数可能会使用到这个项目，简单配置步骤如下：

1. 配置路由

```json
{"frameLoading":true,"hiddenTag":false,"fixedTag":false,"menuType":0,"transition":{},"routeCountConfig":{"name":"user","params":{}}}
```

`routeCountConfig`: 路由统计配置
`name`: 路由名称
`params`: 路由参数（可以放任意参数）

2. 注册计数器

在自动注册器中注册计数器：[示例](https://gitee.com/taybct/spring-taybct/blob/cloud/spring-taybct-modules/spring-taybct-module-system/src/main/java/io/github/taybct/module/system/support/route/RouteCounterAutoRegister.java#L44)

注册的 Key 就是路由名

## 参考

[Spring Taybct Example](https://gitee.com/taybct/spring-taybct-example)
