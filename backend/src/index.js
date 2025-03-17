import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import mongoose, { connect } from "mongoose";
//auth
import authRoutes from "./routes/auth/auth.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
