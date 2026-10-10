(() => {
"use strict";

/* V42.2 — Class 7–10 legacy profile guard
   Prevent Professional students from opening the old generic student-profile.html.
   Class 1–6 behavior is left unchanged. */

const TOKEN_KEY = "brightbyte_student_token";
const API = "https://api.tanweer.site";
const token = localStorage.getItem(TOKEN_KEY);

if (!token) return;

let released = false;

function releasePage(){
  if(released) return;
  released = true;
  document.documentElement.style.visibility = "";
}

function goProfessional(){
  released = true;
  location.replace("professional-universe.html");
}

/* Hide the old generic page while class is being verified,
   so Class 7–10 students do not see a flash of the younger dashboard. */
document.documentElement.style.visibility = "hidden";

/* Fail-safe: never leave the page hidden if the network/API is unavailable. */
const failSafe = setTimeout(releasePage, 2200);

fetch(API + "/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
  cache: "no-store"
})
.then(async response => {
  const data = await response.json().catch(() => ({}));

  if(!response.ok || data.role !== "student" || !data.profile){
    clearTimeout(failSafe);
    releasePage();
    return;
  }

  const classNumber = Number(data.profile.class_number || 0);

  if(classNumber >= 7 && classNumber <= 10){
    clearTimeout(failSafe);
    goProfessional();
    return;
  }

  clearTimeout(failSafe);
  releasePage();
})
.catch(() => {
  clearTimeout(failSafe);
  releasePage();
});

})();
