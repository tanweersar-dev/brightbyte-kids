
(() => {
"use strict";

/* ============================================================
   V45.0 — PROFESSIONAL GUIDED LEARNING ACADEMY
   Course -> Lesson Notes -> Mini Lab -> Next Lesson
   ============================================================ */

if(window.__brightbyteProfessionalLearningV45) return;
window.__brightbyteProfessionalLearningV45 = true;

const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const S=(title,text,bullets=[],extra={})=>({title,text,bullets,...extra});
const Q=(q,options,answer,explain)=>({q,options,answer,explain});
const L=(id,title,minClass,duration,summary,sections,terms,lab,extra={})=>({id,title,minClass,duration,summary,sections,terms,lab,...extra});

const MEDIA_LIBRARY={
 nic:{label:"NIC Card",subtitle:"The hardware network interface inside a PC or laptop.",detail:"A NIC gives a device a wired or wireless network connection and usually has a MAC address. Students should notice the Ethernet port, status LEDs and link speed.",steps:["Find the Ethernet port on the laptop or desktop.","Connect the patch cable gently until the tab clicks.","Check the link light and confirm the adapter appears in the operating system."],emoji:"💳"},
 switch:{label:"Network Switch",subtitle:"The central LAN device for local wired communication.",detail:"A switch connects many wired devices in the same LAN and learns MAC addresses so that frames go to the correct port.",steps:["Count the ports and find the uplink.","Connect endpoints such as PCs, printers or IP phones.","Check link/activity LEDs and document which port serves which device."],emoji:"🔀"},
 router:{label:"Router",subtitle:"Moves traffic between different IP networks.",detail:"A router sends packets from one network to another. Home and office routers also commonly provide DHCP and NAT.",steps:["Identify the LAN and WAN sides.","Check the gateway IP used by PCs.","Verify whether internet access works through the router."],emoji:"🧭"},
 firewall:{label:"Firewall",subtitle:"The security gate between trusted and untrusted networks.",detail:"A firewall applies security policy. It allows, blocks or inspects traffic according to rules and protection settings.",steps:["Check which interface faces the LAN and which faces the ISP.","Review whether a service is allowed or blocked.","Verify safely before changing a rule."],emoji:"🛡️"},
 modem:{label:"Modem / ONT",subtitle:"The ISP handoff device.",detail:"A modem or ONT terminates the internet service from the provider and hands off connectivity to the router or firewall.",steps:["Locate the fiber/copper line coming from the ISP.","Check status lights such as power, LOS and internet.","Confirm the Ethernet handoff to the router/firewall."],emoji:"📡"},
 hub:{label:"Hub",subtitle:"An old shared Ethernet repeater.",detail:"A hub simply repeats traffic to every port. It does not learn MAC addresses, so modern networks mostly use switches instead.",steps:["Compare a hub with a switch.","Notice how all traffic is repeated.","Understand why switches are more efficient."],emoji:"🔁"},
 ap:{label:"Access Point",subtitle:"Connects Wi-Fi users to the wired LAN.",detail:"An access point broadcasts wireless service and bridges clients into the wired network.",steps:["Find the SSID name.","Check 2.4 GHz and 5 GHz coverage.","Test signal and access safely."],emoji:"📶"},
 isp:{label:"Internet Service Provider",subtitle:"The company delivering internet connectivity.",detail:"The ISP delivers the WAN connection. Local networks use the ISP handoff through an ONT or modem.",steps:["Understand the path PC → Switch → Router/Firewall → ISP device → Internet.","Recognize when a fault may be upstream.","Escalate with evidence if the ISP service is down."],emoji:"🌍"},
 patch:{label:"Patch Panel",subtitle:"A passive organization point for building cabling.",detail:"Patch panels organize fixed cable runs in racks or cabinets. Short patch cords link panel ports to switch ports.",steps:["Read the port labels.","Match a wall outlet to the correct panel port.","Use good cable management and labeling."],emoji:"🗄️"},
 cat5:{label:"Cat5e / Cat6 Cable",subtitle:"Common twisted-pair Ethernet cable categories.",detail:"Cat5e is common for Gigabit Ethernet. Cat6 improves crosstalk performance and supports higher speeds over suitable distances.",steps:["Compare cable jacket markings.","Identify four twisted pairs.","Use the right category for the installation need."],emoji:"🧵"},
 rj45:{label:"RJ45 Plug",subtitle:"The common 8P8C Ethernet connector.",detail:"Students should notice pin order, locking tab direction and the need for correct conductor placement.",steps:["Hold the plug correctly.","Check the pin order before crimping.","Test after crimping."],emoji:"🔌"},
 tester:{label:"Cable Tester",subtitle:"Checks continuity and pin mapping.",detail:"A cable tester helps confirm whether the cable is straight, crossed, open or incorrectly pinned.",steps:["Connect both ends of the cable.","Power on the tester.","Read whether pins light in the correct sequence."],emoji:"🧪"},
 tone:{label:"Tone Generator / Probe",subtitle:"Helps trace an unknown cable.",detail:"A toner and probe pair helps technicians locate one cable in a bundle or across a patch panel.",steps:["Attach the tone generator.","Move the probe near candidate cables.","Label the identified cable when confirmed."],emoji:"📍"},
 ipv4:{label:"IPv4 Addressing",subtitle:"The numeric identity of a network interface.",detail:"A healthy LAN client needs a valid IP address, subnet mask, default gateway and DNS. Students should recognise common private ranges.",steps:["Read the current IP configuration.","Decide whether the address is correct for the LAN.","Test gateway reachability."],emoji:"🔢"},
 dhcp:{label:"DHCP",subtitle:"Automatic IP configuration service.",detail:"DHCP gives clients an address, mask, gateway and DNS automatically. If DHCP fails, Windows may self-assign APIPA.",steps:["Run ipconfig /all.","Check whether the lease came from DHCP.","Use release/renew when appropriate."],emoji:"🛰️"},
 dns:{label:"DNS",subtitle:"Name resolution for network services.",detail:"DNS translates names such as example.com into IP addresses. IP reachability may work even when DNS is broken.",steps:["Ping an IP first.","Use nslookup for a name.","Compare results to separate DNS from internet path issues."],emoji:"📚"},
 osi:{label:"OSI Model",subtitle:"A simple troubleshooting map for technicians.",detail:"Use the layers to decide where to start troubleshooting: physical, data link, network, transport and applications.",steps:["Check Layer 1 first for cable or Wi-Fi link.","Check addressing at Layer 3.","Check application services like DNS at higher layers."],emoji:"🧱"},
 vlan:{label:"VLAN",subtitle:"Logical separation on a switch.",detail:"VLANs split one physical switch into multiple logical Layer-2 broadcast domains. Access ports normally carry one VLAN and trunk links can carry several.",steps:["Label endpoint ports clearly.","Decide which ports are Student or Staff.","Remember inter-VLAN traffic needs Layer-3 routing."],emoji:"🏷️"},
 wifi:{label:"Wi‑Fi",subtitle:"Wireless LAN access.",detail:"Wireless users connect using an SSID. Security, signal strength and coverage planning matter.",steps:["Check the visible SSID.","Compare signal strength and coverage.","Use safe authentication such as WPA2/WPA3."],emoji:"📶"},
 cmd:{label:"Windows Network Commands",subtitle:"Basic command-line troubleshooting tools.",detail:"The most useful commands for beginners are ipconfig, ping, nslookup, tracert, release/renew and flushdns.",steps:["Inspect configuration.","Test local gateway.","Test external IP, then test DNS."],emoji:"⌨️"},
 hardware:{label:"PC Hardware",subtitle:"Main desktop/laptop components.",detail:"Students should identify motherboard, CPU, RAM, SSD/HDD, power supply, fans and expansion cards.",steps:["Match each part with its job.","Handle components safely.","Record model and serial information correctly."],emoji:"🖥️"},
 windows:{label:"Windows Tools",subtitle:"Core settings and recovery tools.",detail:"Control Panel, Settings, Device Manager, Disk Management and Task Manager are all beginner-friendly support tools.",steps:["Open Device Manager.","Look for missing drivers or warnings.","Use the correct tool before making a change."],emoji:"🪟"},
 printer:{label:"Printer Setup",subtitle:"Install, connect and test print devices.",detail:"Technicians check power, network/USB connection, driver, queue status and test pages.",steps:["Install the driver.","Confirm the printer IP or USB connection.","Send a test page and document the result."],emoji:"🖨️"},
 outlook:{label:"Outlook & Email",subtitle:"Mailbox setup and message flow basics.",detail:"Students learn about mailboxes, password security, attachments, signatures and basic troubleshooting.",steps:["Check account sign-in.","Review send/receive state.","Verify server or Microsoft 365 sign-in safely."],emoji:"📧"},
 m365:{label:"Microsoft 365",subtitle:"Cloud productivity services.",detail:"OneDrive, Teams, Word online and Outlook web app are common services. Students should know sign-in, sync and sharing basics.",steps:["Sign in using the correct account.","Identify the app being used.","Share files safely using the correct permissions."],emoji:"☁️"},
 ai:{label:"AI Assistant Workflow",subtitle:"Use AI to think, verify and produce better work.",detail:"AI can help brainstorm, summarize, draft emails, explain technology and create first versions of SOPs. Students must still verify facts and avoid sharing secrets.",steps:["Start with a clear prompt and the goal.","Ask for step-by-step explanation or a draft.","Check the answer and rewrite it in your own words if needed."],emoji:"🤖"},
 prompt:{label:"Prompt Writing",subtitle:"Clear instructions create better AI output.",detail:"A strong prompt explains the role, task, audience, format and limits. Students should provide context and ask follow-up questions to improve the result.",steps:["State what you want.","Add the audience and difficulty level.","Ask the AI to verify or simplify if needed."],emoji:"📝"},
 research:{label:"AI Research & Verification",subtitle:"Never trust the first answer blindly.",detail:"AI can make mistakes. Students must cross-check with class notes, textbooks, official vendor pages or teacher instructions.",steps:["Ask the AI for a summary.","Check at least one trusted source.","Mark what is verified and what still needs checking."],emoji:"🔍"},
 support:{label:"IT Support Workflow",subtitle:"Professional communication and troubleshooting.",detail:"A support technician listens, scopes the issue, diagnoses carefully, fixes safely, verifies and documents the work.",steps:["Ask if one user or many are affected.","Capture the exact symptom.","Verify the fix before closing the case."],emoji:"🎧"},
 cyber:{label:"Cybersecurity Basics",subtitle:"Protect identities, devices and data.",detail:"Strong passwords, MFA, careful email handling and privacy awareness are essential student habits.",steps:["Recognise suspicious links or urgent requests.","Never share OTPs or passwords.","Report strange activity early."],emoji:"🛡️"},
 defaultx:{label:"Technology Visual Guide",subtitle:"A clear picture helps students connect theory with practice.",detail:"Use the visual card, notes and walkthrough together. The goal is not only to remember a definition, but to know where the item fits in a real workflow.",steps:["Read the note carefully.","Open the visual guide.","Relate the item to the lab you are about to perform."],emoji:"📘"}
};
function svgForMedia(item,index=0){
 const title=item.label||'Technology Visual';
 const sub=item.subtitle||item.detail||'';
 const badge=item.emoji||'📘';
 const bg=[['#183b5a','#2d628d','#8bd7ff'],['#2b3859','#546dba','#99d3ff'],['#2a4157','#39a9a8','#d7fffb'],['#4c355d','#9965d4','#ffc3ff']][index%4];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="0.5" stop-color="${bg[1]}"/><stop offset="1" stop-color="${bg[2]}"/></linearGradient></defs><rect width="1280" height="800" rx="36" fill="url(#g)"/><circle cx="1060" cy="150" r="120" fill="rgba(255,255,255,.12)"/><circle cx="1180" cy="240" r="48" fill="rgba(255,255,255,.16)"/><rect x="72" y="90" width="170" height="170" rx="34" fill="rgba(255,255,255,.14)"/><text x="157" y="192" font-size="90" text-anchor="middle">${badge}</text><rect x="72" y="314" width="1136" height="350" rx="34" fill="rgba(255,255,255,.10)" stroke="rgba(255,255,255,.24)"/><text x="76" y="740" font-size="28" fill="rgba(255,255,255,.75)">BrightByte Kids • Class 7–10 Professional Guided Visual</text><text x="290" y="170" font-size="58" font-weight="700" fill="#ffffff">${title.replace(/&/g,'&amp;')}</text><text x="290" y="228" font-size="28" fill="#e8f4ff">${sub.replace(/&/g,'&amp;').slice(0,120)}</text><text x="110" y="390" font-size="30" fill="#f8fbff">Real-world role</text><text x="110" y="438" font-size="24" fill="#eaf4ff">Understand where this component or concept fits in the actual workflow.</text><text x="110" y="520" font-size="30" fill="#f8fbff">What students should notice</text><text x="110" y="568" font-size="24" fill="#eaf4ff">Identify the object, connect it to the note, then apply it in the mini lab.</text></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function resolveMediaItems(raw){
 const text=Array.isArray(raw)?raw.join(' '):String(raw||'');
 const low=text.toLowerCase();
 const pairs=[['nic','nic'],['switch','switch'],['router','router'],['firewall','firewall'],['modem','modem'],['ont','modem'],['hub','hub'],['access point','ap'],['wi-fi','wifi'],['wifi','wifi'],['isp','isp'],['patch panel','patch'],['cat5','cat5'],['cat6','cat5'],['rj45','rj45'],['tester','tester'],['toner','tone'],['probe','tone'],['ipv4','ipv4'],['ip address','ipv4'],['gateway','ipv4'],['dhcp','dhcp'],['dns','dns'],['osi','osi'],['vlan','vlan'],['command','cmd'],['ipconfig','cmd'],['ping','cmd'],['tracert','cmd'],['nslookup','cmd'],['hardware','hardware'],['windows','windows'],['printer','printer'],['outlook','outlook'],['microsoft 365','m365'],['onedrive','m365'],['teams','m365'],['ai','ai'],['prompt','prompt'],['research','research'],['support','support'],['ticket','support'],['cyber','cyber'],['phishing','cyber']];
 const found=[];
 for(const [needle,key] of pairs){ if(low.includes(needle) && !found.includes(key)) found.push(key); if(found.length>=4) break; }
 if(!found.length) found.push('defaultx');
 return found.map((key,idx)=>({...MEDIA_LIBRARY[key],key,image:svgForMedia(MEDIA_LIBRARY[key],idx)}));
}
function ensureMediaModal(){
 let wrap=document.getElementById('proMediaModal');
 if(wrap) return wrap;
 wrap=document.createElement('div');
 wrap.id='proMediaModal';wrap.className='pro-media-modal';wrap.setAttribute('aria-hidden','true');
 wrap.innerHTML='<div class="pro-media-dialog"><div class="pro-media-head"><div><h2 id="proMediaTitle">Technology Visual Guide</h2><p id="proMediaIntro">Open a large visual explanation for equipment, notes and walkthroughs.</p><div id="proMediaTags" class="pro-media-tags"></div></div><button id="proMediaClose" class="pro-media-close" type="button" aria-label="Close">×</button></div><div id="proMediaBody"></div></div>';
 document.body.appendChild(wrap);
 wrap.addEventListener('click',e=>{ if(e.target===wrap) closeMediaModal(); });
 wrap.querySelector('#proMediaClose').onclick=closeMediaModal;
 return wrap;
}
function closeMediaModal(){ const wrap=document.getElementById('proMediaModal'); if(!wrap) return; wrap.classList.remove('open'); wrap.setAttribute('aria-hidden','true'); }
function openMediaModal(title, raw, intro='Large visual guide with equipment cards and a video-style walkthrough.'){
 const items=resolveMediaItems(raw); const wrap=ensureMediaModal();
 const mediaBody=wrap.querySelector('#proMediaBody'); const tagBox=wrap.querySelector('#proMediaTags');
 wrap.querySelector('#proMediaTitle').textContent=title||'Technology Visual Guide';
 wrap.querySelector('#proMediaIntro').textContent=intro;
 tagBox.innerHTML=items.map(x=>`<span>${esc(x.label)}</span>`).join('');
 mediaBody.innerHTML=`<section class="pro-media-strip">${items.map(item=>`<article class="pro-media-tile"><img src="${item.image}" alt="${esc(item.label)} visual guide"><div><b>${esc(item.label)}</b><p>${esc(item.detail)}</p></div></article>`).join('')}</section><section class="pro-demo-rail">${items.map(item=>`<article class="pro-demo-card"><span class="play">▶</span><b>${esc(item.label)} — Video-style walkthrough</b><p>${esc(item.subtitle)}</p><ul>${(item.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul></article>`).join('')}</section>`;
 wrap.classList.add('open'); wrap.setAttribute('aria-hidden','false');
}


const COURSES={
network:{
 id:"network",icon:"🌐",title:"Network Engineering",subtitle:"From cables and devices to IP, switching, routing, Wi-Fi and troubleshooting.",
 finalLab:"professional-lab.html?lab=15",
 lessons:[
 L("net-01","Network Devices, NICs & Ethernet Cables",7,"18 min",
  "Start with the physical things you can see: NIC, cable, switch, router, access point, firewall and patch panel.",
  [
   S("What is a computer network?","A network is a group of devices that can communicate and share services. In a small office, computers usually connect to a switch or Wi-Fi access point. The switch connects toward a router or firewall, and the router/firewall connects toward the internet.",[
    "<b>Endpoint:</b> PC, laptop, printer, IP phone or camera.",
    "<b>NIC:</b> Network Interface Card. It gives a device a wired or wireless network interface and usually has a MAC address.",
    "<b>Switch:</b> Connects devices inside the same LAN and forwards Ethernet frames using MAC addresses.",
    "<b>Router:</b> Connects different IP networks and chooses where IP packets should go.",
    "<b>Hub:</b> Old shared device that repeats traffic to every port. Switches replaced hubs in normal modern networks.",
    "<b>Access Point:</b> Gives wireless devices access to the wired LAN.",
    "<b>Firewall:</b> Applies security rules between networks. It can allow, block or inspect traffic.",
    "<b>Modem/ONT:</b> Terminates the ISP connection. Fiber commonly uses an ONT."
   ]),
   S("Ethernet cable and connectors","Most office Ethernet cabling uses twisted-pair copper cable with an 8P8C connector commonly called RJ45. Cat5e and Cat6 are common categories. The eight wires are arranged as four twisted pairs.",[
    "<b>Patch cable:</b> A ready-made cable used between PC, wall outlet, switch or patch panel.",
    "<b>Straight-through:</b> Same wiring standard on both ends, usually T568B-to-T568B or T568A-to-T568A.",
    "<b>Crossover:</b> Historically used between similar devices; typically T568A on one end and T568B on the other.",
    "<b>Modern note:</b> Many modern switches and NICs support Auto-MDI/MDIX, so they can automatically handle the pair direction."
   ],{cable:true}),
   S("Simple crimping workflow","For a supervised training cable, work slowly and keep the twisted pairs untwisted only as much as needed.",[
    "1. Cut the cable cleanly and slide on a boot if you use one.",
    "2. Strip a short part of the outer jacket without damaging the inner wires.",
    "3. Untwist and arrange the eight conductors in the chosen T568A or T568B order.",
    "4. Straighten and trim them evenly.",
    "5. Push all conductors fully into the connector and confirm the order visually.",
    "6. Use the correct crimp tool.",
    "7. Test the cable with a cable tester before using it.",
    "Safety: disconnect a cable from PoE/network equipment before re-terminating it. Network cable is not mains electrical wiring."
   ],{callout:"Think physical layer first: power, cable, link light, port and NIC state."})
  ],
  [["NIC","Connects an endpoint to a network."],["MAC address","A Layer-2 hardware address used on Ethernet LANs."],["Switch","Connects devices in a LAN."],["Router","Moves traffic between different IP networks."],["Firewall","Controls traffic according to security policy."]],
  {title:"Mini Lab — Identify the Network Parts",scenario:"A small office has two PCs, one network printer, one switch, one router/firewall and one ISP ONT. Choose the correct device for each job.",
   tasks:["Draw this path on paper: PC → Switch → Router/Firewall → ONT → Internet.","Write the T568B wire order once from pin 1 to pin 8.","Name one difference between a hub and a switch."],
   questions:[
    Q("Which device normally connects several wired PCs inside one LAN?",["Switch","ONT","Keyboard"],0,"A switch connects LAN endpoints and forwards Ethernet frames."),
    Q("What does a NIC provide to a computer?",["A network interface","A printer queue","An email mailbox"],0,"The NIC is the computer's network interface."),
    Q("Which statement about a crossover cable is correct?",["It normally uses different wiring standards at each end","It is always required for every router","It carries internet without a switch"],0,"Traditional crossover cabling uses T568A on one end and T568B on the other.")
   ]},
 {diagram:["🖥️ PC","🔀 Switch","🧭 Router / Firewall","📡 ONT / ISP","☁️ Internet"]}),
 L("net-02","IPv4, Subnet Mask, Gateway, DNS & DHCP",7,"20 min",
  "Learn the four values a support technician checks first on a client: IP address, subnet mask, default gateway and DNS.",
  [
   S("The IPv4 address","An IPv4 address identifies an interface on an IPv4 network. A common private office address is 192.168.10.25. Private ranges are used inside local networks and are not directly routed across the public internet.",[
    "10.0.0.0/8 is private.",
    "172.16.0.0 through 172.31.255.255 is private.",
    "192.168.0.0/16 is private.",
    "Each device in the same LAN normally needs a unique IP address."
   ]),
   S("Subnet mask and default gateway","The subnet mask tells the device which addresses are local. A common beginner LAN is /24, which uses 255.255.255.0. The default gateway is usually the router or firewall interface used to reach other networks.",[
    "Example PC: 192.168.10.25 / 255.255.255.0",
    "Example gateway: 192.168.10.1",
    "Another PC at 192.168.10.40 is local in the same /24.",
    "A server at 192.168.20.10 is in another /24 and needs routing."
   ]),
   S("DHCP, DNS and APIPA","DHCP can automatically provide an IP address, mask, gateway and DNS. DNS translates names such as example.com into IP addresses. If Windows cannot get a normal DHCP lease, it may assign itself a 169.254.x.x APIPA address.",[
    "<b>169.254.x.x:</b> Strong clue that DHCP or the network path may be unavailable.",
    "<b>DNS problem:</b> You may be able to ping an IP but not open a site by name.",
    "<b>Duplicate IP:</b> Two devices using the same address can cause unstable connectivity."
   ],{callout:"A fast first command on Windows is: ipconfig /all"})
  ],
  [["DHCP","Automatically supplies IP configuration."],["DNS","Resolves names to IP addresses."],["Default gateway","Next hop used to reach other networks."],["APIPA","169.254.x.x self-assigned address when normal DHCP is unavailable."]],
  {title:"Mini Lab — Diagnose an Addressing Problem",scenario:"A user has IP 169.254.33.18, mask 255.255.0.0, no gateway and cannot access the office network.",
   tasks:["Write the first three checks you would make.","Decide whether the fault is more likely DHCP/path related or DNS-only.","Write a healthy example for the 192.168.10.0/24 LAN."],
   questions:[
    Q("What does 169.254.x.x usually suggest on a Windows client?",["DHCP/network path problem","Successful DNS lookup","Correct static address"],0,"APIPA commonly appears when the device cannot obtain normal DHCP configuration."),
    Q("Which setting is normally needed to reach another IP network?",["Default gateway","Computer name","Printer driver"],0,"The gateway is the next hop toward remote networks."),
    Q("What is the main job of DNS?",["Translate names and IP addresses","Assign VLANs","Power a switch"],0,"DNS resolves host names to IP addresses and can also perform reverse lookups.")
   ]},
 {diagram:["IP address","Subnet mask","Default gateway","DNS","DHCP"]}),
 L("net-03","OSI Model & TCP/IP — Simple Technician View",7,"16 min",
  "Use the OSI model as a troubleshooting map instead of memorizing it only for an exam.",
  [
   S("Why use layers?","Layers help you decide where a problem may be. If a cable is unplugged, do not start by changing DNS. If IP works but a website name fails, the problem is higher than the physical link.",[
    "<b>Layer 1 Physical:</b> cable, connector, signal, link light.",
    "<b>Layer 2 Data Link:</b> Ethernet frame, MAC address, switch, VLAN.",
    "<b>Layer 3 Network:</b> IP address, subnet, routing, router.",
    "<b>Layer 4 Transport:</b> TCP/UDP and port numbers.",
    "<b>Layer 5 Session:</b> session control concepts.",
    "<b>Layer 6 Presentation:</b> data format, encryption/encoding concepts.",
    "<b>Layer 7 Application:</b> DNS, HTTP/HTTPS, email and user applications."
   ]),
   S("A practical troubleshooting order","A technician often works from simple local evidence outward.",[
    "1. Physical: power, cable, Wi-Fi connected, link light.",
    "2. Local interface: NIC enabled and driver healthy.",
    "3. Addressing: IP, mask, gateway and DNS.",
    "4. Reachability: ping local gateway then another target.",
    "5. Name resolution: nslookup or test by name.",
    "6. Application: browser, Outlook, Teams or other service."
   ])
  ],
  [["Layer 1","Physical media and signal."],["Layer 2","Frames, MAC addresses, switching and VLANs."],["Layer 3","IP and routing."],["Layer 7","User-facing network services and applications."]],
  {title:"Mini Lab — Put the Fault in the Right Layer",scenario:"Three users report different faults. Match each symptom to the best starting layer.",
   tasks:["Cable unplugged → identify the starting layer.","Wrong default gateway → identify the starting layer.","DNS name fails but ping 8.8.8.8 works → identify the likely service layer."],
   questions:[
    Q("An Ethernet link light is off. Where should you start?",["Physical layer","Application layer","Email settings"],0,"No link light is a physical/link starting point."),
    Q("A PC has the wrong default gateway. Which OSI layer is most relevant?",["Layer 3 — Network","Layer 1 — Physical","Layer 7 only"],0,"Default gateways and IP routing are Layer 3 concepts."),
    Q("A website works by IP but not by name. What should you check?",["DNS","RAM speed","HDMI cable"],0,"That symptom strongly points toward name resolution.")
   ]},
 {}),
 L("net-04","Switching, MAC Addresses & VLAN Basics",8,"20 min",
  "Understand how switches learn endpoints and how VLANs separate one physical switch into logical networks.",
  [
   S("How a switch forwards traffic","A switch learns source MAC addresses on its ports and builds a MAC address table. When it knows the destination MAC, it forwards the frame toward the correct port instead of sending it everywhere.",[
    "MAC addresses are used for local Ethernet delivery.",
    "A switch can learn many endpoint MAC addresses.",
    "Broadcast traffic is sent within the broadcast domain.",
    "A hub does not build a MAC table; it repeats traffic to every port."
   ]),
   S("What is a VLAN?","A VLAN creates a logical Layer-2 separation. Devices in different VLANs are in different broadcast domains even if they connect to the same physical switch.",[
    "<b>Access port:</b> Usually carries one VLAN for an endpoint.",
    "<b>Trunk port:</b> Can carry multiple tagged VLANs between network devices.",
    "Inter-VLAN communication requires Layer-3 routing.",
    "Example: VLAN 10 Students, VLAN 20 Staff, VLAN 30 Voice."
   ],{callout:"A VLAN is not a security policy by itself. Routing/firewall rules still decide what traffic is allowed between networks."})
  ],
  [["MAC table","Switch table mapping learned MAC addresses to ports."],["VLAN","Logical Layer-2 broadcast domain."],["Access port","Endpoint-facing port usually assigned to one VLAN."],["Trunk","Link carrying multiple VLANs."]],
  {title:"Mini Lab — Basic VLAN Design",scenario:"A school lab needs Students and Staff separated on the same managed switch.",
   tasks:["Choose VLAN 10 for Students and VLAN 20 for Staff.","Label four access ports.","Choose one trunk uplink toward the router/firewall."],
   questions:[
    Q("What does a switch learn to build its forwarding table?",["Source MAC addresses","User passwords","DNS zones"],0,"Switches learn source MAC addresses."),
    Q("What does a VLAN create?",["A separate Layer-2 broadcast domain","A faster CPU","A printer driver"],0,"VLANs logically separate Layer-2 domains."),
    Q("Which port type normally carries several VLANs between network devices?",["Trunk","USB","Console only"],0,"A trunk commonly transports multiple VLANs.")
   ]},
 {}),
 L("net-05","Routing, NAT, Firewall & the Internet Path",8,"20 min",
  "Follow a packet from a PC to another network and then to the public internet.",
  [
   S("Routing in simple words","A router reads the destination IP and chooses a next hop based on its routing table. If the destination is not local, the PC sends the packet to its default gateway.",[
    "Connected routes represent networks directly attached to the router.",
    "Static routes are manually configured paths.",
    "A default route is a catch-all route, often toward the ISP.",
    "The default gateway on a PC must be reachable on the PC's local subnet."
   ]),
   S("NAT and firewall","Private office addresses normally need Network Address Translation (NAT) to access the public internet using a public address. A firewall then applies traffic rules according to policy.",[
    "NAT changes addressing information as traffic crosses network boundaries.",
    "A firewall can allow or deny traffic by source, destination, service, identity and other conditions.",
    "Stateful firewalls track connection state.",
    "Do not solve every connectivity problem by opening firewall rules. Verify the full path first."
   ]),
   S("Typical office path","A common path is Endpoint → Access Switch → Firewall/Router → ISP ONT/Modem → Internet.",[],
    {callout:"If local gateway ping works but internet IP ping fails, investigate routing, WAN/ISP, firewall/NAT or upstream service before blaming DNS."})
  ],
  [["Routing table","List of known IP routes and next hops."],["Default route","Fallback route for destinations not matched more specifically."],["NAT","Translates IP addressing across a boundary."],["Stateful firewall","Tracks connection state and applies policy."]],
  {title:"Mini Lab — Follow the Packet",scenario:"PC 192.168.10.25 can ping gateway 192.168.10.1 but cannot reach 8.8.8.8.",
   tasks:["List what already works.","List the next three places you would inspect.","Do not change DNS until IP reachability is checked."],
   questions:[
    Q("Where does a PC send traffic for a remote network?",["Its default gateway","Its keyboard","Its own MAC only"],0,"The default gateway is the next hop for remote networks."),
    Q("Which feature commonly lets private LAN clients share public internet access?",["NAT","VLAN name","BIOS"],0,"NAT commonly translates private addresses to public addressing."),
    Q("Gateway ping works but external IP ping fails. Which area is more likely next?",["Routing/WAN/firewall path","Local keyboard","Monitor cable"],0,"Local Layer 3 reachability is proven, so look farther upstream.")
   ]},
 {diagram:["🖥️ Endpoint","🔀 Access Switch","🛡️ Firewall / Router","📡 ISP","☁️ Internet"]}),
 L("net-06","Wi-Fi, SSID, Bands & Secure Wireless",8,"18 min",
  "Build a simple mental model for wireless coverage, authentication and troubleshooting.",
  [
   S("What an access point does","An access point bridges wireless clients to the wired LAN. The network name users see is the SSID.",[
    "2.4 GHz normally travels farther but is often more crowded.",
    "5 GHz usually provides higher capacity at shorter range.",
    "6 GHz may be available on newer Wi-Fi systems and compatible clients.",
    "Walls, metal, interference and distance affect signal quality."
   ]),
   S("Secure Wi-Fi basics","Use modern security such as WPA2 or WPA3 according to equipment capability and organization policy. Avoid open networks for private business traffic.",[
    "Use a strong managed key or enterprise authentication where appropriate.",
    "Guest Wi-Fi should be separated from internal business networks.",
    "Do not publish admin credentials.",
    "Place APs based on coverage needs, not only convenience."
   ]),
   S("Simple troubleshooting","Check whether the problem affects one device or many, whether the client can see the SSID, signal strength, authentication, IP configuration and gateway reachability.",[])
  ],
  [["SSID","Wireless network name."],["WPA2/WPA3","Common Wi-Fi security standards."],["AP","Wireless access point."],["Interference","Unwanted radio energy that reduces wireless quality."]],
  {title:"Mini Lab — Secure a Small Wi-Fi Network",scenario:"A training room needs staff Wi-Fi and a separate guest network.",
   tasks:["Choose secure authentication.","Keep guests separate from staff resources.","Place the AP away from large metal obstructions."],
   questions:[
    Q("What is the SSID?",["The Wi-Fi network name","The router serial number","A printer queue"],0,"SSID is the service set identifier shown as the Wi-Fi name."),
    Q("Which is a better normal security choice?",["WPA2/WPA3","Open Wi-Fi","No password"],0,"Modern Wi-Fi should use appropriate strong security."),
    Q("Why separate guest Wi-Fi?",["To reduce access to internal resources","To make the monitor brighter","To change the MAC address"],0,"Guest separation limits exposure of internal networks.")
   ]},
 {}),
 L("net-07","Windows Network Commands & Troubleshooting",9,"22 min",
  "Use commands in a logical order: inspect, test local, test remote, test DNS, trace the path.",
  [
   S("Core commands","Windows includes simple tools that are extremely useful to support technicians.",[
    "<b>ipconfig /all</b> — shows adapters, IP, mask, gateway, DNS and DHCP information.",
    "<b>ping 192.168.10.1</b> — tests reachability to the gateway.",
    "<b>ping 8.8.8.8</b> — tests external IP reachability without depending on DNS.",
    "<b>nslookup example.com</b> — tests DNS resolution.",
    "<b>tracert example.com</b> — shows Layer-3 hops toward a destination.",
    "<b>ipconfig /release</b> and <b>/renew</b> — requests a new DHCP lease.",
    "<b>ipconfig /flushdns</b> — clears the local DNS resolver cache."
   ]),
   S("A repeatable fault-isolation order","Do not run random commands. Each test should answer a question.",[
    "1. Does the NIC have a healthy link and correct configuration?",
    "2. Can the client reach its gateway?",
    "3. Can it reach an external IP?",
    "4. Can DNS resolve names?",
    "5. Where does tracert stop?",
    "6. Is the failure one client, one VLAN, one site or everyone?"
   ],{callout:"Write down the result of each test. Evidence prevents repeated work."})
  ],
  [["ipconfig","Shows Windows IP configuration."],["ping","Tests ICMP reachability."],["nslookup","Queries DNS."],["tracert","Shows the routed path/hops."]],
  {title:"Mini Lab — Choose the Next Command",scenario:"A PC shows 192.168.10.25/24 with gateway 192.168.10.1. Website names do not open.",
   tasks:["Ping the gateway.","Ping an external IP.","If that works, test DNS with nslookup."],
   questions:[
    Q("Which command shows full adapter configuration?",["ipconfig /all","format c:","taskkill"],0,"ipconfig /all is the normal first inspection command."),
    Q("If ping 8.8.8.8 works but names fail, what should you test?",["DNS with nslookup","Monitor power","RAM seating"],0,"IP reachability works, so DNS is the next logical test."),
    Q("What does tracert help show?",["The network path/hops","Installed printers","BIOS password"],0,"tracert helps locate where the routed path may be failing.")
   ]},
 {}),
 L("net-08","Small Office Network Build — Final Network Chapter",10,"24 min",
  "Combine devices, addressing, VLAN thinking, Wi-Fi, printer access and troubleshooting into one small-office design.",
  [
   S("Build the topology","A practical small office may use ISP ONT → firewall/router → managed switch → PCs, printer and access point.",[
    "Give infrastructure devices clear names.",
    "Plan a management address range.",
    "Use DHCP for normal endpoints unless a static/reservation is required.",
    "Keep printers stable with a reservation or approved static address.",
    "Use VLANs when separation is required, for example Staff, Guest and Voice."
   ]),
   S("Plan before configuration","Write an address plan before clicking anything.",[
    "Staff: 192.168.10.0/24, gateway 192.168.10.1",
    "Guest: 192.168.20.0/24, gateway 192.168.20.1",
    "Printer: 192.168.10.50",
    "DNS: organization-approved resolver",
    "Document switch ports, AP SSIDs and firewall policy purpose."
   ]),
   S("Verify and hand over","A professional build is not finished until it is tested and documented.",[
    "Test endpoint IP and gateway.",
    "Test printer reachability and printing.",
    "Test internet and DNS.",
    "Confirm guest isolation.",
    "Save a simple diagram, address plan and change note."
   ])
  ],
  [["Address plan","Documented IP/subnet/gateway design."],["Reservation","DHCP method to repeatedly assign the same address to a known client."],["Handover","Clear documentation given to the next technician or owner."]],
  {title:"Mini Lab — Design the Office",scenario:"Design a network for 6 staff PCs, one printer, one AP and guest Wi-Fi.",
   tasks:["Draw the topology.","Create Staff and Guest subnets.","Choose the printer address and gateway.","Write three verification tests."],
   questions:[
    Q("Where should the access switch normally connect upstream?",["Firewall/router LAN interface","Directly to a monitor","USB hub"],0,"The access switch normally uplinks toward the routing/firewall layer."),
    Q("Why give a printer stable addressing?",["So clients can reliably reach the same print endpoint","To increase RAM","To hide the printer"],0,"Stable addressing avoids print ports pointing at old addresses."),
    Q("What finishes a professional network build?",["Verification and documentation","Only plugging cables","Changing wallpaper"],0,"Testing and documentation are part of a complete handover.")
   ]})
 ]
},

support:{
 id:"support",icon:"🎧",title:"IT Support",subtitle:"User support, printers, tickets, remote assistance, troubleshooting and documentation.",
 finalLab:"professional-lab.html?lab=16",
 lessons:[
 L("sup-01","The IT Support Workflow",7,"16 min","Learn a repeatable support method instead of guessing.",
  [S("A six-step support method","Good support is structured.",[
   "1. Receive — understand the user's symptom and business impact.",
   "2. Clarify — ask useful questions: one device or many, when it started, exact error, recent change.",
   "3. Diagnose — test simple likely causes first and collect evidence.",
   "4. Fix — make the safest relevant change.",
   "5. Verify — ask the user to confirm the service works.",
   "6. Document — record symptom, checks, fix and final result."
  ]),S("Incident vs service request","An incident is an unplanned interruption or degradation. A service request is a normal request such as software access, new printer installation or account change.",[
   "Prioritize by impact and urgency, not by who shouts the loudest.",
   "Escalate when the issue exceeds your access, skill, time target or risk level."
  ])],
  [["Incident","Unexpected service interruption."],["Service request","Normal request for access, setup or information."],["Escalation","Passing work to the correct higher support level."]],
  {title:"Mini Lab — Handle the First Call",scenario:"A user says, 'Internet is not working.'",
   tasks:["Ask whether one user or many are affected.","Ask what exactly fails and whether Wi-Fi/LAN shows connected.","Write a short ticket opening note."],
   questions:[
    Q("Best first clarification?",["Is it one device or several?","What is your password?","Can I format your PC?"],0,"Scope tells you whether to focus on one endpoint or shared infrastructure."),
    Q("When should you verify?",["After applying the fix","Never","Before understanding the symptom"],0,"Verification proves the service actually works."),
    Q("A good closure note should include?",["Symptom, checks, action and result","Only 'done'","User password"],0,"Closure notes should let another technician understand the case.")
   ]}),
 L("sup-02","PC, Monitor & Peripheral Troubleshooting",7,"18 min","Learn simple checks for desktop, monitor, keyboard, mouse, USB and audio problems.",
  [S("Start with power and connection","Many user faults are simple.",[
   "Confirm power cable and power indicator.",
   "For no display, check monitor input source, display cable and whether the PC is actually running.",
   "For USB devices, try a known-good port and check Device Manager if needed.",
   "For audio, check output device, mute level, cable/Bluetooth state and driver status."
  ]),S("Separate hardware from software","Ask whether the device is detected by Windows. If it is not detected, inspect cable/port/device. If it is detected but not working correctly, investigate driver, settings or application.",[])],
  [["Known-good test","Testing with a component already known to work."],["Device Manager","Windows tool for hardware and driver status."]],
  {title:"Mini Lab — No Display",scenario:"PC power light is on but the monitor says No Signal.",
   tasks:["Check monitor power/input.","Check HDMI/DisplayPort cable at both ends.","Try a known-good cable or output if permitted."],
   questions:[
    Q("What should you check before replacing the PC?",["Monitor input and cable","DNS","Printer queue"],0,"No Signal often begins with display path checks."),
    Q("A USB mouse works in another port. What does that suggest?",["Original port/path needs investigation","DNS is broken","Email is blocked"],0,"The mouse itself is probably healthy."),
    Q("Why use a known-good cable?",["To isolate whether the cable is the fault","To change the IP address","To update Windows"],0,"Substitution is a standard isolation technique.")
   ]}),
 L("sup-03","Printer & Scanner Support",8,"20 min","Understand USB/network printing, TCP/IP ports, drivers, queues, spooler and scanning.",
  [S("Network printer path","A Windows client may print through a Standard TCP/IP port pointing to the printer IP.",[
   "Check printer power and network link.",
   "Ping the printer IP if ICMP is allowed.",
   "Confirm Windows print port matches the current printer IP.",
   "Confirm correct manufacturer/universal driver.",
   "Check queue for stuck jobs and spooler service if required."
  ]),S("Scanning","Scanning may use vendor software, WSD, SMB folder, email or other configured workflows. First identify which scan method is expected.",[
   "If printing works but scanning fails, do not assume the whole network is broken.",
   "Test the specific scan destination or application."
  ])],
  [["TCP/IP print port","Windows port pointing to a network printer address."],["Spooler","Windows service that manages print jobs."],["Queue","List of pending print jobs."]],
  {title:"Mini Lab — Printer Offline",scenario:"Printer responds to ping but Windows says Offline and jobs remain queued.",
   tasks:["Check the configured print port IP.","Check queue and driver.","Print a Windows test page after the fix."],
   questions:[
    Q("Ping works but jobs do not print. What is a logical next check?",["Print port, queue and driver","Replace internet ISP","Change BIOS"],0,"Network reachability is proven, so inspect the printing path."),
    Q("Printer changed from .50 to .60 but Windows port still points to .50. Fix?",["Update/recreate the TCP/IP port","Change monitor input","Flush browser cache"],0,"The client must send print jobs to the correct address."),
    Q("What proves the fix?",["Successful test page and user confirmation","Closing the ticket immediately","Deleting drivers"],0,"Verification is required.")
   ]}),
 L("sup-04","Tickets, Priority, Escalation & SLA Thinking",8,"18 min","Write tickets that another technician can understand and prioritize them sensibly.",
  [S("What belongs in a ticket","Use clear, factual information.",[
   "User/location/device or asset ID.",
   "Exact symptom and error message.",
   "Business impact and number of affected users.",
   "Checks performed and results.",
   "Action taken and verification.",
   "Escalation reason if unresolved."
  ]),S("Priority thinking","High impact plus high urgency may need a higher priority. A single user cosmetic issue is usually lower than a building-wide outage.",[
   "Do not promise a deadline you cannot control.",
   "Follow your organization's SLA and escalation process."
  ])],
  [["SLA","Target service level agreed for response/resolution."],["Priority","Relative order based on impact and urgency."],["Asset ID","Identifier used to track a device."]],
  {title:"Mini Lab — Prioritize Two Tickets",scenario:"Ticket A: one user needs a new mouse. Ticket B: all users in a site cannot reach the network.",
   tasks:["Choose which ticket is more urgent.","Write one-line impact statements.","Write what evidence to collect before escalation."],
   questions:[
    Q("Which ticket should normally be investigated first?",["Site-wide network outage","Single new mouse request","Wallpaper change"],0,"The site-wide outage has much higher impact."),
    Q("What should an escalation include?",["Evidence and checks already performed","Only 'not working'","A user's password"],0,"Useful escalation prevents duplicated work."),
    Q("What is the purpose of an SLA?",["Set service expectations","Assign IP addresses","Control monitor brightness"],0,"SLAs define service targets and expectations.")
   ]}),
 L("sup-05","Remote Support & Professional Communication",8,"18 min","Support users remotely while protecting privacy and trust.",
  [S("Before connecting","Get user permission and explain what you need to do.",[
   "Use approved remote-support tools.",
   "Ask the user to save important work before restart.",
   "Do not ask the user to send passwords or OTPs.",
   "Let the user enter credentials themselves when possible."
  ]),S("During and after the session","Explain disruptive changes, avoid unnecessary access to personal files, disconnect when finished and document the result.",[])],
  [["Consent","User permission for the support action."],["Least privilege","Use only the access needed for the task."],["Session closure","Disconnect and record the outcome."]],
  {title:"Mini Lab — Safe Remote Session",scenario:"You need to restart a user's PC during remote troubleshooting.",
   tasks:["Tell the user why.","Ask them to save work.","Confirm reconnection plan.","Document the result."],
   questions:[
    Q("Before remote control, what is required?",["User permission","Their OTP","Hidden access"],0,"Consent is part of professional remote support."),
    Q("Who should normally type the user's password?",["The user","The technician into chat","Anyone"],0,"Credentials should stay private."),
    Q("After support is complete?",["Disconnect and document","Leave remote access open","Copy private files"],0,"Close the session and record what was done.")
   ]}),
 L("sup-06","Troubleshooting Logic & Handover",9,"20 min","Turn support work into a repeatable diagnostic process and clear handover.",
  [S("Use evidence, not random changes","Define the symptom, establish scope, compare working vs failing systems, test one assumption at a time and verify after every change.",[
   "One user vs many.",
   "One application vs whole device.",
   "Local network vs internet.",
   "Account issue vs device issue.",
   "Recent change vs long-standing fault."
  ]),S("Handover format","Write: problem, impact, evidence, action, current status, next recommended step and ownership.",[])],
  [["Scope","How many users/devices/services are affected."],["Root cause","Underlying reason for the failure."],["Workaround","Temporary method to restore function while permanent fix is pending."]],
  {title:"Mini Lab — Write a Handover",scenario:"A printer is reachable but still does not print after driver reinstall. You need to escalate.",
   tasks:["Write the symptoms.","Write tests already completed.","Write current status and next owner."],
   questions:[
    Q("Why document failed checks?",["So the next technician does not repeat work","To hide evidence","To increase IP speed"],0,"Good handover saves time and preserves reasoning."),
    Q("What is a workaround?",["Temporary way to restore service","Permanent root cause","Password reset only"],0,"A workaround reduces impact while final resolution is pending."),
    Q("What should troubleshooting change at one time?",["One controlled variable when practical","Everything at once","Nothing ever"],0,"Controlled changes help identify cause and effect.")
   ]})
 ]
},

hardware:{
 id:"hardware",icon:"🧠",title:"Hardware & Windows",subtitle:"PC components, assembly, BIOS/UEFI, storage, Windows installation, drivers and recovery.",
 finalLab:"professional-lab.html?lab=5",
 lessons:[
 L("hw-01","PC Components & What They Do",7,"20 min","Identify CPU, RAM, motherboard, storage, PSU, cooling and common ports.",
  [S("Core components","A computer is a system of parts working together.",[
   "<b>CPU:</b> Executes instructions.",
   "<b>RAM:</b> Temporary working memory used by running programs.",
   "<b>Motherboard:</b> Main board that connects CPU, RAM, storage, expansion and I/O.",
   "<b>SSD/NVMe:</b> Non-volatile storage for Windows, applications and files.",
   "<b>PSU/SMPS:</b> Converts incoming power to regulated DC power for components.",
   "<b>Cooling:</b> Removes heat from CPU/GPU and case.",
   "<b>GPU:</b> Processes graphics; may be integrated or dedicated."
  ]),S("Common ports","Know what you are looking at before replacing anything.",[
   "USB-A / USB-C — peripherals and data/power depending on standard.",
   "HDMI / DisplayPort — digital video/audio.",
   "Ethernet RJ45 — wired network.",
   "3.5 mm audio — analog audio.",
   "Power connectors — different shapes for motherboard, CPU, GPU and drives."
  ])],
  [["RAM","Temporary volatile working memory."],["SSD","Non-volatile storage."],["PSU","Supplies regulated power to PC components."],["Motherboard","Main board interconnecting components."]],
  {title:"Mini Lab — Identify the Part",scenario:"A training PC has slow multitasking, a small HDD and 4 GB RAM.",
   tasks:["Identify which part holds active programs.","Identify which part stores files.","Suggest one realistic performance upgrade."],
   questions:[
    Q("Which component holds active working data temporarily?",["RAM","SSD","PSU"],0,"RAM is volatile working memory."),
    Q("Which part stores Windows and files after shutdown?",["SSD/HDD","RAM","CPU cooler"],0,"Storage retains data after power off."),
    Q("What supplies power to the PC components?",["PSU / SMPS","NIC","Mouse"],0,"The power supply converts and distributes power.")
   ]}),
 L("hw-02","Safe PC Assembly & Upgrades",7,"20 min","Learn a safe sequence for RAM, storage and component upgrades.",
  [S("Before opening a PC","Shut down correctly, disconnect power and follow workplace ESD procedures.",[
   "Photograph or document cable positions if needed.",
   "Confirm exact model and supported component type.",
   "Do not force connectors or RAM into the wrong slot orientation.",
   "Never open a PSU enclosure; internal capacitors can retain dangerous energy."
  ]),S("RAM and storage upgrades","Check compatibility before buying.",[
   "RAM generation/type, speed support, slot count and maximum capacity.",
   "Storage interface: SATA vs NVMe/M.2 and supported form factor.",
   "Available power/data cables and mounting.",
   "After upgrade, boot and verify BIOS/UEFI detection and Windows stability."
  ],{callout:"Compatibility first. A physically similar part may still be electrically or logically incompatible."})],
  [["ESD","Electrostatic discharge that can damage electronics."],["Form factor","Physical size/shape standard."],["Compatibility","Whether components are supported together."]],
  {title:"Mini Lab — Plan an Upgrade",scenario:"A desktop has 4 GB RAM and a slow HDD. The motherboard supports 16 GB DDR4 and one M.2 NVMe slot.",
   tasks:["Choose a compatible RAM plan.","Choose an SSD/NVMe upgrade.","Write a post-upgrade verification checklist."],
   questions:[
    Q("Before buying RAM, what must you check?",["Supported type and capacity","Desktop wallpaper","Printer model"],0,"RAM must match platform support."),
    Q("Should you open a PSU casing?",["No","Yes, while powered","Only to clean capacitors"],0,"Do not open PSUs; they contain hazardous high-voltage components."),
    Q("After installing new hardware?",["Verify detection and stability","Assume success","Delete drivers"],0,"Verification confirms the upgrade is working correctly.")
   ]}),
 L("hw-03","BIOS / UEFI & Boot Process",8,"18 min","Understand firmware, boot order, detected storage and safe changes.",
  [S("What BIOS/UEFI does","Firmware initializes hardware and starts the boot process before the operating system loads.",[
   "Shows CPU, RAM and storage detection.",
   "Controls boot order/boot menu.",
   "May contain Secure Boot, virtualization and hardware settings.",
   "Changes should be documented and made only when you understand the purpose."
  ]),S("Boot troubleshooting","If a drive is not detected in firmware, Windows cannot normally boot from it. Check physical installation, slot compatibility and firmware detection before changing OS settings.",[])],
  [["UEFI","Modern firmware interface replacing traditional BIOS on most systems."],["Boot order","Sequence of devices firmware checks for bootable software."],["Secure Boot","Feature that helps validate trusted boot software."]],
  {title:"Mini Lab — Boot from Approved USB",scenario:"You need to install Windows from an approved USB installer.",
   tasks:["Open the one-time boot menu or approved boot setting.","Choose the USB device.","Restore normal boot order if policy requires."],
   questions:[
    Q("Where is boot order controlled before Windows starts?",["BIOS/UEFI","Outlook","Printer queue"],0,"Firmware controls the boot sequence."),
    Q("SSD missing in BIOS/UEFI. First focus?",["Hardware detection/compatibility","DNS","Email rules"],0,"The OS cannot use a drive firmware does not detect normally."),
    Q("Best practice when changing firmware?",["Change only known settings and document","Change everything","Disable security randomly"],0,"Firmware changes can affect boot and security.")
   ]}),
 L("hw-04","Storage, Partitions & File Systems",8,"18 min","Understand disks, partitions, volumes and why backup matters before disk work.",
  [S("Storage concepts","A physical disk can contain one or more partitions/volumes. Windows commonly uses NTFS for system/data volumes.",[
   "HDD uses magnetic spinning media.",
   "SATA SSD uses flash storage through SATA.",
   "NVMe SSD uses PCIe and is usually much faster.",
   "Partition operations can destroy data if done incorrectly."
  ]),S("Before disk changes","Back up important data, identify the correct disk, understand whether the task is initialize, partition, format, extend or replace.",[])],
  [["Partition","Logical region of a physical disk."],["NTFS","Common Windows file system."],["NVMe","High-speed storage protocol using PCIe."]],
  {title:"Mini Lab — Storage Choice",scenario:"A laptop is slow because Windows is installed on an old HDD.",
   tasks:["Choose a supported SSD upgrade.","Back up user data.","Plan migration or clean installation."],
   questions:[
    Q("Which normally gives a large storage performance improvement over HDD?",["SSD/NVMe","Mouse pad","HDMI cable"],0,"Solid-state storage removes mechanical disk latency."),
    Q("Before repartitioning a disk?",["Back up important data","Disable DNS","Delete recovery media"],0,"Disk operations can destroy data."),
    Q("What is NTFS?",["A Windows file system","A network cable standard","An email protocol"],0,"NTFS is a Windows file system.")
   ]}),
 L("hw-05","Windows Installation — Clean and Structured",8,"22 min","Plan Windows installation from backup to drivers, updates and user verification.",
  [S("Before installation","Confirm licensing/organization policy, hardware requirements, backup, approved installation media and required applications.",[
   "Record device name and asset information.",
   "Back up user files if this is a rebuild.",
   "Confirm network and storage drivers if special hardware needs them."
  ]),S("Installation flow","Boot approved media, choose the correct target disk/partition, complete setup, install updates/drivers, join required management/identity, install approved apps, restore data and verify.",[
   "Do not erase an unknown disk just because it appears in Setup.",
   "After setup, check Device Manager for warning icons."
  ])],
  [["Clean install","Fresh OS installation, usually replacing the old installation."],["In-place upgrade","Upgrade while retaining supported apps/data/settings."],["Activation","Windows license activation state."]],
  {title:"Mini Lab — Installation Checklist",scenario:"A company PC must be rebuilt after backup.",
   tasks:["Write pre-install checks.","Write post-install checks.","Include drivers, updates, network and applications."],
   questions:[
    Q("What is essential before a clean install?",["Backup important data","Delete backup","Share password"],0,"A clean install can erase data."),
    Q("What should be checked after setup?",["Drivers, updates, network and apps","Only wallpaper","Printer paper"],0,"Post-install verification is part of deployment."),
    Q("Should you format an unidentified disk?",["No","Always","Only if it is large"],0,"Identify the target disk before destructive operations.")
   ]}),
 L("hw-06","Drivers & Device Manager",8,"18 min","Find warning devices, update/rollback drivers and use Hardware IDs carefully.",
  [S("Device Manager signals","A yellow warning icon means a device needs attention. Open Properties to read status/error details.",[
   "Use OEM or approved vendor drivers.",
   "If a new driver causes a fault, rollback may be appropriate.",
   "Hardware IDs can help identify an unknown device.",
   "Restart when required and test the actual function."
  ]),S("Avoid random driver sites","Unknown driver-download sites can bundle unwanted or unsafe software. Prefer Windows Update, OEM support or organization-approved sources.",[])],
  [["Driver","Software that lets Windows communicate with hardware."],["Hardware ID","Identifier exposed by a device for model/vendor matching."],["Rollback","Return to a previously installed driver version."]],
  {title:"Mini Lab — Unknown Device",scenario:"Device Manager shows an Unknown Device with a yellow warning after Windows reinstall.",
   tasks:["Open device properties.","Read Hardware IDs.","Find the approved OEM driver.","Install and verify."],
   questions:[
    Q("A yellow Device Manager warning means?",["Device/driver needs attention","Monitor too bright","DNS is perfect"],0,"The warning indicates a device or driver problem."),
    Q("Where should you prefer to get drivers?",["OEM/approved source","Random download site","Unknown pop-up"],0,"Approved sources reduce compatibility and security risk."),
    Q("New driver breaks audio. One reasonable option?",["Rollback driver","Format the PC immediately","Change gateway"],0,"Rollback can restore the previously working driver.")
   ]}),
 L("hw-07","Windows Recovery, Updates & Restore",9,"20 min","Use the least destructive recovery method that fits the problem.",
  [S("Recovery choices","Windows provides several recovery tools depending on the symptom.",[
   "Startup Repair for some boot problems.",
   "Safe Mode for controlled troubleshooting.",
   "System Restore when restore points exist and a reversible system change caused trouble.",
   "Reset/reinstall only when justified and after data protection.",
   "Backups are separate from restore points; do not treat them as the same thing."
  ]),S("Updates","Security and quality updates are important. Troubleshoot failed updates using evidence: error code, free disk space, connectivity, restart state and policy.",[])],
  [["Safe Mode","Starts Windows with limited drivers/services for troubleshooting."],["Restore point","Snapshot of certain system settings/files, not a user-data backup."],["Startup Repair","Recovery tool for some startup problems."]],
  {title:"Mini Lab — Choose the Least Destructive Option",scenario:"Windows stopped booting correctly immediately after a driver/system change.",
   tasks:["Protect data first.","Consider Startup Repair/Safe Mode/Restore depending on evidence.","Avoid immediate formatting."],
   questions:[
    Q("What should recovery prefer first?",["Least destructive suitable option","Immediate format","Delete user files"],0,"Preserve data and use reversible methods when appropriate."),
    Q("Is System Restore a full user-data backup?",["No","Yes","Always cloud backup"],0,"Restore points are not a replacement for backups."),
    Q("A failed update should be investigated using?",["Error/evidence and system state","Random registry deletion","Printer toner"],0,"Evidence-based troubleshooting reduces risk.")
   ]}),
 L("hw-08","Windows Performance & Final System Check",9,"18 min","Finish with a practical health-check mindset: startup, storage, memory, updates, drivers and user impact.",
  [S("Performance questions","Do not call every slow PC a RAM problem.",[
   "Is CPU usage constantly high?",
   "Is memory pressure high?",
   "Is disk usage at 100%?",
   "Is the system drive nearly full?",
   "Are many startup apps running?",
   "Is thermal throttling or malware suspected?",
   "Did slowness begin after a recent change?"
  ]),S("Final verification","After any fix, restart if required, reproduce the user's original task and confirm the result.",[])],
  [["Task Manager","Windows tool for process and resource usage."],["Thermal throttling","CPU/GPU reducing speed because of heat or power limits."],["Startup app","Application configured to start with Windows."]],
  {title:"Mini Lab — Slow PC",scenario:"A user says the PC is 'very slow.'",
   tasks:["Define what 'slow' means.","Check Task Manager and disk free space.","Compare before/after after one controlled change."],
   questions:[
    Q("What should you do before replacing RAM?",["Measure resource usage and symptom","Guess","Change DNS"],0,"Performance troubleshooting starts with evidence."),
    Q("A nearly full system drive can cause?",["Performance/update problems","Faster boot","Stronger Wi-Fi"],0,"Low disk space can affect updates and normal operation."),
    Q("How do you close the case?",["Reproduce the user's task and verify","Assume it is fixed","Hide the result"],0,"Verification must match the original symptom.")
   ]})
 ]
},

microsoft:{
 id:"microsoft",icon:"☁️",title:"Microsoft 365",subtitle:"Outlook, email flow, OneDrive, Teams, identity, MFA and cloud troubleshooting.",
 finalLab:"professional-lab.html?lab=8",
 lessons:[
 L("ms-01","Microsoft 365 & Cloud Basics",7,"16 min","Understand SaaS, tenant, user identity and common Microsoft 365 services.",
  [S("What Microsoft 365 provides","Microsoft 365 is a cloud service family that can include Exchange Online, Outlook, Teams, OneDrive, SharePoint and management/security services depending on the organization's license.",[
   "Exchange Online — cloud email/calendar service.",
   "Outlook — email/calendar client and web app.",
   "OneDrive — individual cloud file storage/sync.",
   "Teams — collaboration, meetings and chat.",
   "SharePoint — team sites, document libraries and collaboration."
  ]),S("Identity is central","Users sign in with organizational identities. MFA, Conditional Access and device management may affect sign-in behavior.",[])],
  [["SaaS","Software delivered as a hosted service."],["Tenant","Organization's cloud environment."],["Exchange Online","Microsoft cloud email service."]],
  {title:"Mini Lab — Match the Service",scenario:"A user asks which Microsoft 365 service is normally used for mail, personal cloud files and team collaboration.",
   tasks:["Map mail to Exchange/Outlook.","Map files to OneDrive.","Map collaboration to Teams/SharePoint."],
   questions:[
    Q("Which service primarily hosts Microsoft 365 mailboxes?",["Exchange Online","Paint","BIOS"],0,"Exchange Online hosts cloud mailboxes."),
    Q("Which is commonly used for an individual's work files?",["OneDrive","DHCP","VLAN"],0,"OneDrive is individual cloud storage/sync."),
    Q("Which service is commonly used for meetings/chat?",["Teams","Device Manager","NTFS"],0,"Teams provides collaboration, meetings and chat.")
   ]}),
 L("ms-02","Outlook Profiles, Signatures, Rules & Automatic Replies",7,"20 min","Configure common Outlook features and diagnose simple client issues.",
  [S("Outlook profile basics","A profile stores account configuration and client settings. Depending on environment, modern authentication can configure much of the mailbox automatically.",[
   "Create professional signatures.",
   "Use rules to organize mail safely.",
   "Set Automatic Replies when away.",
   "Use calendars and meeting invitations correctly.",
   "Do not send credentials in email."
  ]),S("Troubleshooting Outlook","Define whether the problem is sending, receiving, searching, profile, authentication, add-in or network related.",[
   "Check Outlook status and internet connectivity.",
   "Check webmail to separate client vs mailbox/service problems.",
   "Check account sign-in/MFA state.",
   "Use approved repair/profile steps only after evidence."
  ])],
  [["Profile","Outlook account/client configuration container."],["Rule","Automated action on messages that match conditions."],["Automatic Replies","Out-of-office messages."]],
  {title:"Mini Lab — User Going on Vacation",scenario:"A user will be away for one week and needs a professional out-of-office message.",
   tasks:["Open Automatic Replies.","Set start/end time.","Write a short internal/external message.","Do not disclose unnecessary private details."],
   questions:[
    Q("Which feature sends an out-of-office message?",["Automatic Replies","VLAN","Device Manager"],0,"Automatic Replies is the Outlook/Exchange feature."),
    Q("A rule is useful for?",["Organizing messages by condition","Installing RAM","Configuring BIOS"],0,"Rules automate mailbox actions."),
    Q("If Outlook fails but webmail works, what does that suggest?",["Client/profile issue is more likely","The entire mailbox is deleted","The switch is always broken"],0,"Working webmail helps separate service from local client.")
   ]}),
 L("ms-03","Email Protocols, Authentication & MFA",8,"18 min","Understand SMTP, IMAP, TLS and why modern cloud sign-in is more than a simple password.",
  [S("Mail flow terms","SMTP is used for sending/transporting email. IMAP is a protocol for accessing/synchronizing mailbox folders in many systems. Microsoft 365 commonly uses modern Exchange protocols and web APIs as well.",[
   "SMTP — send/relay mail.",
   "IMAP — synchronize mailbox folders in supported configurations.",
   "TLS — encrypts data in transit when configured.",
   "MFA — requires an additional verification factor.",
   "Modern authentication — token-based sign-in rather than basic password-only authentication."
  ]),S("Troubleshooting sign-in","Repeated password prompts can come from account state, expired sessions/tokens, MFA/Conditional Access, network time, client profile or policy.",[])],
  [["SMTP","Email sending/transport protocol."],["IMAP","Mailbox access/synchronization protocol."],["TLS","Transport encryption."],["MFA","Multi-factor authentication."]],
  {title:"Mini Lab — Repeated Password Prompt",scenario:"Outlook repeatedly asks for sign-in after a security policy change.",
   tasks:["Check account/MFA status.","Test web sign-in.","Confirm system time and network.","Recreate profile only if evidence supports it."],
   questions:[
    Q("Which protocol is associated with sending email?",["SMTP","DHCP","ARP"],0,"SMTP is used for mail transport/sending."),
    Q("What does MFA add?",["Another verification factor","More RAM","A VLAN"],0,"MFA reduces reliance on a password alone."),
    Q("Should support ask a user to send their OTP?",["No","Yes","Always"],0,"OTPs and credentials must remain private.")
   ]}),
 L("ms-04","OneDrive, SharePoint & Teams",8,"18 min","Understand sync, sharing and collaboration without confusing cloud and local copies.",
  [S("OneDrive sync","OneDrive can synchronize cloud files with a local folder. Sync status icons help show whether files are online, local or experiencing errors.",[
   "Files On-Demand can save disk space.",
   "A deleted synced file may also be deleted in the cloud depending on context.",
   "Sharing links should use appropriate permissions.",
   "Never make sensitive files public just for convenience."
  ]),S("Teams and SharePoint","Teams channels can be backed by SharePoint sites/libraries for files. Understand where a file lives before moving or deleting it.",[])],
  [["Sync","Keeping versions aligned between local and cloud locations."],["Sharing link","URL granting defined access to a file/folder."],["SharePoint library","Team document storage in SharePoint."]],
  {title:"Mini Lab — Safe File Sharing",scenario:"A student project team needs to share a document with only team members.",
   tasks:["Choose restricted organizational sharing.","Verify recipients.","Avoid public anonymous links unless policy explicitly allows."],
   questions:[
    Q("What should you verify before sharing a cloud file?",["Who can access the link","CPU temperature","BIOS version"],0,"Permissions control data exposure."),
    Q("Files shown in a Teams channel are commonly stored in?",["SharePoint","RAM","DHCP"],0,"Teams channel files commonly use SharePoint storage."),
    Q("Does local deletion of a synced file always stay local?",["No","Yes","Only on Fridays"],0,"Synchronization can propagate deletions depending on service behavior.")
   ]}),
 L("ms-05","Microsoft 365 Troubleshooting Workflow",9,"22 min","Separate account, service, network, client and policy problems.",
  [S("Five fault domains","When Microsoft 365 fails, classify the problem first.",[
   "Account/identity — sign-in, lockout, MFA.",
   "Service — platform outage or service health.",
   "Network — DNS, proxy, firewall, internet.",
   "Client — Outlook/Teams app, cache, profile.",
   "Policy/device — Conditional Access, device compliance or permissions."
  ]),S("Verification","Test another browser/client where appropriate, compare another user, use web versions, record exact error codes and timestamps, and avoid disabling security controls just to make the error disappear.",[])],
  [["Service health","Vendor/admin information about cloud service incidents."],["Conditional Access","Identity policy controlling access conditions."],["Client isolation","Testing web/other client to separate local app faults."]],
  {title:"Mini Lab — Outlook or Account?",scenario:"One user cannot sign into Outlook desktop, but Outlook on the web works and another user works on the same PC.",
   tasks:["Identify what this evidence rules out.","Focus on that user's local Outlook/profile/token state.","Document exact error before changing profile."],
   questions:[
    Q("Webmail works but desktop Outlook fails for one user. What is more likely?",["Local client/profile/token issue","Entire internet outage","Switch power failure"],0,"Cloud mailbox and internet are at least partly working."),
    Q("Why compare another user?",["To isolate user vs device/service scope","To collect passwords","To change DNS randomly"],0,"Comparison narrows the fault domain."),
    Q("Should you disable MFA to make sign-in easy?",["No","Yes","Always"],0,"Security controls should not be bypassed casually.")
   ]})
 ]
},

ai:{
 id:"ai",icon:"🤖",title:"AI for IT Work",subtitle:"Prompting, verification, troubleshooting support, documentation and safe AI use.",
 finalLab:"professional-lab.html?lab=19",
 lessons:[
 L("ai-01","AI Basics & What It Can Do for IT",7,"15 min","Use AI as an assistant, not as an unquestioned authority.",
  [S("Useful IT tasks","AI can help explain concepts, draft checklists, summarize logs, improve ticket notes, create SOP drafts, compare troubleshooting options and generate study questions.",[
   "It can be wrong or outdated.",
   "It can invent details that were never provided.",
   "It does not automatically know your company's private environment.",
   "Technicians must verify important technical actions."
  ])],
  [["Hallucination","AI-generated claim that sounds plausible but is unsupported or wrong."],["Verification","Checking an AI answer against evidence or trusted sources."]],
  {title:"Mini Lab — Good Use or Bad Use?",scenario:"You want AI help with a printer fault.",
   tasks:["Describe the symptom without secrets.","List checks already completed.","Ask for a step-by-step diagnostic plan."],
   questions:[
    Q("Should AI output be treated as automatically correct?",["No","Yes","Always for networking"],0,"AI can make mistakes."),
    Q("A useful AI task for support?",["Draft a troubleshooting checklist","Reveal user passwords","Approve security policy alone"],0,"AI is useful for structured assistance, not credential handling."),
    Q("What must follow an important AI recommendation?",["Verification","Blind execution","Publishing secrets"],0,"Validate technical advice safely.")
   ]}),
 L("ai-02","Write Better Technical Prompts",7,"18 min","Give context, objective, evidence, constraints and desired output.",
  [S("A strong prompt pattern","A technical prompt can use five parts.",[
   "Role/context: 'You are helping a junior IT technician.'",
   "Symptom: exact problem.",
   "Environment: Windows version, device, network context.",
   "Evidence: what you already tested and results.",
   "Constraint/output: safe steps, simple English, no destructive actions."
  ]),S("Example","Weak: 'Printer not working fix it.' Stronger: 'Windows 11 PC can ping HP network printer 10.10.20.50 but jobs stay in queue. Printer web page opens. Give a safe troubleshooting sequence checking TCP/IP port, queue, driver and spooler. Do not suggest reinstalling Windows.'",[])],
  [["Context","Background needed to understand the problem."],["Constraint","Boundary or requirement for the answer."],["Evidence","Observed facts from tests."]],
  {title:"Mini Lab — Improve the Prompt",scenario:"Turn 'Wi-Fi broken' into a useful support prompt.",
   tasks:["Add affected scope.","Add IP/gateway evidence.","Ask for safe ordered checks."],
   questions:[
    Q("Which makes a prompt stronger?",["Exact symptom and test results","Only 'fix it'","A password"],0,"Specific context improves relevance."),
    Q("Should passwords be included in prompts?",["No","Yes","Only admin passwords"],0,"Private credentials must not be exposed."),
    Q("What is a useful constraint?",["Do not suggest destructive changes before basic checks","Ignore safety","Assume every system is identical"],0,"Constraints shape safer output.")
   ]}),
 L("ai-03","Verify AI Answers & Avoid Hallucinations",8,"18 min","Cross-check commands, settings and claims before using them.",
  [S("Three verification levels","Match verification effort to risk.",[
   "Low risk: definition or study explanation — compare with course notes.",
   "Medium risk: troubleshooting command — check vendor/OS documentation and test safely.",
   "High risk: production firewall, data deletion, identity/security change — require approved documentation, change control and human authorization."
  ]),S("Red flags","Be cautious when AI invents a product menu, gives a command that does not exist, asks you to disable security, or gives one confident answer without uncertainty.",[])],
  [["Risk-based verification","Use more rigorous checking for higher-impact actions."],["Source","Trusted documentation or evidence used to validate a claim."]],
  {title:"Mini Lab — Verify Before You Run",scenario:"AI suggests a command you have never seen to 'repair the firewall.'",
   tasks:["Do not run it yet.","Check product documentation.","Understand what the command changes.","Use lab/test environment if possible."],
   questions:[
    Q("A high-risk production command should be?",["Verified and approved","Run immediately","Shared without reading"],0,"High-impact changes require strong verification."),
    Q("AI gives a product menu that does not exist. This may be?",["Hallucination/outdated answer","Proof the device is broken","A VLAN"],0,"AI may invent or use outdated interfaces."),
    Q("Best source for a specific vendor command?",["Current official vendor documentation","Random memory only","A password file"],0,"Official documentation is the right primary reference.")
   ]}),
 L("ai-04","AI for Tickets, SOPs & Troubleshooting",8,"20 min","Use AI to improve structure while keeping facts and privacy under your control.",
  [S("Ticket summaries","Provide only necessary non-sensitive facts and ask AI to organize them into symptom, evidence, action and result.",[
   "Never let AI invent tests you did not perform.",
   "Remove passwords, OTPs, private keys and sensitive personal data.",
   "Review the final wording before putting it in a ticket."
  ]),S("SOP drafts","AI can suggest headings and steps, but a real SOP must be tested against the actual environment and approved process.",[])],
  [["SOP","Standard Operating Procedure."],["Sanitize","Remove private/sensitive information before sharing."],["Factuality","Only state work that actually happened."]],
  {title:"Mini Lab — Clean a Ticket Note",scenario:"Raw note: 'user angry, printer bad, fixed maybe.'",
   tasks:["Rewrite symptom clearly.","Add checks and action only if actually performed.","End with verification status."],
   questions:[
    Q("Can AI invent tests to make a ticket look complete?",["No","Yes","Only if the user is busy"],0,"Documentation must remain factual."),
    Q("Before sending a log to AI?",["Remove secrets/private data","Add passwords","Disable MFA"],0,"Sanitize sensitive information."),
    Q("An SOP generated by AI should be?",["Tested and approved","Published immediately","Used without reading"],0,"Operational procedures need validation.")
   ]}),
 L("ai-05","AI-Assisted Junior Technician Project",9,"22 min","Combine prompting, verification and documentation into a safe mini project.",
  [S("Project flow","Choose a simple problem such as APIPA, printer offline or Outlook automatic reply.",[
   "1. Write a strong prompt.",
   "2. Get a diagnostic checklist.",
   "3. Verify every technical step.",
   "4. Test in the course lab.",
   "5. Write a ticket/SOP summary.",
   "6. Record what AI got right or wrong."
  ])],
  [["Reflection","Reviewing what worked, what failed and why."],["Human-in-the-loop","A person reviews/approves AI-supported work."]],
  {title:"Mini Lab — AI Support Workflow",scenario:"A PC has 169.254.x.x and no gateway.",
   tasks:["Ask AI for likely causes.","Verify DHCP/APIPA explanation.","Use ipconfig/ping logic.","Write a short verified resolution note."],
   questions:[
    Q("Who owns the final technical decision?",["The technician/authorized human","The AI alone","Nobody"],0,"AI supports; humans remain responsible."),
    Q("What should the final note distinguish?",["Observed facts from AI suggestions","Passwords from usernames","Random guesses"],0,"Keep evidence and suggestions separate."),
    Q("A good AI workflow ends with?",["Verification and documentation","Blind trust","Deleting logs"],0,"Verified outcomes matter.")
   ]})
 ]
},

cyber:{
 id:"cyber",icon:"🛡️",title:"Cybersecurity",subtitle:"Passwords, MFA, phishing, malware, patching, backups and incident response.",
 finalLab:"professional-lab.html?lab=18",
 lessons:[
 L("cy-01","Security Basics: Protect Accounts, Devices & Data",7,"16 min","Learn confidentiality, integrity and availability in simple language.",
  [S("Three goals","Security often protects three things.",[
   "<b>Confidentiality:</b> only authorized people can see data.",
   "<b>Integrity:</b> data is accurate and not changed without permission.",
   "<b>Availability:</b> systems/data are available when needed."
  ]),S("Least privilege","Give users and systems only the access required for their job. Admin access should not be the default for normal work.",[])],
  [["Confidentiality","Prevent unauthorized disclosure."],["Integrity","Protect correctness of data."],["Availability","Keep services usable."],["Least privilege","Minimum access needed."]],
  {title:"Mini Lab — Choose the Security Goal",scenario:"Match a locked document, tamper-proof record and backup service to the security goals.",
   tasks:["Identify confidentiality example.","Identify integrity example.","Identify availability example."],
   questions:[
    Q("Preventing unauthorized reading protects?",["Confidentiality","Availability only","Screen brightness"],0,"Confidentiality is about limiting disclosure."),
    Q("Preventing unauthorized modification protects?",["Integrity","Wallpaper","Wi-Fi SSID"],0,"Integrity protects correctness."),
    Q("A backup helps mainly with?",["Availability/recovery","MAC learning","Crimping"],0,"Backups support recovery and service availability.")
   ]}),
 L("cy-02","Passwords, Passkeys & MFA",7,"18 min","Protect accounts with strong authentication and never share OTPs.",
  [S("Password habits","Use unique strong passwords and a password manager where approved.",[
   "Do not reuse important passwords across services.",
   "Do not send passwords by chat/email.",
   "Change compromised credentials through approved processes."
  ]),S("MFA and passkeys","MFA adds another factor. Passkeys use public-key cryptography and can reduce phishing risk compared with password-only sign-in.",[
   "Never ask a user to tell you an OTP.",
   "Approve MFA prompts only when you initiated the sign-in."
  ])],
  [["MFA","More than one authentication factor."],["Passkey","Phishing-resistant credential based on public-key cryptography."],["OTP","One-time password/code; keep it private."]],
  {title:"Mini Lab — Suspicious MFA Prompt",scenario:"You receive an MFA approval request but you are not signing in.",
   tasks:["Do not approve it.","Report according to policy.","Review account security if required."],
   questions:[
    Q("Unexpected MFA prompt?",["Deny/report it","Approve quickly","Send OTP to support"],0,"Unexpected prompts can indicate account attack."),
    Q("Should support ask for an OTP?",["No","Yes","Always"],0,"OTPs are authentication secrets."),
    Q("A passkey is designed to be?",["More phishing-resistant than password-only login","A network cable","A printer protocol"],0,"Passkeys bind authentication to the legitimate service.")
   ]}),
 L("cy-03","Phishing, Social Engineering & Malware Awareness",8,"20 min","Recognize pressure, fake links, attachments and attempts to bypass normal process.",
  [S("Phishing signals","Attackers often create urgency or fear.",[
   "Unexpected password-reset or payment request.",
   "Look-alike domain or strange link.",
   "Attachment you did not expect.",
   "Request for OTP, password or private data.",
   "Message asking you to bypass normal approval."
  ]),S("If someone clicked","Stop further interaction, report/escalate quickly and follow the approved incident process. Do not hide the mistake.",[])],
  [["Phishing","Fraudulent attempt to steal data or trigger harmful action."],["Social engineering","Manipulating people to bypass security."],["Malware","Malicious software."]],
  {title:"Mini Lab — Spot the Phish",scenario:"Email says: 'Your account closes in 10 minutes. Click this shortened link and send your OTP.'",
   tasks:["Do not click.","Verify through official channel.","Report the message."],
   questions:[
    Q("Biggest red flag?",["Urgency plus request for OTP","Correct spelling","Normal company logo"],0,"Urgency and credential requests are common phishing signals."),
    Q("If clicked accidentally?",["Report quickly and follow incident process","Hide it","Forward to friends"],0,"Fast reporting reduces damage."),
    Q("What is social engineering?",["Manipulating people to bypass controls","A routing protocol","A file system"],0,"Social engineering targets human behavior.")
   ]}),
 L("cy-04","Updates, Backups & Endpoint Protection",8,"18 min","Reduce preventable risk through patching, backups and supported endpoint protection.",
  [S("Patching","Updates fix bugs and security vulnerabilities. Organizations may test and schedule updates to control risk.",[
   "Keep OS and applications supported.",
   "Use approved endpoint security.",
   "Restart when required.",
   "Do not disable security tools simply because they are inconvenient."
  ]),S("Backups","A backup should be restorable. Keep important copies protected from the same failure or attack that affects production data.",[])],
  [["Patch","Software update fixing bugs/security issues."],["Backup","Separate recoverable copy of data."],["Restore test","Checking that backup data can actually be recovered."]],
  {title:"Mini Lab — Protect a Shared PC",scenario:"A shared training PC is missing updates and stores important course files locally.",
   tasks:["Install approved updates.","Confirm endpoint security status.","Back up important files to approved storage.","Test recovery of one file."],
   questions:[
    Q("Why test a backup?",["To prove it can be restored","To increase CPU speed","To change VLAN"],0,"A backup is useful only if recovery works."),
    Q("Should endpoint security be disabled to fix a random problem?",["No, not without approved reason/process","Yes always","Only at night"],0,"Security controls should not be bypassed casually."),
    Q("Patching reduces risk from?",["Known vulnerabilities and bugs","Bad monitor color","Cable length only"],0,"Patches address known software issues.")
   ]}),
 L("cy-05","Incident Response for a Junior Technician",9,"20 min","Know what to do first: contain safely, preserve evidence and escalate.",
  [S("Simple incident flow","Your organization may use its own process, but a safe beginner flow is:",[
   "Recognize — identify suspicious signs.",
   "Report/escalate — contact the right security/support team.",
   "Contain — only perform approved safe containment.",
   "Preserve evidence — do not delete logs or messages unless instructed.",
   "Recover — follow approved repair/rebuild process.",
   "Document — record timeline, evidence and actions."
  ]),S("Do not investigate beyond your authority","Security incidents can have legal and business impact. Junior technicians should follow approved instructions instead of improvising invasive actions.",[])],
  [["Containment","Limiting spread/impact."],["Evidence","Information useful for understanding an incident."],["Timeline","Ordered record of events and actions."]],
  {title:"Mini Lab — Suspicious Link Incident",scenario:"A user clicked a suspicious link and entered a password.",
   tasks:["Tell them to stop interacting with the page.","Escalate immediately.","Follow approved credential reset/session revocation process.","Document time and actions."],
   questions:[
    Q("First principle after suspected compromise?",["Report and contain through approved process","Hide it","Delete all logs"],0,"Fast controlled response is safer than concealment."),
    Q("Should a junior technician perform unauthorized forensic actions?",["No","Yes always","Only without telling anyone"],0,"Stay within authorization and incident process."),
    Q("Why preserve evidence?",["It helps investigation and response","It makes Wi-Fi faster","It changes DNS"],0,"Evidence supports accurate incident analysis.")
   ]})
 ]
},

projects:{
 id:"projects",icon:"🗂️",title:"Project Portfolio",subtitle:"Build evidence: diagrams, ticket case studies, SOPs, small projects and final capstone.",
 finalLab:"professional-lab.html?lab=20",
 lessons:[
 L("pr-01","What Makes a Strong Technical Project?",7,"16 min","A project should show the problem, design, work, evidence and result.",
  [S("Five parts of a project","Use a consistent structure.",[
   "1. Goal — what you are trying to build or solve.",
   "2. Plan — topology, requirements or task list.",
   "3. Build — steps and configuration.",
   "4. Evidence — screenshots, test results, diagram or lab score.",
   "5. Reflection — what worked, what failed and what you learned."
  ]),S("Protect privacy","Remove passwords, internal secrets, private IP details when required by policy, personal data and confidential screenshots before publishing a portfolio.",[])],
  [["Evidence","Proof that work was completed/tested."],["Reflection","Short review of learning and improvement."],["Redaction","Removing sensitive information before sharing."]],
  {title:"Mini Lab — Design a Project Page",scenario:"Create a one-page record for a small LAN build.",
   tasks:["Write goal.","Add simple topology.","List tests.","Add reflection."],
   questions:[
    Q("What proves a project actually worked?",["Evidence/test results","Only a title","A password"],0,"Evidence shows the build and verification."),
    Q("What should be removed before publishing?",["Sensitive/private information","Learning summary","Project title"],0,"Protect confidential data."),
    Q("Why add reflection?",["To show learning and improvement","To hide failures","To increase IP speed"],0,"Reflection turns activity into learning.")
   ]}),
 L("pr-02","Network Diagram, Asset List & Handover",8,"20 min","Create documentation that another technician can use.",
  [S("Simple network diagram","Use clear icons/labels for internet/ISP, firewall/router, switches, APs, servers/printers and endpoints. Show important links and VLAN/subnet labels when appropriate.",[
   "Avoid decorative complexity.",
   "Use consistent device names.",
   "Add a legend if symbols are not obvious."
  ]),S("Asset list and handover","Record asset ID, device type, model, location, owner/department, IP/MAC when appropriate, warranty/status and notes. A handover should state current state and next actions.",[])],
  [["Asset register","Inventory of managed devices."],["Topology diagram","Visual map of network devices and links."],["Handover note","Operational summary for the next technician."]],
  {title:"Mini Lab — Document a Small Office",scenario:"Office has router, switch, AP, printer and four PCs.",
   tasks:["Draw topology.","Create five-column asset table.","Write one paragraph handover."],
   questions:[
    Q("A useful network diagram should show?",["Important devices and links","Only colors","User passwords"],0,"Diagrams should communicate topology."),
    Q("Asset records should have?",["Consistent identifiers and status","Random names only","Passwords"],0,"Consistent inventory supports support operations."),
    Q("Handover should include?",["Current state and next actions","Only 'done'","Secret keys"],0,"The next technician needs actionable context.")
   ]}),
 L("pr-03","Build an IT Support Case Study",9,"18 min","Turn a real or simulated support ticket into a professional learning artifact.",
  [S("Case study format","Use Situation → Evidence → Diagnosis → Action → Verification → Lesson.",[
   "Do not invent steps.",
   "Include exact non-sensitive error messages when useful.",
   "Explain why you chose each test.",
   "Show what ruled out other causes."
  ])],
  [["Case study","Structured description of a problem and resolution."],["Diagnosis","Reasoned identification of the likely cause."]],
  {title:"Mini Lab — Printer Case Study",scenario:"Printer IP changed and Windows kept the old TCP/IP port.",
   tasks:["Write symptom.","Write evidence: ping/new printer IP.","Write fix: update port.","Write verification: test page."],
   questions:[
    Q("What makes a case study useful?",["Reasoning plus evidence","Only final answer","Passwords"],0,"The reasoning is part of the learning."),
    Q("Should you invent a test you did not run?",["No","Yes","Only for presentation"],0,"Technical documentation must remain factual."),
    Q("What closes the case?",["Verification","Guessing","Deleting the ticket"],0,"Verification proves resolution.")
   ]}),
 L("pr-04","Class 10 Capstone — Junior IT Technician",10,"24 min","Combine networking, support, Windows, security, AI and documentation.",
  [S("Capstone idea","Build and support a simulated small office.",[
   "Create network topology and address plan.",
   "Configure endpoints/printer/Wi-Fi in the virtual lab.",
   "Solve at least two injected faults.",
   "Write one support ticket and one SOP.",
   "Use AI for a checklist, then verify the AI output.",
   "Complete handover documentation."
  ]),S("Scoring mindset","Diagnosis 30%, Configuration 30%, Verification 20%, Documentation 10%, Safe Working 10%.",[])],
  [["Capstone","Final integrated project demonstrating multiple skills."],["Handover","Evidence/documentation transferred at completion."]],
  {title:"Mini Lab — Capstone Readiness",scenario:"Before the final lab, verify you can explain each major skill area.",
   tasks:["Explain IP/gateway/DNS.","Explain printer TCP/IP port.","Explain safe remote support.","Explain MFA/phishing response.","Explain verification/documentation."],
   questions:[
    Q("What is the capstone testing?",["Integrated technician skills","Only typing speed","Only memorization"],0,"The capstone combines several skill domains."),
    Q("What percentage is Verification in the lab scoring model?",["20%","0%","90%"],0,"Verification is 20% in the defined model."),
    Q("What should accompany the final technical build?",["Documentation and handover","No notes","Passwords"],0,"Professional work includes documentation.")
   ]})
 ]
},

passport:{
 id:"passport",icon:"🛂",title:"Skill Passport",subtitle:"Track course learning, labs, exams, evidence and Professional IT & AI certificate readiness.",
 finalLab:"final-certificate.html",
 lessons:[
 L("sp-01","Understand Your Skill Passport",7,"14 min","The passport is your map of what you studied, practised and proved.",
  [S("Four evidence types","A strong learning record uses more than one type of evidence.",[
   "Course lessons — understanding and terminology.",
   "Mini labs — quick checks after each lesson.",
   "Professional Virtual Labs — deeper hands-on practice and saved scores.",
   "Exams/projects — formal assessment and evidence."
  ]),S("Progress is not the same as mastery","Completing a lesson means you finished that learning step. Keep practising weak areas and repeat labs to improve.",[])],
  [["Competency","A skill demonstrated to an expected standard."],["Evidence","Proof of learning or performance."],["Mastery","Consistent ability, not just one completion."]],
  {title:"Mini Lab — Choose Good Evidence",scenario:"You claim you can troubleshoot IP addressing.",
   tasks:["Use lesson completion.","Use Virtual Lab score.","Use a short ticket or screenshot showing verification."],
   questions:[
    Q("Which is stronger evidence than saying 'I know networking'?",["Completed lab with verification","A blank page","A password"],0,"Demonstrated work is stronger than a claim."),
    Q("Can a weak lab be repeated?",["Yes","No","Never"],0,"Practice and improved scores are part of learning."),
    Q("What does course completion mean?",["The learning step was completed, not automatic expert mastery","You know everything forever","No more practice needed"],0,"Skills grow through repetition and real use.")
   ]}),
 L("sp-02","Professional Lab & Exam Readiness",8,"16 min","Prepare for assessment by understanding, practising and then testing yourself.",
  [S("Before an exam","Review notes, repeat weak mini labs and use Professional Virtual Lab for hands-on topics.",[
   "Do not memorize answers without understanding the concept.",
   "Know how to verify a result.",
   "During active exams, the Tech AI helper is intentionally hidden."
  ]),S("Mandatory gates","The final Professional IT & AI Skills Certificate follows required gates. Monthly Exam 1, 2 and 3 must pass; required tests/labs must be completed; Class 10 capstone must pass.",[])],
  [["Gate","Mandatory requirement that must be satisfied."],["Readiness","Preparedness based on completed learning/practice."]],
  {title:"Mini Lab — Build a Revision Plan",scenario:"Your networking lab is strong but printer and Outlook topics are weak.",
   tasks:["Repeat printer lesson/lab.","Repeat Outlook lesson/lab.","Then take the assigned exam when ready."],
   questions:[
    Q("If a mandatory exam fails, can a high average alone unlock the final certificate?",["No","Yes","Always"],0,"Mandatory gates must be passed."),
    Q("What should you do with a weak topic?",["Review and repeat practice","Hide it","Skip all future learning"],0,"Targeted repetition improves readiness."),
    Q("Is Tech AI available during an active exam?",["No","Yes for answers","Only for passwords"],0,"The assistant is hidden during active exams.")
   ]}),
 L("sp-03","Build Your Evidence Portfolio",9,"16 min","Collect concise evidence that shows what you can actually do.",
  [S("Good evidence examples","Keep it professional and privacy-safe.",[
   "Small network diagram and address plan.",
   "Lab score plus a short explanation of what you configured.",
   "Printer troubleshooting case study.",
   "Outlook/M365 support SOP.",
   "Cybersecurity awareness incident response checklist.",
   "Capstone handover."
  ]),S("Name your files clearly","Use titles such as Network-Lab-VLAN.pdf or Printer-Troubleshooting-Case.md instead of random names.",[])],
  [["Portfolio","Collection of project/evidence artifacts."],["Artifact","A document, screenshot, diagram or other produced evidence."]],
  {title:"Mini Lab — Pick Three Artifacts",scenario:"Choose three artifacts for a junior IT support portfolio.",
   tasks:["One networking artifact.","One support artifact.","One documentation/security artifact."],
   questions:[
    Q("What should a portfolio artifact avoid?",["Secrets and private data","Clear title","Verification evidence"],0,"Published evidence must be privacy-safe."),
    Q("A good file name should be?",["Clear and descriptive","Untitled-final-final2","A password"],0,"Clear names improve professional organization."),
    Q("What makes an artifact valuable?",["It demonstrates a skill with evidence","It is very colorful","It contains credentials"],0,"Evidence of skill is the purpose.")
   ]}),
 L("sp-04","Final Certificate Readiness",10,"18 min","Use the certificate center only after required learning, exams, labs and capstone are ready.",
  [S("Professional certificate gates","For Class 7–10, the target is the Professional IT & AI Skills Certificate.",[
   "Monthly Exam 1 — PASS required.",
   "Monthly Exam 2 — PASS required.",
   "Monthly Exam 3 — PASS required.",
   "All required tests — complete/pass.",
   "Practical lab requirements — satisfied.",
   "Class 10 capstone — PASS required."
  ]),S("Why gates matter","A certificate should represent demonstrated completion, not only a high average. Missing mandatory work keeps the certificate locked.",[])],
  [["Certificate gate","Mandatory requirement for certificate eligibility."],["Capstone","Final integrated practical build."]],
  {title:"Mini Lab — Readiness Check",scenario:"A Class 10 student has strong lab scores but Monthly Exam 2 is not passed.",
   tasks:["Identify the missing gate.","Plan revision/retest according to academy rules.","Do not treat average score as a replacement for the mandatory pass."],
   questions:[
    Q("Is Monthly Exam 2 mandatory?",["Yes","No","Only for Class 7"],0,"All three monthly exams are mandatory gates."),
    Q("Is the Class 10 capstone required for final Professional certificate readiness?",["Yes","No","Never"],0,"Class 10 capstone must pass."),
    Q("Where should final readiness be checked?",["Certificate Center","Printer queue","BIOS"],0,"The Certificate Center summarizes gate readiness.")
   ]})
 ]
}
};

let profile=null;
let activeCourseId=null;
let activeLessonId=null;
let currentView="notes";
let labAnswers={};
let lastLabResult=null;

function createOverlay(){
 if($("proLearningOverlay"))return;
 const wrap=document.createElement("section");
 wrap.id="proLearningOverlay";
 wrap.className="pro-learning-overlay";
 wrap.setAttribute("aria-hidden","true");
 wrap.innerHTML=`
  <header class="pro-learning-topbar">
    <button id="proLearningBack" class="pro-learning-back" type="button">← Course Home</button>
    <div class="pro-learning-title">
      <small>PROFESSIONAL GUIDED LEARNING</small>
      <b id="proLearningHeaderTitle">Technology Course</b>
      <span id="proLearningHeaderSub">Lesson → Mini Lab → Next Chapter</span>
    </div>
    <button id="proLearningClose" class="pro-learning-close" type="button" aria-label="Close">×</button>
  </header>
  <div class="pro-learning-layout">
    <aside id="proCourseSidebar" class="pro-course-sidebar"></aside>
    <main id="proLearningMain" class="pro-learning-main"></main>
  </div>`;
 document.body.appendChild(wrap);
 $("proLearningClose").onclick=closeOverlay;
 $("proLearningBack").onclick=()=>renderCourseHome(activeCourseId);
 wrap.addEventListener("click",e=>{
   const nav=e.target.closest("[data-pro-lesson]");
   if(nav){
     const id=nav.dataset.proLesson;
     if(nav.classList.contains("locked"))return;
     openLesson(id);
   }
   const start=e.target.closest("[data-start-lab]");
   if(start){startMiniLab()}
   const submit=e.target.closest("[data-submit-lab]");
   if(submit){submitMiniLab()}
   const retry=e.target.closest("[data-retry-lab]");
   if(retry){startMiniLab()}
   const next=e.target.closest("[data-next-lesson]");
   if(next){openLesson(next.dataset.nextLesson)}
   const resume=e.target.closest("[data-resume-course]");
   if(resume){openLesson(resume.dataset.resumeCourse)}
   const courseExam=e.target.closest("[data-course-exam]");
   if(courseExam){startCourseExam()}
   const courseExamSubmit=e.target.closest("[data-course-exam-submit]");
   if(courseExamSubmit){submitCourseExam()}
  });
 document.addEventListener("keydown",e=>{
   if(e.key==="Escape"&&wrap.classList.contains("open"))closeOverlay()
 });
}

async function getProfile(){
 if(profile)return profile;
 if(!TOKEN)return null;
 try{
   const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"});
   const d=await r.json().catch(()=>({}));
   if(r.ok&&d.role==="student"&&d.profile){profile=d.profile;return profile}
 }catch{}
 return null;
}
function stateKey(){
 return `brightbyte_prof_learning_v43_${profile?.user_id||profile?.username||"student"}`;
}
function loadState(){
 try{return JSON.parse(localStorage.getItem(stateKey())||"{}")||{}}catch{return{}}
}
function saveState(s){
 try{localStorage.setItem(stateKey(),JSON.stringify(s))}catch{}
}
function courseState(courseId){
 const s=loadState();s.courses=s.courses||{};
 s.courses[courseId]=s.courses[courseId]||{completed:[],last:null};
 return {root:s,course:s.courses[courseId]};
}
function markComplete(courseId,lessonId,score){
 const x=courseState(courseId);
 if(!x.course.completed.includes(lessonId))x.course.completed.push(lessonId);
 x.course.last=lessonId;
 x.course.scores=x.course.scores||{};
 x.course.scores[lessonId]=Math.max(Number(x.course.scores[lessonId]||0),Number(score||0));
 saveState(x.root);
}
function isComplete(courseId,lessonId){
 return courseState(courseId).course.completed.includes(lessonId);
}
function lessonIndex(course,id){return course.lessons.findIndex(x=>x.id===id)}
function isClassAllowed(lesson){
 return Number(profile?.class_number||10)>=Number(lesson.minClass||7)
}
function isUnlocked(course,index){
 const lesson=course.lessons[index];
 if(!isClassAllowed(lesson))return false;
 if(index===0)return true;
 const prev=course.lessons[index-1];
 if(!isClassAllowed(prev))return true;
 return isComplete(course.id,prev.id);
}
function courseProgress(course){
 const allowed=course.lessons.filter(isClassAllowed);
 const done=allowed.filter(l=>isComplete(course.id,l.id)).length;
 return {done,total:allowed.length,pct:allowed.length?Math.round(done/allowed.length*100):0};
}
function firstResume(course){
 for(let i=0;i<course.lessons.length;i++){
   if(isUnlocked(course,i)&&!isComplete(course.id,course.lessons[i].id))return course.lessons[i];
 }
 const allowed=course.lessons.filter(isClassAllowed);
 return allowed[allowed.length-1]||course.lessons[0];
}
function openOverlay(courseId){
 const course=COURSES[courseId];if(!course)return;
 activeCourseId=courseId;activeLessonId=null;currentView="home";
 const overlay=$("proLearningOverlay");
 overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");
 document.body.classList.add("pro-learning-open");
 $("proLearningHeaderTitle").textContent=course.title;
 $("proLearningHeaderSub").textContent=course.subtitle;
 renderCourseHome(courseId);
}
function closeOverlay(){
 const overlay=$("proLearningOverlay");if(!overlay)return;
 overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");
 document.body.classList.remove("pro-learning-open");
 activeCourseId=null;activeLessonId=null;currentView="notes";
 document.title="Professional Technology Command Center — Tannu Sir's Kids Digital Academy";
}
function renderSidebar(course){
 const p=courseProgress(course);
 $("proCourseSidebar").innerHTML=`
  <article class="pro-course-card">
    <div class="icon">${course.icon}</div>
    <h2>${esc(course.title)}</h2>
    <p>${esc(course.subtitle)}</p>
    <div class="pro-course-progress">
      <div class="pro-course-progress-top"><span>${p.done}/${p.total} chapters complete</span><b>${p.pct}%</b></div>
      <div class="pro-progress-track"><i style="width:${p.pct}%"></i></div>
    </div>
  </article>
  <span class="pro-outline-label">COURSE OUTLINE</span>
  <div class="pro-lesson-list">
    ${course.lessons.map((l,i)=>{
      const classLock=!isClassAllowed(l),seqLock=!isUnlocked(course,i),locked=classLock||seqLock;
      const done=isComplete(course.id,l.id);
      return `<button class="pro-lesson-nav ${activeLessonId===l.id?"active":""} ${locked?"locked":""}" type="button" data-pro-lesson="${l.id}">
        <span class="num">${String(i+1).padStart(2,"0")}</span>
        <span><b>${esc(l.title)}</b><small>Class ${l.minClass}+ • ${esc(l.duration)}</small></span>
        <span class="state">${done?"✅":classLock?"🎓":seqLock?"🔒":"▶"}</span>
      </button>`;
    }).join("")}
  </div>`;
}
function renderCourseHome(courseId){
 const course=COURSES[courseId];if(!course)return;
 activeCourseId=courseId;activeLessonId=null;currentView="home";
 renderSidebar(course);
 const p=courseProgress(course),resume=firstResume(course);
 $("proLearningMain").innerHTML=`
  <div class="pro-reader-shell">
    <section class="pro-reader-hero">
      <span class="eyebrow">GUIDED TECHNOLOGY COURSE</span>
      <h1>${course.icon} ${esc(course.title)}</h1>
      <p>${esc(course.subtitle)} Study each chapter in simple English, open the large visual/photo-style guides, complete the mini lab, then unlock the next chapter.</p>
      <div class="pro-reader-meta">
        <span>${course.lessons.length} CHAPTERS</span><span>NOTES + MINI LABS</span>
        <span>CLASS ${profile?.class_number||"7–10"}</span><span>${p.pct}% COMPLETE</span>
      </div>
    </section>
    <div class="pro-learning-grid">
      <div class="pro-note-stack">
        <article class="pro-note-card media-ready">
          <h2>How this course works</h2>
          <ol>
            <li>Read the chapter notes and examples.</li>
            <li>Open the visual guide if you want equipment pictures and guided walkthroughs.</li>
            <li>Review the key terms on the right.</li>
            <li>Start the mini lab at the end of the chapter.</li>
            <li>Score at least 67% to complete the chapter.</li>
            <li>The next chapter unlocks automatically.</li>
          </ol>
          <div class="pro-key-callout">This guided course is for understanding first. The separate Professional Virtual Lab is the deeper hands-on environment.</div>
          <div class="pro-media-bar"><button class="pro-media-btn" type="button" data-media-title="${esc(course.title)} Visual Starter" data-media-source="${esc(course.title+' '+course.subtitle)}">🖼️ Open course visual guide <span>photos-style cards + training steps</span></button></div>
        </article>
        <article class="pro-note-card">
          <h2>Your current progress</h2>
          <p>You have completed <b>${p.done}</b> of <b>${p.total}</b> chapters currently available for your class.</p>
          <div class="pro-progress-track" style="height:12px;margin-top:12px"><i style="width:${p.pct}%"></i></div>
        </article>
      </div>
      <aside class="pro-side-column">
        <article class="pro-side-card">
          <h3>Recommended next step</h3>
          <p>${esc(resume.title)}</p>
          <div class="pro-reader-actions" style="justify-content:flex-start">
            <button class="primary" type="button" data-resume-course="${resume.id}">▶ ${isComplete(course.id,resume.id)?"Review Chapter":"Start / Resume"}</button>
          </div>
        </article>
        <article class="pro-side-card">
          <h3>Practical & optional exam</h3>
          <p>Open only this subject's practical missions. The lab page will not mix other subjects into the mission list.</p>
          <div class="pro-course-tools">
            <a class="lab" href="professional-lab.html?track=${course.id}">🧪 Subject Lab</a>
            <button class="exam" type="button" data-course-exam>📝 Optional Course Exam</button>
          </div>
        </article>
      </aside>
    </div>
  </div>`;
 $("proLearningMain").scrollTop=0;
 bindMediaLaunchers();
}
function renderDiagram(items){
 if(!items?.length)return"";
 return `<div class="pro-path-diagram">${items.map((x,i)=>`${i?'<i></i>':''}<span>${esc(x)}</span>`).join("")}</div>`;
}
function cableDiagram(){
 const A=[["wg","White/Green"],["g","Green"],["wo","White/Orange"],["b","Blue"],["wb","White/Blue"],["o","Orange"],["wbr","White/Brown"],["br","Brown"]];
 const B=[["wo","White/Orange"],["o","Orange"],["wg","White/Green"],["b","Blue"],["wb","White/Blue"],["g","Green"],["wbr","White/Brown"],["br","Brown"]];
 const box=(name,arr)=>`<div class="pro-cable-standard"><h4>${name}</h4>${arr.map((x,i)=>`<div class="pro-wire-row"><b>${i+1}</b><span class="pro-wire-dot ${x[0]}"></span><span>${x[1]}</span></div>`).join("")}</div>`;
 return `<div class="pro-cable-box">${box("T568A pin order",A)}${box("T568B pin order",B)}</div>`;
}
function renderSection(s){
 const mediaText=[s.title,s.text||'',...(s.bullets||[])].join(' ');
 return `<article class="pro-note-card media-ready">
   <h2>${esc(s.title)}</h2>
   ${s.text?`<p>${esc(s.text)}</p>`:""}
   ${s.bullets?.length?`<ul>${s.bullets.map(x=>`<li>${x}</li>`).join("")}</ul>`:""}
   ${s.callout?`<div class="pro-key-callout">${esc(s.callout)}</div>`:""}
   ${s.cable?cableDiagram():""}
   <div class="pro-media-bar"><button class="pro-media-btn" type="button" data-media-title="${esc(s.title)}" data-media-source="${esc(mediaText)}">🖼️ Open Visual Guide <span>large equipment cards + walkthrough</span></button></div>
 </article>`;
}
function openLesson(id){
 const course=COURSES[activeCourseId];if(!course)return;
 const idx=lessonIndex(course,id);if(idx<0||!isUnlocked(course,idx))return;
 const l=course.lessons[idx];
 activeLessonId=id;currentView="notes";labAnswers={};lastLabResult=null;
 renderSidebar(course);
 document.title=`${l.title} — ${course.title}`;
 $("proLearningMain").innerHTML=`
  <div class="pro-reader-shell">
    <section class="pro-reader-hero">
      <span class="eyebrow">${esc(course.title.toUpperCase())} • CHAPTER ${idx+1}</span>
      <h1>${esc(l.title)}</h1>
      <p>${esc(l.summary)}</p>
      <div class="pro-reader-meta">
        <span>CLASS ${l.minClass}+</span><span>${esc(l.duration)}</span><span>NOTES</span><span>MINI LAB</span><span>VISUAL GUIDE</span>
        ${isComplete(course.id,l.id)?'<span>✅ COMPLETED</span>':''}
      </div>
      ${renderDiagram(l.diagram||[])}
    </section>
    <div class="pro-learning-grid">
      <div class="pro-note-stack">
        ${l.sections.map(renderSection).join("")}
        <article class="pro-note-card media-ready">
          <h2>Ready for the mini lab?</h2>
          <p>Finish reading first. The mini lab checks only the main ideas from this chapter.</p>
          <div class="pro-reader-actions">
            <button class="primary" type="button" data-start-lab>🧪 Start Chapter Mini Lab</button>
          </div>
          <div class="pro-media-bar"><button class="pro-media-btn" type="button" data-media-title="${esc(l.title)} Visual Recap" data-media-source="${esc(l.title+' '+l.summary+' '+(l.terms||[]).map(t=>t[0]).join(' '))}">🖼️ Open lesson visual guide <span>equipment cards + walkthrough recap</span></button></div>
        </article>
      </div>
      <aside class="pro-side-column">
        <article class="pro-side-card">
          <h3>Key terms</h3>
          <div class="pro-term-list">${l.terms.map(t=>`<button class="pro-term-button" type="button" data-media-title="${esc(t[0])}" data-media-source="${esc(t[0]+' '+t[1])}"><b>${esc(t[0])}</b><small>${esc(t[1])}</small></button>`).join("")}</div>
        </article>
        <article class="pro-side-card">
          <h3>Learning pattern</h3>
          <ul><li>Understand the normal behavior.</li><li>Open the visuals and connect theory to the device.</li><li>Configure or identify the correct setting.</li><li>Troubleshoot using evidence.</li><li>Verify and document.</li></ul>
        </article>
      </aside>
    </div>
  </div>`;
 $("proLearningMain").scrollTop=0;
 bindMediaLaunchers();
}
function startMiniLab(){
 const course=COURSES[activeCourseId],l=course?.lessons.find(x=>x.id===activeLessonId);if(!l)return;
 currentView="lab";labAnswers={};lastLabResult=null;
 renderSidebar(course);
 $("proLearningMain").innerHTML=`
  <div class="pro-reader-shell">
    <section class="pro-reader-hero">
      <span class="eyebrow">${esc(course.title.toUpperCase())} • CHAPTER MINI LAB</span>
      <h1>🧪 ${esc(l.lab.title)}</h1>
      <p>${esc(l.lab.scenario)}</p>
      <div class="pro-reader-meta"><span>${l.lab.questions.length} CHECK QUESTIONS</span><span>PASS: 67%</span><span>SIMPLE PRACTICE</span></div>
    </section>
    <article class="pro-lab-card" style="margin-top:14px">
      <div class="pro-lab-head"><div><h2>Practical task</h2><p>Do these steps on paper, in your head, or in the related simulator.</p></div><span>GUIDED</span></div>
      <div class="pro-task-box"><ul>${l.lab.tasks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
      <div id="proLabQuestions">
        ${l.lab.questions.map((q,qi)=>`
          <section class="pro-question" data-q="${qi}">
            <h3>${qi+1}. ${esc(q.q)}</h3>
            <div class="pro-options">${q.options.map((o,oi)=>`<button type="button" class="pro-option" data-lab-q="${qi}" data-lab-a="${oi}">${esc(o)}</button>`).join("")}</div>
            <div class="pro-explain" id="proExplain${qi}"></div>
          </section>`).join("")}
      </div>
      <div class="pro-reader-actions">
        <button type="button" onclick="window.__proLearnBackToNotes&&window.__proLearnBackToNotes()">← Back to Notes</button>
        <button class="primary" type="button" data-submit-lab>✅ Check My Lab</button>
      </div>
    </article>
  </div>`;
 $("proLearningMain").scrollTop=0;
 document.querySelectorAll("[data-lab-q]").forEach(b=>{
   b.onclick=()=>{
     const qi=Number(b.dataset.labQ),ai=Number(b.dataset.labA);
     labAnswers[qi]=ai;
     document.querySelectorAll(`[data-q="${qi}"] .pro-option`).forEach(x=>x.classList.remove("selected"));
     b.classList.add("selected");
   };
 });
 window.__proLearnBackToNotes=()=>openLesson(activeLessonId);
}
function submitMiniLab(){
 const course=COURSES[activeCourseId],l=course?.lessons.find(x=>x.id===activeLessonId);if(!l)return;
 const total=l.lab.questions.length;
 if(Object.keys(labAnswers).length<total){
   alert(`Please answer all ${total} questions first.`);
   return;
 }
 let correct=0;
 l.lab.questions.forEach((q,qi)=>{
   const chosen=labAnswers[qi],ok=chosen===q.answer;
   if(ok)correct++;
   document.querySelectorAll(`[data-q="${qi}"] .pro-option`).forEach((b,oi)=>{
     b.classList.remove("correct","wrong");
     if(oi===q.answer)b.classList.add("correct");
     else if(oi===chosen&&!ok)b.classList.add("wrong");
     b.disabled=true;
   });
   const exp=$(`proExplain${qi}`);
   if(exp)exp.textContent=(ok?"Correct. ":"Review: ")+q.explain;
 });
 const score=Math.round(correct/total*100),passed=score>=67;
 lastLabResult={score,passed};
 if(passed)markComplete(course.id,l.id,score);
 renderSidebar(course);
 const idx=lessonIndex(course,l.id),next=course.lessons[idx+1];
 const nextAllowed=next&&isClassAllowed(next);
 const result=document.createElement("article");
 result.className="pro-result-card";
 result.style.marginTop="14px";
 result.innerHTML=`
   <div class="pro-score-ring" style="--score:${score}%"><b>${score}%</b></div>
   <h2>${passed?"Chapter Complete ✅":"Review and Retry 📘"}</h2>
   <p>${passed?"Good work. The next available chapter is now unlocked.":"Read the notes again and retry the mini lab. You need at least 67%."}</p>
   <div class="pro-reader-actions" style="justify-content:center">
     ${passed&&next&&nextAllowed?`<button class="success" type="button" data-next-lesson="${next.id}">Next Chapter →</button>`:""}
     ${passed&&(!next||!nextAllowed)?`<button class="success" type="button" data-resume-course="${firstResume(course).id}">Course Progress</button>`:""}
     <button type="button" data-retry-lab>↻ Retry Lab</button>
     <a href="professional-lab.html?track=${course.id}">Subject Practical Lab</a>
   </div>`;
 $("proLearningMain").querySelector(".pro-lab-card").after(result);
 if(passed&&!next){
   const done=document.createElement("section");
   done.className="pro-course-complete";
   done.innerHTML=`<h2>🎉 ${esc(course.title)} guided course complete</h2><p>You have completed every chapter currently available in this course. Continue with the Professional Virtual Lab, exams and project evidence.</p>`;
   result.after(done);
 }
 result.scrollIntoView({behavior:"smooth",block:"center"});
}


function courseExamQuestions(course){
 const lessons=course.lessons.filter(isClassAllowed),qs=[];
 for(const l of lessons){
   const q=l.lab?.questions?.[0];
   if(q)qs.push({lesson:l.title,...q});
   if(qs.length>=5)break;
 }
 return qs;
}
function startCourseExam(){
 const course=COURSES[activeCourseId];if(!course)return;
 const qs=courseExamQuestions(course);window.__proCourseExamAnswers={};
 $("proLearningMain").innerHTML=`<div class="pro-reader-shell">
  <section class="pro-reader-hero"><span class="eyebrow">${esc(course.title.toUpperCase())} • OPTIONAL CHECK</span><h1>📝 ${esc(course.title)} Optional Exam</h1><p>This practice check does not replace assigned Exam Center tests.</p><div class="pro-reader-meta"><span>${qs.length} QUESTIONS</span><span>OPTIONAL</span><span>PASS GUIDE: 60%</span></div></section>
  <article class="pro-course-exam-card"><h2>Course Knowledge Check</h2><p>Choose one answer for every question.</p>
   ${qs.map((q,qi)=>`<section class="pro-exam-question" data-ce-q="${qi}"><h3>${qi+1}. ${esc(q.q)}</h3><div class="pro-options">${q.options.map((o,oi)=>`<button type="button" class="pro-option" data-ce-choice="${qi}" data-ce-answer="${oi}">${esc(o)}</button>`).join("")}</div></section>`).join("")}
   <div class="pro-reader-actions"><button type="button" data-resume-course="${firstResume(course).id}">← Back to Course</button><button class="primary" type="button" data-course-exam-submit>Check Score</button></div><div id="proCourseExamResult"></div>
  </article></div>`;
 $("proLearningMain").scrollTop=0;
 document.querySelectorAll("[data-ce-choice]").forEach(b=>{
   b.onclick=()=>{
     const qi=Number(b.dataset.ceChoice),ai=Number(b.dataset.ceAnswer);
     window.__proCourseExamAnswers[qi]=ai;
     document.querySelectorAll(`[data-ce-q="${qi}"] .pro-option`).forEach(x=>x.classList.remove("selected"));
     b.classList.add("selected");
   };
 });
}
function submitCourseExam(){
 const course=COURSES[activeCourseId];if(!course)return;
 const qs=courseExamQuestions(course),a=window.__proCourseExamAnswers||{};
 if(Object.keys(a).length<qs.length){alert(`Please answer all ${qs.length} questions first.`);return}
 let correct=0;
 qs.forEach((q,qi)=>{
   const chosen=Number(a[qi]);if(chosen===q.answer)correct++;
   document.querySelectorAll(`[data-ce-q="${qi}"] .pro-option`).forEach((b,oi)=>{
     b.disabled=true;b.classList.remove("correct","wrong");
     if(oi===q.answer)b.classList.add("correct");else if(oi===chosen)b.classList.add("wrong");
   });
 });
 const score=Math.round(correct/qs.length*100);
 const x=courseState(course.id);x.course.optionalExamScore=Math.max(Number(x.course.optionalExamScore||0),score);saveState(x.root);
 const box=$("proCourseExamResult");
 if(box)box.innerHTML=`<div class="pro-course-exam-result"><b>${score}%</b><p>${score>=60?"Good practice result. Continue to the subject practical lab when ready.":"Review the guided notes and retry when ready."}</p><div class="pro-course-tools" style="max-width:520px;margin:12px auto 0"><a class="lab" href="professional-lab.html?track=${course.id}">🧪 Open ${esc(course.title)} Lab</a><button type="button" data-course-exam>↻ Retry Exam</button></div></div>`;
}

function bindMediaLaunchers(scope=document){
 scope.querySelectorAll('[data-media-source]').forEach(btn=>{
   btn.onclick=()=>openMediaModal(btn.dataset.mediaTitle||'Technology Visual Guide', btn.dataset.mediaSource||'', 'Large photo-style cards and a video-style walkthrough help students understand the equipment or concept before the lab.');
 });
}

async function interceptDeck(e){
 const card=e.target.closest(".control-deck .deck-card[data-workspace]");
 if(!card)return;
 const id=card.dataset.workspace;
 if(!COURSES[id])return;
 e.preventDefault();e.stopImmediatePropagation();
 await getProfile();
 openOverlay(id);
}
async function boot(){
 createOverlay();
 ensureMediaModal();
 document.addEventListener("click",interceptDeck,true);
 getProfile();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();

})();
