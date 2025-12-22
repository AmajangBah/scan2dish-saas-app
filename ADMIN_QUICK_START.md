# Scan2Dish Admin Panel - Quick Start Guide

**Get up and running in 5 minutes**

---

## Step 1: Run Database Migration

```bash
# In Supabase SQL Editor, run:
cat supabase/admin_schema.sql

# Or connect to your database:
psql $DATABASE_URL < supabase/admin_schema.sql
```

**What this does:**
- Creates 3 new tables (admin_users, commission_payments, admin_activity_log)
- Adds 7 new fields to restaurants table
- Sets up RLS policies
- Creates database functions
- Seeds first admin user

---

## Step 2: Update Admin Email

The schema creates `admin@scan2dish.com` by default. **Change it now:**

```sql
UPDATE admin_users 
SET email = 'your-real-email@yourdomain.com',
    name = 'Your Name'
WHERE email = 'admin@scan2dish.com';
```

Or create a new admin:

```sql
INSERT INTO admin_users (email, name, role)
VALUES ('your-email@domain.com', 'Your Name', 'super_admin');
```

---

## Step 3: Log In

1. Go to your Scan2Dish login page
2. Log in with the admin email
3. You'll be automatically redirected to `/admin`
4. See the admin dashboard!

**Troubleshooting:**
- If redirected to `/dashboard` instead → Your email is not in `admin_users` table
- Check: `SELECT * FROM admin_users WHERE email = 'your-email';`

---

## Step 4: Explore the Admin Panel

### Dashboard (`/admin`)
- See platform stats
- Recent restaurants
- Recent orders

### Restaurants (`/admin/restaurants`)
- View all restaurants
- Filter by status
- Click any restaurant for details

### Commission (`/admin/commission`)
- See all commission balances
- Record payments

### Orders (`/admin/orders`)
- Global orders feed
- All restaurants, all orders

### Activity (`/admin/activity`)
- Audit trail
- Who did what, when

---

## Quick Actions

### Disable a Restaurant's Menu

**When:** Restaurant hasn't paid commission

1. Go to `/admin/restaurants`
2. Click restaurant name
3. In "Admin Controls" section:
   - Type reason: "Commission payment required"
   - Click "Disable Menu"
4. Done! Customers now see: "Menus are currently unavailable"

### Record a Payment

**When:** Restaurant pays commission

1. Go to `/admin/commission`
2. Find the restaurant
3. Click "Record Payment"
4. Fill in:
   - Amount: (what they paid)
   - Method: Cash / Bank Transfer / Check / Other
   - Date: (when you received it)
   - Reference: (optional - check #, etc.)
5. Click "Record Payment"
6. Balance automatically updates!

### Enable Menu After Payment

**When:** Restaurant paid and balance is now 0

1. Go to `/admin/restaurants/[id]`
2. Verify balance = D0.00
3. Click "Enable Menu"
4. Done! Customers can order again

---

## Daily Routine

**Morning Check (2 minutes):**
1. Visit `/admin` dashboard
2. Note:
   - How many restaurants are overdue
   - Yesterday's order volume
   - Any new restaurants
3. Check `/admin/activity` for unusual actions

**Process Payments (as needed):**
1. Check bank account / cash drawer
2. Go to `/admin/commission`
3. Record each payment
4. Enable menus for paid-up restaurants

**Handle Support Tickets:**
- "My menu isn't working" → Check if disabled
- "I paid!" → Record payment, enable menu
- "Wrong amount" → Recalculate commission

---

## Test the Enforcement

**Verify menu enforcement works:**

1. Create/find a test restaurant
2. Go to `/admin/restaurants/[test-id]`
3. Click "Disable Menu"
4. Open incognito window
5. Scan QR code (or visit `/menu/[table-id]`)
6. Should see: "Menus are currently unavailable"
7. Try to place order → Should be blocked
8. Go back to admin, click "Enable Menu"
9. Refresh customer page → Menu appears!

**Owner can still access dashboard:**
- Even with menu disabled
- Owner logs in → sees their dashboard
- Can edit menu, view orders
- Just customers are blocked

---

## Key URLs

- **Admin Dashboard:** `/admin`
- **Restaurants:** `/admin/restaurants`
- **Commission:** `/admin/commission`
- **Orders:** `/admin/orders`
- **Activity Log:** `/admin/activity`

---

## Common Issues

### "Access Denied" when visiting /admin
**Fix:** Your email is not in `admin_users` table
```sql
INSERT INTO admin_users (email, name, role)
VALUES ('your-email@domain.com', 'Your Name', 'super_admin');
```

### Menu still showing after disabling
**Fix:** 
1. Verify database: `SELECT menu_enabled FROM restaurants WHERE id = '...'`
2. Should be `false`
3. Customer needs to refresh page (clear cache)

### Commission balance wrong
**Fix:**
1. Go to restaurant detail page
2. Click "Recalculate Commission"
3. This re-counts all completed orders

### Activity log not showing my actions
**Fix:**
1. Check: `SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT 10;`
2. Should see recent actions
3. If empty → Database function issue

---

## Security Reminders

✅ **Do:**
- Use strong passwords for admin accounts
- Log out when done
- Review activity log regularly
- Only give admin access to trusted staff

❌ **Don't:**
- Share admin credentials
- Leave admin panel open on public computer
- Delete activity logs
- Bypass enforcement for friends

---

## Quick Stats Queries

If you want to check things directly in the database:

```sql
-- Total commission owed across all restaurants
SELECT SUM(commission_balance) FROM restaurants;

-- Restaurants with balance > 0
SELECT name, commission_balance 
FROM restaurants 
WHERE commission_balance > 0 
ORDER BY commission_balance DESC;

-- Recent admin actions
SELECT admin_email, action_type, created_at 
FROM admin_activity_log 
ORDER BY created_at DESC 
LIMIT 20;

-- Platform revenue today
SELECT SUM(total) 
FROM orders 
WHERE created_at::date = CURRENT_DATE 
  AND status = 'completed';
```

---

## Next Steps

Once you're comfortable:

1. **Set enforcement rules**
   - When to disable menus (14 days overdue?)
   - Payment reminder schedule
   - Grace period policy

2. **Train support team**
   - How to check menu status
   - How to record payments
   - How to handle complaints

3. **Monitor regularly**
   - Daily dashboard check
   - Weekly commission review
   - Monthly reconciliation

4. **Document your processes**
   - Payment recording procedure
   - Enforcement policy
   - Escalation steps

---

## Support

**Technical Issues:** Reference `ADMIN_SYSTEM_GUIDE.md`  
**Full Documentation:** See complete guide for all features  
**Database Schema:** Refer to `admin_schema.sql`  

---

**You're Ready to Go! 🚀**

The admin panel is now live. You have full control over your SaaS platform.

**First Action:** Disable a test restaurant's menu and verify customers can't order.

**Questions?** Check the full guide: `ADMIN_SYSTEM_GUIDE.md`
