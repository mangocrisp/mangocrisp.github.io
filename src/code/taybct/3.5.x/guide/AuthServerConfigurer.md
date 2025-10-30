---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 鉴权服务器配置
# 当前页面内容描述
description: 鉴权服务器配置
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
order: 12
dir:
  order: 12
# 页面图标
icon: "arcticons:bitwarden-authenticator"
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

# 鉴权服务器配置

::: info
项目集成了[Spring Authorization Server](https://spring.io/projects/spring-authorization-server)，但是初期的时候只有授权码登录的模式，并不能满足一些业务开发的需求，所以开发了密码登录模式（用户名），手机号登录模式（验证码），抽象通用刷新模式（针对不同类型的授权模式来做`TOKEN`续期），也对和`TOKEN`相关的鉴权配置做了一些开发
:::

## 自定义鉴权鉴权服务器配置方式

所以如果还需要满足业务需求，比如对接一些第三方的鉴权，这里得添加一些自定义的新的鉴权方式，添加的方式也不麻烦

::: details 自定义授权模式示例

```java
@AutoConfiguration
public class AuthServerConfigurer {

    @Bean
    public DemoTokenEndpointConfigurer demoTokenEndpointConfigurer(PasswordEncoder passwordEncoder
            , OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator
            , OAuth2AuthorizationService authorizationService
            , SysUserMapper sysUserMapper
            , SysUserRoleMapper sysUserRoleMapper
            , ISysParamsObtainService sysParamsObtainService
            , RedisTemplate<String, String> redisTemplate) {
        return new DemoTokenEndpointConfigurer(passwordEncoder
                , tokenGenerator
                , authorizationService
                , sysUserMapper
                , sysUserRoleMapper
                , sysParamsObtainService
                , redisTemplate);
    }

    /**
     * 配置自定义的其他的鉴权方式
     *
     * @return 其他鉴权
     */
    @Bean("otherTokenEndpointConfigurer")
    public IOtherTokenEndpointConfigurer otherTokenEndpointConfigurer(DemoTokenEndpointConfigurer demoTokenEndpointConfigurer) {
        // 这里是一个集合，有其他的鉴权方式，还可以继续往里面添加
        return new OtherTokenEndpointConfigurer(Arrays.asList(demoTokenEndpointConfigurer));
    }
}
```

DemoTokenEndpointConfigurer

```java
@RequiredArgsConstructor
@Slf4j
public class DemoTokenEndpointConfigurer implements IOtherTokenEndpointConfigurer {

    final PasswordEncoder passwordEncoder;
    final OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator;
    /**
     * 鉴权管理，可以从这里根据刷新 token 获取新的 token 什么的
     */
    final OAuth2AuthorizationService authorizationService;

    final SysUserMapper sysUserMapper;
    final SysUserRoleMapper sysUserRoleMapper;
    final ISysParamsObtainService sysParamsObtainService;
    final RedisTemplate<String, String> redisTemplate;

    public static final AuthorizationGrantType GRANT_TYPE = new AuthorizationGrantType("demo");
    public static final String cacheKey = CacheConstants.OAuth.PREFIX + "openid:";

    @Override
    public void customize(OAuth2TokenEndpointConfigurer oAuth2TokenEndpointConfigurer) {

        // 因为和用户名差不多，是使用微信 code 来登录
        CustomizeAuthenticationConverter demoConverter = new CustomizeAuthenticationConverter(
                GRANT_TYPE
                , DemoAuthenticationToken::new
                , "code"
                , "vi"
                , map -> {
            map.put("code", "[code]不能为空，且只能有一个值");
            map.put("vi", "[vi]不能为空，且只能有一个值");
        },
                request -> {
                });
        oAuth2TokenEndpointConfigurer.accessTokenRequestConverter(demoConverter);

        CustomizeAuthenticationProvider demoAuthenticationProvider = new CustomizeAuthenticationProvider(
                GRANT_TYPE
                , customizeAuthenticationToken -> this.findUserByWechatCode((String) customizeAuthenticationToken.getPrincipal())
                , passwordEncoder
                , tokenGenerator
                , () -> DemoAuthenticationToken.class
                , authorizationService);

        demoAuthenticationProvider.setAdditionalAuthenticationChecks((UserDetails userDetails, Authentication authentication) -> {
            // 因为微信登录是使用的微信 code 去获取到 openid,然后我们系统再使用 openid 生成一个游客用户(给一些默认的字段的用户),然后他就可以登录了,不需要再做其他验证
        });
        oAuth2TokenEndpointConfigurer.authenticationProvider(demoAuthenticationProvider);
    }

    /**
     * 根据 微信 code 获取用户信息
     *
     * @param code 微信 code
     * @return 用户信息
     */
    private UserDetails findUserByWechatCode(String code) {
        if (code == null) {
            throw new AccountException("微信 code 不能为空");
        }
        String openid = getOpenid(code);
        if (ObjectUtil.isEmpty(openid)) {
            throw new AccountException("获取到的微信用户信息不正确【openid 为空】");
        }
        return findUserByOpenid(openid);
    }


    /**
     * 获取 openid
     *
     * @param code 微信 code
     * @return 返回 openid
     */
    private String getOpenid(String code) {
        // 这里就模拟获取到 open id 了实际需要自己写调用微信接口去获取 openid
        return UUID.randomUUID().toString(true);
    }

    /**
     * 获取到 openid 之后,这里需要再根据 openid 获取用户信息
     *
     * @param openid openid
     * @return 用户信息
     */
    private UserDetails findUserByOpenid(String openid) {
        return Optional.ofNullable(sysUserMapper.getUserByFiled("openid", openid))
                .map(user -> {
                    OAuth2UserDetails userDetails = new OAuth2UserDetails(user);
                    userDetails.setPrincipal(openid);
                    // 当前获取认证的方式是使用 open id
                    userDetails.setAuthenticationMethod(GRANT_TYPE.getValue());
                    return userDetails;
                })
                // 如果是用微信 openid 去查询的用户，他就有可能是 null 的，这里就需要直接返回 null
                .orElseGet(() -> {
                    SysUser sysUser = new SysUser();
                    sysUser.setId(IdWorker.getId());
                    sysUser.setUsername(cn.hutool.core.lang.UUID.fastUUID().toString(true));
                    // 这里给一个随机的密码,因为是微信端的用户嘛,不是系统后台用户,他是不需要登录后端的,如果需要他登录,你可以在用户管理里面给他重围密码,并且分配有可以登录之后的操作的角色就行
                    sysUser.setPassword(MD5.create().digestHex(cn.hutool.core.lang.UUID.randomUUID().toString()));
                    sysUser.setCreateTime(LocalDateTime.now());
                    sysUser.setNickname("昵称");
                    // 性别，微信这里没有使用国家标准
                    String sex;
                    if (new Random().nextInt(2) == 0) {
                        sex = SysDict.Gender.MALE.getKey();
                    } else {
                        sex = SysDict.Gender.FEMALE.getKey();
                    }
                    sysUser.setGender(sex);
                    // 头像地址
                    sysUser.setAvatar("");
                    // openid
                    sysUser.setOpenid(openid.toString());
                    // 邮箱
                    sysUser.setEmail("demo@test.com");
                    // 手机号
                    sysUser.setPhone(String.format("%d", new Random().nextInt(999999999)));
                    // 直接姓名
                    sysUser.setRealName("真实姓名");
                    // 是否删除,这个默认是0
                    sysUser.setIsDeleted((byte) 0);
                    // 用户类型
                    sysUser.setUserType(SysDict.UserType.TEMP.getKey());
                    // 状态1默认可用
                    sysUser.setStatus((byte) 1);
                    // 组合唯一键,这个默认给0
                    sysUser.setUniqueKey(0L);
                    int r = sysUserMapper.insert(sysUser);
                    if (r == 0) {
                        throw new BadCredentialsException("创建用户失败！");
                    }
                    // 用户和角色关系
                    SysUserRole sysUserRole = new SysUserRole();
                    sysUserRole.setUserId(sysUser.getId());
                    sysUserRole.setRoleId(Long.valueOf(sysParamsObtainService.get(CacheConstants.Params.USER_ROLE_ID)));
                    int i = sysUserRoleMapper.insert(sysUserRole);
                    if (i == 0) {
                        throw new BaseException("用户分配默认角色【" + sysParamsObtainService.get(CacheConstants.Params.USER_ROLE) + "】失败！");
                    }
                    // 再根据 openid 获取一次用户信息
                    OAuth2UserDTO user = sysUserMapper.getUserByFiled("openid", openid);
                    OAuth2UserDetails userDetails = new OAuth2UserDetails(user);
                    // TODO openid 是比较敏感的信息，不应该放出来，这里应该是用个 cacheKey 把他缓存起来，然后在下面刷新模式的时候从缓存里面拿出来出来再去获取用户信息，所以下面的这个时间需要确定好，比 access_token 超时时间长一点才行
                    String key = UUID.randomUUID().toString(true);
                    redisTemplate.opsForValue().set(key, openid, 7200 * 2, TimeUnit.SECONDS);
                    userDetails.setPrincipal(key);
                    // 当前获取认证的方式是使用 open id
                    userDetails.setAuthenticationMethod(GRANT_TYPE.getValue());
                    return userDetails;
                });
    }

    @Override
    public Function<OAuth2Authorization, UserDetails> way2FindUserInRefreshModel() {
        return oAuth2Authorization -> {
            // 之前登录的时候使用的登录主体,可以是用户名,可以是手机号,whatever
            OAuth2Authorization.Token<OAuth2AccessToken> accessToken = oAuth2Authorization.getAccessToken();
            Map<String, Object> metadata = accessToken.getMetadata("metadata.token.claims");
            if (metadata == null) {
                throw new BadCredentialsException("未找到登录的用户信息！");
            }
            String principal = (String) metadata.get(TokenConstants.PRINCIPAL);
            if (principal == null) {
                throw new BadCredentialsException("未找到登录的用户信息！");
            }
            // 如果是 demo grant type 你要如何获取用户
            UserDetails userDetails = findUserByOpenid(principal);
            ((OAuth2UserDetails) userDetails).setGrantType(GRANT_TYPE.getValue());
            return userDetails;
        };
    }

    @Override
    public boolean refreshSupport(OAuth2Authorization oAuth2Authorization) {
        // 之前登录的时候使用的登录类型
        return oAuth2Authorization.getAuthorizationGrantType().equals(GRANT_TYPE);
    }
}
```

:::

::: tip
主要是需要实现或者重写`IOtherTokenEndpointConfigurer`里面的方法
:::

## 自定义添加修改`TOKEN`的内容

`Spring Authorization Server`底层默认使用了[JWT](https://jwt.io/)，`JWT`的内容包括头部（`HEADR`）、载体（`PAYLOAD`）、签名（`VERIFY SIGNATURE`）都是可以修改的

::: details 示例

```java
@AutoConfiguration
public class AuthServerConfigurer {
    
    /**
     * 自定义添加修改 token 的内容，不过 headers 好像只能加，不能删？？？还是我打开的方式不对,总之,配置大概就是这样,你可以根据自己的 grant_type 去扩展你想要的 token 内容
     *
     * @return 自定义
     */
    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtCustomizer(IUserDetailsHandle userDetailsHandle) {
        return context -> {
            // 头信息
            JwsHeader.Builder headers = context.getJwsHeader();
            // 载体信息
            JwtClaimsSet.Builder claims = context.getClaims();
            // 只有 access token 才添加
            if (context.getTokenType().equals(OAuth2TokenType.ACCESS_TOKEN)) {
                AuthorizationGrantType authorizationGrantType = context.getAuthorizationGrantType();
                String grant = authorizationGrantType.getValue();
                String clientId = context.getRegisteredClient().getClientId();
                Set<String> authorizedScopes = context.getAuthorizedScopes();
                UserDetails userDetails;
                // 授权码模式的用户
                User codeUser;
                if (context.getPrincipal() instanceof CustomizeAuthenticatedToken customizeAuthenticationToken) {
                    userDetails = customizeAuthenticationToken.getUserDetails();
                    codeUser = null;
                } else if (context.getPrincipal() instanceof UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) {
                    codeUser = (User) usernamePasswordAuthenticationToken.getPrincipal();
                    userDetails = null;
                } else {
                    userDetails = null;
                    codeUser = null;
                }
                if (userDetails != null) {
                    if (userDetails instanceof OAuth2UserDetails oAuth2UserDetails) {
                        if (oAuth2UserDetails.getGrantType() != null) {
                            grant = oAuth2UserDetails.getGrantType();
                        }
                    }
                }
                headers.type("JWT");
                // kid 替代不了 jti，这里主要是为了作一个唯一，知道每次登录都是新的登录
                headers.header(TokenConstants.JWT_JTI, UUID.randomUUID().toString(true));
                String finalGrant = grant;
                claims.claims(map -> {
                    // String sub = map.get("sub").toString();
                    map.remove("sub");
                    map.remove("aud");
                    // map.remove("nbf");
                    map.remove("iss");
                    // map.remove("iat");
                    map.put("scope", authorizedScopes);
                    map.put("client_id", clientId);
                    map.put("grant_type", finalGrant);
                    // 授权码模式，刷新 token 模式
                    if (finalGrant.equals(OAuth2GrantType.AUTHORIZATION_CODE)
                            || finalGrant.equals(AuthorizationGrantType.REFRESH_TOKEN.getValue())) {
                        if (codeUser != null) {
                            if (userDetailsHandle != null) {
                                // 这里直接再根据用户名获取一遍用户信息，所以这里建议 userDetailsHandle.getUserByUsername 使用缓存
                                Optional.ofNullable(userDetailsHandle.getUserByUsername(codeUser.getUsername()))
                                        .ifPresent(dto -> map.put(JwtTokenKeyConstants.USER_ID, dto.getUserId().toString()));
                            }
                            // 当然也是通过用户名认证的
                            map.put(JwtTokenKeyConstants.AUTH_M, OAuthenticationMethodType.USERNAME.getValue());
                            map.put(JwtTokenKeyConstants.USERNAME, codeUser.getUsername());
                            map.put(JwtTokenKeyConstants.AUTHORITIES, codeUser.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
                        }
                    }
                    // 用户名密码登录模式
                    if (finalGrant.equals(OAuth2GrantType.TAYBCT)
                            || finalGrant.equals(OAuth2GrantType.SMS)
                            || finalGrant.equals(DemoTokenEndpointConfigurer.GRANT_TYPE.getValue())) {
                        if (userDetails != null) {
                            if (userDetails instanceof OAuth2UserDetails oAuth2UserDetails) {
                                map.put(JwtTokenKeyConstants.USER_ID, oAuth2UserDetails.getUserId().toString());
                                map.put(JwtTokenKeyConstants.AUTH_M, oAuth2UserDetails.getAuthenticationMethod());
                            }
                            map.put(JwtTokenKeyConstants.USERNAME, userDetails.getUsername());
                            map.put(JwtTokenKeyConstants.AUTHORITIES, userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
                        }
                    }

                    // 如果是自定义的 demo grant type
                    if (finalGrant.equals(DemoTokenEndpointConfigurer.GRANT_TYPE.getValue())) {
                        if (userDetails != null) {
                            if (userDetails instanceof OAuth2UserDetails oAuth2UserDetails) {
                                map.put(TokenConstants.PRINCIPAL, oAuth2UserDetails.getPrincipal());
                            }
                        }
                    }
                    // 如果是其他方式？
                    //
                });
            }
//            else if (context.getTokenType().getValue().equals(OidcParameterNames.ID_TOKEN)) {
//                // Customize headers/claims for id_token
//
//            }
        };
    }
}    
```

签名部分，可以使用`RSA`证书

```java
    /**
     * An instance of java.security.KeyPair with keys generated on startup used to create the JWKSource above.<br>
     * 生成秘钥对，为jwkSource提供服务。
     *
     * @return KeyPair
     */
    @Bean
    @ConditionalOnMissingBean(KeyPair.class)
    public KeyPair keyPair(@Nullable RSAProperties properties) {
        if (ObjectUtil.isNotEmpty(properties)) {
            RSACoder.ini(properties);
            if (properties.getType().containsKey("JWT")) {
                return RSACoder.keyPair("JWT");
            }
        }
        properties = new RSAProperties();
        properties.setResource("jwt.jks");
        properties.setAlias("jwt");
        properties.setPassword("taybct");
        properties.setExpireCheck(true);
        return RSACoder.newKeyPair(properties);
    }
```

:::

::: warning
不建议修改签名证书的代码（`Bean`注入），可以生成新的`jwt.jks`证书，[生成方式](../guide/GenKeys.html)
:::



### 其他示例配置

其他相关的配置示例，可以[查看](https://github.com/taybct/spring-taybct-single/blob/3.2.x/run/src/main/java/io/github/mangocrisp/spring/taybct/single/security/AuthServerConfigurer.java)

## 第三方授权码登录模式登录页面配置 <Badge text="3.2.3" type="tip" vertical="top" />

version: 3.2.3

[Spring Authorization Server](https://spring.io/projects/spring-authorization-server) 默认的登录页面是 `/oauth2/authorize`，但是 `/oauth2/authorize` 是 `POST` 请求，所以 `GET` 请求会跳转到 `/login` 页面，传统的方式是使用 Thymeleaf 模板引擎来生成前端登录页面，现在都是前后端分离了，前端大多使用  VUE 来开发的。所以这里可以根据 [Spring Authorization Server](https://spring.io/projects/spring-authorization-server) 源码分析出，他是利用 Cookies 来做授权码登录的，所以我这里就在登录成功之后把 Cookies 存到前，再次请求的时候就会带上 Cookies，这样去生成 Code ，然后再去获取 Access Token。

我已经做完了上面的这些集成了，所以在实际开发过程中只需要配置几个参数就行了：

```yaml
taybct:
  secure:
    auth:
      login-page:
        # 开启重定向到登录页面
        redirect: true
        # 登录页面
        redirect-login-page: https://127.0.0.1/#/login
        # 登录页面登录成功之后用于获取 code 的接口地址
        params-redirect-api: https://127.0.0.1/api/auth/oauth/authorize
        # 前端获取参数需要加密的 url 加密类型
        params-redirect-api-encode-type: uri_component
```
