(() => {
"use strict";

/* ============================================================
   BrightByte Kids — V40.23
   CLASS 4–6 ADVANCED UNIVERSE • FOUNDATION-STYLE NAVIGATION
   ------------------------------------------------------------
   FINAL DESIGN RULES
   - Class 4–6 Home stays advanced-universe.html.
   - The Advanced home keeps all existing Advanced worlds/content.
   - Restore the familiar learning navigation:
     Home • Learn • Labs • Games • Tests • Battle • GK World
     • Speak • Health • Safety
   - Detailed learning views reuse the EXISTING student-profile.html
     content, exactly like Class 1–3 Foundation routing does.
   - Plain student-profile.html is NOT the Class 4–6 home.
   - Explicit detail routes such as:
       student-profile.html?view=lessons&from=advanced
     are allowed for Class 4–6.
   - Home/Dashboard from a Class 4–6 detail view returns to the
     Advanced Universe.
   - Class 1–3 Foundation behavior stays unchanged.
   - Worker, D1, exams, login/session and learning data are untouched.
   ============================================================ */

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const ADVANCED_HOME = "advanced-universe.html";
const PROFILE_PAGE = "student-profile.html";
const SESSION_MARKER = "brightbyte_v4023_advanced_home";

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

const isAdvancedPage =
  /(?:^|\/)advanced-universe\.html$/i.test(location.pathname);

const isProfilePage =
  /(?:^|\/)student-profile\.html$/i.test(location.pathname);

let verifiedClass = 0;
let routeCheckFinished = false;
let toastTimer = 0;
let detailObserver = null;

function token(){
  return localStorage.getItem(TOKEN_KEY) || "";
}

function isClass46(value){
  const n = Number(value || 0);
  return n >= 4 && n <= 6;
}

function currentParams(){
  return new URLSearchParams(location.search);
}

function requestedView(){
  return String(currentParams().get("view") || "").trim().toLowerCase();
}

function requestedFrom(){
  return String(currentParams().get("from") || "").trim().toLowerCase();
}

function advancedDetailHref(view){
  return `${PROFILE_PAGE}?view=${encodeURIComponent(view)}&from=advanced`;
}

function markAdvancedSession(){
  try{
    sessionStorage.setItem(SESSION_MARKER,"1");
  }catch{}
}

function clearAdvancedSession(){
  try{
    sessionStorage.removeItem(SESSION_MARKER);
  }catch{}
}

function hasAdvancedSession(){
  try{
    return sessionStorage.getItem(SESSION_MARKER) === "1";
  }catch{
    return false;
  }
}

function cameFromAdvancedExperience(){
  const ref = String(document.referrer || "").toLowerCase();

  return (
    hasAdvancedSession() ||
    requestedFrom() === "advanced" ||
    ref.includes("advanced-universe.html") ||
    ref.includes("hardware-explorer.html") ||
    ref.includes("junior-technician-lab.html") ||
    ref.includes("advanced-battle.html") ||
    ref.includes("student-exams.html")
  );
}

async function getCurrentProfile(){
  const t = token();
  if(!t) return null;

  try{
    const response = await fetch(API + "/api/auth/me",{
      headers:{Authorization:`Bearer ${t}`},
      cache:"no-store"
    });

    const data = await response.json().catch(()=>({}));

    if(!response.ok || data.role !== "student" || !data.profile){
      return null;
    }

    verifiedClass = Number(data.profile.class_number || 0);
    return data.profile;
  }catch{
    return null;
  }
}

function injectStyles(){
  if(document.getElementById("advancedFoundationNavV4023Style")) return;

  const style = document.createElement("style");
  style.id = "advancedFoundationNavV4023Style";
  style.textContent = `
    /* ----------------------------------------------------------
       ADVANCED HOME — Foundation-style learning navigation
       ---------------------------------------------------------- */
    .advanced-learning-nav-v4023{
      width:100%;
      margin:10px 0 6px;
      padding:7px;
      display:flex;
      align-items:center;
      gap:7px;
      flex-wrap:wrap;
      border:1px solid rgba(216,221,239,.94);
      border-radius:18px;
      background:rgba(255,255,255,.95);
      box-shadow:
        0 12px 28px rgba(45,52,112,.08),
        inset 0 1px 0 #fff;
      backdrop-filter:blur(14px);
    }

    .advanced-learning-nav-v4023 a{
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
      background:#fff;
      box-shadow:0 4px 10px rgba(46,53,108,.045);
      transition:
        transform .17s ease,
        box-shadow .17s ease,
        border-color .17s ease,
        filter .17s ease;
    }

    .advanced-learning-nav-v4023 a:hover,
    .advanced-learning-nav-v4023 a:focus-visible{
      transform:translateY(-2px);
      box-shadow:0 9px 18px rgba(50,56,120,.11);
      outline:none;
    }

    .advanced-learning-nav-v4023 [data-adv-view="home"]{
      background:linear-gradient(135deg,#eef6ff,#fbfdff);
      color:#2c70bd;
      border-color:#dbeafb;
    }

    .advanced-learning-nav-v4023 [data-adv-view="lessons"]{
      background:linear-gradient(135deg,#edfcef,#fbfffb);
      color:#2d865a;
      border-color:#d7efdc;
    }

    .advanced-learning-nav-v4023 [data-adv-view="labs"]{
      background:linear-gradient(135deg,#eafcff,#f8feff);
      color:#19819a;
      border-color:#d2eff4;
    }

    .advanced-learning-nav-v4023 [data-adv-view="practice"]{
      background:linear-gradient(135deg,#f3efff,#fcfaff);
      color:#694db7;
      border-color:#e6dcfa;
    }

    .advanced-learning-nav-v4023 [data-adv-view="tests"]{
      background:linear-gradient(135deg,#fff2e8,#fffaf6);
      color:#ad632f;
      border-color:#f4dfcf;
    }

    .advanced-learning-nav-v4023 [data-adv-view="battle"]{
      background:linear-gradient(135deg,#eef2ff,#fafbff);
      color:#5166b9;
      border-color:#dce2f7;
    }

    .advanced-learning-nav-v4023 [data-adv-view="gk"]{
      background:linear-gradient(135deg,#edf9ff,#fbfeff);
      color:#247aa8;
      border-color:#d8edf8;
    }

    .advanced-learning-nav-v4023 [data-adv-view="speaking"]{
      background:linear-gradient(135deg,#fff1dc,#fff8eb);
      color:#97601c;
      border-color:#f3dfbd;
    }

    .advanced-learning-nav-v4023 [data-adv-view="healthy"]{
      background:linear-gradient(135deg,#eafbef,#f5fff7);
      color:#258058;
      border-color:#d4efd9;
    }

    .advanced-learning-nav-v4023 [data-adv-view="citizen"]{
      background:linear-gradient(135deg,#e9f8ff,#f3fbff);
      color:#26789c;
      border-color:#d5edf7;
    }

    .advanced-learning-nav-v4023 [aria-current="page"]{
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#6557ef,#29c7bd)!important;
      box-shadow:
        0 9px 20px rgba(81,76,190,.22),
        0 0 0 3px rgba(108,92,255,.08)!important;
    }

    /* Existing V25.9 makes this chip a profile link.
       V40.23 keeps the behavior, but sends it to the explicit
       advanced profile detail route rather than plain legacy home. */
    #studentChip.v4023-advanced-profile-chip{
      cursor:pointer!important;
      transition:transform .18s ease,box-shadow .18s ease,filter .18s ease!important;
    }

    #studentChip.v4023-advanced-profile-chip:hover,
    #studentChip.v4023-advanced-profile-chip:focus-visible{
      transform:translateY(-1px)!important;
      filter:brightness(1.05)!important;
      outline:none!important;
    }

    /* ----------------------------------------------------------
       CLASS 4–6 DETAIL PAGE — same navigation pattern as Foundation
       ---------------------------------------------------------- */
    #advancedHomeBackV4023{
      order:-1000!important;
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#6557ef,#28c9c0)!important;
      box-shadow:
        0 8px 18px rgba(81,76,190,.20),
        0 0 0 3px rgba(108,92,255,.07)!important;
    }

    #advancedHomeBackV4023:hover,
    #advancedHomeBackV4023:focus-visible{
      transform:translateY(-2px)!important;
      filter:brightness(1.04)!important;
    }

    body.sp-advanced-detail-v4023 .tabs{
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
      background:rgba(255,255,255,.96)!important;
      box-shadow:
        0 12px 28px rgba(45,52,112,.08),
        inset 0 1px 0 #fff!important;
    }

    body.sp-advanced-detail-v4023 .tabs button,
    body.sp-advanced-detail-v4023 .tabs a{
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
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="dashboard"]{
      background:linear-gradient(135deg,#eef6ff,#fbfdff)!important;
      color:#2c70bd!important;
      border-color:#dbeafb!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="lessons"]{
      background:linear-gradient(135deg,#edfcef,#fbfffb)!important;
      color:#2d865a!important;
      border-color:#d7efdc!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="labs"]{
      background:linear-gradient(135deg,#eafcff,#f8feff)!important;
      color:#19819a!important;
      border-color:#d2eff4!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="practice"]{
      background:linear-gradient(135deg,#f3efff,#fcfaff)!important;
      color:#694db7!important;
      border-color:#e6dcfa!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="tests"]{
      background:linear-gradient(135deg,#fff2e8,#fffaf6)!important;
      color:#ad632f!important;
      border-color:#f4dfcf!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="battle"]{
      background:linear-gradient(135deg,#eef2ff,#fafbff)!important;
      color:#5166b9!important;
      border-color:#dce2f7!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="gk"]{
      background:linear-gradient(135deg,#edf9ff,#fbfeff)!important;
      color:#247aa8!important;
      border-color:#d8edf8!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="speaking"]{
      background:linear-gradient(135deg,#fff1dc,#fff8eb)!important;
      color:#97601c!important;
      border-color:#f3dfbd!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="healthy"]{
      background:linear-gradient(135deg,#eafbef,#f5fff7)!important;
      color:#258058!important;
      border-color:#d4efd9!important;
    }

    body.sp-advanced-detail-v4023 .tabs [data-view="citizen"]{
      background:linear-gradient(135deg,#e9f8ff,#f3fbff)!important;
      color:#26789c!important;
      border-color:#d5edf7!important;
    }

    body.sp-advanced-detail-v4023 .tabs button.active,
    body.sp-advanced-detail-v4023 .tabs a.active{
      color:#fff!important;
      border-color:transparent!important;
      background:linear-gradient(135deg,#5f61ed,#28c9c0)!important;
      box-shadow:
        0 9px 21px rgba(76,79,192,.23),
        0 0 0 3px rgba(108,92,255,.08)!important;
    }

    /* Hide old page only while deciding whether an Advanced student
       should be redirected home or allowed into an explicit detail view. */
    html.v4023-advanced-route-check body{
      visibility:hidden!important;
    }

    @media(max-width:900px){
      .advanced-learning-nav-v4023{
        justify-content:center;
      }
    }

    @media(max-width:560px){
      .advanced-learning-nav-v4023{
        padding:6px;
        gap:5px;
        border-radius:15px;
      }

      .advanced-learning-nav-v4023 a{
        min-height:38px;
        padding:8px 10px;
        font-size:9px;
        border-radius:10px;
      }

      #advancedHomeBackV4023{
        width:100%!important;
      }

      body.sp-advanced-detail-v4023 .tabs{
        justify-content:center!important;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .advanced-learning-nav-v4023 a,
      #studentChip.v4023-advanced-profile-chip{
        transition:none!important;
      }
    }
  `;

  document.head.appendChild(style);
}

function installAdvancedHomeNavigation(){
  if(!isAdvancedPage) return false;
  if(document.getElementById("advancedLearningNavV4023")) return true;

  const missionStrip = document.querySelector(".mission-strip");
  if(!missionStrip) return false;

  const nav = document.createElement("nav");
  nav.id = "advancedLearningNavV4023";
  nav.className = "advanced-learning-nav-v4023";
  nav.setAttribute("aria-label","Class 4–6 learning navigation");

  nav.innerHTML = `
    <a href="${ADVANCED_HOME}" data-adv-view="home" aria-current="page">🏠 Home</a>
    <a href="${advancedDetailHref("lessons")}" data-adv-view="lessons">📗 Learn</a>
    <a href="${advancedDetailHref("labs")}" data-adv-view="labs">🧪 Labs</a>
    <a href="${advancedDetailHref("practice")}" data-adv-view="practice">🎮 Games</a>
    <a href="${advancedDetailHref("tests")}" data-adv-view="tests">📝 Tests</a>
    <a href="${advancedDetailHref("battle")}" data-adv-view="battle">⚔️ Battle</a>
    <a href="${advancedDetailHref("gk")}" data-adv-view="gk">🌍 GK World</a>
    <a href="${advancedDetailHref("speaking")}" data-adv-view="speaking">🗣️ Speak</a>
    <a href="${advancedDetailHref("healthy")}" data-adv-view="healthy">🌱 Health</a>
    <a href="${advancedDetailHref("citizen")}" data-adv-view="citizen">🛡️ Safety</a>
  `;

  missionStrip.insertAdjacentElement("afterend",nav);
  return true;
}

function prepareStudentChip(){
  if(!isAdvancedPage) return false;

  const chip = document.getElementById("studentChip");
  if(!chip) return false;

  chip.classList.add("v4023-advanced-profile-chip");
  chip.setAttribute("role","button");
  chip.setAttribute("tabindex","0");
  chip.setAttribute("title","Open my Class 4–6 profile");
  chip.setAttribute("aria-label","Open my Class 4–6 profile");
  return true;
}

function goAdvancedProfile(){
  location.href = advancedDetailHref("profile");
}

/*
  advanced-theme-v25.js V25.9 still has an older bubbling click handler
  that sends #studentChip to plain student-profile.html.
  Capture phase wins first and sends the student to the explicit
  Advanced profile route instead.
*/
function captureAdvancedHomeClick(event){
  if(!isAdvancedPage) return;
  if(verifiedClass && !isClass46(verifiedClass)) return;

  const chip = event.target.closest?.("#studentChip");
  if(!chip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  goAdvancedProfile();
}

function captureAdvancedHomeKey(event){
  if(!isAdvancedPage) return;
  if(verifiedClass && !isClass46(verifiedClass)) return;
  if(event.key !== "Enter" && event.key !== " ") return;

  const chip = event.target.closest?.("#studentChip");
  if(!chip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  goAdvancedProfile();
}

function setDetailUrl(view){
  if(!DETAIL_VIEWS.has(view)) return;

  const url = new URL(location.href);
  url.searchParams.set("view",view);
  url.searchParams.set("from","advanced");

  history.replaceState(
    {advancedView:view},
    "",
    url.pathname + url.search + url.hash
  );
}

function addAdvancedHomeButton(){
  if(!isProfilePage || !isClass46(verifiedClass)) return false;

  const topNav = document.querySelector(".top .nav");
  if(!topNav) return false;

  if(!document.getElementById("advancedHomeBackV4023")){
    const link = document.createElement("a");
    link.id = "advancedHomeBackV4023";
    link.href = ADVANCED_HOME;
    link.textContent = "← Advanced Home";
    link.title = "Back to Future Skills Universe";
    topNav.prepend(link);
  }

  return true;
}

const DETAIL_LABELS = {
  dashboard:"🏠 Home",
  lessons:"📗 Learn",
  labs:"🧪 Labs",
  practice:"🎮 Games",
  tests:"📝 Tests",
  battle:"⚔️ Battle",
  gk:"🌍 GK World",
  speaking:"🗣️ Speak",
  healthy:"🌱 Health",
  citizen:"🛡️ Safety",
  portfolio:"🎒 My Work"
};

function polishDetailTabs(){
  if(!isProfilePage || !isClass46(verifiedClass)) return false;

  document.body?.classList.add("sp-advanced-detail-v4023");

  const tabs = document.querySelector(".tabs");
  if(!tabs) return false;

  Object.entries(DETAIL_LABELS).forEach(([view,label])=>{
    tabs.querySelectorAll(`[data-view="${view}"]`).forEach(el=>{
      el.textContent = label;
    });
  });

  return true;
}

function activateRequestedDetailView(view){
  if(!DETAIL_VIEWS.has(view)) return false;
  if(typeof window.showView !== "function") return false;

  const target = document.getElementById("view-" + view);
  if(!target) return false;

  window.showView(view);
  setDetailUrl(view);
  return true;
}

function syncAdvancedDetailPage(view){
  if(!isProfilePage || !isClass46(verifiedClass)) return;

  addAdvancedHomeButton();
  polishDetailTabs();
  activateRequestedDetailView(view);
}

function watchDetailUi(view){
  if(detailObserver || !document.body) return;

  let scheduled = false;

  const sync = ()=>{
    if(scheduled) return;
    scheduled = true;

    requestAnimationFrame(()=>{
      scheduled = false;
      syncAdvancedDetailPage(view);
    });
  };

  detailObserver = new MutationObserver(sync);
  detailObserver.observe(document.body,{
    childList:true,
    subtree:true
  });

  [80,160,300,500,800,1200,1800,2600,3800].forEach(ms=>{
    setTimeout(sync,ms);
  });
}

/*
  On the Class 4–6 detail page:
  - Dashboard/Home means Advanced Home.
  - Other detail tabs stay on this page, use existing showView(), and
    update the URL so refresh/back behavior is stable.
*/
function captureProfileDetailNavigation(event){
  if(!isProfilePage || !isClass46(verifiedClass)) return;

  const control = event.target.closest?.("[data-view]");
  if(!control) return;

  const view = String(control.dataset.view || "").trim().toLowerCase();

  if(view === "dashboard"){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    location.href = ADVANCED_HOME;
    return;
  }

  if(DETAIL_VIEWS.has(view)){
    setDetailUrl(view);
  }
}

async function handleProfileRoute(){
  if(!isProfilePage) return;

  const view = requestedView();
  const fromAdvanced = requestedFrom() === "advanced";
  const explicitDetail = DETAIL_VIEWS.has(view);

  /*
    Hide during routing only when the page plausibly belongs to the
    Advanced flow. This prevents a flash of the old dashboard.
  */
  if(fromAdvanced || cameFromAdvancedExperience()){
    document.documentElement.classList.add("v4023-advanced-route-check");
  }

  const profile = await getCurrentProfile();

  if(!profile){
    document.documentElement.classList.remove("v4023-advanced-route-check");
    routeCheckFinished = true;
    return;
  }

  if(!isClass46(profile.class_number)){
    /* Class 1–3 remains fully owned by the existing Foundation controller. */
    clearAdvancedSession();
    document.documentElement.classList.remove("v4023-advanced-route-check");
    routeCheckFinished = true;
    return;
  }

  markAdvancedSession();

  /*
    IMPORTANT DIFFERENCE FROM V40.22:
    explicit Class 4–6 detail views are now allowed.
    Only the plain/legacy Dashboard route is sent back home.
  */
  if(!explicitDetail || view === "dashboard"){
    location.replace(ADVANCED_HOME);
    return;
  }

  document.documentElement.classList.remove("v4023-advanced-route-check");
  routeCheckFinished = true;

  const begin = ()=>{
    syncAdvancedDetailPage(view);
    watchDetailUi(view);
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",begin,{once:true});
  }else{
    begin();
  }

  document.addEventListener("click",captureProfileDetailNavigation,true);
}

async function initAdvancedHome(){
  if(!isAdvancedPage) return;

  injectStyles();
  markAdvancedSession();

  document.addEventListener("click",captureAdvancedHomeClick,true);
  document.addEventListener("keydown",captureAdvancedHomeKey,true);

  const profile = await getCurrentProfile();

  if(!profile || !isClass46(profile.class_number)){
    clearAdvancedSession();
    return;
  }

  installAdvancedHomeNavigation();
  prepareStudentChip();

  /*
    V25/V26 and exam integration modify the page shortly after load.
    Re-run only lightweight presentation hooks.
  */
  [100,250,500,900,1500,2500].forEach(ms=>{
    setTimeout(()=>{
      installAdvancedHomeNavigation();
      prepareStudentChip();
    },ms);
  });
}

function safetyReveal(){
  if(!routeCheckFinished){
    document.documentElement.classList.remove("v4023-advanced-route-check");
  }
}

injectStyles();

if(isProfilePage){
  handleProfileRoute();
  setTimeout(safetyReveal,3500);
}

if(isAdvancedPage){
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",initAdvancedHome,{once:true});
  }else{
    initAdvancedHome();
  }

  window.addEventListener("pageshow",()=>{
    markAdvancedSession();
    installAdvancedHomeNavigation();
    prepareStudentChip();
  });
}

})();
