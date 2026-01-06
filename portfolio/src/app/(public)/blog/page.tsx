import { BlogListing } from '@/components/public/BlogListing';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { Suspense } from 'react';

export const metadata = {
  title: 'Blog',
  description: 'Exploring the intersection of code, security, and digital craft.',
};

export default async function BlogListingPage() {
  await dbConnect();
  
  // Fetch blog posts on the server (server-side only, invisible to client)
  const posts = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
  
  // Serialize for client component
  const serializedPosts = JSON.parse(JSON.stringify(posts));

  return (
    <Suspense fallback={<div className="py-20 text-center container min-h-screen pt-32">Loading articles...</div>}>
      <BlogListing initialPosts={serializedPosts} />
    </Suspense>
  );
}
