# Nagarik Seba — নাগরিক সেবা

**Demo UI — no real data service. ডেমো UI — কোনো আসল ডাটা সার্ভিস নেই।**

This repository is a **design-only, static HTML/CSS/JS prototype** of a citizen-service
client panel and a completely separate admin panel, modelled on the structure found in
an audit of a similar client dashboard. It is **not** a live service.

## ⚠️ Demo disclaimer — ডেমো সতর্কতা

- No real retrieval, generation, or delivery of NID, smart NID, birth registration,
  server copy, biometric, location, call list, IMEI, TIN, or any other
  personal / government / telecom data.
- No backend, no API keys, no credentials, no real personal data, no real phone
  numbers, and no real ID numbers are included anywhere in this repository.
- All forms are demo-only: they show validation messages and deduction notes, but
  they do **not** submit to a real service, do **not** deduct a real balance, and
  do **not** print real cards.
- All sample rows use masked / generic demo data (for example, `••••••••••`).
- Branding is **Nagarik Seba / nagarikseba.com** throughout. It does not copy
  another site's logo or branding.

A future real version would need a lawful, authorised data source and a real
backend before any of these services could work. That backend does **not** exist here.

## Planned domains (not yet bought — see docs/domain-setup.md)

- Client site: **nagarikseba.com**
- Admin portal (completely separate app, not inside the client sidebar):
  **admin.nagarikseba.com**

The domain has **not** been bought yet and neither site is live. The user plans
to buy the domain tomorrow and then point DNS as described in `docs/domain-setup.md`.

## How to run locally — লোকালি চালানো

No build step is needed. Serve the folder statically, or simply open the files:

```bash
# from the repository root, for example:
python3 -m http.server 8000
# then open:
#   Client: http://localhost:8000/apps/client/
#   Admin:  http://localhost:8000/apps/admin/
```

Or open `apps/client/index.html` and `apps/admin/index.html` directly in a browser.
Navigation inside each app uses hash routes (for example `#/service/nid`,
`#/order/sign`, `#/history/snid`).

## Client app — `apps/client/`

Bengali UI, left sidebar, light background, teal header bar, accent colour `#ff4961`,
dark-mode toggle. Dashboard shows a demo user with a Verified badge, demo balance
`$ 10`, an Enable Notifications card, an Important Notice / WhatsApp notice
(placeholder only — no group is joined), a notice bar, service cards with cost and
list count, Orders Logs (Pending / Received / Completed / Refunded), Activity Logs,
Profile Completion, and Quick Access (Recharge, Live Chat, Report, Profile).

### Recharge

Minimum 100 taka, with the rule that the correct Transaction ID and the sender
number must be given (shown as a demo note). Includes recharge history and deposit
history tables (empty in the demo). The Recharge button is demo-only.

### 9 services — each with its audited fields, deduction note, and Save & Print (demo)

| Service | Demo cost |
|---|---:|
| NID Create | 5 |
| Smart NID Create | 10 |
| Birth Registration Create | 5 |
| Ministry Data | 100 |
| Server Copy Download | 10 (API ৫) / 25 (API ৩) |
| Sign to Server Copy | 5 |
| TIN Certificate Download | 40 |
| NID Correction Form | 25 |
| Vata Form Download | 10 |

Includes Autoload modals (NID / Smart NID / Birth Registration), Random barcode /
QR generation (demo values only), API and type selectors that update the deduction
note, demo links, and a captcha placeholder (the audited site showed “NO IMAGE”
and an API error for its captcha — no real captcha system is included here).
Services costing more than the demo balance show “Insufficient balance!”,
as in the audit.

### 18 order services — each with a form, deduction note, order history table, and option cards that update the total

Sign Copy 234, Server Copy 60, NID Copy 320, Smart Card PDF 350,
Biometric (GP) 60, TIN Certificate 12, Location 168, Number to IMEI 168,
NID to All Number 312, INFO — Bkash 605 / Nagad Personal 605 / Rocket 550 /
Bkash Agent 700 / Bkash Merchant 700 / Nagad Agent 2500, NID Password Set 50,
Name-Address NID 350, New Birth Registration 800 / 800 / 1000 / 2000,
Passport SB 450 / 600, Call List 1200 / 1500, IMEI to Active Number 600,
PIN Reset (the audited site rendered no operator option cards — included here as
a placeholder noting exactly that gap, total stays “?”), Original Smart Card
3300 / 3500.

As in the audit, every order page shows the “new order requests are currently
closed” banner and has no submit button. The dashboard notice saying orders are
open contradicts that banner; the admin app therefore includes an
Order Open/Close toggle as the single control for this state (see below).

### 3 free services

Signature Create, TIN Info, Birth Date Finder — with the empty-click validation
messages from the audit (blank name; TIN must be 12 digits; data must be
17 digits). No real lookup is run. The signature page uses its correct label
(the audited site wrongly titled its tab “Date of Birth Finder”).

### 9 history lists

NID (1 masked sample row), Smart NID (3), Birth Registration (1),
Ministry Data (0), Server Copy (0), Sign to Server Copy (0), TIN (0),
NID Correction Form (0), Vata Form (0). Edit opens a view-only form (nothing is
saved) and Print opens a demo preview (nothing is really printed). Delete is
demo-only and deletes nothing.

### Helpline and Account

Report form (demo submit only); Support is a placeholder (no WhatsApp group is
joined and no message is sent); Live Chat is a placeholder because its
destination was unverified in the audit. Profile shows update and change-password
forms (demo only) and a theme-colour picker (accent `#ff4961`). Devices shows
masked sample sessions (nothing is removed). Logout is demo-only.

## Admin app — `apps/admin/` (separate from the client app)

Admin Dashboard, Users, Services & Pricing (all prices above are editable in the
demo UI), Orders (statuses Pending / Received / Completed / Refunded),
Recharge Approvals, Notices, Order Open/Close toggle, and Reports.

Admin changes are **described** as flowing to the client site through a shared
data model in a future backend. **No live backend exists in this prototype, so
admin edits here do not change the client app.**

## Repository layout

```text
README.md
docs/domain-setup.md
apps/client/index.html
apps/client/styles.css
apps/client/app.js
apps/admin/index.html
apps/admin/styles.css
apps/admin/app.js
```

## What is intentionally NOT included

Anything the audit could not verify (recharge payment steps after entering an
amount, results after Save & Print / a valid lookup / Autoload Load, the Live
Chat destination, whether an admin area existed on the original site) is kept
as an explicit placeholder or demo note, not invented as a working feature.
