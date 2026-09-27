const express = require("express");
const Child = require("../models/Child");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// Add Child
// Logged-in User Only
// ========================================

router.post(
    "/add",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                name,
                dateOfBirth,
                gender
            } = req.body;


            const child = new Child({

                name: name,

                dateOfBirth: dateOfBirth,

                gender: gender,

                // Get parent ID from logged-in user
                parentId: req.user.id

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

    }
);


// ========================================
// View My Children
// Logged-in User Only
// ========================================

router.get(
    "/view",
    authenticateToken,
    async (req, res) => {

        try {

            const children = await Child.find({

                parentId: req.user.id

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