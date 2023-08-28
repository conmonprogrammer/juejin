'use strict';

const {
    Controller
} = require('egg');

class AdminController extends Controller {

    // 登陆
    async adminLogin() {
        let {
            ctx
        } = this;
        // 获取客户端传过来的数据
        let clientData = ctx.request.body;
        console.log('clientData', clientData);
        // 操作数据库
        const results = await this.app.mysql.select('admin', {
            where: {
                tel: clientData.tel,
                password: clientData.password
            }
        });
        console.log(results);
        if (results.length != 0) {
            ctx.session.admin_id=results[0].admin_id
            console.log(ctx.session);
            ctx.body = {
                code: 1,
                data: results
            };
        } else {
            ctx.body = {
                code: -1,
                data: '登陆失败，手机号或者密码错误!'
            };
        }

    }
    // 获取未审核文章
    async getarticleNotAudit() {
        let {
            ctx
        } = this;
        console.log('ctx.session.admin_id', ctx.session.admin_id);
        if (ctx.session.admin_id) {
            // 操作数据库
            const results = await this.app.mysql.select('article', {
                where: {
                    state: 2
                },
                columns: ['aid', 'title', 'content', 'publish_time','coverurl']
                // select aid,title,content,publish_time from article where state = 0;
            });
            console.log(results);
            if (results.length != 0) {
                ctx.body = {
                    code: 1,
                    data: results,
                    admin_id: ctx.session.admin_id
                };
            } else {
                ctx.body = {
                    code: -1,
                    data: '修改失败'
                };
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
    }
    // 审核文章接口
    async articleAudit() {
        let {
            ctx
        } = this;
        let clientData = ctx.request.body;
        console.log('ctx.session.admin_id', ctx.session.admin_id);
        if (ctx.session.admin_id) {
            // 操作数据库
            const row = {
                state: 1
            };

            const options = {
                where: {
                    aid: clientData.aid
                }
            };
            const result = await this.app.mysql.update('article', row, options);
            // update article set state = 1 where aid = clientData.aid;
            // console.log(results);
            if (result.length != 0) {
                ctx.body = {
                    code: 1,
                    data: '审核成功',
                };
            } else {
                ctx.body = {
                    code: -1,
                    data: '审核失败'
                };
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
    }
    // 获取未审核评论
    async getCommentNotAudit() {
        let {
            ctx
        } = this;
        console.log('ctx.session.admin_id', ctx.session.admin_id);
        if (ctx.session.admin_id) {
            // 操作数据库
            const results = await this.app.mysql.query(
                `select d.discussId,a.title,d.content,d.disTime 
            from discuss as d,
            (select title,aid from article) as a 
            where d.aid = a.aid`
            );

            console.log('results',results);
            if (results.length != 0) {
                ctx.body = {
                    code: 1,
                    data: results,
                    admin_id: ctx.session.admin_id
                };
            } else {
                ctx.body = {
                    code: -1,
                    data: '查询失败'
                };
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
    }
    // 审核文章接口
    async discussAudit() {
        let {
            ctx
        } = this;
        let clientData = ctx.request.body;
        console.log('clientData',clientData);
        console.log('ctx.session.admin_id', ctx.session.admin_id);
        if (ctx.session.admin_id) {
            // 操作数据库
            const result = await this.app.mysql.delete('discuss', {
                discussId:clientData.discussId,
              });
            //   delete  from discuss where discussId = clientData.discussId;
            
            if (result.length != 0) {
                ctx.body = {
                    code: 1,
                    data: '删除成功',
                };
            } else {
                ctx.body = {
                    code: -1,
                    data: '删除失败'
                };
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
    }
}
module.exports = AdminController;