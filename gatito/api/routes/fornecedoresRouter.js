const express = require("express");
const router = express.Router();

const TabelaFornecedor = require("../models/tables/fornecedor");
const Fornecedor = require("../models/classes/Fornecedor");
const SerializerFornecedor = require("../Serializer").SerializerFornecedor;

router.get("/api/fornecedores", async (req, res) =>{
    const resultados = await TabelaFornecedor.listar();
    const serializer = new SerializerFornecedor(res.getHeader("Content-Type"));
    res.status(200).send(serializer.serializar(resultados));

});
router.post("/api/fornecedores", async (req, res, next) =>{
    try {
        const data = req.body;
        const fornecedor = new Fornecedor(data);

        await fornecedor.inserir();
        const serializer = new SerializerFornecedor(res.getHeader("Content-Type"));
        res.status(201).send(serializer.serializar(fornecedor));
    } catch (error) {
        next(error);
    }

    
});
router.get("/api/fornecedores/:id", async (req, res, next) =>{
    const id = req.params.id;

    const fornecedor = new Fornecedor({id});

    

    try {
        await fornecedor.recuperaPorId();
        const serializer = new SerializerFornecedor(res.getHeader("Content-Type"), 
            ["email", "dataCriacao", "dataAtualizacao", "versao"]);
        res.status(200).send(serializer.serializar(fornecedor));
    } catch (error) {
        next(error);
    }
});
router.put("/api/fornecedores/:id", async (req, res, next) =>{
    const id = req.params.id;
    const dados = req.body;

    try {
        const fornecedor = new Fornecedor({...dados, id});
        await fornecedor.atualizar();
        res.status(204).end();  
    } catch (error) {
        next(error);
        
    }
});
router.delete("/api/fornecedores/:id", async (req, res, next) =>{
    const id = req.params.id;

    try {
        const fornecedor = new Fornecedor({id});
        await fornecedor.recuperaPorId();
        await fornecedor.deletar();
        const serializer = new SerializerFornecedor(res.getHeader("Content-Type"));
        res.status(200).send(serializer.serializar(fornecedor));
    } catch (error) {
        next(error);
    }
});

module.exports = router;