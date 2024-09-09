import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Mango Crisp",
  description: "Mango Crisp",
  //head:[["script", {"src": "/lib/live2d/live2d_bundle.js"}],["script", {"async":true,"type":"module","src": "/lib/live2d/waifu-tips.js"}]],
  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
      __dirname,
      "./components/BlogHero.vue",
    ),
  },
  theme,
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
