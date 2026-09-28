(() => {
"use strict";

/*
  Tannu Learning Buddy V21
  FREE • KIDS SAFE • TOPIC-AWARE • HUMAN-LIKE CHAT • VOICE • DRAGGABLE
  Class 1–3 friendly local assistant.
  No paid AI API. Uses local rules + academy question-bank.js.
*/

const API="https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const STATE_KEY="tannu_buddy_v21_state";
const POS_KEY="tannu_buddy_v21_pos";
const VOICE_KEY="tannu_buddy_voice_lang";
const $=id=>document.getElementById(id);

let studentName="Friend";
let studentClass=1;
let recognition=null;
let voiceLang=localStorage.getItem(VOICE_KEY)||"hi-IN";
let questionBank=[];
let state=defaultState();

function defaultState(){
  return {
    topic:"",
    subtopic:"",
    mode:"chat",
    quiz:null,
    turns:[]
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
  if(raw) return isHindiScript(raw)||isHinglish(raw);
  return voiceLang.startsWith("hi");
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
      studentName=d.profile.display_name||d.profile.username||"Friend";
      studentClass=Number(d.profile.class_number||1);
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
  gk:["earth","sun","moon","country","countries","animal","animals","general knowledge","gk"]
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

function socialReply(text){
  const q=cleanTypos(text);
  const hi=hiMode(text);

  const out=(en,hg,chips=[])=>({
    text:hi?hg:en,
    chips
  });

  const c=(...p)=>p.some(x=>has(q,x));
  const exact=(...p)=>p.includes(q);

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
      "My name is Tannu Learning Buddy 🤖. I'm your friendly learning helper at Tannu Sir's Kids Digital Academy.",
      "Mera naam Tannu Learning Buddy hai 🤖. Main Tannu Sir's Kids Digital Academy me tumhara friendly learning helper hoon.",
      ["Who are you?","How are you?","What can you do?"]
    );
  }

  if(c("who are you","who are u","tum kaun ho","aap kaun ho")){
    return out(
      "I'm Tannu Learning Buddy 🤖 — a virtual learning friend made to help kids practise computer, network, safety, AI, coding, science, English and more.",
      "Main Tannu Learning Buddy hoon 🤖 — ek virtual learning friend jo Computer, Network, Safety, AI, Coding, Science, English aur doosre topics me help karta hai.",
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
      "I can explain Computer, Network, Internet Safety, AI, Coding, Science, English, Healthy Habits, Math and basic General Knowledge. I can also give quizzes, examples and simple troubleshooting steps 😊.",
      "Main Computer, Network, Internet Safety, AI, Coding, Science, English, Healthy Habits, Math aur basic General Knowledge samjha sakta hoon. Main quiz, examples aur simple troubleshooting bhi kara sakta hoon 😊.",
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

  const social=socialReply(text);
  if(social) return social;

  const emergency=safeEmergency(q,hi);
  if(emergency) return emergency;

  const math=simpleMath(q,hi);
  if(math) return math;

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

  const bank=questionBankHint(
    q,
    hi
  );

  if(bank){
    return bank;
  }

  if(state.topic){
    return {
      text:hi
        ?`Main ${META[state.topic]?.title||"is topic"} me help kar raha hoon 😊. Thoda specific poochho, jaise ${META[state.topic]?.chips.slice(0,4).join(", ")}.`
        :`I am helping with ${META[state.topic]?.title||"this topic"} 😊. Ask something specific, such as ${META[state.topic]?.chips.slice(0,4).join(", ")}.`,
      chips:
        META[state.topic]?.chips ||
        []
    };
  }

  return {
    text:hi
      ?"Mujhe is question ka exact local answer abhi nahi mila 😊. Question ko thoda simple words me poochho, ya Computer, Network, Safety, AI, Coding, Science, English, Healthy Habits, Math ya GK me topic choose karo."
      :"I don't have an exact local answer for that yet 😊. Try asking in a few simpler words, or choose Computer, Network, Safety, AI, Coding, Science, English, Healthy Habits, Math or GK.",
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
1fr 1fr;
gap:8px;
padding:10px 12px;
border-top:
1px solid #eee;
background:#fff;
}

.tb-quick{
border:0;
border-radius:16px;
padding:11px 8px;
font-weight:900;
cursor:pointer;
}

.tb-chat{
background:#fff0f5;
color:#b23e72;
}

.tb-network{
background:#eaf8ff;
color:#17739f;
}

.tb-safety{
background:#fff7d9;
color:#936b00;
}

.tb-quiz{
background:#eeeaff;
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

function createUI(){

  if($("tannuBuddyPanel")){
    return;
  }

  style();

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
    "Tannu Learning Buddy"
  );

  panel.innerHTML=`

<div id="tannuBuddyHead">

<div class="tb-avatar">
🤖
</div>

<div class="tb-title">

<b>
Tannu Learning Buddy
</b>

<small>
FREE • VOICE • KIDS SAFE • TOPIC SMART
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
🌟 Class
<span id="tannuClassNo">
${studentClass}
</span>
Learning Buddy
</span>

<span
id="tannuTopicPill"
class="tb-topic">
✨ Ready
</span>

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
class="tb-quick tb-network"
data-quick="network">
🌐 Network
</button>

<button
class="tb-quick tb-safety"
data-quick="safety">
🔐 Safety
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
Tap 🎙️ for voice • Double-click a buddy answer to hear it • Closing clears chat history
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

  $("tannuBuddyMessages")
    .addEventListener(
      "click",
      e=>{

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
    `<div class="tb-bubble">${esc(text)}</div>`;

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

  return hiMode()

    ?`Hi ${firstName()} 😊! Main tumhara Learning Buddy hoon. Computer, Network, Safety, AI, Coding, Science, English, Healthy Habits, Math aur GK me help kar sakta hoon.`

    :`Hi ${firstName()} 😊! I am your Learning Buddy. I can help with Computer, Network, Safety, AI, Coding, Science, English, Healthy Habits, Math and GK.`;
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
        "Network",
        "Safety",
        "AI",
        "Coding",
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

async function processUserText(text){

  addMessage(
    "user",
    text
  );

  const qa=
    answerQuiz(text);

  if(qa){

    setTimeout(
      ()=>
        addMessage(
          "bot",
          qa.text,
          qa.chips
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
        addMessage(
          "bot",
          r.text,
          r.chips
        ),
      70
    );

    return;
  }

  const r=
    await buildAnswer(text);

  setTimeout(
    ()=>
      addMessage(
        "bot",
        r.text,
        r.chips
      ),
    70
  );
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
        "What is your name?",
        "How are you?",
        "Computer",
        "Network",
        "Safety",
        "Quiz"
      ]
    );

    return;
  }

  if(
    kind==="network" ||
    kind==="safety"
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

function speak(text){

  if(
    !(
      "speechSynthesis"
      in window
    )
  ){
    return;
  }

  window
    .speechSynthesis
    .cancel();

  const u=
    new SpeechSynthesisUtterance(
      String(
        text ||
        ""
      )
    );

  u.lang=
    voiceLang;

  u.rate=
    studentClass<=1
      ?0.84
      :0.9;

  u.pitch=
    1.04;

  const pref=
    voiceLang
      .split("-")[0]
      .toLowerCase();

  const v=
    speechSynthesis
      .getVoices()
      .find(
        x=>
          String(
            x.lang ||
            ""
          )
            .toLowerCase()
            .startsWith(pref)
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
    voiceLang;

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
          t;

      sendInput();
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
        b.textContent ||
        ""
      );
    }
  }
);

async function boot(){

  await loadStudent();

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
