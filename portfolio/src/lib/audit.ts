import AuditLog from '@/models/AuditLog';
import { dbConnect } from './db';

interface LogOptions {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'PROJECT' | 'BLOG' | 'SKILL' | 'SERVICE' | 'PROFILE' | 'CONTACT' | 'USER';
  entityId?: string;
  details: string;
  performedBy: string;
}

/**
 * Logs an action to the AuditLog collection.
 * This is designed to be used in API routes (server-side).
 */
export async function logAudit({ action, entity, entityId, details, performedBy }: LogOptions) {
  try {
    await dbConnect();
    
    await AuditLog.create({
      action,
      entity,
      entityId,
      details,
      performedBy,
      timestamp: new Date()
    });
    
    console.log(`[AuditLog] ${action} on ${entity} by ${performedBy}`);
  } catch (error) {
    // We don't want audit logging to crash the main request, 
    // but we should log the failure.
    console.error('[AuditLog Error]', error);
  }
}
