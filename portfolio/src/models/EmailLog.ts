import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmailLog extends Document {
  subscriber: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  status: 'SENT' | 'FAILED';
  error?: string;
  createdAt: Date;
}

const EmailLogSchema: Schema = new Schema(
  {
    subscriber: { 
      type: Schema.Types.ObjectId, 
      ref: 'Subscriber', 
      required: true 
    },
    blog: { 
      type: Schema.Types.ObjectId, 
      ref: 'Blog', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['SENT', 'FAILED'], 
      required: true 
    },
    error: { 
      type: String 
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);

export default EmailLog;
