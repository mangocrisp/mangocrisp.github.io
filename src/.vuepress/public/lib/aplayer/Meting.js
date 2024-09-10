// 原文：https://blog.csdn.net/q1246192888/article/details/111409908
let aplayers = [];

export function loadMeting(APlayer, options = {}) {
    function a(a, b) {
        let c = {
            "container": a,
            "audio": b,
            // 迷你
            "mini": options.mini,
            // 固定到底部
            "fixed": options.fixed,
            // 音频自动播放
            "autoplay": options.autoplay,
            // 主题色
            "theme": options.theme || "var(--theme-color)",
            // 音频循环播放, 可选值: 'all', 'one', 'none'
            "loop": options.loop || "all",
            // 音频循环顺序, 可选值: 'list', 'random'
            "order": options.order || "random",
            // 预加载，可选值: 'none', 'metadata', 'auto'
            "preload": options.preload || "none",
            // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
            "mutex": options.mutex,
            // 歌词传递方式,3 lrc 文件
            "lrcType": options.lrcType || 3,
            // 列表默认折叠
            "listFolded": options.listFolded,
            // 列表最大高度
            //"listMaxHeight": 90,
            // 存储播放器设置的 localStorage key
            "storageName": options.storageName || "aplayer-setting",
            // 音量
            "volume": options.volume || 0.5,
            // 自定义类型
            "customAudioType": options.customAudioType || null,
        };
        if (b.length) {
            b[0].lrc || (c.lrcType = 0);
            let d = {};
            for (let e in c) {
                let f = e.toLowerCase();
                (a.dataset.hasOwnProperty(f) || a.dataset.hasOwnProperty(e) || null !== c[e]) && (d[e] = a.dataset[f] || a.dataset[e] || c[e], ('true' === d[e] || 'false' === d[e]) && (d[e] = 'true' == d[e]))
            }
            aplayers.push(new APlayer(d))
        }
    }
  
    let b = 'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r';
    'undefined' != typeof meting_api && (b = meting_api);
    for (let f = 0; f < aplayers.length; f++) try {
        aplayers[f].destroy()
    } catch (a) {
        console.log(a)
    }
    aplayers = [];
    for (let c = document.querySelectorAll('.aplayer'), d = function () {
        let d = c[e], f = options.audio.api;
        if (f) {
            let g = options.audio.api.url || b;
            g = g.replace(':server', options.audio.api.server), g = g.replace(':type', options.audio.api.type), g = g.replace(':id', options.audio.api.id), g = g.replace(':auth', options.audio.api.auth), g = g.replace(':r', Math.random());
            let h = new XMLHttpRequest;
            h.onreadystatechange = function () {
                if (4 === h.readyState && (200 <= h.status && 300 > h.status || 304 === h.status)) {
                    let b = JSON.parse(h.responseText);
                    a(d, b)
                }
            }, h.open('get', g, !0), h.send(null)
        } else if (options.audio.local) {
            a(d, options.audio.local)
        }
    }, e = 0; e < c.length; e++) d()
  };