// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { addDocumentResponseHeaders } from "~/shopify.server";
import stylesheet from "~/tailwind.css?url";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  addDocumentResponseHeaders(request, new Headers());
  return json({});
}

export default function App() {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
