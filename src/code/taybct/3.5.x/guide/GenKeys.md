---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 数据加密
# 当前页面内容描述
description: 数据加密
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
icon: "carbon:encryption"
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

# 数据加密

::: info
出去安全考虑，数据在存储和传输过程序中都能进行加密，框架默认使用了3种加密：
- 非对应加密：国密算法SM2，用于数据传输过程中加密，公钥加密的数据只能使用私钥解密，例如前端登录的时候加密传输，到了服务器再用私钥解密后进行比较
- 摘要加密：国密算法SM3，用于存储单向数据，不需要再解密的数据，比较的也是加密后的数据，比如用户密码
- 对称加密：国密算法SM4，用于存储需要后面解密出来使用的数据，比如用户的敏感信息，手机，姓名，身份证号等
:::

> [国密算法](https://cn.bing.com/search?q=%E5%9B%BD%E5%AF%86%E7%AE%97%E6%B3%95)

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

## 获取非对称加密公钥（调用方/前端）

框架默认的获取公钥的接口是：
- `/sm2/publicKey`：获取国密算法SM2公钥
- `/rsa/publicKey`：获取RSA加密算法公钥

## 使用公钥加密数据（调用方/前端）

::: details Java 代码示例

需要先引入 pom.xml

```xml
        <!--国密加密需要使用到的加密工具 Bouncy Castle -->
        <dependency>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcprov-jdk18on</artifactId>
            <version>1.77</version>
        </dependency>
        <dependency>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcpkix-jdk18on</artifactId>
            <version>1.77</version>
        </dependency>
        <dependency>
            <groupId>org.bouncycastle</groupId>
            <artifactId>bcprov-ext-jdk18on</artifactId>
            <version>1.77</version>
        </dependency>
```

SM2：

```java
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.SM2;
import lombok.SneakyThrows;
import org.bouncycastle.asn1.gm.GMNamedCurves;
import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPrivateKey;
import org.bouncycastle.jcajce.provider.asymmetric.ec.BCECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.math.BigInteger;

@SpringBootTest
public class CryptoTest {
  
    @SneakyThrows
    @Test
    public void testSM2(){
        String webPublicKey = "04204acd81fe5d374f31812905681600981054215ab4f4670c9d488a54033fd1fdbfce801af66672403c52ad6dbe734e6539bd1b959ae35449fec8ce29914121df";
        BCECPublicKey ecPublicKeyByPublicKeyHex = getECPublicKeyByPublicKeyHex(webPublicKey);
        SM2 sm2 = new SM2();
        sm2.setPublicKey(ecPublicKeyByPublicKeyHex);
        String s = sm2.encryptBase64("123456", KeyType.PublicKey);
        System.out.println(s);
    }

    public static BCECPublicKey getECPublicKeyByPublicKeyHex(String pubKeyHex) {
        if (pubKeyHex.length() > 128) {
            pubKeyHex = pubKeyHex.substring(pubKeyHex.length() - 128);
        }
        String stringX = pubKeyHex.substring(0, 64);
        String stringY = pubKeyHex.substring(stringX.length());
        BigInteger x = new BigInteger(stringX, 16);
        BigInteger y = new BigInteger(stringY, 16);
        X9ECParameters x9ECParameters = GMNamedCurves.getByName("sm2p256v1");
        ECParameterSpec ecDomainParameters = new ECParameterSpec(x9ECParameters.getCurve(), x9ECParameters.getG(), x9ECParameters.getN());
        ECPublicKeySpec ecPublicKeySpec = new ECPublicKeySpec(x9ECParameters.getCurve().createPoint(x, y), ecDomainParameters);
        return new BCECPublicKey("EC", ecPublicKeySpec, BouncyCastleProvider.CONFIGURATION);
    }

    public static BCECPrivateKey getECPrivateKeyByPrivateKeyHex(String privateKeyHex) {
        BigInteger d = new BigInteger(privateKeyHex, 16);
        X9ECParameters x9ECParameters = GMNamedCurves.getByName("sm2p256v1");
        ECParameterSpec ecDomainParameters = new ECParameterSpec(x9ECParameters.getCurve(), x9ECParameters.getG(), x9ECParameters.getN());
        ECPrivateKeySpec ecPrivateKeySpec = new ECPrivateKeySpec(d, ecDomainParameters);
        return new BCECPrivateKey("EC", ecPrivateKeySpec, BouncyCastleProvider.CONFIGURATION);
    }
}
```

RSA：

```java
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.RSA;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CryptoTest {

    @Test
    public void testRSA(){
        String publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Mrs6NpRDbRNYI3jBZgHN9uXRpJwoxeEgTaw62kvbHMQ/dORj6etzv/Jjz5agv8tLD7rliVgMdFc8AQQoU6Nqid5wRQK18Adn2vyEpmYAPfNxCDAS3n5pvGkadMw9J5eM/c837X7SKLe0p4WSjI/nHRTVi8ade6k7JXyef3IFgSptHkCK3PSdQTRPsq5TOSkRqtXm+fhMw8ldpiYQTskMPRIDUTyj2+8xzf1ZavzPR/gqg4erm2TU28ogEXqQc+fVDGYkV/mElUrAsLTuj1YTqtbWM16YZY7ZOP8dmskDhFBSIgqlNWJHxK7l3j9UkN1jdRWF53H8FiMNGq7CBpwjwIDAQAB";
        RSA rsa = new RSA(null, publicKey);
        String s = rsa.encryptBase64("123456", KeyType.PublicKey);
        System.out.println(s);
    }
}

```

:::

::: details javascript 代码示例

引入依赖

```bash
npm install jsencrypt
npm install gm-crypto
```

RSA；

```javascript
import { JSEncrypt } from 'jsencrypt';

let publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqfmzOcdMzmbKSaO31khYbet/PRc1/HZIRFettbTVS2HB5kHVjq4NAW57yVFqowxhnCDBDgsyJkf0uuPBtjnd9sbN184YPRaVQPfWGlmgAa/PwzJpE6ea/ToxlwvuDIjbTYv0RWb3K9QjgT/Mvowj/8pek+ETXekCasj5TDpHj3KAi5vw8KYZ/6OhIiTnjA2hc7Rk7aV91raLfgc8LyywAkkWwQrmJeQ7W/6Ee6UPZfcB6wuwNbCGv5d5lBsL5kpuWHOd3xdAFaSTokjcgJf3NpBZJBYtP6zU0/lQZdsURKwroQR/n2NsIRAUeCxwU2XbyLuNo52qK4xbUunZnSWaxQIDAQAB"; // 从后台获取公钥
let data = "123456"; //必须传字符串
console.log("加密前：", data);
let encryptor = new JSEncrypt();
encryptor.setPublicKey(publicKey);
let data_encrypted = encryptor.encrypt(data);
console.log("加密后：", data_encrypted);
```

SM2：

```javascript
import { SM2 } from 'gm-crypto';
let publicKey = "04204acd81fe5d374f31812905681600981054215ab4f4670c9d488a54033fd1fdbfce801af66672403c52ad6dbe734e6539bd1b959ae35449fec8ce29914121df";// 从后台获取公钥
let data = "123456";//必须传字符串
console.log("加密前：", data);
let data_encrypted = SM2.encrypt(data, publicKey, {
  inputEncoding: 'utf8',
  outputEncoding: 'hex'
});
console.log("加密后：", '04' + data_encrypted);//约定所有的加密数据前面都添加一个 04，表示使用未压缩公钥加密的数据

```

:::

## 加密长数据

::: tip
非对称加密（RSA/SM2）的特点就是使用大位数来加密，1024，2048 这样的，不仅加密出来的数据特别长，而且加密的明文也是有长度限制的，所以在很多场景是不适用的，虽然工具类 RSACoder 对这种长数据做了分段加解密的处理，但是仍然无法避免加密出来的数据很长，这对网络数据传输会有一定的影响，然而，对称加密（AES/SM4）加密的数据会短一些，不过对称加密的`key`是公开的，安全性欠佳，所以可以考虑使用对称加密算法加密明文，使用非对称加密算法加密对称加密算法的`key`来做双重加密，数据短小传输快的同时还保证了安全
:::

::: details RSA+AES 加密示例

前端（仅演示 RSA，SM2加密雷同）：

```javascript
import { v4 as uuidv4 } from 'uuid'
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

const aesKey = uuidv4().replace(/-/g, '')
console.log('aesKey :>> ', aesKey)

const encryptByRSA = (publicKey: string, content: string) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(content).toString()
}

const rsaPublicKey =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqVKAgGJWw0kUstEQ4iWUjYouwgWWt/MbdpTdtLCUob9ECgp2ph6dUNOb71R/VGjuVaidOCNRM8C0nRFqRUpjv7kFt1UKNRnSNgA26ChllxApFkd5zBqq+5UHSsTIeOr3B+cu0PshG4KLADHDwQINyJ2xwQeLblaugLAihtdg09RJpxuQvTx9FYLXQWkJaJu9vsC/ESE9+wUJAsCn7p6td3sUSmtVEy1d5yeJSd5XBqbFNK1v2YOtjrVuu9IvvmD6rlHEArw8z7cjgerX51++IfR+RF5e/UWeT7a56MkhPcZgYT4rXsgQejDsMXD+zSEMvxXKY5Xm4yZpKDqYP0Z8dQIDAQAB'
console.log('rsaPublicKey :>> ', rsaPublicKey)
console.log('RSA 加密后的 AES Key :>> ', encryptByRSA(rsaPublicKey, aesKey))

//  加密方法
function Encrypt(word) {
  let key = CryptoJS.enc.Utf8.parse(aesKey) //同样需要十六位数作为密钥
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

//  解密方法
function Decrypt(word) {
  let key = CryptoJS.enc.Utf8.parse(aesKey)
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
// const e = Encrypt(JSON.stringify(demoData))
// const d = Decrypt(e)
// console.log('e :>> ', e)
// console.log('d :>> ', d)
const content = '123'
const e = Encrypt(content)
console.log('AES 加密前的数据 :>> ', content)
console.log('AES 加密后的数据 :>> ', e)
```

后端：

```java
@RestController
@RequestMapping("demo")
@Api(tags = "测试 controller")
public class DemoController {

    /**
     * Get 请求 RSA 加密接口（返回字符串）
     * @param content 加密的内容
     * @param rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 RSA 公钥进行加密，如果没传就直接返回原数据
     */
    @GetMapping("rsaGetStrR")
    @Encrypted(key = "content")
    R<?> testRSAGetMethodStrR(@RequestParam String content, @RequestParam(required = false) String rsaPublicKey) {
        System.out.println(content);
        return R.data(content);
    }

    /**
     * Get 请求 RSA 加密接口（返回 JSONObject）
     * @param content 加密的内容
     * @param rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 RSA 公钥进行加密，如果没传就直接返回原数据
     */
    @GetMapping("rsaGetBodyR")
    @Encrypted(key = "content")
    R<?> testRSAGetMethodBodyR(@RequestParam String content, @RequestParam(required = false) String rsaPublicKey) {
        System.out.println(content);
        JSONObject data = new JSONObject();
        data.put("content", content);
        return R.data(data);
    }

    /**
     * Get 请求 AES 加密接口（返回字符串）
     * @param content 加密的内容
     * @param aesKey AES 用于加解密的 Key
     * @param rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 AES 加密数据，RSA 公钥进行加密 AES Key，如果没传就直接返回原数据
     */
    @GetMapping("aesGetStrR")
    @Encrypted(type = EncryptedType.AES_RSA)
    R<?> testAESGetMethodStrR(@RequestParam String content, @RequestParam String aesKey, @RequestParam(required = false) String rsaPublicKey) {
        System.out.println(content);
        return R.data(content);
    }

    /**
     * Get 请求 AES 加密接口（返回 JSONObject）
     * @param content 加密的内容
     * @param aesKey AES 用于加解密的 Key
     * @param rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 AES 加密数据，RSA 公钥进行加密 AES Key，如果没传就直接返回原数据
     */
    @GetMapping("aesGetBodyR")
    @Encrypted(type = EncryptedType.AES_RSA)
    R<?> testAESGetMethodBodyR(@RequestParam String content, @RequestParam String aesKey, @RequestParam(required = false) String rsaPublicKey) {
        System.out.println(content);
        JSONObject data = new JSONObject();
        data.put("content", content);
        return R.data(data);
    }

    /**
     * POST 请求 RSA 加密接口（返回字符串）
     * @param data 前端传过来的数据，需要传的 JSON key 有 1. content 加密的内容 2. rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 RSA 公钥进行加密，如果没传就直接返回原数据
     */
    @PostMapping("rsaPostStrR")
    @Encrypted
    R<?> testRSAPostMethodStrR(@RequestBody JSONObject data) {
        System.out.println(data.toJSONString());
        return R.data(data.toJSONString());
    }

    /**
     * POST 请求 RSA 加密接口（JSONObject）
     * @param data 前端传过来的数据，需要传的 JSON key 有 1. content 加密的内容 2. rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 RSA 公钥进行加密，如果没传就直接返回原数据
     */
    @PostMapping("rsaPostBodyR")
    @Encrypted
    R<?> testRSAPostMethodBodyR(@RequestBody JSONObject data) {
        System.out.println(data.toJSONString());
        return R.data(data);
    }

    /**
     * POST 请求 AES 加密接口（返回字符串）
     * data 前端传过来的数据，需要传的 JSON key 有 1. content 加密的内容 2.aesKey AES 用于加解密的 Key 3. rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 AES 加密数据，RSA 公钥进行加密 AES Key，如果没传就直接返回原数据
     */
    @PostMapping("aesPostStrR")
    @Encrypted(type = EncryptedType.AES_RSA)
    R<?> testAESPostMethodStrR(@RequestBody JSONObject data) {
        System.out.println(data.toJSONString());
        return R.data(data.toJSONString());
    }

    /**
     * POST 请求 AES 加密接口（返回 JSONObject）
     * data 前端传过来的数据，需要传的 JSON key 有 1. content 加密的内容 2.aesKey AES 用于加解密的 Key 3. rsaPublicKey 前端（调用端）传过来的 前端（调用端）的 RSA 公钥
     * @return 如果有传 RSA 公钥过来就会通过 AES 加密数据，RSA 公钥进行加密 AES Key，如果没传就直接返回原数据
     */
    @PostMapping("aesPostBodyR")
    @Encrypted(type = EncryptedType.AES_RSA)
    R<?> testAESPostMethodBodyR(@RequestBody JSONObject data) {
        System.out.println(data.toJSONString());
        return R.data(data);
    }
}
```

[@Encrypted 注解](../annotation/Encrypted)的处理逻辑：

```java
@Aspect
@AutoConfiguration
@Slf4j
public class EncryptedAspect {

    /**
     * @param point 切点
     */
    @Around("@annotation(encrypted)")
    public Object doAround(ProceedingJoinPoint point, Encrypted encrypted) throws Throwable {
        log.debug("加密传输处理开始======");
        // 请求类型 GET/POST
        String requestMethod = Objects.requireNonNull(ServletUtil.getRequest()).getMethod();
        if (requestMethod.equalsIgnoreCase(RequestMethod.GET.name())) {
            return getMethod(point, encrypted);
        } else if (requestMethod.equalsIgnoreCase(RequestMethod.POST.name()) ||
                requestMethod.equalsIgnoreCase(RequestMethod.PUT.name()) ||
                requestMethod.equalsIgnoreCase(RequestMethod.PATCH.name())) {
            return postMethod(point, encrypted);
        }
        // 获取到所有的参数
        Object[] args = point.getArgs();
        return point.proceed(args);

    }

    private static Object postMethod(ProceedingJoinPoint point, Encrypted encrypted) throws Throwable {
        // 获取到所有的参数
        Object[] args = point.getArgs();
        // 数据对象
        JSONObject data = null;
        // 如果传进来的内容是加密的
        int index = AOPUtil.getParamIndex(point, encrypted.key());
        // 如果需要输入转换
        if (index > -1 && index < point.getArgs().length) {
            if (args[index] instanceof JSONObject jsonObject) {
                data = jsonObject;
            } else if (args[index] instanceof EncryptedDTO dto) {
                data = JSONObject.from(dto, JSONWriter.Feature.WriteMapNullValue);
            }
        }
        if (encrypted.decryptInput()) {
            if (data != null && data.getString(encrypted.content()) != null) {
                if (encrypted.type().equals(EncryptedType.RSA)) {
                    data.put(encrypted.content(), rsaDecode(data.getString(encrypted.content())));
                } else if (data.getString(encrypted.aesKey()) != null) {
                    // RSA 解密成明文的 AES Key
                    String serveAesKeyStr = rsaDecode(data.getString(encrypted.aesKey()));
                    data.put(encrypted.aesKey(), serveAesKeyStr);
                    data.put(encrypted.content()
                            , aesDecode(serveAesKeyStr, data.getString(encrypted.content())));
                }
            }
        }
        if (data != null) {
            args[index] = data;
        }
        Object proceed = point.proceed(args);
        if (encrypted.encryptOutput()) {
            if (data != null && data.getString(encrypted.outputEncryptPublicKey()) != null) {
                return encryptOutput(proceed, encrypted, data.getString(encrypted.outputEncryptPublicKey()));
            }
        }
        return proceed;
    }

    private static Object getMethod(ProceedingJoinPoint point, Encrypted encrypted) throws Throwable {
        // 获取到所有的参数
        Object[] args = point.getArgs();
        if (encrypted.decryptInput()) {
            // 如果传进来的内容是加密的

            if (encrypted.type().equals(EncryptedType.RSA)) {
                int index = AOPUtil.getParamIndex(point, encrypted.key());
                // 如果需要输入转换
                if (index > -1 &&
                        index < point.getArgs().length &&
                        args[index] instanceof String) {
                    args[index] = rsaDecode((String) args[index]);
                }
            } else {
                int aesKeyIndex = AOPUtil.getParamIndex(point, encrypted.aesKey());
                int contentIndex = AOPUtil.getParamIndex(point, encrypted.content());
                // 如果需要输入转换
                if (aesKeyIndex > -1 &&
                        aesKeyIndex < point.getArgs().length &&
                        args[aesKeyIndex] instanceof String) {
                    if (contentIndex > -1 &&
                            contentIndex < point.getArgs().length &&
                            args[contentIndex] instanceof String) {
                        // RSA 解密成明文的 AES Key
                        String serveAesKeyStr = rsaDecode((String) args[aesKeyIndex]);
                        args[aesKeyIndex] = serveAesKeyStr;
                        args[contentIndex] = aesDecode(serveAesKeyStr, (String) args[contentIndex]);
                    }
                }
            }
        }
        Object proceed = point.proceed(args);
        if (encrypted.encryptOutput()) {
            int publicKeyIndex = AOPUtil.getParamIndex(point, encrypted.outputEncryptPublicKey());
            if (publicKeyIndex > -1 &&
                    publicKeyIndex < point.getArgs().length &&
                    args[publicKeyIndex] instanceof String) {
                if (args[publicKeyIndex] != null) {
                    return encryptOutput(proceed, encrypted, (String) args[publicKeyIndex]);
                }
            }
        }
        return proceed;
    }

    /**
     * 加密输出
     *
     * @param proceed      返回结果
     * @param encrypted    加密注解
     * @param rsaPublicKey 前端传过来的 RSA 公钥
     * @return 根据注释返回加密或者不加密的数据
     * @throws Throwable 报异常
     */
    private static Object encryptOutput(Object proceed, Encrypted encrypted, String rsaPublicKey) throws Throwable {

        // 如果需要传出内容加密
        if (proceed instanceof R) {
            // 不管返回结果是什么，只要是能加密的数据，这里都统一返回 JSONObject，content 是加密内容，如果有 AES 加密，这里 aesKey 就是 AES Key
            JSONObject data = new JSONObject();
            // 需要加密的内容
            String content;
            if (((R) proceed).getData() instanceof String) {
                R<String> r = (R<String>) proceed;
                content = r.getData();
            } else if (((R) proceed).getData() != null) {
                R<Object> r = (R<Object>) proceed;
                content = JSONObject.toJSONString(r.getData());
            } else {
                return proceed;
            }
            if (encrypted.type().equals(EncryptedType.RSA)) {
                data.put(encrypted.content(), encodeRSAy(rsaPublicKey, content));
            } else {
                String aesKeyStr = getAesKeyStr();
                String encryptHex = encodeAES(aesKeyStr, content);
                data.put(encrypted.content(), encryptHex);
                data.put(encrypted.aesKey(), encodeRSAy(rsaPublicKey, aesKeyStr));
            }

            return R.status(((R) proceed).getCode(), ((R) proceed).getMessage(), data);
        }
        return proceed;
    }

    /**
     * AES 解密
     *
     * @param serveAesKeyStr RSA 解密后的 AES Key
     * @param content        需要解密的内容
     * @return 解密后的内容
     */
    private static String aesDecode(String serveAesKeyStr, String content) {
        SymmetricCrypto aes = new SymmetricCrypto(SymmetricAlgorithm.AES, serveAesKeyStr.getBytes());
        // AES 解密
        String decryptStr = aes.decryptStr(content, CharsetUtil.CHARSET_UTF_8);
        return decryptStr;
    }

    /**
     * RSA 解密
     *
     * @param content 需要解密的内容，也可以是 RSA 加密的 AES Key
     * @return 解密后的内容
     */
    private static String rsaDecode(String content) {
        if (content.startsWith("04")) {
            // 04 开头的 key 是 sm2 加密
            return SM2Coder.decryptWebData(content);
        }
        return RSACoder.decryptBase64StringByPrivateKey(content);
    }

    /**
     * 对称加密
     *
     * @param aesKeyStr aes key
     * @param content   内容
     * @return 加密后的内容
     */
    private static String encodeAES(String aesKeyStr, String content) {
        // 前端加密明文
        SymmetricCrypto webAES = new SymmetricCrypto(SymmetricAlgorithm.AES, aesKeyStr.getBytes());
        // 加密为16进制密文
        return webAES.encryptHex(content);
    }

    /**
     * 非对称加密
     *
     * @param rsaPublicKey 非对称公钥
     * @param content      内容
     * @return 加密后的 aes key
     */
    private static String encodeRSAy(String rsaPublicKey, String content) {
        if (rsaPublicKey.startsWith("04")) {
            // 04 开头的 key 是 sm2 加密
            return new SM2(null, rsaPublicKey).encryptHex(content, KeyType.PublicKey);
        }
        return RSACoder.encryptBase64StringByPublicKey(rsaPublicKey, content);
    }

    /**
     * 获取 AES key
     *
     * @return AES key
     */
    private static String getAesKeyStr() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

}
```

:::
