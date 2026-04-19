import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap, Globe, Phone, Mail } from "lucide-react";
import { Section } from "@/components/site/Section";
import oladelePhoto from "@/assets/oladele.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Sine Autos" },
      { name: "description", content: "Meet Olaide Badmus, founder & CEO of Sine Autos. 20+ years in automotive excellence, an MBA from California, USA, and a vision for global automotive trust." },
      { property: "og:title", content: "About — Sine Autos" },
      { property: "og:description", content: "Leadership and vision behind Sine Autos — led by Olaide Badmus, MBA." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <header className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Leadership</span>
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-semibold text-foreground sm:text-7xl text-balance">
            The Vision <em className="italic text-gold">behind</em> Sine Autos
          </h1>
        </div>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-5 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gradient-card shadow-luxury">
              <img
                src="https://raw.githubusercontent.com/joshkr1/sineautoofficialwebsite/main/CEO.jpeg"
                alt="Olaide Badmus, CEO and Founder of Sine Autos"
                className="h-full w-full object-cover grayscale-[20%]"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">CEO & Founder</div>
              <div className="mt-1 font-display text-2xl text-foreground">Olaide Badmus</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Meet the CEO</div>
            <h2 className="font-display text-4xl text-foreground text-balance">A career built on cars, business, and trust.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Olaide Badmus is an Economist and MBA (California, USA) with over 20 years in the automotive industry. A serial entrepreneur with a track record of growing multiple businesses, Olaide currently serves as a Senior Program Analyst in Manhattan, blending sharp business expertise with a lifelong passion for cars.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              With this unique blend of business acumen and automotive expertise, Olaide is poised to redefine the experience of buying, selling, and shipping vehicles globally.
            </p>

            <blockquote className="mt-8 border-l-2 border-gold pl-6">
              <p className="font-display text-xl italic leading-relaxed text-foreground">
                "Excellence in automotive service isn't just about cars — it's about understanding people, building trust, and creating experiences that last a lifetime."
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-gold">— Olaide Badmus</footer>
            </blockquote>
          </motion.div>
        </div>
      </Section>

      <Section eyebrow="Board of Trustees" title="Director of Operations">
        <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gradient-card shadow-luxury">
              <img
                src={oladelePhoto}
                alt="Oladele Atanda, Director of Operations at Sine Autos"
                className="h-full w-full object-cover grayscale-[20%]"
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Director of Operations · NY</div>
              <div className="mt-1 font-display text-2xl text-foreground">Oladele Atanda</div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <a href="tel:+18629104389" className="inline-flex items-center gap-1.5 hover:text-gold"><Phone className="h-3 w-3" /> +1 (862) 910‑4389</a>
                <a href="https://wa.me/18629104389" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold">WhatsApp</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h3 className="font-display text-3xl text-foreground text-balance">Operations, oversight, and continuous improvement.</h3>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Oladele Atanda is an accomplished leader in agile management with over a decade of experience driving strategy, execution, and operational excellence across both non-profit and private-sector organizations. His professional background spans e-commerce, automotive, and multi-location service industries, where he has supported scalable growth, customer-focused operations, and effective governance.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              He holds dual Master's degrees in Public Administration from <span className="text-foreground">Michigan State University</span> and <span className="text-foreground">Babeș-Bolyai University</span>, with academic concentrations in public policy, organizational leadership, and service delivery. He earned his Bachelor of Science in Sociology from <span className="text-foreground">Bayero University, Kano</span>.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              As a Director on the Board of Trustees at Sine Autos, Oladele brings a disciplined, outcomes-driven perspective to strategic oversight and decision-making — guiding the organization toward sustainable growth while maintaining high standards of accountability and customer trust.
            </p>
          </motion.div>
        </div>
      </Section>


      <Section eyebrow="Experience" title="Two Decades. One Standard." className="bg-gradient-card border-y border-border">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Education", items: ["MBA — California, USA", "Economics Degree", "Automotive Industry Certifications"] },
            { icon: Briefcase, title: "Professional", items: ["20+ Years Automotive Experience", "Senior Program Analyst, Manhattan", "Serial Entrepreneur"] },
            { icon: Award, title: "Achievements", items: ["Multiple Business Ventures", "Industry Recognition", "Global Automotive Network"] },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title} className="rounded-sm border border-border bg-card p-8">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
              <ul className="mt-4 space-y-2">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Leadership Philosophy" title="What Drives Us Forward">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Visionary Leadership", body: "Combining deep industry knowledge with innovative thinking to anticipate market trends and customer needs before they emerge." },
            { title: "Customer Centricity", body: "Every decision starts with the client. We build relationships, not transactions — and we treat each car as if it were our own." },
            { title: "Global Perspective", body: "From Lagos to Dubai to New York, we operate where the cars are. Local expertise. International reach." },
            { title: "Uncompromising Standards", body: "Inspections, documentation, logistics — handled with the rigor of a luxury brand. No shortcuts." },
          ].map((p) => (
            <div key={p.title} className="rounded-sm border border-border bg-card p-8">
              <Globe className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-display text-2xl text-foreground">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
