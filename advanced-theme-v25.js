(() => {
"use strict";

/* ============================================================
   V25.8 — Advanced Universe Profile / Hero Visual Upgrade
   + clickable hero shortcuts
   + hero 5-Stage Practical Lab launcher
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[c]));
}

/* ------------------------------------------------------------
   V25.8 HERO SHORTCUTS
   Computer & IT  -> Hardware Engineer Lab
   AI Skills      -> AI & Smart Technology
   Cyber Safety   -> Cyber Hero Academy
   Practical Lab  -> 5-Stage Practical Lab
   ------------------------------------------------------------ */

function clearJumpHighlight() {
  document.querySelectorAll(".adv-jump-highlight").forEach(el => {
    el.classList.remove("adv-jump-highlight");
  });
}

function jumpToWorld(worldId) {
  const workspace = document.getElementById("workspace");

  if (workspace && !workspace.classList.contains("hidden")) {
    const back = document.getElementById("backWorlds");
    if (back) back.click();
  }

  const tryOpen = (attempt = 0) => {
    const card = document.querySelector(`[data-world="${worldId}"]`);

    if (!card) {
      if (attempt < 12) {
        setTimeout(() => tryOpen(attempt + 1), 120);
      }
      return;
    }

    clearJumpHighlight();

    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    card.classList.add("adv-jump-highlight");

    setTimeout(() => {
      if (!card.classList.contains("locked")) {
        card.click();
      }
    }, 420);

    setTimeout(() => {
      card.classList.remove("adv-jump-highlight");
    }, 2200);
  };

  setTimeout(() => tryOpen(), 120);
}

function openPracticalLab() {
  window.location.href = "junior-technician-lab.html";
}

function wireHeroShortcuts() {
  const chips = document.getElementById("advHeroChips");
  if (!chips) return;

  chips.querySelectorAll("[data-adv-jump]").forEach(button => {
    button.onclick = () => {
      const target = button.dataset.advJump;

      if (target === "practical") {
        openPracticalLab();
        return;
      }

      jumpToWorld(target);
    };
  });

  const heroLab = document.getElementById("advHeroLabLaunch");
  if (heroLab) {
    heroLab.onclick = openPracticalLab;
  }
}

function addProfileHero(profile) {
  const hero = document.querySelector(".hero");
  const copy = document.querySelector(".hero-copy");

  if (!hero || !copy) return;

  const name = profile.display_name || profile.username || "Student";
  const classNo = Number(profile.class_number || 4);

  if (!document.getElementById("advProfileSide")) {
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
  }

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
    chips.className = "adv-hero-chips adv-hero-shortcuts";
    chips.setAttribute("aria-label", "Quick learning shortcuts");

    chips.innerHTML = `
      <button class="adv-hero-chip" data-adv-jump="hardware" type="button">
        🖥️ <span>Computer &amp; IT</span>
      </button>

      <button class="adv-hero-chip" data-adv-jump="ai" type="button">
        🤖 <span>AI Skills</span>
      </button>

      <button class="adv-hero-chip" data-adv-jump="cyber" type="button">
        🛡️ <span>Cyber Safety</span>
      </button>

      <button class="adv-hero-chip" data-adv-jump="practical" type="button">
        🧪 <span>Practical Lab</span>
      </button>
    `;

    const modeRow = copy.querySelector(".mode-row");
    if (modeRow) copy.insertBefore(chips, modeRow);
    else copy.appendChild(chips);
  }

  if (!document.getElementById("advHeroLabLaunch")) {
    const labLaunch = document.createElement("button");
    labLaunch.id = "advHeroLabLaunch";
    labLaunch.className = "adv-hero-lab-launch";
    labLaunch.type = "button";
    labLaunch.innerHTML = `
      <span class="adv-hero-lab-icon">🧪</span>
      <span class="adv-hero-lab-copy">
        <b>5-Stage Practical Lab</b>
        <small>Hardware • Software • AI • Cyber Safety • Troubleshooting</small>
      </span>
      <span class="adv-hero-lab-arrow">→</span>
    `;

    const modeRow = copy.querySelector(".mode-row");
    if (modeRow) copy.insertBefore(labLaunch, modeRow);
    else copy.appendChild(labLaunch);
  }

  wireHeroShortcuts();
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

function markOldPracticalLink() {
  document.querySelectorAll('.section-actions a[href="junior-technician-lab.html"]').forEach(link => {
    link.classList.add("adv-old-practical-link");
    link.setAttribute("aria-hidden", "true");
    link.tabIndex = -1;
  });
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
    markOldPracticalLink();
    await loadPhoto(profile);

    setTimeout(() => {
      wireHeroShortcuts();
      markOldPracticalLink();
    }, 500);

  } catch {}
}

/* Wait a moment so the existing advanced-universe.js can initialize first. */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(initV25, 120));
} else {
  setTimeout(initV25, 120);
}

})();
