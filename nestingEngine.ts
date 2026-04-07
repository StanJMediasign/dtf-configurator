// app/routes/app.jobs.$jobId.tsx
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { getJob, updateJobStatus } from "~/services/jobService.server";
import { generatePrintReadyPNG } from "~/services/previewService.server";
import { AdminJobDetail } from "~/components/admin/AdminJobDetail";
import { Page, Badge, Button } from "@shopify/polaris";
import { formatEur } from "~/lib/pricingEngine";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticate.admin(request);
  const job = await getJob(params.jobId!);
  if (!job) throw new Response("Job not found", { status: 404 });
  return json({ job });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "updateStatus") {
    const status = formData.get("status") as
      | "NEW"
      | "IN_PRODUCTION"
      | "COMPLETED"
      | "CANCELLED";
    await updateJobStatus(params.jobId!, status);
    return json({ success: true });
  }

  if (intent === "downloadPrint") {
    const job = await getJob(params.jobId!);
    if (!job) return json({ error: "Job not found" }, { status: 404 });

    const buffer = await generatePrintReadyPNG(
      job.items as any,
      job.usedLengthCm
    );

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="dtf-job-${params.jobId}.png"`,
      },
    });
  }

  return json({ error: "Unknown intent" }, { status: 400 });
}

export default function JobDetailPage() {
  const { job } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleStatusChange = (status: string) => {
    fetcher.submit({ intent: "updateStatus", status }, { method: "POST" });
  };

  const statusColor: Record<string, "info" | "warning" | "success" | "critical"> = {
    NEW: "info",
    IN_PRODUCTION: "warning",
    COMPLETED: "success",
    CANCELLED: "critical",
  };

  return (
    <Page
      backAction={{ content: "Jobs", url: "/app/jobs" }}
      title={`Job ${job.id.slice(0, 8)}...`}
      subtitle={job.orderNumber ? `Order ${job.orderNumber}` : "Geen order"}
      titleMetadata={
        <Badge tone={statusColor[job.status] || "info"}>{job.status}</Badge>
      }
      primaryAction={
        <fetcher.Form method="POST">
          <input type="hidden" name="intent" value="downloadPrint" />
          <Button submit variant="primary">
            Download Print PNG
          </Button>
        </fetcher.Form>
      }
    >
      <AdminJobDetail job={job as any} onStatusChange={handleStatusChange} />
    </Page>
  );
}
