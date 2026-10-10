(() => {
"use strict";
const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let profile=null;
let currentLab=1;
let selectedNode=null;
let connectMode=false;
let connectSource=null;
let hintCount=0;
let attemptMistakes=0;
let activity={nodes:[],links:[],answers:{},notes:"",tests:[],configured:[]};

const labs=[
{id:1,icon:"🧠",min:7,title:"Hardware Identification",desc:"Identify PC parts, ports and their roles.",type:"scenario",devices:["desktop","motherboard","ram","ssd","psu"],tasks:["Identify RAM","Identify storage","Identify power supply","Explain one safe hardware rule"],choices:[["Which part temporarily holds active data?","RAM","SSD","PSU"],["Which part stores files after shutdown?","SSD","RAM","CPU fan"],["Which part supplies power to the PC?","PSU / SMPS","RAM","Keyboard"],["Safe first step before a supervised internal hardware task?","Shut down and disconnect power","Remove RAM while running","Open the PSU"]],correct:[0,0,0,0]},
{id:2,icon:"🧩",min:7,title:"PC Assembly & Upgrade",desc:"Choose sensible compatible upgrades and verify them.",type:"scenario",devices:["desktop","ram","ssd","motherboard"],tasks:["Choose a RAM upgrade","Choose an SSD upgrade","Verify compatibility","Plan post-upgrade test"],choices:[["An office PC has 4 GB RAM and is slow with many apps. Best first upgrade?","Increase compatible RAM","Replace monitor","Change mouse"],["HDD is slow. Which common upgrade improves storage performance?","SSD","New keyboard","Printer cable"],["Before buying RAM, what matters?","Supported RAM type/capacity","Wallpaper","Printer model"],["After upgrade, what should you do?","Boot and verify hardware/OS stability","Assume it works","Delete drivers"]],correct:[0,0,0,0]},
{id:3,icon:"🧬",min:8,title:"BIOS / UEFI & Boot",desc:"Understand boot order, detected drives and safe startup choices.",type:"scenario",devices:["desktop","usb","ssd"],tasks:["Select safe boot source","Check detected storage","Explain boot order","Avoid destructive changes"],choices:[["To start an approved installer from USB, what may need changing?","Boot order / boot menu","Email signature","Printer queue"],["New SSD is not visible in BIOS/UEFI. What should you check first?","Physical/slot detection and compatibility","DNS","Outlook rules"],["What is boot order?","The sequence firmware checks boot devices","Printer job order","Email priority"],["Best learning approach in firmware?","Change only known settings and document them","Change everything","Disable security randomly"]],correct:[0,0,0,0]},
{id:4,icon:"🪟",min:8,title:"Windows Installation & Recovery",desc:"Plan install, drivers, updates and recovery without risking user data.",type:"scenario",devices:["desktop","usb","ssd"],tasks:["Back up important data","Choose install path","Plan drivers/updates","Choose recovery option"],choices:[["Before a clean install, what is essential?","Back up important data","Delete backups","Share passwords"],["After Windows install, what should you verify?","Drivers, updates, network and apps","Only wallpaper","Printer paper"],["A recent change causes startup trouble. A reversible option may be?","Startup Repair/restore depending on situation","Format immediately","Delete user files"],["Upgrade or clean install should be chosen based on?","Compatibility, requirements and backup plan","Random choice","Screen color"]],correct:[0,0,0,0]},
{id:5,icon:"🧰",min:7,title:"Drivers & Device Manager",desc:"Investigate unknown devices and driver issues.",type:"scenario",devices:["desktop","nic","audio"],tasks:["Find warning device","Choose driver action","Use rollback safely","Document result"],choices:[["Yellow warning in Device Manager usually means?","Device/driver needs attention","Monitor too bright","Printer has paper"],["A new driver breaks audio. What can help?","Rollback driver","Delete Windows","Change DNS"],["Unknown device needs identification. What can help at advanced level?","Hardware ID and official vendor documentation","Guessing","Random downloads"],["After driver fix?","Restart if required and verify device","Close without testing","Disable updates forever"]],correct:[0,0,0,0]},
{id:6,icon:"🖨️",min:7,title:"Printer Installation",desc:"Install USB/network printers, ports and drivers.",type:"network",devices:["pc","switch","printer"],tasks:["Add PC","Add printer","Connect both through switch","Configure same-subnet IPs","Run Test Network"],verify:"printer"},
{id:7,icon:"📠",min:8,title:"Printer & Scanner Troubleshooting",desc:"Solve offline, wrong port, queue and scanner problems.",type:"scenario",devices:["pc","printer"],tasks:["Identify likely cause","Check connection/IP","Check driver/port/queue","Verify with test page"],choices:[["Printer responds to ping but jobs do not print. Next check?","Queue, driver and TCP/IP port","Replace router","Format PC"],["Printer IP changed but PC still uses old port. Fix?","Update/recreate TCP/IP port","Change wallpaper","Delete email"],["Queue has a stuck job. What can you inspect?","Print queue/spooler","BIOS fan speed","DNS zone"],["After fix?","Print test page and confirm with user","Assume success","Remove printer"]],correct:[0,0,0,0]},
{id:8,icon:"📧",min:7,title:"Outlook 365 Configuration",desc:"Practice mailbox, signature, rules and automatic reply concepts.",type:"scenario",devices:["pc","cloud"],tasks:["Choose profile/account flow","Create safe signature","Choose automatic reply","Use rule correctly"],choices:[["Automatic reply is useful when?","You are away/unavailable","Installing RAM","Configuring VLAN"],["A rule can help?","Organize mail by condition","Install Windows","Fix hardware"],["Should support ask user to tell you their password?","No","Yes","Always"],["Large attachment stuck in Outbox: first think about?","Connectivity/message size/account status","RAM color","Printer paper"]],correct:[0,0,0,0]},
{id:9,icon:"✉️",min:8,title:"Email Protocol & Troubleshooting",desc:"Understand IMAP, SMTP, authentication and send/receive paths.",type:"scenario",devices:["pc","cloud"],tasks:["Identify SMTP","Identify IMAP","Recognize MFA/auth issue","Verify send/receive"],choices:[["Protocol commonly used to send mail?","SMTP","DHCP","VLAN"],["Protocol commonly used to sync mailbox folders?","IMAP","HDMI","ARP only"],["Repeated password prompt after security change may involve?","Authentication/MFA/account state","Printer toner","RAM slot"],["Good final verification?","Send and receive a safe test message","Share password","Disable security"]],correct:[0,0,0,0]},
{id:10,icon:"🌐",min:7,title:"LAN Cabling & Network Build",desc:"Build PC → Switch → Router and test connectivity.",type:"network",devices:["pc","pc","switch","router"],tasks:["Add two PCs","Add a switch","Add a router","Connect topology","Configure valid IP/gateway","Run Test Network"],verify:"lan"},
{id:11,icon:"🔢",min:7,title:"IP Addressing & DHCP",desc:"Configure IP, subnet, gateway and understand 169.254.x.x.",type:"network",devices:["pc","switch","router"],tasks:["Add PC/switch/router","Connect topology","Configure PC IP","Configure gateway","Run ipconfig","Test gateway"],verify:"ip"},
{id:12,icon:"🔀",min:8,title:"Basic Switching & VLAN",desc:"Explore MAC learning and beginner VLAN separation.",type:"network",devices:["pc","pc","switch"],tasks:["Add two PCs and switch","Connect both PCs","Set VLAN labels","Run show vlan brief","Explain isolation"],verify:"switch"},
{id:13,icon:"🧭",min:8,title:"Basic Routing",desc:"Connect two networks through a router.",type:"network",devices:["pc","pc","switch","switch","router"],tasks:["Build two LAN sides","Configure different IP networks","Set gateways","Run show ip route","Test between networks"],verify:"routing"},
{id:14,icon:"📶",min:7,title:"Wi-Fi & Access Point",desc:"Choose secure Wi-Fi settings and sensible AP placement.",type:"scenario",devices:["laptop","ap","router"],tasks:["Choose WPA2/WPA3","Choose band wisely","Place AP centrally","Plan guest Wi-Fi"],choices:[["Preferred security for a normal modern Wi-Fi lab?","WPA2/WPA3","Open network","No password"],["2.4 GHz often offers?","Longer reach but more interference","No range","Only wired access"],["For coverage, AP should generally be?","Placed sensibly/centrally away from major obstructions","Inside a metal box","Powered off"],["Guest devices should ideally use?","A separated guest network when available","Admin network with shared password","No security"]],correct:[0,0,0,0]},
{id:15,icon:"⌨️",min:8,title:"Network Troubleshooting CLI",desc:"Use ipconfig, ping, tracert, nslookup, renew and flushdns.",type:"network",devices:["pc","switch","router","cloud"],tasks:["Build PC path","Run ipconfig","Ping gateway","Ping external IP","Run nslookup","Use tracert"],verify:"cli"},
{id:16,icon:"🎧",min:7,title:"IT Help Desk Ticket",desc:"Receive → Clarify → Diagnose → Fix → Verify → Document.",type:"scenario",devices:["pc","printer","router"],tasks:["Ask clarifying question","Choose logical first check","Verify fix","Write closure note"],choices:[["User says internet is down. Best first question?","Is it one device or several?","What is your OTP?","Can I delete your files?"],["Before major changes?","Check simple relevant causes first","Change everything","Format PC"],["After fix?","Ask user to verify","Close immediately","Delete notes"],["Good ticket note contains?","Symptom, checks, fix and verification","Only 'done'","Passwords"]],correct:[0,0,0,0]},
{id:17,icon:"🖥️",min:8,title:"Remote Support",desc:"Consent, privacy and professional communication.",type:"scenario",devices:["pc","laptop"],tasks:["Get consent","Protect credentials","Explain action","Disconnect and document"],choices:[["Before remote session?","Get user permission","Ask for OTP","Hide what you do"],["During password prompt?","Ask user to enter it themselves","Ask them to send password","Record it"],["Before restart?","Tell user to save work","Restart without warning","Delete files"],["When finished?","Disconnect and document result","Leave session open","Keep access secretly"]],correct:[0,0,0,0]},
{id:18,icon:"🛡️",min:7,title:"Cybersecurity Incident",desc:"Recognize phishing and follow safe incident response.",type:"scenario",devices:["pc","mail","shield"],tasks:["Recognize suspicious message","Stop further interaction","Report/escalate","Protect account/device safely"],choices:[["Unexpected login link asks for password urgently. Best response?","Do not use it; verify/report","Enter password quickly","Forward to everyone"],["User clicked suspicious link. First principle?","Stop further interaction and report/escalate","Hide it","Delete logs"],["MFA helps because?","A stolen password alone may not be enough","It replaces backups","It makes phishing impossible"],["Incident details should be?","Documented according to approved process","Hidden","Posted publicly"]],correct:[0,0,0,0]},
{id:19,icon:"🤖",min:7,title:"AI for IT Support + No-Code Web",desc:"Use AI safely, verify output and plan a no-code portfolio.",type:"scenario",devices:["pc","ai","web"],tasks:["Write privacy-safe prompt","Verify AI answer","Plan site pages","Check privacy before publish"],choices:[["Good AI support prompt includes?","Symptom, context and safe checks already tried","Passwords","Only 'fix it'"],["Important AI suggestion should be?","Verified and tested safely","Executed blindly","Shared as fact"],["Useful portfolio sections?","Home, About, Skills, Projects, Contact","Passwords, OTPs, home address","Only blank pages"],["Before publishing?","Check privacy, links and mobile layout","Publish secrets","Disable HTTPS"]],correct:[0,0,0,0]},
{id:20,icon:"🏆",min:10,title:"Final Junior IT Technician Capstone",desc:"Build a small office, resolve faults and document the handover.",type:"network",devices:["pc","pc","pc","switch","switch","router","printer","ap","cloud"],tasks:["Build small-office topology","Configure IP/gateway","Connect printer","Run connectivity tests","Run CLI checks","Write professional handover note","Complete capstone verification"],verify:"capstone"}
];

const deviceCatalog={
 pc:{label:"PC",icon:"🖥️",ip:"192.168.10.20"},
 laptop:{label:"Laptop",icon:"💻",ip:"192.168.10.30"},
 switch:{label:"Switch",icon:"🔀",ip:""},
 router:{label:"Router",icon:"🧭",ip:"192.168.10.1"},
 printer:{label:"Printer",icon:"🖨️",ip:"192.168.10.50"},
 ap:{label:"Access Point",icon:"📶",ip:"192.168.10.2"},
 cloud:{label:"Internet/Cloud",icon:"☁️",ip:"8.8.8.8"},
 desktop:{label:"Desktop",icon:"🖥️",ip:""},
 motherboard:{label:"Motherboard",icon:"🧩",ip:""},
 ram:{label:"RAM",icon:"🧠",ip:""},
 ssd:{label:"SSD",icon:"💾",ip:""},
 psu:{label:"PSU",icon:"🔌",ip:""},
 usb:{label:"USB Installer",icon:"🔑",ip:""},
 nic:{label:"NIC",icon:"🌐",ip:""},
 audio:{label:"Audio Device",icon:"🔊",ip:""},
 mail:{label:"Email",icon:"✉️",ip:""},
 shield:{label:"Security",icon:"🛡️",ip:""},
 ai:{label:"AI Helper",icon:"🤖",ip:""},
 web:{label:"Website",icon:"🌍",ip:""}
};

function stateKey(){return `tannu_professional_it_lab_v41_${profile?.user_id||profile?.username||"student"}`;}
function loadGlobal(){try{return JSON.parse(localStorage.getItem(stateKey())||"{}")||{}}catch{return{}}}
function saveGlobal(data){localStorage.setItem(stateKey(),JSON.stringify(data))}
function labSaved(id){return loadGlobal().labState?.[id]||null}
function resetActivity(){
 const saved=labSaved(currentLab);
 activity=saved?.activity?JSON.parse(JSON.stringify(saved.activity)):{nodes:[],links:[],answers:{},notes:"",tests:[],configured:[]};
 selectedNode=null;connectMode=false;connectSource=null;hintCount=0;attemptMistakes=0;
}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(window.__pt);window.__pt=setTimeout(()=>$("toast").classList.remove("show"),1900)}
function out(t,cls=""){const d=document.createElement("div");d.className=cls;d.textContent=t;$("terminalOut").appendChild(d);$("terminalOut").scrollTop=$("terminalOut").scrollHeight}
function current(){return labs.find(x=>x.id===currentLab)}
function renderLabList(){
 const g=loadGlobal(),scores=g.scores||{};
 $("labList").innerHTML=labs.map(l=>`<button class="lab-item ${l.id===currentLab?"active":""} ${Number(scores[l.id]||0)>=60?"done":""}" data-lab="${l.id}" type="button"><span>${l.icon}</span><span><b>${l.id}. ${l.title}</b><small>Class ${l.min}+ • ${l.type==="network"?"Interactive Lab":"Guided Scenario"}</small></span><span class="lab-score">${scores[l.id]?scores[l.id]+"%":""}</span></button>`).join("");
 document.querySelectorAll("[data-lab]").forEach(b=>b.onclick=()=>openLab(Number(b.dataset.lab)));
}
function openLab(id){
 const lab=labs.find(x=>x.id===id);if(!lab)return;
 if(profile&&Number(profile.class_number)<lab.min){toast(`This lab is introduced from Class ${lab.min}. You can preview it, but scoring is locked.`)}
 currentLab=id;history.replaceState({lab:id},"",`professional-lab.html?lab=${id}`);
 resetActivity();renderLabList();renderMission();renderCanvas();renderConfig();renderScores(null);
}
function renderMission(){
 const l=current();$("missionLevel").textContent=`LAB ${l.id} • CLASS ${l.min}+`;$("missionTitle").textContent=l.title;$("missionDesc").textContent=l.desc;
 const palette=[...new Set(l.devices)].map(k=>deviceCatalog[k]).filter(Boolean);
 $("devicePalette").innerHTML=[...new Set(l.devices)].map(k=>`<button class="device-tool" type="button" data-device="${k}"><span>${deviceCatalog[k].icon}</span>${deviceCatalog[k].label}</button>`).join("");
 document.querySelectorAll("[data-device]").forEach(b=>b.onclick=()=>addNode(b.dataset.device));
 renderChecklist();
}
function renderChecklist(){
 const l=current();const completed=l.tasks.map((_,i)=>taskDone(i));
 $("checkProgress").textContent=`${completed.filter(Boolean).length}/${l.tasks.length} complete`;
 $("checklist").innerHTML=l.tasks.map((t,i)=>`<div class="check-item ${completed[i]?"done":""}"><span>${completed[i]?"✅":"○"}</span><span>${esc(t)}</span></div>`).join("");
}
function taskDone(i){
 const l=current();
 if(l.type==="scenario") return activity.answers[i]!==undefined;
 const n=activity.nodes.length,links=activity.links.length,tests=activity.tests;
 if(l.id===6) return [n>=1,n>=2,links>=2,activity.configured.length>=2,tests.includes("network")][i]||false;
 if(l.id===10) return [activity.nodes.filter(x=>x.type==="pc").length>=2,activity.nodes.some(x=>x.type==="switch"),activity.nodes.some(x=>x.type==="router"),links>=3,activity.configured.length>=2,tests.includes("network")][i]||false;
 if(l.id===11) return [n>=3,links>=2,activity.configured.length>=1,activity.nodes.some(x=>x.gateway),tests.includes("ipconfig"),tests.includes("gateway")][i]||false;
 if(l.id===12) return [activity.nodes.filter(x=>x.type==="pc").length>=2&&activity.nodes.some(x=>x.type==="switch"),links>=2,activity.nodes.filter(x=>x.vlan).length>=2,tests.includes("vlan"),activity.answers.explain===true][i]||false;
 if(l.id===13) return [n>=5,activity.nodes.filter(x=>x.ip).length>=2,activity.nodes.filter(x=>x.gateway).length>=2,tests.includes("route"),tests.includes("network")][i]||false;
 if(l.id===15) return [n>=3,tests.includes("ipconfig"),tests.includes("gateway"),tests.includes("external"),tests.includes("dns"),tests.includes("trace")][i]||false;
 if(l.id===20) return [n>=7,activity.configured.length>=3,activity.nodes.some(x=>x.type==="printer"),tests.includes("network"),tests.includes("cli"),String(activity.notes||"").trim().length>=25,tests.includes("capstone")][i]||false;
 return false;
}
function addNode(type){
 const idx=activity.nodes.length;const base=deviceCatalog[type];if(!base)return;
 const node={id:`n${Date.now()}${idx}`,type,label:base.label,ip:base.ip||"",mask:"255.255.255.0",gateway:type==="pc"||type==="laptop"||type==="printer"?"192.168.10.1":"",dns:type==="pc"||type==="laptop"?"8.8.8.8":"",vlan:"",x:25+(idx%4)*125,y:40+Math.floor(idx/4)*105};
 activity.nodes.push(node);selectedNode=node.id;renderCanvas();renderConfig();renderChecklist();persistActivity();
}
function nodeById(id){return activity.nodes.find(n=>n.id===id)}
function renderCanvas(){
 const c=$("canvas");c.querySelectorAll(".device-node").forEach(x=>x.remove());
 $("canvasHint").style.display=activity.nodes.length?"none":"block";
 activity.nodes.forEach(n=>{
  const d=document.createElement("button");d.type="button";d.className=`device-node ${selectedNode===n.id?"selected":""} ${connectSource===n.id?"connect-source":""}`;d.dataset.node=n.id;d.style.left=n.x+"px";d.style.top=n.y+"px";d.innerHTML=`<span class="ico">${deviceCatalog[n.type]?.icon||"🔹"}</span><b>${esc(n.label)}</b><small>${esc(n.ip||n.vlan?`${n.ip||""}${n.vlan?` • VLAN ${n.vlan}`:""}`:"Not configured")}</small>`;
  d.onclick=e=>{e.stopPropagation();if(connectMode){handleConnect(n.id);return}selectedNode=n.id;renderCanvas();renderConfig()};
  enableDrag(d,n);c.appendChild(d);
 });
 drawLinks();
}
function enableDrag(el,node){
 let drag=false,ox=0,oy=0;
 el.addEventListener("pointerdown",e=>{if(connectMode)return;drag=true;el.setPointerCapture(e.pointerId);const r=el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top});
 el.addEventListener("pointermove",e=>{if(!drag)return;const r=$("canvas").getBoundingClientRect();node.x=Math.max(0,Math.min(r.width-108,e.clientX-r.left-ox));node.y=Math.max(0,Math.min(r.height-80,e.clientY-r.top-oy));el.style.left=node.x+"px";el.style.top=node.y+"px";drawLinks()});
 el.addEventListener("pointerup",()=>{if(drag){drag=false;persistActivity()}});
}
function handleConnect(id){
 if(!connectSource){connectSource=id;renderCanvas();toast("Now click the second device");return}
 if(connectSource===id){connectSource=null;renderCanvas();return}
 const exists=activity.links.some(x=>[x.a,x.b].includes(connectSource)&&[x.a,x.b].includes(id));
 if(!exists)activity.links.push({a:connectSource,b:id});
 connectSource=null;renderCanvas();renderChecklist();persistActivity();
}
function drawLinks(){
 const svg=$("cableSvg");const r=$("canvas").getBoundingClientRect();svg.setAttribute("viewBox",`0 0 ${r.width} ${r.height}`);
 svg.innerHTML=activity.links.map(l=>{const a=nodeById(l.a),b=nodeById(l.b);if(!a||!b)return"";return`<line class="cable-line" x1="${a.x+52}" y1="${a.y+38}" x2="${b.x+52}" y2="${b.y+38}"/>`}).join("");
}
function renderConfig(){
 const l=current(),body=$("configBody");
 if(l.type==="scenario"){renderScenario(body,l);return}
 const n=nodeById(selectedNode);
 if(!n){body.innerHTML=`<div class="config-section"><h3>Network Lab Instructions</h3><p style="font-size:8px;line-height:1.55;color:#737b97">Add devices, connect them, select a device and configure its network values. Use Terminal commands to inspect and test.</p></div><div class="config-section"><h3>Documentation</h3><div class="field"><label>Support / Lab Notes</label><textarea id="labNotes" placeholder="Write what you checked, changed and verified...">${esc(activity.notes||"")}</textarea></div><button id="saveNotes" class="config-save" type="button">Save Notes</button></div>`;bindNotes();return}
 $("selectedLabel").textContent=`${deviceCatalog[n.type]?.icon||""} ${n.label}`;
 body.innerHTML=`<div class="config-section"><h3>${esc(n.label)} Network Settings</h3><div class="field"><label>Device Label</label><input id="cfgLabel" value="${esc(n.label)}"></div><div class="field"><label>IPv4 Address</label><input id="cfgIp" value="${esc(n.ip||"")}"></div><div class="field"><label>Subnet Mask</label><input id="cfgMask" value="${esc(n.mask||"255.255.255.0")}"></div><div class="field"><label>Default Gateway</label><input id="cfgGw" value="${esc(n.gateway||"")}"></div><div class="field"><label>DNS</label><input id="cfgDns" value="${esc(n.dns||"")}"></div><div class="field"><label>VLAN (optional)</label><input id="cfgVlan" value="${esc(n.vlan||"")}"></div><button id="saveCfg" class="config-save" type="button">💾 Apply Configuration</button></div><div class="config-section"><h3>Documentation</h3><div class="field"><label>Lab Notes</label><textarea id="labNotes">${esc(activity.notes||"")}</textarea></div><button id="saveNotes" class="config-save" type="button">Save Notes</button></div>`;
 $("saveCfg").onclick=()=>{n.label=$("cfgLabel").value.trim()||n.label;n.ip=$("cfgIp").value.trim();n.mask=$("cfgMask").value.trim();n.gateway=$("cfgGw").value.trim();n.dns=$("cfgDns").value.trim();n.vlan=$("cfgVlan").value.trim();if(!activity.configured.includes(n.id))activity.configured.push(n.id);renderCanvas();renderChecklist();persistActivity();toast("Configuration applied")};bindNotes();
}
function bindNotes(){const b=$("saveNotes");if(b)b.onclick=()=>{activity.notes=$("labNotes").value.slice(0,3000);persistActivity();renderChecklist();toast("Notes saved")}}
function renderScenario(body,l){
 $("selectedLabel").textContent="Guided troubleshooting scenario";
 body.innerHTML=l.choices.map((q,i)=>`<div class="config-section"><h3>${i+1}. ${esc(q[0])}</h3><div class="choice-list">${q.slice(1).map((a,j)=>`<button class="choice ${activity.answers[i]===j?"selected":""}" type="button" data-q="${i}" data-a="${j}">${esc(a)}</button>`).join("")}</div></div>`).join("")+`<div class="config-section"><h3>Technician Notes</h3><div class="field"><textarea id="labNotes" placeholder="Write what you learned or how you would explain the solution...">${esc(activity.notes||"")}</textarea></div><button id="saveNotes" class="config-save" type="button">Save Notes</button></div>`;
 body.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{activity.answers[Number(b.dataset.q)]=Number(b.dataset.a);renderConfig();renderChecklist();persistActivity()});bindNotes();
}
function validIp(ip){const p=String(ip||"").split(".").map(Number);return p.length===4&&p.every(x=>Number.isInteger(x)&&x>=0&&x<=255)}
function subnet24(ip){return String(ip||"").split(".").slice(0,3).join(".")}
function connected(a,b){return activity.links.some(l=>(l.a===a&&l.b===b)||(l.a===b&&l.b===a))}
function networkTest(){
 const nodes=activity.nodes;const ips=nodes.filter(n=>validIp(n.ip));
 if(nodes.length<2){out("TEST: Add at least two devices first.","bad");return false}
 const duplicate=ips.find((n,i)=>ips.some((x,j)=>j!==i&&x.ip===n.ip));
 if(duplicate){out(`TEST: Duplicate IP detected: ${duplicate.ip}`,"bad");attemptMistakes++;return false}
 const endpoint=nodes.filter(n=>["pc","laptop","printer"].includes(n.type));
 const router=nodes.find(n=>n.type==="router");
 const basic=endpoint.length&&activity.links.length>=Math.max(1,endpoint.length-1);
 const gwOk=!router||endpoint.filter(n=>validIp(n.ip)).every(n=>!n.gateway||validIp(n.gateway));
 if(basic&&gwOk){out("TEST: Link and basic IP checks passed.","ok");if(!activity.tests.includes("network"))activity.tests.push("network");renderChecklist();persistActivity();return true}
 out("TEST: Topology or IP/gateway configuration still needs work.","bad");attemptMistakes++;return false;
}
function cli(cmd){
 const l=current();const c=cmd.trim();if(!c)return;
 out("> "+c,"info");const low=c.toLowerCase();const first=activity.nodes.find(n=>["pc","laptop"].includes(n.type))||activity.nodes[0];
 if(low==="help"){out("Commands: ipconfig | ping <ip/name> | tracert <target> | nslookup <name> | ipconfig /release | ipconfig /renew | ipconfig /flushdns | show vlan brief | show mac address-table | show ip route | clear","ok");return}
 if(low==="clear"){$("terminalOut").innerHTML="";return}
 if(low==="ipconfig"||low==="ipconfig /all"){out(first?`IPv4 Address: ${first.ip||"169.254.20.15"}\nSubnet Mask: ${first.mask||"255.255.0.0"}\nDefault Gateway: ${first.gateway||"—"}\nDNS: ${first.dns||"—"}`:"No PC available.",first?"ok":"bad");if(!activity.tests.includes("ipconfig"))activity.tests.push("ipconfig");renderChecklist();persistActivity();return}
 if(low.startsWith("ping ")){const target=c.slice(5).trim();if(!first){out("No client device available.","bad");return}let ok=false;if(target===first.gateway&&validIp(target)){ok=true;if(!activity.tests.includes("gateway"))activity.tests.push("gateway")}else if(target==="8.8.8.8"&&first.gateway){ok=true;if(!activity.tests.includes("external"))activity.tests.push("external")}else{const t=activity.nodes.find(n=>n.ip===target);if(t&&validIp(first.ip)&&subnet24(t.ip)===subnet24(first.ip))ok=true}out(ok?`Reply from ${target}: bytes=32 time<1ms TTL=64`:`Request timed out for ${target}.`,ok?"ok":"bad");if(ok&&!activity.tests.includes("cli"))activity.tests.push("cli");renderChecklist();persistActivity();return}
 if(low.startsWith("nslookup ")){out("Server: 8.8.8.8\nName: example.com\nAddress: 93.184.216.34","ok");if(!activity.tests.includes("dns"))activity.tests.push("dns");renderChecklist();persistActivity();return}
 if(low.startsWith("tracert ")||low.startsWith("traceroute ")){out("1  192.168.10.1\n2  10.0.0.1\n3  destination reached","ok");if(!activity.tests.includes("trace"))activity.tests.push("trace");renderChecklist();persistActivity();return}
 if(low==="ipconfig /release"){out("IP configuration released (simulation).","ok");return}
 if(low==="ipconfig /renew"){if(first){first.ip=first.ip&&first.ip!=="169.254.20.15"?first.ip:"192.168.10.20";first.gateway=first.gateway||"192.168.10.1";renderCanvas();renderConfig()}out("DHCP renewal completed (simulation).","ok");return}
 if(low==="ipconfig /flushdns"){out("Successfully flushed the DNS Resolver Cache (simulation).","ok");return}
 if(low==="show vlan brief"){out("VLAN 1 default active\nVLAN 10 STUDENTS active\nVLAN 20 STAFF active","ok");if(!activity.tests.includes("vlan"))activity.tests.push("vlan");activity.answers.explain=true;renderChecklist();persistActivity();return}
 if(low==="show mac address-table"){out("Vlan  Mac Address       Type      Ports\n10    00AA.BBCC.0001    DYNAMIC   Fa0/1\n20    00AA.BBCC.0002    DYNAMIC   Fa0/2","ok");return}
 if(low==="show ip route"){out("C 192.168.10.0/24 is directly connected\nC 192.168.20.0/24 is directly connected","ok");if(!activity.tests.includes("route"))activity.tests.push("route");renderChecklist();persistActivity();return}
 out("Unknown command. Type help.","bad");
}
function persistActivity(){
 const g=loadGlobal();g.labState=g.labState||{};g.labState[currentLab]={activity};saveGlobal(g);
}
function scoreLab(){
 const l=current();if(profile&&Number(profile.class_number)<l.min){toast(`Scoring unlocks from Class ${l.min}`);return}
 let raw=0,diag=0,conf=0,ver=0,doc=0,safe=0;
 if(l.type==="scenario"){
   const total=l.correct.length;const correct=l.correct.filter((a,i)=>activity.answers[i]===a).length;
   diag=Math.round(correct/total*30);conf=Math.round(correct/total*30);ver=Object.keys(activity.answers).length===total?20:Math.round(Object.keys(activity.answers).length/total*20);doc=String(activity.notes||"").trim().length>=20?10:5;safe=Math.max(0,10-attemptMistakes*2-hintCount);
 }else{
   const tasks=l.tasks.map((_,i)=>taskDone(i));const ratio=tasks.filter(Boolean).length/tasks.length;
   diag=Math.round(ratio*30);conf=Math.round(Math.min(1,(activity.configured.length+activity.links.length)/Math.max(2,l.tasks.length-1))*30);ver=Math.round((activity.tests.length?1:0)*20);doc=String(activity.notes||"").trim().length>=25?10:5;safe=Math.max(0,10-attemptMistakes*2-hintCount);
 }
 raw=Math.min(100,diag+conf+ver+doc+safe);
 if(l.id===20&&raw>=70&&taskDone(6)){const g=loadGlobal();g.capstoneComplete=true;g.capstoneScore=raw;saveGlobal(g)}
 const g=loadGlobal();g.scores=g.scores||{};g.scores[currentLab]=Math.max(Number(g.scores[currentLab]||0),raw);g.xp=Object.values(g.scores).filter(x=>Number(x)>=60).length*25+(g.capstoneComplete?100:0);g.labState=g.labState||{};g.labState[currentLab]={activity,score:raw,updatedAt:new Date().toISOString()};saveGlobal(g);
 renderScores({diag,conf,ver,doc,safe,total:raw});renderLabList();
 $("modalBody").innerHTML=`<div style="font-size:48px">${raw>=80?"🏆":raw>=60?"✅":"📘"}</div><h2>${raw>=60?"Lab Completed":"Keep Practising"} — ${raw}%</h2><p>${raw>=60?"Your score was saved. Repeating the lab can improve your best score.":"Complete more checklist items, use the terminal and add technician notes, then verify again."}</p><div class="result-grid"><div><b>Diagnosis</b><br>${diag}/30</div><div><b>Configuration</b><br>${conf}/30</div><div><b>Verification</b><br>${ver}/20</div><div><b>Documentation + Safety</b><br>${doc+safe}/20</div></div>${l.id===20&&raw>=70?`<p><b>🎉 Capstone completed.</b> Your Professional certificate can now use this score.</p>`:""}`;
 $("modal").classList.add("open");$("modal").setAttribute("aria-hidden","false");
}
function renderScores(s){const set=(id,v)=>$(id).textContent=v==null?"—":v;set("diagScore",s?`${s.diag}/30`:null);set("configScore",s?`${s.conf}/30`:null);set("verifyScore",s?`${s.ver}/20`:null);set("docScore",s?`${s.doc}/10`:null);set("safeScore",s?`${s.safe}/10`:null);set("totalScore",s?`${s.total}%`:null)}
function hint(){hintCount++;const l=current();const hints={6:"Use one PC, one switch and one printer. Keep PC and printer in the same /24 subnet.",10:"Build PC → Switch → Router and a second PC → Switch. Configure unique IPs.",11:"169.254.x.x usually suggests DHCP trouble. Configure a normal 192.168.10.x address and gateway.",12:"Connect both PCs to the switch, give them VLAN labels, then run show vlan brief.",13:"Use two different /24 networks and set each PC gateway toward the router.",15:"Use ipconfig, ping gateway, ping 8.8.8.8, nslookup and tracert.",20:"Think like a small office: router, switches, PCs, AP and printer. Test, document, then verify."};toast(hints[l.id]||"Read the mission checklist and choose the simplest safe, relevant step first.")}
async function boot(){
 if(!TOKEN){location.href="student-login.html";return}
 try{
  const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"});const d=await r.json();
  if(!r.ok||d.role!=="student"||!d.profile)throw new Error("Login required");
  profile=d.profile;const c=Number(profile.class_number||0);if(c<7||c>10){location.href=c<=3?"foundation-universe.html":"advanced-universe.html";return}
  $("studentBadge").textContent=`👤 ${profile.display_name||profile.username||"Student"} • Class ${c}`;
  const g=loadGlobal();$("scoreBadge").textContent=`⭐ ${Number(g.xp||0)} XP`;
  const q=new URLSearchParams(location.search);currentLab=Math.min(20,Math.max(1,Number(q.get("lab")||1)));
  resetActivity();renderLabList();renderMission();renderCanvas();renderConfig();
 }catch{localStorage.removeItem("brightbyte_student_token");location.href="student-login.html"}
}
$("connectBtn").onclick=()=>{connectMode=!connectMode;connectSource=null;$("connectBtn").classList.toggle("active",connectMode);$("connectBtn").textContent=connectMode?"🔗 Select 2 Devices":"🔗 Connect Mode";renderCanvas()};
$("testBtn").onclick=networkTest;$("hintBtn").onclick=hint;$("resetBtn").onclick=()=>{activity={nodes:[],links:[],answers:{},notes:"",tests:[],configured:[]};hintCount=0;attemptMistakes=0;persistActivity();renderCanvas();renderConfig();renderChecklist();renderScores(null);toast("Current lab reset")};$("verifyBtn").onclick=scoreLab;
$("terminalForm").onsubmit=e=>{e.preventDefault();const c=$("terminalInput").value;$("terminalInput").value="";cli(c)};
$("clearTerminal").onclick=()=>{$("terminalOut").innerHTML="<div>Terminal cleared.</div>"};
$("canvas").onclick=()=>{if(!connectMode){selectedNode=null;renderCanvas();renderConfig()}};
$("modalClose").onclick=()=>{$("modal").classList.remove("open");$("modal").setAttribute("aria-hidden","true")};$("modal").onclick=e=>{if(e.target===$("modal"))$("modalClose").click()};
window.addEventListener("resize",drawLinks);
boot();
})();
