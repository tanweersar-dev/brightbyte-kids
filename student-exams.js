(() => {
"use strict";

const EXAM_API = "https://api.tanweer.site";
const TOKEN = localStorage.getItem("brightbyte_student_token") || "";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let profile = null;
let examRows = [];
let activeExam = null;
let questions = [];
let answers = {};
let currentIndex = 0;
let timerId = null;
let examActive = false;
let submitInFlight = false;
let fullscreenWasEntered = false;
let ignoreFullscreenUntil = 0;
let ignoreVisibilityUntil = 0;
let localWarnings = 0;
let warningInFlight = false;
let reviewMode = false;
let beforeUnloadInstalled = false;

async function api(path, opt = {}) {
  const headers = { ...(opt.headers || {}), Authorization: `Bearer ${TOKEN}` };
  if (opt.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(EXAM_API + path, { ...opt, headers, cache:"no-store" });
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
function openModal(html) {
  $("modalCard").innerHTML = html;
  $("modalWrap").classList.add("open");
  $("modalWrap").setAttribute("aria-hidden", "false");
}
function closeModal() {
  $("modalWrap").classList.remove("open");
  $("modalWrap").setAttribute("aria-hidden", "true");
}
window.closeStudentExamModal = closeModal;
$("modalWrap").addEventListener("click", e => { if (e.target === $("modalWrap")) closeModal(); });

function examStatusText(row) {
  const s = row.assignment_status;
  if (s === "assigned") return "AVAILABLE";
  if (s === "in_progress") return "IN PROGRESS";
  if (s === "submitted") return "AWAITING REVIEW";
  if (s === "reviewed") return "FINISHED";
  return String(s || "").replaceAll("_", " ").toUpperCase();
}
function actionLabel(row) {
  if (row.assignment_status === "assigned") return "Start Exam →";
  if (row.assignment_status === "in_progress") return "Resume Exam →";
  return "View Status";
}
function isActionable(row) { return ["assigned","in_progress"].includes(row.assignment_status); }

async function loadDashboard() {
  if (!TOKEN) return showAuthError();
  try {
    const d = await jsonApi("/api/student/exams");
    profile = d.profile;
    examRows = d.exams || [];
    $("helloTitle").textContent = `${profile.display_name}, ready to show what you learned?`;
    $("studentMeta").textContent = `Class ${profile.class_number} • ${profile.group === "junior" ? "Foundation 1–3" : "Advanced 4–6"}`;
    $("backLink").href = Number(profile.class_number) <= 3 ? "student-profile.html" : "advanced-universe.html";
    $("availableCount").textContent = examRows.filter(x => ["assigned","in_progress"].includes(x.assignment_status)).length;
    renderExams();
    $("loadingScreen").classList.add("hidden");
    $("authError").classList.add("hidden");
    $("app").classList.remove("hidden");
  } catch (err) {
    console.error(err);
    if (/login|required|401/i.test(err.message)) showAuthError();
    else {
      $("examList").innerHTML = `<div class="empty-card">${esc(err.message)}</div>`;
      $("loadingScreen").classList.add("hidden");
      $("app").classList.remove("hidden");
    }
  }
}
function showAuthError() {
  $("loadingScreen").classList.add("hidden");
  $("app").classList.add("hidden");
  $("authError").classList.remove("hidden");
}
function renderExams() {
  if (!examRows.length) {
    $("examList").innerHTML = `<div class="empty-card"><b>No exam is assigned right now.</b><br><small>Your teacher's new exam will appear here automatically.</small></div>`;
    return;
  }
  $("examList").innerHTML = examRows.map(row => {
    const status = row.assignment_status;
    const result = row.result || "";
    const finished = status === "reviewed";
    const unavailable = ["missed","cancelled"].includes(status);
    return `<article class="exam-card">
      <div class="exam-card-head">
        <div><h3>${esc(row.title)}</h3><p>${row.group_code === "junior" ? "Class 1–3 Foundation" : "Class 4–6 Advanced"} Skills Check</p></div>
        <span class="status ${esc(status)}">${esc(examStatusText(row))}</span>
      </div>
      <div class="exam-meta-grid">
        <span><b>${row.duration_minutes}</b><small>MINUTES</small></span>
        <span><b>${row.mcq_count + row.written_count}</b><small>QUESTIONS</small></span>
        <span><b>${row.pass_mark}%</b><small>PASS MARK</small></span>
      </div>
      <p>${status === "assigned" ? `Available until <b>${esc(fmt(row.available_until))}</b>` : status === "in_progress" ? `Started <b>${esc(fmt(row.started_at))}</b>` : status === "submitted" ? `Submitted <b>${esc(fmt(row.submitted_at))}</b>` : status === "reviewed" ? `Reviewed <b>${esc(fmt(row.reviewed_at))}</b>` : `Status: <b>${esc(examStatusText(row))}</b>`}</p>
      <div class="card-actions">
        <div>${finished ? `<span class="result-badge ${esc(result)}">${esc(result || "DONE")}</span><br><small>${row.final_score ?? 0}%</small>` : status === "submitted" ? `<b>Teacher review pending</b>` : row.integrity_warnings ? `<small>⚠ ${row.integrity_warnings} warning(s)</small>` : `<small>Same paper for assigned group</small>`}</div>
        ${isActionable(row) ? `<button class="btn primary" type="button" data-start="${row.exam_id}">${actionLabel(row)}</button>` : `<button class="btn secondary" type="button" data-status="${row.exam_id}" ${unavailable ? "disabled" : ""}>${unavailable ? examStatusText(row) : "Status"}</button>`}
      </div>
    </article>`;
  }).join("");

  document.querySelectorAll("[data-start]").forEach(btn => {
    btn.addEventListener("click", () => confirmStart(Number(btn.dataset.start)));
  });
  document.querySelectorAll("[data-status]").forEach(btn => {
    btn.addEventListener("click", () => showStatus(Number(btn.dataset.status)));
  });
}
function showStatus(examId) {
  const row = examRows.find(x => x.exam_id === examId);
  if (!row) return;
  const body = row.assignment_status === "submitted"
    ? "Your exam was submitted successfully. Written answers are waiting for teacher review."
    : row.assignment_status === "reviewed"
      ? `Final score: ${row.final_score}% • Result: ${row.result}`
      : `Current status: ${examStatusText(row)}`;
  openModal(`<div class="modal-icon">📝</div><h2>${esc(row.title)}</h2><p>${esc(body)}</p><div class="modal-actions"><button class="btn primary" onclick="closeStudentExamModal()">OK</button></div>`);
}
function confirmStart(examId) {
  const row = examRows.find(x => x.exam_id === examId);
  if (!row) return;
  const resume = row.assignment_status === "in_progress";
  openModal(`
    <div class="modal-icon">${resume ? "⏱️" : "📝"}</div>
    <h2>${resume ? "Resume Exam" : "Start Exam"}?</h2>
    <p><b>${esc(row.title)}</b></p>
    <p>${resume ? "Your original timer is still running. Resume now." : `The ${row.duration_minutes}-minute timer starts immediately after you press Start. Your browser will try to enter fullscreen.`}</p>
    <p><b>Rules:</b> no copy/paste, no switching tabs, no help from another person. Three integrity warnings can auto-submit the exam.</p>
    <div class="modal-actions">
      <button class="btn secondary" onclick="closeStudentExamModal()">Cancel</button>
      <button id="modalStartBtn" class="btn primary" type="button">${resume ? "Resume Now" : "Start Now"}</button>
    </div>`);
  $("modalStartBtn").onclick = async () => {
    $("modalStartBtn").disabled = true;
    try { await startExam(examId); closeModal(); }
    catch (err) { toast(err.message); $("modalStartBtn").disabled = false; }
  };
}

function storageKey() { return activeExam ? `brightbyte_exam_answers_${activeExam.assignment_id}` : ""; }
function loadSavedAnswers() {
  answers = {};
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey()) || "{}");
    if (saved && typeof saved === "object") answers = saved;
  } catch {}
}
function saveAnswers() {
  if (!activeExam) return;
  sessionStorage.setItem(storageKey(), JSON.stringify(answers));
}
function clearSavedAnswers() {
  if (activeExam) sessionStorage.removeItem(storageKey());
}

async function startExam(examId) {
  const d = await jsonApi(`/api/student/exams/${examId}/start`, { method:"POST" });
  activeExam = d.exam;
  questions = d.questions || [];
  if (!questions.length) throw new Error("No exam questions were found");
  currentIndex = 0;
  localWarnings = Number(activeExam.integrity_warnings || 0);
  loadSavedAnswers();
  examActive = true;
  reviewMode = false;
  submitInFlight = false;
  fullscreenWasEntered = false;
  ignoreFullscreenUntil = Date.now() + 2500;
  ignoreVisibilityUntil = Date.now() + 2500;

  document.body.classList.add("exam-active");
  $("dashboardView").classList.add("hidden");
  $("examView").classList.remove("hidden");
  $("questionStage").classList.remove("hidden");
  $("reviewStage").classList.add("hidden");
  $("activeTitle").textContent = activeExam.title;
  updateWarningChip();
  renderQuestion();
  startTimer();
  installIntegrityHandlers();
  installBeforeUnload();
  await enterFullscreen();
}

function renderQuestion() {
  reviewMode = false;
  $("reviewStage").classList.add("hidden");
  $("questionStage").classList.remove("hidden");
  const q = questions[currentIndex];
  if (!q) return;
  $("questionNumber").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  $("questionTopic").textContent = q.type === "mcq" ? `${q.topic} • MCQ` : `${q.topic} • Written`;
  $("questionPrompt").textContent = q.prompt;
  $("activeMeta").textContent = `${activeExam.mcq_count} MCQ + ${activeExam.written_count} written • Pass ${activeExam.pass_mark}%`;
  $("questionProgress").style.width = `${Math.round(((currentIndex + 1) / questions.length) * 100)}%`;
  $("prevBtn").disabled = currentIndex === 0;
  $("nextBtn").textContent = currentIndex === questions.length - 1 ? "Review Answers →" : "Next →";

  if (q.type === "mcq") {
    const selected = String(answers[q.id] || "").toUpperCase();
    $("answerArea").innerHTML = q.options.map((opt, i) => {
      const letter = ["A","B","C","D"][i];
      return `<button class="option ${selected === letter ? "selected" : ""}" type="button" data-letter="${letter}"><span class="option-letter">${letter}</span><span>${esc(opt)}</span></button>`;
    }).join("");
    document.querySelectorAll(".option").forEach(btn => btn.addEventListener("click", () => {
      answers[q.id] = btn.dataset.letter;
      saveAnswers();
      renderQuestion();
    }));
  } else {
    const value = String(answers[q.id] || "");
    $("answerArea").innerHTML = `<textarea id="writtenBox" class="written-answer" maxlength="1500" placeholder="Write your answer in your own words...">${esc(value)}</textarea><div id="wordNote" class="word-note">${value.length}/1500 characters</div>`;
    $("writtenBox").addEventListener("input", e => {
      answers[q.id] = e.target.value;
      saveAnswers();
      $("wordNote").textContent = `${e.target.value.length}/1500 characters`;
    });
  }
}

function showReview() {
  reviewMode = true;
  $("questionStage").classList.add("hidden");
  $("reviewStage").classList.remove("hidden");
  const answered = questions.filter(q => {
    const a = answers[q.id];
    return q.type === "mcq" ? ["A","B","C","D"].includes(String(a || "")) : String(a || "").trim().length > 0;
  }).length;
  $("reviewSummary").textContent = `${answered}/${questions.length} answered`;
  $("reviewGrid").innerHTML = questions.map((q, i) => {
    const a = answers[q.id];
    const ok = q.type === "mcq" ? ["A","B","C","D"].includes(String(a || "")) : String(a || "").trim().length > 0;
    const shortAnswer = q.type === "mcq" ? (a || "No answer") : (String(a || "").trim() ? "Written answer added" : "No answer");
    return `<button class="review-item ${ok ? "answered" : "unanswered"}" type="button" data-jump="${i}"><b>Q${i+1} • ${esc(q.topic)}</b><small>${esc(shortAnswer)}</small></button>`;
  }).join("");
  document.querySelectorAll("[data-jump]").forEach(btn => btn.addEventListener("click", () => {
    currentIndex = Number(btn.dataset.jump);
    renderQuestion();
  }));
}

function deadlineMs() { return activeExam?.deadline_at ? new Date(activeExam.deadline_at).getTime() : 0; }
function startTimer() {
  clearInterval(timerId);
  const tick = () => {
    if (!examActive || !activeExam) return;
    const left = Math.max(0, deadlineMs() - Date.now());
    const mins = Math.floor(left / 60000);
    const secs = Math.floor((left % 60000) / 1000);
    $("clock").textContent = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    $("timerBox").classList.toggle("urgent", left <= 60000);
    if (left <= 0) {
      clearInterval(timerId);
      toast("Time is over. Submitting your exam...");
      submitExam("time_expired", true);
    }
  };
  tick();
  timerId = setInterval(tick, 500);
}

async function enterFullscreen() {
  try {
    const el = document.documentElement;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) return;
    await fn.call(el);
    fullscreenWasEntered = true;
    ignoreFullscreenUntil = Date.now() + 1200;
  } catch {
    fullscreenWasEntered = false;
  }
}
function updateWarningChip() {
  $("warningChip").textContent = `🛡️ ${localWarnings}/3 warnings`;
  $("warningChip").classList.toggle("hot", localWarnings > 0);
}
async function recordWarning(type, humanText) {
  if (!examActive || !activeExam || warningInFlight || submitInFlight) return;
  warningInFlight = true;
  try {
    const d = await jsonApi(`/api/student/exams/${activeExam.exam_id}/integrity`, {
      method:"POST",
      body:JSON.stringify({ type })
    });
    localWarnings = Number(d.warnings || localWarnings + 1);
    updateWarningChip();
    toast(`Warning ${localWarnings}/3: ${humanText}`);
    if (localWarnings >= Number(d.maxWarnings || 3)) {
      await submitExam("integrity_limit", true);
    }
  } catch (err) {
    console.warn("Integrity warning could not sync", err);
  } finally {
    warningInFlight = false;
  }
}
function installIntegrityHandlers() {
  document.addEventListener("contextmenu", blockContextMenu, true);
  document.addEventListener("copy", blockClipboard, true);
  document.addEventListener("cut", blockClipboard, true);
  document.addEventListener("paste", blockClipboard, true);
  document.addEventListener("keydown", blockKeys, true);
  document.addEventListener("visibilitychange", visibilityWarning, true);
  document.addEventListener("fullscreenchange", fullscreenWarning, true);
  document.addEventListener("webkitfullscreenchange", fullscreenWarning, true);
}
function removeIntegrityHandlers() {
  document.removeEventListener("contextmenu", blockContextMenu, true);
  document.removeEventListener("copy", blockClipboard, true);
  document.removeEventListener("cut", blockClipboard, true);
  document.removeEventListener("paste", blockClipboard, true);
  document.removeEventListener("keydown", blockKeys, true);
  document.removeEventListener("visibilitychange", visibilityWarning, true);
  document.removeEventListener("fullscreenchange", fullscreenWarning, true);
  document.removeEventListener("webkitfullscreenchange", fullscreenWarning, true);
}
function blockContextMenu(e) { if (examActive) { e.preventDefault(); toast("Right-click is disabled during the exam"); } }
function blockClipboard(e) { if (examActive) { e.preventDefault(); toast("Copy/paste is disabled during the exam"); } }
function blockKeys(e) {
  if (!examActive) return;
  const key = String(e.key || "").toLowerCase();
  if ((e.ctrlKey || e.metaKey) && ["c","v","x","u","s","p"].includes(key)) {
    e.preventDefault();
    toast("That shortcut is disabled during the exam");
  }
}
function visibilityWarning() {
  if (!examActive || document.visibilityState !== "hidden" || Date.now() < ignoreVisibilityUntil) return;
  recordWarning("tab_hidden", "Please stay on the exam page");
}
function fullscreenWarning() {
  if (!examActive || !fullscreenWasEntered || Date.now() < ignoreFullscreenUntil) return;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    fullscreenWasEntered = false;
    recordWarning("fullscreen_exit", "Fullscreen was exited");
  }
}
function installBeforeUnload() {
  if (beforeUnloadInstalled) return;
  window.addEventListener("beforeunload", beforeUnloadHandler);
  beforeUnloadInstalled = true;
}
function removeBeforeUnload() {
  if (!beforeUnloadInstalled) return;
  window.removeEventListener("beforeunload", beforeUnloadHandler);
  beforeUnloadInstalled = false;
}
function beforeUnloadHandler(e) {
  if (!examActive) return;
  e.preventDefault();
  e.returnValue = "";
}

async function submitExam(reason = "student_submit", automatic = false) {
  if (!examActive || !activeExam || submitInFlight) return;
  if (!automatic) {
    const unanswered = questions.filter(q => {
      const a = answers[q.id];
      return q.type === "mcq" ? !["A","B","C","D"].includes(String(a || "")) : !String(a || "").trim();
    }).length;
    const message = unanswered
      ? `You still have ${unanswered} unanswered question(s). Submit anyway?`
      : "Final submit now? You cannot change answers after submission.";
    if (!confirm(message)) return;
  }

  submitInFlight = true;
  $("finalSubmitBtn").disabled = true;
  try {
    const d = await jsonApi(`/api/student/exams/${activeExam.exam_id}/submit`, {
      method:"POST",
      body:JSON.stringify({ answers, reason })
    });
    finishClientExam();
    if (d.status === "reviewed") {
      openModal(`<div class="modal-icon">${d.result === "PASS" ? "🏆" : "📘"}</div><h2>Exam Submitted</h2><p>Your score is <b>${d.finalScore}%</b>.</p><p>Result: <b>${esc(d.result)}</b></p><div class="modal-actions"><button id="doneBtn" class="btn primary">Back to My Exams</button></div>`);
    } else {
      openModal(`<div class="modal-icon">✅</div><h2>Exam Submitted</h2><p>Your MCQ answers are saved. Your written answer(s) are now waiting for teacher review.</p><p>Your final PASS/FAIL result will appear here after review.</p><div class="modal-actions"><button id="doneBtn" class="btn primary">Back to My Exams</button></div>`);
    }
    $("doneBtn").onclick = async () => { closeModal(); await returnToDashboard(); };
  } catch (err) {
    submitInFlight = false;
    $("finalSubmitBtn").disabled = false;
    if (automatic) openModal(`<div class="modal-icon">⚠️</div><h2>Submission Needs Retry</h2><p>${esc(err.message)}</p><p>Your selected answers are still saved in this browser session. Keep this page open and retry.</p><div class="modal-actions"><button class="btn primary" onclick="closeStudentExamModal()">OK</button></div>`);
    else toast(err.message);
  }
}
function finishClientExam() {
  examActive = false;
  clearInterval(timerId);
  removeIntegrityHandlers();
  removeBeforeUnload();
  document.body.classList.remove("exam-active");
  clearSavedAnswers();
  try {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  } catch {}
}
async function returnToDashboard() {
  activeExam = null;
  questions = [];
  answers = {};
  currentIndex = 0;
  submitInFlight = false;
  $("examView").classList.add("hidden");
  $("dashboardView").classList.remove("hidden");
  await loadDashboard();
}

$("prevBtn").addEventListener("click", () => { if (currentIndex > 0) { currentIndex--; renderQuestion(); } });
$("nextBtn").addEventListener("click", () => {
  if (currentIndex >= questions.length - 1) showReview();
  else { currentIndex++; renderQuestion(); }
});
$("reviewBtn").addEventListener("click", showReview);
$("backToQuestionsBtn").addEventListener("click", () => { currentIndex = Math.min(currentIndex, questions.length - 1); renderQuestion(); });
$("finalSubmitBtn").addEventListener("click", () => submitExam("student_submit", false));
$("refreshBtn").addEventListener("click", async () => { await loadDashboard(); toast("Exam list refreshed"); });

loadDashboard();
})();
