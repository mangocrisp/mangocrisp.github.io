---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 数据库加密连接
# 当前页面内容描述
description: 数据库加密连接
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
order: 2
dir:
  order: 2
# 页面图标
icon: "carbon:encryption"
# 是否原创
isOriginal: false
# 日期
date: 2024-11-21
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

# 数据库加密连接

我们在线上部署的时候会把配置文件放出来，如果被人找到了数据库连接的配置文件，就会被知道数据库的连接信息，从而导致被拖库，为了避免这样的事情发生，可以采取把配置信息加密，然后运行的时候解密来连接数据库

## Druid 加密数据库密码
[Druid](https://github.com/alibaba/druid/wiki/%E4%BD%BF%E7%94%A8ConfigFilter) 就提供了这样的方式

## MyBatisPlus 多数据源扩展加密

`Druid` 提供了加密功能，他的默认的方式是使用的 `RSA` 加密的，使用私钥加密，公钥解密。我这边重写了一下，利用使用 [MyBatisPlus 多数据源](https://baomidou.com/guides/dynamic-datasource/) 的扩展功能，实现 `SM4`(`国密4`)加密连接信息，只需要输入加密后的数据，密钥以密钥对的文件形式存放，具体使用方法：

### 配置解密器

在配置文件里面配置：

```yaml
gx-cloud:
  datasource:
    # 数据源加密连接
    encrypted-connection:
      # 开启是否？
      enabled: true
      # 配置统一的解码器
      decrypt-function: cn.gx.tool.core.util.sm.SM4Coder.De
      # 为每个数据源配置解码器
      decrypt-functions:
        master: cn.gx.tool.core.util.sm.SM4Coder.De
        slave1: cn.gx.tool.core.util.sm.SM4Coder.De
```

### 加密数据

使用解密器对应的加密器来加密数据:

```java
    @Test
    public void test1() throws IOException {
        SymmetricCrypto sm4 = SM4Coder.getSM4();
        String url = sm4.encryptBase64("jdbc:postgresql://localhost:5432/taybct?currentSchema=public");
        String username = sm4.encryptBase64("postgres");
        String password = sm4.encryptBase64("password");
        String driverClass = sm4.encryptBase64("org.postgresql.Driver");
        System.out.println(url);
        System.out.println(username);
        System.out.println(password);
        System.out.println(driverClass);
        // 输出：
        //Sa3sJgkd8De9YETgT3akmV1Sc8u0D5mU5B2fcj42DJvPa3jgQiju8PyiFRFTNQ8iAOzFqYNyZbUThew6fd99vg==
        //XNDgBtWOFc0V1f/fpaBJNg==
        //h7NsigtYgx731RMT03rzpQ==
        //tW2GodbAhP/fAMgGJCKcZiEN05yn6zKif1Oo/3T9VVQ=    
    }
```

### 配置加密信息

把加密后的数据用 `ENC()` 包起来再写入

```yaml
spring:
  datasource:
    # 如果 druid 用不了，就注释掉
    type: com.alibaba.druid.pool.DruidDataSource
    dynamic:
      primary: master
      datasource:
        master:
          url: ENC(Sa3sJgkd8De9YETgT3akmV1Sc8u0D5mU5B2fcj42DJvPa3jgQiju8PyiFRFTNQ8iAOzFqYNyZbUThew6fd99vg==)
          username: ENC(XNDgBtWOFc0V1f/fpaBJNg==)
          password: ENC(h7NsigtYgx731RMT03rzpQ==)
          driver-class-name: ENC(tW2GodbAhP/fAMgGJCKcZiEN05yn6zKif1Oo/3T9VVQ=)
```

## 结语

> 其实这些方式都不太安全的，因为，如果别人都已经到了应用服务器了，并且找到了配置文件，那他肯定也能通过一些方便来知道程序是如何解密这些加密的信息的，例如，反编译 jar 包、直接使用 `java` 命令来执行 `class` 文件等