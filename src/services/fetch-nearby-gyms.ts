import type { Gym } from 'generated/prisma/index.js';
import type { GymsRepository } from '@/repositories/gyms-repository.ts';

type FetchNearbyGymUseCaseRequest = {
  userLatitude: number;
  userLongitude: number;
};

type FetchNearbyGymUseCaseResponse = {
  gyms: Gym[];
};

export class FetchNearbyGymUseCase {
  private readonly gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymUseCaseRequest): Promise<FetchNearbyGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
