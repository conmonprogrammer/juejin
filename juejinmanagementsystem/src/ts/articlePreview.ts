import { getTime } from "../api/cookie";
import { getArticleDetail, articleAudit } from '../api/api';
let ArtUsername = document.querySelector('.authorTime .username');
let ArtTitle = document.querySelector('.title');
let ArtPublishTime = document.querySelector('.authorTime .publishTime');
let ArtContent = document.querySelector('.articleDetail .content');
let ArtTag = document.querySelector('.tags .tag');
let aid = window.location.href.split(/[?#]/)[1].split('=')[1];
let submit_result = document.querySelector('.submit_result');
let authorId;
getArticleDetail({ aid }).then(r => {
    console.log(r);
    authorId = r.data.data.authorId;
    (ArtTitle as HTMLSpanElement).innerHTML = `<strong>${r.data.data.title}</strong>`;
    (ArtUsername as HTMLSpanElement).innerHTML = r.data.data.username;
    (ArtContent as HTMLSpanElement).innerHTML = r.data.data.content;
    (ArtPublishTime as HTMLSpanElement).innerHTML = getTime(r.data.data.publish_time);
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
});
(submit_result as HTMLButtonElement).addEventListener('click', function () {
    // 发起网络请求
    let aid = window.location.href.split(/[?#]/)[1].split('=')[1];
    articleAudit({ aid: aid })
        .then(r => {
            console.log(r.data.data);
            (submit_result as HTMLButtonElement).style.backgroundColor = 'white';
            (submit_result as HTMLButtonElement).style.color = '#1e80ff';
            (submit_result as HTMLButtonElement).style.border = '1px solid #1e80ff';


            (submit_result as HTMLButtonElement).innerHTML = '已通过';

            // // 审核成功就在页面中删除当前数据
            // if (r.data.code == 1) {
            //     ev_tr.parentNode.removeChild(ev_tr);
            // }
        })
})
let to_index =document.querySelector('.to_index');
(to_index as HTMLDivElement).addEventListener('click',function(){
    window.location.href = './index.html';
})