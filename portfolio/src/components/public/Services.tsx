'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Check, 
  ArrowRight, 
  Mail, 
  MessageSquare,
  Loader2,
  Zap,
  Search,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIconComponent } from '@/lib/iconMap';
import { IServiceData } from '@/types/service';
import Link from 'next/link';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServicesProps {
  initialServices?: IServiceData[];
  initialProcess?: any[];
  initialBenefits?: any[];
}

export function Services({ initialServices = [], initialProcess = [], initialBenefits = [] }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<IServiceData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch data with initial data for fast load
  const { data: services = initialServices } = useQuery<IServiceData[]>({
    queryKey: ['services'],
    queryFn: () => fetch(`/api/services`).then(res => res.json()),
    initialData: initialServices.length > 0 ? initialServices : undefined,
    enabled: initialServices.length === 0
  });

  const { data: processSteps = initialProcess } = useQuery<any[]>({
    queryKey: ['process-steps'],
    queryFn: () => fetch(`/api/process`).then(res => res.json()),
    initialData: initialProcess.length > 0 ? initialProcess : undefined,
    enabled: initialProcess.length === 0
  });

  const { data: benefits = initialBenefits } = useQuery<any[]>({
    queryKey: ['benefits'],
    queryFn: () => fetch(`/api/benefits`).then(res => res.json()),
    initialData: initialBenefits.length > 0 ? initialBenefits : undefined,
    enabled: initialBenefits.length === 0
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

  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!searchTerm) return services;
    return services.filter(s => 
      (s.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      s.features?.some((f: any) => String(f).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [services, searchTerm]);

  const hasData = services.length > 0 || processSteps.length > 0 || benefits.length > 0;

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const colorClasses: Record<string, { bg: string, text: string, border: string }> = {
    blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-400', border: 'border-blue-400' },
    green: { bg: 'from-green-500 to-green-600', text: 'text-green-400', border: 'border-green-400' },
    red: { bg: 'from-red-500 to-red-600', text: 'text-red-400', border: 'border-red-400' },
    purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-400', border: 'border-purple-400' },
    yellow: { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-400', border: 'border-yellow-400' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-400', border: 'border-indigo-400' }
  };

  const getColors = (color: string) => colorClasses[color] || colorClasses.blue;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 bg-primary/5 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 bg-secondary/10 w-[400px] h-[400px] rounded-full blur-[100px] opacity-50" />

      {/* Services Grid */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-14">
            {/* Top-Left Expanding Search */}
            <div className="absolute top-0 left-0 z-50">
              <div 
                className={cn(
                  "h-12 bg-card/30 backdrop-blur-md border border-white/10 rounded-full flex items-center overflow-hidden transition-all duration-500 shadow-lg",
                  isSearchOpen ? "w-[300px] bg-card/80 border-primary/50" : "w-12 hover:bg-card/50"
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
                
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none h-full w-full pr-4 text-sm font-medium placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                )}
              </div>
            </div>

            <div className="text-center relative z-10 pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
                My <span className="text-primary">Services</span>
              </h1>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Comprehensive technology solutions including full-stack development, network administration, cybersecurity, and technical consulting.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map((service) => {
              const IconComponent: React.ComponentType<{ className?: string; size?: number }> = getIconComponent(service.icon);
              const colors = getColors(service.color);
              
              return (
                <Dialog key={service._id}>
                  <DialogTrigger asChild>
                    <div
                      onClick={() => setSelectedService(service)}
                      className="group cursor-pointer p-5 rounded-xl transition-all duration-300 hover:scale-[1.05] bg-card border border-border hover:border-yellow-400/50 shadow-xl hover:shadow-yellow-400/10 flex flex-col items-center text-center relative overflow-hidden"
                    >
                      {/* Subtle Background Glow */}
                      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full`}></div>

                      {/* Centered Icon */}
                      <div className={`w-14 h-14 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20`}>
                        <IconComponent size={28} className="text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-yellow-400 transition-colors uppercase tracking-tight">{service.title}</h3>

                      {/* Tagline */}
                      <p className="text-muted-foreground text-xs leading-relaxed mb-3">{service.shortDesc}</p>

                      {/* View Details - Only on hover */}
                      <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-[3px] border-blue-800 dark:border-yellow-400/40 rounded-lg overflow-hidden shadow-2xl">
                    <div className="relative overflow-y-auto max-h-[90vh] p-6">
                      <DialogHeader className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <DialogTitle className="text-3xl md:text-4xl font-black mb-1">{service.title}</DialogTitle>
                            <p className="text-base text-yellow-500 font-medium">{service.shortDesc}</p>
                          </div>
                          <div className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-xl font-black text-base shadow-lg shadow-yellow-400/20 shrink-0">
                            {service.pricing}
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="space-y-6">
                          {/* Overview */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                              <MessageSquare size={14} /> Overview
                            </h4>
                            <p className="text-muted-foreground text-base leading-relaxed italic">
                              "{service.description}"
                            </p>
                          </div>

                          {/* Features */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                              <Zap size={14} /> What makes it special
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3">
                              <TooltipProvider delayDuration={200}>
                                {service.features?.map((feature, idx) => (
                                  <Tooltip key={idx}>
                                    <TooltipTrigger asChild>
                                      <div className="group/feat flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-yellow-400/30 hover:bg-muted/50 transition-all cursor-help shadow-sm">
                                        <div className={`mt-0.5 p-1 rounded-md bg-gradient-to-br ${colors.bg} shadow-md`}>
                                          <Check size={12} className="text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold group-hover/feat:text-yellow-400 transition-colors uppercase text-xs md:text-sm tracking-wide break-words">{feature.title}</p>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[280px] p-3 rounded-xl bg-popover text-popover-foreground border-2 border-yellow-400/50 shadow-2xl z-[200]">
                                      <p className="text-xs md:text-sm leading-relaxed">{feature.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                              </TooltipProvider>
                            </div>
                          </div>

                        {/* CTA Row */}
                        <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                          <Link 
                            href={`/contact?service=${encodeURIComponent(service.title)}&subject=${encodeURIComponent(`Request for ${service.title}`)}`}
                            className="flex-1 px-6 py-3 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-all font-black text-base text-center shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Mail size={18} /> Request a Service
                          </Link>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
      </div>

      {/* Process Section */}
      {processSteps.length > 0 && (
        <div className="py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How I <span className="text-yellow-400">Work</span></h2>
              <p className="text-muted-foreground text-lg">A streamlined process for successful project delivery</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((item, index) => (
                <div key={item._id} className="relative">
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-yellow-400/30 -translate-x-1/2" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mb-4 mx-auto shadow-lg shadow-yellow-400/20">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-center">{item.title}</h3>
                    <p className="text-muted-foreground text-center">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Me */}
      {benefits.length > 0 && (
        <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why <span className="text-yellow-400">Choose Me</span></h2>
              <p className="text-muted-foreground text-lg">Committed to excellence in every project</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => {
                const BenefitIcon = getIconComponent(benefit.icon);
                return (
                  <div
                    key={benefit._id}
                    className="p-8 rounded-2xl text-center bg-card shadow-lg border border-border/50 hover:border-yellow-400/50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/20">
                      <BenefitIcon size={28} className="text-gray-900" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl p-12 text-center bg-card border-2 border-border relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none"></div>
          <h2 className="text-4xl font-bold mb-4 relative z-10">
            Ready to Start Your <span className="text-yellow-400">Project?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
            Let's discuss how I can help bring your ideas to life with cutting-edge technology solutions.
          </p>
          <Link 
            href="/contact"
            className="inline-flex px-10 py-5 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-all font-bold text-lg hover:scale-105 items-center justify-center gap-2 mx-auto relative z-10 shadow-lg shadow-yellow-400/20"
          >
            <Mail size={24} />
            Hire Me
          </Link>
        </div>
      </div>


    </div>
  );
}
