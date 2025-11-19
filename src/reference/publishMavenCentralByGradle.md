---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 发布包到 Maven Central 仓库（Gradle）
# 当前页面内容描述
description: Gradle 项目发布依赖到 Maven Central 仓库
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
order: 8
dir:
  order: 8
# 页面图标
icon: "vscode-icons:folder-type-light-gradle-opened"
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
  - Maven Central 中央仓库
  - 发布Jar包
  - 依赖管理
  - Gradle
# 页面顶上的图片
# cover: "https://kafka.apache.org/logos/kafka_logo--simple.png"
---

# 发布包到 Maven Central 仓库（Gradle）

本文记录了如何将 Gradle 构建的项目发布到 Maven 中央仓库（ https://central.sonatype.com ）

## 准备工作

1. 注册
2. 新建命名空间
3. 验证命名空间
4. 创建push的账号和密码
5. GPG

这些步骤在之前的文章 [发布包到 Maven Central 仓库](/reference/publishmavencentral.html) 已经记录过了，其中，GPG 有些不一样的操作，下文会写出来

## Gradle 配置

全部配置可以查看开源项目 [::mdi:github::spring-taybct-tools](https://github.com/taybct/spring-taybct-tools) [::simple-icons:gitee::spring-taybct-tools](https://gitee.com/taybct/spring-taybct-tools)

::: details settings.gradle

```groovy
pluginManagement {
    repositories {
        // Maven本地仓库
        mavenLocal()
        // Gradle 插件官方仓库（必须添加，否则可能找不到插件）
        gradlePluginPortal()
        // 阿里云Gradle插件仓库（用于下载Gradle插件）
        //maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
        // Spring 插件仓库
        maven { url 'https://repo.spring.io/plugins-release/' }
    }
    plugins {
        id 'io.spring.dependency-management' version getProperty('taybct-project.io.spring.dependency-management.version') as String
    }
}

rootProject.name = 'spring-taybct-tools'
include ':spring-taybct-tools-dependencies'
include ':spring-taybct-tool-core'
include ':spring-taybct-tool-launch'
include ':spring-taybct-tool-cloud'
include ':spring-taybct-tool-file'
include ':spring-taybct-tool-pki'
include ':spring-taybct-tool-scheduling'
include ':spring-taybct-tool-security'
include ':spring-taybct-tool-wechat'
```

:::

::: tip

- 这里注释掉了阿里云插件镜像仓库，因为 jreleaser 插件找不到，还各种报错
- 子模块的引入我推荐都直接使用绝对路径，就算后面修改起来比较麻烦，主要是绝对路径让人更放心

:::

::: details build.gradle (root 目录)

```groovy
plugins {
    id 'base'
    id 'io.spring.dependency-management'
    id 'org.jreleaser' version '1.20.0'
    id 'com.gradleup.nmcp.aggregation' version '1.2.1'
}

description = 'Spring TayBct Tools'

// 所有项目的通用配置
allprojects {it ->
    group = findProperty('taybct-project.groupId') ?: 'io.github.taybct'
    version = findProperty('taybct-project.version')

    repositories {
        mavenLocal()
        maven {
            url 'https://maven.aliyun.com/repository/public'
            name = 'AliyunMaven'
        }
        mavenCentral()
    }
}

// 所有项目通用配置
subprojects {subproject ->

    apply plugin: 'io.spring.dependency-management'
    apply plugin: 'maven-publish'
    apply plugin: 'signing'
    apply plugin: 'org.jreleaser'

    if (subproject.name != "spring-taybct-tools-dependencies"){

        apply plugin: 'java'
        apply plugin: 'java-library'

        // 依赖管理配置
        dependencyManagement {
            imports {
                mavenBom "io.github.taybct:spring-taybct-tools-dependencies:${findProperty('taybct-project.spring-taybct.version')}"
            }
        }

        // 依赖声明优化
        dependencies {
            // 编译时依赖
            compileOnly 'org.springframework.boot:spring-boot-configuration-processor'
            compileOnly 'org.projectlombok:lombok'
            compileOnly 'net.dreamlu:mica-auto'

            // 注解处理器
            annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
            annotationProcessor 'org.projectlombok:lombok'
            annotationProcessor 'net.dreamlu:mica-auto'

            // Hutool - 作为工具库的一部分传递
            api "cn.hutool:hutool-all:${findProperty('taybct-project.hutool.version')}"

            // Spring 核心依赖 - 确保用户获得完整的 Spring 环境
            //api 'org.springframework:spring-context'
            //api 'org.springframework.boot:spring-boot-starter'
            //api 'org.springframework.boot:spring-boot-autoconfigure'
        }

        sourceSets {
            main {
                resources {
                    // 第一个资源目录：src/main/resources（排除特定文件）
                    srcDir 'src/main/resources'
                    include 'META-INF/dubbo/org.apache.dubbo.rpc.Filter'
                    include 'banner.txt'
                    include 'static/**'
                    exclude '**/*.jks'
                    exclude '**/*.cer'
                    exclude '**/*.key'

                    // 第二个资源目录：src/main/java（只包含配置文件）
                    srcDir 'src/main/java'
                    include '**/*.properties'
                    include '**/*.yml'
                    include '**/*.xml'
                    exclude '**/*.java'
                }
            }
        }

        // 源码集配置
        java {
            sourceCompatibility = JavaVersion.toVersion(findProperty('maven.compiler.source') ?: '21')
            targetCompatibility = JavaVersion.toVersion(findProperty('maven.compiler.target') ?: '21')
            withSourcesJar()
            withJavadocJar()
        }

        // 配置 sourcesJar 任务的重复文件处理策略
        tasks.named('sourcesJar') {
            duplicatesStrategy = DuplicatesStrategy.INCLUDE
        }

        // 确保也配置 javadocJar 任务
        tasks.named('javadocJar') {
            duplicatesStrategy = DuplicatesStrategy.INCLUDE
        }

        // 配置资源处理
        tasks.named('processResources') {
            duplicatesStrategy = DuplicatesStrategy.INCLUDE
            exclude '**/*.jks'
            exclude '**/*.cer'
            exclude '**/*.key'
        }

        // 打包设置
        tasks.withType(JavaCompile).configureEach {
            options.encoding = findProperty('taybct-project.build.sourceEncoding') ?: 'UTF-8'
            options.compilerArgs.add("-parameters")
        }

        // Javadoc 配置
        javadoc {
            options {
                encoding = 'UTF-8'
                charSet = 'UTF-8'
                docEncoding = 'UTF-8'
                addBooleanOption('Xdoclint:none', true)
                addBooleanOption('html5', true)
            }
        }

        tasks.withType(Javadoc).configureEach {
            options.encoding = 'UTF-8'
            options.charSet = 'UTF-8'
            // 若使用中文注释，需额外配置语言
            options.locale = 'zh_CN'
        }
    } else {
        // BOM模块必须使用此插件 [citation:1][citation:8]
        apply plugin: 'java-platform'

    }

    // 版本检查问题
    tasks.withType(GenerateModuleMetadata).configureEach {
        suppressedValidationErrors.add('dependencies-without-versions')
    }


    afterEvaluate { it ->
        // 发布配置
        publishing {
            publications {
                maven(MavenPublication) {
                    if (subproject.name != "spring-taybct-tools-dependencies") {
                        // 发布 Jar 包：from components.java 会自动包含主工件和依赖信息
                        from components.java
                    } else {
                        // 对于java-platform项目，必须使用javaPlatform组件
                        from components.javaPlatform
                    }
                    // GAV坐标
                    groupId = subproject.group
                    artifactId = subproject.name
                    description = subproject.description
                    // POM 配置
                    pom {
                        name = subproject.name
                        description = subproject.description
                        url = findProperty('taybct-project.url') ?: 'https://github.com/taybct/spring-taybct-tools'
                        inceptionYear = '2024'
                        scm {
                            connection = findProperty('taybct-project.scm.connection') ?: 'scm:git:git://github.com/taybct/spring-taybct-tools.git'
                            developerConnection = findProperty('taybct-project.scm.developerConnection') ?: 'scm:git:ssh://github.com/taybct/spring-taybct-tools.git'
                            url = findProperty('taybct-project.scm.url') ?: 'https://github.com/taybct/spring-taybct-tools'
                        }
                        licenses {
                            license {
                                name = findProperty('taybct-project.license.name') ?: 'The Apache Software License, Version 2.0'
                                url = findProperty('taybct-project.license.url') ?: 'https://www.apache.org/licenses/LICENSE-2.0.txt'
                            }
                        }
                        organization {
                            name = findProperty('taybct-project.organization.name') ?: 'io.github.taybct'
                            url = findProperty('taybct-project.organization.url') ?: 'https://github.com/taybct'
                        }
                        developers {
                            developer {
                                id = 'crisp'
                                name = 'Mango Crisp'
                                email = '15014633363@163.com'
                                url = 'https://mangocrisp.github.io'
                                organization = 'io.github.taybct'
                                organizationUrl = 'https://github.com/taybct'
                                timezone = 'Asia/Shanghai'
                            }
                        }
                        withXml {
                            def root = asNode()
                            def developers = root.get('developers')[0]
                            def developer1 = developers.get('developer')[0]
                            def roles1 = developer1.appendNode('roles')
                            roles1.appendNode('role', 'Architect')
                            roles1.appendNode('role', 'Developer')
                        }
                    }
                }
            }

            repositories {
                maven {
                    url = layout.buildDirectory.dir('staging-deploy')
                }
            }

        }

        // 签名配置
        signing {
            def keyId = findProperty("gpg.keyId") ?: System.getenv("GPG_KEY_ID")
            def keyRingFile = findProperty("gpg.secretKeyRingFile") ?: System.getenv("GPG_SECRET_KEY_RING_FILE")
            def passphrase = findProperty("gpg.passphrase") ?: System.getenv("GPG_PASSPHRASE")

            if (keyRingFile) {
                def keyFile = new File(keyRingFile as String)
                if (keyFile.exists()) {
                    useInMemoryPgpKeys(keyId as String, keyFile.text, passphrase as String)
                }
            } else {
                def key = findProperty("gpg.key") ?: System.getenv("GPG_KEY")
                useInMemoryPgpKeys(keyId as String, key as String, passphrase as String)
            }

            required {
                gradle.taskGraph.hasTask("publish") || gradle.taskGraph.hasTask("publishToMavenLocal")
            }

            sign publishing.publications.maven
        }
    }

    jreleaser {
        gitRootSearch = true
        signing {
            active = 'ALWAYS'
            armored = true
        }
        release {
            github { // GitHub 发布提供者配置
                repoOwner = 'mangocrisp' // 例如：octocat
                commitAuthor {
                    name = "Mango Crisp"
                    email = "15014633363@163.com"
                }
            }
        }
        deploy {
            maven {
                mavenCentral {
                    sonatype {
                        active = 'ALWAYS'
                        url = 'https://central.sonatype.com/api/v1/publisher'
                        stagingRepository('build/staging-deploy')
                    }
                }
            }
        }
    }
}


jreleaser {
    gitRootSearch = true
    signing {
        active = 'ALWAYS'
        armored = true
    }
    release {
        github { // GitHub 发布提供者配置
            repoOwner = 'mangocrisp' // 例如：octocat
            commitAuthor {
                name = "Mango Crisp"
                email = "15014633363@163.com"
            }
        }
    }
    deploy {
        maven {
            mavenCentral {
                sonatype {
                    active = 'ALWAYS'
                    url = 'https://central.sonatype.com/api/v1/publisher'
                    stagingRepository('build/staging-deploy')
                }
            }
        }
    }
}

nmcpAggregation {
    centralPortal {
        username = "${findProperty('mavenCentralUsername') ?: System.getenv('MAVENCENTRAL_USERNAME')}"
        password = "${findProperty('mavenCentralPassword') ?: System.getenv('MAVENCENTRAL_PASSWORD')}"
        // publish manually from the portal
        publishingType = "USER_MANAGED"
        // or if you want to publish automatically
        //publishingType = "AUTOMATIC"
    }

    // Publish all projects that apply the 'maven-publish' plugin
    publishAllProjectsProbablyBreakingProjectIsolation()
}
```

:::

::: details build.gradle (子模块)

```groovy
description = "description"

dependencyManagement {
  imports {
    ...
  }
  dependencies {
    ...
  }
}
```

:::

::: tip

- 对于 java-platform 项目（bom 依赖管理），必须使用javaPlatform组件 `from components.javaPlatform`，在我的配置里面我直接使用了 java-platform 模块的 name 来判断了，实际使用过程中请自行替换
- 如果想在 root 目录获取到 sub 目录的属性，比如 description，得需要在 afterEvaluate 里面获取（afterEvaluate 就是 Gradle 提供的 “等所有配置都就绪后再干活” 的机制）
- api 'xxx' 依赖必须要写版本号，如果不写生成的产物没有版本号，maven central 仓库硬性要求必要每个依赖都得有版本号
- 不需要显式声明 artifact sourcesJar 和 artifact javadocJar，因为它们已经通过 java {withSourcesJar() withJavadocJar()} 配置自动包含了

:::

::: warning

配置里面有我的项目的一些信息，以及个人信息，记得改成你自己的😓

:::

::: warning 注意注意！！！

虽然阿里云镜像仓库速度快，但是要上传依赖到 maven central 仓库最好还是使用 maven central 仓库能找得到的依赖，而且实践过了，如果用阿里云镜像插件仓库，可能有些插件会报错找不到，然后就算也有配置 Gradle 插件官方仓库也找不到，必须注释掉阿里云的配置

:::

::: note

我注意到，我发布到 maven central 仓库的依赖，如果没有下载过阿里云镜像仓库那边就同步得比较慢，但是如果我自己下载过一次了之后，他就会很快同步了，平时开发过程中，如果遇到一些依赖有问题，可以尝试把阿里云镜像仓库注释，再重新拉一下依赖，你会发现一切都正常了。什么？拉不了？那可能需要用一下梯子 😁

:::

### GPG 密钥

发布到 Maven Central 仓库（由 Sonatype 托管）时，所有产物（JAR、POM、源码包、文档包等）必须通过 GPG/PGP 进行数字签名，且签名算法通常推荐使用 RSA（密钥长度至少 2048 位，推荐 4096 位）。这一要求的核心目的是保证构件的完整性（未被篡改）和真实性（确认为发布者本人上传）

1. 导出私钥

```bash
gpg --export-secret-keys -a YOUR_KEY_ID > backup-private-key.asc
```

2. 在 gradle.properties 里面配置文件路径，或者写到环境变量里面

::: details 其他 gpg 命令

```bash

# 生成密钥对，建议选择长度的时候选到 2048 以上
gpg --full-generate-key

# 查看生成的密钥 
# 加上 --keyid-format LONG 查看长密钥 keyid，
# 加上 --keyid-format SHORT 查看短密钥 keyid（用于 Maven 官方插件，放在 settings.xml 里面的）
# 列出公钥
gpg --list-keys
# 列出私钥
gpg --list-secret-keys

# 分发公钥到密钥服务器
# 发送到 keys.openpgp.org
gpg --keyserver keys.openpgp.org --send-keys YOUR_KEY_ID
# 或者发送到 keyserver.ubuntu.com
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID

# 获取 Base64 编码的私钥
gpg --export-secret-keys -a YOUR_KEY_ID | base64

# 密钥备份
gpg --export-secret-keys -a YOUR_KEY_ID > backup-private-key.asc
gpg --export -a YOUR_KEY_ID > backup-public-key.asc

# 导出私钥（用于 Gradle 配置）
gpg --export-secret-keys -a YOUR_KEY_ID > backup-private-key.asc
# 导出 Base64 格式的私钥（推荐用于 useInMemoryPgpKeys）
gpg --export-secret-keys YOUR_KEY_ID | base64 > private-key.txt
# 或者导出为密钥环文件
gpg --export-secret-keys -a YOUR_KEY_ID > secring.gpg

# 导出密钥对（用于 Jreleaser）
gpg --export --armor [密钥ID或用户标识] > 公钥文件名.asc
gpg --export-secret-keys --armor [密钥ID或用户标识] > 私钥文件名.asc

# 吊销证书
# 1. 生成吊销证书
gpg --output revoke.asc --gen-revoke YOUR_KEY_ID
# 2. 导入吊销证书到本地密钥环
gpg --import revoke.asc
# 3. 将吊销状态发布到密钥服务器
gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID

```

:::

::: danger 注意注意！！！
不要把密钥提交到 VCS 了，暴露是件很危险的事，如果不慎提交了，你需要做如下几件事（别问我为什么知道🥵）：

1. 如果你有多个备份的 VSC 远端库，比如 gitee github gitcode，可以直接删除你当时开发用的那个远程仓库，然后再从其他仓库还原回去，如果没有备份的，那没办法了，只能删掉远端，然后尝试删除本地的提交历史记录，如果无法删除历史记录，只能牺牲提交历史，新创建库了，因为一般远端仓库记录的这些历史记录也是会把这些数据记录下来的，也是有暴露风险的
2. 吊销本地和远端的 gpg 密钥
3. 如果把 maven central 仓库的 token 和密码也暴露了，还需要去官网删除原来的 token 然后重新生成
:::

## 发布插件

> Currently, there is no official Gradle plugin for publishing to Maven Central via the Central Publishing Portal. We have received significant feedback that publishing via Gradle is important to the community so we wanted to communicate that Gradle support is on our roadmap.
> —— [Maven Central](https://central.sonatype.org/publish/publish-portal-gradle/)

暂时还没 Gradle 的官方插件用于发布到 Maven Central 仓库，但是官方列出了一些第三方插件可以用于发布，我这里使用了两种插件用于发布（毕竟是第三方的，留一手备用嘛）

### Jreleaser

可以参照[官方示例](https://jreleaser.org/guide/latest/examples/maven/maven-central.html#_gradle)

一、版本兼容

提供了非常丰富的可以[自定义的配置](https://jreleaser.org/guide/latest/tools/jreleaser-gradle.html)，但是太多的配置有的时候也是件令人头疼的事，😓 慎用吧，而且 Jreleaser 和 gradle 的版本兼容也是个大问题，我尝试了多种版本

1. 官网推荐的版本 1.21.0，但是这个在打包的时候会报 gradle 的一些方法找不到，我猜大概是因为我用的 gradle 8.14.3，Jreleaser 在做兼容 9.x 的时候把 8.x 的兼容性又给整拉了
2. 1.13.1 老一些的版本也是会报一些莫名其妙的报，方法找不到之类的
3. 1.20.0 也就是我打包成功的版本，可以参考 grald 8.14.3 对应 3，Jreleaser 1.20.0

二、配置

::: details build.gradle（根目录）

```groovy
jreleaser {
    gitRootSearch = true
    signing {
        active = 'ALWAYS'
        armored = true
    }
    release {
        github { // GitHub 发布提供者配置
            repoOwner = 'mangocrisp' // 例如：octocat
            commitAuthor {
                name = "Mango Crisp"
                email = "15014633363@163.com"
            }
        }
    }
    deploy {
        maven {
            mavenCentral {
                sonatype {
                    active = 'ALWAYS'
                    url = 'https://central.sonatype.com/api/v1/publisher'
                    stagingRepository('build/staging-deploy')
                }
            }
        }
    }
}
```

:::

::: details ~/.jreleaser/config.toml

```toml
JRELEASER_MAVENCENTRAL_USERNAME = "maven central 生成的 token 的 username"
JRELEASER_MAVENCENTRAL_PASSWORD = "maven central 生成的 token 的 password"
JRELEASER_GPG_PASSPHRASE = "生成 gpg 密钥的时候输入的密码"
JRELEASER_GITHUB_TOKEN = "github 生成的 token"

JRELEASER_GPG_PUBLIC_KEY="""-----BEGIN PGP PUBLIC KEY BLOCK-----

<gpg --output public.pgp --armor --export YOUR_KEY_ID 导出的公钥的内容>

-----END PGP PUBLIC KEY BLOCK-----"""

JRELEASER_GPG_SECRET_KEY="""-----BEGIN PGP PRIVATE KEY BLOCK-----

<gpg --output private.pgp --armor --export-secret-key YOUR_KEY_ID 导出的私钥的内容>

-----END PGP PRIVATE KEY BLOCK-----"""
```

> 因为用不到 https://oss.sonatype.org，所以不需要配置下面的这两个
> `JRELEASER_NEXUS2_USERNAME`
> `JRELEASER_NEXUS2_PASSWORD`

:::

::: tip
配置注意，如果是多模块的项目

1. 需要在根目录和子模块都配置相同的配置
2. jreleaser 会根据项目的 .git 目录去获取 release 信息需要配置 gitRootSearch = true 才可以让子模块也获取到 git 信息，因为子模块是一个单独的文件夹，里面没有 .git 目录 😓，详见 [官网 FAQ](https://jreleaser.org/guide/latest/faq.html)，如果没配置就会报错：`org.jreleaser.util.JReleaserException: Could not determine git HEAD when running any commands.`
3. 需要在 ~/.jreleaser/config.toml 里面配置 JRELEASER_GITHUB_TOKEN 字段，也就是你的 github 的 token（说实话，这个操作，给我干懵逼了，也不知道他要干嘛）

:::

::: info
github 生成 token

1. 登录 GitHub，进入个人设置（右上角头像 → Settings）
2. 左侧菜单选择 Developer settings → Personal access tokens → Tokens (classic) → Generate new tokens (classic)
3. 填写令牌描述（如 ghcr-login），并勾选 write:packages
4. 点击 Generate token，保存令牌内容（仅显示一次）
:::

三、命令

```bash
# 1) Verify release & deploy configuration
./gradlew jreleaserConfig
# 2) Ensure a clean deployment
./gradlew clean
# 3) Stage all artifacts to a local directory
./gradlew publish
# 4) Deploy and release
./gradlew jreleaserDeploy
```

### nmcp

可以参照[官方示例](https://github.com/GradleUp/nmcp)

这个就简单了，配置进去，执行命令，完成，并且，还可以设置手动发布模式和自动发布模式，和 maven centeral 仓库的 maven 官方插件 `org.sonatype.central:central-publishing-maven-plugin` 是一样的效果，手动模式执行完命令发布到中央仓库之后，需要登录到 [publishing 页面](https://central.sonatype.com/publishing)确定是否要发布，或者也可以后悔 drop 之后再重新发布，这点很人性化

一、 版本兼容

未发现版本兼容问题，直接使用，但是这个插件自身推荐使用 [vanniktech/gradle-maven-publish-plugin](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)，感兴趣的同学可以看看

二、 配置

```groovy
nmcpAggregation {
    centralPortal {
        username = "${findProperty('mavenCentralUsername') ?: System.getenv('MAVENCENTRAL_USERNAME')}"
        password = "${findProperty('mavenCentralPassword') ?: System.getenv('MAVENCENTRAL_PASSWORD')}"
        // publish manually from the portal
        publishingType = "USER_MANAGED"
        // or if you want to publish automatically
        //publishingType = "AUTOMATIC"
    }

    // Publish all projects that apply the 'maven-publish' plugin
    publishAllProjectsProbablyBreakingProjectIsolation()
}
```

三、 命令

```bash
./gradlew publishAggregationToCentralPortal
# yay everything is uploaded 🎉
# go to https://central.sonatype.com/ to release if you used USER_MANAGED
```

### 总结

官方主要推荐使用 [JReleaser](https://jreleaser.org/guide/latest/examples/maven/maven-central.html#_portal_publisher_api)，但是我这里使用了两种插件，总体使用下来，如果只是简单的推送到 Maven Cetral 仓库的话，我其实更推荐 [GradleUp/nmcp](https://github.com/GradleUp/nmcp)

对比一下

1. JReleaser 上传中央仓库之是一个包一个包的上传的，在中央仓库就是一堆的发布信息，nmcp，是把一个项目的所有包打包一个包上传的整体，和 maven centeral 仓库的 maven 官方插件 `org.sonatype.central:central-publishing-maven-plugin` 是一样的效果
2. JReleaser 需要配置更多的东西，甚至要 github token 这种，我不理解
