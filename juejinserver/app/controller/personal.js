'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');

// 全局ip
let overallUrl = 'http://127.0.0.1:7001'
class PersonalController extends Controller {
    // 获取个人详情信息
    async getPersonalDetail() {
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
                columns: ['username', 'job', 'company', 'introduction', 'tel']
            });

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

    // 修改个人详情信息
    async setPersonalDetail() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            let clientData = ctx.request.body;
            const row = {
                ...clientData
            };

            const options = {
                where: {
                    uid: ctx.session.uid
                }
            };
            const results = await this.app.mysql.update('user', row, options);
            const result = await this.app.mysql.select('user', {
                where: { uid: ctx.session.uid },
                columns: ['headurl']
            });
            ctx.body = {
                code: 1,
                data: result
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '修改失败'
            };
        }
    }

    // 设置头像
    async setPersonalHead() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            let clientData = ctx.request.files;
            console.log(clientData[0].filepath);
            fs.copyFileSync(clientData[0].filepath, path.dirname(__dirname) + '/public/images/headImg' + path.basename(clientData[0].filepath))
            const row = {
                headurl: overallUrl + '/public/images/headImg' + path.basename(clientData[0].filepath)
            };

            const options = {
                where: {
                    uid: ctx.session.uid
                }
            };
            const results = await this.app.mysql.update('user', row, options);
            const result = await this.app.mysql.select('user', {
                where: { uid: ctx.session.uid },
                columns: ['headurl']
            });
            ctx.body = {
                code: 1,
                data: result
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '修改失败'
            };
        }
    }

    // 获取屏蔽用户
    async getShieldUser() {
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
                `SELECT u.headurl,u.username,u.uid,s.shieldTime,s.shieldId FROM shield as s,user as u WHERE s.uid = ${ctx.session.uid} AND s.byShieldId = u.uid `
            );
            if (results.length == 0) {
                ctx.body = {
                    code: 0,
                    data: '无'
                }
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                }
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }

    // 屏蔽/取消屏蔽用户
    async deleteSU() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            let clientData = ctx.request.body;
            const result = await this.app.mysql.query(
                `SELECT * FROM shield WHERE shieldId = ${clientData.shieldId};`
            );
            if (result.length != 0) {
                const results = await this.app.mysql.delete('shield', {
                    shieldId: clientData.shieldId, uid: ctx.session.uid
                });
                ctx.body = {
                    code: 1,
                    data: '取消屏蔽成功'
                }
            } else {
                // 插入
                const result = await this.app.mysql.insert('shield', { uid: ctx.session.uid, byShieldId: clientData.byShieldId });
                ctx.body = {
                    code: 1,
                    data: '屏蔽用户成功'
                };
            }


        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '取消失败'
            };
        }
    }

    // 获取用户未关注的标签（不是所有标签）
    async getAllLabel() {
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
                `select lid,labelname from label where lid not in (select lid from ucarel where uid = ${ctx.session.uid})`
            );
            console.log('results', results);
            if (results.length == 0) {
                ctx.body = {
                    code: 0,
                    data: '无'
                }
            } else {
                ctx.body = {
                    code: 1,
                    data: results
                }
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            };
        }
    }

    // 关注或取消关注标签
    async setLabel() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        let clientData = ctx.request.body;
        try {
            const results = await this.app.mysql.get('ucarel', { uid: ctx.session.uid, lid: clientData.lid });
            console.log(results);
            if (results == null) {
                const results = await this.app.mysql.insert('ucarel', { uid: ctx.session.uid, lid: clientData.lid });
                ctx.body = {
                    code: 1,
                    data: '关注成功'
                }
            } else {
                const results = await this.app.mysql.delete('ucarel', {
                    uid: ctx.session.uid, lid: clientData.lid
                });
                ctx.body = {
                    code: 1,
                    data: '取消关注成功'
                }
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '操作失败'
            };
        }
    }
    // 关注或取消关注用户
    async setUser() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        let clientData = ctx.request.body;
        try {
            const results = await this.app.mysql.get('care', { uid: ctx.session.uid, authorId: clientData.authorId });
            console.log(results);
            if (results == null) {
                const results = await this.app.mysql.insert('care', { uid: ctx.session.uid, authorId: clientData.authorId });
                ctx.body = {
                    code: 1,
                    data: '关注成功'
                }
            } else {
                const results = await this.app.mysql.delete('care', {
                    uid: ctx.session.uid, authorId: clientData.authorId
                });
                ctx.body = {
                    code: 1,
                    data: '取消关注成功'
                }
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '操作失败'
            };
        }
    }
}

module.exports = PersonalController;
