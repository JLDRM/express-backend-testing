import { faker } from '@faker-js/faker';
import * as generate from './utils/generate';
import * as dispenserService from '../src/resources/dispenser/dispenser.service';
import * as dispenserUtils from '../src/resources/dispenser/dispenser.utils';
import {
  createDispenser,
  getDispenserSpending,
  toggleDispenser,
} from '../src/resources/dispenser/dispenser.controller';

jest.mock('../src/resources/dispenser/dispenser.service');
jest.mock('../src/resources/dispenser/dispenser.utils');

const consolError = console.error;

beforeEach(() => {
  jest.resetAllMocks();
  console.error = jest.fn();
});

afterAll(() => {
  console.error = consolError;
});

test('createDispenser return 400 if no flowVolume within payload', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const createDispenserServiceMock = jest.mocked(dispenserService.createDispenser);

  await createDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No flow volume within the body",
    ]
  `);
  expect(createDispenserServiceMock).not.toBeCalled();
});

test('createDispenser successfully', async () => {
  const req = generate.buildReq({ body: { flowVolume: 0.006 } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser();
  const createDispenserServiceMock = jest.mocked(dispenserService.createDispenser);
  createDispenserServiceMock.mockResolvedValueOnce(dispenser);

  await createDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(200);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json).toBeCalledWith({ id: dispenser.id, flowVolume: dispenser.flowVolume });
});

test('createDispenser returns 500 under unexpected error', async () => {
  const req = generate.buildReq({ body: { flowVolume: 0.006 } });
  const res = generate.buildRes();
  const createDispenserServiceMock = jest.mocked(dispenserService.createDispenser);
  const mockedConsoleError = jest.mocked(console.error, { shallow: true });

  createDispenserServiceMock.mockRejectedValueOnce(new Error('test'));
  await createDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(500);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Unexpected API error",
    ]
  `);
  expect(mockedConsoleError).toBeCalledTimes(1);
  expect(mockedConsoleError.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      [Error: test],
    ]
  `);
});

test('toggleDispenser return 400 if no id within query params', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  await toggleDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No correct id within the query",
    ]
  `);
  expect(findDispenserServiceMock).not.toBeCalled();
  expect(toggleDispenserServiceMock).not.toBeCalled();
});

test('toggleDispenser return 400 if bad id within query params', async () => {
  const req = generate.buildReq({ params: { id: 'test' } });
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  await toggleDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No correct id within the query",
    ]
  `);
  expect(findDispenserServiceMock).not.toBeCalled();
  expect(toggleDispenserServiceMock).not.toBeCalled();
});

test('toggleDispenser return 400 if no status within body', async () => {
  const req = generate.buildReq({ params: { id: faker.database.mongodbObjectId() } });
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  await toggleDispenser(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No correct status within the body",
    ]
  `);
  expect(findDispenserServiceMock).not.toBeCalled();
  expect(toggleDispenserServiceMock).not.toBeCalled();
});

test('toggleDispenser return 404 if no dispenser by param id', async () => {
  const req = generate.buildReq({ params: { id: '22fcfbceb9aeef2f508e24ca' }, body: { status: 'open' } });
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  findDispenserServiceMock.mockResolvedValueOnce(undefined as any);
  await toggleDispenser(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith('22fcfbceb9aeef2f508e24ca');
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "The dispenser with id 22fcfbceb9aeef2f508e24ca not found",
    ]
  `);
  expect(toggleDispenserServiceMock).not.toBeCalled();
});

test('toggleDispenser return 400 if dispenser status is equal to payload status', async () => {
  const req = generate.buildReq({ params: { id: '22fcfbceb9aeef2f508e24ca' }, body: { status: 'close' } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser({ id: '22fcfbceb9aeef2f508e24ca' });
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  findDispenserServiceMock.mockResolvedValueOnce(dispenser);
  await toggleDispenser(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith('22fcfbceb9aeef2f508e24ca');
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Dispenser with id: 22fcfbceb9aeef2f508e24ca was already close",
    ]
  `);
  expect(toggleDispenserServiceMock).not.toBeCalled();
});

test('toggleDispenser successfully', async () => {
  const id = faker.database.mongodbObjectId();
  const req = generate.buildReq({ params: { id }, body: { status: 'open' } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser({ id });
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);

  findDispenserServiceMock.mockResolvedValueOnce(dispenser);
  await toggleDispenser(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith(id);
  expect(toggleDispenserServiceMock).toBeCalledTimes(1);
  expect(toggleDispenserServiceMock.mock.calls[0][0]).toBe(dispenser);
  expect(toggleDispenserServiceMock.mock.calls[0][2]).toBe(req.body);
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(200);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Status of the tap changed correctly",
    ]
  `);
});

test('toggleDispenser returns 500 under unexpected error', async () => {
  const id = faker.database.mongodbObjectId();
  const req = generate.buildReq({ params: { id }, body: { status: 'open' } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser({ id });
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const toggleDispenserServiceMock = jest.mocked(dispenserService.toggleDispenser);
  const mockedConsoleError = jest.mocked(console.error, { shallow: true });

  findDispenserServiceMock.mockResolvedValueOnce(dispenser);
  toggleDispenserServiceMock.mockRejectedValueOnce(new Error('test'));
  await toggleDispenser(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith(id);
  expect(toggleDispenserServiceMock).toBeCalledTimes(1);
  expect(toggleDispenserServiceMock.mock.calls[0][0]).toBe(dispenser);
  expect(toggleDispenserServiceMock.mock.calls[0][2]).toBe(req.body);
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(500);
  expect(mockedConsoleError.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      [Error: test],
    ]
  `);
  expect(mockedConsoleError).toBeCalledTimes(1);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Unexpected API error",
    ]
  `);
});

test('getDispenserSpending return 400 if no id within query params', async () => {
  const req = generate.buildReq();
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const getDispenserSpendingUtilMock = jest.mocked(dispenserUtils.getDispenserSpending);

  await getDispenserSpending(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No correct id within the query",
    ]
  `);
  expect(findDispenserServiceMock).not.toBeCalled();
  expect(getDispenserSpendingUtilMock).not.toBeCalled();
});

test('getDispenserSpending return 400 if bad id within query params', async () => {
  const req = generate.buildReq({ params: { id: 'test' } });
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const getDispenserSpendingUtilMock = jest.mocked(dispenserUtils.getDispenserSpending);

  await getDispenserSpending(req, res);

  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "No correct id within the query",
    ]
  `);
  expect(findDispenserServiceMock).not.toBeCalled();
  expect(getDispenserSpendingUtilMock).not.toBeCalled();
});

test('getDispenserSpending return 404 if no dispenser by param id', async () => {
  const req = generate.buildReq({ params: { id: '22fcfbceb9aeef2f508e24ca' }, body: { status: 'open' } });
  const res = generate.buildRes();
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const getDispenserSpendingUtilMock = jest.mocked(dispenserUtils.getDispenserSpending);

  findDispenserServiceMock.mockResolvedValueOnce(undefined as any);
  await toggleDispenser(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith('22fcfbceb9aeef2f508e24ca');
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(404);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "The dispenser with id 22fcfbceb9aeef2f508e24ca not found",
    ]
  `);
  expect(getDispenserSpendingUtilMock).not.toBeCalled();
});

test('getDispenserSpending successfully', async () => {
  const id = faker.database.mongodbObjectId();
  const req = generate.buildReq({ params: { id }, body: { status: 'open' } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser({ id });
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const getDispenserSpendingUtilMock = jest.mocked(dispenserUtils.getDispenserSpending);

  findDispenserServiceMock.mockResolvedValueOnce(dispenser);
  getDispenserSpendingUtilMock.mockReturnValueOnce({ usages: dispenser.usages, amount: 1 });
  await getDispenserSpending(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith(id);
  expect(getDispenserSpendingUtilMock).toBeCalledTimes(1);
  expect(getDispenserSpendingUtilMock).toBeCalledWith(dispenser);
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(200);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "amount": 1,
        "usages": Array [],
      },
    ]
  `);
});

test('getDispenserSpending returns 500 under unexpected error', async () => {
  const id = faker.database.mongodbObjectId();
  const req = generate.buildReq({ params: { id }, body: { status: 'open' } });
  const res = generate.buildRes();
  const dispenser = generate.buildDispenser({ id });
  const findDispenserServiceMock = jest.mocked(dispenserService.findDispenserById);
  const getDispenserSpendingUtilMock = jest.mocked(dispenserUtils.getDispenserSpending);
  const mockedConsoleError = jest.mocked(console.error, { shallow: true });

  findDispenserServiceMock.mockResolvedValueOnce(dispenser);
  getDispenserSpendingUtilMock.mockImplementation(() => {
    throw new Error('test');
  });
  await getDispenserSpending(req, res);

  expect(findDispenserServiceMock).toBeCalledTimes(1);
  expect(findDispenserServiceMock).toBeCalledWith(id);
  expect(getDispenserSpendingUtilMock).toBeCalledTimes(1);
  expect(getDispenserSpendingUtilMock).toBeCalledWith(dispenser);
  expect(res.status).toBeCalledTimes(1);
  expect(res.status).toBeCalledWith(500);
  expect(mockedConsoleError.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      [Error: test],
    ]
  `);
  expect(mockedConsoleError).toBeCalledTimes(1);
  expect(res.json).toBeCalledTimes(1);
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "Unexpected API error",
    ]
  `);
});
