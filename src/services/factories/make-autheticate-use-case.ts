import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository.ts';
import { AuthenticateUseCase } from '../authenticate.ts';

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUsersRepository();
  const registerUseCase = new AuthenticateUseCase(userRepository);
  return registerUseCase;
}
