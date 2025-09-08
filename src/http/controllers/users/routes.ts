import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt.ts';
import { register } from '../register.ts';
import { authenticate } from './authenticate.ts';
import { profile } from './profile.ts';
import { refresh } from './refresh.ts';

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);

  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refresh);

  /* Autheticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
