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
/*router.get("/:id", getPersonByID);
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);*/

module.exports = router;