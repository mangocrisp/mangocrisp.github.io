---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 属性配置
# 当前页面内容描述
description: 属性配置
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
  order: 
# 页面图标
icon: "file-icons:yaml-alt3"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-25
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

# 属性配置

::: tip

建议使用 yaml 配置项目的属性，因为一些集合类型的配置会更直观清晰，还能方便区分环境配置

:::

## 配置参数

### taybct.message.*

内部消息配置

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|application.version|String|==不设置就不显示==|项目版本号，这个是会显示在 banner 上面的版本号，可以不设置，主要是为一个提示作用，让知道部署的时候知道是哪个版本|
|taybct.message.enable|Boolean|true|是否开启日志,配置是否能使用`IMessageSendService`发送消息，以及本地日志检查的开关|
|taybct.message.folder|String|"temp/message"|临时日志文件夹|
|taybct.message.max-history|Long|15L|最多存储多少天的数据|
|taybct.message.check-delay|Long|10000L|本地日志文件检查频率(毫秒)|
|taybct.message.buffer|Long|1000L|缓存，即池子满了这个数量就会直接发送消息，而不用等待|
|taybct.message.delay|Long|60000L|日志发送频率(毫秒)|
|||||

### taybct.serve.*

::: tip
这样的场景也算是比较常见的，项目初期一般是没有太多的模块和业务的，但是要打包部署的时候模块又多，又因为是初期，业务变更频繁，打包次数也多，这样，如果上来就使用分布式微服务，避免不了会浪费很多时间在打包和部署上面，可以先使用单体架构，后续升级成微服务，服务模块配置，为了兼容微服务和单体架构，才有的配置，因为网关作为后端的唯一入口，要去到各个微服务模块调用接口，就得需要配置`predicates`，但是如果是到了单体架构，就不能用这个配置了，所以这里需要有这个一点位符来将接口的前缀作成动态可变的
:::

::: details 示例

Controller 接口：

```java
/**
 * 系统用户相关接口
 */
@Tag(name = "系统用户相关接口")
@RestControllerRegister(ServeConstants.CONTEXT_PATH_SYSTEM + "{version}/user")
@ApiVersion
public interface ISysUserController extends BaseController<SysUser, ISysUserService> {
}

String CONTEXT_PATH_SYSTEM = "${" + SERVE + "." + ServeConstants. SYSTEM + ".context-path}" = "${taybct.serve.taybct-system.context-path}"
```

Gateway router 配置：

```yaml
spring:
  cloud:
    gateway:
      routes:
        # 系统模块
        - id: module-system
          uri: lb://module-system
          predicates:
            - Path=/system/**
          filters:
            - StripPrefix=1        
```

微服务模块配置：

```yaml
taybct:
  serve:
    taybct-system:
      context-path: "/"
      service-id: taybct-system  
```

单体架构模块配置：

```yaml
taybct:
  serve:
    taybct-system:
      context-path: "/system"
```

:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.serve.${模块}.context-path|String|"/"|网关配置的模块路径|
|taybct.serve.${模块}.service-id|String|"/"| `@FeignClient`注解的 value -- `the name of the service with optional protocol prefix` |
|||||

### taybct.params.map.*

::: note
系统参数配置，这里配置的是默认参数，这些参数，可以在系统管理模块的系统参数里面以同样的 key 去覆盖配置
:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|menu_layout|Long|0|菜单默认的 Layout 的 id|
|role_root_id|Long|1| 默认的 ROOT 角色 id|
|user_root_id|Long|1| 默认 ROOT 用户的 id|
|user_passwd|String|'123456'| 默认密码（重置密码时会使用这个）|
|user_role|String|'TOURIST'| 默认角色 |
|user_role_id|Long|5| 默认角色id |
|user_status|Long|1| 用户默认状态 |
|tenant_id|String|'000000'| 默认租户id |
|enable_captcha|Boolean|false| 是否需要验证码登录 |
|captcha_type|Enum|GIF| 验证码的类型，可以查看枚举：io.github.mangocrisp.spring.taybct.common.enums.CaptchaType，可选：CIRCLE，GIF，LINE，SHEAR，默认 GIF  |
|||||

### taybct.secure.*

::: note
安全配置：接口访问限制、ip 黑/白名单、本地鉴权配置等
:::