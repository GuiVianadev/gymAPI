import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.ts';
import { AuthenticateUseCase } from './authenticate.ts';
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
const SALT = 6;

describe('Autheticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to register', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jhon@example.com',
      password_hash: await hash('123456', SALT),
    });

    const { user } = await sut.execute({
      email: 'jhon@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should be able to autheticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should be able to autheticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'jhon@example.com',
      password_hash: await hash('123456', SALT),
    });

    await expect(() =>
      sut.execute({
        email: 'johndoe@gmail.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
