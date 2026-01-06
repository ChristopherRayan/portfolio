import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Process from '@/models/Process';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    const processes = await Process.find({}).sort({ order: 1 });
    return NextResponse.json(processes);
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch processes' },
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
    const process = await Process.create(body);
    
    revalidatePath('/services');
    revalidatePath('/');
    
    return NextResponse.json(process, { status: 201 });
  } catch (error) {
    console.error('Error creating process:', error);
    return NextResponse.json(
      { error: 'Failed to create process' },
      { status: 500 }
    );
  }
}
