import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "Inventory" },
  { to: "/services", label: "Services" },
  { to: "/auctions", label: "Auctions" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Sine Autos logo"
            className="h-10 w-10 rounded-sm object-cover transition-transform group-hover:scale-105"
          />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold tracking-wide text-foreground">SINE AUTOS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Drive Excellence</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm border border-border bg-card/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-gold">
                <UserIcon className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user.email?.split("@")[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4 text-gold" /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/auth"
              className="rounded-sm border border-gold/40 bg-transparent px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gold transition-all hover:bg-gold hover:text-charcoal"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block py-2 text-sm uppercase tracking-wider text-gold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="py-2 text-sm uppercase tracking-wider text-muted-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-block rounded-sm border border-gold/40 px-4 py-2 text-sm uppercase tracking-wider text-gold"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
