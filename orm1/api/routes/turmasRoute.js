const {Router} = require("express");
const TurmaController = require("../controllers/TurmaController");

const router = Router();

router.get("/turmas", TurmaController.findAll);
router.get("/turmas/:id", TurmaController.findOne);
router.post("/turmas", TurmaController.insert);
router.put("/turmas/:id", TurmaController.update);
router.delete("/turmas/:id", TurmaController.delete);

module.exports = router;