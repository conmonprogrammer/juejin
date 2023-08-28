import instance from "./http";
import {deleteSUData,  testData, codeData, registerrData, loginData,setPersonalDetailData,homepageArticleData } from "./type";
// 测试
export const test = (data: testData) => instance({ method: 'get', url: '/', params: data });

// 获取验证码
export const getCode = (data: codeData) => instance({ method: 'post', url: '/code', data });

// 注册
export const register = (data: registerrData) => instance({ method: 'post', url: '/register', data });

// 登陆
export const login = (data: loginData) => instance({ method: 'post', url: '/login', data });

// 个人主页
export const personal = () => instance({ method: 'get', url: '/personal' });

// 获取收藏文章
export const collect = () => instance({ method: 'get', url: '/collect' });

// 获取标签
export const careLabel = () => instance({ method: 'get', url: '/careLabel' });

// 获取文章
export const trends = () => instance({ method: 'get', url: '/trends' });

// 获取关注用户
export const careUser = () => instance({ method: 'get', url: '/careUser' });

//获取被关注用户
export const bycare = () => instance({ method: 'get', url: '/bycare' });

// 关注/取消关注标签
export const setLabel = (data) => instance({ method: 'post', url: '/setLabel', data });

// 关注/取消关注用户
export const setUser = (data) => instance({ method: 'post', url: '/setUser', data });

// 获取点赞文章
export const seeLike = () => instance({ method: 'get', url: '/seeLike' });

// 获取个人资料
export const getPersonalDetail = () => instance({ method: 'get', url: '/getPersonalDetail' });


// 修改个人资料
export const setPersonalDetail = (data:setPersonalDetailData) => instance({ method: 'post', url: '/setPersonalDetail',data });

// 修个个人头像
export const setPersonalHead = (data:FormData) => instance({ method: 'post', url: '/setPersonalHead',data });

// 展示屏蔽人员列表
export const getShieldUser = () => instance({ method: 'get', url: '/getShieldUser' });


// 展示屏蔽人员列表
export const deleteSU = (data) => instance({ method: 'post', url: '/deleteSU',data });

// 展示关注标签
// export const careLabel = () => instance({ method: 'get', url: '/careLabel' });

// 展示全部标签
export const getAllLabel = () => instance({ method: 'get', url: '/getAllLabel' });

//创作者中心
export const creatorCenter = () => instance({ method: 'get', url: '/getArtCreate' });

//发布文章
export const publishArticle = (data: FormData) => instance({ method: 'post', url: '/publishArt', data });

// 获取文章详情
export const getArticleDetail = (data)=>instance({method:'post',url:'/getArticleDetail',data});

// 获取评论点赞数以及是否点赞
export const getDisCount = (data)=>instance({method:'post',url:'/getDisCount',data});

// 获取相关文章点赞、评论数
export const getLikeDiscuss  = (data)=>instance({method:'post',url:'/getLikeDiscuss ',data});

// 点赞、取消点赞
export const setArtLike  = (data)=>instance({method:'post',url:'/setArtLike ',data});

// 收藏、取消收藏
export const setArtCol  = (data)=>instance({method:'post',url:'/setArtCol ',data});

//请求首页文章
export const homepageArticle = (data: homepageArticleData) => instance({ method: 'post', url: '/getArtArray', data });

// 关注、取消关注作者
export const setCareUser = (data) => instance({ method: 'post', url: '/setCareUser', data });

// 发布回复评论
export const publishDiscuss = (data) => instance({ method: 'post', url: '/publishDiscuss', data });

// 屏蔽/取消屏蔽用户
export const shieldUser = (data) => instance({ method: 'post', url: '/shieldUser', data });

// 举报评论
export const informDis = (data) => instance({ method: 'post', url: '/informDis', data });

// 举报文章
export const informArt = (data) => instance({ method: 'post', url: '/informArt', data });

// 点赞取消点赞评论
export const setColLike = (data) => instance({ method: 'post', url: '/setColLike', data });

// 私信
export const sendtalk = (data) => instance({ method: 'post', url: '/sendtalk', data });
export const prasetoken = (data) => instance({ method: 'post', url: '/prasetoken', data });


// 查看一级评论
export const seeFirDis = (data) => instance({ method: 'post', url: '/setColLike', data });



