---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: ApiLog
# 当前页面内容描述
description: ApiLog
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
order: 1
dir:
  order: 1
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

# ApiLog

接口日志记录注解

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| title | String | 否 | "" | 模块名 |
| description | String | 否 | "" | 模块描述 |
| type | String | 否 | OperateType.OTHER | 操作类型，这个操作类型完全可以自定义是些什么类型，也就是用来过滤区分不同类型的日志 |
| isSaveRequestData | boolean | 否 | true | 是否保存请求的参数 |
| isSaveResultData | boolean | 否 | true | 是否保存返回结果 |

### OperateType

操作类型常量，增删改查这些

## 使用说明

这个注解依赖日志模块和内部消息功能，使用了这个注解之前需要确保日志功能是否有被开启来，可能需要配置`IMessageSendHandler`(内部消息处理器)，或者配置`IMessageSendService`(内部消息发送服务)

当然，如果不配置这些，框架也是已经有自带的默认可以使用的，只需要在依赖里面加入`RabbitMQ`的依赖就可以了

[RabbitMQ 安装](/ware/soft/rabbitmq.html)

::: details RabbitMQ 依赖

```xml
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-amqp</artifactId>
      </dependency>
```

:::

这样就还得再配置`RabbitMQ`

::: details RabbitMQ yaml 配置

```yaml
spring:
  # mq 配置
  rabbitmq:
    listener:
      simple:
        # 手动应答
        acknowledge-mode: manual
        # 消费端最小并发数
        concurrency: 5
        # 消费端最大并发数
        max-concurrency: 10
        # 一次请求中预处理的消息数量
        prefetch: 5
    cache:
      channel:
        # 缓存的channel数量
        size: 50
    host: 127.0.0.1
    port: 5672
    username: admin
    password: admin
    virtual-host: taybct
    publisher-confirm-type: CORRELATED
    publisher-returns: true
```

:::
