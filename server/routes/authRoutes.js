const express = require("express");
const passport = require("passport");
const { refreshTokenController, googleCallbackController, updateProfileAndLoginController, newUserInfoController, editUserController, editPasswordController, compareUserPasswordController} = require("../controllers/authController");
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
//userDate update
router.put('/editUser' ,verifyToken, upload.single('avatar'),editUserController)
//userComparePassword
router.post('/comparePassword',verifyToken,compareUserPasswordController)
//userPassword update
router.put('/editPassword',verifyToken,editPasswordController)

module.exports = router;