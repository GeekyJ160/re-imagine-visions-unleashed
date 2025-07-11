-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create storage bucket for images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Create policy for bucket access
create policy "Users can upload their own images" on storage.objects
  for insert with check (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own images" on storage.objects
  for select using (auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public read access for generated images" on storage.objects
  for select using (bucket_id = 'images');

-- Create generations table
create table public.generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  original_image_url text,
  generated_image_url text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_generations_updated_at
  before update on public.generations
  for each row execute procedure public.handle_updated_at();

-- Enable RLS
alter table public.generations enable row level security;

-- Create policies for generations table
create policy "Users can view their own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own generations" on public.generations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own generations" on public.generations
  for update using (auth.uid() = user_id);

-- Create user profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  credits integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();