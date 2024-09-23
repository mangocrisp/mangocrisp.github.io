---
shortTitle: Spring TayBct
description: Spring 后端开发框架
index: false
comment: false
article: false
timeline: false
lastUpdated: true
editLink: false
contributors: true
icon: "simple-icons:spring"
dir:
  link: true
isOriginal: false
date: 2024-09-20
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
cover: /assets/images/ys/KamisatoAyakaS.jpeg
---

# Spring TayBct

Java 后端开发， Spring Boot 框架基础后台管理业务功能集成

## 特点

- <Badge text="后台管理基础功能" type="tip" vertical="middle" /><br>
  后台管理会用到的一些基础功能，包括不限于，用户体系（多租户 + RABC）、字典/参数管理、任务调度、通知公告、流程管理
- <Badge text="初始化项目" type="danger" vertical="middle" /><br>
  可以用来当 Spring Boot 项目的初始化模板项目，已经默认集成了一些常用的框架，以及对他们做了常用的配置（这些配置在后续开发的过程中可以自行修改）
- <Badge text="RBAC（角色-权限-控制）" type="info" vertical="middle" /><br>
  最常用的权限控制，权限这里还包含了菜单和接口请求
- <Badge text="Spring Cloud GateWay + Nacos + Dubbo（微服务<==>单体架构完美转换）" type="tip" vertical="middle" /><br>
  去掉 Spring Cloud Gateway、Dubbo/Feign、Nacos 就变单体，加上就是微服务，根据项目实际需求来决定
- <Badge text="鉴权/资源服务器" type="danger" vertical="middle" /><br>
  [Spring Authorization Server](https://spring.io/projects/spring-authorization-server)（OAuth2）自定义鉴权类型和后续可扩展
- <Badge text="RESTful 接口" type="warning" vertical="middle" /><br>
  这边建议所有的后端接口（与前端对接的接口）都严格遵循 [RESTful 风格](https://restfulapi.cn/)

## 源码

::: info
拿人东西就分享出来，项目代码借鉴了许多互联网上的同行和我自身的经验，希望对你有帮助
:::

<VPBanner
  title="Spring TayBct Tools"
  content="Spring 业务组件基础集成的工具类库，对一些常用的中间件做了基础的常用的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/mangocrisp/spring-taybct-tools",
    },
    {
      text: "GitLab",
      link: "https://gitlab.com/mangocrisp/spring-taybct-tools",
      type: "default"
    },
  ]'
/>

<VPBanner
  title="Spring TayBct"
  content="Spring 业务组件基础集成的基础业务库，对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/mangocrisp/spring-taybct",
    },
    {
      text: "GitLab",
      link: "https://gitlab.com/mangocrisp/spring-taybct",
      type: "default"
    },
  ]'
/>

<VPBanner
  title="Spring TayBct Single"
  content="Spring 业务组件基础集成的基础业务（单体架构），对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/mangocrisp/spring-taybct-single",
    },
    {
      text: "GitLab",
      link: "https://gitlab.com/mangocrisp/spring-taybct-single",
      type: "default"
    },
  ]'
/>

<VPBanner
  title="Spring TayBct Cloud"
  content="Spring 业务组件基础集成的基础业务（微服务架构），对一些常用的系统管理，用户体系等基础功能做了基础的常用的简易的集成，并且提供一些业务开发过程中常用的功能模块集成"
  :actions='[
    {
      text: "GitHub",
      link: "https://github.com/mangocrisp/spring-taybct-cloud",
    },
    {
      text: "GitLab",
      link: "https://gitlab.com/mangocrisp/spring-taybct-cloud",
      type: "default"
    },
  ]'
/>


<Catalog />