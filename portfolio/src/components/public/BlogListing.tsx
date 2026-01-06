'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { IBlog } from '@/models/Blog';
import { Calendar, Clock, ArrowRight, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import { BLOG_CATEGORIES } from '@/lib/constants';
import Image from 'next/image';
import { 
  Code2, 
  Brain, 
  Layers, 
  Shield, 
  Network, 
  Briefcase 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, any> = {
  "All": Layers,
  "Web Development": Code2,
  "AI": Brain,
  "Projects": Layers,
  "Cyber Security": Shield,
  "Networking": Network,
  "Careers": Briefcase
};

const categories = ["All", ...BLOG_CATEGORIES];

interface BlogListingProps {
  initialPosts?: IBlog[];
}

import { useDebounce } from '@/hooks/useDebounce';

// ... imports remain the same

export function BlogListing({ initialPosts = [] }: BlogListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  
  // Debounce search term to prevent URL thrashing
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync URL with state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCategory && selectedCategory !== "All") {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    if (debouncedSearchTerm) {
      params.set('search', debouncedSearchTerm);
    } else {
      params.delete('search');
    }

    // Update URL without full page reload
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedCategory, debouncedSearchTerm, router, searchParams]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Data fetching remains the same...
  const { data: posts = initialPosts } = useQuery<IBlog[]>({
      queryKey: ['blog-posts'],
      queryFn: async () => {
          const res = await fetch('/api/blog');
          if (!res.ok) throw new Error('Failed to fetch posts');
          return res.json();
      },
      initialData: initialPosts.length > 0 ? initialPosts : undefined,
      enabled: initialPosts.length === 0
  });

  // Handle direct link to post (existing logic)
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && posts) {
      const post = posts.find(p => String(p._id) === id);
      if (post) router.push(`/blog/${post.slug}`);
    }
  }, [searchParams, posts, router]);

  // Command+K Shortcut (existing logic)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    // Use debounced term for filtering
    const searchLower = debouncedSearchTerm.toLowerCase();
    const categoryLower = selectedCategory.trim().toLowerCase();

    return posts.filter(post => {
      // 1. Category Filter
      const postCategory = (post.category || "").trim().toLowerCase();
      const postTags = (post.tags || []).map(t => t.trim().toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || 
                             postCategory === categoryLower ||
                             postTags.some(t => t === categoryLower);

      if (!matchesCategory) return false;

      // 2. Search Filter (Title, Excerpt, AND Tags)
      if (!searchLower) return true;

      const titleMatch = (post.title || "").toLowerCase().includes(searchLower);
      const excerptMatch = (post.excerpt || "").toLowerCase().includes(searchLower);
      const tagMatch = postTags.some(t => t.includes(searchLower));

      return titleMatch || excerptMatch || tagMatch;
    });
  }, [posts, selectedCategory, debouncedSearchTerm]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subscribeEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubscribing(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Successfully subscribed!");
        setSubscribeEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 px-4 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 bg-primary/5 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 -z-10 bg-secondary/10 w-[400px] h-[400px] rounded-full blur-[100px] opacity-50" />

      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="relative mb-14">
          {/* Top-Left Expanding Search */}
          <div className="absolute top-0 left-0 z-50">
            <motion.div 
              initial={false}
              animate={{ width: isSearchOpen ? 300 : 48 }}
              className={cn(
                "h-12 bg-card/30 backdrop-blur-md border border-white/10 rounded-full flex items-center overflow-hidden transition-all duration-500 shadow-lg",
                isSearchOpen ? "bg-card/80 border-primary/50" : "hover:bg-card/50"
              )}
            >
              <div 
                className="w-12 h-12 flex items-center justify-center cursor-pointer shrink-0 text-muted-foreground hover:text-primary transition-colors relative group"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <X size={20} /> : (
                  <>
                    <Search size={20} className="group-hover:scale-110 transition-transform" />
                    {!isSearchOpen && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </>
                )}
              </div>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none h-full w-full pr-4 text-sm font-medium placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="text-center relative z-10 pt-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              My <span className="text-primary">Blog</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Exploring the intersection of code, security, and digital craft.
            </p>
          </div>
        </div>

        {/* Editorial Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-4">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category] || Layers;
            const isActive = selectedCategory === category;
            
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={isActive ? 'default' : 'outline'}
                className={cn(
                  "rounded-full px-5 py-2 h-auto text-xs font-bold transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                    : "hover:bg-primary/5 hover:border-primary/50 text-muted-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5 mr-2" />
                {category}
              </Button>
            );
          })}
        </div>

        {/* Blog Posts Grid - Expansive 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={String(post._id)}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-border mt-10">
            <p className="text-xl text-muted-foreground font-semibold">No articles found matching your criteria</p>
            <Button 
              variant="link" 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="mt-4 text-primary"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Newsletter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-card border border-border rounded-3xl p-10 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Get Notified
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Subscribe to the newsletter for exclusive tech insights and early access to my latest articles.
            </p>
            <form 
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto"
            >
              <Input
                type="email"
                required
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isSubscribing}
                className="flex-1 px-5 py-6 bg-background border-border rounded-xl focus:border-yellow-400 text-foreground"
              />
              <Button 
                type="submit"
                disabled={isSubscribing}
                className="px-8 py-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: IBlog }) {
  const router = useRouter();
  const readTime = Math.max(1, Math.ceil((post.content || "").split(' ').length / 200));

  return (
    <div 
      id={`post-${post._id}`}
      onClick={() => router.push(`/blog/${post.slug}`)}
      className="group bg-card rounded-xl overflow-hidden border-2 border-border hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02] cursor-pointer h-[200px] sm:h-[180px]"
    >
      <div className="flex gap-0 h-full">
        {/* LEFT - Image (Fixed Width) */}
        <div className="relative w-40 flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
        </div>

        {/* RIGHT - Content */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {post.category || (post.tags && post.tags[0]) || 'POST'}
              </span>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium">
                <Calendar size={12} className="text-yellow-400" />
                <span>{post.createdAt ? format(new Date(post.createdAt), 'MMM dd, yyyy') : 'Recent'}</span>
              </div>
            </div>

            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {post.title}
            </h2>

            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 italic">
              &quot;{post.excerpt}&quot;
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-3 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              <Clock size={12} className="text-primary" />
              <span>{readTime} MIN READ</span>
            </div>
            
            <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
