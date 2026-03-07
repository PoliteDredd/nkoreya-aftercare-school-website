import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Kidiboni Thobela",
    role: "Parent of twins Nyiko and Amukelani Thobela (Grade 6)",
    content: "Grade 6 next year, all thanks to Teacher Nathi and your team",
    rating: 5,
  },
  {
    name: "Malwande Mtshikane",
    role: "Parent of Zaloluhle Dyantyi (Grade 2)",
    content: "From parent's perspective I'd like to extend gratitude, this, I credit to NKOREYA. Let's keep on keeping on!",
    rating: 5,
  },
  {
    name: "Noxolo Nxumalo",
    role: "(Grade 6)",
    content: "Halala! Teacher Siyabonga!",
    rating: 5,
  },
  {
    name: "Zanele Mhlafu",
    role: " (Grade 11)",
    content: "Hi Sir, nawa ama results wemisebenzi yakho!",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-card/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-primary-foreground mb-4">
            What Parents Say
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Hear from families who have experienced the Bright Future difference
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  index === current ? "opacity-100 block" : "opacity-0 hidden"
                )}
              >
                <div className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl">
                  <Quote className="w-12 h-12 text-primary/20 mb-6" />
                  <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="font-display text-lg text-foreground">{testimonial.name}</h4>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-sunshine fill-sunshine" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === current ? "w-8 bg-secondary" : "w-2 bg-card/40 hover:bg-card/60"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
