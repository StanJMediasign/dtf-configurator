/**
 * Pinkprint Supplier Hub: uniforme leveranciers-interface (schets, geen werkende code).
 *
 * Elke leverancier (Probo, PF Concept, leverancier 3, intern DTF) implementeert
 * dit contract. De rest van de hub kent alleen deze interface.
 */

export type SupplierCode = "probo" | "pfconcept" | "araco" | "internal";

export type PricingModel =
  | "configured" // prijs pas bekend na live configuratie (Probo)
  | "tiered"; // staffel + decoratie + instelkosten, vooraf berekenbaar (PF Concept, Araco)

export interface SupplierCapabilities {
  pricingModel: PricingModel;
  minOrderQuantity: boolean; // MOQ per artikel van toepassing
  whiteLabelShipping: boolean; // neutraal verzenden aan eindklant
  proofApproval: boolean; // digitale proof verplicht voor productie
  statusPush: "webhook" | "polling" | "none";
  testOrders: boolean;
  /** "api": order via API (Probo, Araco); "manual": hub bereidt de order voor, admin verstuurt (fallback). */
  orderChannel: "api" | "manual";
}

export interface CatalogItem {
  supplierSku: string;
  title: string;
  category: string;
  attributes: Record<string, string | number | boolean>;
  images: string[];
  /** Voor "configured": schema van de configuratiestappen. Voor "tiered": varianten en printcodes. */
  configSchema?: unknown;
  moq?: number;
}

export interface PriceRequest {
  supplierSku: string;
  quantity: number;
  /** Probo: afmeting, materiaal, afwerking. PF: printcode, aantal kleuren, positie. */
  options: Record<string, string | number>;
  deliveryCountry: string;
}

export interface PriceQuote {
  unitCost: number;
  setupCost: number;
  shippingCost: number;
  currency: "EUR";
  /** Verwijzing naar de leverancierscalculatie, bv. Probo calculation_id. */
  reference?: string;
  leadTimeDays?: number;
  validUntil?: Date;
}

export interface ArtworkFile {
  url: string; // publieke of pre-signed URL (S3)
  position?: string; // PF: printpositie; Probo: n.v.t.
  preflight?: { dpi?: number; widthMm?: number; heightMm?: number; colors?: number };
}

export interface SubOrderRequest {
  pinkprintOrderRef: string;
  lines: Array<{
    supplierSku: string;
    quantity: number;
    options: Record<string, string | number>;
    priceReference?: string;
    artwork: ArtworkFile[];
  }>;
  shipTo: {
    name: string;
    company?: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    email?: string;
    phone?: string;
  };
  test?: boolean;
}

export type PinkprintStatus =
  | "received"
  | "awaiting_proof"
  | "in_production"
  | "shipped"
  | "delivered"
  | "on_hold"
  | "error";

export interface StatusUpdate {
  supplierOrderRef: string;
  status: PinkprintStatus;
  rawStatus: string;
  trackingUrl?: string;
  message?: string;
  at: Date;
}

export interface SupplierAdapter {
  code: SupplierCode;
  capabilities: SupplierCapabilities;

  /** Volledige catalogus ophalen (Probo: /products; PF: XML-feeds). */
  syncCatalog(): AsyncIterable<CatalogItem>;

  /** Voorraad/beschikbaarheid, waar van toepassing. */
  getAvailability?(supplierSkus: string[]): Promise<Record<string, number | "unlimited">>;

  /** Prijs opvragen of berekenen. */
  quote(req: PriceRequest): Promise<PriceQuote>;

  /** Leverancierspecifieke controle voor we een order plaatsen. */
  validate(req: SubOrderRequest): Promise<{ ok: boolean; problems: string[] }>;

  /** Order plaatsen en het leveranciersordernummer teruggeven. */
  placeOrder(req: SubOrderRequest): Promise<{ supplierOrderRef: string }>;

  /** Status ophalen (polling) of een binnenkomende webhook vertalen. */
  getStatus(supplierOrderRef: string): Promise<StatusUpdate>;
  parseWebhook?(headers: Record<string, string>, body: unknown): Promise<StatusUpdate | null>;
}
