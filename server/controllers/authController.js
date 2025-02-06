const { googleCallBackService, updateProfileAndLoginService } = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { profileCompletionSchema } = require("../validators/authenticationValidator");

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
    if(!profileCompleted){
      res.redirect("http://localhost:3000/register/userCredentials");
    }
    res.redirect("http://localhost:3000/home");
    
   
});

// userData for userCompletation ui--------------------------------------------------------
exports.newUserInfoController=asyncHandler(async(req,res)=>{
    const user=req.user
    res.json({email:user.email,firstName:user.firstName,lastName:user.lastName})
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
    res.json({profileCompleted:user.profileCompleted})
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