(() => {
"use strict";

const API="https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const token=localStorage.getItem("brightbyte_student_token")||"";
const STORAGE_KEY="tannu_virtual_it_lab_v1";

const $=id=>document.getElementById(id);
const q=s=>document.querySelector(s);
const qa=s=>[...document.querySelectorAll(s)];

let profile={display_name:"Student",username:"student"};
let state={
  stage1Complete:false,
  stage2Complete:false,
  stars:0,
  activeStage:1,
  stage1:{placed:[],connections:[],powered:false,internet:false},
  stage2:{placed:[],connections:[],powered:false,internet:false,faultFixed:false}
};
let selectedCable=null;
let firstPort=null;
let voiceOn=true;

const devices=[
  {id:"monitor",label:"Monitor",icon:"🖥️"},
  {id:"cpu",label:"System Unit",icon:"🖥️"},
  {id:"keyboard",label:"Keyboard",icon:"⌨️"},
  {id:"mouse",label:"Mouse",icon:"🖱️"}
];

const cableCatalog={
  display:{label:"Display Cable",className:"display",stage1:true,stage2:true},
  cpuPower:{label:"CPU Power",className:"power",stage1:true,stage2:true},
  monitorPower:{label:"Monitor Power",className:"power",stage1:true,stage2:true},
  keyboardUsb:{label:"Keyboard USB",className:"usb",stage1:true,stage2:true},
  mouseUsb:{label:"Mouse USB",className:"usb",stage1:true,stage2:true},
  lan:{label:"LAN Cable",className:"lan",stage1:true,stage2:true}
};

const stageConfig={
  1:{
    title:"Build Your First Computer",
    text:"Place the four devices on the desk, connect every cable, switch on the power, then test the internet.",
    hint:"Start with the monitor. After placing all devices, choose a cable and click its two matching ports.",
    steps:[
      ["Place all 4 devices","placed"],
      ["Connect display cable","display"],
      ["Connect keyboard USB","keyboardUsb"],
      ["Connect mouse USB","mouseUsb"],
      ["Connect CPU power","cpuPower"],
      ["Connect monitor power","monitorPower"],
      ["Connect LAN cable","lan"],
      ["Switch on and boot computer","powered"],
      ["Test internet connection","internet"]
    ]
  },
  2:{
    title:"Junior Technician Challenge",
    text:"Build the computer again with fewer hints. Then find and fix the hidden network fault before internet testing.",
    hint:"Technicians check power, display, USB devices and network path one step at a time.",
    steps:[
      ["Place all 4 devices","placed"],
      ["Complete all cable connections","allConnections"],
      ["Switch on and boot computer","powered"],
      ["Find the network fault","faultFixed"],
      ["Restore and test internet","internet"]
    ]
  }
};

function loadLocal(){
  try{
    const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
    if(x && typeof x==="object") state={
      ...state,
      ...x,
      stage1:{...state.stage1,...(x.stage1||{})},
      stage2:{...state.stage2,...(x.stage2||{})}
    };
  }catch{}
  if(state.stage1Complete && state.activeStage===1) state.activeStage=2;
  if(!state.stage1Complete) state.activeStage=1;
}

function saveLocal(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}

async function loadProfile(){
  if(!token){
    updateStudentName();
    return;
  }
  try{
    const r=await fetch(API+"/api/auth/me",{
      headers:{Authorization:`Bearer ${token}`},
      cache:"no-store"
    });
    if(r.ok){
      const d=await r.json();
      if(d.role==="student" && d.profile) profile=d.profile;
    }
  }catch{}
  updateStudentName();
}

function updateStudentName(){
  const name=profile.display_name||profile.nickname||profile.username||"Student";
  $("studentBadge").textContent="👤 "+name;
  $("certificateName").textContent=name;
}

function toast(msg){
  const t=$("toast");
  t.textContent=msg;
  t.classList.add("show");
  clearTimeout(window.__labToast);
  window.__labToast=setTimeout(()=>t.classList.remove("show"),1900);
}

function speak(text){
  if(!voiceOn || !("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";
  u.rate=.72;
  u.pitch=1.04;

  const v=speechSynthesis
    .getVoices()
    .find(v=>/en-(US|GB)/i.test(v.lang));

  if(v) u.voice=v;

  speechSynthesis.speak(u);
}

function feedback(msg,type="info",say=false){
  const f=$("feedback");
  f.className="feedback "+type;
  f.textContent=msg;

  if(say){
    speak(msg.replace(/[✅❌⚠️🌐⚡]/g,""));
  }
}

function stageData(){
  return state.activeStage===1 ? state.stage1 : state.stage2;
}

function config(){
  return stageConfig[state.activeStage];
}

function renderStage(){
  $("stage1Button").classList.toggle("active",state.activeStage===1);
  $("stage2Button").classList.toggle("active",state.activeStage===2);

  $("stage2Button").classList.toggle("locked",!state.stage1Complete);

  $("stage1State").textContent=
    state.stage1Complete ? "✓ COMPLETE" : "OPEN";

  $("stage2State").textContent=
    state.stage2Complete
      ? "✓ COMPLETE"
      : state.stage1Complete
        ? "OPEN"
        : "🔒 LOCKED";

  $("stageStatus").textContent="Stage "+state.activeStage;
  $("stars").textContent=state.stars;

  $("missionTitle").textContent=config().title;
  $("missionText").textContent=config().text;
  $("hintText").textContent=config().hint;

  renderSteps();
  renderTray();
  restoreStageVisuals();
  updateProgress();

  if(state.stage1Complete){
    $("nextStageButton").textContent=
      state.stage2Complete
        ? "View Certificate"
        : "Open Stage 2 →";
  }

  if(state.stage2Complete){
    showCertificate();
  }
}

function renderSteps(){
  const d=stageData();

  $("steps").innerHTML=config().steps.map((s,i)=>{
    const done=isStepDone(s[1],d);
    const firstPending=config().steps.findIndex(
      x=>!isStepDone(x[1],d)
    );
    const current=!done && i===firstPending;

    return `
      <div class="step ${done?"done":""} ${current?"current":""}">
        <span>${done?"✓":i+1}</span>
        <span>${s[0]}</span>
      </div>
    `;
  }).join("");
}

function isStepDone(key,d){
  if(key==="placed") return d.placed.length===4;

  if(key==="allConnections"){
    return requiredConnections().every(
      x=>d.connections.includes(x)
    );
  }

  return key in d
    ? !!d[key]
    : d.connections.includes(key);
}

function requiredConnections(){
  return [
    "display",
    "keyboardUsb",
    "mouseUsb",
    "cpuPower",
    "monitorPower",
    "lan"
  ];
}

function renderTray(){
  const d=stageData();

  $("deviceTray").innerHTML=devices.map(x=>`
    <div
      class="device-item ${d.placed.includes(x.id)?"used":""}"
      draggable="${!d.placed.includes(x.id)}"
      data-device="${x.id}"
    >
      <span class="device-icon">${x.icon}</span>
      ${x.label}
    </div>
  `).join("");

  $("cableTray").innerHTML=
    Object.entries(cableCatalog).map(([id,c])=>`
      <button
        class="cable-item
        ${selectedCable===id?"selected":""}
        ${d.connections.includes(id)?"used":""}"
        data-cable="${id}"
        ${d.connections.includes(id)?"disabled":""}
      >
        <span class="cable-swatch ${c.className}"></span>
        ${c.label}
      </button>
    `).join("");

  wireDraggables();

  qa("[data-cable]").forEach(b=>{
    b.addEventListener("click",()=>{
      selectCable(b.dataset.cable);
    });
  });
}

function wireDraggables(){

  qa(".device-item[draggable='true']").forEach(el=>{

    el.addEventListener("dragstart",e=>{
      e.dataTransfer.setData(
        "text/plain",
        el.dataset.device
      );
      e.dataTransfer.effectAllowed="move";
    });

  });

  qa("[data-device-zone]").forEach(zone=>{

    zone.addEventListener("dragover",e=>{
      e.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave",()=>{
      zone.classList.remove("dragover");
    });

    zone.addEventListener("drop",e=>{
      e.preventDefault();

      zone.classList.remove("dragover");

      const id=
        e.dataTransfer.getData("text/plain");

      if(id===zone.dataset.deviceZone){
        placeDevice(id);
      }else{
        zone.classList.add("wrong");

        setTimeout(()=>{
          zone.classList.remove("wrong");
        },350);

        feedback(
          "❌ Wrong place. Match the device with its picture area.",
          "bad",
          true
        );
      }
    });

  });

}

function placeDevice(id){

  const d=stageData();

  if(d.placed.includes(id)) return;

  d.placed.push(id);

  state.stars+=2;

  saveLocal();

  feedback(
    "✅ Great! "+
    devices.find(x=>x.id===id).label+
    " is in the correct place.",
    "good",
    true
  );

  renderStage();
}

const connectionRules={

  display:[
    "monitor-display",
    "cpu-display"
  ],

  cpuPower:[
    "cpu-power",
    "power-strip-1"
  ],

  monitorPower:[
    "monitor-power",
    "power-strip-2"
  ],

  keyboardUsb:[
    "usb-keyboard",
    "keyboard-device"
  ],

  mouseUsb:[
    "usb-mouse",
    "mouse-device"
  ],

  lan:[
    "lan",
    "router-lan"
  ]

};

function selectCable(id){

  const d=stageData();

  if(d.connections.includes(id)) return;

  selectedCable=id;

  firstPort=null;

  qa(
    ".port,.socket,.router-port,.keyboard-built,.mouse-built"
  ).forEach(x=>{
    x.classList.remove(
      "target",
      "wrong"
    );
  });

  allowedPortElements(id).forEach(
    x=>x.classList.add("target")
  );

  feedback(
    "🔌 "+cableCatalog[id].label+
    " selected. Click the first matching port, then the second.",
    "info",
    true
  );

  renderTray();
}

function allowedPortElements(cable){

  const ports=
    connectionRules[cable]||[];

  return ports
    .map(p=>elementForPort(p))
    .filter(Boolean);
}

function elementForPort(p){

  if(p==="keyboard-device"){
    return $("keyboardBuilt");
  }

  if(p==="mouse-device"){
    return $("mouseBuilt");
  }

  return document.querySelector(
    `[data-port="${p}"]`
  );
}

function clickedPortName(el){

  if(el.id==="keyboardBuilt"){
    return "keyboard-device";
  }

  if(el.id==="mouseBuilt"){
    return "mouse-device";
  }

  return el.dataset.port||"";
}

function wirePorts(){

  q(".workbench").addEventListener(
    "click",
    e=>{

      const el=e.target.closest(
        ".port,.socket,.router-port,.keyboard-built,.mouse-built"
      );

      if(!el || !selectedCable) return;

      const p=clickedPortName(el);

      const allowed=
        connectionRules[selectedCable];

      if(!allowed.includes(p)){

        el.classList.add("wrong");

        setTimeout(()=>{
          el.classList.remove("wrong");
        },350);

        feedback(
          "❌ Wrong connection. Try the glowing matching port.",
          "bad",
          true
        );

        return;
      }

      if(!firstPort){

        firstPort=p;

        el.classList.add("connected");

        feedback(
          "Good first end! Now connect the other end of the cable.",
          "info",
          true
        );

        return;
      }

      if(p===firstPort){

        feedback(
          "❌ Choose the other end of the cable.",
          "bad",
          true
        );

        return;
      }

      const pair=
        [firstPort,p]
          .sort()
          .join("|");

      const correct=
        [...allowed]
          .sort()
          .join("|");

      if(pair!==correct){

        feedback(
          "❌ Those two ports do not match this cable.",
          "bad",
          true
        );

        return;
      }

      completeConnection(selectedCable);
    }
  );

}

function completeConnection(cable){

  const d=stageData();

  if(!d.connections.includes(cable)){

    d.connections.push(cable);

    state.stars+=3;

    if(
      state.activeStage===2 &&
      cable==="lan"
    ){
      d.faultFixed=true;
    }

  }

  selectedCable=null;

  firstPort=null;

  saveLocal();

  qa(".target").forEach(
    x=>x.classList.remove("target")
  );

  feedback(
    "✅ Correct connection! Green link is active.",
    "good",
    true
  );

  renderStage();
}

function restoreStageVisuals(){

  const d=stageData();

  devices.forEach(x=>{

    const built=$(x.id+"Built");

    const zone=q(
      `[data-device-zone="${x.id}"]`
    );

    built.classList.toggle(
      "hidden",
      !d.placed.includes(x.id)
    );

    zone.classList.toggle(
      "filled",
      d.placed.includes(x.id)
    );

  });

  qa(".port,.socket,.router-port").forEach(
    x=>x.classList.remove("connected")
  );

  d.connections.forEach(c=>{

    (connectionRules[c]||[])
      .forEach(p=>{

        const el=
          elementForPort(p);

        if(el){
          el.classList.add("connected");
        }

      });

  });

  drawCables();

  const readyPower=[
    "display",
    "keyboardUsb",
    "mouseUsb",
    "cpuPower",
    "monitorPower"
  ].every(
    x=>d.connections.includes(x)
  );

  $("powerOnButton").disabled=
    !readyPower || d.powered;

  $("powerSwitch")
    .classList
    .toggle("on",d.powered);

  $("powerSwitch").textContent=
    d.powered
      ? "ON"
      : "OFF";

  $("cpuBuilt")
    .classList
    .toggle("powered",d.powered);

  $("cpuLed")
    .classList
    .toggle("on",d.powered);

  $("monitorLed")
    .classList
    .toggle("on",d.powered);

  $("monitorScreen")
    .classList
    .toggle(
      "online",
      d.powered &&
      d.connections.includes("display")
    );

  $("screenMessage").textContent=
    d.powered
      ? (
          d.connections.includes("display")
          ? "WELCOME, JUNIOR TECH!"
          : "NO SIGNAL"
        )
      : "NO SIGNAL";

  $("routerLed")
    .classList
    .toggle(
      "on",
      d.connections.includes("lan")
    );

  const canInternet=
    d.powered &&
    d.connections.includes("lan") &&
    (
      state.activeStage===1 ||
      d.faultFixed
    );

  $("testInternetButton").disabled=
    !canInternet || d.internet;
}

function centerOf(el){

  const room=
    $("labRoom")
      .getBoundingClientRect();

  const r=
    el.getBoundingClientRect();

  return {
    x:r.left-room.left+r.width/2,
    y:r.top-room.top+r.height/2
  };
}

function drawCables(){

  const svg=
    $("cableLayer");

  svg.innerHTML="";

  const d=
    stageData();

  d.connections.forEach(c=>{

    const [a,b]=
      connectionRules[c]
        .map(elementForPort);

    if(
      !a ||
      !b ||
      a.classList.contains("hidden") ||
      b.classList.contains("hidden")
    ) return;

    const p1=centerOf(a);
    const p2=centerOf(b);

    const mx=
      (p1.x+p2.x)/2;

    const path=
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

    const cls=
      cableCatalog[c].className;

    path.setAttribute(
      "class",
      "cable-path "+cls+" good"
    );

    path.setAttribute(
      "d",
      `M ${p1.x} ${p1.y}
       C ${mx} ${p1.y+25},
       ${mx} ${p2.y-25},
       ${p2.x} ${p2.y}`
    );

    svg.appendChild(path);
  });
}

function powerOn(){

  const d=
    stageData();

  const need=[
    "display",
    "keyboardUsb",
    "mouseUsb",
    "cpuPower",
    "monitorPower"
  ];

  if(
    !need.every(
      x=>d.connections.includes(x)
    )
  ){
    return feedback(
      "❌ Some important cables are missing.",
      "bad",
      true
    );
  }

  d.powered=true;

  state.stars+=5;

  saveLocal();

  feedback(
    "⚡ Power is ON. The computer is starting...",
    "good",
    true
  );

  $("powerSwitch")
    .classList
    .add("on");

  $("powerSwitch").textContent=
    "ON";

  renderStage();

  setTimeout(()=>{

    feedback(
      "✅ Computer started successfully! Now check the network.",
      "good",
      true
    );

    speak(
      "Computer started successfully. Now check the network."
    );

  },900);
}

function testInternet(){

  const d=
    stageData();

  if(!d.powered) return;

  if(
    !d.connections.includes("lan")
  ){

    return feedback(
      "❌ No network cable. Connect the PC to the router first.",
      "bad",
      true
    );
  }

  if(
    state.activeStage===2 &&
    !d.faultFixed
  ){

    return feedback(
      "⚠️ Hidden fault found: the LAN connection needs to be checked.",
      "bad",
      true
    );
  }

  d.internet=true;

  state.stars+=5;

  saveLocal();

  feedback(
    "🌐 Internet Connected! Excellent troubleshooting.",
    "good",
    true
  );

  speak(
    "Internet connected. Excellent work, Junior Technician."
  );

  renderStage();

  checkComplete();
}

function checkComplete(){

  const d=
    stageData();

  const complete=
    d.placed.length===4 &&
    requiredConnections().every(
      x=>d.connections.includes(x)
    ) &&
    d.powered &&
    d.internet &&
    (
      state.activeStage===1 ||
      d.faultFixed
    );

  if(!complete) return;

  if(
    state.activeStage===1 &&
    !state.stage1Complete
  ){

    state.stage1Complete=true;

    state.stars+=15;

    saveLocal();

    $("stageComplete")
      .classList
      .remove("hidden");

    $("completionTitle").textContent=
      "Stage 1 Complete — Stage 2 Unlocked!";

    $("completionText").textContent=
      "You built and connected a complete computer. The Junior Technician challenge is now open.";

    $("nextStageButton").textContent=
      "Open Stage 2 →";

    celebrate();

  }else if(
    state.activeStage===2 &&
    !state.stage2Complete
  ){

    state.stage2Complete=true;

    state.stars+=25;

    saveLocal();

    $("stageComplete")
      .classList
      .remove("hidden");

    $("completionTitle").textContent=
      "Stage 2 Complete — Certificate Unlocked!";

    $("completionText").textContent=
      "You completed the tougher technician mission and earned your Junior Technician certificate.";

    $("nextStageButton").textContent=
      "View Certificate";

    celebrate();

    showCertificate();
  }

  renderStage();
}

function celebrate(){

  const c=
    $("celebration");

  c.classList.remove("hidden");

  setTimeout(()=>{
    c.classList.add("hidden");
  },2200);
}

function updateProgress(){

  const d=
    stageData();

  const total=
    config().steps.length;

  const done=
    config().steps
      .filter(
        x=>isStepDone(x[1],d)
      )
      .length;

  const pct=
    Math.round(
      done/total*100
    );

  $("progressBar").style.width=
    pct+"%";

  $("progressText").textContent=
    pct+"%";

  renderSteps();

  if(pct===100){
    checkComplete();
  }
}

function resetStage(){

  if(
    !confirm(
      "Reset this lab stage and start again?"
    )
  ) return;

  if(
    state.activeStage===1
  ){

    state.stage1={
      placed:[],
      connections:[],
      powered:false,
      internet:false
    };

  }else{

    state.stage2={
      placed:[],
      connections:[],
      powered:false,
      internet:false,
      faultFixed:false
    };

  }

  selectedCable=null;
  firstPort=null;

  saveLocal();

  renderStage();

  feedback(
    "Lab reset. Start again from the first step.",
    "info",
    true
  );
}

function openStage(n){

  if(
    n===2 &&
    !state.stage1Complete
  ){

    feedback(
      "🔒 Complete Stage 1 first to unlock Stage 2.",
      "bad",
      true
    );

    return;
  }

  state.activeStage=n;

  selectedCable=null;

  firstPort=null;

  saveLocal();

  $("stageComplete")
    .classList
    .add("hidden");

  renderStage();

  feedback(
    n===1
      ? "Stage 1 loaded. Build the computer step by step."
      : "Stage 2 loaded. Work like a Junior Technician!",
    "info",
    true
  );

  window.scrollTo({
    top:
      document
        .querySelector(".stage-picker")
        .offsetTop-70,
    behavior:"smooth"
  });
}

function showCertificate(){

  if(
    !state.stage1Complete ||
    !state.stage2Complete
  ) return;

  const sec=
    $("certificateSection");

  sec.classList.remove("hidden");

  const name=
    profile.display_name ||
    profile.nickname ||
    profile.username ||
    "Student";

  $("certificateName").textContent=
    name;

  const d=
    new Date();

  $("certificateDate").textContent=
    d.toLocaleDateString(
      undefined,
      {
        day:"2-digit",
        month:"long",
        year:"numeric"
      }
    );

  const seed=
    (
      profile.username ||
      name
    )
    .replace(/\W/g,"")
    .slice(0,10)
    .toUpperCase();

  $("certificateId").textContent=
    "Certificate ID: TKA-JIT-"+
    seed+
    "-"+
    d.getFullYear();
}

function prepareStage2Challenge(){

  const d=
    state.stage2;

  if(
    d.connections.includes("lan")
  ){
    d.faultFixed=true;
  }
}

$("soundToggle")
  .addEventListener(
    "click",
    ()=>{

      voiceOn=!voiceOn;

      $("soundToggle").textContent=
        voiceOn
          ? "🔊 Voice On"
          : "🔇 Voice Off";
    }
  );

$("hearMission")
  .addEventListener(
    "click",
    ()=>{
      speak(
        config().title+
        ". "+
        config().text+
        ". "+
        config().hint
      );
    }
  );

$("resetLab")
  .addEventListener(
    "click",
    resetStage
  );

$("powerOnButton")
  .addEventListener(
    "click",
    powerOn
  );

$("testInternetButton")
  .addEventListener(
    "click",
    testInternet
  );

$("stage1Button")
  .addEventListener(
    "click",
    ()=>openStage(1)
  );

$("stage2Button")
  .addEventListener(
    "click",
    ()=>openStage(2)
  );

$("nextStageButton")
  .addEventListener(
    "click",
    ()=>{

      if(
        state.stage2Complete
      ){

        showCertificate();

        $("certificateSection")
          .scrollIntoView({
            behavior:"smooth"
          });

      }else{

        openStage(2);
      }
    }
  );

$("printCertificate")
  .addEventListener(
    "click",
    ()=>window.print()
  );

window.addEventListener(
  "resize",
  ()=>{
    setTimeout(
      drawCables,
      60
    );
  }
);

$("powerSwitch")
  .addEventListener(
    "click",
    powerOn
  );

loadLocal();

prepareStage2Challenge();

wirePorts();

loadProfile()
  .finally(
    ()=>renderStage()
  );

})();
