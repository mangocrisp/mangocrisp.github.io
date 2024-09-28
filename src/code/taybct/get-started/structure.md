---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 项目结构
# 当前页面内容描述
description: 项目结构
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
order: 4
dir:
  order: 4
# 页面图标
icon: "ph:tree-structure-light"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-28
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 快速开始
  - 项目结构
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 项目结构

## Single

单体架构

### 优缺点

- 优点
   
1. 小项目开发快 成本低
2. 架构简单
3. 易于测试
4. 易于部署
  
- 缺点 
   
1. 大项目模块耦合严重，不易开发，维护，沟通成本高
2. 新增业务困难
3. 核心业务与边缘业务混合在一块，出现问题互相影响

### 项目结构

为了弥补缺点，本项目采用了多模块开发，集中依赖模块运行的方式

```
.
├── admin 管理模块
│       ├── admin-file 文件管理
│       └── admin-log 日志管理
├── api 接口模块
│       └── api-system 系统模块接口
├── auth 鉴权模块
├── common 通用公共代码
├── laboratory 实验室功能
│       ├── lab-flux 模拟接口(Flux)
│       └── lab-mock 模拟接口
├── modules 业务模块
│       ├── module-lf 流程管制
│       ├── module-scheduling 任务调度
│       └── module-system 系统模块
├── run 运行模块
└── pom.xml 配置依赖/打包管理
```

::: info 接口模块
模块与模块之前通过接口相互调用解耦，默认只有系统模块，所以如果后面还有其他模块，并且有需要相互调用的，就继续往下面添加
:::

::: info 流程管制
需要结合[LogicFlow](https://site.logic-flow.cn/tutorial/about)来使用
:::

::: info 运行模块
引入需要运行的业务模块和功能集中运行为一个单服务，可以很方便的部署，并且每个业务模块都是经过打包成 jar 包的，开发运行启动速度也非常快
:::

::: info 实验室功能
有些时候，我们写了一些和第三方对接的接口，但是又不能及时和第三对接（可能是网络原因，也可能是人家只是写了接口文档，接口还没部署，或者是我们本身测试环境部署测试比较麻烦），于是我们可以在开发的时候就自己模拟第三方接口返回数据等功能
:::

## Clud

微服务架构是分布式架构(SOA)架构的一种拓展，这种架构模式下它拆分粒度更小，服务更独立，把应用拆分一个个微小的服务。微服务的关键在于微小、独立、轻量级通信

### 优缺点

- 优点

1. 便于特定业务功能的聚焦
2. 每个微服务都可以被⼀个⼩团队单独实施（开发、测试、部署上线、运维），团队合作⼀定程度解耦，便于实施敏捷开发
4. 便于重⽤和模块之间的组装
5. 不同的微服务可以使⽤不同的语⾔开发，松耦合
6. 更容易引⼊新技术
7. 可以更好的实现DevOps 开发运维⼀体化

- 缺点

1. 分布式复杂难以管理，当服务量增加，管理越加复杂
2. 微服务架构下，分布式链路跟踪难

### 项目结构

同样为了弥补缺点，本项目推荐使用[Dubbo](https://cn.dubbo.apache.org/zh-cn/overview/what/)来实现服务模块与模块之间的调用通信，使用[SkyWalking](https://skywalking.apache.org/zh/2020-04-19-skywalking-quick-start/)来实现链路追踪

```
.
├── _ini 存放一些初始化配置文件
├── admin 管理模块
│       ├── admin-file 文件管理
│       ├── admin-log 日志管理
│       └── admin-monitor 运行监控
├── api 接口模块
│       ├── api-proxy 代理接口
│       └── api-system 系统模块接口
├── auth 鉴权模块
├── common 通用公共代码
├── gateway 网关模块（后端服务统一入口）
├── laboratory 实验室功能
│       ├── lab-flux 模拟接口(Flux)
│       └── lab-mock 模拟接口
├── modules 业务模块
│       ├── module-es 搜索引擎
│       ├── module-lf 流程管制
│       ├── module-scheduling 任务调度
│       └── module-system 系统模块
├── run 运行模块
└── pom.xml 配置依赖/打包管理
```

::: info 代理接口
有的时候我们部署项目，服务器资源提供者（客户）只给我们提供单台有互联网或者有与其他第三方有通讯能力的`IP`，虽然可能使用`Nginx`等方式做`正/反向代理`,但是我们也可以自行写一个单独的小型的纯接口访问的微服务到那台服务器上做对接
:::

::: warning 运行监控
非必要，可以通过检查日志实现查看各个服务的运行状态，而不需要跑得对应的服务器上去查看，但是是通过暴露一些接口来实现，所以存在很多安全隐患，谨慎使用！！！当然也有很多更先进的工具可以实现服务器运行监控，例如[ZABBIX](https://www.zabbix.com/cn) 
:::

微服务应用模块

![微服务应用模块](/assets/images/taybct/CloudApplication.png)


- AuthApplication<Badge text="必须" type="tip"/>：鉴权服务
- ESApplication<Badge text="可选" type="note"/>：全文搜索服务
- FileApplication<Badge text="建议" type="info"/>：文件管理服务
- GatewayApplication<Badge text="必须" type="tip"/>：网关服务
- LogApplication<Badge text="建议" type="info"/>：日志服务
- LogicFlowApplication<Badge text="可选" type="note"/>：流程管理服务
- MonitorApplication<Badge text="可选" type="note"/>：运行监控
- SchedulingApplication<Badge text="建议" type="info"/>：任务调度
- SystemApplication<Badge text="必须" type="tip"/>：系统服务
