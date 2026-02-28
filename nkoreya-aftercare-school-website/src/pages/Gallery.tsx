import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Import images properly for Vite
import classroomImg from "@/assets/classroom.jpeg";
import playgroundImg from "@/assets/playground.jpg";
import artClassImg from "@/assets/art-class.jpg";
import scienceClassImg from "@/assets/science-class.jpg";
import musicClassImg from "@/assets/music-class.jpeg";
import sportsImg from "@/assets/sports-day.jpeg";
import libraryImg from "@/assets/library.jpeg";
import heroImg from "@/assets/hero-children.jpeg";

const categories = ["All", "Classrooms", "Activities", "Events", "Facilities"];

const galleryImages = [
  { 
    src: classroomImg, 
    title: "Modern Classroom", 
    category: "Classrooms",
    alt: "A bright, modern classroom with desks and educational materials"
  },
  { 
    src: playgroundImg, 
    title: "Colorful Playground", 
    category: "Facilities",
    alt: "Children playing on a colorful playground with slides and swings"
  },
  { 
    src: artClassImg, 
    title: "Art Class", 
    category: "Activities",
    alt: "Students engaged in creative art activities"
  },
  { 
    src: scienceClassImg, 
    title: "Science Discovery", 
    category: "Activities",
    alt: "Students conducting science experiments"
  },
  { 
    src: musicClassImg, 
    title: "Music Session", 
    category: "Activities",
    alt: "Children learning music and playing instruments"
  },
  { 
    src: sportsImg, 
    title: "Sports Day", 
    category: "Events",
    alt: "Students participating in sports day activities"
  },
  { 
    src: libraryImg, 
    title: "School Library", 
    category: "Facilities",
    alt: "A well-stocked library with books and reading areas"
  },
  { 
    src: heroImg, 
    title: "Happy Students", 
    category: "Events",
    alt: "Smiling students in their school uniforms"
  },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  const handleImageError = (src: string, index: number) => {
    console.log(`Image failed to load: ${src}`);
    setImageErrors(prev => new Set([...prev, src]));
  };

  const getImageSrc = (image: typeof galleryImages[0], index: number) => {
    if (imageErrors.has(image.src)) {
      // Fallback to Unsplash images with school/education theme
      const fallbackImages = [
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop", // classroom
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop", // playground
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop", // art
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", // science
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", // music
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", // sports
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop", // library
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop", // students
      ];
      return fallbackImages[index % fallbackImages.length];
    }
    return image.src;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-coral-light via-background to-sunshine-light relative overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-lavender/20 rounded-full blur-3xl animate-float" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Gallery
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                Moments of <span className="text-gradient">Joy & Learning</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Take a visual tour of life at Nkoreya After-care Tutoring Services. See our classrooms, events, and the smiles that fill our hallways every day.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 bg-background sticky top-20 z-30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-6 py-2 rounded-full font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-card transition-all duration-300"
                >
                  <img
                    src={getImageSrc(image, index)}
                    alt={image.alt || image.title}
                    onError={() => handleImageError(image.src, index)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block text-xs font-semibold text-primary bg-primary-foreground/90 px-2 py-1 rounded-full mb-2">
                      {image.category}
                    </span>
                    <h3 className="font-display text-lg text-secondary">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full animate-scale-in">
              <img
                src={getImageSrc(selectedImage, galleryImages.findIndex(img => img === selectedImage))}
                alt={selectedImage.alt || selectedImage.title}
                className="w-full rounded-3xl shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent rounded-b-3xl">
                <span className="inline-block text-xs font-semibold text-primary bg-primary-foreground/90 px-2 py-1 rounded-full mb-2">
                  {selectedImage.category}
                </span>
                <h3 className="font-display text-2xl text-secondary">{selectedImage.title}</h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-card transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Video Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-lavender/20 text-lavender px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Virtual Tour
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mb-4">
                Experience Our <span className="text-gradient">Campus</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Can't visit in person? Take a virtual tour of our beautiful campus and facilities.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-card rounded-3xl shadow-card flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-full gradient-hero flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-2">Virtual Campus Tour</h3>
                  <p className="text-muted-foreground">Click to watch our 5-minute tour video</p>
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

export default Gallery;