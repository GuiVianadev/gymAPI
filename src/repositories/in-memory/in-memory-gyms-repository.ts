/** biome-ignore-all lint/suspicious/useAwait: <<For in memory database not need await is just for unit test>> */

import { randomUUID } from 'node:crypto';
import { type Gym, Prisma } from 'generated/prisma/index.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.ts';
import type {
  FindManyNearbyParams,
  GymsRepository,
} from '../gyms-repository.ts';

export class InMemoryGymsRepository implements GymsRepository {
  items: Gym[] = [];
  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    if (!gym) {
      return null;
    }

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    await this.items.push(gym);
    return gym;
  }
}
