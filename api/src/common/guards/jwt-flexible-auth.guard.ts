// ============================================
// GUARD: AUTENTICAÇÃO JWT FLEXÍVEL
// ============================================
// Aceita tanto token de admin quanto de cliente
// Pizzaria Massa Nostra
// ============================================

import ApiError from '@/common/error/entities/api-error.entity';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtFlexibleAuthGuard extends AuthGuard(['jwt', 'jwt-customer']) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info?.message === 'jwt expired') {
      throw new ApiError('token-expired', 'Token expirado', 401);
    }

    if (info?.message === 'No auth token') {
      throw new ApiError(
        'missing-token',
        'Você precisa estar autenticado',
        401,
      );
    }

    if (err || !user) {
      throw err || new ApiError('unauthorized', 'Token inválido', 401);
    }

    return user;
  }
}
