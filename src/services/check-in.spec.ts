import { Decimal } from 'generated/prisma/runtime/library.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkIns-repository.ts';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.ts';
import { CheckInUseCase } from './check-in.ts';
import { MaxDistanceError } from './errors/max-distance-errors.ts';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.ts';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaGYM',
      description: ' ',
      phone: '',
      latitude: -15.459_942_4,
      longitude: -47.605_350_4,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.459_942_4,
      userLongitude: -47.605_350_4,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.459_942_4,
      userLongitude: -47.605_350_4,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -15.459_942_4,
        userLongitude: -47.605_350_4,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.459_942_4,
      userLongitude: -47.605_350_4,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -15.459_942_4,
      userLongitude: -47.605_350_4,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaGYM',
      description: ' ',
      phone: '',
      latitude: new Decimal(-15.331_882_5),
      longitude: new Decimal(-47.415_492_4),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -15.459_942_4,
        userLongitude: -47.605_350_4,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
