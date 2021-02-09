class ConteudoNaoSuportado extends Error{

    constructor(contentType){
        super(`Conteudo ${contentType} Nao Suportado`);
        this.name = "NaoSuportado";
        this.idErro = 3;
    }

}
module.exports = ConteudoNaoSuportado;