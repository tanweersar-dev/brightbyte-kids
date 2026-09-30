(() => {
"use strict";

/* ============================================================
   V33.0 — MAIN STUDENT PROFILE ACCOUNT CONTROLS
   Classes 1–6
   - Adds Change Password under the student photo
   - Uses a custom in-site modal only
   - NO browser alert() / confirm() / prompt()
   ============================================================ */

const API = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY = "brightbyte_student_token";

const byId = id => document.getElementById(id);

function token(){
  return localStorage.getItem(TOKEN_KEY) || "";
}

function authHeaders(extra={}){
  const t=token();
  return {
    ...extra,
    ...(t ? {Authorization:`Bearer ${t}`} : {})
  };
}

async function apiJson(path,opt={}){
  const headers=authHeaders(opt.headers||{});

  if(
    opt.body &&
    !(opt.body instanceof FormData) &&
    !headers["Content-Type"]
  ){
    headers["Content-Type"]="application/json";
  }

  return fetch(API+path,{
    ...opt,
    headers,
    cache:"no-store"
  });
}

/* -----------------------------
   Modal shell
----------------------------- */
function ensureAccountModal(){
  if(byId("spAccountModal")) return byId("spAccountModal");

  const modal=document.createElement("div");
  modal.id="spAccountModal";
  modal.className="sp-account-modal";
  modal.setAttribute("aria-hidden","true");
  modal.innerHTML=`
    <div
      class="sp-account-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spAccountTitle"
    >
      <button
        id="spAccountClose"
        class="sp-account-close"
        type="button"
        aria-label="Close account window"
        title="Close"
      >×</button>

      <div id="spAccountBody"></div>
    </div>
  `;

  document.body.appendChild(modal);

  byId("spAccountClose").addEventListener("click",closeAccountModal);

  modal.addEventListener("click",event=>{
    if(event.target===modal) closeAccountModal();
  });

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && modal.classList.contains("open")){
      closeAccountModal();
    }
  });

  return modal;
}

function openAccountModal(html){
  const modal=ensureAccountModal();
  const body=byId("spAccountBody");

  body.innerHTML=html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("sp-account-modal-open");

  requestAnimationFrame(()=>{
    const first=body.querySelector(
      "input:not([disabled]),button:not([disabled]),select:not([disabled]),textarea:not([disabled])"
    );
    first?.focus();
  });
}

function closeAccountModal(){
  const modal=byId("spAccountModal");
  if(!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("sp-account-modal-open");

  const body=byId("spAccountBody");
  if(body) body.innerHTML="";
}

/* -----------------------------
   Inline custom messages
----------------------------- */
function setAccountMessage(text,type="error"){
  const box=byId("spAccountMessage");
  if(!box) return;

  box.textContent=text || "";
  box.className="sp-account-message";

  if(text){
    box.classList.add("show");
    box.classList.add(type);
  }
}

/* -----------------------------
   Password helpers
----------------------------- */
function passwordStrength(value){
  const p=String(value||"");
  let score=0;

  if(p.length>=8) score++;
  if(p.length>=12) score++;
  if(/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if(/\d/.test(p)) score++;
  if(/[^A-Za-z0-9]/.test(p)) score++;

  if(!p) return {score:0,label:"Enter a new password"};
  if(score<=1) return {score:1,label:"Basic"};
  if(score<=3) return {score:2,label:"Good"};
  return {score:3,label:"Strong"};
}

function updateStrength(){
  const input=byId("spNewPassword");
  const meter=byId("spPasswordStrengthFill");
  const text=byId("spPasswordStrengthText");

  if(!input || !meter || !text) return;

  const result=passwordStrength(input.value);

  meter.dataset.level=String(result.score);
  text.textContent=result.label;
}

function bindPasswordEyes(){
  document.querySelectorAll("[data-sp-password-eye]").forEach(button=>{
    button.addEventListener("click",()=>{
      const input=byId(button.dataset.spPasswordEye);
      if(!input) return;

      const show=input.type==="password";
      input.type=show ? "text" : "password";
      button.textContent=show ? "🙈" : "👁";
      button.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password"
      );
      button.setAttribute(
        "title",
        show ? "Hide password" : "Show password"
      );
    });
  });
}

function showPasswordModal(){
  openAccountModal(`
    <div class="sp-account-header">
      <div class="sp-account-icon password">🔐</div>
      <div>
        <span class="sp-account-kicker">MY ACCOUNT</span>
        <h2 id="spAccountTitle">Change My Password</h2>
        <p>
          Enter your current password, then choose a new password.
          After a successful change you will sign in again for security.
        </p>
      </div>
    </div>

    <div class="sp-security-note">
      <span>🛡️</span>
      <div>
        <b>Keep your password private</b>
        <p>Never share your password or OTP with friends, messages or unknown websites.</p>
      </div>
    </div>

    <div class="sp-account-field">
      <label for="spCurrentPassword">Current Password</label>
      <div class="sp-password-wrap">
        <input
          id="spCurrentPassword"
          type="password"
          autocomplete="current-password"
          placeholder="Enter your current password"
          maxlength="128"
        >
        <button
          class="sp-password-eye"
          type="button"
          data-sp-password-eye="spCurrentPassword"
          aria-label="Show current password"
          title="Show password"
        >👁</button>
      </div>
    </div>

    <div class="sp-account-field">
      <label for="spNewPassword">New Password</label>
      <div class="sp-password-wrap">
        <input
          id="spNewPassword"
          type="password"
          autocomplete="new-password"
          placeholder="At least 8 characters"
          maxlength="128"
        >
        <button
          class="sp-password-eye"
          type="button"
          data-sp-password-eye="spNewPassword"
          aria-label="Show new password"
          title="Show password"
        >👁</button>
      </div>

      <div class="sp-strength-row">
        <div class="sp-strength-track">
          <i id="spPasswordStrengthFill" data-level="0"></i>
        </div>
        <span id="spPasswordStrengthText">Enter a new password</span>
      </div>
    </div>

    <div class="sp-account-field">
      <label for="spConfirmPassword">Confirm New Password</label>
      <div class="sp-password-wrap">
        <input
          id="spConfirmPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Type the new password again"
          maxlength="128"
        >
        <button
          class="sp-password-eye"
          type="button"
          data-sp-password-eye="spConfirmPassword"
          aria-label="Show confirmed password"
          title="Show password"
        >👁</button>
      </div>
    </div>

    <div class="sp-password-rules">
      <b>Password rules</b>
      <span>• Minimum 8 characters</span>
      <span>• Maximum 128 characters</span>
      <span>• New password must be different from the current password</span>
    </div>

    <div
      id="spAccountMessage"
      class="sp-account-message"
      aria-live="polite"
    ></div>

    <div class="sp-account-actions-row">
      <button
        id="spPasswordCancel"
        class="sp-account-btn secondary"
        type="button"
      >Cancel</button>

      <button
        id="spPasswordSave"
        class="sp-account-btn primary"
        type="button"
      >🔐 Change Password</button>
    </div>
  `);

  bindPasswordEyes();

  byId("spNewPassword")?.addEventListener("input",updateStrength);
  updateStrength();

  byId("spPasswordCancel").addEventListener("click",closeAccountModal);
  byId("spPasswordSave").addEventListener("click",submitPasswordChange);

  ["spCurrentPassword","spNewPassword","spConfirmPassword"].forEach(id=>{
    byId(id)?.addEventListener("keydown",event=>{
      if(event.key==="Enter"){
        event.preventDefault();
        submitPasswordChange();
      }
    });
  });
}

async function submitPasswordChange(){
  const current=byId("spCurrentPassword")?.value || "";
  const next=byId("spNewPassword")?.value || "";
  const confirmNext=byId("spConfirmPassword")?.value || "";
  const save=byId("spPasswordSave");

  if(!current){
    setAccountMessage("Please enter your current password.");
    byId("spCurrentPassword")?.focus();
    return;
  }

  if(next.length<8){
    setAccountMessage("New password must contain at least 8 characters.");
    byId("spNewPassword")?.focus();
    return;
  }

  if(next.length>128){
    setAccountMessage("New password is too long.");
    byId("spNewPassword")?.focus();
    return;
  }

  if(next!==confirmNext){
    setAccountMessage("New password and confirmation do not match.");
    byId("spConfirmPassword")?.focus();
    return;
  }

  if(next===current){
    setAccountMessage("Choose a new password different from your current password.");
    byId("spNewPassword")?.focus();
    return;
  }

  if(!token()){
    showSessionExpiredModal();
    return;
  }

  save.disabled=true;
  save.innerHTML=`<span class="sp-btn-spinner"></span> Updating...`;
  setAccountMessage("Securely updating your password...","info");

  try{
    const response=await apiJson("/api/student/change-password",{
      method:"PATCH",
      body:JSON.stringify({
        currentPassword:current,
        newPassword:next
      })
    });

    const data=await response.json().catch(()=>({}));

    if(!response.ok){
      const message=
        data.error ||
        data.message ||
        (
          response.status===401
            ? "Current password is incorrect."
            : "Password change failed. Please try again."
        );

      throw new Error(message);
    }

    /*
      Security:
      the existing Advanced account flow also removes the student token
      after a successful password change.
    */
    localStorage.removeItem(TOKEN_KEY);

    showPasswordSuccessModal();

  }catch(error){
    setAccountMessage(
      error?.message || "Password change failed. Please try again."
    );

    save.disabled=false;
    save.textContent="🔐 Change Password";
  }
}

function showPasswordSuccessModal(){
  openAccountModal(`
    <div class="sp-success-screen">
      <div class="sp-success-ring">
        <span>✓</span>
      </div>

      <span class="sp-account-kicker">PASSWORD UPDATED</span>
      <h2 id="spAccountTitle">Password Changed Successfully</h2>

      <p>
        Your password has been updated. For security, please sign in again
        using your new password.
      </p>

      <div class="sp-success-tip">
        🔐 Remember your new password and never share it with anyone.
      </div>

      <div class="sp-account-actions-row centered">
        <button
          id="spLoginAgain"
          class="sp-account-btn primary wide"
          type="button"
        >🚀 Login Again</button>
      </div>
    </div>
  `);

  const close=byId("spAccountClose");
  if(close) close.style.display="none";

  byId("spLoginAgain").addEventListener("click",()=>{
    location.href="student-login.html";
  });
}

function showSessionExpiredModal(){
  openAccountModal(`
    <div class="sp-success-screen">
      <div class="sp-account-icon warning">🔒</div>
      <span class="sp-account-kicker">SESSION REQUIRED</span>
      <h2 id="spAccountTitle">Please Login Again</h2>
      <p>
        Your student session is no longer available.
        Sign in again before changing your password.
      </p>

      <div class="sp-account-actions-row centered">
        <button
          id="spSessionLogin"
          class="sp-account-btn primary wide"
          type="button"
        >🚀 Go to Student Login</button>
      </div>
    </div>
  `);

  byId("spSessionLogin").addEventListener("click",()=>{
    location.href="student-login.html";
  });
}

/* -----------------------------
   Add visible button to profile
----------------------------- */
function addPasswordButton(){
  const photoActions=document.querySelector(".photo-actions");

  if(!photoActions) return false;
  if(byId("spChangePasswordBtn")) return true;

  const button=document.createElement("button");
  button.id="spChangePasswordBtn";
  button.className="mini sp-change-password-btn";
  button.type="button";
  button.innerHTML="🔐 Password";
  button.title="Change my password";
  button.setAttribute("aria-label","Change my student password");

  button.addEventListener("click",showPasswordModal);

  photoActions.appendChild(button);
  return true;
}

function addNavAccountButton(){
  const nav=document.querySelector(".nav");

  if(!nav || byId("spNavPasswordBtn")) return;

  const logout=
    nav.querySelector(".danger") ||
    [...nav.querySelectorAll("button")].find(
      button=>/logout/i.test(button.textContent||"")
    );

  const button=document.createElement("button");
  button.id="spNavPasswordBtn";
  button.type="button";
  button.className="sp-nav-account-btn";
  button.innerHTML="🔐 Password";
  button.title="Change password";
  button.setAttribute("aria-label","Change my student password");
  button.addEventListener("click",showPasswordModal);

  if(logout){
    nav.insertBefore(button,logout);
  }else{
    nav.appendChild(button);
  }
}

function init(){
  /*
    Works for every student class because there is intentionally
    no Class 4–6 restriction here.
  */
  ensureAccountModal();

  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;

    const added=addPasswordButton();
    addNavAccountButton();

    if(added || attempts>=40){
      clearInterval(timer);
    }
  },125);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}

window.addEventListener("pageshow",()=>{
  addPasswordButton();
  addNavAccountButton();
});

})();
