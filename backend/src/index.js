import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import prisma from "./db.js";
import routes from "./route/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Iali Backend API is running",
    status: "healthy",
  });
});

// API Routes
app.use("/api", routes);

// 404 Not Found Handler for Unmatched Routes
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Backend server running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log("Database connected successfully (Neon PostgreSQL)");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
});