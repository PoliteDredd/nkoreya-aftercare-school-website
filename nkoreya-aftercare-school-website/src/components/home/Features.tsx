import { Heart, Shield, Lightbulb, Users, Palette, TreePine } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Nurturing Environment",
    description: "A warm, caring atmosphere where every child feels valued and supported.",
    color: "bg-coral-light text-coral",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "State-of-the-art security systems and trained staff ensure your child's safety.",
    color: "bg-sky-light text-sky",
  },
  {
    icon: Lightbulb,
    title: "Creative Learning",
    description: "Innovative teaching methods that spark curiosity and encourage exploration.",
    color: "bg-sunshine-light text-sunshine",
  },
  {
    icon: Users,
    title: "Small Class Sizes",
    description: "Individual attention with a 15:1 student-to-teacher ratio for personalized learning.",
    color: "bg-lavender-light text-lavender",
  },
  {
    icon: Palette,
    title: "Arts & Expression",
    description: "Rich programs in music, art, and drama to nurture creative talents.",
    color: "bg-grass-light text-grass",
  },
  {
    icon: TreePine,
    title: "Outdoor Learning",
    description: "Beautiful gardens and play areas for hands-on nature exploration.",
    color: "bg-sky-light text-sky",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            What Makes Us <span className="text-gradient">Special</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine traditional values with modern education to create the perfect learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-3xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
