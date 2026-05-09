import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Bell, Clock, CheckCircle, XCircle, AlertCircle, PlusCircle,
  ChevronRight, User, Calendar, GraduationCap, LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'more_info_requested';

interface Application {
  id: string;
  student_first_name: string;
  student_last_name: string;
  applying_for_grade: string;
  status: ApplicationStatus;
  status_message: string | null;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  waitlisted: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-700', icon: Clock },
  more_info_requested: { label: 'More Info Needed', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
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

export default function ParentDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchData = async () => {
  if (!user?.id) return;

  try {
    const [appsResult, notifResult] = await Promise.all([
      supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),

      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (appsResult.data) setApplications(appsResult.data as Application[]);
    if (notifResult.data) setNotifications(notifResult.data as Notification[]);

  } catch (error) {
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          toast.info(newNotif.title, { description: newNotif.message });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display text-foreground mb-1">My Dashboard</h1>
              <p className="text-muted-foreground">Track your admission applications</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <Button variant="hero" asChild>
                <Link to="/apply">
                  <PlusCircle className="w-4 h-4" />
                  New Application
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Applications
              </h2>
              
              {loading ? (
                <div className="bg-card rounded-2xl p-8 text-center">
                  <div className="animate-pulse text-muted-foreground">Loading...</div>
                </div>
              ) : applications.length === 0 ? (
                <div className="bg-card rounded-2xl p-8 text-center">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Start your child's journey at Bright Future Primary School
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/apply">Submit Application</Link>
                  </Button>
                </div>
              ) : (
                applications.map((app) => {
                  const config = statusConfig[app.status];
                  const StatusIcon = config.icon;
                  return (
                    <div
                      key={app.id}
                      className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {app.student_first_name} {app.student_last_name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Applying for {gradeLabels[app.applying_for_grade] || app.applying_for_grade}
                          </p>
                        </div>
                        <Badge className={config.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>

                      {app.status_message && (
                        <div className="bg-muted/50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-foreground">{app.status_message}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Submitted {format(new Date(app.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Updated {format(new Date(app.updated_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
                )}
              </h2>

              <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.slice(0, 5).map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                          !notif.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-primary' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm">{notif.title}</h4>
                            <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{notif.message}</p>
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {format(new Date(notif.created_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-primary to-lavender rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-display text-lg mb-2">Need Help?</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Our admissions team is ready to assist you with any questions.
                </p>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/contact">
                    Contact Us
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
