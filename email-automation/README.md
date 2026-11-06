# Playloop Email Automation

This folder sends email through Gmail SMTP while using `hello@playloop.co` as the visible sender.

## What this setup does

- Authenticates with your Gmail account using an app password
- Sends the message with `From: hello@playloop.co`
- Works locally with Node.js
- Can be scheduled later with Codex automation

## Setup

1. Copy `.env.example` to `.env`
2. Fill these values:
   - `SMTP_USER=kashigamedev@gmail.com`
   - `SMTP_PASS=` your Gmail app password
   - `EMAIL_FROM=hello@playloop.co`
   - `EMAIL_TO=` recipient email
3. Install dependencies:

```powershell
npm install
```

## Send a sample email

```powershell
npm run send:sample
```

## Send a custom email

```powershell
node send-email.js --to localpurposes@gmail.com --subject "Custom subject" --body "Salam,\n\nCustom body"
```

## Send a body from file

```powershell
node send-email.js --to localpurposes@gmail.com --subject "Daily update" --body-file .\message.txt
```

## Important note about Gmail alias

For `hello@playloop.co` to show correctly, Gmail must already allow `kashigamedev@gmail.com` to send as that address. If Gmail rejects or rewrites the sender, re-check the `Send mail as` settings inside Gmail.

## Codex automation idea

Once `.env` is ready and a manual send works, you can ask Codex:

```text
Create a daily automation in this workspace that runs:
cd email-automation
node send-email.js --to localpurposes@gmail.com --subject "Daily follow up" --body-file .\message.txt
```
