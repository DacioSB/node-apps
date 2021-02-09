const fs = require("fs");
const systemPath = require("path");

module.exports = (path, arquivo, callbackImagemCriada) =>{

    const tipo = systemPath.extname(path);
    const tipoEhValido = validaTipo(tipo);

    if (!tipoEhValido) {
        const erro = "Tipo do arquivo é invalido"
        callbackImagemCriada(erro, undefined);
    }else{
        const newPath = `./assets/images/${arquivo}${tipo}`;
    
        fs.createReadStream(path)
        .pipe(fs.createWriteStream(newPath))
        .on("finish", () =>{
            callbackImagemCriada(undefined, newPath);
        });
    }
    
};

function validaTipo(tipo) {
    const tiposValidos = ["jpg", "png", "jpeg"];
    
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1));
    return tipoEhValido !== -1;
}

