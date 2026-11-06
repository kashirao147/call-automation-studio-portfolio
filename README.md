# AI Voice Agent Portfolio

Live site: [Call Automation Studio](https://callautomationstudio.com/)

Single-page portfolio website built section by section from visual references.

## Local Preview

```bash
npm.cmd run dev
```

Open `http://localhost:3000`.

## Contact Form Email (Resend)

The contact form submits to `/api/contact`, which sends email through Resend.

Set your API key before running locally:

```powershell
$env:RESEND_API_KEY="your_resend_api_key"
$env:RESEND_FROM="AI Voice Portfolio <onboarding@resend.dev>"
$env:CONTACT_TO="kashigamedev@gmail.com"
node server.js
```

Then submit from the contact form and email will be sent to `kashigamedev@gmail.com`.

For Vercel deployment, add these in Project Settings > Environment Variables:

- `RESEND_API_KEY`
- `RESEND_FROM` (use a verified sender/domain in Resend for production)
- `CONTACT_TO` (your inbox that receives form submissions)
- `ALLOWED_ORIGINS` (comma-separated, e.g. `https://callautomationstudio.com`)
- `ADMIN_PANEL_KEY` (required to save global content from admin panel)
- `BLOB_READ_WRITE_TOKEN` (for admin image upload to Vercel Blob)

Optional hardening:

- `CONTACT_RATE_LIMIT_MAX` (default `5`)
- `CONTACT_RATE_LIMIT_WINDOW_MS` (default `600000`)

## Admin Image Upload (Vercel Blob)

You can now upload logo images directly from the admin panel (`Top Moving Logos` section).

### Vercel setup

1. Add **Vercel Blob** to your project (Storage tab / Marketplace integration).
2. Ensure `BLOB_READ_WRITE_TOKEN` exists in Project Environment Variables.
3. Redeploy.

### Usage

1. Open admin panel.
2. Enter `ADMIN_PANEL_KEY`.
3. Go to `Top Moving Logos`.
4. Choose file and click `Upload Image`.
5. Click `Save Changes`.

## Security Notes

- `.env` is ignored in git. Keep real keys only in local `.env` and in Vercel environment variables.
- Contact API now includes:
  - origin validation
  - rate limiting
  - bot honeypot field
  - input length and email validation
  - generic error responses (no provider internals exposed to visitors)

If any key was committed previously, rotate it immediately (especially `RESEND_API_KEY`).

## Admin Cloud Sync (Desktop + Mobile)

Admin/content sync is now API-based and works across devices when cloud storage is configured.

### Required setup on Vercel

1. Add **Vercel KV** to your project (Marketplace integration).
2. Ensure these KV vars exist in Vercel env:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
3. Set `ADMIN_PANEL_KEY` in Vercel env.
4. Redeploy.

### How to use

1. Open admin panel.
2. Enter `ADMIN_PANEL_KEY` in the `Admin API Key` field.
3. Save changes.
4. Open website on mobile/desktop and refresh - both will show same updated data.

## Deploy

Push this folder to GitHub, then import the repository in Vercel. The current version is static, so it deploys without installing dependencies.

## SEO Setup

The project now includes:

- Optimized title/description and social meta tags (Open Graph + Twitter)
- Structured data (`ProfessionalService`) in `index.html`
- `robots.txt` (allows public pages, blocks `/admin` and `/api`)
- `sitemap-v20260414.xml` (single active sitemap URL)
- `noindex` meta tag on admin panel

After deployment, submit these in search engines:

- `https://callautomationstudio.com/sitemap-v20260414.xml` to Google Search Console
- `https://callautomationstudio.com/sitemap-v20260414.xml` to Bing Webmaster Tools

If you use a custom domain later, update canonical/meta/sitemap/robots URLs to that domain.
