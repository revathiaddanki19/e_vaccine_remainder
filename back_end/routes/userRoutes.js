const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


// ==============================
// Register User
// ==============================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        const existingUser = await User.findOne({
            email: email
        });


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = new User({

            name: name,

            email: email,

            password: hashedPassword,

            // New users are always normal users
            role: "user"

        });


        await user.save();


        res.status(201).json({

            message: "User registered successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        res.status(500).json({

            message: "Registration failed",

            error: error.message

        });

    }

});


// ==============================
// Login User
// ==============================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user = await User.findOne({

            email: email

        });


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!passwordMatch) {

            return res.status(401).json({

                message: "Invalid password"

            });

        }


        const token = jwt.sign(

            {

                id: user._id,

                email: user.email,

                role: user.role

            },

            JWT_SECRET,

            {

                expiresIn: "1h"

            }

        );


        res.status(200).json({

            message: "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        res.status(500).json({

            message: "Login failed",

            error: error.message

        });

    }

});


module.exports = router;