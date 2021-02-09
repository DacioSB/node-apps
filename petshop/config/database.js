const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("data.db");

const ATENDIMENTOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS Atendimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    cliente VARCHAR(11) NOT NULL, 
    pet VARCHAR(255), 
    servico VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    observacoes TEXT,
    data datetime NOT NULL,
    dataCriacao datetime NOT NULL
)
`;
const PET_SCHEMA = `
CREATE TABLE IF NOT EXISTS Pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    nome VARCHAR(50), 
    imagem VARCHAR(255) 
)
`;

db.serialize(() =>{
    db.run("PRAGMA foreign_keys=ON");
    db.run(ATENDIMENTOS_SCHEMA);
    db.run(PET_SCHEMA);
});

process.on("SIGINT", () =>{
    db.close(() =>{
        console.log('BD encerrado!');
        process.exit(0);
    })
});
module.exports = db;