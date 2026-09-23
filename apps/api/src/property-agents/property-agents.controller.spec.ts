import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { AnyMock } from './__mocks__/prisma.mock';
import { PropertyAgentsController } from './property-agents.controller';
import { PropertyAgentsService } from './property-agents.service';

const AGENT_RESPONSE = {
  id: 'agent_1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  mobileNumber: '+1 (555) 010-1234',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

describe('PropertyAgentsController', () => {
  let controller: PropertyAgentsController;
  let service: {
    create: AnyMock;
    findAll: AnyMock;
    findOne: AnyMock;
    update: AnyMock;
    remove: AnyMock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyAgentsController],
      providers: [{ provide: PropertyAgentsService, useValue: service }],
    }).compile();

    controller = module.get<PropertyAgentsController>(PropertyAgentsController);
  });

  it('delegates create to the service', async () => {
    const dto = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      mobileNumber: '+1 (555) 010-1234',
    };
    service.create.mockResolvedValue(AGENT_RESPONSE);

    await expect(controller.create(dto)).resolves.toEqual({
      message: 'Property agent created successfully.',
      data: AGENT_RESPONSE,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('returns the list from the service', async () => {
    service.findAll.mockResolvedValue([AGENT_RESPONSE]);

    await expect(controller.findAll()).resolves.toEqual({
      message: 'Property agents retrieved successfully.',
      data: [AGENT_RESPONSE],
    });
    expect(service.findAll).toHaveBeenCalledWith();
  });

  it('wraps the agent detail from findOne', async () => {
    service.findOne.mockResolvedValue(AGENT_RESPONSE);

    await expect(controller.findOne('agent_1')).resolves.toEqual({
      message: 'Property agent retrieved successfully.',
      data: AGENT_RESPONSE,
    });
    expect(service.findOne).toHaveBeenCalledWith('agent_1');
  });

  it('passes the route id and body separately to update', async () => {
    service.update.mockResolvedValue(AGENT_RESPONSE);

    await expect(controller.update('agent_1', { firstName: 'Ada' })).resolves.toEqual({
      message: 'Property agent updated successfully.',
      data: AGENT_RESPONSE,
    });

    expect(service.update).toHaveBeenCalledWith('agent_1', { firstName: 'Ada' });
  });

  it('returns a message and the deleted agent from remove', async () => {
    service.remove.mockResolvedValue(AGENT_RESPONSE);

    await expect(controller.remove('agent_1')).resolves.toEqual({
      message: 'Property agent deleted successfully.',
      data: AGENT_RESPONSE,
    });
    expect(service.remove).toHaveBeenCalledWith('agent_1');
  });
});
