(() => {
"use strict";

const EXAM_API = "https://api.tanweer.site";
const TOKEN = localStorage.getItem("brightbyte_admin_token") || "";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let students = [];
let exams = [];
let bank = null;

async function api(path, opt = {}) {
  const headers = { ...(opt.headers || {}), Authorization: `Bearer ${TOKEN}` };
  if (opt.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(EXAM_API + path, { ...opt, headers, cache: "no-store" });
}
async function jsonApi(path, opt = {}) {
  const r = await api(path, opt);
  let d = {};
  try { d = await r.json(); } catch {}
  if (!r.ok) throw new Error(d.error || `Request failed (${r.status})`);
  return d;
}
function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  clearTimeout(window.__examToast);
  window.__examToast = setTimeout(() => $("toast").classList.remove("show"), 2200);
}
function fmt(v) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString();
}
function statusLabel(s) {
  return String(s || "").replaceAll("_", " ").toUpperCase();
}
function setBusy(btn, busy, text = "Working...") {
  if (!btn) return;
  if (busy) {
    btn.dataset.oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = text;
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.oldText || btn.textContent;
  }
}

function openModal(html) {
  $("modalCard").innerHTML = html;
  $("modalWrap").classList.add("open");
  $("modalWrap").setAttribute("aria-hidden", "false");
}
function closeModal() {
  $("modalWrap").classList.remove("open");
  $("modalWrap").setAttribute("aria-hidden", "true");
}
window.closeExamModal = closeModal;
$("modalWrap").addEventListener("click", e => {
  if (e.target === $("modalWrap")) closeModal();
});

function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      $(`tab-${btn.dataset.tab}`).classList.add("active");
      if (btn.dataset.tab === "records") await loadExams();
      if (btn.dataset.tab === "review") await loadReviewQueue();
      if (btn.dataset.tab === "bank") await loadBank();
    });
  });
}

function updateClassOptions() {
  const g = $("groupCode").value;
  const values = g === "junior" ? [1,2,3] : [4,5,6];
  $("targetClass").innerHTML = values.map(n => `<option value="${n}">Class ${n}</option>`).join("");
  if (g === "junior") {
    $("durationMinutes").value = "10";
    $("mcqCount").value = "10";
    $("writtenCount").value = "1";
  } else {
    $("durationMinutes").value = "20";
    $("mcqCount").value = "15";
    $("writtenCount").value = "2";
  }
  renderStudentPicker();
}
function updateAudienceFields() {
  const type = $("audienceType").value;
  $("classField").classList.toggle("hidden", type !== "class");
  $("selectedStudentsField").classList.toggle("hidden", type !== "selected");
}
function visibleStudents() {
  const group = $("groupCode").value;
  const q = $("studentSearch").value.trim().toLowerCase();
  return students.filter(s => {
    const inGroup = group === "junior" ? s.class_number <= 3 : s.class_number >= 4;
    if (!inGroup) return false;
    if (!q) return true;
    return `${s.display_name} ${s.username} ${s.class_number}`.toLowerCase().includes(q);
  });
}
function renderStudentPicker() {
  if (!$("studentPicker")) return;
  const selected = new Set([...document.querySelectorAll(".student-pick:checked")].map(x => Number(x.value)));
  const rows = visibleStudents();
  $("studentPicker").innerHTML = rows.length ? rows.map(s => `
    <label class="student-choice">
      <input class="student-pick" type="checkbox" value="${s.user_id}" ${selected.has(s.user_id) ? "checked" : ""}>
      <span><b>${esc(s.display_name)}</b><small>${esc(s.username)} • Class ${s.class_number}</small></span>
    </label>
  `).join("") : `<div class="empty wide">No matching students in this group.</div>`;
}

async function loadStudents() {
  const d = await jsonApi("/api/admin/students");
  students = (d.students || []).filter(s => s.status === "active");
  $("statStudents").textContent = students.length;
  renderStudentPicker();
}
async function loadBank() {
  try {
    bank = await jsonApi("/api/admin/question-bank");
    const juniorTotal = (bank.junior?.mcqCount || 0) + (bank.junior?.writtenCount || 0);
    const advancedTotal = (bank.advanced?.mcqCount || 0) + (bank.advanced?.writtenCount || 0);
    $("statBank").textContent = juniorTotal + advancedTotal;
    $("bankCards").innerHTML = ["junior","advanced"].map(g => {
      const b = bank[g] || { mcqCount:0, writtenCount:0, topics:[] };
      return `<article class="bank-card">
        <h3>${g === "junior" ? "🧒 Class 1–3 Foundation" : "🚀 Class 4–6 Advanced"}</h3>
        <div class="count">${b.mcqCount}</div>
        <p><b>MCQ questions</b> • ${b.writtenCount} written prompts</p>
        <div class="topic-list">${(b.topics || []).map(t => `<span>${esc(t)}</span>`).join("")}</div>
      </article>`;
    }).join("");
  } catch (err) {
    $("bankCards").innerHTML = `<div class="empty">${esc(err.message)}</div>`;
  }
}

async function loadExams() {
  try {
    const d = await jsonApi("/api/admin/exams");
    exams = d.exams || [];
    $("statExams").textContent = exams.length;
    $("statPending").textContent = exams.reduce((n,e) => n + Number(e.pending_review_count || 0), 0);
    renderExamRecords();
  } catch (err) {
    $("examRecords").innerHTML = `<div class="empty">${esc(err.message)}</div>`;
  }
}
function renderExamRecords() {
  const q = $("examSearch").value.trim().toLowerCase();
  const status = $("examStatusFilter").value;
  const rows = exams.filter(e =>
    (!q || e.title.toLowerCase().includes(q)) &&
    (status === "all" || e.status === status)
  );

  $("examRecords").innerHTML = rows.length ? rows.map(e => `
    <article class="exam-card">
      <div class="exam-card-head">
        <div>
          <h3>${esc(e.title)}</h3>
          <p>${e.group_code === "junior" ? "Class 1–3 Foundation" : "Class 4–6 Advanced"} • ${e.duration_minutes} min • Pass ${e.pass_mark}%</p>
        </div>
        <span class="status ${esc(e.status)}">${esc(statusLabel(e.status))}</span>
      </div>
      <div class="metrics">
        <span><b>${e.assigned_count}</b>Assigned</span>
        <span><b>${e.not_started_count}</b>Not Started</span>
        <span><b>${e.in_progress_count}</b>Active</span>
        <span><b>${e.pending_review_count}</b>Review</span>
        <span><b>${e.reviewed_count}</b>Done</span>
      </div>
      <p>Open until: <b>${esc(fmt(e.available_until))}</b></p>
      <div class="card-actions">
        <button class="open" onclick="window.openExamDetails(${e.id})">Open Details</button>
        ${e.status === "active" ? `<button class="close" onclick="window.closeExam(${e.id})">Close</button><button class="cancel" onclick="window.cancelExam(${e.id})">Cancel</button>` : ""}
      </div>
    </article>
  `).join("") : `<div class="empty">No exams match this filter.</div>`;
}

window.openExamDetails = async id => {
  try {
    const d = await jsonApi(`/api/admin/exams/${id}`);
    const e = d.exam;
    const assignments = d.assignments || [];
    openModal(`
      <div class="modal-head">
        <div><span class="mini">EXAM #${e.id}</span><h2>${esc(e.title)}</h2></div>
        <button class="x" onclick="closeExamModal()">×</button>
      </div>
      <div class="notice"><b>Paper</b><span>${e.mcq_count} MCQ + ${e.written_count} written • ${e.duration_minutes} minutes • Pass ${e.pass_mark}% • Curriculum Class ${e.curriculum_class}</span></div>
      <div class="table-wrap" style="margin-top:14px">
        <table class="assignment-table">
          <thead><tr><th>STUDENT</th><th>CLASS</th><th>STATUS</th><th>SCORE</th><th>RESULT</th><th>WARNINGS</th><th>ACTION</th></tr></thead>
          <tbody>
            ${assignments.map(a => `<tr>
              <td><b>${esc(a.display_name)}</b><br><small>${esc(a.username || "")}</small></td>
              <td>Class ${a.class_number}</td>
              <td>${esc(statusLabel(a.status))}</td>
              <td>${a.final_score === null ? "—" : a.final_score + "%"}</td>
              <td>${esc(a.result || "—")}</td>
              <td>${a.integrity_warnings}</td>
              <td>${a.status === "submitted" ? `<button class="mini-btn" onclick="window.reviewAssignment(${a.id})">Review</button>` : "—"}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    `);
  } catch (err) { toast(err.message); }
};

window.closeExam = async id => {
  if (!confirm("Close this exam? Students already in progress can still submit, but no new assignment window should be extended.")) return;
  try {
    await jsonApi(`/api/admin/exams/${id}/close`, { method:"POST" });
    toast("Exam closed");
    await loadExams();
  } catch (err) { toast(err.message); }
};
window.cancelExam = async id => {
  if (!confirm("Cancel this exam? Assigned and in-progress attempts will be cancelled.")) return;
  try {
    await jsonApi(`/api/admin/exams/${id}/cancel`, { method:"POST" });
    toast("Exam cancelled");
    await loadExams();
  } catch (err) { toast(err.message); }
};

async function loadReviewQueue() {
  $("reviewQueue").innerHTML = `<div class="empty">Loading review queue...</div>`;
  try {
    await loadExams();
    const pendingExams = exams.filter(e => Number(e.pending_review_count || 0) > 0).slice(0, 30);
    const rows = [];
    for (const e of pendingExams) {
      const d = await jsonApi(`/api/admin/exams/${e.id}`);
      for (const a of (d.assignments || [])) {
        if (a.status === "submitted") rows.push({ ...a, examTitle:e.title });
      }
    }
    $("reviewQueue").innerHTML = rows.length ? rows.map(a => `
      <article class="review-row">
        <div>
          <h4>${esc(a.display_name)} • Class ${a.class_number}</h4>
          <p>${esc(a.examTitle)} • Submitted ${esc(fmt(a.submitted_at))}</p>
          ${a.integrity_warnings ? `<p class="warn">⚠ ${a.integrity_warnings} integrity warning(s)</p>` : ""}
        </div>
        <button class="btn primary" onclick="window.reviewAssignment(${a.id})">Review Written Answers</button>
      </article>
    `).join("") : `<div class="empty">No written answers are waiting for review.</div>`;
  } catch (err) {
    $("reviewQueue").innerHTML = `<div class="empty">${esc(err.message)}</div>`;
  }
}

window.reviewAssignment = async assignmentId => {
  try {
    const d = await jsonApi(`/api/admin/assignments/${assignmentId}`);
    const a = d.assignment;
    const written = (d.answers || []).filter(x => x.question_type === "written");
    const mcq = (d.answers || []).filter(x => x.question_type === "mcq");
    const correctMcq = mcq.filter(x => Number(x.is_correct) === 1).length;

    openModal(`
      <div class="modal-head">
        <div><span class="mini">TEACHER REVIEW</span><h2>${esc(a.display_name)} • ${esc(a.title)}</h2></div>
        <button class="x" onclick="closeExamModal()">×</button>
      </div>
      <div class="notice"><b>Auto Score</b><span>${correctMcq}/${mcq.length} MCQ correct • Written answers need teacher points • Pass mark ${a.pass_mark}%.</span></div>
      <form id="reviewForm" style="margin-top:14px">
        ${written.length ? written.map(x => `
          <article class="answer-card">
            <h4>Q${x.seq}. ${esc(x.prompt)}</h4>
            <p><b>Student answer:</b><br>${esc(x.answer_text || "(No answer)")}</p>
            <p><b>Teacher guide:</b><br>${esc(x.model_answer || "Use your judgement.")}</p>
            <label><b>Points (0–${x.points})</b><br>
              <input class="score-input written-score" data-qid="${x.question_id}" type="number" min="0" max="${x.points}" value="${x.points_awarded || 0}">
            </label>
          </article>
        `).join("") : `<div class="empty">No written questions. This attempt should normally be auto-reviewed.</div>`}
        <div class="form-actions"><button class="btn primary large" type="submit">✅ Finalize PASS / FAIL</button></div>
      </form>
    `);

    $("reviewForm").onsubmit = async ev => {
      ev.preventDefault();
      const scores = {};
      document.querySelectorAll(".written-score").forEach(i => scores[i.dataset.qid] = Number(i.value || 0));
      const btn = ev.submitter;
      setBusy(btn, true, "Finalizing...");
      try {
        const out = await jsonApi(`/api/admin/assignments/${assignmentId}/review`, {
          method:"POST",
          body:JSON.stringify({ writtenScores:scores })
        });
        closeModal();
        toast(`${out.result} • ${out.finalScore}%`);
        await loadReviewQueue();
      } catch (err) {
        toast(err.message);
        setBusy(btn, false);
      }
    };
  } catch (err) { toast(err.message); }
};

$("createExamForm").addEventListener("submit", async e => {
  e.preventDefault();
  const type = $("audienceType").value;
  const studentIds = type === "selected"
    ? [...document.querySelectorAll(".student-pick:checked")].map(x => Number(x.value))
    : [];
  if (type === "selected" && !studentIds.length) {
    toast("Select at least one student");
    return;
  }

  const groupCode = $("groupCode").value;
  const groupName = groupCode === "junior" ? "Class 1–3" : "Class 4–6";
  const audienceText = type === "group" ? `all active ${groupName} students`
    : type === "class" ? `all active Class ${$("targetClass").value} students`
    : `${studentIds.length} selected student(s)`;

  if (!confirm(`Create and activate "${$("examTitle").value.trim()}" for ${audienceText}?`)) return;

  const btn = $("activateExamBtn");
  setBusy(btn, true, "Creating Exam...");
  try {
    const out = await jsonApi("/api/admin/exams", {
      method:"POST",
      body:JSON.stringify({
        title:$("examTitle").value.trim(),
        groupCode,
        audienceType:type,
        targetClass:Number($("targetClass").value || (groupCode === "junior" ? 1 : 4)),
        studentIds,
        durationMinutes:Number($("durationMinutes").value),
        mcqCount:Number($("mcqCount").value),
        writtenCount:Number($("writtenCount").value),
        passMark:Number($("passMark").value),
        availabilityDays:Number($("availabilityDays").value)
      })
    });
    toast(`Exam activated for ${out.assignedCount} student(s)`);
    await loadExams();
    document.querySelector('.tab[data-tab="records"]').click();
  } catch (err) {
    toast(err.message);
  } finally {
    setBusy(btn, false);
  }
});

$("groupCode").addEventListener("change", updateClassOptions);
$("audienceType").addEventListener("change", updateAudienceFields);
$("studentSearch").addEventListener("input", renderStudentPicker);
$("selectVisibleBtn").addEventListener("click", () => {
  const boxes = [...document.querySelectorAll(".student-pick")];
  const allSelected = boxes.length && boxes.every(x => x.checked);
  boxes.forEach(x => x.checked = !allSelected);
  $("selectVisibleBtn").textContent = allSelected ? "Select Visible" : "Clear Visible";
});
$("examSearch").addEventListener("input", renderExamRecords);
$("examStatusFilter").addEventListener("change", renderExamRecords);
$("recordsRefreshBtn").addEventListener("click", loadExams);
$("reviewRefreshBtn").addEventListener("click", loadReviewQueue);
$("refreshAllBtn").addEventListener("click", async () => {
  try { await Promise.all([loadStudents(), loadExams(), loadBank()]); toast("Exam Center refreshed"); }
  catch (err) { toast(err.message); }
});

async function boot() {
  setupTabs();
  updateClassOptions();
  updateAudienceFields();

  if (!TOKEN) {
    $("authGate").classList.remove("hidden");
    return;
  }

  try {
    await loadStudents(); // also validates the shared admin session token
    $("app").classList.remove("hidden");
    await Promise.all([loadExams(), loadBank()]);
  } catch (err) {
    console.error(err);
    $("authGate").classList.remove("hidden");
  }
}
boot();

})();
