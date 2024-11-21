---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: IntelliJ IDEA 的一些配置使用
# 当前页面内容描述
description: IntelliJ IDEA 的一些配置使用
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
order: 4
dir:
  order: 4
# 页面图标
icon: "simple-icons:intellijidea"
# 是否原创
isOriginal: false
# 日期
date: 2024-11-21
# 类别
category:
  - 代码笔记
tag:
  - 知识
  - 分享
  - 开发工具
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# IntelliJ IDEA 的一些配置使用

## 插件

### CodeGlance Pro

**一款非常好用的代码查看工具**

类似 VSCode 的右边可以在屏幕的右边看粗略的代码，快速移动到对应位置

### Maven Helper

**快速定位到有有问题的依赖**

很多时候，代码运行不了，出一些莫名其妙的问题，可能是依赖冲突导致的，如果想查看对应的模块引用了哪些依赖，有没有冲突，等，可以快速定位到，并且便捷的解决冲突（排除冲突的依赖）

**使用方法**

打开 `pom.xml` 点击下面的的 `Dependency Analyzer`

### MyBatisLog Free

**非常好用的 SQL 执行调试工具**

在使用 MyBastis/MyBatisPlus 做为数据库查询工具时，通常我们想知道接口执行了什么 SQL，是复制控制台输出的 SQL 语句，然后放到 Navicat 等数据库客户端去执行，但是一般复制出来的 SQL 语句的参数都是以问题（?）的形式表示的，例如：

```sql
select * from a where id = ?
```

这样，我们就得再把 SQL 执行的的参数复制过去替换掉问题（?）这样，如果参数比较多的情况，就比较繁琐了，`MyBatisLog Free` 很好的解决了这个问题，并且在在 `MyBatisLog Free` 的输出里面只会有 SQL 输出，这样可以更专注的拿到自己想要的 SQL

**使用方法**

只需要在 `IntelliJ IDEA` 的 `工具栏` 里面点击 `MyBatis Log Plugin`
![IntelliJIDEAToolsMyBatisLog.png](/assets/images/blog/IntelliJIDEAToolsMyBatisLog.png)

### MyBatisX

**非常好用的业务代码生成工具**

[MyBatisX 官方文档](https://baomidou.com/guides/mybatis-x/)

## 配置

### 配置自动生成 serialVersionUID

很多时候我们的实体类，如果实现了`Serializable`接口，需要给这个实体类添加一个`serialVersionUID`便于后续对数据进行序列化/反序列化操作，如果想要快速的得到一个序列化 id，可以使用这个功能

![ideaAutoSerialVersionUID.png](/assets/images/blog/ideaAutoSerialVersionUID.png)

勾选上这个之后，如果有类实现了`Serializable`接口，但是还没有明确的指定`serialVersionUID`，`IDEA` 就会给出一个警告：

![donothaveserialVersionUID.png](/assets/images/blog/donothaveserialVersionUID.png)

这个时候，使用这个警告里的`更多操作`(`Alt+Enter`)就可以在这个类里面创建常量字段`serialVersionUID`，他会生成一个随机的long类型数字

### 代码模板

很多时候，我们创建一些 Java 类/文件的时候希望带上一些信息，比如创作者，创建时间，注释等，可以使用代码模板来自动生成

![ideajcodetemplate.png](/assets/images/blog/ideajcodetemplate.png)

并且，我这里有一个`DESC`的变量，是需要在创建文件的时候就强制要手动输入的

![ideajcodetemplateDESC.png](/assets/images/blog/ideajcodetemplateDESC.png)

就是说，你创建这个类，至少得说明为什么创建吧

### 我的 IntelliJ IDEA 配置

[settings.zip](/assets/other/settings.zip)

下载这个`zip`包之后在`i`里面导入就行了
![ideajimportsettings.png](/assets/images/blog/ideajimportsettings.png)