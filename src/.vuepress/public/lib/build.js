import { clickEffect } from './clickEffect/clickEffect.js'
import { loadMeting } from './aplayer/Meting.js'
import { startSakura } from './fullScreenFlower/flower.js'
import { fairyDustCursor } from './mouseTrack/track.js'

function iniLib() {

    // console.log("========开始配置插件======", clickEffect)
    // console.log("========开始配置插件======", loadMeting)
    // console.log("========开始配置插件======", startSakura)
    // console.log("========开始配置插件======", fairyDustCursor)

    let $bodyDom = document.getElementsByTagName('body')[0];
    if ($bodyDom !== null) {

        // live2d
        let $live2dDom = document.getElementById('_extra_plugins_live2d_');
        if ($live2dDom === null) {
            $live2dDom = document.createElement('div');
            $live2dDom.id = '_extra_plugins_live2d_';
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
            $live2dDom.innerHTML = content;
            document.body.appendChild($live2dDom);
        }

        // APlayer
        let $AplayerDom = document.getElementById('_extra_plugins_aplayer_');
        if ($AplayerDom === null) {
            // APlayer,页面添加一个标签在 body 最后面 
            $AplayerDom = document.createElement('div');
            $AplayerDom.id = '_extra_plugins_aplayer_';
            $AplayerDom.classList.add('aplayer');
            $AplayerDom.setAttribute('data-id', '780461113');
            $AplayerDom.setAttribute('data-server', 'netease');
            $AplayerDom.setAttribute('data-type', 'playlist');
            document.body.appendChild($AplayerDom);
            // 注册 APlayer
            loadMeting(APlayer);
        }

        // cursor
        let $cursor = document.getElementById('_extra_plugins_cursor_');
        if ($cursor === null) {
            // 鼠标拖动特效
            $cursor = document.createElement('span');
            $cursor.id = '_extra_plugins_cursor_';
            $cursor.innerHTML = `<span class="js-cursor-container"></span>`;
            document.body.appendChild($cursor);
            // 鼠标拖动特效
            fairyDustCursor();
        }
    }
    // 鼠标点击特效
    clickEffect();
    // 开始花瓣
    startSakura();
}
setTimeout(iniLib, 1000);

export { iniLib }