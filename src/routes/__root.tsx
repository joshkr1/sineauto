import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Off the map</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:shadow-gold-glow"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sine Autos — Drive Excellence. Anywhere in the World." },
      { name: "description", content: "Sine Autos: premium global automotive hub for sales, shipping, auctions, rentals, and sourcing of vintage classics and modern luxury vehicles." },
      { name: "author", content: "Sine Autos" },
      { property: "og:title", content: "Sine Autos — Drive Excellence. Anywhere in the World." },
      { property: "og:description", content: "Sine Autos: premium global automotive hub for sales, shipping, auctions, rentals, and sourcing of vintage classics and modern luxury vehicles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sine Autos — Drive Excellence. Anywhere in the World." },
      { name: "twitter:description", content: "Sine Autos: premium global automotive hub for sales, shipping, auctions, rentals, and sourcing of vintage classics and modern luxury vehicles." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ZV9dTkehZxe9nv1do7kefpJGA2O2/social-images/social-1776456658274-f6ac9166-c681-43e7-96f3-561162f5b028.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ZV9dTkehZxe9nv1do7kefpJGA2O2/social-images/social-1776456658274-f6ac9166-c681-43e7-96f3-561162f5b028.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <WhatsAppFab />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-card)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </AuthProvider>
  );
}
