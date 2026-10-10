(() => {
"use strict";

/* V42.1 — Full-screen Professional Workspace Layer
   Additive only: keeps V42.0 backend/account/lab logic untouched.
   Replaces in-page anchor jumps with focused full-screen workspaces. */

if(window.__brightbyteV421Workspace) return;
window.__brightbyteV421Workspace = true;

const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const tracks=[
 {id:"hardware",icon:"🧠",title:"Hardware & Systems",desc:"PC architecture, assembly, BIOS/UEFI, Windows, drivers and upgrade planning.",moduleIds:[1,2,3,4,5]},
 {id:"print",icon:"🖨️",title:"Print & Endpoint Support",desc:"Printer installation, TCP/IP ports, scanner support, drivers and root-cause analysis.",moduleIds:[6,7]},
 {id:"m365",icon:"📧",title:"Microsoft 365 & Email",desc:"Outlook, email protocols, authentication, OneDrive, Teams and cloud-service concepts.",moduleIds:[8,9,10]},
 {id:"network",icon:"🌐",title:"Networking",desc:"LAN, IP, DHCP, switching, VLAN, routing, Wi-Fi and command-line troubleshooting.",moduleIds:[11,12,13,14,15,16,17]},
 {id:"support",icon:"🎧",title:"IT Support Operations",desc:"Help desk, remote support, fault isolation, ticket notes, escalation and handover.",moduleIds:[18,19,24]},
 {id:"cyber",icon:"🛡️",title:"Cybersecurity",desc:"Phishing, MFA, passkeys, incident response, privacy, updates and backups.",moduleIds:[20]},
 {id:"ai",icon:"🤖",title:"AI for Technology",desc:"Prompting, verification, troubleshooting support, SOP drafting and safe AI use.",moduleIds:[21,22]},
 {id:"web",icon:"🧩",title:"Web, Cloud & Digital Build",desc:"No-code websites, domains, hosting, DNS, HTTPS and portfolio publishing.",moduleIds:[23]}
];

const modules=[
 {id:1,track:"hardware",icon:"🧠",title:"Computer Hardware Architecture",min:7,mode:"Understand",lab:1,desc:"CPU, RAM, motherboard, SSD/NVMe, PSU, ports, compatibility and safe diagnosis.",outcomes:["Identify major computer components and interfaces","Explain component roles and dependencies","Recognize basic no-power/no-display causes","Use safe handling habits"]},
 {id:2,track:"hardware",icon:"🧩",title:"PC Assembly & Upgrade",min:7,mode:"Build",lab:2,desc:"Assembly sequence, RAM/storage upgrades, compatibility checks and post-upgrade verification.",outcomes:["Plan a safe assembly order","Choose compatible RAM and storage","Verify power/data connections","Run a structured post-upgrade check"]},
 {id:3,track:"hardware",icon:"⚙️",title:"BIOS / UEFI & Boot",min:7,mode:"Configure",lab:3,desc:"Firmware, boot order, storage detection and disciplined configuration changes.",outcomes:["Explain BIOS/UEFI purpose","Read boot priority","Recognize missing-storage symptoms","Document firmware changes"]},
 {id:4,track:"hardware",icon:"🪟",title:"Windows Installation & Recovery",min:8,mode:"Install",lab:4,desc:"Boot media, partitions, setup, updates, recovery and backup-aware deployment planning.",outcomes:["Plan installation safely","Choose upgrade vs clean install","Prepare drivers/update checklist","Use recovery choices logically"]},
 {id:5,track:"hardware",icon:"🧰",title:"Drivers & Device Manager",min:7,mode:"Troubleshoot",lab:5,desc:"Unknown devices, warnings, update, rollback and Hardware ID investigation.",outcomes:["Read Device Manager status","Choose update vs rollback","Use Hardware IDs conceptually","Verify repaired devices"]},
 {id:6,track:"print",icon:"🖨️",title:"Printer Installation",min:7,mode:"Configure",lab:6,desc:"USB/network printers, drivers, Standard TCP/IP ports, defaults and test pages.",outcomes:["Install local/network printers","Create the correct TCP/IP port","Select a suitable driver","Verify with a test page"]},
 {id:7,track:"print",icon:"📠",title:"Printer & Scanner Troubleshooting",min:8,mode:"Troubleshoot",lab:7,desc:"Offline printers, wrong ports, changed IPs, queues, spooler and scanner path checks.",outcomes:["Separate network from print-service faults","Check IP and port mapping","Inspect queue/driver/spooler","Prove the fix with print/scan verification"]},
 {id:8,track:"m365",icon:"📧",title:"Outlook 365 Configuration",min:7,mode:"Configure",lab:8,desc:"Profiles, mailbox basics, signatures, rules, automatic replies, calendar and safe attachments.",outcomes:["Understand mailbox/profile flow","Create signatures and rules","Configure automatic replies","Troubleshoot common Outlook symptoms"]},
 {id:9,track:"m365",icon:"✉️",title:"Email Protocols & Troubleshooting",min:8,mode:"Troubleshoot",lab:9,desc:"IMAP, SMTP, TLS, authentication, MFA and send/receive troubleshooting.",outcomes:["Explain SMTP and IMAP","Recognize authentication/MFA issues","Separate connectivity from account problems","Verify with safe send/receive tests"]},
 {id:10,track:"m365",icon:"☁️",title:"Microsoft 365 & Cloud Services",min:7,mode:"Understand",lab:9,desc:"OneDrive, Teams, SaaS, identity and cloud collaboration fundamentals.",outcomes:["Differentiate local and cloud services","Explain OneDrive/Teams at support level","Understand SaaS and identity concepts","Use privacy-aware cloud habits"]},
 {id:11,track:"network",icon:"🌐",title:"LAN Fundamentals",min:7,mode:"Understand",lab:10,desc:"NIC, Ethernet, MAC, IP, subnet, gateway, DNS, DHCP and local traffic flow.",outcomes:["Identify LAN components","Explain IP/gateway/DNS/DHCP","Trace endpoint-to-router traffic","Recognize basic addressing mistakes"]},
 {id:12,track:"network",icon:"🔢",title:"IP Addressing & DHCP",min:7,mode:"Configure",lab:11,desc:"IPv4 addressing, subnet masks, gateways, DNS and APIPA/169.254 troubleshooting.",outcomes:["Read IPv4 configuration","Assign a valid static address","Recognize APIPA","Test gateway and DHCP logically"]},
 {id:13,track:"network",icon:"🔀",title:"Switching & VLAN Basics",min:8,mode:"Configure",lab:12,desc:"Switch ports, MAC learning, access ports, VLAN separation and verification.",outcomes:["Explain switching basics","Understand MAC learning","Apply beginner VLAN labels","Verify segmentation conceptually"]},
 {id:14,track:"network",icon:"🧭",title:"Routing Basics",min:8,mode:"Configure",lab:13,desc:"Default gateway, routing table, connected routes and simple routed communication.",outcomes:["Explain router/gateway roles","Read a simple route table","Trace traffic between networks","Verify a routed path"]},
 {id:15,track:"network",icon:"🌍",title:"LAN / WAN / Internet Path",min:7,mode:"Understand",lab:13,desc:"ISP, modem/ONT, firewall, router, switches, access points and traffic flow.",outcomes:["Trace office internet path","Differentiate LAN and WAN","Identify likely failure domains","Explain edge device roles"]},
 {id:16,track:"network",icon:"📶",title:"Wi-Fi & Wireless",min:7,mode:"Configure",lab:14,desc:"SSID, 2.4/5 GHz, WPA2/WPA3, interference, AP placement and guest access.",outcomes:["Choose secure Wi-Fi settings","Compare wireless bands","Plan AP placement","Understand guest separation"]},
 {id:17,track:"network",icon:"⌨️",title:"Network Troubleshooting CLI",min:8,mode:"Troubleshoot",lab:15,desc:"ipconfig, ping, tracert, nslookup, release/renew and DNS-cache troubleshooting.",outcomes:["Read IP configuration","Test gateway/external reachability","Check DNS resolution","Trace network path methodically"]},
 {id:18,track:"support",icon:"🎧",title:"IT Help Desk & Ticket Handling",min:7,mode:"Support",lab:16,desc:"Receive, clarify, diagnose, fix, verify, document, close and escalate professionally.",outcomes:["Ask high-value questions","Follow logical troubleshooting order","Verify with the user","Write professional closure notes"]},
 {id:19,track:"support",icon:"🖥️",title:"Remote Support & Communication",min:8,mode:"Support",lab:17,desc:"Consent, Quick Assist-style workflow, privacy, restart communication and closure.",outcomes:["Get permission","Protect credentials","Explain disruptive actions","Disconnect and document correctly"]},
 {id:20,track:"cyber",icon:"🛡️",title:"Cybersecurity Essentials",min:7,mode:"Protect",lab:18,desc:"Phishing, MFA, passkeys, malware awareness, backups, privacy and incident reporting.",outcomes:["Recognize phishing signals","Understand MFA/passkeys","Follow safe incident steps","Protect account/device data"]},
 {id:21,track:"ai",icon:"🤖",title:"AI Skills for Technical Work",min:7,mode:"Verify",lab:19,desc:"Prompt structure, technical research, hallucination checks, privacy and responsible use.",outcomes:["Write structured prompts","Protect private data","Cross-check technical answers","Improve prompts iteratively"]},
 {id:22,track:"ai",icon:"✨",title:"AI for IT Support",min:8,mode:"Support",lab:19,desc:"Use AI for troubleshooting checklists, ticket summaries, SOP drafts and log explanations.",outcomes:["Generate support checklists","Draft ticket summaries","Explain logs safely","Validate every AI recommendation"]},
 {id:23,track:"web",icon:"🧩",title:"No-Code Website & Web Infrastructure",min:7,mode:"Build",lab:19,desc:"Site planning, responsive design, domain, hosting, DNS, HTTPS and safe publishing.",outcomes:["Plan a clear website","Understand domain/hosting/DNS","Check privacy/mobile layout","Publish safely"]},
 {id:24,track:"support",icon:"📋",title:"IT Documentation & Inventory",min:8,mode:"Document",lab:20,desc:"Asset records, SOPs, network diagrams, change notes, handover and documentation.",outcomes:["Create asset inventory","Write repeatable SOPs","Prepare a network diagram","Write technical handover notes"]}
];

const projectMap={
 7:[["🧠","PC Component Audit","Identify CPU, RAM, storage, ports and realistic upgrade options.","professional-lab.html?lab=1"],["🌐","LAN Infrastructure Map","Draw endpoint → switch/AP → router → internet with a printer.","professional-lab.html?lab=10"],["🎫","First Support Ticket","Document symptom, checks, resolution and verification.","professional-lab.html?lab=16"]],
 8:[["🪟","Windows Deployment Plan","Create install, driver, update, backup and recovery checklist.","professional-lab.html?lab=4"],["🔀","VLAN Mini Design","Separate two logical groups and explain segmentation.","professional-lab.html?lab=12"],["📧","Outlook Support Runbook","Create a structured mailbox and send/receive checklist.","professional-lab.html?lab=8"]],
 9:[["🖨️","Printer Root-Cause Report","Diagnose offline/wrong-port printing and document proof of fix.","professional-lab.html?lab=7"],["⌨️","Network Fault Isolation","Use CLI tools to identify where connectivity fails.","professional-lab.html?lab=15"],["🛡️","Security Incident Note","Respond to phishing and document safe containment.","professional-lab.html?lab=18"]],
 10:[["🏢","Small Office IT Design","Plan router/firewall, switches, Wi-Fi, PCs, printer and addressing.","professional-lab.html?lab=20"],["🤖","AI-Assisted Support SOP","Draft with AI, verify technically and document corrections.","professional-lab.html?lab=19"],["🏆","Junior IT Technician Capstone","Build, troubleshoot, verify and hand over a small-office setup.","professional-lab.html?lab=20"]]
};

const commandData=[
 ["ipconfig /all","Displays detailed adapter, IP, gateway, DNS and DHCP information."],
 ["ping","Tests basic reachability to another host."],
 ["tracert","Shows the hop-by-hop path toward a destination."],
 ["nslookup","Checks DNS name resolution."],
 ["ipconfig /release","Releases the current DHCP IPv4 lease."],
 ["ipconfig /renew","Requests a new DHCP IPv4 lease."],
 ["ipconfig /flushdns","Clears the local DNS resolver cache."],
 ["Device Manager","Checks device state, driver warnings, Hardware IDs and rollback options."],
 ["TCP/IP Port","Maps Windows printing to a network printer IP address."],
 ["Outlook Rules","Organizes email automatically by conditions and actions."],
 ["Quick Assist","Provides consent-based remote support."],
 ["Ticket Notes","Documents symptom, checks, cause, fix and verification."]
];

const careerData=[
 ["🌐","Network Support","LAN/WAN, switching, routing, Wi-Fi and connectivity troubleshooting."],
 ["🖥️","IT Support","Windows, hardware, printers, users, remote assistance and tickets."],
 ["☁️","Cloud Support","Microsoft 365, identity, cloud services, access and collaboration."],
 ["🤖","AI-Assisted Support","Uses AI carefully for troubleshooting, documentation and workflow acceleration."]
];

function currentClass(){
 const t=(document.getElementById("classChip")?.textContent||"").match(/(\d+)/);
 return t?Number(t[1]):7;
}
function labState(){
 try{
   const keys=Object.keys(localStorage).filter(k=>k.startsWith("tannu_professional_it_lab_v41_"));
   return keys.length?JSON.parse(localStorage.getItem(keys[0])||"{}"):{};
 }catch{return{}}
}
function metrics(){
 const s=labState(),scores=s.scores&&typeof s.scores==="object"?s.scores:{};
 const vals=Object.values(scores).map(Number).filter(Number.isFinite);
 const passed=vals.filter(v=>v>=60).length;
 const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
 return{passed,avg,xp:Number(s.xp||passed*25),capstone:Boolean(s.capstoneComplete),capstoneScore:Number(s.capstoneScore||0)}
}

function ensureWorkspace(){
 if($("v421Workspace")) return;
 const el=document.createElement("section");
 el.id="v421Workspace";
 el.className="v421-workspace";
 el.setAttribute("aria-hidden","true");
 el.innerHTML=`
   <header class="v421-workspace-head">
     <button id="v421Back" class="v421-back" type="button">← Dashboard</button>
     <div class="v421-workspace-title">
       <span id="v421Eyebrow">PROFESSIONAL WORKSPACE</span>
       <h2 id="v421Title">Technology Workspace</h2>
       <p id="v421Subtitle"></p>
     </div>
     <button id="v421Close" class="v421-close" type="button">×</button>
   </header>
   <div id="v421Body" class="v421-workspace-body"></div>`;
 document.body.appendChild(el);
 $("v421Back").onclick=closeWorkspace;
 $("v421Close").onclick=closeWorkspace;
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&el.classList.contains("open"))closeWorkspace()});
}

function openWorkspace(title,subtitle,eyebrow,body){
 ensureWorkspace();
 $("v421Title").textContent=title;
 $("v421Subtitle").textContent=subtitle||"";
 $("v421Eyebrow").textContent=eyebrow||"PROFESSIONAL WORKSPACE";
 $("v421Body").innerHTML=`<div class="v421-shell">${body}</div>`;
 $("v421Workspace").classList.add("open");
 $("v421Workspace").setAttribute("aria-hidden","false");
 document.body.classList.add("v421-workspace-open");
 $("v421Body").scrollTop=0;
 bindInternalWorkspaceButtons();
}
function closeWorkspace(){
 const w=$("v421Workspace");if(!w)return;
 w.classList.remove("open");w.setAttribute("aria-hidden","true");
 document.body.classList.remove("v421-workspace-open")
}
function hero(icon,title,copy,chips=[]){
 return `<section class="v421-hero"><div class="v421-hero-icon">${icon}</div><h3>${esc(title)}</h3><p>${esc(copy)}</p><div class="v421-chips">${chips.map(x=>`<span>${esc(x)}</span>`).join("")}</div></section>`
}
function actions(items){
 return `<div class="v421-actions">${items.map((x,i)=>`<a class="${i===0?"primary":""}" href="${x[0]}">${x[1]}</a>`).join("")}</div>`
}
function moduleCards(rows){
 const c=currentClass();
 return `<div class="v421-modules">${rows.map(m=>{
   const locked=c<m.min;
   return `<button type="button" class="v421-module ${locked?"locked":""}" data-v421-module="${m.id}" ${locked?"disabled":""}>
     <span>${m.icon}</span><h3>${esc(m.title)}</h3><p>${esc(m.desc)}</p>
     <small>${locked?`UNLOCKS IN CLASS ${m.min}`:`CLASS ${m.min}+ • ${m.mode.toUpperCase()} • LAB ${m.lab}`}</small>
   </button>`
 }).join("")}</div>`
}
function bindInternalWorkspaceButtons(){
 document.querySelectorAll("[data-v421-module]").forEach(b=>b.onclick=()=>openModule(Number(b.dataset.v421Module)));
 document.querySelectorAll("[data-v421-track]").forEach(b=>b.onclick=()=>openTrack(b.dataset.v421Track));
 document.querySelectorAll("[data-v421-kind]").forEach(b=>b.onclick=()=>routeKind(b.dataset.v421Kind));
}

function openTrack(id){
 const t=tracks.find(x=>x.id===id);if(!t)return;
 const rows=modules.filter(m=>t.moduleIds.includes(m.id));
 openWorkspace(t.title,t.desc,"TECHNOLOGY TRACK",
   hero(t.icon,t.title,`${t.desc} Open an unlocked module for outcomes and the related practical lab.`,[`${rows.length} MODULES`,"CLASS-AWARE","PRACTICAL LABS","TECHNICIAN EVIDENCE"])+moduleCards(rows)
 )
}
function openModule(id){
 const m=modules.find(x=>x.id===id);if(!m)return;
 const c=currentClass();if(c<m.min)return;
 const t=tracks.find(x=>x.id===m.track);
 openWorkspace(m.title,`${t?.title||""} • Class ${m.min}+ • ${m.mode}`,`MODULE ${String(m.id).padStart(2,"0")}`,
  hero(m.icon,m.title,m.desc,[t?.title||"",`CLASS ${m.min}+`,m.mode.toUpperCase(),`LAB ${m.lab}`])+
  `<div class="v421-grid">
    <article class="v421-card"><h3>Technician outcomes</h3><ul>${m.outcomes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></article>
    <article class="v421-card"><h3>Professional learning cycle</h3><div class="v421-list">
      <div><b>Understand</b> — learn expected behavior and terminology.</div>
      <div><b>Configure</b> — apply the correct setting or sequence.</div>
      <div><b>Troubleshoot</b> — isolate faults using evidence.</div>
      <div><b>Verify</b> — prove the result and document it.</div>
    </div></article>
  </div>`+
  actions([[`professional-lab.html?lab=${m.lab}`,"🧪 Open Related Practical Lab"],["student-exams.html","📝 Exam Center"]])
 )
}
function openTracks(){
 openWorkspace("Professional Technology Tracks","Eight focused technical domains with 24 modules.","CURRICULUM MAP",
  hero("🧭","Class 7–10 Technology Curriculum","The program moves from system understanding to configuration, troubleshooting, support and independent builds.",["24 MODULES","20 PRACTICAL LABS","4 CLASS STAGES","FINAL CAPSTONE"])+
  `<div class="v421-modules">${tracks.map(t=>`<button class="v421-module" type="button" data-v421-track="${t.id}"><span>${t.icon}</span><h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><small>${t.moduleIds.length} MODULES • OPEN TRACK →</small></button>`).join("")}</div>`
 )
}
function openNetwork(){
 const rows=modules.filter(m=>m.track==="network");
 openWorkspace("Network Engineering Workspace","Build and troubleshoot the path from endpoint to internet.","NETWORK OPERATIONS",
  hero("🌐","Endpoint → Switch → Router → Firewall → Internet","Learn addressing, DHCP, switching, VLANs, routing, Wi-Fi and command-line troubleshooting as one connected system.",["IPv4","DHCP","DNS","VLAN","ROUTING","WI-FI","CLI"])+
  `<div class="v421-topology"><span>🖥️ Endpoint</span><i></i><span>🔀 Switch</span><i></i><span>🧭 Router</span><i></i><span>🛡️ Firewall</span><i></i><span>☁️ Internet</span></div>
   <div class="v421-grid">
    <article class="v421-card"><h3>Verification sequence</h3><div class="v421-list"><div>1. Check physical link and NIC state.</div><div>2. Read IP, subnet, gateway and DNS.</div><div>3. Ping local gateway.</div><div>4. Test external IP reachability.</div><div>5. Test DNS resolution.</div><div>6. Trace the route when needed.</div></div></article>
    <article class="v421-card"><h3>Commands that provide evidence</h3><div class="v421-list"><div>ipconfig /all</div><div>ping</div><div>nslookup</div><div>tracert</div><div>release / renew</div><div>flushdns</div></div></article>
   </div>`+moduleCards(rows)+
   actions([["professional-lab.html?lab=10","Build LAN"],["professional-lab.html?lab=12","Switch & VLAN"],["professional-lab.html?lab=13","Routing"],["professional-lab.html?lab=15","CLI Troubleshooting"]])
 )
}
function openSupport(){
 const rows=modules.filter(m=>["support","print"].includes(m.track));
 const flow=[["01","Receive","Understand impact and symptom."],["02","Clarify","Define scope with useful questions."],["03","Diagnose","Test likely causes logically."],["04","Fix","Apply the safest relevant action."],["05","Verify","Prove service is working."],["06","Document","Record root cause and result."]];
 openWorkspace("IT Support Operations","Work through incidents like a junior support technician.","SERVICE DESK",
  hero("🎧","Professional support workflow","Good support is a repeatable process, not random clicking.",["INCIDENT","REQUEST","REMOTE SUPPORT","PRINTER","TICKET NOTES"])+
  `<div class="v421-flow">${flow.map(x=>`<article><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></article>`).join("")}</div>
   <div class="v421-grid">
    <article class="v421-card"><h3>Ticket closure structure</h3><div class="v421-list"><div>Issue</div><div>Scope</div><div>Checks performed</div><div>Root cause</div><div>Resolution</div><div>Verification</div></div></article>
    <article class="v421-card"><h3>Remote support standards</h3><div class="v421-list"><div>Get permission first.</div><div>User enters passwords themselves.</div><div>Explain restarts before doing them.</div><div>Disconnect when complete.</div><div>Document the result.</div></div></article>
   </div>`+moduleCards(rows)+
   actions([["professional-lab.html?lab=16","🎫 Help Desk Ticket Lab"],["professional-lab.html?lab=17","🖥️ Remote Support Lab"],["professional-lab.html?lab=7","🖨️ Printer Fault Lab"]])
 )
}
function openMicrosoft(){
 const rows=modules.filter(m=>m.track==="m365");
 openWorkspace("Microsoft 365 & Cloud","Support Outlook, email flow, identity and collaboration.","MICROSOFT & CLOUD",
  hero("☁️","Outlook • Email • Microsoft 365","Understand the support path from account and connectivity to mailbox behavior and collaboration.",["OUTLOOK","SMTP","IMAP","MFA","ONEDRIVE","TEAMS","SAAS"])+
  `<div class="v421-grid">
    <article class="v421-card"><h3>Outlook troubleshooting path</h3><div class="v421-list"><div>Check account/service state.</div><div>Verify connectivity.</div><div>Confirm profile/mailbox behavior.</div><div>Check authentication/MFA.</div><div>Inspect rules, Outbox and message-size symptoms.</div><div>Verify send/receive.</div></div></article>
    <article class="v421-card"><h3>Email protocol roles</h3><div class="v421-list"><div><b>SMTP</b> — sending mail.</div><div><b>IMAP</b> — syncing mailbox folders.</div><div><b>TLS</b> — protects communication in transit.</div><div><b>MFA</b> — adds another authentication factor.</div></div></article>
   </div>`+moduleCards(rows)+
   actions([["professional-lab.html?lab=8","📧 Outlook Lab"],["professional-lab.html?lab=9","✉️ Email Protocol Lab"]])
 )
}
function openAI(){
 const rows=modules.filter(m=>m.track==="ai");
 openWorkspace("AI for IT Work","Use AI as an assistant, not an unverified authority.","AI OPERATIONS",
  hero("🤖","Prompt → Verify → Troubleshoot → Document","Use AI for structured technical work while protecting private information and validating every recommendation.",["PROMPT DESIGN","PRIVACY","VERIFICATION","SOP","TICKET SUMMARY"])+
  `<div class="v421-grid">
    <article class="v421-card"><h3>Safe technical prompt pattern</h3><div class="v421-list"><div>Role/context</div><div>Symptom</div><div>Known non-sensitive facts</div><div>Safe/reversible first checks</div><div>Verification method</div></div></article>
    <article class="v421-card"><h3>Human verification rule</h3><div class="v421-list"><div>Never paste passwords or OTPs.</div><div>Check commands before applying them.</div><div>Prefer official documentation for critical changes.</div><div>Document what was tested, not just what AI suggested.</div></div></article>
   </div>`+moduleCards(rows)+actions([["professional-lab.html?lab=19","🤖 AI for IT Support Lab"]])
 )
}
function openProjects(){
 const c=currentClass(),rows=projectMap[c]||projectMap[7];
 openWorkspace(`Class ${c} Project Portfolio`,"Build reviewable evidence of technical ability.","PROJECT PIPELINE",
  hero("🗂️","Technician-style project evidence","Each project should produce something reviewable: a diagram, report, plan, ticket note, SOP or verified lab result.",[`CLASS ${c}`,"EVIDENCE","DOCUMENTATION","PRACTICAL RESULT"])+
  `<div class="v421-projects">${rows.map(([icon,title,desc,href])=>`<article class="v421-project"><span>${icon}</span><b>${esc(title)}</b><small>${esc(desc)}</small><a href="${href}">Open project lab →</a></article>`).join("")}</div>
   <article class="v421-card" style="margin-top:13px"><h3>Professional evidence checklist</h3><div class="v421-list"><div>State the goal or fault clearly.</div><div>Show configuration or troubleshooting steps.</div><div>Include proof of verification.</div><div>Write a short handover or conclusion.</div></div></article>`
 )
}
function openToolkit(){
 openWorkspace("Technician Toolkit","Know what each command or tool proves.","TOOLS & COMMANDS",
  hero("🧰","Use tools to collect evidence","A command is useful only when you understand the question it answers.",["CLI","DEVICE MANAGER","PRINT PORTS","OUTLOOK","REMOTE SUPPORT","DOCUMENTATION"])+
  `<div class="v421-command-grid">${commandData.map(x=>`<article class="v421-command"><code>${esc(x[0])}</code><p>${esc(x[1])}</p></article>`).join("")}</div>`+
  actions([["professional-lab.html?lab=15","⌨️ CLI Troubleshooting Lab"]])
 )
}
function openCareer(){
 openWorkspace("Technology Career Pathways","See how today's skills connect to real technical roles.","CAREER ORIENTATION",
  hero("🧭","Build foundations now, specialize later","The program builds transferable support, infrastructure and troubleshooting skills before specialization.",["NETWORK SUPPORT","IT SUPPORT","CLOUD SUPPORT","AI-ASSISTED SUPPORT"])+
  `<div class="v421-projects">${careerData.map(x=>`<article class="v421-project"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></article>`).join("")}</div>
   <article class="v421-card" style="margin-top:13px"><h3>Class progression</h3><div class="v421-list"><div><b>Class 7:</b> explore systems and understand how technology works.</div><div><b>Class 8:</b> install and configure common services.</div><div><b>Class 9:</b> troubleshoot faults and support users.</div><div><b>Class 10:</b> build, network, solve and complete a capstone.</div></div></article>`
 )
}
function openPassport(){
 const m=metrics(),c=currentClass();
 openWorkspace("Professional Skill Passport","Practical evidence and certification readiness.","SKILL EVIDENCE",
  hero("🛂","Certification is built from evidence","Monthly exams, required tests, practical labs and the Class 10 capstone contribute to final certification.",[`CLASS ${c}`,"EXAMS","TESTS","LABS","CAPSTONE"])+
  `<div class="v421-grid">
    <article class="v421-card"><h3>Current practical record</h3><div class="v421-list"><div><b>${m.passed}/20</b> labs passed</div><div><b>${m.avg}%</b> saved lab average</div><div><b>${m.xp}</b> Tech XP</div><div><b>${m.capstone?"PASSED":"LOCKED"}</b> capstone</div></div></article>
    <article class="v421-card"><h3>Mandatory certification gates</h3><div class="v421-list"><div>Monthly Exam 1 — pass required</div><div>Monthly Exam 2 — pass required</div><div>Monthly Exam 3 — pass required</div><div>Required tests — complete/pass</div><div>Required practical labs — complete</div>${c===10?"<div>Class 10 capstone — pass required</div>":""}</div></article>
   </div>`+
  actions([["student-exams.html","📝 Open Exam Center"],["final-certificate.html","🏆 Certificate Progress"],["professional-lab.html","🧪 Practical Labs"]])
 )
}
function openStage(stage){
 const info={
 7:["Explore & Understand","Strong foundations in hardware, Windows, LAN, email and safe AI."],
 8:["Install & Configure","Drivers, printers, Outlook, VLANs, Wi-Fi and service configuration."],
 9:["Troubleshoot & Support","CLI, printer faults, support tickets, security and remote assistance."],
 10:["Build, Network & Solve","Small-office design, integrated projects, capstone and handover."]
 }[stage];
 const rows=modules.filter(m=>m.min<=stage);
 openWorkspace(`Class ${stage} • ${info[0]}`,info[1],"CLASS PROGRESSION",
  hero(stage===10?"🔟":stage+"️⃣",info[0],info[1],[`${rows.length} MODULES AVAILABLE`,"TECHNOLOGY ONLY","PRACTICAL LEARNING"])+moduleCards(rows)
 )
}
function routeKind(kind){
 if(kind==="tracks")return openTracks();
 if(kind==="network")return openNetwork();
 if(kind==="support")return openSupport();
 if(kind==="microsoft")return openMicrosoft();
 if(kind==="ai")return openAI();
 if(kind==="projects")return openProjects();
 if(kind==="toolkit")return openToolkit();
 if(kind==="career")return openCareer();
 if(kind==="passport")return openPassport();
}

/* Add three useful upgrade cards to the live dashboard. */
function injectProfessionalSuggestions(){
 if(document.getElementById("v421Enhancements")) return;
 const target=document.querySelector(".passport-block")||document.querySelector(".section-block:last-of-type");
 if(!target)return;
 const s=document.createElement("section");
 s.id="v421Enhancements";
 s.className="section-block";
 s.innerHTML=`
  <div class="section-title-row"><div><span class="section-kicker">PROFESSIONAL ENHANCEMENTS</span><h2>Extra tools for serious technology learning</h2><p>These areas connect classroom learning to real technician workflow and future career direction.</p></div></div>
  <div class="track-grid">
    <button class="track-card" type="button" data-v421-kind="toolkit" style="--accent:#1aa39a"><span>🧰</span><h3>Troubleshooting Toolkit</h3><p>Commands, Device Manager, print ports, remote support and evidence gathering.</p><small>OPEN FULL WORKSPACE →</small></button>
    <button class="track-card" type="button" data-v421-kind="career" style="--accent:#3977cb"><span>🧭</span><h3>Career Pathways</h3><p>See how networking, support, cloud and AI skills connect to future roles.</p><small>OPEN FULL WORKSPACE →</small></button>
    <button class="track-card" type="button" data-v421-kind="passport" style="--accent:#7b5bd7"><span>🛂</span><h3>Skill Evidence</h3><p>Review labs, exams, capstone status and certification gates in one place.</p><small>OPEN FULL WORKSPACE →</small></button>
  </div>`;
 target.parentNode.insertBefore(s,target);
 s.querySelectorAll("[data-v421-kind]").forEach(b=>b.onclick=()=>routeKind(b.dataset.v421Kind))
}

/* Capture old in-page anchors and replace with full-screen workspace. */
document.addEventListener("click",e=>{
 const a=e.target.closest('a[href^="#"]');
 if(a){
   const href=a.getAttribute("href");
   const map={"#tracks":"tracks","#network-zone":"network","#support-zone":"support","#projects":"projects","#modules":"ai"};
   if(map[href]){
     e.preventDefault();e.stopImmediatePropagation();routeKind(map[href]);return;
   }
 }
 const moduleBtn=e.target.closest("[data-module]");
 if(moduleBtn){
   e.preventDefault();e.stopImmediatePropagation();
   openModule(Number(moduleBtn.dataset.module));return;
 }
 const trackCard=e.target.closest(".track-card");
 if(trackCard && trackCard.closest("#trackGrid")){
   e.preventDefault();e.stopImmediatePropagation();
   const title=(trackCard.querySelector("h3")?.textContent||"").trim();
   const t=tracks.find(x=>x.title===title);
   if(t)openTrack(t.id);
 }
},true);

/* Make visual sections clickable, while preserving their real lab links. */
function bindSectionCards(){
 const pairs=[
  [".microsoft-card","microsoft"],
  [".ai-card","ai"],
  [".toolkit-panel","toolkit"],
  [".mission-panel","projects"]
 ];
 pairs.forEach(([sel,kind])=>{
   const el=document.querySelector(sel);if(!el||el.dataset.v421Bound)return;
   el.dataset.v421Bound="1";el.style.cursor="pointer";
   el.addEventListener("click",e=>{
     if(e.target.closest("a,button"))return;
     routeKind(kind);
   });
 });
 document.querySelectorAll(".stage-rail article").forEach(card=>{
   if(card.dataset.v421Bound)return;
   card.dataset.v421Bound="1";card.style.cursor="pointer";
   card.addEventListener("click",()=>openStage(Number(card.dataset.stage)))
 });
}

/* Top bar Skill Passport can also use workspace instead of jumping straight away. */
function bindTop(){
 const tracksLink=[...document.querySelectorAll(".top-link")].find(x=>/Tracks/i.test(x.textContent||""));
 if(tracksLink){tracksLink.addEventListener("click",e=>{e.preventDefault();openTracks()},true)}
 const skill=[...document.querySelectorAll(".top-link")].find(x=>/Skill Passport/i.test(x.textContent||""));
 if(skill){skill.addEventListener("click",e=>{e.preventDefault();openPassport()},true)}
}

/* Wait until V42.0 has rendered dynamic cards, then bind. */
function init(){
 ensureWorkspace();
 injectProfessionalSuggestions();
 bindSectionCards();
 bindTop();
 let tries=0;
 const timer=setInterval(()=>{
   tries++;
   bindSectionCards();
   if(document.querySelectorAll("#trackGrid .track-card").length || tries>30){
     if(tries>30)clearInterval(timer)
   }
 },150);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();

})();
