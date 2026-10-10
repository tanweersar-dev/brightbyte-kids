(() => {
"use strict";
const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const $=id=>document.getElementById(id);
let profile=null;

const worlds=[
{id:1,cat:"hardware",icon:"🧠",accent:"#6557ef",title:"Computer Hardware",desc:"CPU, RAM, SSD, NVMe, motherboard, SMPS, ports, compatibility and safe diagnosis.",levels:"7–10",lessons:["Identify core PC parts","Understand component roles","Compare RAM/SSD interfaces","Diagnose no-power/no-display basics"]},
{id:2,cat:"hardware",icon:"🧩",accent:"#7d5ce8",title:"PC Assembly & Upgrade",desc:"Build a virtual PC, choose compatible upgrades and verify a clean handover.",levels:"7–10",lessons:["Assembly sequence","RAM & storage upgrade","Compatibility checks","Post-upgrade verification"]},
{id:3,cat:"windows",icon:"🪟",accent:"#3e8df6",title:"Windows Installation",desc:"Boot media, BIOS/UEFI, partitions, setup, updates, recovery and safe upgrade planning.",levels:"8–10",lessons:["Boot process","Install flow","Driver/update checklist","Recovery choices"]},
{id:4,cat:"windows",icon:"🧰",accent:"#39a0e8",title:"Drivers & Device Manager",desc:"Unknown devices, yellow warnings, update/rollback and Hardware ID concepts.",levels:"7–10",lessons:["Read Device Manager","Driver update","Rollback","Unknown-device workflow"]},
{id:5,cat:"printer",icon:"🖨️",accent:"#ed8d45",title:"Printer Installation",desc:"USB/network printer, TCP/IP port, drivers, default printer and test page.",levels:"7–10",lessons:["USB install","Network printer","TCP/IP port","Test page"]},
{id:6,cat:"printer",icon:"📠",accent:"#e96f54",title:"Printer & Scanner Support",desc:"Offline status, stuck queue, changed IP, scan setup and logical troubleshooting.",levels:"8–10",lessons:["Offline checks","Queue/spooler","Driver/port","Scanner path"]},
{id:7,cat:"m365",icon:"📧",accent:"#2a80d7",title:"Outlook 365",desc:"Profiles, mailbox, signature, rules, automatic replies, calendar and safe attachments.",levels:"7–10",lessons:["Mailbox basics","Rules/signature","Automatic reply","Troubleshooting"]},
{id:8,cat:"m365",icon:"✉️",accent:"#4576d7",title:"Email Configuration",desc:"IMAP, POP3, SMTP, SSL/TLS, MFA concepts and common send/receive issues.",levels:"8–10",lessons:["Mail flow","IMAP vs POP3","SMTP","Authentication troubleshooting"]},
{id:9,cat:"m365",icon:"☁️",accent:"#4a91d7",title:"Microsoft 365 & Cloud",desc:"OneDrive, Teams, Word/Excel collaboration, accounts and cloud-service basics.",levels:"7–10",lessons:["Cloud vs local","OneDrive","Teams","SaaS & identity"]},
{id:10,cat:"network",icon:"🌐",accent:"#1fae9b",title:"LAN Fundamentals",desc:"NIC, MAC, IP, subnet, gateway, DNS, DHCP, Ethernet and network flow.",levels:"7–10",lessons:["LAN components","IP basics","Gateway/DNS","DHCP"]},
{id:11,cat:"network",icon:"🔀",accent:"#18a884",title:"Basic Switching",desc:"Switch ports, MAC learning, access ports and beginner VLAN concepts.",levels:"8–10",lessons:["Switch role","MAC table","Access ports","VLAN idea"]},
{id:12,cat:"network",icon:"🧭",accent:"#1f9b8a",title:"Basic Routing",desc:"Routers, default gateway, routing table and simple static-route concepts.",levels:"8–10",lessons:["Router role","Gateway","Routing table","Static route concept"]},
{id:13,cat:"network",icon:"🌍",accent:"#1e8e9f",title:"LAN / WAN / Internet",desc:"ISP, ONT/modem, router/firewall, switches, APs and end-user paths.",levels:"7–10",lessons:["LAN vs WAN","Internet path","Office topology","Failure domains"]},
{id:14,cat:"network",icon:"📶",accent:"#218bb8",title:"Wi-Fi & Wireless",desc:"SSID, 2.4/5 GHz, WPA2/WPA3, signal, interference and AP placement.",levels:"7–10",lessons:["Wireless basics","Bands","Security","Coverage"]},
{id:15,cat:"network",icon:"⌨️",accent:"#2a76b6",title:"Network Command Lab",desc:"ipconfig, ping, tracert, nslookup, release/renew and DNS troubleshooting.",levels:"8–10",lessons:["Read IP config","Ping logic","Trace path","DNS tests"]},
{id:16,cat:"support",icon:"🎧",accent:"#7b58cf",title:"IT Help Desk",desc:"Receive, clarify, diagnose, fix, verify, document, close or escalate.",levels:"7–10",lessons:["Ask good questions","Troubleshooting order","Verification","Ticket closure"]},
{id:17,cat:"support",icon:"🖥️",accent:"#7156c8",title:"Remote Support",desc:"Consent, privacy, Quick Assist style workflow and professional communication.",levels:"8–10",lessons:["Permission","Safe remote flow","User communication","Disconnect & document"]},
{id:18,cat:"cyber",icon:"🛡️",accent:"#d05277",title:"Cybersecurity Essentials",desc:"Phishing, MFA, passkeys, malware awareness, backups and social engineering.",levels:"7–10",lessons:["Account safety","Phishing","Updates/backups","Incident reporting"]},
{id:19,cat:"ai",icon:"🤖",accent:"#a14fd3",title:"AI Skills",desc:"Prompt design, research, hallucination checks, privacy and responsible use.",levels:"7–10",lessons:["Prompt structure","Verification","Privacy","Responsible AI"]},
{id:20,cat:"ai",icon:"✨",accent:"#9b58e8",title:"AI for IT Support",desc:"Create troubleshooting checklists, ticket summaries and SOP drafts — then verify.",levels:"8–10",lessons:["Support prompts","SOP drafts","Log explanation","Human verification"]},
{id:21,cat:"web",icon:"🧩",accent:"#ef5d9f",title:"No-Code Website Studio",desc:"Plan, design, build and publish a student IT portfolio without mandatory coding.",levels:"7–10",lessons:["Site plan","Pages/navigation","Responsive preview","Publish safely"]},
{id:22,cat:"web",icon:"🔗",accent:"#dd659a",title:"Web & DNS Basics",desc:"Domain, hosting, URL, HTTP/HTTPS, DNS and browser/server concepts.",levels:"8–10",lessons:["Domain/hosting","DNS","HTTPS","Browser/server flow"]},
{id:23,cat:"support",icon:"📋",accent:"#e5a02e",title:"IT Documentation & Inventory",desc:"Asset records, network diagrams, SOPs, handover notes and change history.",levels:"8–10",lessons:["Inventory","SOP structure","Network diagram","Handover"]},
{id:24,cat:"support",icon:"🏆",accent:"#d7a431",title:"Capstone & Career Skills",desc:"Combine support, network, printer, Outlook, AI and documentation in a final project.",levels:"10",lessons:["Small-office build","Fault diagnosis","Support report","Final verification"]}
];

const missions=[
"🧠 Identify one hardware component",
"🌐 Run a network diagnosis",
"🖨️ Solve a printer scenario",
"📧 Explain an Outlook issue",
"🤖 Improve an AI prompt",
"🛡️ Spot a phishing clue",
"📋 Write a support note",
"🧩 Improve a web page plan"
];

function labKey(){return `tannu_professional_it_lab_v41_${profile?.user_id||profile?.username||"student"}`;}
function loadLabState(){try{return JSON.parse(localStorage.getItem(labKey())||"{}")||{}}catch{return{}}}
function renderStats(){
 const s=loadLabState(),scores=s.scores&&typeof s.scores==="object"?s.scores:{};
 const completed=Object.keys(scores).filter(k=>Number(scores[k])>=60).length;
 $("labCount").textContent=completed;
 $("skillCount").textContent=Math.min(24,completed+Number(s.worldsCompleted||0));
 $("xpCount").textContent=Number(s.xp||completed*25);
 $("projectCount").textContent=Number(s.capstoneComplete?1:0);
}
function renderMissions(){
 const day=Math.floor(Date.now()/86400000);
 $("dailyMissions").innerHTML=[0,1,2,3].map(i=>`<span>${missions[(day+i*2)%missions.length]}</span>`).join("");
}
function renderWorlds(filter="all"){
 const rows=worlds.filter(w=>filter==="all"||w.cat===filter);
 $("worldGrid").innerHTML=rows.map(w=>`<article class="world-card" style="--accent:${w.accent}"><div class="world-icon">${w.icon}</div><h3>${w.title}</h3><p>${w.desc}</p><div class="world-meta"><span>CLASS ${w.levels}</span><span>${w.lessons.length} CORE TOPICS</span></div><button type="button" data-world="${w.id}">Open World →</button></article>`).join("");
 document.querySelectorAll("[data-world]").forEach(b=>b.onclick=()=>openWorld(Number(b.dataset.world)));
}
function openWorld(id){
 const w=worlds.find(x=>x.id===id); if(!w)return;
 $("modalBody").innerHTML=`<span class="eyebrow dark">${w.icon} ${w.title.toUpperCase()}</span><h2>${w.title}</h2><p>${w.desc}</p><div class="modal-lessons">${w.lessons.map((x,i)=>`<div><b>${i+1}. ${x}</b><br><small>Learn the concept, practise it, troubleshoot a scenario, then verify your result.</small></div>`).join("")}</div><div class="modal-actions"><a class="primary" href="professional-lab.html?lab=${Math.min(20,Math.max(1,id))}">🧪 Open Related Lab</a><a class="soft-btn" href="student-exams.html">📝 Exam Center</a></div>`;
 $("modal").classList.add("open");$("modal").setAttribute("aria-hidden","false");
}
async function boot(){
 if(!TOKEN){location.href="student-login.html";return}
 try{
  const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"});
  const d=await r.json();
  if(!r.ok||d.role!=="student"||!d.profile)throw new Error("Student login required");
  profile=d.profile; const c=Number(profile.class_number||0);
  if(c<7||c>10){location.href=c<=3?"foundation-universe.html":"advanced-universe.html";return}
  $("studentChip").textContent=`👤 ${profile.display_name||profile.username||"Student"}`;
  $("classChip").textContent=`🎓 Class ${c}`;
  renderStats();renderMissions();renderWorlds();
 }catch{localStorage.removeItem("brightbyte_student_token");location.href="student-login.html"}
}
document.querySelectorAll(".learning-nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".learning-nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderWorlds(b.dataset.filter)});
$("modalClose").onclick=()=>{$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")};
$("modal").onclick=e=>{if(e.target===$("modal"))$("modalClose").click()};
$("logoutBtn").onclick=()=>{localStorage.removeItem("brightbyte_student_token");location.href="student-login.html"};
window.addEventListener("pageshow",renderStats);
boot();
})();
