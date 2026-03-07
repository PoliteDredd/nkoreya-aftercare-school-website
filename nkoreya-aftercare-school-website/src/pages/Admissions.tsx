import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, FileText, UserPlus, CheckCircle, Calendar, Phone, ArrowRight, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  {
    icon: ClipboardList,
    title: "Submit Inquiry",
    description: "Fill out our online inquiry form or contact our admissions office to express your interest.",
  },
  {
    icon: Calendar,
    title: "Schedule a Tour",
    description: "Visit our campus to see our facilities, meet teachers, and experience the Bright Future environment.",
  },
  {
    icon: FileText,
    title: "Complete Application",
    description: "Submit the required documents including application form, birth certificate, and previous records.",
  },
  {
    icon: UserPlus,
    title: "Student Assessment",
    description: "Your child will participate in an age-appropriate assessment to understand their learning needs.",
  },
  {
    icon: CheckCircle,
    title: "Enrollment Decision",
    description: "Receive your acceptance letter and complete enrollment by paying fees and submitting final documents.",
  },
];

const Admissions = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    childName: "",
    gradeApplying: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert({
          parent_name: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          child_name: formData.childName,
          grade_applying: formData.gradeApplying,
          message: formData.message || null,
          status: 'new'
        });

      if (error) {
        console.error('Error submitting inquiry:', error);
        toast.error('Failed to submit inquiry. Please try again.');
      } else {
        toast.success("Thank you for your inquiry! We'll contact you within 24 hours.");
        setFormData({ 
          parentName: "", 
          email: "", 
          phone: "", 
          childName: "", 
          gradeApplying: "", 
          message: "" 
        });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-grass-light via-background to-sky-light relative overflow-hidden">
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Admissions
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                Begin Your Child's Journey to a <span className="text-gradient">Nkoreya Tutoring</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We're thrilled you're considering Nkoreya After-care Tutoring Services. Our admissions process is designed to be welcoming and straightforward.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4" />
                    Apply Online
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+15551234567">
                    <Phone className="w-4 h-4" />
                    Call Admissions
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Already have an account? <Link to="/auth" className="text-primary hover:underline font-medium">Sign in to track your application</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Enrollment Steps */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Process
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Enrollment <span className="text-gradient">Steps</span>
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shrink-0">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-4" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-primary">Step {index + 1}</span>
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry-form" className="py-20 bg-background scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Form */}
              <div>
                <div className="text-center mb-8">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Get Started
                  </span>
                  <h2 className="text-3xl font-display text-foreground mb-6">Submit an Inquiry</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Parent/Guardian Name *</label>
                      <Input
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Your full name"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Child's Name *</label>
                      <Input
                        required
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        placeholder="Child's full name"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Grade Applying For *</label>
                    <Input
                      required
                      value={formData.gradeApplying}
                      onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                      placeholder="e.g., Kindergarten, Grade 1"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Additional Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any questions or additional information..."
                      className="rounded-xl min-h-[120px]"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admissions;
