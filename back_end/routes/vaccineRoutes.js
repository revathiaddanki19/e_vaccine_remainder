const express = require("express");
const Vaccine = require("../models/Vaccine");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// Admin Check
// ==============================

function checkAdmin(req, res, next) {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            message: "Access denied. Admin only."
        });

    }

    next();
}


// ==============================
// Add Vaccine
// Admin Only
// ==============================

router.post(
    "/add",
    authenticateToken,
    checkAdmin,
    async (req, res) => {

        try {

            const {
                vaccineName,
                description,
                recommendedAge,
                doseNumber
            } = req.body;


            const vaccine = new Vaccine({

                vaccineName: vaccineName,

                description: description,

                recommendedAge: recommendedAge,

                doseNumber: doseNumber

            });


            await vaccine.save();


            res.status(201).json({

                message: "Vaccine added successfully",

                vaccine: vaccine

            });


        } catch (error) {

            res.status(500).json({

                message: "Failed to add vaccine",

                error: error.message

            });

        }

    }
);


// ==============================
// View Vaccines
// Logged-in Users
// ==============================

router.get(
    "/view",
    authenticateToken,
    async (req, res) => {

        try {

            const vaccines = await Vaccine.find();


            res.status(200).json({

                message: "Vaccines retrieved successfully",

                vaccines: vaccines

            });


        } catch (error) {

            res.status(500).json({

                message: "Failed to retrieve vaccines",

                error: error.message

            });

        }

    }
);


module.exports = router;