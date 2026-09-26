(() => {
"use strict";

/*
  Virtual IT Lab Link Add-on
  Safe add-on for student-profile.html
  Does not replace existing Labs or renderLabs().
*/

const CARD_ID = "virtualItLabCard";

function addVirtualITLabCard() {
  const grid = document.getElementById("labGrid");

  if (!grid) return;
  if (document.getElementById(CARD_ID)) return;

  const card = document.createElement("article");

  card.id = CARD_ID;
  card.className = "topic-card virtual-it-lab-card";

  card.innerHTML = `
    <div style="
      height:120px;
      border-radius:18px;
      background:
        radial-gradient(circle at 25% 30%,rgba(255,255,255,.45),transparent 18%),
        linear-gradient(135deg,#171c52,#6658f7 52%,#25cfc3);
      display:grid;
      place-items:center;
      position:relative;
      overflow:hidden;
      margin-bottom:12px;
      box-shadow:inset 0 0 35px rgba(255,255,255,.08);
    ">

      <div style="
        position:absolute;
        left:18px;
        bottom:14px;
        width:90px;
        height:55px;
        border:6px solid #fff;
        border-radius:8px;
        background:#17204d;
        box-shadow:0 8px 18px rgba(0,0,0,.25);
      ">
        <div style="
          width:30px;
          height:5px;
          background:#fff;
          position:absolute;
          left:24px;
          bottom:-13px;
          border-radius:5px;
        "></div>
      </div>

      <div style="
        position:absolute;
        right:22px;
        bottom:13px;
        width:58px;
        height:75px;
        border-radius:12px;
        background:#252d61;
        border:3px solid rgba(255,255,255,.7);
      ">
        <span style="
          position:absolute;
          width:8px;
          height:8px;
          right:8px;
          top:12px;
          border-radius:50%;
          background:#2aff9d;
          box-shadow:
            0 0 8px #2aff9d,
            0 0 18px #2aff9d;
          animation:virtualLabBlink .6s infinite alternate;
        "></span>
      </div>

      <div style="
        position:absolute;
        width:120px;
        height:5px;
        border-radius:99px;
        background:#24d09d;
        transform:rotate(-15deg);
        box-shadow:0 0 12px rgba(36,208,157,.9);
      "></div>

      <div style="
        position:absolute;
        top:12px;
        left:14px;
        color:#fff;
        font-weight:1000;
        font-size:11px;
        letter-spacing:.4px;
      ">
        🧪 PRACTICAL LAB
      </div>
    </div>

    <span style="font-size:34px">🧪</span>

    <h3 style="
      font-size:18px;
      margin:8px 0 5px;
    ">
      Virtual IT Lab
    </h3>

    <p style="
      font-size:11px;
      line-height:1.6;
      min-height:70px;
    ">
      Build a computer, connect display, USB, power and LAN cables,
      test the internet, solve faults and earn your
      Junior IT Technician certificate.
    </p>

    <div style="
      display:flex;
      gap:6px;
      flex-wrap:wrap;
      margin:10px 0;
    ">
      <small style="
        padding:5px 8px;
        border-radius:99px;
        background:#eff0ff;
        color:#554ac5;
        font-weight:900;
      ">
        Stage 1 • Builder
      </small>

      <small style="
        padding:5px 8px;
        border-radius:99px;
        background:#eafff7;
        color:#187a5d;
        font-weight:900;
      ">
        Stage 2 • Technician
      </small>
    </div>

    <button
      id="openVirtualITLab"
      type="button"
      style="
        width:100%;
        border:0;
        border-radius:13px;
        padding:12px 14px;
        background:linear-gradient(135deg,#6858ff,#24cfc2);
        color:white;
        font-size:11px;
        font-weight:1000;
        box-shadow:0 8px 20px rgba(103,88,255,.22);
      "
    >
      🧪 Open Virtual IT Lab
    </button>
  `;

  /*
    Virtual IT Lab should appear FIRST
    so children can easily find it.
  */
  grid.prepend(card);

  const button = card.querySelector("#openVirtualITLab");

  button.addEventListener("click", () => {
    window.location.href = "virtual-it-lab.html";
  });
}


function installVirtualLabStyle() {
  if (document.getElementById("virtualItLabAddonStyle")) return;

  const style = document.createElement("style");

  style.id = "virtualItLabAddonStyle";

  style.textContent = `

    @keyframes virtualLabBlink {
      from {
        opacity:.35;
        transform:scale(.85);
        box-shadow:
          0 0 5px #2aff9d,
          0 0 10px #2aff9d;
      }

      to {
        opacity:1;
        transform:scale(1.25);
        box-shadow:
          0 0 10px #2aff9d,
          0 0 22px #2aff9d,
          0 0 35px rgba(42,255,157,.75);
      }
    }

    .virtual-it-lab-card {
      border:2px solid rgba(108,92,255,.18) !important;
      background:
        linear-gradient(180deg,#ffffff,#f9fbff) !important;
    }

    .virtual-it-lab-card:hover {
      transform:translateY(-3px);
      transition:.2s ease;
      box-shadow:
        0 20px 55px rgba(74,65,177,.20) !important;
    }

    #openVirtualITLab:hover {
      transform:translateY(-1px);
      filter:brightness(1.05);
    }

  `;

  document.head.appendChild(style);
}


function startVirtualLabAddon() {

  installVirtualLabStyle();

  /*
    Try immediately.
  */
  addVirtualITLabCard();

  /*
    student-profile loads profile data asynchronously.
    So keep checking briefly until labGrid has rendered.
  */
  let tries = 0;

  const timer = setInterval(() => {

    tries++;

    addVirtualITLabCard();

    if (
      document.getElementById(CARD_ID) ||
      tries > 30
    ) {
      clearInterval(timer);
    }

  }, 400);


  /*
    renderLabs() can rebuild labGrid after progress changes.
    Observe labGrid so our card automatically comes back.
  */
  const watchForGrid = setInterval(() => {

    const grid = document.getElementById("labGrid");

    if (!grid) return;

    clearInterval(watchForGrid);

    const observer = new MutationObserver(() => {

      if (!document.getElementById(CARD_ID)) {

        requestAnimationFrame(() => {
          addVirtualITLabCard();
        });

      }

    });

    observer.observe(
      grid,
      {
        childList:true
      }
    );

    addVirtualITLabCard();

  }, 500);
}


if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startVirtualLabAddon
  );

} else {

  startVirtualLabAddon();

}

})();
