import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { auth } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET() {
  await dbConnect();
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    return NextResponse.json(projects);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const validatedData = projectSchema.parse(body);
    const project = await Project.create(validatedData as any);

    // Log the audit event
    await logAudit({
      action: 'CREATE',
      entity: 'PROJECT',
      entityId: project._id.toString(),
      details: `Created project: ${project.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(project, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
