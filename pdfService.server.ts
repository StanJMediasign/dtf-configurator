// app/routes/app.jobs._index.tsx
// Shopify embedded admin — jobs dashboard

import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { getJobsByShop, updateJobStatus } from "~/services/jobService.server";
import { AdminJobsTable } from "~/components/admin/AdminJobsTable";
import { Page, Layout, Card, Pagination } from "@shopify/polaris";
import type { AdminJob } from "~/types";

const PAGE_SIZE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");

  const { jobs, total } = await getJobsByShop(session.shop, page, PAGE_SIZE);

  return json({
    jobs,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticate.admin(request);

  const formData = await request.formData();
  const jobId = formData.get("jobId") as string;
  const status = formData.get("status") as
    | "NEW"
    | "IN_PRODUCTION"
    | "COMPLETED"
    | "CANCELLED";

  if (!jobId || !status) {
    return json({ error: "Invalid input" }, { status: 400 });
  }

  await updateJobStatus(jobId, status);
  return json({ success: true });
}

export default function JobsIndexPage() {
  const { jobs, total, page, totalPages } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const handleStatusChange = (jobId: string, status: string) => {
    fetcher.submit({ jobId, status }, { method: "POST" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  return (
    <Page
      title="DTF Print Jobs"
      subtitle={`${total} totale orders`}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <AdminJobsTable
              jobs={jobs as AdminJob[]}
              onStatusChange={handleStatusChange}
            />
          </Card>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                hasPrevious={page > 1}
                onPrevious={() => handlePageChange(page - 1)}
                hasNext={page < totalPages}
                onNext={() => handlePageChange(page + 1)}
                label={`Pagina ${page} van ${totalPages}`}
              />
            </div>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
