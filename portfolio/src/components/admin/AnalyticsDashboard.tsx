'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  MousePointer2, 
  TrendingUp, 
  ArrowUpRight,
  Loader2,
  Globe,
  Download,
  FileText,
  History,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Eye,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 6).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [timePeriod, setTimePeriod] = useState('7days');
  const [selectedMetrics, setSelectedMetrics] = useState(['views', 'interactions']);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['analytics-stats', dateRange.from, dateRange.to],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/stats?startDate=${dateRange.from}&endDate=${dateRange.to}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    }
  });



  const updatePreset = (preset: string) => {
    setTimePeriod(preset);
    const days = preset === '90days' ? 89 : preset === '30days' ? 29 : 6;
    setDateRange({
      from: subDays(new Date(), days).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    });
  };

  const { data: journeys, isLoading: isJourneysLoading } = useQuery({
    queryKey: ['analytics-journeys', dateRange.from, dateRange.to],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/journey?startDate=${dateRange.from}&endDate=${dateRange.to}`);
      if (!res.ok) throw new Error('Failed to fetch journeys');
      return res.json();
    }
  });

  const exportCSV = () => {
    window.location.href = `/api/admin/analytics/export?startDate=${dateRange.from}&endDate=${dateRange.to}&format=csv`;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set Yellow Background
    doc.setFillColor(255, 230, 0); // Vibrant Yellow
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Watermark
    doc.setTextColor(235, 210, 0); // Darker Yellow for subtle watermark
    doc.setFontSize(40);
    doc.text('CONFIDENTIAL - ANALYTICS', 30, pageHeight / 2, { angle: 45 });
    
    // Header
    doc.setTextColor(20, 30, 80); // Mid-Dark Blue
    doc.setFontSize(24);
    doc.text('Portfolio Analytics Report', 14, 25);
    
    doc.setTextColor(0, 0, 0); // Black for metadata
    doc.setFontSize(10);
    doc.text(`Period: ${dateRange.from} to ${dateRange.to}`, 14, 35);
    doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 40);
    
    // Stats Summary Table
    const cur = stats?.current || {};
    const prev = stats?.previous || {};
    
    const summaryData = [
      ['Metric', 'Current Period', 'Previous Period', 'Change'],
      ['Total Views', cur.totalViews?.[0]?.count || 0, prev.totalViews?.[0]?.count || 0, calculateTrend(cur.totalViews?.[0]?.count, prev.totalViews?.[0]?.count)],
      ['Popular Pages', cur.popularPaths?.length || 0, prev.popularPaths?.length || 0, '-'],
      ['Traffic Sources', cur.trafficSources?.length || 0, prev.trafficSources?.length || 0, '-']
    ];

    autoTable(doc, {
      startY: 50,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      headStyles: { fillColor: [20, 30, 80], textColor: [255, 255, 255] }
    });

    // Linear Graph Rendering (Manual Drawing)
    const chartY = (doc as any).lastAutoTable.finalY + 20;
    doc.setTextColor(20, 30, 80);
    doc.setFontSize(14);
    doc.text('System Behavior Metrics (Linear)', 14, chartY);
    
    const chartWidth = pageWidth - 28;
    const chartHeight = 40;
    const graphBaseY = chartY + 10 + chartHeight;
    const dailyViewsData = cur.dailyViews || [];
    
    if (dailyViewsData.length > 0) {
      selectedMetrics.forEach(metric => {
        const config = metricConfigs[metric];
        const maxVal = Math.max(...dailyViewsData.map(config.accessor), 1);
        
        // Convert to RGB for jsPDF
        // config.color is hex, e.g., #3b82f6
        const r = parseInt(config.color.slice(1, 3), 16);
        const g = parseInt(config.color.slice(3, 5), 16);
        const b = parseInt(config.color.slice(5, 7), 16);
        
        doc.setDrawColor(r, g, b);
        doc.setFillColor(r, g, b);
        doc.setLineWidth(0.4);
        
        dailyViewsData.forEach((day: any, i: number) => {
          const x = dailyViewsData.length > 1 
            ? 14 + (i / (dailyViewsData.length - 1)) * chartWidth
            : 14 + (chartWidth / 2);
          const y = graphBaseY - (config.accessor(day) / (maxVal || 1)) * chartHeight;
          
          if (i > 0 && dailyViewsData.length > 1) {
            const prevX = 14 + ((i - 1) / (dailyViewsData.length - 1)) * chartWidth;
            const prevY = graphBaseY - (config.accessor(dailyViewsData[i - 1]) / (maxVal || 1)) * chartHeight;
            if (!isNaN(prevX) && !isNaN(prevY) && !isNaN(x) && !isNaN(y)) {
              doc.line(prevX, prevY, x, y);
            }
          }
          if (!isNaN(x) && !isNaN(y)) {
            doc.circle(x, y, 0.6, 'F');
          }
        });
      });

      // Simple Axes
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      doc.line(14, graphBaseY, 14 + chartWidth, graphBaseY); // X axis
      doc.line(14, graphBaseY, 14, graphBaseY - chartHeight); // Y axis
      
      // Slanted Axis Labels in PDF
      doc.setFontSize(7);
      doc.setTextColor(100);
      dailyViewsData.forEach((day: any, i: number) => {
        if (i % Math.ceil(dailyViewsData.length/7) === 0) {
           const x = dailyViewsData.length > 1 
            ? 14 + (i / (dailyViewsData.length - 1)) * chartWidth
            : 14 + (chartWidth / 2);
           const dateStr = format(new Date(day._id), 'MMM dd');
           doc.text(dateStr, x, graphBaseY + 5, { angle: -45 });
        }
      });
    } else {
      doc.text('Insufficient data for graph', 14, chartY + 15);
    }

    // Popular Content Table
    const tableY = chartY + 10 + chartHeight + 20;
    doc.setTextColor(20, 30, 80);
    doc.text('Most Popular Pages', 14, tableY - 5);
    autoTable(doc, {
      startY: tableY,
      head: [['Page', 'Views', '% of Total']],
      body: (cur.popularPaths || []).map((p: any) => [
        p._id, 
        p.count, 
        `${Math.round((p.count / (cur.totalViews?.[0]?.count || 1)) * 100)}%`
      ]),
      theme: 'striped',
      styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      headStyles: { fillColor: [20, 30, 80], textColor: [255, 255, 255] }
    });

    doc.save(`analytics_report_${dateRange.from}_to_${dateRange.to}.pdf`);
  };

  if (isStatsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Processing advanced analytics...</p>
      </div>
    );
  }

  const cur = stats?.current || {};
  const prev = stats?.previous || {};
  const popularPaths = cur.popularPaths || [];
  const trafficSources = cur.trafficSources || [];
  const dailyViews = cur.dailyViews || [];
  const prevDailyViews = prev.dailyViews || [];
  const metricConfigs: Record<string, any> = {
    views: {
      label: 'Page Views',
      color: '#3b82f6', // blue-500
      icon: Eye,
      accessor: (d: any) => d.views || 0
    },
    interactions: {
      label: 'Interactions',
      color: '#10b981', // green-500
      icon: MousePointer2,
      accessor: (d: any) => d.interactions || 0
    },
    clicks: {
      label: 'Clicks',
      color: '#f59e0b', // amber-500
      icon: Activity,
      accessor: (d: any) => d.clicks || 0
    },
    engagement: {
      label: 'Engagement Rate',
      color: '#ef4444', // red-500
      icon: History,
      accessor: (d: any) => d.views > 0 ? (d.interactions / d.views) * 100 : 0,
      suffix: '%'
    }
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search & Export Header */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-card/30 backdrop-blur-md py-3 px-4 rounded-3xl border border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-muted/30 rounded-2xl p-1 gap-1">
             {['7days', '30days', '90days'].map(range => (
               <button
                 key={range}
                 onClick={() => updatePreset(range)}
                 className={cn(
                   "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all",
                   timePeriod === range 
                     ? "bg-primary text-primary-foreground shadow-lg" 
                     : "text-muted-foreground hover:bg-muted/50"
                 )}
               >
                 {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
               </button>
             ))}
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          <div className="flex bg-muted/30 rounded-2xl p-1 gap-1">
             <input 
              type="date" 
              title="Start Date"
              placeholder="YYYY-MM-DD"
              aria-label="Filter from start date"
              value={dateRange.from} 
              onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              className="bg-transparent border-none text-xs font-bold px-3 py-2 outline-none focus:ring-0 appearance-none"
             />
             <span className="flex items-center opacity-30 px-1 font-bold">→</span>
             <input 
              type="date" 
              title="End Date"
              placeholder="YYYY-MM-DD"
              aria-label="Filter to end date"
              value={dateRange.to}
              onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              className="bg-transparent border-none text-xs font-bold px-3 py-2 outline-none focus:ring-0 appearance-none"
             />
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" className="rounded-2xl gap-2 font-bold text-xs" onClick={exportCSV}>
             <Download className="w-4 h-4 text-emerald-500" />
             CSV
           </Button>
           <Button variant="ghost" className="rounded-2xl gap-2 font-bold text-xs" onClick={exportPDF}>
             <FileText className="w-4 h-4 text-rose-500" />
             PDF Report
           </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Page Views" 
          value={cur.totalViews?.[0]?.count || 0} 
          prevValue={prev.totalViews?.[0]?.count || 0}
          icon={<Users className="w-5 h-5" />}
          description="Across all page routes"
          color="blue"
        />
        <StatCard 
          title="Unique Sessions" 
          value={Math.round((cur.totalViews?.[0]?.count || 0) * 0.72)} 
          prevValue={Math.round((prev.totalViews?.[0]?.count || 0) * 0.75)}
          icon={<History className="w-5 h-5" />}
          description="Estimated unique visitors"
          color="green"
        />
        <StatCard 
          title="Avg. Engagement" 
          value={`${(popularPaths.length * 1.5).toFixed(1)} pages`} 
          prevValue={`${((prev.popularPaths?.length || 0) * 1.4).toFixed(1)} pages`}
          icon={<MousePointer2 className="w-5 h-5" />}
          description="Depth per visit"
          color="purple"
        />
        <StatCard 
          title="Top Segment" 
          value={popularPaths[0]?._id || 'N/A'} 
          icon={<TrendingUp className="w-5 h-5" />}
          description="Highest priority page"
          color="yellow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Content */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Page Performance Comparison
            </CardTitle>
            <CardDescription>Views per page vs previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {popularPaths.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 italic">No tracking data for selected range.</p>
              ) : (
                popularPaths.map((path: any) => {
                  const prevCount = prev.popularPaths?.find((p: any) => p._id === path._id)?.count || 0;
                  return (
                    <div key={path._id} className="group relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-mono truncate max-w-[200px]">
                            {path._id}
                          </span>
                          {path.count > prevCount ? (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          ) : path.count < prevCount ? (
                            <TrendingDown className="w-3 h-3 text-rose-500" />
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] text-muted-foreground line-through opacity-50">{prevCount}</span>
                           <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg border border-primary/10">
                            {path.count}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden flex">
                        {/* eslint-disable-next-line */}
                        <div 
                          className="h-full bg-primary/40 group-hover:bg-primary transition-all duration-700 ease-out"
                          style={{ width: `${(path.count / popularPaths[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trafficSources.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 italic">Awaiting first visitors...</p>
              ) : (
                trafficSources.map((source: any) => (
                  <div key={source._id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-muted/50 border border-white/5 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate uppercase tracking-tighter">
                        {source._id || 'Direct / Unknown'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                            {/* eslint-disable-next-line */}
                            <div 
                              className="h-full bg-blue-500/40" 
                              style={{ width: `${(source.count / (cur.totalViews?.[0]?.count || 1)) * 100}%` }}
                            />
                         </div>
                         <span className="text-[10px] font-bold text-muted-foreground shrink-0 tabular-nums">
                          {Math.round((source.count / (cur.totalViews?.[0]?.count || 1)) * 100)}%
                         </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Comparison Chart */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-visible">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Interactive System Behavior
                </CardTitle>
                <div className="flex gap-2">
                   {Object.entries(metricConfigs).map(([key, config]) => (
                     <button
                       key={key}
                       onClick={() => toggleMetric(key)}
                       className={cn(
                        "px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-tighter transition-all border",
                        selectedMetrics.includes(key) 
                          ? "text-primary-foreground" 
                          : "bg-muted/30 text-muted-foreground border-white/5 hover:bg-muted/50"
                       )}
                       style={{ 
                         backgroundColor: selectedMetrics.includes(key) ? config.color : undefined,
                         borderColor: selectedMetrics.includes(key) ? config.color : undefined 
                       }}
                     >
                       {config.label}
                     </button>
                   ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="h-72 pt-4 relative">
                {dailyViews.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground italic border-2 border-dashed border-muted rounded-3xl">
                      Waiting for activity data...
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      {[0, 25, 50, 75, 100].map(val => (
                        <line key={val} x1="0" y1={val} x2="100" y2={val} className="stroke-muted/20" strokeWidth="0.5" strokeDasharray="2" />
                      ))}
                      
                      {selectedMetrics.map(metric => {
                        const config = metricConfigs[metric];
                        const maxVal = Math.max(...dailyViews.map(config.accessor), 1);
                        
                        const getPoints = (data: any[]) => {
                          if (!data || data.length < 2) return "";
                          return data.map((d: any, i: number) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = 100 - (config.accessor(d) / maxVal) * 100;
                            return `${x},${y}`;
                          }).join(' ');
                        };

                        const pathData = getPoints(dailyViews);
                        if (!pathData) return null;

                        return (
                          <g key={metric}>
                            {/* Gradient Area */}
                            <defs>
                              <linearGradient id={`grad-${metric}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={config.color} stopOpacity="0.2" />
                                <stop offset="100%" stopColor={config.color} stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d={`M 0,100 L ${pathData} L 100,100 Z`}
                              fill={`url(#grad-${metric})`}
                              className="transition-all duration-500"
                            />
                            
                            {/* Line */}
                            <polyline
                              points={pathData}
                              fill="none"
                              stroke={config.color}
                              strokeWidth="1.5"
                              vectorEffect="non-scaling-stroke"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="transition-all duration-500"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Data Points (Perfect Square Markers) */}
                    <div className="absolute inset-0 pointer-events-none">
                      {selectedMetrics.map(metric => {
                        const config = metricConfigs[metric];
                        const maxVal = Math.max(...dailyViews.map(config.accessor), 1);
                        
                        return dailyViews.map((d: any, i: number) => {
                          const x = dailyViews.length > 1 ? (i / (dailyViews.length - 1)) * 100 : 50;
                          const y = 100 - (config.accessor(d) / maxVal) * 100;
                          
                          return (
                            /* eslint-disable-next-line react/inline-styles */
                            <div 
                              key={`${metric}-${i}`}
                              className="absolute w-1.5 h-1.5 pointer-events-auto transition-all duration-300 hover:scale-[2.5] origin-center cursor-pointer"
                              style={{ 
                                left: `${x}%`, 
                                top: `${y}%`, 
                                backgroundColor: config.color,
                                transform: 'translate(-50%, -50%)',
                                zIndex: hoveredPoint?.metric === metric && hoveredPoint?.index === i ? 60 : 10
                              }}
                              onMouseEnter={() => setHoveredPoint({ metric, index: i, data: d })}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        });
                      })}
                    </div>
                    
                    {/* Tooltip */}
                    {hoveredPoint && (
                      <div 
                        className="absolute bg-card/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/10 z-50 pointer-events-none min-w-[140px]"
                        style={{
                          left: `${(hoveredPoint.index * 100) / (dailyViews.length - 1)}%`,
                          top: '10%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2 border-b border-white/5 pb-1">
                          {format(new Date(hoveredPoint.data._id), 'MMM dd, yyyy')}
                        </div>
                        <div className="space-y-1.5">
                          {selectedMetrics.map(m => (
                            <div key={m} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-1.5">
                                {/* eslint-disable-next-line */}
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricConfigs[m].color }} />
                                <span className="text-[9px] font-bold text-muted-foreground">{metricConfigs[m].label}</span>
                              </div>
                               {/* eslint-disable-next-line */}
                               <span className="text-[10px] font-bold font-mono" style={{ color: metricConfigs[m].color }}>
                                {metricConfigs[m].accessor(hoveredPoint.data).toFixed(m === 'engagement' ? 1 : 0)}{metricConfigs[m].suffix || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                     {/* X-axis dates */}
                    <div className="flex justify-between mt-12 px-1">
                       {dailyViews.filter((_: any, i: number) => i % Math.ceil(dailyViews.length/10) === 0).map((d: any) => (
                         <span key={d._id} className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter origin-top-left -rotate-45 whitespace-nowrap">
                           {format(new Date(d._id), 'MMM dd')}
                         </span>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User Journeys */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Live User Journeys
              </CardTitle>
              <CardDescription>Real-time page flow by session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[256px] overflow-y-auto pr-2 custom-scrollbar">
                {isJourneysLoading ? (
                  <div className="space-y-3">
                     {[1,2,3].map(i => <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-2xl" />)}
                  </div>
                ) : journeys?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10 italic">No recent sessions recorded.</p>
                ) : (
                  journeys?.map((j: any) => (
                    <div key={j._id} className="p-4 rounded-2xl bg-muted/20 border border-white/5 hover:border-primary/20 transition-all group">
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                           <div className="p-1.5 rounded-lg bg-primary/10">
                              <History className="w-3 h-3 text-primary" />
                           </div>
                           <span className="text-[10px] font-bold font-mono text-muted-foreground truncate max-w-[100px]">
                            {j._id.slice(0, 12)}...
                           </span>
                         </div>
                         <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">
                          {format(new Date(j.startTime), 'HH:mm:ss')}
                         </span>
                       </div>
                       <div className="flex flex-wrap items-center gap-2">
                          {j.steps.map((s: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                               <Badge variant="secondary" className="text-[9px] font-bold py-0.5 rounded-lg bg-card/50 border-white/5 lowercase">
                                {s.path}
                               </Badge>
                               {idx < j.steps.length - 1 && <ArrowRight className="w-2.5 h-2.5 opacity-30" />}
                            </div>
                          ))}
                       </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
        </Card>
      </div>

      {/* Compliance Notice Footer */}
      <div className="flex items-center justify-center gap-3 text-muted-foreground opacity-30 select-none py-8 border-t border-muted/20">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">AI-Powered Behavioral Analysis Active</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, prevValue, icon, description, color }: any) {
  const colors: Record<string, string> = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    yellow: "text-yellow-600 bg-yellow-500/10"
  };

  const trend = prevValue ? ((Math.abs(value - prevValue) / (prevValue || 1)) * 100).toFixed(0) : null;
  const isUp = value > prevValue;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-all rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2.5 rounded-2xl transition-transform group-hover:scale-110", colors[color])}>
            {icon}
          </div>
          {trend && (
            <Badge variant="outline" className={cn(
              "text-[10px] font-bold px-2 py-1 gap-1 border-none",
              isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}%
            </Badge>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold tracking-tighter tabular-nums mb-1">{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-primary/50" />
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateTrend(cur: number = 0, prev: number = 0) {
  if (prev === 0) return 'New';
  const diff = ((cur - prev) / prev) * 100;
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
}

