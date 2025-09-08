import dayjs from 'dayjs';
import type { CheckIn } from 'generated/prisma/index.js';
import type { CheckInsRepository } from '@/repositories/check-ins-repository.ts';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.ts';
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts';

type ValidatecheckInUseCaseRequest = {
  checkInId: string;
};

type ValidatecheckInUseCaseResponse = {
  checkIn: CheckIn;
};

export class ValidateCheckInUseCase {
  private readonly checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }
  async execute({
    checkInId,
  }: ValidatecheckInUseCaseRequest): Promise<ValidatecheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }
    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);
    return {
      checkIn,
    };
  }
}
