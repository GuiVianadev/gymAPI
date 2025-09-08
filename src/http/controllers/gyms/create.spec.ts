import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app.ts';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.ts';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999',
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      });

    expect(response.statusCode).toEqual(201);
  });
});
