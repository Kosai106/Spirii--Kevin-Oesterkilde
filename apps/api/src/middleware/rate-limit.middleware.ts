import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly RATE_LIMIT = 5; // 5 requests per minute
  private readonly RATE_WINDOW = 60_000; // 1 minute in ms
  private requestCount = 0;
  private requestWindowStart = Date.now();

  use(_req: Request, _res: Response, next: NextFunction) {
    const now = Date.now();
    if (now - this.requestWindowStart > this.RATE_WINDOW) {
      this.requestCount = 0;
      this.requestWindowStart = now;
    }

    if (this.requestCount >= this.RATE_LIMIT) {
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.requestCount++;
    next();
  }
}
