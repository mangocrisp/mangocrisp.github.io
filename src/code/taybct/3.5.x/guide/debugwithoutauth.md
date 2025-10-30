---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 开发调试代码（微服务）
# 当前页面内容描述
description: 我们在开发微服务代码的时候，有些接口是需要我们有用户鉴权信息，来作为一个自动生成创建人或者修改人这样的切面的，如果没有登录过没有拿到登录信息就会报错 401，所以这里是可以无需额外鉴权手动把用户信息丢到请求头的方法
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
icon: "codicon:debug-alt-small"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-02
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

# 开发调试代码（微服务）

::: info
我们在开发微服务代码的时候，有些接口是需要我们有用户鉴权信息，来作为一个自动生成创建人或者修改人这样的切面的，如果没有登录过没有拿到登录信息就会报错 401，这就不得不要启动至少3个模块（鉴权，网关，系统），如果开发用的机器不够给力运行不了太多服务，就很难去调试，所以这里是可以无需额外鉴权手动把用户信息丢到请求头的方法
:::

## 生成 payload

利用项目里面的 sm4.key 生成加密后的用户信息的 payload

```java
    @Test
    @SneakyThrows
    public void testSM4(){
        String jsonStr = """
                {
                    "uid":"1",
                    "nbf":1732851466,
                    "grant_type":"taybct",
                    "user_name":"root",
                    "scope":["all"],
                    "atm":"username",
                    "exp":1732855066,
                    "iat":1732851466,
                    "jti":"ae8109f4257847b68747c644d31c43f4",
                    "client_id":"taybct_pc",
                    "authorities":["ROOT"],
                    "tni":"000000"
                }""";
        String payload = SM4Coder.getSM4().encryptBase64(jsonStr, StandardCharsets.UTF_8);
        System.out.println(payload);
        // FifZzL5rS7O1MO2MRBTHXkCjxps3b+k9c9pSagI49+nj6Md2pZeXwbuEuotVPj0UMtNm5C1ZoutbiGdj2En1ev0gP+kcZZFSYlsb6q3/4MrlX/WjrvQwM5PzJ8wdejbXUkRDFSlsfmoEclZ4YPXyuvNzltVdo4JgDJMl8FA9i+ec4Iz74BnS4XlOZpCfXwlTAzAi+wKahNnJKJw+21/ZOpHXJ9St/S7pCugZYN2JaVFrU84lMRH6572G70n+5Jl+LD5aoBMWH4LuaSkvKZtUTxvafKpqAryXee3A5A0cx/dQAzsrNnn77ipcQq1lqgvPlZDpRaIjqag08lAYsCtBSk7elQcQMOXreKgdUa/R+K0KX4iSXocPJhgGWFnAoHEm8efu0pQIAuA6V5mH7X3Th3rH6EumGlRo7oE7edUMTZw=
    }
```

需要修改的参数说明：

| 参数 | 说明 |
|:----: | :----:|
|uid| 用户id|
|user_name|用户名|
|exp|超时时间|
|client_id|客户端id|
|authorities|关联的角色|
|tni|租户id|

## 使用 payload 请求单模块接口

![payloadaccess.png](/assets/images/blog/payloadaccess.png)

这样就不需要再走网关去调试接口，直接只启动一个服务就可以了

::: danger 注意注意！
这里的操作仅适用于开发环境，如果是生产环境，请做好过滤防护，不要把单个服务直接暴露出去，并且做好密钥的保护及定期更新
:::