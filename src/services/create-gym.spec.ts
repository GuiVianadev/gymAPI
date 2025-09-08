import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.ts';
import { CreateGymUseCase } from './create-gym.ts';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaGym',
      description: null,
      phone: null,
      latitude: -15.459_942_4,
      longitude: -47.605_350_4,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
