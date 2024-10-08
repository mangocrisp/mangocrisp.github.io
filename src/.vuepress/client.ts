// 为项目主页的特性添加闪光效
import "vuepress-theme-hope/presets/shinning-feature-panel.scss";
// 将博主信息移动至文章列表的左侧
import "vuepress-theme-hope/presets/left-blog-info.scss";
// 将博主头像裁剪为圆形
import "vuepress-theme-hope/presets/round-blogger-avatar.scss";
// 为页面图标添加鼠标悬停的跳动效果
import "vuepress-theme-hope/presets/bounce-icon.scss";
// 隐藏导航栏图标
// import "vuepress-theme-hope/presets/hide-navbar-icon.scss";
// 隐藏侧边栏图标
// import "vuepress-theme-hope/presets/hide-sidebar-icon.scss";
// 为所有 hr 元素添加驾驶的车图标
import "vuepress-theme-hope/presets/hr-driving-car.scss";
import { defineClientConfig } from "vuepress/client";
import { setupTransparentNavbar } from "vuepress-theme-hope/presets/transparentNavbar.js";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
//import { setupSnowFall } from "vuepress-theme-hope/presets/setupSnowFall.js";

export default defineClientConfig({
  setup: () => {
    setupTransparentNavbar({ type: "homepage" });
    setupRunningTimeFooter(
      new Date("2024-09-11"),
      {
        "/": "Running time: :day days :hour hours :minute minutes :second seconds",
        "/zh/": "已运行 :day 天 :hour 小时 :minute 分钟 :second 秒",
      },
      true,
    );
    //setupSnowFall();
  },
});
