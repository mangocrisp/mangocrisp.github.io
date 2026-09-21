---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 任务调度
# 当前页面内容描述
description: 任务调度
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
order: 16
dir:
  order: 16
# 页面图标
icon: "ix:live-schedule"
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

# 任务调度

::: info
在项目开发中如果需要让程序自动在某个时刻去执行一些命令，就需要使用到任务调度
:::

## 如何使用



引入依赖 spring-taybct-tool-scheduling

```xml
        <!--任务调度-->
        <dependency>
            <groupId>io.github.mangocrisp</groupId>
            <artifactId>spring-taybct-tool-scheduling</artifactId>
        </dependency>
```



## 基于 yaml



默认框架的任务调度是基于 yaml/properties 的



你只需要写对应的配置和写任务调度的类就可以实现调度了



```yaml
taybct:
  scheduled:
    pool-size: 20
    await-termination-seconds: 60
    thread-name-prefix: "Scheduler-"
    wait-for-tasks-to-complete-on-shutdown: true
    tasks:
      clearDirtyData:
        task-key: clearDirtyData
        cron: 0 0/1 * * * ?
        description: "清理权限脏数据"
        auto-start: 1
        sort: 0
        params:
          "params1": 1
          "params2": 2
          "params3": 3
          "params4": 4
      clearExpires:
        task-key: clearExpires
        cron: 0 0/1 * * * ?
        description: "清理登录超时用户"
        auto-start: 1
        sort: 1
      iniPermissionConfig:
        task-key: iniPermissionConfig
        cron: 0 0/1 * * * ?
        description: "初始化权限配置"
        auto-start: 1
        sort: 2
```

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Scheduler("clearExpires")
public class ClearExpiresTask extends AbstractScheduledTaskJob {

    final ISysUserOnlineService sysUserOnlineService;

    @Override
    public void run(Map<String, Object> params) {
        log.info("ClearExpiresTask => 当前线程名称 {} ", Thread.currentThread().getName());
        log.info(">>>>>> 清理检查在线用户状态开始 >>>>>> ");
        sysUserOnlineService.clearExpires();
        log.info(">>>>>> 清理检查在线用户状态结束 >>>>>> ");
    }

}
```

## 基于数据库



这个在模块 spring-taybct-module-scheduling 里面已经写好了，你只需要在 module-scheduling 里面写调度类就可以了

```java
@Component
@RequiredArgsConstructor
@Slf4j
@Scheduler("demo")
public class DemoTask extends AbstractScheduledTaskJob {

    final IScheduledLogService scheduledLogService;

    @Override
    protected Consumer<JSONObject> getLogRecorder() {
        return scheduledLogService::logRecorder;
    }

    @Override
    public void run(Map<String, Object> params) throws Exception {
        log.info("demo task => 当前线程名称 {} ", Thread.currentThread().getName());
        log.info(">>>>>> 测试任务开始 >>>>>> ");
//        stopRecord(OperateStatus.SUCCESS.getCode(), "我自己记录一个消息");
//        throw new RuntimeException("最后个报错");
    }

}

```



### 数据库任务调度接口



这个可以直接在 /doc.html 里面查看任务调度模块的接口就可以了



获取分页(带启动状态)，可以查看任务是否已经在启动，然后，有相应的指令去操作任务。



## 基于其他



...其实原理也还算是简单，你只需要继承 AbstractTaskSupplier 或者 实现 ITaskSupplier，然后实现 ITaskSupplier 的几个接口，就可以自己定义你想怎么去调度



## @Scheduler



框架会去找所有加了这个注解的类，来当作任务调度的类，或者是 bean，这个名字，如果不指定，就会默认用 bean 的 name



## 日志记录



框架提供了基本的日志记录功能，你需要提供一个 `Consumer<JSONObject>` 来记录日志，一次任务调用完毕，会把调用的记录通过 JSONObject 传给你提供的这个 Consumer



### 自己定义日志的消息

默认的日志记录只记录，是否执行完毕，你如果需要记录一些其他的消息，可以直接

```java
stopRecord(OperateStatus.SUCCESS.getCode(), "我自己记录一个消息");
```

但是，注意，这个记录只能写一次，而且，你记录之后，框架就不会再记录

## ServiceApiTask 服务接口定时任务

通过指定需要的服务名，接口名来调用接口。在微微服务项目里面，分布式任务调度通过统一的任务调度服务来完成任务统一的调度，所以可以通过在任务调度中心来配置服务接口任务。配置如下：

示例：
```yaml
taybct:
  scheduled:
    pool-size: 20
    await-termination-seconds: 60
    thread-name-prefix: "Scheduler-"
    wait-for-tasks-to-complete-on-shutdown: true
    packages-to-scan:
      - io.github.taybct.**.task.job
    tasks:
      serviceApiTask_01:
        task-key: serviceApiTask
        cron: 0 0/1 * * * ?
        description: "接口调度01"
        auto-start: 1
        sort: 0
        params:
          serviceId: module-system
          method: POST
          mapping: /demo/testSchedule1?param1=1&param2=2
          auth:
            username: admin
            userId: 2
            role:
              - ADMIN
          queryParams:
            param1: 1
            param2: 2
          queryBody:
            name: "test"
            age: 18
            sex: "男"
            address: "中国"
            hobby:
              - "football"
              - "basketball"
            birthday: "2026-04-03"
            isMarried: true
            height: 1.8
            weight: 80.5
            isStudent: false
```

不再需要写一个任务调度就写一遍 bean，直接在前端配置都可以完成定时调用某个模块的某个接口，详情查看 [ServiceApiTask](https://github.com/taybct/spring-taybct/blob/3.5.3/spring-taybct-modules/spring-taybct-module-scheduling/src/main/java/io/github/taybct/module/scheduling/task/job/ServiceApiTask.java)

参数说明：

- serviceId：服务名，也就是注册在注册中心中的服务名，程序会用这个服务名来去注册中心中寻找服务实例然后循环访问这些服务直到找到一个可用的为止
- method：请求方式，例如 GET POST PUT DELETE，注意，必须要大写
- mapping：接口映射，例如 /user/name/1，也就是接口的访问地址，也可以在地址中使用 {id} 的方式来动态指定参数，例如 /user/name/{id}?q={q}，那么接口调用的时候就可以传入参数 id 的值了
- queryParams：get 请求参数，结合上面的 mapping 使用, 例如 {"id":1, "q": "what"}
- queryBody：post 请求体，例如 {"name":"张三", "age": 28}
- auth：认证信息，例如 {"username": "admin", "userId": 1, "role": ["ADMIN", "USER"]}
