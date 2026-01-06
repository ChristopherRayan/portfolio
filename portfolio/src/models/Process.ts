import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProcess extends Document {
  step: string; // e.g., "01"
  title: string;
  description: string;
  order: number;
}

const ProcessSchema: Schema = new Schema(
  {
    step: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Process: Model<IProcess> =
  mongoose.models.Process || mongoose.model<IProcess>('Process', ProcessSchema);

export default Process;
