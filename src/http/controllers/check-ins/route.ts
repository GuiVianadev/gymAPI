import type { FastifyInstance } from 'fastify';
import { verifyUserRole } from '../../../http/middlewares/verify-user-role.ts';
import { verifyJWT } from '../../middlewares/verify-jwt.ts';
import { create } from './create.ts';
import { history } from './history.ts';
import { metrics } from './metrics.ts';
import { validate } from './validate.ts';

// biome-ignore lint/suspicious/useAwait: This code need be async but without await
export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate
  );
}
