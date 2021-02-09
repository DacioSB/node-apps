const autorizacao = require('./autorizacao')

module.exports = (entity, action) => (req, res, next) => {
  if (req.estaAutenticado === true) {
    // autorizacao recebe post e ler,e retorna uma funcao (req, res, next)
    return autorizacao(entity, action)(req, res, next)
  }
  next()
}
