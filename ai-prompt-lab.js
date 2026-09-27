(() => {
"use strict";

const ACADEMY_API =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

/*
  AI Worker deploy hone ke baad uska URL yahan use hoga.
  Example:
  https://kids-ai.tanweerstudy25.workers.dev
*/
const AI_API =
  localStorage.getItem("kids_ai_api") || "";

const token =
  localStorage.getItem("brightbyte_student_token") || "";

const $ = id => document.getElementById(id);

let mode = "image";

let selection = {
  subject: "friendly robot",
  place: "sunny garden",
  action: "reading a book",
  style: "colorful cartoon style"
};


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


function toast(text) {

  const box = $("toast");

  box.textContent = text;

  box.classList.add("show");

  clearTimeout(window.__pt);

  window.__pt =
    setTimeout(
      () => box.classList.remove("show"),
      1800
    );

}


function speak(text) {

  if (!("speechSynthesis" in window)) return;

  speechSynthesis.cancel();

  const u =
    new SpeechSynthesisUtterance(text);

  /*
    Hindi/Hinglish support:
    If Hindi characters are found,
    try Hindi voice.
  */

  if (/[\u0900-\u097F]/.test(text)) {

    u.lang = "hi-IN";

  } else {

    u.lang = "en-US";

  }

  u.rate = 0.72;
  u.pitch = 1.05;

  const voices =
    speechSynthesis.getVoices();

  const preferred =
    voices.find(v =>
      v.lang &&
      v.lang.toLowerCase()
        .startsWith(
          u.lang.toLowerCase().split("-")[0]
        )
    );

  if (preferred) {
    u.voice = preferred;
  }

  speechSynthesis.speak(u);

}


function clean(value) {

  return value.replace(
    /^\S+\s/,
    ""
  );

}


function renderChoices(key,id) {

  const box = $(id);

  box.innerHTML =
    data[key]
      .map(value => {

        const cleaned =
          clean(value);

        return `
          <button
            class="${
              cleaned === selection[key]
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


function buildPrompt() {

  const p =
    `A ${selection.subject} ` +
    `${selection.action} in a ` +
    `${selection.place}, ` +
    `${selection.style}.`;

  $("prompt").value =
    p.charAt(0).toUpperCase() +
    p.slice(1);

}


function renderAll() {

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


async function loadStudent() {

  if (!token) {

    location.href =
      "student-login.html";

    return;

  }

  try {

    const response =
      await fetch(
        ACADEMY_API +
        "/api/auth/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          },

          cache: "no-store"
        }
      );


    const result =
      await response.json();


    if (
      response.ok &&
      result.role === "student"
    ) {

      const name =
        result.profile?.display_name ||
        result.profile?.nickname ||
        result.profile?.username ||
        "Student";

      $("studentName").textContent =
        "👤 " + name;

    }

    else {

      location.href =
        "student-login.html";

    }

  }

  catch {

    $("studentName").textContent =
      "👤 Student";

  }

}


function safeLocalPrompt(prompt) {

  /*
    Basic local safety check.
    Main safety should also exist
    inside the AI Worker.
  */

  const blocked =
    /password|otp|home address|phone number|nude|sexual|weapon|kill|blood|drug/i;

  return !blocked.test(prompt);

}


async function callAI(path,body) {

  if (!AI_API) {

    throw new Error(
      "AI Worker is not connected yet."
    );

  }


  const response =
    await fetch(
      AI_API + path,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(body)
      }
    );


  let result = {};

  try {

    result =
      await response.json();

  }

  catch {

    throw new Error(
      "AI returned an invalid response."
    );

  }


  if (!response.ok) {

    throw new Error(
      result.error ||
      "AI request failed"
    );

  }


  return result;

}


async function create() {

  const prompt =
    $("prompt").value.trim();


  if (prompt.length < 3) {

    toast(
      "Say or write a prompt first"
    );

    return;

  }


  if (!safeLocalPrompt(prompt)) {

    toast(
      "Please use a safe learning prompt"
    );

    return;

  }


  $("createBtn").disabled = true;

  $("status").className =
    "status busy";

  $("status").textContent =
    "✨ AI is creating...";


  try {

    if (mode === "image") {

      const result =
        await callAI(
          "/image",
          {
            prompt
          }
        );


      $("outputEmpty").hidden =
        true;

      $("storyOutput").hidden =
        true;

      $("generatedImage").hidden =
        false;


      $("generatedImage").src =
        result.dataUrl ||
        result.url;


      $("status").className =
        "status good";

      $("status").textContent =
        "✅ Picture ready! Compare it with your prompt.";

    }


    else {

      const result =
        await callAI(
          "/chat",
          {

            message:
              "Create a very short, cheerful, " +
              "safe Class 1-3 children's story " +
              "from this prompt. " +
              "Use very easy words. " +
              "Reply in the same language as " +
              "the child's prompt when possible. " +
              "Prompt: " +
              prompt

          }
        );


      $("outputEmpty").hidden =
        true;

      $("generatedImage").hidden =
        true;

      $("storyOutput").hidden =
        false;


      $("storyOutput").textContent =
        result.text ||
        "Story could not be created.";


      $("status").className =
        "status good";

      $("status").textContent =
        "✅ Tiny story ready.";


      if (result.text) {

        speak(
          result.text
        );

      }

    }

  }

  catch(error) {

    $("status").className =
      "status bad";

    $("status").textContent =
      "⚠️ " +
      error.message;


    toast(
      error.message
    );

  }

  finally {

    $("createBtn").disabled =
      false;

  }

}


function improve() {

  const prompt =
    $("prompt").value.trim();


  if (!prompt) {

    buildPrompt();

    return;

  }


  /*
    Hindi prompt ko English me force nahi karte.
    Sirf extra useful details add karte hain.
  */

  if (
    prompt.split(/\s+/).length < 6
  ) {

    if (/[\u0900-\u097F]/.test(prompt)) {

      $("prompt").value =
        prompt.replace(
          /[।.]?$/,
          ""
        ) +
        "। साफ रंग, प्यारा बैकग्राउंड और बच्चों के लिए सुरक्षित कार्टून स्टाइल में।";

    }

    else {

      $("prompt").value =
        prompt.replace(
          /[.]?$/,
          ""
        ) +
        ", with clear colors, a friendly background and a simple child-safe storybook style.";

    }

  }


  toast(
    "✨ Added clearer details"
  );

}


function voice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


  if (!SpeechRecognition) {

    toast(
      "Voice typing is not available in this browser"
    );

    return;

  }


  const recognition =
    new SpeechRecognition();


  /*
    Default Hinglish-friendly setting.
    Chrome can still recognize
    many English words inside Hindi speech.
  */

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

      if (
        $("status").textContent ===
        "🎤 Listening... bolo."
      ) {

        $("status").className =
          "status";

        $("status").textContent =
          "Ready.";

      }

    };


  try {

    recognition.start();

  }

  catch {}

}


document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-key]"
      );


    if (!button) return;


    selection[
      button.dataset.key
    ] =
      button.dataset.value;


    renderAll();

    buildPrompt();

  }
);


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


          $("createBtn").textContent =
            mode === "image"
              ? "✨ Create Picture"
              : "📖 Create Tiny Story";

        };

    }
  );


$("voicePrompt").onclick =
  voice;


$("hearPrompt").onclick =
  () => {

    const text =
      $("prompt").value.trim();

    if (!text) {

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


renderAll();

buildPrompt();

loadStudent();

})();
