---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 流程引擎
# 当前页面内容描述
description: 流程引擎
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
order: 22
dir:
  order: 22
# 页面图标
icon: "hugeicons:flow"
# 是否原创
isOriginal: false
# 日期
date: 2025-09-29
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
  - OnlyOffice
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 流程引擎 

::: info
从 <Badge text="3.2.4" type="tip" /> 版本开始，对之前一直没用起来的基于[滴滴开源 LogicFlow](https://site.logic-flow.cn)适配的流程引擎做了大量的优化，现在已经可以满足基本的流程使用，`LogicFlow` 拥有许多自定义的配置，可以满足大部分的流程使用场景，但是这些还是需要在项目开发过程中做一些相应的适配，比如，一些特定的需求，需要写自定义的一些逻辑，就需要注入一些`Bean`去做处理
:::

## 使用说明

### 1. 单体架构

[::mdi:github::参考代码](https://github.com/taybct/spring-taybct-single/tree/3.2.x/) [::simple-icons:gitee::参考代码](https://gitee.com/taybct/spring-taybct-single/tree/3.2.x/)

- 引入依赖

```xml
<!--流程管理-->
<dependency>
    <groupId>io.github.mangocrisp</groupId>
    <artifactId>module-lf</artifactId>
</dependency>
```

### 2. 微服务版本

[::mdi:github::参考代码](https://github.com/taybct/spring-taybct-single/tree/3.2.x/modules/module-lf/) [::simple-icons:gitee::参考代码](https://gitee.com/taybct/spring-taybct-cloud/tree/3.2.x/modules/module-lf/)

- 配置：
```yaml
# swagger 接口文档
swagger:
  title: 流程中心
# Spring
spring:
  main:
    #springCloud 的2.1.0以上版本的，将不再默认支持 FeignClient 的name属性 的相同名字。
    #即 ：多个接口上的@FeignClient(“相同服务名”)会报错，overriding is disabled(覆盖 是 禁止的/关闭的)。
    allow-bean-definition-overriding: true
  application:
    # 应用名称
    name: module-lf
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
          - data-id: ${taybct.config-prefix}-datasource.${spring.cloud.nacos.config.file-extension}      # 数据源
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-mybatis.${spring.cloud.nacos.config.file-extension}     # mybatis-plus 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-swagger.${spring.cloud.nacos.config.file-extension}     # swagger 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-data-scope.${spring.cloud.nacos.config.file-extension}     # data scope 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
          - data-id: ${taybct.config-prefix}-mq.${spring.cloud.nacos.config.file-extension}     # rabbit mq 配置
            group: ${spring.cloud.nacos.config.group}
            refresh: true
taybct:
  config-prefix: taybct
  ```

- 启动`module-lf`模块

- 配置网关

```yaml
spring:
  cloud:
    gatewayL:
      routes:
        # 流程中心
        - id: module-lf
          uri: lb://module-lf
          predicates:
            - Path=/lf/**
          filters:
            - StripPrefix=1
```

::: tip 版本兼容性
3.5.x 以后的版本需要修配置
详见：[配置更新](/code/taybct/release/3.5.0-beta.1.html#配置更新)
:::

### 3. 核心代码

- 流程步骤处理 [::mdi:github::](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-lf/src/main/java/io/github/taybct/module/lf/service/impl/ProcessServiceImpl.java#L268-L446)[::simple-icons:gitee::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-lf/src/main/java/io/github/taybct/module/lf/util/ProcessUtil.java#L268-L446)

- 自动判断和自定义处理[::mdi:github::](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-lf/src/main/java/io/github/taybct/module/lf/util/ProcessUtil.java#L45-L113)[::simple-icons:gitee::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-lf/src/main/java/io/github/taybct/module/lf/util/ProcessUtil.java#L45-L113)

### 4. 演示

[流程引擎](https://mangocrisp.top/pureadmin/#/lf/design)（首次加载需要下载资源有点慢，需要耐心等待加载 😓）

::: tip
演示使用到的表单设计器是 [FcDesigner](https://view.form-create.com/) 和 [FormCreate](https://www.form-create.com/v3/)
:::


### 5. 参考

[LogicFlow 教程](https://site.logic-flow.cn/tutorial/get-started)