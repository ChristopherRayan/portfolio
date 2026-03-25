import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import { auth } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Record<string, string>> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Record<string, string>> }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  try {
    const body = await req.json();
    const validatedData = projectSchema.parse(body);
    const project = await Project.findByIdAndUpdate(id, validatedData as any, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log the audit event
    await logAudit({
      action: 'UPDATE',
      entity: 'PROJECT',
      entityId: project._id.toString(),
      details: `Updated project: ${project.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Record<string, string>> }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log the audit event
    await logAudit({
      action: 'DELETE',
      entity: 'PROJECT',
      entityId: id,
      details: `Deleted project: ${project.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
