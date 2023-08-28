import { getCode, register, login, homepageArticle, getLikeDiscuss } from "../api/api";
import { sha256 } from "js-sha256";
import { setCookie, getCookie } from "../api/cookie";
import { Throttle } from "../api/type";

setCookie('overall', 'http://127.0.0.1:5173')
// 全局IP
let overall = getCookie('overall');
let loginbtn = document.querySelector('.loginbtn');
let login_box = document.querySelector('.login_box');
let headurl = document.querySelector('.headurl');


if (getCookie('tel')) {//登录没有失效
    (loginbtn as HTMLDivElement).style.display = 'none';
    // 头像.src = cookie里面的headurl
    (headurl as HTMLImageElement).src = (getCookie('headurl') as string);
    // ((headurl as HTMLImageElement).src) = `${getCookie('headurl')}`;
    (headurl as HTMLImageElement).style.display = 'block';
} else {//登录已失效
    (loginbtn as HTMLDivElement).style.display = 'block';
    (headurl as HTMLImageElement).style.display = 'none';
}

// 点击登陆|注册按钮弹出登陆注册对话框
(loginbtn as HTMLButtonElement).addEventListener('click', function () {
    (login_box as HTMLDivElement).style.display = 'block';
});

let form = document.querySelector('form');
// 点击表单黑色任意部分，表单消失
(login_box as HTMLDivElement).addEventListener('click', function (ev) {
    let e = ev || event;
    if ((e.target as HTMLElement).classList.contains('login_box')) {
        (login_box as HTMLDivElement).style.display = 'none';
    }
});

let change_password_login = document.querySelector('.change_password_login');
let login_code_main = document.querySelector('.login_code_main');
let login_password_main = document.querySelector('.login_password_main');
// 点击 “密码登陆” 更换form 输入框
(change_password_login as HTMLSpanElement).addEventListener("click", function () {
    (login_code_main as HTMLDivElement).style.display = 'none';
    (login_password_main as HTMLDivElement).style.display = 'block';
});

let change_code_login = document.querySelector('.change_code_login');
// 点击 “验证码登陆” 更换form 输入框
(change_code_login as HTMLSpanElement).addEventListener("click", function () {
    (login_code_main as HTMLDivElement).style.display = 'block';
    (login_password_main as HTMLDivElement).style.display = 'none';
});

let close_form = document.querySelector('.close_form');
// 点击 X  关闭窗口
(close_form as HTMLDivElement).addEventListener('click', function () {
    (login_box as HTMLDivElement).style.display = 'none';
});

let get_code = document.querySelector('.get_code');
let tel_input = document.querySelector('input[name=register_tel]');

// 定义数据 正则表达式
let telReg = /^1[3456789]\d{9}$/;
let passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#@!~%^&*.])[a-zA-Z\d#@!~%^&*.]{6,}$/;


//注册表单
// 点击按钮获取验证码
get_code && get_code.addEventListener('click', function () {
    // 获取输入框数据
    let tel = (tel_input as HTMLInputElement).value;
    // 验证tel数据格式
    if (telReg.test(tel)) {
        // 发起网路请求
        getCode({ tel })
            .then(r => {
                console.log(r.data);
                alert(r.data.data);
            })
    } else {
        alert('请输入正确的电话号码！')
    }
})

let register_password_input = document.querySelector('input[name="register_password"]');
let login_register_btn = document.querySelector('.login_register_btn');
let code_input = document.querySelector('input[name=code]');
// 点击注册按钮
(login_register_btn as HTMLDivElement).addEventListener('click', function () {
    let tel = (tel_input as HTMLInputElement).value;
    let code = (code_input as HTMLInputElement).value;
    let register_password = (register_password_input as HTMLInputElement).value;
    if (passwordReg.test(register_password) && telReg.test(tel) && (code != '')) {
        // 加密密码
        register_password = sha256(register_password);
        console.log(tel, register_password);

        // 发起网络请求
        register({
            tel,
            code,
            password: register_password
        })
            .then(r => {
                console.log(r);
                (login_code_main as HTMLDivElement).style.display = 'none';
                (login_password_main as HTMLDivElement).style.display = 'block';
            })
    } else {
        alert('密码必须是数字、字母、特殊符号混合,且大于6位！')
    }
})

// 登陆表单
let login_tel_input = document.querySelector('input[name=login_tel]');
let login_password_input = document.querySelector('input[name="login_password"]');
let login_password_btn = document.querySelector('.login_password_btn');
(login_password_btn as HTMLButtonElement).addEventListener('click', function () {
    let tel = (login_tel_input as HTMLInputElement).value;
    let password = (login_password_input as HTMLInputElement).value;
    if (!telReg.test(tel)) {
        alert('请输入正确的电话号码！')
    } else if (!passwordReg.test(password)) {
        alert('密码必须是数字、字母、特殊符号混合,且大于6位！')
    } else {
        // 加密密码
        password = sha256(password);
        console.log(tel, password);

        // 发起网路请求
        login({ tel, password })
            .then(r => {
                console.log(r);
                if (r.data.code == 1) {
                    setCookie('tel', tel);
                    setCookie('headurl', r.data.data[0].headurl)
                    alert("登陆成功");
                    (login_box as HTMLDivElement).style.display = 'none';
                    (loginbtn as HTMLButtonElement).style.display = 'none';
                    (headurl as HTMLImageElement).src = r.data.data[0].headurl;
                    (headurl as HTMLImageElement).style.display = 'block';
                }
            })
    }
    // return false;

});

// 点击头像，进入个人中心
(headurl as HTMLImageElement).addEventListener('click', function () {
    window.location.href = './personal.html';
})

//创作者中心跳转
let creatorCenterbtn = document.querySelector('.creatorCenterbtn');
(creatorCenterbtn as HTMLButtonElement).onclick = function () {
    window.location.href = '/creator.html'
}

//网页加载时获取文章

//存储标签
let map = new Map();
map.set(0, '综合');
map.set(1, '前端');
map.set(2, '后端');
map.set(3, 'Android');
map.set(4, 'iOS');
map.set(5, '代码人生');
let article = document.querySelector('.article');
//发起网络请求
homepageArticle({ offset: 0, tag: 0, order: 0 })
    .then(r => {
        console.log(r.data);
        let allArticle = r.data.data;
        let flag = document.createDocumentFragment();
        allArticle.forEach(item => {
            getLikeDiscuss({ reaid: item.aid })
                .then(r => {
                    let likecount = r.data.data.likecount;
                    let rediscount = r.data.data.rediscount;
                    let div = document.createElement('div');
                    if (item.coverurl) {
                        div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                    } else {
                        div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                    }
                    flag.append(div);
                    (article as HTMLDivElement).append(flag);
                });
        });
        let loadMoreDiv = document.createElement('div');
        loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
        (article as HTMLDivElement).append(loadMoreDiv);
        //触底加载
        let loadMore = document.querySelector('.loadMore');
        let isLoad = true;
        let offset = 0;
        function Bottomloading() {
            // loadMore这个div马上要出现在窗口内了，就去加载更多
            let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
            
            if (loadMoreY < -(window.innerHeight+200) && isLoad == true) {
                isLoad = false;
                offset += 20;
                homepageArticle({ offset, tag: 0, order: 0 })
                    .then(r => {
                        console.log(r.data.data);
                        let allArticle = r.data.data;
                        let flag = document.createDocumentFragment();
                        allArticle.forEach(item => {
                            let div = document.createElement('div');
                            if (item.coverurl) {
                                div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                            } else {
                                div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                            }
                            flag.append(div);
                        });
                        let loadMoreDiv = document.createElement('div');
                        loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                        flag.append(loadMoreDiv);
                        (article as HTMLDivElement).append(flag);
                    });
                isLoad = true;
            }
        }
        window.onscroll = Throttle(Bottomloading, 2000);

    });

//点击不同按钮切换文章
let recommendNewsButton = document.querySelector('.recommendNews');
let latestNewsButton = document.querySelector('.latestNews');
let comprehensiveButton = document.querySelector('.comprehensiveButton');
let rearEndButton = document.querySelector('.rearEndButton');
let frontEndButton = document.querySelector('.frontEndButton');
let AndroidButton = document.querySelector('.androidButton');
let IosButton = document.querySelector('.iosButton');
let codeLifeButton = document.querySelector('.codeLifeButton');

//点击推荐
(recommendNewsButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 0;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击最新
(latestNewsButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 0;
    let order = 1;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击综合
(comprehensiveButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 0;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击前端
(frontEndButton as HTMLElement).onclick = function () {
    console.log(111);

    let offset = 0;
    let tag = 1;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击后端
(rearEndButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 2;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击安卓
(AndroidButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 3;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击ios
(IosButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 4;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
};
//点击代码人生
(codeLifeButton as HTMLElement).onclick = function () {
    let offset = 0;
    let tag = 5;
    let order = 0;
    (article as HTMLElement).innerHTML = '';
    homepageArticle({ offset, tag, order })
        .then(r => {
            console.log(r.data);
            let allArticle = r.data.data;
            let flag = document.createDocumentFragment();
            allArticle.forEach(item => {
                getLikeDiscuss({ reaid: item.aid })
                    .then(r => {
                        let likecount = r.data.data.likecount;
                        let rediscount = r.data.data.rediscount;
                        let div = document.createElement('div');
                        if (item.coverurl) {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                    <div class="tag_name">${map.get(item.tag)}</div>
                                </div>
                            <div class="coverurlBox">
                                <img src="${item.coverurl}" class="coverurl">
                            </div>
                        </div>      
                        `
                        } else {
                            div.innerHTML = `
                        <div class="article_preview">
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                            <div class="author_interact">
                                <div class="author">${item.username}</div>
                                <div class="like_num">
                                    <span class="iconfont icon-good"></span>
                                    <span>${likecount}</span>
                                </div>
                                <div class="content_num">
                                    <span class="iconfont icon-pinglun"></span>
                                    <span>${rediscount}</span>
                                </div>
                                <div class="tag_name">${map.get(item.tag)}</div>
                            </div>
                        </div>    
                        `
                        }
                        flag.append(div);
                        (article as HTMLDivElement).append(flag);
                    });
                let loadMoreDiv = document.createElement('div');
                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                (article as HTMLDivElement).append(loadMoreDiv);
                //触底加载
                let loadMore = document.querySelector('.loadMore');
                let isLoad = true;
                let offset = 0;
                function Bottomloading() {
                    // loadMore这个div马上要出现在窗口内了，就去加载更多
                    let loadMoreY = (loadMore as HTMLElement).getBoundingClientRect().y;
                    if (loadMoreY < window.innerHeight + 200 && isLoad == true) {
                        isLoad = false;
                        offset += 20;
                        homepageArticle({ offset, tag: 0, order: 0 })
                            .then(r => {
                                console.log(r.data.data);
                                let allArticle = r.data.data;
                                let flag = document.createDocumentFragment();
                                allArticle.forEach(item => {
                                    let div = document.createElement('div');
                                    if (item.coverurl) {
                                        div.innerHTML = `
                                    <div class="article_preview">
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                        <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                        <div class="author_interact">
                                            <div class="author">${item.username}</div>
                                            <div class="like_num">
                                                <span class="iconfont icon-good"></span>
                                                <span>100</span>
                                            </div>
                                            <div class="content_num">
                                                <span class="iconfont icon-pinglun"></span>
                                                <span>23</span>
                                            </div>
                                            <div class="tag_name">${map.get(item.tag)}</div>
                                        </div>
                                    </div>      
                                    `
                                    } else {
                                        div.innerHTML = `
                                <div class="article_preview">
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                                    <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_content">${item.abstract}</a>
                                    <div class="author_interact">
                                        <div class="author">${item.username}</div>
                                        <div class="like_num">
                                            <span class="iconfont icon-good"></span>
                                            <span>100</span>
                                        </div>
                                        <div class="content_num">
                                            <span class="iconfont icon-pinglun"></span>
                                            <span>23</span>
                                        </div>
                                         <div class="tag_name">${map.get(item.tag)}</div>
                                    </div>
                                </div>    
                                `
                                    }
                                    flag.append(div);
                                });
                                let loadMoreDiv = document.createElement('div');
                                loadMoreDiv.innerHTML = `<div class="loadMore"></div>`;
                                flag.append(loadMoreDiv);
                                (article as HTMLDivElement).append(flag);
                            });
                        isLoad = true;
                    }
                }
                window.onscroll = Throttle(Bottomloading, 5000);
            });

        });
}