/* =========================================================
   V38.1 — PARENT VIEW MERGED INTO 90-DAY PROGRAM
   Tannu Sir's Kids Digital Academy

   - Removes Parent View button from top navigation
   - Hides old separate Parent View page
   - Adds simple Parent Progress diagram inside #course
   - No external library required
   ========================================================= */

(() => {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {

    /* =====================================================
       1. REMOVE TOP PARENT VIEW BUTTON
       ===================================================== */

    document
      .querySelectorAll('[data-page="parents"]')
      .forEach(el => el.remove());


    /* =====================================================
       2. HIDE OLD SEPARATE PARENT PAGE
       We keep it in source as backup.
       ===================================================== */

    const oldParentPage = document.getElementById("parents");

    if (oldParentPage) {
      oldParentPage.style.display = "none";
      oldParentPage.setAttribute("aria-hidden", "true");
    }


    /* =====================================================
       3. FIND 90-DAY PAGE
       ===================================================== */

    const coursePage = document.getElementById("course");

    if (!coursePage) return;

    if (document.getElementById("parentJourneyV381")) return;


    /* =====================================================
       4. CSS
       ===================================================== */

    const style = document.createElement("style");

    style.id = "parentJourneyV381Style";

    style.textContent = `

    #parentJourneyV381,
    #parentJourneyV381 * {
      box-sizing: border-box;
    }

    #parentJourneyV381 {
      --pj-bg:#07162c;
      --pj-panel:#0c2341;
      --pj-line:rgba(87,215,255,.22);
      --pj-text:#f7fbff;
      --pj-muted:#9eb6cd;
      --pj-cyan:#32e1ff;
      --pj-blue:#5591ff;
      --pj-purple:#9c6cff;
      --pj-pink:#ff68b8;
      --pj-green:#4be3ad;
      --pj-yellow:#ffd45e;

      position:relative;
      margin-top:22px;
      color:var(--pj-text);
      font-family:inherit;
    }

    .pj-shell {
      position:relative;
      overflow:hidden;
      border-radius:24px;
      border:1px solid var(--pj-line);

      background:
        radial-gradient(
          circle at 0% 0%,
          rgba(50,225,255,.10),
          transparent 30%
        ),
        radial-gradient(
          circle at 100% 0%,
          rgba(156,108,255,.11),
          transparent 30%
        ),
        linear-gradient(
          145deg,
          rgba(5,20,39,.98),
          rgba(8,28,53,.96)
        );

      padding:22px;

      box-shadow:
        0 24px 70px rgba(0,0,0,.22),
        inset 0 1px 0 rgba(255,255,255,.04);
    }

    .pj-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:20px;
      margin-bottom:22px;
    }

    .pj-eyebrow {
      display:flex;
      align-items:center;
      gap:8px;

      color:var(--pj-cyan);
      font-size:10px;
      font-weight:900;
      letter-spacing:.12em;
      text-transform:uppercase;
      margin-bottom:7px;
    }

    .pj-dot {
      width:7px;
      height:7px;
      border-radius:50%;
      background:var(--pj-green);
      box-shadow:0 0 14px var(--pj-green);

      animation:pjPulse 1.5s infinite;
    }

    .pj-head h2 {
      margin:0;
      color:#fff;
      font-size:clamp(22px,3vw,34px);
      line-height:1.1;
    }

    .pj-head p {
      margin:8px 0 0;
      max-width:760px;
      color:var(--pj-muted);
      line-height:1.6;
      font-size:13px;
    }

    .pj-parent-badge {
      min-width:170px;

      display:flex;
      align-items:center;
      gap:10px;

      padding:11px 14px;

      border-radius:14px;
      border:1px solid rgba(75,227,173,.24);

      background:
        rgba(75,227,173,.07);

      color:#bdffe7;

      font-size:11px;
      font-weight:900;
    }


    /* =====================================================
       SIMPLE DIAGRAM
       ===================================================== */

    .pj-flow {
      display:grid;
      grid-template-columns:
        repeat(5,minmax(0,1fr));
      gap:14px;

      margin-bottom:20px;
    }

    .pj-step {
      min-height:150px;

      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;

      text-align:center;

      padding:15px 12px;

      border-radius:18px;

      border:
        1px solid rgba(255,255,255,.075);

      background:
        linear-gradient(
          155deg,
          rgba(255,255,255,.05),
          rgba(255,255,255,.018)
        );

      position:relative;

      transition:
        transform .28s ease,
        border-color .28s ease,
        box-shadow .28s ease;
    }

    .pj-step:hover {
      transform:translateY(-6px);

      border-color:
        rgba(50,225,255,.35);

      box-shadow:
        0 18px 35px rgba(0,0,0,.18);
    }

    .pj-step:not(:last-child)::after {
      content:"➜";

      position:absolute;

      right:-22px;
      top:50%;

      transform:translateY(-50%);

      z-index:5;

      color:var(--pj-cyan);

      font-size:20px;

      text-shadow:
        0 0 14px rgba(50,225,255,.75);

      animation:pjArrow 1.25s infinite;
    }

    .pj-icon {
      width:52px;
      height:52px;

      display:grid;
      place-items:center;

      margin-bottom:10px;

      border-radius:15px;

      font-size:25px;

      border:
        1px solid rgba(50,225,255,.15);

      background:
        linear-gradient(
          145deg,
          rgba(50,225,255,.10),
          rgba(156,108,255,.10)
        );
    }

    .pj-step b {
      color:#fff;
      font-size:12px;
      margin-bottom:5px;
    }

    .pj-step small {
      color:var(--pj-muted);
      font-size:9px;
      line-height:1.5;
    }


    /* =====================================================
       TWO-COLUMN PARENT SUMMARY
       ===================================================== */

    .pj-parent-grid {
      display:grid;

      grid-template-columns:
        minmax(0,1.15fr)
        minmax(320px,.85fr);

      gap:16px;
    }

    .pj-card {
      border-radius:19px;

      border:
        1px solid rgba(255,255,255,.075);

      background:
        linear-gradient(
          155deg,
          rgba(15,43,75,.86),
          rgba(8,27,50,.86)
        );

      padding:18px;

      position:relative;
      overflow:hidden;
    }

    .pj-card::before {
      content:"";

      position:absolute;

      top:0;
      left:0;

      width:100%;
      height:2px;

      background:
        linear-gradient(
          90deg,
          transparent,
          var(--pj-cyan),
          transparent
        );

      opacity:.8;
    }

    .pj-card-title {
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;

      margin-bottom:15px;
    }

    .pj-card-title h3 {
      margin:0;
      color:#fff;
      font-size:16px;
    }

    .pj-card-title span {
      font-size:9px;
      color:#7e98b5;

      font-weight:900;
      letter-spacing:.05em;
      text-transform:uppercase;
    }


    /* =====================================================
       SKILL PROGRESS
       ===================================================== */

    .pj-skills {
      display:grid;
      gap:10px;
    }

    .pj-skill {
      display:grid;
      grid-template-columns:115px 1fr 42px;
      gap:10px;
      align-items:center;
    }

    .pj-skill-label {
      color:#d9e9f8;
      font-size:10px;
      font-weight:800;
    }

    .pj-skill-bar {
      height:7px;
      border-radius:99px;
      overflow:hidden;

      background:
        rgba(255,255,255,.07);
    }

    .pj-skill-fill {
      display:block;

      height:100%;
      width:0;

      border-radius:inherit;

      background:
        linear-gradient(
          90deg,
          var(--pj-cyan),
          var(--pj-purple),
          var(--pj-pink)
        );

      box-shadow:
        0 0 12px rgba(50,225,255,.24);

      transition:
        width 1.25s cubic-bezier(.2,.8,.2,1);
    }

    .pj-skill-value {
      color:#fff;
      font-size:10px;
      font-weight:900;
      text-align:right;
    }


    /* =====================================================
       WEEKLY REPORT
       ===================================================== */

    .pj-report-grid {
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:9px;
    }

    .pj-report-item {
      border-radius:13px;

      padding:12px;

      background:
        rgba(255,255,255,.04);

      border:
        1px solid rgba(255,255,255,.065);

      transition:.25s ease;
    }

    .pj-report-item:hover {
      transform:translateY(-3px);

      border-color:
        rgba(50,225,255,.26);
    }

    .pj-report-item strong {
      display:block;

      color:#fff;

      font-size:19px;

      margin-bottom:2px;
    }

    .pj-report-item span {
      color:var(--pj-muted);
      font-size:9px;
    }


    /* =====================================================
       SAFE PROMISE
       ===================================================== */

    .pj-safe {
      margin-top:16px;

      padding:15px;

      border-radius:17px;

      border:
        1px solid rgba(75,227,173,.16);

      background:
        rgba(75,227,173,.035);
    }

    .pj-safe-title {
      margin-bottom:11px;

      color:#caffed;

      font-size:11px;
      font-weight:900;
    }

    .pj-safe-items {
      display:flex;
      flex-wrap:wrap;
      gap:8px;
    }

    .pj-safe-items span {
      padding:7px 9px;

      border-radius:999px;

      background:
        rgba(255,255,255,.045);

      border:
        1px solid rgba(255,255,255,.06);

      color:#d6e7f6;

      font-size:9px;
      font-weight:800;
    }


    /* =====================================================
       PARENT EXPLANATION
       ===================================================== */

    .pj-bottom {
      margin-top:17px;

      display:grid;

      grid-template-columns:
        repeat(3,1fr);

      gap:11px;
    }

    .pj-bottom-card {
      padding:13px;

      border-radius:15px;

      background:
        rgba(255,255,255,.035);

      border:
        1px solid rgba(255,255,255,.06);
    }

    .pj-bottom-card b {
      display:block;
      color:#fff;
      font-size:11px;
      margin-bottom:4px;
    }

    .pj-bottom-card small {
      color:var(--pj-muted);
      font-size:9px;
      line-height:1.5;
    }


    /* =====================================================
       FOOTER CTA
       ===================================================== */

    .pj-cta {
      margin-top:18px;

      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:18px;

      padding:16px 17px;

      border-radius:17px;

      border:
        1px solid rgba(255,212,94,.20);

      background:
        linear-gradient(
          120deg,
          rgba(255,212,94,.07),
          rgba(156,108,255,.06),
          rgba(50,225,255,.06)
        );
    }

    .pj-cta strong {
      display:block;
      color:#fff;
      font-size:13px;
      margin-bottom:4px;
    }

    .pj-cta p {
      margin:0;
      color:var(--pj-muted);
      font-size:10px;
    }

    .pj-actions {
      display:flex;
      gap:8px;
      flex:0 0 auto;
    }

    .pj-btn {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:6px;

      padding:10px 13px;

      border-radius:11px;

      border:0;

      text-decoration:none;

      font-family:inherit;
      font-size:10px;
      font-weight:900;

      cursor:pointer;

      transition:.22s ease;
    }

    .pj-btn:hover {
      transform:translateY(-2px);
    }

    .pj-btn-main {
      color:#072033;

      background:
        linear-gradient(
          135deg,
          var(--pj-cyan),
          #78ecff
        );
    }

    .pj-btn-review {
      color:#fff;

      background:
        rgba(255,255,255,.065);

      border:
        1px solid rgba(255,255,255,.09);
    }


    /* =====================================================
       ANIMATION
       ===================================================== */

    .pj-reveal {
      opacity:0;
      transform:translateY(20px);

      transition:
        opacity .7s ease,
        transform .7s ease;
    }

    .pj-reveal.show {
      opacity:1;
      transform:none;
    }

    @keyframes pjPulse {
      0%,100% {
        transform:scale(1);
        opacity:.7;
      }

      50% {
        transform:scale(1.35);
        opacity:1;
      }
    }

    @keyframes pjArrow {
      0%,100% {
        transform:
          translateY(-50%)
          translateX(0);

        opacity:.55;
      }

      50% {
        transform:
          translateY(-50%)
          translateX(5px);

        opacity:1;
      }
    }


    /* =====================================================
       MOBILE
       ===================================================== */

    @media(max-width:1000px) {

      .pj-flow {
        grid-template-columns:
          repeat(3,1fr);
      }

      .pj-parent-grid {
        grid-template-columns:1fr;
      }
    }

    @media(max-width:720px) {

      .pj-shell {
        padding:15px;
      }

      .pj-head {
        flex-direction:column;
        align-items:flex-start;
      }

      .pj-parent-badge {
        width:100%;
      }

      .pj-flow {
        grid-template-columns:1fr;
      }

      .pj-step:not(:last-child)::after {
        content:"↓";

        top:auto;
        right:50%;
        bottom:-23px;

        transform:translateX(50%);
      }

      .pj-bottom {
        grid-template-columns:1fr;
      }

      .pj-skill {
        grid-template-columns:
          95px 1fr 38px;
      }

      .pj-cta {
        flex-direction:column;
        align-items:stretch;
      }

      .pj-actions {
        width:100%;
      }

      .pj-btn {
        flex:1;
      }
    }
    `;

    document.head.appendChild(style);


    /* =====================================================
       5. CREATE PARENT DIAGRAM
       ===================================================== */

    const section = document.createElement("section");

    section.id = "parentJourneyV381";

    section.className = "pj-reveal";

    section.innerHTML = `

    <div class="pj-shell">

      <div class="pj-head">

        <div>

          <div class="pj-eyebrow">

            <span class="pj-dot"></span>

            FOR PARENTS • SIMPLE PROGRESS VIEW

          </div>

          <h2>
            See What Your Child Is Learning
          </h2>

          <p>
            Parents do not need to understand every technical lesson.
            The academy turns learning into a simple journey:
            what the child learned, practised, completed and what comes next.
          </p>

        </div>

        <div class="pj-parent-badge">

          <span class="pj-dot"></span>

          SIMPLE • SAFE • TRACKABLE

        </div>

      </div>


      <!-- SIMPLE DIAGRAM -->

      <div class="pj-flow">

        <article class="pj-step">

          <div class="pj-icon">
            📘
          </div>

          <b>
            1. Learn
          </b>

          <small>
            Child sees a short,
            age-based lesson.
          </small>

        </article>


        <article class="pj-step">

          <div class="pj-icon">
            🛠️
          </div>

          <b>
            2. Practice
          </b>

          <small>
            Labs, speaking,
            quizzes and activities.
          </small>

        </article>


        <article class="pj-step">

          <div class="pj-icon">
            ⭐
          </div>

          <b>
            3. Complete
          </b>

          <small>
            Progress, stars and
            achievements are recorded.
          </small>

        </article>


        <article class="pj-step">

          <div class="pj-icon">
            👨‍👩‍👧
          </div>

          <b>
            4. Parent Sees
          </b>

          <small>
            Important progress is shown
            in a simple report.
          </small>

        </article>


        <article class="pj-step">

          <div class="pj-icon">
            🚀
          </div>

          <b>
            5. Next Step
          </b>

          <small>
            Child continues from
            the next skill.
          </small>

        </article>

      </div>


      <!-- PARENT SUMMARY -->

      <div class="pj-parent-grid">


        <!-- PROGRESS -->

        <article class="pj-card">

          <div class="pj-card-title">

            <h3>
              📊 Skill Progress Preview
            </h3>

            <span>
              SIMPLE PARENT VIEW
            </span>

          </div>


          <div class="pj-skills">

            <div class="pj-skill">

              <span class="pj-skill-label">
                💻 Computer
              </span>

              <div class="pj-skill-bar">
                <span
                  class="pj-skill-fill"
                  data-width="68">
                </span>
              </div>

              <span class="pj-skill-value">
                68%
              </span>

            </div>


            <div class="pj-skill">

              <span class="pj-skill-label">
                🗣️ English
              </span>

              <div class="pj-skill-bar">
                <span
                  class="pj-skill-fill"
                  data-width="61">
                </span>
              </div>

              <span class="pj-skill-value">
                61%
              </span>

            </div>


            <div class="pj-skill">

              <span class="pj-skill-label">
                🛡️ Safety
              </span>

              <div class="pj-skill-bar">
                <span
                  class="pj-skill-fill"
                  data-width="84">
                </span>
              </div>

              <span class="pj-skill-value">
                84%
              </span>

            </div>


            <div class="pj-skill">

              <span class="pj-skill-label">
                🌟 Confidence
              </span>

              <div class="pj-skill-bar">
                <span
                  class="pj-skill-fill"
                  data-width="64">
                </span>
              </div>

              <span class="pj-skill-value">
                64%
              </span>

            </div>


            <div class="pj-skill">

              <span class="pj-skill-label">
                🤖 AI Skills
              </span>

              <div class="pj-skill-bar">
                <span
                  class="pj-skill-fill"
                  data-width="43">
                </span>
              </div>

              <span class="pj-skill-value">
                43%
              </span>

            </div>

          </div>


          <div class="pj-safe">

            <div class="pj-safe-title">
              🛡️ Safe Learning Promise
            </div>

            <div class="pj-safe-items">

              <span>🚫 No Ads</span>

              <span>🔒 Private Profiles</span>

              <span>🙅 No Stranger Chat</span>

              <span>👨‍🏫 Teacher Guided</span>

              <span>⏱️ Short Sessions</span>

            </div>

          </div>

        </article>


        <!-- WEEKLY REPORT -->

        <article class="pj-card">

          <div class="pj-card-title">

            <h3>
              📅 Weekly Report Example
            </h3>

            <span>
              DEMO
            </span>

          </div>


          <div class="pj-report-grid">

            <div class="pj-report-item">

              <strong>
                5
              </strong>

              <span>
                Lessons Completed
              </span>

            </div>


            <div class="pj-report-item">

              <strong>
                18
              </strong>

              <span>
                Spoken Sentences
              </span>

            </div>


            <div class="pj-report-item">

              <strong>
                4
              </strong>

              <span>
                Practice Games
              </span>

            </div>


            <div class="pj-report-item">

              <strong>
                2
              </strong>

              <span>
                New Badges
              </span>

            </div>

          </div>


          <div class="pj-bottom">

            <div class="pj-bottom-card">

              <b>
                ✅ Strong Area
              </b>

              <small>
                Online safety and
                practical computer basics.
              </small>

            </div>


            <div class="pj-bottom-card">

              <b>
                🎯 Practice Next
              </b>

              <small>
                Speaking confidence
                and AI prompt practice.
              </small>

            </div>


            <div class="pj-bottom-card">

              <b>
                👨‍🏫 Next Step
              </b>

              <small>
                Continue the next
                guided weekly mission.
              </small>

            </div>

          </div>

        </article>

      </div>


      <!-- CTA -->

      <div class="pj-cta">

        <div>

          <strong>
            Parents see progress — kids enjoy learning.
          </strong>

          <p>
            No complicated dashboard:
            just important skills,
            activity and next steps.
          </p>

        </div>


        <div class="pj-actions">

          <a
            href="reviews.html"
            class="pj-btn pj-btn-review">

            ⭐ Parent Reviews

          </a>


          <a
            href="student-login.html"
            class="pj-btn pj-btn-main">

            🔐 Student Login

          </a>

        </div>

      </div>

    </div>
    `;


    /* =====================================================
       6. WHERE TO INSERT
       Prefer after V38 demo preview
       ===================================================== */

    const demoPreview =
      document.getElementById("tdpPreview");

    if (demoPreview) {

      demoPreview.insertAdjacentElement(
        "afterend",
        section
      );

    } else {

      const finalProject =
        coursePage.querySelector(
          ".final-project"
        );

      if (finalProject) {

        finalProject.insertAdjacentElement(
          "afterend",
          section
        );

      } else {

        coursePage.appendChild(section);

      }

    }


    /* =====================================================
       7. REVEAL + PROGRESS ANIMATION
       ===================================================== */

    let animated = false;

    const reveal = () => {

      if (animated) return;

      animated = true;

      section.classList.add("show");

      setTimeout(() => {

        section
          .querySelectorAll(
            ".pj-skill-fill"
          )
          .forEach(bar => {

            bar.style.width =
              `${bar.dataset.width}%`;

          });

      }, 250);

    };


    if ("IntersectionObserver" in window) {

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (entry.isIntersecting) {

                reveal();

                observer.disconnect();

              }

            });

          },
          {
            threshold:.12
          }
        );

      observer.observe(section);

    } else {

      reveal();

    }


    console.info(
      "[V38.1] Parent View merged into 90-Day Program"
    );

  });
/* V38.2 legacy Parent View redirect */

document.querySelectorAll('a[href*="#parents"]').forEach(link => {
  link.setAttribute("href", "index.html#course");
});

if (location.hash === "#parents") {
  history.replaceState(null, "", "index.html#course");

  const courseBtn = document.querySelector('[data-page="course"]');

  if (courseBtn) {
    setTimeout(() => {
      courseBtn.click();
    }, 100);
  }
}
})();


