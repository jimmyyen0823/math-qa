// ===== 學測數學解題站 — 連線設定（皆為公開值，放前端安全）=====
const SUPABASE_URL = 'https://mweswjemcqxwppumaztf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5tMOTu9e4YRcE11UQP-cCg_C-xh2gQq';
const SCHOOL_DOMAIN = 'tkgsh.tn.edu.tw';   // 只允許這個網域登入上傳
// 時段限制已永久解除：全天開放上傳（原為台灣時間 12:00–21:00）。

// 建立 Supabase 連線（需在 supabase-js 之後載入）
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== 2027 學測倒數 =====
const GSAT_TARGET = '2027-01-22';   // 學測第一天（台灣時間）
function daysToGSAT() {
  var todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  var today = new Date(todayStr + 'T00:00:00Z');
  var target = new Date(GSAT_TARGET + 'T00:00:00Z');
  return Math.round((target - today) / 86400000);
}

// ===== 共用登入關卡（index 與 upload 共用同一套視覺與邏輯，改這裡兩頁一起變）=====
const LOGIN_QUOTES = ['要好好打招呼', '盡量不要放棄', '要睡好吃好', '有煩惱就找人商量', '去做的話總會有辦法', '不要勉強，自己也要幸福'];

var GOOGLE_SVG = '<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.8-6.8C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.3 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-3.9 6.8-9.7 6.8-17.4z"/><path fill="#FBBC05" d="M10.4 28.4c-.5-1.5-.8-3.1-.8-4.9s.3-3.4.8-4.9l-7.9-6.1C.9 16 0 19.9 0 23.5s.9 7.5 2.5 11l7.9-6.1z"/><path fill="#34A853" d="M24 47c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-6.4 0-11.7-3.8-13.6-9.1l-7.9 6.1C6.4 42.6 14.6 47 24 47z"/></svg>';

// 只注入一次登入關卡的樣式
function injectLoginGateStyle() {
  if (document.getElementById('lg-style')) return;
  var s = document.createElement('style');
  s.id = 'lg-style';
  s.textContent =
    '.lg{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:30px 22px;text-align:center;max-width:620px;margin:24px auto;animation:lgIn .45s ease both;}' +
    '@keyframes lgIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}' +
    '.lg-countdown{background:#eef2ff;color:#4f46e5;font-weight:700;border-radius:10px;padding:10px 14px;margin:0 0 26px;font-size:15px;}' +
    '.lg-countdown b{font-size:22px;}' +
    '.lg-quote{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:0 0 30px;}' +
    '.lg-quote span{display:inline-grid;place-items:center;min-width:1.5em;padding:5px 7px;font-size:21px;line-height:1;font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;font-weight:900;color:#5a3242;background:linear-gradient(#fff,#f8eef3);border:2px solid #e7bccd;border-radius:9px;box-shadow:0 2px 0 #dcaec1;animation:lgQuote 2.4s ease-in both;}' +
    '.lg-quote span.sep{border:none;background:none;box-shadow:none;min-width:auto;padding:0 1px;color:#b98aa0;}' +
    '@keyframes lgQuote{from{opacity:0;}to{opacity:1;}}' +
    '.lg-p{color:#6b7280;margin:0 0 20px;font-size:14px;}' +
    '.lg-btn{display:inline-flex;align-items:center;gap:10px;background:#fff;cursor:pointer;border:1px solid #dadce0;border-radius:10px;padding:12px 20px;font-size:15px;font-weight:600;color:#3c4043;}' +
    '.lg-btn svg{width:18px;height:18px;}' +
    '.lg-err{color:#dc2626;font-size:14px;margin-top:12px;display:none;}';
  document.head.appendChild(s);
}

// 把登入關卡渲染進 mountEl；subtitle 為第一行提示。回傳 { showError } 供顯示網域錯誤訊息。
function mountLoginGate(mountEl, subtitle) {
  injectLoginGateStyle();
  mountEl.classList.add('lg');
  mountEl.innerHTML =
    '<div class="lg-countdown" id="lg-gsat">—</div>' +
    '<div class="lg-quote" id="lg-quote"></div>' +
    '<p class="lg-p">' + (subtitle || '請先用學校帳號登入') + '<br>只接受 <b>@' + SCHOOL_DOMAIN + '</b> 的 Google 帳號</p>' +
    '<button class="lg-btn" id="lg-btn">' + GOOGLE_SVG + '使用學校 Google 帳號登入</button>' +
    '<div class="lg-err" id="lg-err"></div>';

  var d = daysToGSAT();
  document.getElementById('lg-gsat').innerHTML = d > 0 ? '距學測還有 <b>' + d + '</b> 天'
    : d === 0 ? '🎯 今天就是學測，加油！' : '學測已結束，辛苦了 💪';

  var q = document.getElementById('lg-quote'), text = LOGIN_QUOTES[Math.floor(Math.random() * LOGIN_QUOTES.length)];
  text.split('').forEach(function (ch) {
    var sp = document.createElement('span');
    if (/[，、。！？·]/.test(ch)) sp.className = 'sep';
    sp.textContent = ch;
    q.appendChild(sp);
  });

  document.getElementById('lg-btn').addEventListener('click', function () {
    // 登入後一律導回題庫頁（站台目錄根＝index.html），不停留在提問頁
    var dir = window.location.pathname.replace(/[^/]*$/, '');
    sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + dir,
        queryParams: { hd: SCHOOL_DOMAIN, prompt: 'select_account' }
      }
    });
  });

  return {
    showError: function (msg) { var e = document.getElementById('lg-err'); e.style.display = 'block'; e.textContent = msg; }
  };
}
