const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String, unique: true, index: true }, // Added index: true
        googleId: { type: String }, // Store Google ID if needed
        avatar: { type: String },
        provider: { type: String, required: true }, // "google", "github", "local"
        profileCompleted: { type: Boolean, default: false }, // Track if extra credentials are completed
        password: { type: String }, // Store password for email-based users
        userProfession: { type: String }, // New field for user profession
        isActive: { type: Boolean, default: true },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);