const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const loadDotEnv = () => {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
};

loadDotEnv();

const port = Number(process.env.PORT || 3000);
const root = __dirname;
const contentFilePath = path.join(root, "data", "content.json");

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 180;
const MAX_COMPANY_LENGTH = 180;
const MAX_PHONE_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000
);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitStore = new Map();

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://callautomationstudio.com",
];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getAllowedOrigins = () => {
  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
};

const setSecurityHeaders = (response, isStatic = false) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  if (isStatic) {
    response.setHeader(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
        "connect-src 'self' https://api.resend.com https://www.google-analytics.com https://region1.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; ")
    );
  } else {
    response.setHeader("Cache-Control", "no-store");
  }
};

const sendJson = (response, statusCode, body) => {
  setSecurityHeaders(response);
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
};

const ensureContentDir = () => {
  const dir = path.dirname(contentFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const normalizeContentPayload = (raw) => {
  if (!raw || typeof raw !== "object") {
    return { content: {}, repeaters: {} };
  }

  return {
    content: raw.content && typeof raw.content === "object" ? raw.content : {},
    repeaters:
      raw.repeaters && typeof raw.repeaters === "object" ? raw.repeaters : {},
  };
};

const readContentData = () => {
  try {
    if (!fs.existsSync(contentFilePath)) {
      return { content: {}, repeaters: {} };
    }
    const raw = fs.readFileSync(contentFilePath, "utf8");
    return normalizeContentPayload(raw ? JSON.parse(raw) : {});
  } catch {
    return { content: {}, repeaters: {} };
  }
};

const writeContentData = (payload) => {
  ensureContentDir();
  const normalized = normalizeContentPayload(payload);
  fs.writeFileSync(contentFilePath, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
};

const parseJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });

const getClientIp = (request) => {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return request.socket?.remoteAddress || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  for (const [key, meta] of rateLimitStore.entries()) {
    if (meta.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const existing = rateLimitStore.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return existing.count > RATE_LIMIT_MAX;
};

const validateContactPayload = (payload) => {
  const parsed = {
    full_name: String(payload.full_name || "").trim(),
    email: String(payload.email || "").trim(),
    company: String(payload.company || "").trim(),
    phone: String(payload.phone || "").trim(),
    message: String(payload.message || "").trim(),
    website: String(payload.website || "").trim(),
  };

  if (parsed.website) {
    return { ok: true, bot: true, payload: parsed };
  }

  if (!parsed.full_name || !parsed.email || !parsed.message) {
    return { ok: false, error: "Required fields are missing." };
  }

  if (!EMAIL_REGEX.test(parsed.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (
    parsed.full_name.length > MAX_NAME_LENGTH ||
    parsed.email.length > MAX_EMAIL_LENGTH ||
    parsed.company.length > MAX_COMPANY_LENGTH ||
    parsed.phone.length > MAX_PHONE_LENGTH ||
    parsed.message.length > MAX_MESSAGE_LENGTH
  ) {
    return { ok: false, error: "Input exceeds allowed length." };
  }

  return { ok: true, payload: parsed };
};

const sendContactEmail = async (payload) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const toEmail = process.env.CONTACT_TO || "kashigamedev@gmail.com";
  const fromEmail = process.env.RESEND_FROM || "AI Voice Portfolio <onboarding@resend.dev>";
  if (!toEmail) {
    throw new Error("CONTACT_TO is not configured");
  }
  if (!fromEmail) {
    throw new Error("RESEND_FROM is not configured");
  }

  const fullName = escapeHtml(payload.full_name || "Unknown");
  const email = escapeHtml(payload.email || "Not provided");
  const company = escapeHtml(payload.company || "Not provided");
  const phone = escapeHtml(payload.phone || "Not provided");
  const message = escapeHtml(payload.message || "");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: payload.email,
        subject: `New Inquiry from ${payload.full_name}`,
        html: `
          <h2>New Portfolio Contact Request</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message.replaceAll("\n", "<br/>")}</p>
        `,
      }),
    });

    const resendData = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      throw new Error("Email provider failed");
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

const server = http.createServer((request, response) => {
  const rawUrl = request.url || "/";
  const url = new URL(rawUrl, `http://localhost:${port}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const isContactEndpoint =
    rawUrl.startsWith("/api/contact") || requestedPath === "/api/contact";
  const isContentEndpoint =
    rawUrl.startsWith("/api/content") || requestedPath === "/api/content";
  const isApiRequest = rawUrl.startsWith("/api/") || requestedPath.startsWith("/api/");

  if (
    request.method === "GET" &&
    /^\/sitemap(?:[-_a-z0-9]*)?\.xml\/?$/i.test(requestedPath)
  ) {
    const xml = fs.readFileSync(
      path.join(__dirname, "sitemap-20260416.xml"),
      "utf8"
    );
    setSecurityHeaders(response);
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
    response.end(xml);
    return;
  }

  if (request.method === "OPTIONS" && isApiRequest) {
    setSecurityHeaders(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "POST" && isContactEndpoint) {
    const origin = String(request.headers.origin || "").toLowerCase();
    const allowedOrigins = getAllowedOrigins();
    if (origin && !allowedOrigins.includes(origin)) {
      sendJson(response, 403, { error: "Forbidden origin." });
      return;
    }

    const contentType = String(request.headers["content-type"] || "");
    if (!contentType.includes("application/json")) {
      sendJson(response, 415, { error: "Unsupported media type." });
      return;
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      sendJson(response, 429, { error: "Too many requests. Please try again later." });
      return;
    }

    parseJsonBody(request)
      .then(async (payload) => {
        const validation = validateContactPayload(payload);
        if (!validation.ok) {
          sendJson(response, 400, { error: validation.error });
          return;
        }

        if (validation.bot) {
          sendJson(response, 200, { ok: true });
          return;
        }

        await sendContactEmail(validation.payload);
        sendJson(response, 200, { ok: true });
      })
      .catch((error) => {
        const isClientError =
          error.message === "Invalid JSON" || error.message === "Payload too large";
        if (!isClientError) {
          console.error("Contact endpoint error:", error);
        }
        sendJson(response, isClientError ? 400 : 500, {
          error: isClientError
            ? error.message
            : "Message could not be sent right now. Please try again in a moment.",
        });
      });
    return;
  }

  if (isContentEndpoint) {
    if (request.method === "GET") {
      sendJson(response, 200, { ok: true, data: readContentData() });
      return;
    }

    if (request.method === "POST") {
      const requiredAdminKey = String(process.env.ADMIN_PANEL_KEY || "").trim();
      const providedAdminKey = String(request.headers["x-admin-key"] || "").trim();

      if (requiredAdminKey && providedAdminKey !== requiredAdminKey) {
        sendJson(response, 401, { error: "Unauthorized." });
        return;
      }

      parseJsonBody(request)
        .then((payload) => {
          const data = writeContentData(payload);
          sendJson(response, 200, { ok: true, data });
        })
        .catch((error) => {
          const isClientError =
            error.message === "Invalid JSON" || error.message === "Payload too large";
          sendJson(response, isClientError ? 400 : 500, {
            error: isClientError ? error.message : "Failed to save content.",
          });
        });
      return;
    }

    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  if (isApiRequest) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  const safeRelativePath = path
    .normalize(requestedPath)
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");

  if (safeRelativePath.startsWith(".") || safeRelativePath.includes("..")) {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const candidatePaths =
    safeRelativePath === ""
      ? [path.join(root, "index.html")]
      : [
          path.join(root, safeRelativePath),
          path.join(root, `${safeRelativePath}.html`),
          path.join(root, safeRelativePath, "index.html"),
        ];

  const tryRead = (index) => {
    if (index >= candidatePaths.length) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }

        setSecurityHeaders(response, true);
        response.writeHead(200, { "Content-Type": types[".html"] });
        response.end(fallback);
      });
      return;
    }

    const currentPath = candidatePaths[index];
    fs.readFile(currentPath, (error, content) => {
      if (error) {
        tryRead(index + 1);
        return;
      }

      const ext = path.extname(currentPath).toLowerCase();
      setSecurityHeaders(response, true);
      response.writeHead(200, {
        "Content-Type": types[ext] || "application/octet-stream",
      });
      response.end(content);
    });
  };

  tryRead(0);
});

server.listen(port, () => {
  console.log(`Portfolio preview running at http://localhost:${port}`);
});
