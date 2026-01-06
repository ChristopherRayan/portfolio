'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IBlog } from '@/models/Blog';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowLeft, Facebook, Linkedin, Share2, ZoomIn, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogDetailsClientProps {
    initialPost: IBlog;
    slug: string;
}

export default function BlogDetailsClient({ initialPost, slug }: BlogDetailsClientProps) {
  const router = useRouter();

  const { data: post } = useQuery<IBlog>({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/slug/${slug}`);
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    },
    initialData: initialPost,
    staleTime: 60 * 1000,
  });

  const { data: allPosts } = useQuery<IBlog[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog');
      return res.json();
    },
  });

  const relatedPosts = allPosts?.filter(p => 
    String(p._id) !== String(post?._id) && p.tags.some(t => post?.tags.includes(t))
  ).slice(0, 3);

  const share = (platform: 'fb' | 'li' | 'tw' | 'wa') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = post?.title || '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Read this: ${title}`);

    let shareUrl = '';
    switch(platform) {
      case 'fb': 
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`; 
        break;
      case 'li': 
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`; 
        break;
      case 'tw':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'wa':
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20--%20${encodedUrl}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const readTime = post ? Math.max(1, Math.ceil(post.content.split(' ').length / 200)) : 0;

  // Handle image clicks for lightbox
  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        setSelectedImage((target as HTMLImageElement).src);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('click', handleImageClick);
      return () => content.removeEventListener('click', handleImageClick);
    }
  }, [post]);

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full mt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80'} 
            alt={post.title}
            fill
            className="object-cover brightness-[0.4] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 h-full flex flex-col items-center justify-end pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-6"
          >
            <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em]">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-md">
                {post.category || post.tags[0] || 'Perspective'}
              </span>
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-white drop-shadow-sm font-bold">{format(new Date(post.createdAt || Date.now()), 'MMMM dd, yyyy')}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-white/60 font-medium">
                  <Clock size={16} className="text-yellow-400" />
                  <span>{readTime} MIN READ</span>
               </div>
               <div className="w-px h-4 bg-white/20" />
               <div className="flex gap-4">
                  <Button size="icon" variant="ghost" className="text-white/80 hover:text-primary hover:bg-white/10 rounded-full" onClick={() => share('fb')} title="Share on Facebook">
                    <Facebook size={20} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white/80 hover:text-primary hover:bg-white/10 rounded-full" onClick={() => share('li')} title="Share on LinkedIn">
                    <Linkedin size={20} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white/80 hover:text-primary hover:bg-white/10 rounded-full" onClick={() => share('tw')} title="Share on X (Twitter)">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </Button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="container max-w-[1600px] mx-auto px-4 -mt-8 py-20 flex flex-col lg:grid lg:grid-cols-[24px_1fr_320px] gap-12 relative z-20">
        <div className="hidden lg:block sticky top-32 h-fit">
          <div className="flex flex-col gap-6 items-center">
             <Button 
                size="icon" 
                variant="outline" 
                onClick={() => router.back()}
                className="rounded-full h-8 w-8 border-2 shadow-sm hover:scale-110 transition-transform"
             >
                <ArrowLeft size={16} />
             </Button>
             <div className="w-px h-8 bg-border" />
             <div className="flex flex-col gap-5">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:text-primary transition-colors" onClick={() => share('fb')} title="Share on Facebook"><Facebook size={18} /></Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:text-primary transition-colors" onClick={() => share('li')} title="Share on LinkedIn"><Linkedin size={18} /></Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:text-primary transition-colors" onClick={() => share('tw')} title="Share on X (Twitter)">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:text-primary transition-colors" onClick={() => share('wa')} title="Share on WhatsApp">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:text-primary transition-colors" title="Copy Link" onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   toast.success("Link copied!");
                }}><Share2 size={18} /></Button>
              </div>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm p-8 md:p-14 rounded-2xl border border-border shadow-soft-xl overflow-hidden">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground"
          >
            <div 
              ref={contentRef}
              className="rich-text-content first-letter:text-7xl first-letter:font-black first-letter:text-primary first-letter:float-left first-letter:mr-4 first-letter:mt-2"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </motion.article>

          <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-3">
             {post.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-muted/50 rounded-full text-sm font-bold border border-border/50 hover:bg-primary/10 hover:text-primary transition-all cursor-default">
                   # {tag.toUpperCase()}
                </span>
             ))}
          </div>
        </div>

        <aside className="space-y-12 h-fit mb-12 lg:mb-0">
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-yellow-400 rounded-full" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Keep <span className="text-primary italic">Reading</span></h3>
              </div>
              <div className="space-y-8">
                {relatedPosts.map(p => (
                  <div 
                    key={String(p._id)} 
                    className="group cursor-pointer space-y-4"
                    onClick={() => router.push(`/blog/${p.slug}`)}
                  >
                    <div className="h-44 rounded-2xl overflow-hidden shadow-lg border border-border/50">
                      <Image 
                        src={p.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80'} 
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-black tracking-widest uppercase">
                         <span className="text-primary italic">{p.tags[0]}</span>
                         <span className="w-1 h-1 bg-border rounded-full" />
                         <span>{format(new Date(p.createdAt || Date.now()), 'MMM yyyy')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20 rounded-2xl p-8 shadow-inner sticky top-32">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-primary text-primary-foreground rounded-xl mb-6 shadow-lg shadow-primary/20">
               <Share2 size={24} />
            </div>
            <h4 className="text-2xl font-black mb-3 tracking-tighter">Stay Connected.</h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Join 500+ readers getting exclusive web development insights directly in their inbox.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full px-5 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-primary focus:outline-none text-sm transition-all"
              />
              <Button className="w-full h-12 rounded-xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 active:scale-95 transition-all">
                SUBSCRIBE NOW
              </Button>
            </form>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-8 right-8 text-foreground hover:bg-primary/10 rounded-full h-12 w-12 z-[210]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={24} />
            </Button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full overflow-hidden rounded-2xl shadow-3xl border border-border/50 bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                <div className="flex items-center gap-2">
                   <ZoomIn size={14} /> Full Perspective
                </div>
                <span>Click outside to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
