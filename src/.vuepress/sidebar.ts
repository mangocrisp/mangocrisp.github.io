import { sidebar } from "vuepress-theme-hope";

// sidebar 这里一般不需要改动，只需要添加多一个文章就行了
export default sidebar({
  "/":[
    "intro",
  ],
  "/reference/": [
    {
      text: "参考",
      icon: "bomb",
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
      icon: "pen-to-square",
      link: "/note/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/code/":[    
    {
      text: "代码笔记",
      icon: "laptop-code",
      link: "/code/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
  "/ware/":[    
    {
      text: "软/硬件知识",
      icon: "computer",
      link: "/ware/",
      prefix: "",
      collapsible: true,
      expanded: false,
      children: "structure",
    },
  ],
});
