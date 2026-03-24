import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { profileSchema } from '@/lib/validations';
import { IProfile } from '@/models/Profile';
import { FileUpload } from '@/components/admin/FileUpload';
import { 
  Plus, Trash2, Github, Linkedin, Facebook, Instagram, Calendar, 
  Briefcase, GraduationCap, Award, Languages, Quote, Heart,
  User, Image as ImageIcon, Link as LinkIcon, FileText, ListChecks, MapPin, Mail, Phone, Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileFormProps {
  initialData?: IProfile | null;
  onSubmit: (data: z.infer<typeof profileSchema>) => void;
  isLoading: boolean;
}

export function ProfileForm({ initialData, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: (initialData ? {
        name: initialData.name || '',
        title: initialData.title || '',
        bio: initialData.bio || '',
        professionalSummary: (initialData as any).professionalSummary || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        profileImageUrl: initialData.profileImageUrl || '',
        cvUrl: initialData.cvUrl || '',
        socialLinks: {
            github: initialData.socialLinks?.github || '',
            linkedin: initialData.socialLinks?.linkedin || '',
            facebook: (initialData.socialLinks as any)?.facebook || '',
            instagram: initialData.socialLinks?.instagram || '',
        },
        stats: {
            projectsCompleted: initialData.stats?.projectsCompleted || 0,
            yearsExperience: initialData.stats?.yearsExperience || 0,
        },
        heroImageUrl: initialData.heroImageUrl || '',
        timeline: initialData.timeline || [],
        experience: initialData.experience || [],
        education: initialData.education || [],
        certifications: initialData.certifications || [],
        languages: initialData.languages || [],
        hobbies: initialData.hobbies || [],
        references: initialData.references || [],
    } : {
      name: '',
      title: '',
      bio: '',
      professionalSummary: '',
      email: '',
      phone: '',
      location: '',
      profileImageUrl: '',
      cvUrl: '',
      socialLinks: {
          github: '',
          linkedin: '',
          facebook: '',
          instagram: '',
      },
      stats: {
          projectsCompleted: 0,
          yearsExperience: 0,
      },
      heroImageUrl: '',
      timeline: [],
      experience: [],
      education: [],
      certifications: [],
      languages: [],
      hobbies: [],
      references: [],
    }),
  } as any);

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control: form.control,
    name: "timeline"
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experience"
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education"
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control: form.control,
    name: "certifications"
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control: form.control,
    name: "languages"
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: "references"
  });

  // Helper for CV upload
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      
      try {
          // Show some loading state if possible
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          if(!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          field.onChange(data.secure_url);
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 p-2 bg-muted/40 backdrop-blur-sm rounded-xl border border-border/50">
            <TabsTrigger value="general" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <User className="h-4 w-4" /> <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <ImageIcon className="h-4 w-4" /> <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="socials" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <LinkIcon className="h-4 w-4" /> <span className="hidden sm:inline">Socials</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <FileText className="h-4 w-4" /> <span className="hidden sm:inline">Resume</span>
            </TabsTrigger>
            <TabsTrigger value="extra" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <ListChecks className="h-4 w-4" /> <span className="hidden sm:inline">Extra</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- GENERAL INFO TAB --- */}
            <TabsContent value="general" className="space-y-8 focus-visible:outline-none">
              <Card className="p-8 space-y-6 border-muted/50 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold uppercase tracking-wider">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-muted/5 border-muted-foreground/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold uppercase tracking-wider">Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Stack Developer" className="bg-muted/5 border-muted-foreground/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"><Mail className="h-3 w-3" /> Email</FormLabel>
                      <FormControl><Input placeholder="email@example.com" className="bg-muted/5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"><Phone className="h-3 w-3" /> Phone</FormLabel>
                      <FormControl><Input placeholder="+265..." className="bg-muted/5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"><MapPin className="h-3 w-3" /> Location</FormLabel>
                      <FormControl><Input placeholder="Salima, Malawi" className="bg-muted/5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </Card>

              <Card className="p-8 space-y-6 border-muted/50 shadow-sm">
                <div className="group space-y-4">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">Home Bio <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">Home Page</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Short intro for Home page..." className="h-28 bg-muted/5" {...field} />
                        </FormControl>
                        <FormDescription>The catchy introduction shown on your primary landing page.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="group space-y-4 pt-4 border-t border-dashed">
                  <FormField
                    control={form.control}
                    name="professionalSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">Professional Summary <span className="text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">About Page</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Detailed summary..." className="h-40 bg-muted/5" {...field} />
                        </FormControl>
                        <FormDescription>A comprehensive overview of your skills and career objectives.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* --- MEDIA TAB --- */}
            <TabsContent value="media" className="space-y-8 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Main Profile Image</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">This appears on both Home and About pages.</p>
                    <FormField
                      control={form.control}
                      name="profileImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Home Page Hero Illustration</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-6">A transparent background PNG for the home page edge.</p>
                    <FormField
                      control={form.control}
                      name="heroImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </div>

              <Card className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Curriculum Vitae (CV)</h3>
                    <p className="text-sm text-muted-foreground">Upload your latest resume in PDF format.</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="cvUrl"
                    render={({ field }) => (
                      <FormItem className="w-full md:w-96">
                        <FormControl>
                          <div className="space-y-3">
                              {field.value && (
                                  <a href={field.value} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-all uppercase tracking-widest overflow-hidden">
                                      <FileText className="h-4 w-4 shrink-0" />
                                      <span className="truncate">{field.value.split('/').pop()}</span>
                                  </a>
                              )}
                              <div className="flex items-center gap-2">
                                <Input type="file" accept=".pdf,.doc,.docx" className="bg-muted/30 cursor-pointer" onChange={(e) => handleCVUpload(e, field)} />
                              </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* --- SOCIALS & STATS TAB --- */}
            <TabsContent value="socials" className="space-y-8 focus-visible:outline-none">
              <Card className="p-8">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-8">Social Media Connectivity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField control={form.control} name="socialLinks.github" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><Github className="h-4 w-4 text-[#24292e]" /> GitHub</FormLabel>
                        <FormControl><Input placeholder="https://github.com/..." className="bg-muted/5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn</FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/..." className="bg-muted/5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="socialLinks.facebook" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><Facebook className="h-4 w-4 text-[#1877f2]" /> Facebook</FormLabel>
                        <FormControl><Input placeholder="https://facebook.com/..." className="bg-muted/5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><Instagram className="h-4 w-4 text-[#e4405f]" /> Instagram</FormLabel>
                        <FormControl><Input placeholder="https://instagram.com/..." className="bg-muted/5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              </Card>

              <Card className="p-8">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-8">Professional Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField control={form.control} name="stats.projectsCompleted" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider">Total Projects Completed</FormLabel>
                        <FormControl><Input type="number" className="bg-muted/5" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="stats.yearsExperience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider">Years of Experience</FormLabel>
                        <FormControl><Input type="number" className="bg-muted/5" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
              </Card>
            </TabsContent>

            {/* --- RESUME TAB (Timeline, Experience, Education) --- */}
            <TabsContent value="resume" className="space-y-12 focus-visible:outline-none">
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Career Journey Timeline</h3>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="font-bold uppercase tracking-widest text-[10px]" onClick={() => appendTimeline({ year: '', title: '', description: '' })}>
                      <Plus className="h-3 w-3 mr-2" /> Add Milestone
                  </Button>
                </div>
                <div className="space-y-4">
                    {timelineFields.map((field, index) => (
                        <Card key={field.id} className="p-6 bg-muted/5 border-dashed relative group transition-all hover:bg-muted/10">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeTimeline(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pr-8">
                                <FormField control={form.control} name={`timeline.${index}.year`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Year</FormLabel><Input placeholder="2024" className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`timeline.${index}.title`} render={({ field }) => (
                                    <FormItem className="md:col-span-1"><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Title</FormLabel><Input placeholder="Graduated..." className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`timeline.${index}.description`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel className="text-[10px] font-black uppercase text-muted-foreground">Description</FormLabel><Input placeholder="Details..." className="bg-background" {...field} /></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                    {timelineFields.length === 0 && <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground font-medium italic">No timeline events added yet.</div>}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Work Experience</h3>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="font-bold uppercase tracking-widest text-[10px]" onClick={() => appendExperience({ role: '', company: '', period: '', highlights: [''] })}>
                      <Plus className="h-3 w-3 mr-2" /> Add Experience
                  </Button>
                </div>
                <div className="space-y-6">
                    {experienceFields.map((field, index) => (
                        <Card key={field.id} className="p-8 bg-muted/5 relative group transition-all hover:bg-muted/10">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExperience(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <FormField control={form.control} name={`experience.${index}.role`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Role</FormLabel><Input placeholder="Web Developer" className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Company</FormLabel><Input placeholder="Company Name" className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`experience.${index}.period`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Period</FormLabel><Input placeholder="5 Months" className="bg-background" {...field} /></FormItem>
                                )} />
                            </div>
                            <div className="space-y-2">
                                <FormLabel className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><ListChecks className="h-3 w-3" /> Highlights (One per line)</FormLabel>
                                <Textarea 
                                  placeholder="Enter highlights..."
                                  className="h-32 bg-background font-mono text-sm"
                                  value={form.getValues(`experience.${index}.highlights`)?.join('\n') || ''}
                                  onChange={(e) => form.setValue(`experience.${index}.highlights`, e.target.value.split('\n'))}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-black uppercase tracking-tight">Education</h3>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="font-bold uppercase tracking-widest text-[10px]" onClick={() => appendEducation({ degree: '', institution: '', status: '' })}>
                      <Plus className="h-3 w-3 mr-2" /> Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                    {educationFields.map((field, index) => (
                        <Card key={field.id} className="p-6 bg-muted/5 relative group transition-all hover:bg-muted/10">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEducation(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-8">
                                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Degree</FormLabel><Input placeholder="BSc in ICT" className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Institution</FormLabel><Input placeholder="Mzuzu University" className="bg-background" {...field} /></FormItem>
                                )} />
                                <FormField control={form.control} name={`education.${index}.status`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Status</FormLabel><Input placeholder="Graduated 2019" className="bg-background" {...field} /></FormItem>
                                )} />
                            </div>
                        </Card>
                    ))}
                </div>
              </section>
            </TabsContent>

            {/* --- EXTRA TAB --- */}
            <TabsContent value="extra" className="space-y-12 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-black uppercase tracking-tight">Certifications</h3>
                      </div>
                      <Button type="button" variant="secondary" size="sm" onClick={() => appendCertification({ name: '', org: '', year: '' })}>
                          <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                        {certificationFields.map((field, index) => (
                            <Card key={field.id} className="p-5 bg-muted/5 relative group">
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeCertification(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-3">
                                    <Input placeholder="Certification Name" className="bg-background h-9 border-muted" {...form.register(`certifications.${index}.name`)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Org" className="bg-background h-9 text-xs" {...form.register(`certifications.${index}.org`)} />
                                        <Input placeholder="Year" className="bg-background h-9 text-xs" {...form.register(`certifications.${index}.year`)} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <Languages className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-black uppercase tracking-tight">Languages</h3>
                      </div>
                      <Button type="button" variant="secondary" size="sm" onClick={() => appendLanguage({ name: '', level: '' })}>
                          <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                        {languageFields.map((field, index) => (
                            <Card key={field.id} className="p-5 bg-muted/5 relative group">
                                <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeLanguage(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="grid grid-cols-2 gap-3 pr-6">
                                    <Input placeholder="Language" className="bg-background h-9" {...form.register(`languages.${index}.name`)} />
                                    <Input placeholder="Level (Native, Fluent...)" className="bg-background h-9 text-xs" {...form.register(`languages.${index}.level`)} />
                                </div>
                            </Card>
                        ))}
                    </div>
                  </section>
              </div>

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Heart className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Hobbies & Interests</h3>
                </div>
                <Card className="p-8 bg-muted/5 group">
                  <div className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground">List your hobbies (One per line)</FormLabel>
                    <Textarea 
                      placeholder="Enter hobbies..."
                      className="h-32 bg-background font-mono text-sm leading-relaxed"
                      value={form.watch('hobbies')?.join('\n') || ''}
                      onChange={(e) => form.setValue('hobbies', e.target.value.split('\n').filter(h => h.trim() !== ''))}
                    />
                    <FormDescription>These will be displayed as badges on your About Me page.</FormDescription>
                  </div>
                </Card>
              </section>

              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <Quote className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-black uppercase tracking-tight">References</h3>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="font-bold uppercase tracking-widest text-[10px]" onClick={() => appendReference({ name: '', title: '', phone: '' })}>
                      <Plus className="h-3 w-3 mr-2" /> Add Reference
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {referenceFields.map((field, index) => (
                        <Card key={field.id} className="p-6 bg-muted/5 relative group transition-all hover:bg-muted/10">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeReference(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="space-y-4 mr-6">
                                <FormField control={form.control} name={`references.${index}.name`} render={({ field }) => (
                                    <FormItem><FormLabel className="text-[10px] font-black uppercase">Name</FormLabel><Input placeholder="Name" className="bg-background" {...field} /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name={`references.${index}.title`} render={({ field }) => (
                                        <FormItem><FormLabel className="text-[10px] font-black uppercase">Title</FormLabel><Input placeholder="Title" className="bg-background text-xs" {...field} /></FormItem>
                                    )} />
                                    <FormField control={form.control} name={`references.${index}.phone`} render={({ field }) => (
                                        <FormItem><FormLabel className="text-[10px] font-black uppercase">Phone</FormLabel><Input placeholder="Phone" className="bg-background text-xs" {...field} /></FormItem>
                                    )} />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
              </section>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center justify-end gap-6 pt-10 border-t">
          <Button type="button" variant="ghost" className="font-bold uppercase tracking-widest text-xs" onClick={() => form.reset()}>
            Reset Changes
          </Button>
          <Button type="submit" size="lg" disabled={isLoading} className="font-black uppercase tracking-[0.2em] px-12 h-14 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              {isLoading ? 'Saving...' : 'Publish Update'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
