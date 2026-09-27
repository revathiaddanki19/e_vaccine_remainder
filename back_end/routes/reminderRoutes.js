const express = require("express");
const Reminder = require("../models/Reminder");
const Child = require("../models/Child");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// Add Reminder
// Logged-in User Only
// ========================================

router.post(
    "/add",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                childId,
                vaccineId,
                dueDate
            } = req.body;


            // Check whether the child belongs
            // to the logged-in user

            const child = await Child.findOne({

                _id: childId,

                parentId: req.user.id

            });


            if (!child) {

                return res.status(403).json({

                    message:
                        "You can only add reminders for your own child."

                });

            }


            const reminder = new Reminder({

                childId: childId,

                vaccineId: vaccineId,

                dueDate: dueDate

            });


            await reminder.save();


            res.status(201).json({

                message:
                    "Reminder added successfully",

                reminder: reminder

            });


        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to add reminder",

                error: error.message

            });

        }

    }
);


// ========================================
// View My Reminders
// Logged-in User Only
// ========================================

router.get(
    "/view",
    authenticateToken,
    async (req, res) => {

        try {

            // Find the children belonging
            // to the logged-in user

            const children = await Child.find({

                parentId: req.user.id

            });


            const childIds =
                children.map(
                    child => child._id
                );


            // Find reminders only for
            // those children

            const reminders =
                await Reminder.find({

                    childId: {
                        $in: childIds
                    }

                })
                .populate("childId")
                .populate("vaccineId");


            res.status(200).json({

                message:
                    "Reminders retrieved successfully",

                reminders: reminders

            });


        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to retrieve reminders",

                error: error.message

            });

        }

    }
);


// ========================================
// Complete Reminder
// Logged-in User Only
// ========================================

router.put(
    "/complete/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const reminderId =
                req.params.id;


            // Find the reminder

            const reminder =
                await Reminder.findById(
                    reminderId
                );


            if (!reminder) {

                return res.status(404).json({

                    message:
                        "Reminder not found"

                });

            }


            // Check whether the child
            // belongs to logged-in user

            const child =
                await Child.findOne({

                    _id: reminder.childId,

                    parentId: req.user.id

                });


            if (!child) {

                return res.status(403).json({

                    message:
                        "You can only update your own reminders."

                });

            }


            reminder.status =
                "Completed";


            await reminder.save();


            res.status(200).json({

                message:
                    "Reminder marked as completed",

                reminder: reminder

            });


        } catch (error) {

            res.status(500).json({

                message:
                    "Failed to update reminder",

                error: error.message

            });

        }

    }
);


module.exports = router;