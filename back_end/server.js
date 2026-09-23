const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Import models
const User = require("./models/User");
const Child = require("./models/Child");
const Vaccine = require("./models/Vaccine");
const Reminder = require("./models/Reminder");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/e_vaccine_reminder")
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error);
    });

// Test API
app.get("/", (req, res) => {
    res.send("E-Vaccine Reminder API is working");
});