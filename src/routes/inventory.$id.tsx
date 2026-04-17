import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Gauge, MapPin, Calendar, Fuel, Settings2, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/inventory/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Vehicle Details — Sine Autos` },
      { name: "description", content: "View full vehicle details, specifications, and inquire about this premium listing from Sine Autos." },
      { property: "og:title", content: `Vehicle ${params.id} — Sine Autos` },
    ],
  }),
  component: VehicleDetailPage,
});

type Vehicle = {
  id: string; make: string; model: string; year: number; price: number; currency: string;
  mileage: number | null; fuel_type: string | null; transmission: string | null; body_type: string | null;
  exterior_color: string | null; interior_color: string | null; vin: string | null;
  condition: string; status: string; location: string | null; description: string | null;
  features: string[] | null; images: string[] | null; thumbnail_url: string | null;
};

function VehicleDetailPage() {
  const { id } = Route.useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null | undefined>(undefined);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    supabase.from("vehicles").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => setVehicle(data as Vehicle | null));
  }, [id]);

  if (vehicle === undefined) return <div className="pt-32 pb-20 text-center text-muted-foreground">Loading…</div>;
  if (vehicle === null) {
    throw notFound();
  }

  const allImages = [vehicle.thumbnail_url, ...(vehicle.images ?? [])].filter(Boolean) as string[];
  const heroImg = allImages[activeImg];

  const specs = [
    { icon: Calendar, label: "Year", value: vehicle.year },
    { icon: Gauge, label: "Mileage", value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : "—" },
    { icon: Fuel, label: "Fuel", value: vehicle.fuel_type ?? "—" },
    { icon: Settings2, label: "Transmission", value: vehicle.transmission ?? "—" },
    { icon: Palette, label: "Exterior", value: vehicle.exterior_color ?? "—" },
    { icon: MapPin, label: "Location", value: vehicle.location ?? "—" },
  ];

  return (
    <>
      <div className="pt-28 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/inventory" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to inventory
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] overflow-hidden rounded-sm bg-muted">
            {heroImg ? (
              <img src={heroImg} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground"><Gauge className="h-16 w-16" /></div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-sm border-2 transition-all ${i === activeImg ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gold">{vehicle.body_type ?? vehicle.condition.replace("_", " ")}</div>
          <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
            {vehicle.year} {vehicle.make}<br /><em className="italic text-gold">{vehicle.model}</em>
          </h1>
          <div className="mt-6 font-display text-4xl text-gold">${Number(vehicle.price).toLocaleString()}</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{vehicle.currency}</div>

          {vehicle.description && (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{vehicle.description}</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="text-sm text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.2em] text-gold">Features</div>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <InquireForm vehicleId={vehicle.id} vehicleLabel={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        </div>
      </div>
    </>
  );
}

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(5000),
});

function InquireForm({ vehicleId, vehicleLabel }: { vehicleId: string; vehicleLabel: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: `I'm interested in the ${vehicleLabel}. Please send more details.` });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      vehicle_id: vehicleId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: `Vehicle inquiry: ${vehicleLabel}`,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send inquiry. Please try again.");
    } else {
      toast.success("Inquiry sent — we'll be in touch shortly.");
      setForm({ ...form, message: "" });
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 rounded-sm bg-gradient-card p-6">
      <h3 className="font-display text-xl text-foreground">Inquire about this vehicle</h3>
      <div className="mt-4 grid gap-3">
        <input className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
        <input type="email" className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required maxLength={255} />
        <input className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
        <textarea rows={4} className="rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={5000} />
        <button type="submit" disabled={submitting} className="rounded-sm bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-all hover:shadow-gold-glow disabled:opacity-60">
          {submitting ? "Sending…" : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}
