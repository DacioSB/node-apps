const ConteudoNaoSuportado = require("./errors/ConteudoNaoSuportado");
const toXML = require("jsontoxml");
class Serializer{
    
    serializar(dados){
        dados = this.filtrarArrayOuObjeto(dados);
        if (this.contentType === "application/json") {
            return JSON.stringify(dados);
        }
        if (this.contentType === "application/xml") {
            return this.xml(dados);
        }
        if (this.contentType === "text/plain") {
            return dados;
        }
        throw new ConteudoNaoSuportado(this.contentType);
    }
    xml(dados){
        let tag = this.tagSingular;
        if (Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map((dado) =>{
                return {[this.tagSingular]: dado};
            });
        }
        return toXML({[tag]: dados});
    }
    filtrar(dados){
        
        const fornecedorDTO ={ };
        this.camposPublicos.forEach((campo) =>{
            if (dados.hasOwnProperty(campo)) {
                fornecedorDTO[campo] = dados[campo];
            }
        });
        return fornecedorDTO; 
    }
    filtrarArrayOuObjeto(dados){
        if (Array.isArray(dados)) {
            dados = dados.map(item => this.filtrar(item));
        }else{
            dados = this.filtrar(dados);
        }
        return dados;
    }
}
class SerializerFornecedor extends Serializer{
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = ["id", "empresa", "categoria"].concat(camposExtras || []);
        this.tagSingular = "fornecedor";
        this.tagPlural = "fornecedores";        
    }
}
class SerializerProduto extends Serializer{
    constructor(contentType, camposExtras){
        super();
        this.contentType = contentType;
        this.camposPublicos = ["id", "titulo"].concat(camposExtras || []);
        this.tagSingular = "produto";
        this.tagPlural = "produtos";
    }
}

module.exports = {
    Serializer: Serializer,
    formatosAceitos: ["application/json", "application/xml", "text/plain"],
    SerializerFornecedor: SerializerFornecedor,
    SerializerProduto: SerializerProduto
};