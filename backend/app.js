const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('../backend/models/post');
require('dotenv').config();
const postRoutes = require('./routes/posts');
const path = require("path");  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connectDb = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Successfull");
  } catch (error){
    console.error("Error connecting MongoDB ", error.message);
  }
}

connectDb();

app.use("/images", express.static(path.join("backend/images")));  

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  app.use("/api/posts",postRoutes);

  // ✅ Handle preflight (OPTIONS) request properly
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

module.exports = app;