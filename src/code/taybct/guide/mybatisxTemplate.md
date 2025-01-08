---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 自动生成业务代码
# 当前页面内容描述
description: 使用 MyBatis 自动生成业务代码
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
icon: "icon-park-twotone:source-code"
# 是否原创
isOriginal: false
# 日期
date: 2024-10-27
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 指南
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 自动生成业务代码

## 插件

首先，需要先安装 `MyBatisX` 插件
[参考 MyBatisX 官方文档](https://baomidou.com/guides/mybatis-x/)

## 模板

`MyBatisX` 需要先使用一次才会有默认的模板生成在，通常是在
`C:\Users\用户名\AppData\Roaming\JetBrains\IntelliJIdea版本号\extensions\com.baomidou.plugin.idea.mybatisx`
的目录下面，可以通过在 `IntelliJ IDEA` 的 `项目`>`临时文件和控制台`>`扩展`>`MyBatisX`>`templates` 下面找到，然后右键可以打开文件所在位置在资源管理器显示
![openideajmybatisxtemplatesfolder.png](/assets/images/blog/openideajmybatisxtemplatesfolder.png)

可以自行修改想要生成怎么样的业务模板，也可以参考直接使用我这边的

- [通用模板（3.2.x 持续更新）](https://jihulab.com/mangocrisp/spring-taybct/-/tree/3.2.x/spring-taybct-common/src/main/resources/MybatisX/templates)
- [通用模板（2.7.x）](https://jihulab.com/mangocrisp/spring-taybct/-/tree/2.7.x/spring-taybct-common/src/main/resources)

 这边集成了一整套的`增删改查`的基础操作（单表），后续还会加入多表的操作的模板更便捷的使用，无脑开发！！！