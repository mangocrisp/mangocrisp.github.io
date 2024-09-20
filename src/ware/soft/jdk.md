---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: "JDK 安装"
# 当前页面内容描述
description: "JDK 安装"
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
order: 5
dir:
  order: 5
# 页面图标
icon: "ri:java-fill"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-16
# 类别
category:
  - 软/硬件知识
# 标签
tag:
  - 知识
  - 分享
  - 软件知识
  - JDK
# 页面顶上的图片
cover: "https://www.oracle.com/a/ocom/img/rc30v1-java-se.png"
---

# JDK 安装

Java 开始就一定要安装 JDK 就和 VUE 开发一定离不开 Node.js 是一样的。

## OpenJDK

### 下载地址

官网的下载很难找，[推荐来这儿下载](https://www.openlogic.com/openjdk-downloads)
这里以 [OpenJDK 17](https://builds.openlogic.com/downloadJDK/openlogic-openjdk/17.0.12+7/openlogic-openjdk-17.0.12+7-windows-x64.msi) 为例

## OracleJDK

### 下载地址

[官网](https://www.oracle.com/cn/java/technologies/downloads/archive/)

[OracleJDK 17](https://download.oracle.com/java/17/archive/jdk-17.0.11_windows-x64_bin.msi)

### OracleJDK 版本支持表

[Oracle Java SE Support Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html)

## 对比

1. 是否开源：OpenJDK 完全开源，Oracle JDK 部分闭源。
2. 是否免费：OpenJDK 完全免费，Oracle JDK 有时间限制的免费版本。
3. 功能性：Java 11 之后，功能基本一致。
4. 稳定性：都提供 LTS 版本，Oracle JDK 官方支持，OpenJDK 由社区支持。
5. 协议：Oracle JDK 使用 BCL/OTN 协议，OpenJDK 使用 GPL v2 许可。

[参考](https://blog.csdn.net/qq_33326733/article/details/138875513)

## 环境变量配置

### Windows

1. `Win + R` 输入 `control` 打开控制面板
2. 查看方式改为 `小图标` ,打开 `系统`
3. 打开 `高级系统设置` > `环境变量`
4. 新建 `系统变量`
   变量名：`JAVA_HOME`
   变量值：`D:\dev\environment\jdk\jdk-17.0.5` ==注：填写 JDK 安装目录==
5. 在 `系统变量` 里面找到 `Path` ，编辑打开在列表添加 `%JAVA_HOME%\bin`
6. 确定保存
7. 验证
   `Win + R` 输入 `cmd`，打开 cmd 窗口输入 `java -version` 有版本信息弹出来就说明安装成功了

### Linux

1. 解压
   一般下载下来是一个 xxx.tar.gz
   ```bash
   tar -zxvf xxx.tar.gz
   ```
2. 添加环境变量
   编辑 `/etc/profile`
   ```bash
   vim /etc/profile
   ```
   在文件末尾添加 ==解压后的 jdk 的目录的路径==
   ```bash
   export JAVA_HOME=/usr/local/share/jdk
   export PATH=$JAVA_HOME/bin:$PATH
   ```
   修改完保存后不要忘了刷新一下配置
   ```
   source /etc/profile
   ```
3. 验证
   ```bash
   java -version
   ```
   有版本信息说明安装成功了