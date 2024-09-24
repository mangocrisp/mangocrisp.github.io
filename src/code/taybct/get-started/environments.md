---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 环境准备
# 当前页面内容描述
description: 项目运行需要的环境
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
icon: "carbon:ibm-z-environments-dev-sec-ops"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-22
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
  - 环境准备
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 环境准备

## 编译器

<VPCard
  title="IntelliJ IDEA"
  desc="The Leading Java and Kotlin IDE,The IDE that makes development a more productive and enjoyable experience"
  logo="/assets/images/blog/icons8-intellij-idea.svg"
  link="https://www.jetbrains.com/idea/"
/>

<VPCard
  title="Eclipse IDE"
  desc="The Leading Open Platform for Professional Developers"
  logo="https://www.eclipse.org/downloads/assets/public/images/logo-eclipse.png"
  link="https://eclipseide.org/"
/>

我这里是使用的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)，这个要看个人喜好来决定

## JDK

::: info
JDK 目前有 [Oracle JDK](https://www.oracle.com/cn/java/technologies/downloads/archive/) 和 [Open JDK](https://openjdk.org/install/)，两者的区别网上很多介绍的这里就不赘述
:::

本项目**重度**依赖 [Spring Boot](https://spring.io/guides/gs/spring-boot)，所以基于 Spring Boot 的依赖的特点，即：Spring Boot 3.0.x 以后的版本只支持 Java 17 或者以上版本，而 Spring Boot 2.x 的最后一个大版本也是支持 Java 8 的版本是 Spring Boot 2.7.x

综合以上所述，本项目目前大致分为了两个大版本:

1. 基于 Spring Boot 3.2.x 开发的 3.2.x 版本
2. 基于 Spring Boot 2.7.x 开发的 2.7.x 版本

所以如何选择项目版本，取决于项目开发真实所需，请谨慎选择，毕竟是最`底层`的东西

1. 3.2.x 版本要求 JDK >= 17.0.5
2. 2.7.x 版本要求 JDK >= 8.202

::: warning
注意 [JDK 8u202](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html) 版本是 Oracle JDK8 的最后一个免费商用的版本，请谨慎选择使用的版本
:::

::: warning
Oracle JDK 17 是 Oracle 开始免费商用的版本，但是目前只有 3 年的免费时间，后面也不知道怎么收费，或者你可以选择使用 Open JDK 17 也是可以的
:::

::: info
你可以在[这儿](https://developers.redhat.com/products/openjdk/download)下载`免费`的 Open JDK
:::

## Maven（必须）

本项目是使用 Maven 做 Jar 包依赖管理的，所以你得下载并配置好你的 Maven 环境，这很<Badge text="重要" type="warning"/>，本文只讲述`IntelliJ IDEA`配置 Maven

### 下载

下载版本也是有要求的，一般是与`IntelliJ IDEA`有关，旧的`IntelliJ IDEA`只能用旧的 Maven，所以推荐都下载[最新版本](https://maven.apache.org/download.cgi)，省时省力

### Maven 配置

怎么下载，下载下来后怎么解压这些就不说明了，都是老司机了，找个文件夹解压就行了，然后这里直接贴上我的配置，可以直接照着`CV`：

::: details settings.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">		  
  <!-- 注意这里的这个地址，确保你的电脑有 D 盘，如果没有 D盘，就要修改一下配置 -->
  <localRepository>D:/data/maven/repo</localRepository>
	<!--maven 默认仓库的搜索顺序如下：
    本地仓库 -> settings>profiles>repo
    -> pom>profile>repo
    -> pom>repo
    -> settings>mirror
    -> central
    -->
  <pluginGroups>
    <pluginGroup>org.sonatype.plugins</pluginGroup>
  </pluginGroups>
  <mirrors>  	
	<!--Maven 中央仓库配置-->
	<!--还需要在 IDEA 里面配置 -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true-->
	<mirror>
		<id>central-repos1</id>
		<name>Central Repository 2</name>
		<mirrorOf>central</mirrorOf>
		<url>https://repo1.maven.org/maven2/</url>
	</mirror>
	<!--阿里云配置-->	
	<mirror>
		<id>aliyunmaven-public</id>
		<name>aliyun google maven repo</name>
        <mirrorOf>*</mirrorOf>
		<url>https://maven.aliyun.com/repository/public</url>
    </mirror>	
  </mirrors>
  <profiles>
	<profile>
		<id>dev</id>
		<repositories>		
			<!--中央仓库配置-->
			<repository>
			  <id>central</id>
			  <url>https://repo1.maven.org/maven2</url>
			  <releases><enabled>true</enabled></releases>
			  <snapshots><enabled>true</enabled></snapshots>
			</repository>
		</repositories>
		<pluginRepositories>	
			<pluginRepository>
				<id>alimaven-plugin</id>
				<url>https://maven.aliyun.com/repository/public</url>
				<layout>default</layout>
				<!-- 是否开启 release 版构件下载 -->
				<releases>
					<enabled>true</enabled>
				</releases>
				<!-- 是否开启 snapshot 版构件下载 -->
				<snapshots>
					<enabled>true</enabled>
				</snapshots>
			</pluginRepository>			
			<pluginRepository>
			  <id>central</id>
			  <url>http://repo2.maven.org/maven2</url>  
			  <releases><enabled>true</enabled></releases>
			  <snapshots><enabled>true</enabled></snapshots>
			</pluginRepository>
    	</pluginRepositories>
    </profile>
  </profiles>  
  <activeProfiles>
	<activeProfile>dev</activeProfile>
  </activeProfiles>  
</settings>
```
:::

::: danger
看清里面的配置，确保你的电脑有 D 盘，如果没有 D盘，就要修改一下配置
:::

### 默认配置

因为`IntelliJ IDEA`你如果不配置`settings.xml`的话，他是会去`C:\Users\{user}\.m2`目录下去找`settings.xml`配置，所以这里建议修改完了之后把`settings.xml`往这个目录复制一份

### 环境变量配置

::: tip
没有特别需求，可以选择不配置
:::

1. 添加环境变量
   变量名：`M2_HOME`
   变量值：`Maven 解压安装路径`
2. 往 Path 变量添加
   `%M2_HOME%\bin`
3. 验证
   `Win + R` 输入 `CMD`,打开控制台，输入 `mvn -version`,出现如下：
   ```shell
   Apache Maven 3.8.5 (3599d3414f046de2324203b78ddcf9b5e4388aa0)
   Maven home: D:\dev\environment\apache-maven-3.8.5
   Java version: 17.0.5, vendor: Oracle Corporation, runtime: D:\dev\environment\jdk\jdk-17.0.5
   Default locale: zh_CN, platform encoding: GBK
   OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"
   ```
   表示成功了

### IntelliJ IDEA 配置

`Settings` > `Build, Execution, Deployment` > `Build Tools` > `Maven`

![IntelliJ IDEA 配置](/assets/images/blog/IntelliJIDEAsettingsmaven.png)

::: warning
配置自己的 Maven 安装路径
:::

## 数据库（必须）

使用数据库管理数据

- 多数据库兼容，目前有市面上主流的三种：MySQL、PostgresqlSQL、Oracle
- 主从数据库配置
- 其他数据库功能

### 下载安装

项目兼容了多数据源

<VPCard
  title="MySQL"
  desc="The world's most popular open source database"
  logo="https://labs.mysql.com/common/logos/mysql-logo.svg?v2"
  link="https://www.mysql.com/cn/"
/>

<VPCard
  title="PostgreSQL"
  desc="The World's Most Advanced Open Source Relational Database"
  logo="https://www.postgresql.org/media/img/about/press/elephant.png"
  link="https://www.postgresql.org/"
/>

<VPCard
  title="Oracle"
  desc="Data is the fuel AI needs. Oracle Database 23ai brings AI to your data, making it simple to power app development, and mission critical workloads with AI"
  logo="https://labs.mysql.com/common/logos/oracle-logo-new.svg"
  link="https://www.oracle.com/cn/database/"
/>

篇幅太长，安装步骤就略过了...

### 简单配置

::: details datasource.yml

```yaml
#在同一个方法中切换数据源
#DynamicDataSourceContextHolder.push("slave");//slave即数据源名称
#//中间执行你的业务sql
#DynamicDataSourceContextHolder.clear();
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    # 如果 druid 用不了，就注释掉
    type: com.alibaba.druid.pool.DruidDataSource
    dynamic:
      # primary: pgsql-db #设置默认的数据源或者数据源组,默认值即为 master
      # strict: false #设置严格模式,默认false不启动. 启动后在未匹配到指定数据源时候会抛出异常,不启动则使用默认数据源. &dummyparam=
      primary: pgsql-db
      #开启seata代理，开启后默认每个数据源都代理，如果某个不需要代理可单独关闭,默认是开启的
      seata: false
      datasource:
        pgsql-db:
          url: ENC(aRmwlIOapr1zFjnz8iRqrrrJ32XDnR+CwqOZ7HqUJ8guHBuSKqFdWrUN8Kz/7zQPriqCXVtzdZ8TIShBKqA0Hg==)
          username: ENC(Smbqgvm80ONf1sfGBTMaXQ==)
          password: ENC(tXQCyQGyo2zl1biJI49++w==)
          driver-class-name: ENC(wbMMkX+M4V5pdIodPp3HoP3Y7i5ytYCFsP2q45sEZgo=)
        # mysql-db:
        #   url: jdbc:mysql://127.0.0.1:3306/taybct?useSSL=false&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&tinyInt1isBit=false&allowMultiQueries=true&serverTimezone=GMT%2B8
        #   username: root
        #   password: password
        #   driver-class-name: com.mysql.cj.jdbc.Driver
        # oracle-db:
        #   url: jdbc:oracle:thin:@127.0.0.1:1521:ORCL
        #   username: TAYBCT
        #   password: password
        #   driver-class-name: oracle.jdbc.driver.OracleDriver
    # 如果 指定 hikari 数据库连接池
    #type: com.zaxxer.hikari.HikariDataSource
    hikari:
      # 最大连接数
      maximum-pool-size: 10
      # 最小空闲数
      minimum-idle: 5
      # 获取连接超时时间； 默认30s
      connection-timeout: 20000
      # 连接池名称
      pool-name: pool-hikari
      # 空闲超时时间；默认是十分钟；空闲时间超过设定时间则会被回收
      idle-timeout: 600000
      # 是否自动提交
      auto-commit: true
      # 最大存活时间，默认30分钟
      max-lifetime: 1800000
      # connection-test-query: SELECT 1  # 连接数据库后测试语句
      validation-timeout: 1000
      # 设置模式，例如 postgresql 有模式这个概念
      # schema:
    druid:
      # druid 监控页面入口控制
      stat-view-servlet:
        enabled: true
        # ip黑名单，禁止访问的地址 优先级高于白名单
        #deny: x.x.x.x
        # druid 监控页面登录账号
        login-username: druid
        # druid 监控页面登录密码
        login-password: 123654
        # 监控页面访问路径配置
        url-pattern: /druid/*
        # 是否能够重置数据
        reset-enable: true
        #IP白名单 没有配置或者为空 则允许所有访问 只有当前名单中的ip才能访问 1/27表示ip前27位相同即可
        #allow: 10.18.80.0/24
        #IP黑名单 若白名单也存在 则优先使用
        #deny:
      #初始化时建立物理连接的个数
      initial-size: 10
      # 连接池最小空闲数
      min-idle: 10
      # 最大连接池数量
      max-active: 100
      # 连接时最大等待时间（单位：毫秒）
      max-wait: 60000
      # 1.2.12 新增属性 执行超时时间，默认是 10 秒，执行语句超过 10秒就会报错
      connect-timeout: 20000
      # 同上
      socket-timeout: 20000
      # 申请连接的时候检测，如果空闲时间大于 timeBetweenEvictionRunsMillis，执行 validationQuery 检测连接是否有效。
      test-while-idle: true
      # 既作为检测的间隔时间又作为 test-while-idle 执行的依据
      time-between-eviction-runs-millis: 20000
      # 销毁线程时检测当前连接的最后活动时间和当前时间差大于该值时，关闭当前连接
      min-evictable-idle-time-millis: 30000
      # 用来检测连接是否有效的sql
      # mysql中为 select 'x'
      # oracle中为 select 1 from dual
      validation-query: SELECT 'x'
      # 检测连接是否有效的超时时间
      validation-query-timeout: 1
      # 申请连接时会执行 validationQuery 检测连接是否有效,开启会降低性能,默认为true
      test-on-borrow: false
      # 归还连接时会执行 validationQuery 检测连接是否有效,开启会降低性能,默认为true
      test-on-return: false
      # 当数据库抛出不可恢复的异常时,抛弃该连接
      exception-sorter: true
      # 是否开启PSCache，即是否缓存preparedStatement（提升写入、查询效率）
      # 是否缓存 preparedStatement,mysql5.5+建议开启 建议在支持游标的数据库开启，例如：Oracle
      pool-prepared-statements: true
      # 每个连接上PSCache的最大值
      # 如果大于0，pool-prepared-statements自动开启
      max-pool-prepared-statement-per-connection-size: 20
      #通过connectProperties属性来打开mergeSql功能；慢SQL记录
      connection-properties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
      # 合并多个 DruidDataSource 的监控数据
      use-global-data-source-stat: true
      #filters通过别名的方式配置扩展插件，常用的插件有：
      #监控统计用的filter:stat 日志用的filter:log4j 防御sql注入的filter:wall
      filters: stat,wall,slf4j
      filter:
        config:
          # 开启密钥加密
          enabled: true
        # SQL监控配置
        stat:
          enabled: true
          # 慢SQL记录
          log-slow-sql: true
          slow-sql-millis: 1000
          merge-sql: false
        # SQL防火墙配置
        wall:
          config:
            multi-statement-allow: true
      # web应用 监控配置
      web-stat-filter:
        # 配置统计页面过滤
        enabled: true
        # 能够监控单个url调用的sql列表
        profile-enable: true
        # 监控路径控制
        url-pattern: /*
        # 不拦截的路径
        exclusions: '.js,*.gif,*.jpg,*.bmp,*.png,*.css,*.ico,/druid/*'
        # 开启session统计
        session-stat-enable: true
        # session统计的最大个数
        session-stat-max-count: 100
        # Spring 监控路径
      aop-patterns: io.github.mangocrisp.spring.taybct.*.service.*
```

:::

::: info **ENC()**
这里使用了 SM4 国密对称加密数据连接信息，可以很有效的防止密码明文显示在配置文件里面
:::

## Redis（必须）

使用 Redis 做缓存管理

- 权限过滤
- 系统参数
- 系统字典
- 分布式锁
- 其他缓存操作

### 下载安装

<VPCard
  title="Redis"
  desc="Get the world’s fastest in-memory database from the ones who built it."
  logo="https://redis.io/wp-content/uploads/2024/04/Logotype.svg"
  link="/ware/soft/redis"
/>

### 简单配置

::: details redis.yml（2.7.x）

```yaml
spring:
  redis:
    ##redis 单机环境配置
    # Redis服务器地址
    host: 127.0.0.1
    # Redis服务器连接端口
    port: 6379
    # Redis服务器连接密码（默认为空）
    #password: password
    # Redis数据库索引（默认为0）
    database: 5
    # 安全
    ssl: false
    # 连接超时时间（毫秒）
    timeout: 5000
    # 线程安全池
    lettuce:
      pool:
        # 连接池最大连接数(使用负值表示没有限制) 默认为8
        max-active: 8
        # 连接池最大阻塞等待时间（使用负值表示没有限制）
        max-wait: 5000
        # 连接池中的最大空闲连接
        max-idle: 8
#    # 集群
#    cluster:
#     nodes:
#       - 10.18.80.14:6379
#       - 10.18.80.14:6380
#       - 10.18.80.14:6381
#       - 10.18.80.14:6382
#       - 10.18.80.14:6383
#       - 10.18.80.14:6384
#       # 哨兵
#    sentinel:
#      master: taybct
#      password: taybct2021
#      nodes: 192.168.0.10:36379,192.168.0.11:36380,192.168.0.12:36381,192.168.0.13:36382
#  session:
#    # 设置session保存为默认redis的方式
#    store-type: redis
#    redis:
#      # 命名空间
#      namespace: taybct
```

:::

::: details redis.yml（3.2.x）

```yaml
spring:
  data:
    redis:
      ##redis 单机环境配置
      # Redis服务器地址
      host: 127.0.0.1
      # Redis服务器连接端口
      port: 6379
      # Redis服务器连接密码（默认为空）
      #password: password
      # Redis数据库索引（默认为0）
      database: 5
      # 安全
      ssl:
        enabled: false
      # 连接超时时间（毫秒）
      timeout: 5000
      # 线程安全池
      lettuce:
        pool:
          # 连接池最大连接数(使用负值表示没有限制) 默认为8
          max-active: 8
          # 连接池最大阻塞等待时间（使用负值表示没有限制）
          max-wait: 5000
          # 连接池中的最大空闲连接
          max-idle: 8
#         # 集群
#         cluster:
#           nodes:
#             - 10.18.80.14:6379
#             - 10.18.80.14:6380
#             - 10.18.80.14:6381
#             - 10.18.80.14:6382
#             - 10.18.80.14:6383
#             - 10.18.80.14:6384
#         # 哨兵
#        sentinel:
#          master: taybct
#          password: taybct2021
#          nodes: 192.168.0.10:36379,192.168.0.11:36380,192.168.0.12:36381,192.168.0.13:36382
#    session:
#      # 设置session保存为默认redis的方式
#      store-type: redis
#      redis:
#        # 命名空间
#        namespace: taybct
```

:::

## Rabbit MQ（可选）

使用 RabbitMQ 做内部消息队列管理

- 延迟消息
- 分布式日志
- 第三方对接
- 其他队列功能

### 下载安装

<VPCard
  title="Rabbit MQ"
  desc="One broker to queue them all"
  logo="https://www.rabbitmq.com/img/rabbitmq-logo.svg"
  link="/ware/soft/rabbitmq"
/>

### 简单配置

::: details mq.yml

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
