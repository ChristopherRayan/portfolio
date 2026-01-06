import type { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import BlogDetailsClient from '@/components/public/BlogDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  await dbConnect();
  
  // Try exact match first
  let post = await Blog.findOne({ slug }).lean();

  // Robust Fallback: Try with hyphens/spaces swapped if not found
  if (!post) {
    const alternativeSlug = slug.includes('-') ? slug.replace(/-/g, ' ') : slug.replace(/ /g, '-');
    post = await Blog.findOne({ slug: alternativeSlug }).lean();
  }

  if (!post) {
    return {
      title: 'Perspective Not Found | Portfolio',
    };
  }
// ...
// (skipping some lines for brevity in instruction, but replacing the whole block)
  const title = post.title;
  const description = post.excerpt || 'Exploring the intersection of code, design, and artificial intelligence.';
  const image = post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80';

  return {
    title: `${title} | Chris's Perspectives`,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: post.createdAt?.toISOString(),
      authors: ['Chris'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@iamchris',
    },
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  await dbConnect();
  
  // Try exact match first
  let postDoc = await Blog.findOne({ slug }).lean();

  // Robust Fallback
  if (!postDoc) {
     const alternativeSlug = slug.includes('-') ? slug.replace(/-/g, ' ') : slug.replace(/ /g, '-');
     postDoc = await Blog.findOne({ slug: alternativeSlug }).lean();
  }
  
  if (!postDoc) {
    notFound();
  }

  // Serialize Mongoose docs for Client Component
  const post = JSON.parse(JSON.stringify(postDoc)) as IBlog;

  return <BlogDetailsClient initialPost={post} slug={slug} />;
}
