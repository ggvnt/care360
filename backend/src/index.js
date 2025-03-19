import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

//auth
import authRoutes from "./routes/auth/auth.route.js";
import userAppointmentRoutes from "./routes/user.appointment.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//  Middleware
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.use("/api/auth", authRoutes);
app.use("/api/my/appointments", userAppointmentRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
