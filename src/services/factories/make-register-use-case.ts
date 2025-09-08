import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository.ts';
import { RegisterUseCase } from '../register.ts';

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(userRepository);
  return registerUseCase;
}
