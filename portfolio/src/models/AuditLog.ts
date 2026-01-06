import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'PROJECT' | 'BLOG' | 'SKILL' | 'SERVICE' | 'PROFILE' | 'CONTACT' | 'USER';
  entityId?: string;
  details: string;
  performedBy: String; // Email or User ID
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { 
    type: String, 
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']
  },
  entity: { 
    type: String, 
    required: true,
    enum: ['PROJECT', 'BLOG', 'SKILL', 'SERVICE', 'PROFILE', 'CONTACT', 'USER']
  },
  entityId: { 
    type: String 
  },
  details: { 
    type: String, 
    required: true 
  },
  performedBy: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: false // We use our own timestamp
});

// Index for performance
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ entity: 1, entityId: 1 });

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
