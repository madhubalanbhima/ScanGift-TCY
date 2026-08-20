import mongoose, { Schema, model, models } from "mongoose";

export interface ITcyCounter {
  _id: string;
  seq: number;
}

const STARTING_SEQUENCE = 50000;

const TcyCounterSchema = new Schema<ITcyCounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: STARTING_SEQUENCE },
});

export const TcyCounter =
  (models.TcyCounter as mongoose.Model<ITcyCounter>) ||
  model<ITcyCounter>("TcyCounter", TcyCounterSchema);

/**
 * Starts voucher numbers at 1001 and moves upward by 1 each time.
 * If an old counter document exists, reset it once so the numbering is clean.
 */
export async function getNextSequence(name: string): Promise<number> {
  const current = await TcyCounter.findOne({ _id: name }).lean();
  const nextSequence = current ? current.seq + 1 : STARTING_SEQUENCE + 1;

  await TcyCounter.findOneAndUpdate(
    { _id: name },
    { $set: { seq: nextSequence } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return nextSequence;
}

export async function resetCounter(name: string, startAt = STARTING_SEQUENCE): Promise<number> {
  await TcyCounter.deleteMany({ _id: name });
  const created = await TcyCounter.create({ _id: name, seq: startAt });
  return created.seq;
}
