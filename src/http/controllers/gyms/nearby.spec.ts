import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../../../app.ts';
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.ts';

describe('Serach Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '11999999',
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Some description',
        phone: '11999999',
        latitude: -16.002_05,
        longitude: -47.482_405_9,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -15.459_942_4,
        longitude: -47.605_350_4,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ]);
  });
});
