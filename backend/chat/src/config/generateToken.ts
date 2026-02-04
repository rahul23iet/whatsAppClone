import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user:any)=>{
    const token = jwt.sign(
        { user },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '24h' }
    );
    return token;
}