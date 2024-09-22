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

## Maven

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

