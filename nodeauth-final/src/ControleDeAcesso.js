const AccessControl = require('accesscontrol')
const control = new AccessControl()

// lista de campos que ele pode ler
control
  .grant('assinante')
  .readAny('post', ['id', 'titulo', 'conteudo', 'autor'])
  .readAny('usuario', ['nome'])

control
  .grant('editor')
  .extend('assinante')
  .createOwn('post')
  .deleteOwn('post')

control
  .grant('admin')
  .readAny('post')
  .createAny('post')
  .deleteAny('post')
  .readAny('usuario')
  .deleteAny('usuario')

module.exports = control
