const Project = require("../models/projectModel");
const User = require("../models/userModel");
const { sendInviteEmails } = require("../templates/inviteTemplate");
const { generateInviteToken, verifyInviteToken } = require("../utils/contributorsInviteToken");
const CustomError = require("../utils/customError");

//  * Create a new project and generate invite links
const getProjectsService = async(loginUserId) => {
    const projects= await Project.find({ "joinedMembers.userId": loginUserId });
   return projects
};

const createProjectService = async ({ name, description, invitedMembers = [], creatorId, image, isGroup }) => {
    // Ensure required fields are present
    if (!name || !description || !creatorId) {
        throw new CustomError("Project name, description, and creator ID are required.", 400);
    }
    if (!Array.isArray(invitedMembers)) {
        throw new CustomError("Invited members must be an array.", 400);
    }

    // Create project
    const project = new Project({
        name,
        description,
        image,
        isGroup,
        invitedMembers,
        joinedMembers: [{ userId: creatorId, role: "Founder" }],
    });

    await project.save();

    // Generate invite token
    const inviteLinks = invitedMembers.map(async (email) => {
        const inviteToken = await generateInviteToken(project._id, email);
        if (!inviteToken) {
          throw new CustomError(`Failed to generate an invite token for ${email}.`, 500);
        }
      
        return {
          email,
          inviteLink: `http://localhost:3000/invite/${inviteToken}`,
        };
      });

      // Resolve all promises
const inviteLinksResolved = await Promise.all(inviteLinks);
    // // Send invitation emails
    // await sendInviteEmails(invitedMembers, name, description, inviteLink);
    // Send invitation emails
await sendInviteEmails(inviteLinksResolved, name, description);
};
const createProjectIndividualService = async ({ name, description,  creatorId, image, isGroup }) => {
    // Ensure required fields are present
    if (!name || !description || !creatorId) {
        throw new CustomError("Project name, description, and creator ID are required.", 400);
    }
    

    // Create project
    const project = new Project({
        name,
        description,
        image,
        isGroup,
        joinedMembers: [{ userId: creatorId, role: "Founder" }],
    });

    await project.save();

    return { project};
};

const JoinProjectService = async (inviteToken, email) => {
    const decoded = await verifyInviteToken(inviteToken);
    if (!decoded || !decoded.projectId || !decoded.invitedEmail) {
        throw new CustomError("Invalid or expired invite link", 400);
    }

    const project = await Project.findById(decoded.projectId);
    if (!project) {
        throw new CustomError("Project not found", 404);
    }

    const user = await User.findOne({ email: decoded.invitedEmail, profileCompleted:true });
    if (!user) {
        throw new CustomError("No account found. Please sign up before joining.", 400);
    }

    if (decoded.invitedEmail !== email) {
        throw new CustomError("Please log in with the email that received the invite link before joining.", 403);
    }

    if (project.joinedMembers.some((member) => member.userId?.equals(user._id))) {
        throw new CustomError("You are already a member of this project.", 400);
    }

    // Remove from invited list & add to joined members
    project.invitedMembers = project.invitedMembers.filter((invitedEmail) => invitedEmail !== email);
    project.joinedMembers.push({ userId: user._id, role: "Contributor" });

    await project.save();

    return { message: "Joined project successfully!", project };
};


// Check invite users
const checkInviteUserService = async (email) => {
    return await User.findOne({ email }).select("firstName lastName email avatar");
};

module.exports = {getProjectsService, createProjectService, JoinProjectService, checkInviteUserService ,createProjectIndividualService};
