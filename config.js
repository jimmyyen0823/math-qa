// ===== 學測數學解題站 — 連線設定（皆為公開值，放前端安全）=====
const SUPABASE_URL = 'https://mweswjemcqxwppumaztf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5tMOTu9e4YRcE11UQP-cCg_C-xh2gQq';
const SCHOOL_DOMAIN = 'tkgsh.tn.edu.tw';   // 只允許這個網域登入上傳
// 時段限制已永久解除：全天開放上傳（原為台灣時間 12:00–21:00）。

// 建立 Supabase 連線（需在 supabase-js 之後載入）
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
