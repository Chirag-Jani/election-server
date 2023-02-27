const Election = require("../models/Election");

const getElectionState = async (req, res, next) => {
  console.log("I am middleware");
  next();
};

module.exports = getElectionState;
