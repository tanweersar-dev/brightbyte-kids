(() => {
"use strict";

/* ============================================================
   V40.12 — FRIENDLY CLASS 4–6 EXAMS + PRINTABLE DETAILED MARKSHEET
   - Reviewed exams get a full question-by-question marksheet
   - Shows student's answer, correct answer, points and practice topics
   ============================================================ */

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
let modalResolver = null;

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
function ensureDialogStyles(){
  if(document.getElementById("studentExamDialogV392Style")) return;
  const s=document.createElement("style");
  s.id="studentExamDialogV392Style";
  s.textContent=`.v392-dialog{text-align:center}.v392-dialog-icon{width:72px;height:72px;margin:0 auto 12px;border-radius:22px;display:grid;place-items:center;font-size:34px;background:linear-gradient(135deg,#eeeaff,#e9fffb);box-shadow:inset 0 0 0 1px #e4e2ff}.v392-dialog h2{margin:6px 0 8px}.v392-dialog p{max-width:500px;margin:0 auto;color:#707897;line-height:1.65}.v392-detail{margin-top:12px;padding:11px 13px;border-radius:13px;background:#f5f6ff;color:#505879;font-size:12px}.v392-dialog-actions{display:flex;justify-content:center;gap:10px;margin-top:20px;flex-wrap:wrap}.v392-pass{color:#11885c}.v392-fail{color:#c8445c}`;
  document.head.appendChild(s);
}
function openModal(html) {
  const card = $("modalCard");
  card.classList.toggle("marksheet-modal", /marksheet-v4011/.test(String(html || "")));
  card.innerHTML = html;
  $("modalWrap").classList.add("open");
  $("modalWrap").setAttribute("aria-hidden", "false");
}
function closeModal(value = null) {
  $("modalWrap").classList.remove("open");
  $("modalWrap").setAttribute("aria-hidden", "true");
  $("modalCard").classList.remove("marksheet-modal");
  if(modalResolver){ const r=modalResolver; modalResolver=null; r(value); }
}
window.closeStudentExamModal = closeModal;
$("modalWrap").addEventListener("click", e => { if (e.target === $("modalWrap") && !examActive) closeModal(false); });

function dialogConfirm({icon="❓",title="Please Confirm",message="",detail="",confirmText="Confirm",cancelText="Cancel",danger=false}={}){
  ensureDialogStyles();
  openModal(`<div class="v392-dialog"><div class="v392-dialog-icon">${icon}</div><h2>${esc(title)}</h2><p>${esc(message)}</p>${detail?`<div class="v392-detail">${esc(detail)}</div>`:""}<div class="v392-dialog-actions"><button id="studentDlgCancel" class="btn secondary" type="button">${esc(cancelText)}</button><button id="studentDlgConfirm" class="btn ${danger?"success":"primary"}" type="button">${esc(confirmText)}</button></div></div>`);
  return new Promise(resolve=>{ modalResolver=resolve; $("studentDlgCancel").onclick=()=>closeModal(false); $("studentDlgConfirm").onclick=()=>closeModal(true); });
}
function dialogInfo({icon="✅",title="Done",message="",detail="",buttonText="OK",resultClass=""}={}){
  ensureDialogStyles();
  openModal(`<div class="v392-dialog"><div class="v392-dialog-icon">${icon}</div><h2 class="${resultClass}">${esc(title)}</h2><p>${esc(message)}</p>${detail?`<div class="v392-detail">${esc(detail)}</div>`:""}<div class="v392-dialog-actions"><button id="studentDlgOk" class="btn primary" type="button">${esc(buttonText)}</button></div></div>`);
  return new Promise(resolve=>{ modalResolver=resolve; $("studentDlgOk").onclick=()=>closeModal(true); });
}
async function showError(err,title="Something went wrong"){ await dialogInfo({icon:"⚠️",title,message:err?.message||String(err||"Unknown error")}); }

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
function resultSeenKey(row){ return `brightbyte_exam_result_seen_${row.exam_id}`; }
function resultSignature(row){ return `${row.reviewed_at || ""}|${row.result || ""}|${row.final_score ?? ""}`; }
function isResultSeen(row){ try{return localStorage.getItem(resultSeenKey(row))===resultSignature(row);}catch{return false;} }
function markResultSeen(row){ try{localStorage.setItem(resultSeenKey(row),resultSignature(row));}catch{} }

async function loadDashboard({silent=false} = {}) {
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
    const fresh = examRows.find(x => x.assignment_status === "reviewed" && !isResultSeen(x));
    if(fresh && !examActive){
      const pass=String(fresh.result||"").toUpperCase()==="PASS";
      await dialogInfo({icon:pass?"🏆":"📘",title:pass?"Congratulations — PASS":"Exam Result Ready",message:`${fresh.title}: ${fresh.result} • ${fresh.final_score ?? 0}%`,detail:"Your detailed marksheet is ready. You can see every question, your answer, the correct answer and what to practise next.",buttonText:"View Marksheet",resultClass:pass?"v392-pass":"v392-fail"});
      markResultSeen(fresh);
      await showMarksheet(fresh.exam_id);
    } else if(!silent) {
      // no extra popup on ordinary refresh
    }
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

    let actionHtml = "";
    if (isActionable(row)) {
      actionHtml = `<button class="btn primary" type="button" data-start="${row.exam_id}">${actionLabel(row)}</button>`;
    } else if (finished) {
      actionHtml = `<button class="btn result-btn" type="button" data-result="${row.exam_id}">📊 View Marksheet</button>`;
    } else {
      actionHtml = `<button class="btn secondary" type="button" data-status="${row.exam_id}" ${unavailable ? "disabled" : ""}>${unavailable ? examStatusText(row) : "Status"}</button>`;
    }

    return `<article class="exam-card">
      <div class="exam-card-head">
        <div>
          <h3>${esc(row.title)}</h3>
          <p>${row.group_code === "junior" ? "Class 1–3 Foundation" : "Class 4–6 Future Skills"} Check</p>
        </div>
        <span class="status ${esc(status)}">${esc(examStatusText(row))}</span>
      </div>

      <div class="exam-meta-grid">
        <span><b>${row.duration_minutes}</b><small>MINUTES</small></span>
        <span><b>${row.mcq_count + row.written_count}</b><small>QUESTIONS</small></span>
        <span><b>${row.pass_mark}%</b><small>PASS MARK</small></span>
      </div>

      <p>${
        status === "assigned" ? `Available until <b>${esc(fmt(row.available_until))}</b>` :
        status === "in_progress" ? `Started <b>${esc(fmt(row.started_at))}</b>` :
        status === "submitted" ? `Submitted <b>${esc(fmt(row.submitted_at))}</b>` :
        status === "reviewed" ? `Reviewed <b>${esc(fmt(row.reviewed_at))}</b>` :
        `Status: <b>${esc(examStatusText(row))}</b>`
      }</p>

      <div class="card-actions">
        <div>${
          finished
            ? `<span class="result-badge ${esc(result)}">${esc(result || "DONE")}</span><br><small>${row.final_score ?? 0}% • Detailed marksheet ready</small>`
            : status === "submitted"
              ? `<b>Teacher review pending</b>`
              : row.integrity_warnings
                ? `<small>⚠ ${row.integrity_warnings} warning(s)</small>`
                : `<small>Questions match your assigned class level</small>`
        }</div>
        ${actionHtml}
      </div>
    </article>`;
  }).join("");

  document.querySelectorAll("[data-start]").forEach(btn =>
    btn.addEventListener("click", () => confirmStart(Number(btn.dataset.start)))
  );
  document.querySelectorAll("[data-status]").forEach(btn =>
    btn.addEventListener("click", () => showStatus(Number(btn.dataset.status)))
  );
  document.querySelectorAll("[data-result]").forEach(btn =>
    btn.addEventListener("click", () => showMarksheet(Number(btn.dataset.result)))
  );
}

function showStatus(examId) {
  const row = examRows.find(x => x.exam_id === examId);
  if (!row) return;

  if (row.assignment_status === "reviewed") {
    showMarksheet(examId);
    return;
  }

  const body = row.assignment_status === "submitted"
    ? "Your exam was submitted successfully. Written answers are waiting for teacher review. Your full marksheet will appear after the review is finished."
    : `Current status: ${examStatusText(row)}`;

  openModal(`<div class="modal-icon">📝</div><h2>${esc(row.title)}</h2><p>${esc(body)}</p><div class="modal-actions"><button class="btn primary" onclick="closeStudentExamModal()">OK</button></div>`);
}

function answerLabelV4011(q, option) {
  const letter = String(option || "").toUpperCase();
  const i = ["A","B","C","D"].indexOf(letter);
  if (i < 0) return "No answer";
  return `${letter} — ${q.options?.[i] || ""}`;
}

function marksheetVerdictLabelV4011(q) {
  const v = q.verdict;
  if (v === "correct") return ["✅","Correct","correct"];
  if (v === "incorrect") return ["❌","Incorrect","incorrect"];
  if (v === "full_credit") return ["✅","Full Credit","correct"];
  if (v === "partial_credit") return ["🟡","Partial Credit","partial"];
  if (v === "unanswered") return ["⚪","Not Answered","unanswered"];
  return ["📘","Needs Improvement","incorrect"];
}

function marksheetTopicAnalysisV4011(rows) {
  const weak = [];
  const strong = [];

  rows.forEach(q => {
    const topic = String(q.topic || "General");
    const good = q.type === "mcq"
      ? q.verdict === "correct"
      : Number(q.awardedPoints || 0) >= Number(q.maxPoints || 0) && Number(q.maxPoints || 0) > 0;

    if (good) strong.push(topic);
    else weak.push(topic);
  });

  return {
    strong:[...new Set(strong)].slice(0,8),
    weak:[...new Set(weak)].slice(0,8)
  };
}

function marksheetQuestionHtmlV4011(q) {
  const [ico,label,cls] = marksheetVerdictLabelV4011(q);
  const points = `${Number(q.awardedPoints || 0)} / ${Number(q.maxPoints || 0)}`;

  if (q.type === "mcq") {
    return `
      <article class="marksheet-q ${cls}">
        <div class="marksheet-q-head">
          <div>
            <span class="marksheet-q-no">Q${Number(q.seq)} • ${esc(q.topic || "Topic")} • MCQ</span>
            <h3>${esc(q.prompt)}</h3>
          </div>
          <span class="marksheet-verdict ${cls}">${ico} ${label}</span>
        </div>

        <div class="marksheet-answer-grid">
          <div class="marksheet-answer yours">
            <small>YOUR ANSWER</small>
            <b>${esc(answerLabelV4011(q, q.selectedOption))}</b>
          </div>

          <div class="marksheet-answer correct-answer">
            <small>CORRECT ANSWER</small>
            <b>${esc(answerLabelV4011(q, q.correctOption))}</b>
          </div>

          <div class="marksheet-points">
            <small>POINTS</small>
            <b>${esc(points)}</b>
          </div>
        </div>

        <p class="marksheet-tip">${
          q.verdict === "correct"
            ? "Great job — you understood this concept."
            : q.verdict === "unanswered"
              ? "This question was not answered. Review this topic and try a similar practice question."
              : `Review <b>${esc(q.topic || "this topic")}</b> and compare your answer with the correct one above.`
        }</p>
      </article>`;
  }

  return `
    <article class="marksheet-q ${cls}">
      <div class="marksheet-q-head">
        <div>
          <span class="marksheet-q-no">Q${Number(q.seq)} • ${esc(q.topic || "Topic")} • WRITTEN</span>
          <h3>${esc(q.prompt)}</h3>
        </div>
        <span class="marksheet-verdict ${cls}">${ico} ${label}</span>
      </div>

      <div class="marksheet-written">
        <div>
          <small>YOUR ANSWER</small>
          <p>${esc(q.answerText || "No answer submitted.")}</p>
        </div>

        <div>
          <small>MODEL / LEARNING ANSWER</small>
          <p>${esc(q.modelAnswer || "Review this topic with your teacher or learning material.")}</p>
        </div>
      </div>

      <div class="marksheet-written-score">
        <b>Teacher Score: ${esc(points)}</b>
        <span>${
          q.verdict === "full_credit"
            ? "Excellent — full credit."
            : q.verdict === "partial_credit"
              ? "Good attempt — compare your answer with the model answer and improve the missing part."
              : q.verdict === "unanswered"
                ? "No answer was submitted."
                : "Review the model answer and practise this topic again."
        }</span>
      </div>
    </article>`;
}


/* ============================================================
   V40.12 — PRINT / SAVE PDF FOR DETAILED MARKSHEET
   ============================================================ */
function printStudentExamMarksheetV4012(){
  const marksheet = document.querySelector(".marksheet-v4011:not(.loading)");
  if(!marksheet){
    toast("Open the detailed marksheet first");
    return;
  }

  document.body.classList.add("printing-marksheet-v4012");

  /*
    Let the browser finish applying print styles before opening
    the native Print / Save as PDF dialog.
  */
  requestAnimationFrame(() => {
    setTimeout(() => {
      try{
        window.print();
      }catch(err){
        console.error(err);
        toast("Print dialog could not be opened");
        document.body.classList.remove("printing-marksheet-v4012");
      }
    }, 80);
  });
}

window.printStudentExamMarksheetV4012 = printStudentExamMarksheetV4012;

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-marksheet-v4012");
});

async function showMarksheet(examId) {
  openModal(`
    <section class="marksheet-v4011 loading">
      <div class="marksheet-loading">📊 Preparing your detailed marksheet...</div>
    </section>
  `);

  try {
    const d = await jsonApi(`/api/student/exams/${Number(examId)}/result`);
    const exam = d.exam || {};
    const rows = Array.isArray(d.questions) ? d.questions : [];
    const profileData = d.profile || {};

    const pass = String(exam.result || "").toUpperCase() === "PASS";
    const mcqs = rows.filter(q => q.type === "mcq");
    const correctMcq = mcqs.filter(q => q.verdict === "correct").length;
    const wrongMcq = mcqs.filter(q => q.verdict === "incorrect").length;
    const unanswered = rows.filter(q => q.verdict === "unanswered").length;
    const awarded = rows.reduce((n,q) => n + Number(q.awardedPoints || 0), 0);
    const maxPoints = rows.reduce((n,q) => n + Number(q.maxPoints || 0), 0);
    const topicAnalysis = marksheetTopicAnalysisV4011(rows);

    const weakHtml = topicAnalysis.weak.length
      ? topicAnalysis.weak.map(t => `<span>${esc(t)}</span>`).join("")
      : `<span class="good-chip">No weak topic detected 🎉</span>`;

    const strongHtml = topicAnalysis.strong.length
      ? topicAnalysis.strong.map(t => `<span>${esc(t)}</span>`).join("")
      : `<span>Keep practising</span>`;

    openModal(`
      <section class="marksheet-v4011">
        <header class="marksheet-hero ${pass ? "pass" : "fail"}">
          <div>
            <span class="marksheet-kicker">MY DETAILED EXAM MARKSHEET</span>
            <h2>${esc(exam.title || "Exam Result")}</h2>
            <p>${esc(profileData.display_name || "Student")} • Class ${Number(profileData.class_number || 1)} • Reviewed ${esc(fmt(exam.reviewed_at))}</p>
          </div>

          <div class="marksheet-hero-side">
            <div class="marksheet-score">
              <small>FINAL SCORE</small>
              <b>${Number(exam.final_score || 0)}%</b>
              <span>${pass ? "🏆 PASS" : "📘 KEEP PRACTISING"}</span>
            </div>

            <button
              class="btn marksheet-print-btn no-print-v4012"
              type="button"
              onclick="printStudentExamMarksheetV4012()"
              title="Print this marksheet or save it as a PDF">
              🖨️ Print / Save PDF
            </button>
          </div>
        </header>

        <div class="marksheet-summary">
          <div><b>${correctMcq}</b><small>CORRECT MCQ</small></div>
          <div><b>${wrongMcq}</b><small>WRONG MCQ</small></div>
          <div><b>${unanswered}</b><small>UNANSWERED</small></div>
          <div><b>${Number(exam.manual_points || 0)}</b><small>WRITTEN POINTS</small></div>
          <div><b>${awarded}/${maxPoints}</b><small>TOTAL POINTS</small></div>
          <div><b>${Number(exam.pass_mark || 60)}%</b><small>PASS MARK</small></div>
        </div>

        <section class="marksheet-analysis">
          <div>
            <small>🌟 STRONG TOPICS</small>
            <div class="marksheet-chips strong">${strongHtml}</div>
          </div>
          <div>
            <small>🎯 PRACTISE NEXT</small>
            <div class="marksheet-chips weak">${weakHtml}</div>
          </div>
        </section>

        <div class="marksheet-note">
          <b>How to use this marksheet:</b>
          Read every wrong or partial answer, compare it with the correct/model answer, then practise that topic again. This is for learning — not only for pass or fail.
        </div>

        <div class="marksheet-question-list">
          ${rows.map(marksheetQuestionHtmlV4011).join("")}
        </div>

        <footer class="marksheet-footer">
          <div>
            <b>${pass ? "Well done!" : "You can improve this."}</b>
            <span>${pass ? "Keep practising the topics marked above to make your skills even stronger." : "Focus on the Practice Next topics, then try another evaluation when ready."}</span>
          </div>
          <div class="marksheet-footer-actions no-print-v4012">
            <button
              class="btn marksheet-print-btn"
              type="button"
              onclick="printStudentExamMarksheetV4012()">
              🖨️ Print / Save PDF
            </button>
            <button class="btn secondary" type="button" onclick="closeStudentExamModal()">← Back to My Exams</button>
          </div>
        </footer>
      </section>
    `);

  } catch (err) {
    await showError(err, "Detailed marksheet is not available yet");
  }
}
window.showStudentExamMarksheetV4011 = showMarksheet;

function confirmStart(examId) {
  const row = examRows.find(x => x.exam_id === examId); if (!row) return;
  const resume = row.assignment_status === "in_progress";
  openModal(`<div class="modal-icon">${resume ? "⏱️" : "📝"}</div><h2>${resume ? "Resume Exam" : "Start Exam"}?</h2><p><b>${esc(row.title)}</b></p><p>${resume ? "Your original timer is still running. Resume now." : `The ${row.duration_minutes}-minute timer starts immediately after you press Start. Your browser will try to enter fullscreen.`}</p><p><b>Rules:</b> no copy/paste, no switching tabs, no help from another person. Three integrity warnings can auto-submit the exam.</p><div class="modal-actions"><button class="btn secondary" onclick="closeStudentExamModal()">Not Yet</button><button id="modalStartBtn" class="btn primary" type="button">${resume ? "Resume Now" : "Start Now"}</button></div>`);
  $("modalStartBtn").onclick = async () => { $("modalStartBtn").disabled = true; try { await startExam(examId); closeModal(); } catch (err) { await showError(err,"Exam could not be started"); $("modalStartBtn") && ($("modalStartBtn").disabled = false); } };
}

function storageKey() { return activeExam ? `brightbyte_exam_answers_${activeExam.assignment_id}` : ""; }
function loadSavedAnswers() { answers = {}; try { const saved = JSON.parse(sessionStorage.getItem(storageKey()) || "{}"); if (saved && typeof saved === "object") answers = saved; } catch {} }
function saveAnswers() { if (activeExam) sessionStorage.setItem(storageKey(), JSON.stringify(answers)); }
function clearSavedAnswers() { if (activeExam) sessionStorage.removeItem(storageKey()); }

async function startExam(examId) {
  const d = await jsonApi(`/api/student/exams/${examId}/start`, { method:"POST" });
  activeExam = d.exam; questions = d.questions || []; if (!questions.length) throw new Error("No exam questions were found");
  currentIndex = 0; localWarnings = Number(activeExam.integrity_warnings || 0); loadSavedAnswers(); examActive = true; reviewMode = false; submitInFlight = false; fullscreenWasEntered = false; ignoreFullscreenUntil = Date.now()+2500; ignoreVisibilityUntil = Date.now()+2500;
  document.body.classList.add("exam-active"); $("dashboardView").classList.add("hidden"); $("examView").classList.remove("hidden"); $("questionStage").classList.remove("hidden"); $("reviewStage").classList.add("hidden"); $("activeTitle").textContent = activeExam.title; updateWarningChip(); renderQuestion(); startTimer(); installIntegrityHandlers(); installBeforeUnload(); await enterFullscreen();
}
function renderQuestion() {
  reviewMode = false; $("reviewStage").classList.add("hidden"); $("questionStage").classList.remove("hidden"); const q = questions[currentIndex]; if (!q) return;
  $("questionNumber").textContent = `Question ${currentIndex+1} of ${questions.length}`; $("questionTopic").textContent = q.type === "mcq" ? `${q.topic} • MCQ` : `${q.topic} • Written`; $("questionPrompt").textContent = q.prompt; $("activeMeta").textContent = `${activeExam.mcq_count} MCQ + ${activeExam.written_count} written • Pass ${activeExam.pass_mark}%`; $("questionProgress").style.width = `${Math.round(((currentIndex+1)/questions.length)*100)}%`; $("prevBtn").disabled = currentIndex===0; $("nextBtn").textContent = currentIndex===questions.length-1 ? "Review Answers →" : "Next →";
  if(q.type==="mcq"){
    const selected=String(answers[q.id]||"").toUpperCase(); $("answerArea").innerHTML=q.options.map((opt,i)=>{const letter=["A","B","C","D"][i];return `<button class="option ${selected===letter?"selected":""}" type="button" data-letter="${letter}"><span class="option-letter">${letter}</span><span>${esc(opt)}</span></button>`;}).join(""); document.querySelectorAll(".option").forEach(btn=>btn.addEventListener("click",()=>{answers[q.id]=btn.dataset.letter;saveAnswers();renderQuestion();}));
  }else{
    const value=String(answers[q.id]||""); $("answerArea").innerHTML=`<textarea id="writtenBox" class="written-answer" maxlength="1500" placeholder="Write your answer in your own words...">${esc(value)}</textarea><div id="wordNote" class="word-note">${value.length}/1500 characters</div>`; $("writtenBox").addEventListener("input",e=>{answers[q.id]=e.target.value;saveAnswers();$("wordNote").textContent=`${e.target.value.length}/1500 characters`;});
  }
}
function showReview() {
  reviewMode=true; $("questionStage").classList.add("hidden"); $("reviewStage").classList.remove("hidden");
  const answered=questions.filter(q=>{const a=answers[q.id];return q.type==="mcq"?["A","B","C","D"].includes(String(a||"")):String(a||"").trim().length>0;}).length; $("reviewSummary").textContent=`${answered}/${questions.length} answered`;
  $("reviewGrid").innerHTML=questions.map((q,i)=>{const a=answers[q.id];const ok=q.type==="mcq"?["A","B","C","D"].includes(String(a||"")):String(a||"").trim().length>0;const shortAnswer=q.type==="mcq"?(a||"No answer"):(String(a||"").trim()?"Written answer added":"No answer");return `<button class="review-item ${ok?"answered":"unanswered"}" type="button" data-jump="${i}"><b>Q${i+1} • ${esc(q.topic)}</b><small>${esc(shortAnswer)}</small></button>`;}).join(""); document.querySelectorAll("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>{currentIndex=Number(btn.dataset.jump);renderQuestion();}));
}
function deadlineMs(){ return activeExam?.deadline_at ? new Date(activeExam.deadline_at).getTime() : 0; }
function startTimer(){ clearInterval(timerId); const tick=()=>{if(!examActive||!activeExam)return;const left=Math.max(0,deadlineMs()-Date.now());const mins=Math.floor(left/60000),secs=Math.floor((left%60000)/1000);$("clock").textContent=`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;$("timerBox").classList.toggle("urgent",left<=60000);if(left<=0){clearInterval(timerId);toast("Time is over. Submitting your exam...");submitExam("time_expired",true);}};tick();timerId=setInterval(tick,500); }
async function enterFullscreen(){ try{const el=document.documentElement,fn=el.requestFullscreen||el.webkitRequestFullscreen;if(!fn)return;await fn.call(el);fullscreenWasEntered=true;ignoreFullscreenUntil=Date.now()+1200;}catch{fullscreenWasEntered=false;} }
function updateWarningChip(){ $("warningChip").textContent=`🛡️ ${localWarnings}/3 warnings`;$("warningChip").classList.toggle("hot",localWarnings>0); }
async function recordWarning(type,humanText){ if(!examActive||!activeExam||warningInFlight||submitInFlight)return;warningInFlight=true;try{const d=await jsonApi(`/api/student/exams/${activeExam.exam_id}/integrity`,{method:"POST",body:JSON.stringify({type})});localWarnings=Number(d.warnings||localWarnings+1);updateWarningChip();toast(`Warning ${localWarnings}/3: ${humanText}`);if(localWarnings>=Number(d.maxWarnings||3))await submitExam("integrity_limit",true);}catch(err){console.warn("Integrity warning could not sync",err);}finally{warningInFlight=false;} }
function installIntegrityHandlers(){document.addEventListener("contextmenu",blockContextMenu,true);document.addEventListener("copy",blockClipboard,true);document.addEventListener("cut",blockClipboard,true);document.addEventListener("paste",blockClipboard,true);document.addEventListener("keydown",blockKeys,true);document.addEventListener("visibilitychange",visibilityWarning,true);document.addEventListener("fullscreenchange",fullscreenWarning,true);document.addEventListener("webkitfullscreenchange",fullscreenWarning,true);}
function removeIntegrityHandlers(){document.removeEventListener("contextmenu",blockContextMenu,true);document.removeEventListener("copy",blockClipboard,true);document.removeEventListener("cut",blockClipboard,true);document.removeEventListener("paste",blockClipboard,true);document.removeEventListener("keydown",blockKeys,true);document.removeEventListener("visibilitychange",visibilityWarning,true);document.removeEventListener("fullscreenchange",fullscreenWarning,true);document.removeEventListener("webkitfullscreenchange",fullscreenWarning,true);}
function blockContextMenu(e){if(examActive){e.preventDefault();toast("Right-click is disabled during the exam");}}
function blockClipboard(e){if(examActive){e.preventDefault();toast("Copy/paste is disabled during the exam");}}
function blockKeys(e){if(!examActive)return;const key=String(e.key||"").toLowerCase();if((e.ctrlKey||e.metaKey)&&["c","v","x","u","s","p"].includes(key)){e.preventDefault();toast("That shortcut is disabled during the exam");}}
function visibilityWarning(){if(!examActive||document.visibilityState!=="hidden"||Date.now()<ignoreVisibilityUntil)return;recordWarning("tab_hidden","Please stay on the exam page");}
function fullscreenWarning(){if(!examActive||!fullscreenWasEntered||Date.now()<ignoreFullscreenUntil)return;if(!document.fullscreenElement&&!document.webkitFullscreenElement){fullscreenWasEntered=false;recordWarning("fullscreen_exit","Fullscreen was exited");}}
function installBeforeUnload(){if(beforeUnloadInstalled)return;window.addEventListener("beforeunload",beforeUnloadHandler);beforeUnloadInstalled=true;}
function removeBeforeUnload(){if(!beforeUnloadInstalled)return;window.removeEventListener("beforeunload",beforeUnloadHandler);beforeUnloadInstalled=false;}
function beforeUnloadHandler(e){if(!examActive)return;e.preventDefault();e.returnValue="";}

async function submitExam(reason="student_submit",automatic=false){
  if(!examActive||!activeExam||submitInFlight)return;
  if(!automatic){
    const unanswered=questions.filter(q=>{const a=answers[q.id];return q.type==="mcq"?!["A","B","C","D"].includes(String(a||"")):!String(a||"").trim();}).length;
    const ok=await dialogConfirm({icon:"📨",title:"Final Submit?",message:unanswered?`You still have ${unanswered} unanswered question(s). Do you want to submit anyway?`:"Submit your final answers now?",detail:"After final submission, answers cannot be changed.",confirmText:"Yes, Final Submit",cancelText:"Go Back & Review"});
    if(!ok)return;
  }
  submitInFlight=true;$("finalSubmitBtn").disabled=true;
  try{
    const d=await jsonApi(`/api/student/exams/${activeExam.exam_id}/submit`,{method:"POST",body:JSON.stringify({answers,reason})});
    finishClientExam();
    if(d.status==="reviewed"){
      const pass=String(d.result||"").toUpperCase()==="PASS";
      await dialogInfo({icon:pass?"🏆":"📘",title:`Exam Submitted — ${d.result}`,message:`Your score is ${d.finalScore}%.`,detail:"This result is final for this exam.",buttonText:"Back to My Exams",resultClass:pass?"v392-pass":"v392-fail"});
    }else{
      await dialogInfo({icon:"✅",title:"Exam Submitted Successfully",message:"Your MCQ and written answers were submitted.",detail:"Your teacher has been notified. You will receive a result notification after the written answers are reviewed.",buttonText:"Back to My Exams"});
    }
    await returnToDashboard();
  }catch(err){submitInFlight=false;$("finalSubmitBtn").disabled=false;if(automatic)await dialogInfo({icon:"⚠️",title:"Submission Needs Retry",message:err.message,detail:"Your selected answers are still saved in this browser session. Keep this page open and retry."});else await showError(err,"Exam could not be submitted");}
}
function finishClientExam(){examActive=false;clearInterval(timerId);removeIntegrityHandlers();removeBeforeUnload();document.body.classList.remove("exam-active");clearSavedAnswers();try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});}catch{}}
async function returnToDashboard(){activeExam=null;questions=[];answers={};currentIndex=0;submitInFlight=false;$("examView").classList.add("hidden");$("dashboardView").classList.remove("hidden");await loadDashboard({silent:true});}

$("prevBtn").addEventListener("click",()=>{if(currentIndex>0){currentIndex--;renderQuestion();}});
$("nextBtn").addEventListener("click",()=>{if(currentIndex>=questions.length-1)showReview();else{currentIndex++;renderQuestion();}});
$("reviewBtn").addEventListener("click",showReview);
$("backToQuestionsBtn").addEventListener("click",()=>{currentIndex=Math.min(currentIndex,questions.length-1);renderQuestion();});
$("finalSubmitBtn").addEventListener("click",()=>submitExam("student_submit",false));
$("refreshBtn").addEventListener("click",async()=>{await loadDashboard({silent:true});await dialogInfo({icon:"↻",title:"Exam List Refreshed",message:"Your exam status is up to date."});});

ensureDialogStyles();
loadDashboard();
setInterval(()=>{ if(!examActive && document.visibilityState === "visible") loadDashboard({silent:true}); },30000);
})();
