(() => {
"use strict";

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const token = localStorage.getItem(TOKEN_KEY) || "";

const STAGES = [
  {id:1, icon:"🔌", short:"Ports"},
  {id:2, icon:"🧩", short:"Build"},
  {id:3, icon:"🪟", short:"Windows"},
  {id:4, icon:"🤖", short:"AI"},
  {id:5, icon:"🚨", short:"Final"}
];

let currentProfile = null;

function labKey(profile){
  return `tannu_junior_technician_v24_${profile?.user_id || profile?.username || "student"}`;
}

function readLabState(profile){
  try{
    const raw = localStorage.getItem(labKey(profile));
    const data = raw ? JSON.parse(raw) : {};
    return {
      unlocked: Math.max(1, Number(data?.unlocked || 1)),
      completed: Array.isArray(data?.completed)
        ? data.completed.map(Number).filter(n=>n>=1&&n<=5)
        : [],
      certificateId: String(data?.certificateId || ""),
      completedAt: String(data?.completedAt || "")
    };
  }catch{
    return {unlocked:1,completed:[],certificateId:"",completedAt:""};
  }
}

async function getProfile(){
  if(!token) return null;
  try{
    const r = await fetch(API + "/api/auth/me",{
      headers:{Authorization:`Bearer ${token}`},
      cache:"no-store"
    });
    const d = await r.json();
    if(!r.ok || d.role!=="student" || !d.profile) return null;
    const c = Number(d.profile.class_number || 1);
    if(c<4 || c>6) return null;
    return d.profile;
  }catch{
    return null;
  }
}

function featureHtml(profile,state){
  const completed = [...new Set(state.completed)].sort((a,b)=>a-b);
  const count = completed.length;
  const percent = Math.round((count/5)*100);
  const nextStage = count>=5 ? 5 : Math.max(1, Math.min(5, Number(state.unlocked||count+1)));

  const buttonText = count===0
    ? "▶ Start 5-Stage Practical Lab"
    : count>=5
      ? "🏆 Open Lab & Certificate"
      : `▶ Continue Stage ${nextStage}`;

  const statusText = count>=5
    ? "CERTIFICATION COMPLETED"
    : count===0
      ? "READY TO START"
      : `${count} OF 5 STAGES CLEARED`;

  const classNo = Number(profile.class_number||4);
  const classMessage = classNo===4
    ? "Guided hands-on practice: identify, connect and build confidence."
    : classNo===5
      ? "Applied practical missions: connect, install, operate and diagnose."
      : "Advanced missions: assemble, troubleshoot, verify and solve independently.";

  const stageMap = STAGES.map(s=>{
    const done = completed.includes(s.id);
    const ready = !done && s.id===nextStage && count<5;
    const stateClass = done ? "done" : ready ? "ready" : "";
    const marker = done ? "✅" : ready ? "🔓" : "🔒";
    return `<div class="adv-stage-dot ${stateClass}">
      <span>${done ? "✅" : s.icon}</span>
      <small>${marker} ${s.short}</small>
    </div>`;
  }).join("");

  return `
    <section id="advPracticalFeature" class="adv-practical-feature" aria-label="Junior Digital and AI Technician Practical Lab">
      <div class="adv-practical-feature-inner">
        <div class="adv-lab-visual" aria-hidden="true">
          <span class="adv-lab-wall-label">ADVANCED IT TRAINING BAY</span>
          <div class="adv-lab-desk"></div>
          <div class="adv-lab-monitor"></div>
          <div class="adv-lab-tower"></div>
          <div class="adv-lab-board"></div>
          <div class="adv-lab-cable"></div>
          <div class="adv-lab-bot">🤖</div>
          <div class="adv-lab-live"><i></i> PRACTICAL LAB ONLINE</div>
        </div>

        <div class="adv-practical-copy">
          <span class="adv-practical-kicker">🧪 MAIN PRACTICAL CERTIFICATION • CLASS ${classNo}</span>
          <h2>Junior Digital & AI Technician Lab</h2>
          <p>
            Work inside a realistic training environment. Connect hardware, assemble internal
            computer parts, operate Windows, use AI safely and solve technician support faults.
            ${classMessage}
          </p>
          <div class="adv-practical-skills">
            <span>🔌 Ports & Devices</span>
            <span>🧩 PC Assembly</span>
            <span>🪟 Windows</span>
            <span>🤖 AI Skills</span>
            <span>🔧 Troubleshooting</span>
          </div>
        </div>

        <div class="adv-practical-progress">
          <div class="adv-progress-head">
            <div>
              <small>${statusText}</small>
              <b>${count>=5 ? "Junior Technician Certified" : `Stage ${nextStage} ${count===0 ? "is ready" : "unlocked"}`}</b>
            </div>
            <div class="adv-progress-percent">${percent}%</div>
          </div>

          <div class="adv-progress-bar"><i style="width:${percent}%"></i></div>

          <div class="adv-stage-mini-map">${stageMap}</div>

          <a class="adv-practical-start" href="junior-technician-lab.html">${buttonText}</a>

          <small class="adv-practical-note">
            Complete all 5 stages with the required pass score to unlock the
            Junior Digital & AI Technician — Level 2 certificate.
          </small>
        </div>
      </div>
    </section>
  `;
}

function mountFeature(){
  if(!currentProfile) return;

  const old = document.getElementById("advPracticalFeature");
  if(old) old.remove();

  const mission = document.querySelector(".mission-strip");
  const sectionHead = document.querySelector(".section-head");
  const host = mission || sectionHead;
  if(!host) return;

  const state = readLabState(currentProfile);
  host.insertAdjacentHTML("afterend", featureHtml(currentProfile,state));
}

async function init(){
  currentProfile = await getProfile();
  if(!currentProfile) return;

  mountFeature();

  window.addEventListener("pageshow",()=>mountFeature());
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden) mountFeature();
  });
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",()=>setTimeout(init,180));
}else{
  setTimeout(init,180);
}

})();
