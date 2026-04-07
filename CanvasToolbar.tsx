// app/lib/pricingEngine.ts
import {
  PRICE_TIERS,
  MIN_ORDER_EUR,
  type PriceCalculation,
  type PriceTier,
} from "~/types";

export function getTierForLength(lengthCm: number): PriceTier {
  for (const tier of PRICE_TIERS) {
    if (tier.maxCm === null || lengthCm <= tier.maxCm) {
      return tier;
    }
  }
  return PRICE_TIERS[PRICE_TIERS.length - 1];
}

export function calculatePrice(usedLengthCm: number): PriceCalculation {
  const tier = getTierForLength(usedLengthCm);
  const subtotal = usedLengthCm * tier.pricePerCm;
  const meetsMinimum = subtotal >= MIN_ORDER_EUR;
  const finalPrice = Math.max(subtotal, MIN_ORDER_EUR);

  return {
    usedLengthCm,
    usedLengthM: usedLengthCm / 100,
    pricePerCm: tier.pricePerCm,
    subtotal,
    meetsMinimum,
    minimumCharge: MIN_ORDER_EUR,
    finalPrice,
    tierLabel: tier.label,
  };
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function getMinimumLengthCm(): number {
  return Math.ceil(MIN_ORDER_EUR / PRICE_TIERS[0].pricePerCm);
}

// Server-side validation — call this before accepting cart submission
export function validateCartPrice(
  usedLengthCm: number,
  clientPrice: number,
  tolerance = 0.01
): { valid: boolean; serverPrice: number; error?: string } {
  if (usedLengthCm <= 0) {
    return { valid: false, serverPrice: 0, error: "Length must be positive" };
  }

  const { finalPrice } = calculatePrice(usedLengthCm);

  if (Math.abs(finalPrice - clientPrice) > tolerance) {
    return {
      valid: false,
      serverPrice: finalPrice,
      error: `Price mismatch: expected ${finalPrice.toFixed(3)}, got ${clientPrice.toFixed(3)}`,
    };
  }

  return { valid: true, serverPrice: finalPrice };
}
