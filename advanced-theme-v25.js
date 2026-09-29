(() => {
"use strict";

/* ============================================================
   V25 — Advanced Universe Profile / Hero Visual Upgrade
   Safe add-on. Does not replace advanced-universe.js.
   ============================================================ */

const API = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY = "brightbyte_student_token";
const token = localStorage.getItem(TOKEN_KEY) || "";

const $ = id => document.getElementById(id);

async function api(path, opt = {}) {
  const headers = {
    ...(opt.headers || {}),
    Authorization: `Bearer ${token}`
  };
  return fetch(API + path, {
    ...opt,
    headers,
    cache: "no-store"
  });
}

function fallbackInitial(name) {
  const text = String(name || "Student").trim();
  return (text.charAt(0) || "S").toUpperCase();
}

function addProfileHero(profile) {
  const hero = document.querySelector(".hero");
  const copy = document.querySelector(".hero-copy");

  if (!hero || !copy || document.getElementById("advProfileSide")) return;

  const name = profile.display_name || profile.username || "Student";
  const classNo = Number(profile.class_number || 4);

  const side = document.createElement("div");
  side.id = "advProfileSide";
  side.className = "adv-profile-side";
  side.innerHTML = `
    <div class="adv-photo-ring" id="advPhotoRing">
      <div class="adv-avatar-fallback" id="advAvatarFallback">${fallbackInitial(name)}</div>
    </div>
    <div class="adv-profile-name">${escapeHtml(name)}</div>
    <div class="adv-profile-sub">FUTURE SKILLS EXPLORER</div>
    <div class="adv-profile-badges">
      <span>🎓 Class ${classNo}</span>
      <span>🚀 Level 2</span>
    </div>
  `;

  hero.insertBefore(side, copy);

  const title = $("heroTitle");
  if (title) title.textContent = `Welcome, ${name}! 👋`;

  const heroText = $("heroText");
  if (heroText) {
    heroText.textContent =
      classNo === 4
        ? "Explore advanced computer, digital, AI and future skills through visual lessons, practical labs and guided challenges."
        : classNo === 5
          ? "Apply your computer, software, AI, research and problem-solving skills through practical missions and creative projects."
          : "Create, solve and explain through advanced practical labs, AI literacy, digital projects and real-world challenges.";
  }

  if (!document.getElementById("advHeroChips")) {
    const chips = document.createElement("div");
    chips.id = "advHeroChips";
    chips.className = "adv-hero-chips";
    chips.innerHTML = `
      <span>🖥️ Computer & IT</span>
      <span>🤖 AI Skills</span>
      <span>🛡️ Cyber Safety</span>
      <span>🧪 Practical Lab</span>
    `;
    const modeRow = copy.querySelector(".mode-row");
    if (modeRow) copy.insertBefore(chips, modeRow);
    else copy.appendChild(chips);
  }
}

async function loadPhoto(profile) {
  if (!profile || !profile.has_photo || !token) return;

  try {
    const response = await api("/api/student/photo");
    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const ring = $("advPhotoRing");
    if (!ring) {
      URL.revokeObjectURL(url);
      return;
    }

    ring.innerHTML = `<img id="advStudentPhoto" alt="Student profile photo">`;
    const img = $("advStudentPhoto");
    img.onload = () => {
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    };
    img.src = url;
  } catch {}
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

async function initV25() {
  if (!token) return;

  try {
    const response = await api("/api/auth/me");
    const data = await response.json();

    if (!response.ok || data.role !== "student" || !data.profile) return;

    const profile = data.profile;
    const classNo = Number(profile.class_number || 1);

    if (classNo < 4 || classNo > 6) return;

    document.documentElement.dataset.advancedClass = String(classNo);

    addProfileHero(profile);
    await loadPhoto(profile);
  } catch {}
}

/* Wait a moment so the existing advanced-universe.js can initialize first. */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(initV25, 120));
} else {
  setTimeout(initV25, 120);
}

})();
