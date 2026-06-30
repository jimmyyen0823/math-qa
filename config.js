// ===== 學測數學解題站 — 連線設定（皆為公開值，放前端安全）=====
const SUPABASE_URL = 'https://mweswjemcqxwppumaztf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5tMOTu9e4YRcE11UQP-cCg_C-xh2gQq';
const SCHOOL_DOMAIN = 'tkgsh.tn.edu.tw';   // 只允許這個網域登入上傳
const OPEN_START = 12;                      // 開放上傳起（台灣時間，含）
const OPEN_END = 21;                        // 開放上傳迄（台灣時間，不含）

// 建立 Supabase 連線（需在 supabase-js 之後載入）
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 取得台灣時間的小時/分鐘（不受使用者裝置時區影響）
function taipeiNow() {
  var p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  var h = 0, m = 0;
  p.forEach(function (x) { if (x.type === 'hour') h = +x.value; if (x.type === 'minute') m = +x.value; });
  return { h: h, m: m, txt: (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) };
}
function isOpenNow() { var t = taipeiNow(); return t.h >= OPEN_START && t.h < OPEN_END; }
