'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Github, Linkedin, Facebook, Instagram } from 'lucide-react';

interface HeroProps {
  initialProfile?: any;
}

export function Hero({ initialProfile }: HeroProps) {
  const { data: profile = initialProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
       const res = await fetch('/api/profile');
       if(!res.ok) return null;
       return res.json();
    },
    initialData: initialProfile,
    enabled: !initialProfile
  });

  return (
    <section className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Code & Circuits */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/programming_bg_v2.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />
      </div>

      <div className="container px-4 md:px-6 flex flex-col-reverse md:flex-row items-center gap-12 h-full relative z-10">
        <div className="flex-1 space-y-8 text-center md:text-left self-center pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-medium text-primary mb-2">
              HELLO!
            </h2>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                I&apos;m <span className="text-foreground">{profile?.name?.split(' ')[0] || 'Christopher'}</span>{' '}
                <span className="text-primary">{profile?.name?.split(' ').slice(1, -1).join(' ') || 'Rayan'}</span>{' '}
                <span className="text-[#EAB308] dark:text-[#4169E1]">{profile?.name?.split(' ').pop() || 'Kuchawo'}</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-muted-foreground">
              {profile?.title || 'Fullstack Web Developer'}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.5)]"
            >
              <Link href="/contact">HIRE ME</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-lg font-semibold border-2"
            >
              <Link href="/projects">MY WORKS</Link>
            </Button>
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="text-muted-foreground max-w-lg mx-auto md:mx-0 space-y-6"
          >
            <p>
               {profile?.bio || "Building seamless digital experiences with modern technologies. Focused on creating intuitive and dynamic user interfaces."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                <a href={profile?.socialLinks?.github || "#"} target="_blank" rel="noreferrer" aria-label="GitHub Profile" className="text-[#24292e] dark:text-white transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#24292e]/10 rounded-full border border-muted/50 hover:border-[#24292e]/50">
                  <Github className="h-5 w-5" />
                </a>
                <a href={profile?.socialLinks?.linkedin || "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="text-[#0077b5] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#0077b5]/10 rounded-full border border-muted/50 hover:border-[#0077b5]/50">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={profile?.socialLinks?.facebook || "#"} target="_blank" rel="noreferrer" aria-label="Facebook Profile" className="text-[#1877f2] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#1877f2]/10 rounded-full border border-muted/50 hover:border-[#1877f2]/50">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={profile?.socialLinks?.instagram || "#"} target="_blank" rel="noreferrer" aria-label="Instagram Profile" className="text-[#e4405f] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#e4405f]/10 rounded-full border border-muted/50 hover:border-[#e4405f]/50">
                  <Instagram className="h-5 w-5" />
                </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 relative flex items-end justify-center self-end md:translate-x-12"
        >
          {/* Main Hero Image pinned to bottom - Increased size */}
          <div className="relative w-[350px] h-[350px] md:w-[700px] md:h-[700px] mx-auto flex items-end justify-center">
             <div className="w-full h-full relative flex items-end justify-center">
                {profile?.heroImageUrl ? (
                    <img 
                        src={profile.heroImageUrl} 
                        alt="Hero" 
                        className="object-contain object-bottom w-full h-full drop-shadow-2xl" 
                    />
                ) : (
                   /* Fallback */
                   <span className="text-4xl font-bold text-muted-foreground opacity-20 pb-10">IMG</span>
                )}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
