---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 生产环境部署安全问题
# 当前页面内容描述
description: 生产环境部署安全问题
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
icon: "carbon:ibm-cloud-security-compliance-center"
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

# 生产环境部署安全问题

项目在服务器生产环境部署运行时，一些对于开发来说很方便的功能会成为安全隐患，需要手动去禁止这些功能，这里有一些常见修改：

## Actuator

`Actuator`是`Spring Boot`提供的对应用系统的自省和监控的集成功能，可以对应用系统进行配置查看、相关功能统计等，可以通过暴露端点来查看这些信息，有些信息是比较敏感的，所以如果项目里面依赖了`Actuator`，可以通过修改配置：

```yaml
management:
  endpoints:
    enabled-by-default: false
    web:
      discovery:
        enabled: false
      exposure:
        include: "*"
```

## Swagger

现在的项目开发形式，大多都是前后端分离了，为了方便前后端对接接口，`Swagger`是很好用的工具，但是这样也会把项目所有的接口都暴露出来了，可以通过配置：

```yaml
knife4j:
  production: false
```

来开启生产环境屏蔽

## 黑/白名单（3.2.1+）

在生产环境中，可能会遇到一些恶意刷接口的请求，对于这些 ip 地址，是可以做黑色名单限制，或者一些接口请求，只希望给运维机调用，这就需要用到黑/白名单来控制接口的访问

### 黑名单

黑名单可以直接将接口屏蔽，所有人都访问不了，也可以指定不给某些 ip 访问

- 直接屏蔽

```yaml
taybct:
  secure:
    # 黑名单
    black-list:
      uris:
        - "/actuator/**"
        - "/doc.html"
        - "/swagger-ui/**"
```

- 限制 ip 访问

```yaml
taybct:
  secure:
    black-list:
      uri-ip-set:
        - uri: "/actuator/**"
          ip-set:
            - "192.168.1.1"
            - "192.168.1.2"
        - uri: "/doc.html"
          ip-set:
            - "192.168.1.1"
            - "192.168.1.2"
```

### 白名单

白名单，只能指定的 ip 访问

```yaml
taybct:
  secure:
    white-list:
      uri-ip-set:
        - uri: "/actuator/**"
          ip-set:
            - "192.168.1.1"
            - "192.168.1.2"
        - uri: "/doc.html"
          ip-set:
            - "192.168.1.1"
            - "192.168.1.2"
```