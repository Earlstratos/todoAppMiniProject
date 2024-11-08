const router = require("express").Router();
const bcrypt = require('bcrypt');  // Correct import of bcrypt
const User = require('../Modals/user');  // Correct import of User model

// Register user (sign up)
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Hashing password
        const hashPassword = await bcrypt.hash(password, 10);  // Hash password asynchronously with a salt of 10 rounds

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user with hashed password
        const newUser = new User({ email, username, password: hashPassword });
        await newUser.save();

        // Respond with the created user
        res.status(200).json({ user: newUser });
    } catch (error) {
        console.error(error);  // Log error to troubleshoot
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login user (sign in)
router.post("/login", async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        // Compare the hashed password with the user's input
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        // Exclude the password from the response
        const { password, ...others } = user._doc;  // Use _doc to destructure the rest of the fields

        // Respond with the user data, excluding password
        res.status(200).json({ user: others });
    } catch (error) {
        console.error(error);  // Log error to troubleshoot
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
