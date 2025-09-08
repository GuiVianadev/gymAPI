import { PrismaGymsRepository } from '../../repositories/prisma/prisma-gyms-repository.ts';
import { FetchNearbyGymUseCase } from '../fetch-nearby-gyms.ts';

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymUseCase(gymsRepository);
  return useCase;
}
