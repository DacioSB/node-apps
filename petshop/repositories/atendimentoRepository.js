const query = require("../config/queries");

class AtendimentoRepository{
    adiciona(atendimento){
        const sql = `
            INSERT INTO ATENDIMENTOS(cliente, pet, servico, status, observacoes, data, dataCriacao) 
            values(?, ?, ?, ?, ?, ?, ?)
            `;
        const params = [
            atendimento.cliente,
            atendimento.pet,
            atendimento.servico,
            atendimento.status,
            atendimento.observacoes,
            atendimento.data,
            atendimento.dataCriacao
        ];
        return query.executaQuery(sql, params);
    }
    listagem(){
        const sql = "SELECT * FROM Atendimentos";
        
        return query.executaGetAll(sql, []);
    }
}

module.exports = new AtendimentoRepository();