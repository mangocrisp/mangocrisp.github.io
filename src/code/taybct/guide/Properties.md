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

::: info

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

::: info
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

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.secure.black-list.uris|String[]||接口黑名单，禁用名单里面的接口被访问|
|taybct.secure.black-list.uri-ip-set|UriIP[]||指定 IP 的接口黑名单，禁用名单里面的接口被指定的 IP 访问|
|taybct.secure.white-list.uri-ip-set|UriIP[]||指定 IP 的接口白名单，只允许名单里面的接口被指定的 IP 访问|
|taybct.secure.ignore.uris|String[]||无需鉴权接口白名单|
|taybct.secure.ignore.captcha-grant-type|String[]||无需验证码授权类型|
|taybct.secure.captcha-urls|String[]||需要验证码的请求|
|taybct.secure.captcha-authorizations|String[]||指定需要验证码的客户端|
|taybct.secure.allow-when-no-match|Boolean||当没有配置资源访问规则的时候，默认是允许访问，即，如果不配置某个 method:url 只能某些角色访问时，默认是可以允许访问的|
|taybct.secure.auth.client.client-id|String||客户端 id|
|taybct.secure.auth.client.client-name|String||客户端名称|
|taybct.secure.auth.client.client-secret|String||客户端密钥|
|taybct.secure.auth.client.client-resource-ids|String||资源id列表|
|taybct.secure.auth.client.client-scope|String||域|
|taybct.secure.auth.client.authorized-grant-types|String||授权模式|
|taybct.secure.auth.client.web-server-redirect-uri|String||回调地址|
|taybct.secure.auth.client.authorities|String||权限列表|
|taybct.secure.auth.client.access-token-validity|String||认证令牌时效|
|taybct.secure.auth.client.refresh-token-validity|String||刷新令牌时效|
|taybct.secure.auth.client.additional-information|String||扩展信息|
|taybct.secure.auth.client.auto-approve|String||是否自动放行|
|taybct.secure.auth.user.username|String||用户名|
|taybct.secure.auth.user.roles|String[]||用户角色编码集合|
|taybct.secure.auth.user.user-id|Long||用户ID|
|taybct.secure.auth.user.status|Byte||用户状态|
|taybct.secure.auth.user.password|String||用户密码|
|taybct.secure.auth.users|String|OAuth2UserDTO[]|配置多个用户|
|||||

#### UriIP

URI IP 配置

|参数|类型|说明|
|:--:|:--:|:--:|
|uri|String|指定接口地址|
|ip-set|String[]|指定 IP 或者 CIDR 规则|

#### OAuth2UserDTO

鉴权用户

|参数|类型|说明|
|:--:|:--:|:--:|
|username|String|用户名|
|roles|String[]|用户角色编码集合|
|user-id|Long|用户ID|
|status|Byte|用户状态|
|password|String|用户密码|

[CIDR 规则](https://cn.bing.com/search?q=CIDR+%E8%A7%84%E5%88%99)

::: warning
如果要配置本地访问，一般是配置`127.0.0.1`或者`0:0:0:0:0:0:0:1`,配置`localhost`无法识别
:::

### taybct.tenant.*

::: note
租户配置
:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.tenant.enable|Boolean|false|是否启用租户|
|taybct.tenant.tenant-id-column|String|'tenant_id'|租户 id 字段|
|taybct.tenant.tenant-tables|String[]|[]|租户表|
|||||

### taybct.datasource.*

::: note
数据库配置
:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.datasource.encrypted-connection.enabled|Boolean|false|是否开启加密连接|
|taybct.datasource.encrypted-connection.decrypt-function|Class<? extends Function<String, String>>|SM4Coder.De.class|配置统一的解码器|
|taybct.datasource.encrypted-connection.decrypt-functions|Map<String, Class<? extends Function<String, String>>>|[]|解密方法，为每个数据源 指定一个 Function<String, String> 类来实现解密,怎么解密要看具体是怎么加密的，例如，sm2 加密的就用 SM2EncryptedPassable|
|driver-className|Boolean|true|是否加密连接驱动信息|
|url|Boolean|true|是否加密连接地址|
|username|Boolean|true|是否加密用户名|
|password|Boolean|true|是否加密密码|
|||||

[数据库加密连接](/code/taybct/guide/dbencryptedconnect.html)

### taybct.scheduled.*

::: note
任务调度
:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.scheduled.pool-size|Integer|20|线程池大小|
|taybct.scheduled.await-termination-seconds|Integer|60|等待结束时间，单位秒|
|taybct.scheduled.thread-name-prefix|String|'Scheduler-'|任务线程名（前缀）|
|taybct.scheduled.wait-for-tasks-to-complete-on-shutdown|Boolean|true|关闭程序，等待任务完成|
|taybct.scheduled.tasks|Map<String, ScheduledTaskBean>|[]|任务配置|
|||||

#### ScheduledTaskBean

鉴权用户

|参数|类型|说明|
|:--:|:--:|:--:|
|task-key|String|任务key值 唯一|
|description|String|任务描述|
|cron|String|任务表达式|
|start-flag|Integer|当前是否已启动 1 已启动 0 未启动|
|auto-start|Integer|是否自动启动 1 是 0否|
|sort|Integer|启动顺序|
|params|Map<String, Object>|需要传递到任务的属性配置|

### taybct.file.*

::: note
对象存储配置
:::

|参数|类型|默认|<div style="width:200px">说明</div>|
|:----:|:----:|:----:|:----:|
|taybct.file.enable|Boolean|true|是否启用|
|taybct.file.type|String|true|对象存储服务器类型|
|taybct.file.clazz|Class<? extends IFileService>|true|对象存储服务器类型|
|taybct.file.file-content-type|Map<String, String>|true|文件类型配置|
|taybct.file.local.url|String||域名或本机访问地址|
|taybct.file.local.local-file-prefix|String||资源映射路径前缀|
|taybct.file.local.local-file-path|String||上传文件存储在本地的根路径|
|taybct.file.local.upload-file-size|Long||上传文件大小 MB，小于 0 表示不限制|
|taybct.file.local.upload-file-name-length|Long|100|上传文件名长度限制|
|taybct.file.local.upload-allowed-extensions|String[]|null|许上传的文件类型，不配置表示允许所有|
|taybct.file.oss.endpoint|String||oss 服务端|
|taybct.file.oss.accessKeyId|String||oss key|
|taybct.file.oss.accessKeySecret|String||oss 密钥|
|taybct.file.oss.bucketName|String||oss 桶|
|taybct.file.oss.proxyUrl|String||代理地址|
|taybct.file.fdfs.group|String||分组|
|taybct.file.fdfs.url|String||域名或本机访问地址|
|taybct.file.minio.url|String||服务地址|
|taybct.file.minio.accessKey|String||用户名|
|taybct.file.minio.secretKey|String||密码|
|taybct.file.minio.bucketName|String||存储桶名称|
|||||

### FastDFS

::: warning
 FastDFS 已经停止维护很久了，但是为了兼容，在这里仍然是有配置，也可以使用，这里列一些常用的配置，完全配置[详见](https://github.com/tobato/FastDFS_Client)
:::

|参数|类型|说明|
|:--:|:--:|:--:|
|fdfs.thumb-image.connect-timeout|Integer|连接超时|
|fdfs.thumb-image.width|Integer|缩略图生成参数-宽度|
|fdfs.thumb-image.height|Integer|缩略图生成参数-高度|
|fdfs.thumb-image.tracker-list|String[]|TrackerList 参数,支持多个|
