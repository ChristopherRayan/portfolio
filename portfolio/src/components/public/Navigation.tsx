'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Skills', href: '/skills' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            C.R.K<span className="text-primary">.</span>
          </Link>
          
          {/* Mobile Theme Toggle (Top Right) */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary relative group',
                (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')) 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full",
                (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')) ? "w-full" : "w-0"
              )} />
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Toggle (Left, under Logo) */}
        <div className="flex items-center gap-4 md:hidden self-start">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - compact dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-4 mt-1 bg-background/95 backdrop-blur-md border border-border/60 rounded-xl shadow-xl md:hidden w-auto min-w-[140px]"
          >
            <nav className="flex flex-col p-2 gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-primary hover:bg-muted/60 block whitespace-nowrap',
                    (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/'))
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
