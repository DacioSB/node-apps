// const db = require("../models");
const Services = require("../services/Services");
const niveisServices = new Services("niveis");


class NivelController{
    static async findAll(req, res){
        try {
            const niveis = await niveisServices.findAllRegisters();
            return res.status(200).send(niveis);
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async findOne(req, res){
        try {
            const {id} = req.params;
            const nivel = await db.Niveis.findOne({
                where: {
                    id: Number(id)
                }
            });
            if (!nivel) {
                return res.status(404).send();
            }
            return res.status(200).send(nivel); 
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async insert(req, res){
        const nivel = req.body;
        try {
            const novonivel = await db.Niveis.create(nivel);
            return res.status(201).send(novonivel);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async update(req, res){
        const campos = req.body;
        const {id} = req.params;

        try {
            await db.Niveis.update(campos, {where: {id:Number(id)}});
            const nivelAtualizado = await db.Niveis.findOne({
                where: {
                    id: Number(id)
                }
            });
            return res.status(200).send(nivelAtualizado);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async delete(req, res){
        const {id} = req.params;
        try {
            const deletado = await db.Niveis.destroy({where: {
                id: id
            }});
            if (deletado == 0) {
                return res.status(404).send();
            }
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}
module.exports = NivelController;