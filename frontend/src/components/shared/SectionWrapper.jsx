import { cn } from "@/lib/utils";

export function SectionWrapper({ id, className, children }) {
  return (
    <section id={id} className={cn("py-16 md:py-24 px-4", className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
