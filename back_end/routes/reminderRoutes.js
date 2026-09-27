const express = require("express");
const Reminder = require("../models/Reminder");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ADD REMINDER
router.post("/add", authenticateToken, async (req, res) => {
    try {
        const {
            childId,
            vaccineId,
            dueDate
        } = req.body;

        const reminder = new Reminder({
            childId: childId,
            vaccineId: vaccineId,
            dueDate: dueDate
        });

        await reminder.save();

        res.status(201).json({
            message: "Reminder added successfully",
            reminder: reminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add reminder",
            error: error.message
        });
    }
});


// VIEW REMINDERS
router.get("/view", authenticateToken, async (req, res) => {
    try {
        const reminders = await Reminder.find()
            .populate("childId")
            .populate("vaccineId");

        res.status(200).json({
            message: "Reminders retrieved successfully",
            reminders: reminders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve reminders",
            error: error.message
        });
    }
});


// COMPLETE REMINDER
router.put("/complete/:id", authenticateToken, async (req, res) => {
    try {
        const reminderId = req.params.id;

        const reminder = await Reminder.findByIdAndUpdate(
            reminderId,
            { status: "Completed" },
            { new: true }
        );

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            message: "Reminder marked as completed",
            reminder: reminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update reminder",
            error: error.message
        });
    }
});


module.exports = router;