const express = require("express");
const { createProjectController, joinProjectController, checkInviteUserController, getProjectsController, createProjectIndividualController } = require("../controllers/projectController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

// Route for creating and invite a project
router.post("/create", verifyToken, createProjectController);
router.post("/individual-create", verifyToken, createProjectIndividualController);

// join in project
router.post("/join/:inviteToken", verifyToken, joinProjectController);

// Check invite users
router.post("/check-invite-user", checkInviteUserController);

// fetching projects
router.get("/all", verifyToken, getProjectsController)

module.exports = router;
