const db = require("../models");
const Services = require("./Services");

class PessoasServices extends Services{
    constructor(){
        super("Pessoas");
        this.matriculas = new Services("Matriculas");
    }

    async findActiveRegisters(where ={}){
        return db[this.nomeModelo].findAll({where: {...where}});
    }
    async findAllRegisters(where ={}){
        return db[this.nomeModelo].scope("all").findAll({where: {...where}});
    }
    async cancelaPessoaEMatriculas(estudanteId){
        return db.sequelize.transaction(async t =>{
            await super.updateRegister({ativo: false}, estudanteId, {transaction: t});
            await this.matriculas.updateRegisters({status: "cancelado"}, {estudante_id: estudanteId}, {transaction: t});
        });
    }

}
module.exports = PessoasServices;