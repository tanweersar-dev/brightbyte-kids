(() => {
"use strict";

/* ============================================================
   BrightByte Kids — V40.24
   CLASS 4–6 ADVANCED NAVIGATION STABILITY FIX
   ------------------------------------------------------------
   IMPORTANT
   - This file REPLACES the CONTENT of advanced-learning-nav-v40-23.js
     so student-profile.html does not need to be edited again.
   - Class 1–3 Foundation routing/content is not changed.
   - Class 4–6 Home remains advanced-universe.html.
   - Fixes the bug where clicking Games / Tests / Battle / GK World /
     Speak / Health / Safety returned to the originally-opened tab.
   - Removes the old "keep forcing the first requested view" behavior.
   - No Worker, D1, exams, login/session or progress schema changes.
   ============================================================ */

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const ADVANCED_HOME = "advanced-universe.html";
const PROFILE_PAGE = "student-profile.html";
const SESSION_MARKER = "brightbyte_v4024_advanced_home";

const DETAIL_VIEWS = new Set([
  "lessons",
  "labs",
  "practice",
  "tests",
  "battle",
  "gk",
  "speaking",
  "healthy",
  "citizen",
  "portfolio",
  "rewards",
  "profile"
]);

const LABELS = {
  dashboard: "🏠 Home",
  lessons: "📗 Learn",
  labs: "🧪 Labs",
  practice: "🎮 Games",
  tests: "📝 Tests",
  battle: "⚔️ Battle",
  gk: "🌍 GK World",
  speaking: "🗣️ Speak",
  healthy: "🌱 Health",
  citizen: "🛡️ Safety",
  portfolio: "🎒 My Work"
};

const isAdvancedPage =
  /(?:^|\/)advanced-universe\.html$/i.test(location.pathname);

const isProfilePage =
  /(?:^|\/)student-profile\.html$/i.test(location.pathname);

let verifiedClass = 0;
let initialRouteDone = false;
let userNavigated = false;
let detailUiTimer = 0;

function token(){
  return localStorage.getItem(TOKEN_KEY) || "";
}

function isClass46(value){
  const n = Number(value || 0);
  return n >= 4 && n <= 6;
}

function params(){
  return new URLSearchParams(location.search);
}

function requestedView(){
  return String(params().get("view") || "").trim().toLowerCase();
}

function requestedFrom(){
  return String(params().get("from") || "").trim().toLowerCase();
}

function detailHref(view){
  return `${PROFILE_PAGE}?view=${encodeURIComponent(view)}&from=advanced`;
}

function markAdvancedSession(){
  try{
    sessionStorage.setItem(SESSION_MARKER, "1");
  }catch{}
}

function clearAdvancedSession(){
  try{
    sessionStorage.removeItem(SESSION_MARKER);
  }catch{}
}

function advancedSessionActive(){
  try{
    return sessionStorage.getItem(SESSION_MARKER) === "1";
  }catch{
    return false;
  }
}

async function getProfile(){
  const t = token();
  if(!t) return null;

  try{
    const r = await fetch(API + "/api/auth/me", {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store"
    });

    const d = await r.json().catch(() => ({}));

    if(!r.ok || d.role !== "student" || !d.profile){
      return null;
    }

    verifiedClass = Number(d.profile.class_number || 0);
    return d.profile;
  }catch{
    return null;
  }
}

function injectStyles(){
  if(document.getElementById("advancedNavV4024Style")) return;

  const style = document.createElement("style");
  style.id = "advancedNavV4024Style";
  style.textContent = `
    /* ========================================================
       CLASS 4–6 HOME LEARNING NAVIGATION
       ======================================================== */
    .advanced-learning-nav-v4024{
      width:100%;
      margin:10px 0 7px;
      padding:7px;
      display:flex;
      align-items:center;
      justify-content:flex-start;
      gap:7px;
      flex-wrap:wrap;
      border:1px solid rgba(216,221,239,.94);
      border-radius:18px;
      background:
        linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,249,255,.94));
      box-shadow:
        0 12px 28px rgba(45,52,112,.08),
        inset 0 1px 0 #fff;
      backdrop-filter:blur(14px);
    }

    .advanced-learning-nav-v4024 a{
      min-height:40px;
      padding:9px 13px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:5px;
      border:1px solid transparent;
      border-radius:12px;
      text-decoration:none;
      white-space:nowrap;
      font-size:10px;
      line-height:1;
      font-weight:950;
      color:#4a5278;
      box-shadow:0 4px 10px rgba(46,53,108,.045);
      transition:
        transform .17s ease,
        box-shadow .17s ease,
        border-color .17s ease,
        filter .17s ease;
    }

    .advanced-learning-nav-v4024 a:hover,
    .advanced-learning-nav-v4024 a:focus-visible{
      transform:translateY(-2px);
      box-shadow:0 9px 18px rgba(50,56,120,.11);
      outline:none;
      filter:brightness(1.015);
    }

    .advanced-learning-nav-v4024 [data-adv-view="home"]{
      background:linear-gradient(135deg,#e8f4ff,#f8fcff);
      color:#2770bf;
      border-color:#d6e9fb;
    }

    .advanced-learning-nav-v4024 [data-adv-view="lessons"]{
      background:linear-gradient(135deg,#eafbef,#f9fff9);
      color:#2b8559;
      border-color:#d4efdb;
    }

    .advanced-learning-nav-v4024 [data-adv-view="labs"]{
      background:linear-gradient(135deg,#e8fbff,#f8feff);
      color:#167f99;
      border-color:#cfedf3;
    }

    .advanced-learning-nav-v4024 [data-adv-view="practice"]{
      background:linear-gradient(135deg,#f1edff,#fcfaff);
      color:#674cb7;
      border-color:#e2daf9;
    }

    .advanced-learning-nav-v4024 [data-adv-view="tests"]{
      background:linear-gradient(135deg,#fff0e5,#fff9f5);
      color:#ac612d;
      border-color:#f2ddcb;
    }

    .advanced-learning-nav-v4024 [data-adv-view="battle"]{
      background:linear-gradient(135deg,#edf1ff,#fafbff);
      color:#5065b7;
      border-color:#d9e0f7;
    }

    .advanced-learning-nav-v4024 [data-adv-view="gk"]{
      background:linear-gradient(135deg,#ebf8ff,#fbfeff);
      color:#237aa7;
      border-color:#d5ebf7;
    }

    .advanced-learning-nav-v4024 [data-adv-view="speaking"]{
      background:linear-gradient(135deg,#fff0da,#fff9ed);
      color:#96601c;
      border-color:#f1dcb9;
    }

    .advanced-learning-nav-v4024 [data-adv-view="healthy"]{
      background:linear-gradient(135deg,#e8faed,#f7fff9);
      color:#247f56;
      border-color:#d1ecd7;
    }

    .advanced-learning-nav-v4024 [data-adv-view="citizen"]{
      background:linear-gradient(135deg,#e8f7ff,#f6fcff);
      color:#24789c;
      border-color:#d2eaf5;
    }

    .advanced-learning-nav-v4024 [aria-current="page"]{
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#5f61ed,#28c9c0)!important;
      box-shadow:
        0 9px 20px rgba(81,76,190,.22),
        0 0 0 3px rgba(108,92,255,.08)!important;
    }

    #studentChip.v4024-profile-chip{
      cursor:pointer!important;
    }

    /* ========================================================
       CLASS 4–6 DETAIL PAGE POLISH
       ======================================================== */
    body.sp-advanced-v4024 .top .bar{
      border-radius:22px!important;
    }

    body.sp-advanced-v4024 .top .brand b::after{
      content:"";
    }

    body.sp-advanced-v4024 .top .nav [data-view="dashboard"]{
      display:none!important;
    }

    #advancedHomeBackV4024{
      order:-1000!important;
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#5f61ed,#28c9c0)!important;
      box-shadow:
        0 8px 18px rgba(81,76,190,.20),
        0 0 0 3px rgba(108,92,255,.07)!important;
    }

    body.sp-advanced-v4024 .tabs{
      width:100%!important;
      margin:12px 0 10px!important;
      padding:7px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:flex-start!important;
      gap:7px!important;
      flex-wrap:wrap!important;
      border:1px solid rgba(216,221,239,.92)!important;
      border-radius:18px!important;
      background:
        linear-gradient(135deg,rgba(255,255,255,.98),rgba(247,249,255,.94))!important;
      box-shadow:
        0 12px 28px rgba(45,52,112,.08),
        inset 0 1px 0 #fff!important;
    }

    body.sp-advanced-v4024 .tabs button,
    body.sp-advanced-v4024 .tabs a{
      min-height:40px!important;
      padding:9px 13px!important;
      display:inline-flex!important;
      align-items:center!important;
      justify-content:center!important;
      border-radius:12px!important;
      font-size:10px!important;
      line-height:1!important;
      font-weight:950!important;
      white-space:nowrap!important;
      transition:
        transform .17s ease,
        box-shadow .17s ease,
        filter .17s ease!important;
    }

    body.sp-advanced-v4024 .tabs button:hover,
    body.sp-advanced-v4024 .tabs a:hover{
      transform:translateY(-2px)!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="dashboard"]{
      background:linear-gradient(135deg,#e8f4ff,#f8fcff)!important;
      color:#2770bf!important;
      border-color:#d6e9fb!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="lessons"]{
      background:linear-gradient(135deg,#eafbef,#f9fff9)!important;
      color:#2b8559!important;
      border-color:#d4efdb!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="labs"]{
      background:linear-gradient(135deg,#e8fbff,#f8feff)!important;
      color:#167f99!important;
      border-color:#cfedf3!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="practice"]{
      background:linear-gradient(135deg,#f1edff,#fcfaff)!important;
      color:#674cb7!important;
      border-color:#e2daf9!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="tests"]{
      background:linear-gradient(135deg,#fff0e5,#fff9f5)!important;
      color:#ac612d!important;
      border-color:#f2ddcb!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="battle"]{
      background:linear-gradient(135deg,#edf1ff,#fafbff)!important;
      color:#5065b7!important;
      border-color:#d9e0f7!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="gk"]{
      background:linear-gradient(135deg,#ebf8ff,#fbfeff)!important;
      color:#237aa7!important;
      border-color:#d5ebf7!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="speaking"]{
      background:linear-gradient(135deg,#fff0da,#fff9ed)!important;
      color:#96601c!important;
      border-color:#f1dcb9!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="healthy"]{
      background:linear-gradient(135deg,#e8faed,#f7fff9)!important;
      color:#247f56!important;
      border-color:#d1ecd7!important;
    }

    body.sp-advanced-v4024 .tabs [data-view="citizen"]{
      background:linear-gradient(135deg,#e8f7ff,#f6fcff)!important;
      color:#24789c!important;
      border-color:#d2eaf5!important;
    }

    body.sp-advanced-v4024 .tabs button.active,
    body.sp-advanced-v4024 .tabs a.active{
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#5f61ed,#28c9c0)!important;
      box-shadow:
        0 9px 21px rgba(76,79,192,.23),
        0 0 0 3px rgba(108,92,255,.08)!important;
    }

    html.v4024-route-check body{
      visibility:hidden!important;
    }

    @media(max-width:900px){
      .advanced-learning-nav-v4024,
      body.sp-advanced-v4024 .tabs{
        justify-content:center!important;
      }
    }

    @media(max-width:560px){
      .advanced-learning-nav-v4024{
        gap:5px;
        padding:6px;
        border-radius:15px;
      }

      .advanced-learning-nav-v4024 a{
        min-height:38px;
        padding:8px 10px;
        font-size:9px;
        border-radius:10px;
      }

      #advancedHomeBackV4024{
        width:100%!important;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .advanced-learning-nav-v4024 a,
      body.sp-advanced-v4024 .tabs button,
      body.sp-advanced-v4024 .tabs a{
        transition:none!important;
      }
    }
  `;

  document.head.appendChild(style);
}

function installHomeLearningNav(){
  if(!isAdvancedPage) return false;

  const old = document.getElementById("advancedLearningNavV4023");
  if(old) old.remove();

  if(document.getElementById("advancedLearningNavV4024")) return true;

  const mission = document.querySelector(".mission-strip");
  if(!mission) return false;

  const nav = document.createElement("nav");
  nav.id = "advancedLearningNavV4024";
  nav.className = "advanced-learning-nav-v4024";
  nav.setAttribute("aria-label", "Class 4–6 learning navigation");

  nav.innerHTML = `
    <a href="${ADVANCED_HOME}" data-adv-view="home" aria-current="page">🏠 Home</a>
    <a href="${detailHref("lessons")}" data-adv-view="lessons">📗 Learn</a>
    <a href="${detailHref("labs")}" data-adv-view="labs">🧪 Labs</a>
    <a href="${detailHref("practice")}" data-adv-view="practice">🎮 Games</a>
    <a href="${detailHref("tests")}" data-adv-view="tests">📝 Tests</a>
    <a href="${detailHref("battle")}" data-adv-view="battle">⚔️ Battle</a>
    <a href="${detailHref("gk")}" data-adv-view="gk">🌍 GK World</a>
    <a href="${detailHref("speaking")}" data-adv-view="speaking">🗣️ Speak</a>
    <a href="${detailHref("healthy")}" data-adv-view="healthy">🌱 Health</a>
    <a href="${detailHref("citizen")}" data-adv-view="citizen">🛡️ Safety</a>
  `;

  mission.insertAdjacentElement("afterend", nav);
  return true;
}

function prepareStudentChip(){
  if(!isAdvancedPage) return false;

  const chip = document.getElementById("studentChip");
  if(!chip) return false;

  chip.classList.add("v4024-profile-chip");
  chip.setAttribute("role", "button");
  chip.setAttribute("tabindex", "0");
  chip.setAttribute("title", "Open my Class 4–6 profile");
  chip.setAttribute("aria-label", "Open my Class 4–6 profile");
  return true;
}

function openAdvancedProfile(){
  location.href = detailHref("profile");
}

/* Beat the old V25.9 bubbling handler safely in capture phase. */
function advancedHomeCaptureClick(event){
  if(!isAdvancedPage) return;
  if(verifiedClass && !isClass46(verifiedClass)) return;

  const chip = event.target.closest?.("#studentChip");
  if(!chip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  openAdvancedProfile();
}

function advancedHomeCaptureKey(event){
  if(!isAdvancedPage) return;
  if(verifiedClass && !isClass46(verifiedClass)) return;
  if(event.key !== "Enter" && event.key !== " ") return;

  const chip = event.target.closest?.("#studentChip");
  if(!chip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  openAdvancedProfile();
}

function writeDetailUrl(view, mode="replace"){
  if(!DETAIL_VIEWS.has(view)) return;

  const u = new URL(location.href);
  u.searchParams.set("view", view);
  u.searchParams.set("from", "advanced");

  const state = { advancedView: view };

  if(mode === "push"){
    history.pushState(state, "", u.pathname + u.search + u.hash);
  }else{
    history.replaceState(state, "", u.pathname + u.search + u.hash);
  }
}

function currentVisibleView(){
  const visible = document.querySelector(".view.show[id^='view-']");
  return visible ? visible.id.replace(/^view-/, "") : "";
}

function callShowView(view){
  if(!DETAIL_VIEWS.has(view)) return false;

  const target = document.getElementById("view-" + view);
  if(!target) return false;

  if(typeof window.showView === "function"){
    window.showView(view);
    return true;
  }

  /* Fallback only if the old global function is unavailable. */
  document.querySelectorAll(".view").forEach(el => {
    el.classList.toggle("show", el.id === "view-" + view);
  });

  document.querySelectorAll("[data-view]").forEach(el => {
    el.classList.toggle("active", String(el.dataset.view || "") === view);
  });

  window.scrollTo({top:0, behavior:"smooth"});
  return true;
}

function addAdvancedHomeButton(){
  const topNav = document.querySelector(".top .nav");
  if(!topNav) return false;

  const old = document.getElementById("advancedHomeBackV4023");
  if(old) old.remove();

  if(!document.getElementById("advancedHomeBackV4024")){
    const a = document.createElement("a");
    a.id = "advancedHomeBackV4024";
    a.href = ADVANCED_HOME;
    a.textContent = "← Advanced Home";
    a.title = "Back to Future Skills Universe";
    topNav.prepend(a);
  }

  return true;
}

function polishDetailUi(){
  if(!isProfilePage || !isClass46(verifiedClass)) return false;

  document.body?.classList.add("sp-advanced-v4024");
  document.body?.classList.remove("sp-advanced-detail-v4023");

  addAdvancedHomeButton();

  const brandTitle = document.querySelector(".top .brand b");
  const brandSmall = document.querySelector(".top .brand small");

  if(brandTitle) brandTitle.textContent = "Future Skills Learning Desk";
  if(brandSmall) brandSmall.textContent =
    "TANNU SIR'S KIDS DIGITAL ACADEMY • CLASS 4–6";

  const tabs = document.querySelector(".tabs");
  if(tabs){
    Object.entries(LABELS).forEach(([view,label]) => {
      tabs.querySelectorAll(`[data-view="${view}"]`).forEach(el => {
        el.textContent = label;
      });
    });
  }

  return true;
}

/*
  IMPORTANT FIX:
  V40.23 kept a MutationObserver that repeatedly called showView()
  with the ORIGINAL first route (for example "labs"). Therefore
  clicking Games could be immediately forced back to Labs.

  V40.24 never repeatedly forces the initial route.
  Initial routing runs only until the requested view has opened once.
*/
function openInitialViewOnce(view, attempt=0){
  if(initialRouteDone || userNavigated) return;
  if(!DETAIL_VIEWS.has(view)) return;

  polishDetailUi();

  const ok = callShowView(view);

  if(ok){
    writeDetailUrl(view, "replace");

    if(currentVisibleView() === view){
      initialRouteDone = true;
      return;
    }
  }

  if(attempt < 25){
    setTimeout(() => openInitialViewOnce(view, attempt + 1), 100);
  }
}

function handleDetailClick(event){
  if(!isProfilePage || !isClass46(verifiedClass)) return;

  const control = event.target.closest?.("[data-view]");
  if(!control) return;

  const view = String(control.dataset.view || "").trim().toLowerCase();
  if(!view) return;

  userNavigated = true;
  initialRouteDone = true;

  if(view === "dashboard"){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    location.href = ADVANCED_HOME;
    return;
  }

  if(!DETAIL_VIEWS.has(view)) return;

  /*
    Own the navigation completely. This avoids fighting the legacy
    bubbling listener and guarantees every button changes section.
  */
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  callShowView(view);
  writeDetailUrl(view, "push");
  polishDetailUi();
}

function handlePopState(){
  if(!isProfilePage || !isClass46(verifiedClass)) return;

  const view = requestedView();

  if(view === "dashboard" || !DETAIL_VIEWS.has(view)){
    location.href = ADVANCED_HOME;
    return;
  }

  userNavigated = true;
  initialRouteDone = true;
  callShowView(view);
  polishDetailUi();
}

/*
  UI polish may be injected by older scripts slightly later.
  These retries ONLY style/rename buttons. They NEVER change the
  active learning view, so switching tabs remains stable.
*/
function scheduleDetailPolish(){
  clearTimeout(detailUiTimer);

  [0,120,260,500,900,1500,2400,3600].forEach(ms => {
    setTimeout(polishDetailUi, ms);
  });
}

async function handleProfilePage(){
  if(!isProfilePage) return;

  const fromAdvanced = requestedFrom() === "advanced";
  const view = requestedView();
  const explicitDetail = DETAIL_VIEWS.has(view);

  if(fromAdvanced || advancedSessionActive()){
    document.documentElement.classList.add("v4024-route-check");
  }

  const profile = await getProfile();

  if(!profile){
    document.documentElement.classList.remove("v4024-route-check");
    return;
  }

  /* Never interfere with Class 1–3 Foundation students. */
  if(!isClass46(profile.class_number)){
    clearAdvancedSession();
    document.documentElement.classList.remove("v4024-route-check");
    return;
  }

  markAdvancedSession();

  /*
    Class 4–6 generic profile/dashboard is not Home.
    Only an explicit ?view=...&from=advanced detail route stays here.
  */
  if(!fromAdvanced || !explicitDetail || view === "dashboard"){
    location.replace(ADVANCED_HOME);
    return;
  }

  document.documentElement.classList.remove("v4024-route-check");

  const begin = () => {
    polishDetailUi();
    scheduleDetailPolish();
    openInitialViewOnce(view);

    document.addEventListener("click", handleDetailClick, true);
    window.addEventListener("popstate", handlePopState);
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", begin, {once:true});
  }else{
    begin();
  }
}

async function handleAdvancedHome(){
  if(!isAdvancedPage) return;

  markAdvancedSession();

  document.addEventListener("click", advancedHomeCaptureClick, true);
  document.addEventListener("keydown", advancedHomeCaptureKey, true);

  const profile = await getProfile();

  if(!profile || !isClass46(profile.class_number)){
    clearAdvancedSession();
    return;
  }

  installHomeLearningNav();
  prepareStudentChip();

  [100,250,500,900,1500,2500].forEach(ms => {
    setTimeout(() => {
      installHomeLearningNav();
      prepareStudentChip();
    }, ms);
  });
}

injectStyles();

if(isProfilePage){
  handleProfilePage();

  /* Safety: never leave the page hidden because of a network problem. */
  setTimeout(() => {
    document.documentElement.classList.remove("v4024-route-check");
  }, 3500);
}

if(isAdvancedPage){
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", handleAdvancedHome, {once:true});
  }else{
    handleAdvancedHome();
  }

  window.addEventListener("pageshow", () => {
    markAdvancedSession();
    installHomeLearningNav();
    prepareStudentChip();
  });
}

})();
