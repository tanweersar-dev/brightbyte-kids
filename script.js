const modules = [
  { icon: "💻", title: "Meet the Computer", desc: "What a computer is, what it can do and where we see computers.", lessons: 4, stars: 20 },
  { icon: "🖥️", title: "Know Your Computer", desc: "Monitor, keyboard, mouse, printer, speakers, webcam and system unit.", lessons: 4, stars: 20 },
  { icon: "🖱️", title: "Mouse Master", desc: "Move, point, click, double-click, drag-and-drop and scroll.", lessons: 4, stars: 20 },
  { icon: "⌨️", title: "Keyboard Explorer", desc: "Letters, numbers, Spacebar, Enter, Backspace and arrow keys.", lessons: 4, stars: 20 },
  { icon: "🪟", title: "Screen & Windows", desc: "Desktop, icons, open, close, minimize and maximize.", lessons: 4, stars: 20 },
  { icon: "🎨", title: "Digital Artist", desc: "Pencil, brush, colours, shapes and eraser.", lessons: 4, stars: 20 },
  { icon: "✍️", title: "First Typing Adventure", desc: "Type simple letters, words and short sentences accurately.", lessons: 4, stars: 20 },
  { icon: "🛡️", title: "Internet & Safety", desc: "Internet basics, private information, passwords and asking an adult.", lessons: 4, stars: 20 },
  { icon: "🤖", title: "Meet AI", desc: "What AI is, smart tasks and examples of AI around us.", lessons: 4, stars: 20 },
  { icon: "✨", title: "My First AI Prompt", desc: "Build simple AI instructions using a character, place and action.", lessons: 4, stars: 20 }
];

const games = [
  { icon: "🖱️", title: "Mouse Blast", desc: "Tap the correct computer part before the pulse ends.", sound: "games" },
  { icon: "🧠", title: "Memory Match", desc: "Match icons like monitor, keyboard, mouse and printer.", sound: "quiz" },
  { icon: "🚀", title: "Typing Rocket", desc: "Type short words correctly to launch your rocket.", sound: "rocket" },
  { icon: "🛡️", title: "Safe Surf", desc: "Pick safe internet habits and avoid risky actions.", sound: "parents" },
  { icon: "🤖", title: "Prompt Builder", desc: "Create better prompts for AI using clear details.", sound: "teacher" }
];

const badges = [
  { icon: "💻", title: "Computer Explorer", note: "Complete Module 1", unlocked: true },
  { icon: "🖥️", title: "Parts Detective", note: "Complete Module 2", unlocked: false },
  { icon: "🖱️", title: "Mouse Master", note: "Complete Module 3", unlocked: false },
  { icon: "⌨️", title: "Keyboard Hero", note: "Complete Module 4", unlocked: false },
  { icon: "🪟", title: "Desktop Explorer", note: "Complete Module 5", unlocked: false },
  { icon: "🎨", title: "Digital Artist", note: "Complete Module 6", unlocked: false },
  { icon: "✍️", title: "Typing Star", note: "Complete Module 7", unlocked: false },
  { icon: "🛡️", title: "Safety Hero", note: "Complete Module 8", unlocked: false },
  { icon: "🤖", title: "AI Explorer", note: "Complete Module 9", unlocked: false },
  { icon: "✨", title: "Prompt Creator", note: "Complete Module 10", unlocked: false }
];

const students = [
  { photo: "🧒", name: "Ashaaz", cls: "Class 1", progress: 20, focus: "Meet the Computer" },
  { photo: "👧", name: "Aafiya", cls: "Class 1", progress: 45, focus: "Keyboard Explorer" },
  { photo: "🧒", name: "Rayyan", cls: "Class 1", progress: 60, focus: "Mouse Master" },
  { photo: "👧", name: "Hoor", cls: "Class 1", progress: 30, focus: "Know Your Computer" },
  { photo: "🧒", name: "Zayan", cls: "Class 1", progress: 80, focus: "Internet & Safety" },
  { photo: "👧", name: "Maira", cls: "Class 1", progress: 55, focus: "Digital Artist" }
];

const moduleGrid = document.getElementById("moduleGrid");
const gameGrid = document.getElementById("gameGrid");
const badgeGrid = document.getElementById("badgeGrid");
const studentGrid = document.getElementById("studentGrid");
const toast = document.getElementById("toast");
const soundToggle = document.getElementById("soundToggle");
const themeToggle = document.getElementById("themeToggle");

let soundEnabled = true;
let themeMode = "day";
let audioContext = null;

// Renderers
function renderModules() {
  moduleGrid.innerHTML = modules.map((m, i) => `
    <article class="module-card">
      <div class="module-icon">${m.icon}</div>
      <div class="module-body">
        <small>TANNU SIR • MODULE ${i + 1}</small>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="module-meta">
          <span class="mini-chip">📚 ${m.lessons} lessons</span>
          <span class="mini-chip">⭐ +${m.stars} stars</span>
        </div>
      </div>
      <button class="module-go sfx" data-sound="adventure" data-message="Opening ${m.title}">→</button>
    </article>
  `).join("");
}

function renderGames() {
  gameGrid.innerHTML = games.map(g => `
    <article class="game-card">
      <div class="game-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      <button class="sfx" data-sound="${g.sound}" data-message="${g.title} coming soon!">Play Now</button>
    </article>
  `).join("");
}

function renderBadges() {
  badgeGrid.innerHTML = badges.map(b => `
    <article class="badge-card ${b.unlocked ? "" : "locked"}">
      <div class="badge-icon">${b.icon}</div>
      <h4>${b.title}</h4>
      <p>${b.note}</p>
    </article>
  `).join("");
}

function renderStudents() {
  studentGrid.innerHTML = students.map(s => `
    <article class="student-card">
      <div class="student-top">
        <div class="student-photo">${s.photo}</div>
        <div>
          <h3>${s.name}</h3>
          <small>${s.cls}</small>
        </div>
      </div>
      <div class="student-bar">
        <div class="student-fill" style="width:${s.progress}%"></div>
      </div>
      <p><b>Progress:</b> ${s.progress}%</p>
      <p><b>Current focus:</b> ${s.focus}</p>
      <a href="student-profile.html" class="tool-btn sfx" data-sound="students">Open Profile</a>
    </article>
  `).join("");
}

// Navigation
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll("[data-target]").forEach(btn => {
  btn.addEventListener("click", function (e) {
    const target = this.getAttribute("data-target");
    if (target && document.getElementById(target)) {
      e.preventDefault();
      scrollToSection(target);
      setActiveNav(target);
      playSound(this.dataset.sound || "home");
      makeSpark(e);
    }
  });
});

function setActiveNav(targetId) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
}

window.addEventListener("scroll", () => {
  const sections = [...document.querySelectorAll("main section[id]")];
  const scrollPos = window.scrollY + 160;
  for (const section of sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      setActiveNav(section.id);
      break;
    }
  }
});

// Toast
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

// Theme
themeToggle.addEventListener("click", () => {
  if (themeMode === "day") {
    themeMode = "night";
    document.body.classList.add("theme-night");
    themeToggle.textContent = "🌙 Night";
    showToast("Night mode activated!");
  } else {
    themeMode = "day";
    document.body.classList.remove("theme-night");
    themeToggle.textContent = "🌞 Day";
    showToast("Day mode activated!");
  }
  playSound("toggle");
});

// Sound toggle
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊 Sound MAX" : "🔇 Sound OFF";
  showToast(soundEnabled ? "Sound MAX enabled!" : "Sound muted!");
  if (soundEnabled) playSound("toggle");
});

// Buttons with messages
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".sfx");
  if (!btn) return;
  const sound = btn.dataset.sound || "home";
  playSound(sound);
  makeSpark(e);

  const msg = btn.dataset.message;
  if (msg) showToast(msg);
});

// Spark effect
function makeSpark(e) {
  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;

  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.background = ["#ff71be", "#7a69ff", "#49d7ff", "#ffe15e"][i % 4];
    spark.style.setProperty("--dx", `${(Math.random() * 120 - 60).toFixed(0)}px`);
    spark.style.setProperty("--dy", `${(Math.random() * 120 - 60).toFixed(0)}px`);
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 780);
  }
}

// Sound engine
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(start, duration, fromFreq, toFreq, type = "sine", gainValue = 0.18) {
  if (!soundEnabled) return;
  initAudio();

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, now + start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(toFreq, 1), now + start + duration);

  gain.gain.setValueAtTime(0.0001, now + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(now + start);
  osc.stop(now + start + duration + 0.03);
}

function playSound(kind) {
  if (!soundEnabled) return;

  switch (kind) {
    case "home":
      // bird chirp
      playTone(0, 0.10, 1100, 1600, "sine", 0.26);
      playTone(0.09, 0.12, 900, 1400, "sine", 0.24);
      break;

    case "adventure":
      // rocket sweep
      playTone(0, 0.22, 180, 900, "sawtooth", 0.28);
      playTone(0.18, 0.12, 650, 1200, "triangle", 0.22);
      break;

    case "games":
      // playful bounce
      playTone(0, 0.08, 520, 620, "square", 0.22);
      playTone(0.08, 0.08, 620, 760, "square", 0.22);
      playTone(0.16, 0.10, 760, 620, "square", 0.22);
      break;

    case "rewards":
      // sparkle reward
      playTone(0, 0.08, 700, 1000, "triangle", 0.25);
      playTone(0.09, 0.08, 900, 1300, "triangle", 0.25);
      playTone(0.18, 0.14, 1200, 1700, "triangle", 0.22);
      break;

    case "students":
      // cat-like meow
      playTone(0, 0.18, 520, 320, "sawtooth", 0.24);
      playTone(0.15, 0.16, 680, 390, "triangle", 0.22);
      break;

    case "parents":
      // duck-like quack
      playTone(0, 0.10, 420, 300, "square", 0.26);
      playTone(0.08, 0.10, 360, 260, "square", 0.24);
      break;

    case "teacher":
      // owl-ish hoot
      playTone(0, 0.16, 260, 180, "sine", 0.24);
      playTone(0.14, 0.18, 340, 220, "sine", 0.22);
      break;

    case "quiz":
      // quick thinking pop
      playTone(0, 0.08, 540, 780, "triangle", 0.24);
      playTone(0.10, 0.10, 700, 980, "triangle", 0.22);
      break;

    case "rocket":
      playTone(0, 0.26, 140, 1300, "sawtooth", 0.30);
      break;

    case "toggle":
      playTone(0, 0.08, 500, 700, "triangle", 0.24);
      playTone(0.09, 0.08, 700, 900, "triangle", 0.24);
      break;

    default:
      playTone(0, 0.08, 500, 680, "sine", 0.20);
      break;
  }
}

// Init
renderModules();
renderGames();
renderBadges();
renderStudents();

// First load toast
setTimeout(() => {
  showToast("Welcome to Tannu Sir's BrightByte Galaxy!");
}, 700);
