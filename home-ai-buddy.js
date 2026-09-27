(() => {
"use strict";

/*
  Tannu AI Buddy - FREE LOCAL MODE
  --------------------------------
  No OpenAI API
  No paid credits
  No external AI request

  Features:
  - Built-in learning knowledge bank
  - English / Hindi / Hinglish style replies
  - Voice input
  - Voice output
  - Computer
  - Networking
  - IT troubleshooting
  - English
  - GK
  - Science
  - Health
  - Hygiene
  - Cyber safety
*/

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const token =
  localStorage.getItem("brightbyte_student_token") || "";

const $ = id => document.getElementById(id);

let studentName = "Friend";
let panelOpen = false;


/* =========================
   KNOWLEDGE BANK
========================= */

const KNOWLEDGE = [

  {
    keys:["ram","what is ram","ram kya","ram kya hai"],
    en:"RAM is the computer's short-term memory. It helps the computer open and run programs quickly. More RAM can help the computer work smoothly.",
    hi:"RAM computer ki temporary memory hoti hai. Ye programs ko jaldi open aur run karne me help karti hai."
  },

  {
    keys:["mouse","computer mouse","mouse kya","mouse kya karta"],
    en:"A mouse helps us point, click, select and move things on the computer screen.",
    hi:"Computer mouse se hum screen par point, click, select aur cheezon ko move karte hain."
  },

  {
    keys:["keyboard","keyboard kya","keyboard use"],
    en:"A keyboard is used to type letters, numbers and commands into a computer.",
    hi:"Keyboard ka use computer me letters, numbers aur commands type karne ke liye hota hai."
  },

  {
    keys:["monitor","monitor kya","monitor kya karta","screen"],
    en:"A monitor shows pictures, text, videos and everything the computer is doing.",
    hi:"Monitor computer ka display hota hai. Is par text, pictures, videos aur computer ka kaam dikhai deta hai."
  },

  {
    keys:["cpu","system unit","cpu kya"],
    en:"The system unit contains important computer parts such as the processor, RAM and storage.",
    hi:"System unit ke andar processor, RAM, storage aur doosre important computer parts hote hain."
  },

  {
    keys:["processor","cpu processor","processor kya"],
    en:"The processor is like the brain of the computer. It follows instructions and performs calculations.",
    hi:"Processor computer ke brain ki tarah kaam karta hai. Ye instructions follow karta hai aur calculations karta hai."
  },

  {
    keys:["ssd","ssd kya","hard disk","hdd"],
    en:"SSD and hard disk store files, photos, programs and the operating system. SSD is usually faster than a traditional hard disk.",
    hi:"SSD aur hard disk files, photos aur programs store karte hain. SSD generally normal hard disk se fast hota hai."
  },

  {
    keys:["printer","printer kya","printing"],
    en:"A printer makes a paper copy of information from a computer.",
    hi:"Printer computer ki information ko paper par print karta hai."
  },

  {
    keys:["scanner","scanner kya"],
    en:"A scanner changes a paper document or photo into a digital copy on the computer.",
    hi:"Scanner paper document ya photo ko computer me digital copy banata hai."
  },

  {
    keys:["speaker","computer speaker"],
    en:"Speakers play sound from a computer, such as music, voice and videos.",
    hi:"Computer speaker se music, voice aur video ka sound sunai deta hai."
  },

  {
    keys:["microphone","mic","microphone kya"],
    en:"A microphone sends your voice or other sounds into the computer.",
    hi:"Microphone aapki voice ya sound ko computer me input karta hai."
  },

  {
    keys:["webcam","camera computer"],
    en:"A webcam is a small camera used for video calls, online classes and recording video.",
    hi:"Webcam computer ka camera hota hai. Iska use video call, online class aur video recording me hota hai."
  },

  {
    keys:["usb","usb port","usb kya"],
    en:"USB is used to connect devices such as keyboards, mice, printers and flash drives to a computer.",
    hi:"USB port se keyboard, mouse, printer aur pen drive jaise devices connect hote hain."
  },

  {
    keys:["hdmi","hdmi cable"],
    en:"HDMI carries digital video and sound between devices such as a computer and monitor or TV.",
    hi:"HDMI cable computer se monitor ya TV tak video aur sound bhej sakti hai."
  },

  {
    keys:["vga","vga cable"],
    en:"VGA is an older type of display connection used to send video from a computer to a monitor.",
    hi:"VGA ek purana display connection hai jo computer se monitor tak video signal bhejta hai."
  },

  {
    keys:["lan","lan cable","ethernet","network cable"],
    en:"A LAN cable connects devices to a local network. It can connect a computer to a switch or router.",
    hi:"LAN cable computer ko local network se connect karti hai. Isse PC switch ya router se connect ho sakta hai."
  },

  {
    keys:["router","router kya"],
    en:"A router connects networks and helps devices reach the internet.",
    hi:"Router networks ko connect karta hai aur devices ko internet tak pahunchne me help karta hai."
  },

  {
    keys:["switch","network switch","switch kya"],
    en:"A network switch connects many devices inside the same local network.",
    hi:"Network switch ek local network ke andar bahut saare devices ko aapas me connect karta hai."
  },

  {
    keys:["internet","internet kya"],
    en:"The internet is a worldwide network that connects computers and devices so they can share information.",
    hi:"Internet duniya bhar ke computers aur devices ko connect karta hai taaki information share ki ja sake."
  },

  {
    keys:["wifi","wi-fi","wifi kya"],
    en:"Wi-Fi lets devices connect to a network without using a network cable.",
    hi:"Wi-Fi devices ko bina LAN cable ke wireless network se connect karta hai."
  },

  {
    keys:["ip address","ip kya","ip address kya"],
    en:"An IP address is a number used to identify a device on a network.",
    hi:"IP address network me kisi device ki pehchan ke liye use hone wala address hota hai."
  },

  {
    keys:["dhcp","dhcp kya"],
    en:"DHCP automatically gives network settings such as an IP address to devices.",
    hi:"DHCP automatically devices ko IP address aur network settings deta hai."
  },

  {
    keys:["dns","dns kya"],
    en:"DNS changes website names into IP addresses that computers can use.",
    hi:"DNS website ke naam ko IP address me convert karne me help karta hai."
  },

  {
    keys:["gateway","default gateway"],
    en:"A default gateway is usually the router that helps a device communicate outside its local network.",
    hi:"Default gateway usually router hota hai jo device ko local network ke bahar communicate karne me help karta hai."
  },

  {
    keys:["ping","ping command"],
    en:"Ping is a simple network test used to check whether another device can be reached.",
    hi:"Ping ek network test hai jisse check karte hain ki doosra device reachable hai ya nahi."
  },

  {
    keys:["no internet","internet not working","internet nahi","network not working"],
    en:"First check the LAN cable or Wi-Fi connection. Then check whether other devices have internet. If needed, ask your teacher or IT technician for help.",
    hi:"Sabse pehle LAN cable ya Wi-Fi connection check karo. Phir dekho doosre devices me internet chal raha hai ya nahi."
  },

  {
    keys:["no display","monitor no signal","no signal"],
    en:"Check that the monitor has power. Then check the display cable between the monitor and computer.",
    hi:"Pehle monitor ka power check karo. Phir monitor aur computer ke beech display cable check karo."
  },

  {
    keys:["keyboard not working","keyboard nahi chal"],
    en:"Check whether the keyboard USB cable is connected properly. You can also try another USB port.",
    hi:"Keyboard ka USB cable properly connected hai ya nahi check karo. Zarurat ho to doosra USB port try karo."
  },

  {
    keys:["mouse not working","mouse nahi chal"],
    en:"Check the mouse connection first. If it is USB, try another USB port.",
    hi:"Sabse pehle mouse connection check karo. USB mouse hai to doosra USB port bhi try kar sakte ho."
  },

  {
    keys:["printer not printing","printer nahi print","printing problem"],
    en:"Check printer power, paper and cable or network connection. Then check whether the correct printer is selected.",
    hi:"Printer ka power, paper aur cable ya network connection check karo. Phir correct printer selected hai ya nahi dekho."
  },

  {
    keys:["password","strong password"],
    en:"A strong password should be hard to guess. Never share your password with strangers.",
    hi:"Strong password guess karna mushkil hona chahiye. Password kisi stranger ke saath share mat karo."
  },

  {
    keys:["otp","what is otp"],
    en:"OTP means One-Time Password. It is private and should never be shared with strangers.",
    hi:"OTP ka matlab One-Time Password hota hai. OTP private hota hai aur kisi stranger ko kabhi share nahi karna chahiye."
  },

  {
    keys:["cyber safety","internet safety","online safety"],
    en:"Stay safe online by keeping passwords private, avoiding unknown links and asking a trusted adult when something feels strange.",
    hi:"Online safe rehne ke liye password private rakho, unknown links par click mat karo aur doubt ho to trusted adult se poochho."
  },

  {
    keys:["phishing","fake link"],
    en:"Phishing is when someone tries to trick you into sharing private information. Do not click suspicious links.",
    hi:"Phishing me koi aapko trick karke private information lene ki koshish karta hai. Suspicious links par click mat karo."
  },

  {
    keys:["ai","artificial intelligence","ai kya"],
    en:"AI means Artificial Intelligence. It helps computers perform tasks such as understanding words, finding patterns and creating content.",
    hi:"AI ka matlab Artificial Intelligence hai. Ye computers ko words samajhne, patterns pehchanne aur content banane jaise kaam me help karta hai."
  },

  {
    keys:["prompt","prompt kya"],
    en:"A prompt is an instruction or question that you give to an AI.",
    hi:"Prompt ek instruction ya question hota hai jo hum AI ko dete hain."
  },

  {
    keys:["computer","computer kya"],
    en:"A computer is an electronic machine that accepts information, processes it and gives useful output.",
    hi:"Computer ek electronic machine hai jo information leta hai, process karta hai aur useful output deta hai."
  },

  {
    keys:["hardware","hardware kya"],
    en:"Hardware means the physical parts of a computer that you can see or touch.",
    hi:"Hardware computer ke physical parts hote hain jinhe hum dekh ya touch kar sakte hain."
  },

  {
    keys:["software","software kya"],
    en:"Software is a set of programs and instructions that tell a computer what to do.",
    hi:"Software programs aur instructions ka set hota hai jo computer ko batata hai ki kya kaam karna hai."
  },

  {
    keys:["windows","operating system","os kya"],
    en:"An operating system manages the computer and helps programs and hardware work together.",
    hi:"Operating system computer ko manage karta hai aur programs aur hardware ko saath kaam karne me help karta hai."
  },

  {
    keys:["file","file kya"],
    en:"A file is a saved piece of information, such as a document, photo, video or song.",
    hi:"File saved information hoti hai, jaise document, photo, video ya song."
  },

  {
    keys:["folder","folder kya"],
    en:"A folder helps organize files on a computer.",
    hi:"Folder computer me files ko organize karke rakhne ke liye use hota hai."
  },

  {
    keys:["browser","browser kya","chrome"],
    en:"A web browser is a program used to open and view websites.",
    hi:"Web browser ek program hai jisse hum websites open aur view karte hain."
  },

  {
    keys:["website","website kya"],
    en:"A website is a group of web pages that can be opened using a browser.",
    hi:"Website web pages ka group hota hai jo browser me open hota hai."
  },

  {
    keys:["email","email kya"],
    en:"Email is a way to send digital messages over the internet.",
    hi:"Email internet ke through digital message bhejne ka ek tarika hai."
  },

  {
    keys:["healthy habit","healthy habits","good habit"],
    en:"One healthy habit is drinking enough water. Also eat balanced food, sleep well and stay active.",
    hi:"Ek achhi healthy habit hai enough water peena. Balanced food khao, achhi sleep lo aur active raho."
  },

  {
    keys:["water","drink water","hydration"],
    en:"Water helps your body work properly. Drink water regularly during the day.",
    hi:"Water body ko properly kaam karne me help karta hai. Din bhar regular water peena achha hota hai."
  },

  {
    keys:["hand wash","wash hands","handwashing"],
    en:"Wash your hands with soap before eating and after using the toilet. This helps remove germs.",
    hi:"Khana khane se pehle aur toilet ke baad soap se hands wash karo. Isse germs remove hote hain."
  },

  {
    keys:["brush teeth","teeth","tooth"],
    en:"Brush your teeth twice a day and ask a grown-up or dentist if you have tooth pain.",
    hi:"Din me do baar teeth brush karo. Tooth pain ho to grown-up ya dentist ko batao."
  },

  {
    keys:["sleep","sleep healthy"],
    en:"Good sleep helps children learn, grow and feel energetic.",
    hi:"Achhi sleep children ko learn karne, grow karne aur energetic feel karne me help karti hai."
  },

  {
    keys:["exercise","physical activity"],
    en:"Moving, playing and exercising help keep the body strong and healthy.",
    hi:"Playing, movement aur exercise body ko strong aur healthy rakhne me help karte hain."
  },

  {
    keys:["germs","germ"],
    en:"Germs are tiny organisms. Some can make us sick, so washing hands and keeping things clean is important.",
    hi:"Germs bahut chhote organisms hote hain. Kuch germs hume sick kar sakte hain, isliye cleanliness important hai."
  },

  {
    keys:["heart","heart kya"],
    en:"The heart pumps blood around the body.",
    hi:"Heart body ke andar blood ko pump karta hai."
  },

  {
    keys:["lungs","lungs kya"],
    en:"The lungs help us breathe and take oxygen into the body.",
    hi:"Lungs hume breathe karne aur oxygen body me lene me help karte hain."
  },

  {
    keys:["brain","brain kya"],
    en:"The brain helps us think, learn, remember and control many body activities.",
    hi:"Brain hume think, learn, remember aur body ke bahut saare functions control karne me help karta hai."
  },

  {
    keys:["india capital","capital of india","bharat ki rajdhani"],
    en:"The capital of India is New Delhi.",
    hi:"India ki capital New Delhi hai."
  },

  {
    keys:["bihar capital","capital of bihar","bihar ki rajdhani"],
    en:"The capital of Bihar is Patna.",
    hi:"Bihar ki capital Patna hai."
  },

  {
    keys:["earth","planet earth"],
    en:"Earth is the planet where we live. It has land, water and an atmosphere.",
    hi:"Earth wo planet hai jahan hum rehte hain. Yahan land, water aur atmosphere hai."
  },

  {
    keys:["sun","sun kya"],
    en:"The Sun is a star. It gives Earth light and heat.",
    hi:"Sun ek star hai. Ye Earth ko light aur heat deta hai."
  },

  {
    keys:["moon","moon kya"],
    en:"The Moon is Earth's natural satellite.",
    hi:"Moon Earth ka natural satellite hai."
  },

  {
    keys:["solar system"],
    en:"The Solar System includes the Sun, eight planets and many smaller objects.",
    hi:"Solar System me Sun, eight planets aur bahut saare smaller objects hote hain."
  },

  {
    keys:["plant","plants"],
    en:"Plants need light, water, air and nutrients to grow.",
    hi:"Plants ko grow karne ke liye light, water, air aur nutrients chahiye."
  },

  {
    keys:["animal","animals"],
    en:"Animals are living things that need food, water and a safe place to live.",
    hi:"Animals living things hain. Unhe food, water aur safe place chahiye."
  },

  {
    keys:["hello","hi","hey"],
    en:"Hi! 👋 I am Tannu Learning Buddy. Ask me about computers, networking, English, GK, health, safety or your IT lab.",
    hi:"Hi! 👋 Main Tannu Learning Buddy hoon. Computer, networking, English, GK, health, safety ya IT Lab ke baare me poochho."
  },

  {
    keys:["thank you","thanks","shukriya"],
    en:"You're welcome! ⭐ Keep learning and asking questions.",
    hi:"Welcome! ⭐ Aise hi questions poochte raho aur learning continue karo."
  }

];


/* =========================
   LANGUAGE
========================= */

function isHindiScript(text){
  return /[\u0900-\u097F]/.test(text);
}

function looksHinglish(text){
  const t = text.toLowerCase();

  const words = [
    "kya",
    "kaise",
    "hai",
    "hain",
    "karo",
    "ka",
    "ki",
    "mera",
    "mujhe",
    "nahi",
    "kyu",
    "q",
    "batao"
  ];

  return words.some(w =>
    new RegExp(`\\b${w}\\b`).test(t)
  );
}


/* =========================
   TEXT NORMALIZE
========================= */

function normalize(text){

  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu," ")
    .replace(/\s+/g," ")
    .trim();

}


/* =========================
   MATCH ENGINE
========================= */

function findAnswer(question){

  const q = normalize(question);

  let best = null;
  let bestScore = 0;

  for(const item of KNOWLEDGE){

    for(const key of item.keys){

      const k = normalize(key);

      let score = 0;

      if(q === k){
        score = 100;
      }

      else if(q.includes(k)){
        score = 80 + k.length;
      }

      else{

        const qWords =
          new Set(q.split(" "));

        const kWords =
          k.split(" ");

        const matches =
          kWords.filter(
            word =>
              word.length > 1 &&
              qWords.has(word)
          ).length;

        score =
          matches /
          Math.max(1,kWords.length)
          * 60;

      }

      if(score > bestScore){
        bestScore = score;
        best = item;
      }

    }

  }


  if(best && bestScore >= 32){

    if(
      isHindiScript(question) ||
      looksHinglish(question)
    ){
      return best.hi || best.en;
    }

    return best.en;

  }


  if(
    isHindiScript(question) ||
    looksHinglish(question)
  ){

    return (
      "Is question ka exact answer mere free learning bank me abhi nahi mila. " +
      "Aap computer, mouse, keyboard, RAM, monitor, router, switch, LAN, internet, " +
      "English, GK, science, health ya cyber safety ke baare me poochh sakte ho. 🙂"
    );

  }


  return (
    "I do not have that exact answer in my free learning bank yet. " +
    "Try asking about computers, hardware, networking, English, GK, science, " +
    "health, hygiene or cyber safety. 🙂"
  );

}


/* =========================
   VOICE
========================= */

function speak(text){

  if(
    !("speechSynthesis" in window)
  ){
    return;
  }

  speechSynthesis.cancel();

  const u =
    new SpeechSynthesisUtterance(text);

  if(
    isHindiScript(text) ||
    looksHinglish(text)
  ){
    u.lang = "hi-IN";
  }else{
    u.lang = "en-US";
  }

  u.rate = 0.78;
  u.pitch = 1.05;

  const voices =
    speechSynthesis.getVoices();

  const lang =
    u.lang
      .toLowerCase()
      .split("-")[0];

  const voice =
    voices.find(
      v =>
        (v.lang || "")
          .toLowerCase()
          .startsWith(lang)
    );

  if(voice){
    u.voice = voice;
  }

  speechSynthesis.speak(u);

}


/* =========================
   STUDENT NAME
========================= */

async function loadStudent(){

  if(!token) return;

  try{

    const r =
      await fetch(
        ACADEMY_API +
        "/api/auth/me",
        {
          headers:{
            Authorization:
              `Bearer ${token}`
          },
          cache:"no-store"
        }
      );

    const d =
      await r.json();

    if(
      r.ok &&
      d.role === "student"
    ){

      studentName =
        d.profile?.display_name ||
        d.profile?.nickname ||
        d.profile?.username ||
        "Friend";

    }

  }catch{}

}


/* =========================
   SAFETY
========================= */

function safeQuestion(text){

  const t =
    text.toLowerCase();

  const privatePatterns = [
    "my password is",
    "mera password",
    "my otp is",
    "mera otp",
    "my phone number is",
    "mera phone number",
    "my address is",
    "mera address"
  ];

  if(
    privatePatterns.some(
      p => t.includes(p)
    )
  ){
    return {
      ok:false,
      answer:
        "Private information share mat karo. Password, OTP, phone number aur home address hamesha private rakho. 🔐"
    };
  }

  return {
    ok:true
  };

}


/* =========================
   PANEL STYLE
========================= */

function addStyle(){

  if(
    document.getElementById(
      "freeBuddyStyle"
    )
  ){
    return;
  }

  const s =
    document.createElement("style");

  s.id =
    "freeBuddyStyle";

  s.textContent = `

  #freeBuddyPanel{
    position:fixed;
    right:22px;
    bottom:110px;
    width:min(390px,calc(100vw - 28px));
    max-height:620px;
    display:none;
    flex-direction:column;
    z-index:99999;
    background:#fff;
    border:1px solid #e3e6f2;
    border-radius:26px;
    overflow:hidden;
    box-shadow:
      0 25px 70px
      rgba(31,37,99,.28);
    font-family:
      Inter,
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif;
  }

  #freeBuddyPanel.show{
    display:flex;
    animation:
      freeBuddyPop .2s ease;
  }

  .free-buddy-head{
    display:grid;
    grid-template-columns:
      auto 1fr auto;
    gap:10px;
    align-items:center;
    padding:14px;
    color:#fff;
    background:
      linear-gradient(
        135deg,
        #11194b,
        #6758f6 58%,
        #24cfc2
      );
  }

  .free-buddy-avatar{
    width:45px;
    height:45px;
    display:grid;
    place-items:center;
    border-radius:15px;
    background:#ffffff18;
    font-size:27px;
  }

  .free-buddy-head b,
  .free-buddy-head small{
    display:block;
  }

  .free-buddy-head b{
    font-size:15px;
  }

  .free-buddy-head small{
    margin-top:2px;
    font-size:9px;
    opacity:.86;
  }

  #freeBuddyClose{
    width:34px;
    height:34px;
    border:0;
    border-radius:50%;
    background:#ffffff18;
    color:#fff;
    font-size:22px;
    font-weight:900;
  }

  .free-buddy-chat{
    min-height:270px;
    max-height:330px;
    overflow:auto;
    padding:13px;
    background:
      linear-gradient(
        180deg,
        #f7f8ff,
        #fff
      );
  }

  .free-bubble{
    max-width:87%;
    margin:7px 0;
    padding:11px 13px;
    border-radius:16px;
    font-size:12px;
    line-height:1.5;
    font-weight:700;
  }

  .free-bubble.bot{
    background:#efedff;
    color:#4d46a2;
    border-bottom-left-radius:5px;
  }

  .free-bubble.user{
    margin-left:auto;
    background:#e8fff7;
    color:#177459;
    border-bottom-right-radius:5px;
  }

  .free-quick{
    display:grid;
    grid-template-columns:
      1fr 1fr;
    gap:7px;
    padding:10px 12px;
    border-top:
      1px solid #edf0f7;
  }

  .free-quick button{
    min-height:40px;
    border:0;
    border-radius:12px;
    background:#f4f3ff;
    color:#554ac5;
    font-size:10px;
    font-weight:1000;
  }

  .free-buddy-input{
    display:grid;
    grid-template-columns:
      1fr 45px 45px;
    gap:7px;
    padding:10px 12px;
    border-top:
      1px solid #edf0f7;
  }

  #freeBuddyInput{
    width:100%;
    padding:10px 11px;
    border:
      2px solid #dde1ef;
    border-radius:13px;
    outline:none;
    font-size:12px;
  }

  #freeBuddyInput:focus{
    border-color:#786bff;
    box-shadow:
      0 0 0 3px
      rgba(108,92,255,.1);
  }

  #freeBuddyMic,
  #freeBuddySend{
    border:0;
    border-radius:13px;
    font-size:17px;
  }

  #freeBuddyMic{
    background:#ffe6f3;
  }

  #freeBuddySend{
    color:#fff;
    background:
      linear-gradient(
        135deg,
        #6c5cff,
        #24cfc2
      );
  }

  .free-buddy-footer{
    padding:8px;
    text-align:center;
    color:#7b8199;
    background:#fafbff;
    font-size:9px;
    font-weight:900;
  }

  @keyframes freeBuddyPop{
    from{
      opacity:0;
      transform:
        translateY(10px)
        scale(.96);
    }

    to{
      opacity:1;
      transform:none;
    }
  }

  @keyframes freeBuddyGlow{
    from{
      filter:
        drop-shadow(
          0 0 4px
          rgba(108,92,255,.3)
        );
    }

    to{
      filter:
        drop-shadow(
          0 0 10px
          rgba(108,92,255,.8)
        )
        drop-shadow(
          0 0 18px
          rgba(36,207,194,.55)
        );
      transform:
        translateY(-3px);
    }
  }

  @media(max-width:600px){

    #freeBuddyPanel{
      right:10px;
      bottom:92px;
      width:
        calc(100vw - 20px);
    }

  }

  @media(
    prefers-reduced-motion:
    reduce
  ){

    #helper{
      animation:none!important;
    }

  }

  `;

  document.head.appendChild(s);

}


/* =========================
   PANEL
========================= */

function buildPanel(){

  if(
    document.getElementById(
      "freeBuddyPanel"
    )
  ){
    return;
  }

  addStyle();

  const panel =
    document.createElement("div");

  panel.id =
    "freeBuddyPanel";

  panel.innerHTML = `

    <div class="free-buddy-head">

      <div class="free-buddy-avatar">
        🤖
      </div>

      <div>
        <b>Tannu Learning Buddy</b>
        <small>
          FREE • Voice • Learning Bank
        </small>
      </div>

      <button id="freeBuddyClose">
        ×
      </button>

    </div>


    <div
      id="freeBuddyChat"
      class="free-buddy-chat"
    >

      <div class="free-bubble bot">
        Hi ${studentName}! 👋
        Ask me about computers,
        networking, English, GK,
        health, hygiene or safety.
      </div>

    </div>


    <div class="free-quick">

      <button
        data-free-q="What is RAM?"
      >
        💻 RAM
      </button>

      <button
        data-free-q="Monitor kya karta hai?"
      >
        🖥️ Monitor
      </button>

      <button
        data-free-q="What is a router?"
      >
        🌐 Router
      </button>

      <button
        data-free-q="Tell me one healthy habit"
      >
        🥗 Health
      </button>

    </div>


    <div class="free-buddy-input">

      <input
        id="freeBuddyInput"
        maxlength="250"
        placeholder="Ask something..."
      >

      <button
        id="freeBuddyMic"
        title="Speak"
      >
        🎤
      </button>

      <button
        id="freeBuddySend"
        title="Send"
      >
        ➤
      </button>

    </div>


    <div class="free-buddy-footer">
      FREE • No API • No Paid Credits
    </div>

  `;

  document.body.appendChild(panel);


  $("freeBuddyClose")
    .onclick =
      closePanel;


  $("freeBuddySend")
    .onclick =
      sendTyped;


  $("freeBuddyMic")
    .onclick =
      listen;


  $("freeBuddyInput")
    .addEventListener(
      "keydown",
      event => {

        if(
          event.key === "Enter"
        ){
          sendTyped();
        }

      }
    );


  panel
    .querySelectorAll(
      "[data-free-q]"
    )
    .forEach(
      button => {

        button.onclick =
          () => {

            ask(
              button.dataset.freeQ
            );

          };

      }
    );

}


/* =========================
   CHAT
========================= */

function addBubble(
  text,
  type="bot"
){

  const chat =
    $("freeBuddyChat");

  const bubble =
    document.createElement("div");

  bubble.className =
    `free-bubble ${type}`;

  bubble.textContent =
    text;

  chat.appendChild(
    bubble
  );

  chat.scrollTop =
    chat.scrollHeight;

}


function ask(text){

  text =
    String(text || "")
      .trim();

  if(
    text.length < 1
  ){
    return;
  }


  addBubble(
    text,
    "user"
  );


  const safety =
    safeQuestion(text);


  let answer;


  if(!safety.ok){

    answer =
      safety.answer;

  }else{

    answer =
      findAnswer(text);

  }


  setTimeout(
    () => {

      addBubble(
        answer,
        "bot"
      );

      speak(answer);

    },
    220
  );

}


function sendTyped(){

  const input =
    $("freeBuddyInput");

  const text =
    input.value;

  input.value = "";

  ask(text);

}


/* =========================
   VOICE INPUT
========================= */

function listen(){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if(!SpeechRecognition){

    alert(
      "Voice input is not available in this browser. Please type your question."
    );

    return;
  }


  const r =
    new SpeechRecognition();


  r.lang =
    "hi-IN";

  r.interimResults =
    false;

  r.maxAlternatives =
    1;


  $("freeBuddyMic")
    .textContent =
      "🔴";


  r.onresult =
    event => {

      const text =
        event
          .results[0][0]
          .transcript;

      ask(text);

    };


  r.onerror =
    () => {

      addBubble(
        "I could not hear clearly. Please try again.",
        "bot"
      );

    };


  r.onend =
    () => {

      $("freeBuddyMic")
        .textContent =
          "🎤";

    };


  try{

    r.start();

  }catch{}

}


/* =========================
   OPEN / CLOSE
========================= */

function openPanel(){

  buildPanel();

  $("freeBuddyPanel")
    .classList.add("show");

  panelOpen = true;

}


function closePanel(){

  const panel =
    $("freeBuddyPanel");

  if(panel){

    panel.classList.remove(
      "show"
    );

  }

  panelOpen = false;

}


/* =========================
   CONNECT ROBOT
========================= */

function connectHelper(){

  const helper =
    document.getElementById(
      "helper"
    );

  if(!helper){
    return;
  }


  /*
    Clone removes old helper
    click handlers safely.
  */

  const clone =
    helper.cloneNode(true);

  helper.parentNode
    .replaceChild(
      clone,
      helper
    );


  clone.title =
    "Ask Tannu Learning Buddy";

  clone.setAttribute(
    "aria-label",
    "Ask Tannu Learning Buddy"
  );


  const small =
    clone.querySelector(
      "small"
    );

  if(small){

    small.textContent =
      "Ask Me!";

  }


  clone.style.animation =
    "freeBuddyGlow 1.5s infinite alternate";


  clone.addEventListener(
    "click",
    () => {

      if(panelOpen){

        closePanel();

      }else{

        openPanel();

      }

    }
  );

}


/* =========================
   START
========================= */

async function boot(){

  await loadStudent();

  connectHelper();

}


if(
  document.readyState ===
  "loading"
){

  document.addEventListener(
    "DOMContentLoaded",
    boot
  );

}else{

  boot();

}

})();
