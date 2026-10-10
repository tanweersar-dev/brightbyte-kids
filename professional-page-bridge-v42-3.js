(() => {
"use strict";

if(window.__professionalPageBridgeV423) return;
window.__professionalPageBridgeV423=true;

const API="https://api.tanweer.site";
const TOKEN=localStorage.getItem("brightbyte_student_token")||"";
const CACHED=Number(localStorage.getItem("brightbyte_student_class_v423")||0);
const path=location.pathname;

function isProfessionalClass(c){return Number(c)>=7&&Number(c)<=10}

function markPage(c){
  if(!isProfessionalClass(c))return;
  document.body.classList.add("professional-grade");

  if(/professional-lab\.html$/i.test(path)){
    document.body.classList.add("professional-lab-page");
  }
  if(/student-exams\.html$/i.test(path)){
    document.body.classList.add("professional-exam-page");
    fixExamBack(c);
  }
  if(/final-certificate\.html$/i.test(path)){
    document.body.classList.add("professional-certificate-page");
  }
}

function fixExamBack(c){
  if(!isProfessionalClass(c))return;

  const apply=()=>{
    const back=document.getElementById("backLink");
    if(back){
      back.href="professional-universe.html";
      if(!back.dataset.proRouteFixed){
        back.dataset.proRouteFixed="1";
        back.addEventListener("click",e=>{
          e.preventDefault();
          location.replace("professional-universe.html");
        },true);
      }
    }

    const meta=document.getElementById("studentMeta");
    if(meta){
      const txt=meta.textContent||"";
      if(/Advanced 4.?6/i.test(txt) || /Foundation 1.?3/i.test(txt)){
        meta.textContent=`Class ${c} • Professional IT & AI 7–10`;
      }
    }
  };

  apply();

  const app=document.getElementById("app");
  if(app){
    new MutationObserver(apply).observe(app,{
      subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","href"]
    });
  }

  setTimeout(apply,100);
  setTimeout(apply,500);
  setTimeout(apply,1200);
}

async function boot(){
  if(CACHED && isProfessionalClass(CACHED)){
    markPage(CACHED);
  }

  if(!TOKEN)return;

  try{
    const r=await fetch(API+"/api/auth/me",{
      headers:{Authorization:`Bearer ${TOKEN}`},
      cache:"no-store"
    });
    const d=await r.json();

    if(!r.ok||d.role!=="student"||!d.profile)return;

    const c=Number(d.profile.class_number||0);

    if(isProfessionalClass(c)){
      try{localStorage.setItem("brightbyte_student_class_v423",String(c))}catch{}
      markPage(c);
      if(window.ProfessionalTechBuddy)window.ProfessionalTechBuddy.init(d.profile);
    }else{
      try{localStorage.removeItem("brightbyte_student_class_v423")}catch{}
    }
  }catch{}
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",boot,{once:true});
}else{
  boot();
}

})();
