import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const events = [
  {
    date: "Dec 15",
    title: "Career Day",
    description: "An event where professionals visited the programme to introduce learners to different careers. They shared information about what they do, the skills and education needed, and answered questions from the learners. The aim was to inspire young learners and help them start thinking about their future careers.",
    time: "12:00 PM",
    category: "Event",
    color: "bg-coral",
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
                  Events
                </span>
                <h2 className="text-2xl md:text-3xl font-display text-foreground">
                  What Happened
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
          </div>
        </div>
      </div>
    </section>
  );
}
