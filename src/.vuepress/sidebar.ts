import { sidebar } from "vuepress-theme-hope";

// sidebar 这里一般不需要改动，只需要添加多一个文章就行了
export default sidebar({
  "/": ["intro"],
  "/reference/": [
    {
      text: "参考",
      icon: "ooui:reference",
      link: "/reference/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/note/": [
    {
      text: "随笔",
      icon: "clarity:note-line",
      link: "/note/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/code/": [
    {
      text: "代码笔记",
      icon: "ph:code-bold",
      link: "/code/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/ware/": [
    {
      text: "软/硬件知识",
      icon: "arcticons:inware",
      link: "/ware/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/code/taybct/": [
    {
      text: "Spring Taybct",
      icon: "eos-icons:application",
      link: "/code/taybct/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
    {
      text: "前端框架",
      icon: "mingcute:vue-fill",
      link: "https://turtlewxg.github.io/gx-web-doc/",
    },
  ],
});
