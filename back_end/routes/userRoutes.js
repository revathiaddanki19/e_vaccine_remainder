
console.log("USER ROUTES LOADED");
const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = new User({
            name,
            email,
            password,
            role: role || "user"
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

module.exports = router;