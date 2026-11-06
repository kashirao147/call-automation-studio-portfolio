const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

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
  "https://callautomationstudio.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const getAllowedOrigins = () => {
  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_ALLOWED_ORIGINS;
};

const setSecurityHeaders = (response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
};

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

const parsePayload = (request) => {
  const body = request.body && typeof request.body === "object" ? request.body : {};
  return {
    full_name: String(body.full_name || "").trim(),
    email: String(body.email || "").trim(),
    company: String(body.company || "").trim(),
    phone: String(body.phone || "").trim(),
    message: String(body.message || "").trim(),
    website: String(body.website || "").trim(),
  };
};

module.exports = async (request, response) => {
  setSecurityHeaders(response);

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const origin = String(request.headers.origin || "").toLowerCase();
  const allowedOrigins = getAllowedOrigins();
  if (origin && !allowedOrigins.includes(origin)) {
    response.status(403).json({ error: "Forbidden origin." });
    return;
  }

  const contentType = String(request.headers["content-type"] || "");
  if (!contentType.includes("application/json")) {
    response.status(415).json({ error: "Unsupported media type." });
    return;
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    response.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }

  const payload = parsePayload(request);

  // Honeypot field: bots often fill hidden inputs.
  if (payload.website) {
    response.status(200).json({ ok: true });
    return;
  }

  if (!payload.full_name || !payload.email || !payload.message) {
    response.status(400).json({ error: "Required fields are missing." });
    return;
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    response.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  if (
    payload.full_name.length > MAX_NAME_LENGTH ||
    payload.email.length > MAX_EMAIL_LENGTH ||
    payload.company.length > MAX_COMPANY_LENGTH ||
    payload.phone.length > MAX_PHONE_LENGTH ||
    payload.message.length > MAX_MESSAGE_LENGTH
  ) {
    response.status(400).json({ error: "Input exceeds allowed length." });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    response.status(500).json({ error: "RESEND_API_KEY is not configured." });
    return;
  }

  const toEmail = process.env.CONTACT_TO || "kashigamedev@gmail.com";
  const fromEmail = process.env.RESEND_FROM || "AI Voice Portfolio <onboarding@resend.dev>";
  if (!toEmail) {
    response.status(500).json({ error: "CONTACT_TO is not configured." });
    return;
  }
  if (!fromEmail) {
    response.status(500).json({ error: "RESEND_FROM is not configured." });
    return;
  }

  const fullName = escapeHtml(payload.full_name || "Unknown");
  const email = escapeHtml(payload.email || "Not provided");
  const company = escapeHtml(payload.company || "Not provided");
  const phone = escapeHtml(payload.phone || "Not provided");
  const message = escapeHtml(payload.message || "");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
    clearTimeout(timeoutId);

    const resendData = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      response.status(500).json({ error: "Message could not be sent right now." });
      return;
    }

    response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    response.status(500).json({ error: "Message could not be sent right now." });
  }
};
