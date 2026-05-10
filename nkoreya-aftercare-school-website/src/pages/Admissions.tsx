import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, UserPlus, CheckCircle, Calendar, Phone, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

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
      </main>
      <Footer />
    </div>
  );
};

export default Admissions;
