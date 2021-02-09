const conexao = require("./database");

const executaQuery = (query, params = []) =>{
    return new Promise((resolve, reject) =>{
        conexao.run(query, params, (result, err) =>{
            if (err) {
                reject(err);
            }else{
                resolve(result);
            }
        });
    }) 
};

const executaGetAll = (query, params = []) =>{
    return new Promise((resolve, reject) =>{
        conexao.all(query, params, (err, rows) =>{
            if (err) {
                reject(err);
            }else{
                resolve(rows);
            }
        });
    })
};

exports.executaQuery = executaQuery;
exports.executaGetAll = executaGetAll;