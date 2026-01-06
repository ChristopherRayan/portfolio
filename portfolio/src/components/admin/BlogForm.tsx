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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { blogSchema } from '@/lib/validations';
import { IBlog } from '@/models/Blog';
import { FileUpload } from '@/components/admin/FileUpload';
import { useEffect } from 'react';
import { Editor } from '@/components/admin/Editor';
import { BLOG_CATEGORIES } from '@/lib/constants';

interface BlogFormProps {
  initialData?: IBlog | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function BlogForm({ initialData, onSubmit, isLoading, onCancel }: BlogFormProps) {
  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: (initialData ? {
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        content: initialData.content,
        coverImage: initialData.coverImage || '',
        category: initialData.category || 'Web Development',
        published: !!initialData.published,
        tags: initialData.tags || [],
    } : {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: 'Web Development',
      published: false,
      tags: [],
    }),
  } as any);

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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
      const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
      field.onChange(val);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem className="md:col-span-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="Blog Post Title" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem className="md:col-span-1">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input placeholder="blog-post-title" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem className="md:col-span-1">
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <select 
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary for listings..." className="h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <FileUpload 
                    value={field.value} 
                    onChange={field.onChange}
                    onRemove={() => field.onChange('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Editor 
                  value={field.value} 
                  onChange={field.onChange} 
                  placeholder="Tell your story..." 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags (Comma separated)</FormLabel>
                <FormControl>
                    <Input 
                        placeholder="react, tutorial, tech" 
                        defaultValue={field.value.join(', ')}
                        onChange={(e) => handleTagsChange(e, field)}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                    <input
                        id="published-checkbox"
                        title="Published Status"
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="published-checkbox">Published</FormLabel>
                    <FormDescription>
                    Make this post visible on the public blog page.
                    </FormDescription>
                </div>
                </FormItem>
            )}
            />
        </div>
        
        <div className="flex justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
