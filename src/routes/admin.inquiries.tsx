import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

type Inquiry = {
  id: string; name: string; email: string; phone: string | null;
  subject: string | null; message: string; service_type: string | null;
  status: string; created_at: string; vehicle_id: string | null;
};

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setInquiries((data ?? []) as Inquiry[]);
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); reload(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); reload(); }
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Inquiries</h1>
      <p className="mt-2 text-muted-foreground">All messages submitted from the contact form and vehicle pages.</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : inquiries.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border p-12 text-center text-muted-foreground">
            No inquiries yet.
          </div>
        ) : (
          inquiries.map((i) => (
            <div key={i.id} className="rounded-sm border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl text-foreground">{i.name}</h3>
                    <span className={`rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      i.status === "new" ? "bg-gold text-charcoal" : i.status === "in_progress" ? "bg-muted text-foreground" : "bg-secondary text-muted-foreground"
                    }`}>{i.status.replace("_", " ")}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <a href={`mailto:${i.email}`} className="flex items-center gap-1 hover:text-gold"><Mail className="h-3 w-3" /> {i.email}</a>
                    {i.phone && <a href={`tel:${i.phone}`} className="flex items-center gap-1 hover:text-gold"><Phone className="h-3 w-3" /> {i.phone}</a>}
                    <span>{new Date(i.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={i.status} onChange={(e) => setStatus(i.id, e.target.value)}
                    className="rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none">
                    <option value="new">New</option>
                    <option value="in_progress">In progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button onClick={() => remove(i.id)} className="rounded-sm p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {i.subject && <div className="mt-3 text-sm font-medium text-foreground">{i.subject}</div>}
              {i.service_type && <div className="mt-1 text-xs uppercase tracking-wider text-gold">{i.service_type}</div>}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{i.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
