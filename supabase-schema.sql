-- Run this in Supabase → SQL Editor → New Query

create table if not exists leads (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  name            text,
  company         text,
  email           text        not null,
  need            text,
  message         text,
  provider_id     integer,
  provider_name   text,
  provider_type   text,
  score           integer,
  grade           text,
  source          text        default 'directory'
);

create table if not exists applications (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  org        text        not null,
  contact    text,
  email      text        not null,
  phone      text,
  url        text,
  tier       text,
  message    text
);

-- Disable RLS so the service role key can write freely
-- (you can tighten this later once you have an admin login)
alter table leads        disable row level security;
alter table applications disable row level security;
