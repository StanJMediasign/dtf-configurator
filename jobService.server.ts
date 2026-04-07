// app/routes/app._index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { prisma } from "~/lib/prisma.server";
import { Page, Layout, Card, Text, BlockStack, InlineGrid } from "@shopify/polaris";
import { formatEur } from "~/lib/pricingEngine";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const [totalJobs, newJobs, inProductionJobs, completedJobs, recentJobs] =
    await Promise.all([
      prisma.job.count({ where: { shop: session.shop } }),
      prisma.job.count({ where: { shop: session.shop, status: "NEW" } }),
      prisma.job.count({ where: { shop: session.shop, status: "IN_PRODUCTION" } }),
      prisma.job.count({ where: { shop: session.shop, status: "COMPLETED" } }),
      prisma.job.findMany({
        where: { shop: session.shop },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          usedLengthCm: true,
          subtotalExVat: true,
          createdAt: true,
        },
      }),
    ]);

  const totalRevenue = await prisma.job.aggregate({
    where: { shop: session.shop, status: { not: "CANCELLED" } },
    _sum: { subtotalExVat: true },
  });

  return json({
    shop: session.shop,
    stats: {
      total: totalJobs,
      new: newJobs,
      inProduction: inProductionJobs,
      completed: completedJobs,
      revenue: totalRevenue._sum.subtotalExVat ?? 0,
    },
    recentJobs,
  });
}

export default function AppIndex() {
  const { shop, stats, recentJobs } = useLoaderData<typeof loader>();

  return (
    <Page title="DTF Gang Sheet Dashboard" subtitle={shop}>
      <Layout>
        <Layout.Section>
          <InlineGrid columns={["oneThird", "oneThird", "oneThird"]} gap="400">
            <StatCard
              title="Nieuwe jobs"
              value={String(stats.new)}
              color="blue"
            />
            <StatCard
              title="In productie"
              value={String(stats.inProduction)}
              color="amber"
            />
            <StatCard
              title="Voltooid"
              value={String(stats.completed)}
              color="green"
            />
          </InlineGrid>
        </Layout.Section>

        <Layout.Section>
          <InlineGrid columns={["oneHalf", "oneHalf"]} gap="400">
            <StatCard
              title="Totale jobs"
              value={String(stats.total)}
              color="gray"
            />
            <StatCard
              title="Totale omzet (excl. BTW)"
              value={formatEur(stats.revenue)}
              color="green"
            />
          </InlineGrid>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <div className="flex justify-between items-center px-4 pt-2">
                <Text variant="headingMd" as="h2">Recente jobs</Text>
                <Link to="/app/jobs" className="text-sm text-blue-600 hover:underline">
                  Alle jobs bekijken →
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentJobs.length === 0 ? (
                  <p className="text-sm text-gray-400 px-4 py-6 text-center">
                    Nog geen jobs
                  </p>
                ) : (
                  recentJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/app/jobs/${job.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {job.orderNumber || `Job ${job.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString("nl-NL")} ·{" "}
                          {job.usedLengthCm.toFixed(0)} cm
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-800">
                          {formatEur(job.subtotalExVat)}
                        </span>
                        <StatusBadge status={job.status} />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "blue" | "amber" | "green" | "gray";
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    green: "bg-green-50 border-green-200 text-green-800",
    gray: "bg-gray-50 border-gray-200 text-gray-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    IN_PRODUCTION: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    NEW: "Nieuw",
    IN_PRODUCTION: "In productie",
    COMPLETED: "Voltooid",
    CANCELLED: "Geannuleerd",
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}
