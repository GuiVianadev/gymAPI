import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository.ts';
import { PrismaGymsRepository } from '../../repositories/prisma/prisma-gyms-repository.ts';
import { CheckInUseCase } from '../check-in.ts';

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);
  return useCase;
}
