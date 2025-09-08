import type { CheckIn } from 'generated/prisma/index.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.ts';
import type { GymsRepository } from '@/repositories/gyms-repository.ts';
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates.ts';
import { MaxDistanceError } from './errors/max-distance-errors.ts';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.ts';
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts';

type checkInUseCaseRequest = {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
};

type checkInUseCaseResponse = {
  checkIn: CheckIn;
};

export class CheckInUseCase {
  private readonly checkInsRepository: CheckInsRepository;
  private readonly gymsRepository: GymsRepository;

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository
  ) {
    this.checkInsRepository = checkInsRepository;
    this.gymsRepository = gymsRepository;
  }
  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: checkInUseCaseRequest): Promise<checkInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkIn,
    };
  }
}
