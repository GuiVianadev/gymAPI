import { randomUUID } from 'node:crypto';
import type { Prisma, User } from 'generated/prisma/index.js';
import type { UsersRepository } from '../users-repository.ts';

export class InMemoryUsersRepository implements UsersRepository {
  items: User[] = [];
  async findById(id: string): Promise<User | null> {
    const user = await this.items.find((item) => item.id === id);
    if (!user) {
      return null;
    }

    return user;
  }
  async findByEmail(email: string) {
    const user = await this.items.find((item) => item.email === email);
    if (!user) {
      return null;
    }

    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    await this.items.push(user);
    return user;
  }
}
