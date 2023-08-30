import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { SpendingUsage } from '../../src/resources/dispenser/dispenser.interface';
import { Dispenser } from '../../src/resources/dispenser/schemas/dispenser.schema';

export const buildReq = (overrides = {}) => {
  const req = { body: {}, params: {}, ...overrides };
  return req as jest.Mocked<Request<any, any, any>>;
};

export const buildRes = (overrides = {}) => {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  };
  return res as jest.Mocked<Response<any>>;
};

export const buildNext = (impl: any) => {
  return jest.fn(impl).mockName('next');
};

export const buildDispenser = (overrides = {}) => {
  const dispenser = {
    id: faker.database.mongodbObjectId(),
    flowVolume: faker.number.int(),
    totalSpent: faker.number.int(),
    status: 'close',
    usages: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...overrides,
  };

  return dispenser as any;
};

export const buildDispenserUsage = (overrides = {}) => {
  const usage = {
    flowVolume: faker.number.int(),
    totalSpent: faker.number.int(),
    openedAt: faker.date.past(),
    closedAt: faker.date.past(),
    ...overrides,
  };

  return usage as SpendingUsage;
};
