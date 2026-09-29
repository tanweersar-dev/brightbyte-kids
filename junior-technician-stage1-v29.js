(() => {
"use strict";

/* ============================================================
   V29 — Stage 1 Real Device Clarity Upgrade
   Safe add-on for Stage 1 only
   Uses existing Stage 1 endpoint IDs
   Does NOT change scoring / unlocking / mission logic
   ============================================================ */

const DEVICE_GROUPS = [
  {
    key: "monitor",
    label: "🖥️ Monitor",
    tip: "Screen display",
    anchorIds: ["monitor-hdmi"],
    dx: -10,
    dy: -34
  },
  {
    key: "system",
    label: "🧠 System Unit / CPU",
    tip: "Main computer box",
    anchorIds: ["tower-hdmi"],
    dx: 30,
    dy: -40
  },
  {
    key: "keyboard",
    label: "⌨️ Keyboard",
    tip: "Typing device",
    anchorIds: ["keyboard-plug"],
    dx: -6,
    dy: -26
  },
  {
    key: "mouse",
    label: "🖱️ Mouse",
    tip: "Move & click",
    anchorIds: ["mouse-plug"],
    dx: 0,
    dy: -26
  },
  {
    key: "router",
    label: "🌐 Router",
    tip: "Internet / network",
    anchorIds: ["router-lan"],
    dx: -12,
    dy: -32
  },
  {
    key: "speaker",
    label: "🔊 Speaker",
    tip: "Audio output",
    anchorIds: ["speaker-in"],
    dx: 18,
    dy: -28
  },
  {
    key: "printer",
    label: "🖨️ Printer",
    tip: "Print documents",
    anchorIds: ["printer-usb"],
    dx: 8,
    dy: -28
  },
  {
    key: "ups",
    label: "🔋 UPS / Power Backup",
    tip: "Power extension / backup board",
    anchorIds: ["ups-out1", "ups-out2", "ups-in"],
    dx: 0,
    dy: -26
  },
  {
    key: "wall",
    label: "⚡ Wall Socket",
    tip: "Electricity from wall",
    anchorIds: ["wall-power"],
    dx: -8,
    dy: -28
  }
];

const ENDPOINT_CLASS_MAP = {
  power: ["tower-power", "monitor-power", "ups-in", "ups-out1", "ups-out2", "wall-power"],
  usb: ["keyboard-plug", "mouse-plug", "tower-usb1", "tower-usb2", "printer-usb", "tower-printer"],
  network: ["tower-lan", "router-lan"],
  display: ["monitor-hdmi", "tower-hdmi"],
  audio: ["speaker-in", "tower-audio"]
};

let refreshTimer = null;
let observer = null;

function $(id){
  return document.getElementById(id);
}

function simulatorEl(){
  return $("simulator");
}

function stage1Active(){
  const title = (($("environmentTitle")?.textContent || "") + " " + ($("stageName")?.textContent || "")).trim();
  return /Port\s*&\s*Device\s*Master/i.test(title) || !!$("keyboard-plug");
}

function scheduleRefresh(){
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refreshStage1Upgrade, 60);
}

function clamp(value, min, max){
  return Math.max(min, Math.min(max, value));
}

function getAnchorElement(group){
  for(const id of group.anchorIds){
    const el = $(id);
    if(el) return el;
  }
  return null;
}

function createLegend(sim){
  const parent = sim.parentElement;
  if(!parent) return null;

  let legend = parent.querySelector(".stage1-real-legend");
  if(legend) return legend;

  legend = document.createElement("div");
  legend.className = "stage1-real-legend";
  legend.innerHTML = `
    <div class="stage1-real-legend-head">
      <div>
        <b>🔍 Real Device Guide — Stage 1</b><br>
        <small>Ab bacchon ko clearly dikhai dega kaun sa device keyboard, mouse, monitor, UPS aur wall socket hai.</small>
      </div>
      <span class="stage1-real-badge">✅ Clarity Upgrade Active</span>
    </div>

    <div class="stage1-real-grid">
      <div class="stage1-real-card">
        <span>🖥️</span>
        <div><b>Monitor</b><small>Screen hota hai. Isme display cable aur power cable lagti hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>🧠</span>
        <div><b>System Unit / CPU</b><small>Main computer box. Keyboard, mouse, LAN, audio aur printer yahin connect hote hain.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>⌨️</span>
        <div><b>Keyboard</b><small>Typing ke liye. USB port me connect hota hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>🖱️</span>
        <div><b>Mouse</b><small>Pointer chalane ke liye. Ye bhi USB port me connect hota hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>🌐</span>
        <div><b>Router</b><small>Network / internet device. LAN cable system unit se connect hoti hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>🔋</span>
        <div><b>UPS / Power Backup</b><small>Ye backup power / extension board jaisa kaam karta hai. Monitor aur system unit ko power deta hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>⚡</span>
        <div><b>Wall Socket</b><small>Electricity yahan se aati hai aur UPS input me jati hai.</small></div>
      </div>
      <div class="stage1-real-card">
        <span>🖨️</span>
        <div><b>Printer & Speaker</b><small>Printer USB se aur speaker audio port se connect hota hai.</small></div>
      </div>
    </div>

    <div class="stage1-real-help">
      <b>Teacher note:</b> “Power extension board” samajhne ke liye is lab me <b>UPS / Power Backup</b> ko highlight kiya gaya hai — bachche easily power flow samajh payenge:
      <b>Wall Socket → UPS → Monitor / System Unit</b>
    </div>
  `;

  parent.insertBefore(legend, sim);
  return legend;
}

function ensureOverlay(sim){
  let overlay = sim.querySelector(".stage1-real-overlay");
  if(!overlay){
    overlay = document.createElement("div");
    overlay.className = "stage1-real-overlay";
    sim.appendChild(overlay);
  }
  return overlay;
}

function relativePos(el, sim){
  const a = el.getBoundingClientRect();
  const b = sim.getBoundingClientRect();
  return {
    x: (a.left - b.left) + (a.width / 2),
    y: (a.top - b.top) + (a.height / 2)
  };
}

function paintDeviceLabels(sim){
  const overlay = ensureOverlay(sim);
  overlay.innerHTML = "";

  const maxW = sim.clientWidth - 12;
  const maxH = sim.clientHeight - 12;

  for(const group of DEVICE_GROUPS){
    const anchor = getAnchorElement(group);
    if(!anchor) continue;

    const p = relativePos(anchor, sim);
    const chip = document.createElement("div");
    chip.className = `stage1-real-device-label ${group.key}`;
    chip.innerHTML = `<b>${group.label}</b><small>${group.tip}</small>`;

    const x = clamp(p.x + group.dx, 70, Math.max(70, maxW - 70));
    const y = clamp(p.y + group.dy, 28, Math.max(28, maxH - 18));

    chip.style.left = `${x}px`;
    chip.style.top = `${y}px`;
    overlay.appendChild(chip);
  }
}

function clearEndpointClasses(){
  const classes = [
    "v29-endpoint-boost",
    "v29-endpoint-power",
    "v29-endpoint-usb",
    "v29-endpoint-network",
    "v29-endpoint-display",
    "v29-endpoint-audio"
  ];

  classes.forEach(cls => {
    document.querySelectorAll("." + cls).forEach(el => el.classList.remove(cls));
  });
}

function styleEndpoints(){
  clearEndpointClasses();

  Object.entries(ENDPOINT_CLASS_MAP).forEach(([type, ids]) => {
    ids.forEach(id => {
      const el = $(id);
      if(!el) return;
      el.classList.add("v29-endpoint-boost");
      el.classList.add("v29-endpoint-" + type);
    });
  });
}

function cleanupStage1Upgrade(){
  document.querySelectorAll(".stage1-real-legend").forEach(el => el.remove());
  document.querySelectorAll(".stage1-real-overlay").forEach(el => el.remove());

  const sim = simulatorEl();
  if(sim) sim.classList.remove("v29-stage1-enhanced");

  clearEndpointClasses();
}

function refreshStage1Upgrade(){
  const sim = simulatorEl();
  if(!sim) return;

  if(!stage1Active()){
    cleanupStage1Upgrade();
    return;
  }

  sim.classList.add("v29-stage1-enhanced");
  createLegend(sim);
  styleEndpoints();
  paintDeviceLabels(sim);
}

function init(){
  scheduleRefresh();

  window.addEventListener("resize", scheduleRefresh);
  document.addEventListener("click", () => setTimeout(scheduleRefresh, 80), true);
  document.addEventListener("visibilitychange", () => {
    if(!document.hidden) scheduleRefresh();
  });

  observer = new MutationObserver(() => scheduleRefresh());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false
  });

  setTimeout(scheduleRefresh, 200);
  setTimeout(scheduleRefresh, 600);
  setTimeout(scheduleRefresh, 1200);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
}else{
  init();
}

})();
