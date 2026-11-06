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

function buildBody(lead) {
  if (lead.hasHistory) {
    return `Hi ${lead.name},

Just following up on my previous email about the personalized birthday game.

If you'd like, I can share a few example ideas and the next steps to get everything started.

Best,
Kashif
Playloop.co`;
  }

  return `Hi ${lead.name},

Just checking in regarding your interest in a personalized birthday game.

If you'd like, I can send over a few example ideas and the next steps to get started.

Best,
Kashif
Playloop.co`;
}

async function main() {
  const leadsPath = path.join(__dirname, "followup-leads.json");
  const leads = JSON.parse(fs.readFileSync(leadsPath, "utf8"));

  const transporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || "587"),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: requireEnv("SMTP_USER"),
      pass: requireEnv("SMTP_PASS")
    }
  });

  await transporter.verify();

  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Playloop";
  const fromEmail = requireEnv("EMAIL_FROM");
  const subject = "Quick follow-up on your personalized birthday game";

  const results = [];

  for (const lead of leads) {
    if (lead.skip) {
      results.push({ email: lead.email, status: "skipped", reason: lead.reason || "Skipped" });
      continue;
    }

    try {
      const info = await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        sender: requireEnv("SMTP_USER"),
        to: lead.email,
        subject,
        text: buildBody(lead)
      });

      results.push({ email: lead.email, status: "sent", messageId: info.messageId });
    } catch (error) {
      results.push({ email: lead.email, status: "failed", reason: error.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
