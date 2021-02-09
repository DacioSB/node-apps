const {Router} = require("express");
const PessoaController = require("../controllers/PessoaController");
const router = Router();

router.get("/pessoas/active", PessoaController.findAllActive);
router.get("/pessoas", PessoaController.findAll);
router.get("/pessoas/:estudanteId/matricula", PessoaController.pegaMatriculas);
router.get("/pessoas/matricula/:turmaId/confirmadas", PessoaController.pegaMatriculasPorTurma)
router.get("/pessoas/matricula/lotada", PessoaController.pegaTurmasLotadas)
router.get("/pessoas/:id", PessoaController.findOne);
router.post("/pessoas", PessoaController.insert);
router.put("/pessoas/:id", PessoaController.update);
router.put("/pessoas/:estudanteId/cancela", PessoaController.cancela);
router.delete("/pessoas/:id", PessoaController.delete);
router.get("/pessoas/:estudanteId/matricula/:matriculaId", PessoaController.findMatricula);
router.post("/pessoas/:estudanteId/matricula", PessoaController.insertMatricula);
router.put("/pessoas/:estudanteId/matricula/:matriculaId", PessoaController.updateMatricula);
router.delete("/pessoas/:estudanteId/matricula/:matriculaId", PessoaController.deleteMatricula);
router.put("/pessoas/:id/restore", PessoaController.restore);

module.exports = router;