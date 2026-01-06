import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import { auth } from '@/lib/auth';
import { skillSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

export async function GET() {
  await dbConnect();
  try {
    const skills = await Skill.find({}).sort({ order: 1 });
    return NextResponse.json(skills);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
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
    const validatedData = skillSchema.parse(body);
    const skill = await Skill.create(validatedData as any);

    // Log the audit event
    await logAudit({
      action: 'CREATE',
      entity: 'SKILL',
      entityId: skill._id.toString(),
      details: `Created skill: ${skill.name}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
