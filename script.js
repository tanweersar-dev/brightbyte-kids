const modules = [
  { icon: "💻", title: "Meet the Computer", desc: "What a computer is, what it can do and where we see computers.", lessons: 4, stars: 20 },
  { icon: "🖥️", title: "Know Your Computer", desc: "Monitor, keyboard, mouse, printer, speakers, webcam and system unit.", lessons: 4, stars: 20 },
  { icon: "🖱️", title: "Mouse Master", desc: "Move, point, click, double-click, drag-and-drop and scroll.", lessons: 4, stars: 20 },
  { icon: "⌨️", title: "Keyboard Explorer", desc: "Letters, numbers, Spacebar, Enter, Backspace and arrow keys.", lessons: 4, stars: 20 },
  { icon: "🪟", title: "Screen & Windows", desc: "Desktop, icons, open, close, minimize and maximize.", lessons: 4, stars: 20 },
  { icon: "🎨", title: "Digital Artist", desc: "Pencil, brush, colours, shapes and eraser.", lessons: 4, stars: 20 },
  { icon: "✍️", title: "First Typing Adventure", desc: "Type simple letters, words and short sentences accurately.", lessons: 4, stars: 20 },
  { icon: "🛡️", title: "Internet & Safety", desc: "Internet basics, private information, passwords and asking an adult.", lessons: 4, stars: 20 },
  { icon: "🤖", title: "Meet AI", desc: "What AI is, smart tasks and examples of AI around us.", lessons: 4, stars: 20 },
  { icon: "✨", title: "My First AI Prompt", desc: "Build simple AI instructions using a character, place and action.", lessons: 4, stars: 20 }
];

const games = [
  { icon: "🖱️", title: "Mouse Blast", desc: "Tap the correct computer part before the pulse ends.", sound: "games" },
  { icon: "🧠", title: "Memory Match", desc: "Match icons like monitor, keyboard, mouse and printer.", sound: "quiz" },
  { icon: "🚀", title: "Typing Rocket", desc: "Type short words correctly to launch your rocket.", sound: "rocket" },
  { icon: "🛡️", title: "Safe Surf", desc: "Pick safe internet habits and avoid risky actions.", sound: "parents" },
  { icon: "🤖", title: "Prompt Builder", desc: "Create better prompts for AI using clear details.", sound: "teacher" }
];

const badges = [
  { icon:"💻",title:"Computer Explorer",note:"Complete Module 1",unlocked:true },
  { icon:"🖥️",title:"Parts Detective",note:"Complete Module 2",unlocked:false },
  { icon:"🖱️",title:"Mouse Master",note:"Complete Module 3",unlocked:false },
  { icon:"⌨️",title:"Keyboard Hero",note:"Complete Module 4",unlocked:false },
  { icon:"🪟",title:"Desktop Explorer",note:"Complete Module 5",unlocked:false },
  { icon:"🎨",title:"Digital Artist",note:"Complete Module 6",unlocked:false },
  { icon:"✍️",title:"Typing Star",note:"Complete Module 7",unlocked:false },
  { icon:"🛡️",title:"Safety Hero",note:"Complete Module 8",unlocked:false },
  { icon:"🤖",title:"AI Explorer",note:"Complete Module 9",unlocked:false },
  { icon:"✨",title:"Prompt Creator",note:"Complete Module 10",unlocked:false }
];

const demoStudents = [
  {photo:"🧒",name:"Ashaaz",cls:"Class 1",progress:20,focus:"Meet the Computer"}
];

const moduleGrid = document.getElementById("moduleGrid");
const gameGrid = document.getElementById("gameGrid");
const badgeGrid = document.getElementById("badgeGrid");
const studentGrid = document.getElementById("studentGrid");
const toast = document.getElementById("toast");
const soundToggle = document.getElementById("soundToggle");
const themeToggle = document.getElementById("themeToggle");

let soundEnabled = true;
let themeMode = "day";
let audioContext = null;

function renderModules(){
  if(!moduleGrid) return;
  moduleGrid.innerHTML = modules.map((m,i)=>`
    <article class="module-card">
      <div class="module-icon">${m.icon}</div>
      <div class="module-body">
        <small>TANNU SIR • MODULE ${i+1}</small>
        <h3>${m.title}</h3>
        <p>${m.desc}</p>
        <div class="module-meta">
          <span class="mini-chip">📚 ${m.lessons} lessons</span>
          <span class="mini-chip">⭐ +${m.stars} stars</span>
        </div>
      </div>
      <button class="module-go sfx" data-sound="adventure" data-message="Opening ${m.title}">→</button>
    </article>`).join("");
}

function renderGames(){
  if(!gameGrid) return;
  gameGrid.innerHTML = games.map(g=>`
    <article class="game-card">
      <div class="game-icon">${g.icon}</div>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      <button class="sfx" data-sound="${g.sound}" data-message="${g.title} ready for play!">Play Now</button>
    </article>`).join("");
}

function renderBadges(){
  if(!badgeGrid) return;
  badgeGrid.innerHTML = badges.map(b=>`
    <article class="badge-card ${b.unlocked?"":"locked"}">
      <div class="badge-icon">${b.icon}</div>
      <h4>${b.title}</h4>
      <p>${b.note}</p>
    </article>`).join("");
}

function renderStudentCards(students){
  if(!studentGrid) return;
  studentGrid.innerHTML = students.map(s=>`
    <article class="student-card">
      <div class="student-top">
        <div class="student-photo">${s.photo || "🧒"}</div>
        <div><h3>${s.name}</h3><small>${s.cls || "Class 1"}</small></div>
      </div>
      <div class="student-bar"><div class="student-fill" style="width:${Number(s.progress||0)}%"></div></div>
      <p><b>Progress:</b> ${Number(s.progress||0)}%</p>
      <p><b>Current focus:</b> ${s.focus || "Computer + AI Explorer"}</p>
      <a href="student-login.html" class="tool-btn sfx" data-sound="students">Student Login</a>
    </article>`).join("");
}

async function loadPublicStudents(){
  try{
    const res = await fetch("https://brightbyte-kids-api.tanweerstudy25.workers.dev/api/students/public");
    if(!res.ok) throw new Error("API unavailable");
    const data = await res.json();
    const arr = data.students || data.results || [];
    if(!Array.isArray(arr) || !arr.length){
      renderStudentCards(demoStudents);
      return;
    }
    renderStudentCards(arr.map(s=>({
      name:s.display_name || s.name || "Student",
      cls:`Class ${s.class_number || 1}`,
      progress:s.progress_percent || 0,
      focus:s.training_track || "Computer + AI Explorer",
      photo:s.photo_url ? `<img src="${s.photo_url}" alt="${s.display_name || "Student"}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">` : "🧒"
    })));
  }catch(err){
    renderStudentCards(demoStudents);
  }
}

function scrollToSection(id){
  const section=document.getElementById(id);
  if(section) section.scrollIntoView({behavior:"smooth",block:"start"});
}

function setActiveNav(id){
  document.querySelectorAll(".nav-btn").forEach(btn=>btn.classList.toggle("active",btn.dataset.target===id));
}

document.addEventListener("click",e=>{
  const targetBtn=e.target.closest("[data-target]");
  if(targetBtn){
    const target=targetBtn.dataset.target;
    if(target && document.getElementById(target)){
      e.preventDefault();
      scrollToSection(target);
      setActiveNav(target);
      playSound(targetBtn.dataset.sound || "home");
      makeSpark(e);
    }
  }
  const sfx=e.target.closest(".sfx");
  if(sfx && !targetBtn){
    playSound(sfx.dataset.sound || "home");
    makeSpark(e);
  }
  const msg=(sfx||targetBtn)?.dataset?.message;
  if(msg) showToast(msg);
});

window.addEventListener("scroll",()=>{
  const pos=window.scrollY+170;
  for(const section of document.querySelectorAll("main section[id]")){
    if(pos>=section.offsetTop && pos<section.offsetTop+section.offsetHeight){
      setActiveNav(section.id);break;
    }
  }
});

function showToast(message){
  if(!toast) return;
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("show"),1500);
}

themeToggle?.addEventListener("click",()=>{
  themeMode=themeMode==="day"?"night":"day";
  document.body.classList.toggle("theme-night",themeMode==="night");
  themeToggle.textContent=themeMode==="night"?"🌙 Night":"🌞 Day";
  playSound("toggle");
});

soundToggle?.addEventListener("click",()=>{
  soundEnabled=!soundEnabled;
  soundToggle.textContent=soundEnabled?"🔊 Sound MAX":"🔇 Sound OFF";
  if(soundEnabled) playSound("toggle");
});

function makeSpark(e){
  const x=e.clientX||innerWidth/2,y=e.clientY||innerHeight/2;
  for(let i=0;i<7;i++){
    const el=document.createElement("span");el.className="spark";
    el.style.left=x+"px";el.style.top=y+"px";
    el.style.background=["#ff71be","#7a69ff","#49d7ff","#ffe15e"][i%4];
    el.style.setProperty("--dx",(Math.random()*110-55).toFixed(0)+"px");
    el.style.setProperty("--dy",(Math.random()*110-55).toFixed(0)+"px");
    document.body.appendChild(el);setTimeout(()=>el.remove(),800);
  }
}

function initAudio(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
}
function playTone(start,duration,fromFreq,toFreq,type="sine",gainValue=.2){
  if(!soundEnabled) return;
  initAudio();
  const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(fromFreq,now+start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(toFreq,1),now+start+duration);
  gain.gain.setValueAtTime(.0001,now+start);
  gain.gain.exponentialRampToValueAtTime(gainValue,now+start+.02);
  gain.gain.exponentialRampToValueAtTime(.0001,now+start+duration);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start(now+start);osc.stop(now+start+duration+.03);
}
function playSound(kind){
  if(!soundEnabled) return;
  if(kind==="home"){playTone(0,.10,1100,1600,"sine",.27);playTone(.09,.12,900,1400,"sine",.25)}
  else if(kind==="adventure"||kind==="rocket"){playTone(0,.22,180,900,"sawtooth",.28);playTone(.18,.12,650,1200,"triangle",.23)}
  else if(kind==="games"){playTone(0,.08,520,620,"square",.23);playTone(.08,.08,620,760,"square",.23);playTone(.16,.10,760,620,"square",.23)}
  else if(kind==="rewards"){playTone(0,.08,700,1000,"triangle",.26);playTone(.09,.08,900,1300,"triangle",.25);playTone(.18,.14,1200,1700,"triangle",.22)}
  else if(kind==="students"){playTone(0,.18,520,320,"sawtooth",.24);playTone(.15,.16,680,390,"triangle",.22)}
  else if(kind==="parents"){playTone(0,.10,420,300,"square",.25);playTone(.08,.10,360,260,"square",.23)}
  else if(kind==="teacher"){playTone(0,.16,260,180,"sine",.24);playTone(.14,.18,340,220,"sine",.22)}
  else if(kind==="quiz"){playTone(0,.08,540,780,"triangle",.24);playTone(.10,.10,700,980,"triangle",.22)}
  else{playTone(0,.08,500,700,"triangle",.22)}
}

renderModules();
renderGames();
renderBadges();
loadPublicStudents();
setTimeout(()=>showToast("Welcome to Tannu Sir's BrightByte Galaxy!"),650);
