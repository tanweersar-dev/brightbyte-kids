(() => {
"use strict";

const API = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY = "brightbyte_student_token";
const $ = id => document.getElementById(id);
const qa = sel => [...document.querySelectorAll(sel)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

let token = localStorage.getItem(TOKEN_KEY) || "";
let profile = null;
let state = null;
let activeStage = null;
let stageStep = 0;
let runMistakes = 0;
let runHints = 0;
let voiceOn = true;
let toastTimer = null;
let selectedCable = null;
let firstPort = null;
let selectedPart = null;
let selectedPromptBlock = null;
let aiMission = 0;
let stage3Data = {};
let stage4Data = {};
let finalTickets = [];
let finalTicketIndex = 0;

const STAGES = [
  {id:1, icon:"🔌", name:"Port & Device Master", desc:"Connect a complete workstation, UPS, printer, audio and network safely.", tag:"IT WORKBENCH"},
  {id:2, icon:"🧩", name:"Inside the Computer", desc:"Identify and install motherboard components in the correct places.", tag:"HARDWARE BAY"},
  {id:3, icon:"🪟", name:"Windows & Software Support", desc:"Operate a simulated desktop, organise files and solve common software tasks.", tag:"SOFTWARE DESK"},
  {id:4, icon:"🤖", name:"AI Smart Technician", desc:"Build prompts, protect privacy, verify AI output and use AI responsibly.", tag:"AI WORKSTATION"},
  {id:5, icon:"🚨", name:"Final Technician Mission", desc:"Solve realistic support tickets across hardware, software, AI and cyber safety.", tag:"SUPPORT CENTER"}
];

const LEARN = {
  1:[
    ["🖥️","Display Ports","HDMI and DisplayPort carry digital video; VGA is an older analog display connection."],
    ["🔌","Power Path","Wall power can feed a UPS; supported UPS outputs can power the system unit and monitor."],
    ["🌐","LAN / Ethernet","The RJ45 LAN port connects a computer to a wired network device such as a router or switch."],
    ["🎧","USB & Audio","USB connects many peripherals. Audio ports can connect speakers, headsets or microphones."]
  ],
  2:[
    ["🧩","Motherboard","The motherboard connects major internal components so they can communicate."],
    ["🧠","RAM","RAM is temporary working memory. DDR generations use different designs and compatibility."],
    ["⚙️","CPU + Cooler","The CPU processes instructions. A heatsink/fan helps move heat away from it."],
    ["💾","Storage + Power","M.2 and SATA drives store data. The PSU supplies power; never open a PSU casing."]
  ],
  3:[
    ["📁","File Explorer","Folders help organise files. Rename, copy, move and restore are everyday digital skills."],
    ["♻️","Recycle Bin","Many deleted files go to Recycle Bin first and can be restored before permanent deletion."],
    ["🔒","Session Safety","Lock keeps your session protected; Sign out ends it; Restart and Shut down are different actions."],
    ["📊","Task Manager","Task Manager can help inspect or close an unresponsive application safely."]
  ],
  4:[
    ["✨","Strong Prompt","A useful prompt clearly states role, task, context and desired format."],
    ["🔐","Privacy","Passwords, OTPs, home addresses and private financial data should not be shared with unknown AI tools."],
    ["🔎","Verify","AI can be wrong. Important claims should be checked with reliable sources and human judgment."],
    ["🧠","Responsible AI","AI should support thinking, not replace responsibility, safety or independent checking."]
  ],
  5:[
    ["📋","Read the Ticket","Start from the symptom. Do not guess randomly."],
    ["🔦","Check Safely","Use simple, reversible checks first before destructive actions."],
    ["🤖","Use AI Carefully","AI suggestions are clues, not automatic truth. Verify before acting."],
    ["✅","Document the Fix","A technician should know what was wrong, what was checked and what solved it."]
  ]
};

const STAGE1_RULES = [
  {cable:"display", label:"HDMI Display Cable", a:"monitor-hdmi", b:"tower-hdmi", title:"Connect the monitor display", text:"Select the HDMI Display Cable, then tap/click the HDMI port on the monitor and the HDMI port on the system unit."},
  {cable:"keyboard", label:"Keyboard USB", a:"keyboard-plug", b:"tower-usb1", title:"Connect the keyboard", text:"Use the Keyboard USB cable between the keyboard and a USB port on the system unit."},
  {cable:"mouse", label:"Mouse USB", a:"mouse-plug", b:"tower-usb2", title:"Connect the mouse", text:"Use the Mouse USB cable between the mouse and a free USB port on the system unit."},
  {cable:"lan", label:"LAN Cable", a:"tower-lan", b:"router-lan", title:"Connect wired network", text:"Use the LAN cable between the system unit LAN port and the router LAN port."},
  {cable:"audio", label:"Audio Cable", a:"tower-audio", b:"speaker-in", title:"Connect the speaker", text:"Use the audio cable between the system unit audio output and the speaker input."},
  {cable:"printer", label:"Printer USB", a:"tower-printer", b:"printer-usb", title:"Connect the printer", text:"Use the printer USB cable between the system unit and printer."},
  {cable:"pcpower", label:"System Unit Power", a:"tower-power", b:"ups-out1", title:"Power the system unit from UPS", text:"Connect the system unit power cable to a supported UPS output."},
  {cable:"monitorpower", label:"Monitor Power", a:"monitor-power", b:"ups-out2", title:"Power the monitor from UPS", text:"Connect the monitor power cable to another supported UPS output."},
  {cable:"upspower", label:"UPS Input Power", a:"ups-in", b:"wall-power", title:"Connect UPS input to wall power", text:"Complete the safe power path by connecting the UPS input to the wall outlet."},
  {cable:"poweron", label:"Power Button", action:"poweron", title:"Run the workstation power test", text:"All cables are connected. Press the green POWER TEST button and confirm the workstation starts correctly."}
];

const STAGE2_TASKS = [
  {part:"cpu", target:"cpu-slot", label:"Processor / CPU", title:"Install the processor", text:"Place the CPU into the CPU socket. Match the correct component with the highlighted socket."},
  {part:"ram", target:"ram-slot", label:"RAM Module", title:"Install RAM", text:"Place the RAM module into the memory slot. RAM must match the motherboard generation."},
  {part:"m2", target:"m2-slot", label:"M.2 SSD", title:"Install the M.2 SSD", text:"Place the compact M.2 SSD into the M.2 slot on the motherboard."},
  {part:"cooler", target:"cooler-slot", label:"CPU Cooler", title:"Install the CPU cooler", text:"Place the cooler over the processor area so heat can be transferred away safely."},
  {part:"sata", target:"sata-slot", label:"SATA SSD", title:"Install a SATA storage drive", text:"Place the SATA SSD into the drive bay. It will later need data and power connections."},
  {part:"psu", target:"psu-slot", label:"PSU / SMPS", title:"Install the power supply", text:"Place the PSU in the power-supply bay. Never open a PSU casing; this lab only teaches safe installation and connection concepts."}
];

const FINAL_POOL = [
  {type:"hardware", title:"Ticket: Monitor shows NO SIGNAL", text:"The PC appears powered on, but the monitor says No Signal.", options:["Check display cable and monitor input","Format the storage drive","Open the PSU casing","Delete Windows files"], correct:0, safety:[2]},
  {type:"hardware", title:"Ticket: Keyboard not detected", text:"The keyboard is not responding after the PC starts.", options:["Check the keyboard USB connection","Replace the monitor","Share the admin password","Remove the CPU while powered on"], correct:0, safety:[2,3]},
  {type:"hardware", title:"Ticket: Storage not found", text:"The system cannot see a recently installed drive.", options:["Check drive seating and data/power connection","Delete user documents","Turn off antivirus forever","Open the PSU casing"], correct:0, safety:[3]},
  {type:"software", title:"Ticket: App is frozen", text:"A school app is Not Responding.", options:["Wait briefly, then use Task Manager if needed","Pull the power cable immediately","Delete random system files","Share the account password"], correct:0, safety:[1,2,3]},
  {type:"software", title:"Ticket: Deleted file needed again", text:"A document was deleted by mistake a few minutes ago.", options:["Check Recycle Bin and restore it","Format the PC","Replace RAM","Reset the router"], correct:0, safety:[]},
  {type:"printer", title:"Ticket: Printer connected but not printing", text:"The printer is powered and connected, but the job is not coming out.", options:["Check status, queue and correct printer selection","Open the PSU","Delete all files","Share an OTP"], correct:0, safety:[1,3]},
  {type:"cyber", title:"Security Alert: Password request", text:"A message says: 'Send your school password now to keep your account active.'", options:["Do not share it; report or verify through the official channel","Send the password quickly","Send your home address too","Forward it to strangers"], correct:0, safety:[1,2,3]},
  {type:"ai", title:"AI Check: Surprising fact", text:"An AI assistant gives a surprising science fact with no source.", options:["Verify the claim with reliable sources","Trust it automatically","Post it everywhere immediately","Give the AI your OTP"], correct:0, safety:[3]},
  {type:"audio", title:"Ticket: No sound", text:"The computer works but the user cannot hear audio.", options:["Check volume, output device and speaker connection","Format the drive","Remove RAM while powered on","Open the PSU"], correct:0, safety:[2,3]}
];

function keyForStudent(){
  return `tannu_junior_technician_v24_${profile?.user_id || profile?.username || "student"}`;
}
function freshState(){
  return {
    unlocked:1,
    completed:[],
    xp:0,
    totalMistakes:0,
    totalHints:0,
    stageScores:{},
    notes:"",
    certificateId:"",
    completedAt:""
  };
}
function normalizeState(x){
  const b=freshState();
  if(!x || typeof x!=="object") return b;
  return {
    ...b,
    ...x,
    completed:Array.isArray(x.completed)?x.completed:[],
    stageScores:x.stageScores && typeof x.stageScores==="object" ? x.stageScores:{}
  };
}
function loadState(){
  try{ state=normalizeState(JSON.parse(localStorage.getItem(keyForStudent()) || "null")); }
  catch{ state=freshState(); }
}
function saveState(){
  if(!state) return;
  localStorage.setItem(keyForStudent(), JSON.stringify(state));
  renderHeaderStats();
}
function api(path,opt={}){
  const headers={...(opt.headers||{}),Authorization:`Bearer ${token}`};
  if(opt.body && !headers["Content-Type"]) headers["Content-Type"]="application/json";
  return fetch(API+path,{...opt,headers,cache:"no-store"});
}
async function loadProfile(){
  if(!token){ location.href="student-login.html"; return false; }
  try{
    const r=await api("/api/auth/me");
    const d=await r.json();
    if(!r.ok || d.role!=="student" || !d.profile) throw new Error("Invalid student session");
    profile=d.profile;
    const c=Number(profile.class_number||1);
    if(c<4 || c>6){ location.href="student-profile.html"; return false; }
    $("studentChip").textContent=`👤 ${profile.display_name||profile.username||"Student"}`;
    $("classChip").textContent=`🎓 Class ${c}`;
    loadState();
    return true;
  }catch{
    localStorage.removeItem(TOKEN_KEY);
    location.href="student-login.html";
    return false;
  }
}
function renderHeaderStats(){
  if(!state) return;
  $("scoreChip").textContent=`⭐ ${Number(state.xp||0)} XP`;
  $("heroStages").textContent=`${state.completed.length} / 5`;
  const attempts = Number(state.totalMistakes||0);
  const solved = Math.max(5, state.completed.length*5);
  const accuracy = Math.max(0,Math.round((solved/(solved+attempts))*100));
  $("heroAccuracy").textContent=accuracy+"%";
  $("heroHints").textContent=Number(state.totalHints||0);
  $("heroCertificate").textContent=state.completed.includes(5)?"Unlocked":"Locked";
  const cert=$("certificateBtn");
  cert.disabled=!state.completed.includes(5);
  cert.classList.toggle("locked-action",cert.disabled);
  cert.textContent=cert.disabled?"🏆 Certificate Locked":"🏆 View Certificate";
}
function toast(text){
  const el=$("toast"); el.textContent=text; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),1800);
}
function speak(text){
  if(!voiceOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(String(text));
  u.lang="en-US"; u.rate=.82; u.pitch=1.02;
  const voices=speechSynthesis.getVoices();
  u.voice=voices.find(v=>/en-(US|GB)/i.test(v.lang))||voices.find(v=>/en/i.test(v.lang))||null;
  speechSynthesis.speak(u);
}
function feedback(text,type="info",say=false){
  const el=$("feedback");
  el.className=`feedback ${type}`;
  el.textContent=text;
  if(say) speak(text.replace(/[✅❌⚠️🔧🖥️🤖🛡️]/g,""));
}
function openModal(html){
  $("modalBody").innerHTML=html;
  $("modal").classList.add("open");
  $("modal").setAttribute("aria-hidden","false");
}
function closeModal(){
  $("modal").classList.remove("open");
  $("modal").setAttribute("aria-hidden","true");
}
function addMistake(msg){
  runMistakes++;
  state.totalMistakes=Number(state.totalMistakes||0)+1;
  saveState();
  updateMissionStats();
  if(msg) feedback(msg,"bad",true);
}
function addHint(msg,highlight=true){
  runHints++;
  state.totalHints=Number(state.totalHints||0)+1;
  saveState();
  updateMissionStats();
  feedback(`💡 Hint: ${msg}`,"warn",true);
  if(highlight) showTarget();
}
function updateMissionStats(){
  $("mistakeStat").textContent=`❌ Mistakes: ${runMistakes}`;
  $("hintStat").textContent=`💡 Hints: ${runHints}`;
}
function currentStage(){
  return STAGES.find(x=>x.id===activeStage);
}
function renderStageMap(){
  const unlocked=Math.max(1,Number(state.unlocked||1));
  $("stageMap").innerHTML=STAGES.map(s=>{
    const complete=state.completed.includes(s.id);
    const locked=s.id>unlocked;
    return `<button class="stage-card ${complete?"complete":""} ${locked?"locked":""}" data-stage="${s.id}" type="button" ${locked?"disabled":""}>
      <span class="stage-state">${complete?"✅ CLEARED":locked?"🔒 LOCKED":s.id===unlocked?"▶ READY":"REPLAY"}</span>
      <span class="stage-icon">${s.icon}</span>
      <b>Stage ${s.id} • ${esc(s.name)}</b>
      <small>${esc(s.desc)}</small>
    </button>`;
  }).join("");
  qa("[data-stage]").forEach(b=>b.onclick=()=>openStage(Number(b.dataset.stage)));
}
function renderLearnPanel(){
  $("learnPanel").innerHTML=`<div class="learn-strip">${
    (LEARN[activeStage]||[]).map((x,i)=>`<article class="learn-card ${i===Math.min(stageStep,3)?"current":""}">
      <span>${x[0]}</span><b>${esc(x[1])}</b><small>${esc(x[2])}</small>
    </article>`).join("")
  }</div>`;
}
function stageSteps(){
  if(activeStage===1) return STAGE1_RULES.map(x=>x.title);
  if(activeStage===2) return STAGE2_TASKS.map(x=>x.title);
  if(activeStage===3) return ["Create a School Work folder","Move Project.docx into the folder","Delete Holiday.jpg","Restore Holiday.jpg from Recycle Bin","Close a frozen app with Task Manager"];
  if(activeStage===4) return ["Build a strong AI prompt","Sort safe vs private information","Verify an AI claim","Use evidence for AI/edited media","Choose a safe IT-support AI prompt"];
  return finalTickets.map((x,i)=>`Resolve support ticket ${i+1}`);
}
function renderStepList(){
  const steps=stageSteps();
  $("stepList").innerHTML=steps.map((s,i)=>`<div class="step-row ${i<stageStep?"done":i===stageStep?"current":""}">
    <span>${i<stageStep?"✓":i+1}</span><span>${esc(s)}</span>
  </div>`).join("");
  const pct=Math.round((Math.min(stageStep,steps.length)/(steps.length||1))*100);
  $("missionPercent").textContent=pct+"%";
  $("missionBar").style.width=pct+"%";
}
function setInstruction(title,text){
  $("missionTitle").textContent=title;
  $("missionText").textContent=text;
}
function openStage(id){
  if(id>Number(state.unlocked||1)) return toast("Complete the previous stage first 🔒");
  activeStage=id; stageStep=0; runMistakes=0; runHints=0;
  selectedCable=null; firstPort=null; selectedPart=null; selectedPromptBlock=null; aiMission=0;
  stage3Data={folder:false,projectMoved:false,photoDeleted:false,photoRestored:false,taskDone:false};
  stage4Data={prompt:{},privacy:{},verify:false,media:false,helpdesk:false};
  if(id===5){ prepareFinalTickets(); }
  const s=currentStage();
  $("labShell").classList.remove("hidden");
  $("stageNumber").textContent=`STAGE ${id}`;
  $("stageName").textContent=s.name;
  $("environmentTag").textContent=s.tag;
  $("environmentTitle").textContent=s.name;
  $("workStatusText").textContent=profileClassLabel();
  $("safetyRule").textContent=id===2
    ?"Use a powered-off training computer. Never open a PSU/SMPS casing; this simulation teaches safe placement only."
    :id===4
      ?"Never share passwords, OTPs, home address or other private data with unknown AI tools."
      :"Use safe, reversible checks first. Ask a trusted adult before touching real mains-powered equipment.";
  updateMissionStats();
  renderLearnPanel();
  renderSimulator();
  renderStageMap();
  $("labShell").scrollIntoView({behavior:"smooth",block:"start"});
}
function profileClassLabel(){
  const c=Number(profile.class_number||4);
  return c===4?"Guided Explorer Mode":c===5?"Applied Practice Mode":"Advanced Challenge Mode";
}
function renderSimulator(){
  renderLearnPanel();
  renderStepList();
  if(activeStage===1) renderStage1();
  else if(activeStage===2) renderStage2();
  else if(activeStage===3) renderStage3();
  else if(activeStage===4) renderStage4();
  else if(activeStage===5) renderStage5();
}
function showTarget(){
  qa(".target").forEach(x=>x.classList.remove("target"));
  if(activeStage===1){
    const t=STAGE1_RULES[stageStep];
    if(!t) return;
    if(t.action==="poweron"){
      $("powerTestBtn")?.classList.add("target");
      return;
    }
    document.querySelector(`[data-cable="${t.cable}"]`)?.classList.add("target");
    document.querySelector(`[data-port="${t.a}"]`)?.classList.add("target");
    document.querySelector(`[data-port="${t.b}"]`)?.classList.add("target");
  }else if(activeStage===2){
    const t=STAGE2_TASKS[stageStep];
    document.querySelector(`[data-part="${t?.part}"]`)?.classList.add("target");
    document.querySelector(`[data-slot="${t?.target}"]`)?.classList.add("target");
  }else if(activeStage===3){
    const map=["[data-action='newfolder']", ".file-project", ".file-photo", "[data-action='recycle']", "[data-action='taskmanager']"];
    document.querySelector(map[stageStep])?.classList.add("target");
  }else if(activeStage===4){
    document.querySelector(".ai-main")?.classList.add("target");
  }else if(activeStage===5){
    qa(".diagnostic-btn").forEach(x=>x.classList.add("target"));
  }
}
function clearTarget(){
  qa(".target").forEach(x=>x.classList.remove("target"));
}
function stageScore(){
  return Math.max(0,100-(runMistakes*9)-(runHints*4));
}
function finishStage(){
  const score=stageScore();
  if(score<70){
    openModal(`<h2>📘 Practice Round Needed</h2>
      <p>You completed the tasks, but your current practical score is <b>${score}%</b>. A certification stage needs 70% or more. Retry the stage and use fewer wrong actions or hints.</p>
      <div class="summary-grid">
        <article class="summary-card"><b>${score}%</b><small>Current score</small></article>
        <article class="summary-card"><b>${runMistakes}</b><small>Mistakes</small></article>
        <article class="summary-card"><b>${runHints}</b><small>Hints used</small></article>
        <article class="summary-card"><b>70%</b><small>Pass target</small></article>
      </div>
      <div class="modal-actions"><button class="go" id="retryStageBtn">↺ Retry Stage</button></div>`);
    $("retryStageBtn").onclick=()=>{closeModal();openStage(activeStage)};
    return;
  }
  state.stageScores[activeStage]=Math.max(score,Number(state.stageScores[activeStage]||0));
  if(!state.completed.includes(activeStage)){
    state.completed.push(activeStage);
    state.completed.sort((a,b)=>a-b);
    state.xp=Number(state.xp||0)+activeStage*25;
  }
  if(activeStage<5) state.unlocked=Math.max(Number(state.unlocked||1),activeStage+1);
  if(activeStage===5){
    state.unlocked=5;
    if(!state.certificateId) state.certificateId=makeCertificateId();
    if(!state.completedAt) state.completedAt=new Date().toISOString();
  }
  saveState();
  renderStageMap();

  if(activeStage<5){
    const next=activeStage+1;
    openModal(`<h2>✅ Stage ${activeStage} Cleared!</h2>
      <p>You proved the skill by completing the practical tasks. Stage ${next} is now unlocked.</p>
      <div class="summary-grid">
        <article class="summary-card"><b>${score}%</b><small>Practical score</small></article>
        <article class="summary-card"><b>${runMistakes}</b><small>Mistakes</small></article>
        <article class="summary-card"><b>${runHints}</b><small>Hints</small></article>
        <article class="summary-card"><b>+${activeStage*25} XP</b><small>Reward</small></article>
      </div>
      <div class="modal-actions">
        <button class="soft" id="stayBtn">Review Stage</button>
        <button class="go" id="nextStageBtn">Unlock Stage ${next} →</button>
      </div>`);
    $("stayBtn").onclick=closeModal;
    $("nextStageBtn").onclick=()=>{closeModal();openStage(next)};
  }else{
    openModal(`<h2>🏆 Junior Digital & AI Technician Certified!</h2>
      <p>All five practical stages are complete. Your certificate is now unlocked.</p>
      <div class="summary-grid">
        <article class="summary-card"><b>${score}%</b><small>Final mission score</small></article>
        <article class="summary-card"><b>5 / 5</b><small>Stages cleared</small></article>
        <article class="summary-card"><b>${state.totalHints}</b><small>Total hints</small></article>
        <article class="summary-card"><b>Level 2</b><small>Technician award</small></article>
      </div>
      <div class="modal-actions">
        <button class="go" id="viewCertBtn">🎓 View Certificate</button>
      </div>`);
    $("viewCertBtn").onclick=()=>{closeModal();showCertificate()};
  }
}
function makeCertificateId(){
  const name=String(profile?.username||profile?.user_id||"student").replace(/[^a-z0-9]/gi,"").toUpperCase().slice(0,6);
  const y=new Date().getFullYear();
  return `JDAI-${y}-C${profile.class_number}-${name}-${Math.floor(1000+Math.random()*9000)}`;
}

/* ===================== STAGE 1 ===================== */
function stage1Scene(){
  return `<div class="lab-scene">
    <span class="scene-label">SCHOOL IT WORKSTATION • TRAINING BAY A</span>
    <div class="wall-panel"></div>
    <div class="desk"></div>

    <div class="printer-device device"><span class="port printer-usb" data-port="printer-usb">USB-B</span></div>
    <div class="monitor-device device">
      <span class="port monitor-hdmi" data-port="monitor-hdmi">HDMI</span>
      <span class="port monitor-power" data-port="monitor-power">POWER</span>
    </div>
    <div class="tower-device device"><span class="led"></span>
      <span class="port tower-hdmi" data-port="tower-hdmi">HDMI</span>
      <span class="port tower-usb" style="top:39%" data-port="tower-usb1">USB 1</span>
      <span class="port tower-usb" style="top:50%" data-port="tower-usb2">USB 2</span>
      <span class="port tower-lan" data-port="tower-lan">LAN</span>
      <span class="port tower-audio" data-port="tower-audio">AUDIO</span>
      <span class="port" style="left:-42px;top:90%" data-port="tower-printer">USB</span>
      <span class="port tower-power" data-port="tower-power">POWER</span>
    </div>
    <div class="keyboard-device device"><span class="port" style="right:-26px;top:20%" data-port="keyboard-plug">USB</span></div>
    <div class="mouse-device device"><span class="port" style="right:-27px;top:8%" data-port="mouse-plug">USB</span></div>
    <div class="speaker-device device"><span class="port" style="left:-27px;bottom:8%" data-port="speaker-in">IN</span></div>
    <div class="ups-device device">
      <span class="port ups-out" data-port="ups-out1">OUT 1</span>
      <span class="port ups-out2" data-port="ups-out2">OUT 2</span>
      <span class="port ups-in" data-port="ups-in">INPUT</span>
    </div>

    <div class="device" style="left:5%;top:12%;width:80px;height:54px;border-radius:10px;background:#f8fafc;border:2px solid #bac5cf;display:grid;place-items:center;color:#34405c;font-size:8px;font-weight:1000">
      ROUTER
      <span class="port" style="right:-28px;bottom:5px" data-port="router-lan">LAN 1</span>
    </div>
    <div class="device" style="right:5%;top:11%;width:52px;height:62px;border-radius:9px;background:#eef1f3;border:2px solid #b8c0c8;display:grid;place-items:center;color:#3b4558;font-size:8px;font-weight:1000">
      WALL
      <span class="port" style="left:-28px;bottom:7px" data-port="wall-power">AC</span>
    </div>

    <svg id="cableLayer" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6"></svg>

    <div class="tray">
      ${[
        ["display","🟦 HDMI"],["keyboard","⌨️ Keyboard USB"],["mouse","🖱️ Mouse USB"],["lan","🟨 LAN"],
        ["audio","🟩 Audio"],["printer","🖨️ Printer USB"],["pcpower","⚡ PC Power"],["monitorpower","⚡ Monitor Power"],
        ["upspower","🔌 UPS Input"],["coax","⚪ Coaxial"],["telephone","☎️ Telephone"]
      ].map(x=>`<button class="drag-item" data-cable="${x[0]}" type="button">${x[1]}</button>`).join("")}
      <button id="powerTestBtn" class="drag-item" type="button" style="background:#e5fff1;color:#126f55">🟢 POWER TEST</button>
    </div>
  </div>`;
}
function renderStage1(){
  const t=STAGE1_RULES[stageStep];
  if(!t){ finishStage(); return; }
  $("simulator").innerHTML=stage1Scene();
  setInstruction(t.title,t.text);
  feedback(stageStep===0?"Select the requested cable, then connect its two matching endpoints.":"Continue with the next workstation connection.","info");
  selectedCable=null; firstPort=null;

  qa("[data-cable]").forEach(b=>{
    b.onclick=()=>{
      if(t.action==="poweron") return addMistake("❌ The workstation must be tested now. Use the green POWER TEST button.");
      selectedCable=b.dataset.cable;
      firstPort=null;
      qa("[data-port]").forEach(x=>x.classList.remove("target"));
      qa("[data-cable]").forEach(x=>x.classList.toggle("selected",x===b));
      feedback(`Selected: ${b.textContent.trim()}. Now choose the two endpoints.`,"info");
    };
  });
  qa("[data-port]").forEach(p=>p.onclick=()=>stage1PortClick(p.dataset.port,p));
  $("powerTestBtn").onclick=()=>{
    if(t.action!=="poweron") return addMistake("❌ Power test is not ready yet. Finish the current cable mission first.");
    feedback("✅ Power test passed. Monitor, system unit, keyboard, mouse, printer and network are ready.","good",true);
    stageStep++;
    setTimeout(renderSimulator,700);
  };
  setTimeout(()=>redrawStage1Completed(),50);
}
function stage1PortClick(port,el){
  const t=STAGE1_RULES[stageStep];
  if(!t || t.action==="poweron") return addMistake("❌ Cable connections are complete. Run the POWER TEST.");
  if(!selectedCable){
    feedback("Select a cable from the tray first.","warn");
    return;
  }
  if(!firstPort){
    firstPort=port;
    el.classList.add("target");
    feedback(`First endpoint selected: ${port}. Now choose the other end.`,"info");
    return;
  }
  if(firstPort===port){
    firstPort=null; el.classList.remove("target");
    return feedback("Choose a different second endpoint.","warn");
  }
  const pair=[firstPort,port].sort().join("|");
  const correct=[t.a,t.b].sort().join("|");
  const firstEl=document.querySelector(`[data-port="${firstPort}"]`);
  if(selectedCable===t.cable && pair===correct){
    firstEl?.classList.remove("target");
    el.classList.remove("target");
    firstEl?.classList.add("done"); el.classList.add("done");
    document.querySelector(`[data-cable="${selectedCable}"]`)?.classList.add("used");
    drawCable(t.a,t.b,stageStep);
    feedback(`✅ Correct! ${t.label} connected successfully.`,"good",true);
    selectedCable=null; firstPort=null; stageStep++;
    setTimeout(renderSimulator,750);
  }else{
    firstEl?.classList.remove("target");
    el.classList.remove("target");
    firstPort=null;
    addMistake("❌ That cable/port combination is not correct for this mission. Compare the connector shape and labels, then try again.");
  }
}
function cableColor(i){
  return ["#38a8ff","#70d85b","#d2a83d","#ff7c66","#9d68ff","#4bc8be","#ef5350","#ef5350","#ffcc58"][i]||"#73a5ff";
}
function drawCable(a,b,index){
  const svg=$("cableLayer");
  const pa=document.querySelector(`[data-port="${a}"]`);
  const pb=document.querySelector(`[data-port="${b}"]`);
  const sim=$("simulator");
  if(!svg||!pa||!pb||!sim) return;
  const r=sim.getBoundingClientRect(),ra=pa.getBoundingClientRect(),rb=pb.getBoundingClientRect();
  const x1=ra.left+ra.width/2-r.left, y1=ra.top+ra.height/2-r.top;
  const x2=rb.left+rb.width/2-r.left, y2=rb.top+rb.height/2-r.top;
  const mx=(x1+x2)/2;
  svg.insertAdjacentHTML("beforeend",`<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" fill="none" stroke="${cableColor(index)}" stroke-width="5" stroke-linecap="round" opacity=".9"/><circle cx="${x1}" cy="${y1}" r="5" fill="${cableColor(index)}"/><circle cx="${x2}" cy="${y2}" r="5" fill="${cableColor(index)}"/>`);
}
function redrawStage1Completed(){
  const svg=$("cableLayer");
  if(svg) svg.innerHTML="";
  for(let i=0;i<Math.min(stageStep,STAGE1_RULES.length);i++){
    const x=STAGE1_RULES[i];
    if(x.a&&x.b) drawCable(x.a,x.b,i);
  }
}

/* ===================== STAGE 2 ===================== */
function renderStage2(){
  const t=STAGE2_TASKS[stageStep];
  if(!t){ finishStage(); return; }
  setInstruction(t.title,t.text);
  $("simulator").innerHTML=`<div class="case-stage">
    <span class="scene-label">POWERED-OFF TRAINING PC • INTERNAL HARDWARE BAY</span>
    <div class="pc-case">
      <div class="motherboard-board">
        <i class="mb-trace" style="left:8%;top:18%;width:54%;transform:rotate(22deg)"></i>
        <i class="mb-trace" style="left:15%;top:68%;width:62%;transform:rotate(-14deg)"></i>
        <div class="slot cpu-slot ${stageStep>0?"installed-part":""}" data-slot="cpu-slot">CPU SOCKET</div>
        <div class="slot ram-slot ${stageStep>1?"installed-part":""}" data-slot="ram-slot">RAM</div>
        <div class="slot m2-slot ${stageStep>2?"installed-part":""}" data-slot="m2-slot">M.2</div>
        <div class="slot cooler-slot ${stageStep>3?"installed-part":""}" data-slot="cooler-slot">${stageStep>3?"COOLER":"COOLER AREA"}</div>
        <div class="slot sata-slot ${stageStep>4?"installed-part":""}" data-slot="sata-slot">SATA BAY</div>
        <div class="slot psu-slot ${stageStep>5?"installed-part":""}" data-slot="psu-slot">PSU BAY</div>
      </div>
    </div>
    <div class="parts-tray">
      ${[
        ["cpu","⚙️","CPU"],["ram","🧠","RAM"],["m2","▬","M.2 SSD"],["cooler","🌀","CPU Cooler"],["sata","▰","SATA SSD"],["psu","⚡","PSU / SMPS"]
      ].map((x,i)=>`<div class="part-item ${i<stageStep?"used":""}" data-part="${x[0]}" draggable="${i>=stageStep}">
          <span>${x[1]}</span>${x[2]}
        </div>`).join("")}
    </div>
  </div>`;
  wirePartDnD();
  feedback("Drag the requested component to its matching location. On mobile, tap the part and then tap the highlighted slot.","info");
}
function wirePartDnD(){
  qa("[data-part]").forEach(p=>{
    p.onclick=()=>selectPart(p.dataset.part,p);
    p.addEventListener("dragstart",e=>{
      selectedPart=p.dataset.part;
      e.dataTransfer?.setData("text/plain",selectedPart);
    });
  });
  qa("[data-slot]").forEach(s=>{
    s.addEventListener("dragover",e=>e.preventDefault());
    s.addEventListener("drop",e=>{e.preventDefault();attemptPartDrop(e.dataTransfer?.getData("text/plain")||selectedPart,s.dataset.slot,s)});
    s.onclick=()=>{if(selectedPart) attemptPartDrop(selectedPart,s.dataset.slot,s)};
  });
}
function selectPart(id,el){
  if(el.classList.contains("used")) return;
  selectedPart=id;
  qa("[data-part]").forEach(x=>x.classList.toggle("selected",x===el));
  feedback(`Selected ${el.textContent.trim()}. Now choose its correct installation location.`,"info");
}
function attemptPartDrop(part,target,el){
  const t=STAGE2_TASKS[stageStep];
  if(!t) return;
  if(part===t.part && target===t.target){
    el.classList.add("correct-flash","installed-part");
    feedback(`✅ ${t.label} installed in the correct location.`,"good",true);
    selectedPart=null; stageStep++;
    setTimeout(renderSimulator,700);
  }else{
    el.classList.add("wrong-flash");
    setTimeout(()=>el.classList.remove("wrong-flash"),600);
    addMistake("❌ That component does not belong there for this mission. Look at the labels and shape, then try again.");
  }
}

/* ===================== STAGE 3 ===================== */
function renderStage3(){
  if(stageStep>=5){ finishStage(); return; }
  const titles=[
    ["Create a School Work folder","Use the action panel to create a new folder named School Work."],
    ["Move Project.docx into School Work","Drag the Project.docx file onto the School Work folder."],
    ["Delete Holiday.jpg","Drag Holiday.jpg onto Recycle Bin."],
    ["Restore Holiday.jpg","Open Recycle Bin and use Restore."],
    ["Close a frozen app safely","Open Task Manager and choose End Task for the frozen app."]
  ];
  setInstruction(...titles[stageStep]);
  $("simulator").innerHTML=`<div class="windows-stage">
    <div class="wallpaper-glow"></div>
    <div class="desktop-icons">
      <button class="desktop-icon" data-action="thispc" type="button"><span>🖥️</span>This PC</button>
      <button class="desktop-icon" data-action="recycle" type="button"><span>♻️</span>Recycle Bin</button>
    </div>
    <button class="desktop-file file-project" data-file="project" draggable="true" type="button" style="${stage3Data.projectMoved?"display:none":""}"><span>📄</span>Project.docx</button>
    <button class="desktop-file file-photo" data-file="photo" draggable="true" type="button" style="${stage3Data.photoDeleted&&!stage3Data.photoRestored?"display:none":""}"><span>🖼️</span>Holiday.jpg</button>
    ${stage3Data.folder?`<div class="folder-target" data-folder="school"><span>📁</span>School Work</div>`:""}
    <div class="recycle-target" data-folder="recycle"><span>♻️</span>Recycle Bin</div>
    <div id="winBox" class="window-box hidden-window"><div class="window-title" id="winTitle">Window</div><div class="window-body" id="winBody"></div></div>
    <div class="taskbar">
      <button class="start-button" data-action="start" type="button">⊞</button>
      <button class="taskbar-chip" data-action="newfolder" type="button">📁 New Folder</button>
      <button class="taskbar-chip" data-action="taskmanager" type="button">📊 Task Manager</button>
      <span class="system-tray">🔊 📶 🔋 <span id="clockSim">12:30</span></span>
    </div>
  </div>`;
  wireWindows();
  feedback("Work inside the simulated desktop. This does not change anything on your real device.","info");
}
function wireWindows(){
  const fileEls=qa("[data-file]");
  fileEls.forEach(f=>{
    f.addEventListener("dragstart",e=>e.dataTransfer?.setData("text/plain",f.dataset.file));
    f.onclick=()=>{selectedPart=f.dataset.file;qa("[data-file]").forEach(x=>x.classList.toggle("selected",x===f));};
  });
  qa("[data-folder]").forEach(t=>{
    t.addEventListener("dragover",e=>e.preventDefault());
    t.addEventListener("drop",e=>{e.preventDefault();windowsDrop(e.dataTransfer?.getData("text/plain"),t.dataset.folder)});
    t.onclick=()=>{if(selectedPart) windowsDrop(selectedPart,t.dataset.folder)};
  });
  qa("[data-action]").forEach(b=>b.onclick=()=>windowsAction(b.dataset.action));
}
function windowsDrop(file,target){
  if(stageStep===1 && file==="project" && target==="school"){
    stage3Data.projectMoved=true; feedback("✅ Project.docx moved into School Work.","good",true); stageStep++; setTimeout(renderSimulator,600); return;
  }
  if(stageStep===2 && file==="photo" && target==="recycle"){
    stage3Data.photoDeleted=true; feedback("✅ Holiday.jpg moved to Recycle Bin.","good",true); stageStep++; setTimeout(renderSimulator,600); return;
  }
  addMistake("❌ That is not the requested file action. Read the current Windows mission and try again.");
}
function windowsAction(a){
  if(stageStep===0 && a==="newfolder"){
    stage3Data.folder=true; feedback("✅ School Work folder created.","good",true); stageStep++; setTimeout(renderSimulator,500); return;
  }
  if(a==="recycle"){
    showWindow("Recycle Bin",stage3Data.photoDeleted&&!stage3Data.photoRestored
      ?`<p>🖼️ Holiday.jpg</p><button class="primary-btn" id="restoreBtn">♻️ Restore</button>`
      :`<p>Recycle Bin is empty.</p>`);
    setTimeout(()=>{$("restoreBtn")?.addEventListener("click",()=>{
      if(stageStep===3){
        stage3Data.photoRestored=true; feedback("✅ Holiday.jpg restored to its previous location.","good",true); stageStep++; setTimeout(renderSimulator,500);
      }
    })},0);
    return;
  }
  if(a==="taskmanager"){
    showWindow("Task Manager",`<div style="display:grid;gap:8px">
      <div style="padding:9px;border-radius:9px;background:#ffe9ed"><b>School Presentation App</b> — Not Responding</div>
      <button class="primary-btn" id="endTaskBtn">End Task</button>
    </div>`);
    setTimeout(()=>{$("endTaskBtn")?.addEventListener("click",()=>{
      if(stageStep===4){
        stage3Data.taskDone=true; feedback("✅ Frozen app closed safely with Task Manager.","good",true); stageStep++; setTimeout(renderSimulator,500);
      }
    })},0);
    return;
  }
  if(a==="start") showWindow("Start Menu","<p>Apps • Settings • Power</p>");
  if(a==="thispc") showWindow("This PC","<p>School Drive • Documents • Pictures</p>");
  if((stageStep===0 && a!=="newfolder") || (stageStep===4 && a!=="taskmanager")) addMistake("❌ That action does not solve the current mission.");
}
function showWindow(title,html){
  $("winTitle").textContent=title;
  $("winBody").innerHTML=html;
  $("winBox").classList.remove("hidden-window");
}

/* ===================== STAGE 4 ===================== */
function renderStage4(){
  if(stageStep>=5){ finishStage(); return; }
  aiMission=stageStep;
  const titles=[
    ["Build a strong AI prompt","Place Role, Task, Context and Format into their correct prompt slots."],
    ["Protect private information","Sort each information card into Safe to Share or Keep Private."],
    ["Verify an AI claim","Do not automatically trust a surprising AI answer. Choose the best next action."],
    ["Check AI/edited media carefully","Choose the strongest evidence-based response to a suspicious image or clip."],
    ["Use AI as a safe IT helper","Choose the prompt that asks for safe, non-destructive first checks."]
  ];
  setInstruction(...titles[stageStep]);
  $("simulator").innerHTML=`<div class="ai-stage"><div class="ai-console">
    <aside class="ai-side">
      <h3>🤖 AI Skill Missions</h3>
      <p>AI is a tool. Strong users protect privacy, give clear instructions and verify important output.</p>
      <div class="ai-mission-list">
        ${titles.map((x,i)=>`<div class="ai-mission ${i===stageStep?"active":i<stageStep?"done":""}">${i<stageStep?"✅":i+1+". "} ${esc(x[0])}</div>`).join("")}
      </div>
    </aside>
    <section id="aiMain" class="ai-main"></section>
  </div></div>`;
  if(stageStep===0) renderPromptBuilder();
  if(stageStep===1) renderPrivacySort();
  if(stageStep===2) renderAIVerify();
  if(stageStep===3) renderMediaCheck();
  if(stageStep===4) renderAIHelpdesk();
}
function renderPromptBuilder(){
  $("aiMain").innerHTML=`<h3>✨ Prompt Engineering Workbench</h3>
    <p>Build a prompt for learning about the Solar System as a Class ${profile.class_number} student.</p>
    <div class="prompt-slots">
      ${["role","task","context","format"].map(k=>`<div class="prompt-slot" data-prompt-slot="${k}"><b>${k.toUpperCase()}</b><div class="slot-value" id="slot-${k}">Drop / tap a block here</div></div>`).join("")}
    </div>
    <div class="prompt-blocks">
      <div class="prompt-block" draggable="true" data-prompt-kind="role">ROLE • You are a friendly science tutor</div>
      <div class="prompt-block" draggable="true" data-prompt-kind="task">TASK • Explain the Solar System</div>
      <div class="prompt-block" draggable="true" data-prompt-kind="context">CONTEXT • I am in Class ${profile.class_number}</div>
      <div class="prompt-block" draggable="true" data-prompt-kind="format">FORMAT • Use 5 short bullet points</div>
    </div>`;
  qa("[data-prompt-kind]").forEach(b=>{
    b.onclick=()=>{selectedPromptBlock=b.dataset.promptKind;qa("[data-prompt-kind]").forEach(x=>x.classList.toggle("selected",x===b));};
    b.addEventListener("dragstart",e=>e.dataTransfer?.setData("text/plain",b.dataset.promptKind));
  });
  qa("[data-prompt-slot]").forEach(s=>{
    s.addEventListener("dragover",e=>e.preventDefault());
    s.addEventListener("drop",e=>{e.preventDefault();promptDrop(e.dataTransfer?.getData("text/plain"),s.dataset.promptSlot)});
    s.onclick=()=>{if(selectedPromptBlock) promptDrop(selectedPromptBlock,s.dataset.promptSlot)};
  });
}
function promptDrop(kind,slot){
  if(kind!==slot) return addMistake("❌ That prompt block belongs in a different slot. Match ROLE, TASK, CONTEXT and FORMAT.");
  stage4Data.prompt[slot]=true;
  $(`slot-${slot}`).textContent=document.querySelector(`[data-prompt-kind="${kind}"]`).textContent.replace(/^[A-Z]+ • /,"");
  document.querySelector(`[data-prompt-kind="${kind}"]`).classList.add("used");
  selectedPromptBlock=null;
  if(Object.keys(stage4Data.prompt).length===4){
    feedback("✅ Strong prompt built: clear role, task, context and format.","good",true);
    stageStep++; setTimeout(renderSimulator,700);
  }
}
function renderPrivacySort(){
  const cards=[
    ["science","Science homework question","safe"],["story","Made-up story idea","safe"],
    ["password","My school password","private"],["otp","One-time verification code","private"],
    ["address","My exact home address","private"],["public","Public fact about planets","safe"]
  ];
  $("aiMain").innerHTML=`<h3>🔐 AI Privacy Protector</h3><p>Sort all cards. Share only information that is appropriate for a normal learning prompt.</p>
    <div class="privacy-bins"><div class="privacy-bin safe" data-privacy-bin="safe"><b>✅ SAFE FOR THIS LEARNING TASK</b><div id="safeBin"></div></div>
    <div class="privacy-bin private" data-privacy-bin="private"><b>🔒 KEEP PRIVATE</b><div id="privateBin"></div></div></div>
    <div class="prompt-blocks">${cards.map(x=>`<div class="privacy-card" draggable="true" data-privacy="${x[0]}" data-answer="${x[2]}">${esc(x[1])}</div>`).join("")}</div>`;
  qa("[data-privacy]").forEach(c=>{
    c.onclick=()=>{selectedPart=c.dataset.privacy;qa("[data-privacy]").forEach(x=>x.classList.toggle("selected",x===c));};
    c.addEventListener("dragstart",e=>e.dataTransfer?.setData("text/plain",c.dataset.privacy));
  });
  qa("[data-privacy-bin]").forEach(b=>{
    b.addEventListener("dragover",e=>e.preventDefault());
    b.addEventListener("drop",e=>{e.preventDefault();privacyDrop(e.dataTransfer?.getData("text/plain"),b.dataset.privacyBin)});
    b.onclick=()=>{if(selectedPart) privacyDrop(selectedPart,b.dataset.privacyBin)};
  });
}
function privacyDrop(id,bin){
  const card=document.querySelector(`[data-privacy="${id}"]`);
  if(!card) return;
  if(card.dataset.answer!==bin) return addMistake("❌ Think about privacy. Passwords, OTPs and exact home addresses should stay private.");
  stage4Data.privacy[id]=true;
  card.classList.add("used");
  card.textContent="✅ "+card.textContent.replace(/^✅ /,"");
  (bin==="safe"?$("safeBin"):$("privateBin")).appendChild(card);
  selectedPart=null;
  if(Object.keys(stage4Data.privacy).length===6){
    feedback("✅ Excellent. You separated safe learning content from private information.","good",true);
    stageStep++; setTimeout(renderSimulator,700);
  }
}
function renderAIVerify(){
  $("aiMain").innerHTML=`<h3>🔎 AI Said It — Is It True?</h3>
    <div class="ai-chat"><div class="bubble user">What is the Moon?</div><div class="bubble bot">The Moon is a planet that creates its own light.</div></div>
    <p>This answer contains suspicious claims. What should you do next?</p>
    <div class="choice-grid">
      <button class="choice-card" data-ai-choice="trust">Trust it automatically</button>
      <button class="choice-card" data-ai-choice="verify">Verify with reliable science sources</button>
      <button class="choice-card" data-ai-choice="share">Share it everywhere immediately</button>
    </div>
    <div id="verifySources"></div>`;
  qa("[data-ai-choice]").forEach(b=>b.onclick=()=>{
    if(b.dataset.aiChoice!=="verify") return addMistake("❌ AI can be wrong. Important claims should be checked before you trust or share them.");
    $("verifySources").innerHTML=`<div class="source-grid">
      <article class="source-card good"><b>Science museum / space agency</b><small>Named organisation • educational context • evidence available</small></article>
      <article class="source-card bad"><b>Random viral post</b><small>No author • no evidence • dramatic headline</small></article>
      <article class="source-card good"><b>School science textbook</b><small>Publisher and curriculum context shown</small></article>
    </div><p><b>Verified:</b> The Moon is Earth's natural satellite and mainly reflects sunlight.</p>
    <button class="primary-btn ai-next" id="verifyDone">✅ Verification Complete</button>`;
    $("verifyDone").onclick=()=>{stage4Data.verify=true;feedback("✅ You verified the AI output instead of trusting it blindly.","good",true);stageStep++;setTimeout(renderSimulator,650)};
  });
}
function renderMediaCheck(){
  $("aiMain").innerHTML=`<h3>🖼️ AI / Edited Media Detective</h3>
    <p>A dramatic image is circulating online with no clear source. The image alone cannot prove whether it is authentic.</p>
    <div style="height:170px;border-radius:16px;background:linear-gradient(145deg,#7867ff,#25cdbb);display:grid;place-items:center;color:white;font-size:44px;position:relative;overflow:hidden">
      🛰️🌆
      <span style="position:absolute;bottom:10px;left:10px;font-size:8px;padding:6px 8px;border-radius:99px;background:#0007">SOURCE UNKNOWN</span>
    </div>
    <div class="choice-grid">
      <button class="choice-card" data-media="real">It looks real, so it must be real</button>
      <button class="choice-card" data-media="fake">It looks unusual, so it must be fake</button>
      <button class="choice-card" data-media="evidence">Check source, date, context and other evidence</button>
    </div>`;
  qa("[data-media]").forEach(b=>b.onclick=()=>{
    if(b.dataset.media!=="evidence") return addMistake("❌ Appearance alone is not enough. Real and AI-edited media can both look convincing.");
    stage4Data.media=true;feedback("✅ Correct. Use source, date, context and supporting evidence instead of guessing from appearance.","good",true);stageStep++;setTimeout(renderSimulator,650);
  });
}
function renderAIHelpdesk(){
  $("aiMain").innerHTML=`<h3>🧑‍💻 AI Help Desk Assistant</h3>
    <p>Ticket: “Printer is connected and powered, but it is not printing.” Choose the safest and clearest AI prompt.</p>
    <div class="choice-grid">
      <button class="choice-card" data-help="bad1">Fix printer.</button>
      <button class="choice-card" data-help="good">You are an IT support assistant. Give 5 safe first checks for a connected printer that is not printing. Avoid destructive actions.</button>
      <button class="choice-card" data-help="bad2">Tell me how to delete everything and start over.</button>
    </div>`;
  qa("[data-help]").forEach(b=>b.onclick=()=>{
    if(b.dataset.help!=="good") return addMistake("❌ Choose a prompt that is specific, safe and asks for non-destructive first checks.");
    $("aiMain").insertAdjacentHTML("beforeend",`<div class="ai-chat">
      <div class="bubble bot">1. Check printer status and errors.<br>2. Confirm the correct printer is selected.<br>3. Check the print queue.<br>4. Check USB/network connection.<br>5. Restart the printer/app if appropriate.</div>
    </div><button class="primary-btn ai-next" id="helpDone">✅ I would verify and apply safe checks first</button>`);
    $("helpDone").onclick=()=>{stage4Data.helpdesk=true;feedback("✅ Great. AI supported your troubleshooting, but you kept human judgment and safety in control.","good",true);stageStep++;setTimeout(renderSimulator,650)};
  });
}

/* ===================== STAGE 5 ===================== */
function shuffle(a){
  const x=[...a];
  for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}
  return x;
}
function prepareFinalTickets(){
  finalTickets=shuffle(FINAL_POOL).slice(0,5);
  finalTicketIndex=0;
}
function renderStage5(){
  if(finalTicketIndex>=finalTickets.length){ stageStep=finalTickets.length; renderStepList(); finishStage(); return; }
  stageStep=finalTicketIndex;
  const t=finalTickets[finalTicketIndex];
  setInstruction(t.title,t.text);
  $("simulator").innerHTML=`<div class="final-stage"><div class="final-room">
    <span class="scene-label">SCHOOL IT SUPPORT CENTER • FINAL PRACTICAL</span>
    <aside class="ticket-board"><h3>📋 Support Queue</h3>
      ${finalTickets.map((x,i)=>`<div class="ticket ${i===finalTicketIndex?"active":i<finalTicketIndex?"done":""}">${i<finalTicketIndex?"✅":i+1+"."} ${esc(x.title.replace("Ticket: ","").replace("Security Alert: ","").replace("AI Check: ",""))}</div>`).join("")}
    </aside>
    <div class="final-monitor"></div><div class="final-tower"></div><div class="final-printer"></div><div class="support-desk"></div>
    <div class="final-tools">
      ${t.options.map((o,i)=>`<button class="diagnostic-btn" data-final-choice="${i}" type="button">${esc(o)}</button>`).join("")}
    </div>
  </div></div>`;
  qa("[data-final-choice]").forEach(b=>b.onclick=()=>answerFinal(Number(b.dataset.finalChoice)));
  feedback("Read the ticket, then choose the safest and most useful first action.","info");
}
function answerFinal(i){
  const t=finalTickets[finalTicketIndex];
  if(i===t.correct){
    feedback("✅ Ticket resolved with a sensible first troubleshooting action.","good",true);
    finalTicketIndex++; stageStep=finalTicketIndex;
    setTimeout(renderSimulator,650);
  }else{
    const unsafe=(t.safety||[]).includes(i);
    addMistake(unsafe
      ?"🛡️ Unsafe choice. Avoid destructive actions, opening powered equipment, or sharing private information."
      :"❌ That is not the best first check for this symptom. Start with the simplest relevant and reversible check.");
  }
}

/* ===================== TOOLS / CERTIFICATE ===================== */
function showCertificate(){
  if(!state.completed.includes(5)) return toast("Complete all five stages first.");
  const scores=Object.values(state.stageScores).map(Number).filter(Number.isFinite);
  const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  $("certName").textContent=profile.display_name||profile.username||"Student";
  $("certClass").textContent=profile.class_number;
  $("certScore").textContent=avg+"%";
  $("certDate").textContent=state.completedAt?new Date(state.completedAt).toLocaleDateString():new Date().toLocaleDateString();
  $("certId").textContent=state.certificateId||makeCertificateId();
  openModal(`<h2>🎓 Certificate Ready</h2>
    <p>Your five-stage practical certification has been completed.</p>
    <div class="summary-grid">
      <article class="summary-card"><b>${avg}%</b><small>Average stage score</small></article>
      <article class="summary-card"><b>5 / 5</b><small>Stages completed</small></article>
      <article class="summary-card"><b>Class ${profile.class_number}</b><small>Learning level</small></article>
      <article class="summary-card"><b>Level 2</b><small>Junior Technician</small></article>
    </div>
    <div class="modal-actions"><button class="go" id="printCertBtn">🖨️ Print / Save Certificate</button></div>`);
  $("printCertBtn").onclick=()=>window.print();
}
function showNotes(){
  openModal(`<h2>📋 Mission Notes</h2><p>Use this space for troubleshooting observations. Notes stay on this device in V24.</p>
    <textarea id="notesArea" class="notes-box" placeholder="Example: No Signal → checked HDMI cable → checked monitor input...">${esc(state.notes||"")}</textarea>
    <div class="modal-actions"><button class="go" id="saveNotesBtn">💾 Save Notes</button></div>`);
  $("saveNotesBtn").onclick=()=>{state.notes=$("notesArea").value.slice(0,5000);saveState();closeModal();toast("Mission notes saved")};
}
function aiHelper(){
  if(!activeStage) return toast("Open a stage first.");
  const hints={
    1:"Match connector type to connector label. The correct cable must join two endpoints that serve the same connection.",
    2:"Look at the part shape and the motherboard label. CPU → socket, RAM → memory slot, M.2 SSD → M.2 slot.",
    3:"Think like a normal Windows user: organise files with folders, Recycle Bin and Task Manager before using drastic actions.",
    4:"A strong AI user is clear, protects private data and verifies important output.",
    5:"Start with the symptom. Choose the simplest safe check that directly relates to it."
  };
  openModal(`<h2>🤖 Safe AI Helper</h2><p>This is a local simulated helper — no paid AI API is required.</p>
    <div style="padding:14px;border-radius:15px;background:#eef1ff;color:#3e4670;font-size:11px;line-height:1.65">${esc(hints[activeStage])}</div>
    <p>Use AI as a clue, not as automatic truth. You still make the final decision.</p>`);
}
function showInspect(){
  qa(".port,.slot,.drop-target,.folder-target,.recycle-target").forEach(x=>x.classList.toggle("target"));
  setTimeout(clearTarget,2500);
  feedback("🔦 Inspect Mode: important ports, slots or targets are highlighted briefly.","info");
}
function resetLab(){
  const ok=confirm("Reset the entire Junior Technician Lab progress for this student on this device?");
  if(!ok) return;
  localStorage.removeItem(keyForStudent());
  state=freshState(); activeStage=null;
  $("labShell").classList.add("hidden");
  saveState(); renderStageMap(); toast("Lab progress reset");
}
function currentHint(){
  if(!activeStage) return;
  if(activeStage===1){
    const t=STAGE1_RULES[stageStep];
    addHint(t?.action==="poweron"?"All cables are complete — use the green POWER TEST button.":`Use ${t?.label}. Match the two ports named in the current instruction.`);
  }else if(activeStage===2){
    const t=STAGE2_TASKS[stageStep]; addHint(`${t?.label} belongs in the ${t?.target?.replace("-"," ")} area.`);
  }else if(activeStage===3){
    const hs=["Use the New Folder button in the taskbar.","Move Project.docx onto School Work.","Move Holiday.jpg onto Recycle Bin.","Open Recycle Bin and choose Restore.","Open Task Manager, then End Task for the frozen app."];
    addHint(hs[stageStep]||"Follow the current Windows instruction.");
  }else if(activeStage===4){
    const hs=["Match each prompt block with the same named slot.","Passwords, OTPs and exact home addresses are private.","AI answers should be verified with reliable sources.","Do not decide real/fake from appearance alone — check evidence.","Choose the prompt that asks for safe first checks."];
    addHint(hs[stageStep]||"Use privacy, verification and human judgment.");
  }else{
    addHint("Choose the simplest safe first check that directly matches the ticket symptom.");
  }
}

function bind(){
  $("voiceBtn").onclick=()=>{
    voiceOn=!voiceOn;
    $("voiceBtn").textContent=voiceOn?"🔊 Voice On":"🔇 Voice Off";
    if(voiceOn) speak("Voice guide is on.");
    else if("speechSynthesis" in window) speechSynthesis.cancel();
  };
  $("resetBtn").onclick=resetLab;
  $("certificateBtn").onclick=showCertificate;
  $("hearInstruction").onclick=()=>speak(`${$("missionTitle").textContent}. ${$("missionText").textContent}`);
  $("hintBtn").onclick=currentHint;
  $("inspectBtn").onclick=showInspect;
  $("showMeBtn").onclick=()=>{runHints++;state.totalHints=Number(state.totalHints||0)+1;saveState();updateMissionStats();showTarget();feedback("👀 Show Me: the current target is highlighted.","warn")};
  $("notesBtn").onclick=showNotes;
  $("aiHelperBtn").onclick=aiHelper;
  $("modalClose").onclick=closeModal;
  $("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
  window.addEventListener("resize",()=>{if(activeStage===1)setTimeout(redrawStage1Completed,60)});
}
async function init(){
  const ok=await loadProfile();
  if(!ok) return;
  bind();
  renderHeaderStats();
  renderStageMap();
  toast(`Welcome, ${profile.display_name||"Technician"} 🚀`);
}
init();
/* ============================================================
   V31.2 — CELEBRATION + FRIENDLY PROGRESSION + LEVEL 2 PC BUILD
   Additive upgrade only
   Paste immediately BEFORE final })();
   ============================================================ */

/* ------------------------------------------------------------
   UPGRADE STAGE 2 TASKS
   Existing array stays — we replace its items safely.
   ------------------------------------------------------------ */
STAGE2_TASKS.splice(
  0,
  STAGE2_TASKS.length,

  {
    part:"motherboard",
    target:"motherboard-bay",
    label:"Motherboard",
    title:"Step 1 — Install the motherboard",
    text:"Select the Motherboard and install it inside the main motherboard bay. The motherboard is the main board that connects the processor, RAM, storage and other components."
  },

  {
    part:"cpu",
    target:"cpu-slot",
    label:"Processor / CPU",
    title:"Step 2 — Install the processor",
    text:"Select the CPU and place it carefully into the CPU socket on the motherboard."
  },

  {
    part:"ram",
    target:"ram-slot",
    label:"RAM Module",
    title:"Step 3 — Install the RAM",
    text:"Select the RAM module and install it into the memory slot. Make sure the RAM notch matches the slot."
  },

  {
    part:"m2",
    target:"m2-slot",
    label:"M.2 SSD",
    title:"Step 4 — Install the M.2 SSD",
    text:"Install the M.2 SSD into the small M.2 storage slot on the motherboard."
  },

  {
    part:"sata",
    target:"sata-slot",
    label:"SATA SSD",
    title:"Step 5 — Install the SATA SSD",
    text:"Install the SATA SSD into the SSD drive bay. SATA storage normally needs both data and power connections."
  },

  {
    part:"hdd",
    target:"hdd-slot",
    label:"Hard Disk Drive",
    title:"Step 6 — Install the HDD",
    text:"Install the hard disk drive into the larger HDD bay. A hard disk stores files using magnetic storage."
  },

  {
    part:"cooler",
    target:"cooler-slot",
    label:"CPU Cooler",
    title:"Step 7 — Install the CPU cooler",
    text:"Install the CPU cooler over the processor area. The cooler removes heat from the CPU."
  },

  {
    part:"psu",
    target:"psu-slot",
    label:"SMPS / Power Supply",
    title:"Step 8 — Install the SMPS / PSU",
    text:"Install the power supply into the PSU bay. Never open an SMPS or PSU casing. This lab only teaches safe installation."
  }
);


/* ------------------------------------------------------------
   CELEBRATION HELPERS
   ------------------------------------------------------------ */

function v312CreateConfetti(host){
  if(!host) return;

  const old = host.querySelector(".v312-confetti-layer");
  if(old) old.remove();

  const layer = document.createElement("div");
  layer.className = "v312-confetti-layer";

  const pieces = ["🎉","⭐","🎊","✨","🎈","🏆","💫","🥳"];

  for(let i=0;i<65;i++){
    const piece = document.createElement("span");

    piece.textContent =
      pieces[Math.floor(Math.random()*pieces.length)];

    piece.style.left = `${Math.random()*100}%`;
    piece.style.animationDelay = `${Math.random()*1.6}s`;
    piece.style.animationDuration =
      `${2.4 + Math.random()*2.5}s`;

    piece.style.fontSize =
      `${12 + Math.random()*17}px`;

    layer.appendChild(piece);
  }

  host.appendChild(layer);

  setTimeout(()=>{
    layer.remove();
  },6000);
}


function v312StageOneMonitorCelebration(score){

  const monitor = document.querySelector(".monitor-device");
  const simulator = $("simulator");

  if(simulator){
    v312CreateConfetti(simulator);
  }

  if(!monitor) return;

  const old = monitor.querySelector(".v312-monitor-success");
  if(old) old.remove();

  const screen = document.createElement("div");
  screen.className = "v312-monitor-success";

  screen.innerHTML = `
    <div class="v312-success-stars">
      ✨ 🎉 ⭐ 🎊 ✨
    </div>

    <div class="v312-success-icon">
      🏆
    </div>

    <b>CONGRATULATIONS!</b>

    <strong>STAGE 1 COMPLETE</strong>

    <small>
      Workstation successfully connected
    </small>

    <div class="v312-screen-score">
      Practical Score: ${score}%
    </div>

    <div class="v312-stage-unlocked">
      🔓 STAGE 2 UNLOCKED
    </div>
  `;

  monitor.appendChild(screen);
}


function v312StageTwoCelebration(score){

  const simulator = $("simulator");
  if(!simulator) return;

  v312CreateConfetti(simulator);

  const old =
    simulator.querySelector(".v312-stage2-success");

  if(old) old.remove();

  const box = document.createElement("div");

  box.className = "v312-stage2-success";

  box.innerHTML = `
    <div class="v312-celebrate-icons">
      🎈 🎉 🥳 🎊 🎈
    </div>

    <div class="v312-big-trophy">
      🏆
    </div>

    <h2>PC ASSEMBLY COMPLETE!</h2>

    <p>
      Excellent work! You successfully assembled
      the major internal computer components.
    </p>

    <div class="v312-installed-list">
      ✅ Motherboard
      <br>✅ Processor / CPU
      <br>✅ RAM
      <br>✅ M.2 SSD
      <br>✅ SATA SSD
      <br>✅ HDD
      <br>✅ CPU Cooler
      <br>✅ SMPS / PSU
    </div>

    <strong>
      Practical Score: ${score}%
    </strong>

    <span>
      🌟 LEVEL 2 HARDWARE MISSION COMPLETE 🌟
    </span>
  `;

  simulator.appendChild(box);
}


/* ------------------------------------------------------------
   NEW FRIENDLY STAGE COMPLETION

   Important:
   Hints reduce score, but DO NOT block learning progress.
   Student must actually complete all required practical tasks.
   ------------------------------------------------------------ */

function finishStage(){

  const score = stageScore();
  const completedStage = activeStage;

  const firstCompletion =
    !state.completed.includes(completedStage);

  state.stageScores[completedStage] =
    Math.max(
      score,
      Number(state.stageScores[completedStage] || 0)
    );

  if(firstCompletion){

    state.completed.push(completedStage);

    state.completed.sort((a,b)=>a-b);

    state.xp =
      Number(state.xp || 0) +
      completedStage * 25;
  }

  if(completedStage < 5){

    state.unlocked =
      Math.max(
        Number(state.unlocked || 1),
        completedStage + 1
      );
  }

  if(completedStage === 5){

    state.unlocked = 5;

    if(!state.certificateId){
      state.certificateId = makeCertificateId();
    }

    if(!state.completedAt){
      state.completedAt =
        new Date().toISOString();
    }
  }

  saveState();
  renderStageMap();

  feedback(
    `✅ Stage ${completedStage} successfully completed!`,
    "good",
    true
  );


  /* STAGE 1 — MONITOR CELEBRATION */
  if(completedStage === 1){

    v312StageOneMonitorCelebration(score);

    speak(
      "Congratulations! Stage one complete. Excellent work! Stage two computer assembly lab is now unlocked."
    );
  }


  /* STAGE 2 — FULL ASSEMBLY CELEBRATION */
  else if(completedStage === 2){

    v312StageTwoCelebration(score);

    speak(
      "Fantastic work! Computer assembly complete. You successfully installed the major internal computer components."
    );
  }


  /* OTHER STAGES */
  else{

    v312CreateConfetti($("simulator"));
  }


  /* Give children time to enjoy celebration */
  setTimeout(()=>{

    if(completedStage < 5){

      const next = completedStage + 1;

      const nextName =
        STAGES.find(x=>x.id===next)?.name ||
        `Stage ${next}`;

      openModal(`
        <div class="v312-complete-modal">

          <div class="v312-modal-party">
            🎉 🎈 ⭐ 🏆 ⭐ 🎈 🎉
          </div>

          <h2>
            🏆 Stage ${completedStage} Complete!
          </h2>

          <p>
            Excellent practical work!
            You completed every required task.
          </p>

          ${
            score < 70
            ?
            `<div class="v312-learning-note">
               💡 Your practical score is
               <b>${score}%</b>.
               Hints helped you learn, so they no longer
               prevent you from continuing.
             </div>`
            :
            `<div class="v312-learning-note good">
               ⭐ Great practical score:
               <b>${score}%</b>
             </div>`
          }

          <div class="summary-grid">

            <article class="summary-card">
              <b>${score}%</b>
              <small>Practical Score</small>
            </article>

            <article class="summary-card">
              <b>${runMistakes}</b>
              <small>Mistakes</small>
            </article>

            <article class="summary-card">
              <b>${runHints}</b>
              <small>Hints Used</small>
            </article>

            <article class="summary-card">
              <b>+${completedStage*25} XP</b>
              <small>Reward</small>
            </article>

          </div>

          <div class="v312-next-banner">
            🔓 STAGE ${next} UNLOCKED
            <small>${nextName}</small>
          </div>

          <div class="modal-actions">

            <button
              class="soft"
              id="v312ReviewBtn"
            >
              Review Stage
            </button>

            <button
              class="go v312-next-button"
              id="v312NextBtn"
            >
              ▶ START STAGE ${next}
            </button>

          </div>

        </div>
      `);

      $("v312ReviewBtn").onclick = ()=>{
        closeModal();
      };

      $("v312NextBtn").onclick = ()=>{
        closeModal();
        openStage(next);
      };

    }

    else{

      openModal(`
        <div class="v312-complete-modal">

          <div class="v312-modal-party">
            🎉 🏆 🎊 ⭐ 🎈 ⭐ 🎊 🏆 🎉
          </div>

          <h2>
            🏆 Junior Digital & AI Technician Certified!
          </h2>

          <p>
            Congratulations!
            All five practical stages are complete.
          </p>

          <button
            class="go v312-next-button"
            id="v312CertificateBtn"
          >
            🏆 VIEW CERTIFICATE
          </button>

        </div>
      `);

      $("v312CertificateBtn").onclick = ()=>{
        closeModal();
        $("certificateBtn")?.click();
      };
    }

  },3200);
}


/* ============================================================
   NEW LEVEL 2 — FULL PC ASSEMBLY LAB
   Overrides old renderStage2 safely
   ============================================================ */

function renderStage2(){

  const t = STAGE2_TASKS[stageStep];

  if(!t){
    finishStage();
    return;
  }

  selectedPart = null;

  setInstruction(
    t.title,
    t.text
  );

  const installed = n =>
    stageStep > n
      ? "installed-part"
      : "";

  const current = n =>
    stageStep === n
      ? "v312-current-slot"
      : "";


  $("simulator").innerHTML = `

    <div class="v312-case-stage">

      <span class="scene-label">
        POWERED-OFF PC ASSEMBLY LAB • LEVEL 2
      </span>

      <div class="v312-assembly-progress">
        🔧 Assembly Step
        <b>${stageStep + 1} / ${STAGE2_TASKS.length}</b>
      </div>


      <div class="v312-pc-case">

        <div
          class="
            v312-motherboard-bay
            ${installed(0)}
            ${current(0)}
          "
          data-slot="motherboard-bay"
        >

          ${
            stageStep === 0
            ?
            `
              <div class="v312-empty-board">
                <span>⬇</span>
                <b>MOTHERBOARD BAY</b>
                <small>
                  Install the motherboard here first
                </small>
              </div>
            `
            :
            `
              <div class="v312-motherboard">

                <div class="v312-mb-title">
                  MOTHERBOARD
                </div>

                <i class="v312-trace t1"></i>
                <i class="v312-trace t2"></i>
                <i class="v312-trace t3"></i>

                <div
                  class="
                    v312-hardware-slot
                    v312-cpu-slot
                    ${installed(1)}
                    ${current(1)}
                  "
                  data-slot="cpu-slot"
                >
                  ${
                    stageStep > 1
                    ? "CPU ✓"
                    : "CPU SOCKET"
                  }
                </div>

                <div
                  class="
                    v312-hardware-slot
                    v312-ram-slot
                    ${installed(2)}
                    ${current(2)}
                  "
                  data-slot="ram-slot"
                >
                  ${
                    stageStep > 2
                    ? "RAM ✓"
                    : "RAM SLOT"
                  }
                </div>

                <div
                  class="
                    v312-hardware-slot
                    v312-m2-slot
                    ${installed(3)}
                    ${current(3)}
                  "
                  data-slot="m2-slot"
                >
                  ${
                    stageStep > 3
                    ? "M.2 SSD ✓"
                    : "M.2 SLOT"
                  }
                </div>

                <div
                  class="
                    v312-hardware-slot
                    v312-cooler-slot
                    ${installed(6)}
                    ${current(6)}
                  "
                  data-slot="cooler-slot"
                >
                  ${
                    stageStep > 6
                    ? "COOLER ✓"
                    : "CPU COOLER"
                  }
                </div>

              </div>
            `
          }

        </div>


        <div
          class="
            v312-drive-slot
            v312-ssd-bay
            ${installed(4)}
            ${current(4)}
          "
          data-slot="sata-slot"
        >
          <span>▰</span>
          <b>
            ${
              stageStep > 4
              ? "SATA SSD ✓"
              : "SATA SSD BAY"
            }
          </b>
        </div>


        <div
          class="
            v312-drive-slot
            v312-hdd-bay
            ${installed(5)}
            ${current(5)}
          "
          data-slot="hdd-slot"
        >
          <span>💽</span>
          <b>
            ${
              stageStep > 5
              ? "HDD ✓"
              : "HDD BAY"
            }
          </b>
        </div>


        <div
          class="
            v312-psu-bay
            ${installed(7)}
            ${current(7)}
          "
          data-slot="psu-slot"
        >

          <div class="v312-psu-fan">
            ✣
          </div>

          <b>
            ${
              stageStep > 7
              ? "SMPS / PSU ✓"
              : "SMPS / PSU BAY"
            }
          </b>

          <small>
            POWER SUPPLY
          </small>

        </div>

      </div>


      <div class="v312-parts-rack">

        <div class="v312-rack-title">
          🧰 COMPONENTS
          <small>
            Select a part, then choose its correct location
          </small>
        </div>

        ${
          [
            ["motherboard","🟩","Motherboard"],
            ["cpu","⚙️","Processor / CPU"],
            ["ram","🧠","RAM Module"],
            ["m2","▬","M.2 SSD"],
            ["sata","▰","SATA SSD"],
            ["hdd","💽","Hard Disk Drive"],
            ["cooler","🌀","CPU Cooler"],
            ["psu","⚡","SMPS / PSU"]
          ]

          .map((x,i)=>`

            <div
              class="
                v312-part-item
                ${i < stageStep ? "used" : ""}
                ${i === stageStep ? "current-part" : ""}
              "
              data-part="${x[0]}"
              draggable="${i >= stageStep}"
            >

              <span>${x[1]}</span>

              <b>${x[2]}</b>

              ${
                i < stageStep
                ? "<small>INSTALLED ✓</small>"
                : i === stageStep
                ? "<small>INSTALL NOW</small>"
                : "<small>WAITING</small>"
              }

            </div>

          `)

          .join("")
        }

      </div>


      <div class="v312-assembly-tip">

        <span>💡</span>

        <div>

          <b>Technician Tip</b>

          <small>
            Use the Hint or Show Me button whenever you
            need help. Hints support learning and will
            highlight the correct component and location.
          </small>

        </div>

      </div>

    </div>
  `;


  qa("[data-part]").forEach(el=>{

    el.onclick = ()=>{
      selectPart(
        el.dataset.part,
        el
      );
    };

    el.addEventListener(
      "dragstart",
      e=>{
        selectedPart =
          el.dataset.part;

        e.dataTransfer?.setData(
          "text/plain",
          selectedPart
        );
      }
    );

  });


  qa("[data-slot]").forEach(slot=>{

    slot.addEventListener(
      "dragover",
      e=>e.preventDefault()
    );

    slot.addEventListener(
      "drop",
      e=>{

        e.preventDefault();

        attemptPartDrop(
          e.dataTransfer?.getData("text/plain")
            || selectedPart,
          slot.dataset.slot,
          slot
        );

      }
    );

    slot.onclick = ()=>{

      if(selectedPart){

        attemptPartDrop(
          selectedPart,
          slot.dataset.slot,
          slot
        );

      }

    };

  });

}


/* ------------------------------------------------------------
   STAGE 2 PART SELECTION
   ------------------------------------------------------------ */

function selectPart(id,el){

  if(el.classList.contains("used")){
    return;
  }

  selectedPart = id;

  qa("[data-part]").forEach(x=>{
    x.classList.toggle(
      "selected",
      x === el
    );
  });

  const task =
    STAGE2_TASKS[stageStep];

  feedback(
    `Selected ${el.querySelector("b")?.textContent || el.textContent.trim()}. Now find the correct installation location.`,
    "info",
    false
  );

  if(task && id === task.part){

    document
      .querySelector(
        `[data-slot="${task.target}"]`
      )
      ?.classList
      .add("v312-soft-target");
  }

}


/* ------------------------------------------------------------
   STAGE 2 INSTALLATION CHECK
   ------------------------------------------------------------ */

function attemptPartDrop(part,target,el){

  const t =
    STAGE2_TASKS[stageStep];

  if(!t) return;


  if(
    part === t.part &&
    target === t.target
  ){

    el.classList.add(
      "correct-flash",
      "installed-part"
    );

    feedback(
      `✅ ${t.label} installed correctly!`,
      "good",
      true
    );

    selectedPart = null;

    stageStep++;

    setTimeout(()=>{
      renderSimulator();
    },850);

  }

  else{

    el.classList.add(
      "wrong-flash"
    );

    setTimeout(()=>{
      el.classList.remove(
        "wrong-flash"
      );
    },650);

    addMistake(
      "❌ That component does not belong there. Check the instruction or use a hint."
    );

  }

}



/* ============================================================
   V31.3 — LEVEL 2 EASY TOUCH / DRAG LOGIC
   Fix overlapping targets and improve mobile usability
   Paste BEFORE final })();
   ============================================================ */


/* ------------------------------------------------------------
   Easier component selection
   Only the CURRENT required component can be selected.
   Wrong waiting components do NOT add mistakes.
   ------------------------------------------------------------ */

function selectPart(id, el){

  const task = STAGE2_TASKS[stageStep];

  if(!task) return;

  if(el.classList.contains("used")){
    return;
  }

  /* Student selected a component that is not required yet */
  if(id !== task.part){

    selectedPart = null;

    qa("[data-part]").forEach(x=>{
      x.classList.remove("selected");
    });

    const correctPart =
      document.querySelector(
        `[data-part="${task.part}"]`
      );

    const correctSlot =
      document.querySelector(
        `[data-slot="${task.target}"]`
      );

    correctPart?.classList.add("target");
    correctSlot?.classList.add(
      "v312-soft-target"
    );

    feedback(
      `👉 Step ${stageStep + 1}: Select ${task.label} first. The correct component and installation area are highlighted.`,
      "warn",
      false
    );

    return;
  }


  selectedPart = id;

  qa("[data-part]").forEach(x=>{
    x.classList.toggle(
      "selected",
      x === el
    );
  });


  const target =
    document.querySelector(
      `[data-slot="${task.target}"]`
    );

  target?.classList.add(
    "v312-soft-target"
  );


  feedback(
    `✅ ${task.label} selected. Now tap or drop it on the glowing INSTALL HERE area.`,
    "good",
    false
  );
}


/* ------------------------------------------------------------
   Easier installation logic

   Wrong target caused by overlap / touch error does NOT
   punish the child. It simply highlights the correct area.
   ------------------------------------------------------------ */

function attemptPartDrop(part, target, el){

  const task =
    STAGE2_TASKS[stageStep];

  if(!task) return;


  /* Wrong component selected */
  if(part !== task.part){

    selectedPart = null;

    document
      .querySelector(
        `[data-part="${task.part}"]`
      )
      ?.classList
      .add("target");

    document
      .querySelector(
        `[data-slot="${task.target}"]`
      )
      ?.classList
      .add("v312-soft-target");

    feedback(
      `👉 Please use ${task.label} for this step.`,
      "warn",
      false
    );

    return;
  }


  /* Correct component but wrong installation location */
  if(target !== task.target){

    const correctTarget =
      document.querySelector(
        `[data-slot="${task.target}"]`
      );

    correctTarget?.classList.add(
      "v312-soft-target"
    );

    feedback(
      `💡 Almost there! Move ${task.label} to the glowing INSTALL HERE area.`,
      "warn",
      false
    );

    return;
  }


  /* SUCCESS */
  el.classList.add(
    "correct-flash",
    "installed-part"
  );

  feedback(
    `✅ Excellent! ${task.label} installed successfully.`,
    "good",
    true
  );

  selectedPart = null;

  stageStep++;


  /* Small success pause before next component */
  setTimeout(()=>{

    renderSimulator();

  },900);
}

/* ============================================================
   V31.4 — STAGE 5-A / 5-B FINAL EXAM + PREMIUM CERTIFICATE
   Final additive upgrade. Keep this inside the main IIFE.
   ============================================================ */

const V314_STAGE5_A = [
  {
    title:"Monitor shows NO SIGNAL",
    text:"The PC appears powered on, but the monitor says NO SIGNAL. Choose the safest first technician check.",
    label:"5-A1 • Display Troubleshooting",
    choices:[
      "Check the display cable and confirm the correct monitor input/source",
      "Format the storage drive",
      "Open the PSU casing",
      "Delete Windows system files"
    ],
    correct:0,
    hint:"Start with the simplest reversible check related directly to the display symptom."
  },
  {
    title:"Keyboard not detected",
    text:"The computer starts, but the keyboard is not responding. What should the technician check first?",
    label:"5-A2 • USB Troubleshooting",
    choices:[
      "Replace the monitor",
      "Check the keyboard USB connection and try another USB port",
      "Remove the CPU while the PC is powered on",
      "Delete the user's files"
    ],
    correct:1,
    hint:"Check the keyboard connection before replacing hardware."
  },
  {
    title:"App is frozen",
    text:"A school application is Not Responding. Choose the safest first software action.",
    label:"5-A3 • Windows Support",
    choices:[
      "Pull the power cable immediately",
      "Delete random system files",
      "Wait briefly, then use Task Manager if needed",
      "Open the SMPS casing"
    ],
    correct:2,
    hint:"Use a normal Windows troubleshooting tool before any drastic action."
  },
  {
    title:"Printer connected but not printing",
    text:"The printer is powered and connected, but the print job is not coming out. Choose the best first check.",
    label:"5-A4 • Printer Support",
    choices:[
      "Check printer status, queue, paper/toner and the selected printer",
      "Replace the motherboard",
      "Share the user's password",
      "Remove the SSD"
    ],
    correct:0,
    hint:"Check status and simple printer conditions before replacing hardware."
  },
  {
    title:"Deleted file needed again",
    text:"A student accidentally deleted a document a few minutes ago. What is the best first recovery action?",
    label:"5-A5 • File Recovery",
    choices:[
      "Format the PC",
      "Reset the router",
      "Check Recycle Bin and restore the file",
      "Replace RAM"
    ],
    correct:2,
    hint:"Windows usually gives you a safe recovery location for recently deleted files."
  }
];

const V314_STAGE5_B = [
  {
    title:"AI gives a surprising fact",
    text:"An AI assistant gives a surprising science fact with no source. What should you do next?",
    label:"5-B1 • AI Verification",
    choices:[
      "Trust it automatically",
      "Verify the claim with reliable sources",
      "Post it everywhere immediately",
      "Give the AI your OTP"
    ],
    correct:1,
    hint:"AI can be wrong. Important claims should be checked with reliable sources."
  },
  {
    title:"Password and OTP request",
    text:"A popup asks for your school password and OTP to fix your account. Choose the safest response.",
    label:"5-B2 • Privacy & Cyber Safety",
    choices:[
      "Enter the password and OTP immediately",
      "Send them to a classmate",
      "Keep them private and report/verify the request through a trusted channel",
      "Paste them into an AI chat"
    ],
    correct:2,
    hint:"Passwords and OTPs are private. Never share them with unknown tools or people."
  },
  {
    title:"Safe AI printer prompt",
    text:"Which AI prompt is safest and most useful for a printer that is connected but not printing?",
    label:"5-B3 • Responsible AI Support",
    choices:[
      "Delete everything and start over",
      "Tell me how to bypass school security",
      "Give safe first checks for printer status, queue, paper/toner, cable/network and default printer selection",
      "Hack the printer admin password"
    ],
    correct:2,
    hint:"A good IT-support prompt asks for specific, safe and non-destructive first checks."
  },
  {
    title:"Suspicious edited image",
    text:"A dramatic image is circulating online with no clear source. What is the best response?",
    label:"5-B4 • Media Verification",
    choices:[
      "Decide it is real because it looks realistic",
      "Check source, date, context and supporting evidence",
      "Share it immediately",
      "Decide it is fake only because it looks unusual"
    ],
    correct:1,
    hint:"Appearance alone is not proof. Check source and evidence."
  },
  {
    title:"Computer is overheating",
    text:"A classmate says the computer is unusually hot. Choose the safest technician response.",
    label:"5-B5 • Safe Technician Judgment",
    choices:[
      "Open the PSU while it is powered on",
      "Pour water on the computer",
      "Shut down safely and ask a trusted adult/technician to inspect cooling and airflow",
      "Touch internal powered parts to find the hot component"
    ],
    correct:2,
    hint:"Power down safely before any real hardware inspection."
  }
];

let v314Stage5Part = "A";
let v314Stage5Index = 0;
let v314Stage5Hint = "";

/* Migrate old Stage 5 completion once: the new certificate requires 5-A + 5-B. */
function loadState(){
  try{
    state=normalizeState(JSON.parse(localStorage.getItem(keyForStudent()) || "null"));
  }catch{
    state=freshState();
  }
  if(state.completed.includes(5) && state.stage5ABPassed!==true){
    state.completed=state.completed.filter(x=>x!==5);
    state.unlocked=Math.max(5,Number(state.unlocked||1));
    state.certificateId="";
    state.completedAt="";
    localStorage.setItem(keyForStudent(),JSON.stringify(state));
  }
}

function prepareFinalTickets(){
  v314Stage5Part="A";
  v314Stage5Index=0;
  v314Stage5Hint="";
  finalTickets=[];
  finalTicketIndex=0;
}

function stageSteps(){
  if(activeStage===1) return STAGE1_RULES.map(x=>x.title);
  if(activeStage===2) return STAGE2_TASKS.map(x=>x.title);
  if(activeStage===3) return ["Create a School Work folder","Move Project.docx into the folder","Delete Holiday.jpg","Restore Holiday.jpg from Recycle Bin","Close a frozen app with Task Manager"];
  if(activeStage===4) return ["Build a strong AI prompt","Sort safe vs private information","Verify an AI claim","Use evidence for AI/edited media","Choose a safe IT-support AI prompt"];
  if(activeStage===5){
    return [
      ...V314_STAGE5_A.map((x,i)=>`5-A${i+1} • ${x.title}`),
      ...V314_STAGE5_B.map((x,i)=>`5-B${i+1} • ${x.title}`)
    ];
  }
  return [];
}

function v314ShuffleChoices(question){
  const items=question.choices.map((text,index)=>({text,index}));
  for(let i=items.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [items[i],items[j]]=[items[j],items[i]];
  }
  return items;
}

function v314Stage5Question(){
  const bank=v314Stage5Part==="A"?V314_STAGE5_A:V314_STAGE5_B;
  return bank[v314Stage5Index]||null;
}

function v314TotalStep(){
  return v314Stage5Part==="A" ? v314Stage5Index : V314_STAGE5_A.length+v314Stage5Index;
}

function renderStage5(){
  const q=v314Stage5Question();
  if(!q){
    state.stage5ABPassed=true;
    stageStep=V314_STAGE5_A.length+V314_STAGE5_B.length;
    renderStepList();
    finishStage();
    return;
  }

  stageStep=v314TotalStep();
  setInstruction(`${v314Stage5Part==="A"?"Stage 5-A":"Stage 5-B"} — ${q.title}`,q.text);
  v314Stage5Hint=q.hint;
  const shuffled=v314ShuffleChoices(q);
  const total=V314_STAGE5_A.length+V314_STAGE5_B.length;
  const number=stageStep+1;

  $("simulator").innerHTML=`
    <div class="v314-final-mission">
      <div class="v314-final-badges">
        <span class="${v314Stage5Part==="A"?"active":""}">5-A • Practical Support Exam</span>
        <span class="${v314Stage5Part==="B"?"active":""}">5-B • AI & Cyber Safety Exam</span>
        <span class="v314-question-count">Question ${number} / ${total}</span>
      </div>

      <div class="v314-final-layout">
        <aside class="v314-ticket-queue">
          <div class="v314-ticket-title">📋 Final Certification Queue</div>
          <div class="v314-ticket-group">
            <b>Stage 5-A • Support Skills</b>
            ${V314_STAGE5_A.map((x,i)=>{
              const done=v314Stage5Part==="B" || (v314Stage5Part==="A" && i<v314Stage5Index);
              const current=v314Stage5Part==="A" && i===v314Stage5Index;
              return `<div class="v314-ticket ${done?"done":current?"current":""}">${done?"✅":current?"▶":"○"} ${esc(x.title)}</div>`;
            }).join("")}
          </div>
          <div class="v314-ticket-group">
            <b>Stage 5-B • Smart Technician</b>
            ${V314_STAGE5_B.map((x,i)=>{
              const done=v314Stage5Part==="B" && i<v314Stage5Index;
              const current=v314Stage5Part==="B" && i===v314Stage5Index;
              return `<div class="v314-ticket ${done?"done":current?"current":""}">${done?"✅":current?"▶":"○"} ${esc(x.title)}</div>`;
            }).join("")}
          </div>
        </aside>

        <section class="v314-exam-area">
          <div class="v314-exam-monitor">
            <div class="v314-exam-screen">
              <span>${esc(q.label)}</span>
              <h3>${esc(q.title)}</h3>
              <p>${esc(q.text)}</p>
              <small>Choose the safest and most useful first action.</small>
            </div>
          </div>
          <div class="v314-exam-tower"><i></i></div>
          <div class="v314-exam-desk"></div>

          <div class="v314-choice-grid">
            ${shuffled.map((choice,pos)=>`<button class="diagnostic-btn v314-choice" type="button" data-v314-answer="${choice.index}"><span>${String.fromCharCode(65+pos)}</span>${esc(choice.text)}</button>`).join("")}
          </div>
        </section>
      </div>
    </div>`;

  qa("[data-v314-answer]").forEach(btn=>{
    btn.onclick=()=>v314AnswerStage5(Number(btn.dataset.v314Answer));
  });
  feedback(`Final Exam ${v314Stage5Part}: read the scenario and choose the safest first action. Options are shuffled.`,"info");
}

function v314AnswerStage5(answerIndex){
  const q=v314Stage5Question();
  if(!q) return;
  if(answerIndex!==q.correct){
    addMistake("❌ Not the best first action. Think safe, simple and reversible. Use Hint if needed.");
    return;
  }

  feedback("✅ Correct. Good technician judgment!","good",true);
  v314Stage5Index++;

  const bank=v314Stage5Part==="A"?V314_STAGE5_A:V314_STAGE5_B;
  if(v314Stage5Index<bank.length){
    setTimeout(renderSimulator,650);
    return;
  }

  if(v314Stage5Part==="A"){
    setTimeout(()=>{
      openModal(`
        <div class="v314-part-complete">
          <div class="v314-part-party">🎉 🔧 ⭐ 🏆 ⭐ 🔧 🎉</div>
          <h2>Stage 5-A Complete!</h2>
          <p>You passed the Practical Support Exam.</p>
          <div class="v314-part-next"><b>Next: Stage 5-B</b><small>AI Safety • Cyber Safety • Responsible Technician Decisions</small></div>
          <div class="modal-actions"><button class="go" id="v314StartB">▶ START STAGE 5-B</button></div>
        </div>`);
      $("v314StartB").onclick=()=>{
        closeModal();
        v314Stage5Part="B";
        v314Stage5Index=0;
        stageStep=V314_STAGE5_A.length;
        renderSimulator();
      };
    },550);
    return;
  }

  state.stage5ABPassed=true;
  stageStep=V314_STAGE5_A.length+V314_STAGE5_B.length;
  renderStepList();
  setTimeout(()=>finishStage(),650);
}

/* Upgrade Hint behavior for Stage 5 while keeping all earlier stages intact. */
function currentHint(){
  if(!activeStage) return;
  if(activeStage===1){
    const t=STAGE1_RULES[stageStep];
    addHint(t?.action==="poweron"?"All cables are complete — use the green POWER TEST button.":`Use ${t?.label}. Match the two ports named in the current instruction.`);
  }else if(activeStage===2){
    const t=STAGE2_TASKS[stageStep];
    addHint(`${t?.label} belongs in the ${t?.target?.replace("-"," ")} area.`);
  }else if(activeStage===3){
    const hs=["Use the New Folder button in the taskbar.","Move Project.docx onto School Work.","Move Holiday.jpg onto Recycle Bin.","Open Recycle Bin and choose Restore.","Open Task Manager, then End Task for the frozen app."];
    addHint(hs[stageStep]||"Follow the current Windows instruction.");
  }else if(activeStage===4){
    const hs=["Match each prompt block with the same named slot.","Passwords, OTPs and exact home addresses are private.","AI answers should be verified with reliable sources.","Do not decide real/fake from appearance alone — check evidence.","Choose the prompt that asks for safe first checks."];
    addHint(hs[stageStep]||"Use privacy, verification and human judgment.");
  }else if(activeStage===5){
    addHint(v314Stage5Hint||"Choose the simplest safe and reversible first action.",false);
  }
}

/* Premium certificate helpers */
function v314AverageScore(){
  const scores=Object.values(state.stageScores||{}).map(Number).filter(Number.isFinite);
  return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
}

function v314CertificateDocument(){
  const name=esc(profile?.display_name||profile?.username||"Student");
  const classNo=esc(profile?.class_number||"");
  const avg=v314AverageScore();
  const certId=esc(state.certificateId||makeCertificateId());
  const date=esc(state.completedAt?new Date(state.completedAt).toLocaleDateString():new Date().toLocaleDateString());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Certificate - ${name}</title>
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
html,body{margin:0;background:#dfe5ec;font-family:Georgia,'Times New Roman',serif;color:#132b5b}
.toolbar{width:210mm;margin:12px auto 6px;display:flex;justify-content:flex-end;font-family:Arial,sans-serif}
.toolbar button{border:0;border-radius:12px;padding:11px 18px;background:linear-gradient(135deg,#465fff,#18b8c1);color:white;font-weight:900;cursor:pointer}
.certificate{width:210mm;height:297mm;margin:0 auto;background:#fff;position:relative;overflow:hidden;box-shadow:0 18px 50px #17223a33;padding:15mm}
.frame1{position:absolute;inset:7mm;border:2.5mm solid #063f79;pointer-events:none}
.frame2{position:absolute;inset:10mm;border:.7mm solid #d5a52e;pointer-events:none}
.frame3{position:absolute;inset:12mm;border:.35mm solid #0a7c93;pointer-events:none}
.corner{position:absolute;width:78mm;height:78mm;z-index:0;opacity:.98;background:linear-gradient(135deg,#063f79 0 29%,#057c9b 30% 43%,#d1a12d 44% 52%,#f7e6b5 53% 58%,transparent 59%);clip-path:polygon(0 0,100% 0,0 100%)}
.c1{left:7mm;top:7mm}.c2{right:7mm;top:7mm;transform:scaleX(-1)}.c3{left:7mm;bottom:7mm;transform:scaleY(-1)}.c4{right:7mm;bottom:7mm;transform:scale(-1)}
.inner{position:relative;z-index:2;text-align:center;height:100%;padding:5mm 12mm;display:flex;flex-direction:column;align-items:center}
.academy{font:900 13px Arial,sans-serif;letter-spacing:3px;color:#173e7b;margin-top:3mm;text-transform:uppercase}
.logo{width:25mm;height:25mm;border-radius:7mm;margin:7mm auto 4mm;display:grid;place-items:center;background:linear-gradient(145deg,#5564ff,#25c3c7);color:#fff;font:1000 42px Arial,sans-serif;box-shadow:0 4mm 8mm #344f9933;border:1mm solid #ffffff}
.cert-of{font-size:31px;font-style:italic;margin:1mm 0 -1mm;color:#102f68;font-weight:500}
.achievement{font-size:38px;margin:0;color:#a97314;text-transform:uppercase;letter-spacing:1.5px;line-height:1}
.ribbon{margin:5mm auto 4mm;padding:3mm 12mm;color:#fff;background:linear-gradient(90deg,#06477c,#07899c,#06477c);border-top:.7mm solid #d9ae40;border-bottom:.7mm solid #d9ae40;font:900 17px Arial,sans-serif;letter-spacing:1.2px;clip-path:polygon(4% 0,96% 0,100% 50%,96% 100%,4% 100%,0 50%)}
.id{font:700 11px Arial,sans-serif;color:#415678;margin-top:1mm}.presented{font-size:16px;margin-top:5mm}.name{font-size:42px;font-style:italic;color:#1f347a;margin:3mm 0 4mm;border-bottom:.5mm solid #d1a538;padding:0 8mm 2mm;min-width:100mm}
.desc{max-width:155mm;font-size:15px;line-height:1.55;color:#34486b}.skills{max-width:160mm;margin:4mm auto;font:800 13px/1.7 Arial,sans-serif;color:#08786f}.award{font-size:24px;font-weight:800;color:#1b3472;margin:2mm 0}.meta{font:700 11px Arial,sans-serif;color:#3e5275;margin-top:3mm}
.seal{width:36mm;height:36mm;border-radius:50%;margin:5mm auto 3mm;display:grid;place-items:center;text-align:center;color:#fff8d2;background:radial-gradient(circle,#0b3d78 0 45%,#d6a632 46% 55%,#063b72 56% 64%,#f4dc92 65% 100%);box-shadow:0 3mm 6mm #18356633;font:900 9px/1.35 Arial,sans-serif;position:relative}
.seal:after{content:'';position:absolute;bottom:-10mm;width:19mm;height:14mm;background:linear-gradient(90deg,#063f79,#07899c,#063f79);clip-path:polygon(0 0,100% 0,78% 100%,50% 72%,22% 100%);z-index:-1}
.signs{width:100%;display:flex;justify-content:space-between;gap:20mm;margin-top:auto;margin-bottom:8mm;font-family:Arial,sans-serif}
.sign{width:42%;border-top:.4mm solid #6a7690;padding-top:2mm}
.sign b{display:block;font-size:14px;color:#18326c}
.sign small{display:block;font-size:9px;color:#63708a;margin-top:1mm}

/* V31.7 — Custom Tannu mentor signature */
.tannu-sign-box{position:relative}
.tannu-signature{
  position:relative;
  display:inline-block;
  width:56mm;
  height:19mm;
  margin:-13mm auto 1.5mm;
  transform:rotate(-5deg) skewX(-5deg);
  user-select:none;
  -webkit-user-select:none;
}
.tannu-signature .ts-main{
  position:absolute;
  left:3mm;
  top:1mm;
  z-index:4;
  display:block;
  font-family:"Brush Script MT","Segoe Script","Lucida Handwriting",cursive;
  font-size:18mm;
  line-height:18mm;
  font-weight:700;
  letter-spacing:-1.1mm;
  color:#102d68;
  white-space:nowrap;
  text-shadow:
    .25mm .3mm 0 rgba(213,165,46,.55),
    -.18mm -.18mm 0 #fff,
    .8mm 1mm 1.7mm rgba(12,31,72,.18);
}
.tannu-signature .ts-shadow{
  position:absolute;
  left:3.5mm;
  top:1.5mm;
  z-index:2;
  font-family:"Brush Script MT","Segoe Script","Lucida Handwriting",cursive;
  font-size:18mm;
  line-height:18mm;
  font-weight:700;
  letter-spacing:-1.1mm;
  color:transparent;
  -webkit-text-stroke:.28mm rgba(8,64,123,.22);
  transform:skewX(-8deg) scaleX(1.015);
  white-space:nowrap;
}
.tannu-signature .ts-scratch{
  position:absolute;
  z-index:5;
  left:0;
  right:0;
  bottom:2.6mm;
  height:1mm;
  border-radius:50%;
  background:linear-gradient(90deg,transparent 0%,#d0a02d 8%,#0c3673 30%,#07899c 66%,#d0a02d 90%,transparent 100%);
  transform:rotate(-4deg) skewX(-31deg);
  box-shadow:
    0 1.7mm 0 -.68mm rgba(10,59,119,.58),
    0 -1.05mm 0 -.8mm rgba(213,165,46,.78);
}
.tannu-signature .ts-scratch::before{
  content:"";
  position:absolute;
  left:4mm;
  top:-3.5mm;
  width:34mm;
  height:5.5mm;
  border-bottom:.62mm solid rgba(13,62,126,.78);
  border-radius:50%;
  transform:rotate(5deg);
}
.tannu-signature .ts-scratch::after{
  content:"";
  position:absolute;
  right:-1mm;
  top:-2.7mm;
  width:14mm;
  height:5.5mm;
  border-top:.72mm solid #0a407b;
  border-radius:50%;
  transform:rotate(-18deg);
}
.tannu-signature .ts-mark{
  position:absolute;
  z-index:6;
  right:-2mm;
  top:-.5mm;
  color:#d5a52e;
  font-size:5mm;
  transform:rotate(24deg);
  text-shadow:.45mm .45mm .9mm rgba(15,42,87,.18);
}
.tannu-sign-box small{
  margin-top:2mm!important;
  font-weight:800;
  letter-spacing:.35px;
}
@media print{html,body{background:#fff}.toolbar{display:none}.certificate{box-shadow:none;margin:0}}
</style>
</head>
<body>
<div class="toolbar"><button onclick="window.print()">🖨 Print / Save PDF</button></div>
<section class="certificate">
  <div class="frame1"></div><div class="frame2"></div><div class="frame3"></div>
  <div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
  <div class="inner">
    <div class="academy">Tannu Sir's Kids Digital Academy</div>
    <div class="logo">T</div>
    <div class="cert-of">Certificate Of</div>
    <h1 class="achievement">Achievement</h1>
    <div class="ribbon">JUNIOR DIGITAL &amp; AI TECHNICIAN</div>
    <div class="id">Certificate ID: ${certId}</div>
    <div class="presented">This certificate is proudly presented to</div>
    <div class="name">${name}</div>
    <div class="desc">for successfully completing the full five-stage practical certification, including the Stage 5-A Practical Support Exam and Stage 5-B AI &amp; Cyber Safety Exam, and demonstrating safe hands-on digital technician skills.</div>
    <div class="skills">Computer Hardware • PC Assembly • Windows &amp; Software • AI Literacy • Cyber Safety • Troubleshooting</div>
    <div class="award">Junior Digital &amp; AI Technician — Level 2</div>
    <div class="meta">Class ${classNo} &nbsp;•&nbsp; Final Score ${avg}% &nbsp;•&nbsp; Date ${date}</div>
    <div class="seal">VERIFIED<br>PRACTICAL<br>ACHIEVEMENT</div>
    <div class="signs">
      <div class="sign tannu-sign-box">
        <div class="tannu-signature" aria-label="Tannu signature">
          <span class="ts-shadow">Tannu</span>
          <span class="ts-main">Tannu</span>
          <span class="ts-scratch"></span>
          <span class="ts-mark">✦</span>
        </div>
        <small>Academy Mentor</small>
      </div>
      <div class="sign"><b>Verified Practical Path</b><small>5 Stages • Stage 5-A + 5-B Passed</small></div>
    </div>
  </div>
</section>
</body>
</html>`;
}

function showCertificate(){
  if(!state.completed.includes(5) || state.stage5ABPassed!==true){
    return toast("Complete Stage 5-A and Stage 5-B first.");
  }
  if(!state.certificateId){
    state.certificateId=makeCertificateId();
    saveState();
  }
  const win=window.open("","_blank");
  if(!win){
    toast("Please allow popups to open the certificate.");
    return;
  }
  win.document.open();
  win.document.write(v314CertificateDocument());
  win.document.close();
}


/* ============================================================
   V31.5 — DIRECT STAGE 5 TEST LINK
   URL: ?stage=5&test=1
   Test mode bypasses the stage lock only for Stage 5.
   Test-mode progress is NOT saved to student certification data.
   ============================================================ */

const V315_QUERY = new URLSearchParams(window.location.search);
const V315_DIRECT_STAGE5_TEST =
  V315_QUERY.get("test") === "1" &&
  V315_QUERY.get("stage") === "5";

/* Keep test-mode mistakes/hints/completion out of saved student progress. */
const v315SaveStateOriginal = saveState;
saveState = function(){
  if(V315_DIRECT_STAGE5_TEST && activeStage === 5){
    renderHeaderStats();
    return;
  }
  return v315SaveStateOriginal();
};

/* Allow Stage 5 to open from the special test URL without permanently unlocking it. */
const v315OpenStageOriginal = openStage;
openStage = function(id){
  const stageId = Number(id);

  if(V315_DIRECT_STAGE5_TEST && stageId === 5 && state){
    const originalUnlocked = Number(state.unlocked || 1);
    state.unlocked = Math.max(originalUnlocked, 5);

    try{
      return v315OpenStageOriginal(5);
    }finally{
      state.unlocked = originalUnlocked;
    }
  }

  return v315OpenStageOriginal(stageId);
};

/* Finishing Stage 5 from the test shortcut must not issue the real certificate. */
const v315FinishStageOriginal = finishStage;
finishStage = function(){
  if(V315_DIRECT_STAGE5_TEST && activeStage === 5){
    if(state){
      state.stage5ABPassed = false;
    }

    feedback(
      "✅ Stage 5 test completed. Test-mode progress was not saved.",
      "good",
      true
    );

    openModal(`
      <div class="v312-complete-modal">
        <div class="v312-modal-party">🧪 🎉 ⭐ 🏆 ⭐ 🎉 🧪</div>
        <h2>Stage 5 Test Complete!</h2>
        <p>You finished Stage 5-A and Stage 5-B in testing mode.</p>
        <div class="v312-learning-note good">
          This shortcut is for checking the final exam only. It does not unlock the real certificate or save Stage 5 as officially completed.
        </div>
        <div class="modal-actions">
          <button class="soft" id="v315ReplayStage5" type="button">↺ Replay Stage 5</button>
          <button class="go" id="v315ExitTest" type="button">🌌 Return to Student Home</button>
        </div>
      </div>
    `);

    $("v315ReplayStage5").onclick = ()=>{
      closeModal();
      openStage(5);
    };

    $("v315ExitTest").onclick = ()=>{
      location.href = "advanced-universe.html";
    };

    return;
  }

  return v315FinishStageOriginal();
};

function v315OpenDirectStage5WhenReady(){
  if(!V315_DIRECT_STAGE5_TEST) return;

  if(!profile || !state){
    setTimeout(v315OpenDirectStage5WhenReady, 120);
    return;
  }

  if(activeStage === 5) return;

  openStage(5);

  setTimeout(()=>{
    if($("workStatusText")){
      $("workStatusText").textContent = "Stage 5 Test Mode • Progress Not Saved";
    }
    if($("environmentTag")){
      $("environmentTag").textContent = "TEST MODE • FINAL EXAM";
    }
    if($("safetyRule")){
      $("safetyRule").textContent = "Testing shortcut only. Complete the normal Stage 1 → 5 path for the official certificate.";
    }
    toast("🧪 Stage 5 test mode opened directly");
  },80);
}

setTimeout(v315OpenDirectStage5WhenReady, 120);


/* ============================================================
   V31.6 — CONNECT FINAL EXAM TO NEW PREMIUM CERTIFICATE
   - Normal path: Stage 1 → 2 → 3 → 4 → 5-A → 5-B → official certificate
   - Direct test link: Stage 5-A → 5-B → premium certificate preview
   - Test preview never saves official certification progress
   ============================================================ */

function v316PremiumCertificatePreviewDocument(){
  const name=esc(profile?.display_name||profile?.username||"Student");
  const classNo=esc(profile?.class_number||"");
  const score=Math.max(0,stageScore());
  const previewId=`PREVIEW-${makeCertificateId()}`;
  const date=esc(new Date().toLocaleDateString());

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Premium Certificate Preview - ${name}</title>
<style>
@page{size:A4 portrait;margin:0}
*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
html,body{margin:0;background:#dfe5ec;font-family:Georgia,'Times New Roman',serif;color:#132b5b}
.toolbar{width:210mm;margin:12px auto 6px;display:flex;justify-content:space-between;align-items:center;font-family:Arial,sans-serif}
.toolbar .preview-note{font-size:12px;font-weight:900;color:#7b4b00;background:#fff2c7;padding:9px 12px;border-radius:10px}
.toolbar button{border:0;border-radius:12px;padding:11px 18px;background:linear-gradient(135deg,#465fff,#18b8c1);color:white;font-weight:900;cursor:pointer}
.certificate{width:210mm;height:297mm;margin:0 auto;background:#fff;position:relative;overflow:hidden;box-shadow:0 18px 50px #17223a33;padding:15mm}
.frame1{position:absolute;inset:7mm;border:2.5mm solid #063f79;pointer-events:none}
.frame2{position:absolute;inset:10mm;border:.7mm solid #d5a52e;pointer-events:none}
.frame3{position:absolute;inset:12mm;border:.35mm solid #0a7c93;pointer-events:none}
.corner{position:absolute;width:78mm;height:78mm;z-index:0;opacity:.98;background:linear-gradient(135deg,#063f79 0 29%,#057c9b 30% 43%,#d1a12d 44% 52%,#f7e6b5 53% 58%,transparent 59%);clip-path:polygon(0 0,100% 0,0 100%)}
.c1{left:7mm;top:7mm}.c2{right:7mm;top:7mm;transform:scaleX(-1)}.c3{left:7mm;bottom:7mm;transform:scaleY(-1)}.c4{right:7mm;bottom:7mm;transform:scale(-1)}
.watermark{position:absolute;left:50%;top:49%;transform:translate(-50%,-50%) rotate(-28deg);z-index:1;font:1000 58px Arial,sans-serif;letter-spacing:4px;color:rgba(151,109,23,.075);white-space:nowrap;pointer-events:none}
.inner{position:relative;z-index:2;text-align:center;height:100%;padding:5mm 12mm;display:flex;flex-direction:column;align-items:center}
.academy{font:900 13px Arial,sans-serif;letter-spacing:3px;color:#173e7b;margin-top:3mm;text-transform:uppercase}
.logo{width:25mm;height:25mm;border-radius:7mm;margin:7mm auto 4mm;display:grid;place-items:center;background:linear-gradient(145deg,#5564ff,#25c3c7);color:#fff;font:1000 42px Arial,sans-serif;box-shadow:0 4mm 8mm #344f9933;border:1mm solid #ffffff}
.cert-of{font-size:31px;font-style:italic;margin:1mm 0 -1mm;color:#102f68;font-weight:500}
.achievement{font-size:38px;margin:0;color:#a97314;text-transform:uppercase;letter-spacing:1.5px;line-height:1}
.ribbon{margin:5mm auto 4mm;padding:3mm 12mm;color:#fff;background:linear-gradient(90deg,#06477c,#07899c,#06477c);border-top:.7mm solid #d9ae40;border-bottom:.7mm solid #d9ae40;font:900 17px Arial,sans-serif;letter-spacing:1.2px;clip-path:polygon(4% 0,96% 0,100% 50%,96% 100%,4% 100%,0 50%)}
.id{font:700 11px Arial,sans-serif;color:#415678;margin-top:1mm}.presented{font-size:16px;margin-top:5mm}.name{font-size:42px;font-style:italic;color:#1f347a;margin:3mm 0 4mm;border-bottom:.5mm solid #d1a538;padding:0 8mm 2mm;min-width:100mm}
.desc{max-width:155mm;font-size:15px;line-height:1.55;color:#34486b}.skills{max-width:160mm;margin:4mm auto;font:800 13px/1.7 Arial,sans-serif;color:#08786f}.award{font-size:24px;font-weight:800;color:#1b3472;margin:2mm 0}.meta{font:700 11px Arial,sans-serif;color:#3e5275;margin-top:3mm}
.seal{width:36mm;height:36mm;border-radius:50%;margin:5mm auto 3mm;display:grid;place-items:center;text-align:center;color:#fff8d2;background:radial-gradient(circle,#0b3d78 0 45%,#d6a632 46% 55%,#063b72 56% 64%,#f4dc92 65% 100%);box-shadow:0 3mm 6mm #18356633;font:900 9px/1.35 Arial,sans-serif;position:relative}
.seal:after{content:'';position:absolute;bottom:-10mm;width:19mm;height:14mm;background:linear-gradient(90deg,#063f79,#07899c,#063f79);clip-path:polygon(0 0,100% 0,78% 100%,50% 72%,22% 100%);z-index:-1}
.signs{width:100%;display:flex;justify-content:space-between;gap:20mm;margin-top:auto;margin-bottom:8mm;font-family:Arial,sans-serif}
.sign{width:42%;border-top:.4mm solid #6a7690;padding-top:2mm}
.sign b{display:block;font-size:14px;color:#18326c}
.sign small{display:block;font-size:9px;color:#63708a;margin-top:1mm}

/* V31.7 — Custom Tannu mentor signature */
.tannu-sign-box{position:relative}
.tannu-signature{
  position:relative;
  display:inline-block;
  width:56mm;
  height:19mm;
  margin:-13mm auto 1.5mm;
  transform:rotate(-5deg) skewX(-5deg);
  user-select:none;
  -webkit-user-select:none;
}
.tannu-signature .ts-main{
  position:absolute;
  left:3mm;
  top:1mm;
  z-index:4;
  display:block;
  font-family:"Brush Script MT","Segoe Script","Lucida Handwriting",cursive;
  font-size:18mm;
  line-height:18mm;
  font-weight:700;
  letter-spacing:-1.1mm;
  color:#102d68;
  white-space:nowrap;
  text-shadow:
    .25mm .3mm 0 rgba(213,165,46,.55),
    -.18mm -.18mm 0 #fff,
    .8mm 1mm 1.7mm rgba(12,31,72,.18);
}
.tannu-signature .ts-shadow{
  position:absolute;
  left:3.5mm;
  top:1.5mm;
  z-index:2;
  font-family:"Brush Script MT","Segoe Script","Lucida Handwriting",cursive;
  font-size:18mm;
  line-height:18mm;
  font-weight:700;
  letter-spacing:-1.1mm;
  color:transparent;
  -webkit-text-stroke:.28mm rgba(8,64,123,.22);
  transform:skewX(-8deg) scaleX(1.015);
  white-space:nowrap;
}
.tannu-signature .ts-scratch{
  position:absolute;
  z-index:5;
  left:0;
  right:0;
  bottom:2.6mm;
  height:1mm;
  border-radius:50%;
  background:linear-gradient(90deg,transparent 0%,#d0a02d 8%,#0c3673 30%,#07899c 66%,#d0a02d 90%,transparent 100%);
  transform:rotate(-4deg) skewX(-31deg);
  box-shadow:
    0 1.7mm 0 -.68mm rgba(10,59,119,.58),
    0 -1.05mm 0 -.8mm rgba(213,165,46,.78);
}
.tannu-signature .ts-scratch::before{
  content:"";
  position:absolute;
  left:4mm;
  top:-3.5mm;
  width:34mm;
  height:5.5mm;
  border-bottom:.62mm solid rgba(13,62,126,.78);
  border-radius:50%;
  transform:rotate(5deg);
}
.tannu-signature .ts-scratch::after{
  content:"";
  position:absolute;
  right:-1mm;
  top:-2.7mm;
  width:14mm;
  height:5.5mm;
  border-top:.72mm solid #0a407b;
  border-radius:50%;
  transform:rotate(-18deg);
}
.tannu-signature .ts-mark{
  position:absolute;
  z-index:6;
  right:-2mm;
  top:-.5mm;
  color:#d5a52e;
  font-size:5mm;
  transform:rotate(24deg);
  text-shadow:.45mm .45mm .9mm rgba(15,42,87,.18);
}
.tannu-sign-box small{
  margin-top:2mm!important;
  font-weight:800;
  letter-spacing:.35px;
}
@media print{html,body{background:#fff}.toolbar{display:none}.certificate{box-shadow:none;margin:0}}
</style>
</head>
<body>
<div class="toolbar"><div class="preview-note">TEST PREVIEW • Official certificate requires the full Stage 1 → 5 path</div><button onclick="window.print()">🖨 Print / Save Preview</button></div>
<section class="certificate">
  <div class="frame1"></div><div class="frame2"></div><div class="frame3"></div>
  <div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
  <div class="watermark">TEST PREVIEW</div>
  <div class="inner">
    <div class="academy">Tannu Sir's Kids Digital Academy</div>
    <div class="logo">T</div>
    <div class="cert-of">Certificate Of</div>
    <h1 class="achievement">Achievement</h1>
    <div class="ribbon">JUNIOR DIGITAL &amp; AI TECHNICIAN</div>
    <div class="id">Preview ID: ${previewId}</div>
    <div class="presented">This certificate preview is presented to</div>
    <div class="name">${name}</div>
    <div class="desc">for completing the Stage 5-A Practical Support Exam and Stage 5-B AI &amp; Cyber Safety Exam in test mode and demonstrating safe digital technician judgment.</div>
    <div class="skills">Computer Hardware • PC Assembly • Windows &amp; Software • AI Literacy • Cyber Safety • Troubleshooting</div>
    <div class="award">Junior Digital &amp; AI Technician — Level 2</div>
    <div class="meta">Class ${classNo} &nbsp;•&nbsp; Stage 5 Test Score ${score}% &nbsp;•&nbsp; Date ${date}</div>
    <div class="seal">PREMIUM<br>CERTIFICATE<br>PREVIEW</div>
    <div class="signs">
      <div class="sign tannu-sign-box">
        <div class="tannu-signature" aria-label="Tannu signature">
          <span class="ts-shadow">Tannu</span>
          <span class="ts-main">Tannu</span>
          <span class="ts-scratch"></span>
          <span class="ts-mark">✦</span>
        </div>
        <small>Academy Mentor</small>
      </div>
      <div class="sign"><b>Full Path Verification Required</b><small>Stage 1 → 5 for official award</small></div>
    </div>
  </div>
</section>
</body>
</html>`;
}

function v316OpenPremiumCertificatePreview(){
  const win=window.open("","_blank");
  if(!win){
    toast("Please allow popups to open the certificate preview.");
    return;
  }
  win.document.open();
  win.document.write(v316PremiumCertificatePreviewDocument());
  win.document.close();
}

/* Replace only the test-mode finish screen. Normal official finish remains unchanged. */
const v316FinishStageOriginal = finishStage;
finishStage = function(){
  if(V315_DIRECT_STAGE5_TEST && activeStage === 5){
    if(state){
      state.stage5ABPassed = false;
    }

    feedback(
      "✅ Stage 5-A and Stage 5-B test completed. Premium certificate preview is ready.",
      "good",
      true
    );

    openModal(`
      <div class="v312-complete-modal">
        <div class="v312-modal-party">🧪 🎉 ⭐ 🏆 ⭐ 🎉 🧪</div>
        <h2>Stage 5 Test Complete!</h2>
        <p>You finished both Stage 5-A and Stage 5-B.</p>
        <div class="v312-learning-note good">
          The new premium certificate can now be previewed. Test mode does not save official certification progress.
        </div>
        <div class="v312-next-banner">
          <b>NEW PREMIUM CERTIFICATE</b>
          <small>T logo • Navy / Teal / Gold • Stage 5-A + 5-B • Technician Level 2</small>
        </div>
        <div class="modal-actions">
          <button class="soft" id="v316ReplayStage5" type="button">↺ Replay Stage 5</button>
          <button class="soft" id="v316FullPath" type="button">🧭 Full Certification Path</button>
          <button class="go" id="v316PreviewCert" type="button">🎓 View New Premium Certificate</button>
        </div>
      </div>
    `);

    $("v316ReplayStage5").onclick = ()=>{
      closeModal();
      openStage(5);
    };

    $("v316FullPath").onclick = ()=>{
      location.href = "junior-technician-lab.html";
    };

    $("v316PreviewCert").onclick = ()=>{
      closeModal();
      v316OpenPremiumCertificatePreview();
    };

    return;
  }

  return v316FinishStageOriginal();
};


})();
