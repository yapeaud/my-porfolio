import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { Button } from "@/components/ui/button";
import { getTestimonials } from "@/services/testimonial.service";

export function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { getTestimonials().then(setItems).catch(() => {}); }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
  };

  useEffect(() => {
    if (items.length > 1) { resetTimer(); }
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const go = (dir) => {
    setIndex((i) => (i + dir + items.length) % items.length);
    resetTimer();
  };

  if (!items.length) return null;

  const visibleCount = Math.min(items.length, 3);
  const visible = Array.from({ length: visibleCount }, (_, i) => items[(index + i) % items.length]);

  return (
    <SectionWrapper id="testimonials" className="bg-secondary/20">
      <SectionTitle title="Témoignages" subtitle="Ce que disent mes clients et collaborateurs" />
      <div
        className="relative"
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={() => items.length > 1 && resetTimer()}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {visible.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {items.length > visibleCount && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Précédent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setIndex(i); resetTimer(); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === index % items.length ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Suivant">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
