import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import nathiImg from "@/assets/nathi.png";
import stugImg from "@/assets/stug.jpeg";
import angelImg from "@/assets/Angel.png";

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
    details: ["mosengela.nkosinathi02@gmail.com", "dlaminitumelo152@gmail.com"],
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

        {/* Meet Our Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Meet Our <span className="text-gradient">Team</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get in touch with our dedicated team members who are here to support your child's learning journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Team Member 1 - Nkosinathi */}
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img 
                    src={nathiImg} 
                    alt="Nkosinathi Mosengela" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Nkosinathi Mosengela</h3>
                <div className="space-y-2">
                  <a href="tel:+27717983248" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(+27) 71 798 3248</span>
                  </a>
                  <a href="mailto:mosengela.nkosinathi02@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">mosengela.nkosinathi02@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Team Member 2 - Tumelo */}
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img 
                    src={stugImg} 
                    alt="Tumelo Dlamini" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Tumelo Dlamini</h3>
                <div className="space-y-2">
                  <a href="tel:+27683482412" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(+27) 68 348 2412</span>
                  </a>
                  <a href="mailto:dlaminitumelo152@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">dlaminitumelo152@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Team Member 3 - Angel */}
              <div className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img 
                    src={angelImg} 
                    alt="Angel" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Angel</h3>
                <div className="space-y-2">
                  <a href="tel:+27683482412" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(+27) 68 348 2412</span>
                  </a>
                  <a href="mailto:dlaminitumelo152@gmail.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">dlaminitumelo152@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Map */}
              <div>
                <div className="text-center mb-8">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    Location
                  </span>
                  <h2 className="text-3xl font-display text-foreground mb-6">Find Us on the Map</h2>
                </div>
                <div className="aspect-[4/3] bg-card rounded-3xl shadow-card overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.8447!2d28.2167!3d-26.3833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9531e8e8e8e8e8%3A0x1234567890abcdef!2sThabang%20Primary%20School%2C%20Inyoni%20Road%20%26%2C%20Thakadu%20Rd%2C%20Vosloorus%20Ext%203%2C%20Vosloorus%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1629794729807!5m2!1sen!2sus"
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
                    <a href="tel:+27717983248">
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <a href="mailto:mosengela.nkosinathi02@gmail.com">
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
