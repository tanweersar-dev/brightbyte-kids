(() => {
"use strict";

/* ============================================================
   V26.1 — Advanced Universe Student Account Controls
   Requires:
   - existing V25 theme
   - existing /api/student/photo
   - new PATCH /api/student/change-password Worker route
   ============================================================ */

const API = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";
const TOKEN_KEY = "brightbyte_student_token";
const token = localStorage.getItem(TOKEN_KEY) || "";
let currentProfile = null;
let previewUrl = null;

const byId = id => document.getElementById(id);

function initials(name){
  return (String(name||"Student").trim().charAt(0)||"S").toUpperCase();
}

async function authJson(path,opt={}){
  const headers={...(opt.headers||{}),Authorization:`Bearer ${token}`};
  if(opt.body && !(opt.body instanceof FormData) && !headers["Content-Type"]){
    headers["Content-Type"]="application/json";
  }
  return fetch(API+path,{...opt,headers,cache:"no-store"});
}

function ensureModal(){
  if(byId("advAccountModal")) return;
  const modal=document.createElement("div");
  modal.id="advAccountModal";
  modal.className="adv-account-modal";
  modal.setAttribute("aria-hidden","true");
  modal.innerHTML=`<div class="adv-account-card">
    <button id="advAccountClose" class="adv-account-close" type="button">×</button>
    <div id="advAccountBody"></div>
  </div>`;
  document.body.appendChild(modal);

  byId("advAccountClose").onclick=closeAccountModal;
  modal.onclick=e=>{if(e.target===modal)closeAccountModal()};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAccountModal()});
}

function openAccountModal(html){
  ensureModal();
  byId("advAccountBody").innerHTML=html;
  const modal=byId("advAccountModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}

function closeAccountModal(){
  const modal=byId("advAccountModal");
  if(!modal)return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  if(previewUrl){
    URL.revokeObjectURL(previewUrl);
    previewUrl=null;
  }
}

function setMsg(text,good=false){
  const el=byId("advAccountMsg");
  if(!el)return;
  el.textContent=text;
  el.className="adv-account-msg "+(good?"good":"bad");
}

async function refreshHeroPhoto(){
  const ring=byId("advPhotoRing");
  if(!ring)return;

  try{
    const r=await authJson("/api/student/photo");
    if(!r.ok)throw new Error();
    const blob=await r.blob();
    const url=URL.createObjectURL(blob);
    ring.innerHTML=`<img id="advStudentPhoto" alt="Student profile photo">`;
    const img=byId("advStudentPhoto");
    img.onload=()=>setTimeout(()=>URL.revokeObjectURL(url),1200);
    img.src=url;
  }catch{
    ring.innerHTML=`<div class="adv-avatar-fallback">${initials(currentProfile?.display_name||currentProfile?.username)}</div>`;
  }
}

function photoModal(){
  const name=currentProfile?.display_name||currentProfile?.username||"Student";
  openAccountModal(`
    <div class="adv-account-icon">📷</div>
    <h2>Change Profile Photo</h2>
    <p>Choose a clear JPG, PNG or WebP image. Maximum file size is 2 MB.</p>

    <div class="adv-photo-preview" id="advPhotoPreview">
      <div class="fallback">${initials(name)}</div>
    </div>

    <input id="advPhotoInput" type="file" accept="image/jpeg,image/png,image/webp" hidden>
    <label class="adv-upload-label" for="advPhotoInput">📁 Choose New Photo</label>

    <div id="advAccountMsg" class="adv-account-msg"></div>

    <div class="adv-account-actions-row">
      <button class="danger" id="advRemovePhotoBtn" type="button">🗑️ Remove Photo</button>
      <button class="cancel" id="advPhotoCancel" type="button">Cancel</button>
      <button class="save" id="advPhotoSave" type="button" disabled>💾 Save Photo</button>
    </div>
  `);

  let selectedFile=null;
  const input=byId("advPhotoInput");
  const save=byId("advPhotoSave");

  input.onchange=()=>{
    const file=input.files?.[0];
    selectedFile=null;
    save.disabled=true;

    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){
      return setMsg("Please choose a JPG, PNG or WebP image.");
    }
    if(file.size>2*1024*1024){
      return setMsg("Photo must be 2 MB or smaller.");
    }

    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl=URL.createObjectURL(file);
    byId("advPhotoPreview").innerHTML=`<img src="${previewUrl}" alt="New photo preview">`;
    selectedFile=file;
    save.disabled=false;
    setMsg("Photo ready to upload.",true);
  };

  byId("advPhotoCancel").onclick=closeAccountModal;

  save.onclick=async()=>{
    if(!selectedFile)return;
    save.disabled=true;
    setMsg("Uploading...",true);
    const fd=new FormData();
    fd.append("photo",selectedFile);
    try{
      const r=await authJson("/api/student/photo",{method:"POST",body:fd});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Photo upload failed");
      if(currentProfile)currentProfile.has_photo=true;
      await refreshHeroPhoto();
      setMsg("Profile photo updated successfully ✓",true);
      setTimeout(closeAccountModal,750);
    }catch(e){
      setMsg(e.message||"Photo upload failed.");
      save.disabled=false;
    }
  };

  byId("advRemovePhotoBtn").onclick=async()=>{
    if(!confirm("Remove your profile photo?"))return;
    setMsg("Removing photo...",true);
    try{
      const r=await authJson("/api/student/photo",{method:"DELETE"});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Could not remove photo");
      if(currentProfile)currentProfile.has_photo=false;
      await refreshHeroPhoto();
      setMsg("Photo removed.",true);
      setTimeout(closeAccountModal,650);
    }catch(e){
      setMsg(e.message||"Could not remove photo.");
    }
  };
}

function passwordModal(){
  openAccountModal(`
    <div class="adv-account-icon">🔐</div>
    <h2>Change My Password</h2>
    <p>Your current password is required. After a successful change, all student sessions are signed out for security and you will log in again.</p>

    <div class="adv-account-field">
      <label>Current Password</label>
      <div class="adv-password-wrap">
        <input id="advCurrentPassword" type="password" autocomplete="current-password" placeholder="Enter current password">
        <button class="adv-password-eye" type="button" data-password-eye="advCurrentPassword" aria-label="Show current password" title="Show password">👁</button>
      </div>
    </div>

    <div class="adv-account-field">
      <label>New Password</label>
      <div class="adv-password-wrap">
        <input id="advNewPassword" type="password" autocomplete="new-password" placeholder="At least 8 characters">
        <button class="adv-password-eye" type="button" data-password-eye="advNewPassword" aria-label="Show new password" title="Show password">👁</button>
      </div>
    </div>

    <div class="adv-account-field">
      <label>Confirm New Password</label>
      <div class="adv-password-wrap">
        <input id="advConfirmPassword" type="password" autocomplete="new-password" placeholder="Type the new password again">
        <button class="adv-password-eye" type="button" data-password-eye="advConfirmPassword" aria-label="Show confirmed password" title="Show password">👁</button>
      </div>
    </div>

    <div class="adv-password-rules">
      🛡️ Use at least 8 characters. Do not share the password with friends or strangers.
    </div>

    <div id="advAccountMsg" class="adv-account-msg"></div>

    <div class="adv-account-actions-row">
      <button class="cancel" id="advPasswordCancel" type="button">Cancel</button>
      <button class="save" id="advPasswordSave" type="button">🔐 Change Password</button>
    </div>
  `);

  document.querySelectorAll("[data-password-eye]").forEach(button=>{
    button.onclick=()=>{
      const input=byId(button.dataset.passwordEye);
      if(!input)return;

      const willShow=input.type==="password";
      input.type=willShow?"text":"password";
      button.textContent=willShow?"🙈":"👁";
      button.setAttribute("aria-label",willShow?"Hide password":"Show password");
      button.setAttribute("title",willShow?"Hide password":"Show password");
    };
  });

  byId("advPasswordCancel").onclick=closeAccountModal;

  byId("advPasswordSave").onclick=async()=>{
    const current=byId("advCurrentPassword").value;
    const next=byId("advNewPassword").value;
    const confirmNext=byId("advConfirmPassword").value;
    const btn=byId("advPasswordSave");

    if(!current)return setMsg("Enter your current password.");
    if(next.length<8)return setMsg("New password must contain at least 8 characters.");
    if(next.length>128)return setMsg("New password is too long.");
    if(next!==confirmNext)return setMsg("New password and confirmation do not match.");
    if(next===current)return setMsg("Choose a new password different from the current password.");

    btn.disabled=true;
    setMsg("Updating password...",true);

    try{
      const r=await authJson("/api/student/change-password",{
        method:"PATCH",
        body:JSON.stringify({
          currentPassword:current,
          newPassword:next
        })
      });

      const data=await r.json().catch(()=>({}));

      if(!r.ok){
        throw new Error(data.error||"Password change failed");
      }

      localStorage.removeItem(TOKEN_KEY);

      openAccountModal(`
        <div class="adv-account-icon">✅</div>
        <h2>Password Changed Successfully</h2>
        <p>Your old student sessions were signed out for security. Please log in again using your new password.</p>

        <div class="adv-account-actions-row">
          <button class="save" id="advLoginAgain" type="button">🚀 Login Again</button>
        </div>
      `);

      byId("advLoginAgain").onclick=()=>{
        location.href="student-login.html";
      };

    }catch(e){
      setMsg(e.message||"Password change failed.");
      btn.disabled=false;
    }
  };
}

function addButtons(){
  const side=byId("advProfileSide");
  if(!side || byId("advAccountActions"))return false;

  const actions=document.createElement("div");
  actions.id="advAccountActions";
  actions.className="adv-account-actions";
  actions.innerHTML=`
    <button class="adv-account-btn photo" id="advChangePhotoBtn" type="button">📷 Change Photo</button>
    <button class="adv-account-btn password" id="advChangePasswordBtn" type="button">🔐 Password</button>
  `;
  side.appendChild(actions);

  byId("advChangePhotoBtn").onclick=photoModal;
  byId("advChangePasswordBtn").onclick=passwordModal;
  return true;
}

async function init(){
  if(!token)return;
  try{
    const r=await authJson("/api/auth/me");
    const d=await r.json();
    if(!r.ok || d.role!=="student" || !d.profile)return;
    currentProfile=d.profile;
    const c=Number(currentProfile.class_number||1);
    if(c<4||c>6)return;

    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(addButtons() || tries>=30)clearInterval(timer);
    },150);
  }catch{}
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",()=>setTimeout(init,180));
}else{
  setTimeout(init,180);
}

})();
