import mongoose, { Schema, model, models } from "mongoose";

export interface ITcyVoucherScan {
  _id: string;
  voucherId: string;
  customerId: string;
  scannedAt: Date;
  userAgent?: string;
}

const VoucherScanSchema = new Schema<ITcyVoucherScan>({
  voucherId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  scannedAt: { type: Date, default: Date.now },
  userAgent: { type: String },
});

export const TcyVoucherScan =
  (models.TcyVoucherScan as mongoose.Model<ITcyVoucherScan>) ||
  model<ITcyVoucherScan>("TcyVoucherScan", VoucherScanSchema);