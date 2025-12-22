-- =====================================================================
-- Scan2Dish - Admin Panel Schema
-- =====================================================================
-- This extends the base schema to add SaaS admin capabilities:
-- - Admin user management
-- - Commission tracking and enforcement
-- - Manual payment recording
-- - Activity logging
-- - Restaurant menu control
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ---------------------------------------------------------------------
-- Admin users are separate from restaurant owners
-- They have full platform visibility and control
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null default 'admin' check (role in ('super_admin', 'admin', 'support')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast email lookups
create index if not exists idx_admin_users_email on public.admin_users(email);
create index if not exists idx_admin_users_is_active on public.admin_users(is_active);

-- Trigger for updated_at
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_admin_users_set_updated_at'
  ) then
    create trigger trg_admin_users_set_updated_at
    before update on public.admin_users
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2. EXTEND RESTAURANTS TABLE
-- ---------------------------------------------------------------------
-- Add fields for commission tracking and menu enforcement
alter table public.restaurants 
  add column if not exists menu_enabled boolean not null default true,
  add column if not exists commission_balance numeric(10,2) not null default 0,
  add column if not exists total_commission_owed numeric(10,2) not null default 0,
  add column if not exists total_commission_paid numeric(10,2) not null default 0,
  add column if not exists last_payment_date timestamptz,
  add column if not exists enforcement_reason text,
  add column if not exists notes text;

-- Indexes for admin queries
create index if not exists idx_restaurants_menu_enabled on public.restaurants(menu_enabled);
create index if not exists idx_restaurants_commission_balance on public.restaurants(commission_balance);

-- Constraint: commission balance should equal owed minus paid
alter table public.restaurants 
  add constraint if not exists check_commission_balance 
  check (commission_balance = total_commission_owed - total_commission_paid);

-- ---------------------------------------------------------------------
-- 3. COMMISSION PAYMENTS TABLE
-- ---------------------------------------------------------------------
-- Track manual/offline commission payments from restaurants
create table if not exists public.commission_payments (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  amount numeric(10,2) not null,
  payment_method text not null check (payment_method in ('cash', 'bank_transfer', 'check', 'other')),
  payment_date date not null,
  recorded_by uuid references public.admin_users(id) on delete set null,
  reference_number text,
  notes text,
  created_at timestamptz not null default now(),
  constraint commission_payments_amount_positive check (amount > 0)
);

-- Indexes for reporting
create index if not exists idx_commission_payments_restaurant_id on public.commission_payments(restaurant_id);
create index if not exists idx_commission_payments_payment_date on public.commission_payments(payment_date desc);
create index if not exists idx_commission_payments_recorded_by on public.commission_payments(recorded_by);

-- ---------------------------------------------------------------------
-- 4. ADMIN ACTIVITY LOG
-- ---------------------------------------------------------------------
-- Audit trail for all admin actions
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  admin_email text not null, -- Denormalized for safety
  action_type text not null check (action_type in (
    'menu_disabled',
    'menu_enabled',
    'payment_recorded',
    'restaurant_created',
    'restaurant_updated',
    'order_viewed',
    'bulk_action'
  )),
  target_type text not null check (target_type in ('restaurant', 'order', 'payment', 'system')),
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Indexes for activity queries
create index if not exists idx_admin_activity_log_admin_user_id on public.admin_activity_log(admin_user_id);
create index if not exists idx_admin_activity_log_created_at on public.admin_activity_log(created_at desc);
create index if not exists idx_admin_activity_log_action_type on public.admin_activity_log(action_type);
create index if not exists idx_admin_activity_log_target on public.admin_activity_log(target_type, target_id);

-- ---------------------------------------------------------------------
-- 5. FUNCTION: Calculate Restaurant Commission Balance
-- ---------------------------------------------------------------------
-- This function recalculates commission owed based on completed orders
create or replace function public.recalculate_restaurant_commission(restaurant_id_param uuid)
returns void
language plpgsql
security definer
as $$
declare
  total_owed numeric(10,2);
  total_paid numeric(10,2);
begin
  -- Calculate total commission from completed orders
  select coalesce(sum(commission_amount), 0)
  into total_owed
  from public.orders
  where restaurant_id = restaurant_id_param
    and status = 'completed';

  -- Get total payments recorded
  select coalesce(sum(amount), 0)
  into total_paid
  from public.commission_payments
  where restaurant_id = restaurant_id_param;

  -- Update restaurant record
  update public.restaurants
  set 
    total_commission_owed = total_owed,
    total_commission_paid = total_paid,
    commission_balance = total_owed - total_paid,
    updated_at = now()
  where id = restaurant_id_param;
end;
$$;

-- ---------------------------------------------------------------------
-- 6. FUNCTION: Log Admin Activity
-- ---------------------------------------------------------------------
create or replace function public.log_admin_activity(
  admin_user_id_param uuid,
  admin_email_param text,
  action_type_param text,
  target_type_param text,
  target_id_param uuid,
  details_param jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  log_id uuid;
begin
  insert into public.admin_activity_log (
    admin_user_id,
    admin_email,
    action_type,
    target_type,
    target_id,
    details
  ) values (
    admin_user_id_param,
    admin_email_param,
    action_type_param,
    target_type_param,
    target_id_param,
    details_param
  )
  returning id into log_id;
  
  return log_id;
end;
$$;

-- ---------------------------------------------------------------------
-- 7. TRIGGER: Update Commission on Order Completion
-- ---------------------------------------------------------------------
-- Automatically recalculate commission when order is marked completed
create or replace function public.trigger_recalculate_commission()
returns trigger
language plpgsql
as $$
begin
  -- Only recalculate if status changed to completed
  if new.status = 'completed' and (old.status is null or old.status != 'completed') then
    perform public.recalculate_restaurant_commission(new.restaurant_id);
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_orders_update_commission'
  ) then
    create trigger trg_orders_update_commission
    after insert or update on public.orders
    for each row execute function public.trigger_recalculate_commission();
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 8. RLS POLICIES - ADMIN ACCESS
-- ---------------------------------------------------------------------

-- Admin Users: Only accessible by authenticated admins
alter table public.admin_users enable row level security;

drop policy if exists admin_users_select_by_admin on public.admin_users;
create policy admin_users_select_by_admin
on public.admin_users
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Commission Payments: Admin read/write
alter table public.commission_payments enable row level security;

drop policy if exists commission_payments_admin_all on public.commission_payments;
create policy commission_payments_admin_all
on public.commission_payments
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Admin Activity Log: Admin read-only
alter table public.admin_activity_log enable row level security;

drop policy if exists admin_activity_log_select_by_admin on public.admin_activity_log;
create policy admin_activity_log_select_by_admin
on public.admin_activity_log
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

drop policy if exists admin_activity_log_insert_by_admin on public.admin_activity_log;
create policy admin_activity_log_insert_by_admin
on public.admin_activity_log
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- ---------------------------------------------------------------------
-- 9. GRANT ADMIN READ ACCESS TO ALL TABLES
-- ---------------------------------------------------------------------
-- Note: This is handled via RLS policies, but we ensure admins can query

-- Update existing restaurant policies to allow admin read
drop policy if exists restaurants_admin_select on public.restaurants;
create policy restaurants_admin_select
on public.restaurants
for select
to authenticated
using (
  -- Restaurant owner OR admin
  auth.uid() = user_id
  or exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Update restaurant policies for admin write (menu_enabled, commission fields)
drop policy if exists restaurants_admin_update on public.restaurants;
create policy restaurants_admin_update
on public.restaurants
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Allow admins to read all orders
drop policy if exists orders_admin_select on public.orders;
create policy orders_admin_select
on public.orders
for select
to authenticated
using (
  -- Restaurant owner OR admin
  exists (
    select 1 from public.restaurants r
    where r.id = orders.restaurant_id
      and r.user_id = auth.uid()
  )
  or exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Allow admins to read all tables
drop policy if exists restaurant_tables_admin_select on public.restaurant_tables;
create policy restaurant_tables_admin_select
on public.restaurant_tables
for select
to authenticated
using (
  -- Restaurant owner OR admin OR public (for active tables)
  is_active = true
  or exists (
    select 1 from public.restaurants r
    where r.id = restaurant_tables.restaurant_id
      and r.user_id = auth.uid()
  )
  or exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- Allow admins to read all menu items
drop policy if exists menu_items_admin_select on public.menu_items;
create policy menu_items_admin_select
on public.menu_items
for select
to authenticated
using (
  -- Public OR restaurant owner OR admin
  true
  or exists (
    select 1 from public.restaurants r
    where r.id = menu_items.restaurant_id
      and r.user_id = auth.uid()
  )
  or exists (
    select 1 from public.admin_users
    where email = auth.jwt() ->> 'email'
      and is_active = true
  )
);

-- ---------------------------------------------------------------------
-- 10. SEED FIRST ADMIN USER (CHANGE EMAIL/PASSWORD IN PRODUCTION!)
-- ---------------------------------------------------------------------
-- This creates the first admin account
-- IMPORTANT: Change this email to your real admin email
insert into public.admin_users (email, name, role)
values ('admin@scan2dish.com', 'System Admin', 'super_admin')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------
-- COMPLETE
-- ---------------------------------------------------------------------
-- Run this after base schema.sql
-- Admin panel will check admin_users table for authentication
