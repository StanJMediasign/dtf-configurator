// app/routes/webhooks.orders-create.tsx
import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { linkJobToOrder } from "~/services/jobService.server";

export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic !== "ORDERS_CREATE") {
    return new Response("Unhandled topic", { status: 200 });
  }

  const order = payload as any;

  try {
    // Find line items with job_id property
    for (const lineItem of order.line_items || []) {
      const properties = lineItem.properties || [];
      const jobIdProp = properties.find(
        (p: { name: string; value: string }) => p.name === "_job_id"
      );

      if (jobIdProp?.value) {
        const jobId = jobIdProp.value;
        await linkJobToOrder(
          jobId,
          order.admin_graphql_api_id,
          `#${order.order_number}`,
          order.email,
          `${order.billing_address?.first_name || ""} ${order.billing_address?.last_name || ""}`.trim()
        );

        console.log(`Linked job ${jobId} to order #${order.order_number}`);
      }
    }
  } catch (error) {
    console.error("Webhook order link error:", error);
  }

  return new Response("OK", { status: 200 });
}
