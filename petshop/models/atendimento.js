const moment = require("moment");
const db = require("../config/database");
const axios = require("axios");

const repository = require("../repositories/atendimentoRepository");

const conexao = require("../config/database");
const serverAxios = "http://localhost:8082/";

class Atendimento{

    constructor(){
        
    }

    adiciona(atendimento, resp){

        const dataCriacao = moment().format("YYYY-MM-DD HH:MM:SS");
        const data = this.manipulaData(atendimento);
        
        const validacoes = this.validaCampos(data, dataCriacao, atendimento);
        const errors = validacoes.filter(campo => !campo.valido);
        const existemErrors = errors.length;

        if (existemErrors) {
            return new Promise((resolve, reject) =>{
                reject(errors);
            });
        }else{
            
            const atendimentoDatado = {...atendimento, data, dataCriacao};
            return repository.adiciona(atendimentoDatado)
            .then((results) =>{
                return (atendimentoDatado);
            }).catch((errors) =>{
                return errors;
            });
        }
        
    }

    listagem(){
        return repository.listagem();
    }
    buscaPorId(id, resp){
        const query = `SELECT * FROM Atendimentos WHERE id = ?`;

        db.get(query, [id], async (err, row) =>{
            const cpf = row.cliente;
            
            if (err) {
                return resp.status(400).json(err.message);
            }
            const {data} = await axios.get(serverAxios + cpf);
            row.cliente = data;
            return resp.status(200).json(row);
        });
    }
    update(id, status, resp){

        const query = "UPDATE Atendimentos SET status = ? WHERE id = ?";

        db.run(query, [status, id], (err, results) =>{
            if (err) {
                return resp.status(400).json(err.message);
            }
            this.buscaPorId(id, resp)
        });
    }
    remove(id, resp){
        const query = "DELETE FROM Atendimentos WHERE id = ?";

        db.run(query, [id], (err) =>{
            if (err) {
                return resp.status(400).json(err.message);
            }
            return resp.status(200).send("DELETED");
        });
    }


    validaCampos(data, dataCriacao, atendimento) {
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;
        const validacoes = [
            {
                nome: "data",
                valido: dataEhValida,
                mensagem: "Data deve ser maior ou igual a data atual"
            },
            {
                nome: "cliente",
                valido: clienteEhValido,
                mensagem: "Cliente precisa ter pelo menos 5 chars"
            }
        ];
        return validacoes;
    }

    manipulaData(atendimento) {
        return moment(atendimento.data, "DD/MM/YYYY").format("YYYY-MM-DD HH:MM:SS");
    }
}

module.exports = new Atendimento();