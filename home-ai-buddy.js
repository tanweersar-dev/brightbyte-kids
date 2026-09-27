(() => {
"use strict";

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const AI_API =
  localStorage.getItem("kids_ai_api") || "";

const token =
  localStorage.getItem("brightbyte_student_token") || "";

const $ = id => document.getElementById(id);

let studentName = "Friend";
let panelOpen = false;

function speak(text){
  if(!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);

  if(/[\u0900-\u097F]/.test(text)){
    u.lang = "hi-IN";
  }else{
    u.lang = "en-US";
  }

  u.rate = .78;
  u.pitch = 1.05;

  const voices = speechSynthesis.getVoices();

  const language =
    u.lang.toLowerCase().split("-")[0];

  const voice =
    voices.find(v =>
      (v.lang || "")
        .toLowerCase()
        .startsWith(language)
    );

  if(voice) u.voice = voice;

  speechSynthesis.speak(u);
}

function toast(msg){
  let t = document.getElementById("aiBuddyToast");

  if(!t){
    t = document.createElement("div");
    t.id = "aiBuddyToast";

    Object.assign(t.style,{
      position:"fixed",
      left:"50%",
      bottom:"22px",
      transform:"translate(-50%,80px)",
      opacity:"0",
      zIndex:"99999",
      background:"#20264f",
      color:"#fff",
      padding:"12px 18px",
      borderRadius:"999px",
      fontSize:"12px",
      fontWeight:"900",
      transition:".2s"
    });

    document.body.appendChild(t);
  }

  t.textContent = msg;
  t.style.opacity = "1";
  t.style.transform = "translate(-50%,0)";

  clearTimeout(window.__aiBuddyToast);

  window.__aiBuddyToast = setTimeout(()=>{
    t.style.opacity = "0";
    t.style.transform = "translate(-50%,80px)";
  },1800);
}

async function loadStudent(){
  if(!token) return;

  try{
    const r = await fetch(
      ACADEMY_API + "/api/auth/me",
      {
        headers:{
          Authorization:`Bearer ${token}`
        },
        cache:"no-store"
      }
    );

    const d = await r.json();

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

function safetyCheck(text){
  const blocked =
    /password|otp|home address|phone number|nude|sexual|weapon|kill|blood|drug/i;

  return !blocked.test(text);
}

async function callAI(message){
  if(!AI_API){
    throw new Error(
      "AI Buddy is not connected yet."
    );
  }

  const r = await fetch(
    AI_API + "/chat",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message
      })
    }
  );

  let d = {};

  try{
    d = await r.json();
  }catch{
    throw new Error(
      "AI returned an invalid response."
    );
  }

  if(!r.ok){
    throw new Error(
      d.error ||
      "AI request failed."
    );
  }

  return d.text || "";
}

function buildPanel(){
  if(document.getElementById("aiBuddyPanel")) return;

  const panel = document.createElement("div");

  panel.id = "aiBuddyPanel";

  panel.innerHTML = `
    <div class="ai-buddy-head">

      <div class="ai-buddy-avatar">
        🤖
      </div>

      <div>
        <b>Tannu AI Buddy</b>
        <small>Ask me by voice or text</small>
      </div>

      <button id="aiBuddyClose">
        ×
      </button>

    </div>

    <div
      id="aiBuddyChat"
      class="ai-buddy-chat"
    >

      <div class="ai-bubble bot">
        Hi ${studentName}! 👋
        Ask me about computers, English,
        GK, healthy habits, safety or your lab.
      </div>

    </div>

    <div class="ai-quick">

      <button data-q="What is RAM?">
        💻 RAM
      </button>

      <button data-q="What does a monitor do?">
        🖥️ Monitor
      </button>

      <button data-q="Tell me one healthy habit.">
        🥗 Health
      </button>

      <button data-q="What is a safe internet rule?">
        🛡️ Safety
      </button>

    </div>

    <div class="ai-buddy-input">

      <input
        id="aiBuddyInput"
        maxlength="300"
        placeholder="Ask something..."
      >

      <button id="aiBuddyMic">
        🎤
      </button>

      <button id="aiBuddySend">
        ➤
      </button>

    </div>

    <div class="ai-buddy-footer">
      Short • Simple • Kids Safe
    </div>
  `;

  document.body.appendChild(panel);

  addPanelStyle();

  $("aiBuddyClose").onclick = closePanel;

  $("aiBuddySend").onclick = sendTyped;

  $("aiBuddyMic").onclick = listen;

  $("aiBuddyInput")
    .addEventListener(
      "keydown",
      e=>{
        if(e.key === "Enter"){
          sendTyped();
        }
      }
    );

  panel
    .querySelectorAll("[data-q]")
    .forEach(btn=>{
      btn.onclick = ()=>{
        $("aiBuddyInput").value =
          btn.dataset.q;

        sendTyped();
      };
    });
}

function addPanelStyle(){
  if(document.getElementById("aiBuddyStyle")) return;

  const s = document.createElement("style");

  s.id = "aiBuddyStyle";

  s.textContent = `
    #aiBuddyPanel{
      position:fixed;
      right:22px;
      bottom:110px;
      width:min(390px,calc(100vw - 28px));
      max-height:620px;
      display:none;
      flex-direction:column;
      z-index:9999;
      background:#fff;
      border:1px solid #e3e6f2;
      border-radius:26px;
      box-shadow:0 25px 70px rgba(31,37,99,.26);
      overflow:hidden;
      font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif
    }

    #aiBuddyPanel.show{
      display:flex;
      animation:aiBuddyPop .22s ease
    }

    .ai-buddy-head{
      display:grid;
      grid-template-columns:auto 1fr auto;
      gap:10px;
      align-items:center;
      padding:14px;
      color:#fff;
      background:linear-gradient(135deg,#11194b,#6658f6 58%,#24cfc2)
    }

    .ai-buddy-head b,
    .ai-buddy-head small{
      display:block
    }

    .ai-buddy-head b{
      font-size:15px
    }

    .ai-buddy-head small{
      margin-top:2px;
      font-size:9px;
      opacity:.85
    }

    .ai-buddy-avatar{
      width:45px;
      height:45px;
      border-radius:15px;
      display:grid;
      place-items:center;
      background:#ffffff1a;
      font-size:27px
    }

    #aiBuddyClose{
      width:34px;
      height:34px;
      border:0;
      border-radius:50%;
      color:#fff;
      background:#ffffff18;
      font-size:22px;
      font-weight:900
    }

    .ai-buddy-chat{
      min-height:270px;
      max-height:330px;
      overflow:auto;
      padding:13px;
      background:linear-gradient(180deg,#f7f8ff,#fff)
    }

    .ai-bubble{
      max-width:86%;
      margin:7px 0;
      padding:11px 13px;
      border-radius:16px;
      font-size:12px;
      line-height:1.5;
      font-weight:700
    }

    .ai-bubble.bot{
      background:#efedff;
      color:#4d46a2;
      border-bottom-left-radius:5px
    }

    .ai-bubble.user{
      margin-left:auto;
      background:#e8fff7;
      color:#177459;
      border-bottom-right-radius:5px
    }

    .ai-bubble.loading{
      opacity:.7;
      font-style:italic
    }

    .ai-quick{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:7px;
      padding:10px 12px;
      border-top:1px solid #edf0f7
    }

    .ai-quick button{
      min-height:40px;
      border:0;
      border-radius:12px;
      background:#f4f3ff;
      color:#554ac5;
      font-size:10px;
      font-weight:1000
    }

    .ai-buddy-input{
      display:grid;
      grid-template-columns:1fr 45px 45px;
      gap:7px;
      padding:10px 12px;
      border-top:1px solid #edf0f7
    }

    #aiBuddyInput{
      width:100%;
      border:2px solid #dde1ef;
      border-radius:13px;
      padding:10px 11px;
      outline:none;
      font-size:12px
    }

    #aiBuddyInput:focus{
      border-color:#786bff;
      box-shadow:0 0 0 3px rgba(108,92,255,.10)
    }

    #aiBuddyMic,
    #aiBuddySend{
      border:0;
      border-radius:13px;
      font-size:17px;
      font-weight:1000
    }

    #aiBuddyMic{
      background:#ffe6f3
    }

    #aiBuddySend{
      color:#fff;
      background:linear-gradient(135deg,#6c5cff,#24cfc2)
    }

    .ai-buddy-footer{
      padding:8px;
      text-align:center;
      color:#7b8199;
      background:#fafbff;
      font-size:9px;
      font-weight:900
    }

    @keyframes aiBuddyPop{
      from{
        opacity:0;
        transform:translateY(10px) scale(.96)
      }

      to{
        opacity:1;
        transform:none
      }
    }

    @media(max-width:600px){
      #aiBuddyPanel{
        right:10px;
        bottom:92px;
        width:calc(100vw - 20px)
      }
    }
  `;

  document.head.appendChild(s);
}

function addBubble(text,type="bot",id=""){
  const chat = $("aiBuddyChat");

  const b = document.createElement("div");

  b.className =
    "ai-bubble " + type;

  if(id) b.id = id;

  b.textContent = text;

  chat.appendChild(b);

  chat.scrollTop =
    chat.scrollHeight;

  return b;
}

async function ask(text){
  text = text.trim();

  if(text.length < 2) return;

  if(!safetyCheck(text)){
    addBubble(
      "Please ask a safe learning question. Do not share passwords, OTPs or private information.",
      "bot"
    );

    speak(
      "Please ask a safe learning question."
    );

    return;
  }

  addBubble(text,"user");

  const loading =
    addBubble(
      "Thinking...",
      "bot loading",
      "aiBuddyLoading"
    );

  try{
    const languageInstruction =
      `
You are Tannu AI Buddy for Class 1 to 3 children.
Answer in the SAME language the child used.
If the child asks in Hindi, answer in simple Hindi.
If the child asks in English, answer in simple English.
If the child uses Hinglish, answer in easy Hinglish.
Keep answers short, friendly and easy.
Usually use 2 to 5 short sentences.
Explain with a simple example when useful.
Topics may include computers, English, GK, science basics, healthy habits, hygiene, manners, cyber safety and the academy's IT lab.
Do not ask for private information.
For health or safety concerns, tell the child to ask a parent, teacher or trusted adult when appropriate.
Child's question:
`;

    const answer =
      await callAI(
        languageInstruction + text
      );

    loading.remove();

    addBubble(
      answer ||
      "I could not answer that."
    );

    if(answer){
      speak(answer);
    }

  }catch(error){
    loading.remove();

    const msg =
      error.message ||
      "AI Buddy is unavailable.";

    addBubble(
      "⚠️ " + msg
    );

    toast(msg);
  }
}

function sendTyped(){
  const input = $("aiBuddyInput");

  const text = input.value;

  input.value = "";

  ask(text);
}

function listen(){
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    toast(
      "Voice input is not available in this browser."
    );
    return;
  }

  const r =
    new SpeechRecognition();

  /*
    Hindi mode handles Hindi/Hinglish well.
    Child can also type English manually.
  */
  r.lang = "hi-IN";
  r.interimResults = false;
  r.maxAlternatives = 1;

  $("aiBuddyMic").textContent =
    "🔴";

  toast("Listening... bolo");

  r.onresult = e=>{
    const text =
      e.results[0][0].transcript;

    $("aiBuddyInput").value =
      text;

    ask(text);

    $("aiBuddyInput").value = "";
  };

  r.onerror = ()=>{
    toast(
      "Could not hear clearly. Try again."
    );
  };

  r.onend = ()=>{
    $("aiBuddyMic").textContent =
      "🎤";
  };

  try{
    r.start();
  }catch{}
}

function openPanel(){
  buildPanel();

  $("aiBuddyPanel")
    .classList.add("show");

  panelOpen = true;
}

function closePanel(){
  const p =
    $("aiBuddyPanel");

  if(p){
    p.classList.remove("show");
  }

  panelOpen = false;
}

function connectExistingHelper(){
  const helper =
    document.getElementById("helper");

  if(!helper) return;

  /*
    Keep the existing robot look.
    Only change what happens when clicked.
  */

  helper.title =
    "Ask Tannu AI Buddy";

  helper.setAttribute(
    "aria-label",
    "Ask Tannu AI Buddy"
  );

  const oldClone =
    helper.cloneNode(true);

  helper.parentNode.replaceChild(
    oldClone,
    helper
  );

  oldClone.addEventListener(
    "click",
    ()=>{
      if(panelOpen){
        closePanel();
      }else{
        openPanel();
      }
    }
  );

  const small =
    oldClone.querySelector("small");

  if(small){
    small.textContent =
      "Ask AI!";
  }

  /*
    Gentle attention glow.
  */

  oldClone.style.animation =
    "aiBuddyHelperGlow 1.5s infinite alternate";

  if(
    !document.getElementById(
      "aiBuddyHelperStyle"
    )
  ){
    const s =
      document.createElement("style");

    s.id =
      "aiBuddyHelperStyle";

    s.textContent = `
      @keyframes aiBuddyHelperGlow{
        from{
          filter:drop-shadow(
            0 0 4px rgba(108,92,255,.3)
          )
        }

        to{
          filter:
            drop-shadow(
              0 0 10px rgba(108,92,255,.85)
            )
            drop-shadow(
              0 0 18px rgba(36,207,194,.6)
            );
          transform:translateY(-3px)
        }
      }

      @media(prefers-reduced-motion:reduce){
        #helper{
          animation:none!important
        }
      }
    `;

    document.head.appendChild(s);
  }
}

async function boot(){
  await loadStudent();

  connectExistingHelper();
}

if(
  document.readyState === "loading"
){
  document.addEventListener(
    "DOMContentLoaded",
    boot
  );
}else{
  boot();
}

})();
