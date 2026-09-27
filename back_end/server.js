const express = require("express");
const mongoose = require("mongoose");

const app = express();


// ================= MIDDLEWARE =================

app.use(express.json());


// ================= MODELS =================

const User = require("./models/user");
const Child = require("./models/Child");
const Vaccine = require("./models/Vaccine");
const Reminder = require("./models/Reminder");


// ================= ROUTES =================

const userRoutes = require("./routes/userRoutes");
const childRoutes = require("./routes/childRoutes");
const vaccineRoutes = require("./routes/vaccineRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const adminRoutes = require("./routes/adminRoutes");


// ================= CONNECT ROUTES =================

// User APIs
app.use("/api/users", userRoutes);

// Child APIs
app.use("/api/children", childRoutes);

// Vaccine APIs
app.use("/api/vaccines", vaccineRoutes);

// Reminder APIs
app.use("/api/reminders", reminderRoutes);

// Admin APIs
app.use("/api/admin", adminRoutes);


// ================= HOME ROUTE =================

app.get("/", (req, res) => {
    res.send("E-Vaccine Reminder API is working");
});


// ================= MONGODB CONNECTION =================

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