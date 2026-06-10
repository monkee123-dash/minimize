# Minimize — AI Interior Redesign

Transform cluttered home photos into minimalist, Instagram-ready interiors using AI.

## 🚀 Quick Start (Deploy in 30 minutes)

### 1. Clone & Install
```bash
git clone <your-repo>
cd minimize-app
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project (free tier)
2. In the SQL Editor, run everything in `supabase/schema.sql`
3. Go to Storage → Create bucket named `uploads` → Make it public
4. Copy your Project URL and Anon Key from Settings → API
5. Copy Service Role Key from Settings → API (keep this secret!)

### 3. Set Up Replicate
1. Go to [replicate.com](https://replicate.com) and create an account
2. Get your API token from Account Settings
3. The app uses `tstramer/midjourney-diffusion` for image generation

### 4. Set Up Stripe (Optional for payments)
1. Go to [stripe.com](https://stripe.com) and create an account
2. Create a Product + Price for the Pro plan ($9.99/month recurring)
3. Copy the Price ID (starts with `price_`)
4. Get your Secret Key and Publishable Key
5. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
6. Select events: `checkout.session.completed`, `customer.subscription.deleted`

### 5. Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REPLICATE_API_TOKEN=your_replicate_token
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_PRO=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```
Add all environment variables in Vercel Dashboard → Settings → Environment Variables

---

## 📁 Project Structure

```
minimize-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── redesign/          # AI image generation
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/      # Stripe checkout session
│   │   │   │   └── webhook/       # Stripe webhook handler
│   │   │   └── upload/            # Image upload to Supabase Storage
│   │   ├── dashboard/             # User redesign history
│   │   ├── login/                 # Auth page
│   │   ├── pricing/               # Pricing page
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page + App
│   ├── hooks/
│   │   └── useAuth.ts             # Auth state + credit management
│   └── lib/
│       ├── stripe.ts              # Stripe client
│       ├── supabase.ts            # Supabase client + types
│       └── utils.ts               # Utility functions
├── supabase/
│   └── schema.sql                 # Database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 💰 Business Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 redesigns/month, 720p, watermarked |
| **Pro** | $9.99/mo | Unlimited, 4K, no watermark, all styles |
| **Business** | $49.99/mo | Batch processing, API, white-label |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Supabase (Auth, DB, Storage)
- **AI:** Replicate API (Midjourney Diffusion)
- **Payments:** Stripe
- **Hosting:** Vercel (free tier)

---

## 📱 Social Media Strategy

1. **TikTok/Instagram:** Post 2–3 before/after videos daily
2. **Pinterest:** Pin styled room images with links to app
3. **Reddit:** Share in r/InteriorDesign, r/RealEstate, r/SideProject
4. **Product Hunt:** Launch with free tier as hook

---

## 📝 Next Steps

1. [ ] Buy domain (recommend: `minimize.app` or `minimize.co` on Porkbun)
2. [ ] Set up Supabase project and run schema
3. [ ] Get Replicate API key
4. [ ] Configure Stripe (optional for MVP)
5. [ ] Deploy to Vercel
6. [ ] Start posting content on TikTok/Instagram
7. [ ] Launch on Product Hunt

---

Built with ❤️ for creators who want beautiful spaces without the cleanup.
