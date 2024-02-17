const User = require("../models/model").User;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const register_user = async (req, res) => {
    const { name, email, password } = req.body.values;

    if (!name) {
        return res.status(400).json({ message: "Name is Required." });
    }
    if (!email) {
        return res.status(400).json({ message: "Email is Required." });
    }
    if (!password) {
        return res.status(400).json({ message: "Password is Required." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists For the Provided Mail Id" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = crypto.randomBytes(16).toString("hex");

    const newUser = new User({
        uid,
        name,
        email,
        password: hashedPassword
    });
    try {
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


const login_user = async (req, res) => {
    try {
        const {email, password } = req.body.values;

        if (!email) {
            return res.status(400).json({ message: "Email is Required." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is Required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ email: user.email, name: user.name }, 'GobiNath@3', { expiresIn: '1h' });

        res.status(200).json({ email:user.email,name: user.name,token, sessionTimeout:"3000"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    register_user: register_user,
    login_user:login_user
};
