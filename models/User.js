const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
      "please provide a valid email",
    ],
    unique: [true, "This Email is already Registered"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 5,
    select: false,
  },
  resetpasswordToken: String,
  resetpasswordExpire: Date,
  charts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chart" }],
});

UserSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        return next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();

})

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetpasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetpasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken;
}

const User = mongoose.model('User',UserSchema);

module.exports = User;