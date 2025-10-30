---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 租户模式
# 当前页面内容描述
description: 租户模式
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
icon: "arcticons:tenantcloud-pro"
# 是否原创
isOriginal: false
# 日期
date: 2025-02-13
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

# 租户模式

::: info
为了隔离用户业务数据，需要用到租户模式，这里，基础框架使用了 mybatis-plus 的租户模式，主要就是使用一个 tenant_id 来逻辑隔离数据，写 sql 的时候不需要加入 tenant_id 这个字段去查询，只要 mybatis-plus 配置了某个表是租户表，就会默认追加一个 tenant_id 去操作数据（CUDR）
:::

## 怎样实现租户模式

框架默认是有租户模式，如果不配置多个租户，默认大家都是 tenant_id 值为 000000 的租户，只需要在配置文件里面配置租户模式的信息就好了

```yaml
taybct:
  tenant:
    # 开启租户模式
    enable: true
    # 租户 id 字段
    tenant-id-column: tenant_id
    # 哪些表是租户表
    tenant-tables:
      - sys_role
```

## 怎样使用

这里，只要配置好哪些表是租户表就行了，然后如果指定某个表是租户表，你的表里面就一定要有配置好的 taybct.tenant.tenant-id-column 字段


## 忽略租户过滤

如果独某个 mapper 的接口不想使用租户模式的话，可以添加这个注释`@InterceptorIgnore(tenantLine = "true")`

```java
    /**
     * 添加微信用户
     *
     * @param user 用户信息
     */
    @InterceptorIgnore(tenantLine = "true")
    int addWechatUser(@Param("user") Map<String, Object> user);
```

## 其他

[多租户插件 | MyBatis-Plus (baomidou.com)](https://baomidou.com/pages/aef2f2/)
