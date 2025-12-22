# Scan2Dish - Production Readiness Review

**Review Date:** 2025  
**Reviewer:** Senior Full-Stack Engineer  
**Product:** QR-based Restaurant Ordering SaaS

---

## 1️⃣ System Overview

### What Scan2Dish Is
Scan2Dish is a QR-based restaurant ordering SaaS platform with two distinct user flows:

1. **Customer Flow (Public, No Auth)**
   - Customers scan QR code → land at `/menu/[tableId]`
   - Browse menu, add items to cart, place orders
   - No customer accounts or authentication
   - Order tracking page shows status

2. **Restaurant Owner Flow (Authenticated)**
   - Supabase Auth required
   - Dashboard at `/dashboard/*` routes
   - Manage: Orders, Menu, Tables, Analytics, Discounts, Settings
   - 1:1 relationship: 1 user = 1 restaurant

### Current State
**⚠️ CRITICAL: This codebase is in PROTOTYPE/MOCKUP stage**
- Extensive use of mock data
- No database persistence for orders
- No real menu fetching
- No server-side validation
- Missing critical server infrastructure

### Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** shadcn/ui, Tailwind CSS
- **Backend:** Next.js API Routes (mostly empty)
- **Database:** Supabase PostgreSQL (schema not in codebase)
- **Auth:** Supabase Auth

---

## 2️⃣ Frontend Analysis

### Routing Structure
```
/app
├── (auth)/              # Login/Register pages
│   ├── login/
│   └── register/
├── dashboard/           # Protected owner routes
│   ├── orders/          # Uses mockOrders.ts
│   ├── menu/            # Uses mockMenu.ts
│   ├── tables/          # Uses initialTables.ts
│   ├── analytics/
│   ├── discounts/
│   └── settings/
├── menu/                # Public customer routes
│   └── [tableId]/
│       ├── browse/      # Hardcoded items array
│       ├── cart/
│       ├── checkout/    # Mock order creation
│       └── order/[orderId]/  # Mock tracking
└── page.tsx             # Landing page
```

### Data Fetching Patterns

**❌ PROBLEM: Almost Everything is Mocked**

1. **Customer Menu (`/menu/[tableId]/browse`)**
   - Hardcoded items array in component
   - No API call to fetch menu
   - No validation that `tableId` exists or belongs to a restaurant

2. **Restaurant Dashboard**
   - Orders: `mockOrders.ts` - 25 fake orders
   - Menu: `mockMenu.ts` - hardcoded items
   - Tables: `initialTables.ts` - 8 fake tables
   - Summary API (`/api/dashboard/summary`) exists but dashboard uses hardcoded stats

3. **Cart & Checkout**
   - Client-side state only (`CartContext`)
   - Checkout generates random order ID
   - No server action or API call to create order
   - No price validation

### State Management
- **Good:** Uses React Context for cart (`CartContext`)
- **Problem:** No persistence, all state lost on refresh
- **Problem:** No synchronization with database

### Security Assumptions (Frontend)

**🚨 CRITICAL SECURITY ISSUES:**

1. **Price Calculation Client-Side**
   ```typescript
   // app/menu/[tableId]/cart/page.tsx:15-17
   const VAT = Math.round(subtotal * 0.1);
   const tip = Math.round(subtotal * 0.03);
   const total = subtotal + VAT + tip;
   ```
   - Customer can manipulate prices via DevTools
   - No server-side validation of totals

2. **No Table Validation**
   - `/menu/[tableId]` accepts any `tableId` parameter
   - No check if table exists or belongs to a restaurant
   - No RLS protection visible

3. **Order Creation is Fake**
   - Checkout just generates random ID: `(Math.random() * 1000000).toFixed(0)`
   - No database insert
   - No commission calculation
   - No audit trail

---

## 3️⃣ Backend & API Analysis

### API Routes Structure
```
/app/api/dashboard/
├── summary/route.ts      ✅ EXISTS (reads from DB)
├── tables/route.ts       ❌ EMPTY FILE
├── orders/
│   ├── route.ts          ❌ EMPTY FILE
│   └── [id]/route.ts     ❌ EMPTY FILE
├── menu/
│   ├── route.ts          ❌ EMPTY FILE
│   └── [id]/route.ts     ❌ EMPTY FILE
└── settings/...          (not reviewed)
```

### Server Actions
**❌ NONE FOUND**
- Codebase prefers "Server Actions" but uses zero
- All mutations are client-side only

### Existing API: `/api/dashboard/summary`

**✅ Good:**
- Uses `getRestaurantId()` helper
- Validates authentication
- Filters by `restaurant_id`

**❌ Problems:**
1. **Revenue Calculation is Inefficient**
   ```typescript
   const { data: orderRows } = await supabase
     .from("orders")
     .select("total")
     .eq("restaurant_id", restaurant_id);
   
   const revenue = orderRows?.reduce(...) || 0;
   ```
   - Fetches ALL orders just to sum totals
   - Should use database aggregation: `SELECT SUM(total) FROM orders WHERE...`

2. **Missing RLS Enforcement Check**
   - Relies on `restaurant_id` filter
   - Should verify RLS policies are active

### Server Supabase Client

**🚨 CRITICAL BUG:**
```typescript
// lib/supabase/server.ts
export function createBrowserSupabase() {  // ❌ WRONG NAME
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,  // ❌ ANON KEY
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// But code imports:
import { createServerSupabase } from "@/lib/supabase/server";  // ❌ DOESN'T EXIST
```

**Impact:**
- `getRestaurantId()` will fail at runtime
- All server-side queries will fail
- App is currently broken for authenticated routes

**Fix Required:**
Need proper server client using service role key or RLS with proper auth context.

### Authentication Flow

**Registration (`app/(auth)/register/page.tsx`)**
- ✅ Uses Supabase Auth correctly
- ✅ Creates user, then restaurant record
- ❌ Client-side only (should be server action)
- ❌ No RLS policy verification
- ❌ Comment says "RLS safe" but can't verify without seeing policies

**Login (`app/(auth)/login/page.tsx`)**
- ✅ Standard Supabase auth
- ❌ Uses `createBrowserSupabase()` from wrong file
- ❌ Redirects with `window.location.href` (should use Next.js router)

---

## 4️⃣ Database & RLS Analysis

### Schema Inference (from code usage)

**Tables Referenced:**
1. `restaurants`
   - Fields: `id`, `user_id`, `name`, `phone`, `brand_color`
   - Expected: `created_at`, `updated_at`

2. `restaurant_tables` (or `tables`)
   - Fields: `id`, `restaurant_id`, `is_active`
   - Expected: `table_number`, `capacity`, `location`, `qr_code`

3. `orders`
   - Fields: `id`, `restaurant_id`, `table_id`, `total`, `status`
   - Expected: `created_at`, `items` (JSONB?), `commission`, `commission_amount`

4. `menu_items` (inferred, not seen in code)
   - Expected: `id`, `restaurant_id`, `name`, `price`, `category`, etc.

5. `discounts` (types defined)
   - Fields match `types/discounts.ts`

### RLS Policies

**❌ CANNOT VERIFY - Policies not in codebase**

**Critical Questions:**
1. Does `restaurants` table have RLS enabled?
2. Can owners only read their own restaurant?
3. Can public users create orders? (Should only be via `table_id`)
4. Can customers read menu items? (Should be public for active items)
5. Can customers read other tables' orders? (Should be blocked)

**Expected RLS Structure:**
```sql
-- Restaurants: owners only
CREATE POLICY "restaurants_select_own" ON restaurants
  FOR SELECT USING (auth.uid() = user_id);

-- Tables: owners read all, public can read by ID for menu access
CREATE POLICY "tables_public_read_by_id" ON restaurant_tables
  FOR SELECT USING (true);  -- ⚠️ RISKY - exposes all tables

-- Orders: owners read own, public create with table_id
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM restaurant_tables WHERE id = table_id)
  );
```

### Multi-Tenant Isolation

**✅ Good Pattern:**
- `getRestaurantId()` helper ensures consistent filtering
- All queries filter by `restaurant_id`

**❌ Risks:**
1. **No RLS Verification**
   - Code assumes RLS exists but can't verify
   - If RLS is missing, queries are insecure

2. **Table ID Validation Missing**
   - Customer flow accepts any `tableId` in URL
   - No server-side check that table belongs to restaurant
   - No check that table is active

3. **Order Creation Path Doesn't Exist**
   - Can't verify customer order isolation
   - No commission calculation visible

---

## 5️⃣ What's Done Well

### Architecture Decisions

1. **✅ Clear Separation: Public vs Authenticated Routes**
   - `/menu/*` for customers (no auth)
   - `/dashboard/*` for owners (auth required)
   - Good routing structure

2. **✅ Helper Function Pattern**
   - `getRestaurantId()` centralizes restaurant lookup
   - Reusable across all dashboard routes

3. **✅ Type Safety**
   - TypeScript interfaces for Orders, MenuItems, Tables
   - Zod schemas for form validation

4. **✅ UI Component Library**
   - shadcn/ui provides consistent design
   - Good separation of UI components

### Code Quality

1. **✅ Component Organization**
   - Logical folder structure
   - Reusable components in `/components/ui`

2. **✅ Form Handling**
   - React Hook Form + Zod validation
   - Good practice for form state

---

## 6️⃣ Problems & Risks

### 🔴 CRITICAL - Blocks Production

1. **Server Supabase Client Broken**
   - `createServerSupabase()` doesn't exist
   - Server-side code will crash
   - **Impact:** All authenticated features broken

2. **No Order Persistence**
   - Orders are mocked
   - No database writes
   - **Impact:** Core feature doesn't work

3. **Client-Side Price Calculation**
   - Customers can manipulate totals
   - No server-side validation
   - **Impact:** Revenue loss, fraud risk

4. **No Commission Calculation**
   - Requirement: 5% commission on completed orders
   - No implementation visible
   - **Impact:** Business model not implemented

### 🟠 HIGH RISK - Security & Data Integrity

5. **No Table Validation**
   - Customer can access any `tableId` in URL
   - No server-side verification
   - **Impact:** Data leakage, wrong orders

6. **RLS Policies Not Versioned**
   - Can't verify tenant isolation
   - Policies not in codebase
   - **Impact:** Unknown security posture

7. **No Server Actions**
   - Preferred pattern not used
   - All mutations client-side
   - **Impact:** Security holes, no server validation

8. **Menu Items Hardcoded**
   - Customer sees fake menu
   - No database integration
   - **Impact:** Wrong items, wrong prices

### 🟡 MEDIUM RISK - Performance & Scalability

9. **Inefficient Revenue Query**
   - Fetches all orders to sum
   - Should use `SUM()` aggregation
   - **Impact:** Slow with growth

10. **No Database Indexes Visible**
    - Can't verify indexes on `restaurant_id`, `table_id`
    - **Impact:** Slow queries at scale

11. **Mock Data Everywhere**
    - Dashboard uses hardcoded stats
    - **Impact:** Misleading data, no real insights

### 🟢 LOW RISK - Code Quality

12. **Terminology Inconsistency**
    - "pendingDeliveries" but no delivery feature
    - Should be "pendingOrders"

13. **Empty API Route Files**
    - Placeholder files exist but empty
    - **Impact:** Confusion, incomplete

---

## 7️⃣ Suggestions (High-Impact Only)

### Immediate Fixes (Before Any Deployment)

1. **Fix Server Supabase Client**
   ```typescript
   // lib/supabase/server.ts
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'
   
   export function createServerSupabase() {
     const cookieStore = cookies()
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) { return cookieStore.get(name)?.value },
           set(name: string, value: string, options: any) { ... },
           remove(name: string, options: any) { ... },
         }
       }
     )
   }
   ```

2. **Implement Order Creation Server Action**
   ```typescript
   // app/actions/orders.ts
   'use server'
   
   export async function createOrder(tableId: string, items: CartItem[]) {
     // 1. Validate table_id exists and is active
     // 2. Fetch menu items and validate prices server-side
     // 3. Calculate total + VAT + tip server-side
     // 4. Calculate commission (5% of total)
     // 5. Insert order with correct restaurant_id
     // 6. Return order ID
   }
   ```

3. **Add Table Validation Middleware**
   ```typescript
   // app/menu/[tableId]/layout.tsx (Server Component)
   export default async function MenuLayout({ params, children }) {
     const { tableId } = params
     const table = await validateTable(tableId)  // Server-side check
     if (!table || !table.is_active) {
       redirect('/404')
     }
     return <>{children}</>
   }
   ```

### Database Improvements

4. **Add Commission Tracking**
   ```sql
   ALTER TABLE orders ADD COLUMN commission_rate DECIMAL(5,4) DEFAULT 0.05;
   ALTER TABLE orders ADD COLUMN commission_amount DECIMAL(10,2);
   ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2);
   ALTER TABLE orders ADD COLUMN vat_amount DECIMAL(10,2);
   ALTER TABLE orders ADD COLUMN tip_amount DECIMAL(10,2);
   ```

5. **Optimize Revenue Query**
   ```typescript
   const { data } = await supabase
     .from("orders")
     .select("total")
     .eq("restaurant_id", restaurant_id)
     .eq("status", "completed")  // Only completed orders
   
   // Or better: use RPC function
   const { data } = await supabase.rpc('get_restaurant_revenue', {
     restaurant_id_param: restaurant_id
   })
   ```

6. **Version RLS Policies**
   - Create `supabase/migrations/` folder
   - Export RLS policies to SQL files
   - Track in version control

### Architecture Improvements

7. **Replace Mock Data Gradually**
   - Start with Orders (critical path)
   - Then Menu items
   - Then Tables
   - Use feature flags to switch

8. **Add Input Validation Layer**
   ```typescript
   // lib/validations/orders.ts
   import { z } from 'zod'
   
   export const CreateOrderSchema = z.object({
     table_id: z.string().uuid(),
     items: z.array(z.object({
       menu_item_id: z.string().uuid(),
       quantity: z.number().int().positive(),
       price: z.number().positive()  // Server validates
     })),
     customer_name: z.string().optional(),
     notes: z.string().optional(),
   })
   ```

---

## 8️⃣ Missing Critical Features

Based on requirements, these are missing:

1. **Order Creation** - Completely mocked
2. **Commission Calculation** - Not implemented
3. **Menu Fetching** - Hardcoded items
4. **Table Management** - Mock data only
5. **Order Status Updates** - Client-side only, no persistence
6. **Analytics** - No real data
7. **Discount Application** - Types exist, logic missing

---

## 9️⃣ Testing Readiness

**Current State:** ❌ Not Production Ready

**What's Missing:**
- No integration tests
- No E2E tests
- No database tests
- Can't test RLS policies
- Can't test order flow (it's mocked)

---

## 🔟 Final Verdict

### Production Readiness: **0/10** ❌

**Reasons:**
1. Server code is broken (Supabase client)
2. Core feature (orders) doesn't persist
3. Security vulnerabilities (client-side prices)
4. No database integration for critical paths
5. Extensive mock data in production code

### Recommended Path Forward

**Phase 1: Fix Infrastructure (Week 1)**
- Fix server Supabase client
- Set up proper RLS policies
- Version database schema

**Phase 2: Core Features (Week 2-3)**
- Implement order creation (server action)
- Add menu fetching (API route)
- Add table validation

**Phase 3: Business Logic (Week 4)**
- Commission calculation
- Price validation
- Order status management

**Phase 4: Remove Mocks (Week 5)**
- Replace all mock data
- Connect dashboard to real data
- Test end-to-end flows

**Phase 5: Security Hardening (Ongoing)**
- Audit RLS policies
- Add input validation
- Add rate limiting
- Add monitoring

---

**Review Complete**

This codebase has a solid foundation (good routing, types, UI) but needs significant backend work before production deployment. The architecture is sound, but implementation is incomplete.

