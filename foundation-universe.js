/* ============================================================
   V40.14 — FOUNDATION SKILLS UNIVERSE • CLASS 1–3
   Presentation + navigation only.
   Existing student-profile course/progress remains the source of truth.
   ============================================================ */
(() => {
"use strict";

const API = "https://api.tanweer.site";
const TOKEN_KEY = "brightbyte_student_token";
const VOICE_KEY = "foundation_voice_v4014";

const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[ch]));

let token = localStorage.getItem(TOKEN_KEY) || "";
let profile = null;
let course = {
  day:1,
  stars:120,
  completed:[],
  skills:{}
};
let settings = {streak_days:0};
let voiceOn = localStorage.getItem(VOICE_KEY) !== "off";
let photoUrl = "";
let toastTimer = null;
let activeWorld = null;

const worlds = [
  {
    id:"computer", icon:"💻", title:"Computer Basics",
    colors:["#3f8efc","#25c6c1"], view:"lessons",
    desc:{
      1:"Meet a computer and name the monitor, mouse, keyboard and system unit.",
      2:"Practise using computers safely and understand what common parts do.",
      3:"Build confidence with desktop basics, files, folders and simple settings."
    },
    focus:{
      1:["Desktop or laptop","Monitor & system unit","What computers help us do","Gentle device care"],
      2:["Computer parts","Start and shutdown","Files and folders","Simple school tasks"],
      3:["Windows desktop","Organise files","Storage basics","Explain a computer part"]
    }
  },
  {
    id:"mousekeys", icon:"🖱️", title:"Mouse & Keyboard",
    colors:["#9b5be8","#ef4ca7"], view:"lessons",
    desc:{
      1:"Point, click, find letters and numbers, and learn the Spacebar.",
      2:"Practise double-click, drag, scroll, Enter, Backspace and Shift.",
      3:"Type more accurately and use a few simple shortcuts with confidence."
    },
    focus:{
      1:["Move the pointer","Left click","Letters & numbers","Spacebar"],
      2:["Double click","Drag & drop","Enter & Backspace","Shift & Caps Lock"],
      3:["Typing accuracy","Arrow keys","Copy & paste idea","Healthy typing posture"]
    }
  },
  {
    id:"itlab", icon:"🧪", title:"Safe IT Lab",
    colors:["#25b4d8","#47d7b4"], href:"virtual-it-lab.html",
    desc:{
      1:"Look at real-style computer devices and learn where each part belongs.",
      2:"Practise simple connections and safe computer-lab steps.",
      3:"Try guided beginner checks and explain what you tested."
    },
    focus:{
      1:["See devices","Match simple parts","Use safe hands","Ask before connecting"],
      2:["Cable matching","Monitor & mouse","Keyboard practice","Safe power habits"],
      3:["Check connections","Simple no-sound check","Simple no-display check","Tell what you tested"]
    }
  },
  {
    id:"english", icon:"🗣️", title:"English & Speaking",
    colors:["#f85a8b","#ff9a63"], view:"speaking",
    desc:{
      1:"Say hello, your name and a few simple classroom words.",
      2:"Talk about feelings, school, family and ask for help politely.",
      3:"Speak in short clear sentences and explain one thing you learned."
    },
    focus:{
      1:["Hello & goodbye","My name is…","Please & thank you","Listen and repeat"],
      2:["Feelings","Classroom English","Ask for help","Talk about school"],
      3:["Speak clearly","Describe a device","Mini presentation","Teach back"]
    }
  },
  {
    id:"gk", icon:"🌍", title:"GK & Curiosity",
    colors:["#3d9ae8","#5577f4"], view:"gk",
    desc:{
      1:"Explore simple facts about India, Bihar, nature, places and everyday life.",
      2:"Grow general knowledge with pictures, questions and world facts.",
      3:"Compare simple facts and practise explaining what you know."
    },
    focus:{
      1:["India & Bihar","Animals & nature","Places around us","Simple science facts"],
      2:["States & places","Earth & space basics","Plants & animals","Everyday GK"],
      3:["India & world","Science curiosity","Maps & flags","Explain a fact"]
    }
  },
  {
    id:"healthy", icon:"🥗", title:"Healthy Me",
    colors:["#31bd72","#58cc84"], view:"healthy",
    desc:{
      1:"Learn water, clean hands, good sleep and simple screen breaks.",
      2:"Build healthy food, hygiene, movement and routine habits.",
      3:"Plan a balanced day with study, play, movement, sleep and smart screen time."
    },
    focus:{
      1:["Drink water","Wash hands","Sleep well","Rest your eyes"],
      2:["Everyday foods","Brush teeth","Move your body","Screen breaks"],
      3:["Balanced routine","Healthy choices","Posture","Teach a healthy habit"]
    }
  },
  {
    id:"safety", icon:"🛡️", title:"Safety & Kindness",
    colors:["#4d7feb","#795fd8"], view:"citizen",
    desc:{
      1:"Know trusted adults, private information and kind online behaviour.",
      2:"Practise safe choices at home, on the road and online.",
      3:"Recognise risky messages, protect passwords and make respectful digital choices."
    },
    focus:{
      1:["Trusted adult","Keep secrets safe","Be kind","Ask before clicking"],
      2:["Road safety","Home safety","Online kindness","Private information"],
      3:["Password safety","Unknown links","Safe downloads","Respect online"]
    }
  },
  {
    id:"games", icon:"🎮", title:"Smart Games",
    colors:["#6959ef","#3e90f3"], view:"practice",
    desc:{
      1:"Play simple memory, matching and focus games.",
      2:"Practise logic, mouse, typing and observation through short games.",
      3:"Use games to strengthen thinking, accuracy and beginner problem solving."
    },
    focus:{
      1:["Memory","Matching","Focus","Mouse control"],
      2:["Patterns","Typing","Logic","Observation"],
      3:["Problem solving","Accuracy","Speed with care","Challenge yourself"]
    }
  },
  {
    id:"creative", icon:"🎨", title:"Create & Draw",
    colors:["#e957ba","#b55bd7"], view:"portfolio",
    desc:{
      1:"Draw with shapes and colours and save something you are proud of.",
      2:"Make a simple digital picture or mini school poster.",
      3:"Create small digital work and explain what you made."
    },
    focus:{
      1:["Shapes","Colours","Simple drawing","Show your work"],
      2:["Mini poster","Add a title","Choose pictures","Keep it neat"],
      3:["Plan a small project","Create","Review","Explain"]
    }
  },
  {
    id:"ai", icon:"🤖", title:"Friendly AI Basics",
    colors:["#f25cb7","#8e68f2"], view:"lessons",
    desc:{
      1:"Meet AI as a tool that can answer, create and sometimes make mistakes.",
      2:"Ask simple safe questions without sharing private information.",
      3:"Write a clear beginner prompt and remember to check important answers."
    },
    focus:{
      1:["What AI can do","AI is a tool","Never share passwords","Ask a trusted adult"],
      2:["Simple prompts","Private information","AI can be wrong","Use kind questions"],
      3:["Clear prompt","Check answers","Safe learning use","Human thinking matters"]
    }
  },
  {
    id:"internet", icon:"📶", title:"Internet & Wi-Fi",
    colors:["#26b9d0","#46a6ef"], view:"lessons",
    desc:{
      1:"Learn that websites can be opened using the internet and Wi-Fi.",
      2:"Meet browser, website, Wi-Fi and a router in simple words.",
      3:"Understand a small home or school network and practise safe first checks."
    },
    focus:{
      1:["Internet idea","Website","Wi-Fi symbol","Ask before going online"],
      2:["Browser","Wi-Fi","Router","Safe websites"],
      3:["Devices connect","Simple network","Check Wi-Fi first","Protect passwords"]
    }
  },
  {
    id:"tests", icon:"🏆", title:"Tests & Achievements",
    colors:["#f49b3f","#ff6f75"], view:"tests",
    desc:{
      1:"Take friendly checks after learning and celebrate what you remember.",
      2:"Use weekly and monthly tests to see what needs more practice.",
      3:"Read your results, learn from mistakes and build confidence step by step."
    },
    focus:{
      1:["Friendly questions","Try your best","See your score","Keep learning"],
      2:["Weekly checks","Monthly review","Practise again","Earn badges"],
      3:["Detailed result","Correct answers","Practice next","Celebrate progress"]
    }
  }
];

function parseMaybe(v, fallback){
  try{
    if(v == null) return fallback;
    if(typeof v === "string") return JSON.parse(v);
    return v;
  }catch{
    return fallback;
  }
}

function completedSet(){
  return new Set(Array.isArray(course.completed) ? course.completed : []);
}

function skillPct(name){
  return Math.max(0,Math.min(100,Number(course.skills?.[name] || 0)));
}

function countBadges(){
  const set = completedSet();
  const lessonDone = id => set.has(id);
  const d = [...set].filter(x => /^L\d+$/.test(String(x))).length;
  const g = [...set].filter(x => String(x).startsWith("game:")).length;
  return [
    d>=1,
    d>=10,
    lessonDone("L5"),
    lessonDone("L7"),
    skillPct("English")>=30,
    skillPct("Safety")>=30,
    skillPct("AI")>=25,
    g>=3,
    g>=12,
    d>=30,
    d>=60
  ].filter(Boolean).length;
}

function classStage(c){
  if(c===1) return {
    eyebrow:"LEVEL 1A • DISCOVER WITH PICTURES & VOICE",
    title:"Look. Listen. Tap. Discover.",
    text:"Meet computers, mouse and keyboard, simple English, safety, healthy habits, GK and confidence through big pictures and friendly guided practice.",
    intro:"Big pictures, short words and guided practice. Every world follows Look → Listen → Try → Learn."
  };
  if(c===2) return {
    eyebrow:"LEVEL 1B • PRACTISE & GROW",
    title:"Try. Repeat. Practise. Grow.",
    text:"Strengthen computer control, typing, spoken English, healthy habits, safety, simple internet ideas and beginner problem solving through short practice.",
    intro:"Short practice, repetition and simple challenges. Every world follows Look → Listen → Try → Learn."
  };
  return {
    eyebrow:"LEVEL 1C • BUILD CONFIDENCE",
    title:"Learn. Practise. Explain. Shine.",
    text:"Build confidence with digital basics, files, safe internet and AI habits, spoken English, creativity, beginner troubleshooting and simple independent tasks.",
    intro:"Clear steps, small projects and teach-back. Every world follows Look → Listen → Try → Learn."
  };
}

function viewHref(view){
  return `student-profile.html?view=${encodeURIComponent(view)}`;
}

function worldTarget(w){
  return w.href || viewHref(w.view || "dashboard");
}

function speak(text){
  if(!voiceOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = "en-US";
  u.rate = .84;
  u.pitch = 1.06;
  const voices = speechSynthesis.getVoices();
  u.voice =
    voices.find(v => /female|zira|samantha|aria|jenny|hazel|sonia/i.test(v.name) && /en/i.test(v.lang)) ||
    voices.find(v => /en-(US|GB)/i.test(v.lang)) ||
    voices.find(v => /en/i.test(v.lang)) ||
    null;
  speechSynthesis.speak(u);
}

function updateVoiceButton(){
  const b = $("voiceBtn");
  if(!b) return;
  b.textContent = voiceOn ? "🔊 Voice On" : "🔇 Voice Off";
  b.setAttribute("aria-pressed",voiceOn ? "true" : "false");
}

function toast(text){
  const el = $("toast");
  if(!el) return;
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove("show"),1800);
}

async function api(path,opt={}){
  const headers = {...(opt.headers||{}),Authorization:`Bearer ${token}`};
  if(opt.body && !(opt.body instanceof FormData) && !headers["Content-Type"]){
    headers["Content-Type"]="application/json";
  }
  return fetch(API+path,{...opt,headers,cache:"no-store"});
}

async function loadPhoto(){
  if(!profile?.has_photo) return;
  try{
    const r = await api("/api/student/photo");
    if(!r.ok) return;
    const blob = await r.blob();
    if(photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(blob);
    $("studentPhoto").src = photoUrl;
    $("studentPhoto").hidden = false;
    $("photoFallback").hidden = true;
  }catch{}
}

function renderStats(){
  const set = completedSet();
  const lessons = [...set].filter(x => /^L\d+$/.test(String(x))).length;

  $("starsCount").textContent = Number(course.stars || 120);
  $("lessonCount").textContent = lessons;
  $("streakCount").textContent = Number(settings.streak_days || 0);
  $("badgeCount").textContent = countBadges();
}

function renderDailyMissions(){
  const day = Number(course.day || 1);
  const set = completedSet();

  const missions = [
    {
      icon:"📘",title:"Learn",
      text:"Complete or review one lesson",
      done:set.has(`mission:${day}:0`),
      href:viewHref("lessons")
    },
    {
      icon:"🗣️",title:"Speak",
      text:"Say one clear English sentence",
      done:set.has(`mission:${day}:1`),
      href:viewHref("speaking")
    },
    {
      icon:"🎮",title:"Play",
      text:"Finish one smart game level",
      done:set.has(`mission:${day}:2`),
      href:viewHref("practice")
    }
  ];

  $("dailyMissions").innerHTML = missions.map(m => `
    <button class="daily-mission ${m.done?"done":""}" data-mission-href="${esc(m.href)}" type="button">
      <span>${m.icon}</span>
      <b>${m.done?"✅ ":""}${esc(m.title)}</b>
      <small>${esc(m.text)}</small>
    </button>
  `).join("");

  document.querySelectorAll("[data-mission-href]").forEach(b=>{
    b.onclick=()=>location.href=b.dataset.missionHref;
  });
}

function renderWorlds(){
  const c = Number(profile?.class_number || 1);

  $("worldGrid").innerHTML = worlds.map(w => `
    <article
      class="world-card"
      data-world="${esc(w.id)}"
      tabindex="0"
      role="button"
      style="--c1:${w.colors[0]};--c2:${w.colors[1]}"
      aria-label="Open ${esc(w.title)}"
    >
      <div class="world-icon">${w.icon}</div>
      <h3>${esc(w.title)}</h3>
      <p>${esc(w.desc[c] || w.desc[1])}</p>
      <div class="world-meta">
        <span>CLASS ${c}</span>
        <span>OPEN ↗</span>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-world]").forEach(card=>{
    const open=()=>openWorld(card.dataset.world);
    card.onclick=open;
    card.onkeydown=e=>{
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        open();
      }
    };
  });
}

function openWorld(id){
  const w = worlds.find(x=>x.id===id);
  if(!w || !profile) return;
  activeWorld = w;

  const c = Number(profile.class_number || 1);
  const focus = w.focus[c] || w.focus[1];
  const detail = w.desc[c] || w.desc[1];

  $("modalBody").innerHTML = `
    <div class="world-detail-head" style="--c1:${w.colors[0]};--c2:${w.colors[1]}">
      <div class="world-detail-icon">${w.icon}</div>
      <div>
        <span class="eyebrow dark">CLASS ${c} • FOUNDATION WORLD</span>
        <h2>${esc(w.title)}</h2>
        <p>${esc(detail)}</p>
      </div>
    </div>

    <div class="foundation-flow">
      <span>👀 Look</span>
      <span>👂 Listen</span>
      <span>👆 Try</span>
      <span>⭐ Learn</span>
    </div>

    <div class="focus-list">
      ${focus.map((item,i)=>`
        <div class="focus-item">
          <span>${i+1}</span>
          <b>${esc(item)}</b>
          <small>${esc(focusHelp(w.id,item,c))}</small>
        </div>
      `).join("")}
    </div>

    <div class="detail-actions">
      <button class="detail-hear" id="detailHear" type="button">🔊 Hear This</button>
      <a class="detail-open" href="${esc(worldTarget(w))}">Open Learning Area →</a>
    </div>
  `;

  $("detailHear").onclick=()=>speak(`${w.title}. ${detail}. ${focus.join(". ")}.`);
  $("worldModal").classList.add("open");
  $("worldModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}

function focusHelp(id,item,c){
  const simple = {
    computer:"Use pictures and real-life examples.",
    mousekeys:"Practise slowly. Accuracy comes before speed.",
    itlab:"Follow safe guided steps. Never force a cable.",
    english:"Listen first, then repeat in your own clear voice.",
    gk:"Look, think and answer one small question at a time.",
    healthy:"Choose one healthy habit you can practise today.",
    safety:"If unsure, stop and ask a trusted adult.",
    games:"Short games train memory, logic, focus and control.",
    creative:"Create something simple, neat and easy to explain.",
    ai:"Keep private information private and check important answers.",
    internet:"Use trusted websites and safe Wi-Fi with adult guidance.",
    tests:"Mistakes show what to practise next."
  };
  return simple[id] || `Class ${c} practice: ${item}.`;
}

function closeModal(){
  $("worldModal").classList.remove("open");
  $("worldModal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  activeWorld=null;
}

function highlightRoadmap(c){
  [1,2,3].forEach(n=>{
    $("roadmapClass"+n)?.classList.toggle("active",n===c);
  });
}

async function loadFoundation(){
  if(!token){
    location.href="student-login.html";
    return;
  }

  try{
    const r = await api("/api/auth/me");
    const d = await r.json();

    if(!r.ok || d.role!=="student" || !d.profile){
      throw new Error("Student login required");
    }

    profile = d.profile;
    const c = Number(profile.class_number || 1);

    if(c>=4 && c<=6){
      location.href="advanced-universe.html";
      return;
    }

    if(c<1 || c>3){
      location.href="student-profile.html";
      return;
    }

    $("studentChip").textContent = `👤 ${profile.display_name || profile.username || "Student"}`;
    $("classChip").textContent = `🎓 Class ${c}`;
    $("photoFallback").textContent = c===1 ? "🧒" : c===2 ? "👦" : "🧑";

    const stage = classStage(c);
    $("levelEyebrow").textContent = stage.eyebrow;
    $("heroTitle").textContent = stage.title;
    $("heroText").textContent = stage.text;
    $("worldIntro").textContent = stage.intro;
    highlightRoadmap(c);

    const [progressRes,settingsRes] = await Promise.all([
      api("/api/student/course-progress").catch(()=>null),
      api("/api/student/settings").catch(()=>null)
    ]);

    if(progressRes?.ok){
      const x = await progressRes.json();
      const p = x.progress || {};
      course = {
        day:Number(p.day_number || 1),
        stars:Number(p.stars || profile.stars || 120),
        completed:parseMaybe(p.daily_completed,[]),
        skills:parseMaybe(p.skill_scores,{})
      };
    }else{
      course.stars = Number(profile.stars || 120);
    }

    if(settingsRes?.ok){
      const x = await settingsRes.json();
      settings = x.settings || settings;
    }

    renderStats();
    renderDailyMissions();
    renderWorlds();
    await loadPhoto();

  }catch(err){
    localStorage.removeItem(TOKEN_KEY);
    location.href="student-login.html";
  }
}

async function logout(){
  try{await api("/api/auth/logout",{method:"POST"})}catch{}
  localStorage.removeItem(TOKEN_KEY);
  location.href="index.html";
}

$("voiceBtn").onclick=()=>{
  voiceOn=!voiceOn;
  localStorage.setItem(VOICE_KEY,voiceOn?"on":"off");
  updateVoiceButton();
  if(voiceOn) speak("Voice guidance is on.");
};

$("logoutBtn").onclick=logout;
$("modalClose").onclick=closeModal;
$("worldModal").addEventListener("click",e=>{
  if(e.target===$("worldModal")) closeModal();
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape" && $("worldModal").classList.contains("open")) closeModal();
});

updateVoiceButton();

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",loadFoundation,{once:true});
}else{
  loadFoundation();
}

window.addEventListener("pageshow",()=>{
  if(profile){
    renderStats();
    renderDailyMissions();
  }
});

window.addEventListener("beforeunload",()=>{
  if(photoUrl) URL.revokeObjectURL(photoUrl);
});

})();
