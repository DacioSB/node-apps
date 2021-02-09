const {Router} = require("express");
const NivelController = require("../controllers/NivelControllers");

const router = Router();

router.get("/niveis", NivelController.findAll);
router.get("/niveis/:id", NivelController.findOne);
router.post("/niveis", NivelController.insert);
router.put("/niveis/:id", NivelController.update);
router.delete("/niveis/:id", NivelController.delete);

module.exports = router;