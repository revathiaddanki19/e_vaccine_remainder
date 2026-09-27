const express = require("express");
const Vaccine = require("../models/Vaccine");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ADMIN AUTHENTICATION
function checkAdmin(req, res, next) {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
}


// UPDATE VACCINE
router.put(
    "/vaccine/update/:id",
    authenticateToken,
    checkAdmin,
    async (req, res) => {

        try {

            const vaccineId = req.params.id;

            const {
                vaccineName,
                description,
                recommendedAge,
                doseNumber
            } = req.body;

            const vaccine = await Vaccine.findByIdAndUpdate(
                vaccineId,
                {
                    vaccineName: vaccineName,
                    description: description,
                    recommendedAge: recommendedAge,
                    doseNumber: doseNumber
                },
                { new: true }
            );

            if (!vaccine) {
                return res.status(404).json({
                    message: "Vaccine not found"
                });
            }

            res.status(200).json({
                message: "Vaccine updated successfully",
                vaccine: vaccine
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to update vaccine",
                error: error.message
            });

        }
    }
);


// DELETE VACCINE
router.delete(
    "/vaccine/delete/:id",
    authenticateToken,
    checkAdmin,
    async (req, res) => {

        try {

            const vaccineId = req.params.id;

            const vaccine = await Vaccine.findByIdAndDelete(vaccineId);

            if (!vaccine) {
                return res.status(404).json({
                    message: "Vaccine not found"
                });
            }

            res.status(200).json({
                message: "Vaccine deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to delete vaccine",
                error: error.message
            });

        }
    }
);


module.exports = router;