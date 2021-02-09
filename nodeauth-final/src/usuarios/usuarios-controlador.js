const Usuario = require('./usuarios-modelo')

const tokens = require('./tokens')
const { EmailVerificacao, EmailNovaSenha } = require('./emails')
const { ConversorUsuario } = require('../conversores')
const { NotFounded, InvalidArgumentError } = require('../erros')

function geraEndereco (rota, token) {
  const baseURL = process.env.BASE_URL
  return `${baseURL}${rota}${token}`
}

module.exports = {
  async adiciona (req, res, next) {
    const { nome, email, senha, role } = req.body

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        role
      })
      await usuario.adicionaSenha(senha)
      await usuario.adiciona()

      const token = tokens.verificacaoEmail.cria(usuario.id)
      const endereco = geraEndereco('/usuario/verifica_email/', token)
      const emailVerificacao = new EmailVerificacao(usuario, endereco)
      emailVerificacao.enviaEmail().catch(console.log)

      res.status(201).json()
    } catch (erro) {
      next(erro)
    }
  },

  async login (req, res, next) {
    try {
      const accessToken = tokens.access.cria(req.user.id)
      const refreshToken = await tokens.refresh.cria(req.user.id)
      res.set('Authorization', accessToken)
      res.status(200).json({ refreshToken })
    } catch (erro) {
      next(erro)
    }
  },

  async logout (req, res, next) {
    try {
      const token = req.token
      await tokens.access.invalida(token)
      res.status(204).json()
    } catch (erro) {
      next(erro)
    }
  },

  async lista (req, res, next) {
    try {
      const usuarios = await Usuario.lista()
      const conversor = new ConversorUsuario('json', req.access.all.granted
        ? req.access.all.attribs : req.access.own.attribs)
      res.send(conversor.converter(usuarios))
    } catch (erro) {
      next(erro)
    }
  },

  async verificaEmail (req, res, next) {
    try {
      const usuario = req.user
      await usuario.verificaEmail()
      res.status(200).json()
    } catch (erro) {
      next(erro)
    }
  },

  async deleta (req, res, next) {
    try {
      const usuario = await Usuario.buscaPorId(req.params.id)
      await usuario.deleta()
      res.status(200).json()
    } catch (erro) {
      next(erro)
    }
  },
  async esqueciMinhaSenha (req, res, next) {
    try {
      const usuario = await Usuario.buscaPorEmail(req.body.email)
      const token = await tokens.redefinicaoDeSenha.cria(usuario.id)
      const emailNovaSenha = new EmailNovaSenha(usuario, token)
      await emailNovaSenha.enviaEmail()
      res.send({ message: 'Se encontrarmos um usuario com esse email, lhe enviaremos um email de confirmação' })
    } catch (error) {
      console.log(error)
      if (error instanceof NotFounded) {
        res.send({ message: 'Se encontrarmos um usuario com esse email, lhe enviaremos um email de confirmação' })
      }
      next(error)
    }
  },
  async trocarSenha (req, res, next) {
    try {
      if (typeof req.body.token !== 'string' || req.body.token.length === 0) {
        throw new InvalidArgumentError('O token está inválidooo')
      }
      const id = await tokens.redefinicaoDeSenha.verifica(req.body.token)
      const usuario = await Usuario.buscaPorId(id)
      await usuario.adicionaSenha(req.body.senha)
      await usuario.atualizarSenha()
      res.status(200).send({ message: 'Sua senha foi atualizada com sucesso' })
    } catch (error) {
      next(error)
    }
  }
}
