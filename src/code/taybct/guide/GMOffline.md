---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 强制下线
# 当前页面内容描述
description: 强制下线
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
order: 19
dir:
  order: 19
# 页面图标
icon: "material-symbols:offline-pin-off-outline-rounded"
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

# 强制下线

::: info
强制登出用户的时候，需要处理用户缓存，或者修改了角色，需要强制拿出这些角色相关的用户的话，需要开发人员自行决定是否要这样做。下面这两个配置类，需要放在 system 模块下
:::

## 用户处理

```java
@Component
@RequiredArgsConstructor
public class LoginCacheClear implements ILoginCacheClear {

    final RedisTemplate<Object, Object> redisTemplate;

    @Override
    public void accept(Collection<SysUser> sysUsers) {
        redisTemplate.delete(sysUsers.stream()
                .map(user -> Arrays.asList(
                        //TODO 这里有多少种登录方式就得加多少种，用户名，包含了邮箱
                        String.format("%s::%s", CacheConstants.OAuth.USERNAME, user.getUsername()),
                        String.format("%s::%s", CacheConstants.OAuth.OPENID, user.getUsername()),
                        String.format("%s::%s", CacheConstants.OAuth.PHONE, user.getPhone()),
                        String.format("%s::%s", CacheConstants.OAuth.USERID, user.getId())
                ))
                .flatMap(Collection::stream)
                .collect(Collectors.toSet()));
    }
}
```



## 角色处理

```java
@Component
public class ForceAllClientUserByRole implements IForceAllClientUserByRole {

    @Override
    public void accept(String s, Collection<Long> longs) {
        // 这里默认不处理按角色掉线用户，因为角色关联的用户可能太多了
    }
}

```
