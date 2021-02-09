const nodemailer = require("nodemailer");

const configEmailProd = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASS
    },
    secure: true
};

const configEmailTest = (testAccount) => ({
    host: "smtp.ethereal.email",
    auth: testAccount,
});

async function criaConfigEmail() {
    if (process.env.NODE_ENV === "production") {
        return configEmailProd;
    }else{
        const testAccount = await nodemailer.createTestAccount();
        return configEmailTest(testAccount);
    }
}

class Email {

    async sendEmail() {
        const configEmail = await criaConfigEmail();
        const transporter = nodemailer.createTransport(configEmail);
        const info = await transporter.sendMail(this);

        const emailLink = await nodemailer.getTestMessageUrl(info);
        if (process.env.NODE_ENV !== "production") {
            console.log(emailLink);
        }
    }
}

class EmailVerificacao extends Email{
    constructor(user, address){
        super();
        this.from = '"Blog do Docinho" <noreply@docinho.com.br>';
        this.to = user.email;
        this.subject = "Verificacao de Email";
        this.text = `Olá! Verifique seu email aqui: ${address}`;
        this.html = `<h1>Olá!</h1> Verifique seu email aqui: <a href=${address}>${address}</a>`;
    }
}

module.exports = { EmailVerificacao };
