import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Analytics from '@/models/Analytics';
import { auth } from '@/lib/auth';

/**
 * GET /api/admin/analytics/export
 * Exports analytics data as CSV.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');
  const format = searchParams.get('format') || 'csv';

  try {
    await dbConnect();

    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    if (!startDateStr) {
      startDate.setDate(endDate.getDate() - 30);
    }

    const data = await Analytics.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });

    if (format === 'csv') {
      const headers = ['Timestamp', 'Path', 'Type', 'Referrer', 'User Agent', 'Session Hash'];
      const rows = data.map(log => [
        log.timestamp.toISOString(),
        log.path,
        log.type,
        log.referrer || 'Direct',
        log.userAgent,
        log.sessionHash
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics_export_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default return JSON if not CSV
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to export analytics data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
