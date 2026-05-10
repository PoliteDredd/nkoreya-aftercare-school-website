import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { user, isAdmin, isPrincipal, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for password reset success parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'success') {
      toast.success('Password reset successful! You can now log in with your new password.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (user && (isAdmin || isPrincipal)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, isPrincipal, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', formData.email);
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Invalid credentials. Please contact your administrator.');
      } else {
        console.log('Login successful, checking roles...');
        // Check if user has admin/principal role after successful login
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('User found:', user.email);
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);
          
          console.log('User roles:', roles);
          const hasAdminRole = roles?.some(r => r.role === 'admin' || r.role === 'principal');
          
          if (hasAdminRole) {
            toast.success('Welcome to the Admin Portal');
            navigate('/admin/dashboard', { replace: true });
          } else {
            toast.error('Access denied. You do not have admin privileges.');
            await supabase.auth.signOut();
          }
        }
      }
    } catch (err) {
      console.error('Login exception:', err);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim() || !z.string().email().safeParse(resetEmail).success) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/login?reset=success`,
      });
      
      if (error) {
        toast.error('Failed to send reset email. Please try again.');
      } else {
        toast.success('Password reset email sent! Check your inbox and follow the link to reset your password.');
        setShowResetPassword(false);
        setResetEmail('');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display text-foreground mb-2">
                Reset Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-sm font-medium">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-6 rounded-xl" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display text-foreground mb-2">
              Staff Portal
            </h1>
            <p className="text-muted-foreground text-sm">
              Nkoreya Tutoring Services
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@brightfuture.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 rounded-xl"
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 rounded-xl"
                />
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full mt-6 rounded-xl" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to School Website
            </a>
          </div>
        </div>

        {/* Notice */}
        <p className="text-center text-slate-400 text-xs mt-6">
          Admin accounts are created by school administration.<br />
          Contact IT support if you need access.
        </p>
      </div>
    </div>
  );
}
