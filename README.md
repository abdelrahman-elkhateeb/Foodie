<div align="center">

# 🍔 Foodie

**A bilingual (English / Arabic) food ordering app with live order tracking and a public admin dashboard.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://food-ordering-app-pearl-alpha.vercel.app)

![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)

<img width="1900" height="950" alt="Menu page" src="https://github.com/user-attachments/assets/9d6eb4b9-f46e-42b2-a0d3-c96f3cabb1e5" />

</div>

---

## 📑 Contents

- [Features](#-features)
- [Highlights](#-highlights)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database](#-database)

---

## ✨ Features

### For customers

- **Menu**: browse dishes with images, descriptions and availability, filter by category, search instantly
- **Cart**: add, remove and change quantities; saved across reloads and re-priced from the database before checkout
- **Checkout**: validated form (Egyptian mobile numbers), cash or online payment, order summary. Login required
- **Live order tracking**: a progress tracker that updates in real time as the restaurant moves the order along, with shareable links like `/track-order?id=12`
- **Accounts**: email and password sign-up and login with Supabase Auth

### For the restaurant (`/admin`)

- **Dashboard**: revenue, orders today, average order value, orders by status, 7-day activity and top dishes
- **Orders**: live feed with status filters, order details and status updates
- **Products**: create, edit, delete and toggle availability
- **Demo reset**: admins can wipe orders and visitor-made products in one click

Order workflow:

```txt
Pending → Preparing → Out For Delivery → Delivered
```

### Everywhere

- 🌍 English and Arabic with full **RTL** layout and a remembered language choice (i18next)
- 🌙 Light and dark themes
- 📱 Responsive, accessible UI built on shadcn/ui and Radix

---

## 🔐 Highlights

The admin dashboard is **open to everyone as a public demo**, so the database does the protecting, not the browser:

- **Server-side pricing**: orders are created by the `place_order` Postgres function, which looks up prices itself and inserts the order and its items atomically. Totals can't be tampered with from the client.
- **Row Level Security**: the seed menu can only be changed by admins. Visitors can freely play with products they add themselves.
- **Controlled writes**: order status only changes through `update_order_status`. There are no direct insert or update grants on orders.
- **Safe deletes**: deleting a product that appears in past orders archives it instead, so order history stays intact.
- **Roles**: stored in a `profiles` table and checked by an `is_admin()` helper.

---

## 📸 Screenshots

| Admin products | Order tracking |
| :---: | :---: |
| <img alt="Admin products page" src="https://github.com/user-attachments/assets/95c06350-2f4b-4a99-aaee-c7654a35d67d" /> | <img alt="Order tracking page" src="https://github.com/user-attachments/assets/babd238b-b7e9-4512-a22e-b50ed325e1ec" /> |
| **Menu** | **Checkout** |
| <img alt="Menu page" src="https://github.com/user-attachments/assets/9d6eb4b9-f46e-42b2-a0d3-c96f3cabb1e5" /> | <img alt="Checkout page" src="https://github.com/user-attachments/assets/90c7b292-bd6c-42c7-b57a-a84d04a8aa1f" /> |

---

## 🧰 Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| Server state | TanStack Query (caching, refetching, loading and error states) |
| Client state | Zustand with `persist` (cart) |
| Forms | react-hook-form |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react |
| Backend | Supabase: PostgreSQL, Auth, Realtime, Row Level Security |
| i18n | i18next, react-i18next |

---

## 🏗 Project Structure

Feature-based: each feature owns its data hooks, and pages stay thin.

```txt
src
├── components     # UI building blocks (auth, dashboard, home, menu, ui = shadcn)
├── features       # TanStack Query hooks per domain
│   ├── cart
│   ├── orders
│   ├── products
│   └── users
├── layout         # Root, client, admin and auth layouts
├── lib            # Supabase client, i18n setup, formatters
├── locales        # en / ar translations
├── pages          # Route components (incl. Admin/)
├── routes         # React Router config
├── services       # Supabase API calls
├── store          # Zustand stores
└── types
supabase
└── migrations     # SQL: RLS, functions, Realtime, seed menu
```

### Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/menu` | Menu |
| `/cart` | Cart |
| `/checkout` | Checkout (login required) |
| `/order-confirmed/:orderId` | Order confirmation |
| `/track-order?id=` | Live order tracking |
| `/login`, `/register` | Auth |
| `/admin`, `/admin/orders`, `/admin/products` | Dashboard, orders, products |

---

## 🏃 Getting Started

### Prerequisites

- Node.js 20.19+ (required by Vite)
- A free [Supabase](https://supabase.com) project

### 1. Install

```bash
git clone https://github.com/abdelrahman-elkhateeb/Foodie.git
cd Foodie
npm install
```

### 2. Configure

Copy `.env.example` to `.env` and fill in your Supabase project URL and anon key (Project Settings → API):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up the database

Run these in the Supabase SQL editor, in order. Each one is safe to re-run.

1. [`20261002_demo_hardening.sql`](supabase/migrations/20261002_demo_hardening.sql): roles, categories, RLS policies, the `place_order` / `update_order_status` / `reset_demo_data` functions, Realtime on `orders`, and a demo menu if `products` is empty
2. [`20261003_require_login_for_orders.sql`](supabase/migrations/20261003_require_login_for_orders.sql): only logged-in users can place orders
3. [`20261003_archive_products.sql`](supabase/migrations/20261003_archive_products.sql): archive products that are in past orders instead of deleting them

> The migrations extend existing `products`, `orders` and `order_items` tables. Create them first using the schema in [Database](#-database).

Then make yourself admin:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

### 4. Run

```bash
npm run dev
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run typecheck` | Run the TypeScript compiler |
| `npm run format` | Format with Prettier |

---

## 🗄 Database

| Table | Columns |
| --- | --- |
| `products` | `id`, `name_en`, `name_ar`, `description_en`, `description_ar`, `price`, `image_url`, `is_available`, `category`, `is_seed`, `archived_at`, `created_at` |
| `orders` | `id`, `user_id`, `customer_name`, `phone`, `address`, `payment_method` (`cash` / `online`), `status`, `total_price`, `created_at` |
| `order_items` | `id`, `order_id`, `product_id`, `quantity`, `price` |
| `profiles` | `id`, `full_name`, `role` (`customer` / `admin`), `created_at` |

Categories: `burgers`, `pizza`, `mains`, `sides`, `desserts`, `drinks`.
Statuses: `pending`, `preparing`, `out_for_delivery`, `delivered`.
