---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: spring boot 运行环境
# 当前页面内容描述
description: spring boot 运行环境
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
order: 4
dir:
  order: 4
# 页面图标
icon: "simple-icons:springboot"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-02
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

# spring boot 运行环境

我们开发项目时，一般会有如下三种环境：

1. 开发环境
2. 测试环境
3. 生产环境

每个模块，一般是建议使用固定的端口，那这样，不同的环境又要修改这些端口，可以在代码里事先就配置好，不仅端口，还有一些别的配置，需要不同的环境有差异，都可以配置好

```bash
.
|-- java
`-- resources
    |-- application-dev.yml
    |-- application-prod.yml
    |-- application-test.yml
    `-- bootstrap.yml
```

::: details application-dev.yml
```yaml
# Server
server:
  port: 8102
dubbo:
  protocol:
    # 固定 Dubbo 端口
    port: 28102
  application:
    # Dubbo的在线运维命令端口
    qos-port: 38102
```
:::

::: details application-prod.yml
```yaml
# Server
server:
  port: 8102
dubbo:
  protocol:
    # 固定 Dubbo 端口
    port: 28102
  application:
    # Dubbo的在线运维命令端口
    qos-port: 38102
```
:::

::: details application-test.yml
```yaml
# Server
server:
  port: 18102
dubbo:
  protocol:
    # 固定 Dubbo 端口
    port: 48102
  application:
    # Dubbo的在线运维命令端口
    qos-port: 58102
```
:::

::: details bootstrap.yml
```yaml
spring:
  profiles:
    active: dev
```
:::

::: tip
这样就是可以在 `bootstrap.yml`、`application.yml`、`application.porperties` 等配置文件里面来设置是使用什么环境了，也可以在启动的时候在启动参数里面设置：`--spring.profiles.active=test`
:::
