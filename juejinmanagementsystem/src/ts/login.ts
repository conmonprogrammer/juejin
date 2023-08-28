import { adminLogin } from '../api/api';
import { setCookie, getCookie } from '../api/cookie';

let telInput = document.querySelector('input[name="admin_tel"]');
let passwordInput = document.querySelector('input[name="password"]');
let login_btn = document.querySelector('.login_btn');
(login_btn as HTMLButtonElement).addEventListener('click', function () {
    let tel = (telInput as HTMLInputElement).value;
    let password = (passwordInput as HTMLInputElement).value;
    // 发起网络请求
    adminLogin({
        tel,
        password
    })
        .then(r => {
            if (r.data.code == 1) {
                console.log(r);
                setCookie('managetel', r.data.data[0].tel);
                console.log(getCookie('managetel'));
                alert("登陆成功");
                window.location.href = './index.html';
            }else{
                alert(r.data.data)
            }
        })
});


