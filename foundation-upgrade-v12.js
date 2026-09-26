/* Tannu Sir's Kids Digital Academy
   Foundation Upgrade v12.0
   Safe add-on for existing student-profile.html
   Focus: Class 1-3 readability + richer content.
*/
(function(){
"use strict";

const VERSION="12.0-foundation-upgrade";

/* ---------- KIDS-FRIENDLY BIG READ CSS ---------- */
const css=document.createElement("style");
css.textContent=`
.lesson-card h3{font-size:20px!important;line-height:1.3!important}
.lesson-card p{font-size:15px!important;line-height:1.65!important;color:#59627f!important}
.lesson-card button{min-height:48px!important;font-size:15px!important;padding:12px!important}
.lesson-card .visual{height:145px!important}
.modal-card{width:min(1120px,96vw)!important;padding:26px!important}
.lesson-hero{grid-template-columns:240px 1fr!important;gap:24px!important;padding:24px!important}
.lesson-hero .art{height:190px!important}
.lesson-hero h2{font-size:clamp(30px,4vw,46px)!important;line-height:1.12!important}
.lesson-hero p{font-size:19px!important;line-height:1.7!important}
.voicebtn,.lesson-hero .soft{font-size:15px!important;min-height:48px!important;padding:12px 16px!important}
.rich-scenes .visual-card{min-height:300px!important;padding:14px!important}
.rich-scenes .img{height:165px!important}
.visual-card b{font-size:17px!important;line-height:1.35!important}
.visual-card small{font-size:14px!important;line-height:1.6!important;min-height:0!important}
.visual-card button{font-size:14px!important;min-height:42px!important}
.quiz{padding:22px!important}
.quiz h3{font-size:26px!important}
.quiz p{font-size:22px!important;line-height:1.5!important}
.choices button{min-height:62px!important;font-size:17px!important;padding:14px!important}
.focus-box{font-size:16px!important;line-height:1.7!important}
#completeLesson{min-height:56px!important;font-size:17px!important}

.foundation-upgrade{margin-top:18px;display:grid;gap:16px}
.fu-label{display:inline-flex;width:max-content;max-width:100%;padding:8px 13px;border-radius:999px;background:linear-gradient(135deg,#6c5cff,#24cfc2);color:#fff;font-size:12px;font-weight:1000}
.fu-question{padding:22px;text-align:center;border-radius:24px;background:linear-gradient(135deg,#fff7d9,#fff0f8);border:2px solid #ffe19e}
.fu-question small{font-size:12px;font-weight:1000;color:#97670d;letter-spacing:1px}
.fu-question h2{font-size:clamp(30px,4.5vw,46px);line-height:1.12;color:#252a59;margin:7px 0 0}
.fu-answer{display:grid;grid-template-columns:155px 1fr auto;gap:20px;align-items:center;padding:22px;border-radius:25px;background:linear-gradient(135deg,#f2f0ff,#eafffa);border:2px solid #d9d8ff}
.fu-art{height:135px;display:grid;place-items:center;background:#fff;border-radius:20px;overflow:hidden}
.fu-art svg{width:100%;height:135px}
.fu-art .emoji{font-size:70px}
.fu-answer small{font-size:12px;color:#6559d5;font-weight:1000;letter-spacing:1px}
.fu-answer h2{font-size:clamp(30px,4vw,44px);line-height:1.15;color:#1f2757;margin:5px 0 8px}
.fu-answer p{font-size:20px;line-height:1.65;color:#46506e;font-weight:700;margin:0}
.fu-hear{border:0;min-width:130px;min-height:54px;border-radius:16px;padding:12px;background:linear-gradient(135deg,#6c5cff,#24cfc2);color:#fff;font-size:15px;font-weight:1000}
.fu-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.fu-card{padding:18px;border-radius:20px;background:#fff;border:1px solid #e2e5f2;box-shadow:0 10px 26px rgba(55,53,128,.07)}
.fu-card.hindi{background:linear-gradient(135deg,#fff2f8,#fff9e5)}
.fu-card span{display:block;font-size:34px;margin-bottom:7px}
.fu-card b{display:block;font-size:18px;color:#313765;margin-bottom:6px}
.fu-card p{font-size:15px;line-height:1.7;color:#5b6480;margin:0}
.fu-title{font-size:24px;color:#252c5c;margin:3px 0 0}
.fu-visuals{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.fu-visual{padding:16px;text-align:center;border:1px solid #e1e5f2;border-radius:20px;background:#fff}
.fu-visual .pic{display:grid;place-items:center;min-height:84px;border-radius:16px;background:linear-gradient(135deg,#f0efff,#effdfb);font-size:55px}
.fu-visual b{display:block;font-size:17px;color:#30365f;margin-top:10px}
.fu-visual p{font-size:14px;line-height:1.55;color:#626b85;margin:5px 0 0}
.fu-practice{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center;padding:18px;border-radius:20px;background:linear-gradient(135deg,#eafff5,#eef1ff);border:1px solid #d9e7f2}
.fu-practice>span{font-size:42px}
.fu-practice b{font-size:18px;color:#1d6651}
.fu-practice p{font-size:16px;line-height:1.6;color:#3f5e59;margin:4px 0 0}
.fu-fact{padding:17px 18px;border-radius:19px;background:#fff7dc;border:1px solid #ffe39d;color:#735617;font-size:16px;line-height:1.65}
@media(max-width:800px){
 .lesson-hero{grid-template-columns:1fr!important;text-align:center}
 .fu-answer{grid-template-columns:1fr;text-align:center}
 .fu-art{max-width:270px;width:100%;margin:auto}
 .fu-hear{width:100%}
 .fu-grid,.fu-visuals{grid-template-columns:1fr 1fr}
}
@media(max-width:520px){
 .modal-card{width:98vw!important;padding:14px!important}
 .lesson-hero{padding:16px!important}
 .lesson-hero h2{font-size:31px!important}
 .lesson-hero p{font-size:17px!important}
 .rich-scenes{grid-template-columns:1fr!important}
 .rich-scenes .visual-card{min-height:0!important}
 .rich-scenes .img{height:175px!important}
 .choices{grid-template-columns:1fr!important}
 .fu-grid,.fu-visuals{grid-template-columns:1fr}
 .fu-answer p{font-size:18px}
}`;
document.head.appendChild(css);

/* ---------- RICH FOUNDATION CONTENT ---------- */
const CONTENT={
computer:["What is a computer?","A computer is a smart electronic machine.","It follows instructions and helps us learn, type, draw, calculate, watch, listen and create.","Computer ek electronic machine hai. Yeh instructions follow karke learning, typing, drawing aur bahut saare kaam mein help karta hai.","A computer needs instructions. It does not think exactly like a human.",[["🖥️","Desktop","A computer used on a desk."],["💻","Laptop","A portable computer."],["🏫","School Lab","Computers help children learn and practise."]],"Point to a computer and name two things you can do with it.","Computers can look different, but they all take input, process information and give output."],
parts:["Can you name the main computer parts?","Monitor, mouse, keyboard and system unit are important computer parts.","Each part has a different job. The monitor shows, the keyboard types, the mouse points and the system unit contains important working parts.","Monitor dikhata hai, keyboard se type karte hain, mouse se click karte hain aur system unit ke andar important parts hote hain.","Different parts work together as one computer system.",[["🖥️","Monitor","Shows pictures and words."],["🖱️","Mouse","Points, clicks and drags."],["⌨️","Keyboard","Types letters and numbers."]],"Look at a computer and point to the monitor, mouse and keyboard.","A computer is called a system because many parts work together."],
monitor:["What is this screen called?","This is a Monitor.","A monitor shows words, pictures, videos, apps and the work you are doing on the computer.","Yeh Monitor hai. Is par words, pictures, videos aur apps dikhte hain.","Keep the screen clean and use a comfortable viewing distance.",[["🖼️","Pictures","The monitor shows images."],["📝","Words","You can read text on it."],["🎬","Videos","You can watch learning videos."]],"Find the monitor power button with a teacher or parent.","A monitor is an output device because it shows information from the computer."],
mouse:["What is this?","This is a Mouse.","A mouse helps us move the pointer, point at things and click to choose them.","Yeh Mouse hai. Isse pointer move hota hai aur hum click karke cheez select karte hain.","Hold the mouse gently. Accuracy is more important than speed.",[["👆","Point","Move the pointer to an item."],["🖱️","Left Click","Choose or select an item."],["🎯","Accuracy","Move slowly and click carefully."]],"Move the mouse slowly and click one icon only once.","A mouse is an input device because it sends your action to the computer."],
mouse2:["What else can a mouse do?","A mouse can right-click, double-click, drag, drop and scroll.","These actions help us open items, move objects and travel up or down a page.","Mouse se right-click, double-click, drag-drop aur scroll bhi kar sakte hain.","Double-click means two quick left clicks. Drag means hold, move and release.",[["🖱️","Double Click","Often opens an item."],["📦","Drag & Drop","Moves an object."],["↕️","Scroll","Moves the page up and down."]],"Practise drag and drop with a safe classroom activity.","The scroll wheel can also act like a button on many mice."],
keyboard:["What helps us type?","This is a Keyboard.","A keyboard has letter keys, number keys, a Spacebar and many useful control keys.","Yeh Keyboard hai. Isse letters, numbers aur words type karte hain.","Press keys gently. The long key at the bottom is the Spacebar.",[["🔤","Letters","A to Z keys."],["🔢","Numbers","0 to 9 keys."],["␠","Spacebar","Makes a space between words."]],"Type your first name slowly.","The keyboard is an input device."],
keyboard2:["Which special keyboard keys should you know?","Enter, Backspace, Shift, Caps Lock and Arrow keys are very useful.","They help us make new lines, remove mistakes, type capitals and move around.","Enter new line ke liye, Backspace galti hatane ke liye, Shift/Caps Lock capital letters ke liye aur Arrow keys move karne ke liye hoti hain.","Use the correct key instead of pressing random keys.",[["↵","Enter","New line or confirm."],["⌫","Backspace","Removes a character."],["⬆️","Shift","Helps type capitals and symbols."]],"Type CAT, press Enter, then type DOG.","Caps Lock stays on until you turn it off again."],
system:["What is the system unit?","The system unit is the case that holds important computer parts.","Inside it are parts such as the motherboard, processor, memory and storage.","System Unit ke andar motherboard, CPU, RAM aur storage jaise important parts hote hain.","Do not open a computer case unless a trained adult or technician is helping.",[["🧠","CPU","Processes instructions."],["🧩","Motherboard","Connects important parts."],["💾","Storage","Keeps files and programs."]],"Point to the system unit without unplugging anything.","Some all-in-one computers keep important parts behind the monitor."],
ram:["What is RAM?","RAM is short-term working memory for the computer.","It helps the computer keep active work ready while apps and tasks are running.","RAM computer ki temporary working memory hoti hai.","RAM and storage are different. RAM helps active work; storage keeps files.",[["🧠","Working Memory","Helps active tasks."],["⚡","Speed","Supports smooth multitasking."],["🔄","Temporary","Used while work is active."]],"Say: RAM helps the computer with active work.","RAM is not the same thing as permanent storage."],
ssd:["Where are files stored?","SSD and HDD are storage devices.","They can keep documents, pictures, videos and programs after the computer is turned off.","SSD aur HDD storage devices hain. Inmein files, photos aur programs save hote hain.","Storage keeps files; RAM helps with active working tasks.",[["💾","SSD","Fast electronic storage."],["🗄️","HDD","Stores data on a disk mechanism."],["📁","Files","Documents and pictures can be saved."]],"Open a folder and identify one saved file.","An SSD has no spinning disk inside."],
printer:["What does a printer do?","A printer puts digital work onto paper.","It can print school work, pictures and documents when connected and ready.","Printer digital document ya picture ko paper par print karta hai.","Keep fingers away from moving parts and ask an adult before clearing a jam.",[["📄","Paper","The printer needs suitable paper."],["🖨️","Print","Digital work becomes a paper copy."],["🧴","Ink/Toner","Printers need printing supplies."]],"Find the paper tray and output tray without opening unsafe parts.","A printer is an output device."],
webcam:["What is a webcam?","A webcam is a camera used with a computer.","It can capture video for calls, classes and other approved activities.","Webcam computer ke saath use hone wala camera hai.","Use a camera only with permission. Never share private images with strangers.",[["📷","Camera","Captures an image."],["🎥","Video","Can capture moving video."],["🔒","Privacy","Use with permission."]],"Find the webcam on a laptop or monitor.","Many laptops have a webcam built above the screen."],
devicecare:["How do we care for a computer?","Keep devices clean, dry, cool and handled gently.","Use clean hands, keep drinks away, do not pull cables and use a dry soft cloth where appropriate.","Computer ko clean aur dry rakho. Drinks door rakho aur cables gently use karo.","Never spray liquid directly onto electronic devices.",[["🧼","Clean Hands","Use devices with clean hands."],["🥤","Drinks Away","Keep liquids away."],["🔌","Gentle Cables","Do not pull cables hard."]],"Check your desk and move any drink away from the computer.","Dust can block vents, so sensible cleaning matters."],
windows:["What do we see on the Windows desktop?","The desktop can show icons, the taskbar, Start and open windows.","These parts help us open apps, switch tasks and find files.","Windows desktop par icons, taskbar, Start aur open windows dikhte hain.","Ask before changing important settings.",[["🪟","Window","An app can open in a window."],["📌","Taskbar","Shows apps and system controls."],["⊞","Start","Helps open apps and settings."]],"Find Start, the taskbar and one desktop icon.","A desktop icon can be a shortcut to an app, file or folder."],
files:["What is the difference between a file and a folder?","A file holds information; a folder helps organize files.","A document, picture or video can be a file. A folder can keep related files together.","File mein information hoti hai. Folder files ko organize karne ke liye hota hai.","Use meaningful names so you can find your school work later.",[["📄","File","One saved item."],["📁","Folder","Holds and organizes items."],["🏫","School Work","Keep subjects in separate folders."]],"Create a practice folder named My School Work.","Folders can also contain other folders."],
internetbasics:["What are a browser and a website?","A browser opens websites and helps us use the web.","The address bar, tabs, back, refresh, upload and download are useful browser ideas.","Browser se website open karte hain. Address bar, tabs, back aur refresh useful parts hain.","Ask an adult before unknown downloads, sign-ups or payments.",[["🌐","Browser","Opens websites."],["📑","Tab","Keeps another page open."],["↻","Refresh","Loads the page again."]],"Open a safe learning website in a new tab with permission.","The internet and the web are related, but they are not exactly the same thing."],
internetsafety:["What should you do when something online feels unsafe?","Stop, do not share private information, and tell a trusted adult.","Unknown links, strangers, scary messages and surprise downloads need careful handling.","Online kuch unsafe lage to stop karo, private information share mat karo aur trusted adult ko batao.","You never need to keep an unsafe online situation secret from a trusted adult.",[["🔗","Unknown Link","Do not rush to click."],["👤","Stranger","Do not share private details."],["🧑‍🏫","Trusted Adult","Ask for help."]],"Say the safety rule: Stop. Think. Ask.","Safe internet use is a skill, just like road safety."],
password:["Should you share your password?","No. Keep passwords private.","A strong password or passphrase should be hard for other people to guess.","Password private rakho. Stranger ya friend ko password mat do.","Never share an OTP or login password with an unknown person.",[["🔐","Private","Keep login secrets private."],["🧩","Strong","Use a hard-to-guess password."],["👨‍👩‍👧","Trusted Help","Ask a parent when needed."]],"Choose which is safer: 1234 or a longer unique passphrase.","Using the same password everywhere can make several accounts less safe."],
privacy:["Which information should stay private?","Passwords, OTPs, full home address and private contact details should not be shared with strangers.","Think before posting photos, school details or location information.","Password, OTP, full address, phone number aur private details strangers ke saath share mat karo.","When unsure, ask a trusted adult before sharing.",[["🏠","Home Address","Keep private."],["📱","Contact Details","Share carefully."],["📍","Live Location","Do not send to strangers."]],"Sort examples into Safe to Share / Ask an Adult.","Privacy means controlling who can see information about you."],
hygiene:["Which hygiene habits should we practise?","Wash hands, brush teeth, bathe regularly and keep clothes and learning spaces clean.","Good hygiene helps us feel comfortable and can reduce the spread of germs.","Hands wash karo, teeth brush karo, regular bath lo aur learning area clean rakho.","Wash hands before eating and after using the toilet.",[["🧼","Hand Wash","Use soap and water properly."],["🪥","Brush Teeth","Brush regularly."],["👕","Clean Clothes","Wear clean clothes."]],"Show the hand-washing steps you remember.","Clean hands are especially important before eating."],
food:["What are everyday balanced food choices?","Choose a variety of foods such as grains, protein foods, fruits or vegetables and water.","Different foods provide different nutrients. Family meals and cultures can look different.","Balanced food mein variety rakho: grains, protein foods, fruits/vegetables aur water.","Food is not about shame. Learn balance and variety.",[["🍎","Fruit","One everyday choice."],["🥕","Vegetables","Try different colors."],["💧","Water","A useful everyday drink."]],"Name one fruit, one vegetable and one protein food your family eats.","No single food does every job the body needs."],
ai:["What is AI?","AI is technology that can find patterns and produce useful outputs from instructions and data.","AI tools can help with words, pictures, recommendations and other tasks, but they can make mistakes.","AI ek technology hai jo instructions aur data ke basis par output de sakti hai. AI galti bhi kar sakti hai.","Never assume an AI answer is automatically correct.",[["🤖","AI Tool","Helps with some tasks."],["🗣️","Voice Assistant","Can respond to spoken requests."],["🖼️","Image AI","Can work with images."]],"Name one place where you may have seen AI.","AI does not know everything and does not replace trusted adults or teachers."],
prompt:["What is an AI prompt?","A prompt is the instruction or question we give to an AI tool.","Clear prompts often include what you want, useful details and the kind of answer you need.","AI ko jo instruction ya question dete hain usko prompt kehte hain.","Do not put private personal information into an AI prompt.",[["❓","Task","Say what you want."],["🧩","Details","Add useful context."],["✅","Format","Say how you want the answer."]],"Improve: Tell me about animals → Explain 3 farm animals in simple Class 2 English.","A better prompt can improve an answer, but you still need to check the result."],
aicheck:["Can AI make mistakes?","Yes. AI can give wrong, incomplete or made-up information.","Important answers should be checked with a teacher, parent, textbook or reliable source.","Haan, AI galat ya incomplete answer de sakti hai. Important information verify karo.","Check before you trust or share important information.",[["🔎","Check","Verify important claims."],["📚","Trusted Source","Use reliable sources."],["🧑‍🏫","Ask","Ask a teacher or adult."]],"If AI gives a surprising fact, name two ways you can check it.","Questioning an answer is an important digital skill."],
fix:["What should you do first when a computer does not turn on?","Stay calm and check simple things such as power and connections.","Troubleshooting means checking one possible cause at a time.","Computer on na ho to panic mat karo. Power aur basic connections safely check karo.","Children should not open electrical equipment or touch unsafe power parts.",[["🔌","Power","Is power available?"],["⏻","Button","Was the correct button pressed?"],["🧑‍🏫","Ask","Get adult or technician help."]],"Say: Check one simple thing at a time.","Good technicians observe before changing things."],
printfix:["What can we check when a printer does not print?","Check power, connection, paper, printer status and the print queue.","Simple printer problems can come from being offline, out of paper or having a stuck job.","Printer issue mein power, connection, paper, status aur print queue check karo.","Do not put fingers inside moving or hot printer parts.",[["📄","Paper","Is paper loaded?"],["🔌","Connection","Is it connected?"],["📋","Queue","Is a job stuck?"]],"Name three safe printer checks before calling a technician.","A printer can be powered on but still show Offline to the computer."],
netfix:["What can we check when the network is not working?","Check the Wi-Fi or network icon, cable connection and whether other devices also have the problem.","This helps tell whether the issue may be one device or the wider network.","Network issue mein Wi-Fi/network icon, cable aur dusre devices ka status check karo.","Do not unplug school or office network equipment without permission.",[["📶","Wi-Fi Icon","Is Wi-Fi connected?"],["🔌","Cable","Is Ethernet plugged in?"],["👥","Other Devices","Are they also offline?"]],"Explain how checking another device can help troubleshooting.","A network problem can happen on one device, one connection or a larger network."],
presentation:["Can you explain what you learned?","A good mini-presentation has a clear beginning, one or two main ideas and a finish.","Speak slowly, use simple sentences and show or point to a picture when helpful.","Presentation mein clear start, main points aur ending rakho. Slowly aur clearly bolo.","Practise first. You do not need to memorize every word.",[["👋","Start","Today I will talk about..."],["💡","Main Idea","Explain one or two points."],["🙏","Finish","Thank you for listening."]],"Give a 30-second talk about your favourite computer part.","Teaching something can help you remember it."]
};

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function fallback(l){
 const skill=(l.skill||"").toLowerCase();
 let h="Is lesson ko dhyan se dekho, suno aur step-by-step practice karo.";
 if(skill.includes("english")||skill.includes("speak")||skill.includes("listen")) h="Simple English ko suno, samjho aur clearly bolne ki practice karo.";
 if(skill.includes("safety")||skill.includes("citizen")) h="Pehle stop karo, think karo aur safe action choose karo. Doubt ho to trusted adult se poochho.";
 if(skill.includes("healthy")) h="Chhoti daily healthy habits body aur mind ko support karti hain.";
 if(skill.includes("ai")) h="AI ko clear instruction do, private information protect karo aur important answer verify karo.";
 return [`What are we learning in ${l.title}?`,l.title,l.desc,h,"Look carefully, listen slowly and try one step at a time.",[["👀","Look","See the example."],["👂","Listen","Hear the explanation."],["✅","Try","Practise the skill."]],`Explain one thing you learned about ${l.title}.`,"Learning becomes stronger when you explain it in your own words."];
}

function getContent(l){return CONTENT[l.kind]||fallback(l)}

function art(l){
 try{
   if(typeof svg==="function"&&typeof deviceForLesson==="function") return svg(deviceForLesson(l));
 }catch(_){}
 return `<div class="emoji">${esc(l.icon||"📚")}</div>`;
}

function speakText(t){
 try{
  if(typeof speak==="function"){speak(t,.66);return}
  if("speechSynthesis" in window){
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.72;
    speechSynthesis.speak(u);
  }
 }catch(_){}
}

function enrich(i){
 try{
  if(typeof LESSONS==="undefined")return;
  const l=LESSONS[i]; if(!l)return;
  const body=document.getElementById("modalBody");
  const activity=document.getElementById("lessonActivity");
  if(!body||!activity)return;
  body.querySelectorAll(".foundation-upgrade").forEach(x=>x.remove());

  const c=getContent(l);
  const wrap=document.createElement("section");
  wrap.className="foundation-upgrade";
  wrap.innerHTML=`
   <span class="fu-label">🌟 CLASS 1–3 FOUNDATION • BIG READ MODE</span>
   <article class="fu-question"><small>LOOK • THINK • SAY</small><h2>${esc(c[0])}</h2></article>
   <article class="fu-answer">
    <div class="fu-art">${art(l)}</div>
    <div><small>BIG ANSWER</small><h2>${esc(c[1])}</h2><p>${esc(c[2])}</p></div>
    <button class="fu-hear" type="button">🔊 Hear Answer</button>
   </article>
   <div class="fu-grid">
    <article class="fu-card hindi"><span>🇮🇳</span><b>Easy Hindi Help</b><p>${esc(c[3])}</p></article>
    <article class="fu-card"><span>🧠</span><b>Remember This</b><p>${esc(c[4])}</p></article>
    <article class="fu-card"><span>🏫</span><b>Real-Life Learning</b><p>${esc(l.desc)}</p></article>
   </div>
   <h3 class="fu-title">👀 See It Clearly</h3>
   <div class="fu-visuals">${c[5].map((v,n)=>`<article class="fu-visual"><div class="pic">${esc(v[0])}</div><b>${n+1}. ${esc(v[1])}</b><p>${esc(v[2])}</p></article>`).join("")}</div>
   <article class="fu-practice"><span>🎯</span><div><b>Try It Yourself</b><p>${esc(c[6])}</p></div></article>
   <article class="fu-fact"><b>💡 Did You Know?</b> ${esc(c[7])}</article>`;
  body.insertBefore(wrap,activity);
  wrap.querySelector(".fu-hear").onclick=()=>speakText(`${c[0]} ${c[1]} ${c[2]}`);
 }catch(e){console.warn("[Foundation Upgrade]",e)}
}

function install(){
 if(typeof window.openLesson!=="function"){setTimeout(install,150);return}
 if(window.__FOUNDATION_UPGRADE_INSTALLED__)return;
 window.__FOUNDATION_UPGRADE_INSTALLED__=true;
 const old=window.openLesson;
 window.openLesson=function(i){
   const r=old.apply(this,arguments);
   setTimeout(()=>enrich(Number(i)),50);
   return r;
 };
 console.info(`[Foundation Upgrade ${VERSION}] installed`);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
window.TANNU_FOUNDATION_UPGRADE_VERSION=VERSION;
})();
