(() => {
"use strict";

const API="https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY="brightbyte_student_token";
const $=id=>document.getElementById(id);
const qa=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

let token=localStorage.getItem(TOKEN_KEY)||"";
let profile=null;
let classNo=4;
let battles=[];
let selectedMode="quick_quiz";
let selectedLevel=1;
let activeFilter="all";
let voiceOn=true;
let pollTimer=null;
let toastTimer=null;

const MODE_META={
  quick_quiz:{icon:"🧠",name:"Future Skills Quiz"},
  tech:{icon:"🔧",name:"Tech Troubleshooting"},
  safety:{icon:"🛡️",name:"Cyber Defense Duel"},
  prompt:{icon:"🤖",name:"AI Prompt Showdown"},
  typing:{icon:"⌨️",name:"Typing Speed Mission"}
};

const QUESTIONS={
quick_quiz:[
[4,1,"Which component stores data temporarily while programs are running?","RAM",["RAM","SSD","Monitor","Printer"]],
[4,1,"Which port commonly carries digital video and audio to a monitor?","HDMI",["HDMI","PS/2","RJ11","SATA power"]],
[4,1,"Which Windows tool is mainly used to browse files and folders?","File Explorer",["File Explorer","Calculator","Paint brush","Volume control"]],
[4,1,"An ordered set of steps for solving a task is called what?","Algorithm",["Algorithm","Wallpaper","Port","Password"]],
[4,1,"Which information should never be shared with an AI tool or stranger?","Password or OTP",["Password or OTP","Public science question","Made-up story idea","Spelling word"]],
[4,1,"Which key commonly confirms an entry or starts a new line?","Enter",["Enter","Caps Lock","Alt","Shift"]],
[4,2,"Which storage device normally has no moving mechanical parts?","SSD",["SSD","HDD","DVD tray","Printer roller"]],
[4,2,"What is the main job of a UPS during a short power cut?","Provide temporary battery backup",["Provide temporary battery backup","Increase RAM","Improve Wi-Fi speed","Add storage"]],
[4,2,"In a spreadsheet, where a row and column meet is called a...","Cell",["Cell","Folder","Pixel cable","Shortcut"]],
[4,3,"Why should important AI answers be checked?","AI can make mistakes",["AI can make mistakes","AI always deletes files","AI only works offline","AI never uses data"]],
[5,1,"What does Ctrl+V usually do?","Paste",["Paste","Copy","Cut","Lock"]],
[5,1,"What is a variable used for in coding?","Store a value that can change",["Store a value that can change","Cool the CPU","Connect a monitor","Charge a UPS"]],
[5,1,"Which device connects computers on a local network using Ethernet ports?","Network switch",["Network switch","Keyboard","Scanner glass","CPU fan"]],
[5,2,"Why is an SSD usually faster than a mechanical HDD?","It has no moving read/write mechanism",["It has no moving read/write mechanism","It has a larger monitor","It uses printer ink","It creates Wi-Fi"]],
[5,2,"What does a loop help a program do?","Repeat instructions",["Repeat instructions","Increase monitor brightness","Charge a mouse","Delete every file"]],
[5,2,"Which action is better when an AI gives a surprising historical claim?","Verify it with reliable sources",["Verify it with reliable sources","Believe it immediately","Share it without checking","Hide the source"]],
[5,2,"What does an IP address identify on a network?","A device or network interface",["A device or network interface","A keyboard key","A document page","A printer cartridge"]],
[5,3,"What is the purpose of DNS?","Translate names into IP addresses",["Translate names into IP addresses","Increase RAM","Encrypt a keyboard","Power a monitor"]],
[5,3,"Which Windows action ends your user session without powering off the PC?","Sign out",["Sign out","Format","Hibernate the router","Open the PSU"]],
[6,1,"What does debugging mean?","Finding and fixing errors",["Finding and fixing errors","Adding more bugs","Printing a document","Changing wallpaper"]],
[6,1,"Which tool can show running processes and resource usage in Windows?","Task Manager",["Task Manager","Recycle Bin","Notepad only","Paint"]],
[6,2,"What is the main purpose of a default gateway?","Send traffic to other networks",["Send traffic to other networks","Store documents","Cool the processor","Create passwords"]],
[6,2,"Why can a chart be useful in a spreadsheet?","It makes patterns and comparisons easier to see",["It makes patterns and comparisons easier to see","It increases RAM","It charges the UPS","It replaces passwords"]],
[6,2,"What is the purpose of an operating system?","Manage hardware and provide a platform for apps",["Manage hardware and provide a platform for apps","Only browse the internet","Only print documents","Only store passwords"]],
[6,3,"Which command is commonly used to test whether another network host responds?","ping",["ping","format","paint","calc"]],
[6,3,"What does DHCP normally provide automatically to a client?","IP configuration",["IP configuration","CPU temperature","Printer toner","Monitor resolution only"]],
[6,3,"A program uses a condition mainly to do what?","Make a decision based on a true/false test",["Make a decision based on a true/false test","Repeat forever only","Add physical RAM","Change a cable"]],
[6,3,"Why should AI-generated content be evaluated for bias?","Training data and examples can influence outputs",["Training data and examples can influence outputs","AI has no patterns","Bias only affects printers","All AI output is always neutral"]]
],
tech:[
[4,1,"A monitor says No Signal. What is a sensible first check?","Display cable and selected input",["Display cable and selected input","Delete Windows","Open the PSU","Format the SSD"]],
[4,1,"A USB mouse is not responding. What should you try first?","Reconnect it or try another USB port",["Reconnect it or try another USB port","Delete all documents","Open the power supply","Change the wallpaper"]],
[4,1,"A printer is on but nothing prints. What should you check first?","Printer selection, status and print queue",["Printer selection, status and print queue","CPU socket","BIOS battery immediately","Monitor brightness"]],
[4,1,"There is no sound from speakers. Which check makes sense first?","Volume, mute and correct output device",["Volume, mute and correct output device","Format the drive","Remove RAM while powered on","Delete the user"]],
[4,2,"A laptop cannot connect to Wi-Fi. What is a useful first check?","Wi-Fi is enabled and the correct network is selected",["Wi-Fi is enabled and the correct network is selected","Open the PSU","Delete File Explorer","Remove the SSD"]],
[4,2,"A keyboard works in another USB port. What does that suggest?","The original port or connection may be the issue",["The original port or connection may be the issue","The monitor is broken","The printer needs toner","The file is corrupted"]],
[5,1,"A PC is very slow with many programs open. What should you check?","Running apps and memory usage",["Running apps and memory usage","HDMI cable color","Printer paper size only","Wallpaper"]],
[5,1,"A network cable is unplugged. What symptom is likely?","Wired network connection may be unavailable",["Wired network connection may be unavailable","CPU temperature becomes zero","Keyboard changes language","Printer gains ink"]],
[5,2,"A printer job is stuck. Which action is reasonable?","Check and clear the print queue, then retry",["Check and clear the print queue, then retry","Open the PSU","Remove CPU while on","Delete System32"]],
[5,2,"A newly installed SATA drive is missing. What should be checked?","Data and power connections",["Data and power connections","Speaker volume","Mouse DPI","Monitor wallpaper"]],
[5,2,"A PC receives no IP address from the network. Which service may be involved?","DHCP",["DHCP","HDMI","BIOS wallpaper","PDF"]],
[5,3,"A website name fails but its IP address works. What service should you suspect?","DNS",["DNS","RAM","GPU fan","Printer spool paper"]],
[5,3,"Which command can show basic IP configuration on Windows?","ipconfig",["ipconfig","notepad","mspaint","shutdown /wallpaper"]],
[6,1,"A frozen application will not respond. What is a reasonable tool to use?","Task Manager",["Task Manager","Disk drill","Printer queue only","Paint"]],
[6,2,"A PC can reach local devices but not other networks. Which setting deserves checking?","Default gateway",["Default gateway","Keyboard layout","Monitor stand","Printer paper"]],
[6,2,"A device has an address beginning 169.254.x.x unexpectedly. What does that often indicate?","It did not obtain a normal DHCP address",["It did not obtain a normal DHCP address","DNS is definitely perfect","The monitor cable is loose","The SSD is full"]],
[6,2,"A user can ping 8.8.8.8 but cannot open websites by name. What is a likely issue?","DNS resolution",["DNS resolution","RAM seating","DisplayPort cable","Printer toner"]],
[6,3,"Which troubleshooting order is generally better?","Check simple physical and configuration causes before major changes",["Check simple physical and configuration causes before major changes","Format immediately","Replace every part first","Disable security permanently"]],
[6,3,"A network interface shows disabled in Windows. What should you do first?","Enable the adapter and verify its status",["Enable the adapter and verify its status","Open the PSU","Delete the profile","Replace the monitor"]],
[6,3,"After changing network settings, which command can test the local TCP/IP stack using loopback?","ping 127.0.0.1",["ping 127.0.0.1","format C:","paint 127","print 127"]]
],
safety:[
[4,1,"A stranger asks for your school password. What should you do?","Do not share it and tell a trusted adult",["Do not share it and tell a trusted adult","Send it quickly","Post it publicly","Use the same password everywhere"]],
[4,1,"You receive an unknown download link. What is the safest action?","Do not open it; ask a trusted adult or teacher",["Do not open it; ask a trusted adult or teacher","Click immediately","Forward it to everyone","Disable security"]],
[4,1,"Which detail is private and should not be posted publicly?","Home address",["Home address","Favourite colour","Made-up robot name","Public school subject"]],
[4,1,"Someone online makes you uncomfortable. What should you do?","Stop, block/report if appropriate, and tell a trusted adult",["Stop, block/report if appropriate, and tell a trusted adult","Keep it secret","Share more private details","Meet them alone"]],
[4,2,"Why should different important accounts use different passwords?","One stolen password will not unlock every account",["One stolen password will not unlock every account","It makes Wi-Fi faster","It adds storage","It changes the keyboard"]],
[4,2,"A message says 'urgent—verify your account now' and asks for a password. What is suspicious?","It may be phishing",["It may be phishing","It is always official","It increases security automatically","It fixes RAM"]],
[5,1,"What does two-factor authentication add?","Another verification step besides the password",["Another verification step besides the password","More storage","Faster printing","A second monitor"]],
[5,1,"Before installing an app, what should you check?","Source, permissions and whether it is trusted",["Source, permissions and whether it is trusted","Only the icon colour","Only the file name length","Nothing"]],
[5,2,"A fake login page designed to steal credentials is an example of...","Phishing",["Phishing","Defragmentation","Spreadsheet formatting","Screen casting"]],
[5,2,"Why should app permissions be reviewed?","Apps should only get access they genuinely need",["Apps should only get access they genuinely need","All apps need every permission","Permissions increase RAM","Permissions charge batteries"]],
[5,2,"A realistic video may have been AI-generated. What is a smart response?","Check the source and supporting evidence",["Check the source and supporting evidence","Assume every video is true","Share immediately","Ignore all evidence"]],
[5,3,"What is social engineering?","Manipulating people into revealing information or taking unsafe actions",["Manipulating people into revealing information or taking unsafe actions","Repairing hardware","Creating charts","Compressing files"]],
[6,1,"Why are software updates important for security?","They can fix known vulnerabilities",["They can fix known vulnerabilities","They always double RAM","They replace passwords","They remove all files"]],
[6,2,"What is the principle of least privilege?","Give only the access needed for the task",["Give only the access needed for the task","Give everyone admin rights","Share one account","Disable all passwords"]],
[6,2,"Why are backups useful against data loss or ransomware?","They can help restore clean copies of important data",["They can help restore clean copies of important data","They prevent every attack automatically","They improve monitor colour","They replace antivirus completely"]],
[6,2,"Which is safer on a shared computer?","Lock or sign out when leaving",["Lock or sign out when leaving","Leave every account open","Share your password","Disable the screen lock"]],
[6,3,"An attacker pretends to be support staff and asks for an OTP. What should you do?","Refuse and verify through an official channel",["Refuse and verify through an official channel","Send the OTP","Send your password too","Disable MFA"]],
[6,3,"Why should security warnings not simply be disabled permanently?","They may indicate real risks that need investigation",["They may indicate real risks that need investigation","Warnings always reduce storage","They control printer paper","They slow typing only"]]
],
prompt:[
[4,1,"Which prompt is clearer?","Explain the water cycle in 5 simple bullet points for a Class 4 student.",["Explain the water cycle in 5 simple bullet points for a Class 4 student.","Water.","Do anything.","Tell me stuff."]],
[4,1,"What should never be included in an AI prompt?","Your password or OTP",["Your password or OTP","A fictional character name","A school science topic","A public city name"]],
[4,1,"Why is adding a desired format useful in a prompt?","It tells the AI how to structure the answer",["It tells the AI how to structure the answer","It increases internet speed","It adds RAM","It changes the monitor"]],
[4,2,"Which instruction gives useful context?","I am a Class 4 student learning basic computer parts.",["I am a Class 4 student learning basic computer parts.","Answer.","Go.","Computer."]],
[4,2,"If an AI answer is confusing, what is a good follow-up?","Ask it to explain more simply with an example",["Ask it to explain more simply with an example","Share your password","Assume it is correct","Delete your files"]],
[5,1,"Which prompt contains a clear task and constraint?","Compare SSD and HDD in a 4-row table using simple language.",["Compare SSD and HDD in a 4-row table using simple language.","SSD HDD.","Write everything.","Table maybe."]],
[5,1,"Why should factual AI answers be verified?","AI can generate incorrect information",["AI can generate incorrect information","AI cannot create text","Verification damages files","AI is always offline"]],
[5,2,"What does giving an example in a prompt often help with?","Showing the style or pattern you want",["Showing the style or pattern you want","Charging the device","Adding storage","Changing the IP address"]],
[5,2,"What is a useful constraint for a school summary?","Use no more than 100 words and simple language",["Use no more than 100 words and simple language","Know my password","Ignore accuracy","Write forever"]],
[5,3,"After receiving an AI draft, what should a student do?","Review, edit and verify it before using it",["Review, edit and verify it before using it","Submit blindly","Delete the sources","Hide mistakes"]],
[6,1,"Which prompt is more testable and specific?","List 5 causes of slow Wi-Fi and give one safe first check for each.",["List 5 causes of slow Wi-Fi and give one safe first check for each.","Wi-Fi bad.","Fix internet.","Network help maybe."]],
[6,2,"Why can asking for sources be useful?","It gives claims that can be checked, though the sources must still be verified",["It gives claims that can be checked, though the sources must still be verified","Every cited source is automatically real","It prevents all AI errors","It increases CPU speed"]],
[6,2,"What is a hallucination in generative AI?","A confident-looking answer that may be fabricated or incorrect",["A confident-looking answer that may be fabricated or incorrect","A hardware fan noise","A secure password","A spreadsheet chart"]],
[6,2,"What is a good way to compare two AI answers?","Check accuracy, evidence, relevance and clarity",["Check accuracy, evidence, relevance and clarity","Choose the longest automatically","Choose the first automatically","Ignore sources"]],
[6,3,"Why might an AI output reflect bias?","Its training data and instructions can influence patterns in the output",["Its training data and instructions can influence patterns in the output","Bias comes only from monitors","AI has no data patterns","Only printers create bias"]],
[6,3,"Which workflow uses AI responsibly?","Plan the task, prompt clearly, verify output, edit with human judgment",["Plan the task, prompt clearly, verify output, edit with human judgment","Copy the first answer blindly","Enter private passwords","Ignore errors"]]
]
};

const TYPING={
4:{
1:["MOUSE AND KEYBOARD","SAVE YOUR SCHOOL FILE","KEEP PASSWORDS PRIVATE","CHECK THE HDMI CABLE"],
2:["A COMPUTER FOLLOWS CLEAR INSTRUCTIONS","USE FILE EXPLORER TO ORGANISE FOLDERS","ASK A TRUSTED ADULT BEFORE DOWNLOADING"],
3:["CLEAR PROMPTS HELP AI GIVE MORE USEFUL ANSWERS","ACCURACY IS MORE IMPORTANT THAN RUSHING"]
},
5:{
1:["NETWORK SWITCH","SOLID STATE DRIVE","CHECK THE PRINT QUEUE","VERIFY AI ANSWERS"],
2:["CTRL C COPIES AND CTRL V PASTES","A SWITCH CONNECTS DEVICES ON A LOCAL NETWORK","CHECK THE SOURCE BEFORE YOU TRUST A MESSAGE"],
3:["GOOD TROUBLESHOOTING STARTS WITH SIMPLE CHECKS","USE DIFFERENT PASSWORDS FOR IMPORTANT ACCOUNTS"]
},
6:{
1:["DEFAULT GATEWAY","DOMAIN NAME SYSTEM","TASK MANAGER","DEBUG THE PROGRAM"],
2:["PING CAN TEST WHETHER A NETWORK HOST RESPONDS","DHCP CAN PROVIDE IP CONFIGURATION AUTOMATICALLY","VERIFY SOURCES BEFORE USING AI GENERATED FACTS"],
3:["CHECK PHYSICAL CONNECTIONS BEFORE MAKING MAJOR CHANGES","HUMAN JUDGMENT IS REQUIRED WHEN USING GENERATIVE AI"]
}
};

function api(path,opts={}){
  const headers={...(opts.headers||{}),Authorization:`Bearer ${token}`};
  if(opts.body && !(opts.body instanceof FormData) && !headers["Content-Type"]) headers["Content-Type"]="application/json";
  return fetch(API+path,{...opts,headers,cache:"no-store"});
}
function toast(msg){
  const el=$("toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function speak(text){
  if(!voiceOn || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(String(text||""));
  u.lang="en-US";u.rate=.92;u.pitch=1.02;
  const voices=speechSynthesis.getVoices();
  const v=voices.find(x=>/en-(US|GB)/i.test(x.lang))||voices.find(x=>/en/i.test(x.lang));
  if(v)u.voice=v;
  speechSynthesis.speak(u);
}
function openModal(html){
  $("modalBody").innerHTML=html;
  $("arenaModal").classList.add("open");
  $("arenaModal").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeModal(){
  $("arenaModal").classList.remove("open");
  $("arenaModal").setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
function seeded(seed){
  let x=(Number(seed)||1)%2147483647;
  if(x<=0)x+=2147483646;
  return ()=>((x=x*16807%2147483647)-1)/2147483646;
}
function seededShuffle(arr,rand){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(rand()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function fmtDate(s){
  if(!s)return "";
  const d=new Date(String(s).replace(" ","T")+"Z");
  if(Number.isNaN(d.getTime()))return String(s);
  return d.toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
}
function modeMeta(mode){return MODE_META[mode]||MODE_META.quick_quiz}
function statusClass(s){return "status-"+(s||"pending")}
function mySubmitted(b){
  const isCh=Number(b.challenger_user_id)===Number(profile?.user_id);
  return isCh ? b.challenger_score!==null && b.challenger_score!==undefined : b.opponent_score!==null && b.opponent_score!==undefined;
}
function opponentSubmitted(b){
  const isCh=Number(b.challenger_user_id)===Number(profile?.user_id);
  return isCh ? b.opponent_score!==null && b.opponent_score!==undefined : b.challenger_score!==null && b.challenger_score!==undefined;
}

async function loadProfile(){
  if(!token){location.href="student-login.html";return false}
  try{
    const r=await api("/api/auth/me");
    const d=await r.json();
    if(!r.ok || d.role!=="student" || !d.profile) throw new Error("Student login required");
    profile=d.profile;
    classNo=Number(profile.class_number||0);
    if(classNo<4 || classNo>6){
      location.href="student-profile.html";
      return false;
    }
    $("studentPill").textContent=`👤 ${profile.display_name||profile.username||"Student"}`;
    $("classPill").textContent=`🎓 Class ${classNo}`;
    $("heroStudent").textContent=String(profile.display_name||"YOU").toUpperCase();
    return true;
  }catch{
    localStorage.removeItem(TOKEN_KEY);
    location.href="student-login.html";
    return false;
  }
}

async function loadPeers(){
  try{
    const r=await api("/api/student/peers");
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not load classmates");
    const peers=(d.peers||[]).filter(x=>Number(x.class_number)===classNo);
    $("peerSelect").innerHTML=peers.length
      ? `<option value="">Choose a Class ${classNo} learner...</option>`+
        peers.map(x=>`<option value="${Number(x.user_id)}">${esc(x.display_name)} • Class ${Number(x.class_number)}</option>`).join("")
      : `<option value="">No same-class learners available</option>`;
  }catch(e){
    $("peerSelect").innerHTML=`<option value="">${esc(e.message||"Could not load classmates")}</option>`;
  }
}

function updateStats(){
  const p=battles.filter(b=>b.status==="pending").length;
  const a=battles.filter(b=>b.status==="accepted").length;
  const c=battles.filter(b=>b.status==="completed").length;
  const w=battles.filter(b=>b.status==="completed" && Number(b.winner_user_id)===Number(profile?.user_id)).length;
  $("pendingCount").textContent=p;
  $("activeCount").textContent=a;
  $("completedCount").textContent=c;
  $("winCount").textContent=w;
}

function battleActionHtml(b){
  const isCh=Number(b.challenger_user_id)===Number(profile.user_id);
  if(!isCh && b.status==="pending"){
    return `<button class="action-btn action-primary" data-accept="${b.id}">✓ Accept</button>
            <button class="action-btn action-danger" data-decline="${b.id}">Decline</button>`;
  }
  if(isCh && b.status==="pending"){
    return `<span class="waiting-pill">⏳ Waiting for response</span>`;
  }
  if(b.status==="accepted"){
    if(mySubmitted(b)){
      return opponentSubmitted(b)
        ? `<button class="action-btn action-soft" data-result="${b.id}">🏆 View Result</button>`
        : `<span class="waiting-pill">✅ Submitted • Waiting for opponent</span>`;
    }
    return `<button class="action-btn action-primary" data-play="${b.id}">⚔️ Play Battle</button>`;
  }
  if(b.status==="completed"){
    return `<button class="action-btn action-soft" data-result="${b.id}">🏆 View Result</button>`;
  }
  if(b.status==="declined"){
    return `<span class="waiting-pill">Challenge declined</span>`;
  }
  return `<span class="waiting-pill">${esc(String(b.status||"").toUpperCase())}</span>`;
}

function renderBattles(){
  updateStats();
  const list=activeFilter==="all"?battles:battles.filter(b=>b.status===activeFilter);
  if(!list.length){
    $("battleList").innerHTML=`<div class="empty-state"><span>⚔️</span><b>No ${activeFilter==="all"?"":esc(activeFilter)+" "}battles yet</b><small>Choose a classmate and send a friendly challenge.</small></div>`;
    return;
  }
  $("battleList").innerHTML=list.map(b=>{
    const isCh=Number(b.challenger_user_id)===Number(profile.user_id);
    const other=isCh?b.opponent_name:b.challenger_name;
    const meta=modeMeta(b.mode);
    const incoming=!isCh && b.status==="pending";
    return `<article class="battle-row ${incoming?"incoming":""}">
      <div class="battle-info">
        <div class="battle-topline">
          <span>${meta.icon}</span>
          <b>${esc(other||"Classmate")} • ${esc(meta.name)} • L${Number(b.level||1)}</b>
          <span class="status-badge ${statusClass(b.status)}">${esc(String(b.status||"").toUpperCase())}</span>
        </div>
        <small>${isCh?"You challenged":"Challenge from"} ${esc(other||"classmate")} • ${fmtDate(b.created_at)}</small>
      </div>
      <div class="battle-actions">${battleActionHtml(b)}</div>
    </article>`;
  }).join("");
}

async function loadBattles(silent=false){
  try{
    const r=await api("/api/student/battles");
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not load battles");
    battles=d.battles||[];
    renderBattles();
  }catch(e){
    if(!silent)toast(e.message||"Could not load battles");
  }
}

async function sendChallenge(){
  const opponentUserId=Number($("peerSelect").value||0);
  if(!opponentUserId)return toast("Choose a same-class learner first.");
  const btn=$("sendChallengeBtn");
  btn.disabled=true;btn.textContent="Sending Challenge...";
  try{
    const r=await api("/api/student/battles",{
      method:"POST",
      body:JSON.stringify({
        opponentUserId,
        mode:selectedMode,
        level:selectedLevel,
        topic:"advanced_future_skills"
      })
    });
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not send challenge");
    toast("⚔️ Challenge sent!");
    await loadBattles(true);
  }catch(e){toast(e.message||"Could not send challenge")}
  finally{btn.disabled=false;btn.textContent="⚔️ Send Future Skills Challenge"}
}

async function respondBattle(id,accept){
  try{
    const r=await api(`/api/student/battles/${id}/respond`,{
      method:"POST",body:JSON.stringify({accept})
    });
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not update challenge");
    toast(accept?"Challenge accepted — battle ready!":"Challenge declined.");
    await loadBattles(true);
  }catch(e){toast(e.message||"Could not update challenge")}
}

function battleQuestionPool(mode,level){
  const all=QUESTIONS[mode]||QUESTIONS.quick_quiz;
  let pool=all.filter(q=>Number(q[0])<=classNo && Number(q[1])<=level);
  if(pool.length<7)pool=all.filter(q=>Number(q[0])<=classNo);
  return pool;
}

async function playBattle(id){
  try{
    const r=await api(`/api/student/battles/${id}`);
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Battle unavailable");
    const b=d.battle;
    if(b.status!=="accepted")throw new Error("This battle is not active.");
    const isCh=Number(b.challenger_user_id)===Number(profile.user_id);
    const already=isCh?b.challenger_score!==null:b.opponent_score!==null;
    if(already){
      toast("Your score is already submitted.");
      return loadBattles(true);
    }
    if(b.mode==="typing")return playTypingBattle(b);
    return playQuizBattle(b);
  }catch(e){toast(e.message||"Battle unavailable")}
}

function playQuizBattle(b){
  const level=Number(b.level||1);
  const rand=seeded(Number(b.question_seed||1)+(classNo*97)+(level*13));
  const count=Math.min(4+level,battleQuestionPool(b.mode,level).length);
  const selected=seededShuffle(battleQuestionPool(b.mode,level),rand).slice(0,count);
  let index=0,correctCount=0,answered=false;
  const started=Date.now();
  const meta=modeMeta(b.mode);

  const draw=()=>{
    if(index>=selected.length){
      const seconds=(Date.now()-started)/1000;
      const speedBonus=Math.max(0,Math.round(200-seconds*3));
      const finalScore=Math.min(1000,correctCount*100+speedBonus);
      return submitBattle(b.id,finalScore,{correct:correctCount,total:selected.length,seconds});
    }

    const q=selected[index];
    const options=seededShuffle(q[4],rand);
    answered=false;

    openModal(`
      <div class="battle-play-head">
        <div class="icon">${meta.icon}</div>
        <h2>${esc(meta.name)} • Level ${level}</h2>
        <div class="play-meta">
          <span>🎓 Class ${classNo}</span>
          <span>⚔️ Question ${index+1}/${selected.length}</span>
          <span>✅ Correct ${correctCount}</span>
        </div>
      </div>
      <div class="question-card">
        <div class="question-progress"><span>QUESTION ${index+1}</span><span>Think carefully — one answer only</span></div>
        <h3>${esc(q[2])}</h3>
        <div class="answer-grid">
          ${options.map((o,i)=>`<button class="answer-btn" type="button" data-answer="${esc(o)}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}
        </div>
        <div id="answerFeedback" class="feedback">Choose the best answer.</div>
        <button id="nextBattleQuestion" class="next-btn" type="button" disabled>${index===selected.length-1?"Finish Battle →":"Next Question →"}</button>
      </div>
    `);

    speak(q[2]);

    qa("[data-answer]").forEach(btn=>{
      btn.onclick=()=>{
        if(answered)return;
        answered=true;
        const chosen=btn.dataset.answer;
        const right=q[3];
        if(chosen===right)correctCount++;
        qa("[data-answer]").forEach(x=>{
          x.disabled=true;
          if(x.dataset.answer===right)x.classList.add("correct");
          else if(x===btn)x.classList.add("wrong");
        });
        $("answerFeedback").innerHTML=chosen===right
          ? `✅ <b>Correct!</b> Strong answer.`
          : `❌ <b>Not this time.</b> Correct answer: ${esc(right)}`;
        $("nextBattleQuestion").disabled=false;
        speak(chosen===right?"Correct. Great job.":"Good try. The correct answer is "+right);
      };
    });

    $("nextBattleQuestion").onclick=()=>{if(answered){index++;draw()}};
  };
  draw();
}

function typingTarget(b){
  const level=Number(b.level||1);
  const rand=seeded(Number(b.question_seed||1)+(classNo*71)+(level*19));
  const options=TYPING[classNo]?.[level]||TYPING[4][1];
  return options[Math.floor(rand()*options.length)];
}

function normalizeTyping(s){return String(s||"").trim().replace(/\s+/g," ").toUpperCase()}

function playTypingBattle(b){
  const level=Number(b.level||1);
  const target=typingTarget(b);
  const started=Date.now();
  const meta=modeMeta("typing");
  openModal(`
    <div class="battle-play-head">
      <div class="icon">${meta.icon}</div>
      <h2>${meta.name} • Level ${level}</h2>
      <div class="play-meta"><span>🎓 Class ${classNo}</span><span>🎯 Accuracy first</span><span>⚡ Speed bonus</span></div>
    </div>
    <div class="question-card">
      <div class="question-progress"><span>TYPE EXACTLY</span><span>Spaces matter</span></div>
      <div class="type-target">${esc(target)}</div>
      <input id="typingInput" class="type-input" autocomplete="off" autocapitalize="characters" placeholder="Type the sentence here...">
      <div id="typingFeedback" class="feedback">Read carefully, then type the exact text.</div>
      <button id="finishTyping" class="next-btn" type="button">Finish Typing Mission →</button>
    </div>
  `);
  $("typingInput").focus();
  speak(target);

  $("finishTyping").onclick=()=>{
    const typed=normalizeTyping($("typingInput").value);
    const expected=normalizeTyping(target);
    const exact=typed===expected;
    const seconds=(Date.now()-started)/1000;
    const speedBonus=Math.max(0,Math.round(300-seconds*7));
    const score=Math.min(1000,(exact?600:120)+speedBonus);
    $("finishTyping").disabled=true;
    $("typingInput").disabled=true;
    $("typingFeedback").innerHTML=exact
      ? `✅ <b>Exact match!</b> Accuracy secured.`
      : `❌ <b>Not an exact match.</b> Accuracy matters more than speed.`;
    setTimeout(()=>submitBattle(b.id,score,{typing:true,exact,seconds}),650);
  };
}

async function submitBattle(id,score,summary={}){
  try{
    const r=await api(`/api/student/battles/${id}/submit`,{
      method:"POST",body:JSON.stringify({score})
    });
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not submit score");
    const detail=summary.typing
      ? `${summary.exact?"Exact typing":"Typing completed"} • ${Math.round(summary.seconds||0)} sec`
      : `${summary.correct||0}/${summary.total||0} correct • ${Math.round(summary.seconds||0)} sec`;
    openModal(`
      <div class="result-hero">
        <div class="result-trophy">⚔️</div>
        <span class="mini-kicker">SCORE SUBMITTED</span>
        <h2>Your Mission Is Complete</h2>
        <p>${esc(detail)}</p>
        <div class="score-person" style="max-width:320px;margin:15px auto">
          <small>YOUR BATTLE SCORE</small><strong>${Number(score)}</strong><b>POINTS</b>
        </div>
        <p style="color:var(--muted);font-size:10px">The final result appears after both learners submit.</p>
        <div class="modal-buttons"><button class="modal-action" type="button" id="submittedDone">Done</button></div>
      </div>
    `);
    $("submittedDone").onclick=async()=>{closeModal();await loadBattles(true)};
    speak("Battle submitted. Well played.");
  }catch(e){toast(e.message||"Could not submit battle")}
}

async function showBattleResult(id){
  try{
    const r=await api(`/api/student/battles/${id}`);
    const d=await r.json();
    if(!r.ok)throw new Error(d.error||"Result unavailable");
    const b=d.battle;
    const cs=Number(b.challenger_score||0),os=Number(b.opponent_score||0);
    const tie=cs===os;
    const iWon=!tie && Number(b.winner_user_id)===Number(profile.user_id);
    const title=tie?"Friendly Tie":iWon?"You Won!":"Well Played!";
    const icon=tie?"🤝":iWon?"🏆":"⭐";
    openModal(`
      <div class="result-hero">
        <div class="result-trophy">${icon}</div>
        <span class="mini-kicker">FINAL BATTLE RESULT</span>
        <h2>${title}</h2>
        <p>${esc(modeMeta(b.mode).name)} • Level ${Number(b.level||1)} • Class ${classNo}</p>
        <div class="scoreboard">
          <div class="score-person">
            <small>CHALLENGER</small><b>${esc(b.challenger_name||"Student")}</b><strong>${cs}</strong><small>POINTS</small>
          </div>
          <div class="score-vs">VS</div>
          <div class="score-person">
            <small>OPPONENT</small><b>${esc(b.opponent_name||"Student")}</b><strong>${os}</strong><small>POINTS</small>
          </div>
        </div>
        <p style="color:var(--muted);font-size:10px">👍 Great Job &nbsp; • &nbsp; 👏 Well Played &nbsp; • &nbsp; ⭐ Keep Learning</p>
        <div class="modal-buttons">
          <button class="modal-action" id="resultDone" type="button">Done</button>
        </div>
      </div>
    `);
    $("resultDone").onclick=closeModal;
    speak(tie?"Friendly tie. Well played.":iWon?`Wonderful job, ${profile.display_name}. You won the battle.`:"Well played. Keep learning and challenge again.");
  }catch(e){toast(e.message||"Result unavailable")}
}

function bind(){
  qa("[data-mode]").forEach(btn=>btn.onclick=()=>{
    qa("[data-mode]").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");selectedMode=btn.dataset.mode;
  });
  qa("[data-level]").forEach(btn=>btn.onclick=()=>{
    qa("[data-level]").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");selectedLevel=Number(btn.dataset.level||1);
  });
  qa("[data-filter]").forEach(btn=>btn.onclick=()=>{
    qa("[data-filter]").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");activeFilter=btn.dataset.filter;renderBattles();
  });

  $("sendChallengeBtn").onclick=sendChallenge;
  $("refreshBtn").onclick=async()=>{await Promise.all([loadPeers(),loadBattles(true)]);toast("Battle desk refreshed.")};

  $("battleList").onclick=e=>{
    const accept=e.target.closest("[data-accept]");
    const decline=e.target.closest("[data-decline]");
    const play=e.target.closest("[data-play]");
    const result=e.target.closest("[data-result]");
    if(accept)return respondBattle(Number(accept.dataset.accept),true);
    if(decline)return respondBattle(Number(decline.dataset.decline),false);
    if(play)return playBattle(Number(play.dataset.play));
    if(result)return showBattleResult(Number(result.dataset.result));
  };

  $("voiceBtn").onclick=()=>{
    voiceOn=!voiceOn;
    $("voiceBtn").textContent=voiceOn?"🔊 Voice On":"🔇 Voice Off";
    if(!voiceOn && "speechSynthesis" in window)speechSynthesis.cancel();
    else speak("Voice guide is on.");
  };

  $("modalClose").onclick=closeModal;
  $("arenaModal").onclick=e=>{if(e.target===$("arenaModal"))closeModal()};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
}

async function init(){
  bind();
  const ok=await loadProfile();
  if(!ok)return;
  await Promise.all([loadPeers(),loadBattles()]);
  pollTimer=setInterval(()=>loadBattles(true),5000);
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden && pollTimer){clearInterval(pollTimer);pollTimer=null}
    else if(!document.hidden && !pollTimer){loadBattles(true);pollTimer=setInterval(()=>loadBattles(true),5000)}
  });
}
init();
})();
