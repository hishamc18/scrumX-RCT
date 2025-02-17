const express = require("express");
const passport = require("passport");
const { refreshTokenController, googleCallbackController, updateProfileAndLoginController, newUserInfoController, sendOtpController, verifyOtpController, checkEmailExistsController, loginUser, forgotPassword, resetPassword, editUserController, editPasswordController, compareUserPasswordController, logoutUser } = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const upload  = require('../middlewares/uploadMiddleware')

const router = express.Router();

// Google OAuth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Google OAuth Callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleCallbackController);
router.post("/updateProfileAndLogin", updateProfileAndLoginController)
// userData for userCompletation ui
router.get('/user', verifyToken, newUserInfoController);
// refreshToken
router.post('/refresh-token', refreshTokenController)
// sending OTP
router.post("/send-otp", sendOtpController);
// verifying OTP
router.post("/verify-otp", verifyOtpController);
// checking email-exists
router.post("/check-email", checkEmailExistsController);
// login with password
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword); // Send reset email
router.post("/reset-password/:token", resetPassword); // Reset password
//userDate update
router.put('/editUser' ,verifyToken, upload.single('avatar'),editUserController)
//userComparePassword
router.post('/comparePassword',verifyToken,compareUserPasswordController)
//userPassword update
router.put('/editPassword',verifyToken,editPasswordController)
//logout
router.post('/logout', logoutUser);



module.exports = router;