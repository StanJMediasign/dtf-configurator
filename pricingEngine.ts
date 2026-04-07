// app/routes/api.cart.tsx
// Server-side cart job creation — called from configurator before /cart/add.js

import { json, type ActionFunctionArgs } from "@remix-run/node";
import { createJob } from "~/services/jobService.server";
import { validateCartPrice, calculatePrice } from "~/lib/pricingEngine";
import type { CartPayload } from "~/types";
import { z } from "zod";

const CartPayloadSchema = z.object({
  shop: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string(),
      fileId: z.string(),
      fileUrl: z.string().url(),
      previewUrl: z.string(),
      name: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
      rotation: z.number(),
      widthCm: z.number().positive(),
      heightCm: z.number().positive(),
      dpi: z.number().positive(),
      scaleX: z.number(),
      scaleY: z.number(),
      isSelected: z.boolean(),
      opacity: z.number(),
    })
  ),
  usedLengthCm: z.number().positive(),
  trimMarginMm: z.number().min(0).max(10),
  sheetWidthCm: z.number(),
  clientPrice: z.number().positive(),
});

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CartPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    shop,
    items,
    usedLengthCm,
    trimMarginMm,
    sheetWidthCm,
    clientPrice,
  } = parsed.data;

  // Server-side price validation
  const priceValidation = validateCartPrice(usedLengthCm, clientPrice);
  if (!priceValidation.valid) {
    console.warn("Price mismatch:", priceValidation.error);
    // Use server price — don't reject, just correct
  }

  const priceCalc = calculatePrice(usedLengthCm);

  if (items.length === 0) {
    return json({ error: "No items in layout" }, { status: 400 });
  }

  if (usedLengthCm < 1) {
    return json({ error: "Layout is too small" }, { status: 400 });
  }

  try {
    const layoutJson = {
      items,
      sheetWidthCm,
      usedLengthCm,
      trimMarginMm,
      generatedAt: new Date().toISOString(),
    };

    const jobId = await createJob({
      shop,
      items: items as any,
      usedLengthCm,
      trimMarginMm,
      subtotalExVat: priceCalc.finalPrice,
      pricingTier: priceCalc.tierLabel,
      layoutJson,
    });

    return json({
      success: true,
      jobId,
      serverPrice: priceCalc.finalPrice,
      usedLengthCm,
      tierLabel: priceCalc.tierLabel,
    });
  } catch (error) {
    console.error("Job creation error:", error);
    return json(
      { error: "Failed to create job. Please try again." },
      { status: 500 }
    );
  }
}
