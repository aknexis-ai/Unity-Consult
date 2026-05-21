const baseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:4000/api/v1";
const adminEmail = process.env.SMOKE_ADMIN_EMAIL ?? "admin@unityconsult.local";
const adminPassword = process.env.SMOKE_ADMIN_PASSWORD ?? "Unity@12345";

let csrfToken = "";
let cookieHeader = "";
let accessToken = "";
const results = [];

function remember(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const marker = ok ? "PASS" : "FAIL";
  console.log(`${marker} ${name}${detail ? ` - ${detail}` : ""}`);
}

function updateCookies(response) {
  const setCookie = response.headers.get("set-cookie");

  if (!setCookie) {
    return;
  }

  const cookies = setCookie
    .split(/,(?=[^;,]+=)/)
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean);

  const jar = new Map(cookieHeader.split("; ").filter(Boolean).map((cookie) => cookie.split("=")));

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    jar.set(key, value);
  }

  cookieHeader = Array.from(jar.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

async function request(name, path, options = {}) {
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(cookieHeader ? { cookie: cookieHeader } : {}),
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    ...(options.unsafe ? { "x-csrf-token": csrfToken } : {}),
    ...(options.headers ?? {}),
  };
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  updateCookies(response);
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();

  return { name, response, body };
}

async function expectStatus(name, path, status, options = {}) {
  const { response, body } = await request(name, path, options);
  const ok = response.status === status;
  remember(name, ok, `HTTP ${response.status}`);

  if (!ok) {
    console.log(JSON.stringify(body, null, 2));
  }

  return body;
}

async function main() {
  const csrf = await expectStatus("auth csrf", "/auth/csrf", 200);
  csrfToken = csrf.csrfToken;

  await expectStatus("health", "/health", 200);
  await expectStatus("provider health", "/health/providers", 200);
  const services = await expectStatus("public services", "/services", 200);
  remember("service catalog has 6 PRD services", Array.isArray(services) && services.length >= 6, `${Array.isArray(services) ? services.length : 0} services`);
  await expectStatus("public service detail", "/services/web-development", 200);

  const login = await expectStatus("admin login", "/auth/login", 200, {
    method: "POST",
    unsafe: true,
    body: { email: adminEmail, password: adminPassword },
  });
  accessToken = login.tokens?.accessToken;
  remember("access token issued", Boolean(accessToken));

  const protectedGets = [
    ["auth me", "/auth/me"],
    ["users", "/users"],
    ["leads", "/leads"],
    ["orders", "/orders"],
    ["projects", "/projects"],
    ["invoices", "/invoices"],
    ["documents", "/documents"],
    ["tickets", "/tickets"],
    ["messages", "/messages"],
    ["team", "/team"],
    ["settings me", "/settings/me"],
    ["analytics admin", "/analytics/admin"],
    ["analytics portal", "/analytics/portal"],
    ["content", "/content"],
    ["audit", "/audit"],
    ["payments", "/payments"],
  ];

  for (const [name, path] of protectedGets) {
    await expectStatus(name, path, 200);
  }

  const graphql = await expectStatus("graphql aggregate query", "/graphql", 201, {
    method: "POST",
    unsafe: true,
    body: { query: "{ services { name } adminMetrics { label value } }" },
  });
  remember("graphql returns services", Array.isArray(graphql.data?.services), "services field");

  const upload = await expectStatus("document upload", "/documents/upload", 201, {
    method: "POST",
    unsafe: true,
    body: {
      name: `smoke-document-${Date.now()}.txt`,
      ownerName: "Smoke Test",
      category: "other",
      mimeType: "text/plain",
      description: "Smoke uploaded document",
      data: Buffer.from("Unity Consult document upload smoke test").toString("base64"),
    },
  });
  remember("document upload returns file url", typeof upload.fileUrl === "string" && upload.fileUrl.includes("/download"), upload.fileUrl);

  const timestamp = Date.now();
  await expectStatus("public lead create", "/leads", 201, {
    method: "POST",
    unsafe: true,
    body: {
      name: "Smoke Test Lead",
      email: `smoke.lead.${timestamp}@example.com`,
      phone: "+91 90000 00000",
      company: "Smoke Test Co",
      service: "Web Development",
      source: "Smoke Test",
      budget: "Rs 1L - Rs 3L",
    },
  });

  await expectStatus("booking workflow create", "/bookings", 201, {
    method: "POST",
    unsafe: true,
    body: {
      companyName: "Smoke Booking Co",
      contactEmail: `smoke.booking.${timestamp}@example.com`,
      contactPhone: "+91 90000 00001",
      serviceSlug: "web-development",
      serviceName: "Web Development",
      priceLabel: "Rs 99,999",
      amount: 99999,
      projectBrief: "Smoke test booking flow",
      deliveryNotes: "Smoke test delivery notes",
      requestedFields: { "Business name": "Smoke Booking Co" },
    },
  });

  await expectStatus("razorpay missing-key guard", "/payments/create-order", 503, {
    method: "POST",
    unsafe: true,
    body: { invoiceId: "000000000000000000000000", amount: 1, currency: "INR" },
  });

  const failed = results.filter((result) => !result.ok);

  if (failed.length > 0) {
    console.error(`API smoke failed: ${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`API smoke passed: ${results.length} checks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
