const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("./usuarios-modelo");
const bcrypt = require("bcrypt");
const BearerStrategy = require("passport-http-bearer").Strategy;
const tokens = require("./tokens");

const {InvalidArgumentError} = require("../erros");

function verificaUser(usuario) {
    if (!usuario) {
        throw new InvalidArgumentError("Nao existe usuario com esse email");
    }
}
async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if (!senhaValida) {
        throw new InvalidArgumentError("Email ou senha invalidos");
    }
}

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "senha",
        session: false
    }, async (email, senha, next) =>{
        try {
            const usuario = await Usuario.buscaPorEmail(email);
            verificaUser(usuario);
            await verificaSenha(senha, usuario.senhaHash);
            next(null, usuario);
        } catch (error) {
            next(error);
        }
        

    })
);

passport.use(
    new BearerStrategy(async (token, next) =>{
        try {
            const id = await tokens.access.verify(token);
            const usuario = await Usuario.buscaPorId(id);
            next(null, usuario, {token});
        } catch (error) {
            next(error);
        }
        
    })
);