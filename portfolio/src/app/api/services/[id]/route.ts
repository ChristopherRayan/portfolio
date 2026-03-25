import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Service from '@/models/Service';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';

// GET /api/services/[id] - Get single service
export async function GET(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update service (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    // Sanitize body: remove immutable fields if present
    const { _id, createdAt, updatedAt, ...updateData } = body;

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Log the audit event
    await logAudit({
      action: 'UPDATE',
      entity: 'SERVICE',
      entityId: service._id.toString(),
      details: `Updated service: ${service.title}`,
      performedBy: session.user.email || 'Admin'
    });
    
    revalidatePath('/services');
    revalidatePath('/');
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete service (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Log the audit event
    await logAudit({
      action: 'DELETE',
      entity: 'SERVICE',
      entityId: id,
      details: `Deleted service: ${service.title}`,
      performedBy: session.user.email || 'Admin'
    });
    
    revalidatePath('/services');
    revalidatePath('/');

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
