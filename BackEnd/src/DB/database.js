if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "./config/.env",
    });
  }
  
  const mongoose = require("mongoose")
  const connectDatabase = async () => {
    console.log(process.env.DB_URL);
    return mongoose.connect(process.env.DB_URL)
      .then((data) => {
        console.log(
          `Database is connected Successfully: ${data.connection.host}`
        );
      })
      .catch((err) => console.log("Database connection Failed...", err));
  };
  
  module.exports = connectDatabase;