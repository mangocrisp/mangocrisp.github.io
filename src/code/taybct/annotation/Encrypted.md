---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Encrypted
# 当前页面内容描述
description: Encrypted
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
order: 5
dir:
  order: 5
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

# Encrypted

前后端数据加密传输注解，有些时候，我们希望将数据以加密的形式传入到后端进行操作，但是加解密是个比较复杂的过程，所以可以使用这个注解来处理传入的加密数据

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| decryptInput | boolean | 否 | true | 解密输入数据 |
| key | String | 否 | "data" | 需要解密的输入数据的参数名 |
| encryptOutput | boolean | 否 | true | 是否要加密输出数据 |
| outputEncryptPublicKey | String | 否 | "rsaPublicKey" | 加密输出数据的公钥的 key，这个需要前端传 public key 过来 |
| type | EncryptedType | 否 | EncryptedType.RSA | 加密类型 |
| content | String | 否 | "content" | 加密的内容的 JSON 键 (POST 请求的时候需要从请求的 JSON 里面获取内容) |
| aesKey | String | 否 | "aesKey" | 加密的 AES Key 的 JSON 键 (POST 请求的时候需要从请求的 JSON 里面获取 AES Key) |

### EncryptedType

类型转换对象类型，输出的时候，是哪种类型数据的转换过滤，因为底层的复制逻辑，这个需要指定

| 值 | 说明 |
|:--:|:--:|
|RSA|单纯 非对称 加密，数据较少时推荐，如仅加密身份证，手机号，密码等|
|AES_RSA|对称加密内容，非对称加密 对称加密的 Key，数据较多的时推荐，如需要加密大量的 JSON 数据，字符串等|

## 使用说明

可以放在`Controller`类的方法上面

::: warning 慎用

注解会在数据到达业务层之前进行数据解密，并且在输出之前会对数据进行加密，如果开启了加解密，还需要在数据里面额外加入非对称加密的公钥这样的长数据，对响应速度会有影响

:::
