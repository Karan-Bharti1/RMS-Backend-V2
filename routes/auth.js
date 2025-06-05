const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const RmsUser = require("../models/RmsUser");

const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
router.post("/register", async (req, res) => {

  
  const { username, password, role } = req.body;
  try {
    const existingUser = await RmsUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists. Please Login" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new RmsUser({ username, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ token, username, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await RmsUser.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({ message: "Login Successful", token, user:user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error While Login", error: error.message });
  }
});

module.exports = router;
