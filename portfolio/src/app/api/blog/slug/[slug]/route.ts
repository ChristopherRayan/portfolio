import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    await dbConnect();

    // Try exact match first
    let post = await Blog.findOne({ slug, published: true });

    // Robust Fallback
    if (!post) {
      const alternativeSlug = slug.includes('-') ? slug.replace(/-/g, ' ') : slug.replace(/ /g, '-');
      post = await Blog.findOne({ slug: alternativeSlug, published: true });
    }

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
