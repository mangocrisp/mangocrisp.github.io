// 原文：https://blog.csdn.net/q1246192888/article/details/111409908
let aplayers = [];

export function loadMeting(APlayer) {
    function a(a, b) {
        let c = {
            "container": a,
            "audio": b,
            // 迷你
            "mini": true,
            // 固定到底部
            "fixed": true,
            // 音频自动播放
            "autoplay": true,
            // 主题色
            "theme": "var(--theme-color)",
            // 音频循环播放, 可选值: 'all', 'one', 'none'
            "loop": "all",
            // 音频循环顺序, 可选值: 'list', 'random'
            "order": "random",
            // 预加载，可选值: 'none', 'metadata', 'auto'
            "preload": "none",
            // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
            "mutex": true,
            // 歌词传递方式,3 lrc 文件
            "lrcType": 3,
            // 列表默认折叠
            "listFolded": true,
            // 列表最大高度
            //"listMaxHeight": 90,
            // 存储播放器设置的 localStorage key
            "storageName":"aplayer-setting",
            // 音量
            "volume": null,
            // 自定义类型
            "customAudioType": null,
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
        let d = c[e], f = d.dataset.id;
        if (f) {
            let g = d.dataset.api || b;
            g = g.replace(':server', d.dataset.server), g = g.replace(':type', d.dataset.type), g = g.replace(':id', d.dataset.id), g = g.replace(':auth', d.dataset.auth), g = g.replace(':r', Math.random());
            let h = new XMLHttpRequest;
            h.onreadystatechange = function () {
                if (4 === h.readyState && (200 <= h.status && 300 > h.status || 304 === h.status)) {
                    let b = JSON.parse(h.responseText);
                    a(d, b)
                }
            }, h.open('get', g, !0), h.send(null)
        } else if (d.dataset.url) {
            let i = [{
                name: d.dataset.name || d.dataset.title || 'Audio name',
                artist: d.dataset.artist || d.dataset.author || 'Audio artist',
                url: d.dataset.url,
                cover: d.dataset.cover || d.dataset.pic,
                lrc: d.dataset.lrc,
                type: d.dataset.type || 'auto'
            }];
            a(d, i)
        }
    }, e = 0; e < c.length; e++) d()
  };