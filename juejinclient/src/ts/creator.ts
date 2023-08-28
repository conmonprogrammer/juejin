import { getCookie,getTime } from '../api/cookie'
import { creatorCenter } from "../api/api";

// 全局IP
let overall = getCookie('overall');

//登录状态验证
if (!getCookie('tel')) {//登录已失效
    window.location.href = './index.html'
}

let writeButton = document.querySelector('.write-button');
let toplistUserImg = document.querySelector('.toplist-userimg');
let userImgUrl = document.querySelector('.userImgUrl');
let userNameBox = document.querySelector('.userNameBox');
let fansCountData = document.querySelector('.fansCountData');
let articleCountData = document.querySelector('.articleCountData');
let likeCountData = document.querySelector('.likeCountData');
let discussCountData = document.querySelector('.discussCountData');
let collectCountData = document.querySelector('.collectCountData');
let recentlyReleasedBox = document.querySelector('.recentlyReleasedBox');

//点击写文章跳转
(writeButton as HTMLButtonElement).onclick = function () {
    window.open('/article.html');
}

//网页加载
creatorCenter()
    .then(r => {
        if (r.data.code != 1) {
            alert(r.data.data)
            window.location.href = './index.html';
        }
        console.log(r.data);
        //加载头部导航栏用户头像
        (toplistUserImg as HTMLImageElement).src = r.data.data.headurl;
        
        //加载个人信息栏
        (userImgUrl as HTMLImageElement).src = r.data.data.headurl;
        (userNameBox as HTMLElement).innerHTML = r.data.data.username;
        (fansCountData as HTMLDivElement).innerHTML = `<span>${r.data.data.fanCount} 粉丝</span>`;

        //加载数据概览
        (articleCountData as HTMLDivElement).innerHTML = r.data.data.artCount;
        (likeCountData as HTMLDivElement).innerHTML = r.data.data.likeCount;
        (discussCountData as HTMLDivElement).innerHTML = r.data.data.discussCount;
        (collectCountData as HTMLDivElement).innerHTML = r.data.data.collectCount;

        //加载近期发布
        let allArticle = r.data.data.articles;
        let flag = document.createDocumentFragment();
        allArticle.forEach(item => {
            let div = document.createElement('div');
            div.innerHTML = `
            <div class="article_preview">
            <a href="${overall}/articleDetail.html?aid=${item.aid}" class="article_title">${item.title}</a>
                <div class="abstract_content">
                    <span>${item.abstract}</span>
                </div>
                <div class="author_interact">
                    <span class="publish_time">${getTime(item.publish_time)}</span>
                </div>
            </div>
            `
            flag.append(div);
        });
        (recentlyReleasedBox as HTMLDivElement).append(flag);
    })
