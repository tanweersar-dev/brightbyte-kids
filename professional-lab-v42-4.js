(() => {
"use strict";

/* ============================================================
   V42.4 — PROFESSIONAL IT LAB HOTFIX
   Restores the dedicated 20-lab engine for Class 7–10.
   Keeps the V41 storage key so certificate progress is preserved.
   ============================================================ */

const API = "https://api.tanweer.site";
const TOKEN = localStorage.getItem("brightbyte_student_token") || "";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

let profile = null;
let currentLab = 1;
let selectedNode = null;
let connectMode = false;
let connectSource = null;
let hintCount = 0;
let mistakes = 0;
let activity = freshActivity();

function freshActivity(){
  return {nodes:[],links:[],answers:{},notes:"",tests:[],configured:[]};
}

const labs = [
  {id:1, icon:"🧠", min:7, title:"Hardware Identification", desc:"Identify PC parts, ports and their roles.", type:"scenario",
   tasks:["Identify RAM","Identify storage","Identify power supply","Explain one safe hardware rule"],
   q:[
    ["Which part temporarily holds active data?","RAM","SSD","PSU",0],
    ["Which part stores files after shutdown?","SSD","RAM","CPU fan",0],
    ["Which part supplies power to the PC?","PSU / SMPS","RAM","Keyboard",0],
    ["Safe first step before supervised internal hardware work?","Shut down and disconnect power","Remove RAM while running","Open the PSU",0]
   ]},
  {id:2, icon:"🧩", min:7, title:"PC Assembly & Upgrade", desc:"Choose sensible compatible upgrades and verify them.", type:"scenario",
   tasks:["Choose a RAM upgrade","Choose an SSD upgrade","Verify compatibility","Plan post-upgrade test"],
   q:[
    ["Office PC has 4 GB RAM and is slow with many apps. Best first upgrade?","Increase compatible RAM","Replace monitor","Change mouse",0],
    ["HDD is slow. Which common upgrade improves storage performance?","SSD","Keyboard","Printer cable",0],
    ["Before buying RAM, what matters?","Supported RAM type/capacity","Wallpaper","Printer model",0],
    ["After an upgrade, what should you do?","Boot and verify hardware/OS stability","Assume it works","Delete drivers",0]
   ]},
  {id:3, icon:"⚙️", min:8, title:"BIOS / UEFI & Boot", desc:"Understand boot order, detected drives and safe startup choices.", type:"scenario",
   tasks:["Select safe boot source","Check detected storage","Explain boot order","Avoid destructive changes"],
   q:[
    ["To start an approved installer from USB, what may need changing?","Boot order / boot menu","Email signature","Printer queue",0],
    ["New SSD is not visible in BIOS/UEFI. First check?","Physical/slot detection and compatibility","DNS","Outlook rules",0],
    ["What is boot order?","Sequence firmware checks boot devices","Printer job order","Email priority",0],
    ["Best learning approach in firmware?","Change only known settings and document them","Change everything","Disable security randomly",0]
   ]},
  {id:4, icon:"🪟", min:8, title:"Windows Installation & Recovery", desc:"Plan installation, drivers, updates and recovery safely.", type:"scenario",
   tasks:["Back up important data","Choose install path","Plan drivers/updates","Choose recovery option"],
   q:[
    ["Before a clean install, what is essential?","Back up important data","Delete backups","Share passwords",0],
    ["After Windows install, what should you verify?","Drivers, updates, network and apps","Only wallpaper","Printer paper",0],
    ["Recent change causes startup trouble. A reversible option may be?","Startup Repair / restore","Format immediately","Delete user files",0],
    ["Upgrade or clean install should be chosen based on?","Compatibility, requirements and backup plan","Random choice","Screen color",0]
   ]},
  {id:5, icon:"🧰", min:7, title:"Drivers & Device Manager", desc:"Investigate unknown devices and driver issues.", type:"scenario",
   tasks:["Find warning device","Choose driver action","Use rollback safely","Document result"],
   q:[
    ["Yellow warning in Device Manager usually means?","Device/driver needs attention","Monitor too bright","Printer has paper",0],
    ["A new driver breaks audio. What can help?","Rollback driver","Delete Windows","Change DNS",0],
    ["Unknown device needs identification. What can help?","Hardware ID and official vendor documentation","Guessing","Random downloads",0],
    ["After a driver fix?","Restart if required and verify device","Close without testing","Disable updates forever",0]
   ]},
  {id:6, icon:"🖨️", min:7, title:"Printer Installation", desc:"Install a network printer, port and driver.", type:"network",
   palette:["pc","switch","printer"], tasks:["Add PC","Add printer","Connect through switch","Configure same-subnet IPs","Run Test Network"]},
  {id:7, icon:"📠", min:8, title:"Printer & Scanner Troubleshooting", desc:"Solve offline, wrong-port, queue and scanner problems.", type:"scenario",
   tasks:["Identify likely cause","Check connection/IP","Check driver/port/queue","Verify with test page"],
   q:[
    ["Printer responds to ping but jobs do not print. Next check?","Queue, driver and TCP/IP port","Replace router","Format PC",0],
    ["Printer IP changed but PC still uses old port. Fix?","Update/recreate TCP/IP port","Change wallpaper","Delete email",0],
    ["Queue has a stuck job. What can you inspect?","Print queue / spooler","BIOS fan speed","DNS zone",0],
    ["After the fix?","Print a test page and confirm","Assume success","Remove printer",0]
   ]},
  {id:8, icon:"📧", min:7, title:"Outlook 365 Configuration", desc:"Practice mailbox, signatures, rules and automatic replies.", type:"scenario",
   tasks:["Choose account flow","Create safe signature","Choose automatic reply","Use rule correctly"],
   q:[
    ["Automatic reply is useful when?","You are away/unavailable","Installing RAM","Configuring VLAN",0],
    ["A rule can help?","Organize mail by condition","Install Windows","Fix hardware",0],
    ["Should support ask the user to tell you their password?","No","Yes","Always",0],
    ["Large attachment stuck in Outbox: first think about?","Connectivity/message size/account status","RAM color","Printer paper",0]
   ]},
  {id:9, icon:"✉️", min:8, title:"Email Protocol & Troubleshooting", desc:"Understand IMAP, SMTP, TLS, MFA and send/receive paths.", type:"scenario",
   tasks:["Identify SMTP","Identify IMAP","Recognize auth issue","Verify send/receive"],
   q:[
    ["Protocol commonly used to send mail?","SMTP","DHCP","VLAN",0],
    ["Protocol commonly used to sync mailbox folders?","IMAP","HDMI","ARP only",0],
    ["Repeated password prompt after a security change may involve?","Authentication/MFA/account state","Printer toner","RAM slot",0],
    ["Good final verification?","Send and receive a safe test message","Share password","Disable security",0]
   ]},
  {id:10, icon:"🌐", min:7, title:"LAN Cabling & Network Build", desc:"Build PC → Switch → Router and test connectivity.", type:"network",
   palette:["pc","pc","switch","router"], tasks:["Add two PCs","Add a switch","Add a router","Connect topology","Configure IP/gateway","Run Test Network"]},
  {id:11, icon:"🔢", min:7, title:"IP Addressing & DHCP", desc:"Configure IP, subnet, gateway and understand APIPA.", type:"network",
   palette:["pc","switch","router"], tasks:["Add PC/switch/router","Connect topology","Configure PC IP","Configure gateway","Run ipconfig","Ping gateway"]},
  {id:12, icon:"🔀", min:8, title:"Basic Switching & VLAN", desc:"Explore MAC learning and beginner VLAN separation.", type:"network",
   palette:["pc","pc","switch"], tasks:["Add two PCs and switch","Connect both PCs","Set VLAN labels","Run show vlan brief","Verify VLAN concept"]},
  {id:13, icon:"🧭", min:8, title:"Basic Routing", desc:"Connect two IP networks through a router.", type:"network",
   palette:["pc","pc","switch","switch","router"], tasks:["Build two LAN sides","Configure different IP networks","Set gateways","Run show ip route","Test network"]},
  {id:14, icon:"📶", min:7, title:"Wi-Fi & Access Point", desc:"Choose secure Wi-Fi settings and sensible AP placement.", type:"scenario",
   tasks:["Choose WPA2/WPA3","Choose band wisely","Place AP centrally","Plan guest Wi-Fi"],
   q:[
    ["Preferred security for a modern Wi-Fi lab?","WPA2/WPA3","Open network","No password",0],
    ["2.4 GHz often offers?","Longer reach but more interference","No range","Only wired access",0],
    ["For coverage, AP should generally be?","Placed sensibly/centrally","Inside a metal box","Powered off",0],
    ["Guest devices should ideally use?","Separated guest network when available","Admin network with shared password","No security",0]
   ]},
  {id:15, icon:"⌨️", min:8, title:"Network Troubleshooting CLI", desc:"Use ipconfig, ping, tracert, nslookup, renew and flushdns.", type:"network",
   palette:["pc","switch","router","cloud"], tasks:["Build PC path","Run ipconfig","Ping gateway","Ping external IP","Run nslookup","Use tracert"]},
  {id:16, icon:"🎧", min:7, title:"IT Help Desk Ticket", desc:"Receive → Clarify → Diagnose → Fix → Verify → Document.", type:"scenario",
   tasks:["Ask clarifying question","Choose logical first check","Verify fix","Write closure note"],
   q:[
    ["User says internet is down. Best first question?","Is it one device or several?","What is your OTP?","Can I delete your files?",0],
    ["Before major changes?","Check simple relevant causes first","Change everything","Format PC",0],
    ["After the fix?","Ask the user to verify","Close immediately","Delete notes",0],
    ["Good ticket note contains?","Symptom, checks, fix and verification","Only 'done'","Passwords",0]
   ]},
  {id:17, icon:"🖥️", min:8, title:"Remote Support", desc:"Consent, privacy and professional communication.", type:"scenario",
   tasks:["Get consent","Protect credentials","Explain action","Disconnect and document"],
   q:[
    ["Before remote session?","Get user permission","Ask for OTP","Hide what you do",0],
    ["During a password prompt?","Ask user to enter it themselves","Ask them to send password","Record it",0],
    ["Before restart?","Tell user to save work","Restart without warning","Delete files",0],
    ["When finished?","Disconnect and document result","Leave session open","Keep access secretly",0]
   ]},
  {id:18, icon:"🛡️", min:7, title:"Cybersecurity Incident", desc:"Recognize phishing and follow safe incident response.", type:"scenario",
   tasks:["Recognize suspicious message","Stop further interaction","Report/escalate","Protect account/device"],
   q:[
    ["Unexpected urgent login link asks for password. Best response?","Do not use it; verify/report","Enter password quickly","Forward to everyone",0],
    ["User clicked a suspicious link. First principle?","Stop further interaction and report/escalate","Hide it","Delete logs",0],
    ["MFA helps because?","A stolen password alone may not be enough","It replaces backups","It makes phishing impossible",0],
    ["Incident details should be?","Documented according to approved process","Hidden","Posted publicly",0]
   ]},
  {id:19, icon:"🤖", min:7, title:"AI for IT Support + No-Code Web", desc:"Use AI safely, verify output and plan a simple professional site.", type:"scenario",
   tasks:["Write privacy-safe prompt","Verify AI answer","Plan site pages","Check privacy before publish"],
   q:[
    ["Good AI support prompt includes?","Symptom, context and safe checks already tried","Passwords","Only 'fix it'",0],
    ["Important AI suggestion should be?","Verified and tested safely","Executed blindly","Shared as fact",0],
    ["Useful portfolio sections?","Home, About, Skills, Projects, Contact","Passwords, OTPs, home address","Only blank pages",0],
    ["Before publishing?","Check privacy, links and mobile layout","Publish secrets","Disable HTTPS",0]
   ]},
  {id:20, icon:"🏆", min:10, title:"Final Junior IT Technician Capstone", desc:"Build a small office, resolve faults and document the handover.", type:"network",
   palette:["pc","pc","pc","switch","switch","router","printer","ap","cloud"],
   tasks:["Build small-office topology","Configure IP/gateway","Connect printer","Run connectivity tests","Run CLI checks","Write handover note","Complete capstone verification"]}
];

const catalog = {
  pc:{label:"PC",icon:"🖥️",ip:"192.168.10.20"},
  switch:{label:"Switch",icon:"🔀",ip:""},
  router:{label:"Router",icon:"🧭",ip:"192.168.10.1"},
  printer:{label:"Printer",icon:"🖨️",ip:"192.168.10.50"},
  ap:{label:"Access Point",icon:"📶",ip:"192.168.10.2"},
  cloud:{label:"Internet / Cloud",icon:"☁️",ip:"8.8.8.8"}
};

function key(){
  return `tannu_professional_it_lab_v41_${profile?.user_id || profile?.username || "student"}`;
}
function readState(){
  try{return JSON.parse(localStorage.getItem(key()) || "{}") || {}}catch{return{}}
}
function writeState(s){
  try{localStorage.setItem(key(), JSON.stringify(s))}catch{}
}
function current(){return labs.find(x => x.id === currentLab) || labs[0]}
function toast(msg){
  const el=$("toast"); if(!el)return;
  el.textContent=msg; el.classList.add("show");
  clearTimeout(window.__proLabToast);
  window.__proLabToast=setTimeout(()=>el.classList.remove("show"),1800);
}
function term(msg, cls=""){
  const el=$("terminalOut"); if(!el)return;
  const d=document.createElement("div"); d.className=cls; d.textContent=msg;
  el.appendChild(d); el.scrollTop=el.scrollHeight;
}
function savedLab(id){
  return readState().labState?.[id] || null;
}
function loadActivity(){
  const s=savedLab(currentLab);
  activity=s?.activity ? JSON.parse(JSON.stringify(s.activity)) : freshActivity();
  selectedNode=null; connectMode=false; connectSource=null; hintCount=0; mistakes=0;
}
function persist(){
  const g=readState();
  g.labState=g.labState||{};
  g.labState[currentLab]={...(g.labState[currentLab]||{}),activity};
  writeState(g);
}
function openLab(id){
  const l=labs.find(x=>x.id===id); if(!l)return;
  currentLab=id;
  history.replaceState({lab:id},"",`professional-lab.html?lab=${id}`);
  loadActivity();
  renderAll();
}
function renderLabList(){
  const scores=readState().scores||{};
  $("labList").innerHTML=labs.map(l=>`
    <button class="lab-item ${l.id===currentLab?"active":""} ${Number(scores[l.id]||0)>=60?"done":""}" data-lab="${l.id}" type="button">
      <span>${l.icon}</span>
      <span><b>${l.id}. ${esc(l.title)}</b><small>Class ${l.min}+ • ${l.type==="network"?"Interactive Lab":"Guided Scenario"}</small></span>
      <span class="lab-score">${scores[l.id]?`${scores[l.id]}%`:""}</span>
    </button>`).join("");
  document.querySelectorAll("[data-lab]").forEach(b=>b.onclick=()=>openLab(Number(b.dataset.lab)));
}
function paletteFor(l){
  if(l.type!=="network")return [];
  return l.palette || ["pc","switch","router"];
}
function renderMission(){
  const l=current();
  $("missionLevel").textContent=`LAB ${l.id} • CLASS ${l.min}+`;
  $("missionTitle").textContent=l.title;
  $("missionDesc").textContent=l.desc;

  const p=paletteFor(l);
  $("devicePalette").innerHTML=p.map(type=>`
    <button class="device-tool" type="button" data-device="${type}">
      <span>${catalog[type]?.icon||"🔹"}</span>${catalog[type]?.label||type}
    </button>`).join("");

  document.querySelectorAll("[data-device]").forEach(b=>b.onclick=()=>addNode(b.dataset.device));
}
function taskDone(i){
  const l=current();
  if(l.type==="scenario") return activity.answers[i] !== undefined;

  const nodes=activity.nodes, tests=activity.tests;
  if(l.id===6)  return [nodes.some(n=>n.type==="pc"),nodes.some(n=>n.type==="printer"),activity.links.length>=2,activity.configured.length>=2,tests.includes("network")][i]||false;
  if(l.id===10) return [nodes.filter(n=>n.type==="pc").length>=2,nodes.some(n=>n.type==="switch"),nodes.some(n=>n.type==="router"),activity.links.length>=3,activity.configured.length>=2,tests.includes("network")][i]||false;
  if(l.id===11) return [nodes.length>=3,activity.links.length>=2,activity.configured.length>=1,nodes.some(n=>n.gateway),tests.includes("ipconfig"),tests.includes("gateway")][i]||false;
  if(l.id===12) return [nodes.filter(n=>n.type==="pc").length>=2&&nodes.some(n=>n.type==="switch"),activity.links.length>=2,nodes.filter(n=>n.vlan).length>=2,tests.includes("vlan"),tests.includes("vlan")][i]||false;
  if(l.id===13) return [nodes.length>=5,nodes.filter(n=>n.ip).length>=2,nodes.filter(n=>n.gateway).length>=2,tests.includes("route"),tests.includes("network")][i]||false;
  if(l.id===15) return [nodes.length>=3,tests.includes("ipconfig"),tests.includes("gateway"),tests.includes("external"),tests.includes("dns"),tests.includes("trace")][i]||false;
  if(l.id===20) return [nodes.length>=7,activity.configured.length>=3,nodes.some(n=>n.type==="printer"),tests.includes("network"),tests.includes("cli"),String(activity.notes||"").trim().length>=25,tests.includes("capstone")][i]||false;
  return false;
}
function renderChecklist(){
  const l=current(), done=l.tasks.map((_,i)=>taskDone(i));
  $("checkProgress").textContent=`${done.filter(Boolean).length}/${l.tasks.length} complete`;
  $("checklist").innerHTML=l.tasks.map((t,i)=>`
    <div class="check-item ${done[i]?"done":""}">
      <span>${done[i]?"✅":"○"}</span><span>${esc(t)}</span>
    </div>`).join("");
}
function addNode(type){
  const base=catalog[type]; if(!base)return;
  const i=activity.nodes.length;
  const node={
    id:`n${Date.now()}${i}`,type,label:base.label,ip:base.ip||"",
    mask:"255.255.255.0",
    gateway:["pc","printer"].includes(type)?"192.168.10.1":"",
    dns:type==="pc"?"8.8.8.8":"",
    vlan:"",
    x:30+(i%5)*120,y:45+Math.floor(i/5)*100
  };
  activity.nodes.push(node); selectedNode=node.id;
  persist(); renderCanvas(); renderConfig(); renderChecklist();
}
function node(id){return activity.nodes.find(n=>n.id===id)}
function drawLinks(){
  const svg=$("cableSvg"), c=$("canvas"); if(!svg||!c)return;
  const r=c.getBoundingClientRect();
  svg.setAttribute("viewBox",`0 0 ${r.width} ${r.height}`);
  svg.innerHTML=activity.links.map(l=>{
    const a=node(l.a), b=node(l.b); if(!a||!b)return"";
    return `<line class="cable-line" x1="${a.x+52}" y1="${a.y+38}" x2="${b.x+52}" y2="${b.y+38}"/>`;
  }).join("");
}
function makeDraggable(el,n){
  let drag=false,ox=0,oy=0;
  el.addEventListener("pointerdown",e=>{
    if(connectMode)return;
    drag=true; el.setPointerCapture(e.pointerId);
    const r=el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;
  });
  el.addEventListener("pointermove",e=>{
    if(!drag)return;
    const r=$("canvas").getBoundingClientRect();
    n.x=Math.max(0,Math.min(r.width-110,e.clientX-r.left-ox));
    n.y=Math.max(0,Math.min(r.height-82,e.clientY-r.top-oy));
    el.style.left=n.x+"px"; el.style.top=n.y+"px"; drawLinks();
  });
  el.addEventListener("pointerup",()=>{if(drag){drag=false;persist()}});
}
function handleConnect(id){
  if(!connectSource){connectSource=id;renderCanvas();toast("Now select the second device");return}
  if(connectSource===id){connectSource=null;renderCanvas();return}
  const exists=activity.links.some(l=>(l.a===connectSource&&l.b===id)||(l.a===id&&l.b===connectSource));
  if(!exists) activity.links.push({a:connectSource,b:id});
  connectSource=null; persist(); renderCanvas(); renderChecklist();
}
function renderCanvas(){
  const c=$("canvas");
  c.querySelectorAll(".device-node").forEach(x=>x.remove());
  $("canvasHint").style.display=activity.nodes.length?"none":"block";

  activity.nodes.forEach(n=>{
    const el=document.createElement("button");
    el.type="button";
    el.className=`device-node ${selectedNode===n.id?"selected":""} ${connectSource===n.id?"connect-source":""}`;
    el.style.left=n.x+"px"; el.style.top=n.y+"px";
    el.innerHTML=`<span class="ico">${catalog[n.type]?.icon||"🔹"}</span><b>${esc(n.label)}</b><small>${esc(n.ip || (n.vlan?`VLAN ${n.vlan}`:"Not configured"))}</small>`;
    el.onclick=e=>{
      e.stopPropagation();
      if(connectMode){handleConnect(n.id);return}
      selectedNode=n.id; renderCanvas(); renderConfig();
    };
    makeDraggable(el,n); c.appendChild(el);
  });
  drawLinks();
}
function notesBlock(){
  return `<div class="config-section">
    <h3>Technician Notes</h3>
    <div class="field"><label>What did you check, change and verify?</label>
      <textarea id="labNotes" placeholder="Write your troubleshooting / handover notes...">${esc(activity.notes||"")}</textarea>
    </div>
    <button id="saveNotes" class="config-save" type="button">Save Notes</button>
  </div>`;
}
function bindNotes(){
  const b=$("saveNotes");
  if(b)b.onclick=()=>{
    activity.notes=String($("labNotes")?.value||"").slice(0,3000);
    persist(); renderChecklist(); toast("Notes saved");
  };
}
function renderScenario(){
  const l=current();
  $("selectedLabel").textContent="Guided troubleshooting scenario";
  $("configBody").innerHTML=l.q.map((q,i)=>`
    <div class="config-section">
      <h3>${i+1}. ${esc(q[0])}</h3>
      <div class="choice-list">
        ${q.slice(1,4).map((a,j)=>`<button class="choice ${activity.answers[i]===j?"selected":""}" type="button" data-q="${i}" data-a="${j}">${esc(a)}</button>`).join("")}
      </div>
    </div>`).join("")+notesBlock();

  $("configBody").querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{
    activity.answers[Number(b.dataset.q)]=Number(b.dataset.a);
    persist(); renderScenario(); renderChecklist();
  });
  bindNotes();
}
function renderConfig(){
  const l=current();
  if(l.type==="scenario"){renderScenario();return}

  const n=node(selectedNode);
  if(!n){
    $("selectedLabel").textContent="Select a device or answer the scenario.";
    $("configBody").innerHTML=`<div class="config-section">
      <h3>Network Lab Instructions</h3>
      <p style="font-size:9px;line-height:1.6;color:#5f7588">Add devices, connect them, select a device and configure IP information. Use Terminal commands to test your work.</p>
    </div>`+notesBlock();
    bindNotes(); return;
  }

  $("selectedLabel").textContent=`${catalog[n.type]?.icon||""} ${n.label}`;
  $("configBody").innerHTML=`
    <div class="config-section">
      <h3>${esc(n.label)} Configuration</h3>
      <div class="field"><label>Device Label</label><input id="cfgLabel" value="${esc(n.label)}"></div>
      <div class="field"><label>IPv4 Address</label><input id="cfgIp" value="${esc(n.ip||"")}"></div>
      <div class="field"><label>Subnet Mask</label><input id="cfgMask" value="${esc(n.mask||"255.255.255.0")}"></div>
      <div class="field"><label>Default Gateway</label><input id="cfgGw" value="${esc(n.gateway||"")}"></div>
      <div class="field"><label>DNS</label><input id="cfgDns" value="${esc(n.dns||"")}"></div>
      <div class="field"><label>VLAN</label><input id="cfgVlan" value="${esc(n.vlan||"")}"></div>
      <button id="saveCfg" class="config-save" type="button">💾 Apply Configuration</button>
    </div>`+notesBlock();

  $("saveCfg").onclick=()=>{
    n.label=$("cfgLabel").value.trim()||n.label;
    n.ip=$("cfgIp").value.trim();
    n.mask=$("cfgMask").value.trim();
    n.gateway=$("cfgGw").value.trim();
    n.dns=$("cfgDns").value.trim();
    n.vlan=$("cfgVlan").value.trim();
    if(!activity.configured.includes(n.id))activity.configured.push(n.id);
    persist(); renderCanvas(); renderChecklist(); toast("Configuration applied");
  };
  bindNotes();
}
function validIp(ip){
  const p=String(ip||"").split(".").map(Number);
  return p.length===4 && p.every(x=>Number.isInteger(x)&&x>=0&&x<=255);
}
function testNetwork(){
  const endpoints=activity.nodes.filter(n=>["pc","printer"].includes(n.type));
  if(activity.nodes.length<2){term("TEST: Add at least two devices first.","bad");mistakes++;return false}

  const ips=activity.nodes.filter(n=>validIp(n.ip));
  const dup=ips.find((n,i)=>ips.some((x,j)=>j!==i&&x.ip===n.ip));
  if(dup){term(`TEST: Duplicate IP detected: ${dup.ip}`,"bad");mistakes++;return false}

  const ok=activity.links.length>=Math.max(1,endpoints.length-1);
  if(ok){
    term("TEST: Basic topology and link checks passed.","ok");
    if(!activity.tests.includes("network"))activity.tests.push("network");
    if(currentLab===20 && activity.nodes.length>=7 && activity.configured.length>=3 && activity.notes.trim().length>=25){
      if(!activity.tests.includes("capstone"))activity.tests.push("capstone");
    }
    persist(); renderChecklist(); return true;
  }

  term("TEST: Connect the required devices and verify configuration.","bad");
  mistakes++; return false;
}
function cli(raw){
  const cmd=String(raw||"").trim(); if(!cmd)return;
  const low=cmd.toLowerCase();
  term("> "+cmd,"info");
  const first=activity.nodes.find(n=>n.type==="pc")||activity.nodes[0];

  if(low==="help"){
    term("Commands: ipconfig /all | ping <ip> | tracert <target> | nslookup <name> | ipconfig /release | ipconfig /renew | ipconfig /flushdns | show vlan brief | show mac address-table | show ip route | clear","ok");return;
  }
  if(low==="clear"){$("terminalOut").innerHTML="";return}
  if(low==="ipconfig"||low==="ipconfig /all"){
    term(first?`IPv4 Address: ${first.ip||"169.254.20.15"}\nSubnet Mask: ${first.mask||"255.255.0.0"}\nDefault Gateway: ${first.gateway||"—"}\nDNS: ${first.dns||"—"}`:"No PC available.", first?"ok":"bad");
    if(!activity.tests.includes("ipconfig"))activity.tests.push("ipconfig");
  }else if(low.startsWith("ping ")){
    const target=cmd.slice(5).trim();
    let ok=false;
    if(first && target===first.gateway && validIp(target)){ok=true;if(!activity.tests.includes("gateway"))activity.tests.push("gateway")}
    else if(first && target==="8.8.8.8" && first.gateway){ok=true;if(!activity.tests.includes("external"))activity.tests.push("external")}
    else if(activity.nodes.some(n=>n.ip===target)){ok=true}
    term(ok?`Reply from ${target}: bytes=32 time<1ms TTL=64`:`Request timed out for ${target}.`,ok?"ok":"bad");
    if(ok&&!activity.tests.includes("cli"))activity.tests.push("cli");
  }else if(low.startsWith("nslookup ")){
    term("Server: 8.8.8.8\nName: example.com\nAddress: 93.184.216.34","ok");
    if(!activity.tests.includes("dns"))activity.tests.push("dns");
  }else if(low.startsWith("tracert ")||low.startsWith("traceroute ")){
    term("1  192.168.10.1\n2  10.0.0.1\n3  destination reached","ok");
    if(!activity.tests.includes("trace"))activity.tests.push("trace");
  }else if(low==="ipconfig /release"){
    term("IP configuration released (simulation).","ok");
  }else if(low==="ipconfig /renew"){
    if(first){
      first.ip=first.ip&& !first.ip.startsWith("169.254.") ? first.ip : "192.168.10.20";
      first.gateway=first.gateway||"192.168.10.1";
      persist();renderCanvas();renderConfig();
    }
    term("DHCP renewal completed (simulation).","ok");
  }else if(low==="ipconfig /flushdns"){
    term("Successfully flushed the DNS Resolver Cache (simulation).","ok");
  }else if(low==="show vlan brief"){
    term("VLAN 1 default active\nVLAN 10 STUDENTS active\nVLAN 20 STAFF active","ok");
    if(!activity.tests.includes("vlan"))activity.tests.push("vlan");
  }else if(low==="show mac address-table"){
    term("Vlan  Mac Address       Type      Ports\n10    00AA.BBCC.0001    DYNAMIC   Fa0/1\n20    00AA.BBCC.0002    DYNAMIC   Fa0/2","ok");
  }else if(low==="show ip route"){
    term("C 192.168.10.0/24 is directly connected\nC 192.168.20.0/24 is directly connected","ok");
    if(!activity.tests.includes("route"))activity.tests.push("route");
  }else{
    term("Unknown command. Type help.","bad");
  }

  persist(); renderChecklist();
}
function renderScores(s){
  const set=(id,v)=>{const e=$(id);if(e)e.textContent=v==null?"—":v};
  set("diagScore",s?`${s.diag}/30`:null);
  set("configScore",s?`${s.conf}/30`:null);
  set("verifyScore",s?`${s.ver}/20`:null);
  set("docScore",s?`${s.doc}/10`:null);
  set("safeScore",s?`${s.safe}/10`:null);
  set("totalScore",s?`${s.total}%`:null);
}
function score(){
  const l=current();
  if(Number(profile?.class_number||0)<l.min){
    toast(`Scoring unlocks from Class ${l.min}`);return;
  }

  let diag=0,conf=0,ver=0,doc=0,safe=0;

  if(l.type==="scenario"){
    const total=l.q.length;
    const correct=l.q.filter((q,i)=>activity.answers[i]===q[4]).length;
    const answered=Object.keys(activity.answers).length;
    diag=Math.round(correct/total*30);
    conf=Math.round(correct/total*30);
    ver=Math.round(answered/total*20);
  }else{
    const done=l.tasks.map((_,i)=>taskDone(i));
    const ratio=done.filter(Boolean).length/done.length;
    diag=Math.round(ratio*30);
    conf=Math.round(Math.min(1,(activity.configured.length+activity.links.length)/Math.max(2,l.tasks.length-1))*30);
    ver=activity.tests.length?20:0;
  }

  doc=activity.notes.trim().length>=25?10:(activity.notes.trim()?5:0);
  safe=Math.max(0,10-mistakes*2-hintCount);
  const total=Math.min(100,diag+conf+ver+doc+safe);

  const g=readState();
  g.scores=g.scores||{};
  g.scores[currentLab]=Math.max(Number(g.scores[currentLab]||0),total);
  g.xp=Object.values(g.scores).filter(v=>Number(v)>=60).length*25+(g.capstoneComplete?100:0);
  g.labState=g.labState||{};
  g.labState[currentLab]={activity,score:total,updatedAt:new Date().toISOString()};

  if(currentLab===20 && total>=70 && taskDone(6)){
    g.capstoneComplete=true;
    g.capstoneScore=Math.max(Number(g.capstoneScore||0),total);
    g.xp=Object.values(g.scores).filter(v=>Number(v)>=60).length*25+100;
  }
  writeState(g);

  renderScores({diag,conf,ver,doc,safe,total});
  renderLabList();
  $("scoreBadge").textContent=`⭐ ${Number(g.xp||0)} XP`;

  $("modalBody").innerHTML=`
    <div style="font-size:48px">${total>=80?"🏆":total>=60?"✅":"📘"}</div>
    <h2>${total>=60?"Lab Completed":"Keep Practising"} — ${total}%</h2>
    <p>${total>=60?"Your best score has been saved.":"Complete more checklist items, run tests and add technician notes, then verify again."}</p>
    <div class="result-grid">
      <div><b>Diagnosis</b><br>${diag}/30</div>
      <div><b>Configuration</b><br>${conf}/30</div>
      <div><b>Verification</b><br>${ver}/20</div>
      <div><b>Documentation + Safety</b><br>${doc+safe}/20</div>
    </div>
    ${currentLab===20&&g.capstoneComplete?`<p><b>🎉 Capstone completed.</b> Certificate Center can now use this result.</p>`:""}`;

  $("modal").classList.add("open");
  $("modal").setAttribute("aria-hidden","false");
}
function hint(){
  hintCount++;
  const tips={
    6:"Use a PC, switch and printer. Keep PC and printer in the same /24 subnet.",
    10:"Build PC → Switch → Router and add another PC. Configure unique IPs.",
    11:"169.254.x.x usually indicates DHCP trouble. Check link, DHCP and adapter settings.",
    12:"Connect both PCs to the switch, assign VLAN labels and run show vlan brief.",
    13:"Use two different /24 networks and point each PC to the router as gateway.",
    15:"Try ipconfig /all, ping gateway, ping 8.8.8.8, nslookup and tracert.",
    20:"Build a small office: router, switches, PCs, AP and printer. Test and document."
  };
  toast(tips[currentLab]||"Follow the mission checklist. Make one safe change at a time and verify it.");
}
function renderAll(){
  renderLabList();renderMission();renderCanvas();renderConfig();renderChecklist();renderScores(null);
}
async function boot(){
  if(!TOKEN){location.href="student-login.html";return}

  try{
    const r=await fetch(API+"/api/auth/me",{
      headers:{Authorization:`Bearer ${TOKEN}`},
      cache:"no-store"
    });
    const d=await r.json().catch(()=>({}));
    if(!r.ok||d.role!=="student"||!d.profile)throw new Error("Student login required");

    profile=d.profile;
    const c=Number(profile.class_number||0);

    if(c<7||c>10){
      location.href=c<=3?"foundation-universe.html":"advanced-universe.html";
      return;
    }

    try{localStorage.setItem("brightbyte_student_class_v423",String(c))}catch{}

    $("studentBadge").textContent=`👤 ${profile.display_name||profile.username||"Student"} • Class ${c}`;
    const g=readState();
    $("scoreBadge").textContent=`⭐ ${Number(g.xp||0)} XP`;

    const q=new URLSearchParams(location.search);
    currentLab=Math.min(20,Math.max(1,Number(q.get("lab")||1)));
    loadActivity();
    renderAll();

  }catch(e){
    console.error(e);
    localStorage.removeItem("brightbyte_student_token");
    location.href="student-login.html";
  }
}

/* events */
$("connectBtn").onclick=()=>{
  connectMode=!connectMode;connectSource=null;
  $("connectBtn").classList.toggle("active",connectMode);
  $("connectBtn").textContent=connectMode?"🔗 Select 2 Devices":"🔗 Connect Mode";
  renderCanvas();
};
$("testBtn").onclick=testNetwork;
$("hintBtn").onclick=hint;
$("resetBtn").onclick=()=>{
  activity=freshActivity();hintCount=0;mistakes=0;
  persist();renderAll();toast("Current lab reset");
};
$("verifyBtn").onclick=score;
$("terminalForm").onsubmit=e=>{
  e.preventDefault();
  const c=$("terminalInput").value;
  $("terminalInput").value="";
  cli(c);
};
$("clearTerminal").onclick=()=>{$("terminalOut").innerHTML="<div>Terminal cleared.</div>"};
$("canvas").onclick=()=>{if(!connectMode){selectedNode=null;renderCanvas();renderConfig()}};
$("modalClose").onclick=()=>{$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")};
$("modal").onclick=e=>{if(e.target===$("modal"))$("modalClose").click()};
window.addEventListener("resize",drawLinks);

boot();
})();
