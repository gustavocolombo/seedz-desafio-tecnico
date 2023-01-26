import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import secrets from '../config/auth/secrets';

interface TokenPayload {
  iat: number;
  exp: number;
  id: string;
  name: string;
  email: string;
  roles: string;
}
export function ensureAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new HttpException('Token JWT está faltando', HttpStatus.UNAUTHORIZED);
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, secrets.secret);
    const { id, email } = decoded as TokenPayload;
    req.user = { id, email };
    return next();
  } catch {
    throw new HttpException('Token JWT inválido', HttpStatus.UNAUTHORIZED);
  }
}
