---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: RecordHistory
# 当前页面内容描述
description: RecordHistory
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
order: 12
dir:
  order: 12
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

# RecordHistory

表操作历史记录注解，对数据库做更新操作（增，删，改）之前对数据进行备份历史

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | String | 否 | "" | 指定要记录的对象,如果不指定，默认就会拿第一个参数 |
| clazz | `Class<?>` | ==是== |  | 类型，数据库对象实体类 |
| tableName | String | 否 | "" | 表名，如果不指定就会默认根据 MybatisPlus 的注解 |
| primaryKey | String | 否 | "" | 主键名，这里默认是 id，如果找不到 id 也会根据 MybatisPlus 的注解 |
| pkTypes | int | 否 | java.sql.Types.BIGINT | 主键数据库类型 |
| operateType | int | 否 | DataOperateType.UPDATE | 操作类型 |
| dataSource | String | 否 | "" | 多数据源，数据源 |
| historyTableName | String | 否 | "sys_history_record" | 将要把历史记录保存到哪个表 |

### DataOperateType

数据库操作类型常量

| 常量 | 值 | 说明 |
|:--:|:--:|:--:|
|OTHER|-1|其它|
|QUERY|0|查询|
|INSERT|1|新增|
|UPDATE|2|修改|
|DELETE|3|删除|
|CLEAN|4|清空数据|

### dataSource

::: tip dataSource

如果不指定就会拿当前默认的数据源来操作，或者，如果有使用多数据源的注解 @DS 来改变也当前方法的数据源，这里就会默认使用 @DS 注解设置的数据源来操作数据 如果指定了就以这个指定的值优先级最高，所以优先级顺序大概是:

默认数据源 < @DS < dataSource

::: 

## 使用说明

一般放在`MapperInterface`的接口的方法上

```java

public interface EntityMapper extends BaseMapper<Entity> {

    @RecordHistory(clazz = Entity.class, historyTableName = "entity")
    default int updateByIdWithRecordHistory(Entity entity) {
        return updateById(entity);
    }

}

```

::: warning 慎用

这个功能目前只能记录单表的一行数据的历史，注意是历史数据，也就是修改之前的数据

:::