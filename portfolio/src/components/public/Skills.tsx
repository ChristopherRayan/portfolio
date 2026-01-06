'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  Database, 
  Layout, 
  Server, 
  ShieldCheck, 
  Settings, 
  Palette, 
  Monitor,
  Star,
  Layers,
  Search,
  X
} from 'lucide-react';

import { ISkill } from '@/models/Skill';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', name: 'All Skills', icon: Layers },
  { id: 'Programming Languages', name: 'Languages', icon: Code2 },
  { id: 'Frontend Development', name: 'Frontend', icon: Layout },
  { id: 'Backend Development', name: 'Backend', icon: Server },
  { id: 'Databases', name: 'Databases', icon: Database },
  { id: 'Networking & Security', name: 'Security', icon: ShieldCheck },
  { id: 'Tools & Platforms', name: 'Tools', icon: Settings },
  { id: 'Design & Multimedia', name: 'Design', icon: Palette },
  { id: 'System Administration', name: 'System Admin', icon: Monitor },
];

const getCategoryIcon = (category: string) => {
  const cat = CATEGORIES.find(c => c.id === category);
  const Icon = cat ? cat.icon : Code2;
  return <Icon className="h-5 w-5" />;
};

const SkillStars = ({ level }: { level: string }) => {
  const stars = level === 'Expert' ? 5 : level === 'Advanced' ? 4.5 : 4;
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[...Array(5)].map((_, i) => {
        const full = i + 1 <= Math.floor(stars);
        const half = !full && i < stars;
        return (
          <Star 
            key={i} 
            className={cn(
              "h-3 w-3", 
              full ? "fill-yellow-400 text-yellow-400" : half ? "fill-yellow-400/50 text-yellow-400" : "text-muted-foreground/30"
            )} 
          />
        );
      })}
      <span className="text-[10px] ml-1 font-medium text-muted-foreground">{level}</span>
    </div>
  );
};

interface SkillsProps {
  initialSkills?: ISkill[];
}

export function Skills({ initialSkills = [] }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: skills = initialSkills, isLoading } = useQuery<ISkill[]>({
     queryKey: ['skills'],
     queryFn: async () => {
         const res = await fetch('/api/skills');
         if (!res.ok) throw new Error('Failed to fetch skills');
         return res.json();
     },
     initialData: initialSkills.length > 0 ? initialSkills : undefined,
     enabled: initialSkills.length === 0
  });

  const categoryCounts = useMemo(() => {
    if (!skills) return {};
    const counts: Record<string, number> = { all: skills.length };
    skills.forEach(skill => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (!skills) return [];
    let filtered = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => (s.name?.toLowerCase() || "").includes(term));
    }
    return filtered;
  }, [skills, activeCategory, searchTerm]);

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

  // if (isLoading) return (...);

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
                    placeholder="Search skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none h-full w-full pr-4 text-sm font-medium placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center pt-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              My Professional <span className="text-primary">Skills</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
               A comprehensive overview of my expertise across various domains of software engineering, security, and design.
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-4">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              className={cn(
                "rounded-full px-5 py-2 h-auto text-xs font-bold transition-all duration-300",
                activeCategory === cat.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "hover:bg-primary/5 hover:border-primary/50"
              )}
            >
              <cat.icon className="h-3.5 w-3.5 mr-2" />
              {cat.name} ({categoryCounts[cat.id] || 0})
            </Button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill._id.toString()}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="p-4 bg-card/60 backdrop-blur-md border-muted/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden relative shadow-sm hover:shadow-xl">
                  {/* Hover Background Accent */}
                  <div className="absolute top-0 right-0 -z-10 bg-primary/5 w-24 h-24 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
                  
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-muted/50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {skill.icon || getCategoryIcon(skill.category)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg leading-none">{skill.name}</h3>
                          <SkillStars level={skill.level} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSkills.length === 0 && !isLoading && (
          <div className="text-center py-20 text-muted-foreground italic">
            No technical consignment found for this category.
          </div>
        )}
      </div>
    </section>
  );
}
