const mongoose = require("mongoose");

// MongoDB connection function
const connectDB = async (props) => {
  try {
    // connecting to MONGO_URI saved in .env file
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(err);
  }
};

module.exports = connectDB;
