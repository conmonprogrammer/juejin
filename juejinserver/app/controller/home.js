'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {

  // 获取文章数组
  async getArtArray() {
    const { ctx } = this;
    let clientData = ctx.request.body;
    try {
      let resultAr;
      if (clientData.tag != 0) {
        if (clientData.order == 1) {
          resultAr = await this.app.mysql.query(
            `SELECT a.title,a.abstract,u.username,a.tag,a.aid,a.coverurl FROM user as u,article as a WHERE a.tag = ${clientData.tag} AND a.uid = u.uid AND AND a.state = 1 ORDER BY a.publish_time DESC LIMIT 20 OFFSET ${clientData.offset} ;`
          );
        } else if (clientData.order == 0) {
          resultAr = await this.app.mysql.query(
            `SELECT a.title,a.abstract,u.username,a.tag,a.aid,a.coverurl FROM user as u,article as a WHERE a.tag = ${clientData.tag} AND a.uid = u.uid AND a.state = 1  LIMIT 20 OFFSET ${clientData.offset} ;`
          );
        }

      } else {
        if (clientData.order == 1) {
          resultAr = await this.app.mysql.query(
            `SELECT a.title,a.abstract,u.username,a.tag,a.aid,a.coverurl FROM user as u,article as a WHERE  a.uid = u.uid AND a.state = 1 ORDER BY a.publish_time DESC LIMIT 20 OFFSET ${clientData.offset} ;`
          );
        } else if (clientData.order == 0) {
          resultAr = await this.app.mysql.query(
            `SELECT a.title,a.abstract,u.username,a.tag,a.aid,a.coverurl FROM user as u,article as a WHERE  a.uid = u.uid AND a.state = 1 LIMIT 20 OFFSET ${clientData.offset} ;`
          );
        }
      }

      ctx.body = {
        code: 1,
        data: resultAr
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: -1,
        data: '获取失败'
      }
    }
  }
}

module.exports = HomeController;
