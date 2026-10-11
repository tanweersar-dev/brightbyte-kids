(() => {
"use strict";

if (window.__professionalPageBridgeV424) return;
window.__professionalPageBridgeV424 = true;

const API = "https://api.tanweer.site";
const TOKEN = localStorage.getItem("brightbyte_student_token") || "";
const CACHE_KEY = "brightbyte_student_class_v423";
const cachedClass = Number(localStorage.getItem(CACHE_KEY) || 0);
const path = location.pathname;

function isProfessional(c){
  c = Number(c || 0);
  return c >= 7 && c <= 10;
}

function applyProfessionalClasses(c){
  if(!isProfessional(c)) return;

  document.body.classList.add("professional-grade");

  if(/professional-lab\.html$/i.test(path)){
    document.body.classList.add("professional-lab-page");
  }

  if(/student-exams\.html$/i.test(path)){
    document.body.classList.add("professional-exam-page");
    installExamRouteFix(c);
  }

  if(/final-certificate\.html$/i.test(path)){
    document.body.classList.add("professional-certificate-page");
  }
}

let examFixTimer = null;

function installExamRouteFix(c){
  if(!isProfessional(c)) return;

  const apply = () => {
    const back = document.getElementById("backLink");
    if(back){
      const wanted = "professional-universe.html";
      if(back.getAttribute("href") !== wanted){
        back.setAttribute("href", wanted);
      }

      if(!back.dataset.professionalBackV424){
        back.dataset.professionalBackV424 = "1";
        back.addEventListener("click", e => {
          e.preventDefault();
          location.replace("professional-universe.html");
        }, true);
      }
    }

    const meta = document.getElementById("studentMeta");
    if(meta && !/Professional IT & AI 7.?10/i.test(meta.textContent || "")){
      const txt = String(meta.textContent || "");
      if(/Class\s*\d+/i.test(txt) || /Advanced 4.?6|Foundation 1.?3/i.test(txt)){
        meta.textContent = `Class ${c} • Professional IT & AI 7–10`;
      }
    }
  };

  apply();
  setTimeout(apply, 250);
  setTimeout(apply, 800);
  setTimeout(apply, 1600);

  // Very light periodic correction because the legacy exam JS refreshes
  // its own label/back-link every 30 seconds. No MutationObserver is used,
  // so there is no render-blocking mutation loop.
  if(!examFixTimer){
    examFixTimer = setInterval(apply, 3000);
  }
}

async function boot(){
  if(isProfessional(cachedClass)){
    applyProfessionalClasses(cachedClass);
  }

  if(!TOKEN) return;

  try{
    const r = await fetch(API + "/api/auth/me", {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store"
    });

    const d = await r.json().catch(() => ({}));

    if(!r.ok || d.role !== "student" || !d.profile) return;

    const c = Number(d.profile.class_number || 0);

    if(isProfessional(c)){
      try{ localStorage.setItem(CACHE_KEY, String(c)); }catch{}
      applyProfessionalClasses(c);

      if(window.ProfessionalTechBuddy){
        window.ProfessionalTechBuddy.init(d.profile);
      }
    }else{
      try{ localStorage.removeItem(CACHE_KEY); }catch{}
    }
  }catch(e){
    console.warn("Professional page bridge:", e);
  }
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", boot, {once:true});
}else{
  boot();
}

})();
