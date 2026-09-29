(() => {
"use strict";

/* ============================================================
   V30 — Stage 1 English Guide + Back Button + Clear Bench Labels
   Safe add-on after V29
   Does NOT change scoring / unlocking / stage rules
   ============================================================ */

const HOME_URL = "advanced-universe.html";

const GUIDE_HTML = `
  <div class="v30-guide-head">
    <div>
      <b>🔍 Real Device Guide — Stage 1</b><br>
      <small>This version uses clear English labels so students can easily identify each device before making connections.</small>
    </div>
    <span class="v30-guide-badge">✅ English Clarity Upgrade</span>
  </div>

  <div class="v30-guide-grid">
    <div class="v30-guide-card">
      <span>🖥️</span>
      <div><b>Monitor</b><small>The monitor is the screen. It needs a display cable and a power cable.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>🧠</span>
      <div><b>CPU / System Unit</b><small>This is the main computer box. Keyboard, mouse, LAN, audio and printer connect here.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>⌨️</span>
      <div><b>Keyboard</b><small>The keyboard is used for typing. It connects to a USB port.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>🖱️</span>
      <div><b>Mouse</b><small>The mouse is used to move and click the pointer. It also connects to a USB port.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>🌐</span>
      <div><b>Router</b><small>The router provides network access. The LAN cable connects the computer to the router.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>🔋</span>
      <div><b>UPS / Power Board</b><small>The UPS provides backup power. It acts like a protected power extension for the system unit and monitor.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>⚡</span>
      <div><b>Wall Socket</b><small>Electricity comes from the wall socket and goes into the UPS input.</small></div>
    </div>
    <div class="v30-guide-card">
      <span>🖨️</span>
      <div><b>Printer</b><small>The printer is placed separately and connects to the computer with the printer USB cable.</small></div>
    </div>
  </div>

  <div class="v30-guide-note">
    <b>Simple power flow:</b> <b>Wall Socket → UPS / Power Board → Monitor + CPU / System Unit</b>
  </div>
`;

const LABELS = [
  { cls: "monitor",  text: "MONITOR",            anchorIds: ["monitor-hdmi"],                    dx: 0,   dy: -58 },
  { cls: "cpu",      text: "CPU",                anchorIds: ["tower-hdmi"],                      dx: 52,  dy: -66 },
  { cls: "keyboard", text: "KEYBOARD",           anchorIds: ["keyboard-plug"],                   dx: -10, dy: -18 },
  { cls: "mouse",    text: "MOUSE",              anchorIds: ["mouse-plug"],                      dx: 20,  dy: -18 },
  { cls: "ups",      text: "UPS / POWER BOARD",  anchorIds: ["ups-out1", "ups-out2", "ups-in"], dx: 0,   dy: 34  },
  { cls: "printer",  text: "PRINTER",            anchorIds: ["printer-usb"],                     dx: 90,  dy: -18 },
  { cls: "wall",     text: "WALL SOCKET",        anchorIds: ["wall-power"],                      dx: 8,   dy: -30 }
];

let refreshTimer = null;
let observer = null;

function $(id){
  return document.getElementById(id);
}

function simulatorEl(){
  return $("simulator");
}

function stage1Active(){
  const stage = ($("stageName")?.textContent || "").trim();
  const env = ($("environmentTitle")?.textContent || "").trim();
  return /Port\s*&\s*Device\s*Master/i.test(stage + " " + env) || !!$("keyboard-plug");
}

function scheduleRefresh(){
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshV30, 70);
}

function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

function getAnchor(anchorIds){
  for(const id of anchorIds){
    const el = $(id);
    if(el) return el;
  }
  return null;
}

function getRelativeCenter(el, box){
  const a = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  return {
    x: (a.left - b.left) + a.width / 2,
    y: (a.top - b.top) + a.height / 2
  };
}

/* ------------------------------------------------------------
   Back button
   ------------------------------------------------------------ */
function mountBackButton(){
  const shell = document.querySelector(".app-shell");
  if(!shell) return;

  let row = document.querySelector(".v30-back-row");
  if(row) return;

  row = document.createElement("div");
  row.className = "v30-back-row";
  row.innerHTML = `
    <a class="v30-back-btn" href="${HOME_URL}">← Back to Student Home</a>
  `;

  const firstSection = shell.querySelector(".stage-map-wrap");
  if(firstSection){
    shell.insertBefore(row, firstSection);
  }else{
    shell.prepend(row);
  }
}

/* ------------------------------------------------------------
   English guide
   ------------------------------------------------------------ */
function mountGuide(){
  const workArea = document.querySelector(".work-area");
  const simulator = simulatorEl();
  if(!workArea || !simulator) return;

  let guide = workArea.querySelector(".v30-stage1-guide");
  if(!guide){
    guide = document.createElement("div");
    guide.className = "v30-stage1-guide";
    const learnPanel = $("learnPanel");
    if(learnPanel){
      learnPanel.insertAdjacentElement("afterend", guide);
    }else{
      workArea.insertBefore(guide, simulator);
    }
  }

  guide.innerHTML = GUIDE_HTML;
}

/* ------------------------------------------------------------
   Overlay labels + decorative visuals
   ------------------------------------------------------------ */
function ensureOverlay(sim){
  let overlay = sim.querySelector(".v30-stage1-overlay");
  if(!overlay){
    overlay = document.createElement("div");
    overlay.className = "v30-stage1-overlay";
    sim.appendChild(overlay);
  }
  return overlay;
}

function addLabel(overlay, sim, item){
  const anchor = getAnchor(item.anchorIds);
  if(!anchor) return;

  const p = getRelativeCenter(anchor, sim);
  const maxW = sim.clientWidth - 12;
  const maxH = sim.clientHeight - 12;

  const chip = document.createElement("div");
  chip.className = `v30-bench-label ${item.cls}`;
  chip.textContent = item.text;

  chip.style.left = `${clamp(p.x + item.dx, 70, Math.max(70, maxW - 70))}px`;
  chip.style.top = `${clamp(p.y + item.dy, 24, Math.max(24, maxH - 16))}px`;

  overlay.appendChild(chip);
}

function addDecorativeKeyboard(overlay, sim){
  const anchor = $("keyboard-plug");
  if(!anchor) return;
  const p = getRelativeCenter(anchor, sim);

  const el = document.createElement("div");
  el.className = "v30-deco v30-keyboard-visual";
  el.style.left = `${p.x - 45}px`;
  el.style.top = `${p.y - 4}px`;
  overlay.appendChild(el);
}

function addDecorativeMouse(overlay, sim){
  const anchor = $("mouse-plug");
  if(!anchor) return;
  const p = getRelativeCenter(anchor, sim);

  const el = document.createElement("div");
  el.className = "v30-deco v30-mouse-visual";
  el.style.left = `${p.x - 10}px`;
  el.style.top = `${p.y - 7}px`;
  overlay.appendChild(el);
}

function addDecorativePowerBoard(overlay, sim){
  const anchor = getAnchor(["ups-out1", "ups-out2", "ups-in"]);
  if(!anchor) return;
  const p = getRelativeCenter(anchor, sim);

  const el = document.createElement("div");
  el.className = "v30-deco v30-powerboard-visual";
  el.style.left = `${p.x - 44}px`;
  el.style.top = `${p.y + 12}px`;
  overlay.appendChild(el);
}

function addDecorativePrinter(overlay, sim){
  const anchor = $("printer-usb");
  if(!anchor) return;
  const p = getRelativeCenter(anchor, sim);

  const el = document.createElement("div");
  el.className = "v30-deco v30-printer-visual";
  el.style.left = `${p.x + 34}px`;
  el.style.top = `${p.y - 8}px`;
  overlay.appendChild(el);
}

function paintOverlay(){
  const sim = simulatorEl();
  if(!sim) return;

  sim.classList.add("v30-stage1-enhanced");

  const overlay = ensureOverlay(sim);
  overlay.innerHTML = "";

  LABELS.forEach(item => addLabel(overlay, sim, item));
  addDecorativeKeyboard(overlay, sim);
  addDecorativeMouse(overlay, sim);
  addDecorativePowerBoard(overlay, sim);
  addDecorativePrinter(overlay, sim);
}

function cleanupV30(){
  document.querySelectorAll(".v30-stage1-guide").forEach(el => el.remove());
  document.querySelectorAll(".v30-stage1-overlay").forEach(el => el.remove());

  const sim = simulatorEl();
  if(sim) sim.classList.remove("v30-stage1-enhanced");
}

/* ------------------------------------------------------------
   Main refresh
   ------------------------------------------------------------ */
function refreshV30(){
  mountBackButton();

  if(!stage1Active()){
    cleanupV30();
    return;
  }

  mountGuide();
  paintOverlay();
}

function init(){
  scheduleRefresh();

  window.addEventListener("resize", scheduleRefresh);
  document.addEventListener("click", () => setTimeout(scheduleRefresh, 80), true);
  document.addEventListener("visibilitychange", () => {
    if(!document.hidden) scheduleRefresh();
  });

  const sim = simulatorEl();

   if(sim){
  observer = new MutationObserver((mutations) => {
    const meaningfulChange = mutations.some(mutation => {
      if(mutation.type !== "childList") return false;

      const target = mutation.target;

      if(
        target instanceof Element &&
        target.closest(".v30-stage1-overlay, .stage1-real-overlay")
      ){
        return false;
      }

      return true;
    });

    if(meaningfulChange){
      scheduleRefresh();
    }
  });

  observer.observe(sim, {
    childList: true,
    subtree: true
  });
}

  setTimeout(scheduleRefresh, 200);
  setTimeout(scheduleRefresh, 700);
  setTimeout(scheduleRefresh, 1300);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
}else{
  init();
}

})();
