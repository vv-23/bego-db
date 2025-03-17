const express = require("express");
const router = express.Router();
const {
  getSpeciesTraits,
  createSpeciesTrait,
  updateSpeciesTrait,
  deleteSpeciesTraits
} = require("../controllers/speciesTraitsController");

router.get("/", getSpeciesTraits);
router.post("/", createSpeciesTrait);
router.put("/:speciesID&:traitID", updateSpeciesTrait);
// router.delete("/:id", deleteSpeciesTraits);

module.exports = router;