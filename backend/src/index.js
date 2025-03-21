import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

//auth
import authRoutes from "./routes/auth/auth.route.js";

//admin
import symptomRoutes from "./routes/admins/symptom.route.js";

//vishmitha
import symptomCheckerRouters from "./routes/vishmitha/symptomChecker.route.js";

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
app.use("/api/admin", symptomRoutes);

app.use("/api/symptom-checker", symptomCheckerRouters);

app.listen(PORT, () => {
  console.log("Server is running on PORT:" + PORT);
  connectDB();
});
