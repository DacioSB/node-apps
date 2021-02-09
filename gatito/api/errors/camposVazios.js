class camposVazios extends Error{
    constructor(){
        super("Nao foram fornecidos dados para atualizar");
        this.name = "CamposVazios";
        this.idErro = 2;
    }
}
module.exports = camposVazios;