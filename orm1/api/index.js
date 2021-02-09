const express = require("express");
const routes = require("./routes/index");
const app = express();

app.use(express.json());
routes(app);

const port = 3000;

app.listen(port, () =>{
    console.log("Servidor up na porta 3000")
});

module.exports = app;

//npx sequelize-cli model:create --name Pessoas --attributes nome:string,ativo:boolean,email:string,role:string
//npx sequelize-cli db:migrate
//npx sequelize-cli seed:generate --name demo-pessoa
//npx sequelize-cli db:seed:all

