---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: RabbitMQ 安装
# 当前页面内容描述
description: RabbitMQ 在 windows 和 Centos 7.9 下的安装
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
icon: "simple-icons:rabbitmq"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-15
# 类别
category:
  - 软/硬件知识
# 标签
tag:
  - 知识
  - 分享
  - 软件知识
  - 软件安装
  - CentOS
  - RabbitMQ
# 页面顶上的图片
cover: "https://www.rabbitmq.com/img/rabbitmq-logo-with-name.svg"
---

# RabbitMQ 安装

## 链接

<VPCard
  title="Rabbit MQ 官网"
  link="https://www.rabbitmq.com/"
/>

<VPCard
  title="Rabbit MQ 中文网"
  desc="仅供参考"
  link="https://rabbitmq.org.cn/"
/>

> [!tip]
> 如果下载很慢，可以试试使用[迅雷](https://www.xunlei.com/)下载

## [Erlang 版本支持](https://www.rabbitmq.com/docs/which-erlang)

RabbitMQ 依赖 Erlang，所以这里需要对应的版本关系对照弄清楚

## Windows

### 1. 安装 [otp_win64_26.2.5.3.exe](https://github.com/erlang/otp/releases/download/OTP-26.2.5.3/otp_win64_26.2.5.3.exe) （[其他版本](https://erlang.org/download/otp_versions_tree.html)）
   
一直 next，复制安装目录\bin 到 环境变量 path\

### 2. 安装 [rabbitmq-server-3.13.7.exe](https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7.exe)

直接双击

安装完成之后可以在 Windows 启动文件夹里面找到：

![RabbitMQ管理文件夹](/assets/images/blog/rabbit_windows_manage_dir.png)

以管理员身份点击 `RabbitMQ Command Prompt (sbin dir)` 进入管理窗口

### 3. 开户管理功能   
   
```bash
rabbitmq-plugins enable rabbitmq_management
```

### 4. 安装 [delayed_message_exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.13.0/rabbitmq_delayed_message_exchange-3.13.0.ez) 

将 rabbitmq_delayed_message_exchange-3.13.0.ez 复制到 RabbitMQ 安装目录\plugins\

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

### 5. 迷之操作（才能正常运行？）
   
执行 Rabbit Service stop > Rabbit Service remove > Rabbit Service (re)install > Rabbit Service start > 访问 127.0.0.1:15672 guest/guest


### 6. 配置用户名和虚拟路径

1. 初次使用 `guest`/`guest` 登录 http://localhost:15672
2. 进入首页选择 `Admin` 页
3. 点击 `Add a user`
4. 按要求输入，设置对应的角色之后点击 `Add user`
5. 点击右侧 `Virtual Hosts`
6. 按要求输入，点击 `Add virtual host`
7. 点击列表里面刚新增的 `Virtual Hosts`
8. `Set permission` 和 `Set topic permission` 设置给刚新增的用户

## Linux (CentOS7.9)

### 1. 安装 [Erlang v26.2.5.3](https://github.com/rabbitmq/erlang-rpm/releases/tag/v26.2.5.3)（[其他版本](https://github.com/rabbitmq/erlang-rpm/releases)）

```bash
# 解压
rpm -Uvh erlang-26.2.5.2-1.el7.x86_64.rpm
# 安装
yum install -y erlang
# 查看是否安装成功
erl -v
```

### 2. 安装 socat

```bash
yum install -y socat
```

### 4. 安装 [RabbitMQ](https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server-3.13.7-1.el8.noarch.rpm)

```bash
# 解压
rpm -Uvh rabbitmq-server-3.13.7-1.el8.noarch.rpm
# 安装
yum install -y rabbitmq-server
```

### 5. 开户管理功能

```bash
rabbitmq-plugins enable rabbitmq_management
```

### 6. 安装 [delayed_message_exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.13.0/rabbitmq_delayed_message_exchange-3.13.0.ez)

将 rabbitmq_delayed_message_exchange-3.13.0.ez 复制到 /usr/lib/rabbitmq/plugins and /usr/lib/rabbitmq/lib/rabbitmq_server-version/plugins.

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

### 7. 启动RabbitMQ服务

```bash
# 启动rabbitmq
systemctl start rabbitmq-server
# 查看rabbitmq状态
systemctl status rabbitmq-server
```
### 8. 配置用户

```bash
# 创建账号
rabbitmqctl add_user admin 123456
# 设置用户角色
rabbitmqctl set_user_tags admin administrator
# 设置用户权限
rabbitmqctl set_permissions -p "/" admin ".*" ".*" ".*"
# 查看用户和角色
rabbitmqctl list_users

```

> [!warning]
> `guest` 用户只能在 `localhost` 登录
> 所以需要配置可以远程登录的用户

## 默认端口，用户名

- API 端口：5672
- Management 端口：15672
- 默认用户名：guest
- 默认密码：guest
