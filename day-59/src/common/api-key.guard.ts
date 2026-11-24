import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined> }>();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.CLASSROOM_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}