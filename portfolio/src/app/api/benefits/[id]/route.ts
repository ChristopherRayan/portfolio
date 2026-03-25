import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Benefit from '@/models/Benefit';
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
    const benefit = await Benefit.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!benefit) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json(benefit);
  } catch (error) {
    console.error('Error updating benefit:', error);
    return NextResponse.json(
      { error: 'Failed to update benefit' },
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
    const benefit = await Benefit.findByIdAndDelete(id);
    
    if (!benefit) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ message: 'Benefit deleted' });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    return NextResponse.json(
      { error: 'Failed to delete benefit' },
      { status: 500 }
    );
  }
}
