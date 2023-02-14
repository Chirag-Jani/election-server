// * importing to create schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// * defining schema
const electionSchema = Schema({
  status: {
    type: String,
    required: true,
    default: "Created",
  },
  agenda: {
    type: String,
    required: true,
    unique: true,
  },
  info: {
    type: String,
    required: true,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  candidates: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      votesReceived: {
        type: Number,
        default: 0,
      },
    },
  ],
  voters: [
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
    },
  ],
  winner: {
    name: {
      type: String,
      required: true,
      default: "N/A",
    },
  },
});

// * creating collection
const election = mongoose.model("elections", electionSchema);

// * exporting to use
module.exports = election;
