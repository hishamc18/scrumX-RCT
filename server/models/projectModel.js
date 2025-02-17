const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image:{type:String},
    isGroup:{type:Boolean},
    isDeleted:{type:Boolean, default:false},
    invitedMembers: [{ type: String }], // ✅ Store invited emails
    joinedMembers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Store user ID
        role: { type: String, enum: ["Founder", "Lead", "Contributor"], default: "Contributor" }, // ✅ User roles
      },
    ],
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Project", ProjectSchema);

