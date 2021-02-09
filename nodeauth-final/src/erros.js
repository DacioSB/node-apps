class InvalidArgumentError extends Error {
  constructor (mensagem) {
    super(mensagem)
    this.name = 'InvalidArgumentError'
  }
}

class InternalServerError extends Error {
  constructor (mensagem) {
    super(mensagem)
    this.name = 'InternalServerError'
  }
}

class NotFounded extends Error {
  constructor (entidade) {
    const mensagem = `Nao foi possivel encontrar o ${entidade}`
    super(mensagem)
    this.name = 'NotFounded'
  }
}
class NotAuthorized extends Error {
  constructor () {
    const mensagem = 'Nao foi possivel acessar esse recurso'
    super(mensagem)
    this.name = 'NotAuthorized'
  }
}

module.exports = { InvalidArgumentError, InternalServerError, NotFounded, NotAuthorized }
