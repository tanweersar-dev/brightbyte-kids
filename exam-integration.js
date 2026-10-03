(() => {
"use strict";

if (window.__brightbyteExamIntegrationV39) return;
window.__brightbyteExamIntegrationV39 = true;

const EXAM_API = "https://api.tanweer.site";
const STUDENT_TOKEN = localStorage.getItem("brightbyte_student_token") || "";
const ADMIN_TOKEN = localStorage.getItem("brightbyte_admin_token") || "";

function addStyle() {
  if (document.getElementById("examIntegrationStyleV39")) return;
  const s = document.createElement("style");
  s.id = "examIntegrationStyleV39";
  s.textContent = `
  #examBellV39{position:fixed;right:18px;bottom:92px;z-index:9990;border:0;border-radius:999px;padding:12px 16px;background:linear-gradient(135deg,#6a5cff,#23cdb8);color:#fff;font:800 12px/1 system-ui;box-shadow:0 14px 38px #433cb73d;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:8px}
  #examBellV39 .exam-count{min-width:22px;height:22px;border-radius:99px;background:#fff;color:#5548c7;display:grid;place-items:center;font-size:10px}
  #examBannerV39{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9989;width:min(640px,calc(100% - 26px));border:1px solid #cbd0ff;border-radius:18px;background:#fff;box-shadow:0 16px 45px #1f275323;padding:12px 14px;display:flex;align-items:center;gap:12px;font-family:system-ui;color:#272d53}
  #examBannerV39 .exam-banner-icon{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:#eeeaff;font-size:22px}
  #examBannerV39 .exam-banner-copy{min-width:0;flex:1}.exam-banner-copy b,.exam-banner-copy small{display:block}.exam-banner-copy small{color:#777e9a;margin-top:3px}
  #examBannerV39 a{border:0;border-radius:11px;background:#6254f8;color:#fff;padding:10px 12px;text-decoration:none;font-size:11px;font-weight:900;white-space:nowrap}
  #examBannerV39 button{border:0;background:transparent;color:#7c839d;font-size:18px;cursor:pointer}
  .exam-admin-nav-v39{display:block!important;text-decoration:none!important}
  @media(max-width:560px){#examBannerV39{top:auto;bottom:76px}#examBannerV39 .exam-banner-copy small{display:none}#examBannerV39 a{padding:9px}#examBellV39{right:12px;bottom:88px}}
  `;
  document.head.appendChild(s);
}

function injectAdminLink() {
  if (!ADMIN_TOKEN || document.getElementById("examAdminLinkV39")) return;
  const a = document.createElement("a");
  a.id = "examAdminLinkV39";
  a.href = "exam-center.html";
  a.className = "exam-admin-nav-v39";
  a.textContent = "📝 Exam Center";
  const nav = document.querySelector("nav");
  if (nav) {
    nav.appendChild(a);
  } else {
    a.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9992;background:#6557ff;color:white;padding:12px 15px;border-radius:14px;font:900 12px system-ui;box-shadow:0 14px 34px #423bb63b";
    document.body.appendChild(a);
  }
}

async function getStudentExams() {
  if (!STUDENT_TOKEN) return null;
  const r = await fetch(EXAM_API + "/api/student/exams", {
    headers:{ Authorization:`Bearer ${STUDENT_TOKEN}` },
    cache:"no-store"
  });
  if (!r.ok) return null;
  return await r.json();
}
function removeStudentNotice() {
  document.getElementById("examBellV39")?.remove();
  document.getElementById("examBannerV39")?.remove();
}
function renderStudentNotice(data) {
  removeStudentNotice();
  const active = (data?.exams || []).filter(x => ["assigned","in_progress"].includes(x.assignment_status));
  if (!active.length) return;

  const link = document.createElement("a");
  link.id = "examBellV39";
  link.href = "student-exams.html";
  link.innerHTML = `<span>📝 Exam</span><span class="exam-count">${active.length}</span>`;
  document.body.appendChild(link);

  const banner = document.createElement("div");
  banner.id = "examBannerV39";
  const first = active[0];
  const resume = first.assignment_status === "in_progress";
  banner.innerHTML = `<div class="exam-banner-icon">${resume ? "⏱️" : "📝"}</div><div class="exam-banner-copy"><b>${resume ? "Exam in progress" : "New exam available"}</b><small>${escapeHtml(first.title)}${active.length > 1 ? ` • +${active.length-1} more` : ""}</small></div><a href="student-exams.html">${resume ? "Resume" : "Open"}</a><button type="button" aria-label="Close">×</button>`;
  banner.querySelector("button").onclick = () => banner.remove();
  document.body.appendChild(banner);
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
async function refreshStudentNotice() {
  try {
    const d = await getStudentExams();
    if (d?.success) renderStudentNotice(d);
  } catch (err) { console.debug("Exam notification unavailable", err); }
}

function boot() {
  addStyle();
  injectAdminLink();
  if (STUDENT_TOKEN) {
    refreshStudentNotice();
    window.setInterval(refreshStudentNotice, 60000);
    window.addEventListener("focus", refreshStudentNotice);
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once:true });
else boot();
})();
