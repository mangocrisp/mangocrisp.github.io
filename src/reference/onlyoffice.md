---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: OnlyOffice+VUE3+Java+OSS
# 当前页面内容描述
description: OnlyOffice+VUE3+Java+OSS实现在线协同编辑文档
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
icon: "hugeicons:office-365"
# 是否原创
isOriginal: false
# 日期
date: 2025-04-04
# 类别
category:
  - 代码笔记
tag:
  - 知识
  - 分享
  - 开发工具
# 页面顶上的图片
#cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# OnlyOffice+VUE3+Java+OSS实现在线协同编辑文档

在开发过程中需要这样的问题，客户需要在线编辑文档，能达到类似腾讯文档那样的协作编辑等一些功能，那么如何实现呢？手撸肯定是不够的，那么有没有现成的解决方案呢？答案是肯定的，今天就分享一下我使用的解决方案。

## 准备工作

1. docker 环境
2. 简单的 OSS 服务（支持上传下载文件）
3. VUE、Java 环境等

::: tip
强烈建议使用 docker，因为 OnlyOffice 的依赖比较复杂（我已经替各位踩过坑了，头皮发麻），如果本地环境不方便，可以使用 docker 来快速搭建环境。
:::

## 步骤

### 1. 安装 docker

docker 的安装这里就不详细写了，可以参考[docker 官方文档](https://docs.docker.com/desktop/setup/install/windows-install/),

::: tip
安装完之后可以配置一下 docker 的镜像加速，可以加速 docker 的下载速度，配置文件在 `%USERPROFILE%\.docker\daemon.json`，内容如下：
```json
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com",
    "https://mirrors.aliyun.com"
  ]
}
```
:::

### 2. 安装 OnlyOffice

1. 下载 OnlyOffice 的镜像

```bash
docker pull onlyoffice/documentserver:8.0
```

这里示例是下载 8.0 版本，请自行选择版本。

2. 启动 OnlyOffice

```bash
docker run -i -t -d -p 18080:80 --name=onlyoffice --restart=always --privileged=true -v d:/dev/tools/docker/onlyoffice/documentServer/logs:/var/log/onlyoffice -v d:/dev/tools/docker/onlyoffice/documentServer/data:/var/www/onlyoffice/Data -v d:/dev/tools/docker/onlyoffice/documentServer/postgresql:/var/lib/postgresql -v d:/dev/tools/docker/onlyoffice/documentServer/lib:/var/lib/onlyoffice -e JWT_ENABLED=false -e USE_UNAUTHORIZED_STORAGE=true -e ONLYOFFICE_HTTPS_HSTS_ENABLED=false onlyoffice/documentserver:8.0
```

确保这些路径存在，否则会报错。

如果项目是 https 的话需要修改启动参数：

```bash
docker run -i -t -d -p 80:80 -p 443:443 --name=onlyoffice --restart=always --privileged=true -v d:/dev/tools/docker/onlyoffice/documentServer/logs:/var/log/onlyoffice -v d:/dev/tools/docker/onlyoffice/documentServer/data:/var/www/onlyoffice/Data -v d:/dev/tools/docker/onlyoffice/documentServer/postgresql:/var/lib/postgresql -v d:/dev/tools/docker/onlyoffice/documentServer/lib:/var/lib/onlyoffice -e JWT_ENABLED=false -e USE_UNAUTHORIZED_STORAGE=true -e ONLYOFFICE_HTTPS_HSTS_ENABLED=false onlyoffice/documentserver:8.0
```

并且在 `d:/dev/tools/docker/onlyoffice/documentServer/data/certs` 目录下放上 `ssl 证书`
命名为 onlyoffice.crt、onlyoffice.key，至于`ssl 证书`的获取这里就不多赘述了


::: tip
如果是修改了 https，这里就建议 onlyoffice 的服务就单独放在一台服务器，让他占用这台服务器的 80 和 443 端口
:::

1. 修改 OnlyOffice 的配置文件

```bash
docker exec -it onlyoffice /bin/bash
nano /etc/onlyoffice/documentserver/default.json
```

找到`request-filtering-agent`，将里面的两个参数修改为下面的内容，然后保存退出。

```json
"request-filtering-agent" : {
  "allowPrivateIPAddress": true,
  "allowMetaIPAddress": true
}
```

修改这个是为了确保容器的网络可以访问到 outside 的网络。

::: tip
1. 如果 /bin/bash 不存在，可以使用 /bin/sh 或者 bash
2. onlyoffice 的这个镜像里面没有 vi，也没有 vim ，可以用 nano 替代，[nano 相关命令](https://www.linuxcool.com/nano)
:::

4. 重启 OnlyOffice

```bash
docker restart onlyoffice
```


### 3. 代码示例

::: details VUE 示例

```vue
<template>
  <div>
    <a href="javascript:void(0)" @click="openInEditor(item)" v-for="(item, index) in fileList" :key="index"
      :value="item" :label="item.title">{{ item.title }}</a>
  </div>
  <div style="width: 100vw;height: 100vh;margin: 0px;">
    <DocumentEditor id="docEditor" documentServerUrl="http://ip:18080/" :config="config" />
  </div>
</template>
<script lang="ts" setup>
import { DocumentEditor } from "@onlyoffice/document-editor-vue";
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from 'uuid'

const fileList = [{
  "documentType": "word",
  "title": "测试文档.docx",
  "url": "http://ip:port/statics/测试文档.docx.docx",
  "fileType": "docx",//文件类型
},
{
  "documentType": "cell",
  "title": "测试文档.xlsx",
  "url": "http://ip:port/statics/测试文档.xlsx",
  "fileType": "xlsx",//文件类型
}];

const config = ref({
  "documentType": "word",
  "document": {
    "title": "测试文档.docx",
    "url": "http://ip:port/statics/测试文档.docx.docx",
    // 当前用户对于当前文档的操作权限
    "permissions": {
      "print": false,
      "download": true //用户是否可以下载
    },
    "fileType": "docx",//文件类型
    //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id
    "key": "Khirz6zTPdfd6"
  },
  "editorConfig": {
    // 编辑器常规配置
    "customization": {
      // 自动保存可以关闭，常规ctrl+s更好用
      "autosave": false,
      // "compactToolbar": true,
      // "forcesave": true,
      // "toolbarNoTabs": true,
      // "help": false,
      // "compactHeader": true,
      // "hideRightMenu": true,
      // "logo": {//自定义logo配置
      //   "image": "xxxx",
      //   "imageDark": "xxx",
      //   "url": "xxx",
      //   "visible": false
      // },
    },
    "mode": "edit",//view为只能浏览  edit为编辑
    //这个回调及其的重要
    "callbackUrl": "http://ip:port/onlyoffice/callback",
    // 菜单显示语言
    "lang": "zh-CN",
    // 当前操作用户信息
    "user": {
      "name": "superlu",
      "id": "103"
    },
  }
})

const openInEditor = item => {
  //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id  
  config.value.documentType = item.documentType;
  config.value.document.title = item.title;
  config.value.document.url = item.url;
  config.value.document.fileType = item.fileType;
  config.value.document.key = uuidv4();
}

onMounted(() => {
  //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id
  openInEditor(fileList[0]);
})

</script>
<style>
html,
body,
#app {
  height: 100vh;
  width: 100vw;
  margin: 0px
}
</style>
```

:::

::: details Java (Spring Boot) 示例

这个示例其实也就是官网的示例，[官方文档](https://api.onlyoffice.com/zh-CN/docs/docs-api/usage-api/callback-handler/#java-%E6%96%87%E6%A1%A3%E4%BF%9D%E5%AD%98%E7%A4%BA%E4%BE%8B)

```java
package cn.gx.admin.file.controller;

import cn.gx.tool.file.util.FileServiceBuilder;
import com.alibaba.fastjson2.JSONObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.ContentType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Scanner;

@RestController
@RequestMapping("/onlyoffice")
@Slf4j
public class OnlyOfficeController {

    /**
     * 回调
     */
    @SneakyThrows
    @RequestMapping("/callback")
    public String callback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Scanner scanner = new Scanner(request.getInputStream()).useDelimiter("\\A");
        String body = scanner.hasNext() ? scanner.next() : "";

        JSONObject jsonObj = JSONObject.parseObject(body);
        System.out.println(jsonObj.get("status"));
        if((int) jsonObj.get("status") == 2)
        {
            String downloadUri = (String) jsonObj.get("url");
            URL url = new URL(downloadUri);
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            InputStream stream = connection.getInputStream();
            String fileName = cn.hutool.core.lang.UUID.randomUUID().toString().replace("-", "") + "_create." + jsonObj.get("filetype");
            // 这个 key 可以是关联的文件的 id ，到时候用来保存新的文件路径
            //String key = jsonObj.getString("key");
            FileServiceBuilder.upload(stream, ContentType.MULTIPART_FORM_DATA, fileName);
//            String templatePath = getClass().getClassLoader().getResource("").getPath();
//            templatePath += fileName;
//            log.info("文件保存地址：" + templatePath);
//            File tempFile = new File(templatePath);
//            try (FileOutputStream out = new FileOutputStream(tempFile)) {
//                int read;
//                final byte[] bytes = new byte[1024];
//                while ((read = stream.read(bytes)) != -1) {
//                    out.write(bytes, 0, read);
//                }
//                out.flush();
//            }
            connection.disconnect();
        }
        return "{\"error\":0}";
    }
}
```

我这里修改了一下，直接使用 FileServiceBuilder OSS 上传，然后这个 key 可以是关联的文件的 id ，到时候用来保存新的文件路径

:::

### 参考

[OnlyOffice API 文档](https://api.onlyoffice.com/zh-CN/docs/docs-api/get-started/basic-concepts/)