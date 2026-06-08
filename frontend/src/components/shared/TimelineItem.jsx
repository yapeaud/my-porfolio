import { motion } from "framer-motion";
import { UPLOADS_BASE } from "@/lib/constants";

export function TimelineItem({ item, index, dateLabel, title, subtitle, description }) {
  return (
    <motion.div
      className="flex gap-4 relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-md mt-1 shrink-0 z-10" />
        <div className="w-0.5 bg-border flex-1 mt-1" />
      </div>
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-3 mb-1">
          {item.logoUrl && (
            <img
              src={item.logoUrl.startsWith("http") ? item.logoUrl : `${UPLOADS_BASE}${item.logoUrl}`}
              alt={title}
              className="w-8 h-8 rounded object-contain"
            />
          )}
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{dateLabel}</span>
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-primary font-medium text-sm mb-2">{subtitle}</p>
        {description && <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>}
      </div>
    </motion.div>
  );
}
