'use strict';
// 全局ip
let overallUrl = 'http://127.0.0.1:7001'
const { Controller } = require('egg');

class UserController extends Controller {

    // 登录
    async login() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        const resultsTel = await this.app.mysql.select('user', {
            where: { tel: clientData.tel }
        });
        if (resultsTel.length != 0) {
            const results = await this.app.mysql.select('user', {
                where: { tel: clientData.tel, password: clientData.password },
                columns: ['headurl']
            });
            if (results.length != 0) {
                ctx.session.uid = resultsTel[0].uid;
                console.log(ctx.session);
                ctx.body = {
                    code: 1,
                    data: results
                }
            } else {
                ctx.body = {
                    code: -1,
                    data: '登陆失败,密码错误'
                }
            }
        } else {
            ctx.body = {
                code: -1,
                data: '登陆失败,账号不存在'
            }
        }

    }

    // 注册
    async register() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (clientData.code == ctx.session.code) {
            const results = await this.app.mysql.insert('user', {
                tel: clientData.tel, password: clientData.password
            });
            ctx.body = {
                code: 1,
                data: '注册成功'
            }
        } else {
            ctx.body = {
                code: -1,
                data: '注册失败，验证码错误'
            }
        }
    }


    // 验证码登录
    async code() {
        const { ctx } = this;
        let clientData = ctx.request.body
        const resultsTel = await this.app.mysql.select('user', {
            where: { tel: clientData.tel }
        })
        if (resultsTel.length != 0) {
            ctx.body = {
                code: -1,
                data: '获取失败，账号已存在'
            }
            return false;
        }
        try {
            let code = Math.round(Math.random() * 1000000).toString().padStart(6, 0);
            ctx.session = { code };
            ctx.body = {
                code: 1,
                data: code
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            }
        }

    }

    // 个人信息
    async personal() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.select('user', {
                where: { uid: ctx.session.uid },
                columns: ['username', 'headurl', 'introduction', 'job', 'addtime'], // 要查询的表字段
            });
            const carecount = await this.app.mysql.count('care', { uid: ctx.session.uid });
            const bycarecount = await this.app.mysql.count('care', { authorId: ctx.session.uid });
            results[0].carecount = carecount;
            results[0].bycarecount = bycarecount;
            ctx.body = {
                code: 1,
                data: results
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }

    }

    // 查看关注着
    async careUser() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT u.headurl,u.username,u.introduction,u.job,u.uid FROM care,user as u WHERE care.uid = ${ctx.session.uid} AND care.authorId = u.uid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                };
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }


    }

    // 查看被关注者
    async bycare() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT u.headurl,u.username,u.job,u.uid FROM care,user as u WHERE care.authorId = ${ctx.session.uid} AND care.uid = u.uid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                };
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }

    // 查看动态
    async trends() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT title,tag,publish_time,aid FROM article WHERE uid=${ctx.session.uid}`
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                };
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }

    // 查看收藏
    async collect() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT a.title,u.username,a.publish_time,a.aid FROM collect as c,article as a,user as u WHERE c.uid = ${ctx.session.uid} AND c.aid = a.aid AND c.uid = u.uid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                };
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }

    // 查看关注标签
    async careLabel() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT l.labelname,l.lid FROM ucarel as u,label as l WHERE u.uid = ${ctx.session.uid} AND u.lid = l.lid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                }
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }

    }

    // 查看点赞文章
    async seeLike() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const results = await this.app.mysql.query(
                `SELECT article.title,article.abstract,article.publish_time,article.tag,article.coverurl FROM arlike,article,user WHERE arlike.uid = ${ctx.session.uid} AND article.aid = arlike.aid AND  article.uid = user.uid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: -2,
                    data: '无'
                };
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                }
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }
}

module.exports = UserController;