// 为项目主页的特性添加闪光效
import "vuepress-theme-hope/presets/shinning-feature-panel.scss";
// 将博主信息移动至文章列表的左侧
import "vuepress-theme-hope/presets/left-blog-info.scss";
// 将博主头像裁剪为圆形
import "vuepress-theme-hope/presets/round-blogger-avatar.scss";
// 为页面图标添加鼠标悬停的跳动效果
import "vuepress-theme-hope/presets/bounce-icon.scss";
// 隐藏导航栏图标
import "vuepress-theme-hope/presets/hide-navbar-icon.scss";
// 隐藏侧边栏图标
import "vuepress-theme-hope/presets/hide-sidebar-icon.scss";
// 为所有 hr 元素添加驾驶的车图标
import "vuepress-theme-hope/presets/hr-driving-car.scss";
import { defineClientConfig } from "vuepress/client";
import { setupTransparentNavbar } from "vuepress-theme-hope/presets/transparentNavbar.js";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
//import { setupSnowFall } from "vuepress-theme-hope/presets/setupSnowFall.js";
import 'APlayer/dist/APlayer.min.css';
import {clickEffect} from './public/lib/clickEffect/clickEffect.js'
import {loadMeting} from './public/lib/aplayer/Meting.js'
import {startSakura} from './public/lib/fullScreenFlower/flower.js'
import {fairyDustCursor} from './public/lib/mouseTrack/track.js'

export default defineClientConfig({
  setup: () => {
    setupTransparentNavbar({ type: "homepage" });
    setupRunningTimeFooter(
        new Date("2022-01-01"),
        {
          "/": "Running time: :day days :hour hours :minute minutes :second seconds",
          "/zh/": "已运行 :day 天 :hour 小时 :minute 分钟 :second 秒",
        },
        true,
      );
      //setupSnowFall();

      let $bodyDom = document.getElementsByTagName('body')[0];
      // 额外插件
      let $extraDom = document.getElementById('_extra_plugins_');
      if($extraDom !== null){
        $extraDom.remove();
      }
      // APlayer
      let $AplayerDom = document.getElementById('_extra_plugins_aplayer_');
      if($AplayerDom !== null){
        $AplayerDom.remove();
      }
      // cursor
      let $cursor = document.getElementById('_extra_plugins_cursor_');
      if($cursor !== null){
        $cursor.remove();
      }
      if($bodyDom !== null){
        $extraDom = document.createElement('div');
        $extraDom.id = '_extra_plugins_';

        let content = ``;
        
        // 添加 live2d 看板娘，详细的配置需要去到 /src/.vuepress/public/lib/live2d 目录下面，配置 tips.js 和 tips.json
        // https://github.com/Konata09/Live2dOnWeb/tree/master
        content += `<div id="waifu">
        <div id="waifu-message"></div>
        <div class="waifu-tool">
        <span class="icon-next"></span>
        <span class="icon-home"></span>
        <span class="icon-message"></span>
        <span class="icon-camera"></span>
        <span class="icon-volumeup"></span>
        <span class="icon-volumedown"></span>
        <span class="icon-about"></span>
        <span class="icon-cross"></span>
        </div>
        <canvas id="live2d2"></canvas>
        <canvas id="live2d4"></canvas>
        </div>`;        
        $extraDom.innerHTML = content;        
        document.body.appendChild($extraDom);
        
        // APlayer,页面添加一个标签在 body 最后面 
        $AplayerDom = document.createElement('div');
        $AplayerDom.id = '_extra_plugins_aplayer_';
        $AplayerDom.classList.add('aplayer');
        $AplayerDom.setAttribute('data-id', '780461113');
        $AplayerDom.setAttribute('data-server', 'netease');
        $AplayerDom.setAttribute('data-type', 'playlist');
        document.body.appendChild($AplayerDom);        
        // 注册 APlayer
        loadMeting();
        
        // 鼠标拖动特效
        $cursor = document.createElement('span');
        $cursor.id = '_extra_plugins_cursor_';
        $cursor.innerHTML = `<span class="js-cursor-container"></span>`;
        document.body.appendChild($cursor);
      }      
      // 开始花瓣
      startSakura();
      // 鼠标点击特效
      clickEffect();
      // 鼠标拖动特效
      fairyDustCursor();
  },
});
