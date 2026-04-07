// app/routes/proxy.tsx
// Shopify App Proxy route: served at /apps/dtf-configurator on the storefront
// This is the public-facing configurator page embedded in Shopify storefront

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { unauthenticated } from "~/shopify.server";
import { DTFConfigurator } from "~/components/DTFConfigurator";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await unauthenticated.appProxy(request);

  const url = new URL(request.url);
  const shop = session?.shop || url.searchParams.get("shop") || "";

  // Get variant ID from env or a shop metafield in production
  const variantId = process.env.DTF_SHOPIFY_VARIANT_ID || "";

  return json({
    shop,
    variantId,
    sheetWidthCm: 55,
    currency: "EUR",
    locale: "nl-NL",
  });
}

export default function ProxyRoute() {
  const { shop, variantId, sheetWidthCm, currency, locale } =
    useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <DTFConfigurator
        shop={shop}
        variantId={variantId}
        sheetWidthCm={sheetWidthCm}
        currency={currency}
        locale={locale}
      />
    </div>
  );
}
