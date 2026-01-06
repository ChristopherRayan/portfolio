import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { auth } from '@/lib/auth';
import { blogSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';
import { broadcastBlogNotification } from '@/lib/mail';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const post = await Blog.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

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
    const validatedData = blogSchema.parse(body);

    // Fetch existing state to check for publication transition
    const existingPost = await Blog.findById(id);

    const post = await Blog.findByIdAndUpdate(id, validatedData as any, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Trigger notification if it was just published
    if (existingPost && !existingPost.published && post.published) {
      void broadcastBlogNotification(post);
    }

    // Log the audit event
    await logAudit({
      action: 'UPDATE',
      entity: 'BLOG',
      entityId: post._id.toString(),
      details: `Updated blog post: ${post.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json(post);
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
    const post = await Blog.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Log the audit event
    await logAudit({
      action: 'DELETE',
      entity: 'BLOG',
      entityId: id,
      details: `Deleted blog post: ${post.title}`,
      performedBy: session.user.email || 'Admin'
    });

    return NextResponse.json({ message: 'Post deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
