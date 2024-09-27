---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 项目配置
# 当前页面内容描述
description: 项目配置
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
order: 3
dir:
  order: 3
# 页面图标
icon: "mynaui:config"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-27
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 快速开始
  - 项目配置
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 项目配置

## Single

单体架构的配置就比较直接，全都放在了`run/src/main/resources/`目录下了

::: details bootstrap.yml

```yaml
# 应用版本号
application:
  version: 3.2.0-alpha.1
#服务器配置
server:
  undertow:
    threads:
      # 设置IO线程数, 它主要执行非阻塞的任务,它们会负责多个连接, 默认设置每个CPU核心一个线程
      io: 4
      # 阻塞任务线程池, 当执行类似servlet请求阻塞操作, undertow会从这个线程池中取得线程,它的值设置取决于系统的负载
      worker: 20
    # 以下的配置会影响buffer,这些buffer会用于服务器连接的IO操作,有点类似netty的池化内存管理
    buffer-size: 1024
    # 是否分配的直接内存
    direct-buffers: true
  compression:
    # 是否开启压缩 开了全局就不要开fegin的压缩请求 互斥
    enabled: true
    # 配置支持压缩的 MIME TYPE
    mime-types: text/html,text/xml,text/plain,application/xml,application/json
  port: 9102
  servlet:
    context-path: /
# Spring
spring:
  main:
    #springCloud 的2.1.0以上版本的，将不再默认支持 FeignClient 的name属性 的相同名字。
    #即 ：多个接口上的@FeignClient(“相同服务名”)会报错，overriding is disabled(覆盖 是 禁止的/关闭的)。
    allow-bean-definition-overriding: true
  application:
    # 应用名称
    name: spring-taybct-single
  profiles:
    # 环境配置
    active: dev
    include:
      - datasource
      - es
      - file
      - global-exception
      - taybct
      - mq
      - mybatis
      - prop
      - redis
      - swagger
      - data-scope
      - scheduled-tasks
  servlet:
    multipart:
      max-file-size: 10MB        # 设置单个文件最大大小为10MB
      max-request-size: 100MB    # 设置多个文件大小为100MB
# 日志文件
logging:
  file:
    name: logs/${spring.application.name}/info.log
#  level:
#    io.github.mangocrisp.spring.taybct.auth: DEBUG
#    org.springframework.security: DEBUG
#    org.springframework.jdbc.core: DEBUG
```

:::

通过`bootstrap.yml`里面`spring.profiles.include`来加入其他的相关的配置

::: info spring.profiles.include
加载 `bootstrap.yml`或者`application.yml`同级目录下的`application-xxx.yml`里面的配置,`xxx`就是配置在`spring.profiles.include`里面的数组里面的每个值，例如 `redis` 就是`application-redis.yml`
:::

[application.yml 和 bootstrap.yml的区别](https://cn.bing.com/search?pglt=169&q=bootstrap.yml+%E5%92%8C+application.yml+%E7%9A%84%E5%8C%BA%E5%88%AB&cvid=e8b9c58a997c4a2c9ff8327806dd6f58&gs_lcrp=EgZjaHJvbWUqBggAEAAYQDIGCAAQABhAMgYIARAAGEAyBggCEAAYQDIGCAMQABhAMgYIBBAAGEAyBggFEAAYQNIBBzM4N2owajGoAgCwAgA&FORM=ANNTA1&adppc=EdgeStart&PC=CNNDDB)

## Cloud

微服务的配置，使用的是 [Nacos](/code/taybct/get-started/environments.html#nacos-cloud-必须) 作为配置中心，所以你需要

### 1. 配置本地的`bootstrap.yml`

本地配置的一般是不会做修改的固定配置

::: details 示例 module-system 的 bootstrap.yml

```yaml
# 服务器配置
server:
  port: 8101
# Spring
spring:
  main:
    #springCloud 的2.1.0以上版本的，将不再默认支持 FeignClient 的name属性 的相同名字。
    #即 ：多个接口上的@FeignClient(“相同服务名”)会报错，overriding is disabled(覆盖 是 禁止的/关闭的)。
    allow-bean-definition-overriding: true
  application:
    # 应用名称
    name: module-system
  profiles:
    active: dev
  cloud:
    # 使用 nacos 注册发现和配置
    nacos:
      username: nacos
      password: nacos
      discovery:
        # 服务注册地址
        server-addr: 127.0.0.1:8848
        # 命名空间
        namespace: taybct-3-2-x
        # 配置分组
        group: ${spring.profiles.active}
      config:
        # 服务注册地址
        server-addr: 127.0.0.1:8848
        # 命名空间
        namespace: taybct-3-2-x
        # 配置分组
        group: ${spring.profiles.active}
        # 配置文件格式
        file-extension: yml
        # 共享配置
        shared-configs:
          - data-id: ${taybct.config-prefix}.${spring.cloud.nacos.config.file-extension}      # 基本配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-global-exception.${spring.cloud.nacos.config.file-extension}     # 全局异常配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-swagger.${spring.cloud.nacos.config.file-extension}     # swagger 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-redis.${spring.cloud.nacos.config.file-extension}      # redis 缓存
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-datasource.${spring.cloud.nacos.config.file-extension}      # 数据源
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-mybatis.${spring.cloud.nacos.config.file-extension}     # mybatis-plus 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-mq.${spring.cloud.nacos.config.file-extension}     # rabbit mq 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-dubbo.${spring.cloud.nacos.config.file-extension}     # dubbo 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-data-scope.${spring.cloud.nacos.config.file-extension}     # data-scope 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
taybct:
  config-prefix: taybct
  tenant:
    tenant-tables:
      - sys_role
      - sys_dept
  rsa:
    # resources 目录下的证书
    resource: rsa.jks
    # 生成证书的时候配置的 alias
    alias: rsa
    # 生成证书的时候配置的 密码
    password: taybct
    type:
      LIMITED:
        resource: limited.jks
        alias: limited
        password: limited
        expire-check: true
  scheduled:
    pool-size: 20
    await-termination-seconds: 60
    thread-name-prefix: "Scheduler-"
    wait-for-tasks-to-complete-on-shutdown: true
    tasks:
      clearDirtyData:
        task-key: clearDirtyData
        cron: 0 0/1 * * * ?
        description: "清理权限脏数据"
        auto-start: 1
        sort: 0
      clearExpires:
        task-key: clearExpires
        cron: 0 0/1 * * * ?
        description: "清理登录超时用户"
        auto-start: 1
        sort: 1
      iniPermissionConfig:
        task-key: iniPermissionConfig
        cron: 0 0/1 * * * ?
        description: "初始化权限配置"
        auto-start: 1
        sort: 2
      iniParams:
        task-key: iniParams
        cron: 0 0/1 * * * ?
        description: "初始化参数配置"
        auto-start: 1
        sort: 0
```

:::

### 2. 在配置中心(`Nacos`)动态配置

