import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  path: string;
  type: 'view' | 'click' | 'interaction';
  referrer: string;
  userAgent: string;
  sessionHash: string; // Anonymized session ID
  metadata?: Record<string, any>;
  timestamp: Date;
}

const AnalyticsSchema: Schema = new Schema({
  path: { type: String, required: true, index: true },
  type: { type: String, enum: ['view', 'click', 'interaction'], default: 'view' },
  referrer: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  sessionHash: { type: String, required: true, index: true },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Compound index for unique views per session per path per day
// This allows us to aggregate unique visitors easily
AnalyticsSchema.index({ path: 1, sessionHash: 1, timestamp: 1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
