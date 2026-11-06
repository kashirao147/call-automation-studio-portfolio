const crypto = require("crypto");

let put = null;
try {
  ({ put } = require("@vercel/blob"));
} catch {
  put = null;
}

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

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

const normalizeFileName = (rawName) => {
  const cleaned = String(rawName || "logo-image")
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .trim();
  return cleaned || `logo-${Date.now()}.png`;
};

const parseBase64 = (raw) => {
  const value = String(raw || "").trim();
  if (!value) {
    return null;
  }

  const dataUrlMatch = value.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      base64Data: dataUrlMatch[2],
    };
  }

  return {
    mimeType: "",
    base64Data: value,
  };
};

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

  if (!put) {
    response.status(500).json({
      error:
        "Blob client is not available. Install @vercel/blob and redeploy.",
    });
    return;
  }

  try {
    const payload = request.body || {};
    const incoming = parseBase64(payload.base64Data);
    if (!incoming || !incoming.base64Data) {
      response.status(400).json({ error: "Missing image data." });
      return;
    }

    const mimeType = String(payload.mimeType || incoming.mimeType || "").toLowerCase();
    if (!mimeType.startsWith("image/")) {
      response.status(400).json({ error: "Only image uploads are allowed." });
      return;
    }

    const fileBuffer = Buffer.from(incoming.base64Data, "base64");
    if (!fileBuffer.length) {
      response.status(400).json({ error: "Invalid image data." });
      return;
    }
    if (fileBuffer.length > MAX_IMAGE_BYTES) {
      response.status(413).json({ error: "Image too large. Max size is 6MB." });
      return;
    }

    const fileName = normalizeFileName(payload.fileName);
    const fileKey = `logos/${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${fileName}`;

    const blob = await put(fileKey, fileBuffer, {
      access: "public",
      contentType: mimeType,
      addRandomSuffix: false,
      token: String(process.env.BLOB_READ_WRITE_TOKEN || "").trim() || undefined,
    });

    response.status(200).json({
      ok: true,
      file: {
        id: blob.pathname || fileKey,
        name: fileName,
        mimeType,
        size: fileBuffer.length,
        webViewLink: blob.url,
        imageUrl: blob.url,
        directUrl: blob.downloadUrl || blob.url,
      },
    });
  } catch (error) {
    console.error("Blob upload API error:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to upload image to Blob storage.";
    response.status(500).json({ error: message });
  }
};

