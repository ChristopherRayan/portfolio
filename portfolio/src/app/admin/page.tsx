'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Wrench, FileText, Mail, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: projects = [] } = useQuery({ 
      queryKey: ['projects'], 
      queryFn: () => fetch('/api/projects').then(res => res.ok ? res.json() : []) 
  });
  
  const { data: skills = [] } = useQuery({ 
      queryKey: ['skills'], 
      queryFn: () => fetch('/api/skills').then(res => res.ok ? res.json() : []) 
  });
  
  const { data: posts = [] } = useQuery({ 
      queryKey: ['blog-posts'], 
      queryFn: () => fetch('/api/blog').then(res => res.ok ? res.json() : []) 
  });

  const { data: services = [] } = useQuery({ 
      queryKey: ['services'], 
      queryFn: () => fetch('/api/services').then(res => res.ok ? res.json() : []) 
  });

  const { data: messages = [] } = useQuery({ 
      queryKey: ['messages'], 
      queryFn: () => fetch('/api/contact').then(res => res.ok ? res.json() : []) 
  });
  const stats = [
    {
      title: 'Total Projects',
      value: mounted ? (projects?.length || 0) : 0,
      icon: FolderKanban,
      description: 'Active portfolio items',
    },
    {
      title: 'Total Skills',
      value: mounted ? (skills?.length || 0) : 0,
      icon: Wrench,
      description: 'Showcased technologies',
    },
    {
      title: 'Blog Posts',
      value: mounted ? (posts?.length || 0) : 0,
      icon: FileText,
      description: 'Published articles',
    },
    {
      title: 'Services',
      value: mounted ? (services?.length || 0) : 0,
      icon: Briefcase,
      description: 'Active offerings',
    },
    {
      title: 'Messages',
      value: mounted ? (messages?.filter((m: any) => !m.read).length || 0) : 0,
      icon: Mail,
      description: 'Unread inquiries',
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="h-32 bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your portfolio content and activity.
        </p>
      </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent Activity or other widgets can go here */}
    </div>
  );
}

