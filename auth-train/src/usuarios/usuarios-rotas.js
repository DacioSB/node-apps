const usuariosControlador = require('./usuarios-controlador');
const middlewaresAuth = require("./middlewaresAuth");

module.exports = app => {
  app
    .route("/usuario/refresh")
    .post(middlewaresAuth.refresh, usuariosControlador.login);

  app
    .route("/usuario/login")
    .post(middlewaresAuth.local, usuariosControlador.login);
  app
    .route("/usuario/logout")
    .post([middlewaresAuth.refresh, middlewaresAuth.bearer],usuariosControlador.logout);
  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route("/usuario/verifica_email/:token")
    .get(usuariosControlador.verificaEmail);

  app.route('/usuario/:id').delete(middlewaresAuth.bearer, usuariosControlador.deleta);
};
