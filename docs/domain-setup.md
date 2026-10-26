# Domain setup — tomorrow's steps (ডোমেইন সেটআপ)

**Status today: the domain nagarikseba.com has NOT been bought and neither site
is live.** Do not claim otherwise. The steps below are for tomorrow, after the
domain is purchased.

## 0. Vercel fix — why the free domain showed 404

The repository root has no app by itself: the client app lives in
`apps/client/` and the admin app in `apps/admin/`. A Vercel project deployed
from the repository root therefore served `https://nagarikseba.vercel.app/`
as 404, while `https://nagarikseba.vercel.app/apps/client/` worked.

Fix applied in this repo: a root `index.html` redirects `/` to
`apps/client/`, so the free Vercel domain now opens the client panel.
For the proper custom-domain split, use two separate Vercel projects
instead of relying on the redirect:

- Client project: Root Directory = `apps/client/` → domain `nagarikseba.com`
- Admin project: Root Directory = `apps/admin/` → domain `admin.nagarikseba.com`

In Vercel: Project → Settings → General → Root Directory → Edit →
choose the folder above → Save, then redeploy. With a Root Directory set,
that project serves its app at `/` directly, with no redirect needed.

## 1. Buy the domain

- Buy `nagarikseba.com` from a registrar of your choice.
- Keep the registrar login safe. Do not put any password or credential in this
  repository.

## 2. Host the two static apps separately

This repository contains two independent static apps:

- Client app: `apps/client/` → will be served at `https://nagarikseba.com`
- Admin app: `apps/admin/` → will be served at `https://admin.nagarikseba.com`

They must stay separate. The admin app is **not** linked inside the client
sidebar. Any static host that serves a folder over HTTPS will work
(for example, a static hosting service, an object-storage static site, or a
simple web server). The exact host is the user's choice at deployment time.

## 3. Point DNS at the hosts

At the registrar / DNS provider, after hosting is ready:

1. Point the apex/root record for `nagarikseba.com` to the client host
   (an `A` / `ALIAS` / `ANAME` record, or the `CNAME` method your host
   documents for apex domains).
2. Add a `CNAME` record for `admin` → the admin host, so that
   `admin.nagarikseba.com` resolves to the admin app.
3. Wait for DNS propagation (it can take minutes to a few hours).

## 4. Enable HTTPS / SSL

- Enable automatic HTTPS / SSL on both hosts so that both
  `https://nagarikseba.com` and `https://admin.nagarikseba.com` load securely.
- Test both URLs in a browser, including on mobile, before sharing them.

## 5. Verify the split

- `https://nagarikseba.com` must show only the client panel (no admin menu).
- `https://admin.nagarikseba.com` must show only the admin panel.
- Confirm the demo banner is still visible on both apps until a real backend
  replaces this prototype.

## 6. Before any real service goes live (important)

This prototype is design-only. Before offering any real service:

- Build a real backend with a lawful, authorised data source.
- Replace every demo form, demo validation note, and placeholder with the real
  flow, and remove the demo banner only when the real service is ready.
- Add proper authentication, rate limiting, audit logging, and data protection
  for any personal-data handling — none of that exists in this prototype.
