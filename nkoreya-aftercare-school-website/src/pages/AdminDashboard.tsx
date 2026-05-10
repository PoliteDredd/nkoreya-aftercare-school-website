import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, FileText, Bell, Settings, LogOut, Search,
  Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Eye, Calendar,
  Filter, Download, MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'more_info_requested';

interface Application {
  id: string;
  student_first_name: string;
  student_last_name: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  applying_for_grade: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  waitlisted: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-700', icon: Clock },
  more_info_requested: { label: 'More Info', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

const gradeLabels: Record<string, string> = {
  pre_k: 'Pre-K',
  kindergarten: 'Kindergarten',
  grade_1: 'Grade 1',
  grade_2: 'Grade 2',
  grade_3: 'Grade 3',
  grade_4: 'Grade 4',
  grade_5: 'Grade 5',
  grade_6: 'Grade 6',
};

export default function AdminDashboard() {
  const { user, signOut, isAdmin, isPrincipal } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
    subscribeToUpdates();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as Application[]);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
  .channel("admin-applications")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "applications",
    },
    payload => {
      console.log(payload)
    }
  )
  .subscribe()


    return () => supabase.removeChannel(channel);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      `${app.student_first_name} ${app.student_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parent_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || app.applying_for_grade === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                <FileText className="w-5 h-5" />
                Applications
              </Link>
            </li>
            <li>
              <Link
                to="/admin/inquiries"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                <MessageSquare className="w-5 h-5" />
                Inquiries
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-slate-400">{isAdmin ? 'Admin' : 'Principal'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display text-slate-900">Applications Dashboard</h2>
              <p className="text-slate-500 text-sm">Manage student admission applications</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Total Applications</span>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Pending Review</span>
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Approved</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm">Rejected</span>
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by student name or parent email..."
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
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="more_info_requested">More Info Requested</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Object.entries(gradeLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Student</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Parent</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Grade</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const config = statusConfig[app.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {app.student_first_name} {app.student_last_name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900">
                            {app.parent_first_name} {app.parent_last_name}
                          </p>
                          <p className="text-slate-500 text-sm">{app.parent_email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700">
                            {gradeLabels[app.applying_for_grade] || app.applying_for_grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {format(new Date(app.created_at), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/applications/${app.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Link>
                          </Button>
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
