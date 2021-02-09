require('dotenv').config()

const app = require('./app')
const port = 3000
require('./database')
require('./redis/blocklist-access-token')
require('./redis/allowlist-refresh-token')

app.use((req, res, next) => {
  res.set({
    'Content-Type': 'application/json'
  })
  next()
})

const routes = require('./rotas')
const { InvalidArgumentError, NotFounded, NotAuthorized } = require('./src/erros')

routes(app)

// Criando um middleware centralizador de errors
app.use((err, req, res, next) => {
  let status = 500
  const body = {
    message: err.message
  }

  if (err instanceof InvalidArgumentError) {
    status = 400
  }
  if (err instanceof NotAuthorized) {
    status = 401
  }
  if (err instanceof NotFounded) {
    status = 404
  }
  if (err.name === 'JsonWebTokenError') {
    status = 401
  }
  if (err.name === 'TokenExpiredError') {
    status = 401
    body.expiradoEm = err.expiredAt
  }
  res.status(status).send(body)
})

app.listen(port, () => console.log('A API está funcionando!'))
