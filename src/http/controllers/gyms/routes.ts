import type { FastifyInstance } from 'fastify';
import { verifyUserRole } from '../../../http/middlewares/verify-user-role.ts';
import { verifyJWT } from '../../middlewares/verify-jwt.ts';
import { create } from './create.ts';
import { nearby } from './nearby.ts';
import { search } from './search.ts';

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);
}
