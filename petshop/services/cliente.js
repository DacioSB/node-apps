const express = require("express");

const app = new express();
const faker = require("faker");

app.use(express.json());

app.get("/:cpf", (req, res)=>{
    const {cpf} = req.params;

    res.status(200).json({
        cpf,
        nome: faker.name.findName(),
        aniversario: faker.date.past()
    });
});

app.listen(8082, () => console.log("Faker rodando"));