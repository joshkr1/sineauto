import { motion } from "framer-motion";
import { Section } from "@/components/site/Section";

const partners = [
  { name: "Copart", tagline: "Salvage Auctions" },
  { name: "IAA", tagline: "Insurance Auto Auctions" },
  { name: "Manheim", tagline: "Wholesale Auctions" },
  { name: "Grimaldi", tagline: "Ocean Logistics" },
  { name: "Sallaum Lines", tagline: "RoRo Shipping" },
];

export function Partners() {
  return (
    <Section
      eyebrow="Trusted Partners"
      title="Powered by Industry Leaders"
      subtitle="We work with the world's most respected auction houses and shipping lines to deliver vehicles globally."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group flex flex-col items-center justify-center rounded-sm border border-border bg-card px-4 py-8 text-center transition-all hover:border-gold/50 hover:shadow-luxury"
          >
            <div className="font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-gold sm:text-3xl">
              {p.name}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {p.tagline}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
