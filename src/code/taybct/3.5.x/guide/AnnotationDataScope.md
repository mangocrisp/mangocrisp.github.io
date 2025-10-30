---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 数据权限范围
# 当前页面内容描述
description: 数据权限范围
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
icon: "icon-park-outline:data-user"
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

# 数据权限范围

::: info
为了解决系统数据权限范围过滤问题，可以使用 @DataScope 注解，目前开发了基础版本，后续会陆续完善。
在使用注解前，需要了解，什么是数据权限，数据权限，即，基于用户/角色 关联绑定的部门，管理区域等一系列有父子级关系，或者无父子级关系的有标签性质的数据，单纯因为 用户/角色 关联了这些数据，用户再去访问/操作其他和这些权限关联的数据的时候，过滤掉 用户/角色 没有关联对应的权限数据的数据的操作，我们可以称之为数据权限过滤。在通常情况下，我们过滤数据权限，会写大量的过滤 sql ，或者大量的过滤逻，这里我们总结了这些过滤逻辑的通用情况下的操作，这里编写成了注解
:::

## 数据权限过滤的基本逻辑

逻辑其实很简单，属于是只可意会，不好言传，我这里就试着言传一下：

### 权限基础

权限基于什么数据去过滤，比如，是基于部门过滤，还是基于组织机构，又或是基于管理区域过滤，这些都可以
有很明显的共性，他们都是有上下级关系的，一般是拥有了上级的权限，就自动也包括了拥有了这个上级下的
所有 子/孙 级的权限，当然，也有可能有特例，这些我们也会考虑进去

### 权限关联

权限是和用户关联，或者是和角色关联，或者其他可以和用户深度绑定的，可以表示是某 个/类 用户的关联的
关联关系，因为我们在过滤的过程中需要利用这些关联来确定 用户/角色 拥有哪些数据权限来过滤

### 目标

与权限关联的数据，用户需要使用这些数据，就会根据 自身/自身角色 所拥有的数据权限来访问这些数据，
这些目标，大致分为两类：直接关联权限，或者是有中间表，一对多的关联权限

## 配置

了解了大概逻辑之后，我们就可以把这些共性提取出来，如果要使用 @DataScope 注解，你需要做如下配置：

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

## （目标）注解使用

以上的配置，都可以在使用注解的时候动态设置，注解上的设置优先级高于配置，配置属于是通用，公共的。注解
一般是使用在 Mapper interface 的方法上

### 使用 MyBatisPlus


#### 一对一

```java
public interface SysDeptMapper extends BaseMapper<SysDept> {

    @Override
    @DataScope(alias = "sys_dept", field = "id")
    List<SysDept> selectList(@Param(Constants.WRAPPER) Wrapper<SysDept> queryWrapper);
    
}
```

可以直接继承 MyBatis 的 BaseMapper 里面的方法，然后加上注解，就可以实现注入数据权限限制了，这里
主设置的就是示例里面的两个属性：

- alias：要操作的表的别名
- field：用于关联 权限基础 的字段的名

#### 一对多

```java
public interface SysUserV2Mapper extends BaseMapper<SysUser> {

    @DataScope(alias = "sys_user"
            , field = "id"
            , type = DataScopeType.MULTI
            , multiTable = "sys_user_dept"
            , multiFiled = "user_id"
            , multiDeptId = "dept_id")
    @Override
    List<SysUser> selectList(@Param(Constants.WRAPPER) Wrapper<SysUser> queryWrapper);
}
```

一对多就多了几个需要配置的属性：

- type：指定类型是一对多
- multiTable：目标用于关联权限的表
- multiFiled：这个关联权限的表里面用于关联目标的字段
- multiDeptId：这个关联权限的表里面用于关联权限的字段

### 使用 MyBatis 自定义写 sql

#### sqlField

可以详见注解里面的 sqlField 属性，也就是说，需要指定一个字段来得到过滤条件

#### _data_scope_

和 sqlField 使用方式一样，利用 mybatis 的 interceptor 可以把参数加多到方法的参数后面，
使其可以在 xml 里面拿到使用

```java
public interface DemoMapper extends BaseMapper<SysUser> {

    @DataScope(alias = "sys_user", field = "id", type = DataScopeType.MULTI, filterType = DataScopeFilterType.BOTH)
    List<SysUser> listAllUser();

}
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="io.github.mangocrisp.spring.taybct.module.system.mapper.DemoMapper">

    <select id="listAllUser" resultType="io.github.mangocrisp.spring.taybct.api.system.domain.SysUser">
        select * from sys_user
        <where>
            <if test="_data_scope_ != null">
                and exists(${_data_scope_})
            </if>
        </where>
    </select>

</mapper>
```

### 过滤介质

注解默认使用用户与权限的关联来过滤，当然，可以可以根据实际情况来选择是根据角色，或者是用户+角色交集过滤

```java
public interface SysUserV2Mapper extends BaseMapper<SysUser> {

    @DataScope(alias = "sys_user"
            , field = "id"
            , type = DataScopeType.MULTI
            , multiTable = "sys_user_dept"
            , multiFiled = "user_id"
            , multiDeptId = "dept_id"
            , filterType = DataScopeFilterType.BOTH)
    @Override
    <P extends IPage<SysUser>> P selectPage(P page, @Param(Constants.WRAPPER) Wrapper<SysUser> queryWrapper);
    
}
```

- filterType：过滤类型，可以选择 用户 | 角色 | 两者

## 权限过滤条件

是否需要过滤，如果有这样的业务：部门人是不需要权限过滤的，这个可以通过配置过滤条件判断来实现是否添加过滤。
这里提供了两种方式来配置：

### 全局配置：

```java
@Component("dataScopeCondition")
public class UserDataScopeCondition implements DataScopeCondition {
    @Override
    public boolean test(ILoginUser securityUtil) {
        // 这里如果不是 ROOT 才需要过滤
        return securityUtil.checkRoot() == 0;
    }
}
```

需要往 spring boot 窗口里面注入一个 bean name 为 "dataScopeCondition" 的 bean ，然后如上面的写法

### 注解上针对单独的方法

```java
public interface DemoMapper extends BaseMapper<SysUser> {

    @Override
    @DataScope(alias = "sys_user", field = "id", type = DataScopeType.MULTI, filterType = DataScopeFilterType.BOTH
            , dataScopeCondition = UserDataScopeCondition.class)
    List<SysUser> selectList(@Param(Constants.WRAPPER) Wrapper<SysUser> queryWrapper);
}
```

如果全局，大部分的过滤都可以配置，但是就是个别方法过滤条件判断不一样，就可以单独配置

## 权限自定义

当然，从兼容性角度出发，开发人员也可以自定义过滤规则：

### 全局配置

```java
/**
 * @author XiJieYin <br> 2023/6/30 11:32
 */
@Component("dataScopeCustom")
public class UserDataScopeCustom implements DataScopeCustom {
    @Override
    public String apply(DataScope dataScope) {
        return "select 1 from sys_user";
    }
}
```

往 spring boot 容器内注册一个 bean name 为 "dataScopeCustom" 的 bean 然后开始根据提供的
DataScope 来写自己的过滤逻辑吧

### 单独配置

```java
public interface DemoMapper extends BaseMapper<SysUser> {
    @DataScope(alias = "sys_user", field = "id", type = DataScopeType.MULTI, filterType = DataScopeFilterType.BOTH
            , custom = User2DataScopeCustom.class)
    List<SysUser> listAllUser();
}

@Component
public class User2DataScopeCustom implements DataScopeCustom {    
    @Override
    public String apply(DataScope dataScope) {
        return "select 2 from sys_user";
    }
}
```

单独配置是为了，如果有的方法，他的过滤方式就是和大部分不一至，或者是有特殊的需求，就可以自定义这些规则了