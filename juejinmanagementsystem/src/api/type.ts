export interface testData{
    id:string
}
// 管理员登录
export interface adminLoginData{
    tel:string,
    password:string
}

// 审核文章
export interface articleAuditData{
    aid:string
}

// 审核评论  
export interface discussAuditData{
    discussId:string
}