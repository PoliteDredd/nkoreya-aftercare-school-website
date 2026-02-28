import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ArrowLeft, User, Users, School, Heart, FileText, Clock, CheckCircle,
  XCircle, AlertCircle, MessageSquare, Download, Send, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

type ApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted' | 'more_info_requested';

interface Application {
  id: string;
  user_id: string;
  student_first_name: string;
  student_last_name: string;
  student_date_of_birth: string;
  student_gender: string | null;
  applying_for_grade: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_phone: string;
  parent_relationship: string;
  address: string;
  city: string;
  postal_code: string | null;
  secondary_guardian_name: string | null;
  secondary_guardian_phone: string | null;
  secondary_guardian_relationship: string | null;
  previous_school_name: string | null;
  previous_school_address: string | null;
  previous_grade_completed: string | null;
  reason_for_leaving: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  medications: string | null;
  special_needs: string | null;
  emergency_contact_1_name: string;
  emergency_contact_1_phone: string;
  emergency_contact_1_relationship: string;
  emergency_contact_2_name: string | null;
  emergency_contact_2_phone: string | null;
  emergency_contact_2_relationship: string | null;
  status: ApplicationStatus;
  status_message: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminNote {
  id: string;
  note: string;
  created_at: string;
  admin_id: string;
}

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  waitlisted: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-700', icon: Clock },
  more_info_requested: { label: 'More Info Requested', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
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

export default function AdminApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
      fetchNotes();
      fetchDocuments();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error('Application not found');
        navigate('/admin/dashboard');
        return;
      }
      setApplication(data as Application);
      setStatusMessage(data.status_message || '');
    } catch (error) {
      toast.error('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('application_notes')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });
    if (data) setNotes(data as AdminNote[]);
  };

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('application_documents')
      .select('*')
      .eq('application_id', id);
    if (data) setDocuments(data as Document[]);
  };

  const updateStatus = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    setUpdating(true);

    try {
      // For temporary admin bypass, we need to use the service role or disable RLS temporarily
      // First, let's try to update with the current user
      let updateError: any = null;
      
      try {
        const { error } = await supabase
          .from('applications')
          .update({
            status: newStatus,
            status_message: statusMessage || null,
            reviewed_by: user?.id || null,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', application.id);
        
        updateError = error;
      } catch (err) {
        updateError = err;
      }

      if (updateError) {
        // If RLS blocks us, show a helpful error message
        if (updateError.message?.includes('row-level security')) {
          toast.error('Admin permissions required. Please set up a proper admin user in the database.');
          console.error('RLS Error: You need to create a real admin user. See setup-real-admin.sql');
          return;
        } else {
          throw updateError;
        }
      }

      // Add to status history (if user exists)
      if (user) {
        await supabase.from('application_status_history').insert({
          application_id: application.id,
          old_status: application.status,
          new_status: newStatus,
          changed_by: user.id,
          message: statusMessage || null,
        });
      }

      // Create notification for applicant
      const notificationMessages: Record<ApplicationStatus, { title: string; message: string }> = {
        under_review: {
          title: 'Application Under Review',
          message: `Your application for ${application.student_first_name} is now being reviewed by our admissions team.`,
        },
        approved: {
          title: 'Congratulations! Application Approved',
          message: `We are pleased to inform you that ${application.student_first_name}'s application has been approved. Welcome to Bright Future Primary School!`,
        },
        rejected: {
          title: 'Application Update',
          message: `We regret to inform you that ${application.student_first_name}'s application was not approved at this time.`,
        },
        waitlisted: {
          title: 'Application Waitlisted',
          message: `${application.student_first_name}'s application has been placed on our waitlist. We will contact you if a spot becomes available.`,
        },
        more_info_requested: {
          title: 'Additional Information Required',
          message: `We need additional information for ${application.student_first_name}'s application. Please check your dashboard for details.`,
        },
        submitted: {
          title: 'Application Received',
          message: `Your application has been received.`,
        },
      };

      const notif = notificationMessages[newStatus];
      
      // Create in-app notification
      try {
        console.log('Creating notification for user:', application.user_id);
        console.log('Notification data:', {
          user_id: application.user_id,
          title: notif.title,
          message: statusMessage || notif.message,
          type: 'status_change',
          application_id: application.id,
        });
        
        const { error: notifError } = await supabase.from('notifications').insert({
          user_id: application.user_id,
          title: notif.title,
          message: statusMessage || notif.message,
          type: 'status_change',
          application_id: application.id,
        });
        
        if (notifError) {
          console.error('Failed to create notification:', notifError);
          toast.error('Failed to create notification: ' + notifError.message);
        } else {
          console.log('In-app notification created successfully');
          toast.success('Notification sent to parent');
        }
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        toast.error('Error creating notification');
      }

      // Trigger email notification via edge function (optional)
      try {
        await supabase.functions.invoke('send-status-notification', {
          body: {
            applicationId: application.id,
            newStatus,
            parentEmail: application.parent_email,
            studentName: `${application.student_first_name} ${application.student_last_name}`,
            message: statusMessage || notif.message,
          },
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.log('Email notification failed (this is expected if function is not deployed):', emailError);
        // Email notification failed silently - in-app notification still delivered
      }

      toast.success(`Status updated to ${statusConfig[newStatus].label}`);
      fetchApplication();
    } catch (error: any) {
      toast.error('Failed to update status: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !user) return;

    try {
      await supabase.from('application_notes').insert({
        application_id: id,
        admin_id: user.id,
        note: newNote,
      });
      setNewNote('');
      fetchNotes();
      toast.success('Note added');
    } catch (error: any) {
      toast.error('Failed to add note: ' + error.message);
    }
  };

  const downloadDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('application-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('Failed to download: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) return null;

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-display text-slate-900">
                  {application.student_first_name} {application.student_last_name}
                </h1>
                <p className="text-sm text-slate-500">
                  Application for {gradeLabels[application.applying_for_grade]}
                </p>
              </div>
            </div>
            <Badge className={config.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                Student Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-medium">{application.student_first_name} {application.student_last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date of Birth</p>
                  <p className="font-medium">{format(new Date(application.student_date_of_birth), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="font-medium capitalize">{application.student_gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Applying for Grade</p>
                  <p className="font-medium">{gradeLabels[application.applying_for_grade]}</p>
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                Parent/Guardian Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-medium">{application.parent_first_name} {application.parent_last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Relationship</p>
                  <p className="font-medium capitalize">{application.parent_relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{application.parent_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-medium">{application.parent_phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-medium">{application.address}, {application.city} {application.postal_code}</p>
                </div>
              </div>

              {application.secondary_guardian_name && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-slate-700 mb-2">Secondary Guardian</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-medium">{application.secondary_guardian_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{application.secondary_guardian_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Relationship</p>
                      <p className="font-medium">{application.secondary_guardian_relationship}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Previous School */}
            {application.previous_school_name && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <School className="w-5 h-5 text-primary" />
                  Previous School
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">School Name</p>
                    <p className="font-medium">{application.previous_school_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Grade Completed</p>
                    <p className="font-medium">{application.previous_grade_completed || 'N/A'}</p>
                  </div>
                  {application.previous_school_address && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium">{application.previous_school_address}</p>
                    </div>
                  )}
                  {application.reason_for_leaving && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-slate-500">Reason for Leaving</p>
                      <p className="font-medium">{application.reason_for_leaving}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medical & Emergency */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                Medical & Emergency Information
              </h2>
              <div className="space-y-4">
                {application.medical_conditions && (
                  <div>
                    <p className="text-sm text-slate-500">Medical Conditions</p>
                    <p className="font-medium">{application.medical_conditions}</p>
                  </div>
                )}
                {application.allergies && (
                  <div>
                    <p className="text-sm text-slate-500">Allergies</p>
                    <p className="font-medium">{application.allergies}</p>
                  </div>
                )}
                {application.medications && (
                  <div>
                    <p className="text-sm text-slate-500">Current Medications</p>
                    <p className="font-medium">{application.medications}</p>
                  </div>
                )}
                {application.special_needs && (
                  <div>
                    <p className="text-sm text-slate-500">Special Needs</p>
                    <p className="font-medium">{application.special_needs}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-slate-700 mb-3">Emergency Contacts</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">Contact 1</p>
                      <p className="font-medium">{application.emergency_contact_1_name}</p>
                      <p className="text-sm">{application.emergency_contact_1_phone}</p>
                      <p className="text-sm text-slate-500">{application.emergency_contact_1_relationship}</p>
                    </div>
                    {application.emergency_contact_2_name && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm text-slate-500">Contact 2</p>
                        <p className="font-medium">{application.emergency_contact_2_name}</p>
                        <p className="text-sm">{application.emergency_contact_2_phone}</p>
                        <p className="text-sm text-slate-500">{application.emergency_contact_2_relationship}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {documents.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  Uploaded Documents
                </h2>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{doc.file_name}</p>
                        <p className="text-xs text-slate-500 capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            {isAdmin && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="font-semibold text-slate-900 mb-4">Update Status</h2>
                
                <div className="mb-4">
                  <Label className="text-sm">Message to Applicant (Optional)</Label>
                  <Textarea
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Add a message that will be sent to the parent..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => updateStatus('under_review')}
                    disabled={updating || application.status === 'under_review'}
                    variant="outline"
                    size="sm"
                    className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />}
                    Review
                  </Button>
                  <Button
                    onClick={() => updateStatus('approved')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 border-green-200"
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                    Accept
                  </Button>
                  <Button
                    onClick={() => updateStatus('rejected')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 border-red-200"
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <XCircle className="w-4 h-4 mr-1 text-red-600" />}
                    Reject
                  </Button>
                  <Button
                    onClick={() => updateStatus('waitlisted')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="bg-purple-50 hover:bg-purple-100 border-purple-200"
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Clock className="w-4 h-4 mr-1 text-purple-600" />}
                    Waitlist
                  </Button>
                  <Button
                    onClick={() => updateStatus('more_info_requested')}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="col-span-2 bg-orange-50 hover:bg-orange-100 border-orange-200"
                  >
                    {updating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <AlertCircle className="w-4 h-4 mr-1 text-orange-600" />}
                    Request More Info
                  </Button>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                Internal Notes
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Notes are only visible to staff members
              </p>

              {isAdmin && (
                <div className="mb-4">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="mb-2"
                  />
                  <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
                    <Send className="w-4 h-4 mr-1" />
                    Add Note
                  </Button>
                </div>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(note.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                Timeline
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Submitted</p>
                  <p className="font-medium">{format(new Date(application.created_at), 'MMMM d, yyyy h:mm a')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Last Updated</p>
                  <p className="font-medium">{format(new Date(application.updated_at), 'MMMM d, yyyy h:mm a')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
