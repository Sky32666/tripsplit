-- 旅账：在 Supabase 的 SQL Editor 里整段运行一次
-- 一张表存所有东西：每一行是一个旅行 / 成员 / 账单，data 里是完整内容
create table if not exists ts_rows (
  id text primary key,
  trip_id text not null,
  kind text not null check (kind in ('trip','member','expense')),
  data jsonb not null,
  updated_at bigint not null
);
create index if not exists ts_rows_trip on ts_rows (trip_id);

-- 和 manmanlai 一样：知道旅行链接（随机 ID）就能读写
alter table ts_rows enable row level security;
drop policy if exists "open ts_rows" on ts_rows;
create policy "open ts_rows" on ts_rows for all using (true) with check (true);

-- 实时同步
alter table ts_rows replica identity full;
alter publication supabase_realtime add table ts_rows;
