---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Scheduler
# 当前页面内容描述
description: Scheduler
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
order: 14
dir:
  order: 14
# 页面图标
icon: "catppuccin:java-annotation"
# 是否原创
isOriginal: false
# 日期
date: 2024-12-19
# 类别
category:
  - 代码笔记
tag:
  - 后端
  - Java
  - SpringBoot
  - "Spring Taybct"
  - 开发框架
  - 注解
  - 任务调度
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# Scheduler

任务调度任务标识

## 参数说明

| 参数 | 类型 | 必须 | 默认 | 说明 |
|:----:|:----:|:----:|:----:|:----:|
| value | String | 否 | "" | 设置任务名，这个名字，如果不指定，就会默认用 bean 的 name |

## 使用说明

注解到任务调度的任务类上，来标识这是一个可以执行的任务

::: details 示例

```java
@Slf4j
@Scheduler("clearExpires")
public class ClearExpiresTask extends RedisScheduledTaskJob {

    final ISysUserOnlineService sysUserOnlineService;

    @Resource
    private IMessageSendService messageSendService;

    @Override
    protected Consumer<JSONObject> getLogRecorder() {
        return json -> messageSendService.send(new ScheduledLogDTO(json));
    }

    public ClearExpiresTask(RedisTemplate<String, String> redisTemplate
            , Environment env
            , ISysUserOnlineService sysUserOnlineService) {
        super(redisTemplate, env);
        this.sysUserOnlineService = sysUserOnlineService;
    }

    @Override
    public void run(Map<String, Object> params) {
        log.debug("clearExpires => 当前线程名称 {} ", Thread.currentThread().getName());
        log.debug(">>>>>> 清理检查在线用户状态开始 >>>>>> ");
        sysUserOnlineService.clearExpires();
        log.debug(">>>>>> 清理检查在线用户状态结束 >>>>>> ");
    }

}
```

:::
