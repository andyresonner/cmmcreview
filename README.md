# CMMCReview.org

The independent CMMC compliance hub for defense contractors. Free education, readiness assessments, and a verified partner directory.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Vercel** for deployment
- No external UI libraries — custom styled components

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: Next.js (auto-detected)
4. Click Deploy

That's it. Vercel auto-builds on every push to main.

### Custom Domain (cmmcreview.org)

In Vercel dashboard → Settings → Domains → Add `cmmcreview.org`

Then update your domain's DNS:
- **A record**: `76.76.21.21`
- **CNAME**: `cname.vercel-dns.com` (for www subdomain)

## Project Structure

```
cmmcreview/
├── app/
│   ├── layout.js          # Root layout, meta tags, font imports
│   ├── page.js            # Home page (imports CMMCReview component)
│   └── globals.css        # Base styles and CSS variables
├── components/
│   └── CMMCReview.jsx     # Main application (all 5 pages)
├── public/                # Static assets (favicon, images)
├── next.config.js
└── package.json
```

## Pages

- **Home** — Hero, CMMC level overview, implementation timeline
- **Learn CMMC** — Interactive academy with L1/L2/L3 breakdowns, 14 control families
- **Readiness Check** — 8-question assessment → SPRS score → gap analysis → email capture
- **Find a Partner** — Searchable MSP/C3PAO/RPO directory with filters
- **Resources** — Organized library of official docs, NIST standards, templates

## Next Steps

- [ ] Add real MSP/C3PAO partner data
- [ ] Build out control-by-control explainer pages (SEO pages)
- [ ] Add email capture backend (Resend, ConvertKit, etc.)
- [ ] Create 50 state-specific landing pages
- [ ] Add blog/content section for SEO
- [ ] Integrate lead routing to MSP partners
