const express = require("express");
const router = express.Router();
const {
  getTrait,
  createTrait,
  updateTrait,
  deleteTrait
} = require("../controllers/traitsController");

router.get("/", getTrait);
router.post("/", createTrait);
router.put("/:id", updateTrait);
router.delete("/:id", deleteTrait);

module.exports = router;