'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { IBlog } from '@/models/Blog';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function BlogPreview() {
  const { data: posts, isLoading } = useQuery<IBlog[]>({
      queryKey: ['blog-preview'],
      queryFn: async () => {
          // Ideally fetch limit=3
          const res = await fetch('/api/blog');
          if (!res.ok) throw new Error('Failed to fetch posts');
          return res.json();
      }
  });

  if (isLoading) return null; // Or skeleton
  if (!posts || posts.length === 0) return null;

  const recentPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             Thoughts, tutorials, and insights on web development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {recentPosts.map((post, index) => (
                <motion.div
                    key={post._id as string}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow bg-background">
                         <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                            {post.coverImage && (
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
                            )}
                         </div>
                        <CardHeader>
                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                                <Calendar className="w-3 h-3 mr-1" />
                                {post.createdAt && format(new Date(post.createdAt), 'MMM dd, yyyy')}
                            </div>
                            <CardTitle className="line-clamp-2 text-xl hover:text-primary transition-colors">
                                <Link href={`/blog`}>{post.title}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription className="line-clamp-3">
                                {post.excerpt}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
        
        <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/blog">View All Posts</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
