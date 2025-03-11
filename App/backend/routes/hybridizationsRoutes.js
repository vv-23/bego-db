const express = require("express");
const router = express.Router();
const {
  getHybridization,
  createHybridization,
  updateHybridization,
  deleteHybridization,
  getHybridizationPretty
} = require("../controllers/hybridizationsController");

router.get("/", getHybridization);
router.get("/pretty", getHybridizationPretty)
router.post("/", createHybridization);
router.put("/:id", updateHybridization);
router.delete("/:id", deleteHybridization);

module.exports = router;