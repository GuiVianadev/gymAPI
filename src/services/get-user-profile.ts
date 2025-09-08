import type { User } from 'generated/prisma/index.js';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts';

type GetUserProfileUseCaseRequest = {
  userId: string;
};

type GetUserProfileUseCaseResponse = {
  user: User;
};

export class GetUserProfileUseCase {
  private readonly usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }
    return {
      user,
    };
  }
}
