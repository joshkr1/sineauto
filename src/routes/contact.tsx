import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sine Autos" },
      { name: "description", content: "Get in touch with Sine Autos. Sales, sourcing, shipping, rentals — we'll respond within one business day." },
      { property: "og:title", content: "Contact — Sine Autos" },
      { property: "og:description", content: "Reach out about sales, sourcing, shipping, or rentals. We respond within one business day." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  service_type: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "Please enter a message").max(5000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", service_type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      service_type: parsed.data.service_type || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please try again.");
    } else {
      toast.success("Message sent — we'll get back to you within one business day.");
      setForm({ name: "", email: "", phone: "", subject: "", service_type: "", message: "" });
    }
  };

  return (
    <>
      <header className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Get in touch</span>
          </div>
          <h1 className="max-w-3xl font-display text-5xl font-semibold text-foreground sm:text-7xl text-balance">
            Let's <em className="italic text-gold">talk</em> cars.
          </h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2 space-y-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            Whether you're sourcing a rare classic, shipping a vehicle internationally, booking a luxury rental, or just exploring — we're here to help.
          </p>
          <ul className="space-y-5">
            <li className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-gradient-gold text-charcoal"><Mail className="h-5 w-5" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Email</div>
                <a href="mailto:info@sineautos.com" className="text-foreground hover:text-gold">info@sineautos.com</a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-gradient-gold text-charcoal"><Phone className="h-5 w-5" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Phone</div>
                <a href="tel:+18629104389" className="text-foreground hover:text-gold">+1 (862) 910‑4389</a>
                <div className="text-xs text-muted-foreground">Oladele Atanda — Director of Operations</div>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-gradient-gold text-charcoal"><MessageCircle className="h-5 w-5" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold">WhatsApp</div>
                <a href="https://wa.me/18629104389" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gold">Chat on WhatsApp</a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-gradient-gold text-charcoal"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Office</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=95+Freeway+Drive+West+Orange+NJ+07050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-gold"
                >
                  95 Freeway Drive West<br />Orange, New Jersey 07050
                </a>
              </div>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-sm bg-gradient-card p-8 shadow-luxury lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} maxLength={100} />
            <Field label="Email" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} maxLength={255} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} maxLength={30} />
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold">Service of interest</label>
              <select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
                <option value="">Select…</option>
                <option>Vehicle Sales</option>
                <option>Vehicle Sourcing</option>
                <option>Global Shipping</option>
                <option>Luxury Rentals</option>
                <option>Auctions</option>
                <option>Trade-in / Consignment</option>
                <option>Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} maxLength={200} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-gold">Message *</label>
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={5000}
                className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:shadow-gold-glow disabled:opacity-60 sm:w-auto">
            {submitting ? "Sending…" : <>Send Message <Send className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required, maxLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; maxLength?: number }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-gold">{label}{required && " *"}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} maxLength={maxLength}
        className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
    </div>
  );
}
