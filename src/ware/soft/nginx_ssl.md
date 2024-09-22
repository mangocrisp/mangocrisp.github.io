---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: "Nginx 配置 ssl"
# 当前页面内容描述
description: "Nginx 配置 ssl"
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
icon: "simple-icons:nginx"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-16
# 类别
category:
  - 软/硬件知识
# 标签
tag:
  - 知识
  - 分享
  - 软件知识
  - Nginx
  - Https
# 页面顶上的图片
cover: "https://nginx.org/nginx.png"
---

# Nginx 配置 ssl

如果你的网站是 Nginx 服务，并且需要访问的时候带上 https，那么就需要在 Nginx 配置 ssl

## yum 安装

### 1. 安装

   ```bash
   yum install -y nginx
   ```

### 2. 启动

   ```bash
   systemctl start nginx.service
   ```

### 3. 设置开机自启

   ```bash
   systemctl enable nginx.service
   ```

### 4. 停止

   ```bash
   systemctl stop nginx.service
   ```

### 5. 重启

   ```bash
   systemctl restart nginx.service
   ```

### 6. 目录

   ```bash
   /etc/nginx    配置文件目录
   /var/log/nginx   日志目录（这个，你可以自己在配置文件里面配置）
   ```

## 官网下载安装（推荐）

去官网下载下来 nginx-x.x.x.tar.gz，上传到服务器

### 1. 解压源代码

   ```bash
   tar -zxvf nginx-x.x.x.tar.gz
   ```

### 2. 安装编译环境和相关依赖

   ```bash
   yum install gcc-c++
   yum install -y openssl openssl-devel
   yum install -y pcre pcre-devel
   yum install -y zlib zlib-devel
   ```

### 3. 自定义配置安装

   [自定义配置](http://nginx.org/en/docs/configure.html)

### 4. 安装

   ```bash
   cd nginx-x.x.x
   ./configure --prefix=/usr/local/nginx
   make
   make install
   ```

> [!tip]
> 这里，如果没有 make ,需要先安装  make 
> yum install make

### 5. 启动

   ```bash
   cd /usr/local/nginx/sbin
   ./nginx
   ```

### 6. 设置自动启动

   ```bash
   vim /lib/systemd/system/nginx.service
   ```

::: details nginx.service

   ```
   [Unit]
   #描述服务
   Description=nginx
   #描述服务类别
   After=network.target
    
   #服务运行参数的设置，注意【Service】的启动、重启、停止命令都要用绝对路径
   [Service]
   #后台运行的形式
   Type=forking
   #服务具体运行的命令
   ExecStart=/usr/local/nginx/sbin/nginx
   #重启命令
   ExecReload=/usr/local/nginx/sbin/nginx -s reload
   #停止命令
   ExecStop=/usr/local/nginx/sbin/nginx -s quit
   #表示给服务分配独立的临时空间
   PrivateTmp=true
    
   #运行级别下服务安装的相关设置，可设置为多用户，即系统运行级别为3
   [Install]
   WantedBy=multi-user.target
   ```

:::

   开机自动启动：

   ```bash
   systemctl daemon-reload
   systemctl enable nginx.service
   systemctl start nginx.service
   ```

   nginx其他命令：

   ```bash
   systemctl start nginx.service　（启动nginx服务）
   systemctl stop nginx.service　（停止nginx服务）
   systemctl enable nginx.service （设置开机自启动）
   systemctl disable nginx.service （停止开机自启动）
   systemctl status nginx.service （查看服务当前状态）
   systemctl restart nginx.service　（重新启动服务）
   systemctl list-units --type=service （查看所有已启动的服务）
   ```

### 7. 目录

   ```bash
   /usr/local/nginx   nginx 主目录
   /usr/local/nginx/conf   配置文件夹
   /usr/local/nginx/logs   日志文件夹
   ```

## 生成 ssl 证书

Nginx 配置需要证书和密钥，可以去阿里云或者腾讯云等服务商获取证书，一般是申请域名的时候也一并申请证书，这些证书都是互联网可信任的证书，当然，如果你的系统是运行在内网或者一些其他局域网，根本也不需要验证证书的可用性，就是单纯的使用 https，那么，就可以选择自己生成

### Windows 准备

1. 生成证书的方式有很多种，这里默认已经下载了最新的 [Git](https://github.com/git-for-windows/git/releases/download/v2.46.0.windows.1/Git-2.46.0-64-bit.exe)，就可以使用 `Git Bash` 下面的功能 `openssl`

### Linux 准备

1. 需要系统有 openssl 
2. 需要 nginx 有安装 ssl 模块

> [!tip]
> [参考](https://www.cnblogs.com/echohye/p/16722833.html)

### openssl

```bash
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout server.key -out server.crt -config req.cnf -sha256
```

参数说明：

- req：大致有3个功能：生成证书请求文件、验证证书请求文件和创建根CA
- -x509：说明生成自签名证书
- -nodes：`openssl req` 在自动创建私钥时，将总是加密该私钥文件，并提示输入加密的密码。可以使用 `-nodes` 选项禁止加密私钥文件
- -days：指定所颁发的证书有效期
- -newkey：实际上，`-x509` 选项和 `-new` 或 `-newkey` 配合使用时，可以不指定证书请求文件，它在自签署过程中将在内存中自动创建证书请求文件,`-newkey` 选项和 `-new` 选项类似，只不过 `-newkey` 选项可以直接指定私钥的算法和长度，所以它主要用在 `openssl req` 自动创建私钥时
- `rsa:2048`：`rsa` 表示创建 `rsa` 私钥，`2048` 表示私钥的长度
- -keyout：指定私钥保存位置
- -out：新的证书请求文件位置
- -config：指定 `req` 的配置文件

::: details req.cnf

```bash
# 定义输入用户信息选项的"特征名称"字段名，该扩展字段定义了多项用户信息。
distinguished_name = req_distinguished_name
# 生成自签名证书时要使用的证书扩展项字段名，该扩展字段定义了要加入到证书中的一系列扩展项。
x509_extensions = v3_req
# 如果设为no，那么 req 指令将直接从配置文件中读取证书字段的信息，而不提示用户输入。
prompt = no
[req_distinguished_name]
#国家代码，一般都是CN(大写)
C = CN
#省份
ST = GuangDong
#城市
L = GuangZhou
#企业/单位名称
O = Mango
#企业部门
OU = Crisp
#证书的主域名
CN = mangocrisp.gitlab.io
##### 要加入到证书请求中的一系列扩展项 #####
[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[ alt_names ]
IP.1 = 35.185.44.232
# IP.2 = 35.185.44.232
```

:::

## 配置 Nginx

执行上面的命令之后会在当前目录生成 server.key 和 server.crt 两个文件，你可以将两个文件放到 nginx 的安装目录/ssl 下

### nginx.conf

::: details nginx.conf

```conf
http {
    server {
        #监听80端口，强制转到443端口，进行https访问
        listen  80;
        server_name localhost;    
        rewrite ^(.*)$  https://$host$1 permanent;
    }    
    server {
        listen  443 ssl;
        server_name  localhost;
        # ssl 配置
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 120m;
        ssl_prefer_server_ciphers on;
        ssl_session_tickets off;
        ssl_stapling_verify on;
        ssl_certificate     D:/dev/bin/nginx-1.20.2/ssl/server.crt; #证书格式有多种，常见的有pem、cer等
        ssl_certificate_key D:/dev/bin/nginx-1.20.2/ssl/server.key;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        # 其他配置
        location / {
            root   html;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }
    }
}
```

:::

> [!tip]
> 如果有些请求是你一定要配置 http 的，那就得取消强制 https

## 参考链接

https://blog.csdn.net/lyfqyr/article/details/124215774
https://www.cnblogs.com/echohye/p/16722833.html