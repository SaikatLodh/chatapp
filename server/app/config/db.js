const mongoose = require("mongoose");
const dbName = require("./constants");

const connectDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL + "/" + dbName);

    if (db) {
      console.log("Database connected");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDb;
