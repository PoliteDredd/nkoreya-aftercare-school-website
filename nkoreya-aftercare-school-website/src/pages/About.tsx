import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Target, Eye, Heart, Award, Users, BookOpen, Sparkles, CheckCircle } from "lucide-react";
import sportsdayImg from "@/assets/sports-day.jpeg";
import libraryImg from "@/assets/library.jpeg";

const values = [
  { icon: Heart, title: "Compassion", description: "We nurture empathy and kindness in every interaction" },
  { icon: Sparkles, title: "Excellence", description: "We strive for the highest standards in education" },
  { icon: Users, title: "Community", description: "We build strong relationships between families and educators" },
  { icon: BookOpen, title: "Curiosity", description: "We encourage questions and love of learning" },
];

const milestones = [
  { year: "2024", title: "Programme Founded", description: "Started with 10 students and a vision" },
  { year: "2025", title: "14 Academic Certificates", description: "awarded to learners for outstanding performance, 3 Medals earned for excellence and top achievement, 3 Trophies received in recognition of exceptional academic results." }, 
  { year: "2025", title: "Subjects of Excellence", description: "These achievements were attained in: Mathematics, Social Sciences, Natural Sciences, Discipline and Conduct" },
  { year: "2025", title: "Impact", description: "These milestones reflect Nkoreya Tutoring Services’ commitment to academic excellence, learner development, discipline, and community upliftment. The results demonstrate the effectiveness of our structured support, dedicated mentorship, and focus on holistic growth." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-sky-light via-background to-grass-light relative overflow-hidden">
          <div className="absolute top-20 right-20 w-40 h-40 bg-sunshine/20 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  About Us
                </span>
                <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                  Nurturing Young Minds Since <span className="text-gradient">2024</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Nkoreya After-care Tutoring Services has been a cornerstone of educational excellence in our community for nearly three years. We believe every child has unique potential waiting to be discovered and nurtured.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedicated team of educators combines proven teaching methods with innovative approaches to create an engaging learning environment where children thrive academically, socially, and emotionally.
                </p>
              </div>
              <div className="relative">
                <img src={sportsdayImg} alt="Our classroom" className="rounded-3xl shadow-2xl" />
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-card">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-grass-light flex items-center justify-center">
                      <Award className="w-7 h-7 text-grass" />
                    </div>
                    <div>
                      <p className="text-2xl font-display text-foreground">2+</p>
                      <p className="text-sm text-muted-foreground">Years of Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-primary to-lavender p-10 rounded-3xl text-primary-foreground">
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display mb-4">Our Mission</h2>
                <p className="text-primary-foreground/90 leading-relaxed">
                  Nkoreya Tutoring Services is dedicated to delivering structured, high-quality, and results-driven tutoring programs that empower learners to achieve academic success. We are committed to fostering a disciplined, inclusive, and intellectually stimulating learning environment that promotes critical thinking , confidence, and lifelong learning. Through professional instruction, personalized support, and continuous improvement, we strive to equip learners with the knowledge , skill, and character necessary to excel academically and contribute meaningfully to society. 
                </p>
              </div>
              <div className="bg-gradient-to-br from-secondary to-coral p-10 rounded-3xl text-secondary-foreground">
                <div className="w-16 h-16 rounded-2xl bg-secondary-foreground/20 flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display mb-4">Our Vision</h2>
                <p className="text-secondary-foreground/90 leading-relaxed">
                  To be a distinguished and trusted provider of acamedic, innovation, and measurable impact in learner achievement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                What We <span className="text-gradient">Believe In</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card p-8 rounded-3xl text-center shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Milestones & <span className="text-gradient">Achievements</span>
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex gap-8 mb-12 last:mb-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0 z-10">
                      <CheckCircle className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="bg-card p-6 rounded-2xl shadow-soft flex-1">
                      <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                      <h3 className="font-display text-xl text-foreground mt-1 mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section Preview */}
        <section className="py-20 bg-gradient-to-br from-lavender-light to-sky-light">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-lavender/20 text-lavender px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Our Team
                </span>
                <h2 className="text-3xl md:text-4xl font-display text-foreground mb-6">
                  Dedicated Educators Who Care
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our team of certified teachers brings passion, expertise, and dedication to every classroom. With an average of 10+ years of experience, our educators are committed to bringing out the best in every student.
                </p>
                <ul className="space-y-4">
                  {["Certified and experienced teachers", "Ongoing professional development", "Low student-to-teacher ratio", "Specialized subject experts"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-grass" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <img src={libraryImg} alt="Students in library" className="rounded-3xl shadow-2xl" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
