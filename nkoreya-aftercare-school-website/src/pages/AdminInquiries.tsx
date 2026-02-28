import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  LayoutDashboard, MessageSquare, Search, Filter, Eye, Reply, Clock, 
  CheckCircle, XCircle, AlertCircle, ArrowLeft, Send, Phone, Mail, User, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

type InquiryStatus = 'new' | 'in_progress' | 'responded' | 'closed';

interface Inquiry {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  child_name: string;
  grade_applying: string;
  message: string | null;
  status: InquiryStatus;
  admin_response: string | null;
  responded_by: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<InquiryStatus, { label: string; color: string; icon: any }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  responded: { label: 'Responded', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

export default function AdminInquiries() {
  const { user, signOut, isAdmin, isPrincipal } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    fetchInquiries();
    subscribeToUpdates();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data as Inquiry[]);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('admin-inquiries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => fetchInquiries()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: InquiryStatus) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiryId);

      if (error) throw error;
      toast.success(`Inquiry marked as ${statusConfig[newStatus].label.toLowerCase()}`);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update inquiry status');
    }
  };

  const submitResponse = async () => {
    if (!selectedInquiry || !responseText.trim()) return;
    
    setIsResponding(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({
          admin_response: responseText,
          status: 'responded',
          responded_by: user?.id,
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedInquiry.id);

      if (error) throw error;
      
      toast.success('Response sent successfully!');
      setResponseText('');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to send response');
    } finally {
      setIsResponding(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = searchQuery === '' ||
      inquiry.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.child_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="font-display text-xl">Bright Future</h1>
          <p className="text-slate-400 text-sm">Admin Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/inquiries"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground"
              >
                <MessageSquare className="w-5 h-5" />
                Inquiries
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display text-slate-900 mb-2">Inquiries Management</h1>
            <p className="text-slate-600">Manage and respond to parent inquiries</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Total Inquiries</span>
                <MessageSquare className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">New</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.new}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">In Progress</span>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.inProgress}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Responded</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.responded}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by parent name, child name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Parent & Child</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Grade</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => {
                    const config = statusConfig[inquiry.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr key={inquiry.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{inquiry.parent_name}</p>
                            <p className="text-sm text-slate-500">Child: {inquiry.child_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-slate-900">{inquiry.email}</p>
                            <p className="text-slate-500">{inquiry.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700">{inquiry.grade_applying}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(inquiry)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Inquiry Details</DialogTitle>
                                </DialogHeader>
                                {selectedInquiry && (
                                  <div className="space-y-6">
                                    {/* Inquiry Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Parent Name</Label>
                                        <p className="text-sm text-slate-600">{selectedInquiry.parent_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Child Name</Label>
                                        <p className="text-sm text-slate-600">{selectedInquiry.child_name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm text-slate-600">{selectedInquiry.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm text-slate-600">{selectedInquiry.phone}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Grade Applying</Label>
                                        <p className="text-sm text-slate-600">{selectedInquiry.grade_applying}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <Badge className={statusConfig[selectedInquiry.status].color}>
                                          {statusConfig[selectedInquiry.status].label}
                                        </Badge>
                                      </div>
                                    </div>

                                    {selectedInquiry.message && (
                                      <div>
                                        <Label className="text-sm font-medium">Message</Label>
                                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mt-1">
                                          {selectedInquiry.message}
                                        </p>
                                      </div>
                                    )}

                                    {selectedInquiry.admin_response && (
                                      <div>
                                        <Label className="text-sm font-medium">Previous Response</Label>
                                        <p className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg mt-1">
                                          {selectedInquiry.admin_response}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                          Responded on {format(new Date(selectedInquiry.responded_at!), 'MMM d, yyyy h:mm a')}
                                        </p>
                                      </div>
                                    )}

                                    {/* Response Form */}
                                    <div>
                                      <Label className="text-sm font-medium">Send Response</Label>
                                      <Textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Type your response to the parent..."
                                        className="mt-1"
                                        rows={4}
                                      />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                      <Button 
                                        onClick={submitResponse} 
                                        disabled={!responseText.trim() || isResponding}
                                        className="flex-1"
                                      >
                                        <Send className="w-4 h-4 mr-2" />
                                        {isResponding ? 'Sending...' : 'Send Response'}
                                      </Button>
                                      <Select 
                                        value={selectedInquiry.status} 
                                        onValueChange={(value) => updateInquiryStatus(selectedInquiry.id, value as InquiryStatus)}
                                      >
                                        <SelectTrigger className="w-[140px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">New</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="responded">Responded</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}