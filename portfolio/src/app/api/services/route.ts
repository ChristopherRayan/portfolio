import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Service from '@/models/Service';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';

// GET /api/services - Get all active services (public)
export async function GET() {
  try {
    const session = await auth();
    await dbConnect();
    
    // For admin users, show all services. For public, only active ones.
    const query = session ? {} : { active: true };
    const services = await Service.find(query).sort({ order: 1 });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);

    // Log the audit event
    await logAudit({
      action: 'CREATE',
      entity: 'SERVICE',
      entityId: service._id.toString(),
      details: `Created service: ${service.title}`,
      performedBy: session.user.email || 'Admin'
    });
    
    revalidatePath('/services');
    revalidatePath('/');
    
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
