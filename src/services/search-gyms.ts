import type { Gym } from 'generated/prisma/index.js';
import type { GymsRepository } from '@/repositories/gyms-repository.ts';

type SearchGymUseCaseRequest = {
  query: string;
  page: number;
};

type SearchGymUseCaseResponse = {
  gyms: Gym[];
};

export class SearchGymUseCase {
  private readonly gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    query,
    page,
  }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
