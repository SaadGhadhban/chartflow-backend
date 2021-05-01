const User = require('../models/User');
const Chart = require('../models/Chart');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { normalize } = require('path');


exports.main = async(req,res,next)=>{
    const charts = await Chart.find({private:false}).populate('user','username');

    if(charts) {
        return res.status(200).json({success:true,data:charts})
    }
}

exports.register = async(req,res,next)=>{
    const { username,password,email} = req.body;

    const foundUser = await User.findOne({email});
    if(foundUser){
        return res.status(400).json({success:false,error:"user already exists !"})
    }
    try {
        const user = await User.create({
            username,password,email
        })

        return sendToken(user,201,res);
    }
    catch(error) {
        return next(error)

    }
};

exports.login = async(req,res,next)=>{
    const {email,password} = req.body;
    if (!email||!password){
        return next(new ErrorResponse('Please provid an Email and a Password',400))
    }
    try {
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorResponse('Invalid credentials',401))
        }
        const isMatch = await user.matchPassword(password);

        if (!isMatch){
            return next(new ErrorResponse('Invalid credentials',401))
        }

        sendToken(user,200,res);
    } catch(err) {
        return res.status(500).json({success:false, error:err.message});

    }
};

exports.contact = async(req,res,next)=>{

    const {email,message,name} = req.body;
    let msg = `<h2>contact request from name:${name} email: ${email} and the message is</h2>
    <p>${message}</p>
    `
    try {
        await sendEmail({
            to:'no.reply.chart.flow@gmail.com',
            subject:'Contact Request chat-flow',
            text: msg
        })

        res.status(200).json({success:true,data:"Email sent !Thank you for contacting us!"})

    } catch (error) {
        return next(new ErrorResponse('Email could not be sent',500))
    }
}

exports.forgotpassword = async(req,res,next)=>{
    const { email} = req.body;
    try {
        const user = await User.findOne({email})
        if (!user){
            next(new ErrorResponse('Email could not be sent',404))
        }
        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`

        const message = `
        <h1> you have requested a password reset </h1>
        <p> Please go to this link to reset your password </p>
        <a href=${resetUrl} clicktracking=off > ${resetUrl}</a>
        `
        try {
            await sendEmail({
                to:user.email,
                subject: 'Password reset Request',
                text: message,
            })

            res.status(200).json({success:true,data:"Email sent, check your Inbox or spam folder"})
        } catch (error) {
            user.resetpasswordToken = undefined;
            user.resetpasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse('Email could not be sent',500))
        }
    }
    catch(error){
        next(error)
    }
};

exports.resetpassword = async(req,res,next)=>{
    const resetpasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest("hex");
    
    try {
        const user = await User.findOne({
            resetpasswordToken,
            resetpasswordExpire: {$gt:Date.now()},
        })

        if(!user){
            next(new ErrorResponse('Invalid reset Token',400))
        }

        user.password = req.body.password;
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;

        await user.save();

        return res.status(201).json({success:true,data:'Password was reset succesfully'})
    } catch (error) {
        next(error)
    }
};

const sendToken = (user,statusCode,res) =>{
    const token =  user.getSignedJwtToken();
    return res.status(statusCode).json({success:true,token,user:user.username});
}