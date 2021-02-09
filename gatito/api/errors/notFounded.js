class NotFounded extends Error{

    constructor(){
        super("Recurso nao encontrado");
        this.name = "NaoEncontrado";
        this.idErro = 0;
    }

}
module.exports = NotFounded;