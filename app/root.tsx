import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";

import type { Route } from "./+types/root";
import "./app.css";
import { applyTheme, isStoryPath, readStoredTheme, themeBootScript } from "~/lib/theme";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "preload", as: "font", type: "font/woff2", href: geistFont, crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();

  // Keep the paper theme confined to the story, including client-side navigation.
  useEffect(() => {
    applyTheme(isStoryPath(pathname) ? "story" : readStoredTheme());
  }, [pathname]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Something broke";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    heading = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    details =
      error.status === 404 ? "That page does not exist." : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main id="main" className="container-x grid min-h-dvh place-content-center gap-4 py-24">
      <p className="eyebrow">Error</p>
      <h1 className="font-serif text-5xl italic">{heading}</h1>
      <p className="text-muted">{details}</p>
      <div className="flex gap-3">
        <Link to="/" className="btn btn-primary">
          Recruiter view
        </Link>
        <Link to="/story" className="btn btn-ghost">
          Creative version
        </Link>
      </div>
      {stack && (
        <pre className="mt-6 w-full overflow-x-auto rounded-xl border border-line p-4 text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
