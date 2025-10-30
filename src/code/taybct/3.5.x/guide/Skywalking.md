---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 接入 Skywalking
# 当前页面内容描述
description: 接入 Skywalking
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
order: 14
dir:
  order: 14
# 页面图标
icon: "vaadin:cluster"
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

# 接入 Skywalking

::: info
Skywalking：链路追踪
:::

## 下载



[Downloads | Apache SkyWalking](https://skywalking.apache.org/downloads/)

下载 SkyWalking APM 9.1.0 （服务端）Java Agent 8.11.0（客户端）

## 配置



1. 可以修改存储方式为 mysql ，或者是 Elasticsearch，我这里修改为 mysql

   apache-skywalking-apm-bin/config/application.yml

```yaml
storage:
  selector: ${SW_STORAGE:mysql}
  mysql:
    properties:
      jdbcUrl: ${SW_JDBC_URL:"jdbc:mysql://localhost:3306/skywalking?rewriteBatchedStatements=true&useSSL=false&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&tinyInt1isBit=false&allowMultiQueries=true&serverTimezone=GMT%2B8"}
      dataSource.user: ${SW_DATA_SOURCE_USER:root}
      dataSource.password: ${SW_DATA_SOURCE_PASSWORD:password}
      dataSource.cachePrepStmts: ${SW_DATA_SOURCE_CACHE_PREP_STMTS:true}
      dataSource.prepStmtCacheSize: ${SW_DATA_SOURCE_PREP_STMT_CACHE_SQL_SIZE:250}
      dataSource.prepStmtCacheSqlLimit: ${SW_DATA_SOURCE_PREP_STMT_CACHE_SQL_LIMIT:2048}
      dataSource.useServerPrepStmts: ${SW_DATA_SOURCE_USE_SERVER_PREP_STMTS:true}
    metadataQueryMaxSize: ${SW_STORAGE_MYSQL_QUERY_MAX_SIZE:5000}
    maxSizeOfBatchSql: ${SW_STORAGE_MAX_SIZE_OF_BATCH_SQL:2000}
    asyncBatchPersistentPoolSize: ${SW_STORAGE_ASYNC_BATCH_PERSISTENT_POOL_SIZE:4}
```

​	然后把 mysql 的 jdbc 驱动（mysql-connector-java-x.x.x.jar）放到 apache-skywalking-apm-bin/oap-libs 目录下

2. 修改默认的 UI 端口（默认是 8080，会与一些应用冲突，我这里修改为 8888）

   apache-skywalking-apm-bin/webapp/webapp.yml

   ```yaml
   server:
     port: 8888
   ```

   

## 运行



apache-skywalking-apm-bin/bin/startup.sh



## 客户端配置



在 java 应用启动命令里面添加，即 IDEA 里面的 VM 参数



```bash
-javaagent:D:/dev/tools/apache-skywalking-apm-9.1.0/apache-skywalking-apm-bin/agent/skywalking-agent.jar # 这个是 agent jar 包的路径
-Dskywalking.agent.service_name=module-system # 你要注册到 skywalking 里面的服务名称，这个只是为了告诉你自己是哪个应用程序
-Dskywalking.collector.backend_service=127.0.0.1:11800 # 这个是 skywalking oap 的入口，端口默认是 11800
```



## 日志收集



这里使用的是 logback:

1. 添加 maven 依赖

   ```xml
           <dependency>
               <groupId>org.apache.skywalking</groupId>
               <artifactId>apm-toolkit-logback-1.x</artifactId>
               <version>${skywalking-logback.version}</version>
           </dependency>
   ```

   

2. 配置 logback-spring.xml

   ```xml
       <appender name="grpc-log" class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.log.GRPCLogClientAppender">
           <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
               <layout class="org.apache.skywalking.apm.toolkit.log.logback.v1.x.mdc.TraceIdMDCPatternLogbackLayout">
                   <Pattern>%d{HH:mm:ss.SSS} [%X{tid}] [%thread] %-5level %logger{50} - [%method,%line] -%msg%n</Pattern>
               </layout>
           </encoder>
       </appender>
   ```