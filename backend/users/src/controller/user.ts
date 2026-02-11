import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../model/users.js";
import { generateToken } from "../config/generateToken.js";
import {  type AuthenticatedRequest } from "../middleware/isAuth.js";
export const loginUser = TryCatch(async (req, res, next) => {
    console.log("Login request received:====>>>>", req.body);
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        res.status(429).json({ message: "Too many requests. Please try again later." });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, 'true', { EX: 60 });

    const message = {
        to: email,
        subject: 'Your OTP Code',
        body: `Your OTP code is ${otp}. It is valid for 5 minutes.`
    }
    await publishToQueue('sent-otp', JSON.stringify(message));
    res.status(200).json({ message: "User logged in successfully" });
});



export const verfiyUser = TryCatch(async (req, res, next) => {
    console.log("*************")
    const { email, otp: enteredOtp } = req.body;
    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    console.log("=======>>>>>", storedOtp, "=====>>>", enteredOtp);
    if (!storedOtp || storedOtp != enteredOtp) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.split('@')[0];
        user = new User({ name, email });
        await user.save();
    }
    const token = generateToken(user);

    await redisClient.del(otpKey);
    res.status(200).json({
        message: "User verified successfully",
        user,
        token
    });
});

export const myProfile = TryCatch(async (req:AuthenticatedRequest, res, next) => {
    const user = (req as any).user;
    res.status(200).json({
        message: "User profile fetched successfully",
        user
    });
});

export const updateProfile = TryCatch(async (req:AuthenticatedRequest, res, next) => {
    const userId = (req as any).user?._id  ;
    const user = await User.findById(userId);

    const { name } = req.body;
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    user.name = name || user.name;
    await user.save();
    const token = generateToken(user);
    res.status(200).json({
        message: "User profile updated successfully",
        user,
        token
    });
});

export const getAllUsers = TryCatch(async (req:AuthenticatedRequest, res, next) => {
    const users = await User.find();
    res.status(200).json({
        message: "All users fetched successfully",
        users
    });
});

export const getUserById = TryCatch(async (req:AuthenticatedRequest, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json({
        message: "User fetched successfully",
        user
    });
});