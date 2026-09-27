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
  stage2:{
    placed:[],
    connections:[],
    powered:false,
    internet:false,
    faultFixed:false,
    faultCables:[],
    prepared:false
  }
};

let selectedCable=null;
let firstPort=null;
let voiceOn=true;

const devices=[
  {id:"monitor",label:"Monitor",icon:"🖥️",stages:[1,2]},
  {id:"cpu",label:"System Unit",icon:"🖥️",stages:[1,2]},
  {id:"keyboard",label:"Keyboard",icon:"⌨️",stages:[1,2]},
  {id:"mouse",label:"Mouse",icon:"🖱️",stages:[1,2]},
  {id:"speaker",label:"Speaker",icon:"🔊",stages:[2]},
  {id:"printer",label:"Printer",icon:"🖨️",stages:[2]}
];

const cableCatalog={
  display:{label:"Display Cable",className:"display",stage1:true,stage2:true},
  cpuPower:{label:"CPU Power",className:"power",stage1:true,stage2:true},
  monitorPower:{label:"Monitor Power",className:"power",stage1:true,stage2:true},
  keyboardUsb:{label:"Keyboard USB",className:"usb",stage1:true,stage2:true},
  mouseUsb:{label:"Mouse USB",className:"usb",stage1:true,stage2:true},
  lan:{label:"LAN Cable",className:"lan",stage1:true,stage2:true},
  audio:{label:"Audio Cable",className:"audio",stage1:false,stage2:true},
  printer:{label:"Printer Cable",className:"printer",stage1:false,stage2:true},
  coaxial:{label:"Coaxial Cable",className:"coax",stage1:false,stage2:true,decoy:true},
  telephone:{label:"Telephone Cable",className:"telephone",stage1:false,stage2:true,decoy:true}
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
    title:"Fix My Computer — Junior Technician",
    text:"The computer, printer and speaker are already set up, but TWO cable faults are hidden. Inspect the clues, choose the correct cables and repair both faults.",
    hint:"Two real cables are missing. Coaxial and Telephone cables are decoys. Think like a technician and match the symptom to the correct port.",
    steps:[
      ["Inspect the ready computer","placed"],
      ["Repair both hidden cable faults","faultFixed"],
      ["Run the final system test","internet"]
    ]
  }
};

const connectionRules={
  display:["monitor-display","cpu-display"],
  cpuPower:["cpu-power","power-strip-1"],
  monitorPower:["monitor-power","power-strip-2"],
  keyboardUsb:["usb-keyboard","keyboard-device"],
  mouseUsb:["usb-mouse","mouse-device"],
  lan:["lan","router-lan"],
  audio:["audio-out","speaker-in"],
  printer:["cpu-printer","printer-usb"]
};

function requiredConnections(stage=state.activeStage){
  return stage===1
    ? [
        "display",
        "keyboardUsb",
        "mouseUsb",
        "cpuPower",
        "monitorPower",
        "lan"
      ]
    : [
        "display",
        "keyboardUsb",
        "mouseUsb",
        "cpuPower",
        "monitorPower",
        "lan",
        "audio",
        "printer"
      ];
}

function stageDeviceIds(stage=state.activeStage){
  return devices
    .filter(x=>x.stages.includes(stage))
    .map(x=>x.id);
}

function normalizeStage2(){

  const d=state.stage2||{};

  state.stage2={
    placed:Array.isArray(d.placed)?d.placed:[],
    connections:Array.isArray(d.connections)?d.connections:[],
    powered:!!d.powered,
    internet:!!d.internet,
    faultFixed:!!d.faultFixed,
    faultCables:Array.isArray(d.faultCables)?d.faultCables:[],
    prepared:!!d.prepared
  };

  if(state.stage2Complete){

    state.stage2.placed=
      stageDeviceIds(2);

    state.stage2.connections=
      requiredConnections(2);

    state.stage2.powered=true;
    state.stage2.internet=true;
    state.stage2.faultFixed=true;
    state.stage2.faultCables=[];
    state.stage2.prepared=true;

    return;
  }

  if(state.stage2.faultCables.length!==2){

    state.stage2.prepared=false;
    state.stage2.faultCables=[];
  }

}

function loadLocal(){

  try{

    const x=
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
        ||
        "null"
      );

    if(x && typeof x==="object"){

      state={
        ...state,
        ...x,

        stage1:{
          ...state.stage1,
          ...(x.stage1||{})
        },

        stage2:{
          ...state.stage2,
          ...(x.stage2||{})
        }
      };

    }

  }catch{}

  if(!Array.isArray(state.stage1.placed)){
    state.stage1.placed=[];
  }

  if(!Array.isArray(state.stage1.connections)){
    state.stage1.connections=[];
  }

  normalizeStage2();

  if(
    state.stage1Complete &&
    state.activeStage===1
  ){
    state.activeStage=2;
  }

  if(!state.stage1Complete){
    state.activeStage=1;
  }

}

function saveLocal(){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}

async function loadProfile(){

  if(!token){

    updateStudentName();
    return;

  }

  try{

    const r=
      await fetch(
        API+"/api/auth/me",
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          },
          cache:"no-store"
        }
      );

    if(r.ok){

      const d=
        await r.json();

      if(
        d.role==="student" &&
        d.profile
      ){
        profile=d.profile;
      }

    }

  }catch{}

  updateStudentName();

}

function updateStudentName(){

  const name=
    profile.display_name
    ||
    profile.nickname
    ||
    profile.username
    ||
    "Student";

  $("studentBadge").textContent=
    "👤 "+name;

  $("certificateName").textContent=
    name;

}

function speak(text){

  if(
    !voiceOn ||
    !("speechSynthesis" in window)
  ){
    return;
  }

  speechSynthesis.cancel();

  const u=
    new SpeechSynthesisUtterance(
      text
    );

  u.lang="en-US";
  u.rate=.72;
  u.pitch=1.04;

  const v=
    speechSynthesis
      .getVoices()
      .find(
        v=>
          /en-(US|GB)/i
            .test(v.lang)
      );

  if(v){
    u.voice=v;
  }

  speechSynthesis.speak(u);

}

function feedback(
  msg,
  type="info",
  say=false
){

  const f=
    $("feedback");

  if(!f){
    return;
  }

  f.className=
    "feedback "+type;

  f.textContent=
    msg;

  if(say){

    speak(
      msg.replace(
        /[✅❌⚠️🌐⚡🔧🖥️⌨️🖱️🔇🖨️]/g,
        ""
      )
    );

  }

}

function stageData(){

  return state.activeStage===1
    ?
    state.stage1
    :
    state.stage2;

}

function config(){

  return stageConfig[
    state.activeStage
  ];

}

function isStepDone(
  key,
  d
){

  if(key==="placed"){

    return (
      d.placed.length
      ===
      stageDeviceIds().length
    );

  }

  return key in d
    ?
    !!d[key]
    :
    d.connections.includes(key);

}

function renderSteps(){

  const d=
    stageData();

  const steps=
    config().steps;

  const firstPending=
    steps.findIndex(
      x=>
        !isStepDone(
          x[1],
          d
        )
    );

  $("steps").innerHTML=
    steps
      .map(
        (s,i)=>{

          const done=
            isStepDone(
              s[1],
              d
            );

          const current=
            !done &&
            i===firstPending;

          return `
            <div
              class="
                step
                ${done?"done":""}
                ${current?"current":""}
              "
            >
              <span>
                ${done?"✓":i+1}
              </span>

              <span>
                ${s[0]}
              </span>
            </div>
          `;

        }
      )
      .join("");

}

function renderTray(){

  const d=
    stageData();

  const visibleDevices=
    devices.filter(
      x=>
        x.stages.includes(
          state.activeStage
        )
    );

  $("deviceTray").innerHTML=
    visibleDevices
      .map(
        x=>{

          const alreadyPlaced=
            d.placed.includes(
              x.id
            );

          const draggable=
            state.activeStage===1
            &&
            !alreadyPlaced;

          return `
            <div
              class="
                device-item
                ${alreadyPlaced?"used":""}
              "
              draggable="${draggable}"
              data-device="${x.id}"
            >

              <span
                class="device-icon"
              >
                ${x.icon}
              </span>

              ${x.label}

            </div>
          `;

        }
      )
      .join("");

  const visibleCables=
    Object
      .entries(
        cableCatalog
      )
      .filter(
        ([,c])=>
          state.activeStage===1
          ?
          c.stage1
          :
          c.stage2
      );

  $("cableTray").innerHTML=
    visibleCables
      .map(
        ([id,c])=>{

          const connected=
            d.connections.includes(
              id
            );

          return `
            <button
              class="
                cable-item
                ${selectedCable===id?"selected":""}
                ${connected?"used":""}
              "
              data-cable="${id}"
              ${connected?"disabled":""}
            >

              <span
                class="
                  cable-swatch
                  ${c.className}
                "
              ></span>

              ${c.label}

            </button>
          `;

        }
      )
      .join("");

  wireDraggables();

  qa("[data-cable]")
    .forEach(
      b=>
        b.addEventListener(
          "click",
          ()=>
            selectCable(
              b.dataset.cable
            )
        )
    );

}

function wireDraggables(){

  qa(
    ".device-item[draggable='true']"
  )
    .forEach(
      el=>{

        el.addEventListener(
          "dragstart",
          e=>{

            e.dataTransfer
              .setData(
                "text/plain",
                el.dataset.device
              );

            e.dataTransfer
              .effectAllowed=
              "move";

          }
        );

      }
    );

  qa("[data-device-zone]")
    .forEach(
      zone=>{

        zone.addEventListener(
          "dragover",
          e=>{

            e.preventDefault();

            zone.classList.add(
              "dragover"
            );

          }
        );

        zone.addEventListener(
          "dragleave",
          ()=>
            zone.classList.remove(
              "dragover"
            )
        );

        zone.addEventListener(
          "drop",
          e=>{

            e.preventDefault();

            zone.classList.remove(
              "dragover"
            );

            const id=
              e.dataTransfer
                .getData(
                  "text/plain"
                );

            if(
              id===
              zone.dataset.deviceZone
            ){

              placeDevice(id);

            }else{

              zone.classList.add(
                "wrong"
              );

              setTimeout(
                ()=>
                  zone.classList.remove(
                    "wrong"
                  ),
                350
              );

              feedback(
                "❌ Wrong place. Match the device with its picture area.",
                "bad",
                true
              );

            }

          }
        );

      }
    );

}

function placeDevice(id){

  if(
    state.activeStage!==1
  ){
    return;
  }

  const d=
    stageData();

  if(
    d.placed.includes(id)
  ){
    return;
  }

  d.placed.push(id);

  state.stars+=2;

  saveLocal();

  feedback(
    "✅ Great! "
    +
    devices.find(
      x=>x.id===id
    ).label
    +
    " is in the correct place.",
    "good",
    true
  );

  renderStage();

}

function allowedPortElements(cable){

  return (
    connectionRules[cable]
    ||
    []
  )
    .map(
      elementForPort
    )
    .filter(Boolean);

}

function elementForPort(p){

  if(
    p==="keyboard-device"
  ){
    return $("keyboardBuilt");
  }

  if(
    p==="mouse-device"
  ){
    return $("mouseBuilt");
  }

  return document
    .querySelector(
      `[data-port="${p}"]`
    );

}

function clickedPortName(el){

  if(
    el.id==="keyboardBuilt"
  ){
    return "keyboard-device";
  }

  if(
    el.id==="mouseBuilt"
  ){
    return "mouse-device";
  }

  return (
    el.dataset.port
    ||
    ""
  );

}

function clearTargets(){

  qa(
    ".port,.socket,.router-port,.keyboard-built,.mouse-built"
  )
    .forEach(
      x=>
        x.classList.remove(
          "target",
          "wrong"
        )
    );

}

function flashWrongCable(id){

  requestAnimationFrame(
    ()=>{

      const b=
        document.querySelector(
          `[data-cable="${id}"]`
        );

      if(!b){
        return;
      }

      b.classList.add(
        "wrong-choice"
      );

      setTimeout(
        ()=>
          b.classList.remove(
            "wrong-choice"
          ),
        650
      );

    }
  );

}

function selectCable(id){

  const d=
    stageData();

  if(
    d.connections.includes(id)
  ){
    return;
  }

  clearTargets();

  firstPort=null;

  if(
    cableCatalog[id]?.decoy
    ||
    !connectionRules[id]
  ){

    selectedCable=null;

    renderTray();

    flashWrongCable(id);

    feedback(
      "❌ Wrong cable for this computer setup. Check the symptom and try another cable.",
      "bad",
      true
    );

    return;
  }

  selectedCable=id;

  allowedPortElements(id)
    .forEach(
      x=>
        x.classList.add(
          "target"
        )
    );

  renderTray();

  if(
    state.activeStage===1
  ){

    feedback(
      "🔌 "
      +
      cableCatalog[id].label
      +
      " selected. Follow the two glowing ports.",
      "info",
      true
    );

  }else{

    feedback(
      "🧑‍💻 "
      +
      cableCatalog[id].label
      +
      " selected. Match it to the two correct ports.",
      "info",
      true
    );

  }

}

function wirePorts(){

  q(".workbench")
    .addEventListener(
      "click",
      e=>{

        const el=
          e.target.closest(
            ".port,.socket,.router-port,.keyboard-built,.mouse-built"
          );

        if(
          !el ||
          !selectedCable
        ){
          return;
        }

        const allowed=
          connectionRules[
            selectedCable
          ]
          ||
          [];

        const p=
          clickedPortName(el);

        if(
          !allowed.includes(p)
        ){

          el.classList.add(
            "wrong"
          );

          setTimeout(
            ()=>
              el.classList.remove(
                "wrong"
              ),
            350
          );

          feedback(
            "❌ Wrong connection. Try the glowing matching port.",
            "bad",
            true
          );

          return;
        }

        if(!firstPort){

          firstPort=p;

          el.classList.add(
            "connected"
          );

          feedback(
            "✅ Good first end! Now connect the other glowing port.",
            "info",
            true
          );

          return;
        }

        if(
          p===firstPort
        ){

          feedback(
            "❌ Choose the other end of the cable.",
            "bad",
            true
          );

          return;
        }

        const pair=
          [
            firstPort,
            p
          ]
            .sort()
            .join("|");

        const correct=
          [
            ...allowed
          ]
            .sort()
            .join("|");

        if(
          pair!==correct
        ){

          feedback(
            "❌ Those two ports do not match this cable.",
            "bad",
            true
          );

          return;
        }

        completeConnection(
          selectedCable
        );

      }
    );

}

function remainingStage2Faults(){

  const d=
    state.stage2;

  return d.faultCables
    .filter(
      c=>
        !d.connections.includes(c)
    );

}

function updateStage2DerivedState(){

  const d=
    state.stage2;

  d.faultFixed=
    d.prepared
    &&
    remainingStage2Faults()
      .length===0;

  d.powered=
    d.connections.includes(
      "cpuPower"
    )
    &&
    d.connections.includes(
      "monitorPower"
    );

}

function completeConnection(cable){

  const d=
    stageData();

  if(
    !d.connections.includes(cable)
  ){

    d.connections.push(
      cable
    );

    state.stars+=3;

  }

  if(
    state.activeStage===2
  ){

    updateStage2DerivedState();

  }

  selectedCable=null;
  firstPort=null;

  clearTargets();

  saveLocal();

  renderStage();

  if(
    state.activeStage===2
  ){

    const left=
      remainingStage2Faults()
        .length;

    if(left===0){

      feedback(
        "✅ Both hidden cable faults are fixed! Now run the full system test.",
        "good",
        true
      );

    }else{

      feedback(
        "✅ First hidden fault fixed! One more cable fault is still waiting.",
        "good",
        true
      );

    }

  }else{

    feedback(
      "✅ Correct connection! Green link is active.",
      "good",
      true
    );

  }

}

function syncCableViewBox(){

  const svg=
    $("cableLayer");

  const room=
    $("labRoom");

  if(
    !svg ||
    !room
  ){
    return;
  }

  const w=
    Math.max(
      1,
      room.clientWidth
    );

  const h=
    Math.max(
      1,
      room.clientHeight
    );

  svg.setAttribute(
    "viewBox",
    `0 0 ${w} ${h}`
  );

  svg.setAttribute(
    "preserveAspectRatio",
    "none"
  );

}

function centerOf(el){

  const svg=
    $("cableLayer");

  const svgRect=
    svg.getBoundingClientRect();

  const elRect=
    el.getBoundingClientRect();

  const box=
    svg.viewBox.baseVal;

  const scaleX=
    box.width
    /
    svgRect.width;

  const scaleY=
    box.height
    /
    svgRect.height;

  return {

    x:
      (
        elRect.left
        -
        svgRect.left
        +
        elRect.width/2
      )
      *
      scaleX,

    y:
      (
        elRect.top
        -
        svgRect.top
        +
        elRect.height/2
      )
      *
      scaleY

  };

}

function buildCablePath(
  p1,
  p2
){

  const bend=
    Math.max(
      70,
      Math.abs(
        p2.x-p1.x
      )*.35
    );

  return `
    M ${p1.x} ${p1.y}
    C
    ${p1.x+bend} ${p1.y},
    ${p2.x-bend} ${p2.y},
    ${p2.x} ${p2.y}
  `;

}

function drawCables(){

  const svg=
    $("cableLayer");

  if(!svg){
    return;
  }

  syncCableViewBox();

  svg.innerHTML="";

  const d=
    stageData();

  d.connections
    .forEach(
      c=>{

        if(
          !connectionRules[c]
        ){
          return;
        }

        const [a,b]=
          connectionRules[c]
            .map(
              elementForPort
            );

        if(
          !a ||
          !b ||
          a.classList.contains(
            "hidden"
          )
          ||
          b.classList.contains(
            "hidden"
          )
        ){
          return;
        }

        const p1=
          centerOf(a);

        const p2=
          centerOf(b);

        const path=
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );

        const cls=
          cableCatalog[c]
            ?.className
          ||
          "display";

        path.setAttribute(
          "class",
          "cable-path "
          +
          cls
          +
          " good"
        );

        path.setAttribute(
          "d",
          buildCablePath(
            p1,
            p2
          )
        );

        svg.appendChild(
          path
        );

      }
    );

}

function restoreStageVisuals(){

  const d=
    stageData();

  devices
    .forEach(
      x=>{

        const built=
          $(x.id+"Built");

        if(built){

          built.classList.toggle(
            "hidden",
            !d.placed.includes(
              x.id
            )
          );

        }

        const zone=
          q(
            `[data-device-zone="${x.id}"]`
          );

        if(zone){

          zone.classList.toggle(
            "filled",
            d.placed.includes(
              x.id
            )
          );

        }

      }
    );

  qa(
    ".port,.socket,.router-port,.keyboard-built,.mouse-built"
  )
    .forEach(
      x=>
        x.classList.remove(
          "connected"
        )
    );

  d.connections
    .forEach(
      c=>
        (
          connectionRules[c]
          ||
          []
        )
          .forEach(
            p=>{

              const el=
                elementForPort(p);

              if(el){

                el.classList.add(
                  "connected"
                );

              }

            }
          )
    );

  if(
    state.activeStage===2
  ){

    updateStage2DerivedState();

  }

  drawCables();

  if(
    state.activeStage===1
  ){

    const readyPower=
      [
        "display",
        "keyboardUsb",
        "mouseUsb",
        "cpuPower",
        "monitorPower"
      ]
        .every(
          x=>
            d.connections.includes(x)
        );

    $("powerOnButton").disabled=
      !readyPower
      ||
      d.powered;

    $("powerOnButton").textContent=
      d.powered
      ?
      "⚡ Computer Powered"
      :
      "⚡ Power On Computer";

  }else{

    $("powerOnButton").disabled=
      true;

    $("powerOnButton").textContent=
      "⚡ Auto Power Check";

  }

  $("powerSwitch")
    .classList.toggle(
      "on",
      d.powered
    );

  $("powerSwitch").textContent=
    d.powered
    ?
    "ON"
    :
    "OFF";

  $("cpuBuilt")
    .classList.toggle(
      "powered",
      d.powered
    );

  $("cpuLed")
    .classList.toggle(
      "on",
      d.powered
    );

  $("monitorLed")
    .classList.toggle(
      "on",
      d.powered
    );

  $("routerLed")
    .classList.toggle(
      "on",
      d.connections.includes(
        "lan"
      )
    );

  const speaker=
    $("speakerBuilt");

  if(speaker){

    speaker.classList.toggle(
      "online",
      d.connections.includes(
        "audio"
      )
    );

  }

  const printer=
    $("printerBuilt");

  if(printer){

    printer.classList.toggle(
      "online",
      d.connections.includes(
        "printer"
      )
    );

  }

  let screenReady=false;
  let screenText=
    "NO SIGNAL";

  if(
    state.activeStage===1
  ){

    screenReady=
      d.powered
      &&
      d.connections.includes(
        "display"
      );

    screenText=
      screenReady
      ?
      "WELCOME, JUNIOR TECH!"
      :
      "NO SIGNAL";

  }else{

    const remaining=
      remainingStage2Faults()
        .length;

    if(!d.powered){

      screenText=
        "POWER CHECK";

    }else if(
      !d.connections.includes(
        "display"
      )
    ){

      screenText=
        "NO SIGNAL";

    }else if(
      remaining>0
    ){

      screenText=
        remaining
        +
        " FAULT"
        +
        (
          remaining>1
          ?
          "S"
          :
          ""
        )
        +
        " FOUND";

    }else{

      screenReady=true;

      screenText=
        "WELCOME, JUNIOR TECH!";

    }

  }

  $("monitorScreen")
    .classList.toggle(
      "online",
      screenReady
    );

  $("screenMessage").textContent=
    screenText;

  if(
    state.activeStage===1
  ){

    const canInternet=
      d.powered
      &&
      d.connections.includes(
        "lan"
      );

    $("testInternetButton").disabled=
      !canInternet
      ||
      d.internet;

    $("testInternetButton").textContent=
      "🌐 Test Internet";

  }else{

    const canTest=
      d.faultFixed
      &&
      d.powered
      &&
      requiredConnections(2)
        .every(
          x=>
            d.connections.includes(x)
        );

    $("testInternetButton").disabled=
      !canTest
      ||
      d.internet;

    $("testInternetButton").textContent=
      "🧪 Test Full System";

  }

}

function renderStage(){

  if(
    state.activeStage===2
    &&
    state.stage1Complete
  ){

    prepareStage2Challenge();

  }

  $("stage1Button")
    .classList.toggle(
      "active",
      state.activeStage===1
    );

  $("stage2Button")
    .classList.toggle(
      "active",
      state.activeStage===2
    );

  $("stage2Button")
    .classList.toggle(
      "locked",
      !state.stage1Complete
    );

  $("stage1State").textContent=
    state.stage1Complete
    ?
    "✓ COMPLETE"
    :
    "OPEN";

  $("stage2State").textContent=
    state.stage2Complete
    ?
    "✓ COMPLETE"
    :
    state.stage1Complete
    ?
    "OPEN"
    :
    "🔒 LOCKED";

  $("stageStatus").textContent=
    "Stage "
    +
    state.activeStage;

  $("stars").textContent=
    state.stars;

  $("missionTitle").textContent=
    config().title;

  $("missionText").textContent=
    config().text;

  $("hintText").textContent=
    config().hint;

  renderSteps();

  renderTray();

  restoreStageVisuals();

  updateProgress();

  if(
    state.stage1Complete
  ){

    $("nextStageButton").textContent=
      state.stage2Complete
      ?
      "View Certificate"
      :
      "Open Stage 2 →";

  }

  if(
    state.stage2Complete
  ){

    showCertificate();

  }

}

function powerOn(){

  const d=
    stageData();

  if(
    state.activeStage===2
  ){

    updateStage2DerivedState();

    if(!d.powered){

      feedback(
        "⚠️ Power cannot start yet. A power cable may still be one of the hidden faults.",
        "bad",
        true
      );

    }else{

      feedback(
        "✅ Power check passed. Repair the remaining hidden cable fault.",
        "good",
        true
      );

    }

    renderStage();

    return;
  }

  const need=[
    "display",
    "keyboardUsb",
    "mouseUsb",
    "cpuPower",
    "monitorPower"
  ];

  if(
    !need.every(
      x=>
        d.connections.includes(x)
    )
  ){

    feedback(
      "❌ Some important cables are missing.",
      "bad",
      true
    );

    return;
  }

  d.powered=true;

  state.stars+=5;

  saveLocal();

  feedback(
    "⚡ Power is ON. The computer is starting...",
    "good",
    true
  );

  renderStage();

  setTimeout(
    ()=>{

      feedback(
        "✅ Computer started successfully! Now check the network.",
        "good",
        true
      );

      speak(
        "Computer started successfully. Now check the network."
      );

    },
    900
  );

}

function testInternet(){

  const d=
    stageData();

  if(
    state.activeStage===1
  ){

    if(!d.powered){
      return;
    }

    if(
      !d.connections.includes(
        "lan"
      )
    ){

      feedback(
        "❌ No network cable. Connect the PC to the router first.",
        "bad",
        true
      );

      return;
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

    return;
  }

  updateStage2DerivedState();

  const left=
    remainingStage2Faults()
      .length;

  if(left>0){

    feedback(
      `⚠️ ${left} hidden cable fault${left>1?"s":""} still remain. Repair them first.`,
      "bad",
      true
    );

    return;
  }

  if(!d.powered){

    feedback(
      "⚠️ System power check failed. Check CPU and monitor power connections.",
      "bad",
      true
    );

    return;
  }

  if(
    !requiredConnections(2)
      .every(
        x=>
          d.connections.includes(x)
      )
  ){

    feedback(
      "⚠️ The full system is not ready yet. Check all devices and cables.",
      "bad",
      true
    );

    return;
  }

  d.internet=true;

  state.stars+=8;

  saveLocal();

  feedback(
    "🧪 Full system test passed! Computer, network, speaker and printer are ready.",
    "good",
    true
  );

  speak(
    "Full system test passed. Excellent work, Junior Technician."
  );

  renderStage();

}

function checkComplete(){

  const d=
    stageData();

  const complete=
    d.placed.length===
      stageDeviceIds().length
    &&
    requiredConnections()
      .every(
        x=>
          d.connections.includes(x)
      )
    &&
    d.powered
    &&
    d.internet
    &&
    (
      state.activeStage===1
      ||
      d.faultFixed
    );

  if(!complete){
    return;
  }

  if(
    state.activeStage===1
    &&
    !state.stage1Complete
  ){

    state.stage1Complete=true;

    state.stars+=15;

    saveLocal();

    $("stageComplete")
      .classList.remove(
        "hidden"
      );

    $("completionTitle").textContent=
      "Stage 1 Complete — Stage 2 Unlocked!";

    $("completionText").textContent=
      "You built and connected a complete computer. The Junior Technician challenge is now open.";

    $("nextStageButton").textContent=
      "Open Stage 2 →";

    celebrate(false);

  }else if(
    state.activeStage===2
    &&
    !state.stage2Complete
  ){

    state.stage2Complete=true;

    state.stars+=25;

    saveLocal();

    $("stageComplete")
      .classList.remove(
        "hidden"
      );

    $("completionTitle").textContent=
      "Stage 2 Complete — Certificate Unlocked!";

    $("completionText").textContent=
      "You diagnosed two hidden cable faults and passed the full Junior Technician system test.";

    $("nextStageButton").textContent=
      "View Certificate";

    celebrate(true);

    showCertificate();

  }

  renderStage();

}

function updateProgress(){

  const d=
    stageData();

  const total=
    config().steps.length;

  const done=
    config()
      .steps
      .filter(
        x=>
          isStepDone(
            x[1],
            d
          )
      )
      .length;

  const pct=
    Math.round(
      done
      /
      total
      *
      100
    );

  $("progressBar").style.width=
    pct+"%";

  $("progressText").textContent=
    pct+"%";

  renderSteps();

  if(pct===100){

    const alreadyDone=
      state.activeStage===1
      ?
      state.stage1Complete
      :
      state.stage2Complete;

    if(!alreadyDone){

      checkComplete();

    }

  }

}

function randomTwo(list){

  const a=[
    ...list
  ];

  for(
    let i=a.length-1;
    i>0;
    i--
  ){

    const j=
      Math.floor(
        Math.random()
        *
        (i+1)
      );

    [
      a[i],
      a[j]
    ]
    =
    [
      a[j],
      a[i]
    ];

  }

  return a.slice(
    0,
    2
  );

}

function prepareStage2Challenge(
  force=false
){

  const d=
    state.stage2;

  if(
    state.stage2Complete
    &&
    !force
  ){

    d.placed=
      stageDeviceIds(2);

    d.connections=
      requiredConnections(2);

    d.powered=true;
    d.internet=true;
    d.faultFixed=true;
    d.faultCables=[];
    d.prepared=true;

    return;
  }

  if(
    d.prepared
    &&
    d.faultCables.length===2
    &&
    !force
  ){

    updateStage2DerivedState();

    return;
  }

  const faults=
    randomTwo(
      requiredConnections(2)
    );

  d.placed=
    stageDeviceIds(2);

  d.connections=
    requiredConnections(2)
      .filter(
        x=>
          !faults.includes(x)
      );

  d.faultCables=
    faults;

  d.internet=false;
  d.faultFixed=false;
  d.prepared=true;

  updateStage2DerivedState();

  saveLocal();

}

function stage2Symptom(){

  const d=
    state.stage2;

  const map={

    display:
      "🖥️ NO SIGNAL",

    keyboardUsb:
      "⌨️ KEYBOARD NOT RESPONDING",

    mouseUsb:
      "🖱️ MOUSE NOT RESPONDING",

    cpuPower:
      "⚡ SYSTEM UNIT HAS NO POWER",

    monitorPower:
      "⚡ MONITOR HAS NO POWER",

    lan:
      "🌐 NETWORK LINK MISSING",

    audio:
      "🔇 SPEAKER HAS NO SOUND",

    printer:
      "🖨️ PRINTER IS OFFLINE"

  };

  const clues=
    d.faultCables
      .map(
        x=>map[x]
      )
      .filter(Boolean);

  return clues.length
    ?
    "🔧 TWO FAULTS DETECTED — "
    +
    clues.join(" • ")
    +
    ". Choose the correct cables."
    :
    "🔧 Inspect the ready computer and run the full system test.";

}

function openStage(n){

  if(
    n===2
    &&
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

  clearTargets();

  if(n===2){

    prepareStage2Challenge();

  }

  saveLocal();

  $("stageComplete")
    .classList.add(
      "hidden"
    );

  renderStage();

  if(n===1){

    feedback(
      "Stage 1 loaded. Build the computer step by step.",
      "info",
      true
    );

  }else if(
    !state.stage2Complete
  ){

    feedback(
      stage2Symptom(),
      "bad",
      true
    );

  }

  const picker=
    document.querySelector(
      ".stage-picker"
    );

  if(picker){

    window.scrollTo(
      {
        top:
          picker.offsetTop-70,

        behavior:
          "smooth"
      }
    );

  }

}

function showCertificate(){

  if(
    !state.stage1Complete
    ||
    !state.stage2Complete
  ){
    return;
  }

  ensureCertificateBranding();

  const sec=
    $("certificateSection");

  sec.classList.remove(
    "hidden"
  );

  const name=
    profile.display_name
    ||
    profile.nickname
    ||
    profile.username
    ||
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
      profile.username
      ||
      name
    )
      .replace(
        /\W/g,
        ""
      )
      .slice(
        0,
        10
      )
      .toUpperCase();

  $("certificateId").textContent=
    "Certificate ID: TKA-JIT-"
    +
    seed
    +
    "-"
    +
    d.getFullYear();

}

function ensureStage2Hardware(){

  const cpu=
    $("cpuBuilt");

  if(
    cpu
    &&
    !cpu.querySelector(
      '[data-port="audio-out"]'
    )
  ){

    cpu.insertAdjacentHTML(
      "beforeend",
      `
        <div
          class="port port-audio-out"
          data-port="audio-out"
        >
          AUDIO
        </div>
      `
    );

  }

  if(
    cpu
    &&
    !cpu.querySelector(
      '[data-port="cpu-printer"]'
    )
  ){

    cpu.insertAdjacentHTML(
      "beforeend",
      `
        <div
          class="port port-printer-out"
          data-port="cpu-printer"
        >
          PRN
        </div>
      `
    );

  }

  const bench=
    q(".workbench");

  if(
    bench
    &&
    !$("speakerBuilt")
  ){

    bench.insertAdjacentHTML(
      "beforeend",
      `
        <div
          id="speakerBuilt"
          class="
            built-device
            speaker-built
            hidden
          "
        >

          <div
            class="speaker-body"
          >

            <div
              class="
                speaker-ring
                speaker-ring-small
              "
            ></div>

            <div
              class="
                speaker-ring
                speaker-ring-big
              "
            ></div>

          </div>

          <div
            class="
              port
              port-speaker-in
            "
            data-port="speaker-in"
          >
            AUDIO
          </div>

        </div>
      `
    );

  }

  if(
    bench
    &&
    !$("printerBuilt")
  ){

    bench.insertAdjacentHTML(
      "beforeend",
      `
        <div
          id="printerBuilt"
          class="
            built-device
            printer-built
            hidden
          "
        >

          <div
            class="printer-body"
          >

            <div
              class="printer-paper"
            ></div>

            <div
              class="printer-slot"
            ></div>

            <div
              class="printer-light"
            ></div>

          </div>

          <div
            class="
              port
              port-printer-usb
            "
            data-port="printer-usb"
          >
            USB
          </div>

        </div>
      `
    );

  }

}

function vitMakeKeys(
  amount,
  extra=""
){

  return Array
    .from(
      {
        length:
          amount
      },
      ()=>
        `
          <i
            class="
              vit-key
              ${extra}
            "
          ></i>
        `
    )
    .join("");

}

function upgradeHardwareLook(){

  const keys=
    document.querySelector(
      "#keyboardBuilt .keys"
    );

  if(
    keys
    &&
    !keys.dataset.realKeyboard
  ){

    keys.dataset.realKeyboard=
      "yes";

    keys.innerHTML=`

      <div
        class="vit-key-row"
      >
        ${vitMakeKeys(12)}
      </div>

      <div
        class="vit-key-row"
      >

        <i
          class="vit-key wide"
        ></i>

        ${vitMakeKeys(9)}

        <i
          class="vit-key wide"
        ></i>

      </div>

      <div
        class="vit-key-row"
      >

        <i
          class="vit-key wide"
        ></i>

        ${vitMakeKeys(3)}

        <i
          class="vit-key space"
        ></i>

        ${vitMakeKeys(3)}

        <i
          class="vit-key wide"
        ></i>

      </div>

    `;

  }

  const mouse=
    $("mouseBuilt");

  if(
    mouse
    &&
    !mouse.querySelector(
      ".vit-mouse-buttons"
    )
  ){

    const buttons=
      document.createElement(
        "div"
      );

    buttons.className=
      "vit-mouse-buttons";

    mouse.prepend(
      buttons
    );

  }

  const cpuPanel=
    document.querySelector(
      "#cpuBuilt .cpu-panel"
    );

  if(
    cpuPanel
    &&
    !cpuPanel.querySelector(
      ".vit-cpu-details"
    )
  ){

    const details=
      document.createElement(
        "div"
      );

    details.className=
      "vit-cpu-details";

    details.innerHTML=`

      <div
        class="vit-drive-slot"
      ></div>

      <div
        class="vit-front-io"
      >
        <i></i>
        <i></i>
        <i></i>
      </div>

    `;

    cpuPanel.prepend(
      details
    );

  }

}

function ensureCertificateBranding(){

  const logo=
    q(".cert-logo");

  if(logo){

    logo.classList.add(
      "round-home-logo"
    );

    logo.innerHTML=
      "<span>T</span>";

  }

  const footer=
    q(".cert-footer");

  if(
    footer
    &&
    footer.children[2]
  ){

    const right=
      footer.children[2];

    right.classList.add(
      "signature-block"
    );

    right.innerHTML=`

      <div
        class="tannu-signature"
      >

        <span
          class="sig-main"
        >
          Tannu
        </span>

        <span
          class="sig-slash"
        >
          〰
        </span>

      </div>

      <small>
        Authorized Signature • Kids Digital Academy
      </small>

    `;

  }

}

function ensureCelebrationMarkup(){

  const c=
    $("celebration");

  if(!c){
    return;
  }

  c.innerHTML=`

    <div
      class="celebration-center"
    >
      🌟 GREAT JOB! 🌟
    </div>

    <div
      class="party-layer"
    ></div>

  `;

}

function celebrate(
  big=false
){

  const c=
    $("celebration");

  if(!c){
    return;
  }

  const center=
    c.querySelector(
      ".celebration-center"
    );

  const layer=
    c.querySelector(
      ".party-layer"
    );

  if(center){

    center.textContent=
      big
      ?
      "🎉 LEVEL 2 COMPLETE! 🎉"
      :
      "🌟 GREAT JOB! 🌟";

  }

  if(layer){

    layer.innerHTML="";

    const icons=[
      "🎈",
      "⭐",
      "✨",
      "🎊",
      "🌟",
      "🎉"
    ];

    for(
      let i=0;
      i<34;
      i++
    ){

      const p=
        document.createElement(
          "span"
        );

      p.className=
        "party-particle";

      p.textContent=
        icons[
          i
          %
          icons.length
        ];

      p.style.left=
        (
          2
          +
          Math.random()*96
        )
        +
        "%";

      p.style.top=
        (
          8
          +
          Math.random()*88
        )
        +
        "%";

      p.style.setProperty(
        "--dx",
        (
          Math.random()*180
          -
          90
        )
        +
        "px"
      );

      p.style.setProperty(
        "--dy",
        (
          -90
          -
          Math.random()*260
        )
        +
        "px"
      );

      p.style.setProperty(
        "--rot",
        (
          Math.random()*720
          -
          360
        )
        +
        "deg"
      );

      p.style.animationDelay=
        (
          Math.random()*1.2
        )
        +
        "s";

      p.style.animationDuration=
        (
          2.6
          +
          Math.random()*1.8
        )
        +
        "s";

      layer.appendChild(p);

    }

  }

  c.classList.remove(
    "hidden"
  );

  c.classList.add(
    "party-show"
  );

  clearTimeout(
    window.__vitPartyTimer
  );

  window.__vitPartyTimer=
    setTimeout(
      ()=>{

        c.classList.add(
          "hidden"
        );

        c.classList.remove(
          "party-show"
        );

        if(layer){
          layer.innerHTML="";
        }

      },
      big
      ?
      5200
      :
      2600
    );

}

function injectEnhancementStyles(){

  if(
    $("vitDynamicStyles")
  ){
    return;
  }

  const style=
    document.createElement(
      "style"
    );

  style.id=
    "vitDynamicStyles";

  style.textContent=`

    .cable-swatch.audio{
      background:#8d63ff!important;
    }

    .cable-swatch.printer{
      background:#6b7280!important;
    }

    .cable-swatch.coax{
      background:
        repeating-linear-gradient(
          90deg,
          #333 0 8px,
          #aaa 8px 12px
        )!important;
    }

    .cable-swatch.telephone{
      background:#b457ff!important;
    }

    .cable-path.audio{
      stroke:#8d63ff!important;
    }

    .cable-path.printer{
      stroke:#6b7280!important;
    }

    .port-audio-out{
      right:-23px;
      top:118px;
    }

    .port-printer-out{
      left:-20px;
      top:152px;
    }

    .speaker-built{
      left:10%;
      top:58%;
      width:78px;
      height:104px;
      z-index:16;
    }

    .speaker-body{
      width:100%;
      height:100%;
      border-radius:18px;
      background:
        linear-gradient(
          160deg,
          #303b60,
          #11182e
        );
      border:
        3px solid #131a31;
      box-shadow:
        0 12px 22px #0003;
      position:relative;
    }

    .speaker-ring{
      position:absolute;
      left:50%;
      transform:
        translateX(-50%);
      border-radius:50%;
      background:#101522;
      border:
        5px solid #556593;
      box-shadow:
        inset 0 0 0 3px #222b48;
    }

    .speaker-ring-small{
      width:20px;
      height:20px;
      top:14px;
    }

    .speaker-ring-big{
      width:40px;
      height:40px;
      bottom:13px;
    }

    .port-speaker-in{
      right:-23px;
      top:40px;
    }

    .speaker-built.online
    .speaker-ring-big{
      box-shadow:
        inset 0 0 0 3px #222b48,
        0 0 18px #8d63ff;
    }

    .printer-built{
      left:68%;
      top:60%;
      width:138px;
      height:95px;
      z-index:16;
    }

    .printer-body{
      width:100%;
      height:100%;
      border-radius:16px;
      background:
        linear-gradient(
          160deg,
          #f8fbff,
          #c8d1df
        );
      border:
        3px solid #aab4c5;
      box-shadow:
        0 12px 22px #0003;
      position:relative;
    }

    .printer-paper{
      position:absolute;
      left:27px;
      top:-19px;
      width:82px;
      height:33px;
      border-radius:
        8px 8px 2px 2px;
      background:#fff;
      border:
        2px solid #d9deea;
    }

    .printer-slot{
      position:absolute;
      left:17px;
      top:31px;
      width:100px;
      height:18px;
      border-radius:8px;
      background:#717b8c;
    }

    .printer-light{
      position:absolute;
      right:12px;
      bottom:10px;
      width:10px;
      height:10px;
      border-radius:50%;
      background:#9ca2b7;
    }

    .printer-built.online
    .printer-light{
      background:#29f394;
      box-shadow:
        0 0 14px #29f394;
    }

    .port-printer-usb{
      right:-23px;
      top:34px;
    }

    .vit-modal-backdrop{
      position:fixed;
      inset:0;
      z-index:200000;
      display:none;
      place-items:center;
      padding:20px;
      background:
        rgba(14,18,50,.58);
      backdrop-filter:
        blur(7px);
    }

    .vit-modal-backdrop.show{
      display:grid;
    }

    .vit-reset-modal{
      width:min(470px,94vw);
      border-radius:28px;
      overflow:hidden;
      background:#fff;
      box-shadow:
        0 30px 90px
        rgba(12,17,55,.40);
    }

    .vit-modal-top{
      padding:
        23px 24px 18px;
      color:#fff;
      background:
        linear-gradient(
          135deg,
          #25245c,
          #6d5dfc 58%,
          #25cfc1
        );
    }

    .vit-modal-icon{
      width:58px;
      height:58px;
      display:grid;
      place-items:center;
      margin-bottom:11px;
      border-radius:18px;
      background:#ffffff22;
      font-size:30px;
    }

    .vit-modal-top h3{
      margin:0 0 6px;
      font-size:22px;
    }

    .vit-modal-top p{
      margin:0;
      color:#e8e8ff;
      font-size:12px;
      line-height:1.55;
    }

    .vit-modal-body{
      padding:
        20px 24px 23px;
    }

    .vit-reset-note{
      padding:
        13px 14px;
      border-radius:15px;
      background:#fff7e3;
      color:#735514;
      font-size:11px;
      font-weight:800;
      line-height:1.55;
    }

    .vit-modal-actions{
      display:grid;
      grid-template-columns:
        1fr 1fr;
      gap:10px;
      margin-top:17px;
    }

    .vit-modal-actions button{
      border:0;
      min-height:46px;
      border-radius:14px;
      font-weight:1000;
    }

    #vitResetCancel{
      background:#f1f2f8;
      color:#454b68;
    }

    #vitResetConfirm{
      color:#fff;
      background:
        linear-gradient(
          135deg,
          #ed526f,
          #ff8a56
        );
    }

    .cable-item.wrong-choice{
      animation:
        vitWrongCable
        .32s
        ease
        2!important;
      outline:
        3px solid
        #e94e69!important;
      background:
        #fff0f3!important;
    }

    @keyframes vitWrongCable{

      25%{
        transform:
          translateX(-5px);
      }

      75%{
        transform:
          translateX(5px);
      }

    }

    .vit-pressed{
      filter:
        brightness(1.24)!important;
    }

    .celebration{
      position:absolute!important;
      inset:0!important;
      left:0!important;
      top:0!important;
      transform:none!important;
      z-index:80!important;
      padding:0!important;
      border-radius:0!important;
      background:
        radial-gradient(
          circle at center,
          #ffffff55 0,
          #ffffff10 40%,
          transparent 70%
        )!important;
      box-shadow:none!important;
      overflow:hidden!important;
      pointer-events:none!important;
    }

    .celebration-center{
      position:absolute;
      left:50%;
      top:12%;
      transform:
        translateX(-50%);
      z-index:5;
      background:#fff;
      padding:
        16px 28px;
      border-radius:20px;
      font-size:25px;
      font-weight:1000;
      color:#5e4fd0;
      box-shadow:
        0 15px 45px #0003;
      white-space:nowrap;
      animation:
        vitPartyPop
        .45s
        ease;
    }

    .party-layer{
      position:absolute;
      inset:0;
      overflow:hidden;
    }

    .party-particle{
      position:absolute;
      font-size:
        clamp(
          22px,
          2.6vw,
          38px
        );
      animation:
        vitPartyFly
        linear
        infinite;
      filter:
        drop-shadow(
          0 5px 4px #0002
        );
    }

    @keyframes vitPartyFly{

      0%{
        opacity:0;
        transform:
          translate(
            0,
            30px
          )
          scale(.55)
          rotate(0);
      }

      15%{
        opacity:1;
      }

      70%{
        opacity:1;
      }

      100%{
        opacity:0;
        transform:
          translate(
            var(--dx),
            var(--dy)
          )
          scale(1.25)
          rotate(
            var(--rot)
          );
      }

    }

    @keyframes vitPartyPop{

      from{
        opacity:0;
        transform:
          translateX(-50%)
          scale(.55);
      }

      to{
        opacity:1;
        transform:
          translateX(-50%)
          scale(1);
      }

    }

    .cert-logo.round-home-logo{
      width:58px!important;
      height:58px!important;
      border-radius:50%!important;
      background:
        linear-gradient(
          135deg,
          #22cfc2,
          #6d5dfc 58%,
          #f04fa8
        )!important;
      color:#fff!important;
      box-shadow:
        0 0 0 4px #6d5dfc22,
        0 8px 18px #3e328033!important;
      position:relative;
      overflow:hidden;
    }

    .cert-logo.round-home-logo:after{
      content:"";
      position:absolute;
      inset:5px;
      border:
        2px solid
        #ffffff66;
      border-radius:50%;
    }

    .cert-logo.round-home-logo span{
      position:relative;
      z-index:2;
      font-weight:1000;
    }

    .signature-block{
      position:relative!important;
    }

    .signature-block
    .tannu-signature{
      height:45px;
      position:relative;
      display:flex;
      align-items:center;
      justify-content:center;
      margin-top:-8px;
      margin-bottom:2px;
      color:#2047a5;
      transform:
        rotate(-5deg);
      border-top:
        0!important;
      padding-top:
        0!important;
    }

    .sig-main{
      font-family:
        "Segoe Script",
        "Brush Script MT",
        "Lucida Handwriting",
        cursive;
      font-size:37px;
      font-weight:800;
      letter-spacing:-2px;
      text-shadow:
        1px 1px 0 #6a79c7;
      line-height:1;
    }

    .sig-slash{
      position:absolute;
      left:50%;
      top:24px;
      transform:
        translateX(-48%)
        rotate(-7deg)
        scaleX(1.8);
      font-size:28px;
      font-weight:900;
      color:#2047a5;
      opacity:.9;
    }

    .signature-block small{
      margin-top:
        2px!important;
    }

    @media print{

      .tannu-signature{
        height:10mm!important;
        margin-top:-1mm!important;
        margin-bottom:0!important;
      }

      .sig-main{
        font-size:
          23pt!important;
      }

      .sig-slash{
        top:5mm!important;
        font-size:
          18pt!important;
      }

      .signature-block small{
        font-size:
          5.5pt!important;
      }

    }

  `;

  document.head
    .appendChild(
      style
    );

}

function createResetModal(){

  if(
    $("vitResetModal")
  ){
    return;
  }

  document.body
    .insertAdjacentHTML(
      "beforeend",
      `

        <div
          id="vitResetModal"
          class="vit-modal-backdrop"
          aria-hidden="true"
        >

          <div
            class="vit-reset-modal"
            role="dialog"
            aria-modal="true"
          >

            <div
              class="vit-modal-top"
            >

              <div
                class="vit-modal-icon"
              >
                ↻
              </div>

              <h3>
                Reset Junior IT Lab?
              </h3>

              <p>
                Start the practical lab again from the beginning?
              </p>

            </div>

            <div
              class="vit-modal-body"
            >

              <div
                class="vit-reset-note"
              >
                ⚠️ This will clear Stage 1, Stage 2,
                Lab Stars and the unlocked certificate.
                Student login and profile will stay safe.
              </div>

              <div
                class="vit-modal-actions"
              >

                <button
                  id="vitResetCancel"
                  type="button"
                >
                  Keep My Progress
                </button>

                <button
                  id="vitResetConfirm"
                  type="button"
                >
                  Yes, Reset Lab
                </button>

              </div>

            </div>

          </div>

        </div>

      `
    );

  $("vitResetCancel")
    .addEventListener(
      "click",
      closeResetModal
    );

  $("vitResetConfirm")
    .addEventListener(
      "click",
      ()=>{

        localStorage.removeItem(
          STORAGE_KEY
        );

        $("certificateSection")
          ?.classList
          .add(
            "hidden"
          );

        $("stageComplete")
          ?.classList
          .add(
            "hidden"
          );

        closeResetModal();

        location.reload();

      }
    );

  $("vitResetModal")
    .addEventListener(
      "click",
      e=>{

        if(
          e.target.id===
          "vitResetModal"
        ){

          closeResetModal();

        }

      }
    );

  document.addEventListener(
    "keydown",
    e=>{

      if(
        e.key==="Escape"
      ){

        closeResetModal();

      }

    }
  );

}

function openResetModal(){

  const modal=
    $("vitResetModal");

  if(!modal){
    return;
  }

  modal.classList.add(
    "show"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

}

function closeResetModal(){

  const modal=
    $("vitResetModal");

  if(!modal){
    return;
  }

  modal.classList.remove(
    "show"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}

function installTouchFeedback(){

  document.addEventListener(
    "pointerdown",
    e=>{

      const el=
        e.target.closest(
          ".cable-item,.device-item,.big-action,.socket,.port,.router-port"
        );

      if(!el){
        return;
      }

      el.classList.add(
        "vit-pressed"
      );

      setTimeout(
        ()=>
          el.classList.remove(
            "vit-pressed"
          ),
        240
      );

    }
  );

}

function installResizeFix(){

  syncCableViewBox();

  if(
    "ResizeObserver"
    in window
  ){

    const ro=
      new ResizeObserver(
        ()=>
          requestAnimationFrame(
            drawCables
          )
      );

    ro.observe(
      $("labRoom")
    );

  }

  window.addEventListener(
    "resize",
    ()=>
      setTimeout(
        drawCables,
        60
      )
  );

}

$("soundToggle")
  .addEventListener(
    "click",
    ()=>{

      voiceOn=
        !voiceOn;

      $("soundToggle").textContent=
        voiceOn
        ?
        "🔊 Voice On"
        :
        "🔇 Voice Off";

    }
  );

$("hearMission")
  .addEventListener(
    "click",
    ()=>
      speak(
        config().title
        +
        ". "
        +
        config().text
        +
        ". "
        +
        config().hint
      )
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
    ()=>
      openStage(1)
  );

$("stage2Button")
  .addEventListener(
    "click",
    ()=>
      openStage(2)
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
          .scrollIntoView(
            {
              behavior:"smooth"
            }
          );

      }else{

        openStage(2);

      }

    }
  );

$("printCertificate")
  .addEventListener(
    "click",
    ()=>
      window.print()
  );

$("powerSwitch")
  .addEventListener(
    "click",
    powerOn
  );

$("resetLab")
  .addEventListener(
    "click",
    openResetModal
  );

injectEnhancementStyles();

ensureStage2Hardware();

upgradeHardwareLook();

ensureCertificateBranding();

ensureCelebrationMarkup();

createResetModal();

installTouchFeedback();

loadLocal();

if(
  state.activeStage===2
  &&
  state.stage1Complete
){

  prepareStage2Challenge();

}

wirePorts();

installResizeFix();

loadProfile()
  .finally(
    ()=>{

      renderStage();

      if(
        state.activeStage===2
        &&
        !state.stage2Complete
      ){

        feedback(
          stage2Symptom(),
          "bad",
          false
        );

      }

      setTimeout(
        drawCables,
        150
      );

      setTimeout(
        drawCables,
        500
      );

    }
  );

})();
