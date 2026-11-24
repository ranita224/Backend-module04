import { Injectable, NestMiddleware } from '@nestjs/common';

interface ReqLike {
  method: string;
  originalUrl: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: ReqLike, _res: unknown, next: () => void) {
    console.log(
      `[Middleware] ${req.method} ${req.originalUrl} at ${new Date().toLocaleTimeString()}`,
    );
    next();
  }
}