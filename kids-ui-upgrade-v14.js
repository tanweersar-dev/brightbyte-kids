(() => {
"use strict";

const STYLE_ID="kidsUiV14Style";
const WORLDS_ID="kidsWorldLauncher";

function addStyle(){
  if(document.getElementById(STYLE_ID)) return;

  const s=document.createElement("style");
  s.id=STYLE_ID;

  s.textContent=`
  :root{
    --kid-shadow:0 16px 34px rgba(77,67,180,.16)
  }

  body{
    font-size:16px
  }

  .nav button,
  .nav a,
  .tabs button,
  .primary,
  .soft,
  .pink,
  .big-start,
  .topic-card button,
  .game-card button,
  .healthy-card button,
  .citizen-card button,
  .test-card button,
  .battle-actions button{
    min-height:46px;
    font-size:12px!important;
    border-radius:15px!important;
    font-weight:1000!important;
    transition:
      transform .18s ease,
      filter .18s ease,
      box-shadow .18s ease
  }

  .nav button,
  .nav a{
    padding:11px 13px!important
  }

  .tabs{
    gap:10px!important
  }

  .tabs button{
    padding:12px 16px!important
  }

  .topic-card,
  .game-card,
  .healthy-card,
  .citizen-card,
  .test-card,
  .portfolio-card,
  .battle-card,
  .lesson-card{
    border-radius:26px!important
  }

  .topic-card h3,
  .game-card h3,
  .healthy-card h3,
  .citizen-card h3{
    font-size:17px!important
  }

  .topic-card p,
  .game-card p,
  .healthy-card p,
  .citizen-card p,
  .lesson-card p,
  .panel>p,
  .section-head p{
    font-size:12px!important;
    line-height:1.55!important
  }

  .lesson-card h3{
    font-size:16px!important
  }

  .lesson-card .visual{
    height:145px!important
  }

  .lesson-card button{
    min-height:45px!important;
    font-size:11px!important
  }

  .hero h1{
    font-size:clamp(34px,5vw,52px)!important
  }

  .hero p{
    font-size:13px!important;
    max-width:760px
  }

  .today-card h3{
    font-size:20px!important
  }

  .today-card p{
    font-size:13px!important
  }

  .big-start{
    min-height:58px!important;
    font-size:15px!important;
    box-shadow:
      0 0 0 5px rgba(255,208,84,.12),
      0 12px 28px rgba(255,145,80,.28);
    animation:kidPrimaryPulse 1.25s infinite alternate
  }

  .primary:hover,
  .soft:hover,
  .pink:hover,
  .big-start:hover,
  .topic-card button:hover,
  .game-card button:hover{
    transform:translateY(-2px);
    filter:brightness(1.04)
  }

  .view:not(#view-dashboard) .section-head p{
    max-width:700px
  }

  .kid-world-launcher{
    margin:18px 0;
    background:#fff;
    border:1px solid #e4e7f4;
    border-radius:30px;
    padding:18px;
    box-shadow:var(--kid-shadow)
  }

  .kid-world-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    margin-bottom:13px
  }

  .kid-world-head h2{
    margin:0;
    font-size:24px
  }

  .kid-world-head p{
    margin:3px 0 0;
    color:#727b99;
    font-size:12px
  }

  .kid-world-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:12px
  }

  .kid-world{
    position:relative;
    border:0;
    border-radius:24px;
    min-height:155px;
    padding:18px;
    text-align:left;
    color:#fff;
    overflow:hidden;
    box-shadow:0 13px 26px rgba(33,39,104,.17);
    cursor:pointer
  }

  .kid-world:before{
    content:"";
    position:absolute;
    inset:-30%;
    background:
      radial-gradient(circle,rgba(255,255,255,.24),transparent 46%);
    transform:translate(35%,-20%)
  }

  .kid-world .emoji{
    display:block;
    font-size:44px;
    filter:drop-shadow(0 7px 10px #0002)
  }

  .kid-world b{
    display:block;
    font-size:18px;
    margin-top:9px
  }

  .kid-world small{
    display:block;
    font-size:11px;
    opacity:.92;
    margin-top:4px;
    line-height:1.35
  }

  .kid-world.tech{
    background:linear-gradient(135deg,#4d58f4,#24cfc2)
  }

  .kid-world.lab{
    background:linear-gradient(135deg,#6e4df5,#ef4ca7)
  }

  .kid-world.gk{
    background:linear-gradient(135deg,#1975e9,#5cc7ff)
  }

  .kid-world.english{
    background:linear-gradient(135deg,#f35f9d,#ff9f54)
  }

  .kid-world.health{
    background:linear-gradient(135deg,#20a86e,#67d777)
  }

  .kid-world.safe{
    background:linear-gradient(135deg,#344c9a,#7956df)
  }

  .kid-world.think{
    background:linear-gradient(135deg,#8f5bd7,#3b91ff)
  }

  .kid-world.ai{
    background:linear-gradient(
      135deg,
      #111949,
      #6858ff 58%,
      #22cfc2
    )
  }

  .kid-world.cta{
    animation:kidWorldGlow 1.3s infinite alternate
  }

  .kid-world:active{
    transform:scale(.98)
  }

  .kid-short-text{
    max-width:760px
  }

  .kid-visual-note{
    display:flex;
    align-items:center;
    gap:10px;
    padding:12px 14px;
    border-radius:16px;
    background:linear-gradient(135deg,#fff7de,#eef0ff);
    font-size:12px;
    font-weight:900;
    color:#4c4e78
  }

  @keyframes kidPrimaryPulse{
    from{
      transform:scale(1);
      filter:brightness(1)
    }

    to{
      transform:scale(1.025);
      filter:brightness(1.08);
      box-shadow:
        0 0 0 8px rgba(255,208,84,.15),
        0 16px 34px rgba(255,145,80,.32)
    }
  }

  @keyframes kidWorldGlow{
    from{
      box-shadow:0 13px 26px rgba(33,39,104,.17)
    }

    to{
      box-shadow:
        0 0 0 6px rgba(255,255,255,.8),
        0 0 28px rgba(108,92,255,.42),
        0 16px 32px rgba(33,39,104,.24)
    }
  }

  @media(max-width:1050px){
    .kid-world-grid{
      grid-template-columns:repeat(2,1fr)
    }
  }

  @media(max-width:580px){
    .kid-world-grid{
      grid-template-columns:1fr 1fr
    }

    .kid-world{
      min-height:135px;
      padding:14px
    }

    .kid-world .emoji{
      font-size:36px
    }

    .kid-world b{
      font-size:15px
    }

    .kid-world small{
      font-size:10px
    }

    .kid-world-head{
      display:block
    }

    .nav{
      gap:8px!important
    }

    .nav button,
    .nav a{
      min-width:82px
    }

    .hero p{
      font-size:12px!important
    }
  }

  @media(prefers-reduced-motion:reduce){
    .big-start,
    .kid-world.cta{
      animation:none!important
    }
  }
  `;

  document.head.appendChild(s);
}


function showViewSafe(name){

  if(typeof window.showView==="function"){
    return window.showView(name);
  }

  const btn=document.querySelector(
    `[data-view="${name}"]`
  );

  if(btn) btn.click();
}


function addWorldLauncher(){

  if(document.getElementById(WORLDS_ID)) return;

  const dashboard=document.getElementById("view-dashboard");

  if(!dashboard) return;

  const box=document.createElement("section");

  box.id=WORLDS_ID;
  box.className="kid-world-launcher";

  box.innerHTML=`
    <div class="kid-world-head">

      <div>
        <h2>🌈 Choose Your World</h2>
        <p>Tap a big picture. Learn one thing at a time.</p>
      </div>

      <div class="kid-visual-note">
        👀 Look → 👂 Listen → 👆 Tap → ⭐ Learn
      </div>

    </div>

    <div class="kid-world-grid">

      <button
        class="kid-world tech"
        data-kid-go="lessons"
      >
        <span class="emoji">💻</span>
        <b>Computer</b>
        <small>See, learn and practise</small>
      </button>

      <button
        class="kid-world lab cta"
        data-href="virtual-it-lab.html"
      >
        <span class="emoji">🧪</span>
        <b>IT Lab</b>
        <small>Connect • Fix • Test</small>
      </button>

      <button
        class="kid-world gk"
        data-kid-go="gk"
      >
        <span class="emoji">🌍</span>
        <b>GK World</b>
        <small>India • Bihar • World</small>
      </button>

      <button
        class="kid-world english"
        data-kid-go="speaking"
      >
        <span class="emoji">🗣️</span>
        <b>English</b>
        <small>Hear • Speak • Repeat</small>
      </button>

      <button
        class="kid-world health"
        data-kid-go="healthy"
      >
        <span class="emoji">🥗</span>
        <b>Healthy Me</b>
        <small>Food • Hygiene • Habits</small>
      </button>

      <button
        class="kid-world safe"
        data-kid-go="citizen"
      >
        <span class="emoji">🛡️</span>
        <b>Safe Me</b>
        <small>Home • Road • Online</small>
      </button>

      <button
        class="kid-world think"
        data-kid-go="practice"
      >
        <span class="emoji">🧠</span>
        <b>Smart Games</b>
        <small>Memory • Logic • Focus</small>
      </button>
<button
  class="kid-world lab cta"
  data-href="hardware-explorer.html"
>
  <span class="emoji">🧠</span>
  <b>Hardware Explorer</b>
  <small>Parts • Ports • Cables</small>
</button>
      <button
        class="kid-world ai cta"
        data-href="ai-prompt-lab.html"
      >
        <span class="emoji">🤖</span>
        <b>AI Prompt Lab</b>
        <small>Say it • Create it</small>
      </button>

    </div>
  `;

  dashboard.insertBefore(
    box,
    dashboard.firstChild
  );

  box.addEventListener("click",e=>{

    const b=e.target.closest("button");

    if(!b) return;

    if(b.dataset.href){

      location.href=b.dataset.href;

    }else if(b.dataset.kidGo){

      showViewSafe(b.dataset.kidGo);

    }

  });
}


function simplifyLabels(){

  const map={
    dashboard:"🏠 Home",
    lessons:"📚 Learn",
    labs:"🧪 Labs",
    practice:"🎮 Games",
    speaking:"🗣️ Speak",
    healthy:"🥗 Health",
    citizen:"🛡️ Safety",
    tests:"📝 Tests",
    battle:"⚔️ Battle",
    portfolio:"🎒 My Work",
    rewards:"🏆 Rewards",
    profile:"👤 Me"
  };

  document
    .querySelectorAll('.nav [data-view]')
    .forEach(b=>{

      if(map[b.dataset.view]){
        b.textContent=map[b.dataset.view];
      }

    });


  const tabs={
    dashboard:"🏠 Home",
    lessons:"📚 Learn",
    labs:"🧪 Labs",
    practice:"🎮 Games",
    tests:"📝 Tests",
    battle:"⚔️ Battle"
  };

  document
    .querySelectorAll('.tabs [data-view]')
    .forEach(b=>{

      if(tabs[b.dataset.view]){
        b.textContent=tabs[b.dataset.view];
      }

    });
}


function addVirtualCard(){

  const grid=document.getElementById("labGrid");

  if(!grid) return;

  if(document.getElementById("v14VirtualLabCard")) return;

  const c=document.createElement("article");

  c.id="v14VirtualLabCard";
  c.className="topic-card";

  c.style.background=
    "linear-gradient(180deg,#fff,#f4f3ff)";

  c.innerHTML=`
    <span>🧪</span>

    <h3>Virtual IT Lab</h3>

    <p>
      Build a computer, connect cables,
      fix simple faults and earn a
      Junior IT Technician certificate.
    </p>

    <button
      class="primary"
      style="
        width:100%;
        min-height:52px;
        animation:kidWorldGlow 1.3s infinite alternate
      "
    >
      🚀 Open IT Lab
    </button>
  `;

  c.querySelector("button").onclick=()=>{
    location.href="virtual-it-lab.html";
  };

  grid.prepend(c);
}


function watchLabs(){

  const grid=document.getElementById("labGrid");

  if(!grid){
    return setTimeout(
      watchLabs,
      400
    );
  }

  const o=new MutationObserver(()=>{
    addVirtualCard();
  });

  o.observe(
    grid,
    {
      childList:true
    }
  );

  addVirtualCard();
}


function boot(){

  addStyle();

  simplifyLabels();

  addWorldLauncher();

  watchLabs();
}


if(document.readyState==="loading"){

  document.addEventListener(
    "DOMContentLoaded",
    boot
  );

}else{

  boot();

}

})();
