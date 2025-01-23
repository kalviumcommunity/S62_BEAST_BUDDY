
const path = require('path');
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: path.resolve(__dirname,"./config/.env"),
    });
  }
  
  const app = require("./server.js");
  const connectDatabase = require("./DB/database.js");
  const { connectDB, getDB } = require("./DB/db.js");
  
  const PORT = process.env.PORT;
  
  connectDB();
  
  app.get("/", async (req, res) => {
    try {
      const db = getDB();
      const users = await db.collection("users").find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.log("Error fetching users", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  const server = app.listen(PORT, () => {
    connectDatabase();
    console.log(
      `Server is running in port: ${PORT}, link: http://localhost:${PORT}`
    );
  });
