const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        console.log("Registered user successfully:", user);
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }

        // Check against preset ADMIN credentials in .env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            // Check if admin user exists in DB
            let user = await User.findOne({ email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await User.create({
                    username: "admin",
                    email,
                    password: hashedPassword
                });
            }

            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        id: user._id,
                        isAdmin: true
                    }
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({ accessToken, isAdmin: true });
        }

        // Regular user login
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        email: user.email,
                        id: user._id,
                        isAdmin: false
                    }
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.status(200).json({ accessToken, isAdmin: false });
        } else {
            res.status(401).json({ message: "Email or password is incorrect" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    res.status(200).json({ message: "User profile data", user: req.user });
}

const getSetupStatus = async (req, res) => {
    // Setup is no longer needed since admin values are configured in env.
    res.status(200).json({ isSetupNeeded: false });
}

module.exports = { registerUser, loginUser, getUserProfile, getSetupStatus };