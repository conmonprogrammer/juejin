'use strict';
// 全局ip
let overallUrl = 'http://127.0.0.1:7001'
const { Controller } = require('egg');
const fs = require('fs');
const path = require('path');

class ArticleController extends Controller {
    // 进入创作者中心
    async getArtCreate() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        }
        try {
            const resultFan = await this.app.mysql.query(
                `SELECT COUNT(*) as fanCount FROM care WHERE authorId = ${ctx.session.uid} `
            );
            const resultArtC = await this.app.mysql.query(
                `SELECT COUNT(*) as artCount FROM article WHERE uid = ${ctx.session.uid}; `
            );
            const resultLike = await this.app.mysql.query(
                `SELECT COUNT(*) as likeCount FROM arlike,article WHERE article.uid = ${ctx.session.uid} AND article.aid = arlike.aid `
            );
            const resultDis = await this.app.mysql.query(
                `SELECT COUNT(*) as discussCount FROM discuss,article WHERE article.uid =  ${ctx.session.uid} AND discuss.aid = article.aid`
            );
            const resultCol = await this.app.mysql.query(
                `SELECT COUNT(*) as collectCount FROM collect,article WHERE article.uid=${ctx.session.uid} AND collect.aid = article.aid `
            );
            const resultUser = await this.app.mysql.query(
                `SELECT headurl,username FROM user WHERE uid = ${ctx.session.uid} `
            );
            const resultArt = await this.app.mysql.query(
                `SELECT aid,title,abstract,publish_time FROM article WHERE uid = ${ctx.session.uid} `
            );
            let article = { articles: resultArt };
            let results = Object.assign(resultArtC[0], resultFan[0], resultLike[0], resultDis[0], resultCol[0], resultUser[0], article)
            ctx.body = {
                code: 1,
                data: results
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            }
        }

    }
    // 获取文章详情
    async getArtDetail() {
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
            const resultsArt = await this.app.mysql.query(
                `SELECT a.title,a.publish_time,a.content,a.tag,u.headurl,u.username  FROM user as u,article as a WHERE a.aid = ${clientData.aid} AND u.uid = a.uid `
            );
            const resultsUid = await this.app.mysql.query(
                `SELECT u.uid FROM article as a,user as u WHERE a.aid = ${clientData.aid}  AND a.uid = u.uid`
            );
            const resultsLike = await this.app.mysql.query(
                `SELECT COUNT(*) as likeCount FROM arlike,article WHERE article.uid = ${resultsUid[0].uid} AND article.aid = arlike.aid `
            );
            const like = await this.app.mysql.query(
                `SELECT * FROM user as u,arlike as l WHERE u.tel = ${clientData.tel} AND u.uid = l.uid AND l.aid = ${clientData.aid}`
            );
            const collect = await this.app.mysql.query(
                `SELECT * FROM user as u,collect as c WHERE u.tel = ${clientData.tel} AND u.uid = c.uid AND c.aid = ${clientData.aid}`
            );
            let isLike = {
                isLike: 0
            };
            let isCollect = {
                isCollect: 0
            };
            if (like.length != 0) {
                isLike.isLike = 1;
            }
            if (collect.length != 0) {
                isCollect.isCollect = 1;
            }
            let results = Object.assign(resultsArt[0], resultsLike[0], isLike, isCollect)
            ctx.body = {
                code: 1,
                data: results
            };
        } catch (error) {
            console.log(error);
            ctx.body = {
                code: -1,
                data: '获取失败'
            }
        }

    }
    // 发布文章
    async publishArt() {
        const { ctx } = this;
        if (!ctx.session.uid) {
            ctx.body = {
                code: 0,
                data: '登陆失效'
            };
            return false;
        } else {
            try {
                let clientData = ctx.request.body;
                console.log(clientData);
                clientData.uid = ctx.session.uid;
                if (ctx.request.files.length == 1) {
                    console.log(ctx.request.files);
                    // 如果有封面，插入封面到clientData中
                    let file = ctx.request.files[0];
                    try {
                        fs.copyFileSync(file.filepath, path.dirname(__dirname) + '/public/images/' + path.basename(file.filepath));
                        clientData.coverurl = overallUrl + '/public/images/' + path.basename(file.filepath);
                        const result = await this.app.mysql.insert('article', clientData);
                        ctx.body = {
                            code: 1,
                            data: "发布成功",
                            insertId: result.insertId
                        };
                    } catch (error) {
                        ctx.body = {
                            code: -1,
                            data: '修改失败'
                        }
                    }
                } else {
                    // 没有封面，直接插入文章数据
                    const result = await this.app.mysql.insert('article', clientData);
                    ctx.body = {
                        code: 1,
                        data: "发布成功",
                        insertId: result.insertId
                    };
                }


            } catch (error) {
                console.log(error);
                ctx.body = {
                    code: -1,
                    data: '发布失败'
                }
            }
        }

    }
}

module.exports = ArticleController;