import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import { auth } from '@/lib/auth';
import { skillSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  try {
    const body = await req.json();
    const validatedData = skillSchema.parse(body);
    const skill = await Skill.findByIdAndUpdate(id, validatedData as any, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Log the audit event
    await logAudit({
      action: 'UPDATE',
      entity: 'SKILL',
      entityId: skill._id.toString(),
      details: `Updated skill: ${skill.name}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  try {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Log the audit event
    await logAudit({
      action: 'DELETE',
      entity: 'SKILL',
      entityId: id,
      details: `Deleted skill: ${skill.name}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json({ message: 'Skill deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
