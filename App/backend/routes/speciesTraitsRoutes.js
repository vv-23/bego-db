const express = require("express");
const router = express.Router();
const {
  getSpeciesTraits,
  createSpeciesTrait,
  updateSpeciesTrait,
  deleteSpeciesTrait
} = require("../controllers/speciesTraitsController");

router.get("/", getSpeciesTraits);
router.post("/", createSpeciesTrait);
router.put("/:speciesID&:traitID", updateSpeciesTrait);
router.delete("/:speciesID&:traitID", deleteSpeciesTrait);

module.exports = router;