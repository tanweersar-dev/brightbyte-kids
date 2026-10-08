(() => {
"use strict";

/* ============================================================
   BrightByte Kids — V40.21 Safe Exam Record Delete Upgrade
   Additive only: does not replace exam-center.js or exam-center.css.
   ============================================================ */

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_admin_token";
const selectedExamIds = new Set();
let enhanceQueued = false;

const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
}[ch]));

function adminToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

async function api(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${adminToken()}`
  };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const response = await fetch(API + path, {
    ...options,
    headers,
    cache: "no-store"
  });

  let data = {};
  try { data = await response.json(); } catch {}
  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function groupLabel(exam) {
  return exam?.group_code === "junior" ? "Class 1–3 Foundation" : "Class 4–6 Advanced";
}

function audienceLabel(exam) {
  const type = String(exam?.audience_type || "");
  if (type === "group") return exam?.group_code === "junior" ? "Entire Class 1–3 group" : "Entire Class 4–6 group";
  if (type === "class") return `Class ${Number(exam?.target_class || exam?.curriculum_class || 0) || "—"}`;
  if (type === "selected") return "Selected students";
  return type || "—";
}

function injectStyles() {
  if ($("examDeleteV4021Style")) return;
  const style = document.createElement("style");
  style.id = "examDeleteV4021Style";
  style.textContent = `
    .v4021-bulkbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px;padding:12px 14px;border:1px solid #efd7dd;border-radius:14px;background:linear-gradient(135deg,#fff8fa,#fff)}
    .v4021-bulk-left,.v4021-bulk-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
    .v4021-select-all{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:900;color:#424a6d;cursor:pointer}
    .v4021-select-all input,.v4021-exam-check input{accent-color:#c83e58;width:16px;height:16px}
    .v4021-selected-count{display:inline-flex;align-items:center;min-height:30px;padding:6px 9px;border-radius:999px;background:#f1f2fa;color:#626a88;font-size:10px;font-weight:950}
    .v4021-danger-btn{border:0;border-radius:10px;padding:8px 11px;background:#ffe7ec;color:#b8304d;font-size:10px;font-weight:950;cursor:pointer}
    .v4021-danger-btn:hover{background:#ffd8e1}.v4021-danger-btn:disabled{opacity:.45;cursor:not-allowed}
    .v4021-master-btn{background:#b92f4b;color:#fff;box-shadow:0 8px 18px #bd395333}.v4021-master-btn:hover{background:#a82742}
    .v4021-exam-check{display:flex;align-items:center;gap:7px;margin:0 0 10px;padding:7px 9px;border-radius:10px;background:#fff4f6;color:#9d2d45;font-size:10px;font-weight:950;width:max-content;max-width:100%;cursor:pointer}
    .exam-card.v4021-selected{outline:2px solid #dc6b82;box-shadow:0 12px 28px #b92f4b18}
    .card-actions .v4021-delete{background:#c93652!important;color:#fff!important;box-shadow:0 7px 16px #c9365230}
    .card-actions .v4021-delete:hover{background:#ad2943!important}
    .v4021-overlay{position:fixed;inset:0;z-index:1000;display:none;place-items:center;padding:16px;background:#0b1035d9;backdrop-filter:blur(4px)}
    .v4021-overlay.open{display:grid}
    .v4021-dialog{width:min(620px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:24px;padding:22px;box-shadow:0 30px 90px #0006}
    .v4021-icon{width:70px;height:70px;margin:0 auto 12px;border-radius:22px;display:grid;place-items:center;font-size:34px;background:#fff0f3;border:1px solid #ffd5df}
    .v4021-dialog h2{text-align:center;margin:5px 0 8px;color:#252d4e}.v4021-dialog>p{text-align:center;margin:0 auto 14px;max-width:520px;color:#6f7897;line-height:1.65;font-size:12px}
    .v4021-summary{display:grid;gap:8px;margin:14px 0;padding:13px;border-radius:14px;background:#f7f8fd;border:1px solid #e5e8f2}
    .v4021-summary-row{display:flex;justify-content:space-between;gap:14px;font-size:11px}.v4021-summary-row span{color:#7b839f}.v4021-summary-row b{text-align:right;color:#303858}
    .v4021-student-preview{margin-top:10px;padding:10px 12px;border-radius:12px;background:#fff;border:1px solid #e8eaf3;font-size:10px;line-height:1.65}.v4021-student-preview>span{display:block;margin-bottom:4px;color:#7b839f;font-weight:900;text-transform:uppercase;letter-spacing:.5px}.v4021-student-preview>div{color:#303858}
    .v4021-warning{margin:12px 0;padding:11px 13px;border-radius:12px;background:#fff0f3;border:1px solid #ffd8e1;color:#9e2d46;font-size:11px;line-height:1.55}
    .v4021-safe{background:#eefaf7;border-color:#cbeee5;color:#247365}
    .v4021-list{max-height:155px;overflow:auto;margin:10px 0;padding:9px 12px;border-radius:12px;background:#fafbff;border:1px solid #e7e9f2;font-size:10px;color:#626b88;line-height:1.6}
    .v4021-field{display:grid;gap:6px;margin:12px 0}.v4021-field label{font-size:10px;font-weight:950;color:#424a6d}.v4021-field input{width:100%;border:1px solid #dfe3f0;border-radius:12px;padding:12px;background:#fbfcff;outline:none}.v4021-field input:focus{border-color:#c64b63;box-shadow:0 0 0 3px #c64b6315}
    .v4021-inline-error{display:none;margin:8px 0;padding:10px 12px;border-radius:11px;background:#fff0f3;color:#ae314b;font-size:11px;font-weight:850}.v4021-inline-error.show{display:block}
    .v4021-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin-top:18px}.v4021-actions button{border:0;border-radius:12px;padding:10px 14px;font-weight:950;cursor:pointer}.v4021-cancel{background:#eef0f7;color:#59617d}.v4021-continue{background:#c93652;color:#fff}.v4021-continue:disabled{opacity:.5;cursor:not-allowed}
    @media(max-width:620px){.v4021-bulkbar{align-items:stretch}.v4021-bulk-left,.v4021-bulk-actions{width:100%}.v4021-bulk-actions button{flex:1}.v4021-summary-row{display:grid;gap:3px}.v4021-summary-row b{text-align:left}}
  `;
  document.head.appendChild(style);
}

function ensureModalRoot() {
  let root = $("examDeleteV4021Modal");
  if (root) return root;
  root = document.createElement("div");
  root.id = "examDeleteV4021Modal";
  root.className = "v4021-overlay";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `<div class="v4021-dialog" role="dialog" aria-modal="true"></div>`;
  root.addEventListener("click", e => {
    if (e.target === root) closeDeleteModal(false);
  });
  document.body.appendChild(root);
  return root;
}

let modalResolve = null;
function openDeleteModal(html) {
  const root = ensureModalRoot();
  root.querySelector(".v4021-dialog").innerHTML = html;
  root.classList.add("open");
  root.setAttribute("aria-hidden", "false");
}
function closeDeleteModal(value = false) {
  const root = ensureModalRoot();
  root.classList.remove("open");
  root.setAttribute("aria-hidden", "true");
  if (modalResolve) {
    const resolve = modalResolve;
    modalResolve = null;
    resolve(value);
  }
}

function confirmModal({icon="⚠️", title, message, summaryHtml="", warning="", confirmText="Continue", cancelText="Cancel"}) {
  openDeleteModal(`
    <div class="v4021-icon">${icon}</div>
    <h2>${esc(title)}</h2>
    <p>${esc(message)}</p>
    ${summaryHtml}
    ${warning ? `<div class="v4021-warning">${esc(warning)}</div>` : ""}
    <div class="v4021-actions">
      <button id="v4021Cancel" class="v4021-cancel" type="button">${esc(cancelText)}</button>
      <button id="v4021Confirm" class="v4021-continue" type="button">${esc(confirmText)}</button>
    </div>
  `);
  return new Promise(resolve => {
    modalResolve = resolve;
    $("v4021Cancel").onclick = () => closeDeleteModal(false);
    $("v4021Confirm").onclick = () => closeDeleteModal(true);
  });
}

function secureDeleteModal({title, detailsHtml="", phrase="", phraseLabel="Type the safety phrase", submitText="Delete Permanently"}) {
  openDeleteModal(`
    <div class="v4021-icon">🔐</div>
    <h2>${esc(title)}</h2>
    <p>Final security check. The delete will happen only after the current Admin password is verified by the Worker.</p>
    ${detailsHtml}
    ${phrase ? `<div class="v4021-field"><label>${esc(phraseLabel)}: <b>${esc(phrase)}</b></label><input id="v4021Phrase" autocomplete="off" spellcheck="false" placeholder="${esc(phrase)}"></div>` : ""}
    <div class="v4021-field"><label>Admin Password</label><input id="v4021Password" type="password" autocomplete="current-password" placeholder="Enter Admin password"></div>
    <div id="v4021Error" class="v4021-inline-error"></div>
    <div class="v4021-actions">
      <button id="v4021Back" class="v4021-cancel" type="button">Cancel</button>
      <button id="v4021DoDelete" class="v4021-continue" type="button">${esc(submitText)}</button>
    </div>
  `);

  return new Promise(resolve => {
    modalResolve = resolve;
    $("v4021Back").onclick = () => closeDeleteModal(false);
    $("v4021Password").focus();
    $("v4021DoDelete").onclick = () => {
      const password = $("v4021Password").value;
      const typedPhrase = phrase ? $("v4021Phrase").value.trim() : "";
      const error = $("v4021Error");
      if (!password) {
        error.textContent = "Admin password is required. Nothing has been deleted.";
        error.classList.add("show");
        return;
      }
      if (phrase && typedPhrase !== phrase) {
        error.textContent = `Type exactly: ${phrase}. Nothing has been deleted.`;
        error.classList.add("show");
        return;
      }
      closeDeleteModal({password, typedPhrase});
    };
  });
}

async function resultModal(result, title = "Exam Record Deleted") {
  const counts = `
    <div class="v4021-summary">
      <div class="v4021-summary-row"><span>Exam records</span><b>${Number(result.deletedExams || 0)}</b></div>
      <div class="v4021-summary-row"><span>Assignments / stored results</span><b>${Number(result.deletedAssignments || 0)}</b></div>
      <div class="v4021-summary-row"><span>Exam questions</span><b>${Number(result.deletedQuestions || 0)}</b></div>
      <div class="v4021-summary-row"><span>Stored answers</span><b>${Number(result.deletedAnswers || 0)}</b></div>
    </div>`;
  openDeleteModal(`
    <div class="v4021-icon">✅</div>
    <h2>${esc(title)}</h2>
    <p>The selected exam data was removed successfully.</p>
    ${counts}
    <div class="v4021-warning v4021-safe">Student accounts, profiles, course progress and the built-in question bank were not deleted.</div>
    <div class="v4021-actions"><button id="v4021Done" class="v4021-continue" type="button">OK</button></div>
  `);
  await new Promise(resolve => {
    modalResolve = resolve;
    $("v4021Done").onclick = () => closeDeleteModal(true);
  });
}

function showInlineRequestError(err) {
  const box = $("v4021Error");
  if (!box) return false;
  box.textContent = err?.status === 401
    ? "Admin password is incorrect or the Admin session is no longer valid. Nothing has been deleted."
    : (err?.message || "Delete failed. Nothing has been deleted.");
  box.classList.add("show");
  return true;
}

function examIdFromCard(card) {
  const button = card.querySelector('button.open[onclick*="openExamDetails"]');
  const match = String(button?.getAttribute("onclick") || "").match(/openExamDetails\((\d+)\)/);
  return match ? Number(match[1]) : 0;
}

function visibleExamIds() {
  return [...document.querySelectorAll("#examRecords .exam-card")]
    .map(examIdFromCard)
    .filter(id => Number.isInteger(id) && id > 0);
}

function ensureBulkToolbar() {
  const panel = $("tab-records");
  const filters = panel?.querySelector(".filters");
  if (!filters || $("examDeleteBulkBarV4021")) return;

  const bar = document.createElement("div");
  bar.id = "examDeleteBulkBarV4021";
  bar.className = "v4021-bulkbar";
  bar.innerHTML = `
    <div class="v4021-bulk-left">
      <label class="v4021-select-all"><input id="examDeleteSelectAllV4021" type="checkbox"> Select All Visible</label>
      <span id="examDeleteSelectedCountV4021" class="v4021-selected-count">0 selected</span>
    </div>
    <div class="v4021-bulk-actions">
      <button id="examDeleteClearV4021" class="v4021-danger-btn" type="button">Clear Selection</button>
      <button id="examDeleteSelectedV4021" class="v4021-danger-btn" type="button" disabled>🗑 Delete Selected</button>
      <button id="examDeleteAllV4021" class="v4021-danger-btn v4021-master-btn" type="button">⚠ Master Delete All</button>
    </div>`;
  filters.insertAdjacentElement("afterend", bar);

  $("examDeleteSelectAllV4021").addEventListener("change", e => {
    const ids = visibleExamIds();
    ids.forEach(id => e.target.checked ? selectedExamIds.add(id) : selectedExamIds.delete(id));
    applySelectionState();
  });
  $("examDeleteClearV4021").addEventListener("click", () => {
    selectedExamIds.clear();
    applySelectionState();
  });
  $("examDeleteSelectedV4021").addEventListener("click", bulkDeleteSelected);
  $("examDeleteAllV4021").addEventListener("click", masterDeleteAll);
}

function enhanceExamCards() {
  injectStyles();
  ensureModalRoot();
  ensureBulkToolbar();

  document.querySelectorAll("#examRecords .exam-card").forEach(card => {
    const id = examIdFromCard(card);
    if (!id) return;
    card.dataset.examDeleteId = String(id);

    if (!card.querySelector(".v4021-exam-check")) {
      const label = document.createElement("label");
      label.className = "v4021-exam-check";
      label.innerHTML = `<input type="checkbox" class="v4021-card-checkbox" aria-label="Select exam ${id}"> Select`;
      card.insertBefore(label, card.firstChild);
      label.querySelector("input").addEventListener("change", e => {
        e.target.checked ? selectedExamIds.add(id) : selectedExamIds.delete(id);
        applySelectionState();
      });
    }

    const actions = card.querySelector(".card-actions");
    if (actions && !actions.querySelector(".v4021-delete")) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "v4021-delete";
      del.textContent = "🗑 Delete";
      del.title = "Permanently delete this exam record";
      del.addEventListener("click", () => deleteOneExam(id));
      actions.appendChild(del);
    }
  });
  applySelectionState();
}

function applySelectionState() {
  const visible = visibleExamIds();
  document.querySelectorAll("#examRecords .exam-card").forEach(card => {
    const id = examIdFromCard(card);
    const checked = selectedExamIds.has(id);
    card.classList.toggle("v4021-selected", checked);
    const box = card.querySelector(".v4021-card-checkbox");
    if (box) box.checked = checked;
  });

  const selectAll = $("examDeleteSelectAllV4021");
  if (selectAll) {
    const selectedVisible = visible.filter(id => selectedExamIds.has(id)).length;
    selectAll.checked = visible.length > 0 && selectedVisible === visible.length;
    selectAll.indeterminate = selectedVisible > 0 && selectedVisible < visible.length;
  }
  const count = $("examDeleteSelectedCountV4021");
  if (count) count.textContent = `${selectedExamIds.size} selected`;
  const deleteBtn = $("examDeleteSelectedV4021");
  if (deleteBtn) deleteBtn.disabled = selectedExamIds.size === 0;
}

function scheduleEnhance() {
  if (enhanceQueued) return;
  enhanceQueued = true;
  requestAnimationFrame(() => {
    enhanceQueued = false;
    enhanceExamCards();
  });
}

function refreshExamRecords() {
  const refresh = $("recordsRefreshBtn");
  if (refresh) refresh.click();
  else location.reload();
}

async function fetchExamDetails(id) {
  const data = await api(`/api/admin/exams/${id}`);
  return {
    exam: data.exam || {},
    assignments: data.assignments || []
  };
}

function singleExamSummary(exam, assignments) {
  const preview = assignments.slice(0, 8).map(a =>
    `${esc(a.display_name || a.username || "Student")} — Class ${esc(a.class_number ?? "—")} (${esc(String(a.status || "assigned").replaceAll("_", " ").toUpperCase())})`
  ).join("<br>");
  const more = assignments.length > 8 ? `<br><b>+${assignments.length - 8} more student(s)</b>` : "";
  return `
    <div class="v4021-summary">
      <div class="v4021-summary-row"><span>Exam</span><b>${esc(exam.title || "Untitled Exam")}</b></div>
      <div class="v4021-summary-row"><span>Group</span><b>${esc(groupLabel(exam))}</b></div>
      <div class="v4021-summary-row"><span>Audience</span><b>${esc(audienceLabel(exam))}</b></div>
      <div class="v4021-summary-row"><span>Status</span><b>${esc(String(exam.status || "—").toUpperCase())}</b></div>
      <div class="v4021-summary-row"><span>Student assignments / results</span><b>${assignments.length}</b></div>
      ${assignments.length ? `<div class="v4021-student-preview"><span>Students</span><div>${preview}${more}</div></div>` : `<div class="v4021-student-preview"><span>Students</span><div>No student assignments</div></div>`}
    </div>`;
}

async function deleteOneExam(id) {
  try {
    const {exam, assignments} = await fetchExamDetails(id);
    const summary = singleExamSummary(exam, assignments);

    const first = await confirmModal({
      icon:"🗑️",
      title:"Delete this exam record?",
      message:"Are you sure? This permanently removes this exam and only its linked assignments, stored results, answers and generated exam questions.",
      summaryHtml: summary,
      warning:"This cannot be undone. Student accounts, profiles, normal learning progress and the built-in question bank will not be deleted.",
      confirmText:"Continue to Password",
      cancelText:"Keep Exam"
    });
    if (!first) return;

    while (true) {
      const secure = await secureDeleteModal({
        title:"Confirm Permanent Exam Delete",
        detailsHtml: summary,
        submitText:"Delete Exam Permanently"
      });
      if (!secure) return;

      const button = $("v4021DoDelete");
      if (button) button.disabled = true;
      try {
        const result = await api(`/api/admin/exams/${id}`, {
          method:"DELETE",
          body:JSON.stringify({
            adminPassword: secure.password,
            confirmation:"DELETE EXAM"
          })
        });
        selectedExamIds.delete(id);
        refreshExamRecords();
        await resultModal(result, "Exam Record Deleted");
        return;
      } catch (err) {
        // Re-open final security screen so a wrong password can be corrected
        // without repeating the first confirmation.
        openDeleteModal(`
          <div class="v4021-icon">🔐</div><h2>Delete Not Authorized</h2>
          <p>${esc(err?.status === 401 ? "The Admin password was incorrect or the session expired." : (err?.message || "Delete failed."))}</p>
          <div class="v4021-warning">Nothing has been deleted.</div>
          <div class="v4021-actions"><button id="v4021Retry" class="v4021-continue" type="button">Try Again</button><button id="v4021Stop" class="v4021-cancel" type="button">Cancel</button></div>`);
        const retry = await new Promise(resolve => {
          modalResolve = resolve;
          $("v4021Retry").onclick = () => closeDeleteModal(true);
          $("v4021Stop").onclick = () => closeDeleteModal(false);
        });
        if (!retry) return;
      }
    }
  } catch (err) {
    await confirmModal({icon:"⚠️", title:"Delete could not start", message:err?.message || "Unable to load the exam details.", confirmText:"OK", cancelText:"Close"});
  }
}

async function getCurrentExamList() {
  const data = await api("/api/admin/exams");
  return data.exams || [];
}

async function bulkDeleteSelected() {
  const ids = [...selectedExamIds].filter(id => Number.isInteger(id) && id > 0);
  if (!ids.length) return;

  try {
    const current = await getCurrentExamList();
    const byId = new Map(current.map(e => [Number(e.id), e]));
    const chosen = ids.map(id => byId.get(id)).filter(Boolean);
    const listHtml = `<div class="v4021-list">${chosen.length ? chosen.map(e => `#${e.id} — ${esc(e.title)} (${esc(groupLabel(e))})`).join("<br>") : ids.map(id => `Exam #${id}`).join("<br>")}</div>`;

    const first = await confirmModal({
      icon:"🗑️",
      title:`Delete ${ids.length} selected exam${ids.length === 1 ? "" : "s"}?`,
      message:"First confirmation: review the selected records carefully before continuing.",
      summaryHtml:listHtml,
      warning:"Only these selected exam records and their linked assignments/results/answers/questions will be removed.",
      confirmText:"Yes, Continue",
      cancelText:"Cancel"
    });
    if (!first) return;

    while (true) {
      const secure = await secureDeleteModal({
        title:"Second Confirmation — Bulk Delete",
        detailsHtml:listHtml,
        phrase:"DELETE SELECTED",
        phraseLabel:"Type exactly",
        submitText:`Delete ${ids.length} Selected Exam${ids.length === 1 ? "" : "s"}`
      });
      if (!secure) return;

      try {
        const result = await api("/api/admin/exams", {
          method:"DELETE",
          body:JSON.stringify({
            examIds: ids,
            adminPassword: secure.password,
            confirmation:"DELETE SELECTED EXAMS"
          })
        });
        ids.forEach(id => selectedExamIds.delete(id));
        refreshExamRecords();
        await resultModal(result, "Selected Exam Records Deleted");
        return;
      } catch (err) {
        openDeleteModal(`
          <div class="v4021-icon">🔐</div><h2>Bulk Delete Not Authorized</h2>
          <p>${esc(err?.status === 401 ? "The Admin password was incorrect or the session expired." : (err?.message || "Bulk delete failed."))}</p>
          <div class="v4021-warning">Nothing has been deleted by this failed request.</div>
          <div class="v4021-actions"><button id="v4021Retry" class="v4021-continue" type="button">Try Again</button><button id="v4021Stop" class="v4021-cancel" type="button">Cancel</button></div>`);
        const retry = await new Promise(resolve => {
          modalResolve = resolve;
          $("v4021Retry").onclick = () => closeDeleteModal(true);
          $("v4021Stop").onclick = () => closeDeleteModal(false);
        });
        if (!retry) return;
      }
    }
  } catch (err) {
    await confirmModal({icon:"⚠️",title:"Bulk delete could not start",message:err?.message || "Unable to load current exam records.",confirmText:"OK",cancelText:"Close"});
  }
}

async function masterDeleteAll() {
  try {
    const current = await getCurrentExamList();
    const visibleCount = current.length;
    const preview = current.slice(0, 12);
    const listHtml = `<div class="v4021-list">${preview.length ? preview.map(e => `#${e.id} — ${esc(e.title)} (${esc(groupLabel(e))})`).join("<br>") : "No current exam records in the first page."}${visibleCount > preview.length ? `<br>…and ${visibleCount - preview.length} more shown by the current API list.` : ""}</div>`;

    const first = await confirmModal({
      icon:"⚠️",
      title:"MASTER DELETE — All Stored Exam Records",
      message:"First confirmation: this asks the Worker to delete every exam record currently stored in the exam tables, not only the visible/filtered cards.",
      summaryHtml:listHtml,
      warning:"This is permanent. Student accounts, profiles, course progress and the built-in question bank remain untouched.",
      confirmText:"Continue to Final Check",
      cancelText:"Cancel Master Delete"
    });
    if (!first) return;

    while (true) {
      const secure = await secureDeleteModal({
        title:"FINAL MASTER DELETE CONFIRMATION",
        detailsHtml:`<div class="v4021-warning">Type the exact phrase and enter the Admin password. This protection is intentionally strict.</div>`,
        phrase:"DELETE ALL EXAMS",
        phraseLabel:"Type exactly",
        submitText:"Permanently Delete All Exam Records"
      });
      if (!secure) return;

      try {
        const result = await api("/api/admin/exams", {
          method:"DELETE",
          body:JSON.stringify({
            deleteAll:true,
            adminPassword:secure.password,
            confirmation:"DELETE ALL EXAMS"
          })
        });
        selectedExamIds.clear();
        refreshExamRecords();
        await resultModal(result, "Master Delete Completed");
        return;
      } catch (err) {
        openDeleteModal(`
          <div class="v4021-icon">🔐</div><h2>Master Delete Not Authorized</h2>
          <p>${esc(err?.status === 401 ? "The Admin password was incorrect or the session expired." : (err?.message || "Master delete failed."))}</p>
          <div class="v4021-warning">Nothing has been deleted by this failed request.</div>
          <div class="v4021-actions"><button id="v4021Retry" class="v4021-continue" type="button">Try Again</button><button id="v4021Stop" class="v4021-cancel" type="button">Cancel</button></div>`);
        const retry = await new Promise(resolve => {
          modalResolve = resolve;
          $("v4021Retry").onclick = () => closeDeleteModal(true);
          $("v4021Stop").onclick = () => closeDeleteModal(false);
        });
        if (!retry) return;
      }
    }
  } catch (err) {
    await confirmModal({icon:"⚠️",title:"Master delete could not start",message:err?.message || "Unable to load current exam records.",confirmText:"OK",cancelText:"Close"});
  }
}

function bootDeleteUpgrade() {
  injectStyles();
  ensureModalRoot();
  ensureBulkToolbar();
  scheduleEnhance();

  const records = $("examRecords");
  if (records) {
    const observer = new MutationObserver(() => scheduleEnhance());
    observer.observe(records, {childList:true, subtree:true});
  }

  $("examSearch")?.addEventListener("input", () => setTimeout(scheduleEnhance, 0));
  $("examStatusFilter")?.addEventListener("change", () => setTimeout(scheduleEnhance, 0));
  $("recordsRefreshBtn")?.addEventListener("click", () => setTimeout(scheduleEnhance, 50));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootDeleteUpgrade, {once:true});
} else {
  bootDeleteUpgrade();
}
})();
