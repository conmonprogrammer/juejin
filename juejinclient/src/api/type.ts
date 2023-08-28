export interface testData{
    id:string
}
// 验证码
export interface codeData{
    tel:string
}
// 注册
export interface registerrData{
    tel:string,
    code:string,
    password:string
}
// 登陆
export interface loginData{
    tel:string,
    password:string
}


// 修改个人信息
export interface setPersonalDetailData{
    username:string,
    job:string,
    company:string,
    introduction:string,
}

// 取消屏蔽用户
export interface deleteSUData{
    shieldId:string
}
//首页文章
export interface homepageArticleData{
    offset : number,
    tag : number,
    order : number
}

//节流
export function Throttle(fn, timeout) {
    let tid:any = null;
    return function () {
        if (tid) return false;
        let ev = event;
        tid = setTimeout(() => {
            fn.call(this,ev);
            tid = null;
        }, timeout);
    }
};
