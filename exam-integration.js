(() => {
"use strict";

/* ============================================================
   V39.3 — Exam Notification Center
   - Student + Admin notification bell
   - Bell wiggles while unread notifications exist
   - Professional notification drawer
   - Mark all read / refresh / delete one / clear all
   - Student: assigned, in-progress, submitted, reviewed/result
   - Admin: pending teacher-review notifications
   - Keeps V39.2 exam banners + floating action badge behavior
   - No backend/database change required
   ============================================================ */

if (window.__brightbyteExamIntegrationV393) return;
window.__brightbyteExamIntegrationV393 = true;

const EXAM_API = "https://api.tanweer.site";
const studentToken = () => localStorage.getItem("brightbyte_student_token") || "";
const adminToken = () => localStorage.getItem("brightbyte_admin_token") || "";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

const nowIso = () => new Date().toISOString();

function safeJsonParse(v, fallback) {
  try {
    const x = JSON.parse(v);
    return x && typeof x === "object" ? x : fallback;
  } catch {
    return fallback;
  }
}
function readMap(key) {
  return safeJsonParse(localStorage.getItem(key) || "{}", {});
}
function writeMap(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function readKey(role) { return `brightbyte_exam_notice_read_${role}_v393`; }
function dismissKey(role) { return `brightbyte_exam_notice_dismissed_${role}_v393`; }

function markRead(role, id) {
  const m = readMap(readKey(role));
  m[id] = nowIso();
  writeMap(readKey(role), m);
}
function markManyRead(role, ids) {
  const m = readMap(readKey(role));
  const stamp = nowIso();
  ids.forEach(id => m[id] = stamp);
  writeMap(readKey(role), m);
}
function dismissNotice(role, id) {
  const m = readMap(dismissKey(role));
  m[id] = nowIso();
  writeMap(dismissKey(role), m);
}
function dismissMany(role, ids) {
  const m = readMap(dismissKey(role));
  const stamp = nowIso();
  ids.forEach(id => m[id] = stamp);
  writeMap(dismissKey(role), m);
}
function isRead(role, id) {
  return !!readMap(readKey(role))[id];
}
function isDismissed(role, id) {
  return !!readMap(dismissKey(role))[id];
}
function visibleNotices(role, notices) {
  return notices.filter(n => !isDismissed(role, n.id));
}
function unreadNotices(role, notices) {
  return visibleNotices(role, notices).filter(n => !isRead(role, n.id));
}

let state = {
  student: { notices: [], data: null },
  admin: { notices: [], data: null }
};

function addStyle() {
  if (document.getElementById("bbNoticeStyleV393")) return;
  const s = document.createElement("style");
  s.id = "bbNoticeStyleV393";
  s.textContent = `
  :root{--bbn-purple:#6557ff;--bbn-cyan:#28cdbd;--bbn-pink:#ed4d8f;--bbn-ink:#242a50;--bbn-muted:#747b98;--bbn-line:#e8eaf5}

  .bbn-top-btn{
    border:0!important;cursor:pointer!important;position:relative!important;
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    gap:6px!important;min-width:42px!important;height:38px!important;padding:0 10px!important;
    border-radius:12px!important;text-decoration:none!important;
    color:#40386f!important;background:linear-gradient(180deg,#fff9d9,#ffe36d)!important;
    box-shadow:0 4px 0 #e7bb39,0 8px 18px #4d4a7c18!important;
    font:900 12px/1 system-ui!important;vertical-align:middle!important;
  }
  .bbn-top-btn:hover{transform:translateY(-1px)}
  .bbn-top-btn .bbn-bell{display:inline-grid;place-items:center;font-size:16px;transform-origin:50% 0}
  .bbn-top-btn.ringing .bbn-bell{animation:bbnRing 1.35s ease-in-out infinite}
  .bbn-count{
    min-width:19px;height:19px;padding:0 5px;border-radius:999px;display:inline-grid;place-items:center;
    background:#ef456f;color:white;font:950 9px/1 system-ui;box-shadow:0 0 0 2px #fff;
  }
  .bbn-count.zero{display:none}
  @keyframes bbnRing{
    0%,45%,100%{transform:rotate(0)}
    8%{transform:rotate(17deg)}16%{transform:rotate(-14deg)}
    24%{transform:rotate(11deg)}32%{transform:rotate(-8deg)}38%{transform:rotate(4deg)}
  }
  @media(prefers-reduced-motion:reduce){.bbn-top-btn.ringing .bbn-bell{animation:none}}

  #bbnFallbackBtn{
    position:fixed!important;right:18px!important;top:18px!important;z-index:10010!important
  }

  .bbn-overlay{
    position:fixed;inset:0;z-index:10050;background:#080d2c80;backdrop-filter:blur(5px);
    opacity:0;pointer-events:none;transition:.2s
  }
  .bbn-overlay.open{opacity:1;pointer-events:auto}
  .bbn-drawer{
    position:absolute;right:0;top:0;height:100%;width:min(430px,100%);background:#f7f8ff;
    box-shadow:-24px 0 70px #11173938;transform:translateX(105%);transition:.24s ease;
    display:flex;flex-direction:column;color:var(--bbn-ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif
  }
  .bbn-overlay.open .bbn-drawer{transform:translateX(0)}
  .bbn-head{
    padding:18px 18px 14px;background:linear-gradient(135deg,#171d52,#313985 62%,#654bd2);
    color:white;display:flex;align-items:center;justify-content:space-between;gap:12px
  }
  .bbn-head-copy{min-width:0}.bbn-head-copy small{display:block;color:#cdd5ff;font-size:9px;font-weight:850;letter-spacing:1px}
  .bbn-head-copy h2{margin:3px 0 0;font-size:21px}
  .bbn-head-actions{display:flex;gap:7px}
  .bbn-head-actions button{
    width:36px;height:36px;border:0;border-radius:11px;background:#ffffff17;color:#fff;cursor:pointer;font-size:18px
  }
  .bbn-toolbar{
    padding:10px 12px;display:flex;gap:7px;align-items:center;background:#fff;border-bottom:1px solid var(--bbn-line)
  }
  .bbn-toolbar button{
    border:1px solid var(--bbn-line);background:#f7f7ff;color:#4e5579;border-radius:10px;
    padding:8px 10px;font:850 10px/1 system-ui;cursor:pointer
  }
  .bbn-toolbar button:hover{border-color:#c8c5ff;background:#f1efff}
  .bbn-toolbar .bbn-spacer{flex:1}
  .bbn-toolbar .danger{color:#bc3e58;background:#fff6f7}
  .bbn-list{padding:12px;overflow:auto;flex:1;display:grid;align-content:start;gap:10px}
  .bbn-empty{
    padding:42px 18px;text-align:center;background:white;border:1px dashed #cfd4e8;border-radius:18px;color:var(--bbn-muted)
  }
  .bbn-empty .ico{font-size:42px;display:block;margin-bottom:8px}
  .bbn-card{
    position:relative;background:white;border:1px solid var(--bbn-line);border-radius:18px;padding:14px;
    box-shadow:0 9px 26px #3b43800d;display:grid;grid-template-columns:42px 1fr;gap:11px
  }
  .bbn-card.unread{border-color:#bcb7ff;box-shadow:0 10px 30px #6557ff16}
  .bbn-card.unread:before{
    content:"";position:absolute;right:13px;top:13px;width:8px;height:8px;border-radius:50%;background:#6a5cff
  }
  .bbn-ico{
    width:42px;height:42px;border-radius:13px;background:#f0eeff;display:grid;place-items:center;font-size:21px
  }
  .bbn-card.review .bbn-ico{background:#fff0f4}
  .bbn-card.result-pass .bbn-ico{background:#e8fff4}
  .bbn-card.result-fail .bbn-ico{background:#fff0f3}
  .bbn-body{min-width:0;padding-right:7px}
  .bbn-title{font-size:12px;font-weight:950;line-height:1.35;margin-right:8px}
  .bbn-msg{font-size:10px;color:var(--bbn-muted);line-height:1.55;margin-top:4px}
  .bbn-meta{font-size:8.5px;color:#999fb5;margin-top:6px}
  .bbn-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
  .bbn-actions a,.bbn-actions button{
    border:0;border-radius:10px;padding:8px 10px;text-decoration:none;cursor:pointer;font:900 9px/1 system-ui
  }
  .bbn-open{background:linear-gradient(135deg,var(--bbn-purple),var(--bbn-cyan));color:white}
  .bbn-delete{background:#fff0f2;color:#bd4058}
  .bbn-read{background:#f0f1f8;color:#626985}
  .bbn-foot{
    border-top:1px solid var(--bbn-line);background:white;padding:10px 14px;color:#8a90a7;font-size:9px;line-height:1.4
  }

  /* Existing V39.2-style top banners / floating action */
  #examBellV393,#examAdminBellV393{
    position:fixed;right:18px;bottom:92px;z-index:9990;border:0;border-radius:999px;padding:12px 16px;
    background:linear-gradient(135deg,#6a5cff,#23cdb8);color:#fff;font:800 12px/1 system-ui;
    box-shadow:0 14px 38px #433cb73d;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:8px
  }
  #examAdminBellV393{background:linear-gradient(135deg,#ff6b8a,#7c5cff)}
  #examBellV393 .exam-count,#examAdminBellV393 .exam-count{
    min-width:22px;height:22px;border-radius:99px;background:#fff;color:#5548c7;display:grid;place-items:center;font-size:10px
  }
  #examBannerV393,#examAdminBannerV393,#examResultBannerV393{
    position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9989;width:min(680px,calc(100% - 26px));
    border:1px solid #cbd0ff;border-radius:18px;background:#fff;box-shadow:0 16px 45px #1f275323;
    padding:12px 14px;display:flex;align-items:center;gap:12px;font-family:system-ui;color:#272d53
  }
  #examAdminBannerV393{border-color:#ffd1db;background:#fffafd}
  #examResultBannerV393.pass{border-color:#9fe5c9;background:#f5fff9}
  #examResultBannerV393.fail{border-color:#ffc4ce;background:#fff8f9}
  .exam-v393-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:#eeeaff;font-size:22px;flex:0 0 auto}
  .exam-v393-copy{min-width:0;flex:1}.exam-v393-copy b,.exam-v393-copy small{display:block}
  .exam-v393-copy small{color:#777e9a;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .exam-v393-action{border:0;border-radius:11px;background:#6254f8;color:#fff;padding:10px 12px;text-decoration:none;font-size:11px;font-weight:900;white-space:nowrap}
  .exam-v393-close{border:0;background:transparent;color:#7c839d;font-size:18px;cursor:pointer}

  .exam-admin-nav-v393{display:block!important;text-decoration:none!important;position:relative}
  .exam-admin-nav-v393 .exam-admin-count-v393{
    margin-left:8px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#ffdd65;color:#402f00;
    display:inline-grid;place-items:center;font-size:9px;font-weight:950
  }

  @media(max-width:700px){
    .bbn-top-btn{height:34px!important;min-width:38px!important;padding:0 8px!important}
    #examBannerV393,#examAdminBannerV393,#examResultBannerV393{top:auto;bottom:76px}
    .exam-v393-copy small{display:none}
    #examBellV393,#examAdminBellV393{right:12px;bottom:88px}
  }
  `;
  document.head.appendChild(s);
}

function removeNode(id) { document.getElementById(id)?.remove(); }

async function studentExams() {
  const token = studentToken();
  if (!token) return null;
  const r = await fetch(EXAM_API + "/api/student/exams", {
    headers:{ Authorization:`Bearer ${token}` },
    cache:"no-store"
  });
  if (!r.ok) return null;
  return await r.json();
}

async function adminExams() {
  const token = adminToken();
  if (!token) return null;
  const r = await fetch(EXAM_API + "/api/admin/exams", {
    headers:{ Authorization:`Bearer ${token}` },
    cache:"no-store"
  });
  if (!r.ok) return null;
  return await r.json();
}

function studentNoticeRows(data) {
  const rows = data?.exams || [];
  return rows.map(row => {
    const status = String(row.assignment_status || "");
    const base = {
      examId: row.exam_id,
      sortAt: row.reviewed_at || row.submitted_at || row.started_at || row.created_at || row.available_from || "",
      href: "student-exams.html"
    };

    if (status === "assigned") return {
      ...base,
      id:`student:${row.exam_id}:assigned:${row.available_until || ""}`,
      type:"assigned", icon:"📝",
      title:"New exam assigned",
      message:`${row.title} • ${row.duration_minutes} min • Pass ${row.pass_mark}%`,
      action:"Open Exam"
    };
    if (status === "in_progress") return {
      ...base,
      id:`student:${row.exam_id}:inprogress:${row.started_at || ""}`,
      type:"inprogress", icon:"⏱️",
      title:"Exam in progress",
      message:`${row.title} • Your timer has already started.`,
      action:"Resume"
    };
    if (status === "submitted") return {
      ...base,
      id:`student:${row.exam_id}:submitted:${row.submitted_at || ""}`,
      type:"submitted", icon:"📨",
      title:"Exam submitted",
      message:`${row.title} • Waiting for teacher review.`,
      action:"View Status"
    };
    if (status === "reviewed") {
      const pass = String(row.result || "").toUpperCase() === "PASS";
      return {
        ...base,
        id:`student:${row.exam_id}:reviewed:${row.reviewed_at || ""}:${row.result || ""}:${row.final_score ?? ""}`,
        type:pass ? "result-pass" : "result-fail",
        icon:pass ? "🏆" : "📘",
        title:pass ? "Result ready — PASS" : "Result ready — " + (row.result || "REVIEWED"),
        message:`${row.title} • Score ${Number(row.final_score ?? 0)}%`,
        action:"View Result"
      };
    }
    return null;
  }).filter(Boolean);
}

function adminNoticeRows(data) {
  const rows = data?.exams || [];
  return rows.filter(e => Number(e.pending_review_count || 0) > 0).map(e => {
    const count = Number(e.pending_review_count || 0);
    return {
      id:`admin:review:${e.id}:${count}`,
      type:"review",
      icon:"📬",
      title:`${count} submission${count === 1 ? "" : "s"} waiting for review`,
      message:`${e.title} • Review written answers and finalize PASS / FAIL.`,
      href:"exam-center.html#review",
      action:"Review Now",
      sortAt:e.created_at || ""
    };
  });
}

function currentRole() {
  if (adminToken()) return "admin";
  if (studentToken()) return "student";
  return "";
}

function noticeCount(role) {
  return unreadNotices(role, state[role]?.notices || []).length;
}

function placeTopButton(role) {
  removeNode("bbnTopBtnV393");
  if (!role) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "bbnTopBtnV393";
  btn.className = "bbn-top-btn";
  btn.setAttribute("aria-label", "Open notifications");
  btn.innerHTML = `<span class="bbn-bell">🔔</span><span class="bbn-count zero">0</span>`;
  btn.onclick = () => openCenter(role);

  let target = null;
  if (role === "student") {
    target = document.querySelector(".top-actions") || document.querySelector(".nav");
    if (target) {
      const logout = target.querySelector("#logoutBtn,.danger-chip,.danger");
      if (logout) target.insertBefore(btn, logout);
      else target.appendChild(btn);
    }
  } else {
    target = document.querySelector(".top-actions") || document.querySelector("nav");
    if (target) target.insertBefore(btn, target.firstChild);
  }

  if (!btn.isConnected) {
    btn.id = "bbnFallbackBtn";
    document.body.appendChild(btn);
  }
  updateTopButton(role);
}

function updateTopButton(role) {
  const btn = document.getElementById("bbnTopBtnV393") || document.getElementById("bbnFallbackBtn");
  if (!btn) return;
  const count = noticeCount(role);
  const badge = btn.querySelector(".bbn-count");
  if (badge) {
    badge.textContent = String(Math.min(99, count));
    badge.classList.toggle("zero", count === 0);
  }
  btn.classList.toggle("ringing", count > 0);
  btn.title = count ? `${count} unread notification${count === 1 ? "" : "s"}` : "No unread notifications";
}

function ensureCenter() {
  if (document.getElementById("bbnOverlayV393")) return;
  const wrap = document.createElement("div");
  wrap.id = "bbnOverlayV393";
  wrap.className = "bbn-overlay";
  wrap.innerHTML = `
    <aside class="bbn-drawer" role="dialog" aria-modal="true" aria-label="Notifications">
      <header class="bbn-head">
        <div class="bbn-head-copy"><small>ACADEMY ALERTS</small><h2>Notifications</h2></div>
        <div class="bbn-head-actions">
          <button id="bbnRefreshV393" type="button" title="Refresh">↻</button>
          <button id="bbnCloseV393" type="button" title="Close">×</button>
        </div>
      </header>
      <div class="bbn-toolbar">
        <button id="bbnMarkReadV393" type="button">✓ Mark all read</button>
        <span class="bbn-spacer"></span>
        <button id="bbnClearV393" class="danger" type="button">🗑 Clear all</button>
      </div>
      <section id="bbnListV393" class="bbn-list"></section>
      <footer class="bbn-foot">Deleting a notification only hides the message on this browser. It does not delete the exam, result or review record.</footer>
    </aside>`;
  document.body.appendChild(wrap);

  wrap.addEventListener("click", e => {
    if (e.target === wrap) closeCenter();
  });
  document.getElementById("bbnCloseV393").onclick = closeCenter;
  document.getElementById("bbnRefreshV393").onclick = async () => {
    await refreshAll(true);
    const role = currentRole();
    if (role) renderCenter(role);
  };
  document.getElementById("bbnMarkReadV393").onclick = () => {
    const role = currentRole();
    if (!role) return;
    const ids = visibleNotices(role, state[role].notices).map(n => n.id);
    markManyRead(role, ids);
    renderCenter(role);
    updateTopButton(role);
  };
  document.getElementById("bbnClearV393").onclick = () => {
    const role = currentRole();
    if (!role) return;
    const ids = visibleNotices(role, state[role].notices).map(n => n.id);
    dismissMany(role, ids);
    renderCenter(role);
    updateTopButton(role);
  };
}

function openCenter(role) {
  ensureCenter();
  const ids = visibleNotices(role, state[role].notices).map(n => n.id);
  markManyRead(role, ids);
  renderCenter(role);
  updateTopButton(role);
  document.getElementById("bbnOverlayV393").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCenter() {
  document.getElementById("bbnOverlayV393")?.classList.remove("open");
  document.body.style.overflow = "";
}

function renderCenter(role) {
  ensureCenter();
  const list = document.getElementById("bbnListV393");
  const notices = visibleNotices(role, state[role].notices)
    .slice()
    .sort((a,b) => String(b.sortAt || "").localeCompare(String(a.sortAt || "")));

  if (!notices.length) {
    list.innerHTML = `<div class="bbn-empty"><span class="ico">🔔</span><b>You're all caught up</b><br><small>No exam notifications are waiting right now.</small></div>`;
    return;
  }

  list.innerHTML = notices.map(n => {
    const unread = !isRead(role, n.id);
    return `
      <article class="bbn-card ${unread ? "unread" : ""} ${esc(n.type || "")}" data-notice="${esc(n.id)}">
        <div class="bbn-ico">${n.icon || "🔔"}</div>
        <div class="bbn-body">
          <div class="bbn-title">${esc(n.title)}</div>
          <div class="bbn-msg">${esc(n.message)}</div>
          <div class="bbn-meta">${unread ? "NEW • " : ""}${esc(n.sortAt ? new Date(n.sortAt).toLocaleString() : "Exam notification")}</div>
          <div class="bbn-actions">
            <a class="bbn-open" href="${esc(n.href)}" data-open-notice="${esc(n.id)}">${esc(n.action || "Open")}</a>
            ${unread ? `<button class="bbn-read" type="button" data-read-notice="${esc(n.id)}">Mark read</button>` : ""}
            <button class="bbn-delete" type="button" data-delete-notice="${esc(n.id)}">Delete</button>
          </div>
        </div>
      </article>`;
  }).join("");

  list.querySelectorAll("[data-open-notice]").forEach(a => {
    a.addEventListener("click", () => {
      markRead(role, a.dataset.openNotice);
      updateTopButton(role);
    });
  });
  list.querySelectorAll("[data-read-notice]").forEach(btn => {
    btn.onclick = () => {
      markRead(role, btn.dataset.readNotice);
      renderCenter(role);
      updateTopButton(role);
    };
  });
  list.querySelectorAll("[data-delete-notice]").forEach(btn => {
    btn.onclick = () => {
      dismissNotice(role, btn.dataset.deleteNotice);
      renderCenter(role);
      updateTopButton(role);
    };
  });
}

function bannerClose(button, parent, role, noticeId) {
  button.onclick = () => {
    if (noticeId) markRead(role, noticeId);
    parent.remove();
    updateTopButton(role);
  };
}

function renderStudentLegacy(data) {
  removeNode("examBellV393");
  removeNode("examBannerV393");
  removeNode("examResultBannerV393");

  const notices = visibleNotices("student", state.student.notices);
  const activeRows = (data?.exams || []).filter(x => ["assigned","in_progress"].includes(x.assignment_status));
  const freshResultNotice = notices.find(n => n.type === "result-pass" || n.type === "result-fail");
  const activeNotice = notices.find(n => n.type === "inprogress" || n.type === "assigned");

  if (freshResultNotice && !isRead("student", freshResultNotice.id)) {
    const pass = freshResultNotice.type === "result-pass";
    const banner = document.createElement("div");
    banner.id = "examResultBannerV393";
    banner.className = pass ? "pass" : "fail";
    banner.innerHTML = `
      <div class="exam-v393-icon">${pass ? "🏆" : "📘"}</div>
      <div class="exam-v393-copy"><b>${esc(freshResultNotice.title)}</b><small>${esc(freshResultNotice.message)}</small></div>
      <a class="exam-v393-action" href="${esc(freshResultNotice.href)}">View Result</a>
      <button class="exam-v393-close" type="button" aria-label="Close">×</button>`;
    banner.querySelector("a").onclick = () => markRead("student", freshResultNotice.id);
    bannerClose(banner.querySelector("button"), banner, "student", freshResultNotice.id);
    document.body.appendChild(banner);
  } else if (activeNotice && !isRead("student", activeNotice.id)) {
    const resume = activeNotice.type === "inprogress";
    const banner = document.createElement("div");
    banner.id = "examBannerV393";
    banner.innerHTML = `
      <div class="exam-v393-icon">${resume ? "⏱️" : "📝"}</div>
      <div class="exam-v393-copy"><b>${esc(activeNotice.title)}</b><small>${esc(activeNotice.message)}</small></div>
      <a class="exam-v393-action" href="${esc(activeNotice.href)}">${resume ? "Resume" : "Open"}</a>
      <button class="exam-v393-close" type="button" aria-label="Close">×</button>`;
    banner.querySelector("a").onclick = () => markRead("student", activeNotice.id);
    bannerClose(banner.querySelector("button"), banner, "student", activeNotice.id);
    document.body.appendChild(banner);
  }

  const unread = unreadNotices("student", state.student.notices);
  if (unread.length) {
    const link = document.createElement("button");
    link.type = "button";
    link.id = "examBellV393";
    link.innerHTML = `<span>🔔 Alerts</span><span class="exam-count">${unread.length}</span>`;
    link.onclick = () => openCenter("student");
    document.body.appendChild(link);
  }
}

let lastAdminPending = null;
function renderAdminLegacy(data) {
  removeNode("examAdminBellV393");
  removeNode("examAdminBannerV393");

  const exams = data?.exams || [];
  const pending = exams.reduce((n,e) => n + Number(e.pending_review_count || 0), 0);

  let navLink = document.getElementById("examAdminLinkV393");
  if (!navLink) {
    navLink = document.createElement("a");
    navLink.id = "examAdminLinkV393";
    navLink.href = "exam-center.html";
    navLink.className = "exam-admin-nav-v393";
    const nav = document.querySelector("nav");
    if (nav) nav.appendChild(navLink);
    else {
      navLink.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9992;background:#6557ff;color:white;padding:12px 15px;border-radius:14px;font:900 12px system-ui;box-shadow:0 14px 34px #423bb63b";
      document.body.appendChild(navLink);
    }
  }
  navLink.innerHTML = `📝 Exam Center${pending ? `<span class="exam-admin-count-v393">${pending}</span>` : ""}`;

  const unread = unreadNotices("admin", state.admin.notices);
  if (unread.length) {
    const bell = document.createElement("button");
    bell.type = "button";
    bell.id = "examAdminBellV393";
    bell.innerHTML = `<span>🔔 Review</span><span class="exam-count">${unread.length}</span>`;
    bell.onclick = () => openCenter("admin");
    document.body.appendChild(bell);
  }

  const first = unread[0];
  const shouldBanner = pending > 0 && first && (lastAdminPending === null || pending > lastAdminPending);
  if (shouldBanner) {
    const banner = document.createElement("div");
    banner.id = "examAdminBannerV393";
    banner.innerHTML = `
      <div class="exam-v393-icon">📬</div>
      <div class="exam-v393-copy"><b>${esc(first.title)}</b><small>${esc(first.message)}</small></div>
      <a class="exam-v393-action" href="${esc(first.href)}">Review Now</a>
      <button class="exam-v393-close" type="button" aria-label="Close">×</button>`;
    banner.querySelector("a").onclick = () => markRead("admin", first.id);
    bannerClose(banner.querySelector("button"), banner, "admin", first.id);
    document.body.appendChild(banner);
  }
  lastAdminPending = pending;
}

async function refreshStudent() {
  try {
    const d = await studentExams();
    if (!d?.success) return;
    state.student.data = d;
    state.student.notices = studentNoticeRows(d);
    renderStudentLegacy(d);
    if (currentRole() === "student") {
      placeTopButton("student");
      if (document.getElementById("bbnOverlayV393")?.classList.contains("open")) renderCenter("student");
    }
  } catch (err) {
    console.debug("Exam student notification unavailable", err);
  }
}

async function refreshAdmin() {
  try {
    const d = await adminExams();
    if (!d?.success) return;
    state.admin.data = d;
    state.admin.notices = adminNoticeRows(d);
    renderAdminLegacy(d);
    if (currentRole() === "admin") {
      placeTopButton("admin");
      if (document.getElementById("bbnOverlayV393")?.classList.contains("open")) renderCenter("admin");
    }
  } catch (err) {
    console.debug("Exam admin notification unavailable", err);
  }
}

async function refreshAll(manual = false) {
  const role = currentRole();
  if (role === "student") await refreshStudent();
  else if (role === "admin") await refreshAdmin();
  if (manual && role) {
    const btn = document.getElementById("bbnTopBtnV393") || document.getElementById("bbnFallbackBtn");
    if (btn) {
      const old = btn.title;
      btn.title = "Notifications refreshed";
      setTimeout(() => btn.title = old, 1200);
    }
  }
}

function activateHashReviewHelper() {
  if (!adminToken()) return;
  const openHash = () => {
    if (!/^#review/i.test(location.hash || "")) return;
    const tryOpen = () => {
      const btn = document.querySelector('.tab[data-tab="review"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    };
    if (!tryOpen()) {
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (tryOpen() || tries > 20) clearInterval(t);
      }, 250);
    }
  };
  openHash();
  window.addEventListener("hashchange", openHash);
}

function boot() {
  addStyle();
  ensureCenter();
  const role = currentRole();
  if (role) placeTopButton(role);
  refreshAll();
  activateHashReviewHelper();

  setInterval(() => {
    if (currentRole() === "student") refreshStudent();
  }, 30000);

  setInterval(() => {
    if (currentRole() === "admin") refreshAdmin();
  }, 20000);

  window.addEventListener("focus", () => refreshAll());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once:true });
} else {
  boot();
}
})();
