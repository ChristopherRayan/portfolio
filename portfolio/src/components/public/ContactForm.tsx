'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Need to add textarea component or use native
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

// Since I haven't added textarea component via shadcn yet, I'll use a basic styled textarea or add it.
// I'll assume I can just use a standard HTML textarea with Shadcn styling classes for now.
// Actually, I should add textarea component. I'll do that in a separate step or just mock it here.
// I'll stick to standard textarea with Tailwind classes matching Input.

import { Paperclip, X, Loader2 } from 'lucide-react';
import { contactSchema } from '@/lib/validations';

// Use shared schema
const formSchema = contactSchema;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      attachments: [],
    },
  } as any);

  // Auto-fill form from URL parameters
  useEffect(() => {
    const serviceName = searchParams.get('service');
    const subjectParam = searchParams.get('subject');

    if (subjectParam) {
      form.setValue('subject', subjectParam);
    }

    if (serviceName) {
      // If we have a service name but no message yet, pre-fill the message
      const currentMessage = form.getValues('message');
      if (!currentMessage) {
        form.setValue('message', `I would like to inquire about your ${serviceName} service.`);
      }
    }
  }, [searchParams, form]);

  useEffect(() => {
    const serviceName = searchParams.get('service');
    const subjectParam = searchParams.get('subject');

    if (subjectParam) {
      form.setValue('subject', subjectParam);
    }

    if (serviceName) {
      const currentMessage = form.getValues('message');
      if (!currentMessage) {
        form.setValue('message', `I would like to inquire about your ${serviceName} service.`);
      }
    }
  }, [searchParams, form]);

  const attachments = form.watch('attachments') || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (attachments.length + files.length > 5) {
      toast.error('You can only attach up to 5 files');
      return;
    }

    setIsUploading(true);
    const newAttachments = [...attachments];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            newAttachments.push({
                url: data.secure_url,
                name: file.name
            });
        } catch (error) {
            toast.error(`Failed to upload ${file.name}`);
        }
    }

    form.setValue('attachments', newAttachments);
    setIsUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    form.setValue('attachments', newAttachments);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background pt-20 pb-20 px-4">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 bg-primary/5 w-[500px] h-[500px] rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 -z-10 bg-secondary/10 w-[400px] h-[400px] rounded-full blur-[100px] opacity-50" />

      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="mb-14 text-center relative z-10"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
             Have a project in mind or just want to say hi? Feel free to reach out!
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="max-w-md mx-auto bg-card/30 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 relative z-10"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Project Inquiry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type your message here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments (Max 5)
                </FormLabel>
                
                <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full text-xs border">
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button 
                                type="button" 
                                onClick={() => removeAttachment(index)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Remove Attachment"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {attachments.length < 5 && (
                        <div className="relative">
                            <Input 
                                type="file" 
                                multiple 
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,image/*"
                                disabled={isUploading}
                            />
                            <label 
                                htmlFor="file-upload"
                                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full text-xs border border-primary/20 cursor-pointer transition-colors"
                            >
                                {isUploading ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Paperclip className="h-3 w-3" />
                                )}
                                {isUploading ? 'Uploading...' : 'Add File'}
                            </label>
                        </div>
                    )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground font-black py-6 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="uppercase tracking-widest text-xs">Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-widest text-xs">Send Message</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {/* Arrow icon or similar */}
                    </motion.div>
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
