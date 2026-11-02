
const express = require("express");
const Child = require("../models/Child");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ==================================
// ADD CHILD
// ==================================

router.post("/add", authenticateToken, async (req, res) => {
    try {
        const { name, dateOfBirth, gender } = req.body;

        if (!name || !dateOfBirth || !gender) {
            return res.status(400).json({
                message: "Please provide all child details."
            });
        }

        const child = new Child({
            name,
            dateOfBirth,
            gender,
            parentId: req.user.id
        });

        await child.save();

        res.status(201).json({
            message: "Child added successfully",
            child
        });

    } catch (error) {
        console.log("Add child error:", error);

        res.status(500).json({
            message: "Failed to add child",
            error: error.message
        });
    }
});


// ==================================
// VIEW MY CHILDREN
// ==================================

router.get("/view", authenticateToken, async (req, res) => {
    try {

        // Debugging: Check logged-in user ID
        console.log("Logged-in user ID:", req.user.id);

        const children = await Child.find({
            parentId: req.user.id
        });

        // Debugging: Check children retrieved from MongoDB
        console.log("Children found:", children);

        res.status(200).json({
            message: "Children retrieved successfully",
            children
        });

    } catch (error) {
        console.log("View children error:", error);

        res.status(500).json({
            message: "Failed to retrieve children",
            error: error.message
        });
    }
});


// ==================================
// UPDATE MY CHILD
// ==================================

router.put("/update/:id", authenticateToken, async (req, res) => {
    try {
        const { name, dateOfBirth, gender } = req.body;

        if (!name || !dateOfBirth || !gender) {
            return res.status(400).json({
                message: "Please provide all child details."
            });
        }

        const child = await Child.findOneAndUpdate(
            {
                _id: req.params.id,
                parentId: req.user.id
            },
            {
                name,
                dateOfBirth,
                gender
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!child) {
            return res.status(404).json({
                message: "Child not found or access denied."
            });
        }

        res.status(200).json({
            message: "Child updated successfully",
            child
        });

    } catch (error) {
        console.log("Update child error:", error);

        res.status(500).json({
            message: "Failed to update child",
            error: error.message
        });
    }
});


// ==================================
// DELETE MY CHILD
// ==================================

router.delete("/delete/:id", authenticateToken, async (req, res) => {
    try {
        const child = await Child.findOneAndDelete({
            _id: req.params.id,
            parentId: req.user.id
        });

        if (!child) {
            return res.status(404).json({
                message: "Child not found or access denied."
            });
        }

        res.status(200).json({
            message: "Child deleted successfully"
        });

    } catch (error) {
        console.log("Delete child error:", error);

        res.status(500).json({
            message: "Failed to delete child",
            error: error.message
        });
    }
});


// ==================================
// EXPORT ROUTER
// ==================================

module.exports = router;
