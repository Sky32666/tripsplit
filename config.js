// 旅账的 Supabase 项目（publishable key 和 vapid 公钥本来就是公开放在前端的，不是密码）
// 不填 / 填 YOUR_ 开头的值 = 单机模式（用同步码手动同步）
window.LVZHANG = {
  supabaseUrl: "https://zfjcylsrldnxxawxjvec.supabase.co",
  supabaseKey: "sb_publishable_pcHf3PPdqCr3pvVAgLHulw_Cj-YpQxx",
  // 推送通知的公钥（对应的私钥只放在 Supabase 的 Secrets 里）
  vapidPublicKey: "BATzKm9xTAFpau6jvjnjZA8lgXA7YGORyHVrMpz_d-9wcqHVoFwg401qZptb8Ad0yRTRhp60dv0kiEcQbnmyNgw"
};
