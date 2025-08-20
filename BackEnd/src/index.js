const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDatabase = require("./DB/database.js");
const quizRouter = require("./routes/quizRoute.js");
const authRouter = require("./routes/userAuth.js");

const app = express();

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: path.resolve(__dirname, "./config/.env"),
  });
}

app.use(cors());
app.use(express.json());

app.use("/quiz", quizRouter);
app.use("/auth", authRouter);

app.get("/ping", (req, res) => {
  res.send("Welcome to BeastBuddy backend");
});

const PORT = process.env.PORT || 5000;
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
