---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: WebLog
# 当前页面内容描述
description: WebLog
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
order: 18
dir:
  order: 18
# 页面图标
icon: "catppuccin:java-annotation"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-19
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 注解
  - 请求日志
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# WebLog

用来标识，某个接口是否要打印请求参数和返回结果

## 使用说明

需要配置日志输出级别

```yaml
logging:
  level:
    io.github.mangocrisp.spring.taybct.tool.core.aop: DEBUG
```
