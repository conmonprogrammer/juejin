import { io } from "socket.io-client";
// browser
const log = console.log;

window.onload = function () {
    // init
    const socket = io('http://127.0.0.1:7001/', {
        //  实际使用中可以在这里传递参数
        /* query: {
            room: 'demo',
            userId: `client_${Math.random()}`,
        },

        transports: ['websocket'], */
    });

    socket.on('connect', () => {
        const id = socket.id;

        log('#connect,', id, socket);

        // 监听自身 id 以实现 p2p 通讯
        socket.on(id, (msg) => {
            log('#receive,', msg);
        });
        // 给服务器发送消息
        socket.emit('chat', `hello socket.io`);
        // 监听服务器给客户端推送的消息
        socket.on('res', (msg) => {
            log('res,', msg);
        });
        socket.on('error', () => {
            log('#error');
        });
    });
    let button = document.querySelector('.fasong');
    let input = document.querySelector('.content');
    (button as HTMLButtonElement).addEventListener('click', function () {
        socket.emit('chat', { 'content': (input as HTMLInputElement).value });
    })

    // 接收在线用户信息
    // socket.on('online', (msg) => {
    //     log('#online,', msg);
    // });

    // // 系统事件
    // socket.on('disconnect', (msg) => {
    //     log('#disconnect', msg);
    // });

    // socket.on('disconnecting', () => {
    //     log('#disconnecting');
    // });

    socket.on('error', () => {
        log('#error');
    });

};
