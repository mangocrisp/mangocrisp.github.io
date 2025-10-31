---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 工具类
# 当前页面内容描述
description: 工具类
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
order: 3
dir:
  order: 3
# 页面图标
icon: "streamline-ultimate:common-file-module-1"
# 是否原创
isOriginal: false
# 日期
date: 2025-06-06
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 轮子
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 工具类

提供了一些方便业务开发的工具类，一些好用的通用工具类也有依赖进来，可以直接使用，例如：[Hutool](https://doc.hutool.cn/)

## 业务常用的工具类

### HttpClientUtil

在后端请求接口时，可以使用这个工具类，已经做了很多封装，可以快速使用，例如：

- 支持 SSL 的请求
- 支持 GET、POST、PUT、DELETE、PATCH 等请求，你也可以通过提供[HttpUriRequest](https://hc.apache.org/httpcomponents-client-5.5.x/current/httpclient5/apidocs/org/apache/hc/client5/http/classic/methods/ClassicHttpRequests.html)自定义如何请求
- 对请求做了 CURL 生成（需要将日志输出级别设置为 DEBUG），可以查看每次请求的 CURL 命令，复制到 Postman 或者 ApiFox，能更方便的测试接口

详见：[HttpClientUtil](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/util/HttpClientUtil.html)

### MyBatisUtil

对 MyBatis 的一些常用接口的封装，例如：

- 利用传入的参数，自动生成需要的 Wrapper 对象
- 利用传入的参数，自动判断生成分页参数

详见：[MyBatisUtil](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/util/MyBatisUtil.html)

### ValidatorUtil

数据校验工具类，通常我们对接口的参数进行校验，会使用`@Valid`或者`@Validated`注解，但是如果希望在逻辑处理的过程中进行校验，可以使用这个工具类。

详见：[ValidatorUtil](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/util/ValidatorUtil.html)

### CollectionSortUtil

集合排序工具类

- 可以按照指定的字段进行排序
- 对于字段中包含的中文，可以按照拼音进行排序，并且对于多音字也做了处理，会按照语意进行排序，比如 "重(chong)庆" 会排在 "重(zhong)大" 之前

详见：[CollectionSortUtil](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/util/CollectionSortUtil.html)

### TreeUtil

树工具类，可以生成树结构

- 不改变原数据类型
- 可自定义排序规则
- 不排序或者按数据排序可以实现100万数据在 500 毫秒内完成生成树和排序
- 不限定 root 节点
- 可以指定排除某些节点

详见：[TreeUtil](https://mangocrisp.top/javadoc/spring-taybct-tools-doc/io/github/taybct/tool/core/util/tree/TreeUtil.html)

示例：
[::mdi:github:: 用户部门树结构](https://github.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-system/src/main/java/io/github/taybct/module/system/service/impl/SysDeptServiceImpl.java#L51-L69)
[::simple-icons:gitee:: 用户部门树结构](https://gitee.com/taybct/spring-taybct/blob/main/spring-taybct-modules/spring-taybct-module-system/src/main/java/io/github/taybct/module/system/service/impl/SysDeptServiceImpl.java#L51-L69)

## 其他工具类

在项目里面封装了一些常用的工具类，可以自行下载源码查看

[::mdi:github:: spring-taybct-tools](https://github.com/taybct/spring-taybct-tools)
[::simple-icons:gitee:: spring-taybct-tools](https://gitee.com/taybct/spring-taybct-tools)

[::mdi:github:: spring-taybct](https://github.com/taybct/spring-taybct)
[::simple-icons:gitee:: spring-taybct](https://gitee.com/taybct/spring-taybct)
