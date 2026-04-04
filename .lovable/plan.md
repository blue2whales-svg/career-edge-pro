## Phase 1: Database Schema (Migration)
Create new tables: `verified_employers`, `job_unlocks`, `subscriptions`, `referrals`
- Seed 50+ verified Kenyan employers (Safaricom, KCB, UNICEF, etc.)
- Add RLS policies for all new tables
- Keep existing `cached_jobs`, `orders`, `applications` tables intact

## Phase 2: Job Card Tiering System
- **Free (white border)**: Kenya jobs not in verified_employers
- **Verified Premium (gold glow)**: Kenya jobs matching verified_employers
- **International Premium (blue glow)**: Non-Kenya + visa sponsorship jobs
- Social proof counters + urgency tags on locked cards

## Phase 3: Job Detail Modal Upgrade
- Free modal: full access, direct apply
- Locked Verified modal: gold theme, blurred company, KSh 99 unlock
- Locked International modal: blue theme, KSh 199 unlock
- Glassmorphism, mobile full-screen, sticky CTA bar

## Phase 4: Pricing Page (/pricing)
- 3-column comparison: Free | Pro (KSh 500/mo) | Employer
- M-Pesa + PayPal integration (using existing MpesaPaymentModal)
- FAQ accordion

## Phase 5: Job Board Header
- Filter tabs with live counts: All | Free Kenya | Verified | International | Visa
- Search bar with keyword, location, job type, salary filters

## Phase 6: Application Tracker & CV Score
- /dashboard/applications with status tracking table
- CV completeness score widget (0-100%)

## Phase 7: Referral System
- Unique referral links, WhatsApp sharing
- KSh 200 credit per conversion

**M-Pesa stays completely intact** — no changes to mpesa-stk-push or MpesaPaymentModal logic.
