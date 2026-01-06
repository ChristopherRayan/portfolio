'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  History, 
  Clock, 
  User as UserIcon, 
  Tag, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Trash2,
  Edit,
  PlusCircle,
  LogIn,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AuditLogEntry {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'PROJECT' | 'BLOG' | 'SKILL' | 'SERVICE' | 'PROFILE' | 'CONTACT' | 'USER';
  entityId?: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'UPDATE': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'DELETE': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'LOGIN': return <LogIn className="h-4 w-4 text-indigo-500" />;
      case 'LOGOUT': return <LogOut className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'PROJECT': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'BLOG': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'SKILL': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'SERVICE': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'PROFILE': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            System Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            A comprehensive record of all system modifications and security events.
          </p>
        </div>
        
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
          <History className="h-10 w-10 text-primary opacity-50" />
          <div>
            <div className="text-2xl font-black text-primary">{logs.length}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Total Events Tracked</div>
          </div>
        </div>
      </div>

      <Card className="border-muted/50 overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b border-muted/50 bg-muted/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by details, entity, or user..." 
              className="pl-10 h-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-tighter py-1">
              Showing {filteredLogs.length} events
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 py-4">Action</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 py-4">Entity</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 py-4">Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 py-4">Performed By</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-6 py-4 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={6} className="h-16 bg-muted/5"></TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No audit logs found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow 
                    key={log._id} 
                    className="group hover:bg-muted/30 cursor-pointer transition-colors border-muted/30"
                    onClick={() => setExpandedId(expandedId === log._id ? null : log._id)}
                  >
                    <TableCell className="px-6">
                      {expandedId === log._id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                        {getActionIcon(log.action)}
                        {log.action}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={`text-[10px] font-black uppercase ${getEntityColor(log.entity)}`}>
                        {log.entity}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-sm truncate max-w-[300px]">
                      {log.details}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        {log.performedBy}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-xs font-black text-foreground">
                          <Clock className="h-3 w-3 text-primary" />
                          {format(new Date(log.timestamp), 'HH:mm:ss')}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-widest">
                          {format(new Date(log.timestamp), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Compliance Notice Footer */}
      <div className="flex items-center justify-center gap-3 text-muted-foreground opacity-50 select-none py-8 border-t border-muted/20">
        <ShieldCheck className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Audit & Compliance Engine Active</span>
      </div>
    </div>
  );
}
