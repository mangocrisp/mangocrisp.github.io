---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 发布包到 Maven Central 仓库
# 当前页面内容描述
description: 需要将自己的一些组件发布到 Maven 中央仓库以供后续复用
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
order: 3
dir:
  order: 3
# 页面图标
icon: "fluent-mdl2:apache-maven-logo"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-20
# 类别
category:
  - 参考
# 标签
tag:
  - 知识
  - 分享
  - Maven
  - 依赖管理
# 页面顶上的图片
cover: https://central.sonatype.com/maven-central-logo.svg
---

# 发布包到 Maven Central 仓库

## 1、注册

官网地址：https://central.sonatype.com/

## 2、新建命名空间

命名空间规则：

```
GitHub io.github.myusername
GitLab io.gitlab.myusername
Gitee io.gitee.myusername
Bitbucket io.bitbucket.myusername
```

如果有域名的可以绑定域名，但是这里省事，可以直接使用软件仓库来命名个人仓库

## 3、验证命名空间

这个就是按要求在软件仓库创建一个新的仓库，名称就是创建命名空间之后得到的 Verification Key，这个仓库后面可以直接删除，因为他只是为了来验证唯一性。创建完这个仓库之后回到列表去点右边三个点点里面有验证选项，然后验证通过之后图标就变绿了就正常了

## 4、创建push的账号和密码

点击右上角的view account，然后 Generate User Token，这里会自动生成 maven 的 settings 配置

## 5、Maven settings.xml 配置

```xml
<settings>
    <servers>  
        <!--这里配置的是公司中央仓库代码-->
        <server>
            <!--${server}随意命名，确保唯一,后面 pom.xml 里面会用到-->
            <id>${server}</id>
            <username>xxx</username>
            <password>xxx</password>
        </server>
    </servers>
</settings>
```

## 6、GPG

### 下载地址

https://gnupg.org/download/index.html

> [!tip]
> 如果 pc 上已下载安装了 [Git](https://git-scm.com/downloads)，可以直接使用 Git Bash 的 gpg 命令

### 命令

```bash
gpg --gen-key
```
生成秘钥，输入名称和邮箱地址，名称就是你的代码仓库的用户名，邮箱写一个你自己的邮箱就行

敲完之后会要求输入密码，这个密码一定要记住，后面推送到仓库的时候需要用到的，并且基本每次推送都需要这个密码，而且不能写死（maven不推荐你写死）

[Apache Maven GPG Plugin – Usage](https://maven.apache.org/plugins/maven-gpg-plugin/usage.html)

```bash
gpg --keyserver hkps://keyserver.ubuntu.com --send-keys xxx
```
发布公钥，上一步生成秘钥之后会得到一串字符串 pub  xxx，这就是公钥

```bash
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys xxx
```

验证公钥

输入如下表示成功

```bash
gpg: key xxx: "xxx xxx" not changed
gpg: Total number processed: 1
gpg:              unchanged: 1
```

```bash
gpg --list-keys
```

查看本地所有的 keys

### 配置 Maven settings.xml 文件

::: details settings.xml

```xml
<settings>
     <profiles>
          <profile>
              <properties>
                  <gpg.keyname>keyname</gpg.keyname>
              </properties>
          </profile>
    </profiles>
</settings>
```

:::

需要在 profile 里面配置生成 key 时的 name

## 7、pom.xml

::: details pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies-parent</artifactId>
        <version>3.0.1</version>
    </parent>

    <groupId>io.github.mangocrisp</groupId>
    <artifactId>spring-taybct-tools</artifactId>
    <version>3.2.0-alpha.1</version>
    <name>Spring TayBct Tools</name>
    <description>Spring TayBct Tools</description>
    <url>https://github.com/mangocrisp/spring-taybct-tools</url>
    <packaging>pom</packaging>

    <licenses>
        <license>
            <name>The Apache Software License, Version 2.0</name>
            <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
        </license>
    </licenses>

    <organization>
        <name>io.github.mangocrisp</name>
        <url>https://github.com/mangocrisp</url>
    </organization>

    <developers>
        <developer>
            <id>crisp</id>
            <name>Mango Crisp</name>
            <email>15014633363@163.com</email>
            <url>https://mangocrisp.github.io</url>
            <roles>
                <role>Project Manager</role>
                <role>Architect</role>
            </roles>
            <organization>io.github.mangocrisp</organization>
            <organizationUrl>https://github.com/mangocrisp</organizationUrl>
            <timezone>Asia/Shanghai</timezone>
        </developer>
    </developers>

    <scm>
        <connection>scm:git:https://github.com/mangocrisp/spring-taybct-tools.git</connection>
        <developerConnection>scm:git:https://gitee.com/mangocrisp/spring-taybct-tools.git</developerConnection>
        <url>https://github.com/mangocrisp/spring-taybct-tools</url>
    </scm>

    <properties>
        <!--spring boot 版本依赖-->
        <spring-boot-maven-plugin.version>3.2.5</spring-boot-maven-plugin.version>
        <!--central 发布插件-->
        <central-publishing-maven-plugin.version>0.5.0</central-publishing-maven-plugin.version>
        <!--maven 插件-->
        <maven-compiler-plugin.version>3.13.0</maven-compiler-plugin.version>
        <!--Gpg Signature 插件-->
        <maven-gpg-plugin.version>3.2.5</maven-gpg-plugin.version>
        <!-- javadoc插件 -->
        <maven-javadoc-plugin.version>3.8.0</maven-javadoc-plugin.version>
        <!--maven 源码插件-->
        <maven-source-plugin.version>3.3.1</maven-source-plugin.version>
    </properties>

    <dependencyManagement>
        <dependencies>

        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <!--spring boot 打包插件-->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot-maven-plugin.version}</version>
                <configuration>
                    <finalName>${project.build.finalName}</finalName>
                    <!-- spring-boot:run 中文乱码解决 -->
                    <jvmArguments>-Dfile.encoding=UTF-8</jvmArguments>
                    <skip>true</skip>
                    <!--打包本地 jar 包到-->
                    <includeSystemScope>true</includeSystemScope>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- 指定maven编译的jdk版本,如果不指定,maven3默认用jdk 1.5 maven2默认用jdk1.3 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <!-- 一般而言，target与source是保持一致的，但是，有时候为了让程序能在其他版本的jdk中运行(对于低版本目标jdk
                    ，源代码中不能使用低版本jdk中不支持的语法)，会存在target不同于source的情况 -->
                    <!-- 源代码使用的JDK版本 -->
                    <source>${java.version}</source>
                    <!-- 需要生成的目标class文件的编译版本 -->
                    <target>${java.version}</target>
                    <!-- 字符集编码 -->
                    <encoding>${project.build.sourceEncoding}</encoding>
                    <showWarnings>true</showWarnings>
                    <compilerArgs>
                        <arg>-parameters</arg>
                    </compilerArgs>
                </configuration>
            </plugin>
            <!--打包源码插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>${maven-source-plugin.version}</version>
                <executions>
                    <execution>
                        <phase>compile</phase>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!-- javadoc插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>${maven-javadoc-plugin.version}</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <!--central 发布插件-->
            <plugin>
                <groupId>org.sonatype.central</groupId>
                <artifactId>central-publishing-maven-plugin</artifactId>
                <version>${central-publishing-maven-plugin.version}</version>
                <extensions>true</extensions>
                <configuration>
                    <publishingServerId>taybct</publishingServerId>
                </configuration>
            </plugin>
            <!-- Gpg Signature -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>${maven-gpg-plugin.version}</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                        <configuration>
                            <useAgent>true</useAgent>
                            <!--<passphraseServerId>${gpg.keyname}</passphraseServerId>-->
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

:::

## 8、发布

```bash
mvn install -DskipTests=true
```

先本地测试 install 如果通过看见 BUILD SUCCESS 之后就可以调用 deploy

```bash
mvn deploy -DskipTests=true
```

同样出现 BUILD SUCCESS，说明已经推送到仓库的 Deployments 部署了，可以上去查看情况，然后可以发布或者是删除

[Maven Central: Publishing (sonatype.com)](https://central.sonatype.com/publishing/deployments)

## 9、使用发布成功的 maven 依赖

中央仓库发布成功之后，其他镜像仓库例如：阿里云镜像仓库会跟着同步中央仓库的依赖，但是这个不是实时的，没那么及时，所以，如果想马上看到效果，你需要在 maven settings.xml 里面配置

::: details settings.xml

```xml
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
```
:::