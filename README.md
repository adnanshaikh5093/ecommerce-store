# ShopHub: Full-Stack E-Commerce Web Application

A full-stack online store with authentication, product management, cart, order processing and an admin dashboard.

**Stack:** React · Node.js · Express · PostgreSQL · Prisma · Tailwind CSS

## Features

- **Authentication:** register/login with JWT and bcrypt-hashed passwords; role-based access (USER / ADMIN)
- **Protected routes:** client-side route guards (`ProtectedRoute`) plus server-side `requireAuth` / `requireAdmin` middleware
- **Product catalog:** server-side pagination, debounced search, category and price filters, sorting (state kept in the URL)
- **Cart:** persistent per-user cart with stock validation
- **Order processing:** checkout runs in a database transaction (stock check, order creation, stock decrement, cart clear)
- **Order history:** users see their orders; admins update order status
- **Admin dashboard:** revenue/order/user stats, low-stock alerts, product CRUD, order management

## Getting started

Prerequisites: Node.js 18+ and a running PostgreSQL database.

```bash
# 1. Backend
cd server
cp .env.example .env        # edit DATABASE_URL and JWT_SECRET
npm install
npm run db:migrate          # create tables
npm run db:seed             # demo data
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```
Demo accounts after seeding:

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@example.com | admin123 |
| User  | user@example.com  | user123  | 

## API overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/auth/me` | Auth |
| GET | `/api/products` (`search, category, minPrice, maxPrice, sort, page, limit`) | Public |
| GET | `/api/products/:id`, `/api/products/categories` | Public |
| POST/PUT/DELETE | `/api/products`, `/api/products/:id` | Admin |
| GET/POST/PUT/DELETE | `/api/cart` | Auth |
| POST/GET | `/api/orders`, `/api/orders/:id` | Auth |
| GET | `/api/orders/admin/all` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |
| GET | `/api/admin/stats` | Admin |

## Project structure

```
server/   Express API, Prisma schema, seed script
client/   React (Vite) app with Tailwind CSS
```

## Possible improvements

Payment integration (Stripe), image uploads, product reviews, email notifications, automated tests.
