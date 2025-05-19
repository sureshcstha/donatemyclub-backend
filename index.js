require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const connectDB = require("./db/connect");
const PORT = process.env.PORT || 5000;

const stripeWebhook = require('./webhook/stripeWebhook');
app.use('/webhook', stripeWebhook); 

// Global middlewares
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Routes
const clubRoutes = require('./routes/clubRoutes');
const donationRoutes = require('./routes/donationRoutes');

// Health check
app.get("/", (req, res) => {
    res.send("Hi, I am live.")
});

// API routes
app.use('/api/clubs', clubRoutes);
app.use('/api/clubs', donationRoutes);

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`Node server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
  }
};

start();