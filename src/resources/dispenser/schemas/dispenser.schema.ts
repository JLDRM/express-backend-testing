import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const dispenserSchema = new Schema(
  {
    flowVolume: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'close',
    },
    openedAt: Date,
    closedAt: Date,
    totalSpent: {
      type: Number,
      default: 0,
    },
    usages: [
      {
        openedAt: Date,
        closedAt: Date,
        flowVolume: Number,
        totalSpent: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true },
);

export type Dispenser = InferSchemaType<typeof dispenserSchema>;

export type DispenserDocument = HydratedDocument<Dispenser>;

export const DispenserModel = model('dispenser', dispenserSchema);
