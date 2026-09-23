import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { AppModule } from './../src/app.module';

const SEEDED_EMAIL = 'john.doe@realestate.com';

const validAgent = (email: string) => ({
  firstName: 'Ada',
  lastName: 'Lovelace',
  email,
  mobileNumber: '+1 (555) 010-1234',
});

describe('PropertyAgents (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /property-agents', () => {
    it('creates an agent and returns 201 with no relation fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/property-agents')
        .send(validAgent('e2e.create@example.com'))
        .expect(201);

      expect(response.body).toMatchObject({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'e2e.create@example.com',
      });
      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body).not.toHaveProperty('properties');
      expect(response.body).not.toHaveProperty('notes');
    });

    it('rejects an invalid email with 400 and a list of messages', async () => {
      const response = await request(app.getHttpServer())
        .post('/property-agents')
        .send({ ...validAgent('nope'), email: 'nope' })
        .expect(400);

      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('rejects a mobile number with too few digits', async () => {
      await request(app.getHttpServer())
        .post('/property-agents')
        .send({ ...validAgent('e2e.short@example.com'), mobileNumber: '555123' })
        .expect(400);
    });

    it('rejects an unknown property, so id cannot be mass-assigned', async () => {
      const response = await request(app.getHttpServer())
        .post('/property-agents')
        .send({ ...validAgent('e2e.massassign@example.com'), id: 'hacked' })
        .expect(400);

      expect(JSON.stringify(response.body.message)).toContain('id');
    });

    it('returns 409 when the email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/property-agents')
        .send(validAgent(SEEDED_EMAIL))
        .expect(409);

      expect(response.body.message).toContain('email');
    });
  });

  describe('GET /property-agents', () => {
    it('returns the agents as a list without relation fields', async () => {
      const response = await request(app.getHttpServer())
        .get('/property-agents')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).not.toHaveProperty('properties');
      expect(response.body[0]).not.toHaveProperty('notes');
    });
  });

  describe('GET /property-agents/:id', () => {
    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .get('/property-agents/does-not-exist')
        .expect(404);
    });
  });

  describe('PATCH /property-agents/:id', () => {
    it('updates a single field', async () => {
      const created = await request(app.getHttpServer())
        .post('/property-agents')
        .send(validAgent('e2e.patch@example.com'))
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/property-agents/${created.body.id}`)
        .send({ firstName: 'Grace' })
        .expect(200);

      expect(response.body).toMatchObject({
        firstName: 'Grace',
        lastName: 'Lovelace',
      });
    });

    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .patch('/property-agents/does-not-exist')
        .send({ firstName: 'Grace' })
        .expect(404);
    });
  });

  describe('DELETE /property-agents/:id', () => {
    it('returns 204 with an empty body', async () => {
      const created = await request(app.getHttpServer())
        .post('/property-agents')
        .send(validAgent('e2e.delete@example.com'))
        .expect(201);

      const response = await request(app.getHttpServer())
        .delete(`/property-agents/${created.body.id}`)
        .expect(204);

      expect(response.body).toEqual({});
    });

    it('returns 404 for an unknown id', async () => {
      await request(app.getHttpServer())
        .delete('/property-agents/does-not-exist')
        .expect(404);
    });
  });
});
