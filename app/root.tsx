import type { ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { SITE_NAME } from "~/meta";
import { APPLY_SETTINGS_SCRIPT } from "~/settings/settings";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "alternate", type: "application/rss+xml", title: `Blog · ${SITE_NAME}`, href: "/rss.xml" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    // The script below sets the visitor's theme on <html> before React sees the page, so React leaves those
    // attributes alone instead of warning that they differ from the pre-rendered HTML.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* The stored appearance settings, applied before the first paint so the page never shows the wrong theme.
            Its text differs between the pre-rendered and the browser build (minified), which is harmless. */}
        <script dangerouslySetInnerHTML={{ __html: APPLY_SETTINGS_SCRIPT }} suppressHydrationWarning />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Error";
  let details = "Something went wrong.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "This page does not exist." : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="error-page">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre>
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
