const express = require("express");
const router = express.Router();
const {
  getHybridTraits,
  createHybridTrait,
  updateHybridTrait,
  deleteHybridTrait,
} = require("../controllers/hybridsTraitsController");

router.get("/", getHybridTraits);
//router.post("/", createHybridTrait);
//router.put("/:id", updateHybridTrait);
//router.delete("/:id", deleteHybridTrait);

module.exports = router;