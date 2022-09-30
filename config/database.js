const mongoose = require("mongoose");

const databaseConnect = async () =>
  await mongoose
    .connect(`${process.env.MONGO_DB_URI}`)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });

module.exports = databaseConnect;
