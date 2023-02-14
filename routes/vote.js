// /user/vote/electionID/candidateID
const express = require("express");
const router = express.Router();
const Election = require("../models/Election");

router.put("/:electionId/:candidateId", async (req, res) => {
  try {
    let success = false;

    let election = await Election.updateOne(
      { _id: req.params.electionId, "candidates._id": req.params.candidateId },
      { $inc: { "candidates.$.votesReceived": 1, totalVotes: 1 } }
    );

    success = true;
    return res.json({ success, election });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
