---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 多数据库兼容
# 当前页面内容描述
description: 多数据库兼容
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
order: 17
dir:
  order: 17
# 页面图标
icon: "eos-icons:database-migration"
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

# 数据库兼容

::: info
如果前端就知道了有后期更新数据库类型的可能性，便可以在开发的过程就做就好兼容性，方便后续直接切换数据库
:::

## 怎么使用

这里兼容主要是基于 mybatis-plus 提供的便利性

这里，我在 spring-taybct-tool-mybatis 模块里面做了 Mybatis-plus 的基础配置，配置里面就有加入了方言的配置

```java
    @Bean
    public DatabaseIdProvider databaseIdProvider() {
        VendorDatabaseIdProvider databaseIdProvider = new VendorDatabaseIdProvider();
        Properties properties = new Properties();
        properties.put("Oracle", "oracle");
        properties.put("MySQL", "mysql");
        properties.setProperty("PostgreSQL", "postgresql");
        properties.setProperty("DB2", "db2");
        properties.setProperty("SQL Server", "sqlserver");
        databaseIdProvider.setProperties(properties);
        return databaseIdProvider;
    }
```



首先，mybatis-plus 的查询会自动判断数据库，然后这个配置主要是为了在手动写 xml 的时候会用得到：

他会在你的 statement 里面加入一个名为 _databaseId 的字段条件，这个字段的值就是上面配置的值，比如 MySQL 数据库就是 mysql 这样，你可以在写 sql 的时候手动判断，然后再做兼容，比如：

```xml
<if test="_databaseId == 'mysql' or _databaseId == 'postgresql'">
    limit 1
</if>
<if test="_databaseId == 'oracle'">
    and ROWNUM <![CDATA[<]]> 2
</if>
```

还有一种方式就是可以直接在操作标签上面有一个属于去区别：

```xml
<select id="listQuery" resultMap="VOResultMap" databaseId="mysql">
    ...
</select>
<select id="listQuery" resultMap="VOResultMap" databaseId="postgresql">
    ...
</select>
...
```

这个看你的需求来写，如果太多不一样了，可以直接用标签来区别，如果只是小部分不一样就可以直接用 _databaseId

## 注意注意！

在多数据源同时存在的情况下，比如你需要在一个查询里面同时查询多个数据库，那么用上面的`_databaseId`就不行了，因为这个`_databaseId`拿到的是你在配置文件里面配置的当前的主数据库的类型，如果你需要多个数据库的兼容，可以把`_databaseId`修改为`_db_type_db_`==3.2.2==