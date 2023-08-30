export interface PostDispenserBody {
  flowVolume: number;
}

export interface PostDispenserResponse {
  id: string;
  flowVolume: number;
}

export interface PutDispenserBody {
  status: DispenserStatus;
}

export interface GetSpendingResponse {
  amount: number;
  usages: SpendingUsage[];
}

export interface SpendingUsage {
  openedAt?: Date | undefined;
  closedAt?: Date | undefined;
  flowVolume?: number | undefined;
  totalSpent: number;
}

export type DispenserStatus = 'open' | 'close';
