import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Analytics from '@/models/Analytics';
import { auth } from '@/lib/auth';

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
    
    // Set up date ranges
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    if (!startDateStr) {
      startDate.setDate(endDate.getDate() - 30);
    }

    // Calculate duration for comparison period
    const duration = endDate.getTime() - startDate.getTime();
    const compEndDate = new Date(startDate.getTime());
    const compStartDate = new Date(compEndDate.getTime() - duration);

    const getStatsForRange = async (start: Date, end: Date) => {
      return await Analytics.aggregate([
        { $match: { timestamp: { $gte: start, $lte: end } } },
        {
          $facet: {
            totalViews: [{ $count: 'count' }],
            popularPaths: [
              { $group: { _id: '$path', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            dailyViews: [
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                  views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } },
                  interactions: { $sum: { $cond: [{ $eq: ['$type', 'interaction'] }, 1, 0] } },
                  clicks: { $sum: { $cond: [{ $eq: ['$type', 'click'] }, 1, 0] } }
                }
              },
              { $sort: { _id: 1 } }
            ],
            trafficSources: [
              { $group: { _id: '$referrer', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ]
          }
        }
      ]);
    };

    const [currentStats, previousStats] = await Promise.all([
      getStatsForRange(startDate, endDate),
      getStatsForRange(compStartDate, compEndDate)
    ]);

    return NextResponse.json({
      current: currentStats[0],
      previous: previousStats[0],
      period: {
        start: startDate,
        end: endDate,
        compStart: compStartDate,
        compEnd: compEndDate
      }
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
