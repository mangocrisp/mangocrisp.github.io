---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: DataScope
# 当前页面内容描述
description: DataScope
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
order: 4
dir:
  order: 4
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
  - 数据权限
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# DataScope

实际开发中，会经常遇到要做数据权限控制，这部分的代码是比较繁琐和臃肿的，而且容易写错，一改要改一大堆，这个注解可以帮助自动生成数据权限过滤的`SQL`，可以自动插入到查询语句，也可以手动选择插入到需要过滤权限的条件处

## 参数说明

::: tip

数据权限有很多形式来过滤，一般情况下是以部门来过滤的，所以注解名称也就直接以`dept`来命名权限了

:::

| 参数 | 类型 | 必须 | 默认 | <div style="width:290px">说明</div> |
|:----:|:----:|:----:|:----:|:----:|
| userScopeTable | String | 否 | "" | 用户关联权限的表 |
| userScopeField | String | 否 | "" | 用户在权限关联表的关联字段 |
| userScopeDeptId | String | 否 | "" | 权限关联表关联权限的字段 |
| roleScopeTable | String | 否 | "" | 按角色关联权限的权限关联表 |
| roleScopeField | String | 否 | "" | 按角色关联权限的权限关联表的角色字段 |
| roleScopeDeptId | String | 否 | "" | 按角色关联权限的权限关联表的权限字段 |
| roleTable | String | 否 | "" | 角色表 |
| roleField | String | 否 | "" | 角色主键字段 |
| roleCode | String | 否 | "" | 角色 code 字段 |
| deptTable | String | 否 | "" | 权限表 |
| deptId | String | 否 | "" | 权限主键字段 |
| deptPidAll | String | 否 | "" | 权限所有的父级的字段 |
| multiTable | String | 否 | "" | 一对多的数据权限关联的表 |
| multiFiled | String | 否 | "" | 一对多的数据权限关联的表用于关联需要过滤表的字段 |
| multiDeptId | String | 否 | "" | 一对多的数据权限关联的表用于关联权限的字段 |
| alias | String | ==是== |  | 需要过滤数据权限的表的别名 |
| field | String | ==是== |  | 需要过滤数据权限的表的用来过滤的字段 |
| sqlField | String | 否 | "_data_scope_" | 自动生成的数据权限过滤`SQL`参数名 |
| filterType | [DataScopeFilterType](/code/taybct/annotation/DataScope.html#datascopefiltertype) | 否 | DataScopeFilterType.USER | 按何种方式过滤 |
| type | [DataScopeType](/code/taybct/annotation/DataScope.html#DataScopeType) | 否 | DataScopeType.SINGLE | 数据权限类型 |
| logicDelete | boolean | 否 | false | 权限表是否是逻辑删除的 |
| logicField | String | 否 | "" | 逻辑删除字段 |
| notDeletedStatus | String | 否 | "" | 逻辑删除的未删除状态 |
| dbtype | DbType | 否 | DbType.POSTGRE_SQL | 数据库类型,com.baomidou.mybatisplus.annotation.DbType |
| includeChildren | boolean | 否 | true | 是否包含查询权限子集 |
| includeParents | boolean | 否 | false | 是否包含查询权限父集 |
| dataScopeCondition | `Class<? extends DataScopeCondition> dataScopeCondition()` | 否 | `DefaultDataScopeCondition.class` | 判断是否要进行数据权限过滤 |
| custom | `Class<? extends DataScopeCustom>` | 否 | `DefaultDataScopeCustom.class` | 自定义过滤规则 |
| notExistDealType | [DataScopeGetNotDealType](/code/taybct/annotation/DataScope.html#DataScopeGetNotDealType) | 否 | `DefaultDataScopeCustom.class` | 自定义过滤规则 |
| auto | boolean | 否 | true | 是否自动把过滤条件添加到 where 语句后面，默认添加到第一个 where 后面 |
| extensible | boolean | 否 | false | 是否[扩展](/code/taybct/annotation/DataScope.html#扩展) |
| extensionScopeTable | String | 否 | "" | 扩展数据范围表 |
| extensionScopeField | String | 否 | "" | 扩展数据范围表的主键（用来关联是哪个权限需要扩展范围） |
| extensionScopeDeptId | String | 否 | "" | 扩展数据范围表的关联扩展的权限的 id |
| statusFilter | boolean | 否 | false | 是否按权限表的状态过滤掉失效的权限 |
| statusField | String | 否 | "" | 权限表的状态字段 |
| enableStatus | String | 否 | "1" | 权限启用状态，默认启动状态是 1 |

### deptPidAll

权限如果是有多层关联的，比如，`省`>`市`>`县/区`>`镇`>`村`，本级是可以知道自己的所有的父级的

### multiTable

一对多权限关联的表，顾名思义，需要过滤的表里面不是直接存的权限字段，而是人或者其他信息字段，但是这个字段是可以和权限关联的，那么`multiTable`就是用来设置这个关联的表的，例如表里面存是`user_id`，那么需要设置关联表是`sys_user_dept`，用来关联用户和部门

### multiFiled

需要过滤的信息字段在一对多权限关联表的字段，例如表里面是`user_id`，也就是`sys_user_dept`表里面的`user_id`

### multiDeptId

一对多权限关联表的字段，例如`sys_user_dept`表里面的`dept_id`

### sqlField

如果是自定义 mapper. xml 写 sql ，这里要加入过滤数据权限条件的 sql 的字段，可以把这个 sql 加入到自定义的 sql where 条件里面，但是，注意，一般是使用第一个 where

```xml
<if test="_parameter.containsKey('_data_scope_') and _data_scope_ != null"> 
    and exists(${_data_scope_}) 
</if>
```

关联起来

::: warning

这里只是去拼接 SQL，所以，如果使用了自动模式的话，要考虑你自己本身的 SQL 组成，如果你在查询字段列表里面还写了子查询，里面又用了`WHERE`字段，那么可能就这个权限拼接会出现一些问题了，建议是自己决定要把权限过滤放到哪里去

:::

### DataScopeFilterType

数据权限过滤类型

| 值 | 说明 |
|:--:|:--:|
|USER|按用户|
|ROLE|按角色|
|BOTH|一起过滤取合集|

### DataScopeType

数据权限类型

| 值 | 说明 |
|:--:|:--:|
| SINGLE | 一对一的数据权限，例如一个用户只能是某个部门的 |
| MULTI | 一对多的数据权限，例如一个用户可以同时在多个部门 |

### includeChildren

是否包含查询权限子集，顾名思义，就是说，查询的时候判断只要是当前过滤的字段关联的权限，是当前用户拥有的权限的子集就算是拥有数据权限，例如，当前登录的用户的权限是关联到`市`级的，那么，如果过滤的这条数据他关联的权限是这个`市`级下面的一个`县/区`，反过来说，`县/区`的所有的父级里面是包含了这个`市`级的，所以当前这个登录的用户就是有权限去看这个`县/区`级的数据的

### includeParents

是否包含查询权限父集，登录，某条数据他所有的权限是`市`级的，当前登录的用户的权限只有`县/区`级，这个就是设置是否需要看到这个`市`级的数据，也比较常见，比如发的通告一般是直接发在高级一点的`市`级，不可能一级一级的发给每个`县/区`

### DataScopeCondition

根据当前用户来判断是否需要进行权限过滤，因为有些特殊用户是可以不进行权限过滤的，比如 root 用户就可以不进行权限过滤，这样就可以去实现这个接口，然后自定义自己的数据权限过滤判断，返回是否需要进行权限过滤

### DataScopeGetNotDealType

如果获取不到权限，或者查询不到权限的处理方式，这个一般用于使用 MyBatisPlus 的方法去查询的时候，如果是使用自定义的 SQL，这个就全靠开发人员自己决定怎么使用这个 查询

| 值 | 说明 |
|:--:|:--:|
| ALLOW | 允许为空，也就是乐观处理方式，如果没有给数据分配权限，允许把没有权限的数据查询回来 |
| FORBID | 不允许 |

### 扩展

有些时候，数据权限表，可能还会有权限扩展表，也就是这个权限，他还会有他的另一种形式的权限，比如给用户赋予的并不是直接是权限表的数据，还是和权限表关联的另一种形式的数据，比如我国的`行政级别`就是这样的

> 国家级、省部级、地市级、县处级、乡科级

`省`是和`部`对齐的，`处`是和`县`级别对齐的。当前这些是固定的对齐，但是又例如：我国的军衔和级别，军长可能是少将，也可以是中将这些是属于是权限的扩展

## 使用说明

建议直接写死在`Mapper`的接口的方法上来过滤数据

不要看这参数比较多，很多参数都是固定的，可以通过配置来焊死：

::: details yaml 配置

```yaml
taybct:
  data-scope:
    # 部门表主键
    dept-id: id
    # 部门表名
    dept-table: sys_dept
    # 所有的父级的字段
    dept-pid-all: pid_all
    # 是否逻辑删除
    logic-delete: true
    # 逻辑删除的字段
    logic-field: is_deleted
    # 逻辑未删除的状态
    not-deleted-status: 0
    # 角色 ocde
    role-code: code
    # 角色表的主键
    role-field: id
    # 角色表名
    role-table: sys_role
    # 部门角色关联表
    role-scope-table: sys_role_dept
    # 部门角色关联表 - 部门 id
    role-scope-dept-id: dept_id
    # 部门角色关联表 - 角色 id
    role-scope-field: role_id
    # 一对多权限关联表
    multi-table: sys_user_dept
    # 一对多权限关联表 - 部门 id
    multi-dept-id: dept_id
    # 一对多权限关联表 - 用户 id
    multi-filed: user_id
    # 用户部门关联表
    user-scope-table: sys_user_dept
    # 用户部门关联表 - 部门 id
    user-scope-dept-id: dept_id
    # 用户部门关联表 - 用户 id
    user-scope-field: user_id
```

:::

::: details 代码示例

```java

public interface Mapper extends BaseMapper<Entity> {
    @DataScope(alias = "t_table"
            , field = "unit"
            , dataScopeCondition = DeptDataScopeCondition.class
            , auto = false)
    long total(@Param("params") JSONObject params);    
}

@RequiredArgsConstructor
public class DeptDataScopeCondition implements DataScopeCondition {

    /**
     * 用户 id 获取部门 id
     */
    final Function<Long, Long> getDeptId;
    /**
     * 系统参数
     */
    final ISysParamsObtainService sysParamsObtainService;

    @Override
    public boolean test(ILoginUser loginUser) {
        // 获取配置在系统参数里面的不需要检查的部门的 id
        LinkedHashSet<String> deptSet = Optional.ofNullable(sysParamsObtainService.get("dept_note_check"))
                .map(s -> s.toLowerCase().split(","))
                .map(Arrays::asList)
                .map(LinkedHashSet::new)
                .orElseGet(LinkedHashSet::new);
        Long deptId = getDeptId.apply(loginUser.getUserId());
        // 不是 root 用户 || 部门为空 || 不在管理部门里面就都是需要过滤的
        if (loginUser.checkRoot() == 1) {
            // 如果是 root 直接就忽略
            return false;
        }
        if (ObjectUtil.isEmpty(deptId)) {
            // 部门为空也不检查
            return false;
        }
        // 如果不在这些不需要检查的部门里面，就是需要过滤权限的
        return !deptSet.contains(deptId.toString());
    }

}

@AutoConfiguration
public class ApplicationConfig {
    @Bean
    public DeptDataScopeCondition deptDataScopeCondition(ISysParamsObtainService sysParamsObtainService) {
        return new DeptDataScopeCondition(id -> {
          // TODO 这里需要实现，如果使用用户 id 去查询回来部门 id，建议是使用缓存，不要每次都查询数据库
        }, sysParamsObtainService);
    }
}

```

```xml

select count(1) from(
  select id,unit from t_table
  <where>
    <if test="_parameter.containsKey('_data_scope_') and _data_scope_ != null"> 
        and exists(${_data_scope_}) 
    </if>
  </where>
) temp
```

:::

::: info

写这个注解，我真的是呕心沥血了，查询效果还行，应该还有得优化吧，其实也就是 SQL 的优化了，这里已经兼容了三种数据库了 `MySQL` `PGSQL` `ORACLE`，但是是写死了，所以，如果使用其他的数据库，这里暂时还是不支持的

:::
