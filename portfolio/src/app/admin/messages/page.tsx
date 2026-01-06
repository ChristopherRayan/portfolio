'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/admin/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { IContact } from '@/models/Contact';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle, Eye, Paperclip, Mail, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/alert-dialog";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery<IContact[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await fetch('/api/contact');
      if (!res.ok) return []; 
      return res.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete message');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => {
      toast.error('Failed to delete message');
    }
  });

  const unreadCount = messages?.filter(m => !m.read).length || 0;

  const columns: ColumnDef<IContact>[] = [
    {
      accessorKey: 'read',
      header: 'Status',
      cell: ({ row }) => {
        const isRead = row.original.read;
        return isRead ? (
          <Badge variant="outline" className="flex w-fit items-center gap-1.5 font-normal text-muted-foreground">
            <MailOpen className="h-3 w-3" />
            Read
          </Badge>
        ) : (
          <Badge className="flex w-fit items-center gap-1.5 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
            <Mail className="h-3 w-3" />
            Unread
          </Badge>
        );
      }
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => <span className={!row.original.read ? "font-bold text-foreground" : "text-muted-foreground"}>{row.original.subject}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
          return row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM dd, HH:mm') : '-';
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const msg = row.original;
        
        const onOpen = () => {
          if (!msg.read) {
            markAsReadMutation.mutate(msg._id as string);
          }
        };

        // Normalize attachments (support legacy single attachmentUrl if it exists)
        const allAttachments = [...(msg.attachments || [])];
        // @ts-ignore - support older schema field during transition
        if (msg.attachmentUrl) {
            allAttachments.push({
                // @ts-ignore
                url: msg.attachmentUrl,
                name: 'Legacy Attachment'
            });
        }

        return (
          <div className="flex items-center gap-2">
            <Dialog onOpenChange={(open) => open && onOpen()}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className={!msg.read ? "text-primary" : ""}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          {msg.subject}
                          {!msg.read && <Badge>New</Badge>}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg text-sm border">
                            <div className="space-y-1">
                              <p className="font-medium">From: {msg.name}</p>
                              <p className="text-muted-foreground">{msg.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-muted-foreground">{msg.createdAt && format(new Date(msg.createdAt), 'PPP p')}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Message</p>
                          <div className="bg-muted/20 p-6 rounded-xl whitespace-pre-wrap border leading-relaxed">
                              {msg.message}
                          </div>
                        </div>

                        {allAttachments.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    Attachments ({allAttachments.length})
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {allAttachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-card p-3 rounded-lg border shadow-sm group hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                              <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                                              <span className="text-sm truncate font-medium">{file.name}</span>
                                            </div>
                                            <a 
                                                href={file.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary text-xs font-semibold hover:underline bg-primary/10 px-3 py-1.5 rounded-md shrink-0"
                                            >
                                                View / Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="pt-4 border-t">
                      <DialogTrigger asChild>
                        <Button variant="outline">Close</Button>
                      </DialogTrigger>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this message. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteMutation.mutate(msg._id as string)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">Loading messages...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Inquiries</h1>
          <p className="text-muted-foreground">
            You have <span className="text-foreground font-semibold">{unreadCount}</span> unread messages.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-card border rounded-2xl p-5 flex items-center gap-5 shadow-sm min-w-[180px] hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Unread</p>
            </div>
          </div>
          <div className="bg-card border rounded-2xl p-5 flex items-center gap-5 shadow-sm min-w-[180px] hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <MailOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{(messages?.length || 0) - unreadCount}</p>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Read</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-xl overflow-hidden">
        {messages && messages.length > 0 ? (
            <DataTable 
            columns={columns} 
            data={messages || []} 
            filterColumn="subject"
            />
        ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="h-20 w-20 bg-muted/30 flex items-center justify-center rounded-full mb-6">
                    <Mail className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    Inquiries from your contact form will appear here. Share your portfolio to get started!
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
