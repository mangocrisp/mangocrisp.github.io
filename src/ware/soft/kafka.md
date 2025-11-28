---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Kafka 安装使用（本地单机）
# 当前页面内容描述
description: Kafka 在 windows(10、11)的安装和集成到 Spring Boot 项目中的使用
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
icon: "skill-icons:kafka"
# 是否原创
isOriginal: false
# 日期
date: 2025-11-04
# 类别
category:
  - 软/硬件知识
# 标签
tag:
  - 知识
  - 分享
  - 软件知识
  - 软件安装
  - Ubuntu
  - Kafka
# 页面顶上的图片
# cover: "https://kafka.apache.org/logos/kafka_logo--simple.png"
---

# Kafka 安装使用（本地单机）

> Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications.
> —— [Apache Kafka](https://kafka.apache.org/)

## Ubuntu 安装

如果有 Linux 环境，可以忽略这个步骤。

windows 10 或 11 可以使用 [WSL](https://docs.microsoft.com/zh-cn/windows/wsl/install) 来安装 Kafka。在应用商店中搜索 WSL，安装 WSL。比如安装 [Ubuntu 22.04.5 LTS](https://apps.microsoft.com/detail/9pn20msr04dw?hl=zh-CN&gl=CN)

## JDK 版本支持

Kafka 对 JDK 版本的支持有明确的官方规范，不同 Kafka 版本对 JDK 的兼容性不同，主要与 Kafka 的开发迭代和 JDK 自身的生命周期（如 LTS 版本支持）相关。以下是 Kafka 主要版本与 JDK 版本的对应支持关系（基于官方文档整理，建议结合具体版本的官方说明确认）

### Kafka 版本与 JDK 支持对应表

| Kafka 版本范围  |	支持的 JDK 版本（官方明确支持）  |	说明 |
| --- | --- | --- |
| 2.0.x 及更早 |	JDK 8（推荐）、JDK 7（已过时，不建议） |	早期版本主要支持 JDK 8，JDK 7 虽兼容但已停止维护，存在安全风险。|
| 2.1.x ~ 2.8.x |	JDK 8（主要支持）、JDK 11（实验性支持，3.0 后转为正式支持） |	2.8.x 开始对 JDK 11 提供更好的兼容性，但官方仍以 JDK 8 为主要推荐。 |
| 3.0.x ~ 3.2.x |	JDK 11（推荐）、JDK 8（兼容但逐步弱化支持）|	3.0 起官方推荐 JDK 11，JDK 8 仍可运行，但后续版本可能移除支持。|
| 3.3.x ~ 3.6.x |	JDK 11（推荐）、JDK 17（正式支持）|	3.3 起新增对 JDK 17（LTS）的支持，同时保留对 JDK 11 的支持，JDK 8 不再推荐。|
| 3.7.x 及以后 |	预计主要支持 JDK 11 和 17（可能逐步增加对 JDK 21 的支持）|	跟随 JDK LTS 版本迭代，旧版本 JDK（如 8）可能被彻底移除支持。|

### 关键说明

1. JDK 8 的支持情况：
   Kafka 3.0 之前的版本（如 2.8.x）完全支持 JDK 8，是生产环境的主流选择。
   Kafka 3.0 及之后版本仍可运行在 JDK 8 上，但官方不再推荐，且可能存在部分功能限制（如某些新 API 依赖高版本 JDK）。

2. JDK 11 的地位：
   自 Kafka 3.0 起成为官方推荐版本，是目前（2025 年）最稳定的选择，兼顾兼容性和新特性。
   支持模块化特性，对 Kafka 集群的资源占用和安全性更优。

3. JDK 17 及以上：
   Kafka 3.3 起正式支持 JDK 17（LTS），适合追求更新 Java 特性的场景（如更强的垃圾回收、密封类等）。
   高版本 JDK 可能需要调整 Kafka 的启动参数（如模块权限），但官方已做适配。

## JDK 安装

我这里使用的 Spring 版本是 6.2.11，集成的是 Kafka 是 3.8.1 ，所以安装 JDK 17，安装步骤参考 [JDK 安装](/ware/soft/jdk.html)

## Zookeeper 安装

Zookeeper 是 Kafka 的依赖，这里使用 [ZooKeeper](https://zookeeper.apache.org/)

::: tip
不过 Kafka 3.8.1 已经内置了 ZooKeeper，所以这里不再安装。
:::

## Kafka 安装

### 下载并解压 Kafka

Kafka 官方不提供 Ubuntu 仓库包，需从 Apache 官网下载二进制包。

1. 进入临时目录（如/tmp），下载最新稳定版 Kafka（以3.8.1为例，可替换为官网最新版本）：

```bash
cd /tmp
wget https://dlcdn.apache.org/kafka/3.8.1/kafka_2.13-3.8.1.tgz
```

> （版本说明：kafka_2.13-3.8.1中，2.13是 Scala 版本，3.8.1是 Kafka 版本，可从[Apache Kafka 官网](https://kafka.apache.org/downloads)获取最新链接）


2. 解压到/opt目录（推荐的软件安装路径）:

```bash
sudo tar -xzf kafka_2.13-3.8.1.tgz -C /opt/
```

3. 重命名目录（简化路径）

```bash
sudo mv /opt/kafka_2.13-3.8.1 /opt/kafka
```

## 配置 Kafka 服务

### 配置 Kafka SASL

在 Kafka 中配置 SASL（Simple Authentication and Security Layer）用于认证客户端与 Broker、Broker 之间的通信，常见机制有PLAIN（简单明文，适合内部环境）、SCRAM（加密存储密码，更安全）等.

1. 创建 JAAS 配置文件（核心认证配置）

JAAS（Java Authentication and Authorization Service）是 Java 的认证框架，Kafka 通过 JAAS 文件定义认证规则。

创建kafka_server_jaas.conf文件：

```bash
sudo nano /opt/kafka/config/kafka_server_jaas.conf
```

写入以下内容（定义 Broker 的 SASL 认证规则）：

```ini
KafkaServer {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="admin"  # Broker之间通信的用户名（内部管理用户）
    password="admin-secret"  # 对应密码
    user_admin="admin-secret"  # 定义用户"admin"的密码（与上面保持一致）
    user_alice="alice-secret";  # 新增客户端用户"alice"及密码（生产者/消费者将使用）
};

# 若ZooKeeper也需要SASL认证（可选，建议开启），添加以下配置
Client {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="zk-admin"  # 连接ZooKeeper的用户名
    password="zk-secret";
};
```

::: danger
请务必将上面的 # 的注释去掉，否则配置文件可能将无法生效。
:::

- KafkaServer段：配置 Broker 的 SASL 规则，user_<用户名>格式定义允许访问的用户（如alice是客户端用户）。
- Client段：若 Kafka Broker 连接 ZooKeeper 时需要认证，需配置此段（后续会同步配置 ZooKeeper）。

2. 配置 Broker 的server.properties

修改 Kafka 主配置文件，启用 SASL 并关联 JAAS 文件：

```bash
sudo nano /opt/kafka/config/server.properties
```

添加 / 修改以下参数：

```properties
# 1. 配置监听器（指定SASL认证协议）
# 若需同时支持本地无认证和远程SASL，可配置多个监听器（用逗号分隔）
# 此处仅保留SASL认证的监听器
listeners=SASL_PLAINTEXT://localhost:9092  # 本地访问（若需远程，替换为服务器IP）
advertised.listeners=SASL_PLAINTEXT://localhost:9092  # 对外暴露的地址（远程访问需填服务器IP）

# 2. 启用的SASL机制（此处为PLAIN）
sasl.enabled.mechanisms=PLAIN

# 3. Broker之间通信使用的SASL机制
sasl.mechanism.inter.broker.protocol=PLAIN

# 4. 认证上下文（与JAAS文件中的KafkaServer段对应）
security.inter.broker.protocol=SASL_PLAINTEXT
```

### 配置 ZooKeeper 的 SASL 认证（可选，建议开启）

若 Kafka 依赖 ZooKeeper（传统模式），需同步配置 ZooKeeper 的 SASL，避免未授权访问。

1. 创建 ZooKeeper 的 JAAS 配置文件

```bash
sudo nano /opt/kafka/config/zookeeper_jaas.conf
```

写入以下内容（允许 Kafka Broker 使用zk-admin用户连接）：

```ini
Server {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    user_zk-admin="zk-secret";  # 与Kafka JAAS中Client段的用户名/密码对应
};
```

::: danger
请务必将上面的 # 的注释去掉，否则配置文件可能将无法生效。
:::

2. 配置 ZooKeeper 的zookeeper.properties

```bash
sudo nano /opt/kafka/config/zookeeper.properties
```

添加以下参数启用 SASL：

```properties
# 启用SASL认证
authProvider.1=org.apache.zookeeper.server.auth.SASLAuthenticationProvider
requireClientAuthScheme=sasl
jaasLoginRenew=3600000
```

## 启动 Kafka 服务

启动 Kafka 服务需要先启动 ZooKeeper 服务，Kafka 服务才能正常启动。

### 直接启动

去到 Kafka 的 bin 目录下:

```bash
cd /opt/kafka/bin
```

1. 创建启动脚本(ZooKeeper 服务)：

```bash
sudo nano run-zookeeper.sh
```

添加以下内容：

```bash
export KAFKA_OPTS="-Djava.security.auth.login.config=/opt/kafka/config/zookeeper_jaas.conf"
./zookeeper-server-start.sh -daemon ../config/zookeeper.properties
```

授权脚本：

```bash
sudo chmod 777 run-zookeeper.sh
```

2. 创建启动脚本(Kafka 服务)：

```bash
sudo nano run-kafka.sh
```

添加以下内容：

```bash
export KAFKA_OPTS="-Djava.security.auth.login.config=/opt/kafka/config/kafka_server_jaas.conf"
./kafka-server-start.sh -daemon ../config/server.properties
```

授权脚本：

```bash
sudo chmod 777 run-kafka.sh
```

3. 启动服务：

```bash
# 先启动ZooKeeper服务
./run-zookeeper.sh
# 再启动Kafka服务
./run-kafka.sh
```

4. 验证服务是否启动：

检查进程：

```bash
jps
```

若输出包含QuorumPeerMain（ZooKeeper）和Kafka，则启动成功：

```plaintext
1234 QuorumPeerMain
5555 Kafka
6666 Jps
```

5. 停止服务：

```bash
./kafka-server-stop.sh
./zookeeper-server-stop.sh
```

### 配置自动启动（可选，推荐）

通过systemd设置 Kafka 和 ZooKeeper 开机自启，避免手动启动。

1. 创建 ZooKeeper 服务文件

```bash
sudo nano /etc/systemd/system/zookeeper.service
```

写入以下内容：

```ini
[Unit]
Description=Apache ZooKeeper Service
After=network.target

[Service]
Type=simple
User=root  # 可改为普通用户（需确保目录权限）
ExecStart=/opt/kafka/bin/zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties
Environment="KAFKA_OPTS=-Djava.security.auth.login.config=/opt/kafka/config/zookeeper_jaas.conf"
ExecStop=/opt/kafka/bin/zookeeper-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

2. 创建 Kafka 服务文件

```bash
sudo nano /etc/systemd/system/kafka.service
```

写入以下内容：

```ini
[Unit]
Description=Apache Kafka Service
Requires=zookeeper.service  # 依赖ZooKeeper，先启动ZooKeeper
After=zookeeper.service

[Service]
Type=simple
User=root  # 同上，可改为普通用户
ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
Environment="KAFKA_OPTS=-Djava.security.auth.login.config=/opt/kafka/config/kafka_server_jaas.conf"
ExecStop=/opt/kafka/bin/kafka-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

3. 启用并启动服务

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start zookeeper
sudo systemctl start kafka

# 设置开机自启
sudo systemctl enable zookeeper
sudo systemctl enable kafka
```

4. 查看服务启动状态

```bash
sudo systemctl status zookeeper
sudo systemctl status kafka
```

5. 停止服务

```bash
# 停止Kafka
sudo systemctl stop kafka

# 停止ZooKeeper
sudo systemctl stop zookeeper
```

## Spring Boot 集成 Kafka

### 添加 Maven 依赖

```xml
<!-- Spring Boot Kafka Starter -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

Cut the crap. Show me the code.

### 配置文件

::: details 生产者和消费者可以共享的配置

```yaml
spring:
  kafka:
    # 集群地址（多个用逗号分隔）
    bootstrap-servers: 172.29.230.146:9092
    # 通用配置（生产者和消费者共享）
    properties:
      # SASL认证配置
      sasl:
        mechanism: PLAIN
        jaas:
          config: org.apache.kafka.common.security.plain.PlainLoginModule required username="admin" password="admin-secret";
      security:
        protocol: SASL_PLAINTEXT  # 如果需要SSL加密可改为SASL_SSL
    producer:
      # 键序列化
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      # 序列化
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      #value-serializer: org.apache.kafka.common.serialization.StringSerializer
      # 重试次数
      retries: 3
      # 批量大小
      batch-size: 16384
      #  确认级别，确保消息可靠投递
      acks: all
    consumer:
      # 序列化
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # 反序列化
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      #value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # 自动重置偏移量
      auto-offset-reset: earliest
      # 手动提交偏移量
      enable-auto-commit: false
      # 消费者组
      group-id: exp-kafka-consumer
      properties:
        # 允许反序列化任意包
        spring.json.trusted.packages: "*"
    # 监听器配置
    listener:
      # 手动提交模式（二选一）
      # MANUAL：调用ack.acknowledge()后，批量提交
      # MANUAL_IMMEDIATE：调用ack.acknowledge()后立即提交
      ack-mode: MANUAL_IMMEDIATE  # 建议用这个，即时提交
      # 消费线程数
      concurrency: 3
```

:::

### 生产者

详见：

[::mdi:github::exp-kafka-provider](https://github.com/taybct/spring-taybct-example/tree/master/exp-kafka-provider)
[::simple-icons:gitee::exp-kafka-provider](https://gitee.com/taybct/spring-taybct-example/tree/master/exp-kafka-provider)

### 消费者

详见：

[::mdi:github::exp-kafka-consumer](https://github.com/taybct/spring-taybct-example/tree/master/exp-kafka-consumer)
[::simple-icons:gitee::exp-kafka-consumer](https://gitee.com/taybct/spring-taybct-example/tree/master/exp-kafka-consumer)

### 测试

1. 启动`exp-kafka-provider`和`exp-kafka-consumer`服务
2. 在浏览器中访问：[http://localhost:7003/send/message?key=topic&message=hello](http://localhost:7003/send/message?key=topic&message=hello)
