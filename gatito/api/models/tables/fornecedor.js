const Modelo = require("../fornecedorSequelize");
const NotFounded = require("../../errors/notFounded");


module.exports ={

    listar(){
        return Modelo.findAll({raw: true});
    },
    inserir(fornecedor){
        return Modelo.create(fornecedor);
    },
    async findById(id){
        const encontrado = await Modelo.findOne({
            where:{
                id: id
            }
        });

        if (!encontrado) {
            throw new NotFounded();
        }
        return encontrado;
    },
    async atualizar(id, dados){
        return await Modelo.update(
            dados,
            {
                where: {id}
            }
        );
    },
    async removeAttribute(id){
        return await Modelo.destroy({
            where: {id}
        });
    }

};