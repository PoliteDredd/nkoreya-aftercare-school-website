import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import classroomImg from "@/assets/classroom.jpeg";
import playgroundImg from "@/assets/playground.jpg";
import artClassImg from "@/assets/art-class.jpg";
import scienceClassImg from "@/assets/science-class.jpg";
import musicClassImg from "@/assets/music-class.jpeg";

const slides = [
  { image: classroomImg, title: "Modern Classrooms", description: "Bright, engaging learning spaces" },
  { image: playgroundImg, title: "Safe Playground", description: "Where fun and fitness meet" },
  { image: artClassImg, title: "Creative Arts", description: "Expressing imagination freely" },
  { image: scienceClassImg, title: "Science Discovery", description: "Hands-on learning experiences" },
  { image: musicClassImg, title: "Music & Movement", description: "Rhythm in every heart" },
];

export function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Life at <span className="text-gradient">Nkoreya Tutoring</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the vibrant learning environment where every child thrives
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-3xl aspect-[16/9]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out",
                  index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl md:text-3xl font-display text-secondary mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-muted-foreground">{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card hover:scale-110 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card hover:scale-110 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
