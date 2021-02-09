const Pet = require("../models/pet");

const express = require("express");
const router = express.Router();

router.post("/pets", (req, res) =>{
    Pet.adiciona(req.body, res);
});

module.exports = router;