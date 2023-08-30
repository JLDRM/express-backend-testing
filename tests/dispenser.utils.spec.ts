import cases from 'jest-in-case';
import { getDispenserSpending, getTotalSpent } from '../src/resources/dispenser/dispenser.utils';
import { DispenserDocument } from '../src/resources/dispenser/schemas/dispenser.schema';

interface getTotalSpentOpts {
  name: string;
  openedAt: Date;
  closedAt: Date;
  flowVolume: number;
  beerPrice: number;
  totalSpent: number;
}

cases(
  'getTotalSpent works with',
  (opts: getTotalSpentOpts) => {
    expect(getTotalSpent(opts.openedAt, opts.closedAt, opts.flowVolume, opts.beerPrice)).toBe(opts.totalSpent);
  },
  [
    {
      name: 'valid dates',
      openedAt: new Date('2023-06-06T11:03:19.349+00:00'),
      closedAt: new Date('2023-06-06T11:03:28.318+00:00'),
      flowVolume: 0.006,
      beerPrice: 12.25,
      totalSpent: 0.6592215,
    },
    {
      name: 'invalid dates',
      openedAt: new Date('2023-06-06T11:03:28.318+00:00'),
      closedAt: new Date('2023-06-06T11:03:19.349+00:00'),
      flowVolume: 0.006,
      beerPrice: 12.25,
      totalSpent: -0.6592215,
    },
  ],
);

it('getDispenserSpending service returns amount 1 if dispenser usages total spent is 1', () => {
  expect(getDispenserSpending({ usages: [{ totalSpent: 1 }] } as DispenserDocument)).toStrictEqual({
    amount: 1,
    usages: [{ totalSpent: 1 }],
  });
});
