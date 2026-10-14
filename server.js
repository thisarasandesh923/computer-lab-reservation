import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("Computer Lab Reservation API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server eka wada machan ${PORT}`);
});