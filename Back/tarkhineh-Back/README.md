# Tarkhineh — Raw PHP + MySQL Backend

A plain PHP (no framework) REST API + MySQL database for the Tarkhineh
React frontend. It was built directly against the mock functions in
`src/api/*.js` — same URLs, same request/response shapes — so wiring
the real frontend to it is a small, mechanical change per file.

Tested end-to-end with PHP 8.3 + MariaDB 10.11 (PHP's built-in server
and Apache both work; see "Running it" below).

---

## 1. Folder structure

```
backend/
├── index.php              # front controller / router (every request enters here)
├── .htaccess               # Apache rewrite rules so /api/... hits index.php
├── config/
│   ├── config.php          # DB credentials, CORS origin, constants (edit this first)
│   └── database.php        # PDO connection, reused everywhere
├── core/
│   ├── Response.php        # JSON response helpers (success/error/notFound/...)
│   ├── Request.php         # reads JSON body, query params, Bearer token
│   └── Auth.php            # token generation + "who is logged in" + requireUser()
├── controllers/
│   ├── AuthController.php       # phone+OTP login, profile
│   ├── MenuController.php       # tabs + menu items
│   ├── BranchController.php     # branches, per-branch dishes, reviews
│   ├── SearchController.php     # menu search
│   ├── AddressController.php    # saved delivery addresses (CRUD)
│   ├── OrderController.php      # checkout -> order creation, listing, cancel
│   ├── WishlistController.php   # favorites
│   └── DiscountController.php   # discount codes + mock payment confirmation
└── database/
    ├── schema.sql           # full MySQL schema (14 tables)
    └── seed.sql             # sample data taken from your existing mock files
```

No Composer, no framework — every file is included with `require_once`
and classes are plain PHP. This keeps the whole thing readable end to
end, at the cost of writing a little more boilerplate (the router,
the JSON helpers) than a framework would give you for free.

---

## 2. Setting it up

### Step 1 — Create the database

```bash
mysql -u root -p --default-character-set=utf8mb4 < database/schema.sql
mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
```

**Important:** always pass `--default-character-set=utf8mb4` (or use a
client that already defaults to it). The app is entirely in Persian;
without this flag the `mysql` CLI defaults to latin1 and every Persian
string gets double-encoded into mojibake on the way in. Both `.sql`
files also start with `SET NAMES utf8mb4;` as a second layer of
protection.

### Step 2 — Configure credentials

Edit `config/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'tarkhineh');
define('DB_USER', 'root');
define('DB_PASS', 'your-password-here');
define('CORS_ALLOWED_ORIGIN', 'http://localhost:5173'); // your Vite dev URL
```

### Step 3 — Run it

**Option A — PHP's built-in server (fastest for local dev):**

```bash
cd backend
php -S localhost:8000 index.php
```

The API is now at `http://localhost:8000/api/...`.

**Option B — Apache:** point a VirtualHost/subfolder at `backend/`,
make sure `mod_rewrite` is enabled (the included `.htaccess` needs
it), and `AllowOverride All` for that directory.

### Step 4 — Point the React app at it

In the Vite project's `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 3. How auth works (matches `AuthModal.jsx` exactly)

The frontend already has a two-step phone → OTP flow. The backend
implements it with a **bearer token**, not PHP sessions, so it behaves
like a normal REST API the SPA can call from any origin:

1. `POST /api/auth/send-otp {phone}` → generates a 5-digit code,
   stores it in `otp_codes`, and (for now) just logs it — swap in a
   real SMS provider (Kavenegar, Ghasedak, Twilio, ...) inside
   `AuthController::sendOtp()`. While `APP_DEBUG` is `true`, the
   response also includes `debug_code` so you can test without SMS.
2. `POST /api/auth/verify-otp {phone, code}` → checks the code,
   creates the user on first login, and returns `{ token, user }`.
3. The frontend stores `token` (e.g. alongside `user` in
   `localStorage`) and sends it back as
   `Authorization: Bearer <token>` on every request that needs to know
   who's logged in (addresses, orders, wishlist, profile).
4. `POST /api/auth/logout` deletes that token row, so it stops working
   immediately.

Tokens live in `auth_tokens` and expire after `AUTH_TOKEN_TTL_DAYS`
(30 by default).

---

## 4. Endpoint reference

All responses are JSON. Endpoints marked 🔒 require
`Authorization: Bearer <token>` and return `401` without it.

| Method | Path | Replaces (mock file) | Notes |
|---|---|---|---|
| POST | `/api/auth/send-otp` | — | `{phone}` |
| POST | `/api/auth/verify-otp` | `AuthModal.jsx`'s inline logic | `{phone, code}` → `{token, user}` |
| POST | `/api/auth/logout` 🔒 | — | |
| GET | `/api/auth/me` 🔒 | — | |
| PUT | `/api/auth/me` 🔒 | `updateUser()` in `AuthContext.jsx` | `{fullName, displayName, email, birthDate}` |
| GET | `/api/menu/tabs` | `menuApi.js: fetchTypeTabs()` | |
| GET | `/api/menu/items?tab=main` | `menuApi.js: fetchMenuItems(tab)` | |
| GET | `/api/branches` | `branchesApi.js: fetchBranches()` | |
| GET | `/api/branches/{slug}` | `branchesApi.js: fetchBranchBySlug()` | |
| GET | `/api/branches/{slug}/dishes` | `branchDishesApi.js: fetchBranchDishes()` | `{featured, popular, nonIranian}` |
| GET | `/api/branches/{slug}/reviews` | `branchDishesApi.js: fetchBranchReviews()` | |
| GET | `/api/search?q=...` | `searchApi.js: fetchSearchResults()` | |
| GET | `/api/addresses` 🔒 | new (was local React state) | |
| POST | `/api/addresses` 🔒 | `AddAddressModal.jsx`'s `onSave` | `{label, phone, fullAddress, isSelf, recipientName, lat, lng}` |
| PUT | `/api/addresses/{id}` 🔒 | new | same body, all fields optional |
| DELETE | `/api/addresses/{id}` 🔒 | `handleDeleteAddress` in `CheckoutInfoPage.jsx` | |
| GET | `/api/orders` 🔒 | `ProfilePage.jsx`'s orders tab | |
| POST | `/api/orders` 🔒 | `handleSubmitOrder` in `CheckoutInfoPage.jsx` | see body below |
| GET | `/api/orders/{id}` 🔒 | new | |
| POST | `/api/orders/{id}/cancel` 🔒 | `handleCancelOrder` in `ProfilePage.jsx` | |
| GET | `/api/wishlist` 🔒 | `ProfilePage.jsx`'s favorites tab | |
| POST | `/api/wishlist` 🔒 | new | `{menuItemId}` |
| DELETE | `/api/wishlist/{menuItemId}` 🔒 | new | |
| POST | `/api/discount/apply` | `handleApplyDiscountCode` in `PaymentPage.jsx` | `{code, subtotal}` |
| POST | `/api/payment/confirm` 🔒 | `handleConfirmPayment` in `PaymentPage.jsx` | `{orderId, gateway?}`, mocks a bank callback |

### Creating an order — request body

```json
{
  "deliveryType": "courier",
  "addressId": 3,
  "note": "لطفا زنگ نزنید",
  "items": [
    { "id": "m-koofte-berenji", "title": "کوفته برنجی", "price": 145000, "oldPrice": 180000, "discountPercent": 35, "qty": 2 }
  ],
  "paymentMethod": "online",
  "paymentGateway": "saman",
  "discountCode": "TARKHINEH10"
}
```

The server recomputes `subtotal`, `discountTotal`, `shippingCost`
(`SHIPPING_COST` constant, matching `MOCK_SHIPPING_COST` in
`CheckoutInfoPage.jsx`) and the discount-code amount, then returns the
saved order in the exact shape `ProfilePage.jsx`'s `OrderCard` expects.

> **Security note:** to keep this example focused, item prices are
> taken from what the cart sends, because `CartContext.jsx` already
> carries full item data (not just an id). Before going to
> production, change `OrderController::store()` to re-look each
> `menu_item_id` up in the DB and use *that* price — otherwise a
> tampered request body could change what the customer pays.

---

## 5. Wiring the React app to the real API

Every mock file in `src/api/` already documents the real endpoint in
a comment. The change is the same shape in all of them — replace the
`setTimeout`/local-data body with a `fetch` call. Example for
`src/api/menuApi.js`:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchTypeTabs() {
  const res = await fetch(`${API_BASE}/menu/tabs`);
  if (!res.ok) throw new Error("خطا در دریافت تب‌ها");
  return res.json();
}

export async function fetchMenuItems(tab) {
  const res = await fetch(`${API_BASE}/menu/items?tab=${tab}`);
  if (!res.ok) throw new Error(`تبی با شناسه «${tab}» پیدا نشد`);
  return res.json();
}
```

Apply the same pattern to `branchesApi.js`, `branchDishesApi.js`, and
`searchApi.js`. For the 🔒 endpoints, add the token:

```js
export async function fetchAddresses(token) {
  const res = await fetch(`${API_BASE}/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در دریافت آدرس‌ها");
  return res.json();
}
```

In `AuthContext.jsx`, store the token next to the user object (or in
a second `localStorage` key) so it survives page reloads, and update
`login()`/`logout()` to call `/api/auth/verify-otp` and
`/api/auth/logout` respectively instead of just writing to
`localStorage`.

---

## 6. Extending the seed data

`database/seed.sql` only ports over a representative slice of
`src/data/menuItems.js`, `branches.js`, `branchDishes.js`, and
`review.js` — enough to see every endpoint return real content, not
every single item and image. To add the rest:

1. Copy the real image files into `backend/uploads/menu/...` and
   `backend/uploads/branches/...` (paths already referenced by the
   seed rows via `/uploads/...`).
2. Add more `INSERT INTO menu_items (...) VALUES (...)` rows —
   `id`, `tab_id`, `title`, `description`, `price`, `old_price`,
   `discount_percent`, `rating`, `rating_count`, `image`, `category`,
   `category_label`, `is_bestseller` map 1:1 to the fields in
   `menuItemsData` in the JS mock.
3. For items with a full image gallery (the `images: [...]` arrays in
   the mock), add rows to `menu_item_images` (or `branch_images` for
   branches) instead of cramming them into one column.

---

## 7. What's deliberately simplified

This is a teaching/reference implementation, not a hardened
production system. Before shipping it for real:

- **SMS gateway** — `AuthController::sendOtp()` only logs the code;
  wire in a real provider and remove the `debug_code` field.
- **Payment gateway** — `DiscountController::confirmPayment()` marks
  the order paid immediately; a real integration redirects to the
  bank and verifies the transaction server-to-server on its callback
  before marking anything paid.
- **Order price validation** — see the security note in §4.
- **Rate limiting** — `send-otp` has no throttling; add it before
  production (e.g. max N requests per phone per hour).
- **HTTPS** — bearer tokens must only ever travel over HTTPS in
  production.
