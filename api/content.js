let kvClient = null;
try {
  kvClient = require("@vercel/kv").kv;
} catch {
  kvClient = null;
}

const CONTENT_KEY = "portfolio_content_v1";
const GET_CACHE_TTL_MS = 60 * 1000;
const memoryCache = {
  data: null,
  ts: 0,
};

const setSecurityHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
};

const getAllowedOrigins = () => {
  const defaults = [
    "https://callautomationstudio.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return configured.length ? configured : defaults;
};

const normalizeData = (raw) => {
  if (!raw || typeof raw !== "object") {
    return { content: {}, repeaters: {} };
  }
  return {
    content:
      raw.content && typeof raw.content === "object" ? raw.content : {},
    repeaters:
      raw.repeaters && typeof raw.repeaters === "object" ? raw.repeaters : {},
  };
};

const hasKvConfig = () =>
  Boolean(
    process.env.KV_REST_API_URL &&
      process.env.KV_REST_API_TOKEN &&
      kvClient
  );

module.exports = async (request, response) => {
  setSecurityHeaders(response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  const origin = String(request.headers.origin || "").toLowerCase();
  const allowedOrigins = getAllowedOrigins();
  if (origin && !allowedOrigins.includes(origin)) {
    response.status(403).json({ error: "Forbidden origin." });
    return;
  }

  if (!hasKvConfig()) {
    response.status(503).json({
      error:
        "Cloud storage is not configured. Connect Vercel KV and set KV environment variables.",
    });
    return;
  }

  try {
    if (request.method === "GET") {
      const now = Date.now();
      const cacheFresh =
        memoryCache.data && now - memoryCache.ts < GET_CACHE_TTL_MS;

      const data = cacheFresh
        ? memoryCache.data
        : normalizeData(await kvClient.get(CONTENT_KEY));

      if (!cacheFresh) {
        memoryCache.data = data;
        memoryCache.ts = now;
      }

      response.setHeader(
        "Cache-Control",
        "public, max-age=30, s-maxage=60, stale-while-revalidate=300"
      );
      response.status(200).json({ ok: true, data });
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed." });
      return;
    }

    const requiredAdminKey = String(process.env.ADMIN_PANEL_KEY || "").trim();
    if (!requiredAdminKey) {
      response.status(500).json({ error: "ADMIN_PANEL_KEY is not configured." });
      return;
    }

    const providedAdminKey = String(request.headers["x-admin-key"] || "").trim();
    if (providedAdminKey !== requiredAdminKey) {
      response.status(401).json({ error: "Unauthorized." });
      return;
    }

    const payload = normalizeData(request.body || {});
    await kvClient.set(CONTENT_KEY, payload);
    memoryCache.data = payload;
    memoryCache.ts = Date.now();
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Content API error:", error);
    response.status(500).json({ error: "Failed to process content request." });
  }
};
