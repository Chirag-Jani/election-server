// * getting mongoose
const mongoose = require("mongoose");

// * database url
const mongoUri = "mongodb://localhost:27017/Election";

// * no idea what it is
mongoose.set("strictQuery", false);

// * function to connect to mongodb
const connectToMongoDB = async () => {
  // * calling connect method
  mongoose.connect(mongoUri, () => {
    console.log("MongoDB Connection Successful");
  });
};

// * exporting to use
module.exports = connectToMongoDB;
