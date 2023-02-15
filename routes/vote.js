// /user/vote/electionID/candidateID
const express = require("express");
const router = express.Router();
const Election = require("../models/Election");

router.put("/:electionId/:candidateId", async (req, res) => {
  try {
    let success = false;
    const { voter } = req.body;

    let voterExist = await Election.findOne({
      _id: req.params.electionId,
      "voters.email": voter.email,
    });

    if (voterExist) {
      return res.json({
        success,
        error: "You have already voted",
      });
    }

    let election = await Election.updateOne(
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
