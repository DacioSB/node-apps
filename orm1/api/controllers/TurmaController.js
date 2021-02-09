const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class TurmaController{
    static async findAll(req, res){
        const {data_inicial, data_final} = req.query;
        const where = {
        };
        data_inicial || data_final ? where.data_inicio = {} : null;
        data_inicial ? where.data_inicio[Op.gte] = data_inicial : null;
        data_final ? where.data_inicio[Op.lte] = data_final : null;
        try {
            const turmas = await db.Turmas.findAll({where});
            return res.status(200).send(turmas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async findOne(req, res){
        try {
            const {id} = req.params;
            const turma = await db.Turmas.findOne({
                where: {
                    id: Number(id)
                }
            });
            if (!turma) {
                return res.status(404).send();
            }
            return res.status(200).send(turma); 
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async insert(req, res){
        const turma = req.body;
        try {
            const novaturma = await db.Turmas.create(turma);
            return res.status(201).send(novaturma);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async update(req, res){
        const campos = req.body;
        const {id} = req.params;

        try {
            await db.Turmas.update(campos, {where: {id:Number(id)}});
            const turmaAtualizada = await db.Turmas.findOne({
                where: {
                    id: Number(id)
                }
            });
            return res.status(200).send(turmaAtualizada);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async delete(req, res){
        const {id} = req.params;
        try {
            const deletado = await db.Turmas.destroy({where: {
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
module.exports = TurmaController;