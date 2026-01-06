import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { auth } from '@/lib/auth';
import { profileSchema } from '@/lib/validations';

export async function GET() {
  await dbConnect();
  try {
    const profile = await Profile.findOne({});
    // Return empty object if no profile yet, or 404? 
    // Plan suggests we should have one profile.
    return NextResponse.json(profile || {});
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const validatedData = profileSchema.parse(body);
    
    // upsert: true creates it if it doesn't exist
    // Debug logs
    console.log('PUT /api/profile Validated Data:', JSON.stringify(validatedData, null, 2));
    console.log('Mongoose Schema Paths:', Object.keys(Profile.schema.paths).filter(k => k.includes('hero')));

    const profile = await Profile.findOneAndUpdate({}, validatedData as any, {
      new: true,
      upsert: true,
      runValidators: true,
      strict: false, // Bypass stale schema check
    });
    
    return NextResponse.json(profile);
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
