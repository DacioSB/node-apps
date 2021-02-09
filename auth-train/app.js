require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {estrategiasAutenticacao} = require("./src/usuarios");

app.use(
  bodyParser.urlencoded({ extended: false })
);

module.exports = app;

//ELE IMPLEMENTA UMA BLACKLIST COM REDIS
//ARMAZENANDO TOKENS QUE FORAM INVALIDADOS POR LOGOUT MAS AINDA ESTAO NOS 15 MINUTOS DE VIDA
//ELIMINANDO OS TOKENS DO DB QUE PASSAREM DOS 15 MINUTOS PRA NAO ENCHER DE TOKENS