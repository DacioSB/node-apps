const redis = require("redis");
const manipulaLista = require("./handleList");
const whitelist = redis.createClient({
    prefix: "whitelist-refresh-token:",

});
module.exports = manipulaLista(whitelist);
