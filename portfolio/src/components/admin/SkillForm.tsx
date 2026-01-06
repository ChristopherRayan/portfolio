'use client';

import { useForm } from 'react-hook-form';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { skillSchema } from '@/lib/validations';
import { ISkill } from '@/models/Skill';

interface SkillFormProps {
  initialData?: ISkill | null;
  onSubmit: (data: z.infer<typeof skillSchema>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function SkillForm({ initialData, onSubmit, isLoading, onCancel }: SkillFormProps) {
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: (initialData ? {
        name: initialData.name,
        percentage: initialData.percentage,
        category: initialData.category as any,
        level: initialData.level as any,
        icon: initialData.icon || '',
        order: initialData.order || 0,
    } : {
      name: '',
      percentage: 50,
      category: 'Programming Languages',
      level: 'Intermediate',
      icon: '',
      order: 0,
    }),
  } as any);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Category</FormLabel>
                      <select 
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Programming Languages">Programming Languages</option>
                        <option value="Frontend Development">Frontend Development</option>
                        <option value="Backend Development">Backend Development</option>
                        <option value="Databases">Databases</option>
                        <option value="Networking & Security">Networking & Security</option>
                        <option value="Tools & Platforms">Tools & Platforms</option>
                        <option value="Design & Multimedia">Design & Multimedia</option>
                        <option value="System Administration">System Administration</option>
                      </select>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Proficiency Level</FormLabel>
                      <select 
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Expert">Expert (5 Stars)</option>
                        <option value="Advanced">Advanced (4.5 Stars)</option>
                        <option value="Intermediate">Intermediate (4 Stars)</option>
                      </select>
                      <FormMessage />
                  </FormItem>
              )}
          />
        </div>

        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Proficiency Percentage ({field.value}%)</FormLabel>
              </div>
              <FormControl>
                <Input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (Emoji or URL)</FormLabel>
              <FormControl>
                <Input placeholder="🚀, 💻, or image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : initialData ? 'Update Skill' : 'Add Skill'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
