import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { contactSchema } from '@/lib/validations';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { sendContactNotification } from '@/lib/mail';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { success } = await rateLimit(req, 5, 3600000); // 5 per hour
  if (!success) {
    return NextResponse.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
  }

  await dbConnect();
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);
    
    const contact = await Contact.create(validatedData);
    
    // Send email notification to admin
    void sendContactNotification({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message
    });
    
    return NextResponse.json(contact, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

