import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendResponse } from '@core/utils';

class AuthMiddleware {
    public static authorization = (req: Request, res: Response, next: NextFunction) => {
        // const token = req.header('Authorization')?.replace('Bearer ', '');
        // if (!token) {
        //     return sendResponse(res, 401, 'token is required')
        // }
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        //     if (decoded && typeof decoded === 'object' && 'id' in decoded) {
        //         req.id = decoded.id
        //         next();
        //     } else {
        //         return sendResponse(res, 401, 'invalid token')
        //     }
        // } catch (error) {
        //     if (error instanceof Error) {
        //         return sendResponse(res, 401, error.message)
        //     } else {
        //         return sendResponse(res, 401, 'token verification failed')
        //     }
        // }
        req.id = 1;
        req.role = 1;
        next();
    }
    public static authorize = (roles: number) => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.id) {
                if (roles === req.role) {
                    return next();
                }
                return sendResponse(res, 403, 'permission denied')
            }
            return sendResponse(res, 401, 'token is required')
        }
    }
}

export default AuthMiddleware;
