import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository.ts';
import { GetUserProfileUseCase } from '../get-user-profile.ts';

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(userRepository);
  return useCase;
}
