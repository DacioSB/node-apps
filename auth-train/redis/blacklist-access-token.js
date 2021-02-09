const redis = require("redis");
const blacklist = redis.createClient({
    prefix: "blacklist:",

});
const handleList = require("./handleList");
const handleBlocklist = handleList(blacklist);

const jwt = require("jsonwebtoken");
const {createHash} = require("crypto");
//Guarda no bd em vez do token (que pode mudar de tamanho)
//um hash dele que vai ter um tamanho constante sempre
//tokenhash vai ser a chave e "" vai ser o valor
function geraTokenHash(token) {
    return createHash("sha256").update(token).digest("base64");
}

module.exports = {
    adiciona: async token =>{
        const tokenExp = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await handleBlocklist.adiciona(tokenHash, "", tokenExp);
    },
    contemToken: async token =>{
        const tokenHash = geraTokenHash(token);
        return await handleBlocklist.contemToken(tokenHash);
    }
};