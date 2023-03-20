// * importing express
const express = require("express");

// * objectId
const { ObjectId } = require("mongodb");

// * middleware
const getUser = require("../middleware/getUser");

// * to use router and define routes
const router = express.Router();

// * importing schema to generate queries
const Election = require("../models/Election");

// ! get elections
router.get("/get-elections", getUser, async (req, res) => {
  try {
    let success = false;

    // * getting election
    let elections = await Election.find();

    success = true;
    return res.status(200).json({ success, elections });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! create election
router.post("/admin/create-election", getUser, async (req, res) => {
  try {
    let success = false;

    // * getting agenda and info
    const { agenda, info } = req.body;

    // * creating election
    let election = await Election.create({
      agenda,
      info,
    });

    success = true;
    return res.json({
      success,
      message: "Election Created Successfully",
      election,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! add candidate
router.put("/admin/add-candidate/:id", getUser, async (req, res) => {
  try {
    let success = false;

    // * getting candidate from body
    const { candidate } = req.body;

    // * finding election
    let election = await Election.findById(req.params.id);

    // * if election not found
    if (!election) {
      return res.status(404).json({ success, error: "Election Not Found" });
    }

    // * checking for valid state
    if (election.status !== "Created") {
      return res.json({ success, error: "Invalid state of election" });
    }

    // * find candidate here to prevent same email id of different candidates
    let candidateExist = await Election.findOne({
      _id: req.params.id,
      "candidates.email": candidate.email,
    });

    // * if candidate already exist
    if (candidateExist) {
      return res.json({
        success,
        error: "Candidate with the same email exists.",
      });
    }

    // * copying to update
    let newElection = election;

    // * adding candidate to the copy
    if (candidate) newElection.candidates.push(candidate);

    // * updating election by replacing
    election = await Election.findByIdAndUpdate(
      req.params.id,
      { $set: newElection },
      { new: true }
    );

    success = true;
    return res.json({
      success,
      message: "Candidate Added Successfully",
      candidate,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! remove candidate
router.delete(
  "/admin/remove-candidate/:electionId/:candidateId",
  getUser,
  async (req, res) => {
    try {
      let success = false;

      // * removing candidate
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
router.put("/admin/update-election/:id", getUser, async (req, res) => {
  try {
    let success = false;

    // getting election
    let election = await Election.findById(req.params.id);

    // * if election doesn't exist
    if (!election) {
      return res.json({ success, error: "Election doesn't exists" });
    }

    // * getting agenda and info from body
    const { agenda, info } = req.body;

    // * empty object and adding value to it
    let newElection = {};
    if (agenda) newElection.agenda = agenda;
    if (info) newElection.info = info;

    // * updating election
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

// ! election state
router.put("/admin/change-status/:electionId", getUser, async (req, res) => {
  try {
    let success = false;

    // updating status conditionally
    let election = await Election.updateOne([
      {
        $set: {
          status: {
            $cond: {
              if: { $eq: ["$status", "Created"] },
              then: "Started",
              else: {
                $cond: {
                  if: { $eq: ["$status", "Started"] },
                  then: "Ended",
                  else: "Created",
                },
              },
            },
          },
        },
      },
    ]);

    // * if winner is needed, finding and setting winner
    if (req.body.winner) {
      let winnerCandidate = await Election.aggregate([
        { $match: { _id: ObjectId(req.params.electionId) } },
        { $unwind: "$candidates" },
        { $sort: { "candidates.votesReceived": -1 } },
        { $limit: 1 },
        {
          $project: {
            _id: "$candidates._id",
            name: "$candidates.name",
            email: "$candidates.email",
            votesReceived: "$candidates.votesReceived",
          },
        },
      ]);

      await Election.updateOne(
        {
          _id: ObjectId(req.params.electionId),
          status: "Ended",
        },
        { $set: { winner: winnerCandidate } }
      );

      success = true;
      return res.json({ success, election });
    }

    success = true;
    return res.json({ success, message: `Election State updated` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! delete election
router.delete("/admin/delete-election/:id", getUser, async (req, res) => {
  try {
    let success = false;

    // * deleting election
    await Election.findByIdAndDelete(req.params.id);

    success = true;
    return res.json({ success, message: "Election Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * exporting to use
module.exports = router;
