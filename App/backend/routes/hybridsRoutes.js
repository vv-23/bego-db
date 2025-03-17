const express = require("express");
const router = express.Router();
const {
  getHybrids,
  getHybridsNames,
  createHybrid,
  updateHybrid,
  deleteHybrid,
  hybridizationIDs
} = require("../controllers/hybridsController");

router.get("/", getHybrids);
router.get("/hybridizations", hybridizationIDs);
router.get("/names", getHybridsNames);
router.post("/", createHybrid);
router.put("/:id", updateHybrid);
router.delete("/:id", deleteHybrid);

module.exports = router;