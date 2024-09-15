---
# 当前页面的短标题，会在导航栏、侧边栏和路径导航中作为首选
shortTitle: 关于本站
# 当前页面内容描述
description: 如何白嫖互联网资源搭建自己的博客
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
order: -2
# 页面图标
icon: "ph:question"
# 是否原创
isOriginal: false
# 日期
date: 2024-09-13
# 类别
category:
  - 参考
# 标签
tag:
  - 知识
  - 分享
# 页面顶上的图片
cover: /assets/images/ys/Ganyu3.jpg
---

# 如何白嫖互联网资源搭建自己的博客

## 需求

1. 写文章不能太多限制
   
   我是个程序员平时写文档一般是用 Markdown，给客户写文档才会用到 Word/Excel/PPT 之类，所以最好是能符合平时的习惯才好

2. 维护起来不能太麻烦
   
   我是有工作有生活的，本来平时工作已经很忙了，不太会有很多时间去维护一个网站这样的活

3. 界面一定要长在我的审美点上
   
   他不一定要特别好看，但是一定得是我喜欢的这肯定没得说了

4. 需要功能很多，而且可以搞很多插件进来
   
   我这个人平时就是爱折腾

## 框架

前后端分离之后出现了很多流行的前端框架，要搭建博客网站要长得好看，肯定得是要写点前端代码的，本人大部分时间是写后端，前端只习得一点皮毛（没办法前端迭代得实在是太快了:sweat_smile:），目前主流好用的主流框架里面也就 Vue 熟悉一点，
所以 [VuePress](https://vuepress.vuejs.org/zh/) 就成为了首选，在[这里](https://vuepress.vuejs.org/zh/guide/introduction.html) VuePress 还做了和其他框架的比较（也不知道算啥？竞争？:zany_face:）。

VuePress 非常好用的一点是他有个 [VuePress 市场](https://marketplace.vuejs.press/zh/)，可以在这儿安装很多很棒的插件以及主题，给爱折腾的我直接整得睡不着了，甚至还有[看板娘](https://oml2d.com/guide/vuepress.html)可以直接安装使用，我这种二次元怎么可能不整一整嘛。

我是写博客，所以，使用了[博客主题](https://marketplace.vuejs.press/zh/themes/blog.html)里面的 [VuePress Theme Hope](https://theme-hope.vuejs.press/zh/) 主题，因为使用的人最多（解决问题起来方便），功能也最全面（就是折腾![折腾](/assets/images/blog/doge.png)），你也可以尝试一下其他的主题，比如 [vuepress-reco](https://theme-reco.vuejs.press/)，案例里面也挺多二次元的 😂

## 安装

按着[VuePress Theme Hope](https://theme-hope.vuejs.press/zh/) 主题的[官方文档](https://theme-hope.vuejs.press/zh/get-started/)一路安装就完事儿了,至于怎么配置，配置哪些东西，这个就需要你自己要有一颗爱折腾的心了，我只能说，总之，[官方文档](https://theme-hope.vuejs.press/zh/guide/)已经把所有的东西都写了，慢慢看，慢慢整~😁

## 本站（我的）基础配置

这个博客就是用的 [VuePress Theme Hope](https://theme-hope.vuejs.press/zh/)：

### 配置目录说明

```bash
src --------------------- 所有的页面都在这个文件夹下面
|-- .vuepress ------------- 所有的配置在这个文件夹下面
|      |-- components ------- 组件
|      |-- dist -------------- 打包生成的文件夹（可以自己部署到 Ngxin 等服务器）
|      |-- public ------------ 存放公共资源
|      |-- styles ------------ 配置样式
|      |-- client.ts ----------- 配置客户端
|      |-- config.ts ---------- 配置 VuePress
|      |-- navbar.ts --------- 配置顶部的导航栏
`-- |-- sidebar.ts --------- 配置左边导航
      `-- theme.ts --------- 配置 VuePress Theme Hope 主题
```

### 详细配置

详细配置就不全部贴出来了，我会把最基本的配置放在 [GitHub](https://github.com/mangocrisp/mangocrisp.github.io/tree/template) 的 template 分支里面了，你可以拿下来直接用，但是要注意，评论模块得自行去修改自己的服务：

theme.ts

```typescript
export default hopeTheme({    
    // 评论
    comment: {
      provider: "Giscus",
      repo: "xxx/xxx.github.io",
      repoId: "XXX",
      category: "General",
      categoryId: "XXX",
      mapping: "pathname",
      // 模板要用这个：https://github.com/walinejs/waline/tree/main/example
      //provider: "Waline",
      // 服务地址是你的应用名 https://xxx.vercel.app/
      //serverURL: "https://xxx.vercel.app/"
    }
});
```

## 特别注意的地方

### Node.js

Node.js 因为是运行的服务器上的，所以是没有 windows 和 document 的，这点要考虑进去，所以集成一些骚气插件的时候，看似能用，但是一打包就报一堆的错所以我这里的方案就是 VuePress 的 [可以替换 head 的功能](https://vuepress.vuejs.org/zh/reference/frontmatter.html#head)，自行写一个 js 文件，让他在用户访问的时候才加载这个 js ，然后才去执行，所以我集成的有一些插件是在 build.js 里面去做的

### config.ts

```typescript
import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";
/**
 * 网站的域名前缀，这里默认是 /
 */
const $$site_prefix = '/';

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Mango Crisp",
  description: "Mango Crisp",
  head:[
    // Live2d 看板娘，用户访问网站的时候才会引入进来
    ["script", {"src": $$site_prefix + "lib/live2d/live2d_bundle.js"}],
    ["script", {"async":true,"type":"module","src": $$site_prefix + "lib/live2d/waifu-tips.js"}],
    // APlayer，用户访问网站的时候才会引入进来
    ["link", {"rel":"stylesheet", "href":$$site_prefix + "lib/aplayer/APlayer.min.css"}],
    ["script", {"src": $$site_prefix + "lib/aplayer/APlayer.min.js"}],
    // 构建这些插件，用户访问网站的时候才会引入进来
    ["script", {"async":true, "type":"module","src": $$site_prefix + "lib/build.js"}],
  ],
  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
      __dirname,
      "./components/BlogHero.vue",
    ),
  },
  theme,
  // 和 PWA 一起启用
  // shouldPrefetch: false,
  plugins: [
 ]
});

```

### build.js

```javascript
/**
 * 网站的域名前缀，这里默认是 /
 */
const $$site_prefix = '/';
const ref = {};
ref.wet_site_title = null;
async function iniLib() {

    // 动态标题
    window.onfocus = () => {
        document.title = '(/≧▽≦/)咦！又好了！';
    };
    document.onclick = () => {
        if (ref.wet_site_title) {
            document.title = ref.wet_site_title;
            ref.wet_site_title = null;
        }
    }
    window.onblur = () => {
        ref.wet_site_title = document.title;
        document.title = '(●—●)喔哟, 崩溃啦！';
    };

    let $bodyDom = document.getElementsByTagName('body')[0];
    if ($bodyDom !== null) {

        // live2d
        let $live2dDom = document.getElementById('_extra_plugins_live2d_');
        if ($live2dDom === null) {
            $live2dDom = document.createElement('div');
            $live2dDom.id = '_extra_plugins_live2d_';
            let content = ``;
            // 添加 live2d 看板娘，详细的配置需要去到 /src/.vuepress/public/lib/live2d 目录下面，配置 tips.js 和 tips.json
            // https://github.com/Konata09/Live2dOnWeb/tree/master
            content += `<div id="waifu">
            <div id="waifu-message"></div>
            <div class="waifu-tool">
            <span class="icon-next"></span>
            <span class="icon-home"></span>
            <span class="icon-message"></span>
            <span class="icon-camera"></span>
            <span class="icon-volumeup"></span>
            <span class="icon-volumedown"></span>
            <span class="icon-about"></span>
            <span class="icon-cross"></span>
            </div>
            <canvas id="live2d2"></canvas>
            <canvas id="live2d4"></canvas>
            </div>`;
            $live2dDom.innerHTML = content;
            document.body.appendChild($live2dDom);
        }

        // APlayer
        let $AplayerDom = document.getElementById('_extra_plugins_aplayer_');
        if ($AplayerDom === null) {
            // APlayer,页面添加一个标签在 body 最后面 
            $AplayerDom = document.createElement('div');
            $AplayerDom.id = '_extra_plugins_aplayer_';
            $AplayerDom.classList.add('aplayer');
            document.body.appendChild($AplayerDom);
            // 注册 APlayer
            await import($$site_prefix + `lib/aplayer/Meting.js`).then(({ loadMeting }) => {
                loadMeting(APlayer, {
                    // 音量
                    volumn: 0.5,
                    // 迷你
                    mini: true,
                    // 固定到底部
                    fixed: true,
                    // 音频循环顺序 'list' | 'random'
                    order: 'random',
                    // 音频自动播放
                    autoplay: false,
                    // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
                    mutex: true,
                    // 列表默认折叠
                    listFolded: true,
                    audio: {
                        // 调用第三方播放器接口，比如获取网易云的接口的歌单，然后全部丢到播放列表
                        api: {
                            // Meting 接口
                            url: 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
                            //server 可选 netease（网易云音乐），tencent（QQ 音乐），kugou（酷狗音乐），xiami（虾米音乐），baidu（百度音乐）。
                            server: 'netease',
                            // type 可选 song（歌曲），playlist（歌单），album（专辑），search（搜索关键字），artist（歌手）
                            type: 'playlist',
                            // id 获取示例：浏览器打开网易云音乐，点击我喜欢的音乐歌单，地址栏有一串数字，playlist 的 id 即为这串数字。
                            id: '7076340031',
                        },
                        // 本地配置，手动配置你想要的歌曲
                        // local:[{
                        //     name: 'Audio name',
                        //     artist: 'Audio artist',
                        //     url: '',
                        //     cover: '',
                        //     lrc: '',
                        //     type: 'auto'
                        // }]
                    }
                });
            })
        }

        // cursor
        let $cursor = document.getElementById('_extra_plugins_cursor_');
        if ($cursor === null) {
            // 鼠标拖动特效
            $cursor = document.createElement('span');
            $cursor.id = '_extra_plugins_cursor_';
            $cursor.innerHTML = `<span class="js-cursor-container"></span>`;
            document.body.appendChild($cursor);
        }
        // 鼠标拖动特效
        await import($$site_prefix + `lib/mouseTrack/track.js`).then(({ fairyDustCursor }) => {
            fairyDustCursor();
        });

        // 飘带，这个全局的，不太好用
        //<script type="text/javascript" size="150" alpha='0.3' zIndex="-2" src="dist/ribbon.min.js"></script>
        // const $ribbon = document.createElement('script');
        // $ribbon.setAttribute('type','text/javascript');
        // $ribbon.setAttribute('size','90');
        // $ribbon.setAttribute('alpha', '0.1');
        // $ribbon.setAttribute('zIndex', '1')
        // $ribbon.setAttribute('src', $$site_prefix + 'lib/ribbon/ribbon.min.js')        
        // document.body.appendChild($ribbon);

    }
    // 鼠标点击特效
    await import($$site_prefix + `lib/clickEffect/clickEffect.js`).then(({ clickEffect }) => {
        clickEffect();
    });
    // 开始花瓣
    await import($$site_prefix + `lib/fullScreenFlower/flower.js`).then(({ startSakura }) => {
        startSakura();
    });
}

// 设置个超时
setTimeout(iniLib, 200);

export { iniLib }
```

### index.scss

```scss
// place your custom styles here
@font-face {
  font-family: "Confession";
  font-display: swap;
  src: url("/assets/font/confession.ttf") format('truetype');
  font-weight: 600;
}
@font-face {
  font-family: "IzihunBlackBold";
  font-display: swap;
  src: url("/assets/font/IzihunBlackBold.ttf") format('truetype');
}
:root{
    --back-to-top-icon: url("/back-to-top.svg");
    --bg-color-secondary: transparent;
}
// 覆盖代码块演示标题颜色
#app {
    --code-demo-header-bg-color: #fff;  
}
body {
  font-family: "IzihunBlackBold", YouYuan !important;
}
.hitokoto,.vp-site-name{
  font-family: 'Confession', YouYuan !important;
}
.vp-blog-hero-image,.vp-banner-logo{
  border-radius: 50%;
}
// 暗黑模式
html[data-theme="dark"] {
  .vp-blog-mask::after{
    opacity: 0.7;
    background-color: #000;
  }
  --code-demo-header-bg-color: #000;
  // 所有元素的样式
  *{
    cursor: url('/lib/curs/Klee/Person Select.cur'), auto;
  }
  // 所有禁用元素的样式
  *:disabled{
    cursor: url('/lib/curs/Klee/unavailable.cur'), not-allowed;
  }
  // a 标签链接的样式
  a{
    cursor: url('/lib/curs/Klee/Location Select.cur'), auto;
  }
  // 输入框，文本域的样式
  input[type="text"],textarea{
    cursor: url('/lib/curs/Klee/text.cur'), auto;
  }
}
// 亮色模式
html[data-theme="light"] {
  .vp-blog-mask::after{
    opacity: 0.2;
    background-color: #000;
  }
  .transparent-navbar .vp-color-mode-switch {
    color: var(--grey-dark) !important;
  }
  *{
    cursor: url('/lib/curs/QiQi/Person Select.cur'), auto;
  }
  *:disabled{
    cursor: url('/lib/curs/QiQi/unavailable.cur'), not-allowed;
  }
  a{
    cursor: url('/lib/curs/QiQi/alternate.cur'), auto;
  }
  input[type="text"],textarea{
    cursor: url('/lib/curs/QiQi/text.cur'), auto;
  }
}
// 歌词高度
.aplayer.aplayer-fixed .aplayer-lrc {
  bottom: 60px !important;
}
```

### palette.scss

```scss
// you can change colors here
//$theme-color: #8fdf82;
$theme-color: #6db33f;
$theme-colors: #2196f3, #f26d6d, #3eaf7c, #fb9b5f, #8fdf82;
// 将边框颜色加深
$border-color: (
  light: #ddd,
  dark: #444,
);
$font-family: '"IzihunBlackBold", YouYuan';
$font-family-heading: '"IzihunBlackBold", YouYuan';
$font-family-mono: '"IzihunBlackBold", YouYuan';
```

## 参考链接

[VuePress](https://vuepress.vuejs.org/zh/)
[theme-hope](https://theme-hope.vuejs.press/zh/)
[Aplayer](https://aplayer.js.org/#/zh-Hans/)
[字魂](https://izihun.com/shangyongziti/)
[每日美图](https://edmeitu.com/pic/0/2.html)
[壁纸网](https://www.bizhi99.com/)
[LeanCloud](https://console.leancloud.app/)
[Vercel](https://vercel.com/mangocrisps-projects)
[waline](https://waline.js.org/)
[光标下载](https://zhutix.com/tag/%e5%8e%9f%e7%a5%9e/)
[光标参考文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors)
[鼠标点击烟花特效](https://blog.csdn.net/qq_43562785/article/details/109511585)
[全屏花瓣](https://blog.csdn.net/qq_48922459/article/details/107026668)
[看板娘](https://github.com/Konata09/Live2dOnWeb/tree/master)
[鼠标拖行轨迹](https://blog.csdn.net/qq_64608499/article/details/124990378)
[特效字符](https://shijianchuo.net/tesufuhao/)
[图标库](https://fontawesome.com/)
https://blog.kevinchu.top/2023/07/17/vercel-deploy-waline/
https://nyakku.moe/posts/2019/10/21/moefy-your-vuepress-blog.html
https://blog.csdn.net/q1246192888/article/details/111409908
https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor
