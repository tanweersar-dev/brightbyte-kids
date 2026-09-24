const API_BASE =
  "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

const APP = {
  studentName: "Ayaan",
  avatar: "👦",
  className: "Class 1",
  teacherName: "Tannu Sir"
};

let modules = [];

let activeView = "home";
let activeGame = "mouse";

let state = loadState();

const fallbackIcons = [
  "💻",
  "🖥️",
  "🖱️",
  "⌨️",
  "🪟",
  "🎨",
  "✍️",
  "🛡️",
  "🤖",
  "✨"
];

const badgeNames = [
  "Computer Explorer",
  "Parts Detective",
  "Mouse Master",
  "Keyboard Hero",
  "Desktop Explorer",
  "Digital Artist",
  "Typing Star",
  "Safety Hero",
  "AI Explorer",
  "Prompt Creator"
];

const mouseTargets = [
  "Monitor",
  "Keyboard",
  "Mouse",
  "Printer"
];

let mouseIndex = 0;

const typingWords = [
  "COMPUTER",
  "KEYBOARD",
  "MOUSE",
  "ROBOT",
  "INTERNET",
  "SAFETY",
  "PROMPT",
  "LEARN"
];

let typingIndex = 0;

const safetyBank = [
  {
    q:"A website asks for your home address.",
    safe:false
  },
  {
    q:"You ask a parent before opening an unknown link.",
    safe:true
  },
  {
    q:"A stranger asks for your password.",
    safe:false
  },
  {
    q:"You use a learning website with your teacher.",
    safe:true
  },
  {
    q:"You tell a trusted adult when something online feels strange.",
    safe:true
  },
  {
    q:"You share your school name with a random online stranger.",
    safe:false
  }
];

let safetyIndex = 0;

let audioCtx = null;


/* =========================================================
   STATE
========================================================= */

function loadState(){

  const fallback = {
    done: [],
    stars: 120,
    xp: 120,
    streak: 3,
    typingScore: 0,
    safetyScore: 0,
    memoryBest: null,
    sound: true,
    theme: "day"
  };

  try{

    const old =
      JSON.parse(
        localStorage.getItem(
          "brightbyte-pro-v2"
        ) || "{}"
      );

    const current =
      JSON.parse(
        localStorage.getItem(
          "tannu-brightbyte-v3"
        ) || "{}"
      );

    return {
      ...fallback,
      ...old,
      ...current
    };

  }catch{

    return fallback;
  }
}


function saveState(){

  localStorage.setItem(
    "tannu-brightbyte-v3",
    JSON.stringify(state)
  );

  renderDashboard();
}


function $(id){

  return document.getElementById(id);
}


function escapeHtml(v){

  return String(v ?? "")
    .replace(
      /[&<>'"]/g,
      s => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        "'":"&#39;",
        '"':"&quot;"
      }[s])
    );
}


/* =========================================================
   SOUND LAB
========================================================= */

function getAudio(){

  try{

    if(!audioCtx){

      const C =
        window.AudioContext ||
        window.webkitAudioContext;

      audioCtx =
        new C();
    }

    if(
      audioCtx.state ===
      "suspended"
    ){

      audioCtx.resume();
    }

    return audioCtx;

  }catch{

    return null;
  }
}


function tone(
  freq,
  duration = .08,
  type = "sine",
  gain = .045,
  delay = 0
){

  if(!state.sound){
    return;
  }

  const ctx =
    getAudio();

  if(!ctx){
    return;
  }

  const o =
    ctx.createOscillator();

  const g =
    ctx.createGain();

  o.type =
    type;

  o.frequency.value =
    freq;

  const start =
    ctx.currentTime +
    delay;

  g.gain.setValueAtTime(
    gain,
    start
  );

  g.gain.exponentialRampToValueAtTime(
    .001,
    start + duration
  );

  o.connect(g);

  g.connect(
    ctx.destination
  );

  o.start(start);

  o.stop(
    start + duration
  );
}


function playSound(
  kind = "click"
){

  if(!state.sound){
    return;
  }

  const patterns = {

    click:[
      [430,.045,"sine",.035,0]
    ],

    nav:[
      [520,.06,"sine",.04,0],
      [690,.07,"sine",.035,.055]
    ],

    open:[
      [420,.07,"triangle",.04,0],
      [620,.08,"triangle",.04,.06],
      [820,.09,"triangle",.035,.12]
    ],

    success:[
      [660,.08,"sine",.045,0],
      [840,.09,"sine",.045,.07],
      [1040,.12,"sine",.04,.14]
    ],

    wrong:[
      [220,.11,"sawtooth",.025,0],
      [170,.11,"sawtooth",.022,.09]
    ],

    reward:[
      [520,.08,"triangle",.04,0],
      [760,.09,"triangle",.04,.07],
      [980,.11,"triangle",.04,.14],
      [1220,.14,"sine",.035,.22]
    ],

    game:[
      [300,.05,"square",.018,0],
      [500,.05,"square",.018,.05],
      [720,.07,"square",.018,.10]
    ],

    rocket:[
      [420,.07,"sawtooth",.018,0],
      [620,.08,"sawtooth",.018,.06],
      [920,.12,"sine",.035,.12]
    ],

    sparkle:[
      [900,.05,"sine",.025,0],
      [1200,.08,"sine",.02,.05]
    ]
  };

  (
    patterns[kind] ||
    patterns.click
  ).forEach(
    p => tone(...p)
  );
}


/* =========================================================
   TOAST / CELEBRATION
========================================================= */

function toast(msg){

  const t =
    $("toast");

  if(!t){
    return;
  }

  t.textContent =
    msg;

  t.classList.add(
    "show"
  );

  clearTimeout(
    window.__toast
  );

  window.__toast =
    setTimeout(
      () =>
        t.classList.remove(
          "show"
        ),
      2000
    );
}


function celebrate(){

  const layer =
    $("confetti");

  if(!layer){
    return;
  }

  const colors = [
    "#6d5dfc",
    "#27d7c5",
    "#ff66a3",
    "#ffd84d",
    "#ff9b52"
  ];

  for(
    let i = 0;
    i < 55;
    i++
  ){

    const p =
      document.createElement(
        "i"
      );

    p.className =
      "confetti-piece";

    p.style.left =
      Math.random() *
      100 +
      "vw";

    p.style.top =
      (
        -10 -
        Math.random() *
        20
      ) +
      "vh";

    p.style.background =
      colors[
        i %
        colors.length
      ];

    p.style.animationDelay =
      (
        Math.random() *
        .35
      ) +
      "s";

    layer.appendChild(p);

    setTimeout(
      () => p.remove(),
      2300
    );
  }
}


/* =========================================================
   PAGE VIEW SYSTEM
========================================================= */

function showView(
  name,
  withSound = true
){

  const panel =
    document.querySelector(
      `[data-view-panel="${name}"]`
    );

  if(!panel){
    name = "home";
  }

  activeView =
    name;

  document
    .querySelectorAll(
      ".view"
    )
    .forEach(
      v =>
        v.classList.toggle(
          "active",
          v.dataset.viewPanel === name
        )
    );

  document
    .querySelectorAll(
      ".nav-btn"
    )
    .forEach(
      b =>
        b.classList.toggle(
          "active",
          b.dataset.view === name
        )
    );

  $("nav")
    ?.classList
    .remove("open");

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  try{

    history.replaceState(
      null,
      "",
      `#${name}`
    );

  }catch{}


  if(withSound){

    playSound("nav");
  }


  if(
    name ===
    "arcade"
  ){

    setTimeout(
      () => setupMemory(),
      120
    );
  }

  activateReveals();
}


/* =========================================================
   MODAL
========================================================= */

function openModal(html){

  if(
    !$("modalBody") ||
    !$("modal")
  ){

    return;
  }

  $("modalBody")
    .innerHTML =
      html;

  $("modal")
    .classList
    .add("open");

  $("modal")
    .setAttribute(
      "aria-hidden",
      "false"
    );

  document.body.style.overflow =
    "hidden";

  playSound("open");
}


function closeModal(){

  if(!$("modal")){
    return;
  }

  $("modal")
    .classList
    .remove("open");

  $("modal")
    .setAttribute(
      "aria-hidden",
      "true"
    );

  document.body.style.overflow =
    "";

  playSound("click");
}


/* =========================================================
   LOAD MODULES FROM CLOUDFLARE D1
========================================================= */

async function loadModules(){

  try{

    const r =
      await fetch(
        `${API_BASE}/api/modules`,
        {
          cache:"no-store"
        }
      );

    if(!r.ok){

      throw new Error(
        `HTTP ${r.status}`
      );
    }


    const data =
      await r.json();


    if(!data.success){

      throw new Error(
        data.error ||
        "API error"
      );
    }


    modules =
      data.modules

        .sort(
          (a,b) =>
            a.module_number -
            b.module_number
        )

        .map(
          (m,i) => ({
            ...m,
            icon:
              m.icon ||
              fallbackIcons[i],

            badge:
              badgeNames[i] ||
              `Badge ${i+1}`
          })
        );


    renderModules();

    renderDashboard();


    if(
      $("teacherLessonCount")
    ){

      $("teacherLessonCount")
        .textContent =
          modules.reduce(
            (n,m) =>
              n +
              (
                Number(
                  m.lesson_count
                ) || 0
              ),
            0
          );
    }

  }catch(err){

    console.error(err);


    if(
      $("moduleMap")
    ){

      $("moduleMap")
        .innerHTML =
          `
            <article class="panel">

              <h3>
                ⚠️ BrightByte API is not responding
              </h3>

              <p>
                Please check the Worker or internet connection.
              </p>

              <button
                class="cta cta-primary"
                onclick="loadModules()"
              >
                Try Again
              </button>

            </article>
          `;
    }

    toast(
      "Could not load D1 lessons"
    );

    playSound("wrong");
  }
}


/* =========================================================
   RENDER MODULES
========================================================= */

function renderModules(){

  const wrap =
    $("moduleMap");

  if(!wrap){
    return;
  }

  wrap.innerHTML =
    "";


  modules.forEach(
    (m,i) => {

      const done =
        state.done.includes(i);


      const card =
        document.createElement(
          "article"
        );


      card.className =
        `module-card reveal ${
          done
            ? "done"
            : ""
        }`;


      card.dataset.tilt =
        "";


      card.innerHTML =
        `
          <div class="module-orb">
            ${m.icon}
          </div>

          <div>

            <small>
              MODULE ${m.module_number}
            </small>

            <h3>
              ${escapeHtml(m.title)}
            </h3>

            <p>
              ${escapeHtml(m.description || "")}
            </p>

            <div class="module-meta">

              <span>
                📚 ${m.lesson_count || 0} lessons
              </span>

              <span>
                ${
                  done
                    ? "✅ Completed"
                    : "⭐ +20 stars"
                }
              </span>

            </div>

          </div>

          <button
            class="module-go"
            aria-label="Open ${escapeHtml(m.title)}"
          >
            ${
              done
                ? "✓"
                : "→"
            }
          </button>
        `;


      card.onclick =
        () =>
          openModule(i);


      wrap.appendChild(
        card
      );
    }
  );


  activateReveals();

  activateTilt();
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard(){

  if(!modules.length){
    return;
  }


  const total =
    modules.length;


  const done =
    state.done.length;


  const percent =
    Math.round(
      done /
      total *
      100
    );


  if(
    $("studentName")
  ){

    $("studentName")
      .textContent =
        APP.studentName;
  }


  if(
    $("parentStudent")
  ){

    $("parentStudent")
      .textContent =
        `${APP.studentName} • ${APP.className}`;
  }


  if(
    $("kidAvatar")
  ){

    $("kidAvatar")
      .textContent =
        APP.avatar;
  }


  [
    "stars",
    "gameStars",
    "parentStars"
  ].forEach(
    id => {

      if($(id)){

        $(id)
          .textContent =
            state.stars;
      }
    }
  );


  if($("xp")){

    $("xp")
      .textContent =
        state.xp;
  }


  if($("streak")){

    $("streak")
      .textContent =
        state.streak;
  }


  if($("doneCount")){

    $("doneCount")
      .textContent =
        done;
  }


  if($("lessonsDone")){

    $("lessonsDone")
      .textContent =
        done;
  }


  if($("badgeCount")){

    $("badgeCount")
      .textContent =
        done;
  }


  if($("parentBadges")){

    $("parentBadges")
      .textContent =
        `${done} / ${total}`;
  }


  if($("moduleTotal")){

    $("moduleTotal")
      .textContent =
        total;
  }


  if($("percent")){

    $("percent")
      .textContent =
        `${percent}%`;
  }


  if($("heroBar")){

    $("heroBar")
      .style.width =
        `${percent}%`;
  }


  if(
    $("progressRing")
  ){

    $("progressRing")
      .style
      .setProperty(
        "--p",
        `${percent * 3.6}deg`
      );
  }


  let next =
    modules.findIndex(
      (_,i) =>
        !state.done.includes(i)
    );


  if(next < 0){

    next =
      total - 1;
  }


  const focus =
    modules[next];


  if(
    $("missionTitle")
  ){

    $("missionTitle")
      .textContent =
        focus?.title ||
        "Adventure complete";
  }


  if(
    $("focus")
  ){

    $("focus")
      .textContent =
        focus?.title ||
        "Review time";
  }


  if(
    $("teacherNote")
  ){

    $("teacherNote")
      .textContent =
        done === total

          ? "Amazing work! Class 1 is complete. Review favourite lessons, play the games and celebrate the achievement."

          : `Next recommended focus: ${focus?.title}. Keep the session short, visual and practical.`;
  }


  renderBadges();

  renderModulesDoneOnly();
}


/* =========================================================
   COMPLETED MODULE STYLE
========================================================= */

function renderModulesDoneOnly(){

  document
    .querySelectorAll(
      ".module-card"
    )
    .forEach(
      (card,i) => {

        card.classList.toggle(
          "done",
          state.done.includes(i)
        );


        const b =
          card.querySelector(
            ".module-go"
          );


        if(b){

          b.textContent =
            state.done.includes(i)
              ? "✓"
              : "→";
        }
      }
    );
}


/* =========================================================
   BADGES
========================================================= */

function renderBadges(){

  const grid =
    $("badgeGrid");


  if(
    !grid ||
    !modules.length
  ){

    return;
  }


  grid.innerHTML =
    modules

      .map(
        (m,i) =>
          `
            <article
              class="badge-card ${
                state.done.includes(i)
                  ? "unlocked"
                  : "locked"
              }"
            >

              <div class="badge-icon">
                ${m.icon}
              </div>

              <b>
                ${escapeHtml(m.badge)}
              </b>

              <small>
                ${
                  state.done.includes(i)

                    ? "UNLOCKED"

                    : "Complete Module " +
                      (i + 1)
                }
              </small>

            </article>
          `
      )

      .join("");
}


/* =========================================================
   OPEN D1 MODULE
========================================================= */

async function openModule(index){

  const m =
    modules[index];


  if(!m){
    return;
  }


  openModal(
    `
      <div class="lesson-hero">

        <div class="big-icon">
          ${m.icon}
        </div>

        <small>
          MODULE ${m.module_number}
        </small>

        <h2>
          ${escapeHtml(m.title)}
        </h2>

        <p>
          ${escapeHtml(m.description || "")}
        </p>

      </div>

      <div class="lesson-list">

        <b>
          ⏳ Loading lessons from D1...
        </b>

      </div>
    `
  );


  try{

    const r =
      await fetch(
        `${API_BASE}/api/lessons?module=${m.module_number}`,
        {
          cache:"no-store"
        }
      );


    const data =
      await r.json();


    if(!data.success){

      throw new Error(
        data.error ||
        "Lesson API error"
      );
    }


    const lessons =
      data.lessons

        .map(
          l =>
            `
              <article class="lesson-item">

                <small>
                  LESSON ${l.lesson_number}
                  •
                  ${String(l.lesson_type).toUpperCase()}
                </small>

                <h3>
                  ${escapeHtml(l.title)}
                </h3>

                <p>
                  ${escapeHtml(l.short_description || "")}
                </p>

                <div class="lesson-content">
                  ${escapeHtml(l.content || "")}
                </div>

                <span class="lesson-xp">
                  ⭐ ${l.xp_reward} XP
                </span>

              </article>
            `
        )

        .join("");


    $("modalBody")
      .innerHTML =
        `
          <div class="lesson-hero">

            <div class="big-icon">
              ${m.icon}
            </div>

            <small>
              MODULE ${m.module_number}
              •
              ${data.count}
              LESSONS
            </small>

            <h2>
              ${escapeHtml(m.title)}
            </h2>

            <p>
              ${escapeHtml(m.description || "")}
            </p>

          </div>


          <div class="lesson-list">

            ${lessons}

          </div>


          <div class="module-challenge">

            <b>
              🎯 Module Challenge
            </b>

            <p>
              Complete all four lessons,
              explain one new thing you learned,
              then claim your reward.
            </p>

          </div>


          <button
            class="complete-btn"
            onclick="completeModule(${index})"
          >

            ${
              state.done.includes(index)

                ? "✓ Completed — Review Again"

                : "Complete Module • +20 ⭐"
            }

          </button>
        `;

  }catch(err){

    $("modalBody")
      .innerHTML =
        `
          <div class="lesson-hero">

            <div class="big-icon">
              ⚠️
            </div>

            <h2>
              Could not load lessons
            </h2>

            <p>
              ${escapeHtml(err.message)}
            </p>

          </div>


          <button
            class="complete-btn"
            onclick="openModule(${index})"
          >
            Try Again
          </button>
        `;


    playSound(
      "wrong"
    );
  }
}


/* =========================================================
   COMPLETE MODULE
========================================================= */

function completeModule(index){

  if(
    !state.done.includes(index)
  ){

    state.done.push(
      index
    );

    state.stars += 20;

    state.xp += 20;

    state.streak =
      Math.max(
        1,
        state.streak
      );


    saveState();

    renderModules();

    celebrate();

    playSound(
      "reward"
    );

    toast(
      "Badge unlocked! +20 Stars ⭐"
    );

  }else{

    toast(
      "Module already completed ✓"
    );

    playSound(
      "click"
    );
  }


  closeModal();
}


/* =========================================================
   QUICK QUIZ
========================================================= */

function openQuickQuiz(){

  const bank = [

    {
      q:"Which device helps us type letters and numbers?",
      a:[
        "🖱️ Mouse",
        "⌨️ Keyboard",
        "🖨️ Printer"
      ],
      correct:1
    },

    {
      q:"Which action is safest online?",
      a:[
        "Share your password",
        "Ask a trusted adult",
        "Click every link"
      ],
      correct:1
    },

    {
      q:"What does AI stand for?",
      a:[
        "Artificial Intelligence",
        "Automatic Internet",
        "Amazing Icons"
      ],
      correct:0
    },

    {
      q:"What does Backspace do?",
      a:[
        "Prints a page",
        "Removes a character",
        "Turns off sound"
      ],
      correct:1
    }

  ];


  const q =
    bank[
      Math.floor(
        Math.random() *
        bank.length
      )
    ];


  openModal(
    `
      <div class="lesson-hero">

        <div class="big-icon">
          🧠
        </div>

        <small>
          QUICK QUIZ
        </small>

        <h2>
          ${escapeHtml(q.q)}
        </h2>

        <p>
          Choose one answer.
        </p>

      </div>


      <div class="quiz-options">

        ${
          q.a

            .map(
              (x,i) =>
                `
                  <button
                    onclick="answerQuiz(${i === q.correct})"
                  >
                    ${escapeHtml(x)}
                  </button>
                `
            )

            .join("")
        }

      </div>
    `
  );
}


function answerQuiz(ok){

  if(ok){

    state.stars += 10;

    state.xp += 10;

    saveState();

    celebrate();

    playSound(
      "success"
    );

    toast(
      "Correct! +10 Stars ⭐"
    );

    closeModal();

  }else{

    playSound(
      "wrong"
    );

    toast(
      "Good try — choose again 🙂"
    );
  }
}


/* =========================================================
   GAME SETUP
========================================================= */

function setupGames(){

  document
    .querySelectorAll(
      ".game-tab"
    )
    .forEach(
      btn =>
        btn.onclick =
          () =>
            switchGame(
              btn.dataset.game
            )
    );


  document
    .querySelectorAll(
      ".parts-grid button"
    )
    .forEach(
      btn =>
        btn.onclick =
          () => {

            if(
              btn.dataset.part ===
              mouseTargets[mouseIndex]
            ){

              state.stars += 5;

              state.xp += 5;

              saveState();

              playSound(
                "success"
              );

              toast(
                "Great click! +5 ⭐"
              );


              mouseIndex =
                (
                  mouseIndex +
                  1
                ) %
                mouseTargets.length;


              if(
                $("mouseTarget")
              ){

                $("mouseTarget")
                  .textContent =
                    mouseTargets[
                      mouseIndex
                    ];
              }

            }else{

              playSound(
                "wrong"
              );

              toast(
                "Try another part 🙂"
              );
            }
          }
    );


  setupMemory();


  if(
    $("typingInput")
  ){

    $("typingInput")
      .addEventListener(
        "keydown",
        e => {

          if(
            e.key ===
            "Enter"
          ){

            checkTyping();
          }
        }
      );
  }
}


/* =========================================================
   SWITCH GAME
========================================================= */

function switchGame(name){

  activeGame =
    name;


  playSound(
    "game"
  );


  document
    .querySelectorAll(
      ".game-tab"
    )
    .forEach(
      b =>
        b.classList.toggle(
          "active",
          b.dataset.game === name
        )
    );


  document
    .querySelectorAll(
      ".game-panel"
    )
    .forEach(
      p =>
        p.classList.toggle(
          "active",
          p.id ===
          `game-${name}`
        )
    );


  if(
    name ===
    "memory"
  ){

    setupMemory();
  }
}


/* =========================================================
   MEMORY GAME
========================================================= */

function setupMemory(){

  const grid =
    $("memoryGrid");


  if(!grid){
    return;
  }


  const items = [
    "💻",
    "⌨️",
    "🖱️",
    "🤖",
    "💻",
    "⌨️",
    "🖱️",
    "🤖"
  ]
  .sort(
    () =>
      Math.random() -
      .5
  );


  grid.innerHTML =
    items

      .map(
        (v,i) =>
          `
            <button
              class="memory-card"
              data-value="${v}"
              data-i="${i}"
            >
              <span>
                ${v}
              </span>
            </button>
          `
      )

      .join("");


  if(
    $("memoryFlips")
  ){

    $("memoryFlips")
      .textContent =
        "0";
  }


  let open = [];

  let lock =
    false;

  let flips =
    0;


  grid
    .querySelectorAll(
      ".memory-card"
    )
    .forEach(
      c =>
        c.onclick =
          () => {

            if(
              lock ||
              c.classList.contains(
                "matched"
              ) ||
              c.classList.contains(
                "open"
              )
            ){

              return;
            }


            playSound(
              "click"
            );


            c.classList.add(
              "open"
            );


            open.push(c);


            if(
              open.length ===
              2
            ){

              flips++;


              if(
                $("memoryFlips")
              ){

                $("memoryFlips")
                  .textContent =
                    flips;
              }


              lock =
                true;


              setTimeout(
                () => {

                  if(
                    open[0].dataset.value ===
                    open[1].dataset.value
                  ){

                    open.forEach(
                      x =>
                        x.classList.add(
                          "matched"
                        )
                    );


                    playSound(
                      "success"
                    );


                    if(
                      grid
                        .querySelectorAll(
                          ".matched"
                        )
                        .length ===
                      8
                    ){

                      state.stars +=
                        20;

                      state.xp +=
                        20;


                      state.memoryBest =
                        state.memoryBest

                          ? Math.min(
                              state.memoryBest,
                              flips
                            )

                          : flips;


                      saveState();

                      celebrate();

                      playSound(
                        "reward"
                      );

                      toast(
                        "Memory Master! +20 ⭐"
                      );
                    }

                  }else{

                    open.forEach(
                      x =>
                        x.classList.remove(
                          "open"
                        )
                    );


                    playSound(
                      "wrong"
                    );
                  }


                  open = [];

                  lock =
                    false;

                },
                520
              );
            }
          }
    );
}


/* =========================================================
   TYPING ROCKET
========================================================= */

function checkTyping(){

  const input =
    $("typingInput");


  if(!input){
    return;
  }


  const word =
    typingWords[
      typingIndex
    ];


  if(
    input.value
      .trim()
      .toUpperCase() ===
    word
  ){

    state.typingScore++;

    state.stars += 5;

    state.xp += 5;


    saveState();


    if(
      $("typingScore")
    ){

      $("typingScore")
        .textContent =
          state.typingScore;
    }


    if(
      $("rocket")
    ){

      $("rocket")
        .classList
        .add(
          "launch"
        );
    }


    playSound(
      "rocket"
    );


    toast(
      "Rocket launched! +5 ⭐"
    );


    setTimeout(
      () => {

        if(
          $("rocket")
        ){

          $("rocket")
            .classList
            .remove(
              "launch"
            );
        }


        typingIndex =
          (
            typingIndex +
            1
          ) %
          typingWords.length;


        if(
          $("typingWord")
        ){

          $("typingWord")
            .textContent =
              typingWords[
                typingIndex
              ];
        }


        input.value =
          "";


        input.focus();

      },
      680
    );

  }else{

    playSound(
      "wrong"
    );

    toast(
      "Check the spelling and try again"
    );
  }
}


/* =========================================================
   INTERNET SAFETY GAME
========================================================= */

function answerSafety(
  answer
){

  const item =
    safetyBank[
      safetyIndex
    ];


  if(
    answer ===
    item.safe
  ){

    state.safetyScore++;

    state.stars += 5;

    state.xp += 5;


    saveState();


    if(
      $("safetyScore")
    ){

      $("safetyScore")
        .textContent =
          state.safetyScore;
    }


    playSound(
      "success"
    );


    toast(
      "Safe choice! +5 ⭐"
    );

  }else{

    playSound(
      "wrong"
    );


    toast(
      "Think about privacy and trusted adults"
    );
  }


  safetyIndex =
    (
      safetyIndex +
      1
    ) %
    safetyBank.length;


  if(
    $("safetyQuestion")
  ){

    $("safetyQuestion")
      .textContent =
        safetyBank[
          safetyIndex
        ].q;
  }
}


/* =========================================================
   AI PROMPT BUILDER
========================================================= */

function buildPrompt(){

  const prompt =
    `
      ${$("promptWho").value}
      ${$("promptWhere").value},
      ${$("promptWhat").value}.
      Make it colourful,
      friendly and suitable for a child.
    `
    .replace(
      /\s+/g,
      " "
    )
    .trim();


  if(
    $("promptOutput")
  ){

    $("promptOutput")
      .textContent =
        prompt;
  }


  state.stars += 3;

  state.xp += 3;


  saveState();


  playSound(
    "sparkle"
  );


  toast(
    "Prompt created! +3 ⭐"
  );
}


/* =========================================================
   CERTIFICATE
========================================================= */

function showCertificate(){

  const pct =
    Math.round(
      state.done.length /
      Math.max(
        modules.length,
        1
      ) *
      100
    );


  openModal(
    `
      <div class="certificate">

        <div class="seal">
          🏅
        </div>

        <small>
          CERTIFICATE OF ACHIEVEMENT
        </small>

        <h2>
          Computer & AI Explorer
        </h2>

        <p>
          This recognizes the learning progress of
        </p>

        <div class="certificate-name">
          ${escapeHtml(APP.studentName)}
        </div>

        <p>
          <b>
            ${escapeHtml(APP.className)}
          </b>

          •

          ${pct}% course progress

          •

          ${state.stars} stars
        </p>

        <p>
          <b>
            ${escapeHtml(APP.teacherName)}'s BrightByte Galaxy
          </b>
        </p>

      </div>
    `
  );


  playSound(
    "reward"
  );
}


/* =========================================================
   RESET
========================================================= */

function resetProgress(){

  if(
    confirm(
      "Reset BrightByte demo progress, scores and stars?"
    )
  ){

    state = {
      done: [],
      stars: 120,
      xp: 120,
      streak: 3,
      typingScore: 0,
      safetyScore: 0,
      memoryBest: null,
      sound: state.sound,
      theme: state.theme
    };


    saveState();

    renderModules();

    setupMemory();


    toast(
      "Demo progress reset"
    );


    playSound(
      "nav"
    );
  }
}


/* =========================================================
   THEME
========================================================= */

function applyTheme(){

  document.body
    .classList
    .toggle(
      "night",
      state.theme ===
      "night"
    );


  if(
    $("themeBtn")
  ){

    $("themeBtn")
      .textContent =
        state.theme ===
        "night"

          ? "☀️ Day"

          : "🌙 Night";
  }
}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

function setupReveals(){

  const io =
    new IntersectionObserver(
      entries =>
        entries.forEach(
          e => {

            if(
              e.isIntersecting
            ){

              e.target
                .classList
                .add(
                  "visible"
                );


              io.unobserve(
                e.target
              );
            }
          }
        ),
      {
        threshold:.08
      }
    );


  document
    .querySelectorAll(
      ".reveal"
    )
    .forEach(
      el =>
        io.observe(el)
    );
}


function activateReveals(){

  document
    .querySelectorAll(
      ".view.active .reveal"
    )
    .forEach(
      el =>
        requestAnimationFrame(
          () =>
            el.classList.add(
              "visible"
            )
        )
    );
}


/* =========================================================
   3D TILT
========================================================= */

function activateTilt(){

  if(
    window.matchMedia(
      "(pointer:coarse)"
    ).matches
  ){

    return;
  }


  document
    .querySelectorAll(
      "[data-tilt]"
    )
    .forEach(
      el => {

        if(
          el.dataset.tiltReady
        ){

          return;
        }


        el.dataset.tiltReady =
          "1";


        el.addEventListener(
          "pointermove",
          e => {

            const r =
              el.getBoundingClientRect();


            const x =
              (
                e.clientX -
                r.left
              ) /
              r.width -
              .5;


            const y =
              (
                e.clientY -
                r.top
              ) /
              r.height -
              .5;


            el.style.transform =
              `
                perspective(900px)
                rotateX(${(-y * 5).toFixed(2)}deg)
                rotateY(${(x * 6).toFixed(2)}deg)
              `;
          }
        );


        el.addEventListener(
          "pointerleave",
          () =>
            el.style.transform =
              ""
        );
      }
    );
}


/* =========================================================
   UI SETUP
========================================================= */

function setupUI(){

  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(
      btn =>
        btn.addEventListener(
          "click",
          e => {

            e.preventDefault();

            showView(
              btn.dataset.view
            );
          }
        )
    );


  if(
    $("menuBtn")
  ){

    $("menuBtn")
      .onclick =
        () => {

          playSound(
            "click"
          );

          $("nav")
            ?.classList
            .toggle(
              "open"
            );
        };
  }


  if(
    $("modal")
  ){

    $("modal")
      .onclick =
        e => {

          if(
            e.target.id ===
            "modal"
          ){

            closeModal();
          }
        };
  }


  document
    .addEventListener(
      "keydown",
      e => {

        if(
          e.key ===
          "Escape"
        ){

          closeModal();
        }
      }
    );


  if(
    $("soundBtn")
  ){

    $("soundBtn")
      .onclick =
        () => {

          state.sound =
            !state.sound;


          saveState();


          $("soundBtn")
            .textContent =
              state.sound

                ? "🔊 Sound"

                : "🔇 Muted";


          if(
            state.sound
          ){

            playSound(
              "success"
            );
          }
        };
  }


  if(
    $("themeBtn")
  ){

    $("themeBtn")
      .onclick =
        () => {

          state.theme =
            state.theme ===
            "night"

              ? "day"

              : "night";


          applyTheme();


          saveState();


          playSound(
            "sparkle"
          );
        };
  }


  applyTheme();


  if(
    $("soundBtn")
  ){

    $("soundBtn")
      .textContent =
        state.sound

          ? "🔊 Sound"

          : "🔇 Muted";
  }


  setupGames();

  setupReveals();

  activateTilt();


  const start =
    (
      location.hash ||
      "#home"
    )
    .slice(1);


  showView(
    document.querySelector(
      `[data-view-panel="${start}"]`
    )

      ? start

      : "home",

    false
  );
}


/* =========================================================
   START APP
========================================================= */

async function init(){

  setupUI();


  await loadModules();


  if(
    $("typingScore")
  ){

    $("typingScore")
      .textContent =
        state.typingScore;
  }


  if(
    $("safetyScore")
  ){

    $("safetyScore")
      .textContent =
        state.safetyScore;
  }


  console.log(
    "Tannu Sir's BrightByte Galaxy V3 connected to Cloudflare D1 🚀"
  );
}


init();
