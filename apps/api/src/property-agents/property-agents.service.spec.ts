import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { asPrismaService, createPrismaMock, PrismaMock } from './__mocks__/prisma.mock';
import { PropertyAgentsService } from './property-agents.service';

const AGENT_ROW = {
  id: 'agent_1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  mobileNumber: '+1 (555) 010-1234',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

const AGENT_RESPONSE = {
  id: 'agent_1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  mobileNumber: '+1 (555) 010-1234',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError(`prisma error ${code}`, {
    code,
    clientVersion: '5.22.0',
  });

describe('PropertyAgentsService', () => {
  let service: PropertyAgentsService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyAgentsService,
        { provide: PrismaService, useValue: asPrismaService(prisma) },
      ],
    }).compile();

    service = module.get<PropertyAgentsService>(PropertyAgentsService);
  });

  describe('create', () => {
    it('maps the Prisma row onto the response contract with ISO dates', async () => {
      prisma.propertyAgent.create.mockResolvedValue(AGENT_ROW as never);

      await expect(
        service.create({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          mobileNumber: '+1 (555) 010-1234',
        }),
      ).resolves.toEqual(AGENT_RESPONSE);
    });

    it('does not swallow a duplicate-email violation', async () => {
      prisma.propertyAgent.create.mockRejectedValue(prismaError('P2002') as never);

      await expect(
        service.create({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          mobileNumber: '+1 (555) 010-1234',
        }),
      ).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe('findAll', () => {
    it('maps every row onto the response contract', async () => {
      prisma.propertyAgent.findMany.mockResolvedValue([AGENT_ROW] as never);

      await expect(service.findAll()).resolves.toEqual([AGENT_RESPONSE]);
    });

    it('orders by createdAt with an id tiebreaker', async () => {
      prisma.propertyAgent.findMany.mockResolvedValue([] as never);

      await service.findAll();

      expect(prisma.propertyAgent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when Prisma returns null', async () => {
      prisma.propertyAgent.findUnique.mockResolvedValue(null as never);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('turns P2025 into NotFoundException', async () => {
      prisma.propertyAgent.update.mockRejectedValue(prismaError('P2025') as never);

      await expect(service.update('missing', { firstName: 'Ada' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rethrows P2002 so the exception filter can map it to 409', async () => {
      prisma.propertyAgent.update.mockRejectedValue(prismaError('P2002') as never);

      await expect(
        service.update('agent_1', { email: 'taken@example.com' }),
      ).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe('remove', () => {
    it('turns P2025 into NotFoundException', async () => {
      prisma.propertyAgent.delete.mockRejectedValue(prismaError('P2025') as never);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns the deleted agent on success', async () => {
      prisma.propertyAgent.delete.mockResolvedValue(AGENT_ROW as never);

      await expect(service.remove('agent_1')).resolves.toEqual(AGENT_RESPONSE);
    });
  });
});
