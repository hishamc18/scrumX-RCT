const User = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const bcrypt = require('bcrypt');

// googleCallBack--------------------------------------------------------
exports.googleCallBackService= async(googleUser)=>{
    console.log(googleUser)
    let user= await User.findOne({email: googleUser.emails[0].value })

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
    const accessToken =await generateAccessToken(user);
    const refreshToken =await generateRefreshToken(user);
    
    return {profileCompleted: user.profileCompleted,accessToken,refreshToken}
}

// update Profile (profileCompleted:true)--------------------------------------------
exports.updateProfileAndLoginService=async({email,password,userProfession,firstName,lastName})=>{
    let user = await User.findOne({email});
    console.log(user,"searched")
  if (!user) {
      throw new CustomError("User not found", 404);
  }

  if (!user.isActive) {
    throw new CustomError("Your account is deactivated. Contact support.", 403);
}
console.log(user,"user")
  // If profile is not completed, update necessary fields
  
      if (!password || !userProfession) {
          throw new CustomError("Password and profession are required", 400);
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.firstName=firstName
      user.lastName=lastName
      user.userProfession = userProfession;
      user.profileCompleted = true; // Mark profile as completed

      await user.save();
  
  // Generate access and refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {accessToken,refreshToken,user}

}