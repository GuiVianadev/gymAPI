import type { CheckInsRepository } from '@/repositories/check-ins-repository.ts';

type GetUserMetricsUseCaseRequest = {
  userId: string;
};

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number;
};

export class GetUserMetricsUseCase {
  private readonly checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }
  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
