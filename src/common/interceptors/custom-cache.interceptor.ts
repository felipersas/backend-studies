import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext } from '@nestjs/common';
import { createHash } from 'crypto';
import { Request } from 'express';

export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const req: Request = context.switchToHttp().getRequest();
    // Gera uma chave baseada no path + filtros
    const filterHash = createHash('md5')
      .update(JSON.stringify(req.query))
      .digest('hex');

    return `${req.route.path}:${filterHash}`;
  }
}
