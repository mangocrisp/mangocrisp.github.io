---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 生成各种密钥
# 当前页面内容描述
description: 生成各种密钥
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
order: 8
dir:
  order: 8
# 页面图标
icon: "token:key"
# 是否原创
isOriginal: false
# 日期
date: 2025-02-08
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

# 生成各种密钥

::: info
项目里面如果有涉及到一些敏感数据需要进行加密有这几种常见的加密方式：

- 对称加密
- 摘要算法
- 非对称加密

[国密加密](https://cn.bing.com/search?q=%E5%9B%BD%E5%AF%86%E5%8A%A0%E5%AF%86)有对应的算法，本项目使用了 SM2（非对称）、 SM3（摘要）、 SM4（对称）
:::

对数据加密无非就是用算法来将数据进行打乱，如果用同样的算法来加密的数据最终会是相同或者能直接解密，那就达不到加密效果了，所以需要有密钥来做差异性，这样就算知道了算法，不知道密钥也是不能破解

## 生成密钥代码示例

```java
@SpringBootTest
public class GenKeys {

    @SneakyThrows
    @Test
    public void jwtKey() {
        X500Name build = RSACoder.createStdBuilder().build();
        RSACoder.genRSACACert("jwt", "taybct", build, build, 7776000, certificateBuilder -> {
        }, new String[]{RSACoder.CER_PATH + RSACoder.PRIVATE_KEY_NAME.replace("rsa","jwt")
                , RSACoder.CER_PATH + RSACoder.CER_NAME.replace("rsa","jwt")
                , RSACoder.CER_PATH + RSACoder.KEY_STORE_NAME.replace("rsa","jwt")});
    }

    @SneakyThrows
    @Test
    public void rsaKey() {
        RSACoder.genRSACACert("rsa", "taybct", 7776000, certificateBuilder -> {
        });
    }

    @SneakyThrows
    @Test
    public void rsaKeyLimited() {
        X500Name build = RSACoder.createStdBuilder().build();
        RSACoder.genRSACACert("limited", "taybct", build, build, 7776000, certificateBuilder -> {
        }, new String[]{RSACoder.CER_PATH + RSACoder.PRIVATE_KEY_NAME.replace("rsa","limited")
                , RSACoder.CER_PATH + RSACoder.CER_NAME.replace("rsa","limited")
                , RSACoder.CER_PATH + RSACoder.KEY_STORE_NAME.replace("rsa","limited")});
    }

    @SneakyThrows
    @Test
    public void sm2Key() {
        SM2Coder.genSM2CACert("sm2", "taybct", 7776000, certificateBuilder -> {
        });
    }

    @SneakyThrows
    @Test
    public void sm3Key() {
        SM3Coder.genSM3SecretKey();
    }

    @SneakyThrows
    @Test
    public void sm4Key() {
        SM4Coder.genSM4SecretKey();
    }

    @Test
    public void all(){
        jwtKey();
        rsaKey();
        rsaKeyLimited();
        sm2Key();
        sm3Key();
        sm4Key();
    }
    
}
```

## 后续配置

将生成的密钥放到需要用到的`resources`目录下面

```bash
.
|-- bootstrap.yml
|-- jwt.jks
|-- rsa.jks
|-- sm2.jks
|-- sm3.key
`-- sm4.key
```

- 非对称加密（RSA,SM2）

非对称加密的密钥需要配置设置密钥的属性

```yaml
taybct:
  rsa:
    # resources 目录下的证书
    resource: rsa.jks
    # 生成证书的时候配置的 alias
    alias: rsa
    # 生成证书的时候配置的 密码
    password: taybct
    # 过期检查
    expire-check: true
    type:
      JWT:
        resource: jwt.jks
        alias: jwt
        password: taybct
        expire-check: true
  sm2:
    # resources 目录下的证书
    resource: sm2.jks
    # 生成证书的时候配置的 alias
    alias: sm2
    # 生成证书的时候配置的 密码
    password: taybct
```
