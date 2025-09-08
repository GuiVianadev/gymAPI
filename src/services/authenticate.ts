import { compare } from 'bcryptjs';
import type { User } from 'generated/prisma/index.js';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { InvalidCredentialsError } from './errors/invalid-credentials-error.ts';

type AuthenticateUseCaseRequest = {
  email: string;
  password: string;
};

type AuthenticateUseCaseResponse = {
  user: User;
};

export class AuthenticateUseCase {
  private readonly usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
