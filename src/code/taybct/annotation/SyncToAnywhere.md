---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: SyncToAnywhere
# 当前页面内容描述
description: SyncToAnywhere
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
order: 20
dir:
  order: 20
# 页面图标
icon: "catppuccin:java-annotation"
# 是否原创
isOriginal: false
# 日期
date: 2025-01-16
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

# SyncToAnywhere

将对数据库的单表的简单的增删改查操作同步到任何处，可以是 NoSQL，可以是文件，甚至可以是其他第三方的接口，这些也全都可以自定义如何去实现

::: info
目前只支付简单的批量新增，修改，和删除，也就是单表的，更新也只能按 id 更新数据，查询就默认是会分页的，也就是说会把分页参数也一起传给接口，怎么实现，怎么查询，这些可以自定义
:::

## 使用说明

注解在需要同步进行操作的方法上面，可以是`Service`也可以是`MapperInterface`的方法

## 参数说明

| 参数 | <div style="width:400px">类型</div> | <div style="width:100px">必须</div> | 默认 | <div style="width:290px">说明</div> |
|:----:|:----:|:----:|:----:|:----:|
| value | String | 否 | "" | 需要操作的数据，新增，修改，删除或者查询的这些操作的数据，如果不指定，默认拿方法的第一个参数 |
| dto | String | 否 | "" | 非查询的数据，新增，修改，或者删除的这些操作的数据，如果不指定，默认拿方法的第一个参数 |
| params | String | 否 | "" | 查询的参数数据如果不指定，默认拿方法的第一个参数 |
| page | String | 否 | "" | 查询的时候如果有分页，可以用来指定哪个是分页参数，默认拿方法的第二个参数，如果没有就是不指定分页参数 |
| type | SimpleDBOperateType | 否 | SimpleDBOperateType.UNKNOWN | 简单操作类型，也就是标明这个方法执行的是什么操作 |
| handler | Class<? extends SyncToAnywhereHandler>[] | 否 | {} | 数据同步处理器，如果 type 是 SELECT，只拿第一个 |
| convert | Class<?>[] | 否 | {} | 不同的处理器处理数据时需要特定的数据类型，这里用来指定需要转换的数据类型，和处理器的数据顺序一致 |
| queryConditionHandler | Class<? extends QueryConditionHandler> | 否 | DefaultQueryConditionHandler.class | 查询条件处理器，不同的数据源查询条件不同 |
| queryDataClass | Class<?> | 否 | Void.class | 查询的数据的类型，如果是查询接口，这个就必须要指定，不然就按原本的接口查询 |
| queryResultConverter | Class<?> | 否 | Void.class | 返回结果类型转换，查询回来的结果类型，不指定就不转换 |
| executeAsync | boolean | 否 | true | 是对增，删，改进行异常操作 |

### SimpleDBOperateType

简单数据库操作

| 值 | 说明 |
|:--:|:--:|
|UNKNOWN|未定义|
|INSERT|新增|
|UPDATE|修改|
|DELETE|删除|
|TOTAL|查询数量|
|PAGE|查询分页|

## 配置

::: details 这里以 MongoDB 做为示例

添加`MongoDB`依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

配置`SyncToMongoHandler`（框架自带的，注解也是基于这个去写的抽象）

```java
@AutoConfiguration
@AutoConfigureOrder(Ordered.LOWEST_PRECEDENCE)
public class SystemModuleConfig {
    @Bean
    public SyncToMongoHandler<? extends Serializable,? extends SyncToAnywhereDTO<? extends Serializable>> syncToAnywhereMongoHandler(
            MongoTemplate mongoTemplate
    ){
        return new SyncToMongoHandler<>(mongoTemplate);
    }
}
```

创建一个`MongoDB`传输数据用的`DTO`，实现`SyncToAnywhereDTO`

```java
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Schema(description = "mongo db 数据传输对象")
@Document(collection = "t_vue_template")
public class VueTemplateMGDTO extends VueTemplate implements SyncToAnywhereDTO<Long> {

    @Serial
    private static final long serialVersionUID = -6417719277859772488L;

    /**
     * 主键id
     */
    @Id
    @TableId("id")
    @Schema(description = "主键")
    @JsonSerialize(using = ToStringSerializer.class)
    @TableFieldDefault(handler = TableFieldDefaultPKHandler.class)
    private Long id;

}
```

创建一个用户查询的`QueryConditionHandler`

```java
public class VueTemplateMGQueryHandler implements QueryConditionHandler<VueTemplateMGDTO> {

    @Override
    public Object where(Object condition, MybatisOptional<VueTemplateMGDTO> mybatisOptional) {
        List<Criteria> andCriteria = new ArrayList<>();
        JSONObject params = mybatisOptional.getParams();
        if (params != null) {
            JSONObject dto;
            if ((dto = params.getJSONObject("vueTemplateQueryDTO")) != null) {
                dto.forEach((k, v) -> {
                    if (ObjectUtil.isNotEmpty(v)) {
                        if (k.endsWith("_ge")) {
                            andCriteria.add(Criteria.where(k.replace("_ge", "")).gte(LocalDateTimeUtil.parse(v.toString(), DateConstants.format.YYYY_MM_DD_HH_mm_ss)));
                        } else if (k.endsWith("_le")) {
                            andCriteria.add(Criteria.where(k.replace("_le", "")).lte(LocalDateTimeUtil.parse(v.toString(), DateConstants.format.YYYY_MM_DD_HH_mm_ss)));
                        } else if (k.equals("idCollection") || k.equals("status")) {
                            andCriteria.add(Criteria.where(k.replace("Collection", "")).in(JSONArray.parseArray(JSONArray.toJSONString(v))));
                        } else {
                            andCriteria.add(Criteria.where(k).is(v));
                        }
                    }
                });
            }
        }
        Criteria criteria = new Criteria().andOperator(andCriteria);
        ((Query) condition).addCriteria(criteria);

        return condition;
    }

    @Override
    public Object page(Object condition, MybatisOptional<VueTemplateMGDTO> mybatisOptional) {
        SqlPageParams sqlPageParams = mybatisOptional.getPage();
        // 指定只查询某些字段
        //((Query) condition).fields().include("id");
        // 分页
        int pageNumber = sqlPageParams.getPageNum().intValue() - 1;
        if (pageNumber < 0) {
            pageNumber = 0;
        }
        ((Query) condition).with(PageRequest.of(pageNumber, sqlPageParams.getPageSize().intValue()));
        return condition;
    }

    @Override
    public Object sort(Object condition, MybatisOptional<VueTemplateMGDTO> mybatisOptional) {
        SqlPageParams sqlPageParams = mybatisOptional.getPage();
        // 排序
        ArrayList<Sort.Order> orders = new ArrayList<>();
        if (CollectionUtil.isNotEmpty(sqlPageParams.getSort())) {
            sqlPageParams.getSort().forEach(sort -> {
                String[] fieldOrder = sort.split(Constants.SPACE);
                String field = fieldOrder[0];
                if (fieldOrder.length > 1) {
                    String order = fieldOrder[1];
                    if (order.equalsIgnoreCase(Constants.ASC)) {
                        orders.add(Sort.Order.asc(field));
                    } else {
                        orders.add(Sort.Order.desc(field));
                    }
                } else {
                    orders.add(Sort.Order.asc(field));
                }
            });
        }
        ((Query) condition).with(Sort.by(orders));
        return condition;
    }
}
```

然后在MapperInterface接口方法的上加上注解

```java
public interface VueTemplateMapper extends BaseMapper<VueTemplate> {

    @Override
    @SyncToAnywhere(type = SimpleDBOperateType.INSERT, convert = VueTemplateMGDTO.class, handler = SyncToMongoHandler.class)
    int insert(VueTemplate entity);

    @Override
    @SyncToAnywhere(type = SimpleDBOperateType.DELETE, convert = VueTemplateMGDTO.class, handler = SyncToMongoHandler.class)
    int deleteById(Serializable id);

    @Override
    @SyncToAnywhere(type = SimpleDBOperateType.UPDATE, convert = VueTemplateMGDTO.class, handler = SyncToMongoHandler.class)
    int updateById(@Param(com.baomidou.mybatisplus.core.toolkit.Constants.ENTITY) VueTemplate entity);

    /**
     * 查询 Map 列表
     *
     * @param mybatisOptional MyBatis 可选项
     * @return 返回列表数据
     */
    @MapKey("t_vue_template_id")
    List<Map<String, Object>> listMap(@Param(Constants.MYBATIS_OPTIONAL) MybatisOptional<? extends VueTemplate> mybatisOptional);

    /**
     * 根据条件批量更新
     *
     * @param mybatisOptional MyBatis 可选项
     * @return 影响的行数
     */
    int updateBatchByCondition(@Param(Constants.MYBATIS_OPTIONAL) MybatisOptional<? extends VueTemplate> mybatisOptional);

    /**
     * 查询记录条数
     *
     * @param mybatisOptional MyBatis 可选项
     * @return 数量
     */
    @SyncToAnywhere(type = SimpleDBOperateType.TOTAL
            , handler = SyncToMongoHandler.class
            , queryConditionHandler = VueTemplateMGQueryHandler.class
            , queryDataClass = VueTemplateMGDTO.class
            // 因为 VueTemplateMGDTO 也是继承 VueTemplate 的所以这里可以不用指明
            // , queryResultConverter = VueTemplate.class
    )
    long total(@Param(Constants.MYBATIS_OPTIONAL) MybatisOptional<? extends VueTemplate> mybatisOptional);

    /**
     * 分页查询
     *
     * @param mybatisOptional MyBatis 可选项
     * @return 分页数据
     */
    @SyncToAnywhere(type = SimpleDBOperateType.PAGE
            , handler = SyncToMongoHandler.class
            , queryConditionHandler = VueTemplateMGQueryHandler.class
            , queryDataClass = VueTemplateMGDTO.class
            // 因为 VueTemplateMGDTO 也是继承 VueTemplate 的所以这里可以不用指明
            // , queryResultConverter = VueTemplate.class
    )
    List<? extends VueTemplate> page(@Param(Constants.MYBATIS_OPTIONAL) MybatisOptional<? extends VueTemplate> mybatisOptional);

    /**
     * 查询单个
     *
     * @param mybatisOptional MyBatis 可选项
     * @return 元素标签详情
     */
    <E extends VueTemplate> E detail(@Param(Constants.MYBATIS_OPTIONAL) MybatisOptional<? extends VueTemplate> mybatisOptional);

}
```

:::

## 注意

::: warning
如果是用了 MyBaticPlus 的方法，这里需要继承之后把该有的注解都加上
:::