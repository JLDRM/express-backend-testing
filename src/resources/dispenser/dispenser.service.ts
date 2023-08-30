import { PostDispenserBody, PutDispenserBody, SpendingUsage } from './dispenser.interface';
import { getTotalSpent } from './dispenser.utils';
import { DispenserDocument, DispenserModel } from './schemas/dispenser.schema';

export const BEER_LITER_PRICE = 12.25;

const createDispenser = async ({ flowVolume }: PostDispenserBody) => {
  const createdDispenser = await DispenserModel.create({ flowVolume });

  return createdDispenser;
};

const toggleDispenser = async (dispenser: DispenserDocument, timestamp: Date, { status }: PutDispenserBody) => {
  if (status === 'open') {
    await DispenserModel.findByIdAndUpdate(dispenser.id, {
      status,
      openedAt: timestamp,
      closedAt: null,
    });
  }

  if (status === 'close' && dispenser.openedAt) {
    const totalSpent = getTotalSpent(dispenser.openedAt, timestamp, dispenser.flowVolume, BEER_LITER_PRICE);
    const usage: SpendingUsage = {
      flowVolume: dispenser.flowVolume,
      openedAt: dispenser.openedAt,
      closedAt: timestamp,
      totalSpent,
    };
    await DispenserModel.findByIdAndUpdate(dispenser.id, {
      status,
      openedAt: null,
      closedAt: timestamp,
      usages: dispenser.usages.concat(usage),
    });
  }
};

const findDispenserById = async (dispenserId: string) => {
  return await DispenserModel.findById(dispenserId);
};

export { createDispenser, toggleDispenser, findDispenserById };
