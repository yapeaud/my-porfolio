import { motion } from "framer-motion";

export function SectionTitle({ title, subtitle }) {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h2>
      <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-3" />
      {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}
