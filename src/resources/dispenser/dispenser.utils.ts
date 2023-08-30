import { DispenserDocument } from './schemas/dispenser.schema';

const getDispenserSpending = (dispenser: DispenserDocument) => {
  const amount = dispenser.usages.reduce((accumulated, currentUsage) => accumulated + currentUsage.totalSpent, 0);

  return {
    usages: dispenser.usages,
    amount,
  };
};

const getTotalSpent = (openedAt: Date, closedAt: Date, flowVolume: number, beerPrice: number) => {
  const usageSeconds = (closedAt.valueOf() - openedAt.valueOf()) / 1000;
  const beerVolume = usageSeconds * flowVolume;
  const totalSpent = beerVolume * beerPrice;

  return totalSpent;
};

export { getDispenserSpending, getTotalSpent };
