---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: ServerReactiveEndpoint
# 当前页面内容描述
description: ServerReactiveEndpoint
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
icon: "catppuccin:java-annotation"
# 是否原创
isOriginal: false
# 日期
date: 2025-06-20
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
  - "WebFlux WebSocket"
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# ServerReactiveEndpoint

websocket reactive 路径匹配，类似 @ServerEndpoint，但是这个注解是在 WebFlux 里面使用的

可以查看这个示例：[exp-websocket-reactive](https://github.com/taybct/spring-taybct-example/blob/3.2.x/exp-websocket/exp-websocket-reactive/src/main/java/io/github/mangocrisp/exp/wsr/server/WebSocketReactiveServer.java)