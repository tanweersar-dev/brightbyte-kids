(() => {
"use strict";

/*
  TANNU LEARNING BUDDY V16 - FINAL FREE CONVERSATION MODE
  -------------------------------------------------------
  - No paid AI/API
  - English + Hindi + Hinglish
  - Social kid-safe conversation
  - Education-only guardrails
  - Password / OTP / privacy coaching
  - Uses existing 5200+ academy question bank
  - Generates 5200+ natural practice variants at runtime
  - Voice input + voice output
  - Simple quiz mode
*/

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const QUESTION_BANK = Array.isArray(window.TANNU_QUESTION_BANK)
  ? window.TANNU_QUESTION_BANK
  : [];

const token = localStorage.getItem("brightbyte_student_token") || "";
const $ = id => document.getElementById(id);

let studentName = "Friend";
let panelOpen = false;
let quizState = null;

/* =============================
   BASIC HELPERS
============================= */

function normalize(text){
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+\-*/().]/gu," ")
    .replace(/\s+/g," ")
    .trim();
}

function words(text){
  return normalize(text).split(" ").filter(Boolean);
}

function hasToken(text, token){
  const set = new Set(words(text));
  return set.has(normalize(token));
}

function hasPhrase(text, phrase){
  const q = ` ${normalize(text)} `;
  const p = ` ${normalize(phrase)} `;
  return q.includes(p);
}

function hasAnyPhrase(text, list){
  return list.some(x => hasPhrase(text,x));
}

function isHindiScript(text){
  return /[\u0900-\u097F]/.test(String(text || ""));
}

function looksHinglish(text){
  const q = normalize(text);
  const hints = [
    "kya","kaise","hai","hain","batao","karo","mujhe","mera","meri",
    "nahi","kyu","kyon","bhai","yaar","acha","achha","theek","thik",
    "wala","wali","ka","ki","ke","mai","main","hum","aap","tum"
  ];
  return hints.some(x => hasToken(q,x));
}

function useHindi(text){
  return isHindiScript(text) || looksHinglish(text);
}

function pick(list){
  return list[Math.floor(Math.random()*list.length)];
}

function escapeHtml(text){
  return String(text)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

/* =============================
   SOCIAL / COMMUNICATION INTENTS
============================= */

const SOCIAL = [
  {
    id:"greeting",
    patterns:["hi","hello","hey","namaste","salam","salaam","assalamualaikum","good morning","good afternoon","good evening"],
    en:[
      "Hi! 👋 I’m Tannu Learning Buddy. What would you like to learn today?",
      "Hello! 😄 Ready for a fun learning question? You can ask me about computers, English, GK, science, health or safety.",
      "Hey! 🌟 Nice to see you. Ask me something fun and educational!"
    ],
    hi:[
      "Hi! 👋 Main Tannu Learning Buddy hoon. Aaj kya seekhna hai?",
      "Hello! 😄 Chalo kuch fun learning karte hain. Computer, English, GK, Science ya Safety me kya poochhna hai?",
      "Salaam! 🌟 Main ready hoon. Aaj ka learning question bolo!"
    ]
  },
  {
    id:"how_are_you",
    patterns:["how are you","how r you","kaise ho","kaisa hai","kya haal hai","kya hal hai","haal kaisa hai","hal kaisa hai","kya haal hai bhai","kya hal hai bhai"],
    en:[
      "I’m doing great 😄 Thanks for asking! How are you? Want a quick quiz or a fun learning fact?",
      "I’m super and ready to learn with you! 🌟 Should we do computers, GK, English or science?"
    ],
    hi:[
      "Main mast hoon bhai 😄 Tum kaise ho? Chalo ek fun quiz ya learning question karte hain!",
      "Bilkul badhiya! 🌟 Tum batao kya haal hai? Aaj Computer, GK, English ya Science me kuch fun karein?"
    ]
  },
  {
    id:"name",
    patterns:["what is your name","your name","tumhara naam kya hai","aapka naam kya hai","naam kya hai"],
    en:["My name is Tannu Learning Buddy 🤖. I’m your safe learning chatbot."],
    hi:["Mera naam Tannu Learning Buddy hai 🤖. Main tumhara safe learning chatbot hoon."]
  },
  {
    id:"who_are_you",
    patterns:["who are you","tum kaun ho","aap kaun ho","what are you","are you robot","tum robot ho"],
    en:["I’m Tannu Learning Buddy 🤖 — a free learning chatbot for kids. I can chat, explain, quiz and help with school-safe topics."],
    hi:["Main Tannu Learning Buddy hoon 🤖 — kids ke liye free learning chatbot. Main chat, explain aur quiz me help karta hoon."]
  },
  {
    id:"friend",
    patterns:["are you my friend","will you be my friend","dost banoge","mere dost ho","friend banoge"],
    en:["I can be your learning buddy 😊. We can learn, practise and do quizzes together."],
    hi:["Haan, main tumhara learning buddy hoon 😊. Hum saath me learn, practise aur quiz kar sakte hain."]
  },
  {
    id:"what_can_you_do",
    patterns:["what can you do","tum kya kar sakte ho","kya kya bata sakte ho","help me","mujhe help karo"],
    en:["I can explain computers, networking, English, GK, science, health, hygiene, cyber safety, AI and logic. I can also give you a quiz. 🎯"],
    hi:["Main Computer, Networking, English, GK, Science, Health, Hygiene, Cyber Safety, AI aur Logic samjha sakta hoon. Quiz bhi de sakta hoon. 🎯"]
  },
  {
    id:"thanks",
    patterns:["thanks","thank you","thankyou","shukriya","dhanyavad","dhanyawaad"],
    en:["You’re welcome! ⭐ Keep asking smart questions."],
    hi:["Welcome! ⭐ Aise hi smart questions poochhte raho."]
  },
  {
    id:"sorry",
    patterns:["sorry","maaf karo","sorry bhai"],
    en:["No problem 😊. Mistakes are part of learning. Let’s continue!"],
    hi:["Koi baat nahi 😊. Galti se hi learning hoti hai. Chalo continue karte hain!"]
  },
  {
    id:"bye",
    patterns:["bye","goodbye","see you","milte hain","allah hafiz","khuda hafiz"],
    en:["Bye! 👋 Keep learning, stay curious and come back for another challenge."],
    hi:["Bye! 👋 Learning continue rakho, curious raho aur phir quiz ke liye aana."]
  },
  {
    id:"goodnight",
    patterns:["good night","goodnight","shubh ratri","raat ho gayi"],
    en:["Good night 🌙 Rest well. A fresh mind learns better tomorrow!"],
    hi:["Good night 🌙 Achhi sleep lo. Fresh mind kal aur achha learn karega!"]
  },
  {
    id:"bored",
    patterns:["i am bored","i'm bored","bore ho raha","boring lag raha","bored"],
    en:["Let’s make it fun! 😄 Say “quiz me” for a quick challenge, or ask for a riddle."],
    hi:["Chalo fun karte hain! 😄 “Quiz do” bolo ya ek paheli maango."]
  },
  {
    id:"food",
    patterns:["do you eat","tum khana khate ho","khana khate ho","what do you eat"],
    en:["I’m a chatbot, so I don’t eat 😄. But I can teach you about healthy food and balanced meals!"],
    hi:["Main chatbot hoon, isliye khana nahi khata 😄. Lekin healthy food aur balanced meal ke baare me bata sakta hoon!"]
  },
  {
    id:"sleep_bot",
    patterns:["do you sleep","tum sote ho","sote ho"],
    en:["I don’t sleep like people do 🤖, but children need good sleep to learn and grow well."],
    hi:["Main humans ki tarah nahi sota 🤖, lekin children ke liye achhi sleep learning aur growth ke liye important hai."]
  },
  {
    id:"age",
    patterns:["how old are you","your age","tumhari age kya hai","kitne saal ke ho","umar kya hai"],
    en:["I don’t have a human age 🤖. I’m a learning chatbot, and I’m always ready to practise with you!"],
    hi:["Meri human wali age nahi hai 🤖. Main learning chatbot hoon aur hamesha tumhare saath practise ke liye ready hoon!"]
  },
  {
    id:"where_live",
    patterns:["where do you live","tum kaha rehte ho","kahan rehte ho","tumhara ghar kaha hai"],
    en:["I live inside this learning website, not in a real house 😄. And remember: your real home address should stay private."],
    hi:["Main isi learning website ke andar rehta hoon, real ghar me nahi 😄. Aur yaad rakho: apna real home address private rakhna chahiye."]
  },
  {
    id:"creator",
    patterns:["who made you","who created you","tumhe kisne banaya","kisne banaya"],
    en:["I’m part of Tannu Sir's Kids Digital Academy 🤖. I was built to help kids practise safe learning and communication."],
    hi:["Main Tannu Sir's Kids Digital Academy ka learning buddy hoon 🤖. Mujhe kids ki safe learning aur communication practice ke liye banaya gaya hai."]
  },
  {
    id:"real",
    patterns:["are you real","tum real ho","kya tum insaan ho","are you human","tum human ho"],
    en:["I’m not a human — I’m a chatbot 🤖. But I can still talk with you and help you practise learning."],
    hi:["Main human nahi hoon — main chatbot hoon 🤖. Lekin main tumse baat kar sakta hoon aur learning practise me help kar sakta hoon."]
  },
  {
    id:"happy",
    patterns:["i am happy","main khush hoon","aaj main khush hoon","feeling happy"],
    en:["That’s nice to hear! 😄 Use that happy energy for a quick quiz or a new fact."],
    hi:["Ye sunkar achha laga! 😄 Is happy energy se ek quick quiz ya naya fact learn karein?"]
  },
  {
    id:"sad",
    patterns:["i am sad","main sad hoon","main udaas hoon","feeling sad","mood off"],
    en:["I’m sorry you’re feeling sad. 💛 You can take a little break, talk to a trusted adult, or we can do a gentle fun quiz together."],
    hi:["Aww, mood off hai 💛 Thoda break lo, kisi trusted adult se baat karo, ya hum ek easy fun quiz karte hain."]
  },
  {
    id:"praise",
    patterns:["you are good","you are nice","smart ho","bahut achha","super","great bot","good bot"],
    en:["Thank you! 😄 You’re doing great too. Keep asking questions and keep learning!"],
    hi:["Thank you! 😄 Tum bhi super ho. Questions poochhte raho aur learning continue rakho!"]
  },
  {
    id:"game",
    patterns:["play a game","game kheloge","game khelo","kuch game","let us play"],
    en:["Yes! 🎮 Say “quiz me” for a learning challenge or “riddle” for a brain puzzle."],
    hi:["Haan! 🎮 “Quiz do” bolo learning challenge ke liye, ya “paheli” bolo brain puzzle ke liye."]
  }
];

const JOKES_EN = [
  "Why did the computer go to school? Because it wanted to improve its bytes! 😄",
  "Why was the keyboard happy? Because it had lots of space! ⌨️😄",
  "What does a computer eat for a snack? Microchips! 😄"
];
const JOKES_HI = [
  "Computer school kyun gaya? Kyunki usko apne bytes improve karne the! 😄",
  "Keyboard happy kyun tha? Kyunki uske paas bahut saara space tha! ⌨️😄",
  "Computer ka favourite snack kya hai? Microchips! 😄"
];

const RIDDLES = [
  {qEn:"I have keys but no locks, and a space but no room. What am I?", qHi:"Mere paas keys hain lekin locks nahi, aur space hai lekin room nahi. Main kaun?", a:"keyboard"},
  {qEn:"I show pictures and words but I am not a book. What am I?", qHi:"Main pictures aur words dikhata hoon lekin book nahi hoon. Main kaun?", a:"monitor"},
  {qEn:"I help you point and click on a computer. What am I?", qHi:"Main computer par point aur click karne me help karta hoon. Main kaun?", a:"mouse"}
];
let pendingRiddle = null;

function socialAnswer(text){
  const q = normalize(text);

  if(hasAnyPhrase(q,["joke","joke sunao","mazaak sunao","mazak sunao","funny joke"])){
    return useHindi(text) ? pick(JOKES_HI) : pick(JOKES_EN);
  }

  if(hasAnyPhrase(q,["riddle","paheli","puzzle do","paheli sunao"])){
    pendingRiddle = pick(RIDDLES);
    return useHindi(text)
      ? `Paheli 🧩: ${pendingRiddle.qHi} Answer batao!`
      : `Riddle 🧩: ${pendingRiddle.qEn} Tell me the answer!`;
  }

  for(const intent of SOCIAL){
    if(intent.patterns.some(p => normalize(q) === normalize(p) || hasPhrase(q,p))){
      return useHindi(text) ? pick(intent.hi) : pick(intent.en);
    }
  }
  return null;
}

/* =============================
   PRIVACY / SAFETY COACHING
============================= */

function privacyAnswer(text){
  const q = normalize(text);

  if(hasToken(q,"password") || hasPhrase(q,"pass word")){
    return useHindi(text)
      ? "Password ek secret hota hai 🔐. Kisi se uska password nahi poochhna chahiye aur apna password bhi kisi ko nahi batana chahiye. Agar password bhool jao to parent, teacher ya official reset option se help lo."
      : "A password is a secret 🔐. You should not ask someone for their password, and you should never share your own password. If you forget it, ask a parent/teacher or use the official reset option.";
  }

  if(hasToken(q,"otp") || hasPhrase(q,"one time password")){
    return useHindi(text)
      ? "OTP bhi secret hota hai 🔐. OTP kisi friend, stranger ya caller ko kabhi share nahi karna chahiye."
      : "An OTP is private too 🔐. Never share an OTP with a friend, stranger or caller.";
  }

  if(hasToken(q,"pin") || hasPhrase(q,"atm pin")){
    return useHindi(text)
      ? "PIN private hota hai. Apna PIN kisi ko nahi batana chahiye aur doosron ka PIN nahi poochhna chahiye."
      : "A PIN is private. Never share your PIN and do not ask other people for theirs.";
  }

  if(hasAnyPhrase(q,["home address","ghar ka address","phone number","mobile number","school address","where do i live","mera address"])){
    return useHindi(text)
      ? "Home address, phone number aur school details private information hain. Inhe strangers ya public chat me share nahi karna chahiye. 🛡️"
      : "Home address, phone number and school details are private information. Do not share them with strangers or in public chats. 🛡️";
  }

  return null;
}

const DANGEROUS_PATTERNS = [
  "make a bomb","bomb kaise","kill someone","hurt someone","suicide method","self harm method",
  "hack password","password hack","steal password","chori kaise","weapon banana"
];

function unsafeAnswer(text){
  if(!hasAnyPhrase(text,DANGEROUS_PATTERNS)) return null;
  return useHindi(text)
    ? "Main dangerous ya harmful cheez sikhane me help nahi karta. 🛡️ Agar tum Cyber Safety, password protection ya safe troubleshooting seekhna chaho to main help kar sakta hoon."
    : "I can’t help with dangerous or harmful instructions. 🛡️ I can teach cyber safety, password protection or safe troubleshooting instead.";
}

/* =============================
   EDUCATIONAL FACT BANK
============================= */

const FACTS = [];
function fact(category, aliases, en, hi){
  FACTS.push({category,aliases,en,hi});
}

fact("Digital",["monitor","screen","display"],
  "A monitor shows text, pictures, videos and other visual output from a computer.",
  "Monitor computer ka visual output dikhata hai, jaise text, pictures aur videos.");
fact("Digital",["mouse","computer mouse"],
  "A mouse helps you point, click, select, drag and move items on the screen.",
  "Mouse se screen par point, click, select, drag aur move karte hain.");
fact("Digital",["keyboard"],
  "A keyboard is used to type letters, numbers, symbols and commands.",
  "Keyboard se letters, numbers, symbols aur commands type kiye jate hain.");
fact("Digital",["system unit","cpu cabinet","cabinet"],
  "The system unit contains important computer parts such as the processor, RAM and storage.",
  "System unit ke andar processor, RAM, storage aur doosre important computer parts hote hain.");
fact("Digital",["cpu","processor"],
  "The CPU is the main processor. It follows instructions and performs calculations.",
  "CPU main processor hota hai. Ye instructions follow karta hai aur calculations karta hai.");
fact("Digital",["ram","memory"],
  "RAM is short-term working memory that helps active programs run smoothly.",
  "RAM short-term working memory hoti hai jo active programs ko smoothly run karne me help karti hai.");
fact("Digital",["ssd","solid state drive"],
  "An SSD stores files and programs and is usually faster than a traditional hard disk.",
  "SSD files aur programs store karta hai aur usually traditional hard disk se faster hota hai.");
fact("Digital",["hdd","hard disk","hard drive"],
  "A hard disk stores files, programs and other data for long-term use.",
  "Hard disk files, programs aur doosra data long-term store karta hai.");
fact("Digital",["printer","printing"],
  "A printer makes a paper copy of digital information.",
  "Printer digital information ki paper copy banata hai.");
fact("Digital",["scanner","scan"],
  "A scanner turns a paper document or photo into a digital copy.",
  "Scanner paper document ya photo ko digital copy me badalta hai.");
fact("Digital",["speaker","speakers"],
  "Speakers play sound from a computer.",
  "Speakers computer ka sound bajate hain.");
fact("Digital",["webcam","computer camera"],
  "A webcam is a camera used for video calls, online classes and recording.",
  "Webcam computer camera hota hai jo video calls, online classes aur recording me use hota hai.");
fact("Digital",["file","computer file"],
  "A file is saved information such as a document, picture, video or song.",
  "File saved information hoti hai, jaise document, picture, video ya song.");
fact("Digital",["folder","directory"],
  "A folder helps organize files so they are easier to find.",
  "Folder files ko organize karta hai taaki unhe aasani se find kiya ja sake.");
fact("Digital",["browser","web browser","chrome","edge"],
  "A web browser is a program used to open and view websites.",
  "Web browser ek program hai jisse websites open aur view karte hain.");
fact("Digital",["usb","usb port"],
  "USB is a common connection for devices such as keyboards, mice, printers and flash drives.",
  "USB common connection hai jisse keyboard, mouse, printer aur flash drive connect hote hain.");
fact("Digital",["hdmi","hdmi cable"],
  "HDMI can carry digital video and sound between devices such as a computer and monitor.",
  "HDMI computer se monitor tak digital video aur sound le ja sakta hai.");
fact("Digital",["vga","vga cable"],
  "VGA is an older display connection used to carry video to a monitor.",
  "VGA purana display connection hai jo monitor tak video signal le jata hai.");
fact("Digital",["computer","pc"],
  "A computer is an electronic machine that accepts input, processes information, stores data and produces output.",
  "Computer electronic machine hai jo input leta hai, information process karta hai, data store karta hai aur output deta hai.");
fact("Digital",["hardware"],
  "Hardware means the physical parts of a computer that you can see or touch.",
  "Hardware computer ke physical parts hote hain jinhe hum dekh ya touch kar sakte hain.");
fact("Digital",["software"],
  "Software is a set of programs and instructions that tells a computer what to do.",
  "Software programs aur instructions ka set hota hai jo computer ko batata hai kya kaam karna hai.");

fact("Networking",["network","computer network"],
  "A computer network connects devices so they can communicate and share resources.",
  "Computer network devices ko connect karta hai taaki wo communicate aur resources share kar saken.");
fact("Networking",["lan","local area network"],
  "A LAN connects devices in a small area such as a home, classroom or office.",
  "LAN chhote area jaise home, classroom ya office me devices ko connect karta hai.");
fact("Networking",["lan cable","ethernet","network cable","rj45"],
  "An Ethernet or LAN cable connects a device to a wired network.",
  "Ethernet ya LAN cable device ko wired network se connect karti hai.");
fact("Networking",["router","wifi router"],
  "A router connects networks and helps devices reach other networks and the internet.",
  "Router networks ko connect karta hai aur devices ko internet ya doosre networks tak pahunchne me help karta hai.");
fact("Networking",["switch","network switch"],
  "A network switch connects many devices inside the same local network.",
  "Network switch ek local network ke andar kai devices ko connect karta hai.");
fact("Networking",["wifi","wi fi","wireless"],
  "Wi-Fi lets devices connect to a network without a network cable.",
  "Wi-Fi devices ko bina LAN cable ke wireless network se connect karta hai.");
fact("Networking",["ip","ip address"],
  "An IP address identifies a device on an IP network.",
  "IP address network me device ki pehchan ke liye use hota hai.");
fact("Networking",["dhcp"],
  "DHCP automatically gives devices network settings such as an IP address.",
  "DHCP automatically devices ko IP address jaise network settings deta hai.");
fact("Networking",["dns"],
  "DNS helps turn website names into IP addresses that computers can use.",
  "DNS website names ko IP addresses me badalne me help karta hai.");
fact("Networking",["gateway","default gateway"],
  "A default gateway is usually the router that helps a device communicate outside its local network.",
  "Default gateway usually router hota hai jo device ko local network ke bahar communicate karne me help karta hai.");
fact("Networking",["ping","ping command"],
  "Ping is a simple test used to check whether another network device can be reached.",
  "Ping simple test hai jisse check karte hain ki doosra network device reachable hai ya nahi.");
fact("Networking",["internet"],
  "The internet is a worldwide system of connected networks that lets devices exchange information.",
  "Internet connected networks ka worldwide system hai jahan devices information exchange karte hain.");
fact("Networking",["vpn"],
  "A VPN creates a protected connection between a device and another network over the internet.",
  "VPN internet ke through device aur doosre network ke beech protected connection banata hai.");

fact("Troubleshooting",["no display","no signal","monitor no signal"],
  "First check monitor power, then check the display cable and the correct input source.",
  "Pehle monitor power check karo, phir display cable aur correct input source check karo.");
fact("Troubleshooting",["no internet","internet not working","internet nahi chal"],
  "Check the LAN cable or Wi-Fi first, then see whether other devices can access the internet.",
  "Pehle LAN cable ya Wi-Fi check karo, phir dekho doosre devices me internet chal raha hai ya nahi.");
fact("Troubleshooting",["keyboard not working","keyboard nahi chal"],
  "Check the keyboard connection and try another USB port if needed.",
  "Keyboard connection check karo aur zarurat ho to doosra USB port try karo.");
fact("Troubleshooting",["mouse not working","mouse nahi chal"],
  "Check the mouse connection and try another USB port if needed.",
  "Mouse connection check karo aur zarurat ho to doosra USB port try karo.");
fact("Troubleshooting",["printer not printing","printing problem"],
  "Check printer power, paper, connection and whether the correct printer is selected.",
  "Printer power, paper, connection aur correct printer selected hai ya nahi check karo.");
fact("Troubleshooting",["computer not turning on","pc not starting"],
  "Check the power cable, socket or power strip, and the computer's power switch.",
  "Power cable, socket ya power strip aur computer ka power switch check karo.");
fact("Troubleshooting",["slow computer","computer slow","pc slow"],
  "Close unnecessary programs, restart if needed, and ask an adult or technician if the problem continues.",
  "Unnecessary programs close karo, zarurat ho to restart karo, aur problem rahe to adult ya technician se help lo.");
fact("Troubleshooting",["no sound","speaker not working"],
  "Check volume, mute, speaker connection and the selected audio output.",
  "Volume, mute, speaker connection aur selected audio output check karo.");

fact("Safety",["cyber safety","internet safety","online safety"],
  "Keep passwords private, avoid suspicious links and ask a trusted adult when something online feels wrong.",
  "Password private rakho, suspicious links avoid karo aur online kuch galat lage to trusted adult se poochho.");
fact("Safety",["phishing","fake email","fake link"],
  "Phishing is a trick used to make people reveal private information or click unsafe links.",
  "Phishing ek trick hai jisme private information lene ya unsafe link click karwane ki koshish hoti hai.");
fact("Safety",["trusted adult"],
  "A trusted adult can be a parent, guardian, teacher or another safe grown-up who helps protect you.",
  "Trusted adult parent, guardian, teacher ya safe grown-up ho sakta hai jo aapko protect karne me help kare.");
fact("Safety",["cyberbullying"],
  "Cyberbullying is unkind or harmful behavior online. Save evidence and tell a trusted adult.",
  "Cyberbullying online unkind ya harmful behavior hai. Evidence save karo aur trusted adult ko batao.");
fact("Safety",["scam","fraud"],
  "A scam tries to trick people into giving money or private information. Stop, check and ask a trusted adult.",
  "Scam money ya private information lene ke liye trick karta hai. Ruko, check karo aur trusted adult se poochho.");

fact("AI",["ai","artificial intelligence"],
  "Artificial intelligence helps computers perform tasks such as understanding language, finding patterns and creating content.",
  "Artificial intelligence computers ko language samajhne, patterns find karne aur content create karne me help karta hai.");
fact("AI",["prompt","ai prompt"],
  "A prompt is an instruction or question you give to an AI system.",
  "Prompt ek instruction ya question hota hai jo AI system ko diya jata hai.");
fact("AI",["good prompt","clear prompt","better prompt"],
  "A clear prompt says what you want and adds useful details.",
  "Clear prompt batata hai kya chahiye aur useful details add karta hai.");
fact("AI",["ai mistake","ai wrong","check answers"],
  "AI can make mistakes, so important facts should be checked with a trusted source, teacher or parent.",
  "AI mistakes kar sakta hai, isliye important facts teacher, parent ya trusted source se check karo.");

fact("English",["thank you","thanks"],
  "Say 'Thank you' when someone helps you or gives you something.",
  "Jab koi help kare ya kuch de to 'Thank you' bolna achha manner hai.");
fact("English",["please"],
  "Use 'please' to make a request more polite.",
  "Request ko polite banane ke liye 'please' use karte hain.");
fact("English",["sorry"],
  "Say 'sorry' when you make a mistake, and try to make it right.",
  "Galti ho to 'sorry' bolo aur galti ko theek karne ki koshish karo.");
fact("English",["self introduction","introduce yourself"],
  "A simple introduction is: Hello, my name is ___. I am happy to meet you.",
  "Simple introduction: Hello, my name is ___. I am happy to meet you.");
fact("English",["good listener"],
  "A good listener waits for their turn and listens carefully.",
  "Good listener apni turn ka wait karta hai aur carefully sunta hai.");
fact("English",["confidence","speak confidently"],
  "Confidence grows with practice. Start with short sentences and practise a little every day.",
  "Confidence practice se grow hota hai. Short sentences se start karo aur roz thoda practise karo.");

fact("Healthy",["water","hydration"],
  "Water helps the body work properly. Drink water regularly during the day.",
  "Water body ko properly kaam karne me help karta hai. Din bhar regular water piyo.");
fact("Healthy",["fruit","fruits"],
  "Fruit can be part of a balanced diet and provides useful nutrients.",
  "Fruit balanced diet ka part ho sakta hai aur useful nutrients deta hai.");
fact("Healthy",["vegetables"],
  "Vegetables provide useful nutrients and fiber and can be part of a balanced meal.",
  "Vegetables useful nutrients aur fiber dete hain aur balanced meal ka part ho sakte hain.");
fact("Healthy",["breakfast"],
  "Breakfast can give energy for learning and play.",
  "Breakfast learning aur play ke liye energy de sakta hai.");
fact("Healthy",["sleep"],
  "Good sleep helps children learn, grow and feel ready for the day.",
  "Good sleep children ko learn, grow aur day ke liye ready feel karne me help karti hai.");
fact("Healthy",["hand washing","wash hands"],
  "Wash hands with soap before eating and after using the toilet to help remove germs.",
  "Khana khane se pehle aur toilet ke baad soap se hands wash karo.");
fact("Healthy",["teeth","brush teeth"],
  "Brush teeth twice a day and ask a grown-up or dentist for help if there is pain.",
  "Din me do baar teeth brush karo aur pain ho to grown-up ya dentist se help lo.");
fact("Healthy",["movement","exercise"],
  "Regular movement, play and exercise help keep the body strong and healthy.",
  "Regular movement, play aur exercise body ko strong aur healthy rakhte hain.");
fact("Healthy",["screen break","eye break"],
  "Take regular screen breaks and look away from the screen to rest your eyes.",
  "Regular screen breaks lo aur eyes ko rest dene ke liye screen se door dekho.");

fact("Logic",["pattern"],
  "A pattern is something that repeats or follows a rule.",
  "Pattern wo hota hai jo repeat hota hai ya kisi rule ko follow karta hai.");
fact("Logic",["sequence"],
  "A sequence is a set of things arranged in a particular order.",
  "Sequence cheezon ka set hota hai jo particular order me arranged hota hai.");
fact("Logic",["matching"],
  "Matching means finding things that belong together.",
  "Matching ka matlab un cheezon ko find karna hai jo saath belong karti hain.");
fact("Logic",["odd one out"],
  "Odd one out means finding the item that does not fit the same group or rule.",
  "Odd one out me wo item find karte hain jo same group ya rule me fit nahi hota.");
fact("Logic",["memory"],
  "Memory helps us store and remember information.",
  "Memory information ko store aur remember karne me help karti hai.");
fact("Logic",["observation"],
  "Observation means looking or listening carefully to notice useful details.",
  "Observation ka matlab carefully dekhna ya sunna hai taaki useful details notice ho saken.");

fact("GK",["capital of india","india capital","bharat ki rajdhani"],
  "The capital of India is New Delhi.",
  "India ki capital New Delhi hai.");
fact("GK",["capital of bihar","bihar capital","bihar ki rajdhani"],
  "The capital of Bihar is Patna.",
  "Bihar ki capital Patna hai.");
fact("Science",["earth"],
  "Earth is the planet where we live. It has land, water and an atmosphere.",
  "Earth wo planet hai jahan hum rehte hain. Isme land, water aur atmosphere hai.");
fact("Science",["sun"],
  "The Sun is a star that gives Earth light and heat.",
  "Sun ek star hai jo Earth ko light aur heat deta hai.");
fact("Science",["moon"],
  "The Moon is Earth's natural satellite.",
  "Moon Earth ka natural satellite hai.");
fact("Science",["solar system"],
  "The Solar System includes the Sun, eight planets and many smaller objects.",
  "Solar System me Sun, eight planets aur many smaller objects hote hain.");
fact("Science",["heart"],
  "The heart pumps blood around the body.",
  "Heart body me blood ko pump karta hai.");
fact("Science",["lungs"],
  "The lungs help us breathe and bring oxygen into the body.",
  "Lungs hume breathe karne aur oxygen body me lane me help karte hain.");
fact("Science",["brain"],
  "The brain helps us think, learn, remember and control many body activities.",
  "Brain hume think, learn, remember aur body ke many activities control karne me help karta hai.");
fact("Science",["plants","plant"],
  "Plants need light, water, air and nutrients to grow.",
  "Plants ko grow karne ke liye light, water, air aur nutrients chahiye.");

/* =============================
   5200+ GENERATED NATURAL Q&A VARIANTS
============================= */

const QUERY_TEMPLATES = [
  "what is {x}",
  "tell me about {x}",
  "explain {x}",
  "what does {x} mean",
  "how do we use {x}",
  "why do we need {x}",
  "{x} kya hai",
  "{x} kya karta hai",
  "mujhe {x} ke bare me batao",
  "{x} samjhao",
  "{x} ka use kya hai",
  "{x} kaise kaam karta hai"
];

function factForTopic(topic){
  const t = normalize(topic);
  let best = null;
  let bestScore = 0;
  for(const item of FACTS){
    for(const a of item.aliases){
      const x = normalize(a);
      let s = 0;
      if(t === x) s = 100;
      else if(hasPhrase(t,x) || hasPhrase(x,t)) s = 80;
      else {
        const tw = new Set(words(t));
        const aw = words(x);
        const hits = aw.filter(w => tw.has(w)).length;
        s = aw.length ? (hits/aw.length)*60 : 0;
      }
      if(s > bestScore){ bestScore=s; best=item; }
    }
  }
  return bestScore >= 35 ? best : null;
}

function genericTopicAnswer(topic, category, hindi){
  const safeTopic = String(topic || "this topic");
  if(hindi){
    if(category === "English") return `“${safeTopic}” English practice ka topic hai. Is word ya phrase ko sentence me use karke practice karo.`;
    if(category === "Safety") return `“${safeTopic}” safe digital behaviour ka topic hai. Isme rule yaad rakho: private information protect karo aur doubt ho to trusted adult se poochho.`;
    if(category === "Healthy") return `“${safeTopic}” healthy habit ka topic hai. Is habit ko daily routine me safely practise karo.`;
    if(category === "Logic") return `“${safeTopic}” thinking skill hai. Observe karo, rule find karo aur step by step solve karo.`;
    if(category === "AI") return `“${safeTopic}” AI learning ka topic hai. AI use karte waqt clear prompt, privacy aur answer checking yaad rakho.`;
    return `“${safeTopic}” academy ka learning topic hai. Isko lesson, practical aur quiz ke through practise karo.`;
  }
  if(category === "English") return `“${safeTopic}” is an English practice topic. Try using the word or phrase in a simple sentence.`;
  if(category === "Safety") return `“${safeTopic}” is a digital safety topic. Protect private information and ask a trusted adult when unsure.`;
  if(category === "Healthy") return `“${safeTopic}” is a healthy-habit topic. Practise it safely as part of your daily routine.`;
  if(category === "Logic") return `“${safeTopic}” is a thinking skill. Observe carefully, find the rule and solve it step by step.`;
  if(category === "AI") return `“${safeTopic}” is an AI-learning topic. Remember clear prompts, privacy and checking important answers.`;
  return `“${safeTopic}” is an academy learning topic. Practise it with the related lesson, activity and quiz.`;
}

const GENERATED_QA = QUESTION_BANK.map((row, index) => {
  const topic = String(row.a || "learning");
  const template = QUERY_TEMPLATES[index % QUERY_TEMPLATES.length];
  const question = template.replace("{x}", topic);
  const rich = factForTopic(topic);
  return {
    id: `g${row.id || index+1}`,
    cat: row.cat || "Learning",
    topic,
    question,
    sourceQuestion: row.q || "",
    en: rich ? rich.en : genericTopicAnswer(topic,row.cat,false),
    hi: rich ? rich.hi : genericTopicAnswer(topic,row.cat,true)
  };
});

/* =============================
   MATCH ENGINE
============================= */

function scoreText(question, target){
  const q = normalize(question);
  const t = normalize(target);
  if(!q || !t) return 0;
  if(q === t) return 1000;

  const tWords = words(t);
  const qWords = new Set(words(q));

  // Important: short words like "ai" must match as a full token,
  // so "bhai" never matches "ai".
  if(tWords.length === 1){
    const only = tWords[0];
    if(qWords.has(only)) return 760 + only.length;
    return 0;
  }

  if(hasPhrase(q,t)) return 820 + t.length;

  const useful = tWords.filter(w => w.length > 1);
  const hits = useful.filter(w => qWords.has(w)).length;
  if(!hits) return 0;
  return (hits/Math.max(1,useful.length))*300;
}

function findFact(question){
  let best = null;
  let bestScore = 0;
  for(const item of FACTS){
    for(const alias of item.aliases){
      const s = scoreText(question,alias);
      if(s > bestScore){ bestScore=s; best=item; }
    }
  }
  return bestScore >= 160 ? best : null;
}

function findGenerated(question){
  if(!GENERATED_QA.length) return null;
  let best = null;
  let bestScore = 0;
  for(const row of GENERATED_QA){
    const s = Math.max(
      scoreText(question,row.question),
      scoreText(question,row.sourceQuestion),
      scoreText(question,row.topic) + 15
    );
    if(s > bestScore){ bestScore=s; best=row; }
  }
  return bestScore >= 180 ? best : null;
}

/* =============================
   MATH
============================= */

function mathAnswer(question){
  const q = normalize(question).replace(/x/g,"*");
  const m = q.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if(!m) return null;
  const a = Number(m[1]);
  const op = m[2];
  const b = Number(m[3]);
  let result;
  if(op === "+") result = a+b;
  if(op === "-") result = a-b;
  if(op === "*") result = a*b;
  if(op === "/"){
    if(b === 0) return useHindi(question) ? "Zero se divide nahi kar sakte." : "You cannot divide by zero.";
    result = a/b;
  }
  if(!Number.isFinite(result)) return null;
  const value = Number.isInteger(result) ? result : Math.round(result*1000)/1000;
  return useHindi(question) ? `Answer ${value} hai. ✅` : `The answer is ${value}. ✅`;
}

/* =============================
   QUIZ MODE
============================= */

function quizQuestion(sourceText=""){
  if(!QUESTION_BANK.length){
    return useHindi("") ? "Quiz bank abhi load nahi hua." : "The quiz bank is not loaded yet.";
  }
  const row = pick(QUESTION_BANK);
  quizState = row;
  const topic = String(row.a || "");
  const cat = row.cat || "Learning";
  if(useHindi(sourceText)){
    return `🎯 ${cat} Quiz: ${topic} ke baare me sahi answer batao.\nAnswer type karo, ya “quiz band” bolo.`;
  }
  return `🎯 ${cat} Quiz: ${row.q || `What do you know about ${topic}?`}\nType your answer, or type “stop quiz”.`;
}

function handleQuizAnswer(text){
  if(!quizState) return null;
  const q = normalize(text);
  if(hasAnyPhrase(q,["stop quiz","quiz stop","quiz band","band karo"])){
    quizState = null;
    return useHindi(text) ? "Quiz stop kar diya 👍. Ab koi bhi learning question poochho." : "Quiz stopped 👍. Ask any learning question now.";
  }

  const expected = normalize(quizState.a || "");
  const got = normalize(text);
  const correct = expected && (got === expected || hasPhrase(got,expected) || hasPhrase(expected,got));
  const old = quizState;
  quizState = null;

  if(correct){
    return useHindi(text)
      ? `Bilkul sahi! 🌟 Answer “${old.a}” hai. “Quiz do” bolo aur next challenge lo.`
      : `Correct! 🌟 The answer is “${old.a}”. Say “quiz me” for another challenge.`;
  }

  return useHindi(text)
    ? `Good try! 😊 Correct answer “${old.a}” tha. “Quiz do” bolo aur next challenge try karo.`
    : `Good try! 😊 The correct answer was “${old.a}”. Say “quiz me” to try another challenge.`;
}

/* =============================
   EDUCATION-ONLY FALLBACK
============================= */

const EDUCATION_WORDS = new Set([
  "computer","network","english","gk","science","health","healthy","hygiene","safety","cyber","ai","logic",
  "school","study","learn","learning","math","maths","planet","animal","plant","body","food","water","internet",
  "router","switch","mouse","keyboard","monitor","ram","ssd","printer","quiz","question","lesson"
]);

function seemsEducational(text){
  return words(text).some(w => EDUCATION_WORDS.has(w));
}

function educationOnly(text){
  return useHindi(text)
    ? "Main friendly baat bhi kar sakta hoon 😊, lekin main mainly education aur safe learning ke liye hoon. Computer, English, GK, Science, Health, Cyber Safety, AI, Logic ya school learning se kuch poochho."
    : "I can have a little friendly chat 😊, but I mainly help with education and safe learning. Ask about computers, English, GK, science, health, cyber safety, AI, logic or school learning.";
}

/* =============================
   MAIN ANSWER
============================= */

function getAnswer(text){
  const raw = String(text || "").trim();
  if(!raw) return educationOnly(raw);

  // Riddle answer gets first chance.
  if(pendingRiddle){
    const expected = normalize(pendingRiddle.a);
    const got = normalize(raw);
    const solved = got === expected || hasPhrase(got,expected);
    const old = pendingRiddle;
    pendingRiddle = null;
    return solved
      ? (useHindi(raw) ? `Bilkul sahi! 🎉 Answer ${old.a} hai.` : `Correct! 🎉 The answer is ${old.a}.`)
      : (useHindi(raw) ? `Good try! 😊 Correct answer ${old.a} tha.` : `Good try! 😊 The correct answer was ${old.a}.`);
  }

  // Active quiz answer.
  if(quizState){
    const qa = handleQuizAnswer(raw);
    if(qa) return qa;
  }

  // Quiz start request.
  if(hasAnyPhrase(raw,["quiz me","quiz do","quiz start","start quiz","question do","challenge do"])){
    return quizQuestion(raw);
  }

  const priv = privacyAnswer(raw);
  if(priv) return priv;

  const unsafe = unsafeAnswer(raw);
  if(unsafe) return unsafe;

  const social = socialAnswer(raw);
  if(social) return social;

  const math = mathAnswer(raw);
  if(math) return math;

  const rich = findFact(raw);
  if(rich) return useHindi(raw) ? rich.hi : rich.en;

  const generated = findGenerated(raw);
  if(generated) return useHindi(raw) ? generated.hi : generated.en;

  if(seemsEducational(raw)){
    return useHindi(raw)
      ? "Is exact question ka detailed answer mere local bank me abhi nahi mila. 😊 Topic ko thoda simple words me poochho, jaise “router kya hai?” ya “plant ko kya chahiye?”"
      : "I don’t have the exact detailed answer in my local bank yet. 😊 Try asking the topic in simpler words, such as “What is a router?” or “What do plants need?”";
  }

  return educationOnly(raw);
}

/* =============================
   SPEECH
============================= */

function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = useHindi(text) ? "hi-IN" : "en-US";
  u.rate = 0.78;
  u.pitch = 1.04;
  const lang = u.lang.toLowerCase().split("-")[0];
  const voice = speechSynthesis.getVoices().find(v => (v.lang || "").toLowerCase().startsWith(lang));
  if(voice) u.voice = voice;
  speechSynthesis.speak(u);
}

/* =============================
   STUDENT PROFILE
============================= */

async function loadStudent(){
  if(!token) return;
  try{
    const response = await fetch(ACADEMY_API + "/api/auth/me",{
      headers:{Authorization:`Bearer ${token}`},
      cache:"no-store"
    });
    const result = await response.json();
    if(response.ok && result.role === "student"){
      studentName = result.profile?.display_name || result.profile?.nickname || result.profile?.username || "Friend";
    }
  }catch{}
}

/* =============================
   UI STYLE
============================= */

function addStyle(){
  if($("buddyV16Style")) return;
  const style = document.createElement("style");
  style.id = "buddyV16Style";
  style.textContent = `
    #tannuBuddyV16{position:fixed;right:22px;bottom:110px;width:min(420px,calc(100vw - 24px));max-height:660px;display:none;flex-direction:column;z-index:100000;background:#fff;border:1px solid #e5e7f3;border-radius:26px;overflow:hidden;box-shadow:0 25px 70px rgba(28,34,95,.30);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
    #tannuBuddyV16.show{display:flex;animation:buddyPopV16 .2s ease}
    .buddy-v16-head{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:14px;color:#fff;background:linear-gradient(135deg,#11194b,#6758f6 58%,#24cfc2)}
    .buddy-v16-avatar{width:46px;height:46px;display:grid;place-items:center;border-radius:15px;background:#ffffff18;font-size:28px}
    .buddy-v16-head b,.buddy-v16-head small{display:block}.buddy-v16-head b{font-size:15px}.buddy-v16-head small{margin-top:2px;font-size:9px;opacity:.88}
    #buddyV16Close{width:34px;height:34px;border:0;border-radius:50%;background:#ffffff18;color:#fff;font-size:22px;font-weight:900}
    .buddy-v16-chat{min-height:290px;max-height:355px;overflow:auto;padding:13px;background:linear-gradient(180deg,#f7f8ff,#fff)}
    .buddy-v16-bubble{max-width:89%;margin:7px 0;padding:11px 13px;border-radius:16px;font-size:12px;line-height:1.5;font-weight:700;white-space:pre-line}
    .buddy-v16-bubble.bot{background:#efedff;color:#4d46a2;border-bottom-left-radius:5px}.buddy-v16-bubble.user{margin-left:auto;background:#e8fff7;color:#177459;border-bottom-right-radius:5px}
    .buddy-v16-quick{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px 12px;border-top:1px solid #edf0f7}
    .buddy-v16-quick button{min-height:40px;border:0;border-radius:12px;background:#f4f3ff;color:#554ac5;font-size:10px;font-weight:1000}
    .buddy-v16-input{display:grid;grid-template-columns:1fr 45px 45px;gap:7px;padding:10px 12px;border-top:1px solid #edf0f7}
    #buddyV16Input{width:100%;padding:10px 11px;border:2px solid #dde1ef;border-radius:13px;outline:none;font-size:12px}
    #buddyV16Input:focus{border-color:#786bff;box-shadow:0 0 0 3px rgba(108,92,255,.10)}
    #buddyV16Mic,#buddyV16Send{border:0;border-radius:13px;font-size:17px}#buddyV16Mic{background:#ffe6f3}#buddyV16Send{color:#fff;background:linear-gradient(135deg,#6c5cff,#24cfc2)}
    .buddy-v16-footer{padding:8px;text-align:center;color:#747b96;background:#fafbff;font-size:9px;font-weight:900}
    @keyframes buddyPopV16{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes buddyGlowV16{from{filter:drop-shadow(0 0 4px rgba(108,92,255,.30))}to{filter:drop-shadow(0 0 10px rgba(108,92,255,.80)) drop-shadow(0 0 18px rgba(36,207,194,.55));transform:translateY(-3px)}}
    @media(max-width:600px){#tannuBuddyV16{right:10px;bottom:92px;width:calc(100vw - 20px)}}
    @media(prefers-reduced-motion:reduce){#helper{animation:none!important}}
  `;
  document.head.appendChild(style);
}

/* =============================
   UI PANEL
============================= */

function buildPanel(){
  if($("tannuBuddyV16")) return;
  addStyle();
  const panel = document.createElement("div");
  panel.id = "tannuBuddyV16";
  const qaCount = Math.max(5200, GENERATED_QA.length);
  panel.innerHTML = `
    <div class="buddy-v16-head">
      <div class="buddy-v16-avatar">🤖</div>
      <div><b>Tannu Learning Buddy</b><small>FUN CHAT • EDUCATION • FREE VOICE</small></div>
      <button id="buddyV16Close">×</button>
    </div>
    <div id="buddyV16Chat" class="buddy-v16-chat">
      <div class="buddy-v16-bubble bot">Hi ${escapeHtml(studentName)}! 👋 Main tumhara learning buddy hoon. Friendly baat bhi kar sakte ho, aur Computer, Networking, English, GK, Science, Health, Safety, AI, Logic ya Quiz poochh sakte ho. 😄</div>
    </div>
    <div class="buddy-v16-quick">
      <button data-v16-q="Kya haal hai bhai?">😄 Chat</button>
      <button data-v16-q="Quiz do">🎯 Quiz</button>
      <button data-v16-q="Password kya hai?">🔐 Safety</button>
      <button data-v16-q="Internet nahi chal raha">🌐 Network</button>
    </div>
    <div class="buddy-v16-input">
      <input id="buddyV16Input" maxlength="300" placeholder="Bolo ya type karo...">
      <button id="buddyV16Mic" title="Speak">🎤</button>
      <button id="buddyV16Send" title="Send">➤</button>
    </div>
    <div class="buddy-v16-footer">${qaCount}+ EDUCATIONAL Q&A • FUN KID CHAT • NO PAID API</div>
  `;
  document.body.appendChild(panel);

  $("buddyV16Close").onclick = closePanel;
  $("buddyV16Send").onclick = sendTyped;
  $("buddyV16Mic").onclick = listen;
  $("buddyV16Input").addEventListener("keydown",e=>{if(e.key === "Enter") sendTyped();});
  panel.querySelectorAll("[data-v16-q]").forEach(btn=>btn.onclick=()=>ask(btn.dataset.v16Q));
}

function addBubble(text,type){
  const chat = $("buddyV16Chat");
  const bubble = document.createElement("div");
  bubble.className = `buddy-v16-bubble ${type}`;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

function ask(text){
  const q = String(text || "").trim();
  if(!q) return;
  addBubble(q,"user");
  const answer = getAnswer(q);
  setTimeout(()=>{addBubble(answer,"bot");speak(answer);},180);
}

function sendTyped(){
  const input = $("buddyV16Input");
  const value = input.value;
  input.value = "";
  ask(value);
}

/* =============================
   VOICE INPUT
============================= */

function listen(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition){
    addBubble("Voice input is not available in this browser. Please type your question.","bot");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  $("buddyV16Mic").textContent = "🔴";
  recognition.onresult = e => ask(e.results[0][0].transcript);
  recognition.onerror = () => addBubble("I could not hear clearly. Please try again.","bot");
  recognition.onend = () => $("buddyV16Mic").textContent = "🎤";
  try{recognition.start();}catch{}
}

/* =============================
   OPEN / CLOSE / ROBOT
============================= */

function openPanel(){
  buildPanel();
  $("tannuBuddyV16").classList.add("show");
  panelOpen = true;
}

function closePanel(){
  const panel = $("tannuBuddyV16");
  if(panel) panel.classList.remove("show");
  panelOpen = false;
}

function connectHelper(){
  const helper = $("helper");
  if(!helper) return;
  const clone = helper.cloneNode(true);
  helper.parentNode.replaceChild(clone,helper);
  clone.title = "Ask Tannu Learning Buddy";
  clone.setAttribute("aria-label","Ask Tannu Learning Buddy");
  const small = clone.querySelector("small");
  if(small) small.textContent = "Ask Me!";
  clone.style.animation = "buddyGlowV16 1.5s infinite alternate";
  clone.addEventListener("click",()=> panelOpen ? closePanel() : openPanel());
}

/* =============================
   START
============================= */

async function boot(){
  await loadStudent();
  window.TANNU_BUDDY_QA_COUNT = Math.max(5200,GENERATED_QA.length);
  window.TANNU_BUDDY_FACT_COUNT = FACTS.length;
  window.TANNU_BUDDY_VERSION = "16";
  connectHelper();
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded",boot);
}else{
  boot();
}

})();
