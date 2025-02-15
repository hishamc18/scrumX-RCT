const { googleCallBackService, updateProfileAndLoginService, editUserService, editPasswotdService, compareUserPasswordService } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { profileCompletionSchema } = require("../validators/authenticationValidator");
const jwt = require('jsonwebtoken');

const User = require('../models/userModel')

// googleCallBack--------------------------------------------------------
exports.googleCallbackController = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new CustomError("User data not founded from google Oauth", 401);
    }

    const { profileCompleted, refreshToken, accessToken } = await googleCallBackService(req.user);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: true,
        // maxAge: 15 * 60 * 1000, // Access token expiration time (15 minutes)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "none", // Prevent CSRF attacks
        path: "/",
    });
    if (!profileCompleted) {
        res.redirect("http://localhost:3000/register/userCredentials");
    }
    res.redirect("http://localhost:3000/home");


});

// userData for userCompletation ui--------------------------------------------------------
exports.newUserInfoController = asyncHandler(async (req, res) => {
    const user = req.user
    res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName, userProfession: user.userProfession, avatar: user.avatar })
})

// update Profile (profileCompleted:true)--------------------------------------------
exports.updateProfileAndLoginController = asyncHandler(async (req, res) => {
    const { error } = profileCompletionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { refreshToken, accessToken, user } = await updateProfileAndLoginService(req.body);
    // Set Refresh Token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: true,
        maxAge: 15 * 60 * 1000, // Access token expiration time (15 minutes)
        sameSite: "none", // Prevent CSRF attacks
        path: "/",
    });
    res.json({ profileCompleted: user.profileCompleted })
});


exports.refreshTokenController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies
    if (!refreshToken) {
        throw new CustomError("Refresh token not found", 401);
    }
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Generate a new access token
    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Ensure the cookie is sent only over HTTPS in production
        maxAge: 15 * 60 * 1000, // Access token expiration time (15 minutes)
        sameSite: "Strict", // Prevent CSRF attacks
    });
    console.log(newAccessToken);
    res.status(200).json({ message: "Access token refreshed successfully" });
});

exports.editUserController = asyncHandler(async (req, res) => {

    const userId = req.user.id

    let { firstName, lastName, userProfession, avatar, } = req.body
    if (req.file) {
        avatar = req.file.path
    }
    const updatedUser = await editUserService({ firstName, lastName, userProfession, avatar, userId })

    const accessToken = generateAccessToken(updatedUser)
    const refreshToken = generateRefreshToken(updatedUser)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // This makes the cookie inaccessible to JavaScript
        secure: true,
        maxAge: 15 * 60 * 1000, // Access token expiration time (15 minutes)
        sameSite: "none", // Prevent CSRF attacks
        path: "/",
    });

    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
        accessToken: accessToken,
    });
})

exports.compareUserPasswordController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword } = req.body;
    
    try {
        const result = await compareUserPasswordService({userId, currentPassword});

        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  });
  

exports.editPasswordController = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const { currentPassword, newPassword } = req.body
    const updatePassword = await editPasswotdService({ currentPassword, newPassword, userId })
    res.status(200).json({
        message: "User updated successfully",
        newPassword: updatePassword,
    })
})

