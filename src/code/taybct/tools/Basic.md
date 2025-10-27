---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 通用业务代码
# 当前页面内容描述
description: 通用业务代码
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
order: 1
dir:
  order: 1
# 页面图标
icon: "mdi:web"
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

# 通用业务代码

::: info
对于数据库表的增删改查，这里封装了通用的抽象类，方便后续业务开发，这里，主要封装了通用的增删改查方法，以及通用的分页查询方法
:::

## 数据库表实体类

### BaseEntity

基础实体类，包含主键、创建时间、更新时间、创建人、更新人五个基础字段，以及一个非数据库扩展字段`expansion`用于扩展数据传输等

### DeleteLogicEntity

基础逻辑删除实体类，包含逻辑删除字段`is_deleted`

### UniqueDeleteLogic

带唯一索引的逻辑删除

::: tip
这个实体类的作用，要和数据库结合起来发挥。如果我们设计的表是逻辑删除的表，但是表里面有一些的唯一索引，对应的字段是唯一的 但是删除是逻辑删除，这样，如果删除后，再建一个同名字段的就会报唯一约束的错了，所以这个字段是为了在逻辑的删除的时候把一个 可以确定唯一的值放入，比如这条数据的主键，然后所有这个表折唯一索引，不管是有几个字段，都把这个字段加上，这样的话，就算是 逻辑删除也能确保他是唯一的，删除后是唯一的，再加个同名的也不会有影响了
:::

## 控制器

### BaseController

基于数据库表实体类的控制器抽象类，封装了通用的增删改查方法，以及通用的分页查询方法，继承自动就拥有了所有的方法

### ModelConvertibleController、LongKeyConvertibleController

字面意思，可以支持模型转换的控制器。
我们在实际业务中，基于数据库表创建的 bean 的字段基本都是和数据库的列字段一一对应的，数据会在前后端互相传输，所以，在传输过程中，别有用心的人会根据数据结构以及字段来猜测出来实际数据库表的字段信息，从而实施一些篡改数据的攻击操作，所以需要限制传输的字段，同时又需要保存到数据库，就得转换成 bean。

继承 ModelConvertibleController 之后，需要根据 super 类里面的说明加上对应的 @\*Mapping 注解

::: details 示例代码

```java
@Tag(name = "数据同步控制器")
@RestController
@RequestMapping("/v1/dataSync")
@RequiredArgsConstructor
public class DataSyncController implements LongKeyConvertibleController<DataSync
        , IDataSyncService
        , DataSyncQueryBody
        , DataSyncAddDTO
        , DataSyncUpdateDTO> {

    final IExcelService excelService;

    @Operation(summary = "手动同步")
    @WebLog
    @RequestMapping("syncManual/{id}")
    public R<?> syncManual(@PathVariable Long id) {
        return R.data(getBaseService().sync(id));
    }

    @Operation(summary = "单个新增")
    @WebLog
    @PostMapping
    @ApiLog(title = "单个新增", description = "【数据同步】单个新增", type = OperateType.INSERT)
    @Override
    public R<? extends DataSync> add(@Valid @NotNull @RequestBody DataSyncAddDTO domain) {
        domain.setSourcePass(SM2Coder.decryptWebData(domain.getSourcePass()));
        domain.setTargetPass(SM2Coder.decryptWebData(domain.getTargetPass()));
        return LongKeyConvertibleController.super.add(domain);
    }

    @Operation(summary = "单个更新")
    @WebLog
    @ApiLog(title = "单个更新", description = "【数据同步】单个更新", type = OperateType.UPDATE)
    @PutMapping
    @Override
    public R<? extends DataSync> updateAllField(@Valid @NotNull @RequestBody DataSyncUpdateDTO domain) {
        if (StringUtil.isNotEmpty(domain.getSourcePass())) {
            domain.setSourcePass(SM2Coder.decryptWebData(domain.getSourcePass()));
        }
        if (StringUtil.isNotEmpty(domain.getTargetPass())) {
            domain.setTargetPass(SM2Coder.decryptWebData(domain.getTargetPass()));
        }
        return LongKeyConvertibleController.super.updateAllField(domain);
    }

    @Override
    @Operation(summary = "根据 id 删除记录")
    @WebLog
    @DeleteMapping("/{id}")
    @ApiLog(title = "根据 id 删除记录", description = "根据 id 删除【数据同步】", type = OperateType.DELETE)
    @Parameters({
            @Parameter(name = "id", description = "主键 id", required = true, in = ParameterIn.PATH)
    })
    public R<? extends DataSync> delete(@PathVariable Long id) {
        return LongKeyConvertibleController.super.delete(id);
    }

    @Override
    @Operation(summary = "根据 id 批量删除记录")
    @WebLog
    @DeleteMapping("batch")
    @ApiLog(title = "根据 id 批量删除记录", description = "根据 id 批量删除【数据同步】", type = OperateType.DELETE)
    public R<? extends DataSync> deleteBatch(@RequestBody Set<Long> ids) {
        return LongKeyConvertibleController.super.deleteBatch(ids);
    }

    @PostMapping("total")
    @WebLog
    @Operation(summary = "获取总数")
    @Override
    public R<Long> total(@RequestBody DataSyncQueryBody dto) {
        return R.data(getBaseService().total(JSONObject.from(dto)));
    }

    @PostMapping("page")
    @WebLog
    @Operation(summary = "获取分页")
    @Override
    public R<IPage<DataSync>> page(@RequestBody DataSyncQueryBody dto, SqlPageParams sqlPageParams) {
        return R.data(getBaseService().page(JSONObject.from(dto), sqlPageParams));
    }

    @Operation(summary = "获取列表")
    @WebLog
    @PostMapping("list")
    @Override
    public R<List<DataSync>> list(@RequestBody DataSyncQueryBody dto, SqlPageParams sqlPageParams) {
        return R.data(getBaseService().list(JSONObject.from(dto), sqlPageParams));
    }

    @GetMapping("/{id}")
    @WebLog
    @Operation(summary = "查看详情")
    @Override
    @Parameters({
            @Parameter(name = "id", description = "主键 id", required = true, in = ParameterIn.PATH)
    })
    @SafeConvert(resultType = EntityType.Entity, safeOut = DataSync.class, ignoreOut = {"sourcePass", "targetPass"})
    public R<DataSync> detail(@PathVariable Long id) {
        return R.data(getBaseService().detail(JSONObject.of("id", id)));
    }

    @Operation(summary = "excel 导入数据模板")
    @WebLog
    @GetMapping("template")
    public void downloadTemplate(HttpServletResponse response) {
        EasyExcelUtil.export("【数据同步】导入模板", response, DataSyncImpDTO.class, Collections::emptyList);
    }

    @Operation(summary = "excel 导入数据")
    @WebLog
    @PostMapping("imp")
    @ApiLog(title = "excel 导入数据", description = "excel 导入【数据同步】", type = OperateType.IMPORT, isSaveRequestData = false, isSaveResultData = false)
    public R<List<DataSync>> imp(MultipartFile file) throws IOException {
        AtomicReference<List<DataSync>> listRef = new AtomicReference<>();
        EasyExcel.read(file.getInputStream()
                , DataSyncImpDTO.class
                , new ModelConvertibleListener<DataSync>(list -> {
                    listRef.set(list);
                    getBaseService().saveBatch(list);
                })).sheet().doRead();
        return R.data(listRef.get());
    }

    @Operation(summary = "excel 导出数据")
    @WebLog
    @PostMapping("exp")
    @ApiLog(title = "excel 导出数据", description = "excel 导出【数据同步】", type = OperateType.EXPORT, isSaveRequestData = false, isSaveResultData = false)
    public void exp(@RequestBody DataSyncQueryBody dto, SqlPageParams sqlPageParams, HttpServletResponse response) {
        EasyExcelUtil.export("【数据同步】导出数据", response, DataSyncExpVO.class
                , () -> BeanUtil.copyToList(getBaseService().list(JSONObject.from(dto), sqlPageParams), DataSyncExpVO.class));
    }

    @SneakyThrows
    @Operation(summary = "获取 excel 导出数据可选的字段")
    @WebLog
    @GetMapping("exportSelectedField")
    public R<List<DBField>> getExportSelectedField() {
        return R.data(DBFieldUtil.generate(DataSync.class));
    }

    @SneakyThrows
    @Operation(summary = "excel 导出数据（字段可选）")
    @WebLog
    @PostMapping("exportSelectedField")
    public void expSelectedField(@RequestBody ExportTemplate<DataSyncQueryBody> template, HttpServletRequest request, HttpServletResponse response) {
        excelService.exportExcel(template, request, response, getBaseService()::listMap);
    }

}
```

:::

::: note
偷懒就用`BaseController`如果想业务更健康就使用`ModelConvertibleController`
:::

## 利用模板生成业务逻辑代码

提供了一整套的基于 MyBatis-Plus 的代码生成模板，基于模板生成代码，只需要修改模板里面的内容，然后运行代码生成器，就会自动生成代码，然后根据业务逻辑去完善代码

- 满足大部分业务场景需求的增、删、改、查、导入、导出
- 生成了 Mybatis 的 xml 文件的配套内容，可以利用 ==`<include>`== 标签实现简单配置多表查询

[自动生成业务代码](/code/taybct/guide/mybatisxTemplate)

## 业务逻辑处理

- IBaseService <Badge text="业务不推荐使用" type="info" vertical="top" />
- BaseServiceImpl <Badge text="业务不推荐使用" type="info" vertical="top" />

## SQL 分页参数

- SqlQueryParams <Badge text="BaseController" type="info" vertical="top" />
- SqlPageParams <Badge text="ModelConvertibleController" type="trip" vertical="top" />

## 统一返回结果

- R 对象

|  参数   |    类型    | 默认 | <div style="width:200px">说明</div> |
| :-----: | :--------: | :--: | :---------------------------------: |
|  code   |   String   |      |               状态码                |
| message |   String   |      |              返回信息               |
|  data   |     T      |      |              返回数据               |
|  meta   | JSONObject |  {}  |            额外添加数据             |

## 序列化处理

针对 pgsql json、jsonb 等被封装成 PGObject 的数据，进行序列化处理

- JSONToStringSerializer <Badge text="3.2.2" type="trip" vertical="top" />
- ToJSONArraySerializer <Badge text="3.2.2" type="trip" vertical="top" />
- ToJSONObjectSerializer <Badge text="3.2.2" type="trip" vertical="top" />

使用：

```java
...
    /**
     * json 数据
     */
    @Schema(description = "json 数据")
    @Excel(name = "json 数据", width = 25, needMerge = true, mergeVertical = true)
    @TableField(value = "json_data")
    @TableFieldJSON
    @JsonSerialize(using = ToJSONObjectSerializer.class)
    private Object jsonData;
...
```

## 手动事务

有的时候，需要使用手动控制事务，那么可以使用 `ManualTransactionManager`

- ManualTransactionManager

使用：

```java
    // 首先需要先注册到 Spring 容器中
    @Bean
    public ManualTransactionManager manualTransactionManager(PlatformTransactionManager transactionManager) {
        return new ManualTransactionManager(transactionManager);
    }
```

```java
// 然后基础使用：
TransactionStatus status = manualTransactionManager.start(); // 开启事务
try{
  // 处理业务逻辑
  manualTransactionManager.commit(status); // 提交事务
} catch(Exception e) {
  // 处理异常
  manualTransactionManager.rollback(status); // 回滚事务
}
```

## 异常

- BaseException

基础异常，加入了 [HttpStatus](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Reference/Status) 状态码可以直接告诉前端大概报的是啥类型的错误，方便前端处理而无需再使用 `@RestControllerAdvice` 之类的方式去做状态码处理

## WebSocket <Badge text="3.2.3" type="trip" vertical="top" />

工具框架对 WebSocket 进行了封装，提供了一些常用的功能，兼容并适配了 WebMVC 和 WebFlux 两种 WebSocket 框架

可以查看这个示例：[exp-websocket](https://github.com/taybct/spring-taybct-example/blob/3.2.x/exp-websocket)

需要注意的是，在 WebMVC 框架中，需要引入依赖：

```xml
<!--mvc websocket-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

但是在 WebFlux 框架中，不需要引入依赖，因为 WebFlux 框架本身就支持 WebSocket
