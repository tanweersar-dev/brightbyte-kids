(() => {
"use strict";

if (window.__brightbyteExamIntegrationV392) return;
window.__brightbyteExamIntegrationV392 = true;

const EXAM_API = "https://api.tanweer.site";
const studentToken = () => localStorage.getItem("brightbyte_student_token") || "";
const adminToken = () => localStorage.getItem("brightbyte_admin_token") || "";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function addStyle() {
  if (document.getElementById("examIntegrationStyleV392")) return;
  const s = document.createElement("style");
  s.id = "examIntegrationStyleV392";
  s.textContent = `
  #examBellV392,#examAdminBellV392{position:fixed;right:18px;bottom:92px;z-index:9990;border:0;border-radius:999px;padding:12px 16px;background:linear-gradient(135deg,#6a5cff,#23cdb8);color:#fff;font:800 12px/1 system-ui;box-shadow:0 14px 38px #433cb73d;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:8px}
  #examAdminBellV392{background:linear-gradient(135deg,#ff6b8a,#7c5cff)}
  #examBellV392 .exam-count,#examAdminBellV392 .exam-count{min-width:22px;height:22px;border-radius:99px;background:#fff;color:#5548c7;display:grid;place-items:center;font-size:10px}
  #examBannerV392,#examAdminBannerV392,#examResultBannerV392{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9989;width:min(680px,calc(100% - 26px));border:1px solid #cbd0ff;border-radius:18px;background:#fff;box-shadow:0 16px 45px #1f275323;padding:12px 14px;display:flex;align-items:center;gap:12px;font-family:system-ui;color:#272d53}
  #examAdminBannerV392{border-color:#ffd1db;background:#fffafd}
  #examResultBannerV392.pass{border-color:#9fe5c9;background:#f5fff9}
  #examResultBannerV392.fail{border-color:#ffc4ce;background:#fff8f9}
  .exam-v392-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:#eeeaff;font-size:22px;flex:0 0 auto}
  #examAdminBannerV392 .exam-v392-icon{background:#fff0f4}
  #examResultBannerV392.pass .exam-v392-icon{background:#e8fff4}
  #examResultBannerV392.fail .exam-v392-icon{background:#fff0f3}
  .exam-v392-copy{min-width:0;flex:1}.exam-v392-copy b,.exam-v392-copy small{display:block}.exam-v392-copy small{color:#777e9a;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .exam-v392-action{border:0;border-radius:11px;background:#6254f8;color:#fff;padding:10px 12px;text-decoration:none;font-size:11px;font-weight:900;white-space:nowrap}
  #examAdminBannerV392 .exam-v392-action{background:#e24b73}
  #examResultBannerV392.pass .exam-v392-action{background:#18a66c}
  #examResultBannerV392.fail .exam-v392-action{background:#d64a61}
  .exam-v392-close{border:0;background:transparent;color:#7c839d;font-size:18px;cursor:pointer}
  .exam-admin-nav-v392{display:block!important;text-decoration:none!important;position:relative}
  .exam-admin-nav-v392 .exam-admin-count-v392{margin-left:8px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:#ffdd65;color:#402f00;display:inline-grid;place-items:center;font-size:9px;font-weight:950}
  @media(max-width:560px){#examBannerV392,#examAdminBannerV392,#examResultBannerV392{top:auto;bottom:76px}.exam-v392-copy small{display:none}#examBellV392,#examAdminBellV392{right:12px;bottom:88px}}
  `;
  document.head.appendChild(s);
}

function removeNode(id){ document.getElementById(id)?.remove(); }
function makeClose(btn, parent, onClose){ btn.onclick = () => { try{ onClose?.(); }catch{} parent.remove(); }; }

async function studentExams() {
  const token = studentToken();
  if (!token) return null;
  const r = await fetch(EXAM_API + "/api/student/exams", { headers:{ Authorization:`Bearer ${token}` }, cache:"no-store" });
  if (!r.ok) return null;
  return await r.json();
}
async function adminExams() {
  const token = adminToken();
  if (!token) return null;
  const r = await fetch(EXAM_API + "/api/admin/exams", { headers:{ Authorization:`Bearer ${token}` }, cache:"no-store" });
  if (!r.ok) return null;
  return await r.json();
}

function resultSeenKey(row){ return `brightbyte_exam_result_seen_${row.exam_id}`; }
function resultSignature(row){ return `${row.reviewed_at || ""}|${row.result || ""}|${row.final_score ?? ""}`; }
function markResultSeen(row){ try{ localStorage.setItem(resultSeenKey(row), resultSignature(row)); }catch{} }
function isResultSeen(row){ try{ return localStorage.getItem(resultSeenKey(row)) === resultSignature(row); }catch{return false;} }

function renderStudent(data) {
  removeNode("examBellV392");
  removeNode("examBannerV392");
  removeNode("examResultBannerV392");

  const rows = data?.exams || [];
  const active = rows.filter(x => ["assigned","in_progress"].includes(x.assignment_status));
  const freshResult = rows.find(x => x.assignment_status === "reviewed" && !isResultSeen(x));

  if (freshResult) {
    const pass = String(freshResult.result || "").toUpperCase() === "PASS";
    const banner = document.createElement("div");
    banner.id = "examResultBannerV392";
    banner.className = pass ? "pass" : "fail";
    banner.innerHTML = `<div class="exam-v392-icon">${pass ? "🏆" : "📘"}</div><div class="exam-v392-copy"><b>${pass ? "Exam result ready — PASS" : "Exam result ready"}</b><small>${esc(freshResult.title)} • Score ${Number(freshResult.final_score ?? 0)}% • ${esc(freshResult.result || "RESULT")}</small></div><a class="exam-v392-action" href="student-exams.html">View Result</a><button class="exam-v392-close" type="button" aria-label="Close">×</button>`;
    const link = banner.querySelector("a");
    link.addEventListener("click", () => markResultSeen(freshResult));
    makeClose(banner.querySelector("button"), banner, () => markResultSeen(freshResult));
    document.body.appendChild(banner);
  } else if (active.length) {
    const first = active[0];
    const resume = first.assignment_status === "in_progress";
    const banner = document.createElement("div");
    banner.id = "examBannerV392";
    banner.innerHTML = `<div class="exam-v392-icon">${resume ? "⏱️" : "📝"}</div><div class="exam-v392-copy"><b>${resume ? "Exam in progress" : "New exam available"}</b><small>${esc(first.title)}${active.length > 1 ? ` • +${active.length-1} more` : ""}</small></div><a class="exam-v392-action" href="student-exams.html">${resume ? "Resume" : "Open"}</a><button class="exam-v392-close" type="button" aria-label="Close">×</button>`;
    makeClose(banner.querySelector("button"), banner);
    document.body.appendChild(banner);
  }

  if (active.length || freshResult) {
    const link = document.createElement("a");
    link.id = "examBellV392";
    link.href = "student-exams.html";
    link.innerHTML = freshResult ? `<span>📢 Result</span><span class="exam-count">1</span>` : `<span>📝 Exam</span><span class="exam-count">${active.length}</span>`;
    if (freshResult) link.addEventListener("click", () => markResultSeen(freshResult));
    document.body.appendChild(link);
  }
}

let lastAdminPending = null;
function renderAdmin(data) {
  removeNode("examAdminBellV392");
  removeNode("examAdminBannerV392");
  const exams = data?.exams || [];
  const pending = exams.reduce((n,e) => n + Number(e.pending_review_count || 0), 0);

  let navLink = document.getElementById("examAdminLinkV392");
  if (!navLink) {
    navLink = document.createElement("a");
    navLink.id = "examAdminLinkV392";
    navLink.href = "exam-center.html";
    navLink.className = "exam-admin-nav-v392";
    const nav = document.querySelector("nav");
    if (nav) nav.appendChild(navLink); else {
      navLink.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9992;background:#6557ff;color:white;padding:12px 15px;border-radius:14px;font:900 12px system-ui;box-shadow:0 14px 34px #423bb63b";
      document.body.appendChild(navLink);
    }
  }
  navLink.innerHTML = `📝 Exam Center${pending ? `<span class="exam-admin-count-v392">${pending}</span>` : ""}`;

  if (pending > 0) {
    const bell = document.createElement("a");
    bell.id = "examAdminBellV392";
    bell.href = "exam-center.html#review";
    bell.innerHTML = `<span>✅ Review</span><span class="exam-count">${pending}</span>`;
    document.body.appendChild(bell);

    const shouldBanner = lastAdminPending === null || pending > lastAdminPending;
    if (shouldBanner) {
      const banner = document.createElement("div");
      banner.id = "examAdminBannerV392";
      banner.innerHTML = `<div class="exam-v392-icon">📬</div><div class="exam-v392-copy"><b>${pending} exam submission${pending === 1 ? "" : "s"} waiting for review</b><small>A student has submitted written answer(s). Open the Exam Center to finalize PASS / FAIL.</small></div><a class="exam-v392-action" href="exam-center.html#review">Review Now</a><button class="exam-v392-close" type="button" aria-label="Close">×</button>`;
      makeClose(banner.querySelector("button"), banner);
      document.body.appendChild(banner);
    }
  }
  lastAdminPending = pending;
}

async function refreshStudent(){ try{ const d=await studentExams(); if(d?.success) renderStudent(d); }catch(err){ console.debug("Exam student notification unavailable",err); } }
async function refreshAdmin(){ try{ const d=await adminExams(); if(d?.success) renderAdmin(d); }catch(err){ console.debug("Exam admin notification unavailable",err); } }

function boot() {
  addStyle();
  refreshStudent();
  refreshAdmin();
  setInterval(refreshStudent, 30000);
  setInterval(refreshAdmin, 20000);
  window.addEventListener("focus", () => { refreshStudent(); refreshAdmin(); });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true });
else boot();
})();
