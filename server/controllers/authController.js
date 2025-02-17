const { googleCallBackService, updateProfileAndLoginService, sendOtp, verifyOtp, checkEmailExistsService, loginUserService, generateResetToken, resetPassword } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { profileCompletionSchema } = require("../validators/authenticationValidator");
const sendEmail = require("../utils/sendEmail");
const { resetPasswordTemplate } = require("../templates/passwordResetTemplate")
const CustomError = require("../utils/customError");

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
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true, 
        secure: true,
        // maxAge: 15 * 60 * 1000, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
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
    res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName })
})

// update Profile (profileCompleted:true)--------------------------------------------
exports.updateProfileAndLoginController = asyncHandler(async (req, res) => {
    const { error } = profileCompletionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { refreshToken, accessToken, user } = await updateProfileAndLoginService(req.body);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
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

    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, 
        sameSite: "Strict",
    });
    res.status(200).json({ message: "Access token refreshed successfully" });
});

//checking email exist
exports.checkEmailExistsController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const exists = await checkEmailExistsService(email);
    return res.status(200).json({ exists });
});


// login password
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUserService(email, password);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
        path: "/",
    });
    res.status(200).json({ message: "Login Successfull" })
});


// send OTP
exports.sendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new CustomError("Email is required");
    }
    const response = await sendOtp(email);
    res.json(response);
});


// verify OTP
exports.verifyOtpController = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        res.status(400);
        throw new CustomError("Email and OTP are required");
    }
    const { message, accessToken, refreshToken } = await verifyOtp(email, otp);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        // maxAge: 15 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        path: "/",
    });
    res.status(200).json(message);
});


// Forgot Password 
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const resetToken = await generateResetToken(email);
    if (!resetToken) throw new CustomError("User not found", 404);

    const resetUrl = `http://localhost:3000//register?reset=true&token=${resetToken}`;
    const html = resetPasswordTemplate(resetUrl);
    await sendEmail(email, "Your Link for Reset Password", html);
    res.status(200).json({ message: "Password reset link sent to email" });
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const { user, accessToken, refreshToken } = await resetPassword(token, password);    
    console.log(user, accessToken, refreshToken);
    
    if (!user) throw new CustomError("Invalid or expired token", 400);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        // maxAge: 15 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        path: "/",
    });
    res.status(200).json({ message: "Password updated successfully" });
});
