const express = require("express");

const Member = require("../models/Member");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Public: get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load members"
    });
  }
});

// Public: single member
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    res.json({
      success: true,
      member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid member ID"
    });
  }
});

// Admin: add member
router.post("/", authenticate, async (req, res) => {
  try {
    const member = await Member.create(req.body);

    res.status(201).json({
      success: true,
      member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: update member
router.put("/:id", authenticate, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    res.json({
      success: true,
      member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Admin: delete member
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    res.json({
      success: true,
      message: "Member deleted"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not delete member"
    });
  }
});

module.exports = router;
