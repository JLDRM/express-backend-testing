import { faker } from '@faker-js/faker';
import * as dispenserService from '../src/resources/dispenser/dispenser.service';
import * as dispenserUtils from '../src/resources/dispenser/dispenser.utils';
import { DispenserModel } from '../src/resources/dispenser/schemas/dispenser.schema';
import * as generate from './utils/generate';

jest.mock('../src/resources/dispenser/dispenser.utils');
jest.mock('../src/resources/dispenser/schemas/dispenser.schema');

beforeEach(() => {
  jest.resetAllMocks();
});

test('createDispenser service return a created dispenser', async () => {
  const dispenser = generate.buildDispenser();
  const mockedDispenserModel = jest.mocked(DispenserModel, { shallow: true });
  mockedDispenserModel.create.mockResolvedValueOnce(dispenser);

  const response = await dispenserService.createDispenser({ flowVolume: 0.006 });

  expect(DispenserModel.create).toBeCalledWith({ flowVolume: 0.006 });
  expect(DispenserModel.create).toBeCalledTimes(1);
  expect(response).toEqual(dispenser);
});

test('toggleDispenser service should handle open', async () => {
  const dispenser = generate.buildDispenser();
  const status = 'open';
  const timestamp = faker.date.anytime();

  const mockedDispenserModel = jest.mocked(DispenserModel, { shallow: true });

  await dispenserService.toggleDispenser(dispenser, timestamp, { status });

  expect(mockedDispenserModel.findByIdAndUpdate).toBeCalledTimes(1);
  expect(mockedDispenserModel.findByIdAndUpdate).toBeCalledWith(dispenser.id, {
    status,
    openedAt: timestamp,
    closedAt: null,
  });
});

test('toggleDispenser service should handle close', async () => {
  const dispenser = generate.buildDispenser({ openedAt: faker.date.anytime() });
  const status = 'close';
  const timestamp = faker.date.anytime();
  const usage = generate.buildDispenserUsage({
    totalSpent: 1,
    flowVolume: dispenser.flowVolume,
    openedAt: dispenser.openedAt,
    closedAt: timestamp,
  });

  const mockedGetTotalSpent = jest.mocked(dispenserUtils.getTotalSpent);
  mockedGetTotalSpent.mockReturnValueOnce(1);
  const mockedDispenserModel = jest.mocked(DispenserModel, { shallow: true });

  await dispenserService.toggleDispenser(dispenser, timestamp, {
    status,
  });

  expect(mockedGetTotalSpent).toBeCalledTimes(1);
  expect(mockedGetTotalSpent).toBeCalledWith(
    dispenser.openedAt,
    timestamp,
    dispenser.flowVolume,
    dispenserService.BEER_LITER_PRICE,
  );
  expect(mockedDispenserModel.findByIdAndUpdate).toBeCalledTimes(1);
  expect(mockedDispenserModel.findByIdAndUpdate).toBeCalledWith(dispenser.id, {
    status,
    openedAt: null,
    closedAt: timestamp,
    usages: dispenser.usages.concat(usage),
  });
});

test('findDispenserById service should return dispenser', async () => {
  const dispenser = generate.buildDispenser();

  const mockedDispenserModel = jest.mocked(DispenserModel, { shallow: true });
  mockedDispenserModel.findById.mockResolvedValueOnce(dispenser);
  const result = await dispenserService.findDispenserById(dispenser.id);

  expect(mockedDispenserModel.findById).toBeCalledTimes(1);
  expect(mockedDispenserModel.findById).toBeCalledWith(dispenser.id);
  expect(result).toBe(dispenser);
});
