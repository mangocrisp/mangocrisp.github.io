---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 项目部署
# 当前页面内容描述
description: 项目部署
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
icon: "eos-icons:deploy"
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
  - 项目部署
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 项目部署

一个稍微大点的项目一般还包括了众多的中间件，所以在部署项目前，请先确保中间件是否正常安装[中间件安装参考](/ware/soft/)，并且正确配置[环境准备](/code/taybct/get-started/environments)

## 架构图

![架构图](/assets/images/taybct/structure.png)

## Single

单体架构部署比较简单

1. 将打包好后的`jar 包`上传到服务器的任意位置（硬盘空间足够）
2. 在`jar 包`同级目录下创建`config`目录，用于存放配置文件，可以将项目的`run/src/resources/`目录下的所有配置文件都放在这个目录里面
3. 创建运行文件
   
## Cloud

微服务构架部署和单体类似，只不过是可以在多个服务器，或者是服务器的多个文件夹，或者创建多个启动命令，来达到同时启动多个服务的目的，这只需要配置好了注册中心(Nacos)和配置中心(Nacos)的连接信息就行了


启动命令，用于启动服务

## Linux

Linux 部署要注意的是，没有图形化的界面，所以一定要做好运维记录，不然后面很难维护

### 启动脚本

::: details run.sh

```bash
#!/bin/ash
# 清除之前运行的控制台输出日志
echo "">run.jar.out
# 指定jdk的 java 命令，你也可以指定对应的 jdk 版本
java=java
# 打包好后的jar包名，每个服务的 jar 包名不一样
jar=run.jar
# 配置 VM 参数
vm=-Dfile.encoding=utf-8 \
-Dmaven.wagon.http.ssl.insecure=true \
-Dmaven.wagon.http.ssl.allowall=true \
--add-opens java.base/java.util=ALL-UNNAMED \
--add-opens java.base/java.lang=ALL-UNNAMED \
--add-opens java.base/java.lang.reflect=ALL-UNNAMED \
--add-opens java.base/java.lang.invoke=ALL-UNNAMED \
--add-opens java.base/java.lang.io=ALL-UNNAMED
# 配置 Jar 包参数
params=--spring.profiles.active=test \
--spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848 \
--spring.cloud.nacos.config.server-addr=127.0.0.1:8848 \
--spring.cloud.nacos.username=nacos \
--spring.cloud.nacos.password=nacos \
--server.port=8080
# 组合成启动命令，后台运行，并且把控制台日志输出到 run.jar.out 文件
nohup $java $vm -jar $jar $params >run.jar.out 2>&1 &
```
使用`nohup`在后台运行`Jar 包`

[参考1](https://www.runoob.com/linux/linux-comm-nohup.html)
[参考2](https://blog.csdn.net/weixin_49114503/article/details/134266408)

如果不想输出日志，只想在后台运行，可以这样配置
```bash
nohup $java $vm -jar $jar $params >/dev/null 2>&1 &
```

:::

::: details 其他参考脚本/命令

- 查看当前 jar 运行的 PID
```bash
ps -ef | grep run.jar
```
- 查看端口运行的 PID<Badge text="仅root权限" type="warning"/>
有的时候，如果我们需要`Jar包`的时候，发现端口被占用了，想查看一下是什么进程占用了，只可以使用
```bash
netstat -lnp | grep $PORT
```
- 关闭运行的 jar 包
```bash
# 通过 ps 找到 pid 后使用
kill -9 $PID
```
- 查看日志
tail -f run.jar.out
可以直接查看控制台日志，也可以查看 `./logs/模块名/debug.log` | `./logs/模块名/info.log`  | ``./logs/模块名/warning.log``｜ `./logs/模块名/error.log`
- 清除日志
如果程序一直运行，run.jar.out 日志会一直不停的增长，所以需要定期清空日志，注意，不要直接删除这个文件，你可以使用以下方法：
```bash
echo "" > run.jar.out
```
或者
```bash
cat /dev/null > nohup.out
```

也可以考虑使用`crontab -e`来创建一个系统任务调度[参考](https://www.runoob.com/w3cnote/linux-crontab-tasks.html)
```bash
0 0 * * 0 /data/jar/clearlog.sh
```

`clearlog.sh`
```bash
cat /dev/null > nohup.out
```

:::

## Windows

::: tip
`Windows`部署就是查看日志不是很方便，如果可以，推荐你在服务器上安装一个[Git](https://git-scm.com/downloads/win),这样就可以使用`GitBash`的[tail](https://www.runoob.com/linux/linux-comm-tail.html)命令来查看日志了，同时也可以方便后面如果要使用[Jenkins](https://www.jenkins.io/zh/)等工具来做自动化部署的时候接取代码，非常好用😘😘😘
:::

### 启动脚本

::: details run.bat

```shell
rem 配置控制台显示中文（防止乱码）
chcp 65001
rem 可以显示当前运行的 bat 位置到黑窗口上面，方便后续找到运行的 jar 包的位置
set TITLE=%0
rem 指定jdk的 java 命令，你也可以指定对应的 jdk 版本
set java=D:\dev\environment\jdk\jdk-17.0.5\bin\java.exe
rem 打包好后的jar包名，每个服务的 jar 包名不一样
set jar=run.jar
rem 配置 VM 参数
set vm=-Dfile.encoding=utf-8 ^
-Dmaven.wagon.http.ssl.insecure=true ^
-Dmaven.wagon.http.ssl.allowall=true ^
--add-opens java.base/java.util=ALL-UNNAMED ^
--add-opens java.base/java.lang=ALL-UNNAMED ^
--add-opens java.base/java.lang.reflect=ALL-UNNAMED ^
--add-opens java.base/java.lang.invoke=ALL-UNNAMED ^
--add-opens java.base/java.lang.io=ALL-UNNAMED
rem 配置 Jar 包参数
set params=--spring.profiles.active=test ^
--spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848 ^
--spring.cloud.nacos.config.server-addr=127.0.0.1:8848 ^
--spring.cloud.nacos.username=nacos ^
--spring.cloud.nacos.password=nacos ^
--server.port=8080
rem 组合成启动命令
%java% %vm% -jar %jar% %params%
rem 这里暂停一下，防止 Jar 包没启动起来，但是黑窗口一闪而过导致找不到错误原因
pause
```

:::

## 启动参数说明

::: details 启动参数

VM 参数：

- `-Dfile.encoding=utf-8`：配置字符集为 UTF8
- `-Dmaven.wagon.http.ssl.insecure=true`和`-Dmaven.wagon.http.ssl.allowall=true`：配置允许SSL
- `--add-opens java.base/**=ALL-UNNAMED`：模块化系统配置（JDK17必须，JDK8可以不配置）

Jar 包参数：

- `--spring.profiles.active=test`：配置环境（测试环境[test]或者生产环境[dev]）
- `--spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848` \ `--spring.cloud.nacos.config.server-addr=127.0.0.1:8848` \ `--spring.cloud.nacos.username=nacos` \ `--spring.cloud.nacos.password=nacos`: 配置 Nacos 连接信息（单体架构可以不配置）
- `--server.port=8080`：配置启动的 Jar 包的端口号

:::

::: info 模块化系统配置
在JDK 17中，`java.base`模块是`Java`的核心模块之一，它包含`Java`运行时所需的基础类。如果启动时遇到“java.base模块不向未命名模块`opens java.*`”的错误，通常是由于配置问题导致的，[参考](https://developer.baidu.com/article/details/2766430)，所以有遇到不能正常加载的模块就只需要往启动参数里面添加`--add-opens java.base/xxxx=ALL-UNNAMED`就行了
:::

::: info 参数配置优先级
如果是微服务架构，或者是使用了配置中心(Ncos)配置参数，参数配置的优先级如下：

nacos > 启动参数 > application.yml > bootstrap.yml > @Value(${key=value})
:::
