# word-games

NYT-style word games: Wordle, Connections, and Spelling Bee with a freemium subscription model.

## Features

- 🎮 **Three Word Games**: Wordle, Connections, and Spelling Bee
- 🔐 **User Authentication**: Sign up and track your progress
- 💳 **Freemium Model**: Free daily puzzles with premium archive access
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🌙 **Dark Mode**: Automatic dark mode support

## Quick Start

### Prerequisites

You'll need a PostgreSQL database for both development and production. SQLite is not supported as it doesn't work in serverless environments like Vercel.

**Local Development Options:**
- **Docker** (recommended): `docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`
- **Cloud Services**: [Supabase](https://supabase.com) (free tier), [Neon](https://neon.tech) (free tier), or [Railway](https://railway.app)

### Development Mode (Sandbox)

The app can run in **sandbox mode** without any Stripe configuration for local development:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your PostgreSQL DATABASE_URL and NEXTAUTH_SECRET

# Initialize database
npx prisma db push

# Run development server
npm run dev
```

In sandbox mode:
- ✅ All word games work normally
- ✅ User authentication works
- ✅ UI displays informational messages about payment features
- ⚠️ Stripe payment features are gracefully disabled

### Production Mode (with Stripe)

To enable payment processing, add Stripe credentials to your `.env` file:

```bash
# Required for all modes
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://yourdomain.com"

# Optional - for Stripe payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Deployment

### Vercel (Recommended)

1. **Set up a PostgreSQL database:**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
   - Or [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app), etc.

2. **Push your code to GitHub**

3. **Import to Vercel and set environment variables:**
   - `DATABASE_URL` (required) - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` (required) - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` (required) - Your deployment URL (e.g., `https://your-app.vercel.app`)
   - Stripe variables (optional - only if you want payments):
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRICE_ID`
     - `STRIPE_WEBHOOK_SECRET`

4. **Deploy!**

The app will automatically detect if Stripe is configured and enable/disable features accordingly.

## Environment Variables

See `.env.example` for a complete list of environment variables.

**Required:**
- `DATABASE_URL` - PostgreSQL or SQLite connection string
- `NEXTAUTH_SECRET` - Random secret for JWT signing
- `NEXTAUTH_URL` - Your app's URL

**Optional (for payments):**
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_PRICE_ID` - Stripe price ID for premium subscription
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright tests
```

## Development Workflow

### Pre-commit Checks

This project uses [Husky](https://typicode.github.io/husky/) to run automatic checks before each commit:

- **Linting**: Ensures code style consistency
- **Type checking**: Catches TypeScript errors
- **Build verification**: Ensures Vercel will build successfully

These checks prevent broken builds from being pushed. If a check fails, fix the errors before committing.

### Continuous Integration

GitHub Actions runs the same checks on every pull request:
- ✅ Linting
- ✅ Type checking  
- ✅ Build verification
- ✅ End-to-end tests

PRs cannot be merged until all CI checks pass, ensuring Vercel deployments succeed.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma (SQLite/PostgreSQL)
- **Auth**: NextAuth.js
- **Payments**: Stripe (optional)
- **Styling**: Tailwind CSS
- **Testing**: Playwright