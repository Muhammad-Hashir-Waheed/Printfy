# Legacy (database) admin

Folders starting with `_` are private in the Next.js App Router: nothing here is routed.
This is the original Prisma-based admin (catalog/category editing, orders, payments).
It has known security issues (OTP bypass, shared customer/admin tokens) — fix those before
moving it back under `src/app/`.
