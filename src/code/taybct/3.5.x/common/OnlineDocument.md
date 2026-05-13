---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 在线文档
# 当前页面内容描述
description: 在线文档
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
icon: "line-md:document-report"
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

# 在线文档 

::: info
从 <Badge text="3.2.4" type="tip" /> 版本开始，基于[OnlyOffice](https://www.onlyoffice.com/zh/)开发了在线文档功能
:::

## 使用说明

### 1. 单体架构

[::mdi:github::参考代码](https://github.com/taybct/spring-taybct-single/tree/main/spring-taybct-modules/spring-taybct-module-online-doc) [::simple-icons:gitee::参考代码](https://gitee.com/taybct/spring-taybct-single/tree/main/spring-taybct-modules/spring-taybct-module-online-doc)

- 引入依赖

```xml
<dependency>
    <groupId>io.github.mangocrisp</groupId>
    <artifactId>spring-taybct-module-online-doc</artifactId>
</dependency>
```

- 相关依赖

```xml
<!--文件管理-->
<dependency>
    <groupId>io.github.mangocrisp</groupId>
    <artifactId>admin-file</artifactId>
</dependency>
```

- 配置请求前缀

```yaml
taybct:
  serve:
    taybct-online-doc:
      context-path: "/online-doc/"
```


### 2. 微服务版本

[::mdi:github::参考代码](https://github.com/taybct/spring-taybct-cloud/tree/main/spring-taybct-modules/spring-taybct-module-online-doc/) [::simple-icons:gitee::参考代码](https://gitee.com/taybct/spring-taybct-cloud/tree/main/spring-taybct-modules/spring-taybct-module-online-doc)

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
    name: module-online-doc
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
          - data-id: ${taybct.config-prefix}-file.${spring.cloud.nacos.config.file-extension}     # OnlyOffice 文档文件支持
            group: ${spring.cloud.nacos.config.group}
            refresh: true
  taybct:
    config-prefix: taybct
  ```

- 启动`module-online-doc`模块

- 配置网关

```yaml
spring:
  cloud:
    gatewayL:
      routes:
        # 在线文档
        - id: module-online-doc
          uri: lb://module-online-doc
          predicates:
            - Path=/online-doc/**
          filters:
            - StripPrefix=1
```

::: tip 版本兼容性
3.5.x 以后的版本需要修配置
详见：[配置更新](../release/3.5.0.html#配置更新)
:::

### 3. 核心代码

- 文件下载 [::mdi:github::](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/controller/OnlineDocControllerRegister.java#L69-L129)[::simple-icons:gitee::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/controller/OnlineDocControllerRegister.java#L69-L129)

- 回调处理[::mdi:github::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/service/impl/OnlineDocServiceImpl.java#L132-L200)[::simple-icons:gitee::](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-online-doc/src/main/java/io/github/taybct/module/od/service/impl/OnlineDocServiceImpl.java#L132-L200)

### 4. 演示

[在线文档](https://8.148.188.198/pureadmin/#/online-doc)
这里因为服务器资源不太够安装OnlyOffice，只能贴出图片演示效果
![1](/assets/images/blog/od1.png)
![2](/assets/images/blog/od2.png)
![3](/assets/images/blog/od3.png)


### 5. 参考

配置，OnlyOffice 的安装教程可以参考[OnlyOffice+VUE3+Java+OSS 实现在线协同编辑文档](/reference/onlyoffice)