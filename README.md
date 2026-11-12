# 旅账 · 旅行 AA 记账

静态网页 + Supabase 云数据库（和 manmanlai 同一套做法），部署在 GitHub Pages。手机上「添加到主屏幕」就像 App 一样用；所有人实时同步，断网也能记账，联网后自动上传。

## 功能
- 多个旅行账本，成员管理
- 5 种分摊方式：平均 / 按金额 / 按比例 / 按份数 / 逐项（含税、服务费、小费按比例分摊）
- 多人一起付款
- 多币种：每笔可用外币，一键获取实时汇率，统一折算成本位币结算
- 结余 + 简化债务（最少转账次数）+ 一键记录还款
- 统计图：类别占比、每人消费 vs 垫付、每日花费
- 搜索、类别筛选、收据照片、备注
- 导出 Excel (CSV)、完整备份 (JSON)、复制结算清单发群聊
- 深色模式

## 部署到 GitHub Pages
1. 在 GitHub 新建一个仓库（例如 `tripsplit`，Public）。
2. 把这个文件夹里的文件全部上传（`index.html`、`sw.js`、`manifest.webmanifest`、`icon.svg`、`icon-180.png`、`icon-512.png`）。
3. 仓库 → Settings → Pages → Source 选 `Deploy from a branch`，Branch 选 `main` / `/ (root)` → Save。
4. 约 1 分钟后访问 `https://<你的用户名>.github.io/tripsplit/`。
5. 手机 Safari 打开 → 分享 → 添加到主屏幕。

## 云数据库（Supabase）
- `config.js`：Supabase 项目地址 + publishable key（公开的，不是密码）。不填就是单机模式。
- `schema.sql`：在 Supabase 的 SQL Editor 里运行一次，建 `ts_rows` 表（每行是一个旅行 / 成员 / 账单）。
- 每台手机本地也存一份，离线照常记账，联网后自动上传；别人改了会实时推送过来。

## 和朋友同步
建好旅行后点右上角 ☁️ →「复制邀请链接」发到群里，朋友打开链接、选一下自己是谁，就加入了。之后谁记账，所有人手机实时更新。

> 拿到邀请链接的人都能查看和修改这个账本，只发给一起旅行的朋友。
> 没有云同步时（离线版 / 未配置），仍然可以用「同步码」手动合并。
