import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  centered = true,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <section className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className={`mb-14 ${centered ? "text-center" : ""}`}>
            {eyebrow && (
              <div className={`mb-4 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
                <span className="h-px w-8 bg-gold" />
              </div>
            )}
            {title && (
              <h2 className="font-display text-4xl font-semibold text-foreground sm:text-5xl text-balance">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-4 text-base text-muted-foreground sm:text-lg text-balance ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
