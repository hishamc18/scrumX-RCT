const asyncHandler = require("../utils//asyncHandler");
const CustomError = require("../utils/customError");
const { getProjectsService, createProjectService, JoinProjectService, checkInviteUserService, createProjectIndividualService } = require("../services/projectService");

const getProjectsController = async (req, res) => {
    const loginUserId = req.user.id
    const projects = await getProjectsService(loginUserId)
    res.json({ projects })

}

//  Controller to handle project creation
const createProjectController = asyncHandler(async (req, res) => {
    const { name, description, invitedMembers, image, isGroup } = req.body;
    const creatorId = req.user.id
    const creatorEmail = req.user.email;
    console.log("this is group")

    // Validation checks
    if (!name || !creatorId) {
        throw new CustomError("Project name and creator ID are required.", 400);
    }
    if (!description) {
        throw new CustomError("Project description is required.", 400);
    }
    if (!Array.isArray(invitedMembers) || invitedMembers.length === 0) {
        throw new CustomError("At least one member must be invited.", 400);
    }

    // Prevent inviting the creator's own email
    if (invitedMembers.includes(creatorEmail)) {
        throw new CustomError("You cannot invite yourself to the project.", 400);
    }

    const { project, inviteLink } = await createProjectService({
        name,
        description,
        invitedMembers,
        creatorId,
        image,
        isGroup,
    });

    res.status(201).json({
        message: "Project created!",
        inviteLink,
        project,
    });
});

const createProjectIndividualController = asyncHandler(async (req, res) => {
    const { name, description, image, isGroup } = req.body;
    const creatorId = req.user.id

    // Validation checks
    if (!name || !creatorId) {
        throw new CustomError("Project name and creator ID are required.", 400);
    }
    if (!description) {
        throw new CustomError("Project description is required.", 400);
    }

    const { project } = await createProjectIndividualService({
        name,
        description,
        creatorId,
        image,
        isGroup,
    });

    res.status(201).json({
        message: "Individual Project created!",
        project,
    });
});

const joinProjectController = asyncHandler(async (req, res) => {
    const { inviteToken } = req.params;
    const email = req.user.email;
    console.log(email, "email")

    const response = await JoinProjectService(inviteToken, email);

    res.status(200).json(response);
});

// Check invite users
const checkInviteUserController = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new CustomError("Email is required", 400);
    }

    const user = await checkInviteUserService(email);
    console.log(user)

    if (user) {
        return res.json(user);
    } else {
        return res.json({
            firstName: "AnonX",
            lastName: "",
            email: email,
            avatar: "/Avatar.png",
        });
    }
});




module.exports = { getProjectsController, createProjectController, createProjectIndividualController, joinProjectController, checkInviteUserController };
