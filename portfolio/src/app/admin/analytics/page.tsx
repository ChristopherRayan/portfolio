'use client';

import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-primary" />
            Visitor Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track site performance and user engagement in real-time.
          </p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
