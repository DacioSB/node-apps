const {Sequelize} = require("sequelize");

let sequelize = new Sequelize("database_orm", "docin", "123",{
    host: "127.0.0.1",
    dialect: "sqlite",
    pool:{
        max: 5,
        min: 0,
        idle: 10000
    },
    storage: "database.sqlite"
});

module.exports = sequelize;