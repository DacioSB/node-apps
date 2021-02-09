const db = require("../models");

class Services{

    constructor(nomeModelo){
        this.nomeModelo = nomeModelo;
    }

    async findAllRegisters(){
        return db[this.nomeModelo].findAll();
    }
    async findOneRegister(id){
        
    }
    async createRegister(data){

    }
    async updateRegister(id){

    }
    async deleteRegister(id){

    }
}
module.exports = Services;