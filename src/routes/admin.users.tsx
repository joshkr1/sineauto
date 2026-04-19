import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, ShieldOff, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listUsers, setUserAdmin } from "@/utils/admin-users.functions";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

type Row = {
  id: string;
  email: string;
  created_at: string;
  display_name: string | null;
  roles: string[];
  is_admin: boolean;
};

async function call<T>(fn: (opts: { data?: unknown; headers?: Record<string, string> }) => Promise<T>, data?: unknown) {
  const { data: { session } } = await supabase.auth.getSession();
  return fn({
    data,
    headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
}

function AdminUsers() {
  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setMeId(user?.id ?? null);
      const res = await call(listUsers as never);
      setUsers((res as { users: Row[] }).users);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const toggle = async (u: Row) => {
    if (u.is_admin && u.id === meId) {
      toast.error("You cannot remove your own admin role");
      return;
    }
    const action = u.is_admin ? "Demote to user" : "Promote to admin";
    if (!confirm(`${action}: ${u.email}?`)) return;
    setBusy(u.id);
    try {
      await call(setUserAdmin as never, { targetUserId: u.id, makeAdmin: !u.is_admin });
      toast.success(u.is_admin ? "Admin role removed" : "Promoted to admin");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Users</h1>
      <p className="mt-2 text-muted-foreground">Manage admin access. Only admins can promote or demote others.</p>

      <div className="mt-6 overflow-hidden rounded-sm border border-border bg-card">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No users yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background/40 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        {u.is_admin ? <Shield className="h-4 w-4 text-gold" /> : <UserIcon className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <div className="text-foreground">{u.display_name || u.email.split("@")[0]}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      u.is_admin ? "bg-gold text-charcoal" : "bg-secondary text-muted-foreground"
                    }`}>{u.is_admin ? "Admin" : "User"}</span>
                    {u.id === meId && <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">(you)</span>}
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => toggle(u)}
                      disabled={busy === u.id || (u.is_admin && u.id === meId)}
                      className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-foreground hover:border-gold/50 hover:text-gold disabled:opacity-40"
                    >
                      {u.is_admin ? <><ShieldOff className="h-3 w-3" /> Demote</> : <><Shield className="h-3 w-3" /> Promote</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
