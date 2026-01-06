import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService extends Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  title: string;
  shortDesc: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  pricing: string;
  color: string;
  icon: string; // Icon name from lucide-react (e.g., 'Monitor', 'Code')
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    description: { type: String, required: true },
    features: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    pricing: { type: String, required: true },
    color: { type: String, required: true, default: 'blue' },
    icon: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Force model re-registration during development to prevent schema caching issues
if (mongoose.models.Service) {
  delete mongoose.models.Service;
}

const Service: Model<IService> = mongoose.model<IService>('Service', ServiceSchema);

export default Service;
