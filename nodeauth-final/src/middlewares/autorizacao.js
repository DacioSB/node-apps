const control = require('../ControleDeAcesso')

const metodos = {
  ler: {
    todos: 'readAny',
    apenasSeu: 'readOwn'
  },
  criar: {
    todos: 'createAny',
    apenasSeu: 'createOwn'
  },
  deletar: {
    todos: 'deleteAny',
    apenasSeu: 'deleteOwn'
  }
}
module.exports = (entity, action) => (req, res, next) => {
  const rolePermissions = control.can(req.user.role)
  const actions = metodos[action]
  const permissionAll = rolePermissions[actions.todos](entity)
  const permissionOwn = rolePermissions[actions.apenasSeu](entity)
  if (permissionAll.granted === false && permissionOwn.granted === false) {
    res.status(403).send()
    return
  }
  req.access = {
    all: {
      granted: permissionAll.granted,
      attribs: permissionAll.attributes
    },
    own: {
      granted: permissionOwn.granted,
      attribs: permissionOwn.attributes
    }
  }
  next()
}
