import { type Request, type Response, type RequestHandler, type NextFunction } from "express";
const TryCatch = (handler: RequestHandler): RequestHandler => {
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(500).json({ message });
            next(error);
        }
    };
}

export default TryCatch;