const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    joinDate: {
      type: Date
    },

    skills: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      trim: true
    },

    photo: {
      type: String,
      trim: true
    },

    github: String,
    linkedin: String,
    facebook: String,
    instagram: String,
    portfolio: String,

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", memberSchema);
