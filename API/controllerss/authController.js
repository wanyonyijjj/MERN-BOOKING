const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendJwtToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if(process.env.NODE_ENV==='production') cookieOptions.secure=true;
  const token = signToken(user._id);

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};


exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, cPassword, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    cPassword,
    role,
  });
  sendJwtToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password){
   return next(new appError(400, "please provide email and password"))};
  const user = await User.findOne({ email }).select("+password")
  if (!user || !(await user.correctPassword(password, user.password))){
   return next(new appError(401, "Incorrect email or password"))
  }
  sendJwtToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token){
   return next(new appError(403, "you are not logged in please login to get access"))}

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser){
    next(new appError(401, "the user belonging to the token does not exist"))}
//   if(currentUser.changedPasswordAfter(decoded.iat)){
//     return next(new appError(401,'user recently changed password please login again'))
// }
  req.user = currentUser;
  next()
});
// exports.protect=catchAsync(async (req,res,next)=>{
//   //1.Getting the token and check if it exists
//   let token;
//   if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
//        token=req.headers.authorization.split(' ')[1]
//   }
//   //2.check if token exists
// if(!token){
//   return(next(new AppError('you are not logged in please login to get access',401)))
// }
//   //2.verification token
//  const decoded=await promisify( jwt.verify)(token,process.env.JWT_SECRET)
//   //3.check if user still exists
//  const freshUser=await   User.findById(decoded.id);
//  if(!freshUser){
//   return next(new AppError('the user belonging to the token does not exist',401))
//  }
//   //4. check if user changed password
//   if(freshUser.changedPasswordAfter(decoded.iat)){
//       return next(new AppError('user recently changed password please login again',401))
//   }
//   //GRANT ACCESS TO PROTECTED ROUTE
//   req.user=freshUser;
//   next()
// })



exports.restrict=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new appError(403,'you do not have permission  to perform this action'))
        }
        next()
    }
}
