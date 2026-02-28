import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const events = [
  {
    date: "Dec 15",
    title: "Winter Concert",
    description: "Join us for a magical evening of music performed by our talented students.",
    time: "6:00 PM",
    category: "Event",
    color: "bg-coral",
  },
  {
    date: "Dec 20",
    title: "Holiday Art Exhibition",
    description: "Showcase of creative artwork by students from all grades.",
    time: "3:30 PM",
    category: "Exhibition",
    color: "bg-lavender",
  },
  {
    date: "Jan 8",
    title: "Open House 2025",
    description: "Prospective families are invited to tour our campus and meet our teachers.",
    time: "9:00 AM",
    category: "Admissions",
    color: "bg-grass",
  },
];

const news = [
  {
    title: "Nkoreya Tutoring Wins District Science Fair",
    excerpt: "Our 4th grade students took first place with their innovative solar energy project.",
    date: "Nov 28, 2024",
  },
  {
    title: "New STEM Lab Opening",
    excerpt: "We're excited to announce our state-of-the-art STEM laboratory opening next semester.",
    date: "Nov 15, 2024",
  },
  {
    title: "Community Garden Project Launch",
    excerpt: "Students will learn about sustainability through our new community garden initiative.",
    date: "Nov 10, 2024",
  },
];

export function NewsEvents() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  Upcoming Events
                </span>
                <h2 className="text-2xl md:text-3xl font-display text-foreground">
                  What's Happening
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="flex gap-4">
                    <div className={`${event.color} text-accent-foreground rounded-xl p-3 text-center min-w-[70px] shrink-0`}>
                      <span className="block text-sm font-medium">{event.date.split(" ")[0]}</span>
                      <span className="block text-xl font-display">{event.date.split(" ")[1]}</span>
                    </div>
                    <div className="flex-1">
                      <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full mb-2">
                        {event.category}
                      </span>
                      <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6 group">
              View All Events
              <Calendar className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  Latest News
                </span>
                <h2 className="text-2xl md:text-3xl font-display text-foreground">
                  School Updates
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {news.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
                >
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                  <h3 className="font-display text-lg text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mt-3 group-hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="mt-6 group">
              View All News
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
