const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--sample") {
      args.sample = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }
  return args;
}

function loadBody(args) {
  if (args["body-file"]) {
    const filePath = path.resolve(process.cwd(), args["body-file"]);
    return fs.readFileSync(filePath, "utf8");
  }

  if (args.body) {
    return String(args.body).replace(/\\n/g, "\n");
  }

  const fallback = process.env.EMAIL_BODY;
  if (!fallback) {
    throw new Error("Provide EMAIL_BODY, --body, or --body-file.");
  }

  return fallback.replace(/`n/g, "\n");
}

async function main() {
  const args = parseArgs(process.argv);
  const smtpHost = requireEnv("SMTP_HOST");
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const smtpUser = requireEnv("SMTP_USER");
  const smtpPass = requireEnv("SMTP_PASS");
  const emailFrom = requireEnv("EMAIL_FROM");
  const emailFromName = process.env.EMAIL_FROM_NAME?.trim() || "Playloop";

  const sampleMode = Boolean(args.sample);
  const to = args.to || process.env.EMAIL_TO;
  const subject = args.subject || process.env.EMAIL_SUBJECT || "Playloop automated email";
  const body = sampleMode
    ? "Salam,\n\nYeh sample email Playloop automation setup se bheji gayi hai.\n\nRegards,\nPlayloop"
    : loadBody(args);

  if (!to) {
    throw new Error("Provide EMAIL_TO or --to.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.verify();

  const info = await transporter.sendMail({
    from: `${emailFromName} <${emailFrom}>`,
    sender: smtpUser,
    to,
    subject,
    text: body
  });

  console.log("Email sent successfully.");
  console.log(`From: ${emailFrom}`);
  console.log(`Authenticated as: ${smtpUser}`);
  console.log(`To: ${to}`);
  console.log(`Message ID: ${info.messageId}`);
}

main().catch((error) => {
  console.error("Failed to send email.");
  console.error(error.message);
  process.exitCode = 1;
});
