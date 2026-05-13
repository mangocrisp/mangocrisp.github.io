---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: RBAC
# 当前页面内容描述
description: RBAC
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
order: 25
dir:
  order: 25
# 页面图标
icon: "eos-icons:role-binding"
# 是否原创
isOriginal: false
# 日期
date: 2025-10-29
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Boot"
  - "Spring Cloud"
  - 开发框架
  - 指南
  - RBAC
  - 权限
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 基于角色的权限控制（Role Based Access Control）

角色权限控制（RBAC）是一种基于角色的权限控制方式，它将用户分配给不同的角色，每个角色都有一组权限，用户只能访问自己角色所拥有的权限。

## 角色

角色是权限控制中的核心概念，它表示一组权限。

## 权限

权限是角色所拥有的权限，它表示用户可以执行的操作。

### 菜单权限（查看权限）

菜单权限表示用户可以查看的菜单。

### 接口权限（操作权限）

在前端来看表示用户可以点击哪些按钮进行操作，在后端来看表示用户可以访问哪些接口进行操作。

## E-R 模型

![RBAC-E-R](/assets/images/taybct/rbac-er.png)

## 前端菜单，按钮控制

前端的权限控制，是前端根据权限控制，控制菜单和按钮的显示，可以参考：

[Pure-Admin 的权限控制方案](https://pure-admin.cn/pages/RBAC/)

[菜单权限 ::mdi:github::](https://github.com/mangocrisp/vue-pure-admin/blob/main/src/router/index.ts#L168-L177)
[菜单权限 ::simple-icons:gitee::](https://gitee.com/mangocrisp/vue-pure-admin/blob/main/src/router/index.ts#L168-L177)

[按钮权限 ::mdi:github::](https://github.com/mangocrisp/vue-pure-admin/blob/main/src/router/utils.ts#L455)
[按钮权限 ::simple-icons:gitee::](https://gitee.com/mangocrisp/vue-pure-admin/blob/main/src/router/utils.ts#L455)

## 后端接口权限控制

前端的权限控制始终是只能控制菜单和按钮的显示，不能控制接口的访问。如果是懂一些前端的可以研究一下，来通过一些操作把按钮或者菜单给显示出来，这时候如果后端没有做严格的控制，那就很危险了。


框架已经提供了权限控制。

- [x] 无需在每个接口上配置权限，框架会自动根据角色关联的配置为每个接口配置权限，完全无代码侵入。
- [x] 权限的控制是动态的，后面如果某个接口的权限发生了变化，需要修改代码，直接角色配置一下就能生效。

### 开放模式（默认）

意思就是说

- 如果有一个新接口，他没有被配置给任何角色，那么这个接口就是默认是开放的，任何角色都可以访问。
- 如果配置给了角色，那么只有被配置的角色才能访问。
- 顶级角色可以访问所有接口。

```yaml
taybct:
  secure:
    allow-when-no-match: true  
```

### 封闭模式

- 反之，如果一个接口没有被配置给任何角色，那么这个接口就是默认是封闭的，任何角色都不可以访问。
- 如果配置给了角色，那么只有被配置的角色才能访问。
- 顶级角色可以访问所有接口。

```yaml
taybct:
  secure:
    allow-when-no-match: false
```

::: danger 注意注意！
安全考虑，如果用于生产环境，请务必不要将顶级角色开放出去，或者直接把顶级角色给禁用掉。
:::

## 尝试一下

[示例](https://8.148.188.198/pureadmin/)]