import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Analytics from '@/models/Analytics';
import crypto from 'crypto';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { success } = await rateLimit(req, 100, 60000); // 100 per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    await dbConnect();
    const body = await req.json();
    const { path, type = 'view', referrer = '', metadata = {} } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Get client tracking info
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Privacy-Friendly Session Hashing
    // We combine IP + UserAgent + Today's date to create a unique but anonymized session ID
    // This allows tracking unique visitors per day without storing PII (IP addresses)
    const salt = new Date().toISOString().split('T')[0]; // Constant salt per day
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${salt}`)
      .digest('hex');

    await Analytics.create({
      path,
      type,
      referrer,
      userAgent,
      sessionHash,
      metadata,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Silent fail for frontend - we don't want to break the user experience if tracking fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
