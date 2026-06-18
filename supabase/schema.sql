-- Minimize Database Schema (Updated)
-- Run this in Supabase SQL Editor

-- Enable RLS
alter table if exists profiles enable row level security;
alter table if exists redesigns enable row level security;

-- Profiles table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  phone text,
  credits integer default 5,
  plan text default 'free' check (plan in ('free', 'starter', 'pro', 'business', 'payperuse')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Redesigns table
create table if not exists redesigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  original_url text not null,
  result_url text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  style text default 'minimalist',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create storage bucket for uploads
insert into storage.buckets (id, name, public) 
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- RLS Policies for profiles
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- RLS Policies for redesigns
drop policy if exists "Users can view own redesigns" on redesigns;
create policy "Users can view own redesigns"
  on redesigns for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own redesigns" on redesigns;
create policy "Users can insert own redesigns"
  on redesigns for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own redesigns" on redesigns;
create policy "Users can update own redesigns"
  on redesigns for update
  using (auth.uid() = user_id);

-- Storage policies
drop policy if exists "Allow uploads" on storage.objects;
create policy "Allow uploads"
  on storage.objects for insert
  with check (bucket_id = 'uploads');

drop policy if exists "Allow public read" on storage.objects;
create policy "Allow public read"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, credits, plan)
  values (new.id, new.email, 5, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
