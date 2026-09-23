import { jest } from '@jest/globals';
import type { PrismaService } from '../../prisma/prisma.service';

export type AnyMock = jest.Mock<(...args: any[]) => any>;

export interface PrismaMock {
  propertyAgent: {
    create: AnyMock;
    update: AnyMock;
    findMany: AnyMock;
    findUnique: AnyMock;
    delete: AnyMock;
    count: AnyMock;
  };
  $transaction: AnyMock;
}

export const createPrismaMock = (): PrismaMock => ({
  propertyAgent: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
});

export const asPrismaService = (mock: PrismaMock): PrismaService =>
  mock as unknown as PrismaService;
