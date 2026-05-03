-- Create vehicles table for rate management
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  type text unique not null, -- e.g., 'Hatchback', 'Sedan', 'SUV'
  base_fare numeric not null default 50.0,
  rate_per_km numeric not null default 12.0,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null
);

-- Seed initial vehicle data
insert into public.vehicles (type, base_fare, rate_per_km)
values 
  ('Hatchback', 40.0, 10.0),
  ('Sedan', 60.0, 15.0),
  ('SUV', 100.0, 25.0);

-- Create bookings table
create type public.booking_status as enum ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  driver_id uuid references auth.users, -- can be null until accepted
  pickup_address text not null,
  drop_address text not null,
  pickup_coords point, -- optional for MVP
  drop_coords point, -- optional for MVP
  distance numeric not null, -- in km
  fare numeric not null,
  status booking_status default 'pending'::public.booking_status not null,
  vehicle_type text references public.vehicles(type) not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.vehicles enable row level security;
alter table public.bookings enable row level security;

-- Vehicles policies: viewable by all
create policy "Vehicles are viewable by everyone." on public.vehicles
  for select using (true);

-- Bookings policies: users see their own
create policy "Users can view their own bookings." on public.bookings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings." on public.bookings
  for insert with check (auth.uid() = user_id);

create policy "Drivers can view pending and accepted bookings." on public.bookings
  for select using (
    status = 'pending' or driver_id = auth.uid()
  );
