'use strict';
let allsocketid = [];
const Controller = require('egg').Controller;

class ChatController extends Controller {
  async ping() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    console.log('接收客户端的消息message: ',message);
    const id = ctx.socket.id;
    allsocketid.push(id);
    console.log(allsocketid);
    const nsp = app.io.of('/');
    // 给所有客户端推送消息
    // nsp.emit('res', `Hi! I've got your message: ${message}`);
    // console.log(nsp.sockets);
    // 给指定的客户端发送消息
    nsp.sockets[allsocketid[0]].emit('res', message); 
    // 给客户端发送信息
    // await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
  }
}

module.exports = ChatController;