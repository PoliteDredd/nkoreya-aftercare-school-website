import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Calculator, Microscope, Globe, Palette, Music, Dumbbell, Laptop, Languages, Heart, Brain, TreePine } from "lucide-react";
import scienceImg from "@/assets/science-class.jpg";
import artImg from "@/assets/art-class.jpg";
import musicImg from "@/assets/music-class.jpeg";

const subjects = [
  { icon: BookOpen, title: "English Language Arts", description: "Reading, writing, grammar, and literature", color: "bg-sky-light text-sky" },
  { icon: Calculator, title: "Mathematics", description: "Number sense, geometry, and problem-solving", color: "bg-sunshine-light text-sunshine" },
  { icon: Microscope, title: "Science", description: "Hands-on experiments and discovery learning", color: "bg-grass-light text-grass" },
  { icon: Globe, title: "Social Studies", description: "History, geography, and civic education", color: "bg-coral-light text-coral" },
  { icon: Dumbbell, title: "Physical Education", description: "Sports and healthy habits", color: "bg-grass-light text-grass" },
  { icon: Laptop, title: "Technology", description: "Digital literacy", color: "bg-sunshine-light text-sunshine" },
];

const approaches = [
  {
    icon: Heart,
    title: "Child-Centered Learning",
    description: "We recognize each child's unique learning style and pace, adapting our teaching methods to meet individual needs.",
  },
  {
    icon: Brain,
    title: "Critical Thinking",
    description: "We encourage students to ask questions, analyze information, and develop problem-solving skills.",
  },
  {
    icon: TreePine,
    title: "Experiential Learning",
    description: "Hands-on activities, field trips, and real-world projects bring concepts to life.",
  },
];

const gradePrograms = [
  {
    level: "Kindergarten",
    ages: "Ages 5-6",
    focus: "Foundation skills, social development, and love of learning",
    subjects: ["Phonics", "Basic Math", "Art", "Music", "Play-based Learning"],
  },
  {
    level: "Lower Elementary",
    ages: "Grades 1-2",
    focus: "Building core literacy and numeracy skills",
    subjects: ["Reading", "Writing", "Math", "Science", "Social Skills"],
  },
  {
    level: "Upper Elementary",
    ages: "Grades 3-7",
    focus: "Advanced academics and critical thinking",
    subjects: ["Literature", "Advanced Math", "Science Labs", "Research Skills", "Technology"],
  },
];

const Academics = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-sunshine-light via-background to-lavender-light relative overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Academics
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                A Curriculum Designed for <span className="text-gradient">Excellence</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our comprehensive curriculum balances academic rigor with creative exploration, preparing students for success in middle school and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* Teaching Approach */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                How We <span className="text-gradient">Teach</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {approaches.map((approach, index) => (
                <div key={index} className="bg-card p-8 rounded-3xl shadow-soft hover:shadow-card transition-all duration-300 text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl gradient-hero flex items-center justify-center mb-6">
                    <approach.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-4">{approach.title}</h3>
                  <p className="text-muted-foreground">{approach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Curriculum
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Subjects We <span className="text-gradient">Offer</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div key={index} className="bg-card p-6 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl ${subject.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <subject.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">{subject.title}</h3>
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Grade Programs */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-grass/20 text-grass px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Programs
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Grade Level <span className="text-gradient">Programs</span>
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {gradePrograms.map((program, index) => (
                <div key={index} className="bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300">
                  <div className={`p-6 ${index === 0 ? 'gradient-hero' : index === 1 ? 'gradient-sunshine' : 'gradient-nature'}`}>
                    <h3 className="font-display text-2xl text-primary-foreground">{program.level}</h3>
                    <p className="text-primary-foreground/80">{program.ages}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">{program.focus}</p>
                    <h4 className="font-semibold text-foreground mb-3">Key Focus Areas:</h4>
                    <ul className="space-y-2">
                      {program.subjects.map((subject, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Programs Gallery */}
        <section className="py-20 bg-gradient-to-br from-sky-light to-lavender-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block bg-lavender/20 text-lavender px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Enrichment
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Beyond the <span className="text-gradient">Classroom</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { img: scienceImg, title: "History Trips", desc: "Exploring the history around the area" },
                { img: artImg, title: "Sports", desc: "Partipance in fitness and games" },
                { img: musicImg, title: "Nature Tours", desc: "Exploring nature around the school" },
              ].map((item, index) => (
                <div key={index} className="group relative rounded-3xl overflow-hidden shadow-card">
                  <img src={item.img} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl text-secondary mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
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

export default Academics;
