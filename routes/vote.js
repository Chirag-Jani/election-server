// * importing express
const express = require("express");

// * to use express router
const router = express.Router();

// * Election Model
const Election = require("../models/Election");

// * to check for auth-token in the header
const getUser = require("../middleware/getUser");

// ! voting
router.put("/:electionId/:candidateId", getUser, async (req, res) => {
  try {
    let success = false;

    // * getting election
    let election = await Election.findById(req.params.electionId);

    // * checking for valid state
    if (election.status !== "Started") {
      return res.json({ success, error: "Invalid state of election" });
    }

    // * getting voter info
    const { voter } = req.body;

    // * checking if voter exist already
    let voterExist = await Election.findOne({
      _id: req.params.electionId,
      "voters.email": voter.email,
    });

    // * if voter already exist
    if (voterExist) {
      return res.json({
        success,
        error: "You have already voted",
      });
    }

    // * adding vote
    election = await Election.updateOne(
      { _id: req.params.electionId, "candidates._id": req.params.candidateId },
      {
        $inc: { "candidates.$.votesReceived": 1, totalVotes: 1 },
        $push: { voters: voter },
      }
    );

    success = true;
    return res.json({ success, message: "Voted Successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
