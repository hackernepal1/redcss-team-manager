const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const router = express.Router();

// Create first admin if database is empty
router.post("/setup", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists"
      });
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "ADMIN_EMAIL or ADMIN_PASSWORD is not configured"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      passwordHash
    });

    res.json({
      success: true,
      message: "Admin created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase().trim()
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

module.exports = router;
