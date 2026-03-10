---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Maven 项目迁移到 Gradle
# 当前页面内容描述
description: Maven 项目迁移到 Gradle
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
order: 7
dir:
  order: 7
# 页面图标
icon: "material-icon-theme:gradle"
# 是否原创
isOriginal: false
# 日期
date: 2025-11-19
# 类别
category:
  - 参考
# 标签
tag:
  - 知识
  - 分享
  - Maven
  - Gradle
  - 依赖管理
  - 项目构建
# 页面顶上的图片
# cover: "https://kafka.apache.org/logos/kafka_logo--simple.png"
---

# Maven 项目迁移到 Gradle

Gradle 结合了 Maven 的规范和 Ant 的灵活，是更现代的构建工具，多数场景下比 Maven 更高效，且完全兼容 Maven；Gradle 有着强大的项目构建功能，各种缓存机制，以及独特的打包方式，使得可以多模块并行打包，总体的体验下来就是项目越多，模块越多，打包速度相比 Maven 打包更快

关键维度对比：

- 配置体验：Maven 的 XML 文件冗长重复，Gradle DSL 可大幅精简配置代码。
- 灵活性：Maven 插件和生命周期固定，Gradle 支持自定义任务、插件，适配复杂项目。
- 构建性能：Gradle 支持增量构建、构建缓存和并行执行，大型项目速度远超 Maven。
- 生态兼容：Gradle 可直接复用 Maven 的依赖仓库、POM 文件和插件，迁移无压力。

## 版本选择

Gradle 对于 JDK、Spring 以及一些插件有着比较严格的版本要求，使用的时候要格外注意，因为我已经踩过特别多的坑了，这里写这篇文章就是为了记录，防止后续再踩坑

| Spring Boot 版本 | 兼容 Gradle 版本范围 | 推荐 Gradle 版本 | 关键说明                                              |
| ---------------- | -------------------- | ---------------- | ----------------------------------------------------- |
| 2.4.x            | 6.3 - 7.x            | 7.0+             | 最后支持 Java 8/11，不支持 Gradle 8.x                 |
| 2.5.x            | 6.8 - 7.x            | 7.0+             | 增强依赖管理，建议升级到 Gradle 7.0+                  |
| 2.6.x            | 7.0 - 7.x            | 7.2+             | 强制要求 Gradle 7.0+，修复低版本兼容问题              |
| 2.7.x（LTS）     | 7.0 - 8.x            | 7.5+ 或 8.0+     | 跨 Gradle 7/8 代际，稳定兼容，适合长期维护项目        |
| 3.0.x            | 7.5 - 8.x            | 8.0+             | 基于 Jakarta EE 9，必须 Gradle 7.5+（支持 Java 17）   |
| 3.1.x            | 7.5 - 8.x            | 8.2+             | 优化构建性能，推荐 Gradle 8.x 以适配新特性            |
| 3.2.x            | 7.5 - 8.x            | 8.5+             | 支持 Gradle 8.5+ 的原生依赖目录（Dependency Catalog） |
| 3.3.x+           | 8.0+                 | 8.6+             | 不再支持 Gradle 7.x，全面转向 Gradle 8+               |

## 安装 Gradle

如果使用 IntelliJIDEA 创建项目就不需要特意在自己的电脑上安装 Gradle，只需要指定版本让 IntelliJIDEA 帮助下载下来使用就行了

[官网安装教程](https://gradle.org/install)
[更多版本选择](https://gradle.org/releases/)

注意 Gradle 与 JDK 的版本兼容

| Gradle 版本 | 最低运行时 JDK | 推荐运行时 JDK | 支持的项目编译 JDK 范围 | 关键说明                                              |
| ----------- | -------------- | -------------- | ----------------------- | ----------------------------------------------------- |
| 7.0 - 7.4   | 8              | 11/17          | 8 - 19                  | 最后支持运行时 JDK 8；不支持 JDK 20+ 编译             |
| 7.5 - 7.6   | 8              | 17             | 8 - 21                  | 新增对 JDK 20/21 的编译支持；运行时仍可兼容 JDK 8     |
| 8.0 - 8.4   | 11             | 17             | 8 - 21                  | 不再支持运行时 JDK 8；编译支持 JDK 21                 |
| 8.5+        | 11             | 17/21          | 8 - 23                  | 新增对 JDK 22/23 的编译支持；推荐运行时 JDK 21（LTS） |

## 项目结构

本文以开源项目 [::mdi:github::spring-taybct-cloud](https://github.com/taybct/spring-taybct-cloud) [::simple-icons:gitee::spring-taybct-cloud](https://gitee.com/taybct/spring-taybct-cloud) 为例

```plaintext
.
|-- build.gradle                                 # Gradle 根目录的构建配置文件
|-- gradle  
|   `-- wrapper
|       |-- gradle-wrapper.jar               # Wrapper 核心逻辑载体（实现版本下载、缓存、启动）
|       `-- gradle-wrapper.properties   # Wrapper 配置文件（指定 Gradle 版本、下载地址等）
|-- gradle.properties                         # Gradle 属性配置文件
|-- gradlew                                     # Linux/Mac 系统的可执行脚本（核心启动入口）
|-- gradlew.bat                                # Windows 系统的可执行脚本（核心启动入口）
|-- pom.xml                                    # 原 Maven 根目录构建配置文件
|-- settings.gradle                            # Gradle 项目的 全局配置文件，核心作用是 定义项目的 “结构边界” 和 “构建初始化规则”—— 它在 Gradle 构建的最早期执行（早于所有 build.gradle），决定了 “哪些模块要参与构建”“项目叫什么名字”“插件 / 仓库的全局规则” 等关键信息。
`-- spring-taybct-modules 
    |-- build.gradle                            # Gradle 子模块的配置文件
    |-- pom.xml                                # 原 Maven 子模块的配置文件
    `-- spring-taybct-module-system
        |-- build.gradle                        # Gradle 子模块的配置文件
        `-- pom.xml                          # 原 Maven 子模块的配置文件
```

## gradlew

gradlew 是 Gradle Wrapper 的可执行脚本（Windows 系统对应 gradlew.bat），核心作用是 “免手动安装 Gradle，统一项目构建环境”，让开发者无需关心本地 Gradle 版本，直接通过项目自带的脚本完成构建（编译、打包、测试等）。

项目根目录执行：

```bash
gradle wrapper --gradle-version=8.14.3
```

就能生成 gradle wapper 的结构了

```plaintext
项目根目录/
├─ gradlew               # Linux/Mac 系统的可执行脚本（核心启动入口）
├─ gradlew.bat           # Windows 系统的可执行脚本（核心启动入口）
└─ gradle/
   └─ wrapper/
      ├─ gradle-wrapper.jar  # Wrapper 核心逻辑载体（实现版本下载、缓存、启动）
      └─ gradle-wrapper.properties  # Wrapper 配置文件（指定 Gradle 版本、下载地址等）
```

这个时候可以在 gradle-wrapper.properties 里面看到指定的 gradle 版本，生成的文件一般长成这样

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

但是 `distributionUrl` 的这个链接在国内下载速度可能比较慢，可以配置镜像下载例如腾讯云，网易云之类的镜像，或者直接使用本地下载的 gradle 文件

```properties
# 腾讯云
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.14.3-bin.zip
# 本地
distributionUrl=file:///D:/dev/environment/gradle-8.14.3-bin.zip
```

执行命令查看是否版本配置正确：

```plaintext
$ ./gradlew -v
Initialized native services in: D:\data\gradle\native
Initialized jansi services in: D:\data\gradle\native

------------------------------------------------------------
Gradle 8.14.3
------------------------------------------------------------

Build time:    2025-07-04 13:15:44 UTC
Revision:      e5ee1df3d88b8ca3a8074787a94f373e3090e1db

Kotlin:        2.0.21
Groovy:        3.0.24
Ant:           Apache Ant(TM) version 1.10.15 compiled on August 25 2024
Launcher JVM:  21.0.7 (Oracle Corporation 21.0.7+8-LTS-245)
Daemon JVM:    D:\dev\environment\JDK\jdk-21 (no JDK specified, using current Java home)
OS:            Windows 11 10.0 amd64
```

## 配置文件

::: info
Gradle 支持两种核心 DSL（领域特定语言）编写配置文件：Groovy DSL（后缀 .gradle）和 Kotlin DSL（后缀 .gradle.kts）。两者功能完全一致—— 能实现的配置（如插件引入、依赖管理、构建任务定义等）没有任何区别，核心差异集中在 语法风格、IDE 支持、生态成熟度、学习成本 等方面，本质是 “同功能、不同语法载体”。

- 对大部分 Spring Boot 开发者（尤其是 Java 背景）：Groovy DSL 是更务实的选择，生态成熟、配置简洁、学习成本低，完全满足日常需求；
- 若你熟悉 Kotlin 或追求长期维护性：Kotlin DSL 是更优雅的选择，强类型带来的稳定性在大型项目中优势明显。

| 对比维度       | Groovy DSL（.gradle）                                 | Kotlin DSL（.gradle.kts）                                    |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| **语法风格**   | 动态类型，语法灵活松散（可省略括号、分号、引号）      | 静态类型，语法严谨规范（需显式括号、分号可选，强类型校验）   |
| **可读性**     | 简洁但 “隐式逻辑多”，熟悉后高效，新手易混淆           | 冗长但 “显式清晰”，结构规整，长期维护更友好                  |
| **IDE 支持**   | 支持较好（自动补全、语法高亮），但精度一般            | 支持极佳（精准补全、类型提示、重构安全、错误实时校验）—— 因静态类型特性 |
| **生态成熟度** | 成熟稳定，官方文档 / 社区示例（如 Spring Boot）默认用 | 新兴趋势，生态逐步完善，官方主推未来方向，但部分老插件示例少 |
| **学习成本**   | 低（熟悉 Java 可快速上手，灵活无束缚）                | 中（需了解 Kotlin 基础语法，如 lambda、扩展函数）            |
| **错误排查**   | 运行时报错（如拼写错误、类型不匹配，构建时才发现）    | 编译时报错（IDE 实时提示错误，提前规避问题）                 |
| **迁移成本**   | 无（新建项目默认选择，无需额外配置）                  | 需手动指定文件后缀，现有 Groovy 项目迁移需逐文件改写         |
| **适用场景**   | 快速开发、小型项目、团队熟悉 Groovy/Java              | 大型项目、多模块项目、团队熟悉 Kotlin、追求可维护性          |

我这里使用 groovy 因为 Kotlin 可能安卓开发会用得多一些吧，而且 [spring-boot 源码](https://github.com/spring-projects/spring-boot) 也是用的 groovy
:::

::: details 根目录 gradle.properties

功能类似 maven 的 `<properties>` 标签，但是==注意，gradle 的一些插件会引用这个文件里面的配置，所以如果在这个文件里面定义你的属性的时候要注意，一些关键字之类的配置，可能会被插件直接引用，造成一些你很难想得到的问题，所以我建议自定义的属性都添加一些特殊的前缀，比如我就加的 `taybct-project.`==

```properties
# 可选优化：启用守护进程（加快构建速度）
org.gradle.daemon=true
# 可选优化：并行构建（多模块项目提速）
org.gradle.parallel=true
# 启用Gradle依赖锁定
org.gradle.configuration-cache=false
# 缓存
org.gradle.caching=true
# 项目组
taybct-project.groupId=io.github.taybct
# 项目版本
taybct-project.version=3.5.1
...
```

:::

::: details 根目录 settings.gradle

```groovy
pluginManagement {
    repositories {
        // Maven本地仓库
        mavenLocal()
        // 阿里云Gradle插件仓库（用于下载Gradle插件）
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
        // Spring 插件仓库
        maven { url 'https://repo.spring.io/plugins-release/' }
        // Gradle 插件官方仓库（必须添加，否则可能找不到插件）
        gradlePluginPortal()
    }
    plugins {
        id 'org.springframework.boot' version getProperty('taybct-project.spring-boot.version') as String
        id 'io.spring.dependency-management' version getProperty('taybct-project.io.spring.dependency-management.version') as String
    }
}

rootProject.name = 'spring-taybct-cloud'
include ':spring-taybct-common'
include ':spring-taybct-api:spring-taybct-api-system'
include ':spring-taybct-auth'
include ':spring-taybct-gateway'
...
```

> - 如果有些插件用不了，可以试试注释掉阿里云镜像，只使用官网仓库
> - 子模块的 include ，建议是直接写绝对路径，也就是 ':xxx:xxx'，从头写到尾，方便阅读

:::

根目录 build.gradle

太长了就不贴出来了，主要记录几个点：

1. 依赖管理引入依赖的关键字的区别：

| 配置关键字            | 可见性（传递性）        | 参与阶段            | 是否打包到产物 | 核心适用场景                                  |
| --------------------- | ----------------------- | ------------------- | -------------- | --------------------------------------------- |
| `implementation`      | 仅当前模块（不传递）    | 编译 + 运行         | 是             | 绝大多数业务依赖、Spring Boot Starter         |
| `api`                 | 当前 + 下游模块（传递） | 编译 + 运行         | 是             | 多模块公共依赖（下游需直接使用）              |
| `compileOnly`         | 仅当前模块（不传递）    | 仅编译              | 否             | Lombok、servlet-api（编译时接口，运行时提供） |
| `testImplementation`  | 仅测试代码（不传递）    | 测试编译 + 测试运行 | 否             | JUnit、Mockito 等测试依赖                     |
| `runtimeOnly`         | 仅当前模块（不传递）    | 仅运行              | 是             | 数据库驱动、日志实现（编译时用接口）          |
| `annotationProcessor` | 仅编译时注解处理        | 仅编译              | 否             | Lombok、MapStruct 等注解处理器                |

2. 资源打包配置：

如果不刻意去去配置 sourceSets.main.resources，gradle 默认就是会将 src/main/resources 目录下的文件视为资源

::: warning
如果有将 MyBatis 的 xml 文件写在 src/main/java 目录下的习惯，比如和 mapper interface 同目录的，打包不会把 xml 文件打包进去，因为 src/main/java 目录不是资源目录，xml 不能被识别，所以不建议把 Mybatis xml 文件放在 mapper interface 目录下
:::

## 其他操作

- 强制清除缓存：`./gradlew clean --refresh-dependencies`
- 测试代码无法运行，各种报错：
  如果是使用的 IntelliJ IDEA，尝试将Gradle设置中的测试运行器改为IntelliJ IDEA
  1. 进入 File > Settings > Build, Execution, Deployment > Build Tools > Gradle。
  2. 在右侧找到 Run tests using 选项，将其从 Gradle 更改为 IntelliJ IDEA。
  3. 点击 Apply 和 OK 保存后，再次运行测试。
- 如果在测试代码里面明明添加了 @SneakyThrows 注解，但是运行测试代码的时候报错：未报告的异常错误Exception
  核心原因是 Lombok 注解在测试代码的编译阶段未生效——@SneakyThrows 依赖 Lombok 注解处理器在编译时改写字节码，若测试代码的编译流程没引入 Lombok 支持，编译器会依然认为 “受检异常未声明 / 捕获”，从而报错
  解决：
  在 build.gradle 中，必须同时给 测试代码 配置 testCompileOnly（测试编译时依赖 Lombok 类）和 testAnnotationProcessor（测试编译时启用 Lombok 注解处理器），不能只配置主代码的依赖
- build 跳过测试代码，需要在 build 后面加上 `-x test`

  ```bash
  ./gradlew build -x test
  ```

- 文档和源码问题，使用 gradle 拉取的 MAVEN 依赖如果无法接取源码和文档，可以尝试使用 single 项目的 mavne 构建先下载一遍源码和文档，或者使用 `mvn` 命令：

  ```bash
  mvn dependency:sources dependency:javadoc -DgroupId=依赖组ID -DartifactId=依赖工件ID -Dversion=依赖版本号
  ```
  
  IntelliJ IDEA 在面板右键 build -> 修改运行配置 -> 直接在命令后面加上 `-x test`
