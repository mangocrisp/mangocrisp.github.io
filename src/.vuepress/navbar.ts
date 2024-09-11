import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      "cherry",
      "dragonfruit",
      "strawberry",
      "tomato",
      {
        text: "苹果",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [
          { text: "苹果1", icon: "pen-to-square", link: "1" },
          { text: "苹果2", icon: "pen-to-square", link: "2" },
          { text: "苹果3", icon: "pen-to-square", link: "3" },
          { text: "苹果4", icon: "pen-to-square", link: "4" },
        ],
      },
      {
        text: "香蕉",
        icon: "pen-to-square",
        prefix: "banana/",
        children: [
          {
            text: "香蕉 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "香蕉 2",
            icon: "pen-to-square",
            link: "2",
          },
          {
            text: "香蕉 3",
            icon: "pen-to-square",
            link: "3",
          },
          {
            text: "香蕉 4",
            icon: "pen-to-square",
            link: "4",
          },
        ],
      },
    ],
  },
  "intro"
]);
