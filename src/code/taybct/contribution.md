---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 参与贡献
# 当前页面内容描述
description: 如果你有好的想法，欢迎贡献代码。
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
order: -1
dir:
  order: -1
# 页面图标
icon: "tdesign:fork"
# 是否原创
isOriginal: false
# 日期
date: 2025-12-30
# 类别
category:
  - TayBct
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 参与贡献
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 参与贡献

如果你有好的想法，欢迎贡献代码。

## 项目介绍

### 项目成分

[Spring Taybct](https://gitee.com/taybct) 是一个基于 SpringBoot 开发的 Java 后端后台管理业务基础框架，框架分为基础工具类库和业务框架，业务框架。

1. 基础工具类库：

[Spring TayBct Tools](https://gitee.com/taybct/spring-taybct-tools) 是一个Spring 业务组件基础集成的工具类库，对一些常用的中间件做了基础的常用的集成，并且提供一些业务开发过程中常用的功能模块集成，工具类库里面是不含任何业务功能，只是对常用的功能进行了抽象，方便业务开发使用。例如：[消息传递服务](./3.5.x/common/Message)


2. 业务框架：

[Spring Taybct](https://gitee.com/taybct/spring-taybct) 是一个 Spring 业务组件基础集成的基础业务库，对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成，比如：[流程管理](./3.5.x/common/FlowEngine)

### 结构说明

[spring-taybct](https://gitee.com/taybct/spring-taybct) 依赖 [spring-taybct-tools](https://gitee.com/taybct/spring-taybct-tools)，同时又分了两个分支：单体框架和微服务框架，其实原理也很简单，就是多模块的项目，如果是单体项目就不需要和微服务相关的功能，比如 `网关`、`注册中心`、`RPC框架` 等，当想切换到微服务的时候只需要添加上这些模块，即可。

::: info 为什么要这样区分？
在实际开发的过程中，不是所有的项目都需要上微服务，单体就完全够用了，有些项目在前期要快速搭建运行演示的时候也应该是先考虑单体，后续再切换为微服务，这样会方便一些
:::

### 依赖管理

从 3.5.1 开始，Spring Taybct 默认使用 Gradle 管理项目，原有的 Maven 也兼容更新，但是在模块比较多（超过50个模块）的情况下，Maven 构建起来会比较慢，所以推荐使用 Gradle 进行构建

## 如何贡献

如果想贡献代码，应该要有抽象的思维，比如你有个好的想法，那么是否可以复用？是否可以有多种实现？并且你应该为你的抽象的想法做默认的实现？也就是说，当别人不实现你的抽象的时候，应该使用你的默认实现。如果你要实现的功能还需要前端配合，我这边也提供了前端框架可以拿来用：

- [前端框架-gx-web](https://gitee.com/mangocrisp/vue-pure-admin/tree/spring-taybct/)
- [前端演示-vue-pure-admin](https://mangocrisp.top/pureadmin)

当然，因为 Spring Taybct 框架是纯后端框架，所以，你必须为你的后端功能实现写好完整的 OpenAPI 文档，这是个好的习惯，这样，别人就可以通过 OpenAPI 文档来调用你的功能了

::: tip 最重要的
我们开发的通用，基础框架，是要考虑后续别人从 Maven 拉下来之后引用的，所以，请务必将你的代码写好，并且写好文档（注释），这样，更方便别人来调用你的功能
:::

### Fork 仓库

- 如果你没有考虑清楚自己贡献的代码应该是工具类库，还是业务功能，就先把两个都 Fork 下来
- 这边强烈建议使用 Gitee 仓库，因为框架默认就是以 Gitee 仓库为开发仓库，然后分发到 GitHub 和 GitCode，毕竟国内环境，懂得都懂

### 创建分支

框架默认是以 dev 分支为开发分支，如果你要贡献代码，因为以 dev 分支为源分支去创建你自己要贡献代码的分支，这样不会与主仓库有太大的冲突

### 贡献代码

贡献代码，请注意以下几个点：

- 如果你的贡献的代码即有工具类库，也有业务功能，你应该是先在工具类库写完，然后在本地 install 到本地的 maven 仓库，然后再在业务框架里面引用工具类库
- 业务框架的 dev 分支只是放了单纯的业务代码，你可以看到是没有启动类的，因为还需要区分为单体和微服务，所以，你需要将你在 dev 分支开发好的代码合并到对应的 single(单体)或者cloud(微服务)分支，然后再测试功能，或者是在 single(单体)或者cloud(微服务)分支里面测试功能，但是不提交，只拷贝代码到 dev 分支，然后再提交 dev 分支，然后再合并到 single(单体)或者cloud(微服务)分支，==主要就是要保证你的代码是从 dev 分支往另外两个分支去合并的==
- 如果不是专属的单体或者微服务的功能，就只需要提交 dev 分支的代码即可，如果有专属的，只能是单体或者微服务分支，你应该是需要将这些分支都提交
- 如果有涉及到 SQL 操作，请务必兼容以下几种数据库，因为这是目前世面上使用较多的几种数据库：MySQL、PostgreSQL、Oracle、SQLite

::: details 示例

例如，字符串的操作，不同的数据库语法不同

```sql
    <!--部门过滤-->
    <sql id="Dept_Filter">
        <choose>
            <when test="_db_type_db_ == 'postgresql'">
                and CAST(#{_login_user_dept_.id} as VARCHAR) = ANY(STRING_TO_ARRAY(sys_dept.pid_all, ','))
            </when>
            <when test="_db_type_db_ == 'mysql'">
                and FIND_IN_SET(#{_login_user_dept_.id},sys_dept.pid_all)
            </when>
            <when test="_db_type_db_ == 'sqlite'">
                and ',' || sys_dept.pid_all || ',' like '%,' || #{_login_user_dept_.id} || ',%'
            </when>
            <when test="_db_type_db_ == 'oracle'">
                and INSTR(sys_dept.pid_all, TO_CHAR(#{_login_user_dept_.id}))>0
            </when>
        </choose>
    </sql>
```

:::

- 如果需要对配置文件(Nacos 配置文件 | yaml 配置文件)有改动，或者有 SQL 语句更新，请将这些文件放到 `项目目录/_ini/xxx` 目录下，文件格式以 `xxx.sql` 或 `xxx.yml` 或者其他格式，主要是你需要在文件的顶部添加好说明，我到时候审查的时候会把这些文件配置好进行测试

::: warning 注意
在 3.5.1 以后的版本是兼容了 Gradle 和 Maven 两种依赖管理的，所以你贡献的代码如果需要涉及到依赖管理，请将两种方式都要兼容，这样，在切换依赖管理方式时，不会出现兼容性问题
:::

### Pull Requests

1. 将你贡献的工具类库、业务框架（dev/single/cloud）代码提交到对应的分支
2. 创建 PR 请求，在请求的说明里面填写你贡献的代码的说明以及如何去测试
3. 等待审核

### 后续处理

在审核通过之后，就能在主仓库看到你贡献的代码了，我会在后续合适的时候将这些代码统一打包到 maven 中央仓库，到时候就可以直接使用 maven 引入了。

### 业务框架的使用

- 当 [spring-taybct](https://gitee.com/taybct/spring-taybct) 发布的同时，会将代码同时发布到 [spring-taybct-cloud](https://gitee.com/taybct/spring-taybct-cloud) 和 [spring-taybct-single](https://gitee.com/taybct/spring-taybct-single) 两个仓库，其实也就是 [spring-taybct](https://gitee.com/taybct/spring-taybct) 的那两个分支（single、cloud）。
- 然后这两个仓库会将代码打包成 Maven Archetype 模板发布到 Maven 中央仓库，这样，别人就可以使用 Maven 引入 [spring-taybct-cloud](https://gitee.com/taybct/spring-taybct-cloud) 或者 [spring-taybct-single](https://gitee.com/taybct/spring-taybct-single) 仓库的代码了。
- 当然，如果希望后续继续获取到 [spring-taybct](https://gitee.com/taybct/spring-taybct) 的同步更新，我这里是建议以模板项目的形式来 Fork [spring-taybct-cloud](https://gitee.com/taybct/spring-taybct-cloud) 或者 [srping-taybct-single](https://gitee.com/taybct/spring-taybct-single) 仓库，这样，后续只要源仓库发布更新了，Fork 了的仓库也可以得到同步更新
