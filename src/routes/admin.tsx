import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { LayoutDashboard, Car, Inbox, Users, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Sine Autos" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, isAdmin, loading, signOut, refreshAdminStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading) return <div className="pt-32 text-center text-muted-foreground">Loading…</div>;
  if (!user) return null;


  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-28 space-y-1">
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Admin</div>
          <NavItem to="/admin" icon={LayoutDashboard} label="Overview" exact />
          <NavItem to="/admin/vehicles" icon={Car} label="Vehicles" />
          <NavItem to="/admin/inquiries" icon={Inbox} label="Inquiries" />
          <NavItem to="/admin/users" icon={Users} label="Users" />
          <button onClick={() => signOut()} className="mt-4 flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, exact }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; exact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
      activeProps={{ className: "bg-card text-gold" }} activeOptions={{ exact }}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
