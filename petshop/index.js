const express = require('express');

const app = express();
app.use(express.json());

const atendimentosRoute = require("./routes/atendimentosRoute");
const petsRoutes = require("./routes/petsRoutes");
app.use(atendimentosRoute); 
app.use(petsRoutes);


app.listen(3000, () =>{
    console.log("Servidor na porta 3000");
});

