import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Globe2, ShieldCheck, Sparkles, Gauge } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";
import { Partners } from "@/components/site/Partners";
import heroImg from "@/assets/hero-luxury-car.jpg";
import classicImg from "@/assets/showcase-classic.jpg";
import shippingImg from "@/assets/showcase-shipping.jpg";
import auctionImg from "@/assets/showcase-auction.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sine Autos — Drive Excellence. Anywhere in the World." },
      { name: "description", content: "Sine Autos connects you to vintage classics and modern luxury vehicles. Sales, global shipping, auctions, rentals, and sourcing — under one trusted name." },
      { property: "og:title", content: "Sine Autos — Drive Excellence" },
      { property: "og:description", content: "Premium global automotive hub. Sales, shipping, auctions, rentals." },
    ],
  }),
  component: HomePage,
});

type Service = { id: string; title: string; slug: string; short_description: string };
type Vehicle = {
  id: string; make: string; model: string; year: number; price: number;
  thumbnail_url: string | null; images: string[] | null; body_type: string | null; location: string | null;
};

function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [featured, setFeatured] = useState<Vehicle[]>([]);

  useEffect(() => {
    supabase.from("services").select("id,title,slug,short_description").eq("active", true).order("sort_order").limit(6)
      .then(({ data }) => setServices(data ?? []));
    supabase.from("vehicles").select("id,make,model,year,price,thumbnail_url,images,body_type,location")
      .eq("featured", true).limit(3)
      .then(({ data }) => setFeatured(data ?? []));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Black luxury sedan under warm street lights at night"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero-overlay" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-12 bg-gold" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Est. since founding</span>
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-7xl lg:text-8xl text-balance">
              Drive <em className="italic text-gold">Excellence.</em>
              <br />Anywhere in the World.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
              From timeless classics to modern luxury — Sine Autos delivers a seamless automotive experience built on trust, quality, and global reach.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/inventory"
                className="group inline-flex items-center gap-3 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-charcoal shadow-gold-glow transition-all hover:gap-4"
              >
                Explore Inventory <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-sm border border-cream/30 bg-cream/5 px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-cream backdrop-blur-sm transition-all hover:border-gold hover:text-gold"
              >
                Talk to Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream/60">Scroll</span>
            <div className="h-12 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <Section eyebrow="Our Commitment" title="One Brand. Every Automotive Solution." subtitle="Building trust and excellence in the global automotive industry — from first conversation to keys in hand.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "Mission", body: "Reliable, high-quality vehicles paired with seamless sales, shipping, auctions, and rental services — delivered with integrity worldwide." },
            { icon: Globe2, title: "Vision", body: "To become the trusted global hub connecting people to exceptional vehicles across generations." },
            { icon: ShieldCheck, title: "Our Value", body: "End-to-end automotive excellence. One trusted name simplifying every step of car ownership." },
          ].map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-sm bg-gradient-card p-8 transition-all hover:shadow-luxury"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-6 font-display text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section eyebrow="Our Services" title="End-to-End Automotive Solutions" subtitle="Global reach, local expertise. Choose the service that moves you forward.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to="/services"
                className="group block h-full rounded-sm border border-border bg-card p-8 transition-all hover:border-gold/50 hover:shadow-luxury"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 text-gold">
                  <Gauge className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.short_description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold hover:gap-3 transition-all">
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* SHOWCASE GRID */}
      <Section eyebrow="What we do" title="Every Mile. Handled.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { img: classicImg, label: "Classic & Vintage", to: "/inventory" },
            { img: shippingImg, label: "Global Shipping", to: "/services" },
            { img: auctionImg, label: "Live Auctions", to: "/auctions" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm"
            >
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Discover</div>
                <div className="mt-1 font-display text-2xl text-cream">{item.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* FEATURED INVENTORY */}
      {featured.length > 0 && (
        <Section eyebrow="Premium Inventory" title="Featured Vehicles" subtitle="A curated selection from our current collection.">
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((v) => (
              <Link
                key={v.id}
                to="/inventory/$id"
                params={{ id: v.id }}
                className="group block overflow-hidden rounded-sm bg-card transition-all hover:shadow-luxury"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {v.thumbnail_url || (v.images && v.images[0]) ? (
                    <img
                      src={v.thumbnail_url || v.images![0]}
                      alt={`${v.year} ${v.make} ${v.model}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <Gauge className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gold">{v.body_type ?? "Vehicle"}</div>
                  <h3 className="mt-2 font-display text-xl text-foreground">{v.year} {v.make} {v.model}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">{v.location}</div>
                  <div className="mt-4 font-display text-lg text-gold">${Number(v.price).toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/inventory" className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal hover:shadow-gold-glow transition-all">
              View Full Inventory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* PARTNERS */}
      <Partners />

      {/* CTA STRIP */}
      <section className="border-y border-border bg-gradient-card">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl text-foreground sm:text-5xl text-balance">
            Looking for something <em className="italic text-gold">specific</em>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us the year, make, and model. Our global sourcing network does the rest.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-sm bg-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-charcoal shadow-gold-glow transition-all hover:gap-4"
          >
            Start a Conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
