import type { CheckIn } from 'generated/prisma/index.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.ts';

type FetchUserCheckInsHistoryUseCaseRequest = {
  userId: string;
  page: number;
};

type FetchUserCheckInsHistoryUseCaseResponse = {
  checkIns: CheckIn[];
};

export class FetchUserCheckInsHistoryUseCase {
  private readonly checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }
  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
