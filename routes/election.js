// * importing express
const express = require("express");

// * to use router and define routes
const router = express.Router();

// * importing schema to generate queries
const Election = require("../models/Election");

// * defining endpoints
router.get("/", async (req, res) => {
  res.send("Hi");
});

// * exporting to use
module.exports = router;
