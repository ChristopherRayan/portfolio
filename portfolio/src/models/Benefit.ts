import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBenefit extends Document {
  icon: string; // Lucide icon name
  title: string;
  description: string;
  order: number;
}

const BenefitSchema: Schema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Benefit: Model<IBenefit> =
  mongoose.models.Benefit || mongoose.model<IBenefit>('Benefit', BenefitSchema);

export default Benefit;
