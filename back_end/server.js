const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

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

const defaultVaccines = [
    {
        vaccineName: "BCG",
        description: "Protects against tuberculosis.",
        recommendedAge: "At birth",
        doseNumber: 1
    },
    {
        vaccineName: "Polio",
        description: "Protects against poliovirus.",
        recommendedAge: "At birth to 5 years",
        doseNumber: 4
    },
    {
        vaccineName: "DTP",
        description: "Protects against diphtheria, tetanus, and pertussis.",
        recommendedAge: "6 weeks to 5 years",
        doseNumber: 5
    },
    {
        vaccineName: "Hepatitis B",
        description: "Protects against hepatitis B infection.",
        recommendedAge: "At birth to 6 months",
        doseNumber: 3
    },
    {
        vaccineName: "Measles, Mumps and Rubella (MMR)",
        description: "Protects against measles, mumps, and rubella.",
        recommendedAge: "9 months to 6 years",
        doseNumber: 2
    }
];

async function seedDefaultVaccines() {
    const existingNames = await Vaccine.find({
        vaccineName: { $in: defaultVaccines.map((vaccine) => vaccine.vaccineName) }
    }).distinct("vaccineName");

    const missingVaccines = defaultVaccines.filter(
        (vaccine) => !existingNames.includes(vaccine.vaccineName)
    );

    if (missingVaccines.length > 0) {
        await Vaccine.insertMany(missingVaccines);
        console.log(`${missingVaccines.length} default vaccines added`);
    }
}


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

    return seedDefaultVaccines();

})

.then(() => {

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