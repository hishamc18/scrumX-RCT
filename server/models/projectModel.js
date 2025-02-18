const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    isGroup: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    invitedMembers: [{ type: String }],
    joinedMembers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Founder", "Lead", "Contributor"], default: "Contributor" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);

