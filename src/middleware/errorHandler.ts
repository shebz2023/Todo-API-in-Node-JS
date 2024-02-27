import { Request, Response, NextFunction } from 'express';
import Logging from '../library/logging';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    Logging.error(err as Error);
    res.status(500).json({ message: 'Server Error' });
};
