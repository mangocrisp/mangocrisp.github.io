---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 获取当前登录用户
# 当前页面内容描述
description: 获取当前登录用户
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
order: 6
dir:
  order: 6
# 页面图标
icon: "fa:user-o"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-25
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

# 获取当前登录用户

::: info
很多操作需要配合登录用户才能实现，比如记录是谁操作了接口，判断当前登录用户有没有权限访问接口等,这里特别注意的是，虽然可以直接使用 SecurityUtil 获取到当前用户，但是更建议使用 ISecurityUtil，因为如果是分布式架构微服务，并且使用了 Dubbo，那么他的实现是不一样的，用 SecurityUtil 就无法获取到登录用户了
:::

```java
@AutoConfiguration
public class Cls{

  @Resource
  protected ISecurityUtil securityUtil;

  public void fun(){
    ILoginUser loginUser = securityUtil.getLoginUser();
  }
  
}
```
