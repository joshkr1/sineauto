import { createFileRoute, Link } from "@tanstack/react-router";
import { Gavel, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/auctions")({
  head: () => ({
    meta: [
      { title: "Auctions — Sine Autos" },
      { name: "description", content: "Live and upcoming vehicle auctions from Sine Autos. Bid on rare classics, exotics, and limited-edition cars." },
      { property: "og:title", content: "Auctions — Sine Autos" },
      { property: "og:description", content: "Live and upcoming vehicle auctions: rare classics, exotics, and limited editions." },
    ],
  }),
  component: AuctionsPage,
});

type AuctionRow = {
  id: string; starts_at: string; ends_at: string; status: string;
  starting_bid: number; current_bid: number | null;
  vehicle: { id: string; make: string; model: string; year: number; thumbnail_url: string | null; images: string[] | null } | null;
};

function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionRow[] | null>(null);

  useEffect(() => {
    supabase.from("auctions")
      .select("id,starts_at,ends_at,status,starting_bid,current_bid,vehicle:vehicles(id,make,model,year,thumbnail_url,images)")
      .order("starts_at", { ascending: true })
      .then(({ data }) => setAuctions((data ?? []) as unknown as AuctionRow[]));
  }, []);

  return (
    <>
      <header className="pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Live & Upcoming</span>
          </div>
          <h1 className="font-display text-5xl font-semibold text-foreground sm:text-7xl text-balance">
            The <em className="italic text-gold">Auction</em> Block
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Rare classics, exotics, and limited-edition vehicles — verified, documented, and ready to bid.
          </p>
        </div>
      </header>

      <Section>
        {auctions === null ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-sm bg-muted" />)}
          </div>
        ) : auctions.length === 0 ? (
          <EmptyAuctions />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auctions.map((a) => <AuctionCard key={a.id} a={a} />)}
          </div>
        )}
      </Section>
    </>
  );
}

function EmptyAuctions() {
  return (
    <div className="rounded-sm border border-dashed border-border bg-card/30 p-16 text-center">
      <Gavel className="mx-auto h-12 w-12 text-gold" />
      <h3 className="mt-6 font-display text-3xl text-foreground">No auctions live yet</h3>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        We're curating our next auction event. Get in touch to be notified, or browse our standing inventory.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/contact" className="rounded-sm border border-gold/40 px-6 py-3 text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-charcoal transition-all">
          Notify me
        </Link>
        <Link to="/inventory" className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs uppercase tracking-wider text-charcoal hover:shadow-gold-glow transition-all">
          Browse Inventory <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function AuctionCard({ a }: { a: AuctionRow }) {
  const v = a.vehicle;
  const img = v?.thumbnail_url || (v?.images && v.images[0]);
  const endsIn = new Date(a.ends_at).toLocaleString();
  return (
    <div className="overflow-hidden rounded-sm bg-card shadow-luxury">
      <div className="relative aspect-[4/3] bg-muted">
        {img && <img src={img} alt="" className="h-full w-full object-cover" />}
        <div className="absolute left-3 top-3 rounded-sm bg-charcoal/90 px-3 py-1 text-[10px] uppercase tracking-wider text-gold">
          {a.status}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-foreground">{v?.year} {v?.make} {v?.model}</h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /> Ends {endsIn}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current bid</div>
            <div className="font-display text-2xl text-gold">${Number(a.current_bid ?? a.starting_bid).toLocaleString()}</div>
          </div>
          <button className="rounded-sm bg-gold px-4 py-2 text-xs font-medium uppercase tracking-wider text-charcoal" disabled>
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
