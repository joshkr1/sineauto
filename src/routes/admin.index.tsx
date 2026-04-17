import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Car, Inbox, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ vehicles: 0, available: 0, inquiries: 0, newInquiries: 0 });

  useEffect(() => {
    (async () => {
      const [v, va, i, ni] = await Promise.all([
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "available"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({ vehicles: v.count ?? 0, available: va.count ?? 0, inquiries: i.count ?? 0, newInquiries: ni.count ?? 0 });
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome back. Here's a snapshot of your business.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Stat to="/admin/vehicles" icon={Car} label="Total Vehicles" value={stats.vehicles} sub={`${stats.available} available`} />
        <Stat to="/admin/inquiries" icon={Inbox} label="Inquiries" value={stats.inquiries} sub={`${stats.newInquiries} new`} highlight={stats.newInquiries > 0} />
      </div>

      <div className="mt-10 rounded-sm border border-border bg-card p-6">
        <h2 className="font-display text-xl text-foreground">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/vehicles" className="rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-wider text-charcoal">+ Add vehicle</Link>
          <Link to="/admin/inquiries" className="rounded-sm border border-gold/40 px-4 py-2 text-xs uppercase tracking-wider text-gold hover:bg-gold hover:text-charcoal transition-all">View inquiries</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ to, icon: Icon, label, value, sub, highlight }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <Link to={to} className="group rounded-sm border border-border bg-card p-6 transition-all hover:border-gold/50">
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-gold" />
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
      <div className="mt-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-4xl text-foreground">{value}</div>
      {sub && <div className={`mt-1 text-xs ${highlight ? "text-gold" : "text-muted-foreground"}`}>{sub}</div>}
    </Link>
  );
}
