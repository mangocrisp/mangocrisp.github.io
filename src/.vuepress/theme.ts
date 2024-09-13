import { git, hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://mangocrisp.github.io",
  // 作者信息
  author: {
    name: "Mango Crisp",
    url: "https://github.com/mangocrisp",
  },
  // 许可
  license: "Apache 2.0",
  // 网站的 icon
  favicon: "/logo.svg",
  // 图标库
  iconAssets: "fontawesome-with-brands",
  darkmode: "switch",
  // 导航栏的图标
  logo: "/logo.svg",
  // 仓库地址
  repo: "https://github.com/mangocrisp/mangocrisp.github.io",
  // 文档仓库地址
  docsRepo: "https://github.com/mangocrisp/mangocrisp.github.io",
  // 文档存放的分支
  docsBranch: "main",
  // 仓库地址图片，可以自动识别 git gitee gitlab 等
  //repoLabel: "GigHub",
  docsDir: "src",
  // 导航栏
  navbar,
  // 导航栏布局
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Search", "Language", "Outlook", "Repo"],
  },
  // 全屏按钮
  fullscreen: true,
  // 侧边栏
  sidebar,
  // 页脚
  footer: "Mango Crisp 的小破站",
  // 版本信息，不写会根据作者信息和许可自动生成
  //copyright: "",
  // 是否显示页脚
  displayFooter: true,

  // 博客相关
  blog: {
    description: "Know why,so you can know how.",
    intro: "/intro.html",
    avatar: "https://avatars.githubusercontent.com/u/46065167?v=4",
    sidebarDisplay: "mobile",
    medias: {
      GitHub: "https://github.com/mangocrisp",
      GitLab: "https://gitlab.com/mangocrisp",
      Gitee: "https://gitee.com/mangocrisp",
      BiliBili: "https://space.bilibili.com/25505115",
      "163Music": "https://music.163.com/#/user/home?id=528192925",
      // QQ 推广工具还需要申请公司啥的，比较麻烦就没搞
      //QQ: "https://admin.qidian.qq.com/static_proxy/b2b-qq/wpa-link/index.html#/person?uin=2415446179",
      Qzone: "https://user.qzone.qq.com/2415446179",
      "QQMusic": "https://y.qq.com/n/ryqq/profile/like/song?uin=owv57KvP7w6lNv",
      Steam: "https://steamcommunity.com/profiles/76561198867566298",
    },
  },

  // 加密配置
  encrypt: {
    config: {
      //"/demo/encrypt.html": ["1234"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    // 水印
    //watermark: true,
    // 版本信息
    copyright: true,
    // copyright: { 
    //   global: true,
    //   author: "Mango Crisp",
    //   maxLength: 100,
    //   disableCopy: false
    //  },
    // 图片浏览器
    photoSwipe: true,
    // 公告
    notice: [
      {
        path: "/",
        title: "如果你有问题",
        content: "请联系我！",
        actions: [
          {
            text: "让我看看你",
            link: "/intro.html",
            type: "primary",
          },
          { text: "不认识" },
        ],
      }],
    // 博客
    blog: true,
    // 搜索
    searchPro: true,
    // searchPro: {
    //   // 是否索引内容
    //   indexContent: true,
    //   // 是否自动提示搜索建议
    //   autoSuggestions: true,
    //   // 存储搜索查询词历史的最大数量
    //   queryHistoryCount: 5,
    //   // 存储搜索结果历史的最大数量
    //   resultHistoryCount: 5
    // },
    // 评论
    comment: {
      provider: "Giscus",
      repo: "mangocrisp/mangocrisp.github.io",
      repoId: "R_kgDOMoyjDg",
      category: "General",
      categoryId: "DIC_kwDOMoyjDs4CiTlw",
      mapping: "pathname",
      // 模板要用这个：https://github.com/walinejs/waline/tree/main/example
      //provider: "Waline",
      // 服务地址是你的应用名 https://waline-d.vercel.app/
      //serverURL: "https://waline-d.vercel.app/"
    },

    components: {
      components: ["Badge", "VPBanner", "Share"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      breaks: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      footnote: true,
      flowchart: true,
      gfm: true,
      hint: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      linkify: true,
      mark: true,
      markmap: true,
      mermaid: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
}, {
  custom: true
});
