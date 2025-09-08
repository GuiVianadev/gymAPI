import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts';
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts';
import { GetUserProfileUseCase } from './get-user-profile.ts';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
const SALT = 6;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'jhon@example.com',
      password_hash: await hash('123456', SALT),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Doe');
  });

  it('should be able to get user profile with wrong email', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
