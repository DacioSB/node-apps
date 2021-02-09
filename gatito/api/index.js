const express = require("express");
const app = express();
const NotFounded = require("./errors/notFounded");
const routerFornecedores = require("./routes/fornecedoresRouter");
const routerProdutos = require("./routes/produtosRouter");
const campoInvalido = require("./errors/campoInvalido");
const camposVazios = require("./errors/camposVazios");
const conteudoNaoSuportado = require("./errors/ConteudoNaoSuportado");
const formatosAceitos = require("./Serializer").formatosAceitos;
const Fornecedor = require("./models/classes/Fornecedor");
const cors = require("cors");


app.use(express.json());
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use((req, res, next) =>{
    const formatoRequisitado = req.header("Accept");
    if (!formatoRequisitado) {
        res.setHeader("Content-Type", formatosAceitos[0]);
        next();
    }else if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406).send();
    }else{
        res.setHeader("Content-Type", formatoRequisitado);
        next();
    }
});

const verificarFornecedor = async (req, res, next) =>{
    try {

        const id = parseInt(req.params.idFornecedor);
        const fornecedor = new Fornecedor({id: id});
        await fornecedor.recuperaPorId();
        req.fornecedor = fornecedor;
        next();
    } catch (error) {
        next(error);
    }
};

app.use(routerFornecedores);
app.use("/api/fornecedores/:idFornecedor/produtos", verificarFornecedor, routerProdutos);

//middleware
app.use((error, req, res, next) =>{
    if (error instanceof NotFounded) {
        res.status(404).send({error: error.message, id: error.idErro});
    }else if(error instanceof campoInvalido || error instanceof camposVazios){
        res.status(400).send({error: error.message, id: error.idErro});
    }else if(error instanceof conteudoNaoSuportado){
        res.status(406).send({error: error.message, id: error.idErro});
    }else{
        res.status(500).send({error: error.message});
    }
});



const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`server up na porta ${port}`);
});