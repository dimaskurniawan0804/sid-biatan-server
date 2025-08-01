import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LocalOnlyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedHosts = [
      'localhost',
      'http://localhost:5173',
      'http://localhost:5001',
    ]; // Add your domain here
    const hostname = req.hostname;

    if (process.env.NODE_ENV === 'development') {
      if (!allowedHosts.includes(hostname)) {
        return res.status(403).send('Access denied');
      }
    }

    next();
  }
}
