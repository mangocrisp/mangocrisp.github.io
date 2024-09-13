import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "参考",
    icon: "bomb",
    prefix: "/reference/",
    link: "/reference/",
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    prefix: "/note/",
    link: "/note/",
  },
  {
    text: "代码笔记",
    icon: "laptop-code",
    prefix: "/code/",
    link: "/code/",
  },  
  {
    text: "软/硬件知识",
    icon: "computer",
    prefix: "/ware/",
    link: "/ware/",
  },  
  "/reference/aboutSite",
  "intro",
]);
