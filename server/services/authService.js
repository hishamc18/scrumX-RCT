const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const bcrypt = require('bcrypt');

// googleCallBack--------------------------------------------------------
exports.googleCallBackService = async (googleUser) => {
    console.log(googleUser)
    let user = await User.findOne({ email: googleUser.emails[0].value })

    if (!user) {
        user = new User({
            firstName: googleUser.name.givenName,
            lastName: googleUser.name.familyName,
            email: googleUser.emails[0].value,
            provider: googleUser.provider,
            googleId: googleUser.id,
            avatar: googleUser.photos[0].value,
            profileCompleted: false, // User needs to complete extra credentials
        });
        await user.save();
    }
    if (!user.isActive) {
        throw new CustomError("Your account is deactivated. Contact support.", 403);
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { profileCompleted: user.profileCompleted, accessToken, refreshToken }
}

// update Profile (profileCompleted:true)--------------------------------------------
exports.updateProfileAndLoginService = async ({ email, password, userProfession, firstName, lastName }) => {
    let user = await User.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    if (!user.isActive) {
        throw new CustomError("Your account is deactivated. Contact support.", 403);
    }


    if (!password || !userProfession) {
        throw new CustomError("Password and profession are required", 400);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.firstName = firstName
    user.lastName = lastName
    user.userProfession = userProfession;
    user.profileCompleted = true; // Mark profile as completed

    await user.save();

    user = await User.findOne({ email });
    console.log(user);


    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken, user }

}

exports.editUserService = async ({ firstName, lastName, userProfession, avatar, userId }) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new CustomError('User not found', 404)
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.userProfession = userProfession || user.userProfession;

    if (avatar) {
        user.avatar = avatar
    }

    await user.save();
    return user;

}

exports.compareUserPasswordService = async ({ userId, currentPassword }) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);


    if (!isPasswordValid) {
        throw new CustomError("Current password is incorrect", 400);
    }
    return { message: 'Current password is correct' };
}

exports.editPasswotdService = async ({ currentPassword, newPassword, userId }) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    if (newPassword) {
        if (!currentPassword) {
            throw new CustomError("Current password is required to update the password", 400);
        }

        if (currentPassword === newPassword) {
            throw new CustomError("New password cannot be the same as the current password", 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
    }

    return user
};



