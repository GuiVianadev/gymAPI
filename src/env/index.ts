import { z } from 'zod';

const DEFAULT_PORT = 3333;
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(DEFAULT_PORT),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(z.treeifyError(_env.error));

  throw new Error('Invalid enviroment variables.');
}

export const env = _env.data;
