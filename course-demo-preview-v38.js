/* =========================================================
   V38 — PREMIUM COURSE DEMO + STUDY MATERIAL PREVIEW
   Tannu Sir's Kids Digital Academy

   ONLY appears inside:
   #course  → 90-Day Program page

   No external library required.
   ========================================================= */

(() => {
  "use strict";

  const VERSION = "V38-course-demo-preview";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    const coursePage = document.getElementById("course");
    if (!coursePage) return;

    if (document.getElementById("tdpPreview")) return;

    /* =====================================================
       CSS
       ===================================================== */

    const style = document.createElement("style");
    style.id = "tdpPreviewStyles";

    style.textContent = `
    /* ===============================
       V38 COURSE PREVIEW
       =============================== */

    #tdpPreview,
    #tdpPreview * {
      box-sizing: border-box;
    }

    #tdpPreview {
      --tdp-bg: #06152b;
      --tdp-panel: rgba(10, 34, 60, .86);
      --tdp-panel2: rgba(17, 42, 75, .82);
      --tdp-line: rgba(83, 211, 255, .24);
      --tdp-text: #f6fbff;
      --tdp-muted: #9eb7d1;
      --tdp-cyan: #2de3ff;
      --tdp-blue: #4f8cff;
      --tdp-purple: #9d66ff;
      --tdp-pink: #ff62bd;
      --tdp-orange: #ffb33e;
      --tdp-green: #46e7b1;
      --tdp-red: #ff6b79;

      margin: 28px 0 0;
      position: relative;
      overflow: hidden;
      color: var(--tdp-text);
      font-family: inherit;
    }

    #tdpPreview::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: .28;
      background:
        radial-gradient(circle at 8% 16%, rgba(45,227,255,.22), transparent 26%),
        radial-gradient(circle at 90% 8%, rgba(157,102,255,.22), transparent 28%),
        radial-gradient(circle at 70% 90%, rgba(255,179,62,.12), transparent 26%);
    }

    .tdp-shell {
      position: relative;
      z-index: 2;
      border: 1px solid var(--tdp-line);
      border-radius: 24px;
      padding: 22px;
      background:
        linear-gradient(145deg, rgba(4,20,39,.97), rgba(7,26,49,.94));
      box-shadow:
        0 26px 80px rgba(0,0,0,.24),
        inset 0 1px 0 rgba(255,255,255,.05);
      overflow: hidden;
    }

    .tdp-shell::after {
      content: "";
      position: absolute;
      width: 360px;
      height: 360px;
      border-radius: 50%;
      top: -180px;
      right: -140px;
      background: rgba(45,227,255,.06);
      filter: blur(6px);
      pointer-events: none;
    }

    .tdp-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 20px;
    }

    .tdp-kicker {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      color: var(--tdp-cyan);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
      margin-bottom: 7px;
    }

    .tdp-kicker-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--tdp-green);
      box-shadow: 0 0 16px var(--tdp-green);
      animation: tdpPulse 1.6s infinite;
    }

    .tdp-head h2 {
      margin: 0;
      font-size: clamp(22px, 3vw, 36px);
      line-height: 1.08;
      color: #fff;
    }

    .tdp-head p {
      margin: 8px 0 0;
      color: var(--tdp-muted);
      max-width: 760px;
      line-height: 1.6;
      font-size: 14px;
    }

    .tdp-live {
      flex: 0 0 auto;
      min-width: 170px;
      padding: 11px 14px;
      border-radius: 14px;
      border: 1px solid rgba(70,231,177,.28);
      background: rgba(70,231,177,.08);
      color: #b9ffe6;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      gap: 9px;
      align-items: center;
    }

    .tdp-tabs {
      display: inline-flex;
      gap: 8px;
      padding: 6px;
      border-radius: 16px;
      background: rgba(255,255,255,.045);
      border: 1px solid rgba(255,255,255,.07);
      margin-bottom: 20px;
      position: relative;
      z-index: 3;
    }

    .tdp-tab {
      border: 0;
      color: #bfd0e2;
      background: transparent;
      padding: 11px 18px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 900;
      font-family: inherit;
      transition: .25s ease;
    }

    .tdp-tab:hover {
      color: #fff;
      background: rgba(255,255,255,.06);
      transform: translateY(-1px);
    }

    .tdp-tab.active {
      color: #071c2d;
      background:
        linear-gradient(135deg, var(--tdp-cyan), #7ee9ff);
      box-shadow:
        0 10px 28px rgba(45,227,255,.19),
        inset 0 1px 0 rgba(255,255,255,.6);
    }

    .tdp-stage {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(320px, .8fr);
      gap: 18px;
      position: relative;
      z-index: 2;
    }

    .tdp-panel {
      border-radius: 20px;
      border: 1px solid rgba(73,204,255,.18);
      background:
        linear-gradient(155deg, rgba(14,39,68,.95), rgba(9,27,50,.93));
      padding: 18px;
      overflow: hidden;
      position: relative;
    }

    .tdp-panel::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 2px;
      opacity: .85;
      background:
        linear-gradient(90deg, transparent, var(--tdp-cyan), transparent);
    }

    .tdp-panel-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }

    .tdp-panel-title h3 {
      margin: 0;
      color: #fff;
      font-size: 17px;
    }

    .tdp-panel-title small {
      color: #708baa;
      font-weight: 800;
      font-size: 10px;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .tdp-labs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .tdp-lab-card {
      min-height: 215px;
      border-radius: 17px;
      border: 1px solid rgba(255,255,255,.08);
      background:
        linear-gradient(160deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
      padding: 15px;
      position: relative;
      overflow: hidden;
      transition: transform .28s ease, border-color .28s ease, box-shadow .28s ease;
      cursor: pointer;
    }

    .tdp-lab-card:hover {
      transform: translateY(-6px);
      border-color: rgba(45,227,255,.38);
      box-shadow: 0 18px 38px rgba(0,0,0,.2);
    }

    .tdp-lab-card.selected {
      border-color: rgba(45,227,255,.65);
      box-shadow:
        0 0 0 1px rgba(45,227,255,.08),
        0 16px 34px rgba(20,147,196,.16);
    }

    .tdp-lab-icon {
      width: 44px;
      height: 44px;
      border-radius: 13px;
      display: grid;
      place-items: center;
      font-size: 22px;
      margin-bottom: 12px;
      background:
        linear-gradient(145deg, rgba(45,227,255,.12), rgba(157,102,255,.12));
      border: 1px solid rgba(255,255,255,.08);
    }

    .tdp-lab-card b {
      color: #fff;
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .tdp-lab-card p {
      margin: 0;
      font-size: 11px;
      line-height: 1.55;
      color: var(--tdp-muted);
      min-height: 50px;
    }

    .tdp-demo-window {
      margin-top: 14px;
      min-height: 80px;
      border-radius: 11px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(2,12,24,.72);
      padding: 10px;
      overflow: hidden;
      position: relative;
    }

    .tdp-demo-window::after {
      content: "";
      width: 70px;
      height: 70px;
      position: absolute;
      top: -38px;
      right: -28px;
      border-radius: 50%;
      background: rgba(45,227,255,.08);
    }

    .tdp-code-line {
      display: flex;
      align-items: center;
      gap: 7px;
      margin: 5px 0;
      color: #b7cae1;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 9px;
    }

    .tdp-code-dot {
      width: 5px;
      height: 5px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: var(--tdp-cyan);
      box-shadow: 0 0 7px var(--tdp-cyan);
    }

    .tdp-type-text {
      color: #cceaff;
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 10px;
      line-height: 1.6;
      min-height: 32px;
    }

    .tdp-cursor {
      display: inline-block;
      width: 6px;
      height: 12px;
      vertical-align: -2px;
      background: var(--tdp-cyan);
      margin-left: 2px;
      animation: tdpBlink .85s infinite;
    }

    .tdp-hardware {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
      height: 58px;
    }

    .tdp-hardware span {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 9px;
      background: rgba(79,140,255,.12);
      border: 1px solid rgba(79,140,255,.26);
      font-size: 15px;
      position: relative;
      animation: tdpFloat 2.2s ease-in-out infinite;
    }

    .tdp-hardware span:nth-child(2) { animation-delay: .22s; }
    .tdp-hardware span:nth-child(3) { animation-delay: .44s; }

    .tdp-hardware i {
      width: 12px;
      height: 1px;
      background: var(--tdp-cyan);
      box-shadow: 0 0 7px var(--tdp-cyan);
    }

    .tdp-safety-row {
      display: flex;
      gap: 7px;
      margin-top: 8px;
    }

    .tdp-safety-row span {
      flex: 1;
      padding: 7px 5px;
      border-radius: 8px;
      font-size: 9px;
      text-align: center;
      font-weight: 900;
    }

    .tdp-safe {
      background: rgba(70,231,177,.13);
      border: 1px solid rgba(70,231,177,.3);
      color: #9fffdc;
      animation: tdpSafeGlow 2s infinite;
    }

    .tdp-unsafe {
      background: rgba(255,107,121,.09);
      border: 1px solid rgba(255,107,121,.22);
      color: #ffb0b9;
    }

    .tdp-ai-flow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      height: 58px;
    }

    .tdp-ai-flow span {
      font-size: 8px;
      padding: 7px 7px;
      border-radius: 8px;
      border: 1px solid rgba(157,102,255,.24);
      background: rgba(157,102,255,.1);
      color: #dccfff;
      white-space: nowrap;
    }

    .tdp-ai-flow i {
      color: var(--tdp-cyan);
      font-style: normal;
      animation: tdpArrow 1.1s infinite;
    }

    .tdp-side-stack {
      display: grid;
      gap: 12px;
    }

    .tdp-material-card {
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.075);
      background: rgba(255,255,255,.035);
      padding: 14px;
      display: grid;
      grid-template-columns: 42px 1fr auto;
      gap: 12px;
      align-items: center;
      position: relative;
      overflow: hidden;
      transition: .25s ease;
    }

    .tdp-material-card:hover {
      transform: translateX(4px);
      border-color: rgba(45,227,255,.28);
      background: rgba(45,227,255,.045);
    }

    .tdp-material-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      font-size: 20px;
      background: rgba(255,255,255,.06);
    }

    .tdp-material-card b {
      display: block;
      color: #fff;
      font-size: 12px;
      margin-bottom: 4px;
    }

    .tdp-material-card small {
      display: block;
      color: var(--tdp-muted);
      font-size: 9px;
      line-height: 1.45;
    }

    .tdp-lock {
      font-size: 9px;
      font-weight: 900;
      color: #ffd786;
      background: rgba(255,179,62,.09);
      border: 1px solid rgba(255,179,62,.2);
      border-radius: 999px;
      padding: 5px 8px;
      white-space: nowrap;
    }

    .tdp-progress-wrap {
      margin-top: 14px;
      padding: 13px;
      border-radius: 14px;
      border: 1px solid rgba(45,227,255,.12);
      background: rgba(45,227,255,.035);
    }

    .tdp-progress-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 10px;
      color: #b6c8db;
      font-weight: 800;
    }

    .tdp-progress {
      height: 7px;
      border-radius: 99px;
      background: rgba(255,255,255,.07);
      overflow: hidden;
    }

    .tdp-progress > span {
      display: block;
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background:
        linear-gradient(90deg, var(--tdp-cyan), var(--tdp-purple), var(--tdp-pink));
      box-shadow: 0 0 14px rgba(45,227,255,.3);
      transition: width 1.3s cubic-bezier(.2,.8,.2,1);
    }

    .tdp-path {
      margin-top: 18px;
      border-radius: 20px;
      border: 1px solid rgba(45,227,255,.16);
      background: rgba(3,16,31,.72);
      padding: 18px;
      position: relative;
      overflow: hidden;
    }

    .tdp-path-title {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 17px;
    }

    .tdp-path-title h3 {
      margin: 0;
      font-size: 16px;
      color: #fff;
    }

    .tdp-path-title small {
      color: #728ba7;
      font-size: 9px;
      font-weight: 800;
    }

    .tdp-path-line {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 14px;
      align-items: center;
    }

    .tdp-step {
      min-height: 120px;
      border-radius: 15px;
      border: 1px solid rgba(255,255,255,.07);
      background:
        linear-gradient(150deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
      display: grid;
      place-items: center;
      text-align: center;
      padding: 12px;
      position: relative;
      transition: .28s ease;
    }

    .tdp-step:not(:last-child)::after {
      content: "➜";
      position: absolute;
      right: -22px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--tdp-cyan);
      text-shadow: 0 0 12px rgba(45,227,255,.7);
      z-index: 5;
      animation: tdpArrow 1.2s infinite;
    }

    .tdp-step:hover {
      transform: translateY(-5px);
      border-color: rgba(45,227,255,.34);
    }

    .tdp-step-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 11px;
      margin: 0 auto 8px;
      background: rgba(45,227,255,.08);
      border: 1px solid rgba(45,227,255,.16);
      font-size: 18px;
    }

    .tdp-step b {
      color: #fff;
      display: block;
      font-size: 11px;
      margin-bottom: 3px;
    }

    .tdp-step small {
      color: var(--tdp-muted);
      font-size: 8px;
      line-height: 1.35;
      display: block;
    }

    .tdp-cta {
      margin-top: 18px;
      padding: 17px 18px;
      border-radius: 18px;
      border: 1px solid rgba(255,179,62,.22);
      background:
        linear-gradient(135deg,
          rgba(255,179,62,.09),
          rgba(157,102,255,.07),
          rgba(45,227,255,.07)
        );
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
    }

    .tdp-cta strong {
      color: #fff;
      font-size: 15px;
      display: block;
      margin-bottom: 4px;
    }

    .tdp-cta p {
      color: var(--tdp-muted);
      font-size: 11px;
      margin: 0;
      line-height: 1.5;
    }

    .tdp-cta-actions {
      display: flex;
      gap: 8px;
      flex: 0 0 auto;
    }

    .tdp-btn {
      border: 0;
      cursor: pointer;
      border-radius: 12px;
      padding: 10px 14px;
      font-family: inherit;
      font-size: 10px;
      font-weight: 900;
      transition: .22s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .tdp-btn:hover {
      transform: translateY(-2px);
    }

    .tdp-btn-primary {
      color: #071c2d;
      background:
        linear-gradient(135deg, var(--tdp-cyan), #76ebff);
      box-shadow: 0 10px 24px rgba(45,227,255,.16);
    }

    .tdp-btn-secondary {
      color: #fff;
      background: rgba(255,255,255,.065);
      border: 1px solid rgba(255,255,255,.09);
    }

    .tdp-reveal {
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity .65s ease,
        transform .65s ease;
    }

    .tdp-reveal.show {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes tdpPulse {
      0%,100% { transform: scale(1); opacity: .75; }
      50% { transform: scale(1.35); opacity: 1; }
    }

    @keyframes tdpBlink {
      0%,45% { opacity: 1; }
      46%,100% { opacity: 0; }
    }

    @keyframes tdpFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    @keyframes tdpSafeGlow {
      0%,100% { box-shadow: 0 0 0 rgba(70,231,177,0); }
      50% { box-shadow: 0 0 16px rgba(70,231,177,.18); }
    }

    @keyframes tdpArrow {
      0%,100% { transform: translateX(0); opacity: .65; }
      50% { transform: translateX(4px); opacity: 1; }
    }

    @media (max-width: 1050px) {
      .tdp-stage {
        grid-template-columns: 1fr;
      }

      .tdp-labs {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 760px) {
      .tdp-shell {
        padding: 15px;
        border-radius: 18px;
      }

      .tdp-head {
        align-items: flex-start;
        flex-direction: column;
      }

      .tdp-live {
        min-width: 0;
        width: 100%;
      }

      .tdp-tabs {
        width: 100%;
      }

      .tdp-tab {
        flex: 1;
        padding: 10px 7px;
      }

      .tdp-labs {
        grid-template-columns: 1fr;
      }

      .tdp-path-line {
        grid-template-columns: 1fr;
      }

      .tdp-step:not(:last-child)::after {
        content: "↓";
        right: 50%;
        top: auto;
        bottom: -22px;
        transform: translateX(50%);
      }

      .tdp-cta {
        flex-direction: column;
        align-items: stretch;
      }

      .tdp-cta-actions {
        width: 100%;
      }

      .tdp-btn {
        flex: 1;
      }
    }
    `;

    document.head.appendChild(style);

    /* =====================================================
       CONTENT DATA
       ===================================================== */

    const data = {
      junior: {
        title: "Class 1–3 • Foundation Explorer",
        subtitle:
          "Simple visual learning with mouse, keyboard, computer parts, safety, English and first AI activities.",

        labs: [
          {
            icon: "🖱️",
            title: "Mouse & Keyboard Lab",
            text:
              "Kids learn click, drag, letters, spacebar and simple typing through guided practice.",
            demo: `
              <div class="tdp-type-text">
                Type: HELLO<br>
                <span data-tdp-type></span><span class="tdp-cursor"></span>
              </div>
            `
          },
          {
            icon: "🖥️",
            title: "Computer Parts Lab",
            text:
              "Animated hardware objects help children identify monitor, keyboard, mouse and system unit.",
            demo: `
              <div class="tdp-hardware">
                <span>🖥️</span><i></i>
                <span>⌨️</span><i></i>
                <span>🖱️</span>
              </div>
            `
          },
          {
            icon: "🛡️",
            title: "Safe Internet Game",
            text:
              "Short picture challenges teach children what is safe and what needs adult help.",
            demo: `
              <div class="tdp-safety-row">
                <span class="tdp-safe">✓ SAFE</span>
                <span class="tdp-unsafe">✕ ASK ADULT</span>
              </div>
              <div class="tdp-code-line">
                <span class="tdp-code-dot"></span>
                Never share your password
              </div>
            `
          }
        ],

        materials: [
          ["📘", "Picture Lessons", "Computer basics with simple visual explanations."],
          ["🎧", "Listen & Repeat", "Spoken English guided listening practice."],
          ["🧩", "Mini Activities", "Short quizzes, matching and problem solving."],
          ["⭐", "Rewards & Badges", "Positive progress milestones for completed skills."]
        ],

        path: [
          ["👀", "Look", "See the idea"],
          ["🔊", "Listen", "Hear guidance"],
          ["✋", "Try", "Practice safely"],
          ["🎮", "Play", "Complete challenge"],
          ["⭐", "Grow", "Earn progress"]
        ],

        progress: 38,
        typing: ["H", "HE", "HEL", "HELL", "HELLO"]
      },

      senior: {
        title: "Class 4–6 • Future Skills Explorer",
        subtitle:
          "Advanced practical learning with troubleshooting, cyber safety, AI prompts, typing and digital missions.",

        labs: [
          {
            icon: "🛠️",
            title: "Troubleshooting Lab",
            text:
              "Students follow real IT logic: identify the issue, test the cause and choose a safe fix.",
            demo: `
              <div class="tdp-ai-flow">
                <span>ISSUE</span>
                <i>➜</i>
                <span>TEST</span>
                <i>➜</i>
                <span>FIX</span>
              </div>
            `
          },
          {
            icon: "🤖",
            title: "AI Prompt Lab",
            text:
              "Students learn how clear instructions improve AI output while checking answers critically.",
            demo: `
              <div class="tdp-ai-flow">
                <span>WHO</span>
                <i>➜</i>
                <span>TASK</span>
                <i>➜</i>
                <span>DETAIL</span>
              </div>
            `
          },
          {
            icon: "🔐",
            title: "Cyber Safety Mission",
            text:
              "Password, privacy, phishing and safe browsing skills are practised through short scenarios.",
            demo: `
              <div class="tdp-safety-row">
                <span class="tdp-safe">✓ VERIFY</span>
                <span class="tdp-unsafe">⚠ PHISHING?</span>
              </div>
              <div class="tdp-code-line">
                <span class="tdp-code-dot"></span>
                Check sender + link first
              </div>
            `
          }
        ],

        materials: [
          ["💻", "Practical Labs", "Interactive hardware, software and troubleshooting missions."],
          ["🤖", "AI Skill Practice", "Prompt building, evaluation and safe AI use."],
          ["⌨️", "Typing Challenges", "Accuracy, keyboard shortcuts and digital productivity."],
          ["📊", "Progress Reports", "Skills, stars, completed missions and parent visibility."]
        ],

        path: [
          ["💡", "Learn", "Understand concept"],
          ["🎯", "Challenge", "Solve task"],
          ["🛠️", "Create", "Build solution"],
          ["🧠", "Demonstrate", "Show skill"],
          ["🏆", "Achieve", "Earn progress"]
        ],

        progress: 64,
        typing: [
          "Check",
          "Check IP",
          "Check IP → Ping",
          "Check IP → Ping → DNS",
          "Check IP → Ping → DNS → Fix"
        ]
      }
    };

    /* =====================================================
       MARKUP
       ===================================================== */

    const wrapper = document.createElement("div");
    wrapper.id = "tdpPreview";
    wrapper.className = "tdp-reveal";

    wrapper.innerHTML = `
      <div class="tdp-shell">

        <div class="tdp-head">
          <div>
            <div class="tdp-kicker">
              <span class="tdp-kicker-dot"></span>
              ENROLLMENT PREVIEW • SAMPLE LEARNING EXPERIENCE
            </div>

            <h2>See How Kids Learn Before Enrolling</h2>

            <p>
              A small animated preview of the labs, study materials and guided
              learning journey available inside Tannu Sir's Kids Digital Academy.
            </p>
          </div>

          <div class="tdp-live">
            <span class="tdp-kicker-dot"></span>
            LIVE DEMO PREVIEW
          </div>
        </div>

        <div class="tdp-tabs">
          <button type="button" class="tdp-tab active" data-tdp-tab="junior">
            🌱 Class 1–3
          </button>

          <button type="button" class="tdp-tab" data-tdp-tab="senior">
            🚀 Class 4–6
          </button>
        </div>

        <div class="tdp-stage">

          <section class="tdp-panel">
            <div class="tdp-panel-title">
              <div>
                <h3 id="tdpGroupTitle">Interactive Demo Labs</h3>
              </div>
              <small id="tdpGroupSub">Class 1–3</small>
            </div>

            <div class="tdp-labs" id="tdpLabs"></div>

            <div class="tdp-progress-wrap">
              <div class="tdp-progress-head">
                <span id="tdpStatusText">Sample lesson journey</span>
                <span id="tdpProgressText">38% preview</span>
              </div>

              <div class="tdp-progress">
                <span id="tdpProgressBar"></span>
              </div>
            </div>
          </section>

          <aside class="tdp-panel">
            <div class="tdp-panel-title">
              <h3>Study Material Preview</h3>
              <small>FULL ACCESS AFTER ENROLLMENT</small>
            </div>

            <div class="tdp-side-stack" id="tdpMaterials"></div>
          </aside>

        </div>

        <section class="tdp-path">
          <div class="tdp-path-title">
            <h3>How Learning Moves Forward</h3>
            <small>GUIDED • PRACTICAL • AGE-BASED</small>
          </div>

          <div class="tdp-path-line" id="tdpPath"></div>
        </section>

        <div class="tdp-cta">
          <div>
            <strong>🔓 Enrollment unlocks the complete 90-Day learning journey.</strong>
            <p>
              Full lessons, labs, practice activities, rewards, progress tracking
              and parent visibility become available to enrolled students.
            </p>
          </div>

          <div class="tdp-cta-actions">
            <button type="button" class="tdp-btn tdp-btn-secondary" id="tdpSeeStudents">
              🎓 Student Access
            </button>

            <a href="student-login.html" class="tdp-btn tdp-btn-primary">
              🔐 Student Login
            </a>
          </div>
        </div>

      </div>
    `;

    /* Only inside 90-Day page */
    const finalProject = coursePage.querySelector(".final-project");

    if (finalProject) {
      finalProject.insertAdjacentElement("afterend", wrapper);
    } else {
      coursePage.appendChild(wrapper);
    }

    /* =====================================================
       RENDER
       ===================================================== */

    const labsEl = document.getElementById("tdpLabs");
    const materialEl = document.getElementById("tdpMaterials");
    const pathEl = document.getElementById("tdpPath");

    const groupTitle = document.getElementById("tdpGroupTitle");
    const groupSub = document.getElementById("tdpGroupSub");

    const progressBar = document.getElementById("tdpProgressBar");
    const progressText = document.getElementById("tdpProgressText");
    const statusText = document.getElementById("tdpStatusText");

    let activeKey = "junior";
    let typingTimer = null;
    let statusTimer = null;

    function render(key) {
      activeKey = key;

      const cfg = data[key];

      document
        .querySelectorAll(".tdp-tab")
        .forEach(btn => {
          btn.classList.toggle(
            "active",
            btn.dataset.tdpTab === key
          );
        });

      groupTitle.textContent = cfg.title;
      groupSub.textContent =
        key === "junior"
          ? "FOUNDATION LABS"
          : "FUTURE SKILLS LABS";

      labsEl.innerHTML = cfg.labs
        .map((lab, index) => `
          <article class="tdp-lab-card ${index === 0 ? "selected" : ""}"
                   data-tdp-lab="${index}">
            <div class="tdp-lab-icon">${lab.icon}</div>
            <b>${lab.title}</b>
            <p>${lab.text}</p>

            <div class="tdp-demo-window">
              ${lab.demo}
            </div>
          </article>
        `)
        .join("");

      materialEl.innerHTML = cfg.materials
        .map(item => `
          <article class="tdp-material-card">
            <div class="tdp-material-icon">${item[0]}</div>

            <div>
              <b>${item[1]}</b>
              <small>${item[2]}</small>
            </div>

            <span class="tdp-lock">🔒 FULL</span>
          </article>
        `)
        .join("");

      pathEl.innerHTML = cfg.path
        .map(step => `
          <article class="tdp-step">
            <div>
              <div class="tdp-step-icon">${step[0]}</div>
              <b>${step[1]}</b>
              <small>${step[2]}</small>
            </div>
          </article>
        `)
        .join("");

      progressBar.style.width = "0%";

      requestAnimationFrame(() => {
        setTimeout(() => {
          progressBar.style.width = cfg.progress + "%";
        }, 100);
      });

      progressText.textContent = `${cfg.progress}% sample journey`;

      startTyping(cfg.typing);
      startStatusRotation(key);

      attachLabEvents();
    }

    /* =====================================================
       TYPE ANIMATION
       ===================================================== */

    function startTyping(frames) {
      if (typingTimer) {
        clearInterval(typingTimer);
      }

      let frame = 0;

      const update = () => {
        document
          .querySelectorAll("[data-tdp-type]")
          .forEach(el => {
            el.textContent = frames[frame];
          });

        frame = (frame + 1) % frames.length;
      };

      update();

      typingTimer = setInterval(update, 850);
    }

    /* =====================================================
       STATUS ROTATION
       ===================================================== */

    function startStatusRotation(key) {
      if (statusTimer) {
        clearInterval(statusTimer);
      }

      const juniorStatus = [
        "👀 Visual learning preview",
        "🖱️ Practice with simple interaction",
        "🔊 Listen and repeat guidance",
        "⭐ Rewards encourage progress"
      ];

      const seniorStatus = [
        "🛠️ Practical IT skill preview",
        "🤖 AI prompt building practice",
        "🔐 Cyber safety challenge",
        "🏆 Demonstrate real digital skills"
      ];

      const list =
        key === "junior"
          ? juniorStatus
          : seniorStatus;

      let i = 0;

      statusText.textContent = list[0];

      statusTimer = setInterval(() => {
        i = (i + 1) % list.length;

        statusText.style.opacity = ".25";

        setTimeout(() => {
          statusText.textContent = list[i];
          statusText.style.opacity = "1";
        }, 220);

      }, 2400);
    }

    /* =====================================================
       LAB INTERACTION
       ===================================================== */

    function attachLabEvents() {
      document
        .querySelectorAll(".tdp-lab-card")
        .forEach(card => {
          card.addEventListener("click", () => {
            document
              .querySelectorAll(".tdp-lab-card")
              .forEach(c => c.classList.remove("selected"));

            card.classList.add("selected");

            const index =
              Number(card.dataset.tdpLab) + 1;

            statusText.textContent =
              `✨ Demo Lab ${index} selected`;
          });
        });
    }

    /* =====================================================
       TAB EVENTS
       ===================================================== */

    document
      .querySelectorAll(".tdp-tab")
      .forEach(button => {
        button.addEventListener("click", () => {
          render(button.dataset.tdpTab);
        });
      });

    /* =====================================================
       STUDENT ACCESS BUTTON
       ===================================================== */

    const studentButton =
      document.getElementById("tdpSeeStudents");

    if (studentButton) {
      studentButton.addEventListener("click", () => {
        const existingNav =
          document.querySelector('[data-page="students"]');

        if (existingNav) {
          existingNav.click();
        } else {
          location.hash = "students";
        }
      });
    }

    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const observer =
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: .12
      });

    observer.observe(wrapper);

    /* =====================================================
       INITIAL RENDER
       ===================================================== */

    render("junior");

    console.info(
      `[${VERSION}] loaded`
    );
  });
})();
