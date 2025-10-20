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

## 使用模板创建项目

![新建项目](/assets/images/blog/newProject1.png)

说明：

1. 项目文件夹的名称
2. 项目存放的路径

::: warning
文件夹名尽量都使用英文
:::

3. 如果是 2.7.x 就选择 jdk8，如果是 3.2.x+ 就选择 jdk17
4. 添加模板
   
   ![添加模板](/assets/images/blog/addarchetype.png)

   ::: info 版本的信息
   1. GroupId: io.github.mangocrisp
   这个是固定的组

   2. ArtifactId: spring-taybct-single-archetype
   这个根据实际需求来，如果是单体架构就是 `spring-taybct-single-archetype`，如果是微服务就先 `spring-taybct-cloud-archetype`

   3. Version: 3.2.0-alpha.1 
   版本号，目前只有两种版本号：以 `3.2.*` 开头的 `3.2.x` 版本，以及 `2.7.*` 开头的 `2.7.x` 版本，分别对应了 `Spring Boot` `3.2.x` 和 `2.7.x` 版本
   :::

   填完点 Add
   ::: tip
   或者选择 Catalog，选择 Maven Central,然后输入`io.github.mangocrisp:spring-taybct-single-archetype`，Version 选择`3.2.0-alpha.1`
   :::
   ![添加模板](/assets/images/blog/addarchetype2.png)

5. 这里这个 GroupId,推荐是使用默认的 io.github.mangocrisp，如果使用其他的 GroupId，就需要修改一些依赖相关的代码
6. 项目名
7. 版本号

点击 Create，就能自动创建项目了

![创建完成](/assets/images/blog/newpfoject1complete.png)

::: details 如果 Maven 提示报错了，可以参考这个
汗，当时提交模板的时候忘了改版本号了，所以这里的 pom.xml 默认一开始是 `${project.version}`，新建的项目怎么可能是`3.2.0-alpha.1`嘛，所以`3.2.0-alpha.1`版本的模板创建完成之后需要修改一下 pom.xml 文件，也只有 `spring-taybct-single` 的 `3.2.0-alpha.1` 和 `2.7.0-alpha.1` 版本有这样的问题，后面就没这样的问题了
![修改 pom.xml](/assets/images/blog/fixpom.xml.png)
此时需要点击重新加载 Maven 依赖
:::

## 直接下载源码

<VPBanner
  title="Spring TayBct Single"
  content="Spring 业务组件基础集成的基础业务（单体架构），对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/mangocrisp/spring-taybct-single",
    },
    {
      text: "Gitee",
      link: "https://gitee.com/mangocrisp/spring-taybct-single",
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
      link: "https://github.com/mangocrisp/spring-taybct-cloud",
    },
    {
      text: "Gitee",
      link: "https://gitee.com/mangocrisp/spring-taybct-cloud",
      type: "default"
    },
  ]'
/>


::: tip
如果希望后续同步升级，建议 `fork` 项目，然后自己维护，这样，在主仓库更新时，可以同步更新到自己仓库中，这样，就不用每次更新代码的时候，都去同步代码了
:::

## 启动项目（Single）

### 1. 启动前先添加启动 JVM 参数（仅 JDK 17 以上）
   
   ![添加 JVM 参数](/assets/images/blog/vmparams.png)

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

   点击 OK

::: tip 提示
1. 如果有些模块有可选的依赖，可以将`Add dependencies with "provided" scope to classpath`取消勾选
2. 可以顺手将`Shorten command line`也勾上
:::

### 2. 启动

![启动成功 🎉🎉🎉](/assets/images/blog/startsuccess.png)

启动成功如上图

### 3. 验证

- swagger 后端接口文档：浏览器打开 http://127.0.0.1:9102/doc.html
- ApiFox 调试登录接口：
  
  ```bash
  curl --location --request POST 'http://localhost:9102/auth/oauth/login' \
  --header 'User-Agent: Apifox/1.0.0 (https://apifox.com)' \
  --header 'Authorization: Basic dGF5YmN0X3BjOmUxMGFkYzM5NDliYTU5YWJiZTU2ZTA1N2YyMGY4ODNl' \
  --data-urlencode 'grant_type=taybct' \
  --data-urlencode 'scope=all' \
  --data-urlencode 'username=root' \
  --data-urlencode 'password=0475e3dd4c5e90bc3854490e7354b6f10a47dd6e1220a0147e0ad42f4428f5a87828597146cbc3c2b8fd3458cda53e9daf21d3aa5c6da8ed31fd256cdf378e17ade31a708f31158c062214126f7fb863d31147038da24f2d59704fbb7783fc2c1b764efad79319'
  ```

  ![登录成功 🎉🎉🎉](/assets/images/blog/loginsuccess.png)

  
## 启动项目（Cloud）

### 1. 启动前添加启动 JVM 参数（仅 JDK 17 以上）

[参考 Single](#_1-启动前先添加启动-jvm-参数-仅-jdk-17-以上)

### 2. 启动

启动如下所选的服务

![启动](/assets/images/blog/startservices.png)

::: tip
可以只启动服务 `1` `2` `3`，以最小化的服务启动

可以不用启动的服务：

- 分布式日志管理（如果添加了 Rabbit MQ 依赖，日志还是会被上传到 Rabbit MQ 上去，可以后面开启日志服务再消费）
- 任务调度管理（初始化项目的任务调度只做了记录任务调度日志，这个日志的记录方式同分布式日志）
- 文件管理（如果要使用的话再开起来）
   
:::

![启动成功 🎉🎉🎉](/assets/images/blog/startsuccess2.png)


### 3. 验证

[参考 Single](#_3-验证)

## 前端

配置前端项目来使用，目前可以使用的前端项目有：

- https://turtlewxg.github.io/gx-web-doc/
