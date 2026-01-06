'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/admin/DataTable';
import { BlogForm } from '@/components/admin/BlogForm';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { IBlog } from '@/models/Blog';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

export default function BlogPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<IBlog | null>(null);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<IBlog[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsEditing(false);
      toast.success('Post created successfully');
    },
    onError: () => toast.error('Failed to create post'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsEditing(false);
      setEditingPost(null);
      toast.success('Post updated successfully');
    },
    onError: () => toast.error('Failed to update post'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete post');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post deleted successfully');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const columns: ColumnDef<IBlog>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
          return row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM dd, yyyy') : '-';
      }
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => row.original.tags.join(', ')
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingPost(post);
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the post "{post.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(post._id as string)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  if (isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          {editingPost ? 'Edit Post' : 'New Post'}
        </h2>
        <div className="max-w-4xl bg-card p-6 rounded-lg border">
            <BlogForm
              initialData={editingPost}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onSubmit={(data) => {
                if (editingPost) {
                  updateMutation.mutate({ id: editingPost._id as string, data });
                } else {
                  createMutation.mutate(data);
                }
              }}
              onCancel={() => {
                setIsEditing(false);
                setEditingPost(null);
              }}
            />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={posts || []} 
          filterColumn="title"
        />
      )}
    </div>
  );
}
