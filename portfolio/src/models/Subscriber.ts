import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface ISubscriber extends Document {
  email: string;
  isActive: boolean;
  unsubToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema: Schema = new Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    unsubToken: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => crypto.randomBytes(32).toString('hex')
    },
  },
  { timestamps: true }
);

const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber;
