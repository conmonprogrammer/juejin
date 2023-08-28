'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,middleware,io } = app;
  router.post('/getArtArray', controller.home.getArtArray);
  router.post('/login', controller.user.login);
  router.post('/register', controller.user.register);
  router.post('/code', controller.user.code);
  router.get('/personal', controller.user.personal);
  router.get('/careUser', controller.user.careUser);
  router.get('/bycare', controller.user.bycare);
  router.get('/trends', controller.user.trends);
  router.get('/collect', controller.user.collect);
  router.get('/careLabel', controller.user.careLabel);
  router.get('/seeLike', controller.user.seeLike);
  router.get('/getPersonalDetail', controller.personal.getPersonalDetail);
  router.post('/setPersonalDetail', controller.personal.setPersonalDetail);
  router.post('/setPersonalHead', controller.personal.setPersonalHead);
  router.get('/getShieldUser', controller.personal.getShieldUser);
  router.post('/deleteSU', controller.personal.deleteSU);
  router.get('/getAllLabel', controller.personal.getAllLabel);
  router.post('/setLabel', controller.personal.setLabel);
  router.post('/setUser', controller.personal.setUser);
  router.get('/getArtCreate', controller.article.getArtCreate);
  router.post('/getArtDetail', controller.article.getArtDetail);
  router.post('/publishArt', controller.article.publishArt);
  router.post('/getArticleDetail', controller.articleDetail.getArticleDetail);
  router.post('/getDisCount', controller.articleDetail.getDisCount);
  router.post('/getLikeDiscuss', controller.articleDetail.getLikeDiscuss);
  router.post('/setArtLike', controller.articleDetail.setArtLike);
  router.post('/setColLike', controller.articleDetail.setColLike);
  router.post('/setArtCol', controller.articleDetail.setArtCol);
  router.post('/publishDiscuss', controller.articleDetail.publishDiscuss);
  router.post('/adminLogin', controller.admin.adminLogin);
  router.get('/getarticleNotAudit', controller.admin.getarticleNotAudit);
  router.post('/articleAudit', controller.admin.articleAudit);
  router.get('/getCommentNotAudit', controller.admin.getCommentNotAudit);
  router.post('/discussAudit', controller.admin.discussAudit );
  router.post('/setCareUser', controller.articleDetail.setCareUser);
  router.post('/shieldUser', controller.articleDetail.shieldUser);
  router.post('/informDis', controller.articleDetail.informDis);
  router.post('/informArt', controller.articleDetail.informArt);
  router.post('/seeFirDis', controller.articleDetail.seeFirDis);
  // socket.io
  io.of('/').route('chat', controller.chat.ping);

};
