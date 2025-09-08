import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';
import { makeCheckInUseCase } from '../../../services/factories/make-check-in-use-case.ts';

const CREATED = 201;

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchemas = z.object({
    gymId: z.uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchemas.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(CREATED).send();
}
