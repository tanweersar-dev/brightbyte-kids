(() => {
"use strict";

/* ============================================================
   BrightByte Kids — V40.22
   CLASS 4–6 ADVANCED UNIVERSE • STABLE HOME / ROUTE GUARD
   ------------------------------------------------------------
   PURPOSE
   - Keep Class 4–6 students inside advanced-universe.html.
   - Stop the legacy V25.9 student-chip jump to student-profile.html.
   - Stop any stale student-profile.html link from replacing the
     Advanced Learning Universe with the old generic dashboard.
   - If a Class 4–6 student somehow reaches student-profile.html,
     safely return them to advanced-universe.html.
   - Class 1–3 behavior is left unchanged.
   - No Worker, D1, login/session, progress, exams or course logic changes.
   ============================================================ */

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const ADVANCED_HOME = "advanced-universe.html";
const LEGACY_PROFILE = "student-profile.html";
const SESSION_MARKER = "brightbyte_v4022_advanced_home";

const isAdvancedPage = /(?:^|\/)advanced-universe\.html$/i.test(location.pathname);
const isLegacyProfilePage = /(?:^|\/)student-profile\.html$/i.test(location.pathname);

let verifiedClass = 0;
let routeCheckFinished = false;
let toastTimer = 0;

function token() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function isClass46(value) {
  const n = Number(value || 0);
  return n >= 4 && n <= 6;
}

function pageNameFromHref(href) {
  try {
    const u = new URL(href, location.href);
    return u.pathname.split("/").pop() || "";
  } catch {
    return "";
  }
}

function isLegacyProfileHref(href) {
  return pageNameFromHref(href).toLowerCase() === LEGACY_PROFILE;
}

function showAdvancedToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function injectStyle() {
  if (document.getElementById("advancedStableHomeV4022Style")) return;

  const style = document.createElement("style");
  style.id = "advancedStableHomeV4022Style";
  style.textContent = `
    #studentChip.v4022-advanced-home-chip{
      cursor:pointer!important;
      transition:transform .18s ease, box-shadow .18s ease, filter .18s ease!important;
    }
    #studentChip.v4022-advanced-home-chip:hover,
    #studentChip.v4022-advanced-home-chip:focus-visible{
      transform:translateY(-1px)!important;
      filter:brightness(1.05)!important;
      outline:none!important;
    }

    #advProfileSide.v4022-profile-focus{
      animation:v4022ProfileFocus 1.25s ease 1;
    }

    @keyframes v4022ProfileFocus{
      0%{
        transform:scale(1);
        filter:none;
      }
      35%{
        transform:scale(1.025);
        filter:drop-shadow(0 0 18px rgba(77,213,205,.42));
      }
      100%{
        transform:scale(1);
        filter:none;
      }
    }

    html.v4022-advanced-route-check body{
      visibility:hidden!important;
    }

    @media(prefers-reduced-motion:reduce){
      #advProfileSide.v4022-profile-focus{
        animation:none!important;
      }
    }
  `;

  document.head.appendChild(style);
}

async function getCurrentProfile() {
  const t = token();
  if (!t) return null;

  try {
    const response = await fetch(API + "/api/auth/me", {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store"
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.role !== "student" || !data.profile) {
      return null;
    }

    verifiedClass = Number(data.profile.class_number || 0);
    return data.profile;
  } catch {
    return null;
  }
}

function markAdvancedSession() {
  try {
    sessionStorage.setItem(SESSION_MARKER, "1");
  } catch {}
}

function clearAdvancedSession() {
  try {
    sessionStorage.removeItem(SESSION_MARKER);
  } catch {}
}

function cameFromAdvancedExperience() {
  let marked = false;

  try {
    marked = sessionStorage.getItem(SESSION_MARKER) === "1";
  } catch {}

  const ref = String(document.referrer || "").toLowerCase();

  return marked ||
    ref.includes("advanced-universe.html") ||
    ref.includes("hardware-explorer.html") ||
    ref.includes("junior-technician-lab.html") ||
    ref.includes("advanced-battle.html") ||
    ref.includes("student-exams.html");
}

function focusAdvancedProfile() {
  const profileSide = document.getElementById("advProfileSide");
  const hero = document.querySelector(".hero");

  const target = profileSide || hero;
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  if (profileSide) {
    profileSide.classList.remove("v4022-profile-focus");
    void profileSide.offsetWidth;
    profileSide.classList.add("v4022-profile-focus");

    setTimeout(() => {
      profileSide.classList.remove("v4022-profile-focus");
    }, 1400);
  }

  showAdvancedToast(
    "Your Class 4–6 profile, photo and password tools are already inside Future Skills Universe."
  );
}

function prepareStudentChip() {
  const chip = document.getElementById("studentChip");
  if (!chip) return false;

  chip.classList.add("v4022-advanced-home-chip");
  chip.setAttribute("role", "button");
  chip.setAttribute("tabindex", "0");
  chip.setAttribute("title", "My profile is here in Future Skills Universe");
  chip.setAttribute("aria-label", "Show my Future Skills Universe profile");

  return true;
}

/*
  V25.9 currently attaches a normal bubbling click handler to #studentChip
  that sends the student to student-profile.html.

  This capture-phase handler runs before that old handler. For verified
  Class 4–6 students it stops the old navigation and keeps the student
  inside the correct Advanced Universe.
*/
function captureAdvancedNavigation(event) {
  if (!isAdvancedPage) return;
  if (verifiedClass && !isClass46(verifiedClass)) return;

  const chip = event.target.closest?.("#studentChip");
  if (chip) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    focusAdvancedProfile();
    return;
  }

  const anchor = event.target.closest?.("a[href]");
  if (!anchor) return;

  const href = anchor.getAttribute("href") || "";
  if (!isLegacyProfileHref(href)) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  focusAdvancedProfile();
}

function captureAdvancedKeyboard(event) {
  if (!isAdvancedPage) return;
  if (verifiedClass && !isClass46(verifiedClass)) return;
  if (event.key !== "Enter" && event.key !== " ") return;

  const chip = event.target.closest?.("#studentChip");
  if (!chip) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  focusAdvancedProfile();
}

async function guardLegacyProfilePage() {
  if (!isLegacyProfilePage) return;

  /*
    When arriving from the Advanced experience, hide the legacy page before
    it paints. If this turns out to be Class 1–3, it is immediately revealed.
  */
  if (cameFromAdvancedExperience()) {
    document.documentElement.classList.add("v4022-advanced-route-check");
  }

  const profile = await getCurrentProfile();

  if (profile && isClass46(profile.class_number)) {
    markAdvancedSession();

    const target = new URL(ADVANCED_HOME, location.href);

    // Preserve a useful return hint without exposing the old dashboard.
    const requestedView = new URLSearchParams(location.search).get("view");
    if (requestedView) {
      target.searchParams.set("return", requestedView);
    }

    location.replace(target.href);
    return;
  }

  clearAdvancedSession();
  document.documentElement.classList.remove("v4022-advanced-route-check");
  routeCheckFinished = true;
}

async function initAdvancedPage() {
  if (!isAdvancedPage) return;

  injectStyle();
  markAdvancedSession();

  document.addEventListener("click", captureAdvancedNavigation, true);
  document.addEventListener("keydown", captureAdvancedKeyboard, true);

  prepareStudentChip();

  const profile = await getCurrentProfile();

  if (!profile || !isClass46(profile.class_number)) {
    clearAdvancedSession();
    return;
  }

  prepareStudentChip();

  /*
    Some UI upgrades inject/modify #studentChip after the base page starts.
    Re-apply only harmless attributes; no permanent heavy observer is needed.
  */
  [100, 250, 500, 900, 1500, 2500].forEach(ms => {
    setTimeout(prepareStudentChip, ms);
  });
}

function safetyReveal() {
  /*
    Never allow a failed network request to leave Class 1–3 hidden.
    If a legacy profile check has not finished after 3.5 seconds,
    reveal the page. Class 4–6 will still be redirected once verified.
  */
  if (!routeCheckFinished) {
    document.documentElement.classList.remove("v4022-advanced-route-check");
  }
}

injectStyle();

if (isLegacyProfilePage) {
  guardLegacyProfilePage();
  setTimeout(safetyReveal, 3500);
}

if (isAdvancedPage) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdvancedPage, { once:true });
  } else {
    initAdvancedPage();
  }

  window.addEventListener("pageshow", () => {
    markAdvancedSession();
    prepareStudentChip();
  });
}

})();
