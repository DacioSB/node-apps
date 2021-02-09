const Sequelize = require("sequelize");
const database = require("../database/database");

const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fornecedor:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require("./fornecedorSequelize"),
            key: "id"
        }
    }
};

const opcoes = {
    freezeTableName: true,
    tableName: "produtos",
    timestamps: true,
    createdAt: "dataCriacao",
    updatedAt: "dataAtualizacao",
    version: "versao"
};

module.exports = database.define("produto", colunas, opcoes);