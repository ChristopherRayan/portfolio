import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { auth } from '@/lib/auth';
import { blogSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
import { broadcastBlogNotification } from '@/lib/mail';

export async function GET() {
  await dbConnect();
  try {
    const posts = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
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
    const validatedData = blogSchema.parse(body);
    const post = await Blog.create(validatedData as any);

    // If published immediately, trigger notifications
    if (post.published) {
      void broadcastBlogNotification(post);
    }

    // Log the audit event
    await logAudit({
      action: 'CREATE',
      entity: 'BLOG',
      entityId: post._id.toString(),
      details: `Created blog post: ${post.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(post, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
