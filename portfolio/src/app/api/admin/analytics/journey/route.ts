import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Analytics from '@/models/Analytics';
import { auth } from '@/lib/auth';

/**
 * GET /api/admin/analytics/journey
 * Aggregates analytics by session to visualize user flows.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');

  try {
    await dbConnect();

    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    if (!startDateStr) {
      startDate.setDate(endDate.getDate() - 7); // Default to last 7 days for detail view
    }

    const journeys = await Analytics.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate }, type: 'view' } },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: '$sessionHash',
          steps: { $push: { path: '$path', timestamp: '$timestamp' } },
          referrer: { $first: '$referrer' },
          startTime: { $first: '$timestamp' }
        }
      },
      { $sort: { startTime: -1 } },
      { $limit: 100 } // Limit to 100 most recent sessions
    ]);

    return NextResponse.json(journeys);
  } catch (error) {
    console.error('Failed to fetch user journeys:', error);
    return NextResponse.json({ error: 'Failed to fetch journeys' }, { status: 500 });
  }
}
