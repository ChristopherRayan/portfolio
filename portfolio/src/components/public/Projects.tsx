'use client';

import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { IProject } from '@/models/Project';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, Search, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProjectsProps {
  initialProjects?: IProject[];
}

export function Projects({ initialProjects = [] }: ProjectsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: projects = initialProjects } = useQuery<IProject[]>({
      queryKey: ['projects'],
      queryFn: async () => {
          const res = await fetch('/api/projects');
          if (!res.ok) throw new Error('Failed to fetch projects');
          return res.json();
      },
      initialData: initialProjects.length > 0 ? initialProjects : undefined,
      enabled: initialProjects.length === 0 // Only fetch if we didn't get props
  });

  // Command+K / Ctrl+K Shortcut
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

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [projects, searchTerm]);

  // if (isLoading) return <div className="py-20 text-center">Loading projects...</div>;

  return (
    <section className="py-20 bg-background min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 bg-primary/5 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 bg-secondary/10 w-[400px] h-[400px] rounded-full blur-[100px] opacity-50" />
      <div className="container px-4 md:px-6">
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
                    placeholder="Search projects..."
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              My <span className="text-primary">Projects</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
               Showcasing some of my best work and side projects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map((project, index) => (
                <motion.div
                    key={(project._id as unknown) as string}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-muted group cursor-pointer" onClick={() => (window.location.href = `/projects/${project.slug || project._id}`)}>
                        <div className="relative aspect-video overflow-hidden">
                            {/* Use actual image if available, otherwise placeholder */}
                            <Image 
                                src={project.imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(project.title)}`} 
                                alt={project.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105 duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 text-[10px] uppercase font-bold tracking-widest px-2 py-0">
                                  {project.category || 'Development'}
                                </Badge>
                            </div>
                            <CardTitle className="group-hover:text-yellow-400 transition-colors">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.slice(0, 4).map(tech => (
                                    <Badge key={tech} variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground">
                                        {tech}
                                    </Badge>
                                ))}
                                {project.technologies.length > 4 && (
                                   <span className="text-[10px] text-muted-foreground">+{project.technologies.length - 4} more</span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 pt-0">
                             <Button variant="default" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase tracking-tighter text-xs">
                                 View Case Study
                             </Button>
                             <div className="flex gap-2 w-full">
                                {project.liveUrl && (
                                    <Button asChild size="sm" variant="ghost" className="w-full text-[10px] h-8" onClick={(e) => e.stopPropagation()}>
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-3 h-3 mr-1" /> Live Demo
                                        </a>
                                    </Button>
                                )}
                                {project.githubUrl && (
                                    <Button asChild size="sm" variant="ghost" className="w-full text-[10px] h-8" onClick={(e) => e.stopPropagation()}>
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                            <Github className="w-3 h-3 mr-1" /> Source
                                        </a>
                                    </Button>
                                )}
                             </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
