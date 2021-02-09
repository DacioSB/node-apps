const Atendimento = require("../models/atendimento"); 

const express = require("express");
const router = express.Router();

router.get("/atendimentos", (req, resp) =>{
    Atendimento.listagem().then((results) =>{
        resp.status(200).json(results);
    }).catch((error) =>{
        resp.status(500).json(error);
    });
});

router.get("/atendimentos/:id", (req, resp) =>{
    const id = parseInt(req.params.id);
    Atendimento.buscaPorId(id, resp);
});

router.post("/atendimentos", (req, resp) =>{
    const atendimento = req.body;

    Atendimento.adiciona(atendimento)
        .then(atendimentoCadastrado => resp.status(201).json(atendimentoCadastrado))
        .catch((error) =>{resp.status(400).json({error})});
});

router.put("/atendimentos/:id", (req, resp) =>{
    const id = parseInt(req.params.id);
    const status = req.body.status;

    Atendimento.update(id, status, resp);
});

router.delete("/atendimentos/:id", (req, resp) =>{
    const id = parseInt(req.params.id);

    Atendimento.remove(id, resp);
})


module.exports = router;