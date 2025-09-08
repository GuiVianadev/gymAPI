import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository.ts';
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history copy.ts';

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  return useCase;
}
