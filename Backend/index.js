import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Route Imports
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
app.use(cors({
  origin: 'http://localhost:5173', // Matches your Vite frontend
  credentials: true
}));

app.use(express.json());      // For parsing application/json
app.use(cookieParser());    // For parsing cookies

// --- 2. Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB is Connected - Database: blog"))
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });

// --- 3. Routes ---
app.get("/", (req, res) => {
  res.status(200).send("Backend Working");
});

// API Endpoints
app.use("/api/users", userRoutes);
app.use("/api/blogs", postRoutes);
app.use("/api/contact", contactRoutes);

// --- 4. Global Error Handling ---
// Must be the LAST middleware
app.use(errorHandler);

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
