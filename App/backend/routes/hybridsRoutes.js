const express = require("express");
const router = express.Router();
const {
  getHybrids,
  createHybrid,
  updateHybrid,
  deleteHybrid
} = require("../controllers/hybridsController");

router.get("/", getHybrids);
router.post("/", createHybrid);
router.put("/:id", updateHybrid);
router.delete("/:id", deleteHybrid);

module.exports = router;