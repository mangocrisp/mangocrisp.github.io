---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: TableFieldJSON
# 当前页面内容描述
description: TableFieldJSON
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
order: 16
dir:
  order: 16
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
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# TableFieldJSON

用户来标识实体类的某个字段是否是数据库的`JSON`字段，这个只会在如果使用的数据是[PostgreSQL](https://www.postgresql.org/)的时候才使用

## 使用说明

这个注解会在往数据库的表的这个`JSON`字段插入数据的时候将插入的字符串类型数据转换成`PGobject`😑😑`PostgreSQL`的驱动要求`JSON`数据只能这样子插入，因为`PostgreSQL`对类型很敏感，不能像`MySQL`一样直接插入字符串，所以这个注解就是协助做了这个转换的工作

```java
/**
     * 获取 JSON 字段的值
     *
     * @param ms         调用的方法
     * @param fieldValue 字段值
     * @return 最终结果
     */
    public static Object getJSONFieldValue(MappedStatement ms, Object fieldValue) {
        DbType dbType = DbType.getDbType(ms.getConfiguration().getDatabaseId());
        if (Objects.requireNonNull(dbType) == DbType.POSTGRE_SQL) {
            // 如果是 pgsql 需要做额外处理
            if (fieldValue instanceof String) {
                PGobject pGobject = new PGobject();
                pGobject.setType("json");
                try {
                    pGobject.setValue((String) fieldValue);
                    fieldValue = pGobject;
                } catch (SQLException e) {
                    log.trace(e.getMessage(), e);
                }
            }
        }
        // 后面再添加其他数据库的兼容，这里先兼容 pgsql
        return fieldValue;
    }
```
