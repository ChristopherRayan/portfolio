'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Briefcase,
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { ProcessForm } from '@/components/admin/ProcessForm';
import { BenefitForm } from '@/components/admin/BenefitForm';
import { getIconComponent } from '@/lib/iconMap';
import { IServiceData } from '@/types/service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('services');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Queries
  const { data: services = [], isLoading: isLoadingServices, refetch: refetchServices } = useQuery<IServiceData[]>({
    queryKey: ['admin-services'],
    queryFn: () => fetch(`/api/services?t=${Date.now()}`).then(res => res.json()),
  });

  const { data: processes = [], isLoading: isLoadingProcesses, refetch: refetchProcesses } = useQuery({
    queryKey: ['process-steps'],
    queryFn: () => fetch(`/api/process?t=${Date.now()}`).then(res => res.json()),
  });

  const { data: benefits = [], isLoading: isLoadingBenefits, refetch: refetchBenefits } = useQuery({
    queryKey: ['benefits'],
    queryFn: () => fetch(`/api/benefits?t=${Date.now()}`).then(res => res.json()),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/${activeTab === 'services' ? 'services' : activeTab === 'process' ? 'process' : 'benefits'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(err.error || 'Failed to create item');
      }
      return res.json();
    },
    onSuccess: async () => {
      const queryKey = activeTab === 'process' ? 'process-steps' : activeTab === 'services' ? 'admin-services' : 'benefits';
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
      // Force immediate refetch
      if (activeTab === 'services') await refetchServices();
      if (activeTab === 'process') await refetchProcesses();
      if (activeTab === 'benefits') await refetchBenefits();
      
      setIsFormOpen(false);
      toast.success('Item created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Create failed: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/${activeTab === 'services' ? 'services' : activeTab === 'process' ? 'process' : 'benefits'}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(err.error || 'Failed to update item');
      }
      return res.json();
    },
    onSuccess: async () => {
      const queryKey = activeTab === 'process' ? 'process-steps' : activeTab === 'services' ? 'admin-services' : 'benefits';
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
      // Force immediate refetch
      if (activeTab === 'services') await refetchServices();
      if (activeTab === 'process') await refetchProcesses();
      if (activeTab === 'benefits') await refetchBenefits();

      setIsFormOpen(false);
      setEditingItem(null);
      toast.success('Item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/${activeTab === 'services' ? 'services' : activeTab === 'process' ? 'process' : 'benefits'}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(err.error || 'Failed to delete item');
      }
      return res;
    },
    onSuccess: async () => {
      const queryKey = activeTab === 'process' ? 'process-steps' : activeTab === 'services' ? 'admin-services' : 'benefits';
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
      // Force immediate refetch
      if (activeTab === 'services') await refetchServices();
      if (activeTab === 'process') await refetchProcesses();
      if (activeTab === 'benefits') await refetchBenefits();

      toast.success('Item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    }
  });

  const handleSubmit = (data: any) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleReorder = async (item: any, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? item.order - 1 : item.order + 1;
    updateMutation.mutate({
      id: item._id,
      data: { ...item, order: newOrder },
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Services Management Overhaul</h1>
          <p className="text-muted-foreground mt-2">Manage your services, work process steps, and brand benefits.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === 'services' ? 'Service' : activeTab === 'process' ? 'Step' : 'Benefit'}
        </Button>
      </div>

      <Tabs defaultValue="services" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <GitPullRequest className="w-4 h-4" />
            Process
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Benefits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="pt-0">
          <ServicesTable 
            data={services} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onReorder={handleReorder}
            isLoading={isLoadingServices} 
          />
        </TabsContent>

        <TabsContent value="process" className="pt-0">
          <ProcessTable 
            data={processes} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onReorder={handleReorder}
            isLoading={isLoadingProcesses} 
          />
        </TabsContent>

        <TabsContent value="benefits" className="pt-0">
          <BenefitsTable 
            data={benefits} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onReorder={handleReorder}
            isLoading={isLoadingBenefits} 
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit' : 'Add'} {activeTab === 'services' ? 'Service' : activeTab === 'process' ? 'Step' : 'Benefit'}
            </DialogTitle>
          </DialogHeader>
          
          {activeTab === 'services' && (
            <ServiceForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onCancel={() => setIsFormOpen(false)}
            />
          )}

          {activeTab === 'process' && (
            <ProcessForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onCancel={() => setIsFormOpen(false)}
            />
          )}

          {activeTab === 'benefits' && (
            <BenefitForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onCancel={() => setIsFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServicesTable({ data, onEdit, onDelete, onReorder, isLoading }: any) {
  if (isLoading) return <div className="text-center py-10">Loading services...</div>;
  const sorted = [...data].sort((a, b) => a.order - b.order);
  
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Tagline</TableHead>
            <TableHead>Pricing</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((service: IServiceData) => (
            <TableRow key={service._id} className={!service.active ? 'opacity-50' : ''}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(service, 'up')}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(service, 'down')}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {(() => {
                  const Icon = getIconComponent(service.icon);
                  return <Icon className="w-5 h-5" />;
                })()}
              </TableCell>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell className="max-w-[200px] truncate">{service.shortDesc}</TableCell>
              <TableCell>{service.pricing}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${service.color}-500`} />
                  <span className="capitalize">{service.color}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${service.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {service.active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(service)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(service._id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProcessTable({ data, onEdit, onDelete, onReorder, isLoading }: any) {
  if (isLoading) return <div className="text-center py-10">Loading process steps...</div>;
  const sorted = [...data].sort((a, b) => a.order - b.order);
  
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Step</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item: any) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(item, 'up')}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(item, 'down')}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell><span className="font-bold">{item.step}</span></TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="max-w-[400px] truncate">{item.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item._id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BenefitsTable({ data, onEdit, onDelete, onReorder, isLoading }: any) {
  if (isLoading) return <div className="text-center py-10">Loading benefits...</div>;
  const sorted = [...data].sort((a, b) => a.order - b.order);
  
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((item: any) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(item, 'up')}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onReorder(item, 'down')}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {(() => {
                  const Icon = getIconComponent(item.icon);
                  return <Icon className="w-5 h-5" />;
                })()}
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="max-w-[400px] truncate">{item.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(item._id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
