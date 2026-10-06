const API="https://api.tanweer.site";
const $=id=>document.getElementById(id);let voiceOn=true,buddy=0,brave=0,course={day:1,stars:120,skills:{digital:0,english:0,safety:0,confidence:0,ai:0},completed:[]},studentProfile=null,recognition=null,recognitionTarget="";
const devices=[["🖥️","Monitor","Hello! I am a monitor. I show pictures, words and videos."],["🖱️","Mouse","Hello! I am a mouse. I help you point, click, drag and scroll."],["⌨️","Keyboard","Hello! I am a keyboard. I help you type letters, numbers and words."],["🧰","System Unit","Hello! I am the system unit. Important computer parts work inside me."],["🧩","Motherboard","Hello! I am the motherboard. I connect important computer parts."],["🧠","RAM","Hello! I am RAM. I help the computer work smoothly with active tasks."],["💾","SSD","Hello! I am an S S D. I store files, pictures, programs and videos."],["🖨️","Printer","Hello! I am a printer. I put digital work onto paper."],["🔊","Speaker","Hello! I am a speaker. I play sounds, music and voices."],["📷","Webcam","Hello! I am a webcam. I capture pictures and video."]];
const modules=[["💻","Meet the Computer","What a computer is and where we use it."],["🖥️","Know Your Computer","Monitor, keyboard, mouse, printer and system unit."],["🖱️","Mouse Master","Point, click, double-click, drag and scroll."],["⌨️","Keyboard Explorer","Letters, numbers, Spacebar, Enter and Backspace."],["🪟","Files & Windows","Desktop, icons, files, folders and windows."],["🎨","Digital Artist","Draw, colour, shapes and simple creativity."],["✍️","Typing Adventure","Names, words and short sentences."],["🛡️","Internet Safety","Passwords, private information and trusted adults."],["🤖","Meet AI","What AI is, where we see it and why it can be wrong."],["✨","My First AI Prompt","Who + where + action = clearer prompt."]];
const phrases=[["👋","Hello!","Hello! Nice to meet you."],["🌞","Good morning","Good morning! Have a happy day."],["🙂","My name is...","My name is Zen Alpha."],["🎂","I am six","I am six years old."],["❤️","I like...","I like computers and drawing."],["🙏","Thank you","Thank you very much."],["🙋","Please help me","Please help me."],["🤔","I don't understand","I do not understand. Please explain again."],["😊","I am happy","I am happy today."]];
const roles=[["🧑‍🏫","Teacher & Student","Good morning, teacher. May I come in?"],["🛍️","Shopkeeper","Hello. Can I have one apple, please?"],["🧒👧","Meet a Friend","Hello! My name is Zen Alpha. What is your name?"],["🏠","At Home","Please help me with my homework."]];
const conf=[["👋","Greeting Star","Say hello and good morning clearly.","Hello! Good morning!"],["👂","Good Listener","Listen and wait for your turn.","I will listen carefully."],["🙏","Polite Speaker","Use please, thank you, sorry and excuse me.","Please. Thank you. Sorry. Excuse me."],["🙋","Ask for Help","Ask a trusted adult when you need help.","Please help me. I do not understand."]];
const braveLines=["Hello! My name is Zen Alpha.","Good morning! How are you?","My favourite colour is blue.","Please help me. I do not understand.","Thank you very much.","I can speak slowly and clearly."];
const habits=[["🍎🥕","Everyday Foods","Choose a variety of balanced foods, including fruits and vegetables.","Choose different balanced foods every day. Fruits and vegetables are useful everyday choices."],["🍫🍟","Sometimes Foods","Sweets and highly processed snacks are better as occasional foods.","Chocolate, fries and sugary drinks are sometimes foods, not everyday habits."],["💧","Drink Water","Water is a great everyday drink.","Drink water when you are thirsty, especially after active play."],["🌙🛏️","Sleep Routine","A regular bedtime helps the body and brain rest.","Sleep on time. Your body and brain need good rest."],["🪥🧼","Clean & Fresh","Brush teeth and wash hands properly.","Brush your teeth and wash your hands to stay clean and fresh."],["🤸🏃","Move & Play","Active play, stretching and simple breathing can be fun.","Move your body, play safely, and enjoy simple stretching."]];
const routine=[["🌅","Wake Up","Start the day"],["🪥","Brush","Clean teeth"],["🥣","Breakfast","Balanced meal"],["🏫","School","Learn & listen"],["🏃","Play","Move your body"],["📚","Learn","Short practice"],["🌙","Sleep","Rest on time"]];
const games=[["🧩","Build My Computer","Place computer parts and learn what each one does.","build"],["🛠️","Fix the Broken PC","Solve simple troubleshooting missions.","fix"],["🖱️","Mouse Mission","Find the correct device and practise clicking.","mouse"],["🚀","Keyboard Racing","Type the word correctly to launch the rocket.","typing"],["🛡️","Cyber Safety Mission","Choose safe online actions.","safe"],["🤖","AI Prompt Challenge","Build a prompt using who + where + action.","prompt"]];
const badges=[["💻","Computer Explorer","Digital basics",1],["🖱️","Mouse Master","Mouse skill",0],["⌨️","Keyboard Hero","Typing skill",0],["🗣️","English Speaker","Speaking practice",1],["🎤","Brave Speaker","Confidence",0],["👂","Good Listener","Communication",0],["🙏","Polite Star","Manners",0],["🌱","Healthy Hero","Healthy habits",1],["🛡️","Safety Hero","Cyber safety",0],["🤖","AI Explorer","AI basics",0],["✨","Prompt Creator","Prompting",0],["🚀","Mission Champion","90-day mission",0]];
const buddyQs=["Hello! What is your name?","How are you today?","What is your favourite colour?","What do you like to play?","Can you name one computer part?"];
const missionPool=[["💻","Digital","Tap 3 computer parts and listen"],["🗣️","English","Say 3 useful English sentences"],["🎮","Game","Complete one technical game"],["🌟","Confidence","Do one brave speaker mission"],["🌱","Habit","Choose one healthy habit"],["🛡️","Safety","Answer one safe/unsafe challenge"],["🤖","AI","Build one simple AI prompt"]];
function page(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('show',p.id===id));document.querySelectorAll('.mainnav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));history.replaceState(null,'',id==='home'?location.pathname:'#'+id);scrollTo({top:0,behavior:'smooth'});$('adultMenu').hidden=true}
document.addEventListener('click',e=>{const p=e.target.closest('[data-page]');if(p){e.preventDefault();page(p.dataset.page)}const s=e.target.closest('[data-speak]');if(s)speak(s.dataset.speak)});$('adultBtn').onclick=()=>{$('adultMenu').hidden=!$('adultMenu').hidden};document.addEventListener('click',e=>{if(!e.target.closest('#adultBtn')&&!e.target.closest('#adultMenu'))$('adultMenu').hidden=true});
function speak(text){if(!voiceOn)return;if(!('speechSynthesis'in window)){toast('Voice is not supported in this browser');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.9;u.pitch=1.05;const vs=speechSynthesis.getVoices();const v=vs.find(v=>/en-(US|GB)/i.test(v.lang))||vs.find(v=>/en/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
$('voiceBtn').onclick=()=>{voiceOn=!voiceOn;$('voiceBtn').textContent=voiceOn?'🔊 Voice':'🔇 Voice';if(voiceOn)speak('Voice guide is on.');else if('speechSynthesis'in window)speechSynthesis.cancel()};$('welcomeVoice').onclick=()=>speak("Hello! Welcome to Tannu Sir's Kids Digital Academy. Look, listen, speak, play and grow. Let's begin your digital adventure.");$('helper').onclick=()=>speak('Hello little explorer! Tap a colourful world. If you are not sure, start with the 90 day program.');
function renderDevices(){$('deviceGrid').innerHTML=devices.map((d,i)=>`<article class="device-card" data-device="${i}"><button>🔊</button><div class="device-icon">${d[0]}</div><h3>${d[1]}</h3><p>Tap to hear my name and job.</p></article>`).join('');$('deviceGrid').onclick=e=>{const c=e.target.closest('[data-device]');if(c){const d=devices[+c.dataset.device];speak(d[2]);toast(d[1]+' is speaking')}}}
function renderModules(){$('moduleGrid').innerHTML=modules.map((m,i)=>`<article class="module-card"><span>${m[0]}</span><div><small>MODULE ${i+1}</small><h3>${m[1]}</h3><p>${m[2]}</p></div><button data-module="${i}">→</button></article>`).join('');$('moduleGrid').onclick=e=>{const b=e.target.closest('[data-module]');if(b)openModule(+b.dataset.module)}}
function openModule(i){const m=modules[i];const qs=(window.TANNU_QUESTION_BANK||[]).filter(q=>q.cat==='Digital').slice(i*4,i*4+4);$('modalBody').innerHTML=`<div class="modal-hero"><span>${m[0]}</span><small>MODULE ${i+1}</small><h2>${m[1]}</h2><p>${m[2]}</p><button class="voice-chip" data-speak="${escAttr(m[1]+'. '+m[2])}">🔊 Hear</button></div><div class="lesson-list">${qs.map((q,j)=>`<article class="lesson"><small>QUICK PRACTICE ${j+1}</small><h3>${q.q}</h3><p>Answer: ${q.a}</p></article>`).join('')}</div><button class="modal-action" data-close>Done</button>`;openModal();speak(m[1])}
function renderEnglish(){$('phraseGrid').innerHTML=phrases.map((p,i)=>`<button data-phrase="${i}"><span>${p[0]}</span><b>${p[1]}</b></button>`).join('');$('phraseGrid').onclick=e=>{const b=e.target.closest('[data-phrase]');if(b)speak(phrases[+b.dataset.phrase][2])};$('roleGrid').innerHTML=roles.map((r,i)=>`<article class="role-card" data-role="${i}"><span>${r[0]}</span><h3>${r[1]}</h3><p>${r[2]}</p></article>`).join('');$('roleGrid').onclick=e=>{const c=e.target.closest('[data-role]');if(c)speak(roles[+c.dataset.role][2])}}
function renderConfidence(){$('confidenceGrid').innerHTML=conf.map((c,i)=>`<article class="confidence-card"><span>${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><button data-conf="${i}">🔊 Practise</button></article>`).join('');$('confidenceGrid').onclick=e=>{const b=e.target.closest('[data-conf]');if(b)speak(conf[+b.dataset.conf][3])}}
function renderHealthy(){$('habitGrid').innerHTML=habits.map((h,i)=>`<article class="habit-card"><span>${h[0]}</span><h3>${h[1]}</h3><p>${h[2]}</p><button data-habit="${i}">🔊 Hear</button></article>`).join('');$('habitGrid').onclick=e=>{const b=e.target.closest('[data-habit]');if(b)speak(habits[+b.dataset.habit][3])};$('routineGrid').innerHTML=routine.map((r,i)=>`<button data-routine="${i}"><span>${r[0]}</span><b>${r[1]}</b><small>${r[2]}</small></button>`).join('');$('routineGrid').onclick=e=>{const b=e.target.closest('[data-routine]');if(b){const r=routine[+b.dataset.routine];speak(r[1]+'. '+r[2])}}}
function renderGames(){$('gameGrid').innerHTML=games.map((g,i)=>`<article class="game-card"><span>${g[0]}</span><h3>${g[1]}</h3><p>${g[2]}</p><button data-game="${i}">Play Now</button></article>`).join('');$('gameGrid').onclick=e=>{const b=e.target.closest('[data-game]');if(b)openGame(games[+b.dataset.game][3])}}
function openGame(t){if(t==='mouse')return gameMouse();if(t==='typing')return gameTyping();if(t==='safe')return gameSafe();if(t==='prompt')return gamePrompt();if(t==='build')return gameBuild();if(t==='fix')return gameFix()}
function gameMouse(){const opts=shuffle(devices.slice(0,6)).slice(0,3),correct=opts[Math.floor(Math.random()*opts.length)];$('modalBody').innerHTML=`<div class="modal-hero"><span>🖱️</span><h2>Find the ${correct[1]}</h2><p>Listen and tap the correct computer part.</p><button id="hearQ" class="voice-chip">🔊 Hear</button></div><div class="choice">${opts.map(o=>`<button data-ok="${o[1]===correct[1]}">${o[0]}<br>${o[1]}</button>`).join('')}</div>`;openModal();setTimeout(()=>speak('Find the '+correct[1]),150);$('hearQ').onclick=()=>speak('Find the '+correct[1]);$('modalBody').onclick=e=>{const b=e.target.closest('[data-ok]');if(!b)return;if(b.dataset.ok==='true'){toast('Correct! ⭐');speak('Correct! Great job!');celebrate();course.stars+=5;saveCourse()}else speak('Good try. Try again.')}}
function gameTyping(){const words=['CAT','SUN','BOOK','MOUSE','ROBOT','APPLE','COMPUTER'],w=words[Math.floor(Math.random()*words.length)];$('modalBody').innerHTML=`<div class="modal-hero"><span>🚀</span><h2>Keyboard Racing</h2><p>Type the word to launch.</p></div><div class="type-word">${w}</div><input id="typeInput" class="type-input" autocomplete="off"><button id="typeCheck" class="modal-action">Launch 🚀</button>`;openModal();speak('Type '+w);$('typeCheck').onclick=()=>{if($('typeInput').value.trim().toUpperCase()===w){toast('Rocket launched! 🚀');speak('Excellent typing!');celebrate();course.stars+=5;saveCourse();setTimeout(gameTyping,700)}else speak('Look carefully and try again.')}}
function gameSafe(){const q=[['A stranger asks for your password.','Keep it private','Share it'],['You see an unknown download.','Ask a trusted adult','Click quickly'],['Someone online makes you uncomfortable.','Tell a trusted adult','Keep it secret']][Math.floor(Math.random()*3)];$('modalBody').innerHTML=`<div class="modal-hero"><span>🛡️</span><h2>${q[0]}</h2></div><div class="choice"><button data-safe="1">✅ ${q[1]}</button><button data-safe="0">❌ ${q[2]}</button></div>`;openModal();speak(q[0]);$('modalBody').onclick=e=>{const b=e.target.closest('[data-safe]');if(!b)return;if(b.dataset.safe==='1'){toast('Safety Hero!');speak('Correct. Safety first.');celebrate();course.stars+=5;saveCourse()}else speak('That is not the safest choice. Try again.')}}
function gamePrompt(){const who=['a friendly robot','a happy cat','a brave astronaut'],where=['on the Moon','in a garden','in a computer lab'],act=['reading a book','waving hello','building a tiny computer'],state=[who[0],where[0],act[0]];$('modalBody').innerHTML=`<div class="modal-hero"><span>🤖✨</span><h2>AI Prompt Challenge</h2><p>Choose Who + Where + Action.</p></div><div class="choice" id="promptChoices"></div><p id="promptOut" class="lesson"></p><button id="sayPrompt" class="modal-action">🔊 Hear My Prompt</button>`;openModal();const pc=$('promptChoices');pc.innerHTML=[who,where,act].map((arr,k)=>arr.map(v=>`<button data-k="${k}" data-v="${escAttr(v)}">${v}</button>`).join('')).join('');const up=()=>{$('promptOut').textContent=state.join(' ') + '.'};up();pc.onclick=e=>{const b=e.target.closest('[data-k]');if(b){state[+b.dataset.k]=b.dataset.v;up()}};$('sayPrompt').onclick=()=>{speak($('promptOut').textContent);celebrate();course.stars+=5;saveCourse()}}
function gameBuild(){const parts=[['🧠','RAM'],['💾','SSD'],['🧩','Motherboard'],['🌀','Cooling Fan']];$('modalBody').innerHTML=`<div class="modal-hero"><span>🧩</span><h2>Build My Computer</h2><p>Tap parts in the order you want to install them. Every part will explain its job.</p></div><div class="choice">${parts.map((p,i)=>`<button data-part="${i}">${p[0]} ${p[1]}</button>`).join('')}</div><div id="buildList" class="lesson">Cabinet is ready.</div>`;openModal();let installed=[];$('modalBody').onclick=e=>{const b=e.target.closest('[data-part]');if(!b)return;const p=parts[+b.dataset.part];if(installed.includes(p[1]))return toast('Already installed');installed.push(p[1]);$('buildList').textContent='Installed: '+installed.join(' → ');speak(p[1]+' installed. Great job.');if(installed.length===parts.length){celebrate();toast('Computer built! 🏆');course.stars+=10;saveCourse()}}}
function gameFix(){const cases=[['Computer is not turning on. What should you check first?','Power cable',['Power cable','Printer paper','Mouse pad']],['No sound from the computer. What should you check?','Speaker or volume',['Speaker or volume','Printer ink','Webcam cover']],['Mouse is not moving. What is a good first check?','Mouse connection',['Mouse connection','Monitor brightness','Paper tray']]];const c=cases[Math.floor(Math.random()*cases.length)];$('modalBody').innerHTML=`<div class="modal-hero"><span>🛠️</span><h2>Fix the Broken PC</h2><p>${c[0]}</p></div><div class="choice">${shuffle(c[2]).map(x=>`<button data-fix="${x===c[1]}">${x}</button>`).join('')}</div>`;openModal();speak(c[0]);$('modalBody').onclick=e=>{const b=e.target.closest('[data-fix]');if(!b)return;if(b.dataset.fix==='true'){toast('Technician Star! ⭐');speak('Good troubleshooting!');celebrate();course.stars+=8;saveCourse()}else speak('Good try. Think about the first simple check.')}}
function renderBadges(){$('badgeGrid').innerHTML=badges.map(b=>`<article class="badge-card ${b[3]?'':'locked'}"><span>${b[0]}</span><h4>${b[1]}</h4><p>${b[2]}</p></article>`).join('')}
function setupSpeech(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;recognition=new SR();recognition.lang='en-US';recognition.interimResults=false;recognition.maxAlternatives=1;recognition.onstart=()=>{$('micStatus').textContent='🎤 Listening... speak now.'};recognition.onresult=e=>{const t=e.results[0][0].transcript;$('micStatus').textContent='I heard: “'+t+'”';toast('Great speaking! ⭐');speak('Very good! Keep speaking clearly.');celebrate();course.stars+=5;saveCourse()};recognition.onerror=e=>{$('micStatus').textContent='Could not hear clearly. Use Hear + Repeat or try again.'}}
function mic(target){if(!recognition){toast('Speech recognition is not available here. Hear + Repeat still works.');speak('Listen and repeat after me.');return}recognitionTarget=target;try{recognition.start()}catch{}}
$('buddyHear').onclick=()=>speak(buddyQs[buddy]);$('buddyNext').onclick=()=>{buddy=(buddy+1)%buddyQs.length;$('buddyQuestion').textContent=buddyQs[buddy];$('buddyHint').textContent='Listen, then answer in a short sentence.';speak(buddyQs[buddy])};$('buddyMic').onclick=()=>mic('buddy');$('braveHear').onclick=()=>speak(braveLines[brave]);$('braveNext').onclick=()=>{brave=(brave+1)%braveLines.length;$('bravePrompt').textContent=braveLines[brave];speak(braveLines[brave])};$('braveMic').onclick=()=>mic('brave');
function renderCourse(){const day=Math.max(1,Math.min(90,course.day||1)),week=Math.min(12,Math.ceil(day/7)),month=day<=30?1:day<=60?2:3;$('dayNum').textContent=day;$('weekNum').textContent=week;$('courseProgress').textContent=Math.round(day/90*100)+'%';$('courseXP').textContent=course.stars||120;$('courseStudent').textContent=studentProfile?.display_name||'Zen Alpha';$('missionTitle').textContent=`Day ${day} • ${month===1?'Foundation':month===2?'Practice':'Smart Skills'}`;const start=(day*3)%missionPool.length,tasks=[0,1,2,3].map(n=>missionPool[(start+n)%missionPool.length]);$('missionTasks').innerHTML=tasks.map((t,i)=>`<button class="mission-task ${course.completed?.includes(day+'-'+i)?'done':''}" data-task="${i}"><span>${t[0]}</span><b>${t[1]}</b><small>${t[2]}</small></button>`).join('');$('weekStrip').innerHTML=Array.from({length:12},(_,i)=>`<button data-week="${i+1}" class="${week===i+1?'active':''}">Week ${i+1}</button>`).join('');$('missionTasks').onclick=e=>{const b=e.target.closest('[data-task]');if(!b)return;const k=day+'-'+b.dataset.task;course.completed=course.completed||[];if(!course.completed.includes(k)){course.completed.push(k);course.stars=(course.stars||120)+5;b.classList.add('done');toast('Mission step complete! ⭐');celebrate(8);saveCourse();renderCourse()}};$('weekStrip').onclick=e=>{const b=e.target.closest('[data-week]');if(b){course.day=Math.min(90,(+b.dataset.week-1)*7+1);saveCourse();renderCourse()}}}
async function loadCourse(){const token=localStorage.getItem('brightbyte_student_token');if(token){try{const me=await fetch(API+'/api/auth/me',{headers:{Authorization:'Bearer '+token},cache:'no-store'});if(me.ok){const d=await me.json();if(d.role==='student'){studentProfile=d.profile;const r=await fetch(API+'/api/student/course-progress',{headers:{Authorization:'Bearer '+token},cache:'no-store'});if(r.ok){const x=await r.json();course={day:x.progress.day_number||1,stars:x.progress.stars||d.profile.stars||120,skills:parseMaybe(x.progress.skill_scores,{}),completed:parseMaybe(x.progress.daily_completed,[])};renderCourse();return}}}}catch{}}try{const x=JSON.parse(localStorage.getItem('tannu_demo_course')||'null');if(x)course=x}catch{}renderCourse()}
async function saveCourse(){const token=localStorage.getItem('brightbyte_student_token');if(token){try{await fetch(API+'/api/student/course-progress',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({dayNumber:course.day,stars:course.stars,skillScores:course.skills,dailyCompleted:course.completed})});return}catch{}}localStorage.setItem('tannu_demo_course',JSON.stringify(course))}
$('projectPreview').onclick=()=>{$('modalBody').innerHTML=`<div class="modal-hero"><span>🚀</span><h2>My First Digital Mission</h2><p>1. Identify 5 computer parts<br>2. Type a short self-introduction<br>3. Speak for 30 seconds<br>4. Complete a cyber safety challenge<br>5. Build one AI prompt<br>6. Solve one troubleshooting case</p></div><button class="modal-action" data-close>Ready!</button>`;openModal()};$('courseVoice').onclick=()=>speak('Your 90 day journey has three stages. Foundation, practice, and smart skills. Complete four short missions each day.');
async function loadStudents(){const demo={name:'Zen Alpha',cls:'Class 1',progress:20,focus:'90-Day Digital Explorer',photo:'🧒',demo:true},adminToken=localStorage.getItem('brightbyte_admin_token')||'',studentToken=localStorage.getItem('brightbyte_student_token')||'';let rows=[demo];try{if(studentToken){const me=await fetch(API+'/api/auth/me',{headers:{Authorization:'Bearer '+studentToken},cache:'no-store'});if(me.ok){const md=await me.json();if(md.role==='student'){studentProfile=md.profile;const rr=await fetch(API+'/api/student/roster',{headers:{Authorization:'Bearer '+studentToken},cache:'no-store'});if(rr.ok){const rd=await rr.json();rows=(rd.students||[]).map(x=>({name:x.display_name,cls:'Class '+x.class_number,progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital Explorer',photo:'🧒',userId:x.user_id,hasPhoto:x.has_photo,self:x.is_self,studentRoster:true}));renderStudents(rows);for(let i=0;i<rows.length;i++){const x=rows[i];if(!x.hasPhoto)continue;try{const pr=await fetch(`${API}/api/student/roster/${x.userId}/photo`,{headers:{Authorization:'Bearer '+studentToken},cache:'no-store'});if(pr.ok){const u=URL.createObjectURL(await pr.blob());const el=document.getElementById('sp-'+i);if(el)el.innerHTML=`<img src="${u}" alt="${escAttr(x.name)}">`}}catch{}}const pill=document.getElementById('studentSessionPill');if(pill){pill.hidden=false;pill.textContent=`👋 Hi ${md.profile.display_name} • Continue Learning`;pill.href='student-profile.html'}return}}}}if(adminToken){const r=await fetch(API+'/api/admin/students',{headers:{Authorization:'Bearer '+adminToken},cache:'no-store'});if(r.ok){const d=await r.json();rows=(d.students||[]).filter(x=>x.status==='active').map(x=>({name:x.display_name,cls:'Class '+x.class_number,progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital Explorer',photo:'🧒',userId:x.user_id,hasPhoto:x.has_photo,admin:true}));if(!rows.length)rows=[demo];renderStudents(rows);await hydratePhotos(rows,adminToken);return}}const r=await fetch(API+'/api/students/public',{cache:'no-store'});if(r.ok){const d=await r.json();const pubs=(d.students||[]).map(x=>({name:x.display_name,cls:'Class '+x.class_number,progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital Explorer',photoUrl:x.photo_url}));rows=pubs.length?pubs:[demo]}}catch{}renderStudents(rows)}
function renderStudents(rows){$('studentGrid').innerHTML=rows.map((s,i)=>`<article class="student-card"><div class="student-top"><div class="student-photo" id="sp-${i}">${s.photoUrl?`<img src="${escAttr(s.photoUrl)}" alt="">`:(s.photo||'🧒')}</div><div><h3>${esc(s.name)}</h3><small>${esc(s.cls)}</small></div></div><div class="progress"><i style="width:${Math.min(100,+s.progress||0)}%"></i></div><p><b>Progress:</b> ${+s.progress||0}%</p><p><b>Track:</b> ${esc(s.focus)}</p>${s.self?'<p><b>🔒 My Private Profile</b></p>':s.admin?'<p><b>🔒 Admin View</b></p>':s.demo?'<p><b>Demo Student</b></p>':'<p><b>🌐 Public</b></p>'}</article>`).join('')}
async function hydratePhotos(rows,token){for(let i=0;i<rows.length;i++){const s=rows[i];if(!s.userId||!s.hasPhoto)continue;try{const r=await fetch(`${API}/api/admin/students/${s.userId}/photo`,{headers:{Authorization:'Bearer '+token}});if(r.ok){const u=URL.createObjectURL(await r.blob());$('sp-'+i).innerHTML=`<img src="${u}" alt="">`}}catch{}}}
function openModal(){$('modal').classList.add('open');$('modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}function closeModal(){$('modal').classList.remove('open');$('modal').setAttribute('aria-hidden','true');document.body.style.overflow=''}$('modalClose').onclick=closeModal;$('modal').onclick=e=>{if(e.target===$('modal'))closeModal()};document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});$('celebrateBtn').onclick=()=>celebrate(35);
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>$('toast').classList.remove('show'),1600)}function celebrate(n=22){for(let i=0;i<n;i++){const c=document.createElement('i');c.className='confetti';c.style.left=(innerWidth/2+Math.random()*120-60)+'px';c.style.top=(innerHeight/2)+'px';c.style.background=['#ff67b8','#7363ff','#45d9df','#ffd35e','#39d09d'][i%5];c.style.setProperty('--x',(Math.random()*500-250)+'px');c.style.setProperty('--y',(Math.random()*400+130)+'px');document.body.appendChild(c);setTimeout(()=>c.remove(),1300)}}function shuffle(a){return [...a].sort(()=>Math.random()-.5)}function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function escAttr(s){return esc(s)}function parseMaybe(x,f){try{return typeof x==='string'?JSON.parse(x):x??f}catch{return f}}
const ANALYTICS={GA_ID:'',GOAT_CODE:'tannukids'};
function analytics(){const GA=ANALYTICS.GA_ID,GOAT=ANALYTICS.GOAT_CODE;if(GA&&/^G-/.test(GA)){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA);document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA)}if(GOAT){const s=document.createElement('script');s.async=true;s.dataset.goatcounter='https://'+GOAT+'.goatcounter.com/count';s.src='//gc.zgo.at/count.js';document.body.appendChild(s)}}
async function loadPublicStats(){try{const r=await fetch(API+'/api/public/stats',{cache:'no-store'});if(r.ok){const d=await r.json();if($('enrolledCount'))$('enrolledCount').textContent=d.active_students??'—';if($('reviewCount'))$('reviewCount').textContent=d.approved_reviews??'—'}}catch{}if($('questionCount'))$('questionCount').textContent=(window.TANNU_QUESTION_COUNT||5000)+'+';const code=ANALYTICS.GOAT_CODE;if(code&&$('visitorCount')){try{const r=await fetch('https://'+code+'.goatcounter.com/counter/TOTAL.json',{cache:'no-store'});if(r.ok){const d=await r.json();$('visitorCount').textContent=d.count||d.count_unique||'—'}}catch{}}}
renderDevices();renderModules();renderEnglish();renderConfidence();renderHealthy();renderGames();renderBadges();setupSpeech();loadStudents();loadCourse();analytics();loadPublicStats();page((location.hash||'#home').slice(1));
/* ============================================================
   V20 MAGICAL POINTER STAR BURST
   Mouse + touchscreen
   ============================================================ */

document.addEventListener(
  "pointerdown",
  function(e){

    if(
      typeof e.button === "number" &&
      e.button !== 0
    ){
      return;
    }

    const colours=[
      "#ffd95a",
      "#ff72b8",
      "#72eff0",
      "#8d7cff",
      "#71e49e",
      "#ff9b62"
    ];


    /* center magic ring */

    const ring=
      document.createElement(
        "span"
      );

    ring.className=
      "click-magic-ring";

    ring.style.left=
      e.clientX+"px";

    ring.style.top=
      e.clientY+"px";

    document.body
      .appendChild(ring);

    setTimeout(
      ()=>ring.remove(),
      700
    );


    /* flying stars */

    for(
      let i=0;
      i<10;
      i++
    ){

      const star=
        document.createElement(
          "span"
        );

      star.className=
        "star-pop";


      const angle=
        (
          Math.PI*2/10
        )*i
        +
        (
          Math.random()-.5
        )*.45;


      const distance=
        34+
        Math.random()*52;


      const dx=
        Math.cos(angle)
        *
        distance;


      const dy=
        Math.sin(angle)
        *
        distance;


      star.style.left=
        e.clientX+"px";

      star.style.top=
        e.clientY+"px";


      star.style.setProperty(
        "--dx",
        dx+"px"
      );


      star.style.setProperty(
        "--dy",
        dy+"px"
      );


      star.style.setProperty(
        "--rot",
        (
          Math.random()*420-210
        )
        +"deg"
      );


      star.style.setProperty(
        "--star-color",
        colours[
          Math.floor(
            Math.random()
            *
            colours.length
          )
        ]
      );


      const size=
        10+
        Math.random()*13;


      star.style.width=
        size+"px";

      star.style.height=
        size+"px";


      document.body
        .appendChild(star);


      setTimeout(
        ()=>star.remove(),
        900
      );

    }

  },
  {
    passive:true
  }
);
/* ============================================================
   V21 TANNU MAGICAL KIDS UNIVERSE
   Wand Pointer + Cosmos Rain + Kid Click Sounds
   ============================================================ */


/* ------------------------------------------------------------
   FAIRY WAND CURSOR
   ------------------------------------------------------------ */

(function tannuMagicWand(){

  const finePointer=
    window.matchMedia(
      "(pointer:fine)"
    );


  if(!finePointer.matches){
    return;
  }


  if(
    document.getElementById(
      "tannuMagicCursor"
    )
  ){
    return;
  }


  const cursor=
    document.createElement(
      "div"
    );


  cursor.id=
    "tannuMagicCursor";


  cursor.className=
    "tannu-wand-cursor";


  cursor.innerHTML=`

    <span class="tannu-wand-star">
      ★
    </span>

    <span class="tannu-wand-stick">
    </span>

  `;


  document.body
    .appendChild(cursor);


  document.body
    .classList
    .add(
      "tannu-wand-ready"
    );


  let x=-100;
  let y=-100;

  let frame=0;

  let lastDust=0;


  const dustColours=[
    "#fff27a",
    "#ff76c7",
    "#75f5ef",
    "#9b83ff",
    "#7cf092"
  ];


  function updateCursor(){

    cursor.style.setProperty(
      "--wand-x",
      x+"px"
    );

    cursor.style.setProperty(
      "--wand-y",
      y+"px"
    );

    frame=0;

  }


  document.addEventListener(
    "pointermove",
    function(e){

      x=e.clientX;
      y=e.clientY;


      if(!frame){

        frame=
          requestAnimationFrame(
            updateCursor
          );

      }


      const now=
        performance.now();


      if(
        now-lastDust > 42
      ){

        lastDust=now;


        const dust=
          document.createElement(
            "i"
          );


        dust.className=
          "tannu-wand-dust";


        dust.style.left=
          (
            x+
            Math.random()*12-6
          )
          +"px";


        dust.style.top=
          (
            y+
            Math.random()*12-6
          )
          +"px";


        dust.style.setProperty(
          "--dust-color",
          dustColours[
            Math.floor(
              Math.random()
              *
              dustColours.length
            )
          ]
        );


        document.body
          .appendChild(dust);


        setTimeout(
          ()=>dust.remove(),
          700
        );

      }

    },
    {
      passive:true
    }
  );


  document.addEventListener(
    "pointerdown",
    function(){

      cursor.classList
        .remove(
          "magic-click"
        );


      void cursor.offsetWidth;


      cursor.classList
        .add(
          "magic-click"
        );


      setTimeout(
        ()=>{
          cursor.classList
            .remove(
              "magic-click"
            );
        },
        300
      );

    },
    {
      passive:true
    }
  );


  document.documentElement
    .addEventListener(
      "mouseleave",
      ()=>{
        cursor.style.opacity="0";
      }
    );


  document.documentElement
    .addEventListener(
      "mouseenter",
      ()=>{
        cursor.style.opacity="1";
      }
    );

})();



/* ============================================================
   KID-FRIENDLY CLICK SOUNDS
   No MP3 required - Web Audio generated
   ============================================================ */

let tannuMagicAudio=null;


function tannuTone(
  frequency,
  delay,
  duration,
  type="sine",
  endFrequency=null,
  volume=.035
){

  if(!tannuMagicAudio){
    return;
  }


  const ctx=
    tannuMagicAudio;


  const start=
    ctx.currentTime
    +
    delay;


  const oscillator=
    ctx.createOscillator();


  const gain=
    ctx.createGain();


  oscillator.type=
    type;


  oscillator.frequency
    .setValueAtTime(
      Math.max(
        1,
        frequency
      ),
      start
    );


  oscillator.frequency
    .exponentialRampToValueAtTime(
      Math.max(
        1,
        endFrequency
        ||
        frequency
      ),
      start+
      duration
    );


  gain.gain
    .setValueAtTime(
      .0001,
      start
    );


  gain.gain
    .exponentialRampToValueAtTime(
      volume,
      start+.012
    );


  gain.gain
    .exponentialRampToValueAtTime(
      .0001,
      start+duration
    );


  oscillator
    .connect(gain);


  gain
    .connect(
      ctx.destination
    );


  oscillator.start(
    start
  );


  oscillator.stop(
    start+
    duration+
    .02
  );

}



function tannuPlayKidSound(){

  if(
    typeof voiceOn!=="undefined"
    &&
    !voiceOn
  ){
    return;
  }


  const AudioClass=
    window.AudioContext
    ||
    window.webkitAudioContext;


  if(!AudioClass){
    return;
  }


  if(!tannuMagicAudio){

    tannuMagicAudio=
      new AudioClass();

  }


  if(
    tannuMagicAudio.state
    ===
    "suspended"
  ){

    tannuMagicAudio
      .resume();

  }


  const sound=
    Math.floor(
      Math.random()*6
    );


  /* TWINKLE */

  if(sound===0){

    tannuTone(
      880,
      0,
      .12,
      "sine",
      1180,
      .028
    );

    tannuTone(
      1320,
      .08,
      .15,
      "sine",
      1580,
      .024
    );

  }


  /* BUBBLE POP */

  else if(sound===1){

    tannuTone(
      260,
      0,
      .16,
      "sine",
      620,
      .035
    );

  }


  /* MAGIC BELL */

  else if(sound===2){

    tannuTone(
      660,
      0,
      .22,
      "sine",
      660,
      .028
    );

    tannuTone(
      990,
      0,
      .18,
      "sine",
      990,
      .018
    );

  }


  /* LITTLE ROCKET */

  else if(sound===3){

    tannuTone(
      860,
      0,
      .20,
      "triangle",
      280,
      .025
    );

  }


  /* FAIRY CHIME */

  else if(sound===4){

    tannuTone(
      1046,
      0,
      .10,
      "sine",
      1046,
      .024
    );

    tannuTone(
      1318,
      .07,
      .10,
      "sine",
      1318,
      .023
    );

    tannuTone(
      1568,
      .14,
      .13,
      "sine",
      1568,
      .020
    );

  }


  /* BOING */

  else{

    tannuTone(
      340,
      0,
      .17,
      "triangle",
      520,
      .030
    );

    tannuTone(
      520,
      .08,
      .11,
      "sine",
      430,
      .018
    );

  }

}


document.addEventListener(
  "pointerdown",
  tannuPlayKidSound,
  {
    passive:true
  }
);



/* ============================================================
   GALAXY + PLANET + ALIEN + ROCKET RAIN
   ============================================================ */

(function tannuBuildCosmos(){

  const host=
    document.querySelector(
      ".space"
    );


  if(!host){
    return;
  }


  if(
    document.getElementById(
      "tannuCosmosField"
    )
  ){
    return;
  }


  const field=
    document.createElement(
      "div"
    );


  field.id=
    "tannuCosmosField";


  host.appendChild(
    field
  );


  const reduced=
    window.matchMedia(
      "(prefers-reduced-motion:reduce)"
    )
    .matches;


  if(reduced){
    return;
  }


  const mobile=
    window.innerWidth < 700;


  const emojis=[

    "🚀",
    "👽",
    "🛸",
    "☄️",
    "🛰️",
    "🌍",
    "🌙",
    "☀️",
    "🪐",
    "⭐",
    "✨",
    "🌟",
    "💫"

  ];


  const planetClasses=[

    "tannu-jupiter",
    "tannu-mars",
    "tannu-neptune",
    "tannu-venus"

  ];


  const directions=[

    "tannu-space-lr",
    "tannu-space-rl",
    "tannu-space-down",
    "tannu-space-up"

  ];


  const objectCount=
    mobile
    ?
    18
    :
    32;


  function random(
    min,
    max
  ){

    return (
      min+
      Math.random()*
      (
        max-min
      )
    );

  }


  for(
    let i=0;
    i<objectCount;
    i++
  ){

    const item=
      document.createElement(
        "span"
      );


    const direction=
      directions[
        Math.floor(
          Math.random()
          *
          directions.length
        )
      ];


    const specialPlanet=
      i%6===0;


    item.className=
      "tannu-cosmos-fly "
      +
      direction;


    if(specialPlanet){

      item.classList.add(
        "tannu-cosmos-planet"
      );


      item.classList.add(
        planetClasses[
          Math.floor(
            Math.random()
            *
            planetClasses.length
          )
        ]
      );

    }
    else{

      item.textContent=
        emojis[
          Math.floor(
            Math.random()
            *
            emojis.length
          )
        ];

    }


    const duration=
      random(
        14,
        36
      );


    item.style.setProperty(
      "--space-pos",
      random(
        3,
        95
      )
      +"%"
    );


    item.style.setProperty(
      "--space-duration",
      duration+"s"
    );


    item.style.setProperty(
      "--space-delay",
      (
        -Math.random()
        *
        duration
      )
      +"s"
    );


    item.style.setProperty(
      "--space-drift",
      random(
        -90,
        90
      )
      +"px"
    );


    item.style.setProperty(
      "--space-spin",
      random(
        140,
        700
      )
      +"deg"
    );


    item.style.setProperty(
      "--space-size",
      (
        specialPlanet
        ?
        random(
          30,
          72
        )
        :
        random(
          18,
          45
        )
      )
      +"px"
    );


    item.style.setProperty(
      "--space-opacity",
      random(
        .38,
        .90
      )
    );


    field.appendChild(
      item
    );

  }



  /* ----------------------------------------------------------
     STAR RAIN
     ---------------------------------------------------------- */

  const starCount=
    mobile
    ?
    12
    :
    28;


  const stars=[
    "✦",
    "✧",
    "⋆",
    "★",
    "✶"
  ];


  for(
    let i=0;
    i<starCount;
    i++
  ){

    const star=
      document.createElement(
        "span"
      );


    star.className=
      "tannu-cosmos-fly tannu-star-rain";


    const direction=
      directions[
        Math.floor(
          Math.random()
          *
          directions.length
        )
      ];


    star.classList.add(
      direction
    );


    star.textContent=
      stars[
        Math.floor(
          Math.random()
          *
          stars.length
        )
      ];


    const duration=
      random(
        7,
        18
      );


    star.style.setProperty(
      "--space-pos",
      random(
        1,
        98
      )
      +"%"
    );


    star.style.setProperty(
      "--space-duration",
      duration+"s"
    );


    star.style.setProperty(
      "--space-delay",
      (
        -Math.random()
        *
        duration
      )
      +"s"
    );


    star.style.setProperty(
      "--space-drift",
      random(
        -120,
        120
      )
      +"px"
    );


    star.style.setProperty(
      "--space-spin",
      random(
        180,
        620
      )
      +"deg"
    );


    star.style.setProperty(
      "--space-size",
      random(
        8,
        18
      )
      +"px"
    );


    star.style.setProperty(
      "--space-opacity",
      random(
        .30,
        .75
      )
    );


    field.appendChild(
      star
    );

  }

})();
/* ============================================================
   V22 CHATBOT GLOW + INTERACTIVE REWARDS
   Append this block at the VERY END of script.js
   ============================================================ */

(() => {
  "use strict";

  /* ----------------------------------------------------------
     1) REMOVE OLD OVERLAPPING HELPER + BIG GLOWING CHATBOT
     ---------------------------------------------------------- */

  if (!document.getElementById("tannuV22BuddyRewardStyle")) {
    const style = document.createElement("style");
    style.id = "tannuV22BuddyRewardStyle";
    style.textContent = `

#helper{
  display:none !important;
}

#tannuBuddyLaunch{
  width:116px !important;
  height:116px !important;
  right:26px !important;
  bottom:26px !important;
  border-radius:38px !important;
  border:3px solid rgba(255,255,255,.96) !important;
  background:
    linear-gradient(135deg,#28e6e0,#665cff 38%,#bd57ef 68%,#ff5fa6) !important;
  background-size:300% 300% !important;
  box-shadow:
    0 0 0 6px rgba(91,96,255,.16),
    0 0 24px rgba(61,232,224,.90),
    0 0 48px rgba(116,92,255,.82),
    0 0 78px rgba(255,91,176,.55),
    0 18px 38px rgba(5,11,44,.45) !important;
  animation:
    tannuV22BuddyGlow 1.9s ease-in-out infinite,
    tannuV22BuddyGradient 5s linear infinite !important;
  transform-origin:center center !important;
  overflow:visible !important;
  isolation:isolate;
}

#tannuBuddyLaunch::before{
  content:"";
  position:absolute;
  inset:-13px;
  border-radius:48px;
  border:2px solid rgba(89,235,255,.72);
  box-shadow:
    0 0 18px rgba(75,230,255,.75),
    inset 0 0 18px rgba(139,92,246,.28);
  pointer-events:none;
  animation:tannuV22Ring 1.9s ease-out infinite;
}

#tannuBuddyLaunch::after{
  content:"✨";
  position:absolute;
  right:-9px;
  top:-13px;
  font-size:23px;
  filter:drop-shadow(0 0 9px #fff);
  animation:tannuV22Spark 1.25s ease-in-out infinite alternate;
  pointer-events:none;
}

#tannuBuddyLaunch .bot{
  font-size:52px !important;
  line-height:1 !important;
  filter:
    drop-shadow(0 0 8px rgba(255,255,255,.95))
    drop-shadow(0 0 18px rgba(54,220,255,.75));
  animation:tannuV22BotFloat 2.2s ease-in-out infinite;
}

#tannuBuddyLaunch small{
  margin-top:5px !important;
  font-size:13px !important;
  font-weight:950 !important;
  letter-spacing:.2px !important;
  color:#fff !important;
  text-shadow:0 2px 8px rgba(32,18,95,.9) !important;
}

#tannuBuddyLaunch:hover{
  transform:scale(1.08) translateY(-3px) !important;
}

#tannuBuddyLaunch:active{
  transform:scale(.98) !important;
}

@keyframes tannuV22BuddyGlow{
  0%,100%{
    box-shadow:
      0 0 0 6px rgba(91,96,255,.14),
      0 0 20px rgba(61,232,224,.76),
      0 0 42px rgba(116,92,255,.66),
      0 0 68px rgba(255,91,176,.42),
      0 18px 38px rgba(5,11,44,.45);
  }

  50%{
    box-shadow:
      0 0 0 10px rgba(62,231,224,.18),
      0 0 34px rgba(61,232,224,1),
      0 0 66px rgba(116,92,255,.94),
      0 0 96px rgba(255,91,176,.72),
      0 22px 48px rgba(5,11,44,.52);
  }
}

@keyframes tannuV22BuddyGradient{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}

@keyframes tannuV22Ring{
  0%{
    transform:scale(.88);
    opacity:.95;
  }

  70%{
    transform:scale(1.13);
    opacity:.15;
  }

  100%{
    transform:scale(1.16);
    opacity:0;
  }
}

@keyframes tannuV22Spark{
  from{
    transform:rotate(-12deg) scale(.82);
    opacity:.72;
  }

  to{
    transform:rotate(14deg) scale(1.18);
    opacity:1;
  }
}

@keyframes tannuV22BotFloat{
  0%,100%{
    transform:translateY(0);
  }

  50%{
    transform:translateY(-5px);
  }
}

/* Rewards look clickable */

#badgeGrid .badge-card{
  cursor:pointer !important;
  transition:
    transform .22s ease,
    box-shadow .22s ease,
    filter .22s ease !important;
}

#badgeGrid .badge-card:hover{
  transform:translateY(-7px) scale(1.025) !important;
  box-shadow:
    0 18px 40px rgba(0,0,0,.28),
    0 0 25px rgba(117,99,255,.35) !important;
}

#badgeGrid .badge-card:focus-visible{
  outline:3px solid #72e7ff !important;
  outline-offset:4px !important;
}

#badgeGrid .badge-card.locked:hover{
  filter:brightness(1.08) !important;
}

@media(max-width:600px){

  #tannuBuddyLaunch{
    width:98px !important;
    height:98px !important;
    right:16px !important;
    bottom:16px !important;
    border-radius:32px !important;
  }

  #tannuBuddyLaunch .bot{
    font-size:44px !important;
  }

  #tannuBuddyLaunch small{
    font-size:12px !important;
  }
}

@media(prefers-reduced-motion:reduce){

  #tannuBuddyLaunch,
  #tannuBuddyLaunch::before,
  #tannuBuddyLaunch::after,
  #tannuBuddyLaunch .bot{
    animation:none !important;
  }
}

`;

    document.head.appendChild(style);
  }


  /* ----------------------------------------------------------
     2) REWARDS — CLICK EVERY BADGE
     ---------------------------------------------------------- */

  const rewardHelp = [
    "Explore the Digital World and learn the basic computer parts.",
    "Practise pointing, clicking, double-clicking, dragging and scrolling.",
    "Practise typing letters, words and short sentences correctly.",
    "Complete English speaking and listen-and-repeat activities.",
    "Complete Brave Speaker activities and speak clearly with confidence.",
    "Practise listening carefully and waiting for your turn to speak.",
    "Use polite words such as please, thank you, sorry and excuse me.",
    "Practise water, healthy food, sleep, cleanliness and movement habits.",
    "Complete cyber-safety activities about passwords, links and trusted adults.",
    "Learn what AI is, what it can do and why its answers should be checked.",
    "Complete the AI Prompt Challenge using Who + Where + Action.",
    "Complete your 90-day Digital Mission and final learning challenges."
  ];

  const rewardMessages = [
    "Computer Explorer badge celebrates your first digital skills.",
    "Mouse Master badge celebrates strong mouse-control practice.",
    "Keyboard Hero badge celebrates your typing practice.",
    "English Speaker badge celebrates your speaking practice.",
    "Brave Speaker badge celebrates confidence and clear speaking.",
    "Good Listener badge celebrates careful listening and communication.",
    "Polite Star badge celebrates kind and respectful manners.",
    "Healthy Hero badge celebrates healthy daily habits.",
    "Safety Hero badge celebrates smart and safe online choices.",
    "AI Explorer badge celebrates learning the basics of artificial intelligence.",
    "Prompt Creator badge celebrates building clear AI prompts.",
    "Mission Champion is the big reward for completing the 90-day mission."
  ];

  function decorateRewardCards(){

    const grid =
      document.getElementById("badgeGrid");

    if(!grid){
      return;
    }

    [
      ...grid.querySelectorAll(".badge-card")
    ].forEach((card,index)=>{

      card.dataset.rewardIndex =
        String(index);

      card.setAttribute(
        "role",
        "button"
      );

      card.setAttribute(
        "tabindex",
        "0"
      );

      card.setAttribute(
        "aria-label",
        `${badges[index]?.[1] || "Reward"} reward details`
      );

    });
  }


  function openRewardCard(index){

    const badge =
      badges[index];

    if(!badge){
      return;
    }

    const unlocked =
      Boolean(badge[3]);

    const statusText =
      unlocked
        ? "UNLOCKED"
        : "LOCKED";

    const statusIcon =
      unlocked
        ? "🏆"
        : "🔒";

    const statusMessage =
      unlocked

        ? "Excellent! You have already earned this badge."

        : "Keep learning — this badge will unlock when you complete its skill challenge.";


    const modalBody =
      document.getElementById("modalBody");

    if(!modalBody){
      return;
    }


    modalBody.innerHTML = `

      <div class="modal-hero">

        <span style="font-size:72px">
          ${badge[0]}
        </span>

        <small>
          ${statusIcon} ${statusText}
        </small>

        <h2>
          ${badge[1]}
        </h2>

        <p>
          ${badge[2]}
        </p>

      </div>


      <article class="lesson">

        <small>
          ABOUT THIS BADGE
        </small>

        <h3>
          ${rewardMessages[index] || badge[1]}
        </h3>

      </article>


      <article class="lesson">

        <small>
          HOW TO EARN IT
        </small>

        <h3>
          ${rewardHelp[index] || "Keep completing academy activities."}
        </h3>

      </article>


      <article class="lesson">

        <small>
          YOUR STATUS
        </small>

        <h3>
          ${statusMessage}
        </h3>

      </article>


      <div class="button-row">

        <button
          id="rewardHearBtn"
          class="voice-chip">
          🔊 Hear Badge
        </button>

        <button
          class="modal-action"
          data-close>
          Done
        </button>

      </div>
    `;


    openModal();


    const hear =
      document.getElementById(
        "rewardHearBtn"
      );


    if(hear){

      hear.onclick = ()=>{

        speak(
          `${badge[1]}. ${rewardMessages[index]} ${statusMessage}`
        );

      };
    }


    if(unlocked){

      celebrate(12);

    }
  }


  function setupInteractiveRewards(){

    const grid =
      document.getElementById("badgeGrid");


    if(!grid){
      return;
    }


    if(
      grid.dataset.v22RewardsReady !== "1"
    ){

      grid.dataset.v22RewardsReady =
        "1";


      grid.addEventListener(
        "click",
        event=>{

          const card =
            event.target.closest(
              ".badge-card"
            );


          if(
            !card ||
            !grid.contains(card)
          ){
            return;
          }


          const index =
            Number(
              card.dataset.rewardIndex
            );


          if(
            Number.isInteger(index)
          ){
            openRewardCard(index);
          }

        }
      );


      grid.addEventListener(
        "keydown",
        event=>{

          if(
            event.key !== "Enter" &&
            event.key !== " "
          ){
            return;
          }


          const card =
            event.target.closest(
              ".badge-card"
            );


          if(
            !card ||
            !grid.contains(card)
          ){
            return;
          }


          event.preventDefault();


          const index =
            Number(
              card.dataset.rewardIndex
            );


          if(
            Number.isInteger(index)
          ){
            openRewardCard(index);
          }

        }
      );


      new MutationObserver(
        decorateRewardCards
      ).observe(
        grid,
        {
          childList:true
        }
      );
    }


    decorateRewardCards();
  }


  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      setupInteractiveRewards,
      {
        once:true
      }
    );

  }else{

    setupInteractiveRewards();

  }

})();
/* ============================================================
   V23 NAVIGATION ORDER + KIDS GLOW BUTTONS + CLEAR REWARDS
   Append at the VERY END of script.js
   ============================================================ */

(() => {
  "use strict";

  function setupV23Navigation(){

    const nav =
      document.querySelector(".mainnav");

    if(!nav){
      return;
    }

    const buttons =
      [...nav.querySelectorAll("button")];

    function findButton(label){

      const wanted =
        label
          .toLowerCase()
          .replace(/\s+/g,"")
          .trim();

      return buttons.find(btn=>{

        const text =
          String(btn.textContent || "")
            .replace(/[^\p{L}\p{N}\s-]/gu,"")
            .toLowerCase()
            .replace(/\s+/g,"")
            .trim();

        return (
          text === wanted ||
          text.includes(wanted)
        );

      });
    }


    /*
      HOME stays first.
      Then user's requested order.
    */

    const orderedLabels = [
      "Home",
      "90-Day",
      "Students",
      "Parent View",
      "Parent Reviews",
      "Rewards",
      "Digital",
      "English",
      "Games",
      "Confidence",
      "Healthy",
      "Admin Center"
    ];


    orderedLabels.forEach(label=>{

      const button =
        findButton(label);

      if(button){
        nav.appendChild(button);
      }

    });


    /*
      Assign permanent colour classes
      AFTER reordering.
    */

    [...nav.querySelectorAll("button")]
      .forEach((button,index)=>{

        button.classList.remove(
          "tannu-nav-1",
          "tannu-nav-2",
          "tannu-nav-3",
          "tannu-nav-4",
          "tannu-nav-5",
          "tannu-nav-6",
          "tannu-nav-7",
          "tannu-nav-8",
          "tannu-nav-9",
          "tannu-nav-10",
          "tannu-nav-11",
          "tannu-nav-12"
        );

        button.classList.add(
          `tannu-nav-${index + 1}`
        );

      });

  }


  /* =========================================================
     STYLE
     ========================================================= */

  if(
    !document.getElementById(
      "tannuV23NavRewardStyle"
    )
  ){

    const style =
      document.createElement("style");

    style.id =
      "tannuV23NavRewardStyle";

    style.textContent = `

/* ============================================================
   TOP NAV — COLOURFUL KIDS BUTTONS
   ============================================================ */

.mainnav{
  gap:7px !important;
}

.mainnav button{
  position:relative !important;

  overflow:hidden !important;

  border:
    1px solid rgba(255,255,255,.42)
    !important;

  color:#fff !important;

  font-weight:950 !important;

  text-shadow:
    0 1px 5px rgba(20,15,75,.78)
    !important;

  transition:
    transform .18s ease,
    filter .18s ease,
    box-shadow .18s ease
    !important;

  animation:
    tannuV23NavPulse 2.4s
    ease-in-out infinite
    !important;
}


/* moving light across every button */

.mainnav button::after{

  content:"";

  position:absolute;

  top:-35%;

  left:-65%;

  width:40%;

  height:170%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.72),
      transparent
    );

  transform:
    rotate(18deg);

  animation:
    tannuV23NavShine 3.4s
    linear infinite;

  pointer-events:none;
}


/* ------------------------------------------------------------
   INDIVIDUAL BUTTON COLOURS
   ------------------------------------------------------------ */

/* HOME */
.mainnav .tannu-nav-1{
  background:
    linear-gradient(
      135deg,
      #27c7ff,
      #5265ff
    ) !important;

  animation-delay:0s !important;
}


/* 90-DAY */
.mainnav .tannu-nav-2{
  background:
    linear-gradient(
      135deg,
      #11c9a4,
      #22a9e8
    ) !important;

  animation-delay:.12s !important;
}


/* STUDENTS */
.mainnav .tannu-nav-3{
  background:
    linear-gradient(
      135deg,
      #9b5cff,
      #cf57dc
    ) !important;

  animation-delay:.24s !important;
}


/* PARENT VIEW */
.mainnav .tannu-nav-4{
  background:
    linear-gradient(
      135deg,
      #ff8c42,
      #ffba45
    ) !important;

  animation-delay:.36s !important;
}


/* PARENT REVIEWS */
.mainnav .tannu-nav-5{
  background:
    linear-gradient(
      135deg,
      #f25ba6,
      #d859e8
    ) !important;

  animation-delay:.48s !important;
}


/* REWARDS */
.mainnav .tannu-nav-6{
  background:
    linear-gradient(
      135deg,
      #ffd447,
      #ff8750,
      #ff5e98
    ) !important;

  animation-delay:.60s !important;
}


/* DIGITAL */
.mainnav .tannu-nav-7{
  background:
    linear-gradient(
      135deg,
      #27d9cf,
      #1a8cff
    ) !important;

  animation-delay:.72s !important;
}


/* ENGLISH */
.mainnav .tannu-nav-8{
  background:
    linear-gradient(
      135deg,
      #8759ff,
      #e15ed4
    ) !important;

  animation-delay:.84s !important;
}


/* GAMES */
.mainnav .tannu-nav-9{
  background:
    linear-gradient(
      135deg,
      #ec4d91,
      #823de9
    ) !important;

  animation-delay:.96s !important;
}


/* CONFIDENCE */
.mainnav .tannu-nav-10{
  background:
    linear-gradient(
      135deg,
      #f6b62b,
      #ff713d
    ) !important;

  animation-delay:1.08s !important;
}


/* HEALTHY */
.mainnav .tannu-nav-11{
  background:
    linear-gradient(
      135deg,
      #35c66f,
      #1bb5a8
    ) !important;

  animation-delay:1.20s !important;
}


/* ADMIN */
.mainnav .tannu-nav-12{
  background:
    linear-gradient(
      135deg,
      #5f66e8,
      #8938c9
    ) !important;

  animation-delay:1.32s !important;
}


/* ============================================================
   HOVER
   ============================================================ */

.mainnav button:hover{

  transform:
    translateY(-4px)
    scale(1.06)
    !important;

  filter:
    brightness(1.15)
    saturate(1.15)
    !important;

  box-shadow:
    0 0 12px rgba(255,255,255,.65),
    0 0 28px rgba(91,191,255,.55),
    0 10px 25px rgba(5,9,39,.35)
    !important;
}


/* current selected page */

.mainnav button.active{

  transform:
    translateY(-2px)
    scale(1.04)
    !important;

  border:
    2px solid #fff
    !important;

  box-shadow:
    0 0 10px #fff,
    0 0 23px rgba(91,232,255,.92),
    0 0 42px rgba(161,91,255,.68)
    !important;
}


/* ============================================================
   SOFT CONTINUOUS KIDS BLINK / GLOW
   Not harsh rapid flashing
   ============================================================ */

@keyframes tannuV23NavPulse{

  0%,100%{

    filter:
      brightness(.96)
      saturate(1);

    box-shadow:
      0 0 5px
      rgba(255,255,255,.12);

  }

  50%{

    filter:
      brightness(1.18)
      saturate(1.22);

    box-shadow:
      0 0 9px
      rgba(255,255,255,.58),
      0 0 20px
      rgba(103,170,255,.38);

  }

}


@keyframes tannuV23NavShine{

  0%{
    left:-70%;
  }

  42%{
    left:135%;
  }

  100%{
    left:135%;
  }

}


/* ============================================================
   VOICE BUTTON
   Keep at its current RIGHT position
   ============================================================ */

#voiceBtn{

  position:relative;

  overflow:hidden;

  color:#fff !important;

  border:
    1px solid rgba(255,255,255,.65)
    !important;

  background:
    linear-gradient(
      135deg,
      #29c8ef,
      #6758ef,
      #e65bc2
    ) !important;

  background-size:
    220% 220%
    !important;

  box-shadow:
    0 0 15px
    rgba(96,187,255,.55)
    !important;

  animation:
    tannuV23VoiceGlow 2.2s
    ease-in-out infinite
    !important;
}


@keyframes tannuV23VoiceGlow{

  0%,100%{

    background-position:
      0% 50%;

    box-shadow:
      0 0 8px
      rgba(69,221,232,.38);

  }

  50%{

    background-position:
      100% 50%;

    box-shadow:
      0 0 14px
      rgba(255,255,255,.65),
      0 0 29px
      rgba(156,95,255,.72);

  }

}


/* ============================================================
   REWARDS — MAKE LOCKED BADGES FULLY VISIBLE
   ============================================================ */

#badgeGrid .badge-card{

  position:relative !important;

  opacity:1 !important;

  filter:none !important;

  visibility:visible !important;

  transform:none;

  color:#272b58 !important;

  border:
    2px solid
    rgba(255,255,255,.78)
    !important;

  box-shadow:
    0 12px 28px
    rgba(8,13,54,.23)
    !important;
}


/* Locked cards are NOT faded anymore */

#badgeGrid .badge-card.locked{

  opacity:1 !important;

  filter:none !important;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #edf1ff,
      #e7f8ff
    ) !important;

  color:#25295d !important;

  border:
    2px solid
    rgba(150,151,255,.55)
    !important;

}


/* Make locked icon clear */

#badgeGrid .badge-card.locked > span{

  opacity:1 !important;

  filter:none !important;

  transform:
    scale(1.05);

}


/* clear heading */

#badgeGrid .badge-card.locked h4{

  opacity:1 !important;

  color:#292e64 !important;

  font-weight:950 !important;

}


/* clear subtitle */

#badgeGrid .badge-card.locked p{

  opacity:1 !important;

  color:#667092 !important;

}


/* LOCK label */

#badgeGrid .badge-card.locked::after{

  content:"🔒 LOCKED";

  position:absolute;

  right:9px;

  top:9px;

  padding:
    4px 7px;

  border-radius:
    999px;

  color:#fff;

  background:
    linear-gradient(
      135deg,
      #7561ef,
      #e05cae
    );

  font-size:
    7px;

  letter-spacing:
    .5px;

  font-weight:
    950;

  box-shadow:
    0 4px 12px
    rgba(87,66,193,.25);

}


/* UNLOCKED badge */

#badgeGrid .badge-card:not(.locked)::after{

  content:"🏆 EARNED";

  position:absolute;

  right:9px;

  top:9px;

  padding:
    4px 7px;

  border-radius:
    999px;

  color:#fff;

  background:
    linear-gradient(
      135deg,
      #23b86f,
      #2ec8a3
    );

  font-size:
    7px;

  letter-spacing:
    .5px;

  font-weight:
    950;

}


/* reward card hover */

#badgeGrid .badge-card:hover{

  transform:
    translateY(-8px)
    scale(1.025)
    !important;

  box-shadow:
    0 18px 38px
    rgba(5,12,55,.34),
    0 0 24px
    rgba(96,124,255,.46)
    !important;

}


/* ============================================================
   SMALL SCREEN NAVIGATION
   ============================================================ */

@media(max-width:1100px){

  .mainnav{

    overflow-x:auto;

    justify-content:flex-start
    !important;

    scrollbar-width:
      thin;

    padding-bottom:
      3px;

  }

  .mainnav button{

    flex:
      0 0 auto;

  }

}


@media(prefers-reduced-motion:reduce){

  .mainnav button,
  .mainnav button::after,
  #voiceBtn{

    animation:
      none !important;

  }

}

`;

    document.head.appendChild(
      style
    );

  }


  /* =========================================================
     RUN
     ========================================================= */

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      setupV23Navigation,
      {
        once:true
      }
    );

  }else{

    setupV23Navigation();

  }

})();

/* ============================================================
   V24 COLORFUL STUDENT GALAXY CARDS
   Append at the VERY END of script.js
   ============================================================ */

(() => {
  "use strict";

  if(document.getElementById("tannuV24StudentCards")){
    return;
  }

  const style=document.createElement("style");
  style.id="tannuV24StudentCards";

  style.textContent=`

/* ============================================================
   STUDENT GRID
   ============================================================ */

#studentGrid{
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:18px !important;
  align-items:stretch !important;
}


/* ============================================================
   MAIN CARD
   ============================================================ */

#studentGrid .student-card{
  --card-a:#7868ff;
  --card-b:#39d9da;
  --card-c:#f35daf;

  position:relative !important;
  isolation:isolate !important;

  min-height:190px !important;
  padding:22px 20px 18px !important;

  overflow:hidden !important;

  border-radius:28px !important;

  border:
    2px solid rgba(255,255,255,.34)
    !important;

  background:
    radial-gradient(
      circle at 85% 15%,
      rgba(255,255,255,.23),
      transparent 25%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb,var(--card-a) 28%,#151d59),
      color-mix(in srgb,var(--card-b) 17%,#131a50) 52%,
      color-mix(in srgb,var(--card-c) 18%,#101744)
    )
    !important;

  box-shadow:
    0 16px 35px rgba(5,9,45,.30),
    inset 0 1px 0 rgba(255,255,255,.16)
    !important;

  transition:
    transform .28s ease,
    box-shadow .28s ease,
    border-color .28s ease
    !important;

  animation:
    tannuStudentCardGlow 4s ease-in-out infinite
    !important;
}


/* rainbow light strip */

#studentGrid .student-card::before{
  content:"";

  position:absolute;

  left:0;
  right:0;
  top:0;

  height:7px;

  background:
    linear-gradient(
      90deg,
      var(--card-a),
      var(--card-b),
      #ffe45e,
      var(--card-c),
      var(--card-a)
    );

  background-size:220% 100%;

  animation:
    tannuStudentRainbow 4s linear infinite;

  z-index:2;
}


/* cute learner label */

#studentGrid .student-card::after{
  content:"⭐ LEARNER";

  position:absolute;

  right:14px;
  top:15px;

  padding:5px 9px;

  border-radius:999px;

  font-size:8px;
  font-weight:950;
  letter-spacing:.7px;

  color:#33335f;

  background:
    linear-gradient(
      135deg,
      #fff8bf,
      #ffe15e
    );

  box-shadow:
    0 5px 14px rgba(0,0,0,.18);

  z-index:4;
}


/* ============================================================
   DIFFERENT COLOR FOR EACH STUDENT
   ============================================================ */

#studentGrid .student-card:nth-child(6n+1){
  --card-a:#7262ff;
  --card-b:#28d9d0;
  --card-c:#ef5fb0;
}

#studentGrid .student-card:nth-child(6n+2){
  --card-a:#ff6d9e;
  --card-b:#bd5cff;
  --card-c:#ffb84d;
}

#studentGrid .student-card:nth-child(6n+3){
  --card-a:#24c8ef;
  --card-b:#4f72ff;
  --card-c:#a962ff;
}

#studentGrid .student-card:nth-child(6n+4){
  --card-a:#ff9e45;
  --card-b:#ff5f96;
  --card-c:#9d63ff;
}

#studentGrid .student-card:nth-child(6n+5){
  --card-a:#2dd497;
  --card-b:#24c9e7;
  --card-c:#7268ff;
}

#studentGrid .student-card:nth-child(6n){
  --card-a:#f4c542;
  --card-b:#ff775e;
  --card-c:#e456ba;
}


/* ============================================================
   HOVER — LITTLE 3D FLOAT
   ============================================================ */

#studentGrid .student-card:hover{
  transform:
    translateY(-9px)
    scale(1.025)
    rotateX(1deg)
    !important;

  border-color:
    rgba(255,255,255,.72)
    !important;

  box-shadow:
    0 23px 45px rgba(5,8,45,.42),
    0 0 25px color-mix(in srgb,var(--card-a) 55%,transparent),
    0 0 42px color-mix(in srgb,var(--card-b) 28%,transparent)
    !important;
}


/* ============================================================
   STUDENT TOP SECTION
   ============================================================ */

#studentGrid .student-top{
  position:relative;
  z-index:3;

  display:flex !important;
  align-items:center !important;

  gap:15px !important;

  margin-bottom:14px !important;

  padding-right:65px !important;
}


/* ============================================================
   PHOTO
   ============================================================ */

#studentGrid .student-photo{
  position:relative !important;

  width:72px !important;
  height:72px !important;

  min-width:72px !important;

  display:grid !important;
  place-items:center !important;

  overflow:hidden !important;

  border-radius:24px !important;

  font-size:38px !important;

  color:#25305e !important;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #e8faff
    )
    !important;

  border:
    4px solid rgba(255,255,255,.90)
    !important;

  box-shadow:
    0 0 0 3px
      color-mix(
        in srgb,
        var(--card-b) 55%,
        transparent
      ),
    0 10px 22px
      rgba(5,10,55,.27)
    !important;

  animation:
    tannuStudentPhotoFloat
    3.2s ease-in-out infinite;
}


/* uploaded student photo */

#studentGrid .student-photo img{
  width:100% !important;
  height:100% !important;

  display:block !important;

  object-fit:cover !important;

  border-radius:19px !important;
}


/* ============================================================
   NAME
   ============================================================ */

#studentGrid .student-top h3{
  margin:0 0 7px !important;

  color:#fff !important;

  font-size:20px !important;
  line-height:1.08 !important;

  font-weight:950 !important;

  letter-spacing:-.2px !important;

  text-shadow:
    0 3px 10px rgba(0,0,0,.28)
    !important;
}


/* ============================================================
   CLASS PILL
   ============================================================ */

#studentGrid .student-top small{
  display:inline-flex !important;

  width:max-content !important;

  padding:5px 10px !important;

  border-radius:999px !important;

  color:#fff !important;

  font-size:10px !important;
  font-weight:900 !important;

  background:
    linear-gradient(
      135deg,
      var(--card-a),
      var(--card-b)
    )
    !important;

  border:
    1px solid rgba(255,255,255,.38)
    !important;

  box-shadow:
    0 4px 10px
    rgba(0,0,0,.15)
    !important;
}


/* ============================================================
   INFORMATION ROWS
   ============================================================ */

#studentGrid .student-card > p{
  position:relative;
  z-index:3;

  margin:7px 0 !important;

  padding:7px 10px !important;

  border-radius:11px !important;

  color:#f7f9ff !important;

  font-size:11px !important;
  line-height:1.35 !important;

  background:
    rgba(255,255,255,.085)
    !important;

  border:
    1px solid rgba(255,255,255,.09)
    !important;
}


#studentGrid .student-card > p b{
  color:#fff !important;
  font-weight:950 !important;
}


/* status line */

#studentGrid .student-card > p:last-child{
  display:inline-flex !important;

  width:auto !important;

  margin-top:10px !important;

  padding:6px 11px !important;

  border-radius:999px !important;

  background:
    linear-gradient(
      135deg,
      rgba(45,215,148,.92),
      rgba(38,193,209,.92)
    )
    !important;

  border:
    1px solid rgba(255,255,255,.35)
    !important;

  box-shadow:
    0 5px 14px
    rgba(10,84,91,.22)
    !important;
}


/* ============================================================
   PROGRESS BAR
   ============================================================ */

#studentGrid .progress{
  position:relative !important;
  z-index:3;

  height:9px !important;

  overflow:hidden !important;

  margin:10px 0 11px !important;

  border-radius:999px !important;

  background:
    rgba(255,255,255,.14)
    !important;

  border:
    1px solid rgba(255,255,255,.10)
    !important;
}


#studentGrid .progress i{
  position:relative !important;

  display:block !important;

  height:100% !important;

  border-radius:999px !important;

  background:
    linear-gradient(
      90deg,
      #ffe45c,
      var(--card-b),
      #ff6ab3
    )
    !important;

  box-shadow:
    0 0 12px
    color-mix(
      in srgb,
      var(--card-b) 70%,
      transparent
    )
    !important;
}


/* animated shine in progress */

#studentGrid .progress i::after{
  content:"";

  position:absolute;

  inset:0;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.8),
      transparent
    );

  transform:
    translateX(-100%);

  animation:
    tannuStudentProgressShine
    2.4s ease-in-out infinite;
}


/* ============================================================
   DECORATIVE BUBBLES
   ============================================================ */

#studentGrid .student-card .student-top::after{
  content:"✦";

  position:absolute;

  right:-32px;
  bottom:-4px;

  color:
    rgba(255,255,255,.36);

  font-size:28px;

  filter:
    drop-shadow(
      0 0 8px
      var(--card-b)
    );

  animation:
    tannuStudentSparkle
    2.3s ease-in-out infinite;
}


/* ============================================================
   ANIMATIONS
   ============================================================ */

@keyframes tannuStudentCardGlow{

  0%,100%{
    filter:brightness(1);
  }

  50%{
    filter:brightness(1.06);
  }

}


@keyframes tannuStudentRainbow{

  from{
    background-position:0% 50%;
  }

  to{
    background-position:220% 50%;
  }

}


@keyframes tannuStudentPhotoFloat{

  0%,100%{
    transform:translateY(0);
  }

  50%{
    transform:translateY(-4px);
  }

}


@keyframes tannuStudentProgressShine{

  0%,45%{
    transform:translateX(-120%);
  }

  75%,100%{
    transform:translateX(120%);
  }

}


@keyframes tannuStudentSparkle{

  0%,100%{
    transform:
      rotate(0deg)
      scale(.85);

    opacity:.4;
  }

  50%{
    transform:
      rotate(22deg)
      scale(1.2);

    opacity:1;
  }

}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media(max-width:1200px){

  #studentGrid{
    grid-template-columns:
      repeat(3,minmax(0,1fr))
      !important;
  }

}


@media(max-width:850px){

  #studentGrid{
    grid-template-columns:
      repeat(2,minmax(0,1fr))
      !important;
  }

}


@media(max-width:560px){

  #studentGrid{
    grid-template-columns:
      1fr
      !important;

    gap:14px !important;
  }

  #studentGrid .student-card{
    min-height:175px !important;
  }

}


@media(prefers-reduced-motion:reduce){

  #studentGrid .student-card,
  #studentGrid .student-photo,
  #studentGrid .progress i::after,
  #studentGrid .student-card .student-top::after,
  #studentGrid .student-card::before{
    animation:none !important;
  }

}

`;

  document.head.appendChild(style);

})();
/* ============================================================
   V25 CLEAR & FRIENDLY PARENT VIEW
   Explains purpose, demo data and parent progress flow
   Append at the VERY END of script.js
   ============================================================ */

(() => {
  "use strict";

  function setupClearParentView(){

    const section =
      document.getElementById("parents");

    if(
      !section ||
      section.dataset.v25ParentReady === "1"
    ){
      return;
    }

    section.dataset.v25ParentReady = "1";


    /* ========================================================
       1. CLEAR SUBTITLE UNDER MAIN HEADING
       ======================================================== */

    const headText =
      section.querySelector(
        ".section-head > div"
      );

    if(
      headText &&
      !headText.querySelector(
        ".parent-purpose-text"
      )
    ){

      const p =
        document.createElement("p");

      p.className =
        "parent-purpose-text";

      p.innerHTML = `
        This page helps parents and visitors understand
        <b>what a child is learning</b>,
        <b>how much practice is happening</b>,
        and <b>what may need attention next</b>.
        It focuses on learning progress — not just time spent on a screen.
      `;

      headText.appendChild(p);

    }


    /* ========================================================
       2. PURPOSE / DEMO NOTICE
       ======================================================== */

    const parentGrid =
      section.querySelector(
        ".parent-grid"
      );

    if(parentGrid){

      const intro =
        document.createElement("div");

      intro.className =
        "parent-view-intro";

      intro.innerHTML = `

        <div class="parent-demo-note">

          <div class="parent-demo-icon">
            👨‍👩‍👧
          </div>

          <div>

            <small>
              WHAT IS PARENT VIEW?
            </small>

            <h3>
              A simple learning progress preview for parents
            </h3>

            <p>
              Parent View shows how learning can be summarized
              across digital skills, English, safety, confidence
              and AI activities.
            </p>

          </div>

        </div>


        <div class="parent-demo-warning">

          <span>
            ℹ️
          </span>

          <div>

            <b>
              Demo Preview
            </b>

            <p>
              Zen Alpha is a fictional demo learner.
              The percentages and weekly activity shown below
              are sample data used to explain how a progress
              summary can look.
            </p>

          </div>

        </div>

      `;

      parentGrid
        .insertAdjacentElement(
          "beforebegin",
          intro
        );

    }


    /* ========================================================
       3. EXPLAIN WHAT EACH PART MEANS
       ======================================================== */

    if(parentGrid){

      const guide =
        document.createElement("div");

      guide.className =
        "parent-guide-grid";

      guide.innerHTML = `

        <article class="parent-guide-card pg-purple">

          <span>
            📊
          </span>

          <div>

            <small>
              SKILL SNAPSHOT
            </small>

            <h3>
              What is the child practising?
            </h3>

            <p>
              The skill panel gives a quick view of areas such as
              Computer, English, Safety, Confidence and AI.
            </p>

          </div>

        </article>


        <article class="parent-guide-card pg-blue">

          <span>
            📅
          </span>

          <div>

            <small>
              WEEKLY ACTIVITY
            </small>

            <h3>
              What happened this week?
            </h3>

            <p>
              See a simple summary of lessons, speaking practice,
              games and newly earned badges.
            </p>

          </div>

        </article>


        <article class="parent-guide-card pg-orange">

          <span>
            🧭
          </span>

          <div>

            <small>
              NEXT STEP
            </small>

            <h3>
              What should be practised next?
            </h3>

            <p>
              Weekly progress can help identify strong areas,
              areas needing more practice and the next learning step.
            </p>

          </div>

        </article>


        <article class="parent-guide-card pg-green">

          <span>
            🛡️
          </span>

          <div>

            <small>
              SAFE LEARNING
            </small>

            <h3>
              How is the learning environment designed?
            </h3>

            <p>
              The academy highlights private profiles,
              no stranger chat, teacher guidance,
              short learning sessions and an ad-free experience.
            </p>

          </div>

        </article>

      `;

      parentGrid
        .insertAdjacentElement(
          "beforebegin",
          guide
        );

    }


    /* ========================================================
       4. IMPROVE EXISTING TWO MAIN CARDS
       ======================================================== */

    const cards =
      section.querySelectorAll(
        ".parent-card"
      );

    if(cards[0]){

      const title =
        cards[0].querySelector("h3");

      if(title){

        title.innerHTML = `
          📊 Skill Progress Snapshot
          <small class="parent-card-label">
            Zen Alpha • Demo Learner
          </small>
        `;

      }


      const note =
        document.createElement("div");

      note.className =
        "parent-mini-note";

      note.innerHTML = `
        <span>💡</span>
        <p>
          These demo percentages are progress indicators for this sample.
          They are not school exam marks or grades.
        </p>
      `;

      cards[0].appendChild(note);

    }


    if(cards[1]){

      const title =
        cards[1].querySelector("h3");

      if(title){

        title.innerHTML = `
          📅 Example Weekly Summary
          <small class="parent-card-label">
            Sample activity report
          </small>
        `;

      }


      const report =
        cards[1].querySelector(
          ".report-sample"
        );

      if(report){

        const label =
          document.createElement("small");

        label.className =
          "sample-data-label";

        label.textContent =
          "SAMPLE DATA";

        report.prepend(label);

      }

    }


    /* ========================================================
       5. LEARNING FLOW
       ======================================================== */

    const trust =
      section.querySelector(
        ".trust-panel"
      );

    if(trust){

      const flow =
        document.createElement("div");

      flow.className =
        "parent-learning-flow";

      flow.innerHTML = `

        <div class="parent-flow-title">

          <small>
            HOW PARENT VIEW SHOULD BE READ
          </small>

          <h3>
            Learning → Practice → Track → Review → Next Step
          </h3>

        </div>


        <div class="parent-flow-steps">

          <div>
            <span>📚</span>
            <b>Learn</b>
            <small>Short guided lessons</small>
          </div>

          <i>→</i>

          <div>
            <span>🎮</span>
            <b>Practice</b>
            <small>Activities & games</small>
          </div>

          <i>→</i>

          <div>
            <span>📊</span>
            <b>Track</b>
            <small>Progress summary</small>
          </div>

          <i>→</i>

          <div>
            <span>👨‍👩‍👧</span>
            <b>Review</b>
            <small>Parent understanding</small>
          </div>

          <i>→</i>

          <div>
            <span>🚀</span>
            <b>Next Step</b>
            <small>Continue learning</small>
          </div>

        </div>

      `;

      trust
        .insertAdjacentElement(
          "beforebegin",
          flow
        );

    }


    /* ========================================================
       6. PARENT VIEW vs PARENT REVIEWS
       ======================================================== */

    if(trust){

      const difference =
        document.createElement("div");

      difference.className =
        "parent-difference";

      difference.innerHTML = `

        <div>

          <span>
            👨‍👩‍👧
          </span>

          <section>

            <small>
              PARENT VIEW
            </small>

            <b>
              Understand the learning progress
            </b>

            <p>
              Shows the idea of skills, weekly activity,
              safety and learning progress.
            </p>

          </section>

        </div>


        <div class="parent-vs">
          VS
        </div>


        <div>

          <span>
            ⭐
          </span>

          <section>

            <small>
              PARENT REVIEWS
            </small>

            <b>
              Read or send feedback
            </b>

            <p>
              Reviews & Suggestions is for parent feedback,
              experiences and suggestions about the academy.
            </p>

          </section>

        </div>

      `;

      trust
        .insertAdjacentElement(
          "afterend",
          difference
        );

    }

  }


  /* ==========================================================
     STYLE
     ========================================================== */

  if(
    !document.getElementById(
      "tannuV25ParentStyle"
    )
  ){

    const style =
      document.createElement("style");

    style.id =
      "tannuV25ParentStyle";

    style.textContent = `

/* ============================================================
   MAIN DESCRIPTION
   ============================================================ */

#parents .parent-purpose-text{
  max-width:820px;
  margin-top:12px !important;
  color:#d9e1ff !important;
  font-size:15px !important;
  line-height:1.65 !important;
}

#parents .parent-purpose-text b{
  color:#fff;
}


/* ============================================================
   WHAT IS PARENT VIEW
   ============================================================ */

.parent-view-intro{
  display:grid;
  grid-template-columns:1.35fr .9fr;
  gap:14px;
  margin-bottom:17px;
}

.parent-demo-note,
.parent-demo-warning{
  position:relative;
  overflow:hidden;

  display:flex;
  align-items:center;
  gap:16px;

  min-height:120px;
  padding:19px 21px;

  border-radius:24px;

  border:
    1px solid rgba(255,255,255,.20);

  box-shadow:
    0 14px 32px rgba(5,10,50,.22);
}

.parent-demo-note{
  background:
    linear-gradient(
      135deg,
      rgba(110,91,255,.82),
      rgba(46,199,213,.63)
    );
}

.parent-demo-warning{
  background:
    linear-gradient(
      135deg,
      rgba(255,160,70,.92),
      rgba(239,84,159,.82)
    );
}

.parent-demo-icon,
.parent-demo-warning > span{
  min-width:68px;
  width:68px;
  height:68px;

  display:grid;
  place-items:center;

  border-radius:22px;

  background:
    rgba(255,255,255,.20);

  font-size:34px;

  border:
    1px solid rgba(255,255,255,.30);
}

.parent-demo-note small,
.parent-demo-warning small{
  font-size:8px;
  font-weight:950;
  letter-spacing:1px;
}

.parent-demo-note h3,
.parent-demo-warning h3{
  margin:5px 0 6px;
  color:#fff;
}

.parent-demo-note p,
.parent-demo-warning p{
  margin:0;
  color:#f4f5ff;
  line-height:1.5;
  font-size:12px;
}

.parent-demo-warning b{
  display:block;
  margin-bottom:6px;
  font-size:16px;
  color:#fff;
}


/* ============================================================
   FOUR EXPLANATION CARDS
   ============================================================ */

.parent-guide-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;

  margin-bottom:18px;
}

.parent-guide-card{
  position:relative;
  overflow:hidden;

  min-height:165px;

  padding:18px;

  border-radius:22px;

  border:
    1px solid rgba(255,255,255,.26);

  color:#fff;

  box-shadow:
    0 14px 30px rgba(5,9,48,.22);

  transition:
    transform .25s ease,
    box-shadow .25s ease;
}

.parent-guide-card:hover{
  transform:
    translateY(-6px);

  box-shadow:
    0 19px 38px rgba(5,9,48,.35);
}

.parent-guide-card > span{
  display:block;
  font-size:34px;
  margin-bottom:10px;
}

.parent-guide-card small{
  font-size:8px;
  font-weight:950;
  letter-spacing:1px;
  opacity:.86;
}

.parent-guide-card h3{
  margin:5px 0 7px;
  font-size:16px;
}

.parent-guide-card p{
  margin:0;
  font-size:11px;
  line-height:1.48;
  color:#f1f3ff;
}

.pg-purple{
  background:
    linear-gradient(
      145deg,
      #725cff,
      #9a55df
    );
}

.pg-blue{
  background:
    linear-gradient(
      145deg,
      #269fdc,
      #4e6ce6
    );
}

.pg-orange{
  background:
    linear-gradient(
      145deg,
      #f2943f,
      #e86578
    );
}

.pg-green{
  background:
    linear-gradient(
      145deg,
      #29b684,
      #1b9eb4
    );
}


/* ============================================================
   EXISTING PARENT CARDS
   ============================================================ */

#parents .parent-card{
  border:
    1px solid rgba(255,255,255,.19)
    !important;

  background:
    linear-gradient(
      145deg,
      rgba(30,42,111,.96),
      rgba(18,29,84,.95)
    )
    !important;

  box-shadow:
    0 18px 38px rgba(3,8,43,.25)
    !important;
}

#parents .parent-card h3{
  color:#fff;
  font-size:19px;
}

.parent-card-label{
  display:block;

  width:max-content;

  margin-top:6px;
  padding:5px 9px;

  border-radius:999px;

  background:
    rgba(255,255,255,.10);

  color:#becaff;

  font-size:8px;
  letter-spacing:.5px;
  font-weight:900;
}


/* ============================================================
   SKILL BARS
   ============================================================ */

#parents .skills span{
  border:
    1px solid rgba(255,255,255,.08);

  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,.085),
      rgba(255,255,255,.045)
    )
    !important;

  transition:
    transform .2s ease,
    background .2s ease;
}

#parents .skills span:hover{
  transform:translateX(5px);

  background:
    rgba(255,255,255,.13)
    !important;
}

#parents .skills span:nth-child(1){
  border-left:4px solid #4fd6f4;
}

#parents .skills span:nth-child(2){
  border-left:4px solid #d66bff;
}

#parents .skills span:nth-child(3){
  border-left:4px solid #48d9a2;
}

#parents .skills span:nth-child(4){
  border-left:4px solid #ffd45f;
}

#parents .skills span:nth-child(5){
  border-left:4px solid #ff75aa;
}


/* ============================================================
   NOTES
   ============================================================ */

.parent-mini-note{
  display:flex;
  gap:9px;
  align-items:flex-start;

  margin-top:13px;

  padding:11px 12px;

  border-radius:14px;

  background:
    rgba(72,216,204,.10);

  border:
    1px solid rgba(72,216,204,.22);
}

.parent-mini-note span{
  font-size:20px;
}

.parent-mini-note p{
  margin:0 !important;

  color:#cad9f8 !important;

  font-size:10px !important;
  line-height:1.45 !important;
}


/* ============================================================
   SAMPLE DATA LABEL
   ============================================================ */

.sample-data-label{
  display:inline-flex;

  margin-bottom:8px;

  padding:4px 8px;

  border-radius:999px;

  background:
    linear-gradient(
      135deg,
      #ffac50,
      #ef61a5
    );

  color:#fff;

  font-size:7px;
  letter-spacing:.7px;
  font-weight:950;
}


/* ============================================================
   PARENT LEARNING FLOW
   ============================================================ */

.parent-learning-flow{
  margin-top:18px;
  margin-bottom:18px;

  padding:20px;

  border-radius:25px;

  background:
    linear-gradient(
      135deg,
      rgba(105,89,243,.22),
      rgba(42,204,196,.16)
    );

  border:
    1px solid rgba(255,255,255,.16);

  box-shadow:
    0 15px 34px rgba(5,9,48,.20);
}

.parent-flow-title small{
  font-size:8px;
  font-weight:950;
  letter-spacing:1px;
  color:#78e6df;
}

.parent-flow-title h3{
  margin:6px 0 17px;
  color:#fff;
}

.parent-flow-steps{
  display:grid;

  grid-template-columns:
    1fr auto
    1fr auto
    1fr auto
    1fr auto
    1fr;

  gap:9px;

  align-items:center;
}

.parent-flow-steps > div{
  min-height:105px;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;

  padding:12px;

  text-align:center;

  border-radius:17px;

  background:
    rgba(255,255,255,.08);

  border:
    1px solid rgba(255,255,255,.09);
}

.parent-flow-steps > div span{
  font-size:28px;
}

.parent-flow-steps > div b{
  margin-top:4px;
  color:#fff;
}

.parent-flow-steps > div small{
  margin-top:3px;
  color:#bdc9ee;
  font-size:9px;
}

.parent-flow-steps > i{
  color:#6be3dd;
  font-size:22px;
  font-style:normal;
  font-weight:950;
}


/* ============================================================
   PARENT VIEW vs REVIEWS
   ============================================================ */

.parent-difference{
  display:grid;

  grid-template-columns:
    1fr auto 1fr;

  align-items:center;

  gap:14px;

  margin-top:16px;
}

.parent-difference > div:not(.parent-vs){
  display:flex;
  align-items:center;

  gap:14px;

  padding:18px;

  border-radius:22px;

  background:
    linear-gradient(
      145deg,
      rgba(88,75,202,.78),
      rgba(24,39,104,.86)
    );

  border:
    1px solid rgba(255,255,255,.14);
}

.parent-difference > div:last-child{
  background:
    linear-gradient(
      145deg,
      rgba(213,78,151,.70),
      rgba(80,57,169,.84)
    );
}

.parent-difference span{
  font-size:37px;
}

.parent-difference section small{
  display:block;

  color:#ffd76c;

  font-size:8px;
  letter-spacing:1px;
  font-weight:950;
}

.parent-difference section b{
  display:block;

  margin:5px 0;

  color:#fff;
}

.parent-difference section p{
  margin:0;

  color:#d9dff8;

  font-size:10px;
  line-height:1.45;
}

.parent-vs{
  width:42px;
  height:42px;

  display:grid;
  place-items:center;

  border-radius:50%;

  color:#433e91;
  background:#fff;

  font-size:10px;
  font-weight:950;
}


/* ============================================================
   SAFE LEARNING PROMISE MORE VISIBLE
   ============================================================ */

#parents .trust-panel{
  margin-top:18px !important;

  padding:17px !important;

  border:
    1px solid rgba(88,226,209,.25)
    !important;

  background:
    linear-gradient(
      135deg,
      rgba(27,54,112,.88),
      rgba(20,86,109,.65)
    )
    !important;
}

#parents .trust-panel > b{
  color:#fff;
  font-size:14px;
}

#parents .trust-panel span{
  border:
    1px solid rgba(255,255,255,.11);

  background:
    rgba(255,255,255,.08)
    !important;
}


/* ============================================================
   RESPONSIVE
   ============================================================ */

@media(max-width:1050px){

  .parent-guide-grid{
    grid-template-columns:
      repeat(2,1fr);
  }

  .parent-view-intro{
    grid-template-columns:1fr;
  }

}


@media(max-width:800px){

  .parent-flow-steps{
    grid-template-columns:1fr;
  }

  .parent-flow-steps > i{
    transform:rotate(90deg);
    text-align:center;
  }

  .parent-difference{
    grid-template-columns:1fr;
  }

  .parent-vs{
    margin:auto;
  }

}


@media(max-width:560px){

  .parent-guide-grid{
    grid-template-columns:1fr;
  }

  .parent-demo-note,
  .parent-demo-warning{
    align-items:flex-start;
  }

}

`;

    document.head.appendChild(
      style
    );

  }


  /* ==========================================================
     RUN
     ========================================================== */

  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      setupClearParentView,
      {
        once:true
      }
    );

  }else{

    setupClearParentView();

  }

})();
