'use client';

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
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projectSchema } from '@/lib/validations';
import { FileUpload } from '@/components/admin/FileUpload';
import { IProject } from '@/models/Project';
import { useEffect } from 'react';
import { Plus, Trash2, Layout, Shield, Zap, Code, Box, Users, AlertCircle, Eye } from 'lucide-react';

interface ProjectFormProps {
  initialData?: IProject | null;
  onSubmit: (data: z.infer<typeof projectSchema>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ProjectForm({ initialData, onSubmit, isLoading, onCancel }: ProjectFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(projectSchema),
    defaultValues: (initialData ? {
        title: initialData.title,
        slug: initialData.slug || '',
        subtitle: initialData.subtitle || '',
        category: initialData.category || 'Full-Stack Project',
        duration: initialData.duration || '',
        description: initialData.description,
        longDescription: initialData.longDescription || '',
        technologies: initialData.technologies || [],
        imageUrl: initialData.imageUrl || '',
        liveUrl: initialData.liveUrl || '',
        githubUrl: initialData.githubUrl || '',
        featured: !!initialData.featured,
        order: initialData.order ?? 0,
        overview: initialData.overview || '',
        problem: initialData.problem || '',
        solution: initialData.solution || { description: '', coreLogic: '' },
        features: initialData.features || [],
        techStack: initialData.techStack || { frontend: [], backend: [], database: [] },
        architecture: initialData.architecture || { pattern: '', communication: '', authentication: '', monitoring: '' },
        yourRole: initialData.yourRole || { backend: [], frontend: [], deployment: [] },
        challenges: initialData.challenges || [],
        security: initialData.security || [],
        outcome: initialData.outcome || { whatWorks: [], learnings: [], improvements: [] },
        outcome: initialData.outcome || { whatWorks: [], learnings: [], improvements: [] },
        screenshotsList: initialData.screenshots ? Object.entries(initialData.screenshots).map(([key, url]) => ({ key, url })) : [],
    } : {
      title: '',
      title: '',
      slug: '',
      subtitle: '',
      category: 'Full-Stack Project',
      duration: '',
      description: '',
      longDescription: '',
      technologies: [],
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: 0,
      overview: '',
      problem: '',
      solution: { description: '', coreLogic: '' },
      features: [],
      techStack: { frontend: [], backend: [], database: [] },
      architecture: { pattern: '', communication: '', authentication: '', monitoring: '' },
      yourRole: { backend: [], frontend: [], deployment: [] },
      challenges: [],
      security: [],
      outcome: { whatWorks: [], learnings: [], improvements: [] },
      screenshotsList: [],
    }),
  });

  const title = form.watch('title');
  const isEditing = !!initialData;

  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, isEditing, form]);

  const handleSubmit = (values: any) => {
    // Transform screenshotsList back to object
    const screenshots = values.screenshotsList.reduce((acc: any, item: any) => {
      if (item.key && item.url) {
        acc[item.key] = item.url;
      }
      return acc;
    }, {});

    const submissionData = { ...values, screenshots };
    delete submissionData.screenshotsList;
    
    onSubmit(submissionData);
  };
  
  const handleCommaList = (e: React.ChangeEvent<HTMLInputElement>, field: { onChange: (val: string[]) => void }) => {
      const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
      field.onChange(val);
  };

  // Field Arrays for complex structures
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features"
  });

  const { fields: challengeFields, append: appendChallenge, remove: removeChallenge } = useFieldArray({
    control: form.control,
    name: "challenges"
  });

  const { fields: securityFields, append: appendSecurity, remove: removeSecurity } = useFieldArray({
    control: form.control,
    name: "security"
  });

  const { fields: screenshotFields, append: appendScreenshot, remove: removeScreenshot } = useFieldArray({
    control: form.control,
    name: "screenshotsList"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="outcome">Outcome</TabsTrigger>
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-6 border p-6 rounded-lg bg-card/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Network Monitoring System" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="network-monitoring-system" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Real-time network infrastructure monitoring dashboard..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="5 months development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (Card Summary)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary for listings..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <FileUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Project</FormLabel>
                        <FormDescription>Show this prominently on the home page.</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Technologies (Comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="React, Node.js, Next.js" 
                        value={field.value ? field.value.join(', ') : ''}
                        onChange={(e) => handleCommaList(e, field)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* TECHNICAL TAB */}
          <TabsContent value="technical" className="space-y-6 border p-6 rounded-lg bg-card/30">
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Project Overview</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed breakdown of the project goals..." className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Statement</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What critical problem does this solve?" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Solution Highlights</h3>
              <FormField
                control={form.control}
                name="solution.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Solution Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How did you solve the problem?" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="solution.coreLogic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Logic / Implementation Detail</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Technical deep dive into the logic..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><Layout className="w-5 h-5 text-yellow-500" /> Key Features</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendFeature({ title: '', description: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Feature
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {featureFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md bg-background/50">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <Input placeholder="Feature Title" {...field} />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`features.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <Input placeholder="Feature Description" {...field} />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeFeature(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ARCHITECTURE TAB */}
          <TabsContent value="architecture" className="space-y-6 border p-6 rounded-lg bg-card/30">
             <div className="space-y-4">
               <h3 className="text-lg font-bold flex items-center gap-2"><Box className="w-5 h-5 text-yellow-500" /> System Architecture</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                   control={form.control}
                   name="architecture.pattern"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Pattern (MVC, Microservices, etc.)</FormLabel>
                       <Input {...field} />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="architecture.communication"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Communication (REST, WebSocket, etc.)</FormLabel>
                       <Input {...field} />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="architecture.authentication"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Authentication (JWT, OAuth, etc.)</FormLabel>
                       <Input {...field} />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="architecture.monitoring"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Monitoring Strategy</FormLabel>
                       <Input {...field} />
                     </FormItem>
                   )}
                 />
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t">
               <h3 className="text-lg font-bold flex items-center gap-2"><Code className="w-5 h-5 text-yellow-500" /> Technology Stack Breakdown</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                   control={form.control}
                   name="techStack.frontend"
                   render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frontend Stack</FormLabel>
                      <Input placeholder="React, Tailwind..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                    </FormItem>
                   )}
                 />
                 <FormField
                    control={form.control}
                    name="techStack.backend"
                    render={({ field }) => (
                     <FormItem>
                       <FormLabel>Backend Stack</FormLabel>
                       <Input placeholder="Node.js, Express..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                     </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="techStack.database"
                    render={({ field }) => (
                     <FormItem>
                       <FormLabel>Database & Infrastructure</FormLabel>
                       <Input placeholder="MongoDB, Redis..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                     </FormItem>
                    )}
                  />
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t">
               <h3 className="text-lg font-bold flex items-center gap-2"><Users className="w-5 h-5 text-yellow-500" /> My Role & Contributions</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="yourRole.frontend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frontend Tasks</FormLabel>
                        <Input placeholder="UI implementation, animations..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yourRole.backend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backend Tasks</FormLabel>
                        <Input placeholder="API design, DB optimization..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yourRole.deployment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployment Tasks</FormLabel>
                        <Input placeholder="CI/CD, Server setup..." value={(field.value || []).join(', ')} onChange={(e) => handleCommaList(e, field)} />
                      </FormItem>
                    )}
                  />
               </div>
             </div>
          </TabsContent>

          {/* CHALLENGES TAB */}
          <TabsContent value="challenges" className="space-y-6 border p-6 rounded-lg bg-card/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5 text-yellow-500" /> Challenges & Solutions</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendChallenge({ problem: '', solution: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Challenge
                </Button>
              </div>
              <div className="space-y-4">
                {challengeFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-md bg-background/50 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-muted-foreground uppercase">Challenge #{index + 1}</span>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={() => removeChallenge(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.problem`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-400">Problem</FormLabel>
                          <Textarea {...field} placeholder="Describe the technical difficulty..." />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`challenges.${index}.solution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-400">Solution</FormLabel>
                          <Textarea {...field} placeholder="How did you overcome it?" />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-yellow-500" /> Security Best Practices</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendSecurity({ title: '', description: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Security Item
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-md bg-background/50 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-muted-foreground uppercase">Security Item #{index + 1}</span>
                      <Button type="button" variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={() => removeSecurity(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`security.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <Input {...field} placeholder="Security Feature Title (e.g. Password Hashing)" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`security.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <Textarea {...field} placeholder="Detailed security explanation..." />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* OUTCOME TAB */}
          <TabsContent value="outcome" className="space-y-6 border p-6 rounded-lg bg-card/30">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="outcome.whatWorks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-400">What Works Now (Success Metrics)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="System monitors 50 devices, 95% uptime..." value={(field.value || []).join('\n')} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                    </FormControl>
                    <FormDescription>One outcome per line</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome.learnings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400">Key Technical Learnings</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Managing WebSocket connections, Database indexing..." value={(field.value || []).join('\n')} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                    </FormControl>
                    <FormDescription>One learning per line</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome.improvements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400">Future Improvements</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add predictive analytics, SMS alerts..." value={(field.value || []).join('\n')} onChange={(e) => field.onChange(e.target.value.split('\n').filter(Boolean))} />
                    </FormControl>
                    <FormDescription>One improvement per line</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><Eye className="w-5 h-5 text-yellow-500" /> Interaction Screenshots</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => appendScreenshot({ key: '', url: '' })}>
                  <Plus className="w-4 h-4 mr-2" /> Add Screenshot
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {screenshotFields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-md bg-background/50 space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive h-6 w-6" onClick={() => removeScreenshot(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <FormField
                      control={form.control}
                      name={`screenshotsList.${index}.key`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Screenshot Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Dashboard View" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`screenshotsList.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <FileUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange('')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[150px] bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
            </Button>
        </div>
      </form>
    </Form>
  );
}

