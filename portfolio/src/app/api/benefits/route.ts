import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Benefit from '@/models/Benefit';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    const benefits = await Benefit.find({}).sort({ order: 1 });
    return NextResponse.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const benefit = await Benefit.create(body);
    
    revalidatePath('/services');
    revalidatePath('/');
    
    return NextResponse.json(benefit, { status: 201 });
  } catch (error) {
    console.error('Error creating benefit:', error);
    return NextResponse.json(
      { error: 'Failed to create benefit' },
      { status: 500 }
    );
  }
}
