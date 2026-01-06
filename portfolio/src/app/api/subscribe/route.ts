import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { rateLimit } from '@/lib/rateLimit';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Public endpoint to handle newsletter subscriptions
 */
export async function POST(req: NextRequest) {
  // 1. Basic rate limiting (e.g., 5 subscriptions per hour per IP)
  const rateLimitResult = await rateLimit(req, 5, 3600000);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { email } = subscribeSchema.parse(body);

    await dbConnect();

    // 2. Check for existing subscriber
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 });
      }
      
      // 3. Reactivate if previously unsubscribed
      existing.isActive = true;
      await existing.save();
      return NextResponse.json({ message: 'Welcome back! Your subscription is reactivated.' }, { status: 200 });
    }

    // 4. Create new subscriber
    await Subscriber.create({ email });

    return NextResponse.json({ message: 'Successfully subscribed to CRK Portfolio updates!' }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
