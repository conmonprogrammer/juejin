import { getPersonalDetail, setPersonalDetail, setPersonalHead, getShieldUser, careLabel, getAllLabel, deleteSU, setLabel } from '../api/api';
import { getCookie, setCookie, smallAlert } from '../api/cookie';

let personal_data_info = document.querySelector('.personal_data_info');
let shield_user = document.querySelector('.shield_user')
let shield_list = document.querySelector('.shield_list');
let nav_item = document.querySelector('.nav_item');
let user_name = document.querySelector('.user_name');
let user_tel = document.querySelector('.user_tel');
let user_job = document.querySelector('.user_job');
let user_company = document.querySelector('.user_company');
let user_introduction = document.querySelector('.user_introduction');
let user_info_btn = document.querySelector('.user_info_btn');
let user_headimg = document.querySelector('#user_headimg');
let headurl = document.querySelector('.headurl');
let loginbtn = document.querySelector('.loginbtn');
let xiaotanchuang = document.querySelector('.xiaotanchuang');
//标签管理里面的两个选项
let select_care_tags = document.querySelector('.select_care_tags');
let select_all_tags = document.querySelector('.select_all_tags');
// 标签里面两个展示列表
let list_care_nav_hidden = document.querySelector('.list_care_nav_hidden');
let list_all_nav_hidden = document.querySelector('.list_all_nav_hidden');
// 点击头像，进入个人中心
(headurl as HTMLImageElement).addEventListener('click', function () {
    window.location.href = './personal.html';
})

// 页面一加载就获取个人资料信息  然后进行显示
getPersonalDetail()
    .then(r => {
        console.log(r);
        (user_name as HTMLInputElement).placeholder = r.data.data[0].username;
        (user_tel as HTMLInputElement).placeholder = r.data.data[0].tel;
        (user_job as HTMLInputElement).placeholder = r.data.data[0].job || '填写你的职位';
        (user_company as HTMLInputElement).placeholder = r.data.data[0].company || '填写你的公司';
        (user_introduction as HTMLInputElement).placeholder = r.data.data[0].introduction || '填写职业技能、擅长的事情、喜欢的事情等';
        (user_name as HTMLInputElement).value = r.data.data[0].username;
        (user_job as HTMLInputElement).value = r.data.data[0].job || '填写你的职位';
        (user_company as HTMLInputElement).value = r.data.data[0].company || '填写你的公司';
        (user_introduction as HTMLInputElement).value = r.data.data[0].introduction || '填写职业技能、擅长的事情、喜欢的事情等';
        if (getCookie('headurl')) {
            (headurl as HTMLImageElement).src = getCookie('headurl') as string;
            (loginbtn as HTMLButtonElement).style.display = 'none';
            (headurl as HTMLImageElement).style.display = 'block';
        }
        (nav_item as HTMLDivElement).style.display = 'none';
        (shield_user as HTMLDivElement).style.display = 'none';
    });

// 点击 保存修改 按钮实现功能
(user_info_btn as HTMLButtonElement).addEventListener('click', function () {
    // 获取数据
    let name = (user_name as HTMLInputElement).value;
    let job = (user_job as HTMLInputElement).value;
    let company = (user_company as HTMLInputElement).value;
    let introduction = (user_introduction as HTMLInputElement).value;
    // 发起网络请求
    setPersonalDetail({
        username: name,
        job,
        company,
        introduction
    })
        .then(r => {
            let result;
            if (r.data.code == 1) {
                result = '修改成功'
            } else {
                result = r.data.data;
            }
            (xiaotanchuang as HTMLDivElement).innerHTML = result;
            (xiaotanchuang as HTMLDivElement).style.display = 'block'
            smallAlert(xiaotanchuang, 3000);
        })
});

let myheadimg = document.querySelector('.myheadimg');
// 修改头像
(user_headimg as HTMLInputElement).addEventListener('change', function () {
    let newHeadImg = (this as HTMLInputElement).files;
    console.log(newHeadImg);
    // 发起网络请求
    let formdata = new FormData();
    if (newHeadImg) {
        formdata.append('headurl', newHeadImg[0]);
        setPersonalHead(formdata)
            .then(r => {
                let result;
                result = r.data.data;
                if (r.data.code == 1) {
                    setCookie('headurl', r.data.data[0].headurl);
                    console.log(r.data.data[0].headurl);
                    (headurl as HTMLImageElement).src = r.data.data[0].headurl;
                    result = '修改成功'
                }
                (xiaotanchuang as HTMLDivElement).innerHTML = result;
                (xiaotanchuang as HTMLDivElement).style.display = 'block'
                smallAlert(xiaotanchuang, 3000);
            })
    }
})

let return_index_a = document.querySelector('.return_index_a');
// 点击“返回个人主页”功能实现
(return_index_a as HTMLElement).addEventListener('click', function () {
    window.location.href = './index.html';
})

let user_data = document.querySelector('.user_data');
// 点击 屏蔽管理 切换右边显示
(user_data as HTMLDivElement).addEventListener('click', function () {
    (personal_data_info as HTMLDivElement).style.display = 'block';
    (shield_user as HTMLDivElement).style.display = 'none';
    (nav_item as HTMLDivElement).style.display = 'none';
    // 发起网络请求
});

let show_pingbi = document.querySelector('.show_pingbi');
// 点击 屏蔽管理 切换右边显示
(show_pingbi as HTMLDivElement).addEventListener('click', async function () {
    (personal_data_info as HTMLDivElement).style.display = 'none';
    (shield_user as HTMLDivElement).style.display = 'block';
    (nav_item as HTMLDivElement).style.display = 'none';
    // 发起网络请求  展示屏蔽作者列表
    await getShieldUser()
        .then(r => {
            if (r.data.code != 1) {
                console.log(r.data.data);
                return false;
            }
            (shield_list as HTMLDivElement).innerHTML = '';
            let shieldUsers = r.data.data;
            console.log(shieldUsers);

            let flag = document.createDocumentFragment();
            shieldUsers.forEach(item => {
                let div = document.createElement('div');
                div.classList.add('list_item');
                let time = (item.shieldTime).split("T")[0];
                div.innerHTML = `
                <img src="${item.headurl}"
                class="shield_user_headimg">
                <div class="shield_user_data">
                    <div class="shield_user_name">${item.username}</div>
                    <div class="shield_time">屏蔽时间:${time}</div>
                </div>
                <button type="button" class="shield_state haveshield" data-shieldid="${item.shieldId}">取消屏蔽</button>
                <button type="button" class="shield_state shieldTag noshield" data-uid="${item.uid}"  data-shieldid="${item.shieldId}">屏蔽</button>
            `;
                flag.append(div);
            });
            (shield_list as HTMLDivElement).append(flag);
            // 取消屏蔽用户
            let list_item = document.querySelector('.list_item');
            (shield_user as HTMLDivElement).addEventListener('click', function (e) {
                let ev = e || event;
                if ((ev.target as HTMLButtonElement).classList.contains('shield_state')) {
                    console.log(11111);

                    let haveshield = (((ev.target as HTMLButtonElement).parentElement) as HTMLButtonElement).children[2];
                    let noshield = (((ev.target as HTMLButtonElement).parentElement) as HTMLButtonElement).children[3];
                    deleteSU({ shieldId: (ev.target as HTMLButtonElement).dataset.shieldid, byShieldId: (ev.target as HTMLButtonElement).dataset.uid })
                        .then(r => {
                            if (r.data.code == 1) {
                                (haveshield as HTMLButtonElement).classList.toggle('shieldTag');
                                (noshield as HTMLButtonElement).classList.toggle('shieldTag');


                            }
                        });

                }
            })
        });




});



let show_tags = document.querySelector('.show_tags');
let list_care_nav = document.querySelector('.list_care_nav');
// 点击 标签管理 切换右边显示
(show_tags as HTMLDivElement).addEventListener('click', async function () {
    (personal_data_info as HTMLDivElement).style.display = 'none';
    (shield_user as HTMLDivElement).style.display = 'none';
    (nav_item as HTMLDivElement).style.display = 'block';
    (list_all_nav_hidden as HTMLDivElement).style.display = 'none';
    // 发起网络请求  展示关注标签列表
    await careLabel()
        .then(r => {
            if (r.data.code != 1) {
                console.log(r.data.data);
                return false;
            }
            (list_care_nav as HTMLDivElement).innerHTML = '';
            let care_navs = r.data.data;
            let flag = document.createDocumentFragment();
            care_navs.forEach(item => {
                console.log(item);
                let div = document.createElement('div');
                div.classList.add('list_nav');
                div.innerHTML = `
            <div class="care_nav_data">
                <div class="care_nav_name">${item.labelname}</div>
            </div>
            <button type="button" class="care_state_y" data-lid="${item.lid}">已关注</button>
            
            `;
                flag.append(div);

            });
            (list_care_nav as HTMLDivElement).append(flag);
            // 关注/取消关注 按钮
            let care_state_y = document.querySelectorAll('.care_state_y');
            // let care_state_n = document.querySelectorAll('.care_state_n');
            care_state_y.forEach(item => {
                (item as HTMLButtonElement).addEventListener('click', function () {

                    let lid = (item as HTMLButtonElement).dataset.lid;
                    // 发起网络请求 数据库删除 数据
                    setLabel({
                        lid
                    })
                        .then(r => {
                            console.log(r);
                            if (r.data.code == 1) {
                                alert(r.data.data);
                                if (item.innerHTML == '已关注') {
                                    (item as HTMLButtonElement).style.border = '1px solid #37c700';
                                    (item as HTMLButtonElement).style.color = '#37c700';
                                    (item as HTMLButtonElement).style.backgroundColor = 'white';
                                    (item as HTMLButtonElement).innerHTML = '关注';
                                } else {
                                    (item as HTMLButtonElement).style.border = 'none';
                                    (item as HTMLButtonElement).style.color = 'white';
                                    (item as HTMLButtonElement).style.backgroundColor = '#37c700';
                                    (item as HTMLButtonElement).innerHTML = '已关注';
                                }
                            } else {
                                alert(r.data.data);
                            }

                        })

                })
            });
        })

});

// 标签管理里面的两个点击切换列表功能
(select_care_tags as HTMLSpanElement).addEventListener('click', function () {
    (list_care_nav_hidden as HTMLDivElement).style.display = 'block';
    (list_all_nav_hidden as HTMLDivElement).style.display = 'none';
    // 发起网络请求  展示关注标签列表
    careLabel()
        .then(r => {
            if (r.data.code != 1) {
                console.log(r.data.data);
                return false;
            }
            (list_care_nav as HTMLDivElement).innerHTML = '';
            let care_navs = r.data.data;
            let flag = document.createDocumentFragment();
            care_navs.forEach(item => {
                console.log(item);
                let div = document.createElement('div');
                div.classList.add('list_nav');
                div.innerHTML = `
            <div class="care_nav_data">
                <div class="care_nav_name">${item.labelname}</div>
            </div>
            <button type="button" class="care_state_y" data-lid="${item.lid}">已关注</button>
            `;
                flag.append(div);
            });
            (list_care_nav as HTMLDivElement).append(flag);
            // 关注/取消关注 按钮
            let care_state_y = document.querySelectorAll('.care_state_y');
            // let care_state_n = document.querySelectorAll('.care_state_n');
            care_state_y.forEach(item => {
                (item as HTMLButtonElement).addEventListener('click', function () {

                    let lid = (item as HTMLButtonElement).dataset.lid;
                    // 发起网络请求 数据库删除 数据
                    setLabel({
                        lid
                    })
                        .then(r => {
                            console.log(r);
                            if (r.data.code == 1) {
                                alert(r.data.data);
                                if (item.innerHTML == '已关注') {
                                    (item as HTMLButtonElement).style.border = '1px solid #37c700';
                                    (item as HTMLButtonElement).style.color = '#37c700';
                                    (item as HTMLButtonElement).style.backgroundColor = 'white';
                                    (item as HTMLButtonElement).innerHTML = '关注';
                                } else {
                                    (item as HTMLButtonElement).style.border = 'none';
                                    (item as HTMLButtonElement).style.color = 'white';
                                    (item as HTMLButtonElement).style.backgroundColor = '#37c700';
                                    (item as HTMLButtonElement).innerHTML = '已关注';
                                }
                            } else {
                                alert(r.data.data);
                            }

                        })

                })
            });
        })
});
let list_all_nav = document.querySelector('.list_all_nav');
// 展示全部标签列表
(select_all_tags as HTMLSpanElement).addEventListener('click', function () {
    (list_care_nav_hidden as HTMLDivElement).style.display = 'none';
    (list_all_nav_hidden as HTMLDivElement).style.display = 'block';
    // 发起网络请求  展示全部标签列表
    getAllLabel()
        .then(r => {
            if (r.data.code != 1) {
                console.log(r.data.data);
                return false;
            }
            (list_all_nav as HTMLDivElement).innerHTML = '';
            let care_navs = r.data.data;
            let flag = document.createDocumentFragment();
            care_navs.forEach(item => {
                console.log(item);
                let div = document.createElement('div');
                div.classList.add('list_nav');
                div.innerHTML = `
            <div class="nav_data">
                <div class="nav_name">${item.labelname}</div>
            </div>
            <button type="button" class="care_state_y" data-lid="${item.lid}">关注</button>
           
            `;
                flag.append(div);
            });
            (list_all_nav as HTMLDivElement).append(flag);
            // 关注/取消关注 按钮
            let care_state_y = document.querySelectorAll('.care_state_y');
            // let care_state_n = document.querySelectorAll('.care_state_n');
            care_state_y.forEach(item => {
                (item as HTMLButtonElement).addEventListener('click', function () {

                    let lid = (item as HTMLButtonElement).dataset.lid;
                    // 发起网络请求 数据库删除 数据
                    setLabel({
                        lid
                    })
                        .then(r => {
                            console.log(r);
                            if (r.data.code == 1) {
                                alert(r.data.data);
                                if (item.innerHTML == '已关注') {
                                    (item as HTMLButtonElement).style.border = '1px solid #37c700';
                                    (item as HTMLButtonElement).style.color = '#37c700';
                                    (item as HTMLButtonElement).style.backgroundColor = 'white';
                                    (item as HTMLButtonElement).innerHTML = '关注';
                                } else if (item.innerHTML == '关注') {
                                    (item as HTMLButtonElement).style.border = 'none';
                                    (item as HTMLButtonElement).style.color = 'white';
                                    (item as HTMLButtonElement).style.backgroundColor = '#37c700';
                                    (item as HTMLButtonElement).innerHTML = '已关注';
                                }
                            } else {
                                alert(r.data.data);
                            }

                        })

                })
            });

        })
})




