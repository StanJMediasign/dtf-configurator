// prisma/seed.ts
import { PrismaClient, JobStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample jobs for development
  const job1 = await prisma.job.create({
    data: {
      shop: "dev-store.myshopify.com",
      orderId: "gid://shopify/Order/1001",
      orderNumber: "#1001",
      customerEmail: "customer@example.com",
      customerName: "Jan de Vries",
      status: JobStatus.NEW,
      sheetWidthCm: 55,
      usedLengthCm: 120,
      trimMarginMm: 3,
      subtotalExVat: 17.88,
      pricingTier: "0-499",
      layoutJson: {
        items: [],
        canvasWidth: 550,
        canvasHeight: 1200,
      },
      items: {
        create: [
          {
            fileUrl: "https://placehold.co/400x400/png",
            fileName: "logo.png",
            x: 10,
            y: 10,
            width: 150,
            height: 150,
            rotation: 0,
            dpi: 300,
            fileSize: 45000,
            mimeType: "image/png",
          },
          {
            fileUrl: "https://placehold.co/200x300/png",
            fileName: "design2.png",
            x: 200,
            y: 10,
            width: 100,
            height: 150,
            rotation: 0,
            dpi: 300,
            fileSize: 32000,
            mimeType: "image/png",
          },
        ],
      },
    },
  });

  const job2 = await prisma.job.create({
    data: {
      shop: "dev-store.myshopify.com",
      orderId: "gid://shopify/Order/1002",
      orderNumber: "#1002",
      customerEmail: "another@example.com",
      customerName: "Maria Jansen",
      status: JobStatus.IN_PRODUCTION,
      sheetWidthCm: 55,
      usedLengthCm: 350,
      trimMarginMm: 3,
      subtotalExVat: 52.15,
      pricingTier: "0-499",
      items: { create: [] },
    },
  });

  console.log(`Created jobs: ${job1.id}, ${job2.id}`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
