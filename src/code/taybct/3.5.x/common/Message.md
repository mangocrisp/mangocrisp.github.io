---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 消息传递服务
# 当前页面内容描述
description: 消息传递服务
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
order: 7
dir:
  order: 7
# 页面图标
icon: "svg-spinners:bars-scale"
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
  - Kafka
  - RabbitMQ
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 消息传递服务

除了已经集成的 [RPC 框架](https://cn.bing.com/search?pglt=425&q=RPC%E6%A1%86%E6%9E%B6)（[Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign)、[Apache Dubbo](https://cn.dubbo.apache.org/)）之外，也提供了消息队列的解决方案，比如 Kafka、RabbitMQ 等。

::: info

1. [Kafka](https://kafka.apache.org/) 是一个开源的流处理平台，用于构建可扩展、高可用、高吞吐的流处理平台。
2. [RabbitMQ](https://www.rabbitmq.com/) 是一个开源的 AMQP 消息队列，用于构建可扩展、高可用、高吞吐的流处理平台。
:::

当然，这些都只是传递消息的方式，框架这边进行了封装整合，提供了统一的接口，方便使用。

## IMessageSendService

使用框架提供的消息发送服务，可以发送消息。详见：[接口文档](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/message/IMessageSendService.html)

## IMessageSendHandler

可以支持任意能够发送消息处理器，通过实现该接口，可以自定义消息发送处理器。

### 已经集成的处理器

- 分布式任务调度日志记录处理器：ScheduledLogSendMQHandler

[::mdi:github:: ScheduledLogSendMQHandler.java](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-common/src/main/java/io/github/taybct/common/message/cheduledlog/ScheduledLogSendMQHandler.java)
[::simple-icons:gitee:: ScheduledLogSendMQHandler.java](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-common/src/main/java/io/github/taybct/common/message/cheduledlog/ScheduledLogSendMQHandler.java)

- 文件关联记录处理器：SysFileLinkSendMQHandler

[::mdi:github:: SysFileLinkSendMQHandler.java](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-common/src/main/java/io/github/taybct/common/message/sysfile/SysFileLinkSendMQHandler.java)
[::simple-icons:gitee:: SysFileLinkSendMQHandler.java](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-common/src/main/java/io/github/taybct/common/message/sysfile/SysFileLinkSendMQHandler.java)

::: note
以上供参考，可自定义实现。
:::
