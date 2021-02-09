'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pessoas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pessoas.hasMany(models.Turmas, {
        foreignKey: "docente_id"
      });
      Pessoas.hasMany(models.Matriculas, {
        foreignKey: "estudante_id",
        scope: {
          status: "confirmado"
        },
        as: "aulasMatriculadas"
      });
    }
  };
  Pessoas.init({
    nome: {
      type: DataTypes.STRING,
      validate: {
        funcaoValida: function (data) {
          if (data.length < 3) {
            throw new Error("nome precisa ser maior que 3");
          }
        }
      }
    },
    ativo: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "dados de email são invalidos"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pessoas',
    paranoid: true,
    defaultScope: {
      where: {
        ativo: true
      }
    },
    scopes:{
      all:{
        where: {}
      },
      //etc:{constraint}
    }
  });
  return Pessoas;
};