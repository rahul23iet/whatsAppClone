
import { type Request, type Response, type NextFunction } from 'express';
import jwt, { type Jwt, type JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface IUsers extends Document {
    _id: string;
    name: string;
    email: string;
}

export interface  AuthenticatedRequest extends Request {
    user?: IUsers | null;
}


export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
   try{
    const authHeader = req.headers.authorization || '';
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({ message: 'Unauthorized' });
    }
     const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token || "undefined", process.env.JWT_SECRET || 'default_secret') as JwtPayload;
    console.log("Decoded token:", decoded);
    if(!decoded ){
        res.status(401).json({ message: 'Unauthorized' });
    }
    (req as any).user = decoded.user ;
    next();
   }
   catch(err){
     res.status(401).json({ message: 'Unauthorized' });
   }
}