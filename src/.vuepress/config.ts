import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Mango Crisp",
  description: "Mango Crisp",
  head:[
    // Live2d 看板娘
    ["script", {"src": "lib/live2d/live2d_bundle.js"}],
    ["script", {"async":true,"type":"module","src": "lib/live2d/waifu-tips.js"}],
    // APlayer
    ["link", {"rel":"stylesheet", "href":"lib/aplayer/APlayer.min.css"}],
    ["script", {"src": "lib/aplayer/APlayer.min.js"}],
    // 构建这些插件
    ["script", {"async":true, "type":"module","src": "lib/build.js"}],
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
