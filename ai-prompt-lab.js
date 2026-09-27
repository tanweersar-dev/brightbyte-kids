(() => {
"use strict";

/*
  Tannu AI Prompt Lab - FREE MODE
  --------------------------------
  No OpenAI API
  No paid credits
  No Cloudflare AI Worker

  Features:
  - Prompt Builder
  - Voice Prompt
  - Hear Prompt
  - Improve Prompt
  - Local Visual Preview
  - Local Tiny Story
  - Kids Safety
*/

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const token =
  localStorage.getItem("brightbyte_student_token") || "";

const $ = id =>
  document.getElementById(id);

let mode = "image";

let selection = {
  subject: "friendly robot",
  place: "sunny garden",
  action: "reading a book",
  style: "colorful cartoon style"
};


/* =========================
   CHOICES
========================= */

const data = {

  subject: [
    "🤖 friendly robot",
    "🐘 elephant",
    "🐱 white cat",
    "🚀 space rocket",
    "🧒 school child",
    "🐟 colorful fish"
  ],

  place: [
    "🌳 sunny garden",
    "🏫 school",
    "🌙 moon",
    "🌾 village field",
    "🏖️ beach",
    "🌌 space"
  ],

  action: [
    "📖 reading a book",
    "⚽ playing",
    "🌱 planting a tree",
    "💻 learning computer",
    "🎨 painting",
    "👋 waving hello"
  ],

  style: [
    "🎨 colorful cartoon style",
    "🧸 toy style",
    "📚 storybook style",
    "✏️ simple drawing style"
  ]

};


/* =========================
   HELPERS
========================= */

function toast(text){

  const box = $("toast");

  if(!box) return;

  box.textContent = text;

  box.classList.add("show");

  clearTimeout(
    window.__promptToast
  );

  window.__promptToast =
    setTimeout(
      () =>
        box.classList.remove("show"),
      1800
    );
}


function isHindi(text){

  return /[\u0900-\u097F]/.test(
    text
  );
}


function isHinglish(text){

  const t =
    text.toLowerCase();

  const words = [
    "kya",
    "kaise",
    "hai",
    "hain",
    "karo",
    "banao",
    "mera",
    "mujhe",
    "ek",
    "mein",
    "me",
    "wala",
    "wali"
  ];

  return words.some(
    word =>
      new RegExp(
        `\\b${word}\\b`
      ).test(t)
  );
}


function speak(text){

  if(
    !("speechSynthesis" in window)
  ){
    return;
  }

  speechSynthesis.cancel();

  const u =
    new SpeechSynthesisUtterance(
      text
    );

  if(
    isHindi(text) ||
    isHinglish(text)
  ){
    u.lang = "hi-IN";
  }else{
    u.lang = "en-US";
  }

  u.rate = 0.75;
  u.pitch = 1.04;

  const voices =
    speechSynthesis.getVoices();

  const base =
    u.lang
      .toLowerCase()
      .split("-")[0];

  const voice =
    voices.find(
      v =>
        (v.lang || "")
          .toLowerCase()
          .startsWith(base)
    );

  if(voice){
    u.voice = voice;
  }

  speechSynthesis.speak(u);
}


function clean(value){

  return value.replace(
    /^\S+\s/,
    ""
  );
}


function escapeXml(text){

  return String(text)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&apos;");
}


/* =========================
   RENDER CHOICES
========================= */

function renderChoices(
  key,
  id
){

  const box = $(id);

  if(!box) return;

  box.innerHTML =
    data[key]
      .map(value => {

        const cleaned =
          clean(value);

        return `
          <button
            class="${
              cleaned ===
              selection[key]
                ? "active"
                : ""
            }"
            data-key="${key}"
            data-value="${cleaned}"
          >
            ${value}
          </button>
        `;

      })
      .join("");
}


function renderAll(){

  renderChoices(
    "subject",
    "subjectChoices"
  );

  renderChoices(
    "place",
    "placeChoices"
  );

  renderChoices(
    "action",
    "actionChoices"
  );

  renderChoices(
    "style",
    "styleChoices"
  );
}


/* =========================
   PROMPT BUILDER
========================= */

function buildPrompt(){

  const p =
    `A ${selection.subject} ` +
    `${selection.action} in a ` +
    `${selection.place}, ` +
    `${selection.style}.`;

  $("prompt").value =
    p.charAt(0).toUpperCase() +
    p.slice(1);
}


/* =========================
   STUDENT
========================= */

async function loadStudent(){

  if(!token){

    location.href =
      "student-login.html";

    return;
  }

  try{

    const response =
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

    const result =
      await response.json();

    if(
      response.ok &&
      result.role === "student"
    ){

      const name =
        result.profile?.display_name ||
        result.profile?.nickname ||
        result.profile?.username ||
        "Student";

      $("studentName").textContent =
        "👤 " + name;

    }else{

      location.href =
        "student-login.html";
    }

  }catch{

    $("studentName").textContent =
      "👤 Student";
  }
}


/* =========================
   SAFETY
========================= */

function safeLocalPrompt(prompt){

  const blocked =
    /password|otp|home address|phone number|nude|sexual|porn|kill|bomb|weapon|drug/i;

  return !blocked.test(
    prompt
  );
}


/* =========================
   VISUAL PREVIEW
========================= */

function subjectEmoji(prompt){

  const p =
    prompt.toLowerCase();

  if(p.includes("robot"))
    return "🤖";

  if(p.includes("elephant"))
    return "🐘";

  if(p.includes("cat"))
    return "🐱";

  if(
    p.includes("rocket") ||
    p.includes("space")
  )
    return "🚀";

  if(
    p.includes("fish")
  )
    return "🐟";

  if(
    p.includes("child") ||
    p.includes("student") ||
    p.includes("boy") ||
    p.includes("girl")
  )
    return "🧒";

  if(
    p.includes("tree") ||
    p.includes("plant")
  )
    return "🌳";

  return "✨";
}


function placeEmoji(prompt){

  const p =
    prompt.toLowerCase();

  if(p.includes("garden"))
    return "🌳";

  if(p.includes("school"))
    return "🏫";

  if(p.includes("moon"))
    return "🌙";

  if(p.includes("space"))
    return "🌌";

  if(p.includes("beach"))
    return "🏖️";

  if(
    p.includes("village") ||
    p.includes("field")
  )
    return "🌾";

  return "🌈";
}


function actionEmoji(prompt){

  const p =
    prompt.toLowerCase();

  if(
    p.includes("book") ||
    p.includes("reading")
  )
    return "📖";

  if(
    p.includes("computer") ||
    p.includes("learning")
  )
    return "💻";

  if(
    p.includes("paint")
  )
    return "🎨";

  if(
    p.includes("play")
  )
    return "⚽";

  if(
    p.includes("plant")
  )
    return "🌱";

  if(
    p.includes("wave")
  )
    return "👋";

  return "⭐";
}


function createVisualPreview(
  prompt
){

  const subject =
    subjectEmoji(prompt);

  const place =
    placeEmoji(prompt);

  const action =
    actionEmoji(prompt);

  const safePrompt =
    escapeXml(
      prompt.slice(0,90)
    );

  const svg = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1024"
    height="1024"
    viewBox="0 0 1024 1024"
  >

    <defs>

      <linearGradient
        id="bg"
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >

        <stop
          offset="0%"
          stop-color="#6658f6"
        />

        <stop
          offset="52%"
          stop-color="#24cfc2"
        />

        <stop
          offset="100%"
          stop-color="#ff9f67"
        />

      </linearGradient>

      <filter id="shadow">

        <feDropShadow
          dx="0"
          dy="18"
          stdDeviation="20"
          flood-opacity=".25"
        />

      </filter>

    </defs>


    <rect
      width="1024"
      height="1024"
      rx="70"
      fill="url(#bg)"
    />


    <circle
      cx="140"
      cy="130"
      r="80"
      fill="#ffffff22"
    />

    <circle
      cx="890"
      cy="170"
      r="120"
      fill="#ffffff18"
    />

    <circle
      cx="850"
      cy="840"
      r="150"
      fill="#ffffff14"
    />


    <text
      x="512"
      y="175"
      text-anchor="middle"
      font-size="80"
    >
      ${place}
    </text>


    <g filter="url(#shadow)">

      <rect
        x="205"
        y="235"
        width="614"
        height="460"
        rx="70"
        fill="#ffffffdd"
      />

    </g>


    <text
      x="512"
      y="500"
      text-anchor="middle"
      font-size="220"
    >
      ${subject}
    </text>


    <text
      x="512"
      y="635"
      text-anchor="middle"
      font-size="100"
    >
      ${action}
    </text>


    <rect
      x="120"
      y="760"
      width="784"
      height="130"
      rx="40"
      fill="#11194bdd"
    />


    <text
      x="512"
      y="810"
      text-anchor="middle"
      fill="#ffffff"
      font-family="Arial,sans-serif"
      font-size="26"
      font-weight="700"
    >
      FREE VISUAL PROMPT PREVIEW
    </text>


    <text
      x="512"
      y="855"
      text-anchor="middle"
      fill="#dfe4ff"
      font-family="Arial,sans-serif"
      font-size="18"
    >
      ${safePrompt}
    </text>

  </svg>
  `;

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svg)
  );
}


/* =========================
   LOCAL STORY
========================= */

function makeStory(prompt){

  if(
    isHindi(prompt) ||
    isHinglish(prompt)
  ){

    return (
      "Ek din ek pyara character ek nayi jagah par gaya. " +
      "Wahan usne kuch interesting seekha aur khushi se apna kaam complete kiya. " +
      "Usne jaana ki curiosity aur practice se hum har din kuch naya seekh sakte hain. ⭐"
    );
  }


  const subject =
    selection.subject;

  const place =
    selection.place;

  const action =
    selection.action;


  const stories = [

    `One bright day, a ${subject} went to the ${place}. ` +
    `It started ${action}. ` +
    `It learned something new and felt very proud. ` +
    `Learning can be a fun adventure! ⭐`,

    `In a happy ${place}, a ${subject} had a little mission. ` +
    `The mission was ${action}. ` +
    `With patience and a smile, the mission was completed. ` +
    `What a smart learning day! 🌟`,

    `A ${subject} visited the ${place}. ` +
    `It enjoyed ${action} and discovered something interesting. ` +
    `Then it shared the new idea with a friend. ` +
    `Learning together made the day special. 😊`

  ];


  return stories[
    Math.floor(
      Math.random() *
      stories.length
    )
  ];
}


/* =========================
   CREATE
========================= */

function create(){

  const prompt =
    $("prompt")
      .value
      .trim();


  if(prompt.length < 3){

    toast(
      "Say or write a prompt first"
    );

    return;
  }


  if(
    !safeLocalPrompt(prompt)
  ){

    $("status").className =
      "status bad";

    $("status").textContent =
      "🛡️ Please use a safe learning prompt.";

    toast(
      "Please use a safe learning prompt"
    );

    return;
  }


  $("createBtn").disabled =
    true;


  if(mode === "image"){

    $("status").className =
      "status busy";

    $("status").textContent =
      "🎨 Building your free visual preview...";


    setTimeout(
      () => {

        $("outputEmpty").hidden =
          true;

        $("storyOutput").hidden =
          true;

        $("generatedImage").hidden =
          false;


        $("generatedImage").src =
          createVisualPreview(
            prompt
          );


        $("status").className =
          "status good";

        $("status").textContent =
          "✅ Free visual preview ready! No paid AI used.";


        $("createBtn").disabled =
          false;

      },
      300
    );

  }


  else{

    $("status").className =
      "status busy";

    $("status").textContent =
      "📖 Building your tiny story...";


    setTimeout(
      () => {

        const story =
          makeStory(prompt);


        $("outputEmpty").hidden =
          true;

        $("generatedImage").hidden =
          true;

        $("storyOutput").hidden =
          false;


        $("storyOutput").textContent =
          story;


        $("status").className =
          "status good";

        $("status").textContent =
          "✅ Free tiny story ready!";


        speak(story);


        $("createBtn").disabled =
          false;

      },
      300
    );

  }

}


/* =========================
   IMPROVE PROMPT
========================= */

function improve(){

  const prompt =
    $("prompt")
      .value
      .trim();


  if(!prompt){

    buildPrompt();

    toast(
      "✨ Prompt created"
    );

    return;
  }


  if(
    isHindi(prompt)
  ){

    $("prompt").value =
      prompt.replace(
        /[।.]?$/,
        ""
      ) +
      "। साफ रंग, प्यारा बैकग्राउंड, बच्चों के लिए सुरक्षित और मजेदार स्टाइल में।";

  }


  else if(
    isHinglish(prompt)
  ){

    $("prompt").value =
      prompt.replace(
        /[.]?$/,
        ""
      ) +
      ", bright colors ke saath, friendly background aur kids-safe cartoon style mein.";

  }


  else{

    $("prompt").value =
      prompt.replace(
        /[.]?$/,
        ""
      ) +
      ", with bright colors, a friendly background, clear details and a child-safe storybook style.";

  }


  toast(
    "✨ Prompt improved"
  );

}


/* =========================
   VOICE INPUT
========================= */

function voice(){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if(!SpeechRecognition){

    toast(
      "Voice typing is not available in this browser"
    );

    return;
  }


  const recognition =
    new SpeechRecognition();


  recognition.lang =
    "hi-IN";

  recognition.interimResults =
    false;

  recognition.maxAlternatives =
    1;


  recognition.onstart =
    () => {

      $("status").className =
        "status busy";

      $("status").textContent =
        "🎤 Listening... bolo.";

    };


  recognition.onresult =
    event => {

      const text =
        event.results[0][0]
          .transcript;


      $("prompt").value =
        text;


      $("status").className =
        "status good";

      $("status").textContent =
        "✅ I heard your prompt.";

    };


  recognition.onerror =
    () => {

      $("status").className =
        "status bad";

      $("status").textContent =
        "Could not hear clearly. Try again.";

    };


  recognition.onend =
    () => {

      if(
        $("status")
          .textContent ===
        "🎤 Listening... bolo."
      ){

        $("status").className =
          "status";

        $("status").textContent =
          "Ready.";

      }

    };


  try{

    recognition.start();

  }catch{}

}


/* =========================
   CHOICE CLICK
========================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-key]"
      );


    if(!button) return;


    selection[
      button.dataset.key
    ] =
      button.dataset.value;


    renderAll();

    buildPrompt();

  }
);


/* =========================
   MODE BUTTONS
========================= */

document
  .querySelectorAll(
    "[data-mode]"
  )
  .forEach(
    button => {

      button.onclick =
        () => {

          mode =
            button.dataset.mode;


          document
            .querySelectorAll(
              "[data-mode]"
            )
            .forEach(
              item => {

                item.classList.toggle(
                  "active",
                  item === button
                );

              }
            );


          if(
            mode === "image"
          ){

            $("createBtn").textContent =
              "🎨 Create Free Visual";

          }else{

            $("createBtn").textContent =
              "📖 Create Free Tiny Story";

          }

        };

    }
  );


/* =========================
   BUTTONS
========================= */

$("voicePrompt").onclick =
  voice;


$("hearPrompt").onclick =
  () => {

    const text =
      $("prompt")
        .value
        .trim();


    if(!text){

      toast(
        "Write a prompt first"
      );

      return;
    }


    speak(text);

  };


$("improvePrompt").onclick =
  improve;


$("createBtn").onclick =
  create;


/* =========================
   START
========================= */

renderAll();

buildPrompt();

loadStudent();

})();
