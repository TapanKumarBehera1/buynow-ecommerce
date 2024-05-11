const mongoose = require("mongoose");

async function databaseConnect() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB connected");
}

module.exports = databaseConnect;
