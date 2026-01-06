'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Heart, 
  Languages, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Quote,
  Github,
  Linkedin,
  Facebook,
  Instagram
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const timelineEvents: TimelineEvent[] = [
  { year: '2019', title: 'Graduated MSCE', description: 'Nthunzi Private Secondary School, Mchinji' },
  { year: '2022', title: 'Started BSc ICT', description: 'Enrolled at Mzuzu University' },
  { year: '2024', title: 'Web Developer & Network Admin', description: 'Mzuzu University ICT Directorate' },
  { year: '2025', title: 'Cisco Certifications', description: 'Cybersecurity Essentials & Threat Management' },
  { year: '2026', title: 'Expected Graduation', description: 'BSc in Information & Communication Technology' },
];

const experience: Experience[] = [
  {
    role: 'Web Developer & Network Administrator',
    company: 'Mzuzu University ICT Directorate',
    period: '5 Months',
    highlights: [
      'Full-Stack Development: Engineered and deployed responsive web applications using MERN stack.',
      'Infrastructure Management: Monitored and maintained network systems for high uptime.',
      'Technical Problem Solving: Complex network configs and hardware troubleshooting.',
      'Cybersecurity Implementation: Safeguarded sensitive data using Burp Suite and Linux tools.'
    ]
  }
];

const education: Education[] = [
  {
    degree: 'BSc in Information and Communication Technology',
    institution: 'Mzuzu University',
    status: 'Pending Graduation: 2026'
  },
  {
    degree: 'Malawi School Certificate of Education (MSCE)',
    institution: 'Nthunzi Private Secondary School',
    status: 'Graduated: 2019'
  }
];

const certifications: Certification[] = [
  { name: 'Cybersecurity Essentials', org: 'Cisco Networking Academy', year: '2025' },
  { name: 'Cyber Threat Management', org: 'Cisco Networking Academy', year: '2025' }
];

const languages: Language[] = [
  { name: 'Chichewa', level: 'Native' },
  { name: 'English', level: 'Fluent' },
  { name: 'Tumbuka', level: 'Advanced' }
];

const hobbies = [
  'Technology trends',
  'Open source contributions',
  'Continuous learning',
  'Community tech initiatives'
];

const references: Reference[] = [
  { name: 'Mr. Donald Phiri', title: 'Senior Lecturer (ICT)', phone: '+265 992 31 53 19' },
  { name: 'Dr. Enock Tung’ande', title: 'ICT Director', phone: '+265 995 612 188' },
  { name: 'Mr. Kaunda', title: 'Head of ICT Infrastructure', phone: '+265 999 660 541' }

];

import { IProfile, Experience, Education, Certification, Language, Reference, TimelineEvent } from '@/models/Profile';
import Image from 'next/image';

interface AboutProps {
  initialProfile?: IProfile | null;
}

export function About({ initialProfile }: AboutProps) {
  const { data: profile = initialProfile } = useQuery<IProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
       const res = await fetch('/api/profile');
       if(!res.ok) return null;
       return res.json();
    },
    initialData: initialProfile,
    enabled: !initialProfile
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container px-4 md:px-6 relative">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="flex flex-col md:flex-row gap-12 items-start mb-24"
        >

          <div className="flex-1 w-full max-w-md mx-auto md:mx-0">
             <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-primary ring-8 ring-primary/10 mb-6">
                {profile?.profileImageUrl ? (
                    <Image 
                      src={profile.profileImageUrl} 
                      alt={profile.name} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center font-bold text-muted-foreground">IMAGE</div>
                )}
             </div>
             
             {/* Social Icons Below Image */}
             <div className="flex items-center justify-center gap-6 mt-4">
                <a href={profile?.socialLinks?.github || "#"} target="_blank" rel="noreferrer" aria-label="GitHub Profile" className="text-[#24292e] dark:text-white transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#24292e]/10 rounded-full border border-muted/50 hover:border-[#24292e]/50">
                  <Github className="h-6 w-6" />
                </a>
                <a href={profile?.socialLinks?.linkedin || "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn Profile" className="text-[#0077b5] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#0077b5]/10 rounded-full border border-muted/50 hover:border-[#0077b5]/50">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href={profile?.socialLinks?.facebook || "#"} target="_blank" rel="noreferrer" aria-label="Facebook Profile" className="text-[#1877f2] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#1877f2]/10 rounded-full border border-muted/50 hover:border-[#1877f2]/50">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href={profile?.socialLinks?.instagram || "#"} target="_blank" rel="noreferrer" aria-label="Instagram Profile" className="text-[#e4405f] transition-all duration-300 p-2.5 bg-muted/20 hover:bg-[#e4405f]/10 rounded-full border border-muted/50 hover:border-[#e4405f]/50">
                  <Instagram className="h-6 w-6" />
                </a>
             </div>
          </div>

          <div className="flex-[1.5] space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
                ABOUT ME
              </h2>
              
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wider">
                  {profile?.title || 'Software Engineer | Full-Stack Developer | Network Administrator'}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium italic">
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {profile?.phone || '+265990018322'}</span>
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {profile?.email || 'christopherayankuchawo@gmail.com'}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {profile?.location || 'Salima'}</span>
                </div>
              </div>

              {/* Separate Professional Summary Section */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-primary rounded-full" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary/70 dark:text-[#4169E1]">Professional Summary</span>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground font-medium">
                        {profile?.professionalSummary || `Software Engineer with comprehensive training in software development lifecycle, system design, and full-stack development. 
                        Completed rigorous 4-year BSc in ICT covering Software Engineering, Algorithms, Distributed Systems, AI, Network Security, 
                        and Database Design. Proven experience in developing scalable applications using modern stacks.`}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20" asChild>
                <a href={profile?.cvUrl || '#'} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" /> DOWNLOAD FULL RESUME
                </a>
              </Button>
            </div>
          </div>
        </motion.div>


        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
           {/* Experience */}
           <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
           >
              <div className="flex items-center gap-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-black uppercase">Experience</h2>
              </div>
              
              <div className="space-y-6">
                 {(profile?.experience && profile.experience.length > 0 ? profile.experience : experience).map((exp: Experience, i: number) => (
                   <Card key={i} className="p-8 bg-card/40 backdrop-blur-md border-muted/50 group hover:border-primary/30 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <h4 className="text-xl font-black text-foreground uppercase">{exp.role}</h4>
                          <p className="text-primary font-bold">{exp.company}</p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-muted/50 text-xs font-black uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                          <Clock className="h-3 w-3" /> {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-3">
                        {exp.highlights.map((h: string, j: number) => (
                          <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            {h}
                          </li>
                        ))}
                      </ul>
                   </Card>
                 ))}
              </div>
           </motion.div>

           {/* Education */}
           <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
           >
              <div className="flex items-center gap-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-black uppercase">Education</h2>
              </div>
              
              <div className="space-y-6">
                 {(profile?.education && profile.education.length > 0 ? profile.education : education).map((edu: Education, i: number) => (
                   <Card key={i} className="p-8 bg-card/40 backdrop-blur-md border-muted/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                      <h4 className="text-xl font-bold text-foreground pr-10">{edu.degree}</h4>
                      <p className="text-primary font-bold mt-1 uppercase text-sm tracking-wide">{edu.institution}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {edu.status}
                      </div>
                   </Card>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Certs, Languages, Hobbies Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
           {/* Certifications */}
           <Card className="p-8 bg-card/30 border-muted/50">
              <div className="flex items-center gap-3 mb-8">
                <Award className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-black uppercase">Certifications</h4>
              </div>
              <div className="space-y-4">
                {(profile?.certifications && profile.certifications.length > 0 ? profile.certifications : certifications).map((cert: Certification, i: number) => (
                  <div key={i} className="group cursor-default flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{cert.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1 tracking-wider">{cert.org} | {cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
           </Card>

           {/* Languages */}
           <Card className="p-8 bg-card/30 border-muted/50">
              <div className="flex items-center gap-3 mb-8">
                <Languages className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-black uppercase">Languages</h4>
              </div>
              <div className="space-y-6">
                {(profile?.languages && profile.languages.length > 0 ? profile.languages : languages).map((lang: Language, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-foreground">{lang.name}</span>
                      <span className="text-[10px] uppercase font-black text-primary px-2 py-1 bg-primary/10 rounded">{lang.level}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: lang.level === 'Native' ? '100%' : lang.level === 'Fluent' ? '85%' : '70%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
           </Card>

           {/* Hobbies */}
           <Card className="p-8 bg-card/30 border-muted/50">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-black uppercase">Hobbies</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {(profile?.hobbies && profile.hobbies.length > 0 ? profile.hobbies : hobbies).map((hobby: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-muted/40 text-sm font-bold border border-muted/50 hover:bg-muted/60 transition-colors">
                    {hobby}
                  </span>
                ))}
              </div>
           </Card>
        </div>

        {/* References Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase inline-block relative">
              References
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(profile?.references && profile.references.length > 0 ? profile.references : references).map((ref: Reference, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 bg-card/50 backdrop-blur-md border-muted/50 relative overflow-hidden group">
                  <Quote className="absolute -top-4 -left-4 h-16 w-16 text-primary/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                  <div className="relative z-10 text-center">
                    <h4 className="text-xl font-black text-foreground">{ref.name}</h4>
                    <p className="text-primary font-bold text-sm uppercase tracking-wider mt-1">{ref.title}</p>
                    <div className="mt-6 pt-6 border-t border-muted/50 space-y-2">
                       {ref.phone && (
                         <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
                           <Phone className="h-3.5 w-3.5" /> {ref.phone}
                         </div>
                       )}
                       <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">Mzuzu University</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Career Timeline Section - Moved to last and made compact */}
        <section className="mt-10 mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 md:w-24 bg-muted" />
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-center">My Career Journey</h2>
            <div className="h-px w-12 md:w-24 bg-muted" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 md:px-0">
             {/* Timeline Line */}
             <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted md:-translate-x-1/2" />
             
             <div className="space-y-3">
               {(profile?.timeline && profile.timeline.length > 0 ? profile.timeline : timelineEvents).map((event: TimelineEvent, i: number) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "relative flex flex-col md:flex-row gap-2 items-start md:items-center",
                      i % 2 === 0 ? "md:flex-row-reverse" : ""
                    )}
                 >
                   <div className="flex-1 md:text-right w-full">
                     <div className={cn("hidden md:block", i % 2 === 0 ? "text-right" : "text-left invisible")}>
                        <span className="text-3xl font-black text-muted-foreground/20">{event.year}</span>
                     </div>
                   </div>
                   
                   {/* Point */}
                   <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                   
                   <div className="flex-1 pl-12 md:pl-0 w-full">
                      <Card className="p-3 bg-card/40 backdrop-blur-sm border-muted/50 hover:border-primary/50 transition-colors">
                        <span className="text-xs font-black text-primary uppercase tracking-widest">{event.year}</span>
                        <h4 className="text-lg font-bold mt-0.5 text-foreground">{event.title}</h4>
                        {event.title.toLowerCase().includes('certifications') ? (
                          <ul className="mt-2 space-y-1">
                            {event.description.split('&').map((item: string, idx: number) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2 italic">
                                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                                <span>{item.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                        )}
                      </Card>
                   </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </section>
      </div>
    </section>
  );
}

// Add Clock to Lucide imports as I missed it
function Clock({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
