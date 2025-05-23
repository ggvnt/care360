import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data


// Routes
import authRoutes from "./routes/auth/auth.route.js";
import symptomRoutes from "./routes/admins/symptom.route.js";
import doctorRoutes from "./routes/doctor/doctorRoutes.js";
// import symptomRoutes from "./routes/admins/symptom.route.js";
import doctorRoutes from "./routes/doctor/doctorRoutes.js";
import symptomCheckerRoutes from "./routes/symptomChecker.routes.js";




// import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentsRoutes from "./routes/user.appointment.route.js";

app.use("/api/auth", authRoutes);
// app.use("/api/admin", symptomRoutes);
// app.use("/api/doctors", doctorRoutes);
app.use("/api/symptoms", symptomCheckerRoutes); 
app.use("/api/appointments", appointmentsRoutes);


// Start Server
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
