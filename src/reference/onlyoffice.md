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

# OnlyOffice+VUE3+Java+OSS 实现在线协同编辑文档

在开发过程中需要这样的问题，客户需要在线编辑文档，能达到类似腾讯文档那样的协作编辑等一些功能，那么如何实现呢？手撸肯定是不够的，那么有没有现成的解决方案呢？答案是肯定的，今天就分享一下我使用的解决方案。

## 准备工作

1. docker 环境
2. 简单的 OSS 服务（支持上传下载文件）
3. VUE、Java 环境等

::: tip
强烈建议使用 docker，因为 OnlyOffice 的依赖比较复杂（我已经替各位踩过坑了，头皮发麻），如果本地环境不方便，可以使用 docker 来快速搭建环境。
:::

## 安装步骤

### 1. 安装 docker

docker 的安装这里就不详细写了，可以参考[docker 官方文档](https://docs.docker.com/desktop/setup/install/windows-install/),

::: tip
安装完之后可以配置一下 docker 的镜像加速，可以加速 docker 的下载速度，配置文件在 `%USERPROFILE%\.docker\daemon.json`，内容如下：

```json
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me"
  ]
}
```

:::

### 2. 安装 OnlyOffice（社区版）

1. 下载 OnlyOffice（社区版） 的镜像

```bash
docker pull onlyoffice/documentserver:8.0
```

这里示例是下载 8.0 版本，请自行选择版本。

2. 启动 OnlyOffice

```bash
docker run -i -t -d -p 18080:80 --name=onlyoffice --restart=always --privileged=true \
-v d:/dev/tools/docker/onlyoffice/documentServer/logs:/var/log/onlyoffice \
-v d:/dev/tools/docker/onlyoffice/documentServer/data:/var/www/onlyoffice/Data \
-v d:/dev/tools/docker/onlyoffice/documentServer/postgresql:/var/lib/postgresql \
-v d:/dev/tools/docker/onlyoffice/documentServer/lib:/var/lib/onlyoffice \
-e JWT_ENABLED=false -e USE_UNAUTHORIZED_STORAGE=true -e ONLYOFFICE_HTTPS_HSTS_ENABLED=false \
onlyoffice/documentserver:8.0
```

确保这些路径存在，否则会报错。

如果项目是 https 的话需要修改启动参数：

```bash
docker run -i -t -d -p 80:80 -p 443:443 --name=onlyoffice --restart=always --privileged=true \
-v d:/dev/tools/docker/onlyoffice/documentServer/logs:/var/log/onlyoffice \
-v d:/dev/tools/docker/onlyoffice/documentServer/data:/var/www/onlyoffice/Data \
-v d:/dev/tools/docker/onlyoffice/documentServer/postgresql:/var/lib/postgresql \
-v d:/dev/tools/docker/onlyoffice/documentServer/lib:/var/lib/onlyoffice \
-e JWT_ENABLED=false -e USE_UNAUTHORIZED_STORAGE=true -e ONLYOFFICE_HTTPS_HSTS_ENABLED=false \
onlyoffice/documentserver:8.0
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

找到将下面的几个参数修改为下面的内容，然后保存退出。

```json
"allowPrivateIPAddress": true // 允许访问内网
"allowMetaIPAddress": true // 允许访问外网
"rejectUnauthorized": false // 不拒绝下载未认证的文件
"disable_cors": false, // 允许跨域
```

修改这个是为了确保容器的网络可以访问到 outside 的网络和一些安全的问题。

::: tip

1. 如果 /bin/bash 不存在，可以使用 /bin/sh 或者 bash
2. onlyoffice 的这个镜像里面没有 vi，也没有 vim ，可以用 nano 替代，[nano 相关命令](https://www.linuxcool.com/nano)
   :::

3. 重启 OnlyOffice

```bash
docker restart onlyoffice
```

### 3. 代理配置

如果觉得在容器里面修改这些文件比较麻烦，可以把这些文件都复制出来，然后修改，然后重新启动容器。

```bash
docker cp onlyoffice:/etc/onlyoffice/documentserver/default.json .
docker cp onlyoffice:/var/www/onlyoffice/documentserver/server/welcome .
docker cp onlyoffice:/etc/onlyoffice/documentserver/nginx .
```

修改完之后，然后代理这些文件启动

```bash
docker run -i -t -d -p 18080:80 -p 14443:443 \
--name=onlyoffice --restart=always --privileged=true \
-v d:/dev/tools/docker/onlyoffice/documentServer/logs:/var/log/onlyoffice \
-v d:/dev/tools/docker/onlyoffice/documentServer/data:/var/www/onlyoffice/Data \
-v d:/dev/tools/docker/onlyoffice/documentServer/welcome:/var/www/onlyoffice/documentserver/server/welcome \
-v d:/dev/tools/docker/onlyoffice/documentServer/postgresql:/var/lib/postgresql \
-v d:/dev/tools/docker/onlyoffice/documentServer/lib:/var/lib/onlyoffice \
-v d:/dev/tools/docker/onlyoffice/documentServer/nginx:/etc/onlyoffice/documentserver/nginx \
-v d:/dev/tools/docker/onlyoffice/documentServer/default.json:/etc/onlyoffice/documentserver/default.json \
-e JWT_ENABLED=false -e USE_UNAUTHORIZED_STORAGE=true -e ONLYOFFICE_HTTPS_HSTS_ENABLED=false -e CORS_ENABLED=true -e CORS_ORIGIN=* -e ONLYOFFICE_ALLOW_CORS=true \
onlyoffice/documentserver:8.0
```

## 代码示例

::: details VUE 示例

```bash
#npm
npm install --save @onlyoffice/document-editor-vue
#pnpm
pnpm add @onlyoffice/document-editor-vue
```

```vue
<template>
  <div>
    <a
      href="javascript:void(0)"
      @click="openInEditor(item)"
      v-for="(item, index) in fileList"
      :key="index"
      :value="item"
      :label="item.title"
      >{{ item.title }}</a
    >
  </div>
  <div class="onlyofficeView" style="width: 100vw;height: 100vh;margin: 0px;">
    <DocumentEditor
      id="docEditor"
      documentServerUrl="http://ip:18080/"
      :config="config"
    />
  </div>
</template>
<script lang="ts" setup>
import { DocumentEditor } from "@onlyoffice/document-editor-vue";
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";

const fileList = [
  {
    documentType: "word",
    title: "测试文档.docx",
    url: "http://ip:port/statics/测试文档.docx.docx",
    fileType: "docx", //文件类型
  },
  {
    documentType: "cell",
    title: "测试文档.xlsx",
    url: "http://ip:port/statics/测试文档.xlsx",
    fileType: "xlsx", //文件类型
  },
];

/** 固定配置 */
const constConfig = {
  documentType: "word",
  type: "desktop",
  document: {
    title: "",
    url: "",
    // 当前用户对于当前文档的操作权限
    permissions: {
      download: true, // 用户是否可以下载
      chat: true, // 开启聊天
      comment: true, // 开启评论
      edit: true, // 开启编辑
      print: true, // 开启打印
    },
    fileType: "docx", // 文件类型
    // onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id也是需要在后面添加个时间来避免缓存
    key: uuidv4(),
  },
  editorConfig: {
    // 编辑器常规配置
    customization: {
      // 自动保存可以关闭，常规ctrl+s更好用
      // autosave: false
      // "compactToolbar": true,
      // "forcesave": true,
      toolbarNoTabs: true,
      plugins: false,
      help: false,
      // "compactHeader": true,
      // "hideRightMenu": true,
      logo: {
        //自定义logo配置
        //   "image": "xxxx",
        //   "imageDark": "xxx",
        //   "url": "xxx",
        visible: false,
      },
    },
    mode: "edit", // view为只能浏览  edit为编辑
    // 这个回调及其的重要
    callbackUrl: "http://ip:port/onlyoffice/callback",
    // 菜单显示语言
    lang: "zh-CN",
    // 当前操作用户信息
    user: {
      // name: 'superlu',
      // id: '103'
    },
  },
};

const config = ref<any>({});

const openInEditor = (item) => {
  config.value = { ...constConfig };
  //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id
  config.value.documentType = item.documentType;
  config.value.document.title = item.title;
  config.value.document.url = item.url;
  config.value.document.fileType = item.fileType;
  config.value.document.key = uuidv4();
};

onMounted(() => {
  //onlyoffice用key做文件缓存索引，推荐每次都随机生成一下，不然总是读取缓存，后面应该是改成关联的文件的数据，例如表单的 id
  openInEditor(fileList[0]);
});
</script>
<style>
html,
body,
#app {
  height: 100vh;
  width: 100vw;
  margin: 0px;
}
</style>
```

:::

::: warning 重要提示
1. 由于使用了 docker 安装 ip 地址一定要写机器的路由的 ip 地址，不能用 127.0.0.1也不能用 localhost
2. 如果由于 https 需要 nginx 配置代理后端接口，请一定不要配置如下请求头：
   ```
   add_header X-Content-Type-Options nosniff;
   ```
   这样会导出文件无法下载，这个是我需要的问题，如果你还遇到其他 nginx 配置的问题，请自行解决，主体逻辑就是这个下载文件的接口一定是要返回二进制流才能提供给 onlyoffice 使用
:::

::: details Java (Spring Boot) 示例

这个示例其实也就是官网的示例，[官方文档](https://api.onlyoffice.com/zh-CN/docs/docs-api/usage-api/callback-handler/#java-%E6%96%87%E6%A1%A3%E4%BF%9D%E5%AD%98%E7%A4%BA%E4%BE%8B)

```java
package io.github.mangocrisp.admin.file.controller;

import io.github.mangocrisp.tool.file.util.FileServiceBuilder;
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
    public String callback(HttpServletRequest request, HttpServletResponse response) {
        Scanner scanner = new Scanner(request.getInputStream()).useDelimiter("\\A");
        String body = scanner.hasNext() ? scanner.next() : "";
        JSONObject jsonObj = JSONObject.parseObject(body);
        int status = jsonObj.getInteger("status");
            /*
            1 - 正在编辑文档，
            2 - 文档已准备好保存，
            3 - 发生文档保存错误，
            4 - 文档已关闭，没有任何更改，
            6 - 正在编辑文档，但保存了当前文档状态，
            7 - 强制保存文档时发生错误。
             */
        if (status == 2 || status == 3 || status == 6) {
            //System.out.println(jsonObj.toJSONString());
            String id = jsonObj.getString("key").split("_")[0];
            OnlineDoc onlineDoc = getOne(Wrappers.<OnlineDoc>lambdaQuery()
                    .select(OnlineDoc::getId, OnlineDoc::getData)
                    .eq(OnlineDoc::getId, Convert.toLong(id)));
            if (onlineDoc != null) {
                if (StringUtil.isBlank((String) onlineDoc.getData())) {
                    throw new NullPointerException("数据异常，文档数据为空【" + onlineDoc.getId() + "】");
                }
                FileData fileData = JSONObject.parseObject((String) onlineDoc.getData(), FileData.class);
                String fileName = fileData.getTitle();
                // 能查询到才做保存
                String downloadUri = jsonObj.getString("url");
                String path = saveFile(downloadUri, fileName);
                fileData.setUrl(path);

                onlineDoc.setUpdateTime(LocalDateTime.now());
                JSONArray users = jsonObj.getJSONArray("users");
                if (users != null && !users.isEmpty()) {
                    // 最后一次修改的用户
                    onlineDoc.setUpdateUser(users.getLong(users.size() - 1));
                    SysUser sysUser = sysUserMapper.selectOne(Wrappers.<SysUser>lambdaQuery()
                            .select(SysUser::getId, SysUser::getUsername, SysUser::getNickname, SysUser::getRealName)
                            .eq(SysUser::getId, onlineDoc.getUpdateUser()));
                    SysUserDept sysUserDept = sysUserDeptMapper.selectOne(Wrappers.<SysUserDept>lambdaQuery()
                            .eq(SysUserDept::getUserId, onlineDoc.getUpdateUser())
                            .orderByAsc(SysUserDept::getId)
                            .last("limit 1"));
                    SysDept sysDept = sysDeptMapper.selectOne(Wrappers.<SysDept>lambdaQuery()
                            .select(SysDept::getId, SysDept::getName, SysDept::getFullName)
                            .eq(SysDept::getId, sysUserDept.getDeptId()));
                    String realName = Optional.ofNullable(sysUser.getRealName()).orElse(sysUser.getNickname());
                    if (ObjectUtil.isNotEmpty(sysDept)) {
                        String deptName = Optional.ofNullable(sysDept.getName()).orElse(sysDept.getFullName());
                        realName = realName + "(" + deptName + ")";
                    }
                    onlineDoc.setUpdateUserName(realName);
                }

                if (status != 6) {
                    // 不是强制保存才保存历史记录
                    saveHistory(onlineDoc, fileData, jsonObj);
                }

                onlineDoc.setData(JSONObject.toJSONString(fileData, JSONWriter.Feature.WriteMapNullValue));
                getBaseMapper().updateOnlyOfficeFileUrl(onlineDoc);
            }
        }
        return "{\"error\":0}";
    }

    /**
     * 回显图片/下载文件
     *
     * @param response 自动引入
     * @param path     路径
     * @param fileName 文件名
     * @param d        是否下载
     */
    @Operation(summary = "回显图片/下载文件")
    @RequestMapping(value = {"/statics"})
    @Parameters({
            @Parameter(name = "path", description = "文件路径")
            , @Parameter(name = "fileName", description = "文件名")
            , @Parameter(name = "d", description = "是否需要下载")
            , @Parameter(name = "dName", description = "下载指定的文件名")
    })
    public void statics(HttpServletResponse response, @RequestParam String path
            , @RequestParam(required = false) String fileName
            , @RequestParam(required = false, defaultValue = "false") Boolean d
            , @RequestParam(required = false) String dName) {
        InputStream inputStream = null;
        if (fileName == null){
            int i = path.lastIndexOf("/");
            if (i != -1){
                fileName = path.substring(i + 1);
            } else {
                fileName = path;
            }
        }
        try {
            if (d) {
                // 是否需要下载，下载是会返回一个流文件，会直接下载文件
                if (dName == null) {
                    dName = fileName;
                }
                response.setCharacterEncoding("utf-8");
                response.setContentType("application/octet-stream");
                response.setHeader("Content-Disposition", "attachment;filename=" +
                        (URLEncoder.encode(dName, StandardCharsets.UTF_8)) + ";filename*=UTF-8''" +
                        (URLEncoder.encode(dName, StandardCharsets.UTF_8)));
            }
            inputStream = FileServiceBuilder.get(path);
            response.setContentLength(inputStream.available());
            byte[] bytes = new byte[1024];
            int len;
            while ((len = inputStream.read(bytes)) > 0) {
                response.getOutputStream().write(bytes, 0, len);
            }
            response.getOutputStream().flush();
        } catch (Exception e) {
            throw new BaseException(String.format("文件下载失败！%s", e.getMessage()));
        } finally {
            Optional.ofNullable(inputStream).ifPresent(is -> {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }
    }
}
```

我这里修改了一下，直接使用 FileServiceBuilder OSS 上传，然后这个 key 可以是关联的文件的 id ，到时候用来保存新的文件路径

:::

## SSL 自签证书相关问题和处理

在一些特定的网络环境下需要使用到 https，就需要自行签发证书，然后一些服务之间的各种调用，又是需要信任这些证书。我在使用`OnlyOffice`（社区版）的时候，因为是用 docker 安装的`OnlyOffice`服务，所以他的一些配置都是在容器内部配置好了，我只要简单的调用他的服务，就可以了，这个如果是在互联网环境可以使用受信任的证书，但是当在局域网环境下，就需要自己签发证书了。所以在前端（同样是自签证书的服务）调用`OnlyOffice`服务的时候会报了证书不受信任的错误，所以需要解决一下。

### 1. 检查链接是否可用

我在`OnlyOffice`容器内部找到他的`nginx`配置，顺藤摸瓜找到了 welcome 的页面，并且发现有几个静态资源，这样就可以通过请求这个静态资源来判断链接是否可用。

:::details 示例代码

```javascript
import { nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useTagsViewStore } from "@base-lib/store/modules/tagsView";

const router = useRouter();
const tagsViewStore = useTagsViewStore();
const onlyOfficeServerUrl = ref("");
const isCertificateTrusted = ref(false);
onlyOfficeServerUrl.value = import.meta.env.VITE_ONLY_OFFICE_SERVER_URL;


/**
 * 全屏显示
 */
const fullScreenEditor = () => {
  const onlyofficeView = document.getElementsByClassName('onlyofficeView')[0];
  if (onlyofficeView) {

    if (onlyofficeView.requestFullscreen) {
      onlyofficeView.requestFullscreen();
    } else if ((onlyofficeView as any).webkitRequestFullscreen) { // Safari
      (onlyofficeView as any).webkitRequestFullscreen();
    } else if ((onlyofficeView as any).msRequestFullscreen) { // IE11
      (onlyofficeView as any).msRequestFullscreen();
    }
  }
}
/**
 * 手动打开证书
 */
const trustCertificate = () => {
  const newWindow = window.open(onlyOfficeServerUrl.value, "_blank");
  if (newWindow) {
    // 设置定时器检查窗口是否关闭
    const checkInterval = setInterval(async () => {
      if (newWindow.closed) {
        clearInterval(checkInterval);
        const path = router.currentRoute.value.path;
        await nextTick();
        router.replace({ path: `/redirect${path}` });
      }
    }, 500);
  }
};
/**
 * 自动判断SSL证书
 */
const fetchResourceWithSslCheck = () => {
  // 尝试发起请求
  fetch(`${onlyOfficeServerUrl.value}welcome/img/favicon.ico`, {
    // 忽略证书验证，仅用于测试，生产环境不建议使用
    mode: "no-cors",
    credentials: "include",
  })
    .then((response) => {
      isCertificateTrusted.value = true;
      if (!response.ok) {
        // 如果请求失败，检查是否是证书相关问题
        if (response.status === 0) {
          console.log("请求失败，可能是SSL证书不受信任。");
        } else {
          console.log("请求失败，状态码：", response.status);
        }
        return;
      }
      console.log("请求成功，SSL证书似乎被信任（或已忽略验证）");
      // 在这里可以处理响应数据，例如：
      // return response.text().then(data => console.log(data));
    })
    .catch((error) => {
      console.log("请求过程中发生错误：", error);
      ElMessageBox.confirm("文档插件访问失败，是否信任证书？", "提示", {
        confirmButtonText: "去信任",
        cancelButtonText: "取消",
        type: "warning",
      }).then(trustCertificate);
    });
};
/** 页面加载监听 */
onMounted(() => {
  fetchResourceWithSslCheck();
});
```
:::

这样，如果链接不可用就会弹出提示框，用户可以点击去信任，然后重新加载页面。

### 2. 处理 welcome

`OnlyOffice`服务的 welcome 是一些乱七八糟的提示啊，示例什么的，并不是我们想要的，可以直接在页面里面写上

1. 修改文件`/var/www/onlyoffice/documentserver/server/welcome/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>ONLYOFFICE™</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=IE8" />
    <link href="img/favicon.ico" rel="icon" type="image/x-icon" />
    <script type="text/javascript">
      window.close();
    </script>
  </head>
  <body></body>
</html>
```

打开页面就把页面关闭，因为他的作用只剩下让人信任证书了。

2. 修改`Nginx`配置 `/etc/onlyoffice/documentserver/nginx/includes/ds-docservice.conf`

```conf
#welcome page
rewrite ^/$ $the_scheme://$the_host$the_prefix/welcome/ redirect;

location ^~ /welcome {
  alias   /var/www/onlyoffice/documentserver/server/welcome;
  try_files $uri $uri/ /welcome /index.html;
  index  index.html index.htm;
}
```

修改第 1 行开始的内容，添加一个配置，让 `/welcome` 访问 welcome 页面

## 参考

[OnlyOffice API 文档](https://api.onlyoffice.com/zh-CN/docs/docs-api/get-started/basic-concepts/)
