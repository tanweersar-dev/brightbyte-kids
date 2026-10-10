(() => {
"use strict";
const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const $=id=>document.getElementById(id);
let profile=null, exams=[];

function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(window.__ct);window.__ct=setTimeout(()=>$("toast").classList.remove("show"),1800)}
function avg(a){const x=a.map(Number).filter(Number.isFinite);return x.length?x.reduce((m,n)=>m+n,0)/x.length:0}
function grade(score){if(score>=90)return"Outstanding";if(score>=80)return"Excellent";if(score>=70)return"Very Good";if(score>=60)return"Good";return"Not Yet Certified"}
function band(c){return c<=3?"foundation":c<=6?"advanced":"professional"}
function home(c){return c<=3?"foundation-universe.html":c<=6?"advanced-universe.html":"professional-universe.html"}
function program(c){return c<=3?"Foundation Digital Skills Certificate":c<=6?"Future Skills Achievement Certificate":"Professional IT & AI Skills Certificate"}
function skills(c){return c<=3?["Computer Basics","Digital Safety","Typing & Files","Guided IT Lab"]:c<=6?["Digital Skills","Hardware","AI","Troubleshooting","Cyber Safety"]:["Computer Hardware","Windows Support","Printer Support","LAN & Networking","Outlook 365","IT Support","Cyber Safety","AI Skills","No-Code Web"]}

function inferKind(e){
 const k=String(e.exam_kind||"").toLowerCase();if(["weekly","monthly","skill","final","practice"].includes(k))return k;
 const t=String(e.title||"").toLowerCase();if(t.includes("month"))return"monthly";if(t.includes("week"))return"weekly";if(t.includes("practice"))return"practice";if(t.includes("final"))return"final";return"skill";
}
function inferPeriod(e){
 if(Number(e.period_number)>=1&&Number(e.period_number)<=3)return Number(e.period_number);
 const t=String(e.title||"").toLowerCase();
 if(/(?:month|monthly)\s*(?:1|one)|30\s*day/.test(t))return 1;
 if(/(?:month|monthly)\s*(?:2|two)|60\s*day/.test(t))return 2;
 if(/(?:month|monthly)\s*(?:3|three)|90\s*day/.test(t))return 3;
 return null;
}
function passed(e){return e.assignment_status==="reviewed"&&String(e.result||"").toUpperCase()==="PASS"}
function practical(){
 const c=Number(profile.class_number||1);
 if(c<=3){
   let s={};try{s=JSON.parse(localStorage.getItem("tannu_virtual_it_lab_v1")||"{}")||{}}catch{}
   const complete=!!s.stage1Complete&&!!s.stage2Complete;
   return {done:complete?2:(s.stage1Complete||s.stage2Complete?1:0),required:2,score:complete?100:(s.stage1Complete||s.stage2Complete?50:0),complete,items:["Stage 1 • Build Your First Computer","Stage 2 • Fix My Computer"]};
 }
 if(c<=6){
   let s={};const key=`tannu_junior_technician_v24_${profile.user_id||profile.username||"student"}`;try{s=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch{}
   const completed=Array.isArray(s.completed)?s.completed.map(Number):[];const scores=Object.values(s.stageScores||{}).map(Number).filter(Number.isFinite);
   const done=[1,2,3,4,5].filter(x=>completed.includes(x)).length;
   return {done,required:5,score:Math.round(avg(scores)),complete:done===5,items:["Ports & Devices","PC Assembly","Windows / Software","AI Skills","Troubleshooting"]};
 }
 let s={};const key=`tannu_professional_it_lab_v41_${profile.user_id||profile.username||"student"}`;try{s=JSON.parse(localStorage.getItem(key)||"{}")||{}}catch{}
 const labDefs=[7,7,8,8,7,7,8,7,8,7,7,8,8,7,8,7,8,7,7,10];
 const requiredIds=labDefs.map((m,i)=>Number(c)>=m?i+1:null).filter(Boolean);
 const scores=s.scores||{};const done=requiredIds.filter(id=>Number(scores[id]||0)>=60).length;const vals=requiredIds.map(id=>Number(scores[id]||0)).filter(x=>x>0);
 return {done,required:requiredIds.length,score:Math.round(avg(vals)),complete:requiredIds.length>0&&done===requiredIds.length,items:requiredIds.map(id=>`Professional Lab ${id}`),capstoneComplete:!!s.capstoneComplete,capstoneScore:Number(s.capstoneScore||0)};
}
function row(label,sub,state,text){return`<div class="progress-row"><span><b>${label}</b><small>${sub||""}</small></span><span class="state ${state}">${text}</span></div>`}
function certificateId(){
 const c=Number(profile.class_number||1),id=String(profile.user_id||profile.username||"STUDENT"),year=new Date().getFullYear();
 let h=0;for(const ch of `${id}-${c}-${year}`)h=(h*31+ch.charCodeAt(0))>>>0;
 return `TSDK-${year}-C${c}-${String(h).slice(-7).padStart(7,"0")}`;
}
async function load(){
 if(!TOKEN){location.href="student-login.html";return}
 try{
  const [meR,exR]=await Promise.all([
   fetch(API+"/api/auth/me",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"}),
   fetch(API+"/api/student/exams",{headers:{Authorization:`Bearer ${TOKEN}`},cache:"no-store"})
  ]);
  const me=await meR.json(),ex=await exR.json();
  if(!meR.ok||me.role!=="student"||!me.profile)throw new Error("Student login required");
  profile=me.profile;exams=exR.ok?(ex.exams||[]):[];
  render();
 }catch(e){localStorage.removeItem("brightbyte_student_token");location.href="student-login.html"}
}
function render(){
 const c=Number(profile.class_number||1),b=band(c);$("backLink").href=home(c);$("continueBtn").href=home(c);
 $("helloTitle").textContent=`${profile.display_name||profile.username||"Student"}, your final certificate journey`;
 $("programText").textContent=`Class ${c} • ${program(c)} • Three monthly exams + all required tests + practical achievement${c===10?" + final capstone":""}.`;

 const monthlyByPeriod={1:null,2:null,3:null};
 exams.filter(e=>inferKind(e)==="monthly").forEach(e=>{const p=inferPeriod(e);if(p&&!monthlyByPeriod[p])monthlyByPeriod[p]=e});
 const monthRows=[1,2,3].map(i=>monthlyByPeriod[i]);
 const monthsPassed=monthRows.filter(passed).length;
 const monthlyScore=Math.round(avg(monthRows.filter(passed).map(e=>Number(e.final_score||0))));

 const requiredTests=exams.filter(e=>{
   const k=inferKind(e);return k!=="monthly"&&k!=="practice"&&Number(e.required_for_certificate??1)!==0;
 });
 const testsDone=requiredTests.filter(passed).length;
 const testsComplete=requiredTests.length>0&&testsDone===requiredTests.length;
 const testScore=Math.round(avg(requiredTests.filter(passed).map(e=>Number(e.final_score||0))));
 const pr=practical();
 const capstoneRequired=c===10,capstoneOk=!capstoneRequired||pr.capstoneComplete===true;

 const eligible=monthsPassed===3&&testsComplete&&pr.complete&&capstoneOk;
 let weights,parts;
 if(c===10){weights={monthly:.50,tests:.20,practical:.20,capstone:.10};parts={monthly:monthlyScore,tests:testScore,practical:pr.score,capstone:pr.capstoneScore||0}}
 else if(c>=7){weights={monthly:.50,tests:.20,practical:.30};parts={monthly:monthlyScore,tests:testScore,practical:pr.score}}
 else if(c>=4){weights={monthly:.50,tests:.20,practical:.30};parts={monthly:monthlyScore,tests:testScore,practical:pr.score}}
 else{weights={monthly:.60,tests:.25,practical:.15};parts={monthly:monthlyScore,tests:testScore,practical:pr.score}}
 const finalScore=Math.round(Object.keys(weights).reduce((n,k)=>n+(Number(parts[k]||0)*weights[k]),0));
 const finalGrade=grade(finalScore);

 $("monthlyStatus").textContent=`${monthsPassed} / 3`;
 $("testsStatus").textContent=`${testsDone} / ${requiredTests.length}`;
 $("labsStatus").textContent=`${pr.done} / ${pr.required}`;
 $("capstoneStatus").textContent=capstoneRequired?(pr.capstoneComplete?`PASS • ${pr.capstoneScore}%`:"Pending"):"Not required";
 [...document.querySelectorAll(".requirements article")].forEach((a,i)=>a.classList.toggle("ok",[monthsPassed===3,testsComplete,pr.complete,capstoneOk][i]));
 $("statusIcon").textContent=eligible?"🏆":"🔒";$("statusText").textContent=eligible?"CERTIFICATE UNLOCKED":"LOCKED";$("finalScoreMini").textContent=`Final score ${eligible?finalScore+"%":"—"}`;
 $("gradeChip").textContent=eligible?`${finalGrade} • ${finalScore}%`:"Not yet certified";$("gradeChip").classList.toggle("ready",eligible);

 const weightNames={monthly:"Monthly Exams",tests:"Required Tests",practical:"Practical Labs",capstone:"Capstone"};
 $("scoreGrid").innerHTML=Object.keys(weights).map(k=>`<article><span>${weightNames[k]} • ${Math.round(weights[k]*100)}%</span><b>${Number(parts[k]||0)}%</b><small>Weighted: ${Math.round(Number(parts[k]||0)*weights[k]*10)/10}</small></article>`).join("");
 $("formulaNote").textContent=c===10?"Class 10 formula: Monthly Exams 50% + Required Tests 20% + Practical Labs 20% + Capstone 10%. Eligibility gates still apply.":"Final score is calculated only for display; certification still requires every mandatory gate to be completed and passed.";

 $("monthlyList").innerHTML=monthRows.map((e,i)=>e?row(`Monthly Exam ${i+1}`,`${e.title} • ${e.final_score??"—"}%`,passed(e)?"ok":e.assignment_status==="reviewed"?"bad":"wait",passed(e)?"PASS":String(e.assignment_status||"Pending").replaceAll("_"," ").toUpperCase()):row(`Monthly Exam ${i+1}`,"Not yet assigned/recognized","wait","PENDING")).join("");
 $("testList").innerHTML=requiredTests.length?requiredTests.map(e=>row(e.title,`${inferKind(e).toUpperCase()} • ${e.final_score??"—"}%`,passed(e)?"ok":e.assignment_status==="reviewed"?"bad":"wait",passed(e)?"PASS":String(e.assignment_status||"Pending").replaceAll("_"," ").toUpperCase())).join(""):row("Required tests","No required weekly/skill/final test is currently recorded.","wait","PENDING");
 $("labList").innerHTML=row(`${b==="foundation"?"Foundation Guided IT Lab":b==="advanced"?"5-Stage Practical Lab":"Professional Practical Labs"}`,`${pr.done}/${pr.required} requirements complete • Practical score ${pr.score}%`,pr.complete?"ok":"wait",pr.complete?"COMPLETE":"IN PROGRESS")+(capstoneRequired?row("Final Capstone",`Professional Lab 20 • ${pr.capstoneScore||0}%`,pr.capstoneComplete?"ok":"wait",pr.capstoneComplete?"PASS":"PENDING"):"");

 const missing=[];
 if(monthsPassed<3)missing.push(`${3-monthsPassed} monthly exam(s) still need PASS status.`);
 if(!requiredTests.length)missing.push("At least one required weekly/skill/final test must be assigned and passed.");
 else if(!testsComplete)missing.push(`${requiredTests.length-testsDone} required test(s) are pending or not passed.`);
 if(!pr.complete)missing.push(`${pr.required-pr.done} practical requirement(s) still need completion.`);
 if(capstoneRequired&&!pr.capstoneComplete)missing.push("Class 10 final capstone must be completed with a passing practical score.");
 $("missingList").innerHTML=missing.length?missing.map(x=>row(x,"","wait","REQUIRED")).join(""):row("All mandatory certification gates are complete.","","ok","READY");

 $("lockedMessage").classList.toggle("hidden",eligible);$("certificateWrap").classList.toggle("hidden",!eligible);
 if(eligible){
   $("certTitle").textContent=program(c);$("certName").textContent=profile.display_name||profile.username||"Student";$("certScore").textContent=`${finalScore}%`;$("certGrade").textContent=finalGrade;$("certDate").textContent=new Date().toLocaleDateString();$("certId").textContent=certificateId();$("certSkills").innerHTML=skills(c).map(x=>`<span>${x}</span>`).join("");
 }
 $("loading").classList.add("hidden");$("app").classList.remove("hidden");
}
$("refreshBtn").onclick=()=>{toast("Refreshing certificate progress…");load()};$("printBtn").onclick=()=>window.print();
load();
})();
