---
shortTitle: 快速开始
description: 这里是如何快速启动起来使用
index: false
comment: false
article: false
timeline: false
lastUpdated: true
editLink: false
contributors: true
icon: "hugeicons:start-up-02"
# 指定当前页面在侧边栏或目录中的排序
order: 1
dir:
  order: 1
  link: true
isOriginal: false
date: 2024-09-22
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 快速开始
# cover: /assets/images/ys/KamisatoAyakaS.jpeg
---

# 快速开始

<VPBanner
  title="基础使用"
  content="这里只讲述如何让项目启动起来，具体的一些使用细节请参照"
  :actions='[
    {
      text: "指南",
      link:"/code/taybct/guide/",
    }
  ]'
/>

## 后端接 JavaDoc 口文档

<a href="/javadoc/spring-taybct-tools-doc/index.html" target="_blank" >::line-md:link::spring-taybct-tools 接口文档</a>

<a href="/javadoc/spring-taybct-doc/index.html" target="_blank" >::line-md:link::spring-taybct 接口文档</a>

## 前端框架集成

本项目为纯后端项目，所以这里适配了一开源的前端模板，可以自行拿去使用：

<VPBanner
  title="gx-cloud-web"
  content="这个是我公司的前端小伙伴开发的基于Vue3的开源前端框架，基于Vue3、Element Plus、TypeScript、Vite、Pinia、Axios、Vue Router 等主流技术，也做了一些工具类和脚手架的封装...因为是比较早的就和我一起在开发了，所以这个框架是与我后端框架比较完整的集成的。"
  :actions='[
    {
      text: "文档",
      link:"https://turtlewxg.github.io/gx-web-doc/",
    }
  ]'
/>


<VPBanner
  title="vue-pure-admin"
  content="这个框架是我自己以学习/复习的形式去集成的大佬的框架，和 gx-cloud-web 类似的框架，并且这个框架是完全免费开源的，但是这个框架是纯前端的，没有后端，所以我就给他集成进来。"
  :actions='[
    {
      text: "我集成的代码：Gitee",
      link:"https://gitee.com/mangocrisp/vue-pure-admin",
    },
    {
      text: "框架原作者的：GitHub",
      link:"https://github.com/xiaoxian521",
      type: "default",
    }
  ]'
/>

... 后续添加一些其他框架的吧，比如 react, ant-design 等

<Catalog />