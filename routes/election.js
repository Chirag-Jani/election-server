// * importing express
const express = require("express");
const getElectionState = require("../middleware/getElectionState");

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
router.put("/admin/add-candidate/:id", async (req, res) => {
  try {
    let success = false;
    const { candidate } = req.body;
    let election = await Election.findById(req.params.id);

    if (election.status !== "Created") {
      return res.json({ success, error: "Invalid state of election" });
    }

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

// ! remove candidate
router.delete(
  "/admin/remove-candidate/:electionId/:candidateId",
  async (req, res) => {
    try {
      let success = false;

      let election = await Election.updateOne(
        { _id: req.params.electionId },
        { $pull: { candidates: { _id: req.params.candidateId } } }
      );

      success = true;
      return res.json({ success, message: "Candidate Removed Successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ! update election info
router.put("/admin/update-election/:id", async (req, res) => {
  try {
    let success = false;
    let election = await Election.findById(req.params.id);

    if (!election) {
      return res.json({ success, error: "Election doesn't exists" });
    }

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

// ! start/end election
router.put("/admin/change-status/:electionId", async (req, res) => {
  try {
    let success = false;

    let election = await Election.updateOne(
      { _id: req.params.electionId },
      {
        status: req.body.status,
      }
    );

    if (req.body.status == "Ended") {
      // finding winner
      let candidates = await Election.find(
        {
          _id: req.params.electionId,
        },
        {
          candidates: 1,
        }
      );

      success = true;
      return res.json({ success, candidates });
    }

    // let election = await Election.updateOne({ _id: req.params.electionId }, [
    //   {
    //     $set: {
    //       status: {
    //         $eq: ["$status", "Created"],
    //       },
    //       status: "Started",
    //     },
    //     $set: {
    //       status: {
    //         $eq: ["$status", "Started"],
    //       },
    //       status: "Ended",
    //     },
    //     $set: {
    //       status: {
    //         $eq: ["$status", "Ended"],
    //       },
    //       status: "Created",
    //     },
    //   },
    // ]);

    success = true;
    return res.json({ success, message: `Election ${req.body.status}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! delete election
router.delete("/admin/delete-election/:id", async (req, res) => {
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
