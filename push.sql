-- 旅账 · 锁屏推送：记录每台手机在每个旅行里是谁、推送地址是什么
-- 在 Supabase 的 SQL Editor 里整段运行一次
create table if not exists ts_push (
  endpoint text not null,        -- 这台手机的推送地址
  trip_id text not null,         -- 哪个旅行
  member text not null,          -- 在这个旅行里是谁（成员 id）
  sub jsonb not null,            -- 浏览器给的完整订阅信息
  created bigint,
  primary key (endpoint, trip_id)
);
create index if not exists ts_push_trip on ts_push (trip_id);
alter table ts_push enable row level security;
drop policy if exists "open ts_push" on ts_push;
create policy "open ts_push" on ts_push for all using (true) with check (true);
