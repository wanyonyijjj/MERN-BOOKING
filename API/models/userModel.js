const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter a username"],
    },
    email: {
      type: String,
      required: [true, "please provide an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please provide a password"],
      minLength: 6,
      select: false,
    },
    cPassword: {
      type: String,
      required: [true, "please provide a password"],
      minLength: 6,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "passwords do not match",
      },
    },
    role: {
      type: String,
      enum: ["user", "room-service", "admin", "Hotel"],
      default: "user",
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.cPassword = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.passwordChangedAfter=async function(JWTtimeStamp){
if(this.passwordChangedAt){
    const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10)
return JWTtimeStamp<changedTimeStamp
}
else{return false}
}

const User = mongoose.model("User", UserSchema);
module.exports = User;
