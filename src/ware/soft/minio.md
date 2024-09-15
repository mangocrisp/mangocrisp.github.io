---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: MinIO 基础使用
# 当前页面内容描述
description: MinIO 对象存储基础使用
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
order: -1
# 页面图标
icon: "simple-icons:minio"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-15
# 类别
category:
  - 软/硬件知识
# 标签
tag:
  - 知识
  - 分享
  - 软件知识
  - 软件安装
  - CentOS
  - MinIO
# 页面顶上的图片
cover: "https://www.minio.org.cn/resources/img/logo.svg"
---

# MinIO 基础使用

## Windows

[下载地址](https://dl.min.io/server/minio/release/windows-amd64/minio.exe)

启动命令：

```bash
chcp 65001
set TITLE=%0
set MINIO_ACCESS_KEY=admin
set MINIO_SECRET_KEY=password
minio.exe server D:\data\minio --console-address ":19001" --address ":19000"
pause
```

参数说明：

- MINIO_ACCESS_KEY：登录管理端的用户名
- MINIO_SECRET_KEY：登录管理端的用户密码
- `D:\data\minio`：指定存储文件的路径
- `--address`：API 接入端口
- `--console-address`：登录管理端的端口

## Linux

[下载地址](https://min.io/download?license=agpl&platform=linux)

设置可执行：

```bash
chmod 777 ./minio
```

启动命令：

```bash
#!/bin/bash
export MINIO_ROOT_USER=admin
export MINIO_ROOT_PASSWORD=password
nohup ./minio server /data/minio --address ":19000" --console-address ":19001" >nohup.out 2>&1 &
```

参数说明：

- MINIO_ROOT_USER：登录管理端的用户名
- MINIO_ROOT_PASSWORD：登录管理端的用户密码
- `/data/minio`：指定存储文件的路径
- `--address`：API 接入端口
- `--console-address`：登录管理端的端口
