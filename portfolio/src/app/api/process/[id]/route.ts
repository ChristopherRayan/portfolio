import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Process from '@/models/Process';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Sanitize body: remove immutable fields
    const { _id, createdAt, updatedAt, ...updateData } = body;
    const process = await Process.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!process) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 });
    }

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json(process);
  } catch (error) {
    console.error('Error updating process:', error);
    return NextResponse.json(
      { error: 'Failed to update process' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const process = await Process.findByIdAndDelete(id);
    
    if (!process) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 });
    }

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ message: 'Process deleted' });
  } catch (error) {
    console.error('Error deleting process:', error);
    return NextResponse.json(
      { error: 'Failed to delete process' },
      { status: 500 }
    );
  }
}
