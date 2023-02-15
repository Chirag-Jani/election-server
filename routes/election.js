// * importing express
const express = require("express");

// * to use router and define routes
const router = express.Router();

// * importing schema to generate queries
const Election = require("../models/Election");

// ! get elections
router.get("/getelections", async (req, res) => {
  try {
    let success = false;

    let elections = await Election.find();

    success = true;
    return res.status(200).json({ success, elections });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! create election
router.post("/admin/create-election", async (req, res) => {
  try {
    let success = false;

    const { agenda, info, candidates } = req.body;

    let election = await Election.create({
      agenda,
      info,
      candidates,
    });

    success = true;
    return res.json({ success, message: "Election Created Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! add candidate
router.put("/admin/createelection/:id", async (req, res) => {
  try {
    let success = false;

    const { candidate } = req.body;

    // * find candidate here to prevent same email id of different candidates
    let candidateExist = await Election.findOne({
      _id: req.params.id,
      "candidates.email": candidate.email,
    });

    if (candidateExist) {
      return res.json({
        success,
        error: "Candidate with the same email exists.",
      });
    }

    let election = await Election.findById(req.params.id);
    let newElection = election;
    if (candidate) newElection.candidates.push(candidate);

    if (!election) {
      return res.status(404).json({ success, error: "Election Not Found" });
    }

    election = await Election.findByIdAndUpdate(
      req.params.id,
      { $set: newElection },
      { new: true }
    );

    success = true;
    return res.json({ success, message: "Candidate Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! update election info
router.put("/admin/updateelection/:id", async (req, res) => {
  try {
    let success = false;
    let election = await Election.findById(req.params.id);
    const { agenda, info, candidates } = req.body;

    let newElection = {};
    if (agenda) newElection.agenda = agenda;
    if (info) newElection.info = info;
    if (candidates) newElection.candidates = candidates;

    election = await Election.findOneAndUpdate(
      req.params.id,
      { $set: newElection },
      { new: true }
    );

    success = true;
    return res.json({ success, message: "Election Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! delete election
router.delete("/admin/deleteelection/:id", async (req, res) => {
  try {
    let success = false;

    let election = await Election.findByIdAndDelete(req.params.id);

    success = true;
    return res.json({ success, message: "Election Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * exporting to use
module.exports = router;
