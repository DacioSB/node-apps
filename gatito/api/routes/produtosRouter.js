const express = require("express");
const router = express.Router({mergeParams: true});
const Tabela = require("../models/tables/produto");
const Produto = require("../models/classes/Produto");
const Serializer = require("../Serializer").SerializerProduto;


router.get("/", async (req, res) =>{
    const produtos = await Tabela.listar(req.params.idFornecedor);
    const serializer = new Serializer(res.getHeader("Content-Type"));
    res.status(200).send(serializer.serializar(produtos));
});
router.get("/:id", async (req, res, next) =>{
    const dados = {
        id: req.params.id,
        fornecedor: req.params.idFornecedor
    };
    try {
        const produto = new Produto(dados);
        const prod = await produto.findById();
        const serializer = new Serializer(res.getHeader("Content-Type"), [
            "preco",
            "estoque", 
            "dataCriacao",
            "dataAtualizacao",
            "versao",
            "fornecedor"
        ]);
        res.set("ETag", produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set("Last-Modified", timestamp);
        res.status(200).send(serializer.serializar(prod));
    } catch (error) {
        next(error);
    }
    
});
router.head("/:id", async (req, res, next) =>{
    const dados = {
        id: req.params.id,
        fornecedor: req.params.idFornecedor
    };
    try {
        const produto = new Produto(dados);
        await produto.findById();
        res.set("ETag", produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set("Last-Modified", timestamp);
        res.status(200).send();
    } catch (error) {
        next(error.message);
    }
});
router.post("/", async (req, res, next) =>{
    const idFornecedor = parseInt(req.params.idFornecedor);
    const body = req.body;
    try {
        const data = Object.assign({}, body, {fornecedor: idFornecedor});
        const produto = new Produto(data);
        await produto.create();
        const serializer = new Serializer(res.getHeader("Content-Type"));
        res.set("ETag", produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set("Last-Modified", timestamp);
        res.set("Location", `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`);
        res.status(201).send(serializer.serializar(produto));
    } catch (error) {
        console.log(error);
        next(error);
    }
    
});
router.put("/:id", async (req, res, next) =>{
    try {
        const dados = Object.assign({}, req.body, {
            id: req.params.id,
            fornecedor: req.params.idFornecedor
        });
        const produto = new Produto(dados);
        await produto.update();
        await produto.findById();
        res.set("ETag", produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set("Last-Modified", timestamp);
        res.status(204).send();
    } catch (error) {
        next(error);
    }

});
router.delete("/:id", async (req, res, next) =>{
    const dados = {
        id: req.params.id,
        fornecedor: req.params.idFornecedor
    };
    try {
        const produto = new Produto(dados);
        await produto.delete();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
    
    
});
router.put("/:id/diminuir-estoque", async (req,res, next) =>{
    try {
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.params.idFornecedor
        });
        await produto.findById();
        produto.estoque = produto.estoque - req.body.quantidade;
        await produto.diminuirEstoque();
        await produto.findById();
        res.set("ETag", produto.versao);
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        res.set("Last-Modified", timestamp);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
    
});


module.exports = router;