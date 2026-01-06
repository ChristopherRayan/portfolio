import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import AuditLog from '@/models/AuditLog';

/**
 * GET /api/admin/audit-logs
 * Fetches the most recent audit logs. Protected (Admin only).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch last 100 logs by default
    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .limit(100);
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
