import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "参考",
    icon: "ooui:reference",
    prefix: "/reference/",
    link: "/reference/",
  },
  {
    text: "随笔",
    icon: "clarity:note-line",
    prefix: "/note/",
    link: "/note/",
  },
  {
    text: "代码笔记",
    icon: "ph:code-bold",
    prefix: "/code/",
    link: "/code/",
  },  
  {
    text: "软/硬件知识",
    icon: "arcticons:inware",
    prefix: "/ware/",
    link: "/ware/",
  },  
  "/reference/aboutSite",
  "intro",
]);
