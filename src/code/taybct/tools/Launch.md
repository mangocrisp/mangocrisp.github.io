---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 启动模块
# 当前页面内容描述
description: 启动模块
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
icon: "material-symbols:rocket-launch"
# 是否原创
isOriginal: false
# 日期
date: 2025-06-06
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 轮子
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 启动模块

可以在需要启动运行的模块里面添加这个依赖

```xml
<!--启动模块-->
<dependency>
    <groupId>io.github.mangocrisp</groupId>
    <artifactId>spring-taybct-tool-launch</artifactId>
</dependency>
```

- 加入了一个 banner.txt 
- 打印一些启动信息
- 配置了基础的 logback-spring.xml
- 依赖了 Spring 测试相关的  dependency 以及 `Skywalking`

![架构图](/assets/images/taybct/launch.png)

![架构图](/assets/images/taybct/launch-2.png)