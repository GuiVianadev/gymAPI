import type { Gym } from 'generated/prisma/index.js';
import type { GymsRepository } from '@/repositories/gyms-repository.ts';

type CreateGymUseCaseRequest = {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
};

type CreateGymUseCaseResponse = {
  gym: Gym;
};

export class CreateGymUseCase {
  private readonly gymsRepository: GymsRepository;

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
