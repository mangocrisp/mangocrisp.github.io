---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: Git Pages
# 当前页面内容描述
description: 利用 Git Pages 搭建个人网站
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
icon: sliders
# 是否原创
isOriginal: false
# 日期
date: 2024-09-14
# 类别
category:
  - 参考
# 标签
tag:
  - 知识
  - 分享
# 页面顶上的图片
cover: /assets/images/ys/KamisatoAyakaBlack.jpg
---

# 利用 GitLab Pages 搭建个人网站

## git 配置

先看看我的 git 配置：

```bash
$ git remote
gitee  ------ Gitee 仓库
github ------ GitHub 仓库
gitlab ------ GitLab 仓库
origin ------ 默认远程仓库
```

> [!note]
> 为了管理代码发布多个平台的 pages，所以这里使用了多个 remote 同时维护同一份代码。
> 这里现在默认 origin 仓库是 Gitee（哈哈，Gitee Pages 挂了，正好也没有像 GitHub 或者 GitLab 这样的工作流，最适合存储代码了，然后要发布的时候就往 github 和 gitlab 两个远程去推，他们就会自动部署了）

> [!tip]
> `git 操作[fetch | push | pull] 指定远程仓库[gitee | github | gitlab | origin] <远程分支名>:<本地分支名>`

## GitHub Pages

网上很常见很多示例，例如：[theme-hope.vuejs.press 模板](https://theme-hope.vuejs.press/zh/get-started/create.html#_2-%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE%E6%A8%A1%E6%9D%BF) 创建项目时会提示让你选择是否自动生成 GitHub 

```bash
$ pnpm create vuepress-theme-hope my-docs
.../191ecaf685f-4e54                     |  +63 ++++++
.../191ecaf685f-4e54                     | Progress: resolved 63, reused 63, downloaded 0, added 63, done
? Select a language to display / 选择显示语言 简体中文
? 选择包管理器 pnpm
? 你想要使用哪个打包器？ vite
生成 package.json...
? 设置应用名称 my-docs
? 设置应用描述 my-docs
? 设置应用版本号 2.0.0
? 设置协议 MIT
生成 tsconfig.json...
? 你想要创建什么类型的项目？ blog
? 项目需要用到多语言么? no
生成模板...
? 是否初始化 Git 仓库? yes
? 是否需要一个自动部署文档到 GitHub Pages 的工作流？ (Y/n) Y
```

选择 Y 就会在项目的根目录下生成一个 .github\workflows\deploy-docs.yml，这个文件你基础是不需要再修改什么，推到 GitHub 的时候就会自动部署了。

[参考](https://theme-hope.vuejs.press/zh/get-started/deploy.html#%E6%9E%84%E5%BB%BA%E9%A1%B9%E7%9B%AE)

> [!warning]
> GitHub 创建的创建名一定要是 `https://<USERNAME>.github.io/`

[GitHub 源代码](https://github.com/mangocrisp/mangocrisp.github.io) 
[由 GitHub Pages 生成的博客站](https://mangocrisp.github.io)

## GitLabel Pages

这里就比较复杂了，遇到很多问题

### 用户验证
   
现在的 GitHub GitLab 都开启了用户验证，我搞了很久，GitLab 的用户验证更是恶心：

- 有了人机验证，又来个谷歌点图片人机验证，生怕你是机器人，这个是一个吐槽点
- 再有一个就是，他们现在手机验证的时候都是没给提供中国（CN +86） 的选项的，这个得做一些操作，[参考](https://blog.csdn.net/2203_75961777/article/details/136129428#:~:text=%E7%94%B1%E4%BA%8E%E6%9F%90%E4%BA%9B%E5%8E%9F%E5%9B%A0%EF%BC%8CG)，而且你手速要快，如果不够快，他的那个人机验证小游戏的 iframe 就是隐藏的弹不出来，如果隐藏了，你也可以手动把他拖出来到不隐藏为止。你可以试试，但是我没成功过，所以我用 visa 卡验证了，还好我有信用卡

### 创建项目的时候一定要选择根目录
我就是没选根目录，搞了好久

![gitlab 创建空白项目](/assets/images/blog/gitlab_create_blank_project.png)
按照我的这个来创建，注意里面的几个红框起来的

1. 项目名称：改成你 `<USERNAME>.gitlab.io` 且一定只能是这个格式
2. 项目URL：这里一定要选择用户（也就是 / ），不要选择到其他群组了
3. 可见性：公开
4. 项目配置：不要用自述文件初始化

> [!note]
> 不要用自述谁的初始化，因为后面直接把仓库 url 加到你本地的 git 里面：`git remote add gitlab https://gitlab.com/<USERNAME>/<USERNAME>.gitlab.io.git`
> 然后 `git fetch gitlab`
> `git push gitlab --all`
> 最后去仓库看就是完完整整的代码了

### GitLab CI/CD
在推去仓库之前，你需要一份 .gitlab-ci.yml 配置，存放在你的项目根目录里面，GitLab 的 CI/CD 机制就是，只要你的根目录有这个配置，你提交代码他就会去读取然后执行命令 
[先了解一下什么是 GitLab CI/CD](https://www.bookstack.cn/read/gitlab-doc-zh/docs-198.md)

```yaml
pages:
  stage: deploy
  image: node:18.20.4
  only:
    - main
  before_script:
    - corepack enable
    - corepack prepare pnpm@latest-9 --activate
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install --frozen-lockfile
    - pnpm run docs:build
    - rm -rf public
    - mv src/.vuepress/dist public
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
  artifacts:
    paths:
      - public
```

> [!note]
> 如果你使用了 pnpm 你得配置这些上去 [参考](https://pnpm.io/zh/continuous-integration/#gitlab-ci)
> GitLab Pages 的机制就是会到 public 目录中解析静态文件成页面，所以打包完后执行 `mv src/.vuepress/dist public`

### Pages 配置
   
1. 去掉这个勾选才是理解中的域名

![Pages 配置](/assets/images/blog/gitlab_pages1.png)   

2. 在 `设置 > 可见性，项目功能，权限 > Pages` 选择 `具有访问权限的任何人`，只有这样才能被正常访问

[GitLab 源代码](https://gitlab.com/mangocrisp/mangocrisp.gitlab.io) 
[由 GitLab Pages 生成的博客站](https://mangocrisp.gitlab.io)

## Gitee Pages ?

这个现成已经下架了，很可惜，国内源，肯定是比上面两位流畅的，但是现在体验不到了

[Gitee 源代码](https://gitee.com/mangocrisp/mangocrisp) 

## 参考链接

https://blog.csdn.net/u010059669/article/details/82670484
https://juejin.cn/post/7369167136257048615
https://www.bookstack.cn/read/gitlab-doc-zh/docs-198.md
https://blog.csdn.net/weixin_44298215/article/details/131694894
https://www.cnblogs.com/zhangnan35/p/10709252.html#:~:text=Gitlab%20P
https://pnpm.io/zh/continuous-integration/#gitlab-ci