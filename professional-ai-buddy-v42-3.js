(() => {
"use strict";

if(window.ProfessionalTechBuddy) return;

const API_CHAT =
  window.TANNU_KIDS_AI_CHAT_URL ||
  "https://it-chatbot-app.tanweerstudy25.workers.dev/chat";

const PLATFORM_CONTEXT = `
Tannu Sir's Kids Digital Academy — Professional Technology Program for Classes 7–10.

PROGRAM STAGES:
- Class 7: Explore & Understand.
- Class 8: Install & Configure.
- Class 9: Troubleshoot & Support.
- Class 10: Build, Network & Solve.

TECHNOLOGY TRACKS:
1. Computer Hardware Architecture.
2. PC Assembly & Upgrade.
3. BIOS / UEFI & Boot.
4. Windows Installation & Recovery.
5. Drivers & Device Manager.
6. Printer Installation.
7. Printer & Scanner Troubleshooting.
8. Outlook 365 Configuration.
9. Email Protocols & Troubleshooting: SMTP, IMAP, TLS, authentication and MFA.
10. Microsoft 365 & Cloud Services: OneDrive, Teams, SaaS and identity concepts.
11. LAN Fundamentals.
12. IP Addressing & DHCP, including APIPA 169.254.
13. Switching & VLAN Basics.
14. Routing Basics.
15. LAN / WAN / Internet Path.
16. Wi-Fi & Wireless.
17. Network Troubleshooting CLI: ipconfig /all, ping, tracert, nslookup, release, renew and flushdns.
18. IT Help Desk & Ticket Handling.
19. Remote Support & Communication.
20. Cybersecurity Essentials: phishing, MFA, passkeys, privacy, backups and incident reporting.
21. AI Skills for Technical Work.
22. AI for IT Support: troubleshooting checklists, ticket summaries, SOP drafts and log explanation.
23. No-Code Website & Web Infrastructure: domains, hosting, DNS and HTTPS.
24. IT Documentation & Inventory.

PRACTICAL PROGRAM:
- 20 Professional Labs.
- Students learn through Understand → Configure → Troubleshoot → Verify.
- Practical scoring considers diagnosis, configuration, verification, documentation and safe working.
- Class 10 includes a Junior IT Technician Capstone based on a small-office setup.

CERTIFICATION:
- Monthly Exam 1 must pass.
- Monthly Exam 2 must pass.
- Monthly Exam 3 must pass.
- All required tests must be completed/passed.
- Required practical labs must be completed.
- Class 10 capstone must pass.
- One high score cannot bypass a missing mandatory requirement.

IMPORTANT:
- This Class 7–10 program is technology-focused. It does not use the younger-student GK World, general games, Speak, Health or cartoon-course model.
- Never ask for passwords, OTPs, home addresses or private secrets.
- Explain concepts at an age-appropriate technical level.
- During an ACTIVE EXAM, do not answer exam questions or provide hints. Only explain exam rules or technical problems with the exam interface.
`.trim();

const LOCAL = [
  {
    keys:["ip address","ipv4","subnet","gateway","dhcp","apipa","169.254"],
    en:"IP addressing tells devices how to communicate on a network. A valid setup normally includes an IP address, subnet mask, default gateway and DNS. If Windows shows 169.254.x.x, it usually means the device did not receive a DHCP address, so check the physical link, DHCP service and adapter configuration.",
    hi:"IP addressing network me device ki pehchan aur communication ke liye hota hai. Normally IP address, subnet mask, default gateway aur DNS chahiye. Agar Windows me 169.254.x.x aaye, to aksar DHCP se address nahi mila hota hai—physical link, DHCP service aur adapter settings check karo."
  },
  {
    keys:["vlan","switching","switch","mac address"],
    en:"A switch connects devices inside a LAN and learns MAC addresses. A VLAN logically separates devices into different broadcast domains. Devices in different VLANs normally need Layer-3 routing to communicate.",
    hi:"Switch LAN ke andar devices ko connect karta hai aur MAC addresses learn karta hai. VLAN devices ko logically alag broadcast domains me divide karta hai. Different VLANs ke beech communication ke liye normally Layer-3 routing chahiye."
  },
  {
    keys:["routing","router","route","default gateway"],
    en:"Routing moves traffic between different IP networks. The default gateway is the router address an endpoint uses when the destination is outside its local subnet. A basic check is: verify IP/subnet, ping the gateway, then test the next network or internet path.",
    hi:"Routing different IP networks ke beech traffic move karta hai. Default gateway woh router address hota hai jise endpoint local subnet ke bahar traffic bhejne ke liye use karta hai. Basic check: IP/subnet verify karo, gateway ping karo, phir next network ya internet path test karo."
  },
  {
    keys:["ping","tracert","nslookup","ipconfig","flushdns","release","renew"],
    en:"Use ipconfig /all to inspect adapter settings, ping to test reachability, nslookup to test DNS resolution, tracert to see the hop-by-hop path, release/renew to refresh a DHCP lease and flushdns to clear the local DNS resolver cache.",
    hi:"ipconfig /all se adapter settings dekho, ping se reachability test karo, nslookup se DNS check karo, tracert se hop-by-hop path dekho, release/renew se DHCP lease refresh karo aur flushdns se local DNS cache clear karo."
  },
  {
    keys:["printer","scanner","offline","tcp/ip port","spooler"],
    en:"For a network printer, check power, network link, printer IP, PC-to-printer ping, Standard TCP/IP Port, driver and queue. If the printer IP changed but Windows still points to the old TCP/IP port, the printer can appear offline even though the network itself is working.",
    hi:"Network printer me power, network link, printer IP, PC se printer ping, Standard TCP/IP Port, driver aur queue check karo. Agar printer ka IP change ho gaya aur Windows old TCP/IP port use kar raha hai, printer offline dikh sakta hai jabki network theek ho."
  },
  {
    keys:["outlook","smtp","imap","email","mail","mfa"],
    en:"Outlook troubleshooting should separate connectivity, account/authentication, profile and mailbox behavior. SMTP is mainly used for sending mail, IMAP synchronizes mailbox folders, TLS protects communication in transit and MFA adds another authentication factor.",
    hi:"Outlook troubleshooting me connectivity, account/authentication, profile aur mailbox behavior ko alag-alag check karo. SMTP mainly mail send karne ke liye, IMAP mailbox folders sync karne ke liye, TLS communication protect karne ke liye aur MFA extra authentication factor ke liye hota hai."
  },
  {
    keys:["hardware","ram","ssd","cpu","motherboard","bios","uefi","device manager","driver"],
    en:"Hardware troubleshooting starts with the symptom and safe checks. Confirm power and connections, identify the affected component, inspect BIOS/UEFI or Device Manager when relevant, make one controlled change, then verify the result. For unknown devices, Hardware IDs can help identify the correct driver.",
    hi:"Hardware troubleshooting symptom se start karo. Power aur connections verify karo, affected component identify karo, zarurat par BIOS/UEFI ya Device Manager check karo, ek controlled change karo aur result verify karo. Unknown device me Hardware IDs correct driver identify karne me help kar sakta hai."
  },
  {
    keys:["help desk","ticket","incident","support","remote support","quick assist","handover"],
    en:"A professional support flow is: Receive → Clarify → Diagnose → Fix → Verify → Document. Good ticket notes record the issue, scope, checks, root cause, resolution and verification. For remote support, get permission first and let the user enter passwords themselves.",
    hi:"Professional support flow hai: Receive → Clarify → Diagnose → Fix → Verify → Document. Achhe ticket notes me issue, scope, checks, root cause, resolution aur verification likha jata hai. Remote support me pehle permission lo aur password user ko khud enter karne do."
  },
  {
    keys:["phishing","cyber","security","passkey","password","mfa","malware"],
    en:"Cybersecurity basics include recognizing phishing, using strong authentication such as MFA/passkeys, keeping systems updated, protecting backups and reporting suspicious activity. Never share passwords or OTPs in chat.",
    hi:"Cybersecurity basics me phishing ko identify karna, MFA/passkeys jaisi strong authentication use karna, systems update rakhna, backups protect karna aur suspicious activity report karna shamil hai. Chat me password ya OTP kabhi share mat karo."
  },
  {
    keys:["ai","prompt","hallucination","sop","artificial intelligence"],
    en:"AI can help with troubleshooting checklists, ticket summaries, SOP drafts and explanations, but every technical recommendation must be verified. Do not paste secrets or private information into AI tools, and record what you actually tested—not only what AI suggested.",
    hi:"AI troubleshooting checklist, ticket summary, SOP draft aur explanation me help kar sakta hai, lekin har technical recommendation verify karna zaroori hai. AI me secrets ya private information paste mat karo, aur jo actually test kiya wahi document karo."
  },
  {
    keys:["website","dns","domain","hosting","https","cloud"],
    en:"A website normally involves a domain name, DNS records and hosting. DNS maps names to services, hosting stores/serves the site and HTTPS encrypts browser-to-site traffic. Always check privacy, mobile layout and links before publishing.",
    hi:"Website me normally domain name, DNS records aur hosting hota hai. DNS name ko service se map karta hai, hosting site ko serve karta hai aur HTTPS browser-site traffic ko encrypt karta hai. Publish karne se pehle privacy, mobile layout aur links check karo."
  },
  {
    keys:["exam","monthly exam","test","certificate","skill passport","capstone"],
    en:"Certification is evidence-based. All three monthly exams must be passed, all required tests completed/passed, required practical labs completed and Class 10 must pass the final capstone. A high average cannot unlock the certificate if a mandatory item is missing.",
    hi:"Certification evidence-based hai. Teenon monthly exams pass hone chahiye, sab required tests complete/pass hone chahiye, required practical labs complete hone chahiye aur Class 10 me final capstone pass karna zaroori hai. Mandatory item missing ho to high average se certificate unlock nahi hoga."
  }
];

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").toLowerCase().replace(/\s+/g," ").trim();
const isHi=s=>/[\u0900-\u097F]/.test(String(s||"")) || /\b(kya|kaise|hai|hain|batao|samjhao|bhai|nahi|kyu|kar|karo|chahiye|mera|mujhe)\b/i.test(String(s||""));
let state={profile:null,open:false,turns:[]};

function activeExam(){
  if(!/student-exams\.html$/i.test(location.pathname)) return false;
  const exam=document.getElementById("examView");
  return !!exam && !exam.classList.contains("hidden");
}
function currentWorkspace(){
  const t=document.getElementById("workspaceTitle");
  if(t && document.getElementById("workspaceOverlay")?.classList.contains("open")) return t.textContent.trim();
  const m=document.getElementById("missionTitle");
  if(m && /professional-lab\.html$/i.test(location.pathname)) return m.textContent.trim();
  return document.title;
}
function pageIntro(){
  const path=location.pathname;
  if(/professional-lab\.html$/i.test(path)) return "I can explain the current lab, networking commands, device configuration, troubleshooting flow and safe verification steps.";
  if(/student-exams\.html$/i.test(path)) return "I can explain the Exam Center, exam rules and certification process. I will not answer active exam questions.";
  if(/final-certificate\.html$/i.test(path)) return "I can explain certificate requirements, monthly exams, tests, labs, capstone and Skill Passport evidence.";
  return "I can help with the Class 7–10 technology tracks: hardware, Windows, printers, Microsoft 365, networking, IT support, cybersecurity, AI, web/cloud, labs and certification.";
}
function buildUI(){
  if(document.getElementById("proTechBuddyBtn")) return;

  const btn=document.createElement("button");
  btn.id="proTechBuddyBtn";
  btn.type="button";
  btn.innerHTML='<span>🤖</span>Tech AI';
  btn.setAttribute("aria-label","Open Professional Tech AI");

  const panel=document.createElement("section");
  panel.id="proTechBuddyPanel";
  panel.setAttribute("aria-hidden","true");
  panel.innerHTML=`
    <header class="pro-buddy-head">
      <div class="pro-buddy-logo">T</div>
      <div><b>Professional Tech AI</b><small>Class 7–10 • page-aware technical helper</small></div>
      <button class="pro-buddy-close" type="button" aria-label="Close">×</button>
    </header>
    <div class="pro-buddy-messages" id="proBuddyMessages"></div>
    <div>
      <form class="pro-buddy-form" id="proBuddyForm">
        <input id="proBuddyInput" autocomplete="off" maxlength="600" placeholder="Ask about networking, Windows, printer, M365, support...">
        <button type="submit">Send</button>
      </form>
      <div class="pro-buddy-note">Never share passwords, OTPs, private addresses or secrets. AI answers should be verified in practical work.</div>
    </div>`;

  document.body.append(btn,panel);

  btn.onclick=()=>toggle(true);
  panel.querySelector(".pro-buddy-close").onclick=()=>toggle(false);
  panel.querySelector("#proBuddyForm").onsubmit=e=>{
    e.preventDefault();
    const input=panel.querySelector("#proBuddyInput");
    const q=input.value.trim();
    if(!q)return;
    input.value="";
    ask(q);
  };

  addBot(`${pageIntro()}\n\nWhat would you like to work on?`,["Network","Hardware","Printer","Outlook 365","IT Support","Cybersecurity","AI","Certificate"]);
}
function toggle(open){
  state.open=!!open;
  const p=document.getElementById("proTechBuddyPanel");
  if(!p)return;
  p.classList.toggle("open",state.open);
  p.setAttribute("aria-hidden",state.open?"false":"true");
  if(state.open)setTimeout(()=>document.getElementById("proBuddyInput")?.focus(),80)
}
function addMsg(role,text,chips=[]){
  const box=document.getElementById("proBuddyMessages");if(!box)return;
  const msg=document.createElement("div");
  msg.className=`pro-buddy-msg ${role}`;
  msg.textContent=text;
  box.appendChild(msg);

  if(chips.length){
    const row=document.createElement("div");
    row.className="pro-buddy-chips";
    chips.forEach(label=>{
      const b=document.createElement("button");
      b.type="button";b.textContent=label;b.onclick=()=>ask(label);
      row.appendChild(b);
    });
    box.appendChild(row);
  }
  box.scrollTop=box.scrollHeight;
}
const addBot=(t,c=[])=>addMsg("bot",t,c);
const addUser=t=>addMsg("user",t);

function localReply(q){
  const n=norm(q);
  const hi=isHi(q);

  if(/\b(what can you do|help me|kya kar sakte|kya kar sakta)\b/i.test(q)){
    return hi
      ? "Main Class 7–10 ke technology program me hardware, Windows, printer, Outlook/M365, networking, CLI commands, IT support, cybersecurity, AI, web/cloud, labs, exams aur certificate requirements explain kar sakta hoon."
      : "I can explain the Class 7–10 technology program: hardware, Windows, printers, Outlook/M365, networking, CLI commands, IT support, cybersecurity, AI, web/cloud, labs, exams and certificate requirements.";
  }

  if(/\b(this page|current page|ye page|is page)\b/i.test(q)){
    return hi ? `Abhi aap ${currentWorkspace()} me ho. ${pageIntro()}` : `You are currently in ${currentWorkspace()}. ${pageIntro()}`;
  }

  for(const item of LOCAL){
    if(item.keys.some(k=>n.includes(k))) return hi?item.hi:item.en;
  }
  return null;
}
async function remoteReply(q){
  if(!API_CHAT)return null;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(API_CHAT,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        message:q,
        classNumber:Number(state.profile?.class_number||7),
        topic:currentWorkspace(),
        mode:"professional-technology",
        language:isHi(q)?"hi":"en",
        pageTitle:String(document.title||"").slice(0,160),
        pagePath:String(location.pathname||"").slice(0,160),
        platformContext:PLATFORM_CONTEXT.slice(0,6500)
      }),
      cache:"no-store",
      signal:controller.signal
    });
    const d=await response.json().catch(()=>({}));
    return response.ok&&d?.text?String(d.text).trim():null
  }catch{return null}
  finally{clearTimeout(timer)}
}
async function ask(q){
  if(!q)return;
  addUser(q);

  if(activeExam()){
    addBot(
      isHi(q)
        ?"Active exam ke dauran main exam question ka answer ya hint nahi de sakta. Main sirf exam interface, timer, submission ya fair-exam rules explain kar sakta hoon."
        :"During an active exam I cannot answer exam questions or give hints. I can only explain the exam interface, timer, submission process or fair-exam rules."
    );
    return;
  }

  if(/\b(password|otp|one time password|home address|private key|secret key)\b/i.test(q)){
    addBot(
      isHi(q)
        ?"Password, OTP, address ya secret key chat me share mat karo. Main safe technical concepts aur troubleshooting me help kar sakta hoon."
        :"Do not share passwords, OTPs, addresses or secret keys in chat. I can help with safe technical concepts and troubleshooting instead."
    );
    return;
  }

  const local=localReply(q);
  if(local){
    addBot(local,["Give an example","Explain simply","Related lab"]);
    return;
  }

  addBot(isHi(q)?"Technical knowledge check kar raha hoon…":"Checking the professional technology knowledge…");
  const smart=await remoteReply(q);
  const box=document.getElementById("proBuddyMessages");
  if(box?.lastElementChild?.classList.contains("bot")) box.lastElementChild.remove();

  if(smart){
    addBot(smart,["Explain simply","Give an example","How do I verify?"]);
  }else{
    addBot(
      isHi(q)
        ?"Is question ka exact answer meri current Professional Technology knowledge me nahi mila. Aap hardware, Windows, printer, M365, networking, IT support, cybersecurity, AI, labs, exams ya certificate se related question poochho."
        :"I could not verify an exact answer from the current Professional Technology knowledge. Ask about hardware, Windows, printers, M365, networking, IT support, cybersecurity, AI, labs, exams or certification."
    )
  }
}

function init(profile){
  if(state.profile)return;
  state.profile=profile||{};
  buildUI();

  if(/student-exams\.html$/i.test(location.pathname)){
    const exam=document.getElementById("examView");
    if(exam){
      const watch=()=>document.body.classList.toggle("pro-active-exam",!exam.classList.contains("hidden"));
      new MutationObserver(watch).observe(exam,{attributes:true,attributeFilter:["class"]});
      watch();
    }
  }
}

window.ProfessionalTechBuddy={init,toggle,ask};

})();
