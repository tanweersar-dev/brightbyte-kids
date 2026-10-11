(() => {
"use strict";
/* V46.0 dashboard study progress reader. No backend change. */
const API="https://api.tanweer.site",TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const TOTAL={hardware:5,software:5,microsoft:5,ai:4,cyber:5,projects:4,network:5,support:5,cctv:5};
function key(p){return `brightbyte_v46_study_${p.user_id||p.student_id||p.username||"student"}`}
function load(p){try{return JSON.parse(localStorage.getItem(key(p))||"{}")||{}}catch{return{}}}
async function boot(){if(!TOKEN)return;try{const r=await fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"}),d=await r.json();if(!r.ok||!d.profile)return;const root=load(d.profile),tracks=root.tracks||{};document.querySelectorAll("[data-study]").forEach(card=>{const id=card.dataset.study,t=tracks[id]||{},done=Array.isArray(t.read)?t.read.length:0,total=TOTAL[id]||0,score=Number(t.quizScore||0),passed=!!t.passed,a=card.querySelector("[data-study-progress]"),b=card.querySelector("[data-study-status]");if(a){a.textContent=`${Math.min(done,total)}/${total} Notes`;if(done>=total)a.classList.add("ok")}if(b){b.textContent=passed?`✅ Quiz ${score}%`:score?`Quiz ${score}%`:`10 Q Quiz`;if(passed)b.classList.add("ok")}})}catch{}}
window.addEventListener("pageshow",boot);boot();
})();
