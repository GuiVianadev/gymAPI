import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.ts';
import { FetchNearbyGymUseCase } from './fetch-nearby-gyms.ts';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymUseCase(gymsRepository);
  });
  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -15.459_942_4,
      longitude: -47.605_350_4,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -16.002_05,
      longitude: -47.482_405_9,
    });

    const { gyms } = await sut.execute({
      userLatitude: -15.459_942_4,
      userLongitude: -47.605_350_4,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
