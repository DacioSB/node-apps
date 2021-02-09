const db = require("../models");

class Services{

    constructor(nomeModelo){
        this.nomeModelo = nomeModelo;
    }

    async findAllRegisters(){
        return db[this.nomeModelo].findAll();
    }
    async findOneRegister(id){
        return db[this.nomeModelo].findOne({
            where: {
                id: Number(id)
            }
        });
    }
    async createRegister(data){
        return db[this.nomeModelo].create(data);
    }
    async updateRegister(data, id, transacao = {}){
        return db[this.nomeModelo].update(data, {where:{id: id}}, transacao);
    }
    async updateRegisters(data, where, transacao = {}){
        return db[this.nomeModelo].update(data, {where:{...where}}, transacao);
    }
    async deleteRegister(id){
        return db[this.nomeModelo].destroy({where: {
            id: id
        }});
    }
}
module.exports = Services;