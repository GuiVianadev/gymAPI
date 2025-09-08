import { hash } from 'bcryptjs';
import type { User } from 'generated/prisma/index.js';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { UserAlreadyExistsError } from './errors/user-already-exists-error.ts';

const ROUNDS = 6;

type RegisterServiceRequest = {
  name: string;
  email: string;
  password: string;
};

type RegisterUseCaseResponse = {
  user: User;
};

export class RegisterUseCase {
  private readonly usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, ROUNDS);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
