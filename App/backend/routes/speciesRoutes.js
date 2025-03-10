const express = require("express");
const router = express.Router();
const {
  getSpecies,
  createSpecies,
  updateSpecies,
  deleteSpecies
} = require("../controllers/speciesController");

router.get("/", getSpecies);
router.post("/", createSpecies);
router.put("/:id", updateSpecies);
router.delete("/:id", deleteSpecies);

module.exports = router;