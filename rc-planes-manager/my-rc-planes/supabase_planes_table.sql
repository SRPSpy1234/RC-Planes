-- Supabase SQL for user-linked planes table
create table if not exists planes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  components jsonb,
  image text,
  created_at timestamp with time zone default timezone('utc', now())
);
create index if not exists idx_planes_user_id on planes(user_id);