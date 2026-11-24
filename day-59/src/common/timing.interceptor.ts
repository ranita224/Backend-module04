import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<{ url: string }>();
    console.log('[Interceptor] Request started:', request.url);

    return next.handle().pipe(
      tap(() => {
        console.log(`[Interceptor] Request completed in ${Date.now() - start}ms`);
      }),
    );
  }
}