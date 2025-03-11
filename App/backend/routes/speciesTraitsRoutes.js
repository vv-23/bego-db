const express = require("express");
const router = express.Router();
const {
  getSpeciesTraits,
  createSpeciesTraits,
  updateSpeciesTraits,
  deleteSpeciesTraits
} = require("../controllers/speciesTraitsController");

router.get("/", getSpeciesTraits);
// router.post("/", createSpeciesTraits);
// router.put("/:id", updateSpeciesTraits);
// router.delete("/:id", deleteSpeciesTraits);

module.exports = router;