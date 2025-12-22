# Scan2Dish Admin System - Complete Guide

**Date:** December 22, 2025  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Enforcement](#core-enforcement)
3. [Database Schema](#database-schema)
4. [Admin Authentication](#admin-authentication)
5. [Features & Capabilities](#features--capabilities)
6. [Setup Instructions](#setup-instructions)
7. [Admin Operations](#admin-operations)
8. [Security Model](#security-model)
9. [API Reference](#api-reference)
10. [Operational Workflows](#operational-workflows)

---

## Overview

The Scan2Dish Admin System provides **complete operational control** over the platform. It enables SaaS administrators to:

- **Monitor all restaurants** - View stats, orders, commission, and activity
- **Enforce commission compliance** - Disable menus for non-payment
- **Track payments** - Record manual/offline commission payments
- **Maintain audit trail** - Log all admin actions for compliance
- **Control platform health** - Real-time visibility into all operations

### Key Principle: **Server-Side Enforcement**

Menu disabling is not just UI - it's enforced at the database level and in all customer-facing endpoints.

---

## Core Enforcement

### How Menu Enforcement Works

1. **Database Field:** `restaurants.menu_enabled` (boolean)
2. **Enforcement Points:**
   - `/menu/[tableId]/browse` - Blocks menu viewing
   - `/app/actions/orders.ts` - Blocks order creation
3. **Customer Impact:**
   - Cannot see menu items
   - Cannot place orders
   - See custom message: "Menus are currently unavailable. Please contact staff."
4. **Owner Impact:**
   - Dashboard remains accessible
   - Can still update menu items
   - Can see historical orders

### Enforcement Flow

```
Restaurant doesn't pay commission
    ↓
Admin disables menu (menu_enabled = false)
    ↓
Customer scans QR code
    ↓
Server checks menu_enabled
    ↓
If false → Show "unavailable" message
If true → Show menu & allow ordering
```

### Code Implementation

**Menu Browse Check:**
```typescript
// app/menu/[tableId]/browse/page.tsx
const restaurant = tableRow.restaurants;
if (!restaurant?.menu_enabled) {
  const reason = restaurant?.enforcement_reason || 
    "Menus are currently unavailable. Please contact staff.";
  throw new Error(reason);
}
```

**Order Creation Check:**
```typescript
// app/actions/orders.ts
const { data: restaurant } = await supabase
  .from("restaurants")
  .select("menu_enabled, enforcement_reason")
  .eq("id", restaurant_id)
  .single();

if (!restaurant.menu_enabled) {
  return {
    success: false,
    error: restaurant.enforcement_reason || 
      "Orders are currently unavailable.",
  };
}
```

---

## Database Schema

### New Tables

#### 1. `admin_users`
Admin authentication and role management.

```sql
- id (uuid, primary key)
- email (text, unique)
- name (text)
- role (enum: super_admin, admin, support)
- is_active (boolean)
- last_login_at (timestamptz)
- created_at, updated_at
```

**Roles:**
- `super_admin` - Full access to everything
- `admin` - Standard admin operations
- `support` - Read-only access (future)

#### 2. `commission_payments`
Track manual/offline commission payments.

```sql
- id (uuid, primary key)
- restaurant_id (uuid, foreign key)
- amount (numeric)
- payment_method (enum: cash, bank_transfer, check, other)
- payment_date (date)
- recorded_by (uuid, references admin_users)
- reference_number (text, optional)
- notes (text, optional)
- created_at
```

#### 3. `admin_activity_log`
Audit trail of all admin actions.

```sql
- id (uuid, primary key)
- admin_user_id (uuid)
- admin_email (text, denormalized)
- action_type (enum)
- target_type (enum)
- target_id (uuid, optional)
- details (jsonb)
- ip_address (inet)
- created_at
```

**Action Types:**
- `menu_disabled` - Restaurant menu disabled
- `menu_enabled` - Restaurant menu enabled
- `payment_recorded` - Commission payment recorded
- `restaurant_updated` - Restaurant info changed
- `order_viewed` - Admin viewed order details
- `bulk_action` - Batch operation performed

### Extended Tables

#### `restaurants` (new fields)

```sql
- menu_enabled (boolean, default true)
- commission_balance (numeric, default 0)
- total_commission_owed (numeric, default 0)
- total_commission_paid (numeric, default 0)
- last_payment_date (timestamptz)
- enforcement_reason (text)
- notes (text, admin-only)
```

**Constraint:** `commission_balance = total_commission_owed - total_commission_paid`

### Database Functions

#### `recalculate_restaurant_commission(restaurant_id_param uuid)`
Recalculates commission based on completed orders.

```sql
-- Automatically called when order status changes to 'completed'
-- Can be manually triggered by admins for corrections
```

#### `log_admin_activity(...)`
Logs admin actions for audit trail.

```sql
-- Called automatically by admin server actions
-- Stores action details in JSONB for flexibility
```

### Automatic Triggers

1. **Commission Update:** When order marked `completed`, commission is recalculated
2. **Updated At:** All tables have automatic `updated_at` timestamp

---

## Admin Authentication

### How It Works

1. **Middleware Protection:** `/admin/*` routes require authentication
2. **Admin Check:** User email must exist in `admin_users` table
3. **Active Status:** Admin must have `is_active = true`
4. **Session:** Uses Supabase Auth session

### Authentication Flow

```
User logs in with Supabase Auth
    ↓
Middleware checks if email in admin_users table
    ↓
If yes → Grant access to /admin
If no → Redirect to /dashboard (restaurant owner view)
```

### Code Reference

**Middleware:** `/middleware.ts`
```typescript
// Check if user is in admin_users table
const { data: adminUser } = await supabase
  .from("admin_users")
  .select("is_active")
  .eq("email", user.email)
  .single();

if (!adminUser || !adminUser.is_active) {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

**Helper:** `/lib/admin/auth.ts`
```typescript
export async function requireAdmin(): Promise<AdminUser>
export async function getAdminUser(): Promise<AdminUser | null>
export async function logAdminActivity(params): Promise<void>
```

---

## Features & Capabilities

### 1. Dashboard (`/admin`)

**What You See:**
- Total restaurants, active menus, disabled menus
- Total revenue across all restaurants
- Total commission owed (overdue)
- Total orders platform-wide
- Recent restaurants (last 5)
- Recent orders (last 10)

**Quick Actions:**
- View restaurant details
- Monitor commission status

### 2. Restaurant Management (`/admin/restaurants`)

**List View:**
- All restaurants with status (active/disabled)
- Commission balance for each
- Filter by: All, Active, Disabled, Overdue
- Sort by most recent

**Detail View (`/admin/restaurants/[id]`):**
- Full restaurant profile
- Quick stats: tables, menu items, orders, balance
- **Admin Controls:**
  - Enable/Disable menu
  - Set enforcement reason
  - Add internal notes
  - Recalculate commission
- Commission summary
- Recent orders
- Payment history

### 3. Commission Management (`/admin/commission`)

**Features:**
- View all restaurants with commission data
- See total outstanding, generated, collected
- Filter by restaurant
- **Record Payment:**
  - Amount
  - Payment method (cash, bank transfer, check, other)
  - Payment date
  - Reference number
  - Notes
- Auto-recalculate balance after payment

**Payment Flow:**
```
Admin records payment
    ↓
Payment inserted into commission_payments table
    ↓
Commission balance recalculated
    ↓
Activity logged
    ↓
Restaurant last_payment_date updated
```

### 4. Global Orders Feed (`/admin/orders`)

**Features:**
- See ALL orders across ALL restaurants
- Filter by status: pending, preparing, completed
- Shows: Order ID, restaurant, table, status, total, commission, time
- View last 100 orders
- Summary stats: total orders, total revenue, total commission

**Use Cases:**
- Monitor platform activity
- Identify high-performing restaurants
- Spot issues or patterns
- Calculate platform metrics

### 5. Activity Log (`/admin/activity`)

**Features:**
- Audit trail of ALL admin actions
- Grouped by date
- Shows: Action type, admin email, target, details, timestamp
- Track: Menu changes, payments recorded, updates made
- Full transparency for compliance

**Benefits:**
- Accountability - Know who did what
- Debugging - Trace issues back to actions
- Compliance - Audit trail for financial operations
- Security - Detect unauthorized access

---

## Setup Instructions

### 1. Run Database Migrations

```bash
# First, run the base schema (if not done)
# Run in Supabase SQL Editor
cat supabase/schema.sql | psql $DATABASE_URL

# Then run the admin schema
cat supabase/admin_schema.sql | psql $DATABASE_URL
```

**What This Does:**
- Creates `admin_users` table
- Creates `commission_payments` table
- Creates `admin_activity_log` table
- Adds new fields to `restaurants` table
- Sets up RLS policies for admin access
- Creates database functions and triggers
- Seeds first admin user

### 2. Create First Admin User

The schema auto-creates `admin@scan2dish.com`. **IMPORTANT:** Change this!

```sql
-- Update the seed admin email to your real email
UPDATE admin_users 
SET email = 'your-email@yourdomain.com', 
    name = 'Your Name'
WHERE email = 'admin@scan2dish.com';
```

Or create a new admin:

```sql
INSERT INTO admin_users (email, name, role)
VALUES ('youremail@domain.com', 'Your Name', 'super_admin');
```

### 3. Authenticate as Admin

1. Log in to Scan2Dish with the admin email
2. You'll be logged in via Supabase Auth
3. Middleware checks `admin_users` table
4. If found → Redirected to `/admin`
5. If not → Stays on restaurant dashboard

### 4. Verify Admin Access

Navigate to `/admin` - you should see the admin dashboard. If redirected to `/dashboard`, your email is not in the `admin_users` table.

---

## Admin Operations

### Disable a Restaurant's Menu (Enforcement)

**Scenario:** Restaurant hasn't paid commission

1. Go to `/admin/restaurants`
2. Find the restaurant (or filter by "Overdue")
3. Click "View Details"
4. In "Admin Controls" section:
   - Set enforcement reason: "Commission payment required. Please contact support."
   - Click "Disable Menu"
5. Result:
   - `menu_enabled` → `false`
   - Customers see "unavailable" message
   - Cannot place orders
   - Owner dashboard still accessible

**What Happens:**
```
Admin clicks "Disable Menu"
    ↓
Server action: toggleRestaurantMenu(id, false, reason)
    ↓
Database: menu_enabled = false, enforcement_reason = reason
    ↓
Activity log: menu_disabled action recorded
    ↓
Customer tries to scan QR
    ↓
Server checks menu_enabled = false
    ↓
Shows error message with reason
```

### Record a Commission Payment

**Scenario:** Restaurant pays commission in cash

1. Go to `/admin/commission`
2. Find the restaurant
3. Click "Record Payment"
4. Fill in:
   - Amount: D500.00
   - Method: Cash
   - Date: Today
   - Reference: (optional)
   - Notes: "Paid in person at office"
5. Click "Record Payment"
6. Result:
   - Payment recorded in `commission_payments`
   - Commission balance reduced by D500
   - Activity logged
   - If balance now ≤ 0, consider enabling menu

### Enable a Restaurant's Menu

**Scenario:** Restaurant paid up

1. Verify payment recorded and balance = 0
2. Go to `/admin/restaurants/[id]`
3. Click "Enable Menu"
4. Result:
   - `menu_enabled` → `true`
   - Customers can now see menu and order
   - Activity logged

### Recalculate Commission (Correction)

**Scenario:** Commission seems wrong

1. Go to restaurant detail page
2. Click "Recalculate Commission"
3. Function `recalculate_restaurant_commission` runs
4. Recounts all completed orders
5. Updates totals

**When to use:**
- After database migration
- After manual order adjustments
- If numbers don't match up

### View Platform Stats

**Daily Operations:**
1. Check `/admin` dashboard for overview
2. Look for:
   - Overdue restaurants (red)
   - Recent activity
   - Order volume trends
3. Review `/admin/activity` for recent actions

---

## Security Model

### Row Level Security (RLS)

**Admin Read Access:**
- Admins can SELECT from ALL tables
- RLS policies check if user is in `admin_users` table
- If yes → Grant access
- If no → Block

**Example Policy:**
```sql
CREATE POLICY restaurants_admin_select
ON restaurants FOR SELECT
TO authenticated
USING (
  -- Restaurant owner OR admin
  auth.uid() = user_id
  OR exists (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
      AND is_active = true
  )
);
```

**Admin Write Access:**
- Admins can UPDATE restaurants (menu_enabled, notes, etc.)
- Cannot delete restaurants (safety)
- All writes are logged

### Data Isolation

**Restaurant Owners:**
- See only their own data
- RLS filters by `user_id` or `restaurant_id`

**Customers:**
- No authentication
- Can only read public data (active menus, active tables)
- Can only create orders (with validation)

**Admins:**
- See ALL data
- Can modify specific fields (menu_enabled, notes)
- Cannot impersonate restaurant owners

### Audit Trail

**All admin actions are logged:**
- Who (admin_email)
- What (action_type)
- When (created_at)
- Where (target_type, target_id)
- Why (details JSONB)

**Immutable Log:**
- Activity log is INSERT-only
- Admins cannot delete logs
- Provides compliance trail

---

## API Reference

### Server Actions (`/app/actions/admin.ts`)

#### `toggleRestaurantMenu(restaurantId, enabled, reason?)`
Enable or disable a restaurant's menu.

```typescript
await toggleRestaurantMenu(
  "uuid",
  false,
  "Commission payment required"
);
```

#### `updateRestaurantNotes(restaurantId, notes)`
Update internal admin notes.

```typescript
await updateRestaurantNotes(
  "uuid",
  "Called on 12/22. Will pay next week."
);
```

#### `recordCommissionPayment(input)`
Record a manual payment.

```typescript
await recordCommissionPayment({
  restaurant_id: "uuid",
  amount: 500,
  payment_method: "cash",
  payment_date: "2025-12-22",
  reference_number: "REC-123",
  notes: "Paid in person"
});
```

#### `recalculateCommission(restaurantId)`
Manually recalculate commission.

```typescript
await recalculateCommission("uuid");
```

#### `getPlatformStats()`
Get platform-wide statistics.

```typescript
const stats = await getPlatformStats();
// Returns: totalRestaurants, activeRestaurants, 
//          totalOrders, totalRevenue, etc.
```

### Helper Functions (`/lib/admin/auth.ts`)

#### `requireAdmin(): Promise<AdminUser>`
Throws error if not admin. Use in server components.

#### `getAdminUser(): Promise<AdminUser | null>`
Returns admin user or null. For conditional logic.

#### `logAdminActivity(params): Promise<void>`
Log an admin action.

```typescript
await logAdminActivity({
  action_type: "menu_disabled",
  target_type: "restaurant",
  target_id: "uuid",
  details: { reason: "Non-payment" }
});
```

---

## Operational Workflows

### Daily Morning Routine

1. **Check Dashboard** (`/admin`)
   - Note total overdue restaurants
   - Check yesterday's orders
   - Verify platform health

2. **Review Commission** (`/admin/commission`)
   - Identify new overdue restaurants
   - Contact restaurants with balance > D1000

3. **Check Activity Log** (`/admin/activity`)
   - Review yesterday's admin actions
   - Verify no unauthorized access

### Weekly Review

1. **Audit Overdue Restaurants**
   - Export list of restaurants with balance > 0
   - Disable menus for 30+ days overdue
   - Send reminder emails

2. **Platform Metrics**
   - Total revenue (completed orders)
   - Total commission collected
   - Restaurant churn rate
   - Average order value

3. **Payment Reconciliation**
   - Match recorded payments to bank deposits
   - Verify commission balances are accurate

### When Restaurant Contacts Support

**"My menu isn't working"**

1. Go to `/admin/restaurants`
2. Search for restaurant
3. Check `menu_enabled` status
4. If disabled:
   - Check enforcement reason
   - Review commission balance
   - If paid → Enable menu
   - If not paid → Explain situation
5. If enabled but still not working → Technical issue

**"I paid my commission"**

1. Verify payment received (bank statement, receipt)
2. Go to `/admin/commission`
3. Find restaurant
4. Click "Record Payment"
5. Enter payment details
6. If balance now = 0 → Enable menu

**"Wrong commission amount"**

1. Go to `/admin/restaurants/[id]`
2. Check recent orders
3. Verify completed orders vs commission_amount
4. Click "Recalculate Commission"
5. If still wrong → Check order details for errors

---

## Best Practices

### Enforcement Guidelines

**When to Disable Menu:**
- 14 days past due
- Balance > D500
- After 2 payment reminders ignored

**When to Enable Menu:**
- Balance = D0
- Payment plan agreed upon
- Special circumstances (disaster, emergency)

**Enforcement Reasons:**
- Be professional and clear
- Don't blame or shame
- Provide contact info: "Please contact support@scan2dish.com"

### Payment Recording

**Always include:**
- Correct amount (to 2 decimals)
- Actual payment date (not today if received yesterday)
- Payment method (accurate)
- Reference number (check #, transaction ID)

**Notes field:**
- Who received payment
- Where (office, bank, online)
- Any special arrangements

### Data Hygiene

**Monthly:**
- Review admin_users for inactive admins
- Archive old activity logs (keep 1 year)
- Verify no orphaned payments

**Quarterly:**
- Audit RLS policies still working
- Test menu enforcement with test account
- Review commission calculation accuracy

---

## Troubleshooting

### Admin Can't Access /admin

**Check:**
1. Is email in `admin_users` table?
2. Is `is_active = true`?
3. Is user logged in with correct email?
4. Clear browser cache

**SQL Query:**
```sql
SELECT * FROM admin_users WHERE email = 'your-email@domain.com';
```

### Menu Still Shows After Disabling

**Check:**
1. Verify `menu_enabled = false` in database
2. Clear Next.js cache: `revalidatePath("/menu")`
3. Check if customer has cached data (reload page)
4. Verify middleware is running

### Commission Balance Wrong

**Fix:**
1. Go to restaurant detail
2. Click "Recalculate Commission"
3. Verify completed orders match expectations
4. Check for duplicates in commission_payments

### Activity Log Not Showing Actions

**Check:**
1. Is `logAdminActivity` being called in server actions?
2. Is admin_user_id being passed correctly?
3. Check admin_activity_log table directly

```sql
SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT 10;
```

---

## Migration Notes

### From No Admin → Admin System

1. Run `admin_schema.sql`
2. All existing restaurants default to `menu_enabled = true`
3. Commission fields initialized to 0
4. No disruption to existing operations

### Data Backfill (if needed)

**If restaurants already have orders:**

```sql
-- Recalculate commission for all restaurants
SELECT recalculate_restaurant_commission(id) FROM restaurants;
```

**If manual payments already recorded elsewhere:**

```sql
-- Insert historical payments
INSERT INTO commission_payments 
  (restaurant_id, amount, payment_method, payment_date, notes)
VALUES 
  ('uuid', 1000, 'bank_transfer', '2025-12-01', 'Historical payment'),
  ...;

-- Then recalculate all balances
SELECT recalculate_restaurant_commission(id) FROM restaurants;
```

---

## Production Checklist

✅ **Before Launch:**

- [ ] Run `admin_schema.sql` on production database
- [ ] Create first admin user with real email
- [ ] Test admin login and access
- [ ] Test menu enforcement (disable/enable)
- [ ] Record test payment and verify calculation
- [ ] Check activity log is recording
- [ ] Verify RLS policies are active
- [ ] Set up monitoring for admin access
- [ ] Document admin emails and roles
- [ ] Create admin operation runbook
- [ ] Train support team on admin panel

✅ **Post-Launch Monitoring:**

- [ ] Daily: Check overdue restaurants
- [ ] Weekly: Review activity log
- [ ] Monthly: Audit commission balances
- [ ] Quarterly: Security audit of admin access

---

## Support

**Admin System Issues:**
Contact: tech@scan2dish.com

**Feature Requests:**
Submit via internal ticketing system

**Security Concerns:**
Immediately contact security@scan2dish.com

---

**Admin System Version:** 1.0  
**Last Updated:** December 22, 2025  
**Status:** Production Ready ✅
