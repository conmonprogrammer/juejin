'use strict';

const { Controller } = require('egg');

class ArticleDetailController extends Controller {
    // 获取文章详情
    async getArticleDetail() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        console.log(clientData);
        try {
            let results = {
                'islike': 0,
                'iscollect': 0,
                'iscare': 0
            };
            const resultsAu = await this.app.mysql.query(
                `SELECT a.title,a.abstract,a.publish_time,a.content,a.tag,u.headurl,u.job,u.username,u.uid as authorId FROM article as a,user as u WHERE a.aid = ${clientData.aid} AND a.uid = u.uid`
            );
            Object.assign(results, ...resultsAu)
            if (ctx.session.uid) {
                // 是否点赞
                const resultsIsLike = await this.app.mysql.query(
                    `SELECT * FROM arlike WHERE uid = ${ctx.session.uid} AND aid = ${clientData.aid}`
                );

                if (resultsIsLike.length != 0) {
                    results.islike = 1;
                }
                // 是否收藏
                const resultsIsCol = await this.app.mysql.query(
                    `SELECT * FROM collect WHERE uid = ${ctx.session.uid} AND aid = ${clientData.aid};`
                );
                if (resultsIsCol.length != 0) {
                    results.iscollect = 1;
                }
                // 是否关注
                const resultsIsCare = await this.app.mysql.query(
                    `SELECT * FROM care as c,article as a WHERE c.uid = ${ctx.session.uid} AND c.authorId = a.uid AND a.aid = ${clientData.aid}`
                );
                if (resultsIsCare.length != 0) {
                    results.iscare = 1;
                }
            }
            // 作者获赞总数
            const resultsAllLikeCount = await this.app.mysql.query(
                `SELECT COUNT(*) as count FROM arlike as l, article as a,article as ar WHERE a.aid = ${clientData.aid} AND a.uid = ar.uid AND ar.aid = l.aid;   `
            );
            results.alllikecount = resultsAllLikeCount[0].count;
            // 相关文章数组
            const articles = await this.app.mysql.query(
                `SELECT ar.title as retitle,ar.abstract as reabstract,ar.aid as reaid FROM article as a,article as ar WHERE a.aid = ${clientData.aid} AND a.uid = ar.uid AND ar.state = 1;`
            );
            results.articles = articles;
            // 文章评论
            const discuss = await this.app.mysql.query(
                `SELECT u.headurl as disheadurl,u.username as disusername,d.content as discontent,d.disTime,d.discussId FROM discuss as d,user as u WHERE d.aid = ${clientData.aid} AND d.byDiscussId = 0 AND u.uid = d.uid ORDER BY d.disTime DESC;`
            );
            discuss.forEach(item => {
                item.bydisusername = '0';
            });
            const rediscuss = await this.app.mysql.query(
                `SELECT u.headurl as disheadurl,u.username as disusername,d.content as discontent,d.disTime,us.username as bydisusername,d.discussId  FROM discuss as d,discuss as dis,user as u,user as us WHERE d.aid = ${clientData.aid} AND d.byDiscussId = dis.discussId and d.uid = u.uid AND dis.uid = us.uid ORDER BY d.disTime DESC`
            );
            let discusses = rediscuss.concat(discuss);
            results.discuss = discusses;
            ctx.body = {
                code: 1,
                data: results
            }
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            }
        }



    }
    

    // 获取相关文章点赞、评论数
    async getLikeDiscuss() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        try {
            let results = {};
            const likeCount = await this.app.mysql.query(
                `SELECT COUNT(*) as likecount FROM arlike WHERE aid = ${clientData.reaid}`
            );
            Object.assign(results, likeCount[0]);
            const rediscount = await this.app.mysql.query(
                `SELECT COUNT(*) as rediscount FROM discuss WHERE aid =${clientData.reaid};`
            );
            Object.assign(results, rediscount[0]);
            ctx.body = {
                code: 1,
                data: results
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '失败'
            }
        }
    }

    // 获取评论点赞数以及是否点赞和评论数
    async getDisCount() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        try {
            let results = {};
            const likeCount = await this.app.mysql.query(
                `SELECT COUNT(*) as likecount FROM dislike WHERE discussId = ${clientData.discussId};`
            );
            const disCount = await this.app.mysql.query(
                `SELECT COUNT(*) as discount FROM discuss WHERE byDiscussId = ${clientData.discussId};`
            );
            Object.assign(results, likeCount[0], disCount[0]);
            results.islikedis = 0;
            if (ctx.session.uid) {
                const isLike = await this.app.mysql.query(
                    `SELECT * FROM dislike WHERE discussId = ${clientData.discussId} AND uid = ${ctx.session.uid};`
                );
                if (isLike.length != 0) {
                    results.islikedis = 1;
                }
            }
            ctx.body = {
                code: 1,
                data: results
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '失败'
            }
        }
    }

    // 点赞/取消点赞文章
    async setArtLike() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const resultAr = await this.app.mysql.query(
                    `SELECT * FROM arlike WHERE uid = ${ctx.session.uid} AND aid = ${clientData.aid};`
                );
                if (resultAr.length != 0) {
                    const result = await this.app.mysql.delete('arlike', {
                        uid: ctx.session.uid, aid: clientData.aid
                    });
                    ctx.body = {
                        code: 1,
                        data: '点赞成功'
                    };
                } else {
                    // 插入
                    const result = await this.app.mysql.insert('arlike', { uid: ctx.session.uid, aid: clientData.aid });
                    ctx.body = {
                        code: 1,
                        data: '已取消点赞'
                    };
                }

            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 收藏/取消收藏文章 
    async setArtCol() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const resultAr = await this.app.mysql.query(
                    `SELECT * FROM collect WHERE uid = ${ctx.session.uid} AND aid = ${clientData.aid};`
                );
                if (resultAr.length != 0) {
                    console.log('=====================');
                    console.log(clientData.aid);
                    const result = await this.app.mysql.delete('collect', {
                        uid: ctx.session.uid, aid: clientData.aid
                    });
                    ctx.body = {
                        code: 1,
                        data: '收藏成功'
                    };
                } else {
                    // 插入
                    const result = await this.app.mysql.insert('collect', { uid: ctx.session.uid, aid: clientData.aid });
                    ctx.body = {
                        code: 1,
                        data: '已取消收藏'
                    };
                }

            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 点赞/取消点赞评论
    async setColLike() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const resultAr = await this.app.mysql.query(
                    `SELECT * FROM dislike WHERE uid = ${ctx.session.uid} AND discussId = ${clientData.discussId};`
                );
                if (resultAr.length != 0) {
                    const result = await this.app.mysql.delete('dislike', {
                        uid: ctx.session.uid, discussId: clientData.discussId
                    });
                    ctx.body = {
                        code: 1,
                        data: '已取消点赞'
                    };
                } else {
                    // 插入
                    const result = await this.app.mysql.insert('dislike', { uid: ctx.session.uid, discussId: clientData.discussId });
                    ctx.body = {
                        code: 1,
                        data: '点赞成功'
                    };
                }

            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 发布/回复评论
    async publishDiscuss() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const result = await this.app.mysql.insert('discuss', { uid: ctx.session.uid, byDiscussId: clientData.discussId, content: clientData.content, aid: clientData.aid });
                ctx.body = {
                    code: 1,
                    data: '成功'
                };
            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 关注、取消关注
    async setCareUser() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const resultAr = await this.app.mysql.query(
                    `SELECT * FROM care WHERE uid = ${ctx.session.uid} AND authorId = ${clientData.authorId};`
                );
                if (resultAr.length != 0) {
                    const result = await this.app.mysql.delete('care', {
                        uid: ctx.session.uid, authorId: clientData.authorId
                    });
                    ctx.body = {
                        code: 1,
                        data: '已取消关注'
                    };
                } else {
                    // 插入
                    const result = await this.app.mysql.insert('care', { uid: ctx.session.uid, authorId: clientData.authorId });
                    ctx.body = {
                        code: 1,
                        data: '关注成功'
                    };
                }

            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 屏蔽、取消屏蔽作者
    async shieldUser() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const resultAr = await this.app.mysql.query(
                    `SELECT uid FROM discuss WHERE discussId = ${clientData.discussId};`
                );
                const results = await this.app.mysql.select('shield', {
                    where: { uid: ctx.session.uid, byShieldId: resultAr[0].uid }, // WHERE 条件
                });
                if (results.length == 0) {
                    const result = await this.app.mysql.insert('shield', { uid: ctx.session.uid, byShieldId: resultAr[0].uid })
                    ctx.body = {
                        code: 1,
                        data: '屏蔽成功'
                    };
                } else {
                    const result = await this.app.mysql.delete('shield', {
                        uid: ctx.session.uid, byShieldId: resultAr[0].uid
                    });
                    ctx.body = {
                        code: 1,
                        data: '已取消屏蔽'
                    };
                }

            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 举报评论
    async informDis() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {

                const result = await this.app.mysql.insert('inform', { uid: ctx.session.uid, discussId: clientData.discussId, informReason: clientData.informReason })
                ctx.body = {
                    code: 1,
                    data: '举报成功'
                };
            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '举报失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 举报文章
    async informArt() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
                const result = await this.app.mysql.insert('informArt', { uid: ctx.session.uid, aid: clientData.aid, informReason: clientData.informReason })
                ctx.body = {
                    code: 1,
                    data: '举报成功'
                };
            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '举报失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }

    // 查看一级评论
    async seeFirDis() {
        const { ctx } = this;
        let clientData = ctx.request.body;
        if (ctx.session.uid) {
            try {
            // 文章评论
            const discuss = await this.app.mysql.query(
                `SELECT u.headurl as disheadurl,u.username as disusername,d.content as discontent,d.disTime,d.discussId FROM discuss as d,user as u WHERE d.aid = ${clientData.aid} AND d.byDiscussId = 1 AND u.uid = d.uid ORDER BY d.disTime DESC;`
            );
                ctx.body = {
                    code: 1,
                    data: '举报成功'
                };
            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '举报失败'
                }
            }
        } else {
            ctx.body = {
                code: 0,
                data: '登录失效'
            }
        }

    }


}

module.exports = ArticleDetailController;
