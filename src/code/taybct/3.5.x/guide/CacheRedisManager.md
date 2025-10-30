---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 缓存管理配置
# 当前页面内容描述
description: 缓存管理配置
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
order: 9
dir:
  order: 9
# 页面图标
icon: "octicon:cache-24"
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

# 缓存管理配置

::: info
SpringBoot 集成的 Redis 默认的一些默认配置有些时候是不怎么适用真实使用场景的，比如缓存时间，默认是不限制，但是这样会很容易造成资源浪费，或者存一些脏数据
:::

```java
@Component
public class CacheRedisManager implements CacheManager {

    private final RedisCacheManager manager;

    public CacheRedisManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(90));
        this.manager = RedisCacheManager
                .builder(RedisCacheWriter.nonLockingRedisCacheWriter(connectionFactory))
                .cacheDefaults(redisCacheConfiguration).build();
    }

    @Override
    public Cache getCache(String name) {
        return this.manager.getCache(name);
    }

    @Override
    public Collection<String> getCacheNames() {
        return this.manager.getCacheNames();
    }
}
```
