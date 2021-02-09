const Modelo = require("../produtoSequelize");
const db = require("../../database/database");
const NotFounded = require("../../errors/notFounded");

module.exports = {
    listar(id) {
        return Modelo.findAll({where: {
            fornecedor: id
        },
        raw: true
    });
    },
    inserir(data){
        return Modelo.create(data);
    },
    async update(produto, dadosUpdate){
        return Modelo.update(
            dadosUpdate,
            {
                where: produto
            }
        );
    },
    delete(idProduto, idFornecedor){
        return Modelo.destroy({
            where:{
                id: idProduto,
                fornecedor: idFornecedor
            }
        });
    },
    async findById(produto, fornecedor){
        const founded = await Modelo.findOne({
            where:{
                id: produto,
                fornecedor
            },
            raw: true
        });
        if (!founded) {
            throw new NotFounded();
        }
        return founded;
    },
    subtrair(idP, idF, campo, quantidadeEstoque){
        return db.transaction(async transacao =>{
            const produto = await Modelo.findOne({
                where: {
                    id: idP,
                    fornecedor: idF
                }
            });
            produto[campo] = quantidadeEstoque;
            await produto.save();
            return produto;
        });
    }
};