import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, Award, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-children.jpeg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-light via-background to-sunshine-light" />
      <div className="absolute top-32 left-10 w-32 h-32 bg-sunshine/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-grass/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-sunshine/20 rounded-full px-4 py-2 text-sm font-medium text-foreground animate-bounce-soft">
              <Star className="w-4 h-4 text-sunshine fill-sunshine" />
              <span>Rated #1 After-care tutoring service in the District</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground leading-tight">
              Shaping Young Minds for a Bright Fucture at{" "}
              <span className="text-gradient">Nkoreya After-care Services</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              At Nkoreya Tutoring, we nurture curiosity, inspire creativity, and build the foundation for lifelong learning in a warm and supportive environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/admissions" className="group">
                  Start Enrollment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/about" className="group">
                  <Play className="w-5 h-5 fill-primary" />
                  Watch Our Story
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              {[
                { icon: Users, value: "25", label: "Happy Students" },
                { icon: Award, value: "2+", label: "Years of Excellence" },
                { icon: BookOpen, value: "90%", label: "Success Rate" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl md:text-3xl font-display text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Happy students at Nkoreya Tutoring"
                className="w-full rounded-3xl shadow-2xl animate-fade-in"
              />
              {/* Floating Cards */}
              <div className="absolute -left-6 top-1/4 bg-card p-4 rounded-2xl shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-grass-light flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-grass" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Learn & Grow</p>
                    <p className="text-sm text-muted-foreground">Every Day</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 bg-card p-4 rounded-2xl shadow-card animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sunshine-light flex items-center justify-center">
                    <Star className="w-6 h-6 text-sunshine" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">5-Star Rating</p>
                    <p className="text-sm text-muted-foreground">By Parents</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decorations */}
            <div className="absolute -z-10 -top-8 -right-8 w-full h-full bg-primary/10 rounded-3xl" />
            <div className="absolute -z-20 -top-16 -right-16 w-full h-full bg-secondary/20 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
