import type { CheckIn, Prisma } from 'generated/prisma/index.js';

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
}
