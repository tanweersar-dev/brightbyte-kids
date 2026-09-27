(() => {
"use strict";

/*
  Tannu Learning Buddy V18
  FREE • GLOBAL • VOICE • DRAGGABLE • CONVERSATION FLOW
  No paid API. No OpenAI key.
  Loads question-bank.js automatically when needed.
*/

const ACADEMY_API="https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const STATE_KEY="tannu_buddy_v17_state";
const VOICE_KEY="tannu_buddy_voice_lang";
const $=id=>document.getElementById(id);

let studentName="Friend";
let panelOpen=false;
let recognition=null;
let voiceLang=localStorage.getItem(VOICE_KEY)||"hi-IN";
let questionBank=[];
let state=loadState();

function loadState(){
  try{
    return JSON.parse(sessionStorage.getItem(STATE_KEY))||{
      lastIntent:"",
      lastTopic:"",
      lastBotQuestion:"",
      turns:[]
    };
  }catch{
    return {lastIntent:"",lastTopic:"",lastBotQuestion:"",turns:[]};
  }
}
function saveState(){
  state.turns=state.turns.slice(-12);
  sessionStorage.setItem(STATE_KEY,JSON.stringify(state));
}
function remember(role,text){
  state.turns.push({role,text:String(text).slice(0,500),at:Date.now()});
  saveState();
}
function normalize(t){
  return String(t||"").toLowerCase()
    .replace(/[^\p{L}\p{N}\s+\-*/().]/gu," ")
    .replace(/\s+/g," ").trim();
}
function tokens(t){return normalize(t).split(" ").filter(Boolean)}
function hasToken(t,x){return new Set(tokens(t)).has(normalize(x))}
function hasPhrase(t,p){return ` ${normalize(t)} `.includes(` ${normalize(p)} `)}
function hasAny(t,list){return list.some(x=>hasPhrase(t,x))}
function isHindiScript(t){return /[\u0900-\u097F]/.test(String(t||""))}
function isHinglish(t){
  const hints=["kya","kaise","hai","hain","bhai","yaar","batao","karo","mujhe","mera","meri","tum","aap","hum","mai","main","nahi","kyu","kyon","acha","achha","thik","theek","wala","wali","ka","ki","ke"];
  return hints.some(x=>hasToken(t,x));
}
function hindiMode(t){return isHindiScript(t)||isHinglish(t)}
function firstName(){
  const n=String(studentName||"Friend").trim();
  return n.split(/\s+/)[0]||"Friend";
}
function pick(a){return a[Math.floor(Math.random()*a.length)]}

async function ensureQuestionBank(){
  if(Array.isArray(window.TANNU_QUESTION_BANK)){
    questionBank=window.TANNU_QUESTION_BANK;
    return;
  }
  await new Promise(resolve=>{
    const old=document.querySelector('script[src$="question-bank.js"]');
    if(old){
      old.addEventListener("load",resolve,{once:true});
      setTimeout(resolve,1200);
      return;
    }
    const s=document.createElement("script");
    s.src="question-bank.js";
    s.onload=resolve;
    s.onerror=resolve;
    document.head.appendChild(s);
  });
  questionBank=Array.isArray(window.TANNU_QUESTION_BANK)?window.TANNU_QUESTION_BANK:[];
}

const TOPICS=[
["computer","Computer","A computer takes input, processes information, stores data and gives output.","Computer input leta hai, information process karta hai, data store karta hai aur output deta hai."],
["hardware","Computer","Hardware means the physical parts of a computer that you can see or touch.","Hardware computer ke physical parts hote hain jinhe hum dekh ya touch kar sakte hain."],
["software","Computer","Software is a set of programs and instructions that tells a computer what to do.","Software programs aur instructions ka set hota hai jo computer ko batata hai kya karna hai."],
["cpu|processor","Computer","The CPU is the main processor. It follows instructions and performs calculations.","CPU main processor hota hai. Ye instructions follow karta hai aur calculations karta hai."],
["ram|memory","Computer","RAM is short-term working memory. It helps active programs run smoothly.","RAM short-term working memory hoti hai jo active programs ko smoothly run karne me help karti hai."],
["ssd","Computer","An SSD stores files and programs and is usually faster than a traditional hard disk.","SSD files aur programs store karta hai aur usually traditional hard disk se fast hota hai."],
["hdd|hard disk|hard drive","Computer","A hard disk stores files, programs and the operating system for long-term use.","Hard disk files, programs aur operating system ko long-term store karta hai."],
["monitor|display|screen","Computer","A monitor shows text, pictures, videos and other visual output.","Monitor text, pictures, videos aur doosra visual output dikhata hai."],
["keyboard","Computer","A keyboard is used to type letters, numbers, symbols and commands.","Keyboard se letters, numbers, symbols aur commands type karte hain."],
["mouse|computer mouse","Computer","A mouse helps you point, click, select, drag and move things on the screen.","Mouse se screen par point, click, select, drag aur move karte hain."],
["printer|printing","Computer","A printer makes a paper copy of digital information.","Printer digital information ki paper copy banata hai."],
["scanner|scan","Computer","A scanner turns a paper document or photo into a digital copy.","Scanner paper document ya photo ko digital copy me badalta hai."],
["speaker|speakers","Computer","Speakers play sound from a computer.","Speakers computer ka sound bajate hain."],
["microphone|mic","Computer","A microphone sends your voice or other sounds into the computer.","Microphone voice ya sound ko computer me input karta hai."],
["webcam|computer camera","Computer","A webcam is used for video calls, online classes and recording.","Webcam video calls, online classes aur recording ke liye use hota hai."],
["usb|usb port","Computer","USB is a common connection for keyboards, mice, printers and flash drives.","USB se keyboard, mouse, printer aur flash drive jaise devices connect hote hain."],
["hdmi|hdmi cable","Computer","HDMI can carry digital video and sound between devices.","HDMI devices ke beech digital video aur sound le ja sakta hai."],
["vga|vga cable","Computer","VGA is an older display connection used to carry video to a monitor.","VGA purana display connection hai jo monitor tak video signal le jata hai."],
["file|computer file","Computer","A file is saved information such as a document, picture, video or song.","File saved information hoti hai jaise document, picture, video ya song."],
["folder|directory","Computer","A folder helps organize files so they are easier to find.","Folder files ko organize karta hai taaki unhe aasani se find kiya ja sake."],
["browser|web browser|chrome|edge","Computer","A web browser is a program used to open and view websites.","Web browser se websites open aur view karte hain."],
["download|downloading","Computer","Downloading means copying a file or information from the internet to your device.","Download ka matlab internet se file ya information apne device me copy karna hota hai."],
["upload|uploading","Computer","Uploading means sending a file from your device to a website or online service.","Upload ka matlab apne device se file ko website ya online service par bhejna hota hai."],
["recycle bin|deleted files","Computer","The Recycle Bin temporarily keeps many deleted files so they can sometimes be restored.","Recycle Bin kai deleted files ko temporarily rakhta hai jisse unhe restore kiya ja sakta hai."],
["desktop","Computer","The desktop is the main workspace you see after signing in to a computer.","Desktop computer sign-in ke baad dikhne wala main workspace hota hai."],
["icon","Computer","An icon is a small picture that represents an app, file, folder or command.","Icon ek chhoti picture hoti hai jo app, file, folder ya command ko represent karti hai."],
["taskbar","Computer","The taskbar helps you open and switch between apps and see system controls.","Taskbar apps open/switch karne aur system controls dekhne me help karta hai."],

["network|computer network","Networking","A network connects devices so they can communicate and share resources.","Network devices ko connect karta hai taaki wo communicate aur resources share kar saken."],
["lan|local area network","Networking","A LAN connects devices in a small area such as a home, classroom or office.","LAN chhote area jaise home, classroom ya office me devices ko connect karta hai."],
["wan|wide area network","Networking","A WAN connects networks across a large geographic area.","WAN large geographic area me networks ko connect karta hai."],
["ethernet|lan cable|network cable|rj45","Networking","An Ethernet cable connects a device to a wired network.","Ethernet cable device ko wired network se connect karti hai."],
["router|wifi router","Networking","A router connects networks and helps devices reach other networks and the internet.","Router networks ko connect karta hai aur devices ko internet tak pahunchne me help karta hai."],
["switch|network switch","Networking","A network switch connects many devices inside the same local network.","Network switch local network ke andar kai devices ko connect karta hai."],
["wifi|wi-fi|wireless","Networking","Wi-Fi lets devices connect to a network without a network cable.","Wi-Fi devices ko bina LAN cable ke wireless network se connect karta hai."],
["ip|ip address","Networking","An IP address identifies a device on an IP network.","IP address network me device ki pehchan ke liye use hota hai."],
["dhcp","Networking","DHCP automatically gives devices network settings such as an IP address.","DHCP automatically devices ko IP address jaise network settings deta hai."],
["dns","Networking","DNS helps turn website names into IP addresses computers can use.","DNS website names ko IP addresses me badalne me help karta hai."],
["gateway|default gateway","Networking","A default gateway is usually the router that helps a device communicate outside its local network.","Default gateway usually router hota hai jo device ko local network ke bahar communicate karne me help karta hai."],
["ping|ping command","Networking","Ping checks whether another network device can be reached.","Ping se check karte hain ki doosra network device reachable hai ya nahi."],
["internet","Networking","The internet is a worldwide system of connected networks that exchange information.","Internet connected networks ka worldwide system hai."],
["modem","Networking","A modem connects a home or office network to an internet service in many setups.","Modem kai setups me home ya office network ko internet service se connect karta hai."],
["access point|wireless access point","Networking","A wireless access point lets Wi-Fi devices join a wired network.","Wireless access point Wi-Fi devices ko wired network join karne deta hai."],
["nic|network card|network adapter","Networking","A network adapter lets a device connect to a network.","Network adapter device ko network se connect hone deta hai."],
["mac address","Networking","A MAC address is a hardware identifier used by a network interface.","MAC address network interface ka hardware identifier hota hai."],
["vpn","Networking","A VPN creates a protected connection between a device and another network over the internet.","VPN internet ke through protected connection banata hai."],
["packet|data packet","Networking","A packet is a small piece of data sent across a network.","Packet network par bheje jane wale data ka chhota piece hota hai."],
["bandwidth|network speed","Networking","Bandwidth describes how much data a connection can carry in a given time.","Bandwidth batata hai connection ek time me kitna data carry kar sakta hai."],
["network path|pc switch router internet","Networking","A simple wired path can be PC → switch → router/firewall → internet.","Simple wired path PC → switch → router/firewall → internet ho sakta hai."],

["no display|no signal|monitor no signal","Troubleshooting","Check monitor power, the display cable and the correct input source.","Monitor power, display cable aur correct input source check karo."],
["no internet|internet not working|internet nahi chal","Troubleshooting","Check the LAN cable or Wi-Fi first, then see whether other devices have internet.","Pehle LAN cable ya Wi-Fi check karo, phir doosre devices me internet check karo."],
["keyboard not working|keyboard nahi chal","Troubleshooting","Check the keyboard connection and try another USB port if needed.","Keyboard connection check karo aur zarurat ho to doosra USB port try karo."],
["mouse not working|mouse nahi chal","Troubleshooting","Check the mouse connection and try another USB port if needed.","Mouse connection check karo aur zarurat ho to doosra USB port try karo."],
["printer not printing|printing problem","Troubleshooting","Check printer power, paper, connection and whether the correct printer is selected.","Printer power, paper, connection aur correct printer selected hai ya nahi check karo."],
["computer not turning on|pc not starting","Troubleshooting","Check the power cable, socket or power strip and the computer power switch.","Power cable, socket/power strip aur computer power switch check karo."],
["slow computer|computer slow|pc slow","Troubleshooting","Close unnecessary programs, restart if needed, and ask an adult or technician if the problem continues.","Unnecessary programs close karo, zarurat ho to restart karo, aur problem rahe to adult/technician se help lo."],
["computer frozen|pc hang|not responding","Troubleshooting","Wait briefly, try closing the unresponsive program, and restart only if needed.","Thoda wait karo, unresponsive program close karo aur zarurat par hi restart karo."],
["no sound|speaker not working","Troubleshooting","Check volume, mute, speaker connection and selected audio output.","Volume, mute, speaker connection aur selected audio output check karo."],
["wifi not connecting|wifi problem","Troubleshooting","Check that Wi-Fi is on and choose the correct network.","Wi-Fi on hai ya nahi check karo aur correct network choose karo."],
["loose cable","Troubleshooting","A loose cable can stop power, display or network signals. Connect the correct cable securely.","Loose cable power, display ya network signal rok sakti hai. Correct cable securely connect karo."],
["restart|reboot","Troubleshooting","Restarting closes running programs and starts the device again. It can fix temporary problems.","Restart running programs close karke device ko dobara start karta hai aur temporary problem fix kar sakta hai."],
["system test","Troubleshooting","A simple system test checks power, display, keyboard, mouse, network and internet one by one.","System test power, display, keyboard, mouse, network aur internet ko one by one check karta hai."],
["wrong port|wrong cable","Troubleshooting","Match the connector shape and label before plugging a cable into a port.","Cable plug karne se pehle connector shape aur port label match karo."],

["password|strong password","Safety","A password is a private secret used to protect an account. Never ask someone for their password, and never share your own password with other people.","Password ek private secret hota hai jo account ko protect karta hai. Kisi se uska password nahi poochhna chahiye aur apna password bhi kisi ko nahi batana chahiye."],
["otp|one time password","Safety","An OTP is a one-time password used for verification. Never ask someone for their OTP and never share your own OTP.","OTP verification ke liye one-time password hota hai. Kisi se OTP nahi poochhna chahiye aur apna OTP kabhi share nahi karna chahiye."],
["private information|personal information","Safety","Private information includes passwords, OTPs, home addresses and phone numbers. Keep it private.","Private information me password, OTP, home address aur phone number aate hain. Ise private rakho."],
["phishing|fake email","Safety","Phishing is a trick used to make people reveal private information or click unsafe links.","Phishing me private information lene ya unsafe link click karwane ki trick hoti hai."],
["unknown link|suspicious link","Safety","Do not click an unknown or suspicious link. Ask a trusted adult if unsure.","Unknown ya suspicious link par click mat karo. Doubt ho to trusted adult se poochho."],
["online stranger|stranger chat","Safety","Do not share private details with an online stranger. Tell a trusted adult if someone makes you uncomfortable.","Online stranger ko private details mat do. Koi uncomfortable kare to trusted adult ko batao."],
["cyberbullying","Safety","Cyberbullying is unkind or harmful behavior online. Save evidence and tell a trusted adult.","Cyberbullying online unkind ya harmful behavior hai. Evidence save karo aur trusted adult ko batao."],
["scam|fraud","Safety","A scam tries to trick people into giving money or information. Stop, check and ask a trusted adult.","Scam money ya information lene ke liye trick karta hai. Ruko, check karo aur trusted adult se poochho."],
["trusted adult","Safety","A trusted adult can be a parent, guardian, teacher or another safe grown-up who helps protect you.","Trusted adult parent, guardian, teacher ya safe grown-up ho sakta hai."],
["road safety","Safety","Use a safe crossing, look both ways and follow road signals.","Safe crossing use karo, dono taraf dekho aur road signals follow karo."],

["ai|artificial intelligence","AI","Artificial intelligence helps computers perform tasks such as understanding language, finding patterns and creating content.","AI computers ko language samajhne, patterns find karne aur content create karne me help karta hai."],
["prompt|ai prompt","AI","A prompt is an instruction or question you give to an AI system.","Prompt ek instruction ya question hota hai jo AI system ko diya jata hai."],
["clear prompt|good prompt|better prompt","AI","A clear prompt says what you want and adds useful details.","Clear prompt batata hai kya chahiye aur useful details add karta hai."],
["ai mistake|ai wrong|check ai answer","AI","AI can make mistakes, so important facts should be checked with a teacher, parent or trusted source.","AI mistakes kar sakta hai, isliye important facts teacher, parent ya trusted source se check karo."],
["safe ai|ai safety","AI","Use AI for learning, keep private information private and check important answers.","AI ko learning ke liye use karo, private information private rakho aur important answers check karo."],

["hello|greeting","English","A friendly greeting can be Hello or Hi.","Friendly greeting Hello ya Hi ho sakti hai."],
["thank you|thanks","English","Say Thank you when someone helps you or gives you something.","Jab koi help kare ya kuch de to Thank you bolna achha manner hai."],
["please","English","Use please to make a request more polite.","Request ko polite banane ke liye please use karte hain."],
["sorry","English","Say sorry when you make a mistake and try to make it right.","Galti ho to sorry bolo aur galti theek karne ki koshish karo."],
["introduce yourself|self introduction","English","A simple introduction is: Hello, my name is ___. I am happy to meet you.","Simple introduction: Hello, my name is ___. I am happy to meet you."],
["ask for help","English","You can politely say: Excuse me, can you please help me?","Aap politely bol sakte ho: Excuse me, can you please help me?"],
["repeat","English","Repeat means to say or do something again.","Repeat ka matlab kisi cheez ko dobara bolna ya karna hota hai."],
["friend|friendship","English","A good friend is kind, respectful and helpful.","Good friend kind, respectful aur helpful hota hai."],
["good listener","English","A good listener waits for their turn and listens carefully.","Good listener apni turn ka wait karta hai aur carefully sunta hai."],
["confidence|speak confidently","English","Confidence grows with practice. Start with short sentences and practise a little every day.","Confidence practice se grow hota hai. Short sentences se start karo aur roz thoda practise karo."],

["water|hydration","Health","Water helps the body work properly. Drink water regularly during the day.","Water body ko properly kaam karne me help karta hai. Din bhar regular water piyo."],
["fruit|fruits","Health","Fruit can be part of a balanced diet and provides useful nutrients.","Fruit balanced diet ka part ho sakta hai aur useful nutrients deta hai."],
["vegetables","Health","Vegetables provide useful nutrients and fiber and can be part of a balanced meal.","Vegetables useful nutrients aur fiber dete hain aur balanced meal ka part ho sakte hain."],
["breakfast","Health","Breakfast can give energy for learning and play.","Breakfast learning aur play ke liye energy de sakta hai."],
["sleep","Health","Good sleep helps children learn, grow and feel ready for the day.","Good sleep children ko learn, grow aur day ke liye ready feel karne me help karti hai."],
["hand washing|wash hands|handwash","Health","Wash hands with soap before eating and after using the toilet to help remove germs.","Khana khane se pehle aur toilet ke baad soap se hands wash karo."],
["teeth|brush teeth","Health","Brush teeth twice a day and ask a grown-up or dentist for help if there is pain.","Din me do baar teeth brush karo aur pain ho to grown-up ya dentist se help lo."],
["movement|exercise","Health","Regular movement, play and exercise help keep the body strong and healthy.","Regular movement, play aur exercise body ko strong aur healthy rakhte hain."],
["screen break|eye break","Health","Take regular screen breaks and look away from the screen to rest your eyes.","Regular screen breaks lo aur eyes ko rest dene ke liye screen se door dekho."],
["germs","Health","Germs are tiny organisms. Some can cause illness, so cleanliness and handwashing are useful.","Germs tiny organisms hote hain. Kuch illness cause kar sakte hain, isliye cleanliness useful hai."],
["cough etiquette","Health","Cover coughs and sneezes with a tissue or your elbow, then wash your hands.","Cough ya sneeze ko tissue ya elbow se cover karo, phir hands wash karo."],
["posture","Health","Sit comfortably with your back supported and screen at a comfortable height.","Back ko support dekar comfortably baitho aur screen ko comfortable height par rakho."],

["pattern","Logic","A pattern is something that repeats or follows a rule.","Pattern wo hota hai jo repeat hota hai ya rule follow karta hai."],
["sequence","Logic","A sequence is a set of things arranged in a particular order.","Sequence cheezon ka set hota hai jo particular order me arranged hota hai."],
["matching","Logic","Matching means finding things that belong together.","Matching ka matlab un cheezon ko find karna hai jo saath belong karti hain."],
["odd one out","Logic","Odd one out means finding the item that does not fit the same group or rule.","Odd one out me wo item find karte hain jo same group ya rule me fit nahi hota."],
["observation","Logic","Observation means looking or listening carefully to notice useful details.","Observation ka matlab carefully dekhna ya sunna hai taaki useful details notice ho saken."],

["capital of india|india capital|bharat ki rajdhani","GK","The capital of India is New Delhi.","India ki capital New Delhi hai."],
["capital of bihar|bihar capital|bihar ki rajdhani","GK","The capital of Bihar is Patna.","Bihar ki capital Patna hai."],
["earth","Science","Earth is the planet where we live. It has land, water and an atmosphere.","Earth wo planet hai jahan hum rehte hain. Isme land, water aur atmosphere hai."],
["sun","Science","The Sun is a star that gives Earth light and heat.","Sun ek star hai jo Earth ko light aur heat deta hai."],
["moon","Science","The Moon is Earth's natural satellite.","Moon Earth ka natural satellite hai."],
["solar system","Science","The Solar System includes the Sun, eight planets and many smaller objects.","Solar System me Sun, eight planets aur many smaller objects hote hain."],
["heart","Science","The heart pumps blood around the body.","Heart body me blood pump karta hai."],
["lungs","Science","The lungs help us breathe and bring oxygen into the body.","Lungs hume breathe karne aur oxygen body me lane me help karte hain."],
["brain","Science","The brain helps us think, learn, remember and control many body activities.","Brain hume think, learn, remember aur body ke many activities control karne me help karta hai."],
["plant|plants","Science","Plants need light, water, air and nutrients to grow.","Plants ko grow karne ke liye light, water, air aur nutrients chahiye."],
["water cycle","Science","The water cycle includes evaporation, condensation and precipitation.","Water cycle me evaporation, condensation aur precipitation hote hain."]
].map(([aliases,cat,en,hi])=>({aliases:aliases.split("|"),cat,en,hi}));

const NATURAL_TEMPLATES=[
"What is {x}?","Tell me about {x}","Explain {x}","What does {x} do?","Why do we use {x}?","How does {x} work?","Give me a simple meaning of {x}","Teach me {x}",
"{x} kya hai?","{x} kya karta hai?","{x} ka use kya hai?","{x} samjhao","{x} ke bare me batao","simple me {x} batao","mujhe {x} sikhao","{x} ka meaning kya hai?",
"Can you explain {x}?","I want to learn {x}","Help me understand {x}","Give an example of {x}","Is {x} important?","Where is {x} used?","When do we use {x}?","Tell me one fact about {x}",
"{x} ke baare me aur batao","{x} ka example do","{x} kahan use hota hai?","{x} kab use hota hai?","{x} important kyu hai?","{x} easy way me samjhao","{x} kaam kaise karta hai?","{x} ka basic batao",
"Define {x}","Describe {x}","What can I learn about {x}?","What should a child know about {x}?","Give a short answer about {x}","Give a kid-friendly answer about {x}","Explain {x} in easy English","Teach {x} in one minute",
"{x} ko hindi me samjhao","{x} ko hinglish me samjhao","{x} ko easy language me batao","{x} par short note do","{x} ka simple answer do","{x} ko child ko kaise samjhayenge?","{x} se kya hota hai?","{x} kyu chahiye?",
"Quiz me about {x}","Ask me a question about {x}","What is one use of {x}?","What is one safety rule about {x}?","Can you give a clue about {x}?","What is the purpose of {x}?","What happens with {x}?","Where can I see {x}?",
"{x} pe quiz do","{x} par question poochho","{x} ka ek use batao","{x} ka purpose kya hai?","{x} kis kaam aata hai?","{x} ka fact batao","{x} ko yaad kaise rakhu?","{x} ka short explanation do"
];

let selfMadeBank=[];
function buildSelfMadeBank(){
  const out=[];
  for(const topic of TOPICS){
    const key=topic.aliases[0];
    for(const template of NATURAL_TEMPLATES){
      out.push({q:template.replaceAll("{x}",key),topic});
    }
  }
  selfMadeBank=out;
}

function topicScore(question,alias){
  const q=normalize(question), a=normalize(alias);
  if(!q||!a)return 0;
  if(q===a)return 1000;
  if(` ${q} `.includes(` ${a} `))return 700+a.length;
  const qs=new Set(tokens(q));
  const aw=tokens(a).filter(w=>w.length>1);
  const hits=aw.filter(w=>qs.has(w)).length;
  return hits?hits/Math.max(1,aw.length)*180:0;
}
function findTopic(question){
  let best=null,score=0;
  for(const t of TOPICS){
    for(const a of t.aliases){
      const s=topicScore(question,a);
      if(s>score){score=s;best=t}
    }
  }
  return score>=90?best:null;
}
function findNatural(question){
  let best=null,score=0;
  for(const row of selfMadeBank){
    const s=topicScore(question,row.q);
    if(s>score){score=s;best=row.topic}
  }
  return score>=110?best:null;
}
function findQuestionBank(question){
  let best=null,score=0;
  for(const row of questionBank){
    const s=Math.max(topicScore(question,row.q||""),topicScore(question,row.a||"")+15);
    if(s>score){score=s;best=row}
  }
  if(!best||score<120)return null;
  return findTopic(best.a||"")||{cat:best.cat||"Learning",en:`${best.a} is a ${best.cat||"learning"} topic in the academy.`,hi:`${best.a} academy ka ${best.cat||"learning"} topic hai.`};
}

const PRIVACY=/my password is|mera password|my otp is|mera otp|my phone number is|mera phone number|my address is|mera address/i;
const UNSAFE=/porn|nude|sexual content|make a bomb|bomb kaise|kill someone|hurt someone|suicide method|self harm method/i;
const OFFTOPIC=/dating|girlfriend|boyfriend|romance|dirty joke|gambling|betting|casino|alcohol|cigarette|vape/i;

function socialIntent(text){
  const q=normalize(text);
  const n=firstName();

  const asksHowAreYou =
    hasAny(q,[
      "how are you","how r you","how are u",
      "kaise ho","kaise hain","kaisa ho","kaisi ho",
      "kya haal hai","kya hal hai","kya haal","kya hal",
      "haal kaisa hai","hal kaisa hai",
      "kya haal bhai","kya haal hai bhai",
      "kya scene hai","sab thik","sab theek"
    ]) ||
    ((hasToken(q,"haal")||hasToken(q,"hal")) &&
      (hasToken(q,"kya")||hasToken(q,"kaisa")||hasToken(q,"kaise"))) ||
    (hasToken(q,"kaise") && (hasToken(q,"ho")||hasToken(q,"hain")));

  if(asksHowAreYou){
    state.lastIntent="how_are_you";
    saveState();
    return hindiMode(text)
      ? `Main bilkul badhiya hoon 😄 Thank you, ${n}! Tum kaise ho, ${n}? Study se related jo bhi janna ho poochho—Computer, English, GK, Science, Safety, AI ya Networking.`
      : `I'm doing great 😄 Thank you, ${n}! How are you, ${n}? Ask me anything about your studies—Computers, English, GK, Science, Safety, AI or Networking.`;
  }

  const saysFine =
    hasAny(q,[
      "i am fine","i am good","i'm fine","i'm good",
      "fine","good","great","doing good",
      "main thik hoon","mai thik hu","main theek hoon","mai theek hu",
      "hum thik hain","hum theek hain","badhiya hoon","mast hoon",
      "main badhiya hoon","main mast hoon","thik hoon","theek hoon"
    ]) ||
    ((hasToken(q,"thik")||hasToken(q,"theek")||hasToken(q,"badhiya")||hasToken(q,"mast")) &&
      (hasToken(q,"hoon")||hasToken(q,"hu")||hasToken(q,"hain")));

  if(state.lastIntent==="how_are_you" && saysFine){
    state.lastIntent="ready_to_learn";
    saveState();
    return hindiMode(text)
      ? `Ye sunkar achha laga, ${n}! 😄 Chalo learning continue karte hain. Tum koi sawal poochho, ya bolo “quiz do”.`
      : `Glad to hear that, ${n}! 😄 Let's keep learning. Ask me a question or say “quiz me”.`;
  }

  if(state.lastIntent==="how_are_you" && hasAny(q,["aur tum","tum batao","aap batao","what about you","and you"])){
    return hindiMode(text)
      ? `Main bhi bilkul badhiya hoon 😄 ${n}! Main yahin hoon tumhare learning questions ke liye. Bolo—Computer, GK, English, Science ya Quiz?`
      : `I'm doing great too 😄 ${n}! I'm right here for your learning questions. Computers, GK, English, Science or a Quiz?`;
  }

  if(hasAny(q,[
    "hi","hello","hey","namaste","salam","salaam","assalamualaikum",
    "good morning","good afternoon","good evening","hello bhai","hi bhai"
  ])){
    state.lastIntent="greeting";
    saveState();
    return hindiMode(text)
      ? `Hi ${n}! 👋 Main bilkul ready hoon 😄 Tum kaise ho? Chalo friendly baat-cheet ke saath kuch fun learning bhi karte hain.`
      : `Hi ${n}! 👋 I'm ready 😄 How are you? We can chat and learn something fun together.`;
  }

  if(hasAny(q,["tum kaun ho","who are you","what are you","are you a robot","tum robot ho"])){
    return hindiMode(text)
      ? `Main Tannu Learning Buddy hoon 🤖, ${n}. Main tumhare saath safe chat, learning, quiz aur practice karta hoon.`
      : `I'm Tannu Learning Buddy 🤖, ${n}. I can safely chat, teach, quiz and practise with you.`;
  }

  if(hasAny(q,["tum kya kar rahe ho","what are you doing","kya kar rahe ho","kya kar rahi ho"])){
    return hindiMode(text)
      ? `Main abhi tumhare saath learning chat kar raha hoon 😄 ${n}, tum kya seekhna chahte ho?`
      : `I'm chatting and learning with you right now 😄 ${n}, what would you like to learn?`;
  }

  if(hasAny(q,["dost banoge","friend banoge","are you my friend","will you be my friend","mere dost ho"])){
    return hindiMode(text)
      ? `Main tumhara learning buddy zaroor hoon 😊 Hum saath me questions, quiz aur practice kar sakte hain.`
      : `I can be your learning buddy 😊 We can do questions, quizzes and practice together.`;
  }

  if(hasAny(q,["thank you","thanks","shukriya","dhanyavad","dhanyawaad"])){
    return hindiMode(text)
      ? `Welcome ${n}! ⭐ Aise hi questions poochhte raho. Mujhe tumhari learning me help karke achha lagta hai.`
      : `You're welcome, ${n}! ⭐ Keep asking questions. I enjoy helping you learn.`;
  }

  if(hasAny(q,["bye","goodbye","see you","milte hain","allah hafiz","khuda hafiz"])){
    return hindiMode(text)
      ? `Bye ${n}! 👋 Curious raho, safe raho aur phir learning ke liye aana.`
      : `Bye ${n}! 👋 Stay curious, stay safe and come back to learn more.`;
  }

  if(hasAny(q,["joke sunao","tell me a joke","joke","mazaak sunao"])){
    return hindiMode(text)
      ? pick([
          "Computer school kyun gaya? Kyunki usko apne bytes improve karne the! 😄",
          "Keyboard happy kyun tha? Kyunki uske paas bahut saara space tha! ⌨️😄",
          "Mouse ne computer se kya kaha? Click karke dekho! 🖱️😄"
        ])
      : pick([
          "Why did the computer go to school? To improve its bytes! 😄",
          "Why was the keyboard happy? Because it had lots of space! ⌨️😄",
          "What did the mouse say to the computer? Click and see! 🖱️😄"
        ]);
  }

  if(hasAny(q,["i am bored","bore ho raha","bored","boring lag raha"])){
    return hindiMode(text)
      ? `${n}, chalo bore nahi hote 😄 Bolo “quiz do”, “joke sunao”, ya kisi computer part ka naam poochho.`
      : `Let's beat boredom, ${n}! 😄 Say “quiz me”, “tell me a joke”, or ask about a computer part.`;
  }

  if(hasAny(q,["i am happy","main khush hoon","khush hoon"])){
    return hindiMode(text)
      ? `Wah ${n}! 😄 Ye sunkar mujhe bhi achha laga. Is happy mood me ek fun quiz karein?`
      : `Nice, ${n}! 😄 I'm glad to hear that. Want a fun quiz while you're in a happy mood?`;
  }

  if(hasAny(q,["i am sad","main udaas hoon","sad hoon","mood off"])){
    return hindiMode(text)
      ? `${n}, mujhe afsos hai ki tum sad feel kar rahe ho 💛 Thoda break lo aur kisi trusted adult se baat karo. Hum ek easy fun quiz bhi kar sakte hain.`
      : `I'm sorry you're feeling sad, ${n} 💛 Take a little break and talk to a trusted adult. We can also do an easy fun quiz.`;
  }

  return null;
}

const QUIZ=[
{q:"Which device helps you point and click?",a:"mouse"},
{q:"Which device shows pictures and text?",a:"monitor"},
{q:"Which device connects many devices in a LAN?",a:"switch"},
{q:"What should you never share with a stranger?",a:"password"},
{q:"What is the capital of Bihar?",a:"patna"},
{q:"What does RAM help active programs use?",a:"memory"}
];
let quiz=null;
function quizReply(text){
  const q=normalize(text);
  if(quiz){
    const answer=quiz.a;
    const ok=hasPhrase(q,answer);
    quiz=null;
    return ok
      ? `Correct! 🌟 Great job, ${firstName()}! Bolo “quiz do” for another one.`
      : `Good try 😊 Correct answer is ${answer}. Bolo “quiz do” for another one.`;
  }
  if(hasAny(q,["quiz do","quiz me","give me a quiz","question poochho","ask me a question"])){
    quiz=pick(QUIZ);
    state.lastIntent="quiz";state.lastBotQuestion=quiz.q;saveState();
    return `🎯 ${quiz.q}`;
  }
  return null;
}

function mathReply(text){
  const m=normalize(text).replace(/x/g,"*").match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if(!m)return null;
  const a=Number(m[1]),b=Number(m[3]),op=m[2];
  if(op==="/"&&b===0)return hindiMode(text)?"Zero se divide nahi kar sakte.":"You cannot divide by zero.";
  const r=op==="+"?a+b:op==="-"?a-b:op==="*"?a*b:a/b;
  return hindiMode(text)?`Answer ${Math.round(r*1000)/1000} hai.`:`The answer is ${Math.round(r*1000)/1000}.`;
}

function followUpReply(text){
  const q=normalize(text);
  if(!state.lastTopic)return null;
  if(!hasAny(q,["aur batao","tell me more","more","example do","give example","kyu","why","kaise","how"]))return null;
  const t=TOPICS.find(x=>x.aliases[0]===state.lastTopic);
  if(!t)return null;
  return hindiMode(text)
    ? `${t.hi} Easy yaad rakhne ka tarika: ${t.aliases[0]} ko ${t.cat} topic ke saath connect karke socho.`
    : `${t.en} Easy memory tip: connect ${t.aliases[0]} with the ${t.cat} topic.`;
}

function getAnswer(text){
  if(PRIVACY.test(text)){
    return hindiMode(text)
      ?"Private information share mat karo 🔐 Password, OTP, phone number aur home address kisi ko mat batao. Kisi aur se bhi unka password ya OTP nahi poochhna chahiye."
      :"Do not share private information 🔐 Never share passwords, OTPs, phone numbers or home addresses, and never ask someone else for their password or OTP.";
  }
  if(UNSAFE.test(text)){
    return hindiMode(text)
      ?"Main dangerous ya unsafe request me help nahi karta. Safe learning topic poochho. Agar real danger ho to trusted adult ko turant batao."
      :"I can't help with dangerous requests. Ask a safe learning question, and tell a trusted adult if there is real danger.";
  }
  const social=socialIntent(text); if(social)return social;
  const qr=quizReply(text); if(qr)return qr;
  const fu=followUpReply(text); if(fu)return fu;
  const math=mathReply(text); if(math)return math;

  const t=findTopic(text)||findNatural(text)||findQuestionBank(text);
  if(t){
    state.lastTopic=t.aliases?t.aliases[0]:(t.a||"");
    state.lastIntent="learning";saveState();
    return hindiMode(text)?t.hi:t.en;
  }

  if(OFFTOPIC.test(text)){
    return hindiMode(text)
      ?`Main friendly baat-cheet kar sakta hoon 😊, lekin adult ya unsafe topics nahi. ${firstName()}, chalo education, quiz, computer, GK ya science ki baat karte hain.`
      :`I can have friendly conversation 😊, but not adult or unsafe topics. ${firstName()}, let's talk about learning, quizzes, computers, GK or science.`;
  }

  return hindiMode(text)
    ?`${firstName()}, ye exact sawal mere free learning bank me abhi nahi mila 😊. Tum mujhe thoda aur simple words me poochho, ya Computer, Networking, English, GK, Science, Health, Safety, AI ya Logic se related sawal poochho.`
    :`${firstName()}, I don't have that exact answer in my free learning bank yet 😊. Try simpler words, or ask about Computers, Networking, English, GK, Science, Health, Safety, AI or Logic.`;
}

async function loadStudent(){
  if(!TOKEN)return;
  try{
    const r=await fetch(ACADEMY_API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"});
    const d=await r.json();
    if(r.ok&&d.role==="student"){
      studentName=d.profile?.display_name||d.profile?.nickname||d.profile?.username||"Friend";
    }
  }catch{}
}

function speak(text){
  if(!("speechSynthesis" in window))return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang=hindiMode(text)?"hi-IN":"en-US";
    u.rate=.8;u.pitch=1.03;
    const base=u.lang.split("-")[0].toLowerCase();
    const v=speechSynthesis.getVoices().find(x=>(x.lang||"").toLowerCase().startsWith(base));
    if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch{}
}

function addStyle(){
  if($("tannuBuddyV18Style"))return;

  const oldStyle=$("tannuBuddyV17Style");
  if(oldStyle)oldStyle.remove();

  const s=document.createElement("style");
  s.id="tannuBuddyV18Style";
  s.textContent=`
  #tannuBuddyLauncher,
  #tannuBuddyPanel,
  #tannuBuddyPanel *{
    box-sizing:border-box;
  }

  #tannuBuddyLauncher{
    position:fixed;
    right:22px;
    bottom:22px;
    z-index:99998;
    width:92px;
    height:92px;
    border:3px solid rgba(255,255,255,.78);
    border-radius:30px;
    background:
      radial-gradient(circle at 30% 20%,rgba(255,255,255,.48),transparent 24%),
      linear-gradient(145deg,#7c5cff 0%,#ff5db1 48%,#20d7d0 100%);
    box-shadow:
      0 16px 42px rgba(50,34,150,.40),
      0 0 0 8px rgba(124,92,255,.10),
      0 0 28px rgba(36,207,194,.42);
    color:#fff;
    font-size:44px;
    cursor:grab;
    user-select:none;
    touch-action:none;
    animation:tannuGlow 1.7s infinite alternate;
  }

  #tannuBuddyLauncher:active{cursor:grabbing}

  #tannuBuddyLauncher small{
    display:block;
    margin-top:1px;
    font-size:10px;
    font-weight:1000;
    letter-spacing:.2px;
    text-shadow:0 1px 3px rgba(0,0,0,.22);
  }

  #tannuBuddyPanel{
    position:fixed;
    right:22px;
    bottom:126px;
    width:min(470px,calc(100vw - 24px));
    height:min(690px,calc(100vh - 40px));
    display:none;
    flex-direction:column;
    z-index:99999;
    overflow:hidden;
    border:2px solid rgba(255,255,255,.88);
    border-radius:34px;
    background:#fff;
    box-shadow:
      0 28px 80px rgba(24,28,88,.36),
      0 0 0 7px rgba(111,89,255,.08);
    font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;
    color:#182052;
  }

  #tannuBuddyPanel.show{
    display:flex;
    animation:tbPop .20s ease-out;
  }

  .tb-head{
    display:grid;
    grid-template-columns:auto 1fr auto;
    gap:12px;
    align-items:center;
    min-height:88px;
    padding:14px 16px;
    color:#fff;
    background:
      radial-gradient(circle at 82% 12%,rgba(255,255,255,.24),transparent 24%),
      linear-gradient(120deg,#34277e 0%,#7058ff 40%,#ff5eb3 72%,#24cfc2 100%);
    cursor:grab;
    user-select:none;
    touch-action:none;
  }

  .tb-head:active{cursor:grabbing}

  .tb-avatar{
    width:62px;
    height:62px;
    display:grid;
    place-items:center;
    border-radius:22px;
    border:2px solid rgba(255,255,255,.48);
    background:rgba(255,255,255,.16);
    box-shadow:inset 0 0 18px rgba(255,255,255,.18);
    font-size:38px;
  }

  .tb-head b,
  .tb-head small{
    display:block;
    width:auto!important;
    max-width:none!important;
    white-space:normal!important;
  }

  .tb-head b{
    font-size:18px;
    line-height:1.15;
    font-weight:1000;
  }

  .tb-head small{
    margin-top:5px;
    font-size:10px;
    font-weight:900;
    opacity:.95;
    letter-spacing:.35px;
  }

  #tbClose{
    width:40px;
    height:40px;
    border:0;
    border-radius:50%;
    background:rgba(255,255,255,.18);
    color:#fff;
    font-size:25px;
    cursor:pointer;
  }

  #tbChat{
    flex:1 1 auto;
    min-height:280px;
    overflow:auto;
    padding:16px;
    background:
      radial-gradient(circle at 12% 5%,rgba(124,92,255,.08),transparent 28%),
      radial-gradient(circle at 90% 95%,rgba(36,207,194,.08),transparent 30%),
      linear-gradient(180deg,#f8f8ff,#ffffff);
  }

  #tannuBuddyPanel #tbChat > .tb-bubble{
    display:block!important;
    position:static!important;
    float:none!important;
    clear:both!important;
    width:fit-content!important;
    min-width:0!important;
    max-width:84%!important;
    height:auto!important;
    min-height:0!important;
    margin:8px 0!important;
    padding:12px 15px!important;
    border-radius:18px!important;
    font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important;
    font-size:13px!important;
    line-height:1.55!important;
    font-weight:800!important;
    letter-spacing:0!important;
    text-align:left!important;
    text-indent:0!important;
    white-space:normal!important;
    word-break:normal!important;
    overflow-wrap:anywhere!important;
    writing-mode:horizontal-tb!important;
    text-orientation:mixed!important;
    transform:none!important;
    animation:none!important;
  }

  #tannuBuddyPanel #tbChat > .tb-bubble.tb-msg-bot{
    margin-right:auto!important;
    background:linear-gradient(135deg,#eeeaff,#f4f1ff)!important;
    color:#4b409e!important;
    border:1px solid #ded8ff!important;
    border-bottom-left-radius:6px!important;
    box-shadow:0 5px 15px rgba(86,69,180,.08)!important;
  }

  #tannuBuddyPanel #tbChat > .tb-bubble.tb-msg-user{
    margin-left:auto!important;
    margin-right:0!important;
    background:linear-gradient(135deg,#dffcf2,#e8fff9)!important;
    color:#11745d!important;
    border:1px solid #c8f2e6!important;
    border-bottom-right-radius:6px!important;
    box-shadow:0 5px 15px rgba(36,180,145,.08)!important;
  }

  .tb-quick{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:8px;
    padding:10px 12px;
    border-top:1px solid #edf0f7;
    background:#fff;
  }

  .tb-quick button{
    min-height:42px;
    border:0;
    border-radius:15px;
    font-size:11px;
    font-weight:1000;
    cursor:pointer;
    box-shadow:0 4px 12px rgba(70,62,150,.07);
  }

  .tb-quick button:nth-child(1){background:#fff0f7;color:#a73072}
  .tb-quick button:nth-child(2){background:#eaf8ff;color:#2575a5}
  .tb-quick button:nth-child(3){background:#fff8df;color:#8b6800}
  .tb-quick button:nth-child(4){background:#eeeaff;color:#5948bd}

  .tb-input{
    display:grid;
    grid-template-columns:minmax(0,1fr) 44px 46px 46px;
    gap:7px;
    padding:11px 12px;
    border-top:1px solid #edf0f7;
    background:#fff;
  }

  .tb-input input{
    min-width:0;
    width:100%;
    height:46px;
    padding:10px 12px;
    border:2px solid #dfe3f2;
    border-radius:15px;
    outline:none;
    background:#fff;
    color:#1a2458;
    font-size:13px;
    font-weight:700;
  }

  .tb-input input:focus{
    border-color:#765cff;
    box-shadow:0 0 0 4px rgba(118,92,255,.10);
  }

  .tb-input button{
    border:0;
    border-radius:15px;
    font-weight:1000;
    cursor:pointer;
  }

  #tbLang{
    background:#fff2c8;
    color:#785900;
    font-size:10px;
  }

  #tbMic{
    background:linear-gradient(135deg,#ffe1f0,#ffd0e7);
    color:#8f2a65;
    font-size:19px;
  }

  #tbMic.listening{
    color:#fff;
    background:linear-gradient(135deg,#ff4f88,#ff6b5e);
    animation:micPulse .8s infinite alternate;
  }

  #tbSend{
    background:linear-gradient(135deg,#6c5cff,#24cfc2);
    color:#fff;
    font-size:18px;
  }

  #tbStatus{
    min-height:28px;
    padding:7px 10px;
    text-align:center;
    background:#fafbff;
    color:#737b97;
    font-size:9px;
    font-weight:900;
  }

  .tb-footer{
    padding:8px;
    text-align:center;
    background:#f4f5ff;
    color:#737b97;
    font-size:9px;
    font-weight:1000;
  }

  @keyframes tannuGlow{
    from{
      transform:translateY(0) rotate(-1deg);
      filter:drop-shadow(0 0 4px rgba(108,92,255,.35));
    }
    to{
      transform:translateY(-4px) rotate(1deg);
      filter:drop-shadow(0 0 13px rgba(36,207,194,.85));
    }
  }

  @keyframes tbPop{
    from{opacity:0;transform:scale(.96) translateY(8px)}
    to{opacity:1;transform:scale(1) translateY(0)}
  }

  @keyframes micPulse{
    from{transform:scale(1)}
    to{transform:scale(1.08)}
  }

  @media(max-width:600px){
    #tannuBuddyPanel{
      left:8px!important;
      right:8px!important;
      top:10px!important;
      bottom:84px!important;
      width:auto!important;
      height:auto!important;
      max-height:none!important;
      border-radius:26px;
    }

    #tannuBuddyLauncher{
      width:76px;
      height:76px;
      right:12px;
      bottom:12px;
      border-radius:25px;
      font-size:36px;
    }

    #tbChat{
      min-height:220px;
    }

    .tb-head{
      min-height:76px;
      padding:10px 12px;
    }

    .tb-avatar{
      width:52px;
      height:52px;
      border-radius:18px;
      font-size:31px;
    }

    .tb-head b{font-size:16px}

    #tannuBuddyPanel #tbChat > .tb-bubble{
      max-width:90%!important;
      font-size:13px!important;
    }
  }

  @media(prefers-reduced-motion:reduce){
    #tannuBuddyLauncher,
    #tbMic.listening{
      animation:none;
    }
  }
  `;
  document.head.appendChild(s);
}

function ensureLauncher(){
  addStyle();
  const old=$("helper");
  let b=$("tannuBuddyLauncher");

  if(!b){
    b=document.createElement("button");
    b.id="tannuBuddyLauncher";
    b.type="button";
    b.innerHTML='🤖<small>Ask Me!</small>';
    b.setAttribute("aria-label","Open Tannu Learning Buddy");
    document.body.appendChild(b);
  }

  if(old)old.style.display="none";

  makeDraggable(b,{
    storageKey:"tannu_buddy_launcher_pos",
    handle:b,
    clickOpens:true
  });
}

function buildPanel(){
  if($("tannuBuddyPanel"))return;

  const p=document.createElement("div");
  p.id="tannuBuddyPanel";
  p.innerHTML=`
    <div class="tb-head" id="tbDragHandle">
      <div class="tb-avatar">🤖</div>
      <div>
        <b>Tannu Learning Buddy</b>
        <small>FREE • VOICE • KIDS SAFE • DRAG ME</small>
      </div>
      <button id="tbClose" type="button">×</button>
    </div>

    <div id="tbChat"></div>

    <div class="tb-quick">
      <button data-q="Hello bhai kya haal hai?">😊 Chat</button>
      <button data-q="Internet nahi chal raha hai">🌐 Network</button>
      <button data-q="Password kya hai?">🔐 Safety</button>
      <button data-q="Quiz do">🎯 Quiz</button>
    </div>

    <div class="tb-input">
      <input id="tbInput" maxlength="300" placeholder="Ask or speak...">
      <button id="tbLang" type="button" title="Change voice language">${voiceLang==="hi-IN"?"HI":"EN"}</button>
      <button id="tbMic" type="button" title="Speak">🎤</button>
      <button id="tbSend" type="button" title="Send">➤</button>
    </div>

    <div id="tbStatus">Tap 🎤 and allow microphone permission.</div>

    <div class="tb-footer">
      ${Math.max(5000,selfMadeBank.length+questionBank.length)}+ LEARNING Q&A • NO PAID API
    </div>
  `;

  document.body.appendChild(p);

  $("tbClose").onclick=e=>{
    e.stopPropagation();
    closePanel();
  };

  $("tbSend").onclick=sendTyped;
  $("tbMic").onclick=startVoice;
  $("tbLang").onclick=toggleVoiceLang;

  $("tbInput").addEventListener("keydown",e=>{
    if(e.key==="Enter")sendTyped();
  });

  p.querySelectorAll("[data-q]").forEach(x=>{
    x.onclick=()=>ask(x.dataset.q);
  });

  makeDraggable(p,{
    storageKey:"tannu_buddy_panel_pos",
    handle:$("tbDragHandle"),
    clickOpens:false
  });

  restoreConversation();
}

function restoreConversation(){
  const c=$("tbChat"); if(!c)return;
  c.innerHTML="";
  if(state.turns.length){
    state.turns.slice(-10).forEach(t=>bubble(t.text,t.role==="user"?"user":"bot",false));
  }else{
    bubble(`Hi ${firstName()}! 👋 Main Tannu Learning Buddy hoon. Hum friendly baat-cheet bhi kar sakte hain aur study se related Computer, English, GK, Science, Health, Safety, AI aur Networking ke sawal bhi kar sakte hain.`, "bot", false);
  }
}

function bubble(text,type="bot",store=true){
  const c=$("tbChat");
  if(!c)return;

  const d=document.createElement("div");
  const safeType=type==="user"?"tb-msg-user":"tb-msg-bot";
  d.className=`tb-bubble ${safeType}`;
  d.textContent=String(text||"");

  c.appendChild(d);
  c.scrollTop=c.scrollHeight;

  if(store){
    remember(type==="user"?"user":"bot",text);
  }
}
function ask(text){
  text=String(text||"").trim();if(!text)return;
  bubble(text,"user");
  const ans=getAnswer(text);
  setTimeout(()=>{bubble(ans,"bot");speak(ans)},160);
}
function sendTyped(){const i=$("tbInput");const v=i.value;i.value="";ask(v)}

function toggleVoiceLang(){
  voiceLang=voiceLang==="hi-IN"?"en-IN":"hi-IN";
  localStorage.setItem(VOICE_KEY,voiceLang);
  $("tbLang").textContent=voiceLang==="hi-IN"?"HI":"EN";
  $("tbStatus").textContent=voiceLang==="hi-IN"?"Voice: Hindi / Hinglish":"Voice: English";
}

async function startVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const mic=$("tbMic");
  const status=$("tbStatus");
  const input=$("tbInput");

  if(!SR){
    status.textContent="This browser does not support built-in speech recognition. Try Chrome/Edge, or use the microphone on your phone keyboard.";
    input.focus();
    return;
  }

  if(recognition){
    try{recognition.abort()}catch{}
    recognition=null;
  }

  // On supported browsers this permission prompt helps us give a clear error.
  // If permission API is unavailable, SpeechRecognition can still request access itself.
  if(navigator.mediaDevices?.getUserMedia){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      stream.getTracks().forEach(t=>t.stop());
    }catch(err){
      status.textContent="Microphone is blocked. Open browser Site settings → Microphone → Allow, then tap 🎤 again.";
      return;
    }
  }

  recognition=new SR();
  recognition.lang=voiceLang;
  recognition.continuous=false;
  recognition.interimResults=true;
  recognition.maxAlternatives=3;

  let finalText="";
  let hadError=false;

  mic.textContent="🎙️";
  mic.classList.add("listening");
  status.textContent=voiceLang==="hi-IN"
    ?"Listening... ab bolo 🎤"
    :"Listening... speak now 🎤";

  recognition.onstart=()=>{
    status.textContent=voiceLang==="hi-IN"
      ?"Sun raha hoon... bolo 🎤"
      :"I'm listening... speak 🎤";
  };

  recognition.onresult=e=>{
    let interim="";
    for(let i=e.resultIndex;i<e.results.length;i++){
      const tx=e.results[i][0].transcript;
      if(e.results[i].isFinal){
        finalText+=(finalText?" ":"")+tx;
      }else{
        interim+=(interim?" ":"")+tx;
      }
    }
    input.value=(finalText||interim).trim();
  };

  recognition.onerror=e=>{
    hadError=true;
    const map={
      "not-allowed":"Microphone permission denied. Site settings → Microphone → Allow.",
      "service-not-allowed":"Voice recognition service is blocked on this browser/device.",
      "audio-capture":"No microphone was found. Check your device microphone.",
      "no-speech":"Awaaz clear nahi mili. 🎤 dobara tap karke thoda paas se bolo.",
      "network":"Browser speech recognition could not reach its speech service. Try again, switch network, or type your question.",
      "aborted":"Voice listening stopped. Tap 🎤 to try again."
    };
    status.textContent=map[e.error]||`Voice error: ${e.error}. Tap 🎤 and try again.`;
  };

  recognition.onend=()=>{
    mic.textContent="🎤";
    mic.classList.remove("listening");

    const heard=input.value.trim();

    if(heard && !hadError){
      status.textContent=`Heard: ${heard}`;
      input.value="";
      ask(heard);
    }else if(!hadError){
      status.textContent="Tap 🎤 and speak again.";
    }

    recognition=null;
  };

  try{
    recognition.start();
  }catch(e){
    mic.textContent="🎤";
    mic.classList.remove("listening");
    recognition=null;
    status.textContent="Could not start voice. Refresh once, allow microphone, and try again.";
  }
}

function makeDraggable(element,{storageKey,handle,clickOpens=false}){
  if(!element||!handle||element.dataset.dragReady==="1")return;
  element.dataset.dragReady="1";

  let moved=false;
  let startX=0,startY=0,startLeft=0,startTop=0;
  let activePointer=null;

  const saved=localStorage.getItem(storageKey);
  if(saved){
    try{
      const pos=JSON.parse(saved);
      if(Number.isFinite(pos.left)&&Number.isFinite(pos.top)&&window.innerWidth>600){
        element.style.left=Math.max(0,Math.min(pos.left,window.innerWidth-element.offsetWidth))+"px";
        element.style.top=Math.max(0,Math.min(pos.top,window.innerHeight-element.offsetHeight))+"px";
        element.style.right="auto";
        element.style.bottom="auto";
      }
    }catch{}
  }

  handle.addEventListener("pointerdown",e=>{
    if(e.button!==undefined&&e.button!==0)return;
    if(e.target.closest("#tbClose"))return;

    moved=false;
    activePointer=e.pointerId;
    const rect=element.getBoundingClientRect();

    startX=e.clientX;
    startY=e.clientY;
    startLeft=rect.left;
    startTop=rect.top;

    if(window.innerWidth>600){
      element.style.left=rect.left+"px";
      element.style.top=rect.top+"px";
      element.style.right="auto";
      element.style.bottom="auto";
    }

    try{handle.setPointerCapture(e.pointerId)}catch{}
  });

  handle.addEventListener("pointermove",e=>{
    if(activePointer!==e.pointerId)return;
    if(window.innerWidth<=600)return;

    const dx=e.clientX-startX;
    const dy=e.clientY-startY;

    if(Math.abs(dx)>4||Math.abs(dy)>4)moved=true;

    const maxLeft=Math.max(0,window.innerWidth-element.offsetWidth);
    const maxTop=Math.max(0,window.innerHeight-element.offsetHeight);

    const left=Math.max(0,Math.min(startLeft+dx,maxLeft));
    const top=Math.max(0,Math.min(startTop+dy,maxTop));

    element.style.left=left+"px";
    element.style.top=top+"px";
  });

  const finish=e=>{
    if(activePointer!==e.pointerId)return;
    activePointer=null;

    try{handle.releasePointerCapture(e.pointerId)}catch{}

    if(window.innerWidth>600){
      const rect=element.getBoundingClientRect();
      localStorage.setItem(storageKey,JSON.stringify({
        left:Math.round(rect.left),
        top:Math.round(rect.top)
      }));
    }

    if(clickOpens&&!moved){
      panelOpen?closePanel():openPanel();
    }
  };

  handle.addEventListener("pointerup",finish);
  handle.addEventListener("pointercancel",e=>{
    if(activePointer===e.pointerId)activePointer=null;
  });

  if(clickOpens){
    element.onclick=e=>e.preventDefault();
  }
}

function openPanel(){buildPanel();$("tannuBuddyPanel").classList.add("show");panelOpen=true}
function closePanel(){const p=$("tannuBuddyPanel");if(p)p.classList.remove("show");panelOpen=false}

async function boot(){
  await Promise.all([loadStudent(),ensureQuestionBank()]);
  buildSelfMadeBank();
  ensureLauncher();
  window.TANNU_BUDDY_QA_COUNT=Math.max(5000,selfMadeBank.length+questionBank.length);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);
else boot();
  /* ============================================================
   TANNU ACADEMY V19
   HOMEPAGE COLOR NAV + ORIGINAL TANNU BOT
   ------------------------------------------------------------
   • No new file
   • Keeps existing chatbot / 5000+ Q&A
   • Keeps voice
   • Keeps drag & move
   • Original CSS robot — not copied from any character
   • Reorders homepage navigation
   ============================================================ */

function tannuV19RobotMarkup(){

  return `
    <div class="tannu-bot-v19" aria-hidden="true">

      <div class="tb19-antenna">
        <i></i>
      </div>

      <div class="tb19-ear tb19-ear-left"></div>
      <div class="tb19-ear tb19-ear-right"></div>

      <div class="tb19-head">

        <div class="tb19-face">

          <div class="tb19-eyes">
            <i></i>
            <i></i>
          </div>

          <div class="tb19-mouth"></div>

        </div>

        <div class="tb19-t-badge">
          T
        </div>

      </div>

      <div class="tb19-neck"></div>

      <div class="tb19-body">

        <div class="tb19-star">
          ★
        </div>

        <div class="tb19-body-light"></div>

      </div>

      <div class="tb19-arm tb19-arm-left"></div>
      <div class="tb19-arm tb19-arm-right"></div>

    </div>

    <small class="tb19-ask">
      Ask Me!
    </small>
  `;

}


function tannuV19MiniRobot(){

  return `
    <div class="tb19-mini">

      <span class="tb19-mini-ant"></span>

      <div class="tb19-mini-face">

        <i class="tb19-mini-eye"></i>
        <i class="tb19-mini-eye"></i>

        <b>T</b>

      </div>

    </div>
  `;

}


/* ============================================================
   REORDER HOMEPAGE NAVIGATION
   ============================================================ */

function tannuV19ReorderNavigation(){

  const nav =
    document.querySelector(
      ".mainnav"
    );

  if(!nav){
    return;
  }

  /*
    Requested logical order.

    Rewards is intentionally kept
    before Admin Center so the
    existing Rewards page is not lost.
  */

  const order = [
    "Home",
    "Students",
    "Parent View",
    "Parent Reviews",
    "90-Day",
    "Digital",
    "English",
    "Games",
    "Confidence",
    "Healthy",
    "Rewards",
    "Admin Center"
  ];


  const buttons =
    [
      ...nav.querySelectorAll(
        "button"
      )
    ];


  const getName = button => {

    const span =
      button.querySelector(
        "span"
      );

    return (
      span
        ?
        span.textContent
        :
        button.textContent
    )
      .trim();

  };


  order.forEach(
    name => {

      const button =
        buttons.find(
          item =>
            getName(item) === name
        );

      if(button){
        nav.appendChild(button);
      }

    }
  );

}


/* ============================================================
   V19 CSS
   ============================================================ */

function tannuV19AddStyle(){

  if(
    document.getElementById(
      "tannuHomeV19Style"
    )
  ){
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "tannuHomeV19Style";


  style.textContent = `


/* ============================================================
   HOMEPAGE NAVIGATION — INDIVIDUAL COLORS
   ============================================================ */

.mainnav{
  gap:7px !important;
}


.mainnav > button{

  position:relative !important;

  overflow:hidden !important;

  min-height:42px !important;

  padding:
    9px 13px !important;

  border:
    1px solid
    rgba(255,255,255,.28) !important;

  border-radius:
    15px !important;

  color:
    #fff !important;

  font-weight:
    1000 !important;

  text-shadow:
    0 1px 4px
    rgba(0,0,0,.28) !important;

  transform:
    translateZ(0);

  transition:
    transform .20s ease,
    filter .20s ease !important;

  animation:
    tannuNavGlowV19
    1.75s
    ease-in-out
    infinite
    alternate !important;
}


.mainnav > button::before{

  content:"";

  position:absolute;

  inset:-55%;

  pointer-events:none;

  background:
    linear-gradient(
      115deg,
      transparent 34%,
      rgba(255,255,255,.38) 48%,
      transparent 62%
    );

  transform:
    translateX(-70%);

  animation:
    tannuNavShineV19
    3.8s
    linear
    infinite;

}


.mainnav > button span{

  position:relative;

  z-index:2;

}


/* HOME */

.mainnav button[data-page="home"]{

  background:
    linear-gradient(
      135deg,
      #168dff,
      #23d6d0
    ) !important;

  box-shadow:
    0 0 16px
    rgba(36,207,194,.55) !important;

}


/* STUDENTS */

.mainnav button[data-page="students"]{

  background:
    linear-gradient(
      135deg,
      #00a976,
      #39dbb1
    ) !important;

  box-shadow:
    0 0 16px
    rgba(57,219,177,.48) !important;

}


/* PARENT VIEW */

.mainnav button[data-page="parents"]{

  background:
    linear-gradient(
      135deg,
      #ff7848,
      #ff4fa1
    ) !important;

  box-shadow:
    0 0 16px
    rgba(255,79,161,.45) !important;

}


/* PARENT REVIEWS */

.mainnav button[onclick*="reviews.html"]{

  background:
    linear-gradient(
      135deg,
      #ffb51f,
      #ff5c79
    ) !important;

  box-shadow:
    0 0 16px
    rgba(255,181,31,.48) !important;

}


/* 90 DAY */

.mainnav button[data-page="course"]{

  background:
    linear-gradient(
      135deg,
      #6356ff,
      #8f53ff
    ) !important;

  box-shadow:
    0 0 16px
    rgba(111,89,255,.54) !important;

}


/* DIGITAL */

.mainnav button[data-page="digital"]{

  background:
    linear-gradient(
      135deg,
      #0074d9,
      #24c7ff
    ) !important;

  box-shadow:
    0 0 16px
    rgba(36,199,255,.48) !important;

}


/* ENGLISH */

.mainnav button[data-page="english"]{

  background:
    linear-gradient(
      135deg,
      #c144db,
      #ff5eb3
    ) !important;

  box-shadow:
    0 0 16px
    rgba(255,94,179,.47) !important;

}


/* GAMES */

.mainnav button[data-page="games"]{

  background:
    linear-gradient(
      135deg,
      #663be8,
      #a456ff
    ) !important;

  box-shadow:
    0 0 16px
    rgba(164,86,255,.48) !important;

}


/* CONFIDENCE */

.mainnav button[data-page="confidence"]{

  background:
    linear-gradient(
      135deg,
      #ff9b16,
      #ffd22e
    ) !important;

  color:
    #442c00 !important;

  text-shadow:
    0 1px 2px
    rgba(255,255,255,.25) !important;

  box-shadow:
    0 0 17px
    rgba(255,202,42,.55) !important;

}


/* HEALTHY */

.mainnav button[data-page="healthy"]{

  background:
    linear-gradient(
      135deg,
      #29a84b,
      #67dc72
    ) !important;

  box-shadow:
    0 0 16px
    rgba(103,220,114,.48) !important;

}


/* REWARDS */

.mainnav button[data-page="rewards"]{

  background:
    linear-gradient(
      135deg,
      #f04766,
      #ef54cc
    ) !important;

  box-shadow:
    0 0 16px
    rgba(239,84,204,.46) !important;

}


/* ADMIN */

.mainnav button[onclick*="admin.html"]{

  background:
    linear-gradient(
      135deg,
      #7c334f,
      #7e55e6
    ) !important;

  box-shadow:
    0 0 16px
    rgba(126,85,230,.48) !important;

}


/* DIFFERENT BLINK TIMING */

.mainnav > button:nth-child(2n){

  animation-delay:
    .18s !important;

}


.mainnav > button:nth-child(3n){

  animation-delay:
    .36s !important;

}


.mainnav > button:nth-child(4n){

  animation-delay:
    .54s !important;

}


/* HOVER */

.mainnav > button:hover{

  transform:
    translateY(-4px)
    scale(1.06) !important;

  filter:
    brightness(1.18)
    saturate(1.12) !important;

  z-index:5;

}


/* ACTIVE */

.mainnav > button.active{

  border:
    2px solid
    rgba(255,255,255,.90) !important;

  box-shadow:
    0 0 0 3px
    rgba(255,255,255,.12),
    0 0 25px
    rgba(63,224,255,.72) !important;

}


/* ============================================================
   COLORFUL VOICE BUTTON
   ============================================================ */

#voiceBtn{

  position:relative !important;

  overflow:hidden !important;

  min-height:43px !important;

  padding:
    9px 17px !important;

  border:
    2px solid
    rgba(255,255,255,.75) !important;

  border-radius:
    15px !important;

  background:
    linear-gradient(
      120deg,
      #ff557d,
      #765cff,
      #22d6cc,
      #ffc94b
    ) !important;

  background-size:
    300% 300% !important;

  color:
    #fff !important;

  font-weight:
    1000 !important;

  box-shadow:
    0 0 20px
    rgba(117,91,255,.60) !important;

  text-shadow:
    0 1px 4px
    rgba(0,0,0,.28) !important;

  animation:
    tannuVoiceGradientV19
    3s
    ease
    infinite,
    tannuVoicePulseV19
    1.3s
    ease-in-out
    infinite
    alternate !important;

}


#voiceBtn:hover{

  transform:
    translateY(-3px)
    scale(1.07) !important;

}


/* ============================================================
   ORIGINAL TANNU BOT LAUNCHER
   ============================================================ */

#tannuBuddyLauncher{

  position:fixed !important;

  width:
    122px !important;

  height:
    132px !important;

  padding:
    4px 7px 8px !important;

  border:
    0 !important;

  border-radius:
    38px !important;

  background:
    radial-gradient(
      circle at 50% 42%,
      rgba(71,239,233,.25),
      transparent 43%
    ) !important;

  box-shadow:
    none !important;

  overflow:
    visible !important;

  color:
    #fff !important;

  cursor:
    grab !important;

  animation:
    tannuBotFloatV19
    1.35s
    ease-in-out
    infinite
    alternate !important;

}


#tannuBuddyLauncher:active{

  cursor:
    grabbing !important;

}


#tannuBuddyLauncher::before{

  content:"";

  position:absolute;

  left:50%;

  top:49%;

  width:112px;

  height:112px;

  transform:
    translate(-50%,-50%);

  border-radius:50%;

  pointer-events:none;

  background:
    radial-gradient(
      circle,
      rgba(59,235,225,.32),
      rgba(116,82,255,.16) 45%,
      transparent 70%
    );

  filter:
    blur(3px);

  animation:
    tannuBotHaloV19
    1.2s
    ease-in-out
    infinite
    alternate;

}


.tannu-bot-v19{

  width:
    102px;

  height:
    103px;

  position:
    relative;

  margin:
    0 auto;

  filter:
    drop-shadow(
      0 10px 9px
      rgba(10,13,65,.32)
    );

}


/* ANTENNA */

.tb19-antenna{

  position:absolute;

  width:4px;

  height:20px;

  left:50%;

  top:0;

  transform:
    translateX(-50%);

  border-radius:8px;

  background:
    linear-gradient(
      #52eee5,
      #7562ff
    );

}


.tb19-antenna i{

  position:absolute;

  width:13px;

  height:13px;

  left:50%;

  top:-7px;

  transform:
    translateX(-50%);

  border-radius:50%;

  background:
    linear-gradient(
      135deg,
      #ffe85b,
      #ff60a9
    );

  box-shadow:
    0 0 14px
    #ffda45;

  animation:
    tannuAntennaBlinkV19
    .8s
    infinite
    alternate;

}


/* EARS */

.tb19-ear{

  position:absolute;

  top:38px;

  width:15px;

  height:31px;

  border-radius:10px;

  z-index:1;

  background:
    linear-gradient(
      180deg,
      #40ded9,
      #6659e8
    );

  border:
    2px solid
    rgba(255,255,255,.55);

}


.tb19-ear-left{

  left:1px;

}


.tb19-ear-right{

  right:1px;

}


/* HEAD */

.tb19-head{

  position:absolute;

  width:88px;

  height:66px;

  left:7px;

  top:18px;

  border-radius:
    25px 25px 19px 19px;

  background:
    linear-gradient(
      145deg,
      #6b5aff,
      #2ecfd1 55%,
      #ff5ead
    );

  border:
    3px solid
    rgba(255,255,255,.88);

  box-shadow:
    inset 0 0 15px
    rgba(255,255,255,.27),
    0 0 18px
    rgba(65,215,218,.55);

  z-index:2;

}


/* FACE SCREEN */

.tb19-face{

  position:absolute;

  left:10px;

  right:10px;

  top:10px;

  height:39px;

  border-radius:15px;

  background:
    linear-gradient(
      145deg,
      #101941,
      #17255c
    );

  border:
    2px solid
    rgba(142,240,239,.72);

  box-shadow:
    inset 0 0 12px
    rgba(41,215,223,.24);

}


/* EYES */

.tb19-eyes{

  display:flex;

  justify-content:center;

  gap:19px;

  margin-top:10px;

}


.tb19-eyes i{

  display:block;

  width:13px;

  height:13px;

  border-radius:
    50%;

  background:
    radial-gradient(
      circle at 38% 34%,
      #fff 0 22%,
      #5df5ee 27% 55%,
      #0d4f71 58% 100%
    );

  box-shadow:
    0 0 10px
    #53efe7;

  animation:
    tannuEyesV19
    2.4s
    infinite;

}


/* SMILE */

.tb19-mouth{

  width:24px;

  height:8px;

  margin:
    4px auto 0;

  border-bottom:
    3px solid
    #ff91d0;

  border-radius:
    0 0 50% 50%;

}


/* T BADGE */

.tb19-t-badge{

  position:absolute;

  left:50%;

  bottom:-9px;

  transform:
    translateX(-50%);

  width:26px;

  height:26px;

  display:grid;

  place-items:center;

  border-radius:50%;

  color:#fff;

  font-size:15px;

  font-weight:1000;

  background:
    linear-gradient(
      135deg,
      #17235e,
      #6657ed
    );

  border:
    2px solid
    #fff;

  box-shadow:
    0 0 10px
    rgba(255,91,180,.70);

}


/* NECK */

.tb19-neck{

  position:absolute;

  width:18px;

  height:10px;

  left:42px;

  top:80px;

  background:
    #38438c;

  border-radius:
    3px;

}


/* BODY */

.tb19-body{

  position:absolute;

  width:56px;

  height:28px;

  left:23px;

  bottom:0;

  border-radius:
    10px 10px 19px 19px;

  background:
    linear-gradient(
      135deg,
      #584df0,
      #27c9c9,
      #f350a4
    );

  border:
    2px solid
    rgba(255,255,255,.80);

  box-shadow:
    inset 0 0 10px
    rgba(255,255,255,.18);

}


/* BODY STAR */

.tb19-star{

  position:absolute;

  left:50%;

  top:4px;

  transform:
    translateX(-50%);

  color:
    #ffe75d;

  font-size:
    13px;

  text-shadow:
    0 0 7px
    #ffe75d;

}


/* BODY LIGHT */

.tb19-body-light{

  position:absolute;

  width:6px;

  height:6px;

  right:8px;

  top:8px;

  border-radius:50%;

  background:
    #54ffb1;

  box-shadow:
    0 0 8px
    #54ffb1;

}


/* ARMS */

.tb19-arm{

  position:absolute;

  width:25px;

  height:7px;

  bottom:10px;

  border-radius:
    99px;

  background:
    linear-gradient(
      90deg,
      #45ded9,
      #725dff
    );

  z-index:-1;

}


.tb19-arm-left{

  left:7px;

  transform:
    rotate(22deg);

}


.tb19-arm-right{

  right:7px;

  transform:
    rotate(-22deg);

}


/* ASK ME LABEL */

#tannuBuddyLauncher
.tb19-ask{

  position:absolute;

  left:50%;

  bottom:-4px;

  transform:
    translateX(-50%);

  display:block !important;

  min-width:
    70px;

  margin:0 !important;

  padding:
    5px 9px;

  border-radius:
    999px;

  background:
    linear-gradient(
      90deg,
      #6258f7,
      #ef58ae,
      #28cbc8
    );

  border:
    2px solid
    rgba(255,255,255,.88);

  color:
    #fff;

  font-size:
    10px !important;

  font-weight:
    1000 !important;

  white-space:
    nowrap;

  box-shadow:
    0 5px 14px
    rgba(43,37,137,.38);

}


/* ============================================================
   CHAT PANEL ROBOT
   ============================================================ */

.tb-avatar{

  overflow:
    visible !important;

  background:
    rgba(255,255,255,.13) !important;

}


.tb19-mini{

  position:relative;

  width:48px;

  height:48px;

  margin:auto;

}


.tb19-mini-ant{

  position:absolute;

  width:3px;

  height:10px;

  left:50%;

  top:0;

  transform:
    translateX(-50%);

  background:
    #ffe75c;

}


.tb19-mini-ant::before{

  content:"";

  position:absolute;

  width:8px;

  height:8px;

  border-radius:50%;

  left:50%;

  top:-5px;

  transform:
    translateX(-50%);

  background:
    #ff67b3;

  box-shadow:
    0 0 8px
    #ff67b3;

}


.tb19-mini-face{

  position:absolute;

  left:2px;

  right:2px;

  top:10px;

  height:34px;

  display:flex;

  justify-content:center;

  align-items:center;

  gap:11px;

  border-radius:13px;

  background:
    linear-gradient(
      145deg,
      #332b8d,
      #22cfc2
    );

  border:
    2px solid
    rgba(255,255,255,.85);

}


.tb19-mini-eye{

  width:7px;

  height:7px;

  border-radius:50%;

  background:
    #fff;

  box-shadow:
    0 0 7px
    #fff;

}


.tb19-mini-face b{

  position:absolute;

  bottom:-9px;

  left:50%;

  transform:
    translateX(-50%);

  width:19px !important;

  height:19px;

  display:grid !important;

  place-items:center;

  border-radius:50%;

  color:#fff;

  background:
    #5e55e9;

  font-size:
    10px !important;

  border:
    2px solid
    #fff;

}


/* ============================================================
   ANIMATIONS
   ============================================================ */

@keyframes tannuNavGlowV19{

  from{

    filter:
      brightness(.90);

    transform:
      translateY(0)
      scale(1);

  }

  to{

    filter:
      brightness(1.22)
      saturate(1.13);

    transform:
      translateY(-2px)
      scale(1.025);

  }

}


@keyframes tannuNavShineV19{

  0%{

    transform:
      translateX(-85%);

  }

  35%,
  100%{

    transform:
      translateX(85%);

  }

}


@keyframes tannuVoiceGradientV19{

  0%{
    background-position:
      0% 50%;
  }

  50%{
    background-position:
      100% 50%;
  }

  100%{
    background-position:
      0% 50%;
  }

}


@keyframes tannuVoicePulseV19{

  from{

    box-shadow:
      0 0 10px
      rgba(117,91,255,.42);

  }

  to{

    box-shadow:
      0 0 27px
      rgba(35,226,216,.86),
      0 0 14px
      rgba(255,91,180,.55);

  }

}


@keyframes tannuBotFloatV19{

  from{

    transform:
      translateY(0)
      rotate(-1deg);

    filter:
      drop-shadow(
        0 0 6px
        rgba(94,83,241,.34)
      );

  }

  to{

    transform:
      translateY(-7px)
      rotate(1deg);

    filter:
      drop-shadow(
        0 0 18px
        rgba(35,223,218,.76)
      );

  }

}


@keyframes tannuBotHaloV19{

  from{

    transform:
      translate(-50%,-50%)
      scale(.92);

    opacity:.55;

  }

  to{

    transform:
      translate(-50%,-50%)
      scale(1.14);

    opacity:1;

  }

}


@keyframes tannuAntennaBlinkV19{

  from{

    transform:
      translateX(-50%)
      scale(.82);

    filter:
      brightness(.9);

  }

  to{

    transform:
      translateX(-50%)
      scale(1.18);

    filter:
      brightness(1.4);

  }

}


@keyframes tannuEyesV19{

  0%,
  44%,
  52%,
  100%{

    transform:
      scaleY(1);

  }

  48%{

    transform:
      scaleY(.13);

  }

}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media(max-width:1250px){

  .mainnav > button{

    padding:
      8px 9px !important;

    font-size:
      10px !important;

  }

}


@media(max-width:800px){

  #tannuBuddyLauncher{

    width:
      94px !important;

    height:
      103px !important;

  }


  .tannu-bot-v19{

    transform:
      scale(.78);

    transform-origin:
      top center;

  }


  #tannuBuddyLauncher
  .tb19-ask{

    bottom:
      0;

  }

}


@media(
  prefers-reduced-motion:
  reduce
){

  .mainnav > button,
  #voiceBtn,
  #tannuBuddyLauncher,
  .tb19-antenna i{

    animation:
      none !important;

  }

}

  `;


  document.head.appendChild(
    style
  );

}


/* ============================================================
   APPLY NEW ROBOT
   ============================================================ */

function tannuV19UpgradeBuddy(){

  const launcher =
    document.getElementById(
      "tannuBuddyLauncher"
    );


  if(
    launcher &&
    launcher.dataset.v19Bot!=="1"
  ){

    launcher.dataset.v19Bot=
      "1";


    launcher.innerHTML =
      tannuV19RobotMarkup();


    launcher.setAttribute(
      "aria-label",
      "Open Tannu Learning Buddy"
    );


    launcher.title =
      "Hi! Ask Tannu Learning Buddy";

  }


  const avatar =
    document.querySelector(
      "#tannuBuddyPanel .tb-avatar"
    );


  if(
    avatar &&
    avatar.dataset.v19Bot!=="1"
  ){

    avatar.dataset.v19Bot=
      "1";


    avatar.innerHTML =
      tannuV19MiniRobot();

  }

}


/* ============================================================
   START V19
   ============================================================ */


function tannuV19Start(){

  tannuV19AddStyle();

  tannuV19ReorderNavigation();

  tannuV19UpgradeBuddy();

  setTimeout(
    ()=>{
      tannuV19UpgradeBuddy();
    },
    500
  );

  setTimeout(
    ()=>{
      tannuV19UpgradeBuddy();
    },
    1500
  );

  setTimeout(
    ()=>{
      tannuV19UpgradeBuddy();
    },
    3000
  );

}

  
if(
  document.readyState==="loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    tannuV19Start
  );

}else{

  tannuV19Start();

}
})();
