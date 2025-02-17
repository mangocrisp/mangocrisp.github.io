---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: SafeConvert
# 当前页面内容描述
description: SafeConvert
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
order: 13
dir:
  order: 13
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

# SafeConvert

安全转换注解（接口）,过滤传进接口和从接口传出去的数据，过滤掉敏感字段，或者限制传一些字段

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| key | String | 否 | "" | 指定字段 |
| safeIn | `Class<? extends Serializable>[]` | 否 | `{}` | 安全输入的类 |
| safeOut | `Class<? extends Serializable>[]` | 否 | `{}` | 安全输出的类 |
| resultType | EntityType | 否 | EntityType.NONE | 返回类型 |
| ignoreIn | `String[]` | 否 | `{}` | 忽略输入的字段 |
| ignoreOut | `String[]` | 否 | `{}` | 忽略输出的字段 |

### safeIn | safeOut

意思就是说，会按照这个类来复制数据输入或者输出

### EntityType

类型转换对象类型，输出的时候，是哪种类型数据的转换过滤，因为底层的复制逻辑，这个需要指定

| 值 | 说明 |
|:--:|:--:|
|NONE|未指定|
|Entity|实体类|
|Collection|集合|
|Page|分页|

## 使用说明

注解到`Contrller`的接口方法上来过滤输入和输出的数据

::: details 示例

```java
    @WebLog
    @ApiLog(title = "根据 id 修改个人信息", description = "根据 id 修改个人信息", type = OperateType.UPDATE)
    @SafeConvert(key = "domain", safeIn = SysUserSafeIn.class, ignoreIn = {"id", "username", "password", "openid", "phone"})
    @Override
    public R<SysUser> updateMyInfo(@Valid @NotNull @RequestBody SysUser domain) {
        domain.setId(getSecurityUtil().getLoginUser().getUserId());
        return getBaseService().updateMyInfo(domain) ? R.data(domain) : R.fail("更新失败！");
    }  

    @SafeConvert(resultType = EntityType.Entity, safeOut = SysUser.class, ignoreOut = {"password"})
    @Override
    default R<? extends SysUser> detail(@NotNull @PathVariable Long id) {
        return BaseController.super.detail(id);
    }    
```

- 修改个人信息的时候，不允许直接修改用户的`id`，用户名，密码等一些数据
- 查询人信息的时候不希望把密码也直接返回回去
- ...

:::

::: warning 慎用
因为这个注解，会对输入的数据和输出的数据都复制一遍来做过滤，这样在响应时间上会有一些影响，而且一些引用关系也是会有影响，如果需要过滤输入和输出的数据，建议还是老老实实的写好`DTO`和`VO`🤣😂，这个可以参考[自动生成代码](/code/taybct/guide/mybatisxTemplate.html)，如果使用模板自动生成业务代码，就已经是自动生成了这些 DTO，需要 VO 的得需要自行去写
:::
