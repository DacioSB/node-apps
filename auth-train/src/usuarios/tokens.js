const crypto = require("crypto");
const moment = require("moment");
const whitelist = require("../../redis/whitelist-refresh-token");
const jwt = require("jsonwebtoken");
const blacklist = require("../../redis/blacklist-access-token");
const { InvalidArgumentError } = require("../erros");

function criaJWT(id, [tempoQuantidade, tempoUnidade]) {
    const payload = { id };

    const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: tempoQuantidade + tempoUnidade,
    });
    return token;
}
async function verificaTokenNaBlacklist(token, blacklist) {
    if (!blacklist) {
        return;
    }
    console.log("ahaha");
    const tokenNaBlackList = await blacklist.contemToken(token);
    if(tokenNaBlackList){
        throw new jwt.JsonWebTokenError("Token Invalido por logout");
    }
}
async function verificaTokenJWT(token, blacklist) {
    await verificaTokenNaBlacklist(token, blacklist);
    const {id} = jwt.verify(token, process.env.JWT_KEY);
    return id;
}

async function criaOpaqueToken(id, [tempoQuantidade, tempoUnidade], whitelist) {
    const opaqueToken = crypto.randomBytes(24).toString("base64");
    const dataExp = moment().add(tempoQuantidade, tempoUnidade).unix();
    await whitelist.adiciona(opaqueToken, id, dataExp);
    return opaqueToken;
}
async function verifyOpaqueToken(token, whitelist, nome) {
    if (!token) {
        throw new InvalidArgumentError(`${nome} Token não enviado`);
    }
    const id = await whitelist.buscaValor(token);
    if (!id) {
        throw new InvalidArgumentError(`${nome} token Invalido`);
    }
    return id;
}

function invalidaTokenJWT(token, blacklist) {
    return blacklist.adiciona(token);
}
async function invalidaTokenOpaco(token, whitelist) {
    await whitelist.deleta(token);
}


module.exports = {
    access: {
        blacklist,
        expiracao: [15, "m"],
        create(id) {
            return criaJWT(id, this.expiracao);
        },
        verify(token){
            return verificaTokenJWT(token, this.blacklist);
        },
        invalidateToken(token){
            return invalidaTokenJWT(token, this.blacklist);
        }
    },
    refresh: {
        nome: "refresh",
        expiracao: [5, "d"],
        whitelist,
        async create(id) {
            return await criaOpaqueToken(id, this.expiracao, this.whitelist);
        },
        verify(token){
            return verifyOpaqueToken(token, this.whitelist, this.nome);
        },
        invalidate(token){
            return invalidaTokenOpaco(token, this.whitelist);
        }
    },
    verificaEmail:{
        nome: "verify",
        expiracao: [1, "h"],
        create(id){
            return criaJWT(id, this.expiracao);
        },
        async verify(token){
            return await verificaTokenJWT(token);
        },
    }
};
