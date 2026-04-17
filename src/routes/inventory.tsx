import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Filter, Gauge, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Sine Autos" },
      { name: "description", content: "Browse our curated inventory of vintage classics and modern luxury vehicles available for purchase or import." },
      { property: "og:title", content: "Inventory — Sine Autos" },
      { property: "og:description", content: "Curated luxury and classic vehicles ready for purchase or global delivery." },
    ],
  }),
  component: InventoryPage,
});

type Vehicle = {
  id: string; make: string; model: string; year: number; price: number;
  thumbnail_url: string | null; images: string[] | null; body_type: string | null;
  location: string | null; condition: string; status: string; mileage: number | null;
};

function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [search, setSearch] = useState("");
  const [bodyFilter, setBodyFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  useEffect(() => {
    supabase.from("vehicles").select("id,make,model,year,price,thumbnail_url,images,body_type,location,condition,status,mileage")
      .order("created_at", { ascending: false })
      .then(({ data }) => setVehicles(data ?? []));
  }, []);

  const bodyTypes = useMemo(() => {
    const set = new Set((vehicles ?? []).map((v) => v.body_type).filter(Boolean) as string[]);
    return Array.from(set);
  }, [vehicles]);

  const filtered = useMemo(() => {
    let list = vehicles ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((v) => `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q));
    }
    if (bodyFilter !== "all") list = list.filter((v) => v.body_type === bodyFilter);
    if (conditionFilter !== "all") list = list.filter((v) => v.condition === conditionFilter);
    if (sort === "price-asc") list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc") list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === "year-desc") list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [vehicles, search, bodyFilter, conditionFilter, sort]);

  return (
    <>
      <header className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Premium Inventory</span>
          </div>
          <h1 className="font-display text-5xl font-semibold text-foreground sm:text-6xl text-balance">
            The <em className="italic text-gold">Collection</em>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Curated vehicles available for immediate purchase or international delivery.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="border-y border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, year…"
              className="w-full rounded-sm border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </div>
          <Select value={bodyFilter} onChange={setBodyFilter} label="Body">
            <option value="all">All bodies</option>
            {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>
          <Select value={conditionFilter} onChange={setConditionFilter} label="Condition">
            <option value="all">All conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_pre_owned">Certified pre-owned</option>
            <option value="classic">Classic</option>
          </Select>
          <Select value={sort} onChange={setSort} label="Sort">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="year-desc">Year: Newest first</option>
          </Select>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            <Filter className="mr-1 inline h-3 w-3" />
            {filtered.length} vehicle{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <Section>
        {vehicles === null ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-sm bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border bg-card/30 p-16 text-center">
            <Gauge className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-6 font-display text-2xl text-foreground">No vehicles match your filters</h3>
            <p className="mt-2 text-muted-foreground">
              Try clearing filters, or contact us — we can source the exact car you want.
            </p>
            <Link to="/contact" className="mt-6 inline-flex rounded-sm bg-gold px-6 py-3 text-xs uppercase tracking-wider text-charcoal">
              Source a Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
      </Section>
    </>
  );
}

function Select({ value, onChange, label, children }: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
      <span className="hidden sm:inline">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function VehicleCard({ v }: { v: Vehicle }) {
  const img = v.thumbnail_url || (v.images && v.images[0]);
  return (
    <Link
      to="/inventory/$id"
      params={{ id: v.id }}
      className="group block overflow-hidden rounded-sm bg-card transition-all hover:shadow-luxury"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {img ? (
          <img
            src={img}
            alt={`${v.year} ${v.make} ${v.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Gauge className="h-12 w-12" />
          </div>
        )}
        {v.status !== "available" && (
          <div className="absolute right-3 top-3 rounded-sm bg-charcoal/90 px-2 py-1 text-[10px] uppercase tracking-wider text-gold">
            {v.status.replace("_", " ")}
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold">{v.body_type ?? v.condition.replace("_", " ")}</div>
          {v.mileage && <div className="text-xs text-muted-foreground">{v.mileage.toLocaleString()} mi</div>}
        </div>
        <h3 className="mt-2 font-display text-xl text-foreground">{v.year} {v.make} {v.model}</h3>
        {v.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {v.location}
          </div>
        )}
        <div className="mt-4 font-display text-2xl text-gold">${Number(v.price).toLocaleString()}</div>
      </div>
    </Link>
  );
}
