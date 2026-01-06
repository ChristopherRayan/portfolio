'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Github, ExternalLink, Code, Server, Database, 
  Shield, Check, AlertCircle, Zap, Users, Layout, Lock, 
  Eye, Box, Clock, Cpu, Globe, Activity, Network 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IProject } from '@/models/Project';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProjectDetailsClientProps {
  project: IProject;
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const router = useRouter();
  const screenshots = project.screenshots || {};
  
  // Handle cases where some fields might be missing (for old projects)
  const features = project.features || [];
  const techStack = project.techStack || { frontend: [], backend: [], database: [] };
  const architecture = project.architecture || { pattern: '', communication: '', authentication: '', monitoring: '' };
  const yourRole = project.yourRole || { backend: [], frontend: [], deployment: [] };
  const challenges = project.challenges || [];
  const security = project.security || [];
  const outcome = project.outcome || { whatWorks: [], learnings: [], improvements: [] };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4">
      <div className="max-w-[90%] mx-auto">
        
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-yellow-500 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight uppercase text-xs">Back to Projects</span>
        </motion.button>

        {/* Project Header */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="px-4 py-1 bg-yellow-400 text-black font-black text-xs rounded-full uppercase tracking-widest">
              {project.category || 'Full-Stack Project'}
            </span>
            {project.duration && (
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-yellow-500/50" />
                {project.duration}
              </span>
            )}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none"
          >
            {project.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl leading-relaxed italic border-l-4 border-yellow-500 pl-6"
          >
            {project.subtitle || project.description}
          </motion.p>
        </div>

        {/* Project Cover Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16 relative aspect-[21/9] rounded-2xl overflow-hidden border-2 border-border shadow-2xl group"
        >
          <Image 
            src={project.imageUrl} 
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* Overview & Problem */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <Section icon={<Layout />} title="Project Overview">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {project.overview || project.longDescription || project.description}
            </p>
          </Section>

          <Section icon={<AlertCircle />} title="Problem Statement">
            <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-lg h-full">
              <p className="text-muted-foreground leading-relaxed italic">
                {project.problem || "Information not provided."}
              </p>
            </div>
          </Section>
        </div>

        {/* Solution */}
        {project.solution && project.solution.description && (
          <Section icon={<Zap />} title="Solution" className="mb-20">
            <div className="grid md:grid-cols-[1fr_400px] gap-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                  {project.solution.description}
                </p>
                <div className="bg-muted border border-border rounded-xl p-8 shadow-inner dark:bg-gray-900/50">
                  <p className="text-yellow-500 font-black mb-4 uppercase tracking-tighter text-sm flex items-center gap-2">
                    <Code size={18} /> Core Logic:
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.solution.coreLogic}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-8 flex flex-col justify-center">
                 <h4 className="text-yellow-600 dark:text-yellow-400 font-black mb-4 uppercase tracking-tighter text-xs">Technologies Used</h4>
                 <div className="flex flex-wrap gap-2">
                   {project.technologies.map(tech => (
                     <Badge key={tech} className="bg-yellow-500/10 text-black dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-colors">
                       {tech}
                     </Badge>
                   ))}
                 </div>
              </div>
            </div>
          </Section>
        )}

        {/* Features */}
        {features.length > 0 && (
          <Section icon={<Check />} title="Key Features" className="mb-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Feature key={index} {...feature} />
              ))}
            </div>
          </Section>
        )}

        {/* Tech Stack Breakdown */}
        <Section icon={<Code />} title="Tech Stack Breakdown" className="mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <TechCategory
              title="Frontend"
              icon={<Layout />}
              items={techStack.frontend}
            />
            <TechCategory
              title="Backend"
              icon={<Server />}
              items={techStack.backend}
            />
            <TechCategory
              title="Database & Infra"
              icon={<Database />}
              items={techStack.database}
            />
          </div>
        </Section>

        {/* System Architecture */}
        <Section icon={<Box />} title="System Architecture" className="mb-20">
          <div className="bg-muted/50 border border-border rounded-2xl p-8 md:p-12 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                <ArchitectureNode label="React Client" active />
                <ArchitectureConnector />
                <ArchitectureNode label="Express API" />
                <ArchitectureConnector />
                <ArchitectureNode label="MongoDB" />
              </div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mt-4">Typical Data Flow Pattern</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 pt-10 border-t border-border/50">
              <ArchitectureSpec icon={<Layout size={18} />} label="Pattern" value={architecture.pattern} />
              <ArchitectureSpec icon={<Network size={18} />} label="Communication" value={architecture.communication} />
              <ArchitectureSpec icon={<Shield size={18} />} label="Authentication" value={architecture.authentication} />
              <ArchitectureSpec icon={<Activity size={18} />} label="Monitoring" value={architecture.monitoring} />
            </div>
          </div>
        </Section>

        {/* Screenshots & Demo */}
        <Section icon={<Eye />} title="Screenshots & Live Demo" className="mb-20">
          <Gallery screenshots={project.screenshots} />
          
          <div className="flex flex-wrap gap-4 pt-10 justify-center">
            {project.liveUrl && (
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase tracking-tighter">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={18} className="mr-2" /> View Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild size="lg" variant="outline" className="border-gray-700 hover:bg-white/5 font-black uppercase tracking-tighter text-muted-foreground hover:text-foreground">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github size={18} className="mr-2" /> View on GitHub
                </a>
              </Button>
            )}
          </div>
        </Section>

        {/* Your Role */}
        {(yourRole.frontend.length > 0 || yourRole.backend.length > 0) && (
          <Section icon={<Users />} title="Technical Role & Contributions" className="mb-20">
            <div className="grid md:grid-cols-2 gap-6">
              <RoleCard title="Frontend Development" items={yourRole.frontend} icon={<Layout />} />
              <RoleCard title="Backend Development" items={yourRole.backend} icon={<Server />} />
              {yourRole.deployment.length > 0 && (
                <div className="md:col-span-2">
                  <RoleCard title="Deployment & Infrastructure" items={yourRole.deployment} icon={<Database />} />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Challenges & Solutions */}
        {challenges.length > 0 && (
          <Section icon={<AlertCircle />} title="Challenges & Solutions" className="mb-20">
            <div className="space-y-6">
              {challenges.map((challenge, index) => (
                <Challenge key={index} {...challenge} />
              ))}
            </div>
          </Section>
        )}

        {/* Security */}
        {security.length > 0 && (
          <Section icon={<Shield />} title="Security & Best Practices" className="mb-20">
            <div className="grid md:grid-cols-2 gap-6">
              {security.map((item, index) => (
                <SecurityItem key={index} {...item} />
              ))}
            </div>
          </Section>
        )}

        {/* Outcome */}
        {(outcome.whatWorks.length > 0 || outcome.learnings.length > 0) && (
          <Section icon={<Check />} title="Outcome & Business Impact" className="mb-20">
            <div className="grid md:grid-cols-1 gap-6">
              <OutcomeCard 
                title="Success Metrics"
                color="green"
                items={outcome.whatWorks}
                prefix="✓"
              />
              <div className="grid md:grid-cols-2 gap-6">
                <OutcomeCard 
                  title="Technical Learnings"
                  color="blue"
                  items={outcome.learnings}
                  prefix="•"
                />
                <OutcomeCard 
                  title="Future Roadmap"
                  color="yellow"
                  items={outcome.improvements}
                  prefix="→"
                />
              </div>
            </div>
          </Section>
        )}

        {/* Footer Navigation */}
        <div className="border-t border-border pt-16 text-center">
           <h3 className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-8">End of technical deep-dive</h3>
           <Button 
            variant="outline" 
            onClick={() => router.push('/projects')}
            className="border-yellow-500 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500 hover:text-black font-black uppercase tracking-tighter px-10 py-6"
           >
             <ArrowLeft size={18} className="mr-2" /> Back to Project Gallery
           </Button>
        </div>

      </div>
    </div>
  );
}

// Helper Components
function Section({ icon, title, children, className = "" }: { icon: React.ReactNode, title: string, children: React.ReactNode, className?: string }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
          {icon}
        </div>
        <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Feature({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-muted/50 border border-border rounded-xl p-6 hover:border-yellow-500/50 transition-all group shadow-inner dark:bg-gray-900/40">
      <h4 className="font-black mb-2 text-yellow-600 dark:text-yellow-400 uppercase tracking-tighter">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{description}</p>
    </div>
  );
}

function TechCategory({ title, icon, items }: { title: string, icon: React.ReactNode, items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-8 hover:bg-muted transition-colors shadow-2xl dark:bg-gray-900/60 dark:hover:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-2 rounded-lg">{icon}</div>
        <h4 className="font-black uppercase tracking-widest text-xs text-foreground">{title}</h4>
      </div>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoleCard({ title, items, icon }: { title: string, items: string[], icon: React.ReactNode }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-8 h-full dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-yellow-600 dark:text-yellow-400">{icon}</div>
        <h4 className="font-black text-foreground uppercase tracking-tighter">{title}</h4>
      </div>
      <ul className="space-y-4 text-muted-foreground text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check size={16} className="text-green-600 dark:text-green-500 flex-shrink-0 mt-1" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Challenge({ problem, solution }: { problem: string, solution: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-xl overflow-hidden shadow-2xl dark:bg-gray-900/60">
      <div className="grid md:grid-cols-2">
        <div className="p-8 bg-black/5 dark:bg-black/40">
          <span className="text-red-600 dark:text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <AlertCircle size={14} /> Technical Challenge
          </span>
          <p className="text-muted-foreground font-medium leading-relaxed italic">{problem}</p>
        </div>
        <div className="p-8 border-l border-border dark:border-gray-800">
          <span className="text-green-600 dark:text-green-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <Zap size={14} /> Implemented Solution
          </span>
          <p className="text-muted-foreground leading-relaxed">{solution}</p>
        </div>
      </div>
    </div>
  );
}

function SecurityItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-8 hover:bg-muted transition-colors dark:bg-gray-900/40 dark:hover:bg-gray-900">
      <div className="flex items-start gap-4">
        <div className="bg-yellow-500/10 p-3 rounded-lg text-yellow-600 dark:text-yellow-400">
          <Lock size={20} />
        </div>
        <div>
          <h4 className="font-black mb-3 text-foreground uppercase tracking-tighter text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{description}</p>
        </div>
      </div>
    </div>
  );
}

function OutcomeCard({ title, color, items, prefix }: { title: string, color: 'green' | 'blue' | 'yellow', items: string[], prefix: string }) {
  if (items.length === 0) return null;
  const colors = {
    green: { bg: 'bg-green-500/5', border: 'border-green-500/30', text: 'text-green-400' },
    blue: { bg: 'bg-blue-500/5', border: 'border-blue-500/30', text: 'text-blue-400' },
    yellow: { bg: 'bg-yellow-400/5', border: 'border-yellow-400/30', text: 'text-yellow-400' }
  };
  const style = colors[color];
  
  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-8 rounded-r-xl shadow-lg`}>
      <h4 className={`font-black uppercase tracking-widest text-xs ${style.text} mb-6`}>{title}</h4>
      <ul className="space-y-4 text-muted-foreground font-medium">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
             <span className={style.text}>{prefix}</span>
             {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArchitectureNode({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <div className={`px-6 py-3 rounded-lg font-black text-sm tracking-tighter border-2 transition-all ${
      active 
        ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
        : 'bg-muted text-muted-foreground border-border hover:border-foreground/50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:border-gray-600'
    }`}>
      {label}
    </div>
  );
}

// Helper Components
function Gallery({ screenshots }: { screenshots?: { [key: string]: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Transform map to array or use sample data if empty
  const hasScreenshots = screenshots && Object.keys(screenshots).length > 0;
  
  const galleryData = hasScreenshots 
    ? Object.entries(screenshots!).map(([key, url], index) => ({
        id: index,
        title: key,
        image: url
      }))
    : [
        { id: 1, title: "Dashboard View", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop" },
        { id: 2, title: "User Management", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" },
        { id: 3, title: "Analytics Page", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" },
        { id: 4, title: "Settings Panel", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop" },
        { id: 5, title: "Network Monitor", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop" }
      ];

  const currentScreenshot = galleryData[selectedImage];

  if (!currentScreenshot) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Thumbnails Section - LEFT SIDE */}
      <div className="flex-shrink-0 w-full lg:w-[352px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
          {galleryData.map((screenshot, index) => (
            <button
              key={screenshot.id}
              onClick={() => setSelectedImage(index)}
              className={`relative rounded-md overflow-hidden transition-all group aspect-video border-2 ${
                selectedImage === index
                  ? 'border-yellow-500 ring-2 ring-yellow-500/20 scale-[1.02]'
                  : 'border-transparent hover:border-yellow-500/50 hover:scale-[1.02]'
              }`}
            >
              <Image
                src={screenshot.image}
                alt={screenshot.title}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 transition-opacity flex items-end p-2 ${
                selectedImage === index ? 'bg-black/0' : 'bg-black/20 group-hover:bg-black/0'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest truncate w-full text-left shadow-black drop-shadow-md ${
                   selectedImage === index ? 'text-yellow-400' : 'text-white'
                }`}>
                  {screenshot.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Area - RIGHT SIDE */}
      <div className="flex-1 min-w-0">
        <div className="rounded-xl overflow-hidden bg-muted border-2 border-border shadow-2xl relative aspect-video group dark:bg-gray-900/50">
          <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
            <span className="text-yellow-500 font-black text-xs uppercase tracking-widest">
              {currentScreenshot.title}
            </span>
          </div>
          <Image
            src={currentScreenshot.image}
            alt={currentScreenshot.title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function ArchitectureConnector() {
  return <ArrowRight className="text-muted-foreground/50 animate-pulse" size={24} />;
}

function ArchitectureSpec({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-600 dark:text-yellow-400 mt-1">
        {icon || <Box size={18} />}
      </div>
      <div>
        <h5 className="text-muted-foreground font-black uppercase tracking-widest text-[10px] mb-1">{label}</h5>
        <p className="text-foreground font-medium text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}
