const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// ==============================
// Middleware
// ==============================

app.use(cors());

app.use(express.json());


// ==============================
// Models
// ==============================

const User = require("./models/user");
const Child = require("./models/Child");
const Vaccine = require("./models/Vaccine");
const Reminder = require("./models/Reminder");


// ==============================
// Routes
// ==============================

const userRoutes = require("./routes/userRoutes");
const childRoutes = require("./routes/childRoutes");
const vaccineRoutes = require("./routes/vaccineRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const adminRoutes = require("./routes/adminRoutes");


// ==============================
// API Routes
// ==============================

app.use("/api/users", userRoutes);

app.use("/api/children", childRoutes);

app.use("/api/vaccines", vaccineRoutes);

app.use("/api/reminders", reminderRoutes);

app.use("/api/admin", adminRoutes);


// ==============================
// Home Route
// ==============================

app.get("/", (req, res) => {

    res.send("E-Vaccine Reminder API is working");

});


// ==============================
// MongoDB Connection
// ==============================

mongoose.connect(
    "mongodb://127.0.0.1:27017/e_vaccine_reminder"
)

.then(() => {

    console.log("MongoDB connected successfully");


    app.listen(5000, () => {

        console.log(
            "Server running on http://localhost:5000"
        );

    });

})


.catch((error) => {

    console.log("MongoDB connection failed");

    console.log(error);

});