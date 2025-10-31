---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Future
# 当前页面内容描述
description: Future
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
order: 100
dir:
  order: 100
# 页面图标
icon: "svg-spinners:blocks-scale"
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
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# Future

- 过程数据加密改为 SM2 加密

  因为考虑到安全性，私钥对需要及时更新，数据库里面的数据使用的是 SM4 加密的话，如果也要定期更新 SM4 的私钥，就会增加许多的工作量，所以改为 SM2 加密来加密过程数据

- 优化消息传递服务
  - 可以直接发送实时消息，这个是可控制的，细节到可以控制每条消息是否需要缓存

- 新增一些通用的消息接口
  - 比如 WebSocket 调用接口，在各个模块可以直接使用消息服务来调用 WebSocket 接口与前端实时通信
  - Kafka 接口等
