const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// ✅ Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Static files (e.g., images)
app.use("/images", express.static(path.join("backend/images")));

// ✅ CORS Headers Setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",  
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  // ✅ Respond to preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

// ✅ API Routes
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

// ✅ MongoDB Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

connectDb();

module.exports = app;
