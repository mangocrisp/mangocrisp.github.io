---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 创建项目
# 当前页面内容描述
description: 创建项目
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
order: 2
dir:
  order: 2
# 页面图标
icon: "material-symbols:create-new-folder"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-25
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
  - 创建项目
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 创建项目

::: tip
首先要搞清楚要创建的项目是怎样的一个体量，如果不是特别大的项目，就没必要上微服务，再有，如果不确定，也可以是先单体架构，这样前期好修改和维护，后面如果业务量上来了，模块更多了，再考虑升级微服务
:::

## 使用模板（Maven Archetype）创建项目

::: warning
文件夹名尽量都使用英文
:::

1. JDK 版本

| 项目版本 | JDK 版本 | 说明 |
| ----- | -------- | ---- |
| 3.5.x | 21 | 更新维护中 |
| 3.2.x | 17 | 已经停止维护 |
| 2.7.x | 8 | 已经停止维护 |

2. 添加模板

Archetype 坐标

| 项目版本 | 单体架构 | 微服务架构 |
| ----------- | -------- | -------- |
| 3.5.x | `io.github.taybct:spring-taybct-single-archetype` | `io.github.taybct:spring-taybct-cloud-archetype` |
| 3.2.x | `io.github.mangocrisp:spring-taybct-single-archetype` | `io.github.mangocrisp:spring-taybct-cloud-archetype` |
| 2.7.x | `io.github.mangocrisp:spring-taybct-single-archetype` | `io.github.mangocrisp:spring-taybct-cloud-archetype` |

点击 Create，就能自动创建项目了

::: warning
创建项目之后，注意修改项目里面的配置文件，配置文件里面的一些配置的包名需要手动修改，单体架构已经自动替换成了 `${package}`，手动全局替换成你自己的包名就行了，微服务架构的，得去`Nacos`一个一个修改
:::

### 切换到 Gradle 管理项目

使用 Maven Archetype 创建的项目默认是使用 Maven 来管理，如果希望切换到 Gradle 管理，只需要以下步骤：

1. 全局替换所有的 *.gradle 里面的 `${package}` 为你的项目的根目录的 `artifactId`
2. IDEA 关闭项目
3. 去到项目目录文件夹，删除名为 `.idea` 的文件夹
4. 再打开项目，会发现 IDEA 提示你，选择打开为 Gradle 或者 Maven 项目，这个时候，就可以选择 Gradle 项目就行了

::: info
项目自带了 `gradlew` ，指定了 Gradle 版本， Gradle 会自动下载版本
:::

::: warning
应该一开始就决定使用 Maven 或者 Gradle，后续再切换，会比较麻烦
:::

::: tip
推荐单体构架的项目使用 Maven，因为简单，学习成本低，微服务的项目，多个模块太多的情况下，还是 Gradle 加载、打包更快
:::

::: tip
使用 模板创建的项目，一些文件的内容会有差异和默认值的变化，例如 .gitignore 文件是没有的，建议从[::mdi:github::源码仓库](https://github.com/taybct/spring-taybct) [::simple-icons:gitee::源码仓库](https://gitee.com/taybct/spring-taybct)中复制过来
:::

## 直接下载源码

<VPBanner
  title="Spring TayBct Single"
  content="Spring 业务组件基础集成的基础业务（单体架构），对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/taybct/spring-taybct-single",
    },
    {
      text: "Gitee",
      link: "https://gitee.com/taybct/spring-taybct-single",
      type: "default"
    },
    {
      text: "Gitcode",
      link: "https://gitcode.com/taybct/spring-taybct-single",
      type: "default"
    },
  ]'
/>

<VPBanner
  title="Spring TayBct Cloud"
  content="Spring 业务组件基础集成的基础业务（微服务架构），对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/taybct/spring-taybct-cloud",
    },
    {
      text: "Gitee",
      link: "https://gitee.com/taybct/spring-taybct-cloud",
      type: "default"
    },
    {
      text: "GitCode",
      link: "https://gitcode.com/taybct/spring-taybct-cloud",
      type: "default"
    },
  ]'
/>


::: tip
如果希望后续同步升级，建议 `fork` 项目，然后自己维护，这样，在主仓库更新时，可以同步更新到自己仓库中，这样，就不用每次更新代码的时候，都去同步代码了
:::

## 启动项目（Single）

### 1. 启动前先添加启动 JVM 参数（仅 JDK 17 以上）
   
``` bash
-Dmaven.wagon.http.ssl.insecure=true
-Dmaven.wagon.http.ssl.allowall=true
--add-opens
java.base/java.lang=ALL-UNNAMED
--add-opens
java.base/java.util=ALL-UNNAMED
--add-opens
java.base/java.nio=ALL-UNNAMED
--add-opens
java.base/sun.nio.ch=ALL-UNNAMED
--add-opens
java.base/java.lang.reflect=ALL-UNNAMED
```

::: tip 提示
1. 如果有些模块有可选的依赖，可以将`Add dependencies with "provided" scope to classpath`取消勾选
2. 可以顺手将`Shorten command line`也勾上
:::

### 2. 启动

### 3. 验证

- swagger 后端接口文档：浏览器打开 http://127.0.0.1:9102/doc.html
  
启动成功 🎉🎉🎉
  
## 启动项目（Cloud）

### 1. 启动前添加启动 JVM 参数（仅 JDK 17 以上）

[参考 Single](#_1-启动前先添加启动-jvm-参数-仅-jdk-17-以上)

### 2. 启动

启动如下所选的服务

::: tip
可以只启动服务 `AuthApplication` `GatewayApplication` `SystemApplication`，以最小化的服务启动

可以不用启动的服务：

- 分布式日志管理（如果添加了 Rabbit MQ 依赖，日志还是会被上传到 Rabbit MQ 上去，可以后面开启日志服务再消费）
- 任务调度管理（初始化项目的任务调度只做了记录任务调度日志，这个日志的记录方式同分布式日志）
- 文件管理（如果要使用的话再开起来）
   
:::

### 3. 验证

[参考 Single](#_3-验证)

启动成功 🎉🎉🎉

## 前端

配置前端项目来使用，目前可以使用的前端项目有：

- https://turtlewxg.github.io/gx-web-doc/
- https://8.148.188.198/pureadmin/
