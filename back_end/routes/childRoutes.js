const express = require("express");
const Child = require("../models/Child");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ================= ADD CHILD =================

router.post("/add", async (req, res) => {
    try {
        const {
            name,
            dateOfBirth,
            gender,
            parentId
        } = req.body;

        const child = new Child({
            name: name,
            dateOfBirth: dateOfBirth,
            gender: gender,
            parentId: parentId
        });

        await child.save();

        res.status(201).json({
            message: "Child added successfully",
            child: child
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add child",
            error: error.message
        });
    }
});


// ================= VIEW CHILDREN =================

router.get(
    "/view/:parentId",
    authenticateToken,
    async (req, res) => {

        try {

            const parentId = req.params.parentId;

            const children = await Child.find({
                parentId: parentId
            });

            res.status(200).json({
                message: "Children retrieved successfully",
                children: children
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to retrieve children",
                error: error.message
            });

        }
    }
);


module.exports = router;