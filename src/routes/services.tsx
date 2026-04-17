import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Car, Ship, Gavel, Key, Search, Repeat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Sine Autos" },
      { name: "description", content: "Vehicle sales, global shipping, auctions, luxury rentals, sourcing, and trade-in. Comprehensive automotive solutions from Sine Autos." },
      { property: "og:title", content: "Services — Sine Autos" },
      { property: "og:description", content: "End-to-end automotive solutions: sales, shipping, auctions, rentals, sourcing, trade-in." },
    ],
  }),
  component: ServicesPage,
});

const ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Car, Ship, Gavel, Key, Search, Repeat,
};

const PROCESS = [
  { n: "01", title: "Consultation", desc: "Detailed discussion of your needs, preferences, and budget." },
  { n: "02", title: "Sourcing", desc: "Global search for the perfect vehicle matching your criteria." },
  { n: "03", title: "Inspection", desc: "Comprehensive vehicle inspection and verification." },
  { n: "04", title: "Purchase", desc: "Secure transaction with complete documentation." },
  { n: "05", title: "Delivery", desc: "Shipping and delivery to your specified location." },
];

type Service = { id: string; title: string; slug: string; short_description: string; long_description: string | null; icon: string | null };

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).order("sort_order")
      .then(({ data }) => setServices(data ?? []));
  }, []);

  return (
    <>
      <header className="relative pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Comprehensive Services</span>
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-semibold text-foreground sm:text-7xl text-balance">
            End-to-End <em className="italic text-gold">Solutions</em> for Every Need
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            From vehicle sourcing to shipping, auctions to rentals, we provide complete automotive solutions with global reach and local expertise.
          </p>
        </div>
      </header>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = ICON[s.icon ?? "Car"] ?? Car;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group rounded-sm border border-border bg-card p-8 transition-all hover:border-gold/50 hover:shadow-luxury"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-gold text-charcoal">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.long_description ?? s.short_description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="Our Process" title="Five Steps. Zero Surprises." subtitle="Simple, transparent process from consultation to delivery." className="bg-gradient-card border-y border-border">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-5xl text-gold/40">{step.n}</div>
              <h4 className="mt-2 font-display text-xl text-foreground">{step.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl rounded-sm bg-gradient-card p-12 text-center shadow-luxury">
          <h2 className="font-display text-4xl text-foreground text-balance">
            Ready to <em className="italic text-gold">begin</em>?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Tell us what you're looking for. We'll handle the rest — anywhere in the world.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-charcoal shadow-gold-glow transition-all hover:gap-4"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
