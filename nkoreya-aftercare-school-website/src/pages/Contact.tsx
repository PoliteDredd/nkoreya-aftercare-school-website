import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Thabang Primary School, Inyoni Road &, Thakadu Rd, Vosloorus Ext 3, Vosloorus, South Africa"],
    color: "bg-sky-light text-sky",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["Main: (+27) 71 798 3248", "Alt: (+27) 68 348 2412"],
    color: "bg-grass-light text-grass",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["mosengela.nkosinathi02@gmail.com", "admissionskatlegongps@lantic.net"],
    color: "bg-sunshine-light text-sunshine",
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday", "09:00 AM - 18:00 PM", "Saturday", "09:00 AM - 12:00 PM"],
    color: "bg-coral-light text-coral",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-lavender-light via-background to-grass-light relative overflow-hidden">
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Contact Us
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                We'd Love to <span className="text-gradient">Hear From You</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions about our school, admissions, or programs? We're here to help. Reach out and our friendly team will get back to you promptly.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 text-center group hover:-translate-y-1">
                  <div className={`w-14 h-14 mx-auto rounded-xl ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <info.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-3">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map & Form Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Map */}
              <div>
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Location
                </span>
                <h2 className="text-3xl font-display text-foreground mb-6">Find Us on the Map</h2>
                <div className="aspect-[4/3] bg-card rounded-3xl shadow-card overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095919355!2d-74.00425878459375!3d40.74076797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629794729807!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="School Location"
                  />
                </div>
                <div className="mt-6 p-4 bg-card rounded-xl shadow-soft flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Nkoreya After-care Tutoring Services</h4>
                    <p className="text-muted-foreground text-sm">Inyoni Road &, Thakadu Rd, Vosloorus Ext 3, Vosloorus, South Africa</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Message Us
                </span>
                <h2 className="text-3xl font-display text-foreground mb-6">Send a Quick Inquiry</h2>
                <form onSubmit={handleSubmit} className="bg-card p-8 rounded-3xl shadow-card space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
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
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="rounded-xl min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact CTA */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-lavender p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display text-primary-foreground mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
                  Our admissions team is available during school hours to answer your questions and guide you through the enrollment process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <a href="tel:+15551234567">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <a href="mailto:info@brightfuture.edu">
                      <Mail className="w-5 h-5" />
                      Email Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
