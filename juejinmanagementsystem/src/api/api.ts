import instance from "./http";

import { testData,adminLoginData,articleAuditData,discussAuditData} from "./type";
// 测试
export const test = (data: testData) => instance({ method: 'get', url: '/', params: data });

//管理员登录
export const adminLogin = (data: adminLoginData) => instance({ method: 'post', url: '/adminLogin', data });

//未审核文章展示接口
export const getarticleNotAudit = () => instance({ method: 'get', url: '/getarticleNotAudit'});

//审核文章接口
export const articleAudit = (data:articleAuditData) => instance({ method: 'post', url: '/articleAudit',data});


//未审核评论接口
export const getCommentNotAudit = () => instance({ method: 'get', url: '/getCommentNotAudit'});

// 审核评论接口
export const discussAudit = (data:discussAuditData) => instance({ method: 'post', url: '/discussAudit',data});

// 获取文章详情
export const getArticleDetail = (data)=>instance({method:'post',url:'/getArticleDetail',data});

