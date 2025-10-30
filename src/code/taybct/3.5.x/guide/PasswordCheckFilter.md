---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 密码验证异常次数限制
# 当前页面内容描述
description: 密码验证异常次数限制
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
order: 11
dir:
  order: 11
# 页面图标
icon: "ant-design:security-scan-outlined"
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

# 密码验证异常次数限制

::: info
如果使用密码登录失败次数过多可以怀疑是恶意试密码，就需要有个锁定时间来限制这种刷接口的行为
:::

```java
@AutoConfiguration
@AutoConfigureOrder(Integer.MIN_VALUE)
public class SingleAuthConfig {

    /**
     * 密码验证过滤器,密码验证失败一定次数就不给过了
     *
     * @param redisTemplate redis 操作
     * @return FilterRegistrationBean
     */
    @Bean
    public FilterRegistrationBean<PasswordCheckFilter> passwordCheckFilter(RedisTemplate<String, Integer> redisTemplate) {
        FilterRegistrationBean<PasswordCheckFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new PasswordCheckFilter(redisTemplate));
        registrationBean.addUrlPatterns("/auth/oauth/login");
        registrationBean.setName("PasswordCheckFilter");
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 3);
        return registrationBean;
    }
}
```

`PasswordCheckFilter` 的默认限制次数是 5 次，5次没通过就锁定5分钟
