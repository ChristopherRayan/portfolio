import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';

/**
 * Unsubscribe a user using their unique secure token.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  try {
    await dbConnect();

    const subscriber = await Subscriber.findOne({ unsubToken: token });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired unsubscription link' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { message: 'You have already unsubscribed.' },
        { status: 200 }
      );
    }

    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json(
      { message: 'Successfully unsubscribed from CRK Portfolio updates.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscription' },
      { status: 500 }
    );
  }
}
