(() => {
"use strict";

/* ============================================================
   V40.5 — TANNU'S LEARNING BUDDY 2.5
   TIGHT HOME HERO • EDGE MARQUEES • FLOWERS • 6 QUICK TABS
   - Natural casual chat as well as learning questions
   - Respectful manners coaching for abusive language
   - Optional AI fallback for questions not in the local database
   - Class-aware replies for Classes 1–6
   - Voice questions receive automatic spoken answers
   - Prefers a soft female-style browser voice when available
   - Never asks for passwords, OTPs, addresses or private details
   ============================================================ */

/*
  Tannu Learning Buddy V21
  FREE • KIDS SAFE • TOPIC-AWARE • HUMAN-LIKE CHAT • VOICE • DRAGGABLE
  Class 1–3 friendly local assistant.
  No paid AI API. Uses local rules + academy question-bank.js.
*/

const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const STATE_KEY="tannu_buddy_v21_state";
const POS_KEY="tannu_buddy_v21_pos";
const VOICE_KEY="tannu_buddy_voice_lang";
const LANG_MODE_KEY="tannu_buddy_language_mode_v401";

/*
  V40.1 Academy knowledge scope.
  This is intentionally a compact factual map of the learning platform.
  We do NOT hard-code "millions" of answers; the local Academy knowledge
  is used first and the safe AI fallback handles broad school-level
  general knowledge and natural conversation.
*/
const ACADEMY_PLATFORM_CONTEXT=`
Tannu Sir's Kids Digital Academy supports Classes 1–6.

MAIN LEARNING AREAS:
- 90-Day Digital + English + Confidence Program.
- Month 1 Foundation: computer parts, mouse, keyboard, greetings, manners, safety and healthy routines.
- Month 2 Practice: typing, files, internet basics, English conversation, role play and problem solving.
- Month 3 Smart Skills: AI prompts, troubleshooting, mini presentations, portfolio work and the Final Digital Mission.
- Weekly evaluations and monthly assessments.
- Digital achievement/reward milestones.
- Computer, hardware, Windows/software, networking, internet and troubleshooting.
- Spoken English, confidence, manners and communication.
- Healthy habits, hygiene and safety.
- Cyber safety and responsible AI.
- Coding basics, science, mathematics and general knowledge.
- Student Progress, Skill Passport, Today's Mission, Continue Learning and Learning Report.
- Learning worlds: Computer, IT Lab, GK World, English, Healthy Me, Safe Me, Smart Games, Hardware Explorer and AI Prompt Lab.
- Class 4–6 Future Skills Universe with Learn, Challenge and Create modes.
- Class 4–6 Junior Digital & AI Technician 5-Stage Practical Lab:
  1. Port & Device Master
  2. Inside the Computer
  3. Windows & Software Support
  4. AI Smart Technician
  5. Final Technician Mission
- The practical lab includes safe cable/port work, PC components, Windows/software tasks, AI/privacy/verification and realistic support tickets.
- Hardware Explorer teaches parts, ports, cables and safe troubleshooting.
- Skill Challenge/Battle activities use safe quiz/game modes without open child-to-child chat.
- Student rewards, projects, portfolio/goals, weekly/monthly tests and digital certificates/milestones are part of the learning experience where applicable.

When a child asks about the Academy or one of these features, explain only what this context supports. Do not invent unavailable features.
`.trim();

/*
  Unknown/general questions are sent only when the local Academy
  knowledge base has no useful answer. This keeps common learning
  questions fast and reduces external AI usage.
*/
const BUDDY_AI_CHAT_URL=
  window.TANNU_KIDS_AI_CHAT_URL ||
  "https://it-chatbot-app.tanweerstudy25.workers.dev/chat";

const $=id=>document.getElementById(id);

let studentName="Friend";
let studentClass=1;
let studentLoggedIn=false;
let recognition=null;

/*
  en-IN is a good default for English + Hinglish.
  If the browser has a saved language preference, keep it.
*/
let buddyLanguage=localStorage.getItem(LANG_MODE_KEY)||"en";
if(!["en","hi"].includes(buddyLanguage)) buddyLanguage="en";

let voiceLang=
  localStorage.getItem(VOICE_KEY) ||
  (buddyLanguage==="hi" ? "hi-IN" : "en-IN");

let questionBank=[];
let state=defaultState();

function defaultState(){
  return {
    topic:"",
    subtopic:"",
    mode:"chat",
    quiz:null,
    turns:[],
    lastQuestion:"",
    lastAnswer:"",
    lastSource:""
  };
}
function resetState(){
  state=defaultState();
  sessionStorage.removeItem(STATE_KEY);
}
function saveState(){
  state.turns=(state.turns||[]).slice(-20);
  sessionStorage.setItem(STATE_KEY,JSON.stringify(state));
}
function remember(role,text){
  state.turns.push({role,text:String(text).slice(0,700),at:Date.now()});
  saveState();
}
function normalize(t){
  return String(t||"")
    .toLowerCase()
    .replace(/[’']/g,"")
    .replace(/×/g,"*")
    .replace(/÷/g,"/")
    .replace(/[^\p{L}\p{N}\s+\-*/().?:]/gu," ")
    .replace(/\s+/g," ")
    .trim();
}
function words(t){return normalize(t).split(/\s+/).filter(Boolean)}
function has(t,p){return ` ${normalize(t)} `.includes(` ${normalize(p)} `)}
function any(t,list){return list.some(x=>has(t,x))}
function esc(t){
  return String(t??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function firstName(){
  return String(studentName||"Friend").trim().split(/\s+/)[0]||"Friend";
}
function isHindiScript(t){return /[\u0900-\u097F]/.test(String(t||""))}
function isHinglish(t){
  const hints=["kya","kaise","hai","hain","batao","samjhao","mujhe","mera","meri","tum","aap","hum","main","mai","nahi","kyu","kyon","acha","achha","thik","theek","ka","ki","ke","aur","phir","chahiye","karo","kar","rahe","ho","kahan","kaha","se"];
  const set=new Set(words(t));
  return hints.some(x=>set.has(x));
}
function hiMode(t=""){
  const raw=String(t||"").trim();

  /* Explicit Hindi/Hinglish text always gets a Hindi/Hinglish reply. */
  if(raw && (isHindiScript(raw)||isHinglish(raw))) return true;

  /* Clear English text stays English unless the child selected Hindi. */
  if(raw && /[a-z]/i.test(raw)){
    return buddyLanguage==="hi";
  }

  return buddyLanguage==="hi" || voiceLang.startsWith("hi");
}

function setBuddyLanguage(mode,{announce=true}={}){
  buddyLanguage=mode==="hi" ? "hi" : "en";
  voiceLang=buddyLanguage==="hi" ? "hi-IN" : "en-IN";

  localStorage.setItem(LANG_MODE_KEY,buddyLanguage);
  localStorage.setItem(VOICE_KEY,voiceLang);

  document.querySelectorAll("[data-buddy-lang]").forEach(btn=>{
    const active=btn.dataset.buddyLang===buddyLanguage;
    btn.classList.toggle("active",active);
    btn.setAttribute("aria-pressed",active?"true":"false");
  });

  const input=$("tannuBuddyInput");
  if(input){
    input.placeholder=
      buddyLanguage==="hi"
        ?"Hindi/Hinglish ya English me poochho..."
        :"Ask in English or Hindi...";
  }

  if(announce && $("tannuBuddyMessages")){
    const text=
      buddyLanguage==="hi"
        ?"🇮🇳 Hindi/Hinglish mode ready. Aap Hindi, Hinglish ya English me poochh sakte ho."
        :"🇬🇧 English mode ready. You can still ask in Hindi or Hinglish anytime.";

    addMessage("bot",text,["Computer","GK","IT Lab","Quiz"]);
    speak(text);
  }
}
function cleanTypos(text){
  let q=normalize(text);
  const reps=[
    [/\bwat\b/g,"what"],[/\bwht\b/g,"what"],[/\bhw\b/g,"how"],
    [/\bu\b/g,"you"],[/\br\b/g,"are"],[/\bur\b/g,"your"],[/\byr\b/g,"your"],
    [/\bfrm\b/g,"from"],[/\bplz\b/g,"please"],[/\bpls\b/g,"please"],
    [/\bthx\b/g,"thanks"],[/\bcoz\b/g,"because"],[/\bcuz\b/g,"because"],
    [/\bnam\b/g,"naam"],[/\bkese\b/g,"kaise"],[/\bkaha\b/g,"kahan"],
    [/\bkr\b/g,"kar"],[/\brhe\b/g,"rahe"],[/\bhn\b/g,"hain"]
  ];
  for(const [a,b] of reps) q=q.replace(a,b);
  return q.replace(/\s+/g," ").trim();
}

async function loadStudent(){
  if(!TOKEN) return;
  try{
    const r=await fetch(`${API}/api/auth/me`,{
      headers:{Authorization:`Bearer ${TOKEN}`},
      cache:"no-store"
    });
    const d=await r.json();
    if(r.ok&&d?.profile){
      studentLoggedIn=true;
      studentName=d.profile.display_name||d.profile.username||"Friend";
      studentClass=Math.max(1,Math.min(6,Number(d.profile.class_number||1)));
    }
  }catch{}
}

async function ensureQuestionBank(){
  if(Array.isArray(window.TANNU_QUESTION_BANK)){
    questionBank=window.TANNU_QUESTION_BANK;
    return;
  }
  await new Promise(resolve=>{
    const old=[...document.scripts].find(s=>/question-bank\.js(?:\?|$)/.test(s.src||""));
    if(old){
      old.addEventListener("load",resolve,{once:true});
      setTimeout(resolve,1000);
      return;
    }
    const s=document.createElement("script");
    s.src="question-bank.js?v=21";
    s.onload=resolve;
    s.onerror=resolve;
    document.head.appendChild(s);
  });
  questionBank=Array.isArray(window.TANNU_QUESTION_BANK)?window.TANNU_QUESTION_BANK:[];
}

const META={
  computer:{icon:"💻",title:"Computer",chips:["Computer","Hardware","Software","CPU","RAM","Keyboard","Mouse","Windows"]},
  network:{icon:"🌐",title:"Network",chips:["Network","Wi-Fi","Router","LAN","Internet","IP Address","Network Cable","Quiz"]},
  safety:{icon:"🔐",title:"Safety",chips:["Internet Safety","Road Safety","Home Safety","Cleanliness","Device Safety","Stranger Safety","Quiz"]},
  ai:{icon:"🤖",title:"AI",chips:["What is AI?","AI Safety","Prompt","Check AI Answers","Quiz"]},
  coding:{icon:"🧩",title:"Coding",chips:["Coding","Algorithm","Sequence","Loop","Bug","Quiz"]},
  science:{icon:"🔬",title:"Science",chips:["Science","Plants","Water Cycle","Weather","Space","Quiz"]},
  english:{icon:"🔤",title:"English",chips:["English","Hello","Please","Thank you","Sentence","Quiz"]},
  health:{icon:"🥗",title:"Healthy Habits",chips:["Water","Healthy Food","Sleep","Hand Washing","Teeth","Exercise","Quiz"]},
  math:{icon:"➕",title:"Math",chips:["Addition","Subtraction","Multiplication","Division","Quiz"]},
  gk:{icon:"🌍",title:"General Knowledge",chips:["Earth","Sun","Moon","Countries","Animals","Quiz"]}
};

const K=[];
function add(topic,label,keys,en,hi,next=[]){
  K.push({topic,label,keys,en,hi,next});
}

add("computer","Computer",["computer"],"A computer is an electronic machine that takes input, processes information, stores data and gives output.","Computer ek electronic machine hai jo input leta hai, information process karta hai, data store karta hai aur output deta hai.",["Hardware","Software","CPU","Keyboard"]);
add("computer","Hardware",["hardware"],"Hardware means the physical parts of a computer that you can see or touch.","Hardware computer ke physical parts hote hain jinhe hum dekh ya touch kar sakte hain.",["Monitor","Keyboard","Mouse","CPU","RAM"]);
add("computer","Software",["software","program","application","app"],"Software is a set of programs and instructions that tells a computer what to do.","Software programs aur instructions ka set hota hai jo computer ko batata hai kya karna hai.",["Windows","Browser","File","Folder"]);
add("computer","CPU",["cpu","processor"],"The CPU is the main processor. It follows instructions and performs calculations.","CPU main processor hota hai. Ye instructions follow karta hai aur calculations karta hai.",["RAM","SSD","Motherboard"]);
add("computer","RAM",["ram","memory"],"RAM is short-term working memory used by active programs.","RAM short-term working memory hoti hai jo active programs use karte hain.",["CPU","SSD"]);
add("computer","SSD",["ssd","storage"],"An SSD stores files and programs and is usually faster than a traditional hard disk.","SSD files aur programs store karta hai aur aam taur par hard disk se fast hota hai.",["HDD","File","Folder"]);
add("computer","Hard Disk",["hdd","hard disk","hard drive"],"A hard disk stores files, programs and the operating system for long-term use.","Hard disk files, programs aur operating system ko long-term store karta hai.",["SSD","File"]);
add("computer","Monitor",["monitor","display","screen"],"A monitor shows text, pictures, videos and other visual output.","Monitor text, pictures, videos aur doosra visual output dikhata hai.",["HDMI","No Display"]);
add("computer","Keyboard",["keyboard"],"A keyboard is an input device used to type letters, numbers, symbols and commands.","Keyboard ek input device hai jisse letters, numbers, symbols aur commands type karte hain.",["Mouse","Shortcut Keys"]);
add("computer","Mouse",["mouse"],"A mouse helps you point, click, select and drag items on the screen.","Mouse se screen par point, click, select aur drag karte hain.",["Keyboard","Click"]);
add("computer","Printer",["printer"],"A printer makes a paper copy of digital information.","Printer digital information ki paper copy banata hai.",["Printer not printing","Scanner"]);
add("computer","Scanner",["scanner","scan"],"A scanner turns a paper document or photo into a digital copy.","Scanner paper document ya photo ko digital copy me badalta hai.",["Printer","File"]);
add("computer","Windows",["windows","operating system","os"],"Windows is an operating system that helps you use apps, files, settings and hardware.","Windows ek operating system hai jo apps, files, settings aur hardware use karne me help karta hai.",["Desktop","Taskbar","Start Menu","File Explorer"]);
add("computer","File",["file"],"A file is saved information such as a document, picture, video or song.","File saved information hoti hai jaise document, picture, video ya song.",["Folder","Download"]);
add("computer","Folder",["folder","directory"],"A folder helps organize files so they are easier to find.","Folder files ko organize karta hai taaki unhe aasani se find kiya ja sake.",["File","Recycle Bin"]);
add("computer","Browser",["browser","chrome","edge"],"A web browser is a program used to open and view websites.","Web browser ek program hai jisse websites open aur view karte hain.",["Internet","Website"]);
add("computer","Desktop",["desktop"],"The desktop is the main workspace you see after signing in to a computer.","Desktop computer sign-in ke baad dikhne wala main workspace hota hai.",["Taskbar","Start Menu"]);
add("computer","Taskbar",["taskbar"],"The taskbar helps you open and switch between apps and see system controls.","Taskbar apps open ya switch karne aur system controls dekhne me help karta hai.",["Windows","Start Menu"]);
add("computer","Shortcut Keys",["shortcut","ctrl c","ctrl v","ctrl x","ctrl z","alt tab","windows l"],"Shortcut keys help you work faster. Ctrl+C copies, Ctrl+V pastes, Ctrl+Z undoes, Alt+Tab switches apps and Windows+L locks the PC.","Shortcut keys kaam fast karte hain. Ctrl+C copy, Ctrl+V paste, Ctrl+Z undo, Alt+Tab apps switch aur Windows+L PC lock karta hai.",["Keyboard","Windows"]);
add("computer","No Display",["no display","no signal","monitor no signal"],"Check monitor power, the display cable and the correct input source. Ask an adult or technician if it still does not work.","Monitor power, display cable aur correct input source check karo. Fir bhi na chale to adult ya technician se help lo.",["Monitor","HDMI"]);
add("computer","Printer Problem",["printer not printing","printing problem"],"Check printer power, paper, connection and whether the correct printer is selected. Ask an adult or technician before changing advanced settings.","Printer power, paper, connection aur correct printer selected hai ya nahi check karo. Advanced setting change karne se pehle adult ya technician se help lo.",["Printer"]);
add("computer","Slow Computer",["slow computer","computer slow","pc slow"],"Close unnecessary apps, save your work and restart if needed. Ask an adult or technician if the problem continues.","Unnecessary apps close karo, work save karo aur zarurat ho to restart karo. Problem rahe to adult ya technician se help lo.",["Windows","Task Manager"]);

add("network","Network",["network","computer network","networking"],"A network connects computers and other devices so they can communicate and share resources.","Network computers aur devices ko connect karta hai taaki wo communicate aur resources share kar saken.",["Wi-Fi","Router","LAN","Internet","IP Address"]);
add("network","LAN",["lan","local area network"],"A LAN connects devices in a small area such as a home, classroom or office.","LAN chhote area jaise home, classroom ya office me devices ko connect karta hai.",["Switch","Router","Network Cable"]);
add("network","WAN",["wan","wide area network"],"A WAN connects networks across a large geographic area.","WAN bade geographic area me networks ko connect karta hai.",["Internet","Router"]);
add("network","Wi-Fi",["wifi","wi-fi","wireless"],"Wi-Fi lets devices connect to a network without a network cable.","Wi-Fi devices ko bina network cable ke wireless network se connect karta hai.",["Router","Internet","Wi-Fi Problem"]);
add("network","Router",["router","wifi router"],"A router connects networks and helps devices reach other networks and the internet.","Router networks ko connect karta hai aur devices ko internet tak pahunchne me help karta hai.",["Switch","Internet","Gateway"]);
add("network","Switch",["network switch","switch"],"A network switch connects many devices inside the same local network.","Network switch same local network ke andar kai devices ko connect karta hai.",["LAN","Router","Network Cable"]);
add("network","Network Cable",["ethernet","network cable","lan cable","rj45"],"An Ethernet cable connects a device to a wired network.","Ethernet cable device ko wired network se connect karti hai.",["LAN","Switch","Router"]);
add("network","IP Address",["ip address","ip"],"An IP address identifies a device on an IP network.","IP address network me device ki pehchan ke liye use hota hai.",["DHCP","Gateway","DNS"]);
add("network","DHCP",["dhcp"],"DHCP automatically gives devices network settings such as an IP address.","DHCP automatically devices ko IP address jaise network settings deta hai.",["IP Address","Gateway","DNS"]);
add("network","DNS",["dns"],"DNS helps turn website names into IP addresses that computers can use.","DNS website names ko IP addresses me badalne me help karta hai.",["Internet","IP Address"]);
add("network","Gateway",["gateway","default gateway"],"A default gateway is usually the router that helps a device communicate outside its local network.","Default gateway usually router hota hai jo device ko local network ke bahar communicate karne me help karta hai.",["Router","IP Address"]);
add("network","Ping",["ping"],"Ping checks whether another network device can be reached.","Ping se check karte hain ki doosra network device reachable hai ya nahi.",["IP Address","Troubleshooting"]);
add("network","Internet",["internet"],"The internet is a worldwide system of connected networks that exchange information.","Internet connected networks ka worldwide system hai.",["Router","Wi-Fi","Browser"]);
add("network","NIC",["nic","network card","network adapter"],"A network adapter lets a device connect to a network.","Network adapter device ko network se connect hone deta hai.",["Network Cable","Wi-Fi"]);
add("network","Network Path",["network path","pc switch router internet"],"A simple wired path can be: PC → switch → router/firewall → internet.","Simple wired path ho sakta hai: PC → switch → router/firewall → internet.",["Switch","Router","Internet"]);
add("network","No Internet",["no internet","internet not working","internet nahi chal","internet nahi chal raha"],"First check Wi-Fi or the LAN cable. Then check whether another device has internet. If only one device has the problem, reconnect Wi-Fi or restart the device with an adult's help.","Pehle Wi-Fi ya LAN cable check karo. Phir dekho doosre device me internet chal raha hai ya nahi. Sirf ek device me problem ho to Wi-Fi reconnect karo ya adult ki help se device restart karo.",["Wi-Fi","Network Cable","Router"]);

add("safety","Internet Safety",["internet safety","online safety","safe internet"],"Use trusted websites, keep personal information private, avoid unknown links and ask a trusted adult when something feels strange.","Trusted websites use karo, personal information private rakho, unknown links se bacho aur kuch strange lage to trusted adult ko batao.",["Password","Unknown Link","Stranger Safety","Quiz"]);
add("safety","Password Safety",["password","strong password"],"A password is a private secret used to protect an account. Never share your password with friends or strangers.","Password account ko protect karne wala private secret hai. Apna password friends ya strangers ke saath share mat karo.",["OTP","Private Information"]);
add("safety","OTP Safety",["otp","one time password"],"An OTP is a one-time verification code. Never share it with strangers or unknown people.","OTP one-time verification code hota hai. Use strangers ya unknown logon ke saath share mat karo.",["Password","Internet Safety"]);
add("safety","Private Information",["private information","personal information","phone number","home address"],"Private information includes passwords, OTPs, home address, phone number and school details. Do not share it with strangers.","Private information me password, OTP, home address, phone number aur school details aate hain. Ye strangers ko share mat karo.",["Stranger Safety","Internet Safety"]);
add("safety","Unknown Link",["unknown link","suspicious link","strange link"],"Do not click an unknown link. Close it and ask a trusted adult if you are unsure.","Unknown link par click mat karo. Use close karo aur doubt ho to trusted adult se poochho.",["Internet Safety"]);
add("safety","Road Safety",["road safety","road","cross road","traffic light","zebra crossing"],"Use the footpath when available, stop at the edge, look both ways, cross at a safe crossing and follow traffic signals with an adult.","Jahan possible ho footpath use karo, road ke edge par ruko, dono taraf dekho, safe crossing se cross karo aur adult ke saath traffic signal follow karo.",["Traffic Light","Zebra Crossing","Seat Belt"]);
add("safety","Home Safety",["home safety","electrical safety","electric safety","socket","plug"],"Keep hands dry around electrical items, never put objects into sockets and ask an adult before using unfamiliar appliances.","Electrical items ke paas haath dry rakho, socket me koi object mat dalo aur unfamiliar appliance use karne se pehle adult se poochho.",["Device Safety","Cleanliness"]);
add("safety","Cleanliness",["cleanliness","cleaning","hygiene","hand wash","hand washing"],"Wash hands with soap, keep your study area clean and avoid touching electrical devices with wet hands.","Haath soap se dhona, study area clean rakhna aur wet hands se electrical devices touch na karna achhi safety habits hain.",["Healthy Habits","Device Safety"]);
add("safety","Device Safety",["device safety","computer safety","laptop safety"],"Use devices gently, keep drinks away, do not pull cables and ask an adult before opening or repairing equipment.","Devices gently use karo, drinks door rakho, cables mat kheecho aur equipment open ya repair karne se pehle adult se help lo.",["Home Safety","Cleanliness"]);
add("safety","Stranger Safety",["stranger safety","stranger","unknown person"],"Do not share personal information, photos, passwords or your location with a stranger. Tell a trusted adult if someone makes you uncomfortable.","Stranger ko personal information, photo, password ya location share mat karo. Koi uncomfortable kare to trusted adult ko batao.",["Private Information","Internet Safety"]);

add("ai","Artificial Intelligence",["artificial intelligence","what is ai","ai"],"AI is technology that helps computers do tasks such as recognizing patterns, answering questions or making suggestions.","AI technology computers ko patterns pehchanne, questions answer karne aur suggestions dene jaise kaam me help karti hai.",["AI Safety","Prompt","Check AI Answers"]);
add("ai","AI Safety",["ai safety","safe ai"],"Do not share passwords, OTPs, home address or other private information with AI. Ask a trusted adult when unsure.","AI ke saath password, OTP, home address ya private information share mat karo. Doubt ho to trusted adult se poochho.",["Prompt","Check AI Answers"]);
add("ai","Prompt",["prompt","ai prompt"],"A prompt is the instruction or question you give to an AI. Clear prompts usually get clearer answers.","Prompt wo instruction ya question hai jo hum AI ko dete hain. Clear prompt se usually clear answer milta hai.",["AI Safety","Check AI Answers"]);
add("ai","Check AI Answers",["check ai answer","verify ai","ai answer"],"AI can make mistakes, so important answers should be checked using a trusted book, teacher, parent or reliable source.","AI galti kar sakta hai, isliye important answer ko trusted book, teacher, parent ya reliable source se verify karna chahiye.",["AI Safety","Prompt"]);

add("coding","Coding",["coding","code","programming"],"Coding means writing instructions that tell a computer what to do.","Coding ka matlab computer ko kya karna hai ye batane wali instructions likhna hota hai.",["Algorithm","Sequence","Loop","Bug"]);
add("coding","Algorithm",["algorithm"],"An algorithm is a clear step-by-step plan for solving a problem.","Algorithm problem solve karne ka clear step-by-step plan hota hai.",["Sequence","Loop"]);
add("coding","Sequence",["sequence"],"A sequence is the order in which steps or instructions happen.","Sequence wo order hai jisme steps ya instructions hote hain.",["Algorithm","Loop"]);
add("coding","Loop",["loop"],"A loop repeats an instruction or group of instructions.","Loop ek instruction ya instructions ke group ko repeat karta hai.",["Sequence","Bug"]);
add("coding","Bug",["bug","debug","debugging"],"A bug is a mistake in a program. Debugging means finding and fixing that mistake.","Bug program ki mistake hoti hai. Debugging ka matlab us mistake ko find aur fix karna hai.",["Coding","Algorithm"]);

add("science","Science",["science"],"Science helps us learn about the natural world by observing, asking questions and testing ideas.","Science observation, questions aur tests ke through natural world ko samajhne me help karta hai.",["Plants","Water Cycle","Weather","Space"]);
add("science","Plants",["plant","plants"],"Plants need water, light, air and suitable conditions to grow.","Plants ko grow karne ke liye water, light, air aur suitable conditions chahiye.",["Water Cycle","Sunlight"]);
add("science","Water Cycle",["water cycle","evaporation","rain"],"Water can evaporate, form clouds and return as rain. This is part of the water cycle.","Water evaporate hota hai, clouds bante hain aur rain ke roop me wapas aata hai. Ye water cycle ka part hai.",["Weather","Cloud"]);
add("science","Weather",["weather"],"Weather tells us what the air and sky are like, such as sunny, rainy, windy or cloudy.","Weather batata hai hawa aur sky ki condition kaisi hai, jaise sunny, rainy, windy ya cloudy.",["Rain","Cloud"]);
add("science","Space",["space","planet","solar system"],"Space contains stars, planets, moons and many other objects. Earth is a planet in our solar system.","Space me stars, planets, moons aur bahut objects hote hain. Earth hamare solar system ka ek planet hai.",["Earth","Moon","Sun"]);

add("english","Hello",["hello","hi"],"Hello is a friendly greeting.","Hello ek friendly greeting hai.",["Please","Thank you"]);
add("english","Please",["please"],"We say 'please' when making a polite request.","Polite request karte waqt hum 'please' bolte hain.",["Thank you","Sorry"]);
add("english","Thank You",["thank you","thanks"],"We say 'thank you' to show gratitude.","Gratitude dikhane ke liye hum 'thank you' bolte hain.",["Please","Sorry"]);
add("english","Sentence",["sentence"],"A sentence is a group of words that expresses a complete idea.","Sentence words ka group hota hai jo complete idea batata hai.",["Noun","Verb"]);

add("health","Water",["drink water","hydration","water"],"Drinking water regularly helps your body stay hydrated.","Regular water peena body ko hydrated rakhne me help karta hai.",["Healthy Food","Exercise"]);
add("health","Healthy Food",["healthy food","fruit","vegetables","balanced plate"],"A balanced plate can include grains, protein foods, vegetables or fruit and water.","Balanced plate me grains, protein foods, vegetables ya fruit aur water ho sakta hai.",["Water","Breakfast"]);
add("health","Sleep",["sleep","bedtime"],"Good sleep helps your body and brain rest and get ready for the next day.","Achhi sleep body aur brain ko rest deti hai aur next day ke liye ready karti hai.",["Exercise","Healthy Food"]);
add("health","Hand Washing",["hand washing","wash hands"],"Wash hands with soap and water, especially before eating and after using the toilet.","Khana khane se pehle aur toilet ke baad soap aur water se haath dhona chahiye.",["Cleanliness"]);
add("health","Teeth",["teeth","brush teeth"],"Brush teeth gently twice a day and ask an adult or dentist for help if something hurts.","Teeth ko din me do baar gently brush karo aur pain ho to adult ya dentist se help lo.",["Healthy Food"]);
add("health","Exercise",["exercise","movement","physical activity"],"Regular movement such as walking, playing and stretching helps keep the body active.","Walking, playing aur stretching jaise regular movement body ko active rakhte hain.",["Water","Sleep"]);

add("gk","Earth",["earth"],"Earth is the planet where we live. It is the third planet from the Sun.","Earth wo planet hai jahan hum rehte hain. Ye Sun se third planet hai.",["Sun","Moon","Space"]);
add("gk","Sun",["sun"],"The Sun is a star at the center of our solar system. It gives Earth light and heat.","Sun hamare solar system ke center me ek star hai. Ye Earth ko light aur heat deta hai.",["Earth","Moon"]);
add("gk","Moon",["moon"],"The Moon is Earth's natural satellite. It moves around Earth.","Moon Earth ka natural satellite hai. Ye Earth ke around move karta hai.",["Earth","Sun"]);
add("gk","Animals",["animal","animals"],"Animals are living things that need food, water and suitable habitats.","Animals living things hote hain jinhe food, water aur suitable habitat chahiye.",["Plants","Earth"]);
add("gk","Patna",["patna"],"Patna is the capital city of Bihar, India. It is an important historic city on the southern bank of the Ganga River.","Patna Bihar, India ki rajdhani hai. Ye Ganga nadi ke dakshini kinare par ek important historic city hai.",["Bihar","India","Gaya"]);
add("gk","Bihar",["bihar"],"Bihar is a state in eastern India. Its capital is Patna.","Bihar eastern India ka ek state hai. Iski rajdhani Patna hai.",["Patna","India","Gaya"]);
add("gk","India",["india","bharat"],"India, also called Bharat, is a country in South Asia. New Delhi is the national capital.","India, jise Bharat bhi kaha jata hai, South Asia ka ek country hai. New Delhi national capital hai.",["New Delhi","Bihar","Patna"]);
add("gk","New Delhi",["new delhi","delhi capital"],"New Delhi is the national capital of India.","New Delhi India ki national capital hai.",["India","Bihar"]);
add("gk","Gaya",["gaya","gaya bihar"],"Gaya is an important city in Bihar, India, known for its cultural and historical significance. Bodh Gaya, nearby, is famous as the place associated with the Buddha's enlightenment.","Gaya Bihar, India ka ek important city hai. Paas ka Bodh Gaya Buddha ke enlightenment se juda hua famous place hai.",["Bihar","Patna","India"]);

const TOPIC_WORDS={
  computer:["computer","hardware","software","cpu","ram","ssd","hdd","monitor","keyboard","mouse","printer","scanner","windows","file","folder","browser","desktop","taskbar"],
  network:["network","networking","lan","wan","wifi","wi-fi","router","switch","ethernet","cable","rj45","ip address","dhcp","dns","gateway","ping","internet","nic"],
  safety:["safety","safe","password","otp","stranger","road","traffic","cleanliness","hygiene","unknown link","private information","home safety","device safety"],
  ai:["ai","artificial intelligence","prompt","chatbot"],
  coding:["coding","code","programming","algorithm","loop","bug","debug"],
  science:["science","plant","plants","water cycle","weather","space","planet"],
  english:["english","sentence","grammar","please","thank you","opposite"],
  health:["healthy","health","sleep","exercise","hydration","fruit","vegetable","teeth","hand washing"],
  math:["math","maths","addition","subtraction","multiplication","division","plus","minus","times"],
  gk:["earth","sun","moon","country","countries","animal","animals","general knowledge","gk","india","bihar","patna","gaya","capital","state","city","new delhi"]
};

function detectTopic(text){
  const q=normalize(text);
  let best="",score=0;
  for(const [topic,list] of Object.entries(TOPIC_WORDS)){
    let s=0;
    for(const w of list){
      if(has(q,w)) s+=w.includes(" ")?3:1;
    }
    if(s>score){best=topic;score=s}
  }
  return score?best:"";
}

function findKnowledge(text,topic=""){
  const q=normalize(text);
  let best=null,bestScore=0;
  for(const item of K){
    if(topic&&item.topic!==topic) continue;
    let score=0;
    for(const key of item.keys){
      const k=normalize(key);
      if(!k) continue;
      if(q===k) score+=12;
      else if(has(q,k)) score+=k.includes(" ")?7:3;
      else if(k.length>4&&q.includes(k)) score+=2;
    }
    if(score>bestScore){best=item;bestScore=score}
  }
  return bestScore?best:null;
}

function topicIntro(topic,hi){
  const m=META[topic];
  if(!m){
    return {
      text:hi?"Kis topic me seekhna hai?":"What would you like to learn?",
      chips:["Computer","Network","Safety","AI","Coding","Science","Math","GK"]
    };
  }

  const intros={
    network:hi
      ?"🌐 Network computers aur devices ko connect karta hai taaki wo information aur resources share kar saken. Tum Wi-Fi, Router, LAN, Internet, IP Address ya Network Cable me se kya seekhna chahte ho?"
      :"🌐 A network connects computers and devices so they can share information and resources. What would you like to learn: Wi-Fi, Router, LAN, Internet, IP Address or Network Cable?",

    safety:hi
      ?"🔐 Safety me hum apne aap, devices aur personal information ko safe rakhna seekhte hain. Tum Internet Safety, Road Safety, Home Safety, Cleanliness, Device Safety ya Stranger Safety me se kya seekhna chahte ho?"
      :"🔐 Safety teaches us how to protect ourselves, our devices and private information. Choose Internet Safety, Road Safety, Home Safety, Cleanliness, Device Safety or Stranger Safety.",

    computer:hi
      ?"💻 Computer topic me hardware, software, CPU, RAM, keyboard, mouse aur Windows seekh sakte ho. Kya choose karoge?"
      :"💻 In Computer, you can learn hardware, software, CPU, RAM, keyboard, mouse and Windows. What would you like?",

    ai:hi
      ?"🤖 AI computer ko smart tasks karne me help karta hai. AI kya hai, prompt, AI safety ya answer verify karna seekhna hai?"
      :"🤖 AI helps computers do smart tasks. Would you like to learn what AI is, prompts, AI safety or checking AI answers?",

    coding:hi
      ?"🧩 Coding computer ko instructions dena hai. Coding, Algorithm, Sequence, Loop ya Bug me kya seekhna hai?"
      :"🧩 Coding means giving instructions to a computer. Choose Coding, Algorithm, Sequence, Loop or Bug.",

    science:hi
      ?"🔬 Science me observation aur questions se duniya ko samajhte hain. Plants, Water Cycle, Weather ya Space me kya seekhna hai?"
      :"🔬 Science helps us understand the world through observation and questions. Choose Plants, Water Cycle, Weather or Space.",

    english:hi
      ?"🔤 English practice me words, polite phrases aur sentences seekh sakte ho. Kya practice karna hai?"
      :"🔤 In English practice, you can learn words, polite phrases and sentences. What would you like to practise?",

    health:hi
      ?"🥗 Healthy habits me water, food, sleep, hand washing, teeth aur exercise seekh sakte ho. Kya choose karoge?"
      :"🥗 Healthy habits include water, food, sleep, hand washing, teeth and exercise. What would you like?",

    math:hi
      ?"➕ Math me addition, subtraction, multiplication aur division practice kar sakte ho. Kya choose karoge?"
      :"➕ In Math, you can practise addition, subtraction, multiplication and division. What would you like?",

    gk:hi
      ?"🌍 General Knowledge me Earth, Sun, Moon, animals aur duniya ke basic facts seekh sakte ho. Kya choose karoge?"
      :"🌍 In General Knowledge, you can learn basic facts about Earth, the Sun, the Moon, animals and our world. What would you like?"
  };

  return {
    text:intros[topic]||`${m.icon} ${m.title}`,
    chips:m.chips
  };
}

function explainItem(item,hi){
  state.topic=item.topic;
  state.subtopic=item.label;
  state.mode="chat";
  state.quiz=null;
  saveState();

  const next=item.next||[];
  const extra=hi
    ?`\n\nAb ${next.length?next.slice(0,3).join(", "):"is topic"} me se kuch pooch sakte ho.`
    :`\n\nNext, you can ask about ${next.length?next.slice(0,3).join(", "):"this topic"}.`;

  return {
    text:(hi?item.hi:item.en)+extra,
    chips:next.slice(0,6)
  };
}



const PLATFORM_KNOWLEDGE=[
  {
    keys:["90 day program","90-day program","90 day journey","90-day journey"],
    en:"The 90-Day Digital + English + Confidence Program is a three-month learning journey. Month 1 builds foundation skills, Month 2 focuses on practice, and Month 3 develops smart skills such as AI prompts, troubleshooting, presentations and the final Digital Mission.",
    hi:"90-Day Digital + English + Confidence Program teen mahine ka learning journey hai. Month 1 Foundation, Month 2 Practice aur Month 3 Smart Skills par focus karta hai—jisme AI prompts, troubleshooting, presentation aur Final Digital Mission bhi aate hain."
  },
  {
    keys:["foundation month","month 1","foundation"],
    en:"Month 1 Foundation covers computer parts, mouse, keyboard, greetings, manners, safety and healthy routines.",
    hi:"Month 1 Foundation me computer parts, mouse, keyboard, greetings, manners, safety aur healthy routines cover hote hain."
  },
  {
    keys:["practice month","month 2","practice stage"],
    en:"Month 2 Practice develops typing, files, internet basics, English conversation, role play and problem-solving skills.",
    hi:"Month 2 Practice me typing, files, internet basics, English conversation, role play aur problem-solving skills develop hote hain."
  },
  {
    keys:["smart skills","month 3"],
    en:"Month 3 Smart Skills includes AI prompts, troubleshooting, mini presentations, portfolio work and the Final Digital Mission.",
    hi:"Month 3 Smart Skills me AI prompts, troubleshooting, mini presentation, portfolio work aur Final Digital Mission shamil hain."
  },
  {
    keys:["weekly evaluation","weekly exam","weekly test"],
    en:"Weekly evaluations are short progress checks designed to review important learning from the week and identify topics that may need more practice.",
    hi:"Weekly evaluation ek short progress check hai jo week ki important learning review karta hai aur batata hai kis topic me aur practice chahiye."
  },
  {
    keys:["monthly exam","monthly assessment"],
    en:"Monthly assessments check broader understanding and progress across the learning completed during the month.",
    hi:"Monthly assessment poore month ki learning, understanding aur progress ko broader way me check karta hai."
  },
  {
    keys:["skill passport","my skill passport"],
    en:"The Skill Passport tracks different abilities separately, such as computer, typing, English, safety, logic, troubleshooting, AI and related learning skills.",
    hi:"Skill Passport alag-alag abilities ko separately track karta hai—jaise computer, typing, English, safety, logic, troubleshooting aur AI skills."
  },
  {
    keys:["learning report","my learning report"],
    en:"The Learning Report summarizes progress and gives a simple recommendation about what the student can practise next.",
    hi:"Learning Report progress ka summary dikhata hai aur next practice ke liye simple recommendation deta hai."
  },
  {
    keys:["5 stage practical","5-stage practical","practical lab","junior digital ai technician lab","junior technician lab"],
    en:"The Class 4–6 Junior Digital & AI Technician Lab has five stages: Port & Device Master, Inside the Computer, Windows & Software Support, AI Smart Technician and the Final Technician Mission.",
    hi:"Class 4–6 Junior Digital & AI Technician Lab me 5 stages hain: Port & Device Master, Inside the Computer, Windows & Software Support, AI Smart Technician aur Final Technician Mission."
  },
  {
    keys:["port device master","port & device master"],
    en:"Port & Device Master teaches safe workstation connections such as monitor, keyboard, mouse, LAN, audio, printer and UPS/power paths inside the simulator.",
    hi:"Port & Device Master simulator me monitor, keyboard, mouse, LAN, audio, printer aur UPS/power connections ko safely identify aur connect karna sikhata hai."
  },
  {
    keys:["inside the computer","pc assembly"],
    en:"Inside the Computer focuses on identifying and installing motherboard components in the correct places using the simulator.",
    hi:"Inside the Computer stage simulator me motherboard components ko identify karke correct place par install karna sikhata hai."
  },
  {
    keys:["windows software support","windows & software support"],
    en:"Windows & Software Support uses a simulated desktop to practise files, folders and common software-support tasks.",
    hi:"Windows & Software Support simulated desktop par files, folders aur common software-support tasks ki practice karata hai."
  },
  {
    keys:["ai smart technician"],
    en:"AI Smart Technician teaches prompt building, privacy protection, checking AI output and responsible AI use.",
    hi:"AI Smart Technician prompt banana, privacy protect karna, AI output verify karna aur responsible AI use sikhata hai."
  },
  {
    keys:["final technician mission"],
    en:"The Final Technician Mission uses realistic support tickets across hardware, software, AI and cyber safety to test safe troubleshooting judgment.",
    hi:"Final Technician Mission hardware, software, AI aur cyber safety ke realistic support tickets ke through safe troubleshooting judgment test karta hai."
  },
  {
    keys:["hardware explorer","parts guide"],
    en:"Hardware Explorer teaches computer parts, ports, cables, what they do, where they are used and safe troubleshooting ideas.",
    hi:"Hardware Explorer computer parts, ports, cables, unka kaam, use aur safe troubleshooting ideas sikhata hai."
  },
  {
    keys:["battle arena","skill challenge","challenge arena"],
    en:"The Skill Challenge Arena lets enrolled same-class learners use safe quiz/game challenge modes such as quick quiz, typing, cyber safety, technical troubleshooting and AI prompts. It does not provide open child-to-child chat.",
    hi:"Skill Challenge Arena same-class enrolled learners ke liye safe quiz/game challenges deta hai—quick quiz, typing, cyber safety, technical troubleshooting aur AI prompts. Isme open child-to-child chat nahi hota."
  }
];

function findPlatformKnowledge(text){
  const q=normalize(text);
  let best=null;
  let bestScore=0;

  for(const item of PLATFORM_KNOWLEDGE){
    let score=0;
    for(const key of item.keys){
      const k=normalize(key);
      if(q===k) score+=12;
      else if(has(q,k)) score+=k.includes(" ")?8:3;
      else if(k.length>5 && q.includes(k)) score+=2;
    }
    if(score>bestScore){
      best=item;
      bestScore=score;
    }
  }

  return bestScore ? best : null;
}


function classBand(){
  if(studentClass<=2) return "foundation";
  if(studentClass<=4) return "growing";
  return "advanced";
}

function politeMannersReply(text){
  const q=cleanTypos(text);

  /*
    Do not treat a genuine vocabulary question as misbehavior.
    Example: "What does stupid mean?"
  */
  if(any(q,[
    "what does",
    "what is the meaning",
    "meaning of",
    "means what",
    "ka matlab",
    "meaning batao"
  ])){
    return null;
  }

  const rude=/\b(idiot|stupid|dumb|moron|shut up|fuck|fucking|shit|asshole|bitch|bastard|chutiya|chutiye|chu+tiya|madarchod|motherfucker|behenchod|bhenchod|gandu|gaand|harami|kamina|kamine|saala|sala)\b/i;
  const rudeHindi=/(मादरचोद|बहनचोद|चूतिया|गांडू|हरामी|कमीना|साला)/i;

  if(!rude.test(q) && !rudeHindi.test(String(text||""))){
    return null;
  }

  const hi=hiMode(text);

  return {
    text:hi
      ?"Hum yahan respect se baat karte hain 😊. Gussa ho to tum “mujhe gussa aa raha hai” ya “I am upset” bol sakte ho. Respectful words se baat aur learning dono better hoti hain. Chalo, ab batao main kis baat me help karun?"
      :"We speak respectfully here 😊. If you are angry, you can say “I am upset” or explain what is bothering you. Respectful words make conversation and learning better. Tell me what you need help with.",
    chips:["😊 Fresh Start","Computer","Quiz"]
  };
}

function localKidSafetyReply(text){
  const raw=String(text||"");
  const q=cleanTypos(raw);
  const hi=hiMode(raw);

  const privateShare=[
    "my password is","mera password hai","mera password",
    "my otp is","mera otp hai","mera otp",
    "my phone number is","mera phone number",
    "my home address is","mera address hai",
    "my school address is","mera school address"
  ];

  if(privateShare.some(x=>q.includes(normalize(x)))){
    return {
      text:hi
        ?"Private information chat me share mat karo. Password, OTP, phone number aur home/school address ko secret rakho 🔐. Agar galti se share ho gaya ho to trusted adult ko batao."
        :"Please do not share private information in chat. Keep passwords, OTPs, phone numbers and home/school addresses secret 🔐. If you shared one by mistake, tell a trusted adult.",
      chips:["Internet Safety","Password Safety"]
    };
  }

  if(/\b(suicide|self harm|hurt myself|kill myself)\b/i.test(raw) ||
     /(खुदकुशी|आत्महत्या|खुद को चोट)/i.test(raw)){
    return {
      text:hi
        ?"Agar tum khud ko hurt karne ke baare me soch rahe ho ya unsafe feel kar rahe ho, abhi kisi trusted adult—parent, teacher ya family member—ko batao aur unke paas raho. Emergency ho to local emergency help lo."
        :"If you are thinking about hurting yourself or feel unsafe, tell a trusted adult—such as a parent, teacher or family member—right now and stay with them. If it is an emergency, contact local emergency help.",
      chips:[]
    };
  }

  if(/\b(make a bomb|build a bomb|kill someone|hurt someone|steal password|hack password|bypass password)\b/i.test(raw)){
    return {
      text:hi
        ?"Main kisi ko hurt karne, dangerous cheez banane ya kisi ka password todne ke steps nahi de sakta. Main safe cyber safety, computer troubleshooting ya learning me help kar sakta hoon. 🛡️"
        :"I cannot give steps for hurting someone, making dangerous items or breaking into someone’s password. I can help with safe cyber safety, computer troubleshooting or learning instead. 🛡️",
      chips:["Cyber Safety","Computer","Network"]
    };
  }

  return null;
}

async function remoteBuddyReply(text,options={}){
  const message=String(text||"").trim();
  if(!message || !BUDDY_AI_CHAT_URL) return null;

  const controller=
    typeof AbortController!=="undefined"
      ?new AbortController()
      :null;

  const timer=
    controller
      ?setTimeout(()=>controller.abort(),12000)
      :null;

  try{
    const response=await fetch(BUDDY_AI_CHAT_URL,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message,
        classNumber:studentClass,
        topic:state.topic||"",
        mode:options.mode||state.mode||"chat",
        language:buddyLanguage,
        pageTitle:String(document.title||"").slice(0,160),
        pagePath:String(location.pathname||"").slice(0,160),
        platformContext:ACADEMY_PLATFORM_CONTEXT.slice(0,6500)
      }),
      cache:"no-store",
      signal:controller?.signal
    });

    const data=await response.json().catch(()=>({}));

    if(!response.ok || !data?.text){
      return null;
    }

    const answer=String(data.text).trim();
    if(!answer) return null;

    state.lastSource="smart";
    saveState();

    return {
      text:answer,
      chips:[
        "😊 Make it Easy",
        "📚 Explain More",
        "🎯 Give Example",
        "Quiz"
      ]
    };

  }catch{
    return null;
  }finally{
    if(timer) clearTimeout(timer);
  }
}

function aboutStudentReply(text){
  const q=cleanTypos(text);

  if(!any(q,[
    "what do you know about me",
    "what you know about me",
    "what do u know about me",
    "tell me about me",
    "mere bare me kya jante ho",
    "mere baare me kya jante ho",
    "mere baare me batao"
  ])){
    return null;
  }

  const hi=hiMode(text);

  if(studentLoggedIn){
    return {
      text:hi
        ?`Main sirf safe Academy information janta hoon: tumhara first name ${firstName()} hai aur tum Class ${studentClass} me ho. Is chat me jo baat tum mujhse karte ho, us context ko use karke help karta hoon. Main tumhara password, OTP, home address ya doosri private information nahi janta—aur tumhe ye kabhi share bhi nahi karna chahiye.`
        :`I only know safe Academy information: your first name is ${firstName()} and you are in Class ${studentClass}. I use what we discuss in this chat to help you. I do not know your password, OTP, home address or other private information—and you should never share those.`,
      chips:["What can you do?","Safety","Let's learn"]
    };
  }

  return {
    text:hi
      ?"Main tumhare baare me sirf wahi janta hoon jo tum is chat me khud batate ho. Main password, OTP, phone number ya address nahi maangta. Private information hamesha private rakho. 🔐"
      :"I only know what you choose to tell me in this chat. I do not ask for passwords, OTPs, phone numbers or addresses. Keep private information private. 🔐",
    chips:["What can you do?","Safety"]
  };
}

function socialReply(text){
  const q=cleanTypos(text);
  const hi=hiMode(text);

  const out=(en,hg,chips=[])=>({
    text:hi?hg:en,
    chips
  });

  const c=(...p)=>p.some(x=>has(q,x));
  const exact=(...p)=>p.includes(q);

  const aboutMe=aboutStudentReply(text);
  if(aboutMe) return aboutMe;

  if(c(
    "aur bhai kya haal hai",
    "bhai kya haal hai",
    "kya haal hai",
    "kya hal hai",
    "kaisa chal raha hai",
    "kaise chal raha hai",
    "whats up",
    "wassup",
    "sup bro"
  )){
    return out(
      `All good here 😄! I'm ready whenever you are. How are things with you, ${firstName()}?`,
      `Sab badhiya bhai 😄! Main ready hoon. Tum batao ${firstName()}, kya haal hai?`,
      ["I am good","Tell me a joke","Let's learn","Quiz"]
    );
  }

  if(c(
    "tell me about yourself",
    "tell me about your self",
    "tell me about yourself tannu",
    "tell me about your self tannu",
    "about yourself tannu",
    "about you tannu",
    "tannu who are you"
  )){
    return out(
      `I'm Tannu's Learning Buddy 🤖. I'm a virtual learning assistant for Classes 1 to 6. I can chat normally, explain lessons, help with computer and IT lab questions, practise English, give quizzes and guide safe digital habits. I don't have a human age, home or private life.`,
      `Main Tannu's Learning Buddy hoon 🤖. Main Class 1 se 6 ke students ke liye virtual learning assistant hoon. Main normal chat, lessons, computer/IT lab help, English practice, quizzes aur safe digital habits me help karta hoon. Meri human age, ghar ya private life nahi hai.`,
      ["What can you do?","What do you know about me?","Quiz"]
    );
  }

  if(c(
    "are you a girl",
    "are you girl",
    "are you a boy",
    "are you boy",
    "tum ladki ho",
    "tum ladka ho"
  )){
    return out(
      "I'm a virtual Learning Buddy, so I am not a human girl or boy 😊. My spoken reply can use a friendly female-style voice when your device provides one.",
      "Main virtual Learning Buddy hoon, isliye human ladki ya ladka nahi hoon 😊. Tumhare device me available ho to meri spoken reply friendly female-style voice me sunai degi.",
      ["Who are you?","What can you do?"]
    );
  }

  if(
    exact("hi","hello","hey","hii","hiii","helo","helloo","good morning","good afternoon","good evening") ||
    c("namaste","salam","assalamualaikum","assalamu alaikum")
  ){
    return out(
      `Hi ${firstName()} 😊! I'm happy to chat with you. What would you like to learn or talk about today?`,
      `Hi ${firstName()} 😊! Main tumse baat karke khush hoon. Aaj kya seekhna ya baat karna chahoge?`,
      ["Computer","Network","Safety","AI","Quiz"]
    );
  }

  if(c(
    "what is your name",
    "what your name",
    "your name",
    "tell me your name",
    "tumhara naam kya hai",
    "tumhara name kya hai",
    "aapka naam kya hai",
    "apka naam kya hai",
    "naam kya hai"
  )){
    return out(
      "My name is Tannu's Learning Buddy 🤖. I'm your friendly learning helper at Tannu Sir's Kids Digital Academy.",
      "Mera naam Tannu's Learning Buddy hai 🤖. Main Tannu Sir's Kids Digital Academy me tumhara friendly learning helper hoon.",
      ["Who are you?","How are you?","What can you do?"]
    );
  }

  if(c("who are you","who are u","tum kaun ho","aap kaun ho")){
    return out(
      "I'm Tannu's Learning Buddy 🤖 — a virtual learning friend made to help kids practise computer, network, safety, AI, coding, science, English and more.",
      "Main Tannu's Learning Buddy hoon 🤖 — ek virtual learning friend jo Computer, Network, Safety, AI, Coding, Science, English aur doosre topics me help karta hai.",
      ["What can you do?","Network","Quiz"]
    );
  }

  if(c("how are you","how you are","how are u","how r you","how r u","kaise ho","tum kaise ho","aap kaise ho")){
    return out(
      "I'm doing great 😊 and I'm ready to learn with you. How are you today?",
      "Main bilkul achha hoon 😊 aur tumhare saath seekhne ke liye ready hoon. Tum aaj kaise ho?",
      ["I am good","I am happy","Let's learn","Quiz"]
    );
  }

  if(c(
    "where are you from",
    "where you from",
    "where do you live",
    "where are you",
    "tum kahan se ho",
    "tum kaha se ho",
    "aap kahan se ho",
    "tum kahan rehte ho",
    "tum kaha rehte ho"
  )){
    return out(
      "I don't live in a real city like a person 😊. I'm a virtual Learning Buddy, and I live right here inside Tannu Sir's Kids Digital Academy website.",
      "Main insan ki tarah kisi real city me nahi rehta 😊. Main virtual Learning Buddy hoon aur Tannu Sir's Kids Digital Academy website ke andar tumhare saath rehta hoon.",
      ["Who made you?","What can you do?"]
    );
  }

  if(c(
    "what are you doing",
    "what you doing",
    "what are u doing",
    "what r you doing",
    "what r u doing",
    "kya kar rahe ho",
    "tum kya kar rahe ho",
    "aap kya kar rahe ho"
  )){
    return out(
      "Right now I'm chatting with you 😊, listening to your questions and helping you learn.",
      "Abhi main tumse chat kar raha hoon 😊, tumhare questions sun raha hoon aur tumhe seekhne me help kar raha hoon.",
      ["Network","Safety","Quiz","Tell me a joke"]
    );
  }

  if(c(
    "what are you eating",
    "what do you eat",
    "are you eating",
    "what r u eating",
    "kya kha rahe ho",
    "tum kya khate ho",
    "kya khaoge"
  )){
    return out(
      "I don't eat food because I'm a virtual buddy 😄. But you can tell me what you're eating, and we can talk about healthy food too.",
      "Main food nahi khata kyunki main virtual buddy hoon 😄. Lekin tum mujhe bata sakte ho tum kya kha rahe ho, aur hum healthy food ke baare me bhi baat kar sakte hain.",
      ["Healthy Food","Water","Fruit","Quiz"]
    );
  }

  if(c("do you sleep","are you sleeping","tum sote ho","tum sota ho","sleep karte ho")){
    return out(
      "I don't need sleep like people do 😄. I wait here quietly until you want to learn or chat again.",
      "Mujhe insan ki tarah sleep ki zarurat nahi hoti 😄. Jab tak tum dobara baat ya learning nahi karte, main yahin wait karta hoon.",
      ["Why do people sleep?","Healthy Habits"]
    );
  }

  if(c("how old are you","what is your age","your age","tumhari age kya hai","tum kitne saal ke ho")){
    return out(
      "I don't have a human age because I'm a virtual Learning Buddy 🤖.",
      "Meri human age nahi hai kyunki main virtual Learning Buddy hoon 🤖.",
      ["Who are you?","What can you do?"]
    );
  }

  if(c("are you human","are you robot","are you a robot","tum insan ho","tum robot ho","robot ho kya")){
    return out(
      "I'm not a human. I'm a virtual Learning Buddy 🤖 made to chat and help kids learn safely.",
      "Main human nahi hoon. Main virtual Learning Buddy hoon 🤖 jo kids ko safely learn aur chat karne me help karta hai.",
      ["What can you do?","AI","Network"]
    );
  }

  if(c(
    "who made you",
    "who created you",
    "who built you",
    "tumhe kisne banaya",
    "tumko kisne banaya",
    "kisne banaya"
  )){
    return out(
      "I was made for Tannu Sir's Kids Digital Academy to help children learn in a friendly and safe way 😊.",
      "Mujhe Tannu Sir's Kids Digital Academy ke liye banaya gaya hai taaki kids friendly aur safe way me seekh saken 😊.",
      ["What can you do?","Computer","Network","Safety"]
    );
  }

  if(c(
    "what can you do",
    "what you can do",
    "how can you help",
    "can you help me",
    "help me",
    "tum kya kar sakte ho",
    "tum kya jante ho",
    "meri help karoge"
  )){
    return out(
      "I can help with the full learning platform, safe school-level general knowledge and normal everyday questions. That includes Computer, Hardware, Windows, Network, IT Labs, Safety, AI, Coding, Science, English, Healthy Habits, Math, GK, the 90-Day Program, tests, progress, Skill Passport, practical labs, quizzes, examples and troubleshooting 😊.",
      "Main poore learning platform, safe school-level general knowledge aur normal everyday questions me help kar sakta hoon. Isme Computer, Hardware, Windows, Network, IT Labs, Safety, AI, Coding, Science, English, Healthy Habits, Math, GK, 90-Day Program, tests, progress, Skill Passport, practical labs, quizzes aur troubleshooting shamil hain 😊.",
      ["Computer","Network","Safety","AI","Coding","Quiz"]
    );
  }

  if(c(
    "are you my friend",
    "will you be my friend",
    "can we be friends",
    "tum mere friend ho",
    "mere dost ho",
    "dost banoge"
  )){
    return out(
      "I can be your friendly Learning Buddy here 😊. Real-life friends, family and teachers are important too.",
      "Main yahan tumhara friendly Learning Buddy ban sakta hoon 😊. Real-life friends, family aur teachers bhi bahut important hote hain.",
      ["Tell me a joke","Quiz","Let's learn"]
    );
  }

  if(
    exact("thanks","thank you","thankyou","thx") ||
    c("bahut acha","shukriya","dhanyavad","dhanyawaad")
  ){
    return out(
      `You're welcome ${firstName()} 😊! I'm ready whenever you want to learn something else.`,
      `Welcome ${firstName()} 😊! Jab bhi kuch aur seekhna ho, main ready hoon.`,
      ["Network","Safety","Quiz"]
    );
  }

  if(c("good night","goodnight","shab bakhair","shubh ratri")){
    return out(
      `Good night ${firstName()} 🌙. Have a peaceful sleep and a great day tomorrow!`,
      `Good night ${firstName()} 🌙. Achhi sleep karo aur kal fresh hokar seekhna!`
    );
  }

  if(
    exact("bye","byee","goodbye","see you","see ya") ||
    c("phir milenge","allah hafiz","khuda hafiz")
  ){
    return out(
      `Bye ${firstName()} 👋! See you next time. Keep learning and stay safe!`,
      `Bye ${firstName()} 👋! Phir milenge. Seekhte raho aur safe raho!`
    );
  }

  if(
    c("tell me a joke","joke sunao","funny joke") ||
    exact("joke","another joke","aur joke")
  ){
    const en=[
      "Why did the computer go to school? Because it wanted to improve its memory 😄.",
      "Why was the keyboard happy? Because it had all the right keys 😄.",
      "What did one Wi-Fi signal say to the other? I feel a connection 😄."
    ];

    const hg=[
      "Computer school kyun gaya? Kyunki use apni memory improve karni thi 😄.",
      "Keyboard khush kyun tha? Kyunki uske paas saari right keys thi 😄.",
      "Ek Wi-Fi signal ne doosre se kya kaha? Mujhe connection feel ho raha hai 😄."
    ];

    return {
      text:hi?pick(hg):pick(en),
      chips:["Another joke","Quiz","Network"]
    };
  }

  if(c("i am happy","i feel happy","main khush hu","main khush hoon")){
    return out(
      "That's nice to hear 😊! Want to celebrate with a quick quiz or learn something fun?",
      "Ye sunkar achha laga 😊! Ek fun quiz karein ya kuch interesting seekhein?",
      ["Quiz","Science","Network"]
    );
  }

  if(c("i am sad","i feel sad","main sad hu","main udaas hu","main udaas hoon")){
    return out(
      "I'm sorry you're feeling sad. You can talk to a trusted parent, family member or teacher. We can also do a small fun activity together 😊.",
      "Mujhe afsos hai ki tum sad feel kar rahe ho. Trusted parent, family member ya teacher se baat karna achha hota hai. Hum yahan ek chhoti fun activity bhi kar sakte hain 😊.",
      ["Tell me a joke","Easy Quiz","Science"]
    );
  }

  if(c("i am scared","i feel scared","main dar raha hu","main dar rahi hu","mujhe dar lag raha hai")){
    return out(
      "If something is making you feel unsafe or scared, please tell a trusted adult near you right away. You don't have to handle a scary situation alone.",
      "Agar koi situation tumhe unsafe ya scared feel kara rahi hai, turant paas ke trusted adult ko batao. Scary situation ko akela handle karne ki zarurat nahi hai."
    );
  }

  if(c("i am good","i am fine","im good","im fine","main thik hu","main theek hu","main achha hu")){
    return out(
      "That's great 😊! What would you like to do next?",
      "Bahut achha 😊! Ab kya karna chahoge?",
      ["Network","Safety","Quiz","Computer"]
    );
  }

  if(exact("yes","yeah","yup","haan","ha")){
    return out(
      "Great 😊! Tell me what you'd like to do next.",
      "Great 😊! Ab batao next kya karna hai.",
      ["Computer","Network","Safety","Quiz"]
    );
  }

  if(exact("no","nope","nahi")){
    return out(
      "No problem 😊. You can ask me something else whenever you're ready.",
      "Koi problem nahi 😊. Jab ready ho, kuch aur pooch lena.",
      ["Chat","Network","Quiz"]
    );
  }

  return null;
}

function simpleMath(text,hi){
  const q=normalize(text);
  const m=q.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);

  if(!m) return null;

  const a=Number(m[1]);
  const b=Number(m[3]);
  const op=m[2];

  if(op==="/"&&b===0){
    return {
      text:hi?"0 se divide nahi kar sakte.":"You cannot divide by zero.",
      chips:["Math"]
    };
  }

  const v=
    op==="+" ? a+b :
    op==="-" ? a-b :
    op==="*" ? a*b :
    a/b;

  if(!Number.isFinite(v)) return null;

  state.topic="math";
  state.subtopic="";
  saveState();

  return {
    text:hi
      ?`${a} ${op} ${b} = ${v}. Chaho to ek aur Math question poochho 😊.`
      :`${a} ${op} ${b} = ${v}. Ask me another Math question 😊.`,
    chips:["Addition","Subtraction","Multiplication","Division"]
  };
}

const QUIZ={
  computer:[
    ["Which part shows pictures and text?","Monitor",["Monitor","Keyboard","Router"]],
    ["Which device is used to type?","Keyboard",["Keyboard","Mouse","Printer"]],
    ["Which memory is short-term working memory?","RAM",["RAM","SSD","Monitor"]]
  ],

  network:[
    ["Which device connects networks?","Router",["Router","Keyboard","Printer"]],
    ["Which technology connects devices wirelessly?","Wi-Fi",["Wi-Fi","VGA","Scanner"]],
    ["What identifies a device on an IP network?","IP Address",["IP Address","Folder","Mouse"]],
    ["What can check whether another device is reachable?","Ping",["Ping","Paint","Paste"]]
  ],

  safety:[
    ["What should you do with an unknown link?","Do not click it",["Do not click it","Share it","Enter password"]],
    ["What should you never share with a stranger?","Password",["Password","Favourite color","Drawing"]],
    ["Before crossing a road, what should you do?","Look both ways",["Look both ways","Run quickly","Use a phone"]]
  ],

  ai:[
    ["Should you share your OTP with AI?","No",["No","Yes","Always"]],
    ["What is an instruction given to AI called?","Prompt",["Prompt","Printer","Packet"]]
  ],

  coding:[
    ["What is a step-by-step plan called?","Algorithm",["Algorithm","Monitor","Password"]],
    ["What repeats instructions?","Loop",["Loop","Folder","Router"]]
  ],

  science:[
    ["What do plants need to grow?","Water and light",["Water and light","Only plastic","No air"]],
    ["Earth is a...","Planet",["Planet","Keyboard","Cable"]]
  ],

  english:[
    ["Which word makes a request polite?","Please",["Please","Never","Stop"]],
    ["What do we say to show gratitude?","Thank you",["Thank you","Router","Delete"]]
  ],

  health:[
    ["Which drink is a good everyday choice?","Water",["Water","Unknown drink","Only soda"]],
    ["When should you wash hands?","Before eating",["Before eating","Never","Only once a month"]]
  ],

  math:[
    ["What is 5 + 3?","8",["8","6","9"]],
    ["What is 10 - 4?","6",["6","5","7"]],
    ["What is 3 * 2?","6",["6","5","8"]]
  ],

  gk:[
    ["Which planet do we live on?","Earth",["Earth","Mars","Sun"]],
    ["The Sun is a...","Star",["Star","Planet","Moon"]]
  ]
};

function quizTopics(){
  return Object.keys(QUIZ);
}

function startQuiz(topic,hi){

  if(!topic||!QUIZ[topic]){
    state.mode="quiz-select";
    state.quiz=null;
    saveState();

    return {
      text:hi
        ?"🎯 Kis topic ka quiz chahiye?"
        :"🎯 Which topic would you like a quiz on?",
      chips:[
        "Computer Quiz",
        "Network Quiz",
        "Safety Quiz",
        "AI Quiz",
        "Coding Quiz",
        "Science Quiz",
        "Math Quiz",
        "GK Quiz"
      ]
    };
  }

  const q=pick(QUIZ[topic]);

  state.topic=topic;
  state.mode="quiz";
  state.quiz={
    q:q[0],
    a:q[1],
    opts:q[2]
  };

  saveState();

  return {
    text:`🎯 ${q[0]}`,
    chips:q[2]
  };
}

function parseQuizTopic(text){

  const q=normalize(text);

  for(const t of quizTopics()){
    if(
      has(q,`${t} quiz`) ||
      (q===t&&state.mode==="quiz-select")
    ){
      return t;
    }
  }

  if(
    has(q,"gk quiz") ||
    has(q,"general knowledge quiz")
  ){
    return "gk";
  }

  return "";
}

function answerQuiz(text){

  if(
    state.mode!=="quiz" ||
    !state.quiz
  ){
    return null;
  }

  const quiz=state.quiz;
  const q=normalize(text);
  const a=normalize(quiz.a);

  const correct=
    q===a ||
    has(q,a) ||
    has(a,q);

  const hi=hiMode(text);
  const topic=state.topic;

  state.quiz=null;
  state.mode="chat";
  saveState();

  if(correct){
    return {
      text:hi
        ?`✅ Bilkul sahi! Answer: ${quiz.a}. Ek aur ${META[topic]?.title||"topic"} quiz chahiye?`
        :`✅ Correct! The answer is ${quiz.a}. Want another ${META[topic]?.title||"topic"} quiz?`,
      chips:["Another Quiz","Explain Topic","Next Topic"]
    };
  }

  return {
    text:hi
      ?`🙂 Good try. Sahi answer: ${quiz.a}. Chaho to main simple explanation bhi de sakta hoon.`
      :`🙂 Good try. The correct answer is ${quiz.a}. I can explain it simply too.`,
    chips:["Explain Topic","Another Quiz"]
  };
}

function isQuizCommand(q){
  return any(q,[
    "quiz",
    "quiz do",
    "question poochho",
    "test me",
    "give me quiz"
  ]);
}

function isShortFollowup(q){
  return (
    words(q).length<=5 &&
    any(q,[
      "aur batao",
      "more",
      "example",
      "example do",
      "samjhao",
      "why",
      "kyu",
      "kaise",
      "next"
    ])
  );
}

function safeEmergency(text,hi){

  if(any(text,[
    "danger",
    "emergency",
    "lost",
    "hurt",
    "scared",
    "unsafe"
  ])){
    return {
      text:hi
        ?"Agar tum unsafe, scared ya hurt feel kar rahe ho to turant trusted adult, parent, teacher ya local emergency service se help lo. Chatbot emergency help replace nahi karta."
        :"If you feel unsafe, scared or hurt, tell a trusted adult, parent or teacher immediately, or contact local emergency services. A chatbot cannot replace emergency help.",
      chips:["Road Safety","Home Safety","Stranger Safety"]
    };
  }

  return null;
}

function questionBankHint(text,hi){

  if(!questionBank.length) return null;

  const q=normalize(text);
  const qt=words(q).filter(w=>w.length>3);

  if(!qt.length) return null;

  let best=null;
  let bestScore=0;

  for(const item of questionBank.slice(0,5200)){

    const hay=normalize(
      `${item.cat||""} ${item.q||""} ${item.a||""}`
    );

    let score=0;

    for(const w of qt){
      if(hay.includes(w)) score++;
    }

    if(score>bestScore){
      best=item;
      bestScore=score;
    }
  }

  if(
    bestScore>=2 &&
    best?.a
  ){
    return {
      text:hi
        ?`Is topic se related ek practice hint hai: “${best.a}”. Agar tum exact question thoda simple words me poochho to main better explain karunga.`
        :`A related practice hint is “${best.a}”. Ask the exact question in a few simple words and I can explain it better.`,
      chips:[String(best.a)]
    };
  }

  return null;
}

async function buildAnswer(text){

  const hi=hiMode(text);
  const q=cleanTypos(text);

  const safety=localKidSafetyReply(text);
  if(safety) return safety;

  const manners=politeMannersReply(text);
  if(manners) return manners;

  const social=socialReply(text);
  if(social) return social;

  const emergency=safeEmergency(q,hi);
  if(emergency) return emergency;

  const math=simpleMath(q,hi);
  if(math) return math;

  if(state.lastAnswer && any(q,[
    "make it easy",
    "make this easy",
    "easy please",
    "simple karo",
    "aur simple",
    "easy samjhao"
  ])){
    const r=await remoteBuddyReply(
      `Explain this previous answer in much easier words for a Class ${studentClass} child. Keep it short and accurate. Previous answer: ${state.lastAnswer}`,
      {mode:"simplify"}
    );

    if(r) return r;

    return {
      text:hi
        ?`Simple way: ${String(state.lastAnswer).split(/[.!?]/)[0]}. Agar chaho to exact topic naam bhejo, main step-by-step samjhaunga.`
        :`Simple way: ${String(state.lastAnswer).split(/[.!?]/)[0]}. Send me the exact topic name and I can explain it step by step.`,
      chips:["🎯 Give Example","Quiz"]
    };
  }

  if(state.lastAnswer && any(q,[
    "explain more",
    "more detail",
    "aur detail",
    "detail me samjhao",
    "thoda aur samjhao"
  ])){
    const r=await remoteBuddyReply(
      `Explain this previous answer a little more for a Class ${studentClass} child. Use a clear example, but keep it age-appropriate and concise. Previous answer: ${state.lastAnswer}`,
      {mode:"explain-more"}
    );
    if(r) return r;
  }

  if(state.lastAnswer && any(q,[
    "give example",
    "give an example",
    "example please",
    "example do",
    "ek example"
  ])){
    const r=await remoteBuddyReply(
      `Give one simple real-life example for this previous answer for a Class ${studentClass} child: ${state.lastAnswer}`,
      {mode:"example"}
    );
    if(r) return r;
  }

  if(any(q,[
    "another quiz",
    "next quiz",
    "ek aur quiz"
  ])){
    return startQuiz(
      state.topic,
      hi
    );
  }

  if(isQuizCommand(q)){
    return startQuiz(
      state.topic,
      hi
    );
  }

  if(any(q,[
    "next topic",
    "change topic",
    "dusra topic",
    "other topic"
  ])){

    state.topic="";
    state.subtopic="";
    state.mode="chat";
    state.quiz=null;

    saveState();

    return {
      text:hi
        ?"Kaunsa topic choose karna hai?"
        :"Choose a topic to learn.",
      chips:[
        "Computer",
        "Network",
        "Safety",
        "AI",
        "Coding",
        "Science",
        "English",
        "Healthy Habits",
        "Math",
        "GK"
      ]
    };
  }

  if(
    any(q,[
      "explain topic",
      "explain this",
      "samjhao",
      "isko samjhao"
    ]) &&
    state.subtopic
  ){
    const old=K.find(
      x=>
        x.label===state.subtopic &&
        x.topic===state.topic
    );

    if(old){
      return explainItem(
        old,
        hi
      );
    }
  }

  const platformItem=findPlatformKnowledge(q);

  if(platformItem){
    state.lastSource="academy-platform";
    saveState();

    return {
      text:hi ? platformItem.hi : platformItem.en,
      chips:["90-Day Program","Skill Passport","Practical Lab","Quiz"]
    };
  }

  const explicit=detectTopic(q);

  if(
    explicit &&
    explicit!==state.topic
  ){
    state.topic=explicit;
    state.subtopic="";
    state.mode="chat";
    state.quiz=null;
    saveState();
  }

  const introNames={
    computer:["computer"],
    network:["network","networking"],
    safety:["safety"],
    ai:["ai","artificial intelligence"],
    coding:["coding"],
    science:["science"],
    english:["english"],
    health:["health","healthy habits"],
    math:["math","maths"],
    gk:["gk","general knowledge"]
  };

  if(
    explicit &&
    introNames[explicit]?.includes(q)
  ){
    return topicIntro(
      explicit,
      hi
    );
  }

  let item=findKnowledge(
    q,
    state.topic
  );

  if(!item){
    item=findKnowledge(
      q,
      ""
    );
  }

  if(item){
    return explainItem(
      item,
      hi
    );
  }

  if(
    isShortFollowup(q) &&
    state.subtopic
  ){

    const prev=K.find(
      x=>
        x.label===state.subtopic &&
        x.topic===state.topic
    );

    if(prev){

      if(any(q,[
        "example",
        "example do"
      ])){
        return {
          text:hi
            ?`${prev.label} ka simple example: ${prev.hi} Real life me ise safely use ya identify karna important hai.`
            :`Simple ${prev.label} example: ${prev.en} In real life, it is important to identify or use it safely.`,
          chips:prev.next||[]
        };
      }

      return {
        text:
          (hi?prev.hi:prev.en) +
          (
            hi
              ?" Is topic ko chhote steps aur examples se yaad rakho."
              :" Remember it using small steps and examples."
          ),
        chips:prev.next||[]
      };
    }
  }

  /*
    Local Academy knowledge gets first priority.
    If no local answer matched, use the safe AI worker for natural
    everyday questions and broader Class 1–6 learning questions.
  */
  const smart=await remoteBuddyReply(text);

  if(smart){
    return smart;
  }

  const bank=questionBankHint(
    q,
    hi
  );

  if(bank){
    state.lastSource="local-bank";
    saveState();
    return bank;
  }

  if(state.topic){
    return {
      text:hi
        ?"😊 Main Computer, AI, Safety, Network, IT Lab, Science, Math, English aur General Knowledge sab me help kar sakta hoon. Koi specific sawal poochho—jaise: CPU kya hai? AI kya hai? Online safe kaise rahen? Bihar ki capital kya hai?"
        :"😊 I can help with Computer, AI, Safety, Network, IT Lab, Science, Math, English and General Knowledge. Ask me something specific—for example: What is a CPU? What is AI? How can I stay safe online? What is the capital of Bihar?",
      chips:[
        "Computer",
        "AI",
        "Safety",
        "GK",
        "IT Lab",
        "Quiz"
      ]
    };
  }

  return {
    text:hi
      ?"Is sawal ka reliable answer mujhe abhi nahi mil pa raha 😊. Main guess karke galat information nahi dunga. Question ko thoda aur clear karke poochho; main Academy topics aur safe school-level general knowledge dono me help karunga."
      :"I cannot get a reliable answer to that right now 😊. I will not guess and give you incorrect information. Try asking it a little more clearly; I can help with Academy topics and safe school-level general knowledge.",
    chips:[
      "Computer",
      "Network",
      "Safety",
      "AI",
      "Coding",
      "Science",
      "Math",
      "GK"
    ]
  };
}

function style(){

  if($("tannuBuddyV21Style")){
    return;
  }

  const s=
    document.createElement(
      "style"
    );

  s.id=
    "tannuBuddyV21Style";

  s.textContent=`

#tannuBuddyLaunch{
position:fixed;
right:18px;
bottom:18px;
z-index:99998;
width:86px;
height:86px;
border:0;
border-radius:28px;
background:linear-gradient(
145deg,
#22d3ee,
#8b5cf6 48%,
#ec4899
);
box-shadow:
0 18px 45px #08123a55;
color:#fff;
cursor:pointer;
font-weight:900;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:1px;
font-family:
system-ui,
sans-serif;
}

#tannuBuddyLaunch .bot{
font-size:34px;
line-height:1;
}

#tannuBuddyLaunch small{
font-size:11px;
}

#tannuBuddyPanel{
position:fixed;
right:24px;
bottom:24px;
width:min(
470px,
calc(100vw - 20px)
);
height:min(
690px,
calc(100vh - 20px)
);
z-index:99999;
background:#fff;
border:2px solid #fff;
border-radius:30px;
box-shadow:
0 28px 90px #111b5566;
overflow:hidden;
display:none;
flex-direction:column;
font-family:
system-ui,
-apple-system,
Segoe UI,
sans-serif;
color:#20245b;
}

#tannuBuddyPanel.open{
display:flex;
}

#tannuBuddyHead{
padding:15px 16px;
background:
linear-gradient(
100deg,
#5847d8,
#a653e7,
#ff6fa8,
#31c5c9
);
color:#fff;
display:flex;
align-items:center;
gap:12px;
cursor:move;
user-select:none;
}

.tb-avatar{
width:58px;
height:58px;
border-radius:50%;
background:#fff2;
display:grid;
place-items:center;
font-size:35px;
border:2px solid #fff;
}

.tb-title{
flex:1;
}

.tb-title b{
display:block;
font-size:18px;
}

.tb-title small{
font-weight:800;
font-size:10px;
}

.tb-close{
width:42px;
height:42px;
border:0;
border-radius:50%;
background:#ffffff26;
color:#fff;
font-size:23px;
cursor:pointer;
}

.tb-status{
padding:8px 14px;
background:#f8f7ff;
border-bottom:
1px solid #ebe9ff;
display:flex;
justify-content:
space-between;
align-items:center;
font-size:11px;
font-weight:900;
}

.tb-topic{
background:#eee9ff;
padding:5px 9px;
border-radius:999px;
}

#tannuBuddyMessages{
flex:1;
overflow:auto;
padding:14px;
background:
linear-gradient(
#fff,
#fbfaff
);
}

.tb-row{
display:flex;
margin:8px 0;
}

.tb-row.user{
justify-content:flex-end;
}

.tb-bubble{
max-width:84%;
padding:12px 14px;
border-radius:18px;
background:#f0edff;
border:
1px solid #ded8ff;
font-size:14px;
line-height:1.48;
font-weight:700;
white-space:pre-wrap;
}

.tb-row.user .tb-bubble{
background:#ddfff5;
border-color:#bcefe1;
color:#176b5a;
}

.tb-chips{
display:flex;
gap:7px;
flex-wrap:wrap;
margin:4px 0 12px;
}

.tb-chip{
border:
1px solid #d9d4ff;
background:#fff;
color:#4d3eaf;
border-radius:999px;
padding:7px 10px;
font-weight:800;
cursor:pointer;
font-size:12px;
}

.tb-chip:hover{
background:#f1efff;
}

#tannuBuddyQuick{
display:grid;
grid-template-columns:
repeat(3,minmax(0,1fr));
gap:7px;
padding:9px 12px;
border-top:
1px solid #eee;
background:#fff;
}

.tb-quick{
border:0;
border-radius:14px;
padding:10px 5px;
font-weight:900;
font-size:11px;
line-height:1.05;
cursor:pointer;
transition:transform .16s ease,box-shadow .16s ease,filter .16s ease;
}

.tb-quick:hover{
transform:translateY(-1px);
filter:brightness(1.02);
box-shadow:0 5px 12px rgba(70,61,150,.10);
}

.tb-chat{
background:#fff0f5;
color:#b23e72;
}

.tb-computer{
background:linear-gradient(135deg,#e8f6ff,#dff2ff);
color:#176f9c;
}

.tb-ai{
background:linear-gradient(135deg,#f0e8ff,#f9e4ff);
color:#7440bd;
}

.tb-safety{
background:linear-gradient(135deg,#fff7d9,#fff0c8);
color:#936b00;
}

.tb-gk{
background:linear-gradient(135deg,#e6fff3,#ddf8ff);
color:#14785f;
}

.tb-quiz{
background:linear-gradient(135deg,#eeeaff,#e7e4ff);
color:#6245c8;
}

.tb-compose{
display:grid;
grid-template-columns:
1fr 44px 48px;
gap:8px;
padding:10px 12px;
background:#fff;
border-top:
1px solid #eee;
}

.tb-compose input{
min-width:0;
border:
2px solid #dddaf3;
border-radius:16px;
padding:0 12px;
font-size:14px;
outline:none;
}

.tb-compose input:focus{
border-color:#8b5cf6;
}

.tb-compose button{
border:0;
border-radius:14px;
font-size:20px;
cursor:pointer;
}

.tb-mic{
background:#ffe0ef;
}

.tb-send{
background:
linear-gradient(
145deg,
#6d5dfc,
#22b8d5
);
color:#fff;
}

.tb-foot{
text-align:center;
padding:6px;
font-size:9px;
font-weight:800;
color:#69658d;
background:#fafaff;
}

@media(max-width:600px){

#tannuBuddyPanel{
right:5px;
bottom:5px;
width:
calc(100vw - 10px);
height:
min(
720px,
calc(100vh - 10px)
);
border-radius:22px;
}

#tannuBuddyLaunch{
right:12px;
bottom:12px;
}

}

`;

  document.head.appendChild(s);
}


function installBuddyV40Style(){
  if($("tannuBuddyV40Style")) return;

  const s=document.createElement("style");
  s.id="tannuBuddyV40Style";
  s.textContent=`
    .tb-row.bot .tb-bubble{
      position:relative;
      padding-right:42px;
    }

    .tb-bubble-text{
      display:block;
    }

    .tb-hear{
      position:absolute;
      right:8px;
      bottom:8px;
      width:27px;
      height:27px;
      border:1px solid #d7d1ff;
      border-radius:50%;
      background:#fff;
      color:#5c49c8;
      display:grid;
      place-items:center;
      cursor:pointer;
      font-size:13px;
      line-height:1;
      box-shadow:0 4px 10px rgba(70,55,160,.10);
    }

    .tb-hear:hover{
      background:#f3f0ff;
    }

    .tb-row.user .tb-bubble{
      padding-right:14px;
    }

    #tannuBuddySend:disabled,
    #tannuBuddyMic:disabled{
      opacity:.58;
      cursor:not-allowed;
    }

    .tb-langbar{
      display:flex;
      align-items:center;
      gap:7px;
      padding:7px 12px;
      background:#fff;
      border-bottom:1px solid #eeeafb;
    }

    .tb-lang-label{
      margin-right:auto;
      color:#716b91;
      font-size:10px;
      font-weight:900;
    }

    .tb-lang-btn{
      border:1px solid #ded9ff;
      background:#f8f7ff;
      color:#5548ad;
      border-radius:999px;
      padding:6px 10px;
      font-size:10px;
      font-weight:900;
      cursor:pointer;
      transition:.18s ease;
    }

    .tb-lang-btn:hover{
      transform:translateY(-1px);
      background:#f1efff;
    }

    .tb-lang-btn.active{
      color:#fff;
      border-color:transparent;
      background:linear-gradient(135deg,#7765ff,#26c8cc);
      box-shadow:0 5px 13px rgba(87,81,201,.20);
    }

    @media(max-width:480px){
      .tb-langbar{
        padding:6px 9px;
        gap:5px;
      }

      .tb-lang-btn{
        padding:6px 8px;
        font-size:9px;
      }

      .tb-lang-label{
        font-size:9px;
      }
    }
  `;

  document.head.appendChild(s);
}

function createUI(){

  if($("tannuBuddyPanel")){
    return;
  }

  style();
  installBuddyV40Style();

  const launch=
    document.createElement(
      "button"
    );

  launch.id=
    "tannuBuddyLaunch";

  launch.type=
    "button";

  launch.innerHTML=
    '<span class="bot">🤖</span><small>Ask Me!</small>';

  const panel=
    document.createElement(
      "section"
    );

  panel.id=
    "tannuBuddyPanel";

  panel.setAttribute(
    "aria-label",
    "Tannu's Learning Buddy"
  );

  panel.innerHTML=`

<div id="tannuBuddyHead">

<div class="tb-avatar">
🤖
</div>

<div class="tb-title">

<b>
Tannu's Learning Buddy
</b>

<small>
CLASSES 1–6 • BILINGUAL • KIDS SAFE • TOPIC SMART
</small>

</div>

<button
id="tannuBuddyClose"
class="tb-close"
type="button">
×
</button>

</div>

<div class="tb-status">

<span>
🌟 Classes 1–6 Learning Buddy
</span>

<span
id="tannuTopicPill"
class="tb-topic">
✨ Ready
</span>

</div>

<div class="tb-langbar" aria-label="Choose chat language">
  <span class="tb-lang-label">Language</span>
  <button type="button" class="tb-lang-btn" data-buddy-lang="hi" aria-pressed="false">🇮🇳 Hindi</button>
  <button type="button" class="tb-lang-btn" data-buddy-lang="en" aria-pressed="false">🇬🇧 English</button>
</div>

<div
id="tannuBuddyMessages">
</div>

<div
id="tannuBuddyQuick">

<button
class="tb-quick tb-chat"
data-quick="chat">
😊 Chat
</button>

<button
class="tb-quick tb-computer"
data-quick="computer">
💻 Computer
</button>

<button
class="tb-quick tb-ai"
data-quick="ai">
🤖 AI
</button>

<button
class="tb-quick tb-safety"
data-quick="safety">
🔐 Safety
</button>

<button
class="tb-quick tb-gk"
data-quick="gk">
🌍 GK
</button>

<button
class="tb-quick tb-quiz"
data-quick="quiz">
🎯 Quiz
</button>

</div>

<div class="tb-compose">

<input
id="tannuBuddyInput"
autocomplete="off"
maxlength="300"
placeholder="Ask or speak...">

<button
id="tannuBuddyMic"
class="tb-mic"
type="button">
🎙️
</button>

<button
id="tannuBuddySend"
class="tb-send"
type="button">
➤
</button>

</div>

<div class="tb-foot">
Tap 🎙️ to speak • Voice questions get a spoken reply • Tap 🔊 to replay • Closing clears chat history
</div>

`;

  document.body.append(
    launch,
    panel
  );

  launch.onclick=
    openPanel;

  $("tannuBuddyClose")
    .onclick=
      closePanel;

  $("tannuBuddySend")
    .onclick=
      sendInput;

  $("tannuBuddyMic")
    .onclick=
      startVoice;

  $("tannuBuddyInput")
    .addEventListener(
      "keydown",
      e=>{
        if(
          e.key==="Enter"
        ){
          sendInput();
        }
      }
    );

  $("tannuBuddyQuick")
    .addEventListener(
      "click",
      e=>{

        const b=
          e.target.closest(
            "[data-quick]"
          );

        if(b){
          handleQuick(
            b.dataset.quick
          );
        }
      }
    );

  panel.addEventListener(
    "click",
    e=>{
      const langBtn=e.target.closest("[data-buddy-lang]");
      if(langBtn){
        setBuddyLanguage(langBtn.dataset.buddyLang,{announce:true});
      }
    }
  );

  $("tannuBuddyMessages")
    .addEventListener(
      "click",
      e=>{

        const hear=
          e.target.closest(
            ".tb-hear"
          );

        if(hear){
          const bubble=
            hear.closest(
              ".tb-bubble"
            );

          const text=
            bubble
              ?.querySelector(
                ".tb-bubble-text"
              )
              ?.textContent ||
            "";

          if(text){
            speak(text);
          }

          return;
        }

        const b=
          e.target.closest(
            "[data-chip]"
          );

        if(b){
          processUserText(
            b.dataset.chip
          );
        }
      }
    );

  restorePos();

  makeDraggable(
    panel,
    $("tannuBuddyHead")
  );

  updatePill();
  setBuddyLanguage(buddyLanguage,{announce:false});
}

function updatePill(){

  const p=
    $("tannuTopicPill");

  if(!p){
    return;
  }

  if(
    state.mode==="quiz"
  ){
    p.textContent=
      `🎯 ${
        META[state.topic]?.title ||
        "Quiz"
      }`;

    return;
  }

  p.textContent=
    state.topic &&
    META[state.topic]

      ?`${META[state.topic].icon} ${META[state.topic].title}`

      :"✨ Ready";
}

function addMessage(
  role,
  text,
  chips=[]
){

  const box=
    $("tannuBuddyMessages");

  if(!box){
    return;
  }

  const row=
    document.createElement(
      "div"
    );

  row.className=
    `tb-row ${role}`;

  row.innerHTML=
    role==="bot"
      ?`<div class="tb-bubble"><span class="tb-bubble-text">${esc(text)}</span><button class="tb-hear" type="button" aria-label="Hear this answer">🔊</button></div>`
      :`<div class="tb-bubble"><span class="tb-bubble-text">${esc(text)}</span></div>`;

  box.appendChild(row);

  if(
    role==="bot" &&
    chips?.length
  ){

    const w=
      document.createElement(
        "div"
      );

    w.className=
      "tb-chips";

    w.innerHTML=
      chips
        .slice(0,8)
        .map(
          x=>
            `<button type="button" class="tb-chip" data-chip="${esc(x)}">${esc(x)}</button>`
        )
        .join("");

    box.appendChild(w);
  }

  box.scrollTop=
    box.scrollHeight;

  remember(
    role,
    text
  );

  updatePill();
}

function welcome(){
  return `Hi ${firstName()} 😊! I am your Classes 1–6 Learning Buddy. You can chat with me normally and ask about the full Academy learning platform, Computer, Hardware, Windows, Network, IT Labs, Safety, AI, Coding, Science, English, Healthy Habits, Math, General Knowledge and other safe school-level questions. Choose 🇮🇳 Hindi or 🇬🇧 English anytime.`;
}

function openPanel(){

  $("tannuBuddyPanel")
    .classList
    .add("open");

  $("tannuBuddyLaunch")
    .style.display=
      "none";

  if(
    !$("tannuBuddyMessages")
      .children
      .length
  ){
    addMessage(
      "bot",
      welcome(),
      [
        "Computer",
        "Patna",
        "90-Day Program",
        "Practical Lab",
        "Network",
        "Science",
        "Math",
        "GK"
      ]
    );
  }

  setTimeout(
    ()=>
      $("tannuBuddyInput")
        ?.focus(),
    60
  );
}

function clearBuddyConversation(){

  resetState();

  const box=
    $("tannuBuddyMessages");

  if(box){
    box.innerHTML="";
  }

  const input=
    $("tannuBuddyInput");

  if(input){
    input.value="";
  }

  if(recognition){

    try{
      recognition.stop();
    }catch{}

    recognition=null;
  }

  try{
    window
      .speechSynthesis
      ?.cancel?.();
  }catch{}

  updatePill();
}

function closePanel(){

  clearBuddyConversation();

  $("tannuBuddyPanel")
    .classList
    .remove("open");

  $("tannuBuddyLaunch")
    .style.display=
      "flex";
}

async function sendInput(){

  const i=
    $("tannuBuddyInput");

  const t=
    String(
      i?.value ||
      ""
    )
      .trim();

  if(!t){
    return;
  }

  i.value="";

  await processUserText(t);
}

async function deliverBuddyReply(question,reply,options={}){
  if(!reply?.text) return;

  state.lastQuestion=String(question||"").slice(0,500);
  state.lastAnswer=String(reply.text||"").slice(0,1200);
  saveState();

  addMessage(
    "bot",
    reply.text,
    reply.chips
  );

  if(options.fromVoice){
    setTimeout(
      ()=>speak(reply.text),
      120
    );
  }
}

async function processUserText(text,options={}){

  const fromVoice=
    Boolean(
      options.fromVoice
    );

  addMessage(
    "user",
    text
  );

  const qa=
    answerQuiz(text);

  if(qa){

    setTimeout(
      ()=>
        deliverBuddyReply(
          text,
          qa,
          {fromVoice}
        ),
      70
    );

    return;
  }

  const qt=
    parseQuizTopic(text);

  if(qt){

    const r=
      startQuiz(
        qt,
        hiMode(text)
      );

    setTimeout(
      ()=>
        deliverBuddyReply(
          text,
          r,
          {fromVoice}
        ),
      70
    );

    return;
  }

  const sendBtn=$("tannuBuddySend");
  const micBtn=$("tannuBuddyMic");
  const oldPill=$("tannuTopicPill")?.textContent||"";

  if(sendBtn) sendBtn.disabled=true;
  if(micBtn) micBtn.disabled=true;

  if($("tannuTopicPill")){
    $("tannuTopicPill").textContent="✨ Thinking…";
  }

  try{
    const r=
      await buildAnswer(text);

    await deliverBuddyReply(
      text,
      r,
      {fromVoice}
    );
  }finally{
    if(sendBtn) sendBtn.disabled=false;
    if(micBtn) micBtn.disabled=false;
    updatePill();

    if(
      $("tannuTopicPill") &&
      !$("tannuTopicPill").textContent
    ){
      $("tannuTopicPill").textContent=oldPill;
    }
  }
}

function handleQuick(kind){

  const hi=
    hiMode();

  if(
    kind==="chat"
  ){

    resetState();

    const box=
      $("tannuBuddyMessages");

    if(box){
      box.innerHTML="";
    }

    addMessage(

      "bot",

      hi
        ?"😊 Fresh Chat mode! Koi bhi normal ya learning question poochho."
        :"😊 Fresh Chat mode! Ask any normal or learning question.",

      [
        "Computer",
        "AI",
        "Safety",
        "GK",
        "IT Lab",
        "Quiz"
      ]
    );

    return;
  }

  if(
    kind==="computer" ||
    kind==="ai" ||
    kind==="safety" ||
    kind==="gk"
  ){

    state.topic=
      kind;

    state.subtopic=
      "";

    state.mode=
      "chat";

    state.quiz=
      null;

    saveState();

    const r=
      topicIntro(
        kind,
        hi
      );

    addMessage(
      "bot",
      r.text,
      r.chips
    );

    return;
  }

  if(
    kind==="quiz"
  ){

    const r=
      startQuiz(

        QUIZ[state.topic]
          ?state.topic
          :"",

        hi
      );

    addMessage(
      "bot",
      r.text,
      r.chips
    );
  }
}

function preferredSpeechLanguage(text){
  const raw=String(text||"");

  if(isHindiScript(raw)){
    return "hi-IN";
  }

  if(isHinglish(raw)){
    return "en-IN";
  }

  return "en-IN";
}

function voiceNameScore(voice,targetLang){
  const name=String(voice?.name||"");
  const lang=String(voice?.lang||"").toLowerCase();
  const target=String(targetLang||"").toLowerCase();

  let score=0;

  if(lang===target) score+=80;
  else if(lang.startsWith(target.split("-")[0])) score+=45;
  else if(lang.startsWith("en")) score+=12;

  /*
    Browser speech APIs do not expose gender directly.
    These are common female-coded voice names on Windows,
    Android, Chrome, Edge, Safari and macOS.
  */
  if(/female|zira|samantha|karen|victoria|susan|aria|jenny|ava|allison|moira|serena|veena|heera|swara|kalpana|neerja|aditi|raveena|priya|natasha|sonia|sara|hazel/i.test(name)){
    score+=55;
  }

  if(/david|mark|daniel|guy|george|ravi|rishi|hemant|male/i.test(name)){
    score-=35;
  }

  if(/google|microsoft|natural|enhanced|premium/i.test(name)){
    score+=8;
  }

  return score;
}

function chooseFriendlyFemaleVoice(targetLang){
  const voices=
    window
      .speechSynthesis
      ?.getVoices?.() ||
    [];

  if(!voices.length) return null;

  return [...voices]
    .sort(
      (a,b)=>
        voiceNameScore(b,targetLang)-
        voiceNameScore(a,targetLang)
    )[0] || null;
}

function speak(text){

  if(
    !(
      "speechSynthesis"
      in window
    )
  ){
    return;
  }

  const spoken=
    String(
      text ||
      ""
    )
      .replace(/\s+/g," ")
      .trim();

  if(!spoken) return;

  window
    .speechSynthesis
    .cancel();

  const lang=
    preferredSpeechLanguage(
      spoken
    );

  const u=
    new SpeechSynthesisUtterance(
      spoken
    );

  u.lang=lang;

  u.rate=
    studentClass<=2
      ?0.84
      :studentClass<=4
        ?0.88
        :0.91;

  u.pitch=
    1.08;

  u.volume=
    1;

  const v=
    chooseFriendlyFemaleVoice(
      lang
    );

  if(v){
    u.voice=v;
  }

  speechSynthesis
    .speak(u);
}

function startVoice(){

  const SR=
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if(!SR){

    addMessage(

      "bot",

      hiMode()
        ?"Is browser me voice recognition available nahi hai. Type karke poochho 😊."
        :"Voice recognition is not available in this browser. Please type your question 😊."

    );

    return;
  }

  if(recognition){

    try{
      recognition.stop();
    }catch{}

    recognition=null;
  }

  recognition=
    new SR();

  recognition.lang=
    voiceLang &&
    /^(hi|en)(-|$)/i.test(voiceLang)
      ?voiceLang
      :"en-IN";

  recognition.interimResults=
    false;

  recognition.maxAlternatives=
    1;

  $("tannuBuddyMic")
    .textContent=
      "⏺";

  recognition.onresult=
    e=>{

      const t=
        e.results
          ?.[0]
          ?.[0]
          ?.transcript ||
        "";

      $("tannuBuddyInput")
        .value=
          "";

      processUserText(
        t,
        {
          fromVoice:true
        }
      );
    };

  recognition.onerror=
    ()=>{

      addMessage(

        "bot",

        hiMode()
          ?"Voice clear nahi mila. Dobara try karo ya type karo."
          :"I could not hear that clearly. Please try again or type."

      );
    };

  recognition.onend=
    ()=>{

      if(
        $("tannuBuddyMic")
      ){
        $("tannuBuddyMic")
          .textContent=
            "🎙️";
      }

      recognition=
        null;
    };

  try{
    recognition.start();
  }catch{

    if(
      $("tannuBuddyMic")
    ){
      $("tannuBuddyMic")
        .textContent=
          "🎙️";
    }
  }
}

function restorePos(){

  try{

    const p=
      JSON.parse(
        localStorage.getItem(
          POS_KEY
        ) ||
        "null"
      );

    const el=
      $("tannuBuddyPanel");

    if(
      p &&
      el &&
      Number.isFinite(p.left) &&
      Number.isFinite(p.top)
    ){

      el.style.left=
        `${Math.max(
          4,
          p.left
        )}px`;

      el.style.top=
        `${Math.max(
          4,
          p.top
        )}px`;

      el.style.right=
        "auto";

      el.style.bottom=
        "auto";
    }

  }catch{}
}

function makeDraggable(
  panel,
  handle
){

  let d=
    null;

  const start=
    (
      x,
      y
    )=>{

      const r=
        panel
          .getBoundingClientRect();

      d={
        dx:
          x-r.left,
        dy:
          y-r.top
      };

      panel.style.right=
        "auto";

      panel.style.bottom=
        "auto";
    };

  const move=
    (
      x,
      y
    )=>{

      if(!d){
        return;
      }

      const l=
        Math.min(

          Math.max(
            4,
            innerWidth-
            panel.offsetWidth-
            4
          ),

          Math.max(
            4,
            x-d.dx
          )
        );

      const t=
        Math.min(

          Math.max(
            4,
            innerHeight-
            panel.offsetHeight-
            4
          ),

          Math.max(
            4,
            y-d.dy
          )
        );

      panel.style.left=
        `${l}px`;

      panel.style.top=
        `${t}px`;
    };

  const end=
    ()=>{

      if(!d){
        return;
      }

      const r=
        panel
          .getBoundingClientRect();

      localStorage.setItem(

        POS_KEY,

        JSON.stringify({
          left:
            Math.round(
              r.left
            ),

          top:
            Math.round(
              r.top
            )
        })
      );

      d=
        null;
    };

  handle
    .addEventListener(
      "mousedown",
      e=>{

        if(
          e.target.closest(
            "button"
          )
        ){
          return;
        }

        start(
          e.clientX,
          e.clientY
        );

        e.preventDefault();
      }
    );

  addEventListener(
    "mousemove",
    e=>
      move(
        e.clientX,
        e.clientY
      )
  );

  addEventListener(
    "mouseup",
    end
  );

  handle
    .addEventListener(

      "touchstart",

      e=>{

        if(
          e.target.closest(
            "button"
          )
        ){
          return;
        }

        const t=
          e.touches[0];

        if(t){
          start(
            t.clientX,
            t.clientY
          );
        }
      },

      {
        passive:true
      }
    );

  addEventListener(

    "touchmove",

    e=>{

      const t=
        e.touches[0];

      if(t){
        move(
          t.clientX,
          t.clientY
        );
      }
    },

    {
      passive:true
    }
  );

  addEventListener(
    "touchend",
    end
  );
}

document.addEventListener(

  "dblclick",

  e=>{

    const b=
      e.target.closest?.(
        ".tb-row.bot .tb-bubble"
      );

    if(b){
      speak(
        b.querySelector(".tb-bubble-text")?.textContent ||
        b.textContent ||
        ""
      );
    }
  }
);


/* ============================================================
   V40.2 — COLORFUL MOVING FLOWER BACKGROUND
   HOME PAGE ONLY
   Decorative only: no clicks, no learning logic affected.
   ============================================================ */
function installTannuFlowerBackground(){
  if(window.__tannuFlowerBackgroundV402) return;

  const homePage=document.querySelector(".page.home, #home.page, .home.page");
  if(!homePage) return;

  window.__tannuFlowerBackgroundV402=true;
  document.body.classList.add("tannu-home-v402");

  if(!document.getElementById("tannuFlowerStyleV402")){
    const styleEl=document.createElement("style");
    styleEl.id="tannuFlowerStyleV402";
    styleEl.textContent=`
      body.tannu-home-v402{
        background:
          radial-gradient(circle at 8% 12%,rgba(151,96,255,.40),transparent 29%),
          radial-gradient(circle at 90% 14%,rgba(27,215,224,.30),transparent 31%),
          radial-gradient(circle at 50% 74%,rgba(255,91,172,.18),transparent 34%),
          radial-gradient(circle at 17% 88%,rgba(255,192,72,.15),transparent 26%),
          linear-gradient(155deg,#111747 0%,#17134e 38%,#08365b 72%,#0a4854 100%) !important;
        background-attachment:fixed !important;
      }

      body.tannu-home-v402 .page{
        position:relative;
        z-index:2;
      }

      #tannuFlowerFieldV402{
        position:fixed;
        inset:0;
        z-index:1;
        overflow:hidden;
        pointer-events:none;
        contain:layout paint style;
      }

      #tannuFlowerFieldV402::before{
        content:"";
        position:absolute;
        inset:-18%;
        background:
          radial-gradient(circle at 20% 35%,rgba(255,100,190,.14),transparent 19%),
          radial-gradient(circle at 75% 20%,rgba(66,232,216,.15),transparent 21%),
          radial-gradient(circle at 65% 78%,rgba(255,207,74,.10),transparent 22%),
          radial-gradient(circle at 35% 76%,rgba(126,98,255,.14),transparent 24%);
        filter:blur(18px);
        animation:tannuFlowerAuroraV402 13s ease-in-out infinite alternate;
      }

      .tannu-flower-v402{
        position:absolute;
        left:var(--x);
        bottom:-14vh;
        font-size:var(--size);
        opacity:var(--opacity);
        filter:
          drop-shadow(0 0 7px rgba(255,255,255,.30))
          saturate(1.14);
        transform:translate3d(0,0,0) rotate(0deg);
        animation:
          tannuFlowerRiseV402 var(--dur) linear infinite,
          tannuFlowerSwayV402 var(--sway) ease-in-out infinite alternate;
        animation-delay:var(--delay),var(--delay2);
        will-change:transform,opacity;
      }

      .tannu-flower-v402.soft{
        filter:
          blur(.15px)
          drop-shadow(0 0 10px rgba(255,255,255,.28))
          saturate(1.25);
      }

      @keyframes tannuFlowerRiseV402{
        0%{
          transform:translate3d(0,12vh,0) rotate(0deg) scale(.82);
          opacity:0;
        }
        8%{
          opacity:var(--opacity);
        }
        45%{
          transform:translate3d(var(--drift),-48vh,0) rotate(170deg) scale(1);
        }
        82%{
          opacity:calc(var(--opacity) * .92);
        }
        100%{
          transform:translate3d(var(--drift2),-124vh,0) rotate(360deg) scale(.92);
          opacity:0;
        }
      }

      @keyframes tannuFlowerSwayV402{
        from{margin-left:-10px}
        to{margin-left:14px}
      }

      @keyframes tannuFlowerAuroraV402{
        from{
          transform:translate3d(-2%,-1%,0) scale(1);
          opacity:.72;
        }
        to{
          transform:translate3d(3%,2%,0) scale(1.08);
          opacity:1;
        }
      }

      @media(max-width:700px){
        #tannuFlowerFieldV402 .tannu-flower-v402:nth-child(2n){
          display:none;
        }

        .tannu-flower-v402{
          opacity:calc(var(--opacity) * .78);
        }
      }

      @media(max-width:390px){
        #home .outcomes{
          grid-template-columns:1fr !important;
        }

        #home .hero h1{
          font-size:clamp(43px,14vw,58px) !important;
        }
      }

      @media(prefers-reduced-motion:reduce){
        #tannuFlowerFieldV402::before,
        .tannu-flower-v402{
          animation:none !important;
        }

        .tannu-flower-v402{
          bottom:auto;
          top:var(--static-y);
          opacity:.24;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  if(document.getElementById("tannuFlowerFieldV402")) return;

  const field=document.createElement("div");
  field.id="tannuFlowerFieldV402";
  field.setAttribute("aria-hidden","true");

  const flowers=["🌸","🌼","🌺","🌷","🪻","🌻","💮","🌹"];

  /*
    Deterministic positions: attractive but stable on every reload.
    34 flowers on desktop; CSS automatically reduces density on mobile.
  */
  for(let i=0;i<34;i++){
    const span=document.createElement("span");
    span.className="tannu-flower-v402"+(i%4===0?" soft":"");
    span.textContent=flowers[i%flowers.length];

    const x=(3+(i*29)%94);
    const size=13+((i*7)%22);
    const dur=17+((i*5)%18);
    const sway=2.8+((i%6)*.55);
    const delay=-(i*2.15)%dur;
    const delay2=-((i*1.37)%sway);
    const drift=((i%2===0?1:-1)*(18+((i*11)%54)));
    const drift2=((i%3===0?-1:1)*(22+((i*13)%70)));
    const opacity=(0.34+((i%5)*0.075)).toFixed(2);
    const staticY=(4+(i*17)%90);

    span.style.setProperty("--x",`${x}%`);
    span.style.setProperty("--size",`${size}px`);
    span.style.setProperty("--dur",`${dur}s`);
    span.style.setProperty("--sway",`${sway}s`);
    span.style.setProperty("--delay",`${delay}s`);
    span.style.setProperty("--delay2",`${delay2}s`);
    span.style.setProperty("--drift",`${drift}px`);
    span.style.setProperty("--drift2",`${drift2}px`);
    span.style.setProperty("--opacity",opacity);
    span.style.setProperty("--static-y",`${staticY}%`);

    field.appendChild(span);
  }

  document.body.prepend(field);
}



/* ============================================================
   V40.3 — DUAL NEON LEARNING MARQUEES
   HOME PAGE ONLY
   Top: left -> right
   Bottom: right -> left
   Slow glow pulse instead of harsh rapid flashing.
   ============================================================ */
function installTannuLearningMarquees(){
  if(window.__tannuLearningMarqueesV403) return;

  const homePage=document.getElementById("home");
  if(!homePage) return;

  window.__tannuLearningMarqueesV403=true;

  if(!document.getElementById("tannuMarqueeStyleV403")){
    const s=document.createElement("style");
    s.id="tannuMarqueeStyleV403";
    s.textContent=`
      #home{
        position:relative;
      }

      /*
        V40.5 TIGHT HOME HERO
        Removes the two large empty bands marked in red:
        - less air between top marquee and hero content
        - less air between trust row and bottom marquee
        Desktop remains spacious enough to read; mobile stays responsive.
      */
      @media(min-width:1021px){
        #home.page.show{
          padding-top:2px !important;
          padding-bottom:12px !important;
        }

        #home .hero{
          min-height:clamp(420px,calc(100vh - 390px),490px) !important;
          gap:18px !important;
          align-items:center !important;
        }

        #home .hero-copy{
          align-self:center !important;
        }

        #home .hero .eyebrow{
          margin-top:0 !important;
        }

        #home .hero h1{
          font-size:clamp(54px,6.05vw,90px) !important;
          margin:9px 0 8px !important;
          line-height:.90 !important;
        }

        #home .hero p{
          margin:0 !important;
          font-size:16px !important;
          line-height:1.42 !important;
          max-width:760px !important;
        }

        #home .hero-actions{
          margin-top:12px !important;
          gap:8px !important;
        }

        #home .hero-actions > *{
          padding-top:11px !important;
          padding-bottom:11px !important;
        }

        #home .trust{
          margin-top:9px !important;
          gap:7px !important;
        }

        #home .trust span{
          padding:6px 9px !important;
          font-size:9px !important;
        }

        #home .orbit{
          width:min(385px,34vw) !important;
        }

        #tannuTopMarqueeV403,
        #tannuBottomMarqueeV403{
          width:calc(100% + 72px) !important;
          margin-left:-36px !important;
          margin-right:-36px !important;
        }

        #tannuTopMarqueeV403{
          margin-top:0 !important;
          margin-bottom:2px !important;
        }

        #tannuBottomMarqueeV403{
          margin-top:-2px !important;
          margin-bottom:8px !important;
        }

        #home .outcomes{
          gap:10px !important;
          margin-bottom:16px !important;
        }

        #home .outcomes article{
          padding:12px 14px !important;
          border-radius:17px !important;
        }

        #home .outcomes span{
          margin-top:3px !important;
          font-size:10px !important;
          line-height:1.3 !important;
        }
      }

      .tannu-marquee-v403{
        position:relative;
        z-index:5;
        width:100%;
        overflow:hidden;
        border-radius:999px;
        isolation:isolate;
        pointer-events:none;
        user-select:none;
        box-shadow:
          0 8px 24px rgba(0,0,0,.18),
          inset 0 1px 0 rgba(255,255,255,.20);
      }

      .tannu-marquee-v403::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:2;
        pointer-events:none;
        background:
          linear-gradient(
            90deg,
            rgba(255,255,255,.00),
            rgba(255,255,255,.30),
            rgba(255,255,255,.00)
          );
        transform:translateX(-120%);
        animation:tannuMarqueeShineV403 3.8s ease-in-out infinite;
      }

      .tannu-marquee-top-v403{
        margin:4px 0 8px;
        border:1px solid rgba(114,239,255,.40);
        background:
          linear-gradient(
            90deg,
            rgba(69,91,255,.88),
            rgba(135,74,255,.90),
            rgba(255,91,181,.88),
            rgba(255,172,61,.86),
            rgba(39,214,211,.88)
          );
        box-shadow:
          0 0 18px rgba(91,207,255,.24),
          0 8px 26px rgba(0,0,0,.18);
      }

      .tannu-marquee-bottom-v403{
        margin:4px 0 10px;
        border:1px solid rgba(116,255,199,.42);
        background:
          linear-gradient(
            90deg,
            rgba(13,170,126,.90),
            rgba(35,207,173,.90),
            rgba(41,180,230,.90),
            rgba(106,94,255,.88),
            rgba(244,81,173,.88)
          );
        box-shadow:
          0 0 18px rgba(75,245,195,.23),
          0 8px 26px rgba(0,0,0,.17);
      }

      .tannu-marquee-window-v403{
        overflow:hidden;
        width:100%;
        padding:7px 0;
      }

      .tannu-marquee-track-v403{
        display:flex;
        width:max-content;
        align-items:center;
        white-space:nowrap;
        will-change:transform;
      }

      .tannu-marquee-top-v403 .tannu-marquee-track-v403{
        animation:
          tannuMarqueeLTRV403 26s linear infinite,
          tannuMarqueeGlowV403 2.2s ease-in-out infinite alternate;
      }

      .tannu-marquee-bottom-v403 .tannu-marquee-track-v403{
        animation:
          tannuMarqueeRTLV403 28s linear infinite,
          tannuMarqueeGlowV403 2.4s ease-in-out infinite alternate;
      }

      .tannu-marquee-set-v403{
        display:inline-flex;
        align-items:center;
        gap:18px;
        padding:0 9px;
      }

      .tannu-marquee-item-v403{
        display:inline-flex;
        align-items:center;
        gap:6px;
        font-size:10px;
        line-height:1;
        font-weight:1000;
        letter-spacing:.075em;
        color:#fff;
        text-transform:uppercase;
        text-shadow:
          0 0 7px rgba(255,255,255,.50),
          0 0 15px rgba(255,255,255,.18);
      }

      .tannu-marquee-dot-v403{
        color:#fff7a8;
        font-size:12px;
        text-shadow:0 0 9px rgba(255,235,103,.92);
      }

      @keyframes tannuMarqueeLTRV403{
        from{transform:translateX(-50%)}
        to{transform:translateX(0)}
      }

      @keyframes tannuMarqueeRTLV403{
        from{transform:translateX(0)}
        to{transform:translateX(-50%)}
      }

      @keyframes tannuMarqueeGlowV403{
        from{
          filter:brightness(.92) saturate(1);
          text-shadow:0 0 6px rgba(255,255,255,.20);
        }
        to{
          filter:brightness(1.18) saturate(1.22);
          text-shadow:0 0 15px rgba(255,255,255,.55);
        }
      }

      @keyframes tannuMarqueeShineV403{
        0%,18%{transform:translateX(-125%);opacity:0}
        38%{opacity:.55}
        64%{transform:translateX(125%);opacity:0}
        100%{transform:translateX(125%);opacity:0}
      }

      @media(max-width:1020px){
        #home.page.show{
          padding-top:5px !important;
          padding-bottom:18px !important;
        }

        #home .hero{
          min-height:auto !important;
          padding-top:3px !important;
          padding-bottom:3px !important;
        }

        #home .hero-copy{
          margin-top:0 !important;
          margin-bottom:0 !important;
        }

        #tannuTopMarqueeV403,
        #tannuBottomMarqueeV403{
          width:100% !important;
          margin-left:0 !important;
          margin-right:0 !important;
        }

        #tannuTopMarqueeV403{
          margin-top:0 !important;
          margin-bottom:5px !important;
        }

        #tannuBottomMarqueeV403{
          margin-top:5px !important;
          margin-bottom:7px !important;
        }

        #home .outcomes{
          margin-top:0 !important;
        }
      }

      @media(max-width:700px){
        #home.page.show{
          padding-top:4px !important;
        }

        #home .hero{
          gap:8px !important;
        }

        #home .hero h1{
          margin:7px 0 !important;
          line-height:.93 !important;
        }

        #home .hero p{
          line-height:1.42 !important;
        }

        #home .hero-actions{
          margin-top:9px !important;
          gap:7px !important;
        }

        #home .trust{
          margin-top:7px !important;
          gap:6px !important;
        }

        #home .trust span{
          padding:6px 8px !important;
          font-size:9px !important;
        }

        #home .outcomes{
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          gap:8px !important;
        }

        #home .outcomes article{
          padding:11px !important;
          border-radius:15px !important;
        }

        #home .outcomes b{
          font-size:11px !important;
        }

        #home .outcomes span{
          font-size:9px !important;
          line-height:1.3 !important;
        }

        .tannu-marquee-v403{
          border-radius:15px;
        }

        .tannu-marquee-window-v403{
          padding:7px 0;
        }

        .tannu-marquee-item-v403{
          font-size:8px;
          letter-spacing:.05em;
        }

        .tannu-marquee-set-v403{
          gap:12px;
        }

        .tannu-marquee-top-v403{
          margin:9px 0 12px;
        }

        .tannu-marquee-bottom-v403{
          margin:10px 0 12px;
        }
      }

      @media(prefers-reduced-motion:reduce){
        .tannu-marquee-track-v403,
        .tannu-marquee-v403::before{
          animation:none !important;
        }

        .tannu-marquee-track-v403{
          transform:none !important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function buildMarquee(kind,items){
    const wrap=document.createElement("div");
    wrap.className=`tannu-marquee-v403 tannu-marquee-${kind}-v403`;
    wrap.setAttribute("aria-hidden","true");

    const windowEl=document.createElement("div");
    windowEl.className="tannu-marquee-window-v403";

    const track=document.createElement("div");
    track.className="tannu-marquee-track-v403";

    const setHtml=items.map((item,i)=>`
      <span class="tannu-marquee-item-v403">${item}</span>
      <span class="tannu-marquee-dot-v403">✦</span>
    `).join("");

    /* two identical sets create a seamless continuous loop */
    track.innerHTML=`
      <span class="tannu-marquee-set-v403">${setHtml}</span>
      <span class="tannu-marquee-set-v403">${setHtml}</span>
    `;

    windowEl.appendChild(track);
    wrap.appendChild(windowEl);
    return wrap;
  }

  const topItems=[
    "🌟 Welcome to Tannu Sir's Kids Digital Academy",
    "🎓 Free Learning Platform for Classes 1–6",
    "💻 Learn Digital Skills with Confidence",
    "🤖 Explore Safe AI • Computer • English • GK",
    "🚀 Learn • Practise • Create • Grow"
  ];

  const bottomItems=[
    "💡 Learn Something New Every Day",
    "🖥️ Computer • Hardware • Windows • Network",
    "🛡️ Safety • Healthy Habits • Responsible AI",
    "🗣️ Spoken English • Confidence • Communication",
    "🧪 IT Lab • Science • Math • GK • Quizzes"
  ];

  const hero=homePage.querySelector(".hero");
  const outcomes=homePage.querySelector(".outcomes");

  if(hero && !document.getElementById("tannuTopMarqueeV403")){
    const top=buildMarquee("top",topItems);
    top.id="tannuTopMarqueeV403";
    hero.before(top);
  }

  if(outcomes && !document.getElementById("tannuBottomMarqueeV403")){
    const bottom=buildMarquee("bottom",bottomItems);
    bottom.id="tannuBottomMarqueeV403";
    outcomes.before(bottom);
  }
}

async function boot(){

  await loadStudent();

  installTannuFlowerBackground();

  installTannuLearningMarquees();

  createUI();

  if(
    $("tannuClassNo")
  ){
    $("tannuClassNo")
      .textContent=
        studentClass;
  }

  ensureQuestionBank();

  updatePill();
}

if(
  document.readyState===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    boot,
    {
      once:true
    }
  );

}else{

  boot();
}

})();

/* ============================================================
   V37 — BRAND + VISIBLE PLATFORM PRIVACY CLEANUP
   APPEND this block at the VERY BOTTOM of home-ai-buddy.js

   Purpose:
   - Replace Alpha Jen / Zen Alpha with Tannu's branding on pages
     where the Academy Learning Buddy is loaded.
   - Make browser speech say the new Tannu's branding too.
   - Prevent GitHub / Cloudflare / workers.dev style platform names
     from being shown in visible page text, alerts, titles or labels.

   IMPORTANT:
   This does NOT change the live API network endpoint. Removing the
   workers.dev endpoint from JavaScript source/network traffic requires
   mapping a first-party API hostname (for example api.kids.tanweer.site)
   first. Do not delete the current API URL until that hostname exists.
   ============================================================ */

(() => {
  "use strict";

  const V37_REPLACEMENTS = [
    // Specific phrases first so natural sentences stay natural.
    [/Hi! I am Alpha Jen\./gi, "Hi! I am Tannu's Learning Buddy."],
    [/My name is Alpha Jen\./gi, "My name is Tannu's Learning Buddy."],
    [/Alpha Jen Communication Lab/gi, "Tannu's Communication Lab"],
    [/Alpha Jen Speaking Lab/gi, "Tannu's Speaking Lab"],
    [/Alpha Jen Conversation/gi, "Tannu's Conversation"],
    [/Alpha Jen remembers/gi, "Tannu's Learning Buddy remembers"],

    // Academy demo/legacy learner branding.
    [/ZEN ALPHA/g, "TANNU'S"],
    [/Zen Alpha/g, "Tannu's"],
    [/zen alpha/g, "Tannu's"],

    // Remaining old assistant branding.
    [/Alpha Jen/gi, "Tannu's"],
    [/Tannu Learning Buddy/g, "Tannu's Learning Buddy"],
    [/Tannu AI Buddy/g, "Tannu's Learning Buddy"],

    // Never show implementation-provider names in normal UI text.
    [/GitHub Pages/gi, "Academy Hosting"],
    [/GitHub/gi, "Academy Platform"],
    [/Cloudflare/gi, "Academy Platform"],
    [/https?:\/\/[^\s"'<>]*workers\.dev[^\s"'<>]*/gi, "Academy Service"],
    [/https?:\/\/[^\s"'<>]*github\.io[^\s"'<>]*/gi, "Academy Site"]
  ];

  function v37CleanText(value) {
    let text = String(value ?? "");
    for (const [pattern, replacement] of V37_REPLACEMENTS) {
      text = text.replace(pattern, replacement);
    }
    return text;
  }

  function v37CleanTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const current = node.nodeValue || "";
    const cleaned = v37CleanText(current);
    if (cleaned !== current) node.nodeValue = cleaned;
  }

  function v37CleanElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    // IMPORTANT: Do NOT rewrite href/src/action here because live API,
    // scripts and navigation must continue working.
    const safeTextAttributes = [
      "title",
      "aria-label",
      "placeholder",
      "data-speak",
      "alt"
    ];

    for (const attr of safeTextAttributes) {
      if (!el.hasAttribute(attr)) continue;
      const before = el.getAttribute(attr) || "";
      const after = v37CleanText(before);
      if (after !== before) el.setAttribute(attr, after);
    }

    // Input/button values can be visible to students.
    if ((el.tagName === "INPUT" || el.tagName === "BUTTON") && el.hasAttribute("value")) {
      const before = el.getAttribute("value") || "";
      const after = v37CleanText(before);
      if (after !== before) el.setAttribute("value", after);
    }
  }

  function v37CleanTree(root = document.body) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      v37CleanTextNode(root);
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE) {
      v37CleanElement(root);
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
    );

    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) v37CleanTextNode(node);
      else if (node.nodeType === Node.ELEMENT_NODE) v37CleanElement(node);
      node = walker.nextNode();
    }
  }

  function v37StartDomCleanup() {
    v37CleanTree(document.body);

    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") {
          v37CleanTextNode(record.target);
        }

        for (const node of record.addedNodes || []) {
          v37CleanTree(node);
        }

        if (record.type === "attributes") {
          v37CleanElement(record.target);
        }
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["title", "aria-label", "placeholder", "data-speak", "alt", "value"]
    });
  }

  // ------------------------------------------------------------
  // Voice/TTS branding cleanup
  // Any old Alpha Jen / Zen Alpha phrase passed to browser speech
  // is converted before it is spoken.
  // ------------------------------------------------------------
  function v37InstallSpeechCleanup() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    try {
      const synth = window.speechSynthesis;
      if (synth.__tannuV37Cleaned) return;

      const nativeSpeak = synth.speak.bind(synth);

      synth.speak = function(utterance) {
        try {
          const originalText = String(utterance?.text ?? "");
          const cleanedText = v37CleanText(originalText);

          if (!originalText || cleanedText === originalText) {
            return nativeSpeak(utterance);
          }

          const cleanUtterance = new SpeechSynthesisUtterance(cleanedText);

          // Preserve voice behavior from the original utterance.
          try { cleanUtterance.lang = utterance.lang || ""; } catch {}
          try { cleanUtterance.voice = utterance.voice || null; } catch {}
          try { cleanUtterance.volume = Number.isFinite(utterance.volume) ? utterance.volume : 1; } catch {}
          try { cleanUtterance.rate = Number.isFinite(utterance.rate) ? utterance.rate : 1; } catch {}
          try { cleanUtterance.pitch = Number.isFinite(utterance.pitch) ? utterance.pitch : 1; } catch {}

          // Preserve common event handlers when present.
          for (const eventName of ["onstart", "onend", "onerror", "onpause", "onresume", "onmark", "onboundary"]) {
            try {
              if (typeof utterance[eventName] === "function") {
                cleanUtterance[eventName] = utterance[eventName];
              }
            } catch {}
          }

          return nativeSpeak(cleanUtterance);
        } catch {
          return nativeSpeak(utterance);
        }
      };

      Object.defineProperty(synth, "__tannuV37Cleaned", {
        value: true,
        configurable: false,
        enumerable: false
      });
    } catch {
      // If a browser prevents wrapping speechSynthesis.speak,
      // the normal Academy voice continues without breaking the page.
    }
  }

  // ------------------------------------------------------------
  // Alert cleanup — platform/provider names should not appear in
  // user-facing browser alerts even when an internal error contains one.
  // ------------------------------------------------------------
  function v37InstallAlertCleanup() {
    try {
      const nativeAlert = window.alert.bind(window);
      window.alert = message => nativeAlert(v37CleanText(message));
    } catch {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", v37StartDomCleanup, { once: true });
  } else {
    v37StartDomCleanup();
  }

  v37InstallSpeechCleanup();
  v37InstallAlertCleanup();

  // Expose only the neutral sanitizer for Academy scripts that may want it.
  window.tannuAcademyCleanText = v37CleanText;
})();
