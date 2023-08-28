import { getArticleDetail, getDisCount, getLikeDiscuss, informArt, informDis, publishDiscuss, seeFirDis, setArtCol, setArtLike, setCareUser, setColLike, shieldUser } from "../api/api";
import { getCookie, getTime, smallAlert } from "../api/cookie";
// 全局IP
let talk = document.querySelector('.talk');
let headurlBox = document.querySelector('.headurl');
let tanchuang = document.querySelector('.tanchuang');
let tijiaojubao = document.querySelector('.tanchuang button');
let jubaoliyou = document.querySelector('.jubaoliyou');
let overall = getCookie('overall');
let rightHeadurl = document.querySelector('.headurlName img')
let leftHeadurl = document.querySelector('.fixedBox img');
let ArtUsername = document.querySelector('.authorTime .username')
let ArtTitle = document.querySelector('.articleDetail .title');
let ArtPublishTime = document.querySelector('.authorTime .publishTime')
let ArtContent = document.querySelector('.articleDetail .content');
let ArtTag = document.querySelector('.tags .tag')
let leftGood = document.querySelector('.isgood');
let leftCol = document.querySelector('.isshoucang');
let headurl = getCookie('headurl');
let tel = getCookie('tel');
let articleDetail = document.querySelector('.articleDetail');
let headImgNa = document.querySelector('.toplist-right .headurl');
let loginBtn = document.querySelector('.toplist-userbox');
let aid = window.location.href.split(/[?#]/)[1].split('=')[1];
let care = document.querySelector('.careTalk .care');
let haveCare = document.querySelector('.careTalk .haveCare');
let rightUsername = document.querySelector('.usernameJob .username');
let rightJob = document.querySelector('.usernameJob .job');
let discusses = document.querySelector('.discusses')
let articles = document.querySelector('.articles');
let xiaotanchuang = document.querySelector('.xiaotanchuang');
let likecount = document.querySelector('.count .likecount');
let jubaowenzhang = document.querySelector('.jubao');
let authorId;
if (headurl && tel) {
    (headImgNa as HTMLImageElement).src = getCookie('headurl') as string;
    (headImgNa as HTMLImageElement).style.display = 'block';
    (loginBtn as HTMLDivElement).style.display = 'none';
}
// 点击头像，进入个人中心
(headurlBox as HTMLImageElement).addEventListener('click', function () {
    window.location.href = './personal.html';
})
getArticleDetail({ aid }).then(r => {
    authorId = r.data.data.authorId;
    (leftHeadurl as HTMLImageElement).src = r.data.data.headurl;
    (rightHeadurl as HTMLImageElement).src = r.data.data.headurl;
    (ArtTitle as HTMLSpanElement).innerHTML = `<strong>${r.data.data.title}</strong>`;
    (ArtUsername as HTMLSpanElement).innerHTML = r.data.data.username;
    (ArtPublishTime as HTMLSpanElement).innerHTML = getTime(r.data.data.publish_time);
    (ArtContent as HTMLDivElement).innerHTML = r.data.data.content;
    (likecount as HTMLSpanElement).innerHTML = r.data.data.alllikecount;
    // 标签类型
    let tag = '';
    switch (r.data.data.tag) {
        case 1:
            tag = '前端';
            break;
        case 2:
            tag = '后端';
            break;
        case 3:
            tag = 'Android';
            break;
        case 4:
            tag = 'IOS';
            break;
        case 5:
            tag = '代码人生';
            break;

        default:
            break;
    };
    (ArtTag as HTMLSpanElement).innerHTML = tag;

    if (r.data.data.islike != 0) {
        (leftGood as HTMLSpanElement).classList.remove('icon-good');
        (leftGood as HTMLSpanElement).classList.add('icon-dianzan');
        (leftGood as HTMLSpanElement).style.color = '#3f51b5';
    }
    if (r.data.data.iscollect != 0) {
        (leftCol as HTMLSpanElement).classList.remove('icon-shoucang');
        (leftCol as HTMLSpanElement).classList.add('icon-shoucang1');
        (leftCol as HTMLSpanElement).style.color = '#3f51b5';
    }
    if (r.data.data.iscare != 0) {
        (care as HTMLSpanElement).style.display = 'none';
        (haveCare as HTMLSpanElement).style.display = 'block';
    };
    (rightUsername as HTMLSpanElement).innerHTML = r.data.data.username;
    (rightJob as HTMLSpanElement).innerHTML = r.data.data.job;
    // 评论展示
    let flag = document.createDocumentFragment();
    (discusses as HTMLDivElement).innerHTML = ``;
    r.data.data.discuss.forEach(item => {
        let div = document.createElement('div');
        let divBr = document.createElement('div');
        div.classList.add('discuss');
        divBr.classList.add('br')
        // 获取评论的点赞数，评论数，是否点赞
        getDisCount({ 'discussId': item.discussId }).then(r => {
            let isLike = 'icon-good';
            if (r.data.data.islikedis != 0) {
                isLike = 'icon-dianzan'
            }
            if (item.bydisusername == '0') {
                (div as HTMLDivElement).innerHTML = `<img src="${item.disheadurl}"
                                                    alt="" class="headurl">
                                                <div class="rightPart">
                                                    <span class="username"><strong>${item.disusername}</strong><span>${getTime(item.disTime)}</span></span>
                                                    <span
                                                        class="content">${item.discontent}</span>
                                                    <div class="countTime">
                                                        <span class="iconfont ${isLike} dianzan" data-discussId="${item.discussId}"></span>
                                                        <span class="likecount">${r.data.data.likecount}</span>
                                                        <span class="iconfont icon-pinglun" data-discussId="${item.discussId}"></span>
                                                        <span class="discusscount">${r.data.data.discount}</span>
                                                        <div class="shieldIn">
                                                            <span>...</span>
                                                            <div>
                                                                <span class="shielduser" data-discussId="${item.discussId}">屏蔽作者</span>
                                                                <span class="informuser" data-discussId="${item.discussId}">举报评论</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="replayPart">
                                                        <textarea name="pubContent" id="" class="replayContent" placeholder="输入评论"></textarea>
                                                        <div class="replayButton" data-discussId="${item.discussId}">发布评论</div>
                                                    </div>
                                                    <div class="replayDiv">
                                                        <span class="seeReplay" data-discussId="${item.discussId}">查看${r.data.data.discount}条回复评论>></span>
                                                        <div calss = "replayDis">
                                                        
                                                        </div>
                                                    </div>
                                                </div>`;
                flag.append(div);
                flag.append(divBr);
            } else {
                (div as HTMLDivElement).innerHTML = `<img src="${item.disheadurl}"
                                                    alt="" class="headurl">
                                                <div class="rightPart">
                                                    <span class="username"><div class="return">
                                                    <span><strong>${item.disusername}</strong></span><span>回复</span><span><strong>${item.bydisusername}</strong></span>
                                                </div><span>${getTime(item.disTime)}</span></span>
                                                    <span
                                                        class="content">${item.discontent}</span>
                                                    <div class="countTime">
                                                        <span class="iconfont ${isLike} dianzan" data-discussId="${item.discussId}"></span>
                                                        <span class="likecount">${r.data.data.likecount}</span>
                                                        <span class="iconfont icon-pinglun" data-discussId="${item.discussId}"></span>
                                                        <span class="discusscount">${r.data.data.discount}</span>
                                                        <div class="shieldIn">
                                                            <span>...</span>
                                                            <div>
                                                                <span class="shielduser" data-discussId="${item.discussId}">屏蔽作者</span>
                                                                <span class="informuser" data-discussId="${item.discussId}">举报评论</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="replayPart">
                                                        <textarea name="pubContent" id="" class="replayContent" placeholder="输入评论"></textarea>
                                                        <div class="replayButton" data-discussId="${item.discussId}">发布评论</div>
                                                    </div>
                                                </div>`;
                flag.append(div);
                flag.append(divBr);
            }
            (discusses as HTMLDivElement).append(flag);
        });
    });
    let flags = document.createDocumentFragment();
    r.data.data.articles.forEach(item => {
        getLikeDiscuss({ reaid: item.reaid })
            .then(r => {
                let div = document.createElement('div');
                div.classList.add('article');
                div.innerHTML = `<span class="title" data-aid="${item.reaid}">${item.retitle}</span>
                        <div class="count">
                            <span>${r.data.data.likecount}点赞</span>
                            <div class="point"></div>
                            <span>${r.data.data.rediscount}评论</span>
                        </div>`
                flags.append(div);
                (articles as HTMLDivElement).append(flags);
            });
    });


    // 评论部分
    let publishPart = document.querySelector('.PublishDiscuss');
    let publishBtn = document.querySelector('.publishButton');
    let publishHeadurl = document.querySelector('.publish .headurl');
    if (getCookie('headurl')) {
        (publishHeadurl as HTMLImageElement).src = `${getCookie('headurl')}`;
    }
    (publishPart as HTMLDivElement).addEventListener('click', function (e) {
        let ev = e || event;
        if ((ev.target as HTMLTextAreaElement).classList.contains('pubContent')) {
            (publishBtn as HTMLDivElement).style.display = 'block';
        }
        if (!(ev.target as HTMLTextAreaElement).classList.contains('pubContent') && !(ev.target as HTMLTextAreaElement).classList.contains('publishButton')) {
            (publishBtn as HTMLDivElement).style.display = 'none';
        }
        if ((ev.target as HTMLTextAreaElement).classList.contains('publishButton')) {
            if (!((((ev.target as HTMLTextAreaElement).parentElement as HTMLDivElement).children[1] as HTMLDivElement).children[1] as HTMLTextAreaElement).value) {
                alert('输入内容不能为空');
                return false;
            }
            // 点击发布评论
            publishDiscuss({ discussId: 0, content: ((((ev.target as HTMLTextAreaElement).parentElement as HTMLDivElement).children[1] as HTMLDivElement).children[1] as HTMLTextAreaElement).value, aid })
                .then(r => {
                    console.log(r.data.data);

                })

            console.log();
        }
        let replayPartAll = document.querySelectorAll('.replayPart')
        replayPartAll.forEach(replayPart => {
            if ((ev.target as HTMLTextAreaElement).classList.contains('icon-pinglun')) {
                ((((ev.target as HTMLTextAreaElement).parentElement as HTMLDivElement).parentElement as HTMLDivElement).children[3] as HTMLDivElement).style.display = 'flex';
            }
            if (!(ev.target as HTMLTextAreaElement).classList.contains('icon-pinglun') && !(ev.target as HTMLTextAreaElement).classList.contains('replayPart') && !(ev.target as HTMLTextAreaElement).classList.contains('replayButton') && !(ev.target as HTMLTextAreaElement).classList.contains('replayContent')) {
                if ((replayPart as HTMLDivElement).style.display == 'flex') {
                    (replayPart as HTMLDivElement).style.display = 'none';
                }
            }
            // 回复评论
            if ((ev.target as HTMLTextAreaElement).classList.contains('replayButton')) {
                console.log((ev.target as HTMLTextAreaElement).dataset.discussid);
                if (!(((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[0] as HTMLTextAreaElement).value) {
                    alert('输入内容不能为空');
                    return false;
                }
                publishDiscuss({ discussId: (ev.target as HTMLTextAreaElement).dataset.discussid, content: (((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[0] as HTMLTextAreaElement).value, aid })
                    .then(r => {
                        if (r.data.code == 1) {

                        } else {
                            alert(r.data.data)
                        }
                    })

            }
        })
        // 屏蔽评论用户
        if ((ev.target as HTMLDivElement).classList.contains('shielduser')) {
            if (getCookie('tel')) {
                shieldUser({ discussId: (ev.target as HTMLDivElement).dataset.discussid })
                    .then(r => {
                        (xiaotanchuang as HTMLDivElement).style.display = 'block';
                        (xiaotanchuang as HTMLDivElement).innerHTML = r.data.data;
                        smallAlert(xiaotanchuang, 3000);

                    })
            }

        }

        // 举报评论用户
        if ((ev.target as HTMLDivElement).classList.contains('informuser')) {
            let discussId = (ev.target as HTMLSpanElement).dataset.discussid;

            if (getCookie('tel')) {
                console.log(jubaoliyou);

                (tanchuang as HTMLDivElement).style.opacity = '1';
                (tanchuang as HTMLDivElement).style.width = '540px';
                (tanchuang as HTMLDivElement).style.height = '290px';
                (tanchuang as HTMLDivElement).style.backgroundImage = "url('../images/jubao.jpg')";
                (tijiaojubao as HTMLButtonElement).addEventListener('click', function () {
                    if ((jubaoliyou as HTMLTextAreaElement).value && (jubaoliyou as HTMLTextAreaElement).value.length < 21) {
                        informDis({ discussId, informReason: (jubaoliyou as HTMLTextAreaElement).value })
                            .then(r => {
                                if (r.data.code == 1) {
                                    (tanchuang as HTMLDivElement).style.width = '0';
                                    (tanchuang as HTMLDivElement).style.height = '0';
                                    (tanchuang as HTMLDivElement).style.opacity = '0';
                                    (jubaoliyou as HTMLTextAreaElement).value = '';
                                    (xiaotanchuang as HTMLDivElement).style.display = 'block';
                                    (xiaotanchuang as HTMLDivElement).innerHTML = r.data.data;
                                    smallAlert(xiaotanchuang, 3000);
                                }

                            })
                    }
                });
            }
        } else {
            (tanchuang as HTMLDivElement).style.width = '0';
            (tanchuang as HTMLDivElement).style.height = '0';
            (tanchuang as HTMLDivElement).style.opacity = '0';
        }

    })


});
(articleDetail as HTMLDivElement).addEventListener('click', function () {
    (tanchuang as HTMLDivElement).style.opacity = '0';
    (tanchuang as HTMLDivElement).style.width = '0';
    (tanchuang as HTMLDivElement).style.height = '0';
});
// 举报文章
(jubaowenzhang as HTMLSpanElement).addEventListener('click', function () {
    if (getCookie('tel')) {
        (tanchuang as HTMLDivElement).style.opacity = '1';
        (tanchuang as HTMLDivElement).style.width = '540px';
        (tanchuang as HTMLDivElement).style.height = '290px';
        (tanchuang as HTMLDivElement).style.backgroundImage = "url('../images/jubao.jpg')";
        (tijiaojubao as HTMLButtonElement).addEventListener('click', function () {
            if ((jubaoliyou as HTMLTextAreaElement).value && (jubaoliyou as HTMLTextAreaElement).value.length < 21) {
                informArt({ aid, informReason: (jubaoliyou as HTMLTextAreaElement).value })
                    .then(r => {
                        if (r.data.code == 1) {
                            console.log(r.data.code);
                            (tanchuang as HTMLDivElement).style.width = '0';
                            (tanchuang as HTMLDivElement).style.height = '0';
                            (tanchuang as HTMLDivElement).style.opacity = '0';
                            (jubaoliyou as HTMLTextAreaElement).value = '';
                            (xiaotanchuang as HTMLDivElement).style.display = 'block';
                            (xiaotanchuang as HTMLDivElement).innerHTML = r.data.data;
                            smallAlert(xiaotanchuang, 3000);

                        }

                    })
            }
        });
    }
});
// 点赞/取消点赞评论
(discusses as HTMLDivElement).addEventListener('click', function (e) {
    let ev = e || event;
    if ((ev.target as HTMLSpanElement).classList.contains('dianzan')) {
        setColLike({ discussId: (ev.target as HTMLSpanElement).dataset.discussid })
            .then(r => {
                console.log(r.data.data);
                if (r.data.code == 1) {
                    (ev.target as HTMLSpanElement).classList.toggle('icon-good');
                    (ev.target as HTMLSpanElement).classList.toggle('icon-dianzan');
                    getDisCount({ discussId: (ev.target as HTMLSpanElement).dataset.discussid })
                        .then(r => {
                            if (r.data.code == 1) {
                                (((ev.target as HTMLSpanElement).parentElement as HTMLDivElement).children[1] as HTMLSpanElement).innerHTML = r.data.data.likecount;
                            }
                        })
                }
            });
    }
});

// 点击查看回复的评论
(discusses as HTMLDivElement).addEventListener('click', function (e) {
    let ev = e || event;
    if ((ev.target as HTMLSpanElement).classList.contains('seeReplay')) {
        seeFirDis({ shieldId: (ev.target as HTMLSpanElement).dataset.shieldid })
            .then(r => {
                console.log(r.data.data);

            })
    }
});

// 点赞，收藏
let leftBox = document.querySelector('.leftBox');
(leftBox as HTMLDivElement).addEventListener('click', function (e) {
    let ev = e || event;
    if ((ev.target as HTMLSpanElement).classList.contains('isgood')) {
        setArtLike({ aid }).then(r => {
            if (r.data.code == 1) {
                (ev.target as HTMLDivElement).classList.toggle('icon-good');
                (ev.target as HTMLDivElement).classList.toggle('icon-dianzan');
            } else {
                console.log(console.log(r.data.data));
                alert(r.data.data);
            }

        })
    }
    if ((ev.target as HTMLSpanElement).classList.contains('isshoucang')) {
        setArtCol({ aid })
            .then(r => {
                if (r.data.code == 1) {
                    (ev.target as HTMLDivElement).classList.toggle('icon-shoucang');
                    (ev.target as HTMLDivElement).classList.toggle('icon-shoucang1');
                } else {
                    console.log(console.log(r.data.data));
                    alert(r.data.data);
                }
            })
    }

})
let rightBox = document.querySelector('.rightBox');

// 右边部分
(rightBox as HTMLDivElement).addEventListener('click', function (e) {
    let ev = e || event;
    // 关注、取消关注
    if ((ev.target as HTMLDivElement).classList.contains('isCare')) {
        setCareUser({ authorId }).then(r => {
            if (r.data.code == 1) {

            } else {
                alert(r.data.data)
            }
        })
        if ((((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[0] as HTMLDivElement).style.display == 'none') {
            (((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[0] as HTMLDivElement).style.display = 'block';
            (((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[1] as HTMLDivElement).style.display = 'none';
        } else {
            (((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[0] as HTMLDivElement).style.display = 'none';
            (((ev.target as HTMLDivElement).parentElement as HTMLDivElement).children[1] as HTMLDivElement).style.display = 'block';
        }
    }

    // 相关文章跳转
    if ((ev.target as HTMLDivElement).classList.contains('title')) {
        window.location.href = overall + '/articleDetail.html?' + 'aid=' + (ev.target as HTMLDivElement).dataset.aid;
    }
});

(talk as HTMLButtonElement).addEventListener('click', function () {
    window.location.href = './talk.html'
})






