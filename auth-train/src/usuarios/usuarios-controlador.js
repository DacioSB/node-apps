const Usuario = require("./usuarios-modelo");
const { InvalidArgumentError, InternalServerError } = require("../erros");
const tokens = require("./tokens");
const { EmailVerificacao } = require("./emails");

function generateAddress(route, token) {
    const baseURL = process.env.URL_EMAIL;
    return `${baseURL}${route}${token}`;
}

module.exports = {
    async adiciona(req, res) {
        const { nome, email, senha } = req.body;

        try {
            const usuario = new Usuario({
                nome,
                email,
                emailVerificado: false,
            });

            await usuario.addSenha(senha);
            await usuario.adiciona();

            const token = tokens.verificaEmail.create(usuario.id);

            const address = generateAddress("/usuario/verify_email/", token);
            const emailVerify = new EmailVerificacao(usuario, address);
            emailVerify.sendEmail().catch(console.log);

            res.status(201).json();
        } catch (erro) {
            if (erro instanceof InvalidArgumentError) {
                res.status(422).json({ erro: erro.message });
            } else if (erro instanceof InternalServerError) {
                res.status(500).json({ erro: erro.message });
            } else {
                res.status(500).json({ erro: erro.message });
            }
        }
    },
    async login(req, res) {
        try {
            const accessToken = tokens.access.create(req.user.id);
            const refreshToken = await tokens.refresh.create(req.user.id);
            res.set("Authorization", accessToken);
            console.log(refreshToken);
            res.status(200).send({ refreshToken });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async logout(req, res) {
        try {
            const token = req.token;
            await tokens.access.invalidateToken(token);
            res.status(204).send();
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    },
    async lista(req, res) {
        const usuarios = await Usuario.lista();
        res.json(usuarios);
    },
    async verificaEmail(req, res) {
        try {
            const {token} = req.params;
            const id = await tokens.verificaEmail.verify(token);
            const usuario = await Usuario.buscaPorId(id);
            await usuario.verificaEmail();
            res.status(200).json();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async deleta(req, res) {
        const usuario = await Usuario.buscaPorId(req.params.id);
        try {
            await usuario.deleta();
            res.status(200).send();
        } catch (erro) {
            res.status(500).json({ erro: erro });
        }
    },
};
