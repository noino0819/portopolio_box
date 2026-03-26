-- portfolios: 포트폴리오 메타 정보
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  is_active boolean default true,
  youtube_playlist_id text,
  youtube_first_video_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- portfolio_data: 언어별 포트폴리오 콘텐츠
create table if not exists public.portfolio_data (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references public.portfolios(id) on delete cascade not null,
  lang text not null,
  profile jsonb not null default '{}',
  education jsonb not null default '[]',
  certifications jsonb not null default '[]',
  projects jsonb not null default '[]',
  awards jsonb not null default '[]',
  games jsonb not null default '[]',
  albums jsonb not null default '[]',
  books jsonb not null default '[]',
  hobbies jsonb not null default '[]',
  cd_story jsonb not null default '[]',
  updated_at timestamptz default now(),
  unique(portfolio_id, lang)
);

-- payments: 결제 내역
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  plan_type text not null check (plan_type in ('monthly', 'yearly', 'permanent')),
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  toss_payment_key text,
  toss_order_id text,
  slug_reserved text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 인덱스
create index if not exists idx_portfolios_slug on public.portfolios(slug);
create index if not exists idx_portfolios_user_id on public.portfolios(user_id);
create index if not exists idx_portfolio_data_portfolio_lang on public.portfolio_data(portfolio_id, lang);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_payments_toss_order_id on public.payments(toss_order_id);

-- updated_at 자동 갱신 트리거
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger portfolios_updated_at
  before update on public.portfolios
  for each row execute function public.update_updated_at();

create trigger portfolio_data_updated_at
  before update on public.portfolio_data
  for each row execute function public.update_updated_at();

-- RLS 활성화
alter table public.portfolios enable row level security;
alter table public.portfolio_data enable row level security;
alter table public.payments enable row level security;

-- portfolios 정책
create policy "portfolios_select_active"
  on public.portfolios for select
  using (is_active = true);

create policy "portfolios_select_own"
  on public.portfolios for select
  using (auth.uid() = user_id);

create policy "portfolios_insert_own"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "portfolios_update_own"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "portfolios_delete_own"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- portfolio_data 정책
create policy "portfolio_data_select_active"
  on public.portfolio_data for select
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.is_active = true
    )
  );

create policy "portfolio_data_select_own"
  on public.portfolio_data for select
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "portfolio_data_insert_own"
  on public.portfolio_data for insert
  with check (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "portfolio_data_update_own"
  on public.portfolio_data for update
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

create policy "portfolio_data_delete_own"
  on public.portfolio_data for delete
  using (
    exists (
      select 1 from public.portfolios p
      where p.id = portfolio_id and p.user_id = auth.uid()
    )
  );

-- payments 정책
create policy "payments_select_own"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "payments_insert_authenticated"
  on public.payments for insert
  with check (auth.uid() is not null);

create policy "payments_update_own"
  on public.payments for update
  using (auth.uid() = user_id);
