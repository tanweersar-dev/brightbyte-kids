const modules = [
  {
    icon:"💻", title:"Meet the Computer", desc:"What a computer is, what it can do and where we see computers.", stars:20,
    lessons:[
      ["What is a Computer?","Meet your first computer.","A computer is an electronic machine that helps us learn, type, draw, watch educational videos and do many useful tasks.",10],
      ["What Can a Computer Do?","Discover useful computer jobs.","A computer can help us write, draw, calculate, learn, listen to sounds and work with pictures.",10],
      ["Computers Around Us","Find computers in everyday places.","We can see computers at home, school, hospitals, banks, airports, shops and offices.",15],
      ["Human or Computer?","Learn the difference between people and computers.","People can think, feel and make decisions. Computers follow instructions given by people.",15]
    ],
    challenge:"Name two places where you have seen a computer."
  },
  {
    icon:"🖥️", title:"Know Your Computer", desc:"Monitor, keyboard, mouse, printer, speakers, webcam and system unit.", stars:20,
    lessons:[
      ["Monitor","The screen of the computer.","The monitor shows words, pictures, videos and the work we are doing.",10],
      ["Keyboard","Our typing tool.","The keyboard helps us type letters, numbers and symbols.",10],
      ["Mouse","Point, click and move.","The mouse helps us point, click, double-click, drag and scroll.",15],
      ["More Computer Parts","Printer, speakers, webcam and system unit.","A printer puts work on paper, speakers play sound, a webcam captures video and the system unit contains important computer parts.",15]
    ],
    challenge:"Point to the monitor, keyboard and mouse on a real computer."
  },
  {
    icon:"🖱️", title:"Mouse Master", desc:"Move, point, click, double-click, drag-and-drop and scroll.", stars:20,
    lessons:[
      ["Move & Point","Control the pointer.","Move the mouse gently and watch the pointer move on the screen.",10],
      ["Left Click","Choose an item.","One left-click can select a button, icon or object.",10],
      ["Double Click","Open an item.","Two quick left-clicks can open many files, folders and apps.",15],
      ["Drag & Scroll","Move and explore.","Hold the mouse button to drag an object. Use the wheel to scroll up and down.",15]
    ],
    challenge:"Drag an icon on your desktop with an adult or teacher."
  },
  {
    icon:"⌨️", title:"Keyboard Explorer", desc:"Letters, numbers, Spacebar, Enter, Backspace and arrow keys.", stars:20,
    lessons:[
      ["Letter Keys","Find A to Z.","Letter keys help us type names and words.",10],
      ["Number Keys","Find 0 to 9.","Number keys help us type numbers.",10],
      ["Spacebar, Enter & Backspace","Three very useful keys.","Spacebar makes a space, Enter can start a new line, and Backspace removes a character.",15],
      ["Arrow Keys","Move around.","Arrow keys move the cursor or selection up, down, left and right.",15]
    ],
    challenge:"Type your first name slowly and correctly."
  },
  {
    icon:"🪟", title:"Screen & Windows", desc:"Desktop, icons, open, close, minimize and maximize.", stars:20,
    lessons:[
      ["Desktop","Your main work area.","The desktop is the main screen you see after the computer starts.",10],
      ["Icons","Small pictures with a job.","Icons can represent apps, files, folders and shortcuts.",10],
      ["Open & Close","Use windows safely.","Double-click an icon to open. Use the X button to close a window.",15],
      ["Minimize & Maximize","Control window size.","Minimize hides a window without closing it. Maximize makes it fill most of the screen.",15]
    ],
    challenge:"Ask an adult to show one desktop icon and one open window."
  },
  {
    icon:"🎨", title:"Digital Artist", desc:"Pencil, brush, colours, shapes and eraser.", stars:20,
    lessons:[
      ["Meet the Drawing App","Create art on a computer.","A drawing app lets us make colourful pictures using digital tools.",10],
      ["Pencil, Brush & Eraser","Choose the right tool.","Use pencil for lines, brush for painting and eraser to remove mistakes.",10],
      ["Colours & Shapes","Make creative pictures.","Choose colours and use circles, squares and rectangles to build pictures.",15],
      ["My Happy House","Create your first digital picture.","Draw a house, sun, tree and clouds using shapes and colours.",15]
    ],
    challenge:"Draw a house with a sun, door and two windows."
  },
  {
    icon:"✍️", title:"First Typing Adventure", desc:"Type simple letters, words and short sentences accurately.", stars:20,
    lessons:[
      ["Type Your Name","Start with something familiar.","Find the letters of your name on the keyboard and type them carefully.",10],
      ["Easy Words","Practice short words.","Try CAT, SUN, BOOK, TREE and SCHOOL.",10],
      ["Space Between Words","Build a small sentence.","Use Spacebar between words. Example: I LOVE MY COMPUTER.",15],
      ["Typing Star Challenge","Accuracy before speed.","Type carefully, fix mistakes with Backspace and try again.",15]
    ],
    challenge:"Type: I LOVE COMPUTERS"
  },
  {
    icon:"🛡️", title:"Internet & Safety", desc:"Internet basics, private information, passwords and asking an adult.", stars:20,
    lessons:[
      ["What is the Internet?","A giant network.","The internet connects computers, phones and online services around the world.",10],
      ["Private Information","Keep personal details safe.","Do not share your home address, phone number or school details with strangers online.",10],
      ["Passwords","Keep them secret.","A password protects an account. Never share it with an online stranger.",15],
      ["Ask a Trusted Adult","Safety comes first.","Ask a parent or teacher before opening unknown links, downloads or messages.",15]
    ],
    challenge:"Should you share your password with a stranger? Answer: No."
  },
  {
    icon:"🤖", title:"Meet AI", desc:"What AI is, smart tasks and examples of AI around us.", stars:20,
    lessons:[
      ["What is AI?","Meet Artificial Intelligence.","AI means Artificial Intelligence. Some AI systems can work with speech, pictures, text and patterns.",10],
      ["AI Around Us","Spot smart features.","Voice assistants, recommendations and some camera tools can use AI.",10],
      ["AI or Normal Tool?","Not every device is AI.","A normal calculator follows fixed rules. Some AI systems learn patterns from data.",15],
      ["AI Can Be Wrong","Always check important answers.","AI may make mistakes. Ask a teacher or parent and verify important information.",15]
    ],
    challenge:"Name one AI feature you have seen."
  },
  {
    icon:"✨", title:"My First AI Prompt", desc:"Build simple AI instructions using a character, place and action.", stars:20,
    lessons:[
      ["What is a Prompt?","Give AI an instruction.","A prompt is an instruction or question we give to an AI system.",10],
      ["Who?","Add a character.","Instead of 'robot', try 'a friendly blue robot'.",10],
      ["Where?","Add a place.","Add a place such as 'in a garden' or 'on the Moon'.",15],
      ["What Action?","Tell the character what to do.","Example: A friendly robot in a garden watering flowers.",15]
    ],
    challenge:"Improve this prompt: Robot."
  }
];

const games = [
  {icon:"🖱️",title:"Mouse Blast",desc:"Tap the correct computer part and earn stars.",sound:"games"},
  {icon:"🧠",title:"Memory Match",desc:"Match computer icons and remember their positions.",sound:"quiz"},
  {icon:"🚀",title:"Typing Rocket",desc:"Type a word correctly to launch the rocket.",sound:"rocket"},
  {icon:"🛡️",title:"Safe Surf",desc:"Choose the safe internet action.",sound:"parents"},
  {icon:"🤖",title:"Prompt Builder",desc:"Build a simple AI prompt with who, where and action.",sound:"teacher"}
];

const badges = [
  ["💻","Computer Explorer","Complete Module 1",true],
  ["🖥️","Parts Detective","Complete Module 2",false],
  ["🖱️","Mouse Master","Complete Module 3",false],
  ["⌨️","Keyboard Hero","Complete Module 4",false],
  ["🪟","Desktop Explorer","Complete Module 5",false],
  ["🎨","Digital Artist","Complete Module 6",false],
  ["✍️","Typing Star","Complete Module 7",false],
  ["🛡️","Safety Hero","Complete Module 8",false],
  ["🤖","AI Explorer","Complete Module 9",false],
  ["✨","Prompt Creator","Complete Module 10",false]
];

const demoStudents = [{photo:"🧒",name:"Ashaaz",cls:"Class 1",progress:20,focus:"Computer + AI Explorer"}];

const moduleGrid=document.getElementById("moduleGrid");
const gameGrid=document.getElementById("gameGrid");
const badgeGrid=document.getElementById("badgeGrid");
const studentGrid=document.getElementById("studentGrid");
const modal=document.getElementById("modal");
const modalBody=document.getElementById("modalBody");
const modalClose=document.getElementById("modalClose");
const toast=document.getElementById("toast");
const soundToggle=document.getElementById("soundToggle");
const themeToggle=document.getElementById("themeToggle");

let soundEnabled=true;
let nightMode=false;
let audioContext=null;

function showPage(id,updateHash=true){
  if(!document.getElementById(id)) id="home";

  document.querySelectorAll(".page-view").forEach(p=>p.classList.remove("active-page"));
  document.getElementById(id).classList.add("active-page");

  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));

  if(updateHash){
    history.replaceState(null,"",id==="home" ? location.pathname : `#${id}`);
  }

  window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click",e=>{
  const pageBtn=e.target.closest("[data-page]");
  if(pageBtn){
    const id=pageBtn.dataset.page;
    showPage(id);
    playSound(pageBtn.dataset.sound||"home");
    makeSpark(e);
  }
});

function renderModules(){
  moduleGrid.innerHTML=modules.map((m,i)=>`
    <article class="module-card">
      <div class="module-icon">${m.icon}</div>
      <div class="module-body">
        <small>TANNU SIR • MODULE ${i+1}</small>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="module-meta">
          <span class="mini-chip">📚 4 lessons</span>
          <span class="mini-chip">⭐ +${m.stars} stars</span>
        </div>
      </div>
      <button class="module-go" type="button" data-module="${i}" aria-label="Open ${m.title}">→</button>
    </article>
  `).join("");
}

function openModule(index){
  const m=modules[index];
  modalBody.innerHTML=`
    <div class="modal-hero">
      <div class="big-icon">${m.icon}</div>
      <small>MODULE ${index+1} • 4 LESSONS</small>
      <h2>${m.title}</h2>
      <p>${m.desc}</p>
    </div>
    <div class="lesson-list">
      ${m.lessons.map((l,i)=>`
        <article class="lesson-item">
          <small>LESSON ${i+1}</small>
          <h3>${l[0]}</h3>
          <p><b>${l[1]}</b></p>
          <p>${l[2]}</p>
          <span class="xp">⭐ ${l[3]} XP</span>
        </article>
      `).join("")}
    </div>
    <div class="challenge-box"><b>🎯 Module Challenge</b><p>${m.challenge}</p></div>
    <button class="modal-action" data-close-modal="1">Done — Back to Adventure</button>
  `;
  openModal();
  playSound("adventure");
}

moduleGrid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-module]");
  if(!btn) return;
  openModule(Number(btn.dataset.module));
  makeSpark(e);
});

function renderGames(){
  gameGrid.innerHTML=games.map((g,i)=>`
    <article class="game-card">
      <div class="game-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      <button type="button" data-game="${i}">Play Now</button>
    </article>
  `).join("");
}

gameGrid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-game]");
  if(!btn) return;
  openGame(Number(btn.dataset.game));
  makeSpark(e);
});

function openGame(i){
  const g=games[i];
  let content="";
  if(i===0){
    content=`<div class="game-stage"><div class="big-play">🖥️ 🖱️ ⌨️ 🖨️</div><h3>Find the Mouse!</h3><p>Tap the correct answer.</p>
      <div class="quiz-options">
        <button onclick="gameAnswer(false)">🖥️ Monitor</button>
        <button onclick="gameAnswer(true)">🖱️ Mouse</button>
        <button onclick="gameAnswer(false)">⌨️ Keyboard</button>
      </div></div>`;
  }else if(i===2){
    content=`<div class="game-stage"><div class="big-play">🚀</div><h3>Typing Rocket</h3><p>Type this word in your mind or with your teacher: <b>COMPUTER</b></p></div>`;
  }else{
    content=`<div class="game-stage"><div class="big-play">${g.icon}</div><h3>${g.title}</h3><p>${g.desc}</p><button class="modal-action" data-close-modal="1">Great! Continue Learning</button></div>`;
  }
  modalBody.innerHTML=`<div class="modal-hero"><div class="big-icon">${g.icon}</div><small>TANNU SIR'S GAME ARCADE</small><h2>${g.title}</h2></div>${content}`;
  openModal();
  playSound(g.sound);
}

window.gameAnswer=function(ok){
  if(ok){showToast("Correct! Great job ⭐");playSound("rewards")}
  else{showToast("Try again 🙂");playSound("quiz")}
};

function renderBadges(){
  badgeGrid.innerHTML=badges.map(b=>`
    <article class="badge-card ${b[3]?"":"locked"}">
      <div class="badge-icon">${b[0]}</div>
      <h4>${b[1]}</h4>
      <p>${b[2]}</p>
    </article>
  `).join("");
}

function renderStudentCards(students){
  studentGrid.innerHTML=students.map(s=>`
    <article class="student-card">
      <div class="student-top">
        <div class="student-photo">${s.photo||"🧒"}</div>
        <div><h3>${s.name}</h3><small>${s.cls||"Class 1"}</small></div>
      </div>
      <div class="student-bar"><div class="student-fill" style="width:${Number(s.progress||0)}%"></div></div>
      <p><b>Progress:</b> ${Number(s.progress||0)}%</p>
      <p><b>Training:</b> ${s.focus||"Computer + AI Explorer"}</p>
      <a href="student-login.html" class="tool-btn">Open Student Login</a>
    </article>
  `).join("");
}

async function loadPublicStudents(){
  try{
    const res=await fetch("https://brightbyte-kids-api.tanweerstudy25.workers.dev/api/students/public");
    if(!res.ok) throw new Error("API unavailable");
    const data=await res.json();
    const rows=data.students||data.results||[];
    if(!Array.isArray(rows)||!rows.length){renderStudentCards(demoStudents);return;}
    renderStudentCards(rows.map(s=>({
      name:s.display_name||s.name||"Student",
      cls:`Class ${s.class_number||1}`,
      progress:s.progress_percent||0,
      focus:s.training_track||"Computer + AI Explorer",
      photo:s.photo_url?`<img src="${s.photo_url}" alt="${s.display_name||"Student"}">`:"🧒"
    })));
  }catch(e){renderStudentCards(demoStudents)}
}

function openModal(){
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
modalClose.addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("click",e=>{if(e.target.closest("[data-close-modal]"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

document.getElementById("certificateBtn").addEventListener("click",()=>{
  modalBody.innerHTML=`
    <div class="modal-hero">
      <div class="big-icon">🏅</div>
      <small>CERTIFICATE PREVIEW</small>
      <h2>Computer & AI Explorer</h2>
      <p>This certificate preview is for <b>Ashaaz • Class 1</b> in Tannu Sir's BrightByte Kids Lab.</p>
    </div>
    <div class="challenge-box"><b>Teacher:</b> Tannu Sir<br><b>Program:</b> Computer + AI Explorer</div>
    <button class="modal-action" data-close-modal="1">Close Preview</button>`;
  openModal();playSound("rewards");
});

document.getElementById("quickQuizBtn").addEventListener("click",()=>{
  modalBody.innerHTML=`
    <div class="modal-hero">
      <div class="big-icon">🧠</div>
      <small>TANNU SIR'S QUICK QUIZ</small>
      <h2>Which device helps us type?</h2>
    </div>
    <div class="quiz-options">
      <button onclick="quizAnswer(false)">🖱️ Mouse</button>
      <button onclick="quizAnswer(true)">⌨️ Keyboard</button>
      <button onclick="quizAnswer(false)">🖨️ Printer</button>
    </div>`;
  openModal();playSound("quiz");
});
window.quizAnswer=function(ok){
  if(ok){showToast("Correct! Keyboard 🎉");playSound("rewards");closeModal()}
  else{showToast("Good try — choose the typing device!");playSound("quiz")}
};

themeToggle.addEventListener("click",()=>{
  nightMode=!nightMode;
  document.body.classList.toggle("night-mode",nightMode);
  themeToggle.textContent=nightMode?"🌙 Night":"🌞 Day";
  playSound("toggle");
});

soundToggle.addEventListener("click",()=>{
  soundEnabled=!soundEnabled;
  soundToggle.textContent=soundEnabled?"🔊 Sound MAX":"🔇 Sound OFF";
  if(soundEnabled) playSound("toggle");
});

function showToast(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),1600);
}

function makeSpark(e){
  const x=e.clientX||innerWidth/2,y=e.clientY||innerHeight/2;
  for(let i=0;i<7;i++){
    const el=document.createElement("span");
    el.className="spark";
    el.style.left=x+"px";el.style.top=y+"px";
    el.style.background=["#ff71be","#7a69ff","#49d7ff","#ffe15e"][i%4];
    el.style.setProperty("--dx",(Math.random()*110-55).toFixed(0)+"px");
    el.style.setProperty("--dy",(Math.random()*110-55).toFixed(0)+"px");
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),800);
  }
}

function initAudio(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
}
function playTone(start,duration,fromFreq,toFreq,type="sine",gainValue=.22){
  if(!soundEnabled)return;
  initAudio();
  const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(fromFreq,now+start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(toFreq,1),now+start+duration);
  gain.gain.setValueAtTime(.0001,now+start);
  gain.gain.exponentialRampToValueAtTime(gainValue,now+start+.02);
  gain.gain.exponentialRampToValueAtTime(.0001,now+start+duration);
  osc.connect(gain);gain.connect(audioContext.destination);
  osc.start(now+start);osc.stop(now+start+duration+.03);
}
function playSound(kind){
  if(!soundEnabled)return;
  if(kind==="home"){playTone(0,.10,1100,1600,"sine",.29);playTone(.09,.12,900,1400,"sine",.27)}
  else if(kind==="adventure"||kind==="rocket"){playTone(0,.22,170,1050,"sawtooth",.31);playTone(.18,.12,700,1300,"triangle",.25)}
  else if(kind==="games"){playTone(0,.08,520,620,"square",.26);playTone(.08,.08,620,780,"square",.25);playTone(.16,.10,780,620,"square",.25)}
  else if(kind==="rewards"){playTone(0,.08,720,1030,"triangle",.28);playTone(.09,.08,930,1350,"triangle",.27);playTone(.18,.14,1250,1750,"triangle",.24)}
  else if(kind==="students"){playTone(0,.18,560,330,"sawtooth",.26);playTone(.15,.16,700,400,"triangle",.24)}
  else if(kind==="parents"){playTone(0,.10,430,300,"square",.28);playTone(.08,.10,370,260,"square",.26)}
  else if(kind==="teacher"){playTone(0,.16,270,180,"sine",.26);playTone(.14,.18,350,220,"sine",.24)}
  else if(kind==="quiz"){playTone(0,.08,550,800,"triangle",.27);playTone(.10,.10,720,1020,"triangle",.25)}
  else{playTone(0,.08,500,720,"triangle",.24)}
}

renderModules();
renderGames();
renderBadges();
loadPublicStudents();

const initial=(location.hash||"#home").slice(1);
showPage(document.getElementById(initial)?initial:"home",false);
setTimeout(()=>showToast("Welcome to Tannu Sir's BrightByte Galaxy!"),600);
