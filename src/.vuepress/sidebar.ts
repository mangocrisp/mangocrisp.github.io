import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/":[
    "",
    "intro",
  ],
  "/demo/": [
    {
      text: "如何使用",
      icon: "laptop-code",
      prefix: "",
      link: "/demo/",
      children: "structure",
    },
  ],
  "/posts/":[    
    {
      text: "文章",
      icon: "book",
      prefix: "",
      link: "/posts/",
      children: "structure",
    },
  ]
});
