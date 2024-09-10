/**
 * 网站的域名前缀，这里默认是 /
 */
const $$site_prefix = '/';
const ref = {};
ref.wet_site_title = null;
async function iniLib() {

    // 动态标题
    window.onfocus = () => {
        document.title = '(/≧▽≦/)咦！又好了！';
    };
    document.onclick = () => {
        if (ref.wet_site_title) {
            document.title = ref.wet_site_title;
            ref.wet_site_title = null;
        }
    }
    window.onblur = () => {
        ref.wet_site_title = document.title;
        document.title = '(●—●)喔哟, 崩溃啦！';
    };

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
            document.body.appendChild($AplayerDom);
            // 注册 APlayer
            await import($$site_prefix + `lib/aplayer/Meting.js`).then(({ loadMeting }) => {
                loadMeting(APlayer, {
                    // 音量
                    volumn: 0.5,
                    // 迷你
                    mini: true,
                    // 固定到底部
                    fixed: true,
                    // 音频循环顺序
                    order: 'list',
                    // 音频自动播放
                    autoplay: true,
                    // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
                    mutex: true,
                    // 列表默认折叠
                    listFolded: true,
                    audio: {
                        // 调用第三方播放器接口，比如获取网易云的接口的歌单，然后全部丢到播放列表
                        api: {
                            // Meting 接口
                            url: 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
                            //server 可选 netease（网易云音乐），tencent（QQ 音乐），kugou（酷狗音乐），xiami（虾米音乐），baidu（百度音乐）。
                            server: 'netease',
                            // type 可选 song（歌曲），playlist（歌单），album（专辑），search（搜索关键字），artist（歌手）
                            type: 'playlist',
                            // id 获取示例：浏览器打开网易云音乐，点击我喜欢的音乐歌单，地址栏有一串数字，playlist 的 id 即为这串数字。
                            id: '7076340031',
                        },
                        // 本地配置，手动配置你想要的歌曲
                        // local:[{
                        //     name: 'Audio name',
                        //     artist: 'Audio artist',
                        //     url: '',
                        //     cover: '',
                        //     lrc: '',
                        //     type: 'auto'
                        // }]
                    }
                });
            })
        }

        // cursor
        let $cursor = document.getElementById('_extra_plugins_cursor_');
        if ($cursor === null) {
            // 鼠标拖动特效
            $cursor = document.createElement('span');
            $cursor.id = '_extra_plugins_cursor_';
            $cursor.innerHTML = `<span class="js-cursor-container"></span>`;
            document.body.appendChild($cursor);
        }
        // 鼠标拖动特效
        await import($$site_prefix + `lib/mouseTrack/track.js`).then(({ fairyDustCursor }) => {
            fairyDustCursor();
        });

        // 飘带，这个全局的，不太好用
        //<script type="text/javascript" size="150" alpha='0.3' zIndex="-2" src="dist/ribbon.min.js"></script>
        // const $ribbon = document.createElement('script');
        // $ribbon.setAttribute('type','text/javascript');
        // $ribbon.setAttribute('size','90');
        // $ribbon.setAttribute('alpha', '0.1');
        // $ribbon.setAttribute('zIndex', '1')
        // $ribbon.setAttribute('src', $$site_prefix + 'lib/ribbon/ribbon.min.js')        
        // document.body.appendChild($ribbon);

    }
    // 鼠标点击特效
    await import($$site_prefix + `lib/clickEffect/clickEffect.js`).then(({ clickEffect }) => {
        clickEffect();
    });
    // 开始花瓣
    await import($$site_prefix + `lib/fullScreenFlower/flower.js`).then(({ startSakura }) => {
        startSakura();
    });
}

// 设置个超时
setTimeout(iniLib, 200);

export { iniLib }