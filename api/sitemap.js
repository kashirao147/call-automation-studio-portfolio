let kvClient = null;
try {
  kvClient = require("@vercel/kv").kv;
} catch {
  kvClient = null;
}

const CONTENT_KEY = "portfolio_content_v1";

const DEFAULT_BASE_URL = "https://callautomationstudio.com";

const DEFAULT_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/ai-voice-agent-services/", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-automation-services/", changefreq: "weekly", priority: "0.9" },
  { path: "/n8n-workflow-automation/", changefreq: "weekly", priority: "0.9" },
  { path: "/retell-openai-vapi-integration/", changefreq: "weekly", priority: "0.9" },
  { path: "/appointment-booking-automation/", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-voice-agent-cost-calculator/", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-receptionist-vs-human-cost-calculator/", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-phone-answering-service-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-small-business-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-for-tradies-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-dental-receptionist-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/virtual-receptionist-perth/", changefreq: "monthly", priority: "0.8" },
  { path: "/business-process-automation-consulting-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-phone-answering-for-restaurants-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-voice-agent-vs-ai-receptionist-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/real-time-voice-ai-latency-security-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-voice-agents-customer-support-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/missed-call-automation-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-property-management-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-call-recording-transcription-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-allied-health-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-ndis-providers-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-governance-checklist-voice-ai-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-voice-agents-field-service-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-accounting-firms-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-law-firms-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-mortgage-brokers-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-insurance-brokers-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-veterinary-clinics-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-receptionist-solar-installers-australia/", changefreq: "monthly", priority: "0.8" },
  { path: "/ai-appointment-booking-automation-australia/", changefreq: "monthly", priority: "0.8" },
];

const normalizePath = (value) => {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  if (raw === "/") {
    return "/";
  }
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const isValidChangefreq = (value) => {
  const allowed = new Set([
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ]);
  return allowed.has(String(value || "").toLowerCase());
};

const normalizePriority = (value, fallback = "0.8") => {
  const num = Number(value);
  if (Number.isFinite(num) && num >= 0 && num <= 1) {
    return num.toFixed(1);
  }
  return fallback;
};

const normalizePages = (items) => {
  if (!Array.isArray(items) || !items.length) {
    return DEFAULT_PAGES;
  }

  const seen = new Set();
  const pages = [];
  for (const item of items) {
    const path = normalizePath(item && item.path);
    if (!path || seen.has(path)) {
      continue;
    }
    seen.add(path);
    pages.push({
      path,
      changefreq: isValidChangefreq(item && item.changefreq)
        ? String(item.changefreq).toLowerCase()
        : "weekly",
      priority: normalizePriority(item && item.priority),
    });
  }

  return pages.length ? pages : DEFAULT_PAGES;
};

const escapeXml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toAbsoluteUrl = (baseUrl, path) => {
  try {
    if (String(path || "").startsWith("http://") || String(path || "").startsWith("https://")) {
      return new URL(String(path)).toString();
    }
    return new URL(String(path || "/"), baseUrl).toString();
  } catch {
    return new URL("/", baseUrl).toString();
  }
};

const hasKvConfig = () =>
  Boolean(
    process.env.KV_REST_API_URL &&
      process.env.KV_REST_API_TOKEN &&
      kvClient
  );

const withTimeout = async (promise, timeoutMs = 1500) => {
  let timerId;
  const timeout = new Promise((_, reject) => {
    timerId = setTimeout(() => reject(new Error("KV timeout")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timerId);
  }
};

module.exports = async (request, response) => {
  const getBaseUrl = () => {
    const envBase = String(process.env.PUBLIC_SITE_URL || process.env.SITE_URL || "").trim();
    if (envBase.startsWith("http://") || envBase.startsWith("https://")) {
      return envBase.replace(/\/+$/, "");
    }

    const headers = request && request.headers ? request.headers : {};
    const rawHost = String(
      headers["x-forwarded-host"] ||
        headers.host ||
        ""
    ).trim();
    const host = rawHost.split(",")[0].trim();
    const proto = String(headers["x-forwarded-proto"] || "https").trim();
    if (host) {
      return `${proto}://${host}`.replace(/\/+$/, "");
    }

    return DEFAULT_BASE_URL;
  };

  const writeXml = (statusCode, xml) => {
    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");

    if (typeof response.status === "function" && typeof response.send === "function") {
      response.status(statusCode).send(xml);
      return;
    }

    response.statusCode = statusCode;
    response.end(xml);
  };

  try {
    const baseUrl = getBaseUrl();
    const now = new Date().toISOString().split("T")[0];
    let pages = DEFAULT_PAGES;

    try {
      if (hasKvConfig()) {
        const data = await withTimeout(kvClient.get(CONTENT_KEY), 1500);
        const fromKv =
          data &&
          typeof data === "object" &&
          data.repeaters &&
          Array.isArray(data.repeaters.service_pages)
            ? data.repeaters.service_pages
            : null;
        pages = normalizePages(fromKv);
      }
    } catch {
      pages = DEFAULT_PAGES;
    }

    const body = pages
      .map((item) => {
        const loc = toAbsoluteUrl(baseUrl, item.path);
        return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

    writeXml(200, xml);
  } catch {
    const baseUrl = getBaseUrl();
    const fallbackNow = new Date().toISOString().split("T")[0];
    const fallbackBody = DEFAULT_PAGES.map(
      (item) => `  <url>
    <loc>${escapeXml(toAbsoluteUrl(baseUrl, item.path))}</loc>
    <lastmod>${fallbackNow}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    ).join("\n");

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fallbackBody}
</urlset>`;
    writeXml(200, fallbackXml);
  }
};
