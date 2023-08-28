import { getarticleNotAudit, articleAudit, getCommentNotAudit, discussAudit } from '../api/api';
import { getCookie } from '../api/cookie';

let article = document.querySelector('.article');
let comments = document.querySelector('.comments');
let article_Audit = document.querySelector('.article_Audit');
let comments_Audit = document.querySelector('.comments_Audit');
let article_tbody = document.querySelector('.article_tbody');
if (!getCookie('managetel')) {
    alert('登陆失效');
    window.location.href = './login.html'
}
// 页面加载时 默认界面为 审核文章
(article_Audit as HTMLTableElement).style.display = 'block';
(comments_Audit as HTMLTableElement).style.display = 'none';
// 页面一加载就发起网络请求，展示未审核文章列表
getarticleNotAudit()
    .then(r => {
        (article_tbody as HTMLTableElement).innerHTML = '';
        console.log(r.data.data);
        let admin_id = r.data.admin_id;
        let items = r.data.data;
        let flag = document.createDocumentFragment();
        items.forEach(item => {
            let tr = document.createElement('tr');
            item.publish_time = item.publish_time.split('T')[0];
            tr.innerHTML = `
        <td>${item.aid}</td>
        <td>${item.title}</td>
        <td class="publish_time">${item.publish_time}</td>
        <td class="coverurl"><img src="${item.coverurl}"></td>
        <td class="audit_state">                            
            <span>未通过</span>
        </td>
        <td>
            <button class="article_preview" type="button" data-aid=${item.aid}>查看文章</button>
        </td>
        <td>${admin_id}</td>
        `;
            flag.append(tr);
        });
        (article_tbody as HTMLTableElement).append(flag);
        // 给每一个 审核状态 按钮添加点击事件 foreach
        let article_preview = document.querySelectorAll('.article_preview');
        article_preview.forEach(item => {
            let ev_tr;
            (item as HTMLButtonElement).addEventListener('click', function (e) {
                let ev = e || event;
                console.log(ev.target);
                // if (ev.target) {
                //     console.log(((ev.target as HTMLElement).parentNode as HTMLElement).parentElement);
                //     ev_tr = ((ev.target as HTMLElement).parentNode as HTMLElement).parentElement;
                // }
                // 携带文章aid跳转页面
                window.location.href = `./articlePreview.html?aid=${(item as HTMLButtonElement).dataset.aid}`;

            })
        })
    });
// 点击左侧，切换右侧
let comments_tbody = document.querySelector('.comments_tbody');
(comments as HTMLDivElement).addEventListener('click', async function () {
    (article_Audit as HTMLTableElement).style.display = 'none';
    (comments_Audit as HTMLTableElement).style.display = 'block';

    await getCommentNotAudit()
        .then(r => {
            (comments_tbody as HTMLTableElement).innerHTML = '';
            console.log(r.data.data);
            let admin_id = r.data.admin_id;
            let items = r.data.data;
            let flag = document.createDocumentFragment();
            items.forEach(item => {
                let tr = document.createElement('tr');
                item.disTime = item.disTime.split('T')[0];
                tr.innerHTML = `
                <td>${item.discussId}</td>
                <td>${item.title}</td>
                <td class="content">${item.content}</td>
                <td>${item.disTime}</td>
                <td>
                    <button class="audit_state_del" type="button" data-discussid="${item.discussId}">删除</button>

                </td>
                <td>${admin_id}</td>
                `;
                flag.append(tr);
            });
            (comments_tbody as HTMLTableElement).append(flag);
            // 给每一个 审核状态 按钮添加点击事件 foreach
            let audit_state_del = document.querySelectorAll('.audit_state_del');
            audit_state_del.forEach(item => {
                let ev_tr;
                (item as HTMLButtonElement).addEventListener('click', function (e) {
                    let ev = e || event;
                    console.log(ev.target);
                    if (ev.target) {
                        console.log(((ev.target as HTMLElement).parentNode as HTMLElement).parentElement);
                        ev_tr = ((ev.target as HTMLElement).parentNode as HTMLElement).parentElement;
                    }

                    // 发起网络请求
                    discussAudit({ discussId: ((item as HTMLButtonElement).dataset.discussid as string) })
                        .then(r => {
                            console.log(r.data.data);
                            // 审核成功就在页面中删除当前数据
                            if (r.data.code == 1) {
                                ev_tr.parentNode.removeChild(ev_tr);
                            }
                        })


                })
            })
        });
});
(article as HTMLDivElement).addEventListener('click', function () {
    (article_Audit as HTMLTableElement).style.display = 'block';
    (comments_Audit as HTMLTableElement).style.display = 'none';
})