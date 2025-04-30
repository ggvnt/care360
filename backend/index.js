import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import doctorRoutes from "./routes/doctorRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = "mongodb+srv://vishmithanipun80:wofI0RIjHg4YBPYu@cluster0.r01bd.mongodb.net/care360_db?retryWrites=true&w=majority&appName=Cluster0"; 

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Routes
app.use("/api/doctors", doctorRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});