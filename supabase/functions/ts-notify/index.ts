// 旅账 · 锁屏推送（和慢慢来同一套做法）
// App 里有人记账 / 还钱 / 确认收款时调用这里，推送给同一个旅行里相关的人
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
);
// 苹果只认没有路径的网址（或 mailto:），所以把路径去掉
const subject = (Deno.env.get("VAPID_SUBJECT") ?? "https://sky32666.github.io").replace(/^(https:\/\/[^/]+).*$/, "$1");
webpush.setVapidDetails(subject, Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

type Sub = { endpoint: string; trip_id: string; member: string; sub: webpush.PushSubscription };

async function send(s: Sub, payload: Record<string, unknown>) {
  try {
    await webpush.sendNotification(s.sub, JSON.stringify(payload), { TTL: 86400, urgency: "high" });
    return true;
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode;
    if (code === 404 || code === 410) await sb.from("ts_push").delete().eq("endpoint", s.endpoint); // 手机已经取消订阅
    console.error("push failed", code, (e as Error).message);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const body = await req.json().catch(() => ({}));
  const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

  // 测试：只发给这一台手机
  if (body.endpoint) {
    const { data } = await sb.from("ts_push").select("*").eq("endpoint", body.endpoint).limit(1);
    if (!data?.length) return json({ sent: 0 });
    const ok = await send(data[0] as Sub, { title: clip(body.title || "🔔 测试通知", 80), body: clip(body.text, 160), url: body.url, tag: "test" });
    return json({ sent: ok ? 1 : 0 });
  }

  const { trip, to, from, title, text, url, tag } = body;
  if (!trip || !title) return json({ error: "trip and title are required" }, 400);
  let q = sb.from("ts_push").select("*").eq("trip_id", trip);
  if (Array.isArray(to) && to.length) q = q.in("member", to.map(String));
  if (from) q = q.neq("member", String(from));
  const { data: subs } = await q;
  let sent = 0;
  for (const s of (subs ?? []) as Sub[]) {
    if (await send(s, { title: clip(title, 80), body: clip(text, 160), url, tag })) sent++;
  }
  return json({ sent });
});
