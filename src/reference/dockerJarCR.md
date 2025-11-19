---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 打包 Jar 到 Docker 并上传到云容器仓库
# 当前页面内容描述
description: 打包 Jar 到 Docker 并上传到云容器仓库
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
order: 6
dir:
  order: 6
# 页面图标
icon: "streamline-logos:docker-logo-block"
# 是否原创
isOriginal: false
# 日期
date: 2025-11-06
# 类别
category:
  - 参考
# 标签
tag:
  - 知识
  - 分享
  - Docker
  - 阿里云
  - GHCR
  - Jar 包
# 页面顶上的图片
# cover: "https://kafka.apache.org/logos/kafka_logo--simple.png"
---

# 打包 Jar 到 Docker 并上传到云容器仓库

Docker 是一个开源的容器化平台，它能将应用程序及其依赖（如库、配置文件等）打包到一个标准化的 “容器” 中，确保应用在任何环境（开发、测试、生产）中都能以相同的方式运行。简单来说，Docker 解决了 “在我电脑上能运行，在你电脑上跑不起来” 的经典问题。

::: info
核心概念：容器 vs 虚拟机
要理解 Docker，首先可以对比它与传统虚拟机（VM）的区别：
虚拟机：需要模拟完整的操作系统（包括内核），资源占用高、启动慢（通常分钟级）。
容器：不模拟完整操作系统，而是共享主机的内核，仅隔离应用所需的资源（如进程、内存、文件系统等），因此更轻量（MB 级）、启动快（秒级）。
:::

## Docker 安装

安装教程这里就不多废话了，直接看官网：https://docs.docker.com/get-docker/

我这里是开发环境，所以直接用 [docker desktop](https://www.docker.com/products/docker-desktop/)

## 国内镜像加速

众所周知，国内环境就是不怎么友好，所以需要一些小配置，镜像加速器可以加速 Docker 仓库的访问，从而提高下载速度。

linux: vim /etc/docker/daemon.json

windows: %USERPROFILE%\.docker\daemon.json 或者在 Docker Desktop 中打开：settings（右上角上齿轮） -> Docker Engine

添加如下内容：

```ini
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run",
    "https://1mwkv1bs.mirror.aliyuncs.com"
  ]
}
```

::: tip
上面的镜像源不一定适合你，而且国内环境比较差，一些镜像源随时可能会被墙，请自行选择一个可用的镜像源。
:::

镜像加速器配置好后，需要重启 Docker 才能生效，点右下角按钮 Apply & Restart

::: info
这里有一些网站可以搜索国内可用的镜像：
https://docker.aityp.com/
https://xuanyuan.cloud/search
:::

## 云容器仓库

### Docker Hub

1. 登录 Docker Hub：https://hub.docker.com

::: warning
这个是 Docker 官方的镜像仓库，但是国内速度很慢，甚至根本连接不上，得用梯子，所以这里就不再赘述了。
:::

### 阿里云容器镜像仓库（ACR）

1. 登录阿里云：https://cr.console.aliyun.com
   这里如果只是开发测试用，创建一个个人实例就够用了，不需要付费，直接创建一个实例。

2. 创建命令空间
   确定唯一就行了，这里我创建的是 taybct

3. 创建镜像仓库
   - 仓库名就是你的 jar 包名称
   - 下一步代码源，因为是本地上传，这里直接选择本地仓库就好了，然后通过命令行推送镜像到镜像仓库

点进去任何一个仓库，按提示登录阿里云操作，大概就是在命令行输入如下命令：

```bash
docker login --username=<用户名> <仓库地址>
```

### GitHub Container Registry (GHCR)

1. 创建一个 GitHub 账号：https://github.com/signup
2. 创建一个仓库
3. 创建一个 Personal Access Token
   1. 登录 GitHub，进入个人设置（右上角头像 → Settings）
   2. 左侧菜单选择 Developer settings → Personal access tokens → Tokens (classic) → Generate new tokens (classic)
   3. 填写令牌描述（如 ghcr-login），并勾选 write:packages
   4. 点击 Generate token，保存令牌内容（仅显示一次）
4. 登录 GitHub Container Registry（GHCR）
   使用 Docker 命令登录 GHCR，需用到上述 PAT 作为密码

   ```bash
   # 替换 <GitHub 用户名> 和 <PAT> 为实际值
   docker login ghcr.io -u <GitHub 用户名> -p <个人访问令牌>
   ```

   登录成功会显示 Login Succeeded
5. 构建并标记 Docker 镜像
   GHCR 要求镜像必须按照固定格式命名，否则无法推送，格式为 `ghcr.io/<GitHub 用户名/组织名>[/仓库名]/<镜像名>:<标签>`
   - `<GitHub 用户名/组织名>`：必须与登录的账号一致（个人用用户名，组织用组织名）
   - `<镜像名>`：自定义镜像名称（建议与项目相关）
   - `<标签>`：镜像版本（如 latest、v1.0）

## 在项目的根目录下创建 Dockerfile 文件（注意，没有后缀）

::: details Dockerfile

```dockerfile
# 设置镜像基础，jdk17
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/openjdk:21
# 维护人员信息
MAINTAINER <邮箱>
# maven 打包 buildArgs 指定项目 jar 包位置名称
ARG JAR_FILE
# 设定时区
ENV TZ=Asia/Shanghai
# JVM 参数
ENV JVM_OPTS="\
-Dfile.encoding=utf-8 \
-Dmaven.wagon.http.ssl.insecure=true \
-Dmaven.wagon.http.ssl.allowall=true \
--add-opens java.base/java.util=ALL-UNNAMED \
--add-opens java.base/java.lang=ALL-UNNAMED \
--add-opens java.base/java.lang.reflect=ALL-UNNAMED \
--add-opens java.base/java.lang.invoke=ALL-UNNAMED \
--add-opens java.base/java.lang.io=ALL-UNNAMED"
# 声明 Jar 运行参数的环境变量（默认空，可动态传入，如 --spring.profiles.active=prod，注意：--server.port=8080 是固定值，因为要暴露端口出去）
ENV JAR_OPTS=""
# 声明 Jar 包运行端口的环境变量（默认8080，可动态传入）
ENV JAR_PORT=8080
#设置镜像对外暴露端口（因为也不知道 jar 包最终运行的是什么端口这里就不指定了运行的时候自己写命令去运行）
EXPOSE $JAR_PORT
# 设置后续指令的工作目录
WORKDIR /taybct
# 将指定的 jar 放置在根目录下，命名为 app.jar，推荐使用绝对路径
ADD $JAR_FILE jar/app.jar
# 执行多条命令的 shell 文件
ADD ./run.sh run/run.sh
# 设置时区 && 创建 spring boot jar 包启动的配置文件夹 && 授权可执行文件   这里尽量一行搞定，因为每多一个 RUN 指令 Docker 就多套一层
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone && mkdir jar/config && chmod +x run/run.sh
#执行启动命令
ENTRYPOINT ["run/run.sh", "/taybct/jar", "./app.jar"]
```

:::

::: warning 注意注意！
把上面的<邮箱>换成你自己的邮箱，然后保存，例如 `MAINTAINER <abc@def.com>`
:::

为了方便运行 jar 包，需要创建一个启动脚本，这里我创建了一个 run.sh 文件，内容如下：

```bash
#!/bin/sh
# 切换到 Jar 包目录（接收第一个参数：/taybct/jar）
cd "$1" || exit  # 若目录不存在则退出，避免后续错误

# 执行 Jar 包，使用环境变量中的 JVM 参数和 Jar 参数
java $JVM_OPTS -jar "$2" --server.port=$JAR_PORT $JAR_OPTS
```

## build 镜像

执行命令：

```bash
docker build -f ./Dockerfile -t <仓库地址>/taybct/spring-taybct-gateway:3.5.0 --build-arg JAR_FILE=target/spring-taybct-gateway-3.5.0.jar .
```

> -t 指定镜像名称
> --build-arg 指定构建参数，也就是 Dockerfile 文件中的 ARG 参数
> . 表示构建上下文的路径为当前目录

::: warning 注意
最后面 . 表示当前目录，也就是 Dockerfile 文件所在目录，不要忘记加 .
:::

执行完之后就会在本地镜像仓库中生成镜像了，可以通过命令 `docker images` 查看

```plaintext
$ docker images
REPOSITORY                                                                                TAG                     IMAGE ID       CREATED         SIZE
<仓库地址>/taybct/spring-taybct-gateway   3.5.0                   b3812f1931a6   18 hours ago    604MB
```

## 本地测试运行

执行命令：

```bash
docker run -e=JAR_OPTS='--spring.cloud.nacos.discovery.server-addr=192.168.138.40:8848 --spring.cloud.nacos.config.server-addr=192.168.138.40:8848' -e=JAR_PORT=9102 -p 9102:9102 --name spring-taybct-gateway --restart=no --runtime=runc -v=D:/dev/tools/docker/spring-taybct-cloud/jar/run.sh:/taybct/run/run.sh -v=D:/dev/tools/docker/spring-taybct-cloud/jar/config:/taybct/jar/config -v=D:/dev/tools/docker/spring-taybct-cloud/jar/logs:/taybct/jar/logs -d <仓库地址>/taybct/spring-taybct-gateway:3.5.0
```

> -e 添加环境变量
> -p 映射端口
> --name 镜像名称
> --restart=no 镜像退出时不重启
> --runtime=runc 镜像运行时
> -v 映射目录
> -d 运行容器并进入后台

镜像运行成功后，可以通过命令 `docker ps` 查看

```plaintext
$ docker ps
CONTAINER ID   IMAGE                                                                                           COMMAND                   CREATED          STATUS          PORTS                                           NAMES
abd45ad3a43a   <仓库地址>/taybct/spring-taybct-gateway:3.5.0   "run/run.sh /taybct/…"   37 seconds ago   Up 37 seconds   0.0.0.0:9102->9102/tcp, [::]:9102->9102/tcp     spring-taybct-gateway
```

访问 http://localhost:9102/actuator/health 就可以看到 Spring Boot 启动成功啦

::: note docker 的相关命令

1. docker ps 列出所有正在运行的容器
2. docker ps -a 列出所有容器
3. docker stop <容器ID> 停止一个正在运行的容器
4. docker restart <容器ID> 重启一个正在运行的容器
5. docker rm <容器ID> 删除一个容器
6. docker rmi <镜像ID> 删除一个镜像
7. docker images 列出所有镜像
8. docker help 列出所有命令

:::

## 推送镜像到仓库

登录阿里云账号

```bash
docker login --username=<用户名> <仓库地址>
```

登录GHCR账号

```bash
docker login ghcr.io -u <GitHub 用户名> -p <个人访问令牌>
```

然后执行命令：

```bash
docker push <仓库地址>/taybct/spring-taybct-gateway:3.5.0
```

镜像推送成功后，可以在云容器镜像仓库中看到：示例：https://github.com/orgs/taybct/packages/container/package/spring-taybct-gateway

## 后续步骤

1. 去另一台机器上拉取镜像运行测试

```bash
docker pull <仓库地址>/taybct/spring-taybct-gateway:3.5.0
```

运行镜像

```bash
docker run -e=JAR_OPTS='--spring.cloud.nacos.discovery.server-addr=192.168.138.40:8848 --spring.cloud.nacos.config.server-addr=192.168.138.40:8848' -e=JAR_PORT=9102 -p 9102:9102 --name spring-taybct-gateway --restart=no --runtime=runc -v=D:/dev/tools/docker/spring-taybct-cloud/jar/run.sh:/taybct/run/run.sh -v=D:/dev/tools/docker/spring-taybct-cloud/jar/config:/taybct/jar/config -v=D:/dev/tools/docker/spring-taybct-cloud/jar/logs:/taybct/jar/logs -d <仓库地址>/taybct/spring-taybct-gateway:3.5.0
```

## 参考

1. 批量 build 镜像

::: details 批量脚本

docker-build.sh

```bash
#!/bin/bash
usage() {
  echo "Usage: $0 <OPTIONS>"
  echo "可选参数:"
  echo "-u --registry_url   镜像仓库地址"
  echo "-g --group_name     镜像组名"
  echo "-n --app_name       镜像名称(必须)"
  echo "-v --image_version  镜像版本(必须)"
}
build() {
  u=$([ -n "$registry_url" ] && echo "$registry_url/" || echo "")
  g=$([ -n "$group_name" ] && echo "$group_name/" || echo "")
  v=$([ -n "$image_version" ] && echo ":$image_version" || echo ":latest")
  # docker 镜像
  docker_image=$u$g$image_name$v
  echo "---- stop container ----"
  docker stop $image_name
  echo "----- rm container ----"
  docker rm $image_name
  echo "---- rm image ----"
  docker rmi $docker_image
  echo "---- build image ----"
  echo "docker image name $docker_image"
  docker build -f ./Dockerfile -t $docker_image --build-arg JAR_FILE=target/$image_name-$image_version.jar .
}
# 镜像仓库地址
registry_url=
# 镜像组名
group_name=
# 镜像名
image_name=
# 镜像版本
image_version=
# 解析命令行参数
options=$(getopt -o u:g:n:v: --long registry_url:,group_name:,image_name:,image_version:, -- "$@")
eval set -- "$options"
# 提取选项和参数
while true; do
  case $1 in
  	-u | --registry_url) shift; registry_url=$1 ; shift ;;
    -g | --group_name) shift; group_name=$1 ; shift ;;
    -n | --image_name) shift; image_name=$1 ; shift ;;
    -v | --image_version) shift; image_version=$1 ; shift ;;
    --) shift ; break ;;
    ?) echo "无效的选项: $1" ; usage ; exit 1 ;;
  esac
done
if [ -z "$image_name" ]; then
    echo "错误: 镜像名是必须的"
    usage
    exit 1
fi
if [ -z "$image_version" ]; then
    echo "错误: 镜像版本是必须的"
    usage
    exit 1
fi
if [ -n "$image_name" ] && [ -n "$image_version" ] ; then
  build
  exit 0
else
  usage
  exit 1
fi
```

docker-build-all.sh

```bash
#!/bin/bash
# 镜像仓库地址
registry_url="<仓库地址>"
# 镜像组名
group_name="taybct"
# 镜像版本
image_version="3.5.0"
# 需要 build 哪些 jar 包的名都往这个数组里面放
apps=('spring-taybct-gateway' 'spring-taybct-auth' 'spring-taybct-module-system' 'spring-taybct-admin-file' 'spring-taybct-admin-log' 'spring-taybct-admin-monitor' 'spring-taybct-module-lf' 'spring-taybct-module-online-doc' 'spring-taybct-module-scheduling')
for(( i=0;i<${#apps[@]};i++)) ; do
    ./docker-build.sh -u "$registry_url" -g "$group_name" -n "${apps[$i]}" -v "$image_version"
done
```

:::

2. 批量运行镜像

::: details 批量脚本

docker-run.sh

```bash
#!/bin/bash
usage() {
  echo "Usage: $0 <OPTIONS>"
  echo "可选参数:"
  echo "-u --registry_url   镜像仓库地址"
  echo "-g --group_name     镜像组名"
  echo "-n --app_name       镜像名称(必须)"
  echo "-v --image_version  镜像版本(必须)"
  echo "-p --app_port       应用的端口"
  echo "-a --run_args       docker run 的时候的参数"
  echo "-e --evn_vars       docker run 的时候的evn变量"
}
run() {
  u=$([ -n "$registry_url" ] && echo "$registry_url/" || echo "")
  g=$([ -n "$group_name" ] && echo "$group_name/" || echo "")
  v=$([ -n "$image_version" ] && echo ":$image_version" || echo ":latest")
  p=$([ -n "$app_port" ] && echo "$app_port" || echo "8080")
  a=$([ -n "$run_args" ] && echo "$run_args" || echo "")
  e=$([ -n "$env_vars" ] && echo "$env_vars" || echo "TZ=Asia/Shanghai")
  # docker 镜像
  docker_image=$u$g$image_name$v
  echo "---- stop container ----"
  docker stop $image_name
  echo "----- rm container ----"
  docker rm $image_name
  echo "---- run container ----"
  echo "docker image name $docker_image"
  #eval "docker run -e=$e -p $p --name $image_name --restart=no --runtime=runc $a -d $docker_image"
  # 或者使用这个 bash -c 在子 Shell 中执行字符串命令
  bash -c "docker run -e=$e -p $p --name $image_name --restart=no --runtime=runc $a -d $docker_image"
}
# 镜像仓库地址
registry_url=
# 定义组名
group_name=
# 定义应用名
image_name=
# 定义应用版本
image_version=
# 应用的端口
app_port=
# 运行的参数
run_args=
# 运行时环境变量
env_vars=
# 解析命令行参数
options=$(getopt -o u:g:n:v:p:a:e: --long registry_url:,group_name:,image_name:,image_version:,app_port:,run_args:,env_vars,help, -- "$@")
eval set -- "$options"
# 提取选项和参数
while true; do
  case $1 in
  	-u | --registry_url) shift; registry_url=$1 ; shift ;;
    -g | --group_name) shift; group_name=$1 ; shift ;;
    -n | --image_name) shift; image_name=$1 ; shift ;;
    -v | --image_version) shift; image_version=$1 ; shift ;;
    -p | --app_port) shift; app_port=$1 ; shift ;;
    -a | --run_args) shift; run_args=$1 ; shift ;;
    -e | --env_vars) shift; env_vars=$1 ; shift ;;
    --) shift ; break ;;
    ?) echo "无效的选项: $1" ; usage ; exit 1 ;;
  esac
done
if [ -z "$image_name" ]; then
    echo "错误: 镜像名是必须的"
    usage
    exit 1
fi
if [ -z "$image_version" ]; then
    echo "错误: 镜像版本是必须的"
    usage
    exit 1
fi
if [ -n "$image_name" ] && [ -n "$image_version" ] ; then
  run
  exit 0
else
  usage
  exit 1
fi
```

docker-run-all.sh

```bash
#!/bin/bash
# 镜像仓库地址
registry_url="<仓库地址>"
# 镜像组名
group_name="taybct"
# 镜像版本
image_version="3.5.0"
# 需要 build 哪些 jar 包的名都往这个数组里面放
# 有哪些应用
apps=('spring-taybct-gateway')
# 这些应用的各自的端口,和上面的 jar 包名的顺序对应不要搞错了
port_arr=('9102')
# docker run 运行参数
run_args="-v=D:/dev/tools/docker/spring-taybct-cloud/jar/run.sh:/taybct/run/run.sh -v=D:/dev/tools/docker/spring-taybct-cloud/jar/config:/taybct/jar/config -v=D:/dev/tools/docker/spring-taybct-cloud/jar/logs:/taybct/jar/logs"
# docker run 运行时的环境变量
evn_vars="JAR_OPTS='--spring.cloud.nacos.discovery.server-addr=192.168.138.40:8848 --spring.cloud.nacos.config.server-addr=192.168.138.40:8848'"
for(( i=0;i<${#apps[@]};i++)) ; do
    ./docker-run.sh -u "$registry_url" -g "$group_name" -n "${apps[$i]}" -v "$image_version" -p "${port_arr[$i]}:${port_arr[$i]}" -a "$run_args" -e "$evn_vars -e=JAR_PORT=${port_arr[$i]}"
done
```

:::
