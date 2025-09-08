import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.ts';
import { SearchGymUseCase } from './search-gyms.ts';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaGym',
      description: null,
      phone: null,
      latitude: -15.459_942_4,
      longitude: -47.605_350_4,
    });
    await gymsRepository.create({
      title: 'TypeGym',
      description: null,
      phone: null,
      latitude: -15.459_942_4,
      longitude: -47.605_350_4,
    });

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaGym' })]);
  });
  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript gym ${i}`,
        description: null,
        phone: null,
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      });
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript gym 21' }),
      expect.objectContaining({ title: 'Javascript gym 22' }),
    ]);
  });
});
