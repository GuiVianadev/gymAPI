import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

('@fastify/cookie');

import fastify from 'fastify';
import { ZodError, z } from 'zod';
import { env } from './env/index.ts';
import { checkInsRoutes } from './http/controllers/check-ins/route.ts';
import { gymsRoutes } from './http/controllers/gyms/routes.ts';
import { userRoutes } from './http/controllers/users/routes.ts';

const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(BAD_REQUEST)
      .send({ message: 'Validation error', issues: z.treeifyError(error) });
  }

  if (env.NODE_ENV !== 'production') {
    // biome-ignore lint/suspicious/noConsole: <Only in mode dev>
    console.error(error);
  } else {
    //todo here external tool for log
  }

  return reply
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: 'Internal server error.' });
});
