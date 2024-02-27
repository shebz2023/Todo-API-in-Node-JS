import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

export interface AuthRequest extends Request {
    user?: string | object;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Set user from payload
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}
