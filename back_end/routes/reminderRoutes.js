
const express = require("express");
const mongoose = require("mongoose");

const Reminder = require("../models/Reminder");
const Child = require("../models/Child");
const Vaccine = require("../models/Vaccine");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// Add Reminder - CREATE
// POST /api/reminders/add
// ========================================

router.post("/add", authenticateToken, async (req, res) => {
    try {
        const { childId, vaccineId, dueDate } = req.body;

        if (!childId || !vaccineId || !dueDate) {
            return res.status(400).json({
                message: "Please provide child, vaccine and due date."
            });
        }

        if (
            !mongoose.isValidObjectId(childId) ||
            !mongoose.isValidObjectId(vaccineId)
        ) {
            return res.status(400).json({
                message: "Invalid child ID or vaccine ID."
            });
        }

        const child = await Child.findOne({
            _id: childId,
            parentId: req.user.id
        });

        if (!child) {
            return res.status(403).json({
                message: "You can only add reminders for your own child."
            });
        }

        const vaccine = await Vaccine.findById(vaccineId);

        if (!vaccine) {
            return res.status(404).json({
                message: "Vaccine not found."
            });
        }

        const reminder = new Reminder({
            childId,
            vaccineId,
            dueDate
        });

        await reminder.save();

        res.status(201).json({
            message: "Reminder added successfully.",
            reminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add reminder.",
            error: error.message
        });
    }
});


// ========================================
// View My Reminders - READ
// GET /api/reminders/view
// ========================================

router.get("/view", authenticateToken, async (req, res) => {
    try {
        const children = await Child.find({
            parentId: req.user.id
        });

        const childIds = children.map(child => child._id);

        const reminders = await Reminder.find({
            childId: { $in: childIds }
        })
        .populate("childId")
        .populate("vaccineId");

        res.status(200).json({
            message: "Reminders retrieved successfully.",
            reminders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve reminders.",
            error: error.message
        });
    }
});


// ========================================
// Update Reminder - UPDATE
// PUT /api/reminders/update/:id
// ========================================

router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const reminderId = req.params.id;
        const { childId, vaccineId, dueDate } = req.body;

        if (!mongoose.isValidObjectId(reminderId)) {
            return res.status(400).json({
                message: "Invalid reminder ID."
            });
        }

        const reminder = await Reminder.findById(reminderId);

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found."
            });
        }

        const existingChild = await Child.findOne({
            _id: reminder.childId,
            parentId: req.user.id
        });

        if (!existingChild) {
            return res.status(403).json({
                message: "You can only update your own reminders."
            });
        }

        // Update child if a new child ID is provided

        if (childId !== undefined) {
            if (!mongoose.isValidObjectId(childId)) {
                return res.status(400).json({
                    message: "Invalid child ID."
                });
            }

            const newChild = await Child.findOne({
                _id: childId,
                parentId: req.user.id
            });

            if (!newChild) {
                return res.status(403).json({
                    message: "You can only select your own child."
                });
            }

            reminder.childId = childId;
        }

        // Update vaccine if a new vaccine ID is provided

        if (vaccineId !== undefined) {
            if (!mongoose.isValidObjectId(vaccineId)) {
                return res.status(400).json({
                    message: "Invalid vaccine ID."
                });
            }

            const vaccine = await Vaccine.findById(vaccineId);

            if (!vaccine) {
                return res.status(404).json({
                    message: "Vaccine not found."
                });
            }

            reminder.vaccineId = vaccineId;
        }

        // Update due date if provided

        if (dueDate !== undefined) {
            if (!dueDate || isNaN(Date.parse(dueDate))) {
                return res.status(400).json({
                    message: "Please provide a valid due date."
                });
            }

            reminder.dueDate = dueDate;
        }

        await reminder.save();

        res.status(200).json({
            message: "Reminder updated successfully.",
            reminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update reminder.",
            error: error.message
        });
    }
});


// ========================================
// Complete Reminder
// PUT /api/reminders/complete/:id
// ========================================

router.put("/complete/:id", authenticateToken, async (req, res) => {
    try {
        const reminderId = req.params.id;

        if (!mongoose.isValidObjectId(reminderId)) {
            return res.status(400).json({
                message: "Invalid reminder ID."
            });
        }

        const reminder = await Reminder.findById(reminderId);

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found."
            });
        }

        const child = await Child.findOne({
            _id: reminder.childId,
            parentId: req.user.id
        });

        if (!child) {
            return res.status(403).json({
                message: "You can only update your own reminders."
            });
        }

        reminder.status = "Completed";

        await reminder.save();

        res.status(200).json({
            message: "Reminder marked as completed.",
            reminder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete reminder.",
            error: error.message
        });
    }
});


// ========================================
// Delete Reminder - DELETE
// DELETE /api/reminders/delete/:id
// ========================================

router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const reminderId = req.params.id;

        if (!mongoose.isValidObjectId(reminderId)) {
            return res.status(400).json({
                message: "Invalid reminder ID."
            });
        }

        const reminder = await Reminder.findById(reminderId);

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found."
            });
        }

        const child = await Child.findOne({
            _id: reminder.childId,
            parentId: req.user.id
        });

        if (!child) {
            return res.status(403).json({
                message: "You can only delete your own reminders."
            });
        }

        await Reminder.findByIdAndDelete(reminderId);

        res.status(200).json({
            message: "Reminder deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete reminder.",
            error: error.message
        });
    }
});


module.exports = router;
