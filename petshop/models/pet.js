const conexao = require("../config/database");
const upload = require("../config/archives/uploadArquivos");

class Pet{
    adiciona(pet, resp){
        const query = `INSERT INTO Pets(nome, imagem) VALUES(?, ?)`;
        upload(pet.imagem, pet.nome, (erro, novoCaminho) =>{
            if (erro){
                resp.status(400).json({erro});
            }else{
                const novoPet = {nome: pet.nome, imagem: novoCaminho};

                conexao.run(query,[
                    novoPet.nome,
                    novoPet.imagem
                ], (error) =>{
                    if (error) {
                    resp.status(400).json(error.message); 
                    }
                    resp.status(201).json(novoPet);
                });
            }
            
        });

        
    }
}

module.exports = new Pet();