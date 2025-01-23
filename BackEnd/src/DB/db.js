const MongoClient = require("mongodb").MongoClient;

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "../config/.env",
  });
}

const DB_URL = process.env.DB_URL;

var mongoclient = new MongoClient(DB_URL);

let db;

const connectDB = async () => {
  try {
    await mongoclient.connect();
    db = mongoclient.db("BeastBuddy-ASAP");
    console.log("Connected to MongoDB Database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

module.exports = { connectDB, getDB };