import { bycare, careLabel, careUser, collect, login, personal, seeLike, setLabel, setUser, trends } from "../api/api";
import { setCookie, getCookie, getTime, getDay } from "../api/cookie";

// 全局IP
let overall = getCookie('overall');

let headurl = document.querySelector('.headImg');
let username = document.querySelector('.username');
let introduction = document.querySelector('.introduction');
let job = document.querySelector('.job')
let careCount = document.querySelector('.careCount');
let bycareCount = document.querySelector('.bycareCount');
let collectCount = document.querySelector('.collectSpan');
let careLableCount = document.querySelector('.careLabelSpan');
let joinTime = document.querySelector('.joinSpan');
let brs = document.querySelectorAll('.navigation .br');
let navigations = document.querySelectorAll('.navigation>div');
let bottomPart = document.querySelector('.bottomPart');
let careLabelSpan = document.querySelector('.careLabelSpan');
let careBox = document.querySelector('.careBoxes .careBox');
let SetBox = document.querySelector('.SetBox');
let bycareBox = document.querySelector('.careBoxes .bycareBox');
let headurlNa = document.querySelector('.headurl');

// 网页加载
if (getCookie('tel') && getCookie('headurl')) {
    (brs[0] as HTMLDivElement).style.display = 'block';
    (headurlNa as HTMLImageElement).style.display = 'block';
    (headurlNa as HTMLImageElement).src =getCookie('headurl') as string;
    try {
        personal().then(r => {
            (headurl as HTMLImageElement).src = r.data.data[0].headurl;
            (username as HTMLSpanElement).innerHTML = `<strong>${r.data.data[0].username}</strong>`;
            if (r.data.data[0].introduction != null) {
                (introduction as HTMLSpanElement).innerHTML = r.data.data[0].introduction;
            }
            if (r.data.data[0].job != null) {
                (job as HTMLSpanElement).innerHTML = r.data.data[0].job
            }
            (careCount as HTMLSpanElement).innerHTML = r.data.data[0].carecount;
            (joinTime as HTMLSpanElement).innerHTML = getDay(r.data.data[0].addtime);
            (bycareCount as HTMLSpanElement).innerHTML = r.data.data[0].bycarecount;
        });
    } catch (error) {
        console.log(error);

    }
    try {
        collect().then(r => {
            (collectCount as HTMLSpanElement).innerHTML = r.data.data.length;
        });
        careLabel().then(r => {
            (careLabelSpan as HTMLSpanElement).innerHTML = r.data.data.length;
        })
    } catch (error) {
        console.log(error);

    }

    try {
        trends().then(r => {
            (bottomPart as HTMLDivElement).innerHTML = '';
            let flag = document.createDocumentFragment();
            let tag = '';
            r.data.data.forEach(item => {
                switch (item.tag) {
                    case 0:
                        tag = '综合'
                        break;
                    case 1:
                        tag = '前端'
                        break;
                    case 2:
                        tag = '后端'
                        break;
                    case 3:
                        tag = 'Android'
                        break;
                    case 4:
                        tag = 'IOS'
                        break;
                    case 5:
                        tag = '代码人生'
                        break;
                    default:
                        break;
                }
                let div = document.createElement('div');
                div.classList.add('article');
                div.classList.add('bottomPartChild');
                div.dataset.aid = `${item.aid}`
                div.innerHTML = `<a class="titleName" href = "${overall}/articleDetail.html?aid=${item.aid}"><strong>${item.title}</strong></a>
                            <span class="artTag">${tag}</span>
                            <span class="publishTime">发布时间:${getTime(item.publish_time)}</span>`
                flag.append(div);
            });
            (bottomPart as HTMLDivElement).append(flag);

        })
    } catch (error) {
        console.log(error);

    }
    // 查看动态
    navigations[0].addEventListener('click', function () {
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[0] as HTMLDivElement).style.display = 'block';
        (bottomPart as HTMLDivElement).innerHTML = '';
        let tag = '';
        trends().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                r.data.data.forEach(item => {
                    switch (item.tag) {
                        case 0:
                            tag = '综合'
                            break;
                        case 1:
                            tag = '前端'
                            break;
                        case 2:
                            tag = '后端'
                            break;
                        case 3:
                            tag = 'Android'
                            break;
                        case 4:
                            tag = 'IOS'
                            break;
                        case 5:
                            tag = '代码人生'
                            break;
                        default:
                            break;
                    }
                    let div = document.createElement('div');
                    div.classList.add('article');
                    div.classList.add('bottomPartChild');
                    div.dataset.aid = `${item.aid}`
                    div.innerHTML = `<a class="titleName" href = "${overall}/articleDetail.html?aid=${item.aid}"><strong>${item.title}</strong></a>
                                <span class="artTag">${tag}</span>
                                <span class="publishTime">发布时间:${getTime(item.publish_time)}</span>`
                    flag.append(div);
                });
                (bottomPart as HTMLDivElement).append(flag);
            }
            else {
                console.log(r.data.data);

            }

        })
    });
    // 查看收藏
    navigations[1].addEventListener('click', function () {
        (bottomPart as HTMLDivElement).innerHTML = '';
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[1] as HTMLDivElement).style.display = 'block';
        collect().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                r.data.data.forEach(item => {
                    let div = document.createElement('div');
                    div.classList.add('collect');
                    div.classList.add('bottomPartChild');
                    div.innerHTML = `<a class="titleName" href = "${overall}/articleDetail.html?aid=${item.aid}"><strong>${item.title}</strong></a>
                            <span class="artTag">${item.username}</span>
                            <span class="publishTime">发布时间:${getTime(item.publish_time)}</span>`
                    flag.append(div);
                });
                (bottomPart as HTMLDivElement).append(flag);
            } else {
                console.log(r.data.data);

            }
        })
    });
    // 关注者
    (bycareBox as HTMLDivElement).addEventListener('click', function () {
        (bottomPart as HTMLDivElement).innerHTML = '';
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[2] as HTMLDivElement).style.display = 'block';

        (bottomPart as HTMLDivElement).innerHTML = `<div class="authorLabel">
                                                    <span class = "careUserSpan">关注的用户</span>
                                                    <div class="br"></div>
                                                    <span class="bycareUserSpan">关注者</span>
                                                    <div class="br"></div>
                                                    <span class="careLableSpan">关注的标签</span>
                                                    </div>`

        let careUserSpan = document.querySelector('.careUserSpan');
        let bycareUserSpan = document.querySelector('.bycareUserSpan');
        let careLableSpan = document.querySelector('.careLableSpan');
        let divBox = document.createElement('div');
        divBox.classList.add('divBox');
        (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
        (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        (divBox as HTMLDivElement).innerHTML = '';
        bycare().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                r.data.data.forEach(item => {
                    let div = document.createElement('div');
                    div.classList.add('careAuthor');
                    div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.job}</span>
                                        </div>
                                        `;
                    (divBox as HTMLDivElement).append(div);
                });
                flag.append(divBox as HTMLDivElement);
                (bottomPart as HTMLDivElement).append(flag);

            } else {
                console.log(r.data.data);
            }
        });
        // 查看关注的用户
        ((careUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careUser().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.introduction}</span>
                                        </div>
                                        <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                        <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看被关注的用户
        ((bycareUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            bycare().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.job}</span>
                                        </div>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看关注的标签
        (careLableSpan as HTMLSpanElement).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77) ';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careLabel().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('CareLabel');
                        div.innerHTML = `<span class="label" data-lid="${item.lid}"><strong>${item.labelname}</strong></span>
                                            <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                            <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                            `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);
                } else {
                    console.log(r.data.data);
                }

            })
        })
    });
    // 关注了
    (careBox as HTMLDivElement).addEventListener('click', function () {
        (bottomPart as HTMLDivElement).innerHTML = '';
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[2] as HTMLDivElement).style.display = 'block';

        (bottomPart as HTMLDivElement).innerHTML = `<div class="authorLabel">
                                                    <span class = "careUserSpan">关注的用户</span>
                                                    <div class="br"></div>
                                                    <span class="bycareUserSpan">关注者</span>
                                                    <div class="br"></div>
                                                    <span class="careLableSpan">关注的标签</span>
                                                    </div>`

        let careUserSpan = document.querySelector('.careUserSpan');
        let bycareUserSpan = document.querySelector('.bycareUserSpan');
        let careLableSpan = document.querySelector('.careLableSpan');
        (careUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
        (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        let divBox = document.createElement('div');
        divBox.classList.add('divBox');
        careUser().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                r.data.data.forEach(item => {
                    let div = document.createElement('div');
                    div.classList.add('careAuthor');
                    div.innerHTML = `<img src="${item.headurl}"
                                        alt="" class="bottomPartChild" data-authorId = "${item.uid}">
                                    <div class="nameAbs bottomPartChild">
                                    <span class="username"><strong>${item.username}</strong></span>
                                    <span class="abstract">${item.introduction}</span>
                                    </div>
                                    <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                    <button class="isCareL NoCare CareButton bottomPartChild">关注</button>`
                    divBox.append(div);
                });
                flag.append(divBox);
                (bottomPart as HTMLDivElement).append(flag);
            }
        });
        // 查看关注的用户
        ((careUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careUser().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.introduction}</span>
                                        </div>
                                        <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                        <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看被关注的用户
        ((bycareUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            bycare().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.job}</span>
                                        </div>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看关注的标签
        (careLableSpan as HTMLSpanElement).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77) ';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careLabel().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('CareLabel');
                        div.innerHTML = `<span class="label" data-lid="${item.lid}"><strong>${item.labelname}</strong></span>
                                            <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                            <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                            `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);
                } else {
                    console.log(r.data.data);
                }

            })
        })


    });
    // 查看关注
    navigations[2].addEventListener('click', function () {
        (bottomPart as HTMLDivElement).innerHTML = '';
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[2] as HTMLDivElement).style.display = 'block';

        (bottomPart as HTMLDivElement).innerHTML = `<div class="authorLabel">
                                                    <span class = "careUserSpan">关注的用户</span>
                                                    <div class="br"></div>
                                                    <span class="bycareUserSpan">关注者</span>
                                                    <div class="br"></div>
                                                    <span class="careLableSpan">关注的标签</span>
                                                    </div>`

        let careUserSpan = document.querySelector('.careUserSpan');
        let bycareUserSpan = document.querySelector('.bycareUserSpan');
        let careLableSpan = document.querySelector('.careLableSpan');
        (careUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
        (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
        let divBox = document.createElement('div');
        divBox.classList.add('divBox');
        careUser().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                r.data.data.forEach(item => {
                    let div = document.createElement('div');
                    div.classList.add('careAuthor');
                    div.innerHTML = `<img src="${item.headurl}"
                                        alt="" class="bottomPartChild" data-authorId = "${item.uid}">
                                    <div class="nameAbs bottomPartChild">
                                    <span class="username"><strong>${item.username}</strong></span>
                                    <span class="abstract">${item.introduction}</span>
                                    </div>
                                    <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                    <button class="isCareL NoCare CareButton bottomPartChild">关注</button>`
                    divBox.append(div);
                });
                flag.append(divBox);
                (bottomPart as HTMLDivElement).append(flag);
            }
        });
        // 查看关注的用户
        ((careUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careUser().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.introduction}</span>
                                        </div>
                                        <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                        <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看被关注的用户
        ((bycareUserSpan as HTMLSpanElement)).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            bycare().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('careAuthor');
                        div.innerHTML = `<img src="${item.headurl}"
                                            alt=""  class="bottomPartChild" data-authorId = "${item.uid}">
                                        <div class="nameAbs bottomPartChild">
                                        <span class="username"><strong>${item.username}</strong></span>
                                        <span class="abstract">${item.job}</span>
                                        </div>
                                        `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);

                } else {
                    console.log(r.data.data);
                }
            })
        });
        // 查看关注的标签
        (careLableSpan as HTMLSpanElement).addEventListener('click', function () {
            (careUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (bycareUserSpan as HTMLSpanElement).style.color = 'rgb(136, 131, 131)';
            (careLableSpan as HTMLSpanElement).style.color = 'rgb(80, 77, 77) ';
            let divBox = document.querySelector('.divBox');
            (divBox as HTMLDivElement).innerHTML = '';
            careLabel().then(r => {
                if (r.data.code == 1) {
                    let flag = document.createDocumentFragment();
                    r.data.data.forEach(item => {
                        let div = document.createElement('div');
                        div.classList.add('CareLabel');
                        div.innerHTML = `<span class="label" data-lid="${item.lid}"><strong>${item.labelname}</strong></span>
                                            <button class="HaveCare CareButton bottomPartChild">已关注</button>
                                            <button class="isCareL NoCare CareButton bottomPartChild">关注</button>
                                            `;
                        (divBox as HTMLDivElement).append(div);
                    });
                    flag.append(divBox as HTMLDivElement);
                    (bottomPart as HTMLDivElement).append(flag);
                } else {
                    console.log(r.data.data);
                }

            })
        })

    });
    // 关注/取消关注
    (bottomPart as HTMLDivElement).addEventListener('click', function (e) {
        let ev = e || event;
        if ((ev.target as HTMLButtonElement).classList.contains('CareButton')) {
            if ((((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).firstChild as HTMLSpanElement).dataset.lid != undefined) {
                setLabel({ 'lid': (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).firstChild as HTMLSpanElement).dataset.lid }).then(
                    r => {
                        if (r.data.code == 1) {
                            (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).children[2] as HTMLDivElement).classList.toggle('isCareL');
                            (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).children[1] as HTMLDivElement).classList.toggle('isCareL')
                        }
                    }
                )
            } else if ((((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).firstChild as HTMLSpanElement).dataset.authorid != undefined) {
                setUser({ 'authorId': (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).firstChild as HTMLSpanElement).dataset.authorid }).then(
                    r => {
                        if (r.data.code == 1) {
                            (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).children[2] as HTMLSpanElement).classList.toggle('isCareL');
                            (((ev.target as HTMLButtonElement).parentElement as HTMLDivElement).children[3] as HTMLDivElement).classList.toggle('isCareL')
                        }
                    }
                )
            }


        }
    })
    // 查看赞的文章
    navigations[3].addEventListener('click', function () {
        (bottomPart as HTMLDivElement).innerHTML = '';
        brs.forEach(item => {
            (item as HTMLDivElement).style.display = 'none';
        });
        (brs[3] as HTMLDivElement).style.display = 'block';

        seeLike().then(r => {
            if (r.data.code == 1) {
                let flag = document.createDocumentFragment();
                let tag = ''
                let divArts = document.createElement('div');
                divArts.classList.add('LikeArts')
                r.data.data.forEach(item => {
                    let divBr = document.createElement('div');
                    divBr.classList.add('br');
                    let div = document.createElement('div');
                    div.classList.add('bottomPartChild');
                    switch (item.tag) {
                        case 0:
                            tag = '综合'
                            break;
                        case 1:
                            tag = '前端'
                            break;
                        case 2:
                            tag = '后端'
                            break;
                        case 3:
                            tag = 'Android'
                            break;
                        case 4:
                            tag = 'IOS'
                            break;
                        case 5:
                            tag = '代码人生'
                            break;
                        default:
                            break;
                    }
                    if (item.coverurl != null) {
                        div.classList.add('LikeArt');
                        div.innerHTML = `<div>
                                            <span class="title"><strong>${item.title}</strong></span>
                                            <span
                                                class="abstract">${item.abstract}</span>
                                            <div class="timeTag">
                                                <span class="publisTime">${getTime(item.publish_time)}</span>
                                                <span class="tags">
                                                <span class="tag">${tag}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <img
                                            src="${item.coverurl}">
                                `
                    } else {
                        div.classList.add('LikeArtNI');
                        div.innerHTML = `<div>
                                        <span class="title"><strong>${item.title}</strong></span>
                                        <span
                                            class="abstract">${item.abstract}</span>
                                        <div class="timeTag">
                                            <span class="publisTime">${getTime(item.publish_time)}</span>
                                            <span class="tags">
                                                <span class="tag">${tag}</span>
                                            </span>
                                        </div>
                                    </div>`
                    }

                    flag.append(divBr);
                    flag.append(div);
                });
                divArts.append(flag);
                (bottomPart as HTMLDivElement).append(divArts);
            }

        })
    })
};

(SetBox as HTMLDivElement).addEventListener('click',function(){
    window.location.href = '../personalDetail.html';
})