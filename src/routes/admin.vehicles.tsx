import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, X, Upload, Loader2, ImageIcon, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/vehicles")({
  component: AdminVehicles,
});

type Vehicle = {
  id: string; make: string; model: string; year: number; price: number;
  body_type: string | null; condition: string; status: string; featured: boolean;
  thumbnail_url: string | null; description: string | null; mileage: number | null;
  fuel_type: string | null; transmission: string | null; location: string | null;
  images: string[] | null;
};

function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editing, setEditing] = useState<Partial<Vehicle> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    setVehicles((data ?? []) as Vehicle[]);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      make: editing.make ?? "",
      model: editing.model ?? "",
      year: Number(editing.year) || new Date().getFullYear(),
      price: Number(editing.price) || 0,
      body_type: editing.body_type || null,
      condition: (editing.condition || "used") as "new" | "used" | "certified_pre_owned" | "classic",
      status: (editing.status || "available") as "available" | "sold" | "reserved" | "coming_soon",
      featured: !!editing.featured,
      thumbnail_url: editing.thumbnail_url || null,
      description: editing.description || null,
      mileage: editing.mileage ? Number(editing.mileage) : null,
      fuel_type: editing.fuel_type || null,
      transmission: editing.transmission || null,
      location: editing.location || null,
      images: editing.images ?? [],
    };
    if (!payload.make || !payload.model) {
      toast.error("Make and model are required");
      return;
    }
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("vehicles").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("vehicles").insert(payload));
    }
    if (error) toast.error(error.message);
    else {
      toast.success(editing.id ? "Vehicle updated" : "Vehicle added");
      setEditing(null);
      reload();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Vehicle deleted"); reload(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-foreground">Vehicles</h1>
        <button onClick={() => setEditing({ year: new Date().getFullYear(), condition: "used", status: "available", images: [] })}
          className="inline-flex items-center gap-2 rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-wider text-charcoal">
          <Plus className="h-4 w-4" /> Add vehicle
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-sm border border-border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No vehicles yet. Click "Add vehicle" to start your inventory.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex items-center gap-3">
                      {v.thumbnail_url ? (
                        <img src={v.thumbnail_url} alt="" className="h-10 w-14 rounded-sm object-cover" />
                      ) : (
                        <div className="grid h-10 w-14 place-items-center rounded-sm bg-muted text-muted-foreground"><ImageIcon className="h-4 w-4" /></div>
                      )}
                      <span>{v.year} {v.make} {v.model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gold">${Number(v.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.status.replace("_", " ")}</td>
                  <td className="px-4 py-3">{v.featured ? "★" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing({ ...v, images: v.images ?? [] })} className="rounded-sm p-2 text-muted-foreground hover:bg-muted hover:text-gold"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(v.id)} className="rounded-sm p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/80 p-4" onClick={() => setEditing(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm bg-card p-6 shadow-luxury" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">{editing.id ? "Edit vehicle" : "Add vehicle"}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Photos section */}
              <PhotoManager
                thumbnail={editing.thumbnail_url ?? null}
                images={editing.images ?? []}
                onChange={(thumb, imgs) => setEditing({ ...editing, thumbnail_url: thumb, images: imgs })}
              />

              {/* Details */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Make *" value={editing.make ?? ""} onChange={(v) => setEditing({ ...editing, make: v })} />
                <Input label="Model *" value={editing.model ?? ""} onChange={(v) => setEditing({ ...editing, model: v })} />
                <Input label="Year" type="number" value={String(editing.year ?? "")} onChange={(v) => setEditing({ ...editing, year: Number(v) })} />
                <Input label="Price (USD)" type="number" value={String(editing.price ?? "")} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
                <Input label="Mileage" type="number" value={String(editing.mileage ?? "")} onChange={(v) => setEditing({ ...editing, mileage: Number(v) })} />
                <Input label="Body type" value={editing.body_type ?? ""} onChange={(v) => setEditing({ ...editing, body_type: v })} />
                <Input label="Fuel" value={editing.fuel_type ?? ""} onChange={(v) => setEditing({ ...editing, fuel_type: v })} />
                <Input label="Transmission" value={editing.transmission ?? ""} onChange={(v) => setEditing({ ...editing, transmission: v })} />
                <Input label="Location" value={editing.location ?? ""} onChange={(v) => setEditing({ ...editing, location: v })} />
                <Select label="Condition" value={editing.condition ?? "used"} onChange={(v) => setEditing({ ...editing, condition: v })} options={["new", "used", "certified_pre_owned", "classic"]} />
                <Select label="Status" value={editing.status ?? "available"} onChange={(v) => setEditing({ ...editing, status: v })} options={["available", "sold", "reserved", "coming_soon"]} />
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gold">Description</label>
                  <textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                  Featured on homepage
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={save} className="rounded-sm bg-gold px-6 py-2 text-xs uppercase tracking-wider text-charcoal">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoManager({
  thumbnail, images, onChange,
}: {
  thumbnail: string | null;
  images: string[];
  onChange: (thumbnail: string | null, images: string[]) => void;
}) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 10MB`);
        continue;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user?.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("inventory_images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("inventory_images").getPublicUrl(path);
      uploaded.push(publicUrl);
    }
    if (uploaded.length) {
      const newImages = [...images, ...uploaded];
      const newThumb = thumbnail ?? uploaded[0];
      onChange(newThumb, newImages);
      toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`);
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    const newImages = images.filter((i) => i !== url);
    const newThumb = thumbnail === url ? (newImages[0] ?? null) : thumbnail;
    onChange(newThumb, newImages);
  };

  const setAsCover = (url: string) => {
    onChange(url, images);
    toast.success("Set as cover photo");
  };

  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-gold">Photos</label>
      <p className="mt-1 text-xs text-muted-foreground">
        Drag photos here or click to choose. The first photo becomes the cover — click ★ on any photo to make it the cover.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => fileInput.current?.click()}
        className={`mt-2 cursor-pointer rounded-sm border-2 border-dashed p-6 text-center transition ${
          dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
        }`}
      >
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            uploadFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-6 w-6 text-gold" />
            <span><span className="text-foreground">Click to upload</span> or drag &amp; drop</span>
            <span className="text-xs">JPG, PNG, WEBP up to 10MB each</span>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url) => (
            <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-muted">
              <img src={url} alt="" className="h-full w-full object-cover" />
              {thumbnail === url && (
                <div className="absolute left-1 top-1 rounded-sm bg-gold px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal">
                  Cover
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-charcoal/70 opacity-0 transition group-hover:opacity-100">
                {thumbnail !== url && (
                  <button
                    type="button"
                    onClick={() => setAsCover(url)}
                    title="Set as cover"
                    className="rounded-sm bg-gold p-1.5 text-charcoal hover:opacity-90"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  title="Remove"
                  className="rounded-sm bg-destructive p-1.5 text-destructive-foreground hover:opacity-90"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-gold">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-gold">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none">
        {options.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
      </select>
    </div>
  );
}
