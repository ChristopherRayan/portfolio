'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { IProfile } from '@/models/Profile';
import { toast } from 'sonner';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isFetching } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isFetching) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile & Bio</h2>
        <p className="text-muted-foreground">
          Manage your personal information and CV.
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
         <ProfileForm
            initialData={profile}
            isLoading={updateMutation.isPending}
            onSubmit={(data) => updateMutation.mutate(data)}
         />
      </div>
    </div>
  );
}
