const express = require("express");
const router = express.Router();
const {
  getHybridsTraits,
  createHybridTrait,
  updateHybridTrait,
  deleteHybridTrait,
} = require("../controllers/hybridsTraitsController.js");

router.get("/", getHybridsTraits);
router.post("/", createHybridTrait);
router.put("/:hybridID&:traitID", updateHybridTrait);
router.delete("/:hybridID&:traitID", deleteHybridTrait);

module.exports = router;