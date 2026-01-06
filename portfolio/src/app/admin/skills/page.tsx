'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/admin/DataTable';
import { SkillForm } from '@/components/admin/SkillForm';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { ISkill } from '@/models/Skill';
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

export default function SkillsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const queryClient = useQueryClient();

  const { data: skills, isLoading } = useQuery<ISkill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create skill');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditing(false);
      toast.success('Skill added successfully');
    },
    onError: () => toast.error('Failed to create skill'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update skill');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsEditing(false);
      setEditingSkill(null);
      toast.success('Skill updated successfully');
    },
    onError: () => toast.error('Failed to update skill'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete skill');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: () => toast.error('Failed to delete skill'),
  });

  const columns: ColumnDef<ISkill>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'percentage',
      header: 'Proficiency (%)',
      cell: ({ row }) => {
          return (
              <div className="flex items-center gap-2">
                  <Progress value={row.original.percentage} className="w-[100px] h-2.5" />
                  <span>{row.original.percentage}%</span>
              </div>
          )
      }
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const skill = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditingSkill(skill);
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
                            This will permanently delete the skill "{skill.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(skill._id as string)}>
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
          {editingSkill ? 'Edit Skill' : 'New Skill'}
        </h2>
        <div className="max-w-md bg-card p-6 rounded-lg border">
            <SkillForm
              initialData={editingSkill}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onSubmit={(data) => {
                if (editingSkill) {
                  updateMutation.mutate({ id: editingSkill._id as string, data });
                } else {
                  createMutation.mutate(data);
                }
              }}
              onCancel={() => {
                setIsEditing(false);
                setEditingSkill(null);
              }}
            />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={skills || []} 
        filterColumn="name"
      />
    </div>
  );
}
