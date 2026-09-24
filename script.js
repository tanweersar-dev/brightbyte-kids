const API_BASE = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

let modules = [];

let state = JSON.parse(
  localStorage.getItem("brightbyte-class1") ||
  '{"done":[],"stars":120}'
);

const targetList = ["Monitor", "Keyboard", "Mouse", "Printer"];
let targetIndex = 0;

const badgeNames = [
  "💻 Computer Explorer",
  "🖥️ Parts Detective",
  "🖱️ Mouse Master",
  "⌨️ Keyboard Hero",
  "🪟 Desktop Explorer",
  "🎨 Digital Artist",
  "✍️ Typing Star",
  "🛡️ Safety Hero",
  "🤖 AI Explorer",
  "✨ Prompt Creator"
];

const fallbackIcons = [
  "💻",
  "🖥️",
  "🖱️",
  "⌨️",
  "🪟",
  "🎨",
  "✍️",
  "🛡️",
  "🤖",
  "✨"
];

/* =========================================================
   BASIC HELPERS
========================================================= */

function save() {
  localStorage.setItem("brightbyte-class1", JSON.stringify(state));
  render();
}

function go(id) {
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({
      behavior: "smooth"
    });
  }

  const nav = document.getElementById("nav");

  if (nav) {
    nav.classList.remove("open");
  }
}

function toast(text) {
  const x = document.getElementById("toast");

  if (!x) return;

  x.textContent = text;
  x.classList.add("show");

  clearTimeout(window.tt);

  window.tt = setTimeout(() => {
    x.classList.remove("show");
  }, 1900);
}

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("open");
  }
}

/* =========================================================
   LOAD MODULES FROM CLOUDFLARE D1
========================================================= */

async function loadModules() {
  try {
    const response = await fetch(`${API_BASE}/api/modules`);

    if (!response.ok) {
      throw new Error("Unable to load modules");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "API error");
    }

    modules = data.modules
      .sort((a, b) => a.module_number - b.module_number)
      .map((m, index) => ({
        ...m,
        icon: m.icon || fallbackIcons[index],
        badge: badgeNames[index] || "⭐ BrightByte Badge"
      }));

    render();

  } catch (error) {
    console.error("Module loading error:", error);

    const wrap = document.getElementById("modules");

    if (wrap) {
      wrap.innerHTML = `
        <div style="
          padding:24px;
          background:#fff;
          border-radius:18px;
          border:1px solid #ddd;
          width:100%;
        ">
          <h3>Unable to load lessons</h3>
          <p>
            Please check your internet connection or BrightByte API.
          </p>
          <button onclick="loadModules()">
            Try Again
          </button>
        </div>
      `;
    }

    toast("Could not connect to BrightByte API");
  }
}

/* =========================================================
   MAIN DASHBOARD RENDER
========================================================= */

function render() {
  if (!modules.length) return;

  const wrap = document.getElementById("modules");

  if (wrap) {
    wrap.innerHTML = "";

    modules.forEach((m, i) => {
      const done = state.done.includes(i);

      const el = document.createElement("article");

      el.className = "module " + (done ? "done" : "");

      el.innerHTML = `
        <div class="ico">
          ${m.icon}
        </div>

        <div class="copy">
          <small>
            MODULE ${m.module_number}
          </small>

          <h3>
            ${m.title}
          </h3>

          <p>
            ${m.description || ""}
          </p>

          <small>
            ${m.lesson_count || 0} LESSONS
          </small>
        </div>

        <span class="state">
          ${done ? "✓ DONE" : "OPEN →"}
        </span>
      `;

      el.onclick = () => openLesson(i);

      wrap.appendChild(el);
    });
  }

  const stars = document.getElementById("stars");
  const gameStars = document.getElementById("gameStars");
  const parentStars = document.getElementById("parentStars");

  if (stars) stars.textContent = state.stars;
  if (gameStars) gameStars.textContent = state.stars;
  if (parentStars) parentStars.textContent = state.stars;

  const completed = state.done.length;

  const totalModules = modules.length || 10;

  const percent = Math.round(
    (completed / totalModules) * 100
  );

  const doneCount = document.getElementById("doneCount");
  const lessonsDone = document.getElementById("lessonsDone");
  const badgeCount = document.getElementById("badgeCount");
  const parentBadges = document.getElementById("parentBadges");
  const percentEl = document.getElementById("percent");
  const heroBar = document.getElementById("heroBar");
  const parentBar = document.getElementById("parentBar");

  if (doneCount) doneCount.textContent = completed;

  if (lessonsDone) {
    lessonsDone.textContent = completed;
  }

  if (badgeCount) badgeCount.textContent = completed;

  if (parentBadges) {
    parentBadges.textContent =
      `${completed} / ${totalModules}`;
  }

  if (percentEl) {
    percentEl.textContent = percent + "%";
  }

  if (heroBar) {
    heroBar.style.width = percent + "%";
  }

  if (parentBar) {
    parentBar.style.width = percent + "%";
  }

  let nextIndex = modules.findIndex(
    (_, i) => !state.done.includes(i)
  );

  if (nextIndex === -1) {
    nextIndex = modules.length - 1;
  }

  const next = modules[nextIndex];

  const missionTitle =
    document.getElementById("missionTitle");

  const focus =
    document.getElementById("focus");

  const teacherNote =
    document.getElementById("teacherNote");

  if (missionTitle && next) {
    missionTitle.textContent = next.title;
  }

  if (focus && next) {
    focus.textContent = next.title;
  }

  if (teacherNote && next) {
    teacherNote.textContent =
      completed === totalModules
        ? "Excellent! All Class 1 modules are complete. Review lessons and try the certificate."
        : `Next recommended focus: ${next.title}. Keep the session short and practical.`;
  }

  renderBadges();
}

/* =========================================================
   BADGES
========================================================= */

function renderBadges() {
  const bg = document.getElementById("badgeGrid");

  if (!bg) return;

  bg.innerHTML = "";

  modules.forEach((m, i) => {
    const unlocked = state.done.includes(i);

    const badgeParts = m.badge.split(" ");

    const emoji = badgeParts[0];

    const title = badgeParts
      .slice(1)
      .join(" ");

    bg.innerHTML += `
      <div class="badge ${unlocked ? "" : "locked"}">

        <b>
          ${emoji}
        </b>

        <span>
          ${title}
        </span>

      </div>
    `;
  });
}

/* =========================================================
   OPEN MODULE + FETCH LESSONS FROM D1
========================================================= */

async function openLesson(index) {
  const m = modules[index];

  if (!m) return;

  const modal =
    document.getElementById("modal");

  const body =
    document.getElementById("modalBody");

  if (!modal || !body) return;

  modal.classList.add("open");

  body.innerHTML = `
    <div class="lessonHero">

      <div class="bigico">
        ${m.icon}
      </div>

      <small>
        MODULE ${m.module_number}
      </small>

      <h2>
        ${m.title}
      </h2>

      <p>
        ${m.description || ""}
      </p>

    </div>

    <div class="learnbox">

      <h4>
        ⏳ Loading lessons...
      </h4>

    </div>
  `;

  try {
    const response = await fetch(
      `${API_BASE}/api/lessons?module=${m.module_number}`
    );

    if (!response.ok) {
      throw new Error("Unable to load lessons");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.error || "Lesson API error"
      );
    }

    const lessonHtml = data.lessons
      .map(
        lesson => `
          <div style="
            padding:16px;
            margin-bottom:12px;
            background:#fff;
            border:1px solid #ebe8ff;
            border-radius:16px;
          ">

            <small style="
              font-weight:700;
              color:#6955e8;
            ">
              LESSON ${lesson.lesson_number}
              •
              ${String(lesson.lesson_type).toUpperCase()}
            </small>

            <h3 style="
              margin:7px 0 8px;
            ">
              ${lesson.title}
            </h3>

            <p style="
              margin:0 0 8px;
            ">
              ${lesson.short_description || ""}
            </p>

            <div style="
              background:#f8f7ff;
              padding:12px;
              border-radius:12px;
              line-height:1.6;
            ">
              ${lesson.content || ""}
            </div>

            <small style="
              display:block;
              margin-top:9px;
            ">
              ⭐ ${lesson.xp_reward} XP
            </small>

          </div>
        `
      )
      .join("");

    body.innerHTML = `
      <div class="lessonHero">

        <div class="bigico">
          ${m.icon}
        </div>

        <small>
          MODULE ${m.module_number}
          •
          ${data.count} LESSONS
        </small>

        <h2>
          ${m.title}
        </h2>

        <p>
          ${m.description || ""}
        </p>

      </div>

      <div class="learnbox">

        <h4>
          📚 What we learn
        </h4>

        ${lessonHtml}

      </div>

      <div class="challenge">

        <b>
          🎯 Module Challenge
        </b>

        <p>
          Complete all four lessons and discuss what
          you learned with your teacher or parent.
        </p>

      </div>

      <button
        class="complete"
        onclick="completeModule(${index})"
      >
        ${
          state.done.includes(index)
            ? "✓ Completed — Review Again"
            : "Complete Module • +20 ⭐"
        }
      </button>
    `;

  } catch (error) {
    console.error(
      "Lesson loading error:",
      error
    );

    body.innerHTML = `
      <div class="lessonHero">

        <div class="bigico">
          ⚠️
        </div>

        <h2>
          Unable to load lessons
        </h2>

        <p>
          Please check your connection and try again.
        </p>

      </div>

      <button
        class="complete"
        onclick="openLesson(${index})"
      >
        Try Again
      </button>
    `;
  }
}

/* =========================================================
   COMPLETE MODULE
========================================================= */

function completeModule(index) {
  if (!state.done.includes(index)) {
    state.done.push(index);

    state.stars += 20;

    save();

    toast(
      "Great work! Module completed +20 Stars ⭐"
    );
  } else {
    toast(
      "Module already completed ✓"
    );
  }

  closeModal();
}

/* =========================================================
   QUIZ
========================================================= */

function openQuiz() {
  const modal =
    document.getElementById("modal");

  const body =
    document.getElementById("modalBody");

  if (!modal || !body) return;

  body.innerHTML = `
    <div class="lessonHero">

      <div class="bigico">
        🧠
      </div>

      <h2>
        Quick Quiz
      </h2>

      <p>
        Which device helps us type
        letters and numbers?
      </p>

    </div>

    <div class="quizBtns">

      <button onclick="answer(false)">
        🖱️ Mouse
      </button>

      <button onclick="answer(true)">
        ⌨️ Keyboard
      </button>

      <button onclick="answer(false)">
        🖨️ Printer
      </button>

    </div>
  `;

  modal.classList.add("open");
}

function answer(ok) {
  if (ok) {
    state.stars += 10;

    save();

    closeModal();

    toast(
      "Correct! +10 Stars ⭐"
    );
  } else {
    toast(
      "Good try — think about typing!"
    );
  }
}

/* =========================================================
   CERTIFICATE
========================================================= */

function showCertificate() {
  const modal =
    document.getElementById("modal");

  const body =
    document.getElementById("modalBody");

  if (!modal || !body) return;

  body.innerHTML = `
    <div class="lessonHero">

      <div class="bigico">
        🏅
      </div>

      <small>
        CERTIFICATE OF ACHIEVEMENT
      </small>

      <h2>
        Computer & AI Explorer
      </h2>

      <p>
        This certificate recognizes progress
        in the BrightByte Kids Lab
        Class 1 learning journey.
      </p>

      <div class="learnbox">

        <h4>
          Ayaan • Class 1
        </h4>

        <p>
          Progress:
          ${state.done.length}/${modules.length}
          modules
          •
          Stars:
          ${state.stars}
        </p>

      </div>

    </div>
  `;

  modal.classList.add("open");
}

/* =========================================================
   RESET
========================================================= */

function resetProgress() {
  if (
    confirm(
      "Reset demo progress and stars?"
    )
  ) {
    state = {
      done: [],
      stars: 120
    };

    save();

    toast(
      "Demo progress reset"
    );
  }
}

/* =========================================================
   MOUSE GAME
========================================================= */

function setupMouseGame() {
  document
    .querySelectorAll(".parts button")
    .forEach(button => {

      button.onclick = () => {

        if (
          button.dataset.part ===
          targetList[targetIndex]
        ) {
          state.stars += 5;

          save();

          toast(
            "Excellent! +5 Stars ⭐"
          );

          targetIndex =
            (targetIndex + 1) %
            targetList.length;

          const target =
            document.getElementById("target");

          if (target) {
            target.textContent =
              targetList[targetIndex];
          }

        } else {
          toast(
            "Try another part 🙂"
          );
        }
      };
    });
}

/* =========================================================
   MENU + MODAL EVENTS
========================================================= */

function setupEvents() {
  const menu =
    document.getElementById("menu");

  if (menu) {
    menu.onclick = () => {
      const nav =
        document.getElementById("nav");

      if (nav) {
        nav.classList.toggle("open");
      }
    };
  }

  const modal =
    document.getElementById("modal");

  if (modal) {
    modal.onclick = event => {
      if (event.target.id === "modal") {
        closeModal();
      }
    };
  }

  setupMouseGame();
}

/* =========================================================
   APP START
========================================================= */

async function initApp() {
  setupEvents();

  await loadModules();

  console.log(
    "BrightByte Kids connected to Cloudflare D1 🚀"
  );
}

initApp();
