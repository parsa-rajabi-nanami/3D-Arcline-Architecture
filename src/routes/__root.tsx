import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

const siteUrl = "https://parsa-rajabi-nanami.github.io/3D-Arcline-Architecture/";
const socialImage = `${siteUrl}hero/hero-poster-desktop-end.jpg`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-caps text-accent">ARCLINE</p>
        <h1 className="mt-4 font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-caps text-accent">ARCLINE</p>
        <h1 className="mt-4 font-display text-4xl text-foreground">This page didn&apos;t load</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Something went wrong on our end. You can try again or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
          <Link
            to="/"
            className="border border-input px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go home
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
      { name: "theme-color", content: "#292725" },
      { name: "color-scheme", content: "light" },
      { title: "ARCLINE — Architecture, Construction & Design-Build Studio" },
      {
        name: "description",
        content:
          "ARCLINE is a premium architecture and construction studio delivering design, build, and renovation from first drawing to finished structure.",
      },
      { name: "author", content: "ARCLINE Studio" },
      { name: "robots", content: "index,follow" },
      { name: "referrer", content: "strict-origin-when-cross-origin" },
      {
        property: "og:title",
        content: "ARCLINE — Architecture, Construction & Design-Build Studio",
      },
      { property: "og:description", content: "From first drawing to finished structure." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:site_name", content: "ARCLINE" },
      { property: "og:image", content: socialImage },
      { property: "og:image:alt", content: "ARCLINE architecture and construction studio" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "ARCLINE — Architecture, Construction & Design-Build Studio",
      },
      { name: "twitter:description", content: "From first drawing to finished structure." },
      { name: "twitter:image", content: socialImage },
      { name: "twitter:image:alt", content: "ARCLINE architecture and construction studio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: siteUrl },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500&display=swap",
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[60] bg-background px-4 py-3 text-sm text-foreground focus:not-sr-only"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
