const Tabela = require("../tables/produto");
const CamposVazios = require("../../errors/camposVazios");
const CampoInvalido = require("../../errors/campoInvalido");

class Produto{
    constructor({id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao}){
        this.id = id;
        this.titulo = titulo;
        this.preco = preco;
        this.estoque = estoque;
        this.fornecedor = fornecedor;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }
    validate(){
        if (typeof this.titulo !== "string" || this.titulo.length === 0) {
            throw new CampoInvalido("O campo titulo esta invalido");
        }
        if (typeof this.preco !== "number" || this.preco === 0) {
            throw new CampoInvalido("O campo preco esta invalido");
        }
    }
    async create() {
        this.validate();
        const resultado = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        });
        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }
    async findById(){
        const produto = await Tabela.findById(this.id, this.fornecedor);
        this.titulo = produto.titulo;
        this.preco = produto.preco;
        this.estoque = produto.estoque;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.versao = produto.versao;
        return produto;
    }
    async update(){
        const dadosParaAtualizar = { };
        if (typeof this.titulo === "string" && this.titulo.length > 0) {
            dadosParaAtualizar.titulo = this.titulo;
        }
        if (typeof this.preco === "number" && this.preco > 0) {
            dadosParaAtualizar.preco = this.preco;
        }
        if (typeof this.estoque === "number") {
            dadosParaAtualizar.estoque = this.estoque;
        }
        if (Object.keys(dadosParaAtualizar).length == 0) {
            throw new CamposVazios("Nao foram fornecidos dados para atualizar");
        }
        return Tabela.update({
            id:this.id,
            fornecedor: this.fornecedor
        }, dadosParaAtualizar);
    }
    async delete(){
        return Tabela.delete(this.id, this.fornecedor);
    }
    diminuirEstoque() {
        return Tabela.subtrair(
            this.id,
            this.fornecedor,
            "estoque",
            this.estoque
        );
    }
}

module.exports = Produto;