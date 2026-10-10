(() => {
"use strict";

/* V42.2 — Compact Professional Technology Command Center
   Class 7–10 only.
   Compact dashboard + full-screen topic workspaces.
   Existing API, photo, password and profile endpoints preserved. */

const API="https://api.tanweer.site";
const TOKEN_KEY="brightbyte_student_token";
const TOKEN=localStorage.getItem(TOKEN_KEY)||"";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let profile=null;
let heroPhotoUrl=null;
let previewUrl=null;
let toastTimer=null;
let workspaceHistory=[];

const tracks=[
 {id:"hardware",icon:"🧠",title:"Hardware & Systems",desc:"PC architecture, assembly, BIOS/UEFI, Windows, drivers and upgrade planning.",moduleIds:[1,2,3,4,5]},
 {id:"print",icon:"🖨️",title:"Print & Endpoint Support",desc:"Printer installation, TCP/IP ports, scanner support, drivers and fault isolation.",moduleIds:[6,7]},
 {id:"m365",icon:"📧",title:"Microsoft 365 & Email",desc:"Outlook, mail protocols, authentication, OneDrive, Teams and cloud-service concepts.",moduleIds:[8,9,10]},
 {id:"network",icon:"🌐",title:"Networking",desc:"LAN, IP, DHCP, switching, VLAN, routing, Wi-Fi and command-line troubleshooting.",moduleIds:[11,12,13,14,15,16,17]},
 {id:"support",icon:"🎧",title:"IT Support Operations",desc:"Help desk, remote support, ticket handling, escalation and professional documentation.",moduleIds:[18,19,24]},
 {id:"cyber",icon:"🛡️",title:"Cybersecurity",desc:"Phishing, MFA, passkeys, incident response, privacy, updates and backups.",moduleIds:[20]},
 {id:"ai",icon:"🤖",title:"AI for Technology",desc:"Prompting, verification, troubleshooting support, SOP drafting and safe AI use.",moduleIds:[21,22]},
 {id:"web",icon:"🌍",title:"Web, Cloud & Digital Build",desc:"No-code websites, domains, hosting, DNS, HTTPS and safe publishing.",moduleIds:[23]}
];

const modules=[
 {id:1,track:"hardware",icon:"🧠",title:"Computer Hardware Architecture",min:7,mode:"Understand",lab:1,desc:"CPU, RAM, motherboard, SSD/NVMe, PSU, ports, compatibility and safe diagnosis.",outcomes:["Identify major computer components and interfaces","Explain component roles and dependencies","Recognize common no-power/no-display causes","Use safe handling and ESD-aware habits"]},
 {id:2,track:"hardware",icon:"🧩",title:"PC Assembly & Upgrade",min:7,mode:"Build",lab:2,desc:"Assembly sequence, RAM/storage upgrades, compatibility checks and post-upgrade verification.",outcomes:["Plan a safe assembly order","Choose compatible RAM and storage","Verify seating, cabling and power","Run a structured post-upgrade check"]},
 {id:3,track:"hardware",icon:"⚙️",title:"BIOS / UEFI & Boot",min:7,mode:"Configure",lab:3,desc:"Firmware, boot order, storage detection, secure settings and disciplined change control.",outcomes:["Explain BIOS/UEFI purpose","Read boot priority","Recognize missing-storage symptoms","Document firmware changes"]},
 {id:4,track:"hardware",icon:"🪟",title:"Windows Installation & Recovery",min:8,mode:"Install",lab:4,desc:"Boot media, partitions, setup, updates, recovery and backup-aware deployment planning.",outcomes:["Plan installation safely","Choose upgrade versus clean installation","Prepare driver/update checklist","Use recovery choices logically"]},
 {id:5,track:"hardware",icon:"🧰",title:"Drivers & Device Manager",min:7,mode:"Troubleshoot",lab:5,desc:"Unknown devices, warning icons, update, rollback and Hardware ID investigation.",outcomes:["Read Device Manager status","Choose update versus rollback","Use Hardware IDs conceptually","Verify repaired devices"]},

 {id:6,track:"print",icon:"🖨️",title:"Printer Installation",min:7,mode:"Configure",lab:6,desc:"USB/network printers, drivers, Standard TCP/IP ports, defaults and test pages.",outcomes:["Install local and network printers","Create the correct TCP/IP port","Choose the right driver","Verify with a test page"]},
 {id:7,track:"print",icon:"📠",title:"Printer & Scanner Troubleshooting",min:8,mode:"Troubleshoot",lab:7,desc:"Offline printers, wrong ports, changed IPs, stuck queues, spooler and scanner-path checks.",outcomes:["Separate network from print-service faults","Check IP and port mapping","Inspect queue/driver/spooler logically","Prove the fix with print/scan verification"]},

 {id:8,track:"m365",icon:"📧",title:"Outlook 365 Configuration",min:7,mode:"Configure",lab:8,desc:"Profiles, mailbox basics, signatures, rules, automatic replies, calendar and safe attachments.",outcomes:["Understand mailbox/profile flow","Create signatures and rules","Configure automatic replies","Troubleshoot common Outlook symptoms"]},
 {id:9,track:"m365",icon:"✉️",title:"Email Protocols & Troubleshooting",min:8,mode:"Troubleshoot",lab:9,desc:"IMAP, SMTP, TLS, authentication, MFA and send/receive troubleshooting.",outcomes:["Explain SMTP and IMAP roles","Recognize authentication/MFA issues","Separate connectivity from account problems","Verify with safe send/receive tests"]},
 {id:10,track:"m365",icon:"☁️",title:"Microsoft 365 & Cloud Services",min:7,mode:"Understand",lab:9,desc:"OneDrive, Teams, SaaS, identity and cloud collaboration fundamentals.",outcomes:["Differentiate local and cloud services","Explain OneDrive and Teams at support level","Understand SaaS and identity concepts","Use privacy-aware cloud habits"]},

 {id:11,track:"network",icon:"🌐",title:"LAN Fundamentals",min:7,mode:"Understand",lab:10,desc:"NIC, Ethernet, MAC, IP, subnet, gateway, DNS, DHCP and local network flow.",outcomes:["Name the main LAN components","Explain IP, gateway, DNS and DHCP","Trace a simple endpoint-to-router path","Recognize common addressing mistakes"]},
 {id:12,track:"network",icon:"🔢",title:"IP Addressing & DHCP",min:7,mode:"Configure",lab:11,desc:"IPv4 addressing, subnet masks, default gateways, DNS and APIPA/169.254 troubleshooting.",outcomes:["Read IPv4 configuration","Assign a valid static address","Recognize 169.254/APIPA meaning","Test gateway and DHCP logically"]},
 {id:13,track:"network",icon:"🔀",title:"Switching & VLAN Basics",min:8,mode:"Configure",lab:12,desc:"Switch ports, MAC learning, access ports, VLAN separation and verification.",outcomes:["Explain a switch's role","Understand MAC learning","Apply beginner VLAN labels","Verify segmentation conceptually"]},
 {id:14,track:"network",icon:"🧭",title:"Routing Basics",min:8,mode:"Configure",lab:13,desc:"Default gateway, routing table, connected routes and simple routed communication.",outcomes:["Explain router and gateway roles","Read a simple routing table","Trace traffic between networks","Verify a routed path"]},
 {id:15,track:"network",icon:"🌍",title:"LAN / WAN / Internet Path",min:7,mode:"Understand",lab:13,desc:"ISP, modem/ONT, firewall, router, switches, APs and end-user traffic flow.",outcomes:["Trace the office internet path","Differentiate LAN and WAN","Identify likely failure domains","Explain edge device roles"]},
 {id:16,track:"network",icon:"📶",title:"Wi-Fi & Wireless",min:7,mode:"Configure",lab:14,desc:"SSID, 2.4/5 GHz, WPA2/WPA3, signal, interference, AP placement and guest access.",outcomes:["Choose secure Wi-Fi settings","Compare wireless bands","Plan AP placement","Understand guest separation"]},
 {id:17,track:"network",icon:"⌨️",title:"Network Troubleshooting CLI",min:8,mode:"Troubleshoot",lab:15,desc:"ipconfig, ping, tracert, nslookup, release/renew and DNS-cache troubleshooting.",outcomes:["Read IP configuration","Test gateway and external reachability","Check DNS resolution","Trace the network path methodically"]},

 {id:18,track:"support",icon:"🎧",title:"IT Help Desk & Ticket Handling",min:7,mode:"Support",lab:16,desc:"Receive, clarify, diagnose, fix, verify, document, close and escalate professionally.",outcomes:["Ask high-value troubleshooting questions","Follow a logical diagnostic sequence","Verify the solution with the user","Write a professional closure note"]},
 {id:19,track:"support",icon:"🖥️",title:"Remote Support & Communication",min:8,mode:"Support",lab:17,desc:"Consent, Quick Assist-style workflow, privacy, restart communication and session closure.",outcomes:["Get user permission before remote access","Protect credentials and private information","Explain disruptive actions before restart","Disconnect and document correctly"]},
 {id:20,track:"cyber",icon:"🛡️",title:"Cybersecurity Essentials",min:7,mode:"Protect",lab:18,desc:"Phishing, MFA, passkeys, malware awareness, backups, privacy and incident reporting.",outcomes:["Recognize phishing signals","Understand MFA and passkeys","Follow safe incident-response steps","Protect account and device data"]},
 {id:21,track:"ai",icon:"🤖",title:"AI Skills for Technical Work",min:7,mode:"Verify",lab:19,desc:"Prompt structure, technical research, hallucination checks, privacy and responsible use.",outcomes:["Write structured technical prompts","Protect private information","Cross-check technical answers","Improve prompts iteratively"]},
 {id:22,track:"ai",icon:"✨",title:"AI for IT Support",min:8,mode:"Support",lab:19,desc:"Use AI for troubleshooting checklists, ticket summaries, SOP drafts and log explanations.",outcomes:["Generate structured support checklists","Draft concise ticket summaries","Explain logs without exposing secrets","Validate every AI recommendation"]},
 {id:23,track:"web",icon:"🧩",title:"No-Code Website & Web Infrastructure",min:7,mode:"Build",lab:19,desc:"Site planning, responsive design, domain, hosting, DNS, HTTPS and safe publishing.",outcomes:["Plan a clear website structure","Understand domain, hosting and DNS","Check privacy and mobile layout","Publish safely with HTTPS awareness"]},
 {id:24,track:"support",icon:"📋",title:"IT Documentation & Inventory",min:8,mode:"Document",lab:20,desc:"Asset records, SOPs, network diagrams, change notes, handover and support documentation.",outcomes:["Create a useful asset inventory","Write a repeatable SOP","Prepare a simple network diagram","Write clear technical handover notes"]}
];

const projects={
 7:[
  ["🧠","PC Component Audit","Identify and document CPU, RAM, storage, ports and realistic upgrade options.","professional-lab.html?lab=1"],
  ["🌐","LAN Infrastructure Map","Draw endpoint → switch/AP → router → internet including a network printer.","professional-lab.html?lab=10"],
  ["🎫","First Support Ticket","Write symptom, checks, resolution and verification for a basic user issue.","professional-lab.html?lab=16"]
 ],
 8:[
  ["🪟","Windows Deployment Plan","Create installation, drivers, updates, backup and recovery checklist.","professional-lab.html?lab=4"],
  ["🔀","VLAN Mini Design","Separate two logical groups and explain why segmentation matters.","professional-lab.html?lab=12"],
  ["📧","Outlook Support Runbook","Create a structured checklist for mailbox and send/receive issues.","professional-lab.html?lab=8"]
 ],
 9:[
  ["🖨️","Printer Root-Cause Report","Diagnose an offline/wrong-port printer and document proof of the fix.","professional-lab.html?lab=7"],
  ["⌨️","Network Fault Isolation","Use ipconfig, ping, nslookup and tracert to identify where connectivity fails.","professional-lab.html?lab=15"],
  ["🛡️","Security Incident Note","Respond to phishing and document safe containment and escalation.","professional-lab.html?lab=18"]
 ],
 10:[
  ["🏢","Small Office IT Design","Plan router/firewall, switches, Wi-Fi, PCs, printer and IP addressing.","professional-lab.html?lab=20"],
  ["🤖","AI-Assisted Support SOP","Draft with AI, verify technically and document corrections.","professional-lab.html?lab=19"],
  ["🏆","Junior IT Technician Capstone","Build, configure, troubleshoot, verify and hand over a small-office setup.","professional-lab.html?lab=20"]
 ]
};

const missionPool={
 7:["Identify RAM and SSD interfaces","Explain why 169.254.x.x appears","Trace PC → Switch → Router","Recognize a phishing warning sign"],
 8:["Plan a Windows installation","Configure a printer TCP/IP port","Create basic VLAN separation","Explain SMTP versus IMAP"],
 9:["Diagnose a printer offline issue","Run a CLI fault-isolation workflow","Write a ticket closure note","Plan remote support safely"],
 10:["Design a small-office network","Verify a routed path","Prepare a technical handover","Review capstone readiness"]
};

const toolkit=[
 ["ipconfig /all","Displays adapter, IP, gateway, DNS and DHCP information."],
 ["ping","Tests whether a target is reachable."],
 ["tracert","Shows the path traffic follows through network hops."],
 ["nslookup","Checks DNS name resolution."],
 ["ipconfig /release","Releases the current DHCP IPv4 lease."],
 ["ipconfig /renew","Requests a new DHCP IPv4 lease."],
 ["ipconfig /flushdns","Clears the local DNS resolver cache."],
 ["Device Manager","Checks device state, drivers, warnings and Hardware IDs."],
 ["Standard TCP/IP Port","Maps Windows printing to a network printer IP."],
 ["Outlook Rules","Organizes email based on conditions and actions."],
 ["Quick Assist","Supports consent-based remote assistance."],
 ["Ticket Notes","Records symptom, checks, root cause, fix and verification."]
];

const careers=[
 ["🌐","Network Support Engineer","LAN/WAN, switching, routing, Wi-Fi, troubleshooting and documentation."],
 ["🖥️","IT Support Engineer","Windows, hardware, printers, users, remote support and tickets."],
 ["☁️","Cloud Support Associate","Microsoft 365, identity, cloud services, access and collaboration."],
 ["🤖","AI-Assisted Support Specialist","Uses AI responsibly for troubleshooting and technical documentation."]
];

/* ---------- utility ---------- */
function roleFor(c){
 return c===7?"Technology Explorer":
        c===8?"Junior Systems Configurator":
        c===9?"Junior IT Support Technician":
        "Junior Infrastructure Builder"
}
function stageFor(c){
 return c===7?"CLASS 7 • EXPLORE & UNDERSTAND":
        c===8?"CLASS 8 • INSTALL & CONFIGURE":
        c===9?"CLASS 9 • TROUBLESHOOT & SUPPORT":
        "CLASS 10 • BUILD, NETWORK & SOLVE"
}
function focusFor(c){
 if(c===7)return["Explore systems and understand how they work.","Hardware, Windows, LAN, email and safe technical thinking."];
 if(c===8)return["Install and configure common IT services.","Drivers, printers, Outlook, VLANs and Wi-Fi configuration."];
 if(c===9)return["Troubleshoot faults and support users professionally.","CLI diagnostics, printer faults, tickets, security and remote support."];
 return["Build, network and solve complete technical scenarios.","Small-office infrastructure, projects, capstone and handover."]
}

function stateKey(){return `tannu_professional_it_lab_v41_${profile?.user_id||profile?.username||"student"}`}
function loadLabState(){try{return JSON.parse(localStorage.getItem(stateKey())||"{}")||{}}catch{return{}}}
function labMetrics(){
 const s=loadLabState(),scores=s.scores&&typeof s.scores==="object"?s.scores:{};
 const vals=Object.values(scores).map(Number).filter(Number.isFinite);
 const passed=vals.filter(v=>v>=60).length;
 const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
 return{passed,avg,xp:Number(s.xp||passed*25),capstone:Boolean(s.capstoneComplete),capstoneScore:Number(s.capstoneScore||0)}
}
async function authFetch(path,opt={}){
 const headers={...(opt.headers||{}),Authorization:`Bearer ${TOKEN}`};
 if(opt.body&&!(opt.body instanceof FormData)&&!headers["Content-Type"])headers["Content-Type"]="application/json";
 return fetch(API+path,{...opt,headers,cache:"no-store"})
}
function toast(msg){
 const el=$("toast");if(!el)return;
 el.textContent=msg;el.classList.add("show");
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2500)
}
function initials(){return (String(profile?.display_name||profile?.username||"Student").trim().charAt(0)||"S").toUpperCase()}

/* ---------- dashboard ---------- */
function renderIdentity(){
 const c=Number(profile?.class_number||0),name=profile?.display_name||profile?.username||"Student";
 $("studentChip").textContent=`👤 ${name}`;
 $("classChip").textContent=`🎓 Class ${c}`;
 $("profileName").textContent=name;
 $("profileId").textContent=`Student ID: ${profile?.username||"—"}`;
 $("studentRole").textContent=roleFor(c);
 $("studentClass").textContent=`Class ${c}`;
 $("studentLocation").textContent=profile?.location||"Location —";
 $("heroLevel").textContent=stageFor(c);

 const focus=focusFor(c);
 $("classFocusTitle").textContent=focus[0];
 $("classFocusText").textContent=focus[1];

 $("profilePhotoFallback").textContent=initials();

 document.querySelectorAll(".stage-rail button").forEach(a=>{
   a.classList.toggle("active",Number(a.dataset.stage)===c)
 })
}
async function loadHeroPhoto(){
 const img=$("profilePhoto"),fallback=$("profilePhotoFallback");

 if(!profile?.has_photo){
   if(heroPhotoUrl){URL.revokeObjectURL(heroPhotoUrl);heroPhotoUrl=null}
   img.hidden=true;fallback.hidden=false;fallback.textContent=initials();return
 }

 try{
   const r=await authFetch("/api/student/photo");
   if(!r.ok)throw 0;
   const blob=await r.blob();
   if(heroPhotoUrl)URL.revokeObjectURL(heroPhotoUrl);
   heroPhotoUrl=URL.createObjectURL(blob);
   img.src=heroPhotoUrl;img.hidden=false;fallback.hidden=true
 }catch{
   img.hidden=true;fallback.hidden=false
 }
}
function renderStats(){
 const m=labMetrics();
 $("labsPassed").textContent=`${m.passed} / 20`;
 $("labAverage").textContent=`${m.avg}%`;
 $("xpCount").textContent=m.xp;
 $("capstoneStatus").textContent=m.capstone?`PASSED ${m.capstoneScore||""}%`.trim():"LOCKED"
}
function renderMissions(){
 const c=Number(profile?.class_number||7);
 const arr=missionPool[c]||missionPool[7];
 const icons=["🧪","🌐","🎫","🛡️"];

 $("missionGrid").innerHTML=arr.map((x,i)=>`
   <article class="mission-card">
     <span>${icons[i]}</span>
     <b>${esc(x)}</b>
     <small>Open the mission board for the related practical task.</small>
   </article>`).join("")
}

/* ---------- workspace navigation ---------- */
function workspaceSnapshot(){
 return{
   title:$("workspaceTitle").textContent,
   subtitle:$("workspaceSubtitle").textContent,
   eyebrow:$("workspaceEyebrow").textContent,
   html:$("workspaceBody").innerHTML
 }
}
function openWorkspace(title,subtitle,eyebrow,html,push=true){
 const overlay=$("workspaceOverlay");
 if(push && overlay.classList.contains("open"))workspaceHistory.push(workspaceSnapshot());

 $("workspaceTitle").textContent=title;
 $("workspaceSubtitle").textContent=subtitle||"";
 $("workspaceEyebrow").textContent=eyebrow||"PROFESSIONAL WORKSPACE";
 $("workspaceBody").innerHTML=`<div class="workspace-shell">${html}</div>`;

 overlay.classList.add("open");
 overlay.setAttribute("aria-hidden","false");
 document.body.classList.add("workspace-open");
 $("workspaceBody").scrollTop=0;
 bindWorkspaceContent()
}
function restoreWorkspace(snap){
 $("workspaceTitle").textContent=snap.title;
 $("workspaceSubtitle").textContent=snap.subtitle;
 $("workspaceEyebrow").textContent=snap.eyebrow;
 $("workspaceBody").innerHTML=snap.html;
 $("workspaceBody").scrollTop=0;
 bindWorkspaceContent()
}
function closeWorkspace(){
 workspaceHistory=[];
 $("workspaceOverlay").classList.remove("open");
 $("workspaceOverlay").setAttribute("aria-hidden","true");
 document.body.classList.remove("workspace-open")
}
function backWorkspace(){
 if(workspaceHistory.length){
   restoreWorkspace(workspaceHistory.pop());
 }else{
   closeWorkspace()
 }
}
function chips(items){return `<div class="workspace-chips">${items.map(x=>`<span>${esc(x)}</span>`).join("")}</div>`}
function hero(icon,title,copy,chipList=[]){
 return `<section class="workspace-hero">
   <div class="workspace-icon">${icon}</div>
   <h3>${esc(title)}</h3>
   <p>${esc(copy)}</p>
   ${chips(chipList)}
 </section>`
}
function actions(items){
 return `<div class="workspace-actions">${items.map((x,i)=>`<a class="${i===0?"primary":""}" href="${x[0]}">${x[1]}</a>`).join("")}</div>`
}
function moduleCards(rows){
 const c=Number(profile?.class_number||7);
 return `<div class="module-grid">${rows.map(m=>{
   const locked=c<m.min;
   return `<button type="button" class="module-card ${locked?"locked":""}" data-module="${m.id}" ${locked?"disabled":""}>
     <span>${m.icon}</span>
     <h3>${esc(m.title)}</h3>
     <p>${esc(m.desc)}</p>
     <small>${locked?`UNLOCKS IN CLASS ${m.min}`:`CLASS ${m.min}+ • ${m.mode.toUpperCase()} • LAB ${m.lab}`}</small>
   </button>`
 }).join("")}</div>`
}
function bindWorkspaceContent(){
 document.querySelectorAll("#workspaceBody [data-module]").forEach(b=>{
   b.onclick=()=>openModule(Number(b.dataset.module))
 });
 document.querySelectorAll("#workspaceBody [data-track]").forEach(b=>{
   b.onclick=()=>openTrack(b.dataset.track)
 });
 document.querySelectorAll("#workspaceBody [data-kind]").forEach(b=>{
   b.onclick=()=>routeWorkspace(b.dataset.kind)
 })
}

function openTrack(id){
 const t=tracks.find(x=>x.id===id);if(!t)return;
 const rows=modules.filter(m=>t.moduleIds.includes(m.id));

 openWorkspace(
  t.title,
  t.desc,
  "TECHNOLOGY TRACK",
  hero(t.icon,t.title,`${t.desc} Open an unlocked module to review outcomes and launch the related practical lab.`,[`${rows.length} MODULES`,"CLASS-AWARE","PRACTICAL LABS","TECHNICIAN EVIDENCE"])+
  moduleCards(rows)
 )
}
function openModule(id){
 const m=modules.find(x=>x.id===id);if(!m)return;
 const c=Number(profile?.class_number||7);
 if(c<m.min){toast(`This module unlocks in Class ${m.min}`);return}

 const t=tracks.find(x=>x.id===m.track);

 openWorkspace(
  m.title,
  `${t?.title||"Technology"} • Class ${m.min}+ • ${m.mode}`,
  `MODULE ${String(m.id).padStart(2,"0")}`,
  hero(m.icon,m.title,m.desc,[t?.title||"",`CLASS ${m.min}+`,m.mode.toUpperCase(),`LAB ${m.lab}`])+
  `<div class="workspace-grid">
    <article class="workspace-card">
      <h3>Technician outcomes</h3>
      <ul>${m.outcomes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    </article>

    <article class="workspace-card">
      <h3>Professional learning cycle</h3>
      <div class="workspace-list">
        <div><b>Understand</b> — learn normal system behavior and terminology.</div>
        <div><b>Configure</b> — apply the correct setting, sequence or connection.</div>
        <div><b>Troubleshoot</b> — isolate faults using evidence and logical checks.</div>
        <div><b>Verify</b> — prove the result and document what changed.</div>
      </div>
    </article>
  </div>`+
  actions([[`professional-lab.html?lab=${m.lab}`,"🧪 Open Related Practical Lab"],["student-exams.html","📝 Exam Center"]])
 )
}

function openTracks(){
 openWorkspace(
  "Professional Technology Tracks",
  "Eight focused technical domains with 24 class-aware modules.",
  "CURRICULUM MAP",
  hero("🧭","Class 7–10 Technology Curriculum","Students progress from understanding systems to configuration, troubleshooting, support and integrated infrastructure builds.",["24 MODULES","20 PRACTICAL LABS","4 CLASS STAGES","FINAL CAPSTONE"])+
  `<div class="module-grid">${tracks.map(t=>`
    <button type="button" class="module-card" data-track="${t.id}">
      <span>${t.icon}</span><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p>
      <small>${t.moduleIds.length} MODULES • OPEN TRACK →</small>
    </button>`).join("")}</div>`
 )
}
function openNetwork(){
 const rows=modules.filter(m=>m.track==="network");

 openWorkspace(
  "Network Engineering Workspace",
  "Build and troubleshoot the complete path from endpoint to internet.",
  "NETWORK OPERATIONS",
  hero("🌐","Endpoint → Switch → Router → Firewall → Internet","Learn addressing, DHCP, switching, VLANs, routing, Wi-Fi and command-line troubleshooting as one connected system.",["IPv4","DHCP","DNS","VLAN","ROUTING","WI-FI","CLI"])+
  `<div class="topology">
    <span>🖥️ Endpoint</span><i></i><span>🔀 Switch</span><i></i><span>🧭 Router</span><i></i><span>🛡️ Firewall</span><i></i><span>☁️ Internet</span>
  </div>

  <div class="workspace-grid">
    <article class="workspace-card">
      <h3>Network verification sequence</h3>
      <div class="workspace-list">
        <div>1. Check physical link and NIC state.</div>
        <div>2. Read IP address, subnet mask, gateway and DNS.</div>
        <div>3. Ping the local gateway.</div>
        <div>4. Test external IP reachability.</div>
        <div>5. Test DNS name resolution.</div>
        <div>6. Use tracert if the path is unclear.</div>
      </div>
    </article>

    <article class="workspace-card">
      <h3>Core technician commands</h3>
      <div class="workspace-list">
        <div><b>ipconfig /all</b> — inspect adapter configuration.</div>
        <div><b>ping</b> — test reachability.</div>
        <div><b>nslookup</b> — test DNS.</div>
        <div><b>tracert</b> — inspect path/hops.</div>
        <div><b>release / renew</b> — refresh DHCP lease.</div>
        <div><b>flushdns</b> — clear DNS cache.</div>
      </div>
    </article>
  </div>`+
  moduleCards(rows)+
  actions([
    ["professional-lab.html?lab=10","Build LAN"],
    ["professional-lab.html?lab=12","Switch & VLAN"],
    ["professional-lab.html?lab=13","Routing"],
    ["professional-lab.html?lab=15","CLI Troubleshooting"]
  ])
 )
}
function openSupport(){
 const rows=modules.filter(m=>["support","print"].includes(m.track));
 const steps=[
  ["01","Receive","Understand user impact and symptom."],
  ["02","Clarify","Define scope with useful questions."],
  ["03","Diagnose","Test likely causes logically."],
  ["04","Fix","Apply the safest relevant action."],
  ["05","Verify","Prove the service works."],
  ["06","Document","Record root cause and result."]
 ];

 openWorkspace(
  "IT Support Operations",
  "Work through incidents like a junior support technician.",
  "SERVICE DESK",
  hero("🎧","Professional support workflow","Good IT support follows a repeatable process: scope, diagnose, fix, verify and document.",["INCIDENT","REQUEST","REMOTE SUPPORT","PRINTER","TICKET NOTES"])+
  `<div class="flow-grid">${steps.map(x=>`
    <article class="flow-step"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></article>`).join("")}</div>

  <div class="workspace-grid">
    <article class="workspace-card">
      <h3>Ticket closure structure</h3>
      <div class="workspace-list">
        <div><b>Issue:</b> what the user reported.</div>
        <div><b>Scope:</b> one user, many users, one device or a service.</div>
        <div><b>Checks:</b> what you verified.</div>
        <div><b>Root cause:</b> what was actually wrong.</div>
        <div><b>Resolution:</b> what was changed.</div>
        <div><b>Verification:</b> how success was confirmed.</div>
      </div>
    </article>

    <article class="workspace-card">
      <h3>Remote support standards</h3>
      <div class="workspace-list">
        <div>Get permission before connecting.</div>
        <div>Ask the user to type passwords themselves.</div>
        <div>Explain disruptive actions before restart.</div>
        <div>Do not retain access after the session.</div>
        <div>Document the final result.</div>
      </div>
    </article>
  </div>`+
  moduleCards(rows)+
  actions([
    ["professional-lab.html?lab=16","🎫 Help Desk Ticket Lab"],
    ["professional-lab.html?lab=17","🖥️ Remote Support Lab"],
    ["professional-lab.html?lab=7","🖨️ Printer Fault Lab"]
  ])
 )
}
function openHardware(){openTrack("hardware")}
function openMicrosoft(){openTrack("m365")}
function openAI(){openTrack("ai")}
function openCyber(){openTrack("cyber")}
function openWebCloud(){openTrack("web")}

function openProjects(){
 const c=Number(profile?.class_number||7),rows=projects[c]||projects[7];

 openWorkspace(
  `Class ${c} Project Portfolio`,
  "Build reviewable evidence of practical technical ability.",
  "PROJECT & EVIDENCE PIPELINE",
  hero("🗂️","Technician-style project evidence","Each project should produce something reviewable: a diagram, troubleshooting report, deployment plan, ticket note, SOP or verified lab result.",[`CLASS ${c}`,"EVIDENCE","DOCUMENTATION","PRACTICAL RESULT"])+
  `<div class="project-grid">${rows.map(([icon,title,desc,href])=>`
    <article class="project-card">
      <span>${icon}</span><b>${esc(title)}</b><small>${esc(desc)}</small>
      <a href="${href}">Open project lab →</a>
    </article>`).join("")}</div>

  <article class="workspace-card" style="margin-top:12px">
    <h3>Professional evidence checklist</h3>
    <div class="workspace-list">
      <div>State the goal or fault clearly.</div>
      <div>Show configuration or troubleshooting steps.</div>
      <div>Include proof of verification.</div>
      <div>Write a short technical handover or conclusion.</div>
    </div>
  </article>`
 )
}
function openToolkit(){
 openWorkspace(
  "Technician Troubleshooting Toolkit",
  "Know what each command and tool proves before you change anything.",
  "TOOLS & COMMANDS",
  hero("🧰","Use tools to collect evidence","A command is useful only when you understand what question it answers.",["CLI","DEVICE MANAGER","PRINT PORTS","OUTLOOK","REMOTE SUPPORT","DOCUMENTATION"])+
  `<div class="command-grid">${toolkit.map(x=>`
    <article class="command-item"><code>${esc(x[0])}</code><p>${esc(x[1])}</p></article>`).join("")}</div>`+
  actions([["professional-lab.html?lab=15","⌨️ Open CLI Troubleshooting Lab"]])
 )
}
function openCareer(){
 openWorkspace(
  "Technology Career Pathways",
  "See how today's Class 7–10 skills connect to future technical roles.",
  "CAREER ORIENTATION",
  hero("🎯","Build foundations now, specialize later","The program builds transferable infrastructure, support and troubleshooting skills before specialization.",["NETWORK SUPPORT","IT SUPPORT","CLOUD SUPPORT","AI-ASSISTED SUPPORT"])+
  `<div class="project-grid">${careers.map(x=>`
    <article class="project-card"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></article>`).join("")}</div>

  <article class="workspace-card" style="margin-top:12px">
    <h3>Class progression</h3>
    <div class="workspace-list">
      <div><b>Class 7:</b> explore systems and understand how technology works.</div>
      <div><b>Class 8:</b> install and configure common services.</div>
      <div><b>Class 9:</b> troubleshoot faults and support users.</div>
      <div><b>Class 10:</b> build, network, solve and complete the final capstone.</div>
    </div>
  </article>`
 )
}
function openPassport(){
 const m=labMetrics(),c=Number(profile?.class_number||7);

 openWorkspace(
  "Professional Skill Passport",
  "Practical evidence, assessment progress and certification readiness.",
  "SKILL EVIDENCE",
  hero("🛂","Certification is built from evidence","Monthly exams, required tests, practical labs and the Class 10 capstone contribute to final certification.",[`CLASS ${c}`,"EXAMS","TESTS","LABS","CAPSTONE"])+
  `<div class="metric-grid">
    <article class="metric-card"><b>${m.passed}/20</b><small>LABS PASSED</small></article>
    <article class="metric-card"><b>${m.avg}%</b><small>LAB AVERAGE</small></article>
    <article class="metric-card"><b>${m.xp}</b><small>TECH XP</small></article>
    <article class="metric-card"><b>${m.capstone?"PASSED":"LOCKED"}</b><small>CAPSTONE</small></article>
  </div>

  <div class="workspace-grid">
    <article class="workspace-card">
      <h3>Mandatory certification gates</h3>
      <div class="workspace-list">
        <div>Monthly Exam 1 — pass required</div>
        <div>Monthly Exam 2 — pass required</div>
        <div>Monthly Exam 3 — pass required</div>
        <div>Required tests — complete/pass</div>
        <div>Required practical labs — complete</div>
        ${c===10?"<div>Class 10 capstone — pass required</div>":""}
      </div>
    </article>

    <article class="workspace-card">
      <h3>Current practical record</h3>
      <p>${m.passed} labs currently meet the 60% practical passing threshold. Best saved lab average: ${m.avg}%.</p>
      ${actions([["professional-lab.html","Open Practical Labs"]])}
    </article>
  </div>`+
  actions([
    ["student-exams.html","📝 Open Exam Center"],
    ["final-certificate.html","🏆 Certificate Progress"]
  ])
 )
}
function openCapstone(){
 const c=Number(profile?.class_number||7),m=labMetrics();

 openWorkspace(
  "Junior IT Technician Capstone",
  c===10?"Class 10 final integrated build.":"Formal capstone scoring is intended for Class 10.",
  "FINAL PRACTICAL BUILD",
  hero("🏆","Small-office infrastructure challenge","Build a small office, configure addressing, connect a network printer, verify connectivity, use troubleshooting commands and prepare a professional handover.",["NETWORK DESIGN","PRINTER","WI-FI","CLI","DOCUMENTATION"])+
  `<div class="workspace-grid">
    <article class="workspace-card">
      <h3>Required evidence</h3>
      <ul>
        <li>Logical topology</li><li>Valid IP/gateway plan</li><li>Printer connectivity</li>
        <li>Network verification</li><li>CLI checks</li><li>Professional handover note</li>
      </ul>
    </article>

    <article class="workspace-card">
      <h3>Current status</h3>
      <p>${m.capstone?`Capstone recorded as PASSED${m.capstoneScore?` with ${m.capstoneScore}%`:""}.`:"Capstone is currently locked or not passed."}</p>
      ${c<10?"<p>You can preview the environment, but formal scoring belongs to Class 10.</p>":""}
    </article>
  </div>`+
  actions([["professional-lab.html?lab=20","Open Capstone Lab"]])
 )
}
function openMissions(){
 const c=Number(profile?.class_number||7),arr=missionPool[c]||missionPool[7];
 const labs=c===7?[1,11,10,18]:
            c===8?[4,6,12,9]:
            c===9?[7,15,16,17]:
            [20,13,20,20];

 openWorkspace(
  `Class ${c} Technician Mission Board`,
  "Four focused technical missions for the current stage.",
  "TODAY'S OPERATIONS",
  hero("🎯",stageFor(c),"Complete each mission through the related professional lab, then verify and document your result.",[`CLASS ${c}`,"PRACTICAL TASKS","VERIFICATION","DOCUMENTATION"])+
  `<div class="workspace-grid">${arr.map((x,i)=>`
    <article class="workspace-card">
      <h3>${i+1}. ${esc(x)}</h3>
      <p>Use the related professional module or practical lab. Focus on evidence, verification and clear technician notes.</p>
      ${actions([[`professional-lab.html?lab=${labs[i]}`,"Open related lab"]])}
    </article>`).join("")}</div>`
 )
}
function openStage(stage){
 const info={
  7:["Explore & Understand","Strong foundations in hardware, Windows, LAN, email and safe technical thinking."],
  8:["Install & Configure","Drivers, printers, Outlook, VLANs, Wi-Fi and common IT service configuration."],
  9:["Troubleshoot & Support","CLI diagnostics, printer faults, support tickets, security and remote assistance."],
  10:["Build, Network & Solve","Small-office design, integrated projects, capstone and professional handover."]
 }[stage];

 const rows=modules.filter(m=>m.min<=stage);

 openWorkspace(
  `Class ${stage} • ${info[0]}`,
  info[1],
  "CLASS PROGRESSION",
  hero(stage===10?"🔟":stage+"️⃣",info[0],info[1],[`${rows.length} MODULES AVAILABLE BY THIS STAGE`,"TECHNOLOGY ONLY","PRACTICAL LEARNING"])+
  moduleCards(rows)
 )
}
function routeWorkspace(kind){
 if(kind==="tracks")return openTracks();
 if(kind==="network")return openNetwork();
 if(kind==="support")return openSupport();
 if(kind==="hardware")return openHardware();
 if(kind==="microsoft")return openMicrosoft();
 if(kind==="ai")return openAI();
 if(kind==="cyber")return openCyber();
 if(kind==="webcloud")return openWebCloud();
 if(kind==="projects")return openProjects();
 if(kind==="toolkit")return openToolkit();
 if(kind==="career")return openCareer();
 if(kind==="passport")return openPassport();
 if(kind==="capstone")return openCapstone();
 if(kind==="missions")return openMissions()
}

/* ---------- account ---------- */
function openModal(id){
 const m=$(id);if(!m)return;
 m.classList.add("open");m.setAttribute("aria-hidden","false")
}
function closeModal(id){
 const m=$(id);if(!m)return;
 m.classList.remove("open");m.setAttribute("aria-hidden","true");
 if(id==="accountModal"&&previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null}
}
function setAccountBody(html){
 $("accountModalBody").innerHTML=html;openModal("accountModal")
}
function setAccountMsg(msg,good=false){
 const e=$("accountMsg");if(!e)return;
 e.textContent=msg;e.className=`account-msg ${good?"good":"bad"}`
}
function accountMenu(){
 setAccountBody(`
  <div class="account-icon">👤</div>
  <h2>My Professional Account</h2>
  <p class="account-copy">Manage your private student profile, photo and password securely.</p>

  <div class="account-menu-grid">
    <button class="account-menu-card" id="menuPhotoBtn" type="button">
      <span>📷</span><b>Profile Photo</b><small>Upload or remove your student photo.</small>
    </button>
    <button class="account-menu-card" id="menuPasswordBtn" type="button">
      <span>🔐</span><b>Password</b><small>Change password using the current password.</small>
    </button>
    <button class="account-menu-card" id="menuProfileBtn" type="button">
      <span>✏️</span><b>Edit Profile</b><small>Update name, nickname, location and bio.</small>
    </button>
  </div>

  <div class="password-rules">Keep passwords private. Guardian contact details are never shown here.</div>`);

 $("menuPhotoBtn").onclick=photoModal;
 $("menuPasswordBtn").onclick=passwordModal;
 $("menuProfileBtn").onclick=profileModal
}
function photoModal(){
 setAccountBody(`
  <div class="account-icon">📷</div>
  <h2>Change Profile Photo</h2>
  <p class="account-copy">JPG, PNG or WebP. Maximum 2 MB.</p>

  <div class="photo-preview" id="photoPreview">
    <div class="fallback">${esc(initials())}</div>
  </div>

  <input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" hidden>
  <label class="upload-label" for="photoInput">Choose New Photo</label>
  <div id="accountMsg" class="account-msg"></div>

  <div class="account-actions-row">
    <button class="danger" id="removePhotoBtn" type="button">Remove</button>
    <button id="photoCancelBtn" type="button">Cancel</button>
    <button class="save" id="photoSaveBtn" type="button" disabled>Save Photo</button>
  </div>`);

 let selected=null;
 const input=$("photoInput"),save=$("photoSaveBtn");

 input.onchange=()=>{
   const f=input.files?.[0];
   selected=null;save.disabled=true;
   if(!f)return;
   if(!["image/jpeg","image/png","image/webp"].includes(f.type))return setAccountMsg("Use JPG, PNG or WebP.");
   if(f.size>2*1024*1024)return setAccountMsg("Photo must be 2 MB or smaller.");

   if(previewUrl)URL.revokeObjectURL(previewUrl);
   previewUrl=URL.createObjectURL(f);
   $("photoPreview").innerHTML=`<img src="${previewUrl}" alt="Preview">`;
   selected=f;save.disabled=false;setAccountMsg("Photo ready.",true)
 };

 save.onclick=async()=>{
   if(!selected)return;
   save.disabled=true;
   const fd=new FormData();fd.append("photo",selected);

   try{
     const r=await authFetch("/api/student/photo",{method:"POST",body:fd});
     const d=await r.json().catch(()=>({}));
     if(!r.ok)throw new Error(d.error||"Upload failed");
     profile.has_photo=true;
     await loadHeroPhoto();
     toast("Profile photo updated");
     closeModal("accountModal")
   }catch(e){
     setAccountMsg(e.message);save.disabled=false
   }
 };

 $("removePhotoBtn").onclick=async()=>{
   if(!confirm("Remove your profile photo?"))return;
   try{
     const r=await authFetch("/api/student/photo",{method:"DELETE"});
     if(!r.ok)throw 0;
     profile.has_photo=false;
     await loadHeroPhoto();
     toast("Photo removed");
     closeModal("accountModal")
   }catch{
     setAccountMsg("Could not remove photo.")
   }
 };

 $("photoCancelBtn").onclick=()=>closeModal("accountModal")
}
function bindEyes(){
 document.querySelectorAll("[data-eye]").forEach(b=>{
   b.onclick=()=>{
     const i=$(b.dataset.eye);if(!i)return;
     const show=i.type==="password";
     i.type=show?"text":"password";
     b.textContent=show?"🙈":"👁"
   }
 })
}
function passwordModal(){
 setAccountBody(`
  <div class="account-icon">🔐</div>
  <h2>Change Password</h2>
  <p class="account-copy">After a successful change, all student sessions are signed out.</p>

  <div class="account-field">
    <label>Current Password</label>
    <div class="password-wrap">
      <input id="currentPassword" type="password">
      <button class="password-eye" data-eye="currentPassword" type="button">👁</button>
    </div>
  </div>

  <div class="account-field">
    <label>New Password</label>
    <div class="password-wrap">
      <input id="newPassword" type="password">
      <button class="password-eye" data-eye="newPassword" type="button">👁</button>
    </div>
  </div>

  <div class="account-field">
    <label>Confirm New Password</label>
    <div class="password-wrap">
      <input id="confirmPassword" type="password">
      <button class="password-eye" data-eye="confirmPassword" type="button">👁</button>
    </div>
  </div>

  <div class="password-rules">Use at least 8 characters and do not share your password.</div>
  <div id="accountMsg" class="account-msg"></div>

  <div class="account-actions-row">
    <button id="passwordCancelBtn" type="button">Cancel</button>
    <button class="save" id="passwordSaveBtn" type="button">Change Password</button>
  </div>`);

 bindEyes();
 $("passwordCancelBtn").onclick=()=>closeModal("accountModal");

 $("passwordSaveBtn").onclick=async()=>{
   const current=$("currentPassword").value;
   const next=$("newPassword").value;
   const confirmNext=$("confirmPassword").value;

   if(!current)return setAccountMsg("Enter current password.");
   if(next.length<8)return setAccountMsg("New password needs at least 8 characters.");
   if(next!==confirmNext)return setAccountMsg("New passwords do not match.");
   if(next===current)return setAccountMsg("Choose a different password.");

   const btn=$("passwordSaveBtn");btn.disabled=true;

   try{
     const r=await authFetch("/api/student/change-password",{
       method:"PATCH",
       body:JSON.stringify({currentPassword:current,newPassword:next})
     });
     const d=await r.json().catch(()=>({}));
     if(!r.ok)throw new Error(d.error||"Password change failed");

     localStorage.removeItem(TOKEN_KEY);

     setAccountBody(`
      <div class="account-icon">✅</div>
      <h2>Password Changed</h2>
      <p class="account-copy">Please log in again using your new password.</p>
      <div class="account-actions-row">
        <button class="save" id="loginAgainBtn" type="button">Login Again</button>
      </div>`);

     $("loginAgainBtn").onclick=()=>location.href="student-login.html"
   }catch(e){
     setAccountMsg(e.message);btn.disabled=false
   }
 }
}
function profileModal(){
 setAccountBody(`
  <div class="account-icon">✏️</div>
  <h2>Edit Professional Profile</h2>
  <p class="account-copy">Profile changes require password verification.</p>

  <div class="account-field">
    <label>Display Name</label>
    <input id="editName" maxlength="60" value="${esc(profile?.display_name||"")}">
  </div>

  <div class="account-field">
    <label>Nickname</label>
    <input id="editNickname" maxlength="40" value="${esc(profile?.nickname||"")}">
  </div>

  <div class="account-field">
    <label>Gender</label>
    <select id="editGender">
      <option value="">Select</option>
      <option value="male" ${profile?.gender==="male"?"selected":""}>Male</option>
      <option value="female" ${profile?.gender==="female"?"selected":""}>Female</option>
    </select>
  </div>

  <div class="account-field">
    <label>Location</label>
    <input id="editLocation" maxlength="120" value="${esc(profile?.location||"")}">
  </div>

  <div class="account-field">
    <label>About Me</label>
    <textarea id="editBio" rows="4" maxlength="240">${esc(profile?.bio||"")}</textarea>
  </div>

  <div class="account-field">
    <label>Current Password to Save</label>
    <div class="password-wrap">
      <input id="editPassword" type="password">
      <button class="password-eye" data-eye="editPassword" type="button">👁</button>
    </div>
  </div>

  <div id="accountMsg" class="account-msg"></div>

  <div class="account-actions-row">
    <button id="profileCancelBtn" type="button">Cancel</button>
    <button class="save" id="profileSaveBtn" type="button">Save Profile</button>
  </div>`);

 bindEyes();
 $("profileCancelBtn").onclick=()=>closeModal("accountModal");

 $("profileSaveBtn").onclick=async()=>{
   const password=$("editPassword").value;
   if(!password)return setAccountMsg("Enter your current password to save.");

   const btn=$("profileSaveBtn");btn.disabled=true;

   try{
     const r=await authFetch("/api/student/profile",{
       method:"PATCH",
       body:JSON.stringify({
         displayName:$("editName").value.trim(),
         nickname:$("editNickname").value.trim(),
         gender:$("editGender").value,
         location:$("editLocation").value.trim(),
         bio:$("editBio").value.trim(),
         password
       })
     });

     const d=await r.json().catch(()=>({}));
     if(!r.ok)throw new Error(d.error||"Could not save profile");

     profile=d.profile;
     renderIdentity();
     await loadHeroPhoto();
     toast("Profile updated");
     closeModal("accountModal")
   }catch(e){
     setAccountMsg(e.message);btn.disabled=false
   }
 }
}

/* ---------- events ---------- */
document.querySelectorAll("[data-workspace]").forEach(b=>{
 b.addEventListener("click",()=>routeWorkspace(b.dataset.workspace))
});
document.querySelectorAll("[data-stage]").forEach(b=>{
 b.addEventListener("click",()=>openStage(Number(b.dataset.stage)))
});
document.querySelectorAll("[data-home]").forEach(b=>{
 b.addEventListener("click",()=>{
   closeWorkspace();
   window.scrollTo({top:0,behavior:"smooth"})
 })
});

$("workspaceBack").onclick=backWorkspace;
$("workspaceClose").onclick=closeWorkspace;

document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&$("workspaceOverlay").classList.contains("open"))closeWorkspace()
});

$("accountModalClose").onclick=()=>closeModal("accountModal");
$("accountModal").onclick=e=>{
 if(e.target===$("accountModal"))closeModal("accountModal")
};

$("accountBtn").onclick=accountMenu;
$("changePhotoBtn").onclick=photoModal;
$("changePasswordBtn").onclick=passwordModal;
$("editProfileBtn").onclick=profileModal;

$("logoutBtn").onclick=async()=>{
 try{await authFetch("/api/auth/logout",{method:"POST"})}catch{}
 localStorage.removeItem(TOKEN_KEY);
 location.href="student-login.html"
};

/* ---------- boot ---------- */
async function boot(){
 if(!TOKEN){
   location.href="student-login.html";return
 }

 try{
   const r=await authFetch("/api/auth/me");
   const d=await r.json();

   if(!r.ok||d.role!=="student"||!d.profile)throw new Error("Login required");

   profile=d.profile;

   const c=Number(profile.class_number||0);
   if(c<7||c>10){
     location.href=c<=3?"foundation-universe.html":"advanced-universe.html";
     return
   }

   renderIdentity();
   await loadHeroPhoto();
   renderStats();
   renderMissions();

 }catch{
   localStorage.removeItem(TOKEN_KEY);
   location.href="student-login.html"
 }
}

window.addEventListener("pageshow",()=>{
 if(profile){
   renderStats();
   renderMissions()
 }
});

boot();
})();
