import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app.ts';
import { prisma } from '../../../lib/prisma.ts';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.ts';

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      });

    expect(response.statusCode).toEqual(201);
  });
});
