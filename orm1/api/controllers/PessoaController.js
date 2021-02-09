const db = require("../models/index");
const Sequelize = require("sequelize");
const {PessoasServices} = require("../services");
const pessoasServices = new PessoasServices();
class PessoaController{
    //OBS: FAZER CONTROLLER PARA AS MATRICULAS PRA NAO FICAR TAO ENORME
    static async findAllActive(req, res){
        try {
            const pessoas = await pessoasServices.findActiveRegisters();
            return res.status(200).send(pessoas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async findAll(req, res){
        try {
            const pessoas = await pessoasServices.findAllRegisters();
            return res.status(200).send(pessoas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async findOne(req, res){
        try {
            const {id} = req.params;
            const pessoa = await pessoasServices.findOneRegister(id);
            if (!pessoa) {
                return res.status(404).send(pessoa);
            }
            return res.status(200).send(pessoa); 
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }
    static async insert(req, res){
        const pessoa = req.body;
        try {
            const novaPessoa = await pessoasServices.createRegister(pessoa);
            return res.status(201).send(novaPessoa);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async restore(req, res){
        const {id} = req.params;

        try {
            const result = await db.Pessoas.restore({where:{id:id}});
            if (result != 1) {
                return res.status(404).json();
            }
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async update(req, res){
        const campos = req.body;
        const {id} = req.params;

        try {
            const resp = await db.Pessoas.update(campos, {where: {id:Number(id)}});
            if (resp == 0) {
                return res.status(404).send();
            }
            const pessoaAtualizada = await db.Pessoas.findOne({
                where: {
                    id: Number(id)
                }
            });
            return res.status(200).send(pessoaAtualizada);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async delete(req, res){
        const {id} = req.params;
        try {
            const deletado = await pessoasServices.deleteRegister(id);
            if (deletado == 0) {
                return res.status(404).send();
            }
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async findMatricula(req, res){
        try {
            const {estudanteId, matriculaId} = req.params;
            const matricula = await db.Matriculas.findOne({
                where: {
                    id: Number(matriculaId),
                    estudante_id: Number(estudanteId)
                }
            });
            if (!matricula) {
                return res.status(404).send();
            }
            return res.status(200).send(matricula); 
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async insertMatricula(req, res){
        const {estudanteId} = req.params;
        const matricula = {...req.body, estudante_id: Number(estudanteId)};
        try {
            const novaMatricula = await db.Matriculas.create(matricula);
            return res.status(201).send(novaMatricula);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async updateMatricula(req, res){
        const campos = req.body;
        const {matriculaId, estudanteId} = req.params;

        try {
            const resp = await db.Matriculas.update(campos, 
                {where: {id:Number(matriculaId), estudante_id: Number(estudanteId)}});
            if (resp == 0) {
                return res.status(404).send();
            }
            const matriculaAtualizada = await db.Matriculas.findOne({
                where: {
                    id: Number(matriculaId)
                }
            });
            return res.status(200).send(matriculaAtualizada);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async deleteMatricula(req, res){
        const {estudanteId, matriculaId} = req.params;
        try {
            const deletado = await db.Pessoas.destroy({where: {
                id: Number(matriculaId),
                estudante_id: Number(estudanteId)
            }});
            if (deletado == 0) {
                return res.status(404).send();
            }
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async pegaMatriculas(req, res){
        const {estudanteId} = req.params;
        try {
            const pessoa = await db.Pessoas.findOne(
                {where:{
                    id: Number(estudanteId)
                }}
            );
            if (pessoa == null) {
                return res.status(404).send();
            }
            const matriculas = await pessoa.getAulasMatriculadas();
            
            return res.status(200).send(matriculas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async pegaMatriculasPorTurma(req, res){
        const {turmaId} = req.params;
        try {
            const matriculas = await db.Matriculas.findAndCountAll({where:{
                turma_id : Number(turmaId),
                status: "confirmado"
            },
            limit: 10,
            order:[["estudante_id", "DESC"]]
        });
            return res.status(200).json(matriculas);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async pegaTurmasLotadas(req, res){
        const lotacao = 2;
        try {
            const turmasLotadas = await db.Matriculas.findAndCountAll({where:{
                status: "confirmado"
            },
            attributes:["turma_id"],
            group: ["turma_id"],
            having: Sequelize.literal(`count(turma_id) >= ${lotacao}`)
        });
            return res.status(200).json(turmasLotadas)
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
    static async cancela(req, res){
        const {estudanteId} = req.params;
        //transacao, pra poder voltar aos estados iniciais
        //tipo commit do git
        //Se acontece um erro, ai ele volta ao estado anterior
        //É bom fazer isso quando forem duas entidades sendo mudadas
        try {
            await pessoasServices.cancelaPessoaEMatriculas(Number(estudanteId));
            return res.status(200).send();
            
            
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

}
module.exports = PessoaController;