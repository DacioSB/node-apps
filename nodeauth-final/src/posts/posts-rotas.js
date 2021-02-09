const postsControlador = require('./posts-controlador')
const { middlewaresAutenticacao } = require('../usuarios')
const autorizacao = require('../middlewares/autorizacao')
const autenticaGetPost = require('../middlewares/autenticaGetPost')
const autorizaGetPost = require('../middlewares/autorizaGetPost')

module.exports = app => {
  app
    .route('/post')
    .get(
      [autenticaGetPost, autorizaGetPost('post', 'ler')],
      postsControlador.lista
    )
    .post(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'criar')],
      postsControlador.adiciona
    )

  app.route('/post/:id')
    .get(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'ler')],
      postsControlador.obterDetalhes
    )
    .delete(
      [middlewaresAutenticacao.bearer, middlewaresAutenticacao.local, autorizacao('post', 'deletar')],
      postsControlador.remover
    )
}
