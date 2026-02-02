import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { User } from "../model/users.js";
import { generateToken } from "../config/generateToken.js";
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
    const { email, otp: enteredOtp } = req.body;
    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || storedOtp !== enteredOtp) {
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
})