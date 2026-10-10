(() => {
"use strict";

/* ============================================================
   V41.1 — Professional IT & AI Universe
   Class 7–10 only
   Adds:
   • Stylish profile photo card
   • Photo upload/remove
   • Password self-service
   • Private profile editing
   • Existing 24 worlds / lab links preserved
   ============================================================ */

const API="https://api.tanweer.site";
const TOKEN_KEY="brightbyte_student_token";
const TOKEN=localStorage.getItem(TOKEN_KEY)||"";
const $=id=>document.getElementById(id);
const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[ch]));

let profile=null;
let heroPhotoUrl=null;
let previewUrl=null;
let toastTimer=null;

const worlds=[
{id:1,cat:"hardware",icon:"🧠",accent:"#6557ef",title:"Computer Hardware",desc:"CPU, RAM, SSD, NVMe, motherboard, SMPS, ports, compatibility and safe diagnosis.",levels:"7–10",lessons:["Identify core PC parts","Understand component roles","Compare RAM/SSD interfaces","Diagnose no-power/no-display basics"]},
{id:2,cat:"hardware",icon:"🧩",accent:"#7d5ce8",title:"PC Assembly & Upgrade",desc:"Build a virtual PC, choose compatible upgrades and verify a clean handover.",levels:"7–10",lessons:["Assembly sequence","RAM & storage upgrade","Compatibility checks","Post-upgrade verification"]},
{id:3,cat:"windows",icon:"🪟",accent:"#3e8df6",title:"Windows Installation",desc:"Boot media, BIOS/UEFI, partitions, setup, updates, recovery and safe upgrade planning.",levels:"8–10",lessons:["Boot process","Install flow","Driver/update checklist","Recovery choices"]},
{id:4,cat:"windows",icon:"🧰",accent:"#39a0e8",title:"Drivers & Device Manager",desc:"Unknown devices, yellow warnings, update/rollback and Hardware ID concepts.",levels:"7–10",lessons:["Read Device Manager","Driver update","Rollback","Unknown-device workflow"]},
{id:5,cat:"printer",icon:"🖨️",accent:"#ed8d45",title:"Printer Installation",desc:"USB/network printer, TCP/IP port, drivers, default printer and test page.",levels:"7–10",lessons:["USB install","Network printer","TCP/IP port","Test page"]},
{id:6,cat:"printer",icon:"📠",accent:"#e96f54",title:"Printer & Scanner Support",desc:"Offline status, stuck queue, changed IP, scan setup and logical troubleshooting.",levels:"8–10",lessons:["Offline checks","Queue/spooler","Driver/port","Scanner path"]},
{id:7,cat:"m365",icon:"📧",accent:"#2a80d7",title:"Outlook 365",desc:"Profiles, mailbox, signature, rules, automatic replies, calendar and safe attachments.",levels:"7–10",lessons:["Mailbox basics","Rules/signature","Automatic reply","Troubleshooting"]},
{id:8,cat:"m365",icon:"✉️",accent:"#4576d7",title:"Email Configuration",desc:"IMAP, POP3, SMTP, SSL/TLS, MFA concepts and common send/receive issues.",levels:"8–10",lessons:["Mail flow","IMAP vs POP3","SMTP","Authentication troubleshooting"]},
{id:9,cat:"m365",icon:"☁️",accent:"#4a91d7",title:"Microsoft 365 & Cloud",desc:"OneDrive, Teams, Word/Excel collaboration, accounts and cloud-service basics.",levels:"7–10",lessons:["Cloud vs local","OneDrive","Teams","SaaS & identity"]},
{id:10,cat:"network",icon:"🌐",accent:"#1fae9b",title:"LAN Fundamentals",desc:"NIC, MAC, IP, subnet, gateway, DNS, DHCP, Ethernet and network flow.",levels:"7–10",lessons:["LAN components","IP basics","Gateway/DNS","DHCP"]},
{id:11,cat:"network",icon:"🔀",accent:"#18a884",title:"Basic Switching",desc:"Switch ports, MAC learning, access ports and beginner VLAN concepts.",levels:"8–10",lessons:["Switch role","MAC table","Access ports","VLAN idea"]},
{id:12,cat:"network",icon:"🧭",accent:"#1f9b8a",title:"Basic Routing",desc:"Routers, default gateway, routing table and simple static-route concepts.",levels:"8–10",lessons:["Router role","Gateway","Routing table","Static route concept"]},
{id:13,cat:"network",icon:"🌍",accent:"#1e8e9f",title:"LAN / WAN / Internet",desc:"ISP, ONT/modem, router/firewall, switches, APs and end-user paths.",levels:"7–10",lessons:["LAN vs WAN","Internet path","Office topology","Failure domains"]},
{id:14,cat:"network",icon:"📶",accent:"#218bb8",title:"Wi-Fi & Wireless",desc:"SSID, 2.4/5 GHz, WPA2/WPA3, signal, interference and AP placement.",levels:"7–10",lessons:["Wireless basics","Bands","Security","Coverage"]},
{id:15,cat:"network",icon:"⌨️",accent:"#2a76b6",title:"Network Command Lab",desc:"ipconfig, ping, tracert, nslookup, release/renew and DNS troubleshooting.",levels:"8–10",lessons:["Read IP config","Ping logic","Trace path","DNS tests"]},
{id:16,cat:"support",icon:"🎧",accent:"#7b58cf",title:"IT Help Desk",desc:"Receive, clarify, diagnose, fix, verify, document, close or escalate.",levels:"7–10",lessons:["Ask good questions","Troubleshooting order","Verification","Ticket closure"]},
{id:17,cat:"support",icon:"🖥️",accent:"#7156c8",title:"Remote Support",desc:"Consent, privacy, Quick Assist style workflow and professional communication.",levels:"8–10",lessons:["Permission","Safe remote flow","User communication","Disconnect & document"]},
{id:18,cat:"cyber",icon:"🛡️",accent:"#d05277",title:"Cybersecurity Essentials",desc:"Phishing, MFA, passkeys, malware awareness, backups and social engineering.",levels:"7–10",lessons:["Account safety","Phishing","Updates/backups","Incident reporting"]},
{id:19,cat:"ai",icon:"🤖",accent:"#a14fd3",title:"AI Skills",desc:"Prompt design, research, hallucination checks, privacy and responsible use.",levels:"7–10",lessons:["Prompt structure","Verification","Privacy","Responsible AI"]},
{id:20,cat:"ai",icon:"✨",accent:"#9b58e8",title:"AI for IT Support",desc:"Create troubleshooting checklists, ticket summaries and SOP drafts — then verify.",levels:"8–10",lessons:["Support prompts","SOP drafts","Log explanation","Human verification"]},
{id:21,cat:"web",icon:"🧩",accent:"#ef5d9f",title:"No-Code Website Studio",desc:"Plan, design, build and publish a student IT portfolio without mandatory coding.",levels:"7–10",lessons:["Site plan","Pages/navigation","Responsive preview","Publish safely"]},
{id:22,cat:"web",icon:"🔗",accent:"#dd659a",title:"Web & DNS Basics",desc:"Domain, hosting, URL, HTTP/HTTPS, DNS and browser/server concepts.",levels:"8–10",lessons:["Domain/hosting","DNS","HTTPS","Browser/server flow"]},
{id:23,cat:"support",icon:"📋",accent:"#e5a02e",title:"IT Documentation & Inventory",desc:"Asset records, network diagrams, SOPs, handover notes and change history.",levels:"8–10",lessons:["Inventory","SOP structure","Network diagram","Handover"]},
{id:24,cat:"support",icon:"🏆",accent:"#d7a431",title:"Capstone & Career Skills",desc:"Combine support, network, printer, Outlook, AI and documentation in a final project.",levels:"10",lessons:["Small-office build","Fault diagnosis","Support report","Final verification"]}
];

const missions=[
"🧠 Identify one hardware component",
"🌐 Run a network diagnosis",
"🖨️ Solve a printer scenario",
"📧 Explain an Outlook issue",
"🤖 Improve an AI prompt",
"🛡️ Spot a phishing clue",
"📋 Write a support note",
"🧩 Improve a web page plan"
];

async function authFetch(path,opt={}){
  const headers={...(opt.headers||{}),Authorization:`Bearer ${TOKEN}`};
  if(opt.body && !(opt.body instanceof FormData) && !headers["Content-Type"]){
    headers["Content-Type"]="application/json";
  }
  return fetch(API+path,{...opt,headers,cache:"no-store"});
}

function toast(message){
  const el=$("toast");
  if(!el)return;
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}

function initials(){
  return (String(profile?.display_name||profile?.username||"Student").trim().charAt(0)||"S").toUpperCase();
}

function labKey(){
  return `tannu_professional_it_lab_v41_${profile?.user_id||profile?.username||"student"}`;
}

function loadLabState(){
  try{return JSON.parse(localStorage.getItem(labKey())||"{}")||{}}
  catch{return{}}
}

function renderStats(){
  const s=loadLabState();
  const scores=s.scores&&typeof s.scores==="object"?s.scores:{};
  const completed=Object.keys(scores).filter(k=>Number(scores[k])>=60).length;
  $("labCount").textContent=completed;
  $("skillCount").textContent=Math.min(24,completed+Number(s.worldsCompleted||0));
  $("xpCount").textContent=Number(s.xp||completed*25);
  $("projectCount").textContent=Number(s.capstoneComplete?1:0);
}

function renderMissions(){
  const day=Math.floor(Date.now()/86400000);
  $("dailyMissions").innerHTML=[0,1,2,3]
    .map(i=>`<span>${missions[(day+i*2)%missions.length]}</span>`)
    .join("");
}

function renderWorlds(filter="all"){
  const rows=worlds.filter(w=>filter==="all"||w.cat===filter);

  $("worldGrid").innerHTML=rows.map(w=>`
    <article class="world-card" style="--accent:${w.accent}">
      <div class="world-icon">${w.icon}</div>
      <h3>${w.title}</h3>
      <p>${w.desc}</p>
      <div class="world-meta">
        <span>CLASS ${w.levels}</span>
        <span>${w.lessons.length} CORE TOPICS</span>
      </div>
      <button type="button" data-world="${w.id}">Open World →</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-world]").forEach(button=>{
    button.onclick=()=>openWorld(Number(button.dataset.world));
  });
}

function openWorld(id){
  const w=worlds.find(x=>x.id===id);
  if(!w)return;

  $("worldModalBody").innerHTML=`
    <span class="eyebrow dark">${w.icon} ${w.title.toUpperCase()}</span>
    <h2>${w.title}</h2>
    <p>${w.desc}</p>
    <div class="modal-lessons">
      ${w.lessons.map((item,index)=>`
        <div>
          <b>${index+1}. ${item}</b><br>
          <small>Learn the concept, practise it, troubleshoot a scenario, then verify your result.</small>
        </div>
      `).join("")}
    </div>
    <div class="modal-actions">
      <a class="primary" href="professional-lab.html?lab=${Math.min(20,Math.max(1,id))}">🧪 Open Related Lab</a>
      <a class="soft-btn" href="student-exams.html">📝 Exam Center</a>
    </div>
  `;

  openModal("worldModal");
}

function openModal(id){
  const modal=$(id);
  if(!modal)return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}

function closeModal(id){
  const modal=$(id);
  if(!modal)return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");

  if(id==="accountModal"&&previewUrl){
    URL.revokeObjectURL(previewUrl);
    previewUrl=null;
  }
}

function setAccountBody(html){
  $("accountModalBody").innerHTML=html;
  openModal("accountModal");
}

function setAccountMsg(message,good=false){
  const el=$("accountMsg");
  if(!el)return;
  el.textContent=message;
  el.className=`account-msg ${good?"good":"bad"}`;
}

function renderProfile(){
  if(!profile)return;

  const c=Number(profile.class_number||0);
  const name=profile.display_name||profile.username||"Student";
  const username=profile.username||"—";
  const location=profile.location||"Location not added";

  $("studentChip").textContent=`👤 ${name}`;
  $("classChip").textContent=`🎓 Class ${c}`;
  $("profileName").textContent=name;
  $("profileId").textContent=`ID: ${username}`;
  $("heroClassPill").textContent=`🎓 Class ${c}`;
  $("heroLocationPill").textContent=`📍 ${location}`;
  $("profilePhotoFallback").textContent=initials();
}

async function loadHeroPhoto(){
  if(!profile)return;

  const img=$("profilePhoto");
  const fallback=$("profilePhotoFallback");

  if(!profile.has_photo){
    if(heroPhotoUrl){
      URL.revokeObjectURL(heroPhotoUrl);
      heroPhotoUrl=null;
    }
    img.hidden=true;
    fallback.hidden=false;
    fallback.textContent=initials();
    return;
  }

  try{
    const r=await authFetch("/api/student/photo");
    if(!r.ok)throw new Error("No photo");
    const blob=await r.blob();

    if(heroPhotoUrl)URL.revokeObjectURL(heroPhotoUrl);
    heroPhotoUrl=URL.createObjectURL(blob);

    img.src=heroPhotoUrl;
    img.hidden=false;
    fallback.hidden=true;
  }catch{
    img.hidden=true;
    fallback.hidden=false;
    fallback.textContent=initials();
  }
}

function accountMenu(){
  setAccountBody(`
    <div class="account-icon">👤</div>
    <h2>My Professional Account</h2>
    <p class="account-copy">Manage your private student profile, photo and password securely.</p>

    <div class="account-menu-grid">
      <button class="account-menu-card" id="menuPhotoBtn" type="button">
        <span>📷</span><b>Profile Photo</b><small>Upload, preview or remove your student photo.</small>
      </button>
      <button class="account-menu-card" id="menuPasswordBtn" type="button">
        <span>🔐</span><b>Password</b><small>Change your password securely using your current password.</small>
      </button>
      <button class="account-menu-card" id="menuProfileBtn" type="button">
        <span>✏️</span><b>Edit Profile</b><small>Update name, nickname, gender, location and bio.</small>
      </button>
    </div>

    <div class="password-rules">
      🛡️ Your guardian contact details are not shown here. Keep your password private.
    </div>
  `);

  $("menuPhotoBtn").onclick=photoModal;
  $("menuPasswordBtn").onclick=passwordModal;
  $("menuProfileBtn").onclick=profileModal;
}

function photoModal(){
  const name=profile?.display_name||profile?.username||"Student";

  setAccountBody(`
    <div class="account-icon">📷</div>
    <h2>Change Profile Photo</h2>
    <p class="account-copy">Choose a clear JPG, PNG or WebP image. Maximum file size is 2 MB.</p>

    <div class="photo-preview" id="photoPreview">
      <div class="fallback">${esc((String(name).trim().charAt(0)||"S").toUpperCase())}</div>
    </div>

    <input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" hidden>
    <label class="upload-label" for="photoInput">📁 Choose New Photo</label>

    <div id="accountMsg" class="account-msg"></div>

    <div class="account-actions-row">
      <button class="danger" id="removePhotoBtn" type="button">🗑️ Remove Photo</button>
      <button class="cancel" id="photoCancelBtn" type="button">Cancel</button>
      <button class="save" id="photoSaveBtn" type="button" disabled>💾 Save Photo</button>
    </div>
  `);

  let selectedFile=null;
  const input=$("photoInput");
  const save=$("photoSaveBtn");

  input.onchange=()=>{
    const file=input.files?.[0];
    selectedFile=null;
    save.disabled=true;

    if(!file)return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){
      return setAccountMsg("Please choose a JPG, PNG or WebP image.");
    }
    if(file.size>2*1024*1024){
      return setAccountMsg("Photo must be 2 MB or smaller.");
    }

    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl=URL.createObjectURL(file);
    $("photoPreview").innerHTML=`<img src="${previewUrl}" alt="New photo preview">`;

    selectedFile=file;
    save.disabled=false;
    setAccountMsg("Photo ready to upload.",true);
  };

  $("photoCancelBtn").onclick=()=>closeModal("accountModal");

  save.onclick=async()=>{
    if(!selectedFile)return;

    save.disabled=true;
    setAccountMsg("Uploading...",true);

    const fd=new FormData();
    fd.append("photo",selectedFile);

    try{
      const r=await authFetch("/api/student/photo",{method:"POST",body:fd});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Photo upload failed");

      profile.has_photo=true;
      await loadHeroPhoto();

      setAccountMsg("Profile photo updated successfully ✓",true);
      toast("Profile photo updated ✓");
      setTimeout(()=>closeModal("accountModal"),700);
    }catch(error){
      setAccountMsg(error.message||"Photo upload failed.");
      save.disabled=false;
    }
  };

  $("removePhotoBtn").onclick=async()=>{
    if(!profile?.has_photo){
      return setAccountMsg("No profile photo is currently saved.");
    }
    if(!confirm("Remove your profile photo?"))return;

    setAccountMsg("Removing photo...",true);

    try{
      const r=await authFetch("/api/student/photo",{method:"DELETE"});
      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Could not remove photo");

      profile.has_photo=false;
      await loadHeroPhoto();

      setAccountMsg("Photo removed.",true);
      toast("Profile photo removed");
      setTimeout(()=>closeModal("accountModal"),650);
    }catch(error){
      setAccountMsg(error.message||"Could not remove photo.");
    }
  };
}

function wirePasswordEyes(){
  document.querySelectorAll("[data-password-eye]").forEach(button=>{
    button.onclick=()=>{
      const input=$(button.dataset.passwordEye);
      if(!input)return;

      const show=input.type==="password";
      input.type=show?"text":"password";
      button.textContent=show?"🙈":"👁";
      button.title=show?"Hide password":"Show password";
      button.setAttribute("aria-label",show?"Hide password":"Show password");
    };
  });
}

function passwordModal(){
  setAccountBody(`
    <div class="account-icon">🔐</div>
    <h2>Change My Password</h2>
    <p class="account-copy">Your current password is required. After a successful change, all student sessions are signed out for security.</p>

    <div class="account-field">
      <label>Current Password</label>
      <div class="password-wrap">
        <input id="currentPassword" type="password" autocomplete="current-password" placeholder="Enter current password">
        <button class="password-eye" type="button" data-password-eye="currentPassword" title="Show password">👁</button>
      </div>
    </div>

    <div class="account-field">
      <label>New Password</label>
      <div class="password-wrap">
        <input id="newPassword" type="password" autocomplete="new-password" placeholder="At least 8 characters">
        <button class="password-eye" type="button" data-password-eye="newPassword" title="Show password">👁</button>
      </div>
    </div>

    <div class="account-field">
      <label>Confirm New Password</label>
      <div class="password-wrap">
        <input id="confirmPassword" type="password" autocomplete="new-password" placeholder="Type new password again">
        <button class="password-eye" type="button" data-password-eye="confirmPassword" title="Show password">👁</button>
      </div>
    </div>

    <div class="password-rules">
      🛡️ Use at least 8 characters. Never share your password, OTP or private information with friends or strangers.
    </div>

    <div id="accountMsg" class="account-msg"></div>

    <div class="account-actions-row">
      <button class="cancel" id="passwordCancelBtn" type="button">Cancel</button>
      <button class="save" id="passwordSaveBtn" type="button">🔐 Change Password</button>
    </div>
  `);

  wirePasswordEyes();

  $("passwordCancelBtn").onclick=()=>closeModal("accountModal");

  $("passwordSaveBtn").onclick=async()=>{
    const current=$("currentPassword").value;
    const next=$("newPassword").value;
    const confirmNext=$("confirmPassword").value;
    const btn=$("passwordSaveBtn");

    if(!current)return setAccountMsg("Enter your current password.");
    if(next.length<8)return setAccountMsg("New password must contain at least 8 characters.");
    if(next.length>128)return setAccountMsg("New password is too long.");
    if(next!==confirmNext)return setAccountMsg("New password and confirmation do not match.");
    if(next===current)return setAccountMsg("Choose a new password different from the current password.");

    btn.disabled=true;
    setAccountMsg("Updating password...",true);

    try{
      const r=await authFetch("/api/student/change-password",{
        method:"PATCH",
        body:JSON.stringify({
          currentPassword:current,
          newPassword:next
        })
      });

      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Password change failed");

      localStorage.removeItem(TOKEN_KEY);

      setAccountBody(`
        <div class="account-icon">✅</div>
        <h2>Password Changed Successfully</h2>
        <p class="account-copy">Your old student sessions were signed out. Please log in again using your new password.</p>
        <div class="account-actions-row">
          <button class="save" id="loginAgainBtn" type="button">🚀 Login Again</button>
        </div>
      `);

      $("loginAgainBtn").onclick=()=>location.href="student-login.html";
    }catch(error){
      setAccountMsg(error.message||"Password change failed.");
      btn.disabled=false;
    }
  };
}

function profileModal(){
  const p=profile||{};

  setAccountBody(`
    <div class="account-icon">✏️</div>
    <h2>Edit My Private Profile</h2>
    <p class="account-copy">Update your student profile. Your current password is required to save changes.</p>

    <div class="account-field">
      <label>Display Name</label>
      <input id="editDisplayName" maxlength="60" value="${esc(p.display_name||"")}">
    </div>

    <div class="account-field">
      <label>Nickname</label>
      <input id="editNickname" maxlength="40" value="${esc(p.nickname||"")}">
    </div>

    <div class="account-field">
      <label>Gender</label>
      <select id="editGender">
        <option value="">Select Gender</option>
        <option value="male"${String(p.gender||"").toLowerCase()==="male"?" selected":""}>Male</option>
        <option value="female"${String(p.gender||"").toLowerCase()==="female"?" selected":""}>Female</option>
      </select>
    </div>

    <div class="account-field">
      <label>Location</label>
      <input id="editLocation" maxlength="120" value="${esc(p.location||"")}" placeholder="City / Country">
    </div>

    <div class="account-field">
      <label>About Me</label>
      <textarea id="editBio" rows="4" maxlength="240" placeholder="I like networking, AI and troubleshooting.">${esc(p.bio||"")}</textarea>
    </div>

    <div class="account-field">
      <label>Current Password — required to save</label>
      <div class="password-wrap">
        <input id="editProfilePassword" type="password" autocomplete="current-password" placeholder="Enter current password">
        <button class="password-eye" type="button" data-password-eye="editProfilePassword" title="Show password">👁</button>
      </div>
    </div>

    <div class="password-rules">
      🔒 Gender, location and bio are private student details. Guardian contact details are not displayed here.
    </div>

    <div id="accountMsg" class="account-msg"></div>

    <div class="account-actions-row">
      <button class="cancel" id="profileCancelBtn" type="button">Cancel</button>
      <button class="save" id="profileSaveBtn" type="button">💾 Save Profile</button>
    </div>
  `);

  wirePasswordEyes();

  $("profileCancelBtn").onclick=()=>closeModal("accountModal");

  $("profileSaveBtn").onclick=async()=>{
    const btn=$("profileSaveBtn");
    const displayName=$("editDisplayName").value.trim();
    const password=$("editProfilePassword").value;

    if(displayName.length<2)return setAccountMsg("Display name is too short.");
    if(!password)return setAccountMsg("Enter your current password to save profile changes.");

    btn.disabled=true;
    setAccountMsg("Saving profile...",true);

    try{
      const r=await authFetch("/api/student/profile",{
        method:"PATCH",
        body:JSON.stringify({
          displayName,
          nickname:$("editNickname").value.trim(),
          gender:$("editGender").value,
          location:$("editLocation").value.trim(),
          bio:$("editBio").value.trim(),
          password
        })
      });

      const data=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(data.error||"Could not save profile");

      if(data.profile)profile=data.profile;
      renderProfile();
      await loadHeroPhoto();

      setAccountMsg("Profile saved successfully ✓",true);
      toast("Profile updated ✓");
      setTimeout(()=>closeModal("accountModal"),700);
    }catch(error){
      setAccountMsg(error.message||"Could not save profile.");
      btn.disabled=false;
    }
  };
}

async function logout(){
  try{
    await authFetch("/api/auth/logout",{method:"POST"});
  }catch{}
  localStorage.removeItem(TOKEN_KEY);
  location.href="student-login.html";
}

function bindUi(){
  document.querySelectorAll(".learning-nav button").forEach(button=>{
    button.onclick=()=>{
      document.querySelectorAll(".learning-nav button").forEach(x=>x.classList.remove("active"));
      button.classList.add("active");
      renderWorlds(button.dataset.filter);
    };
  });

  $("worldModalClose").onclick=()=>closeModal("worldModal");
  $("accountModalClose").onclick=()=>closeModal("accountModal");

  $("worldModal").onclick=e=>{
    if(e.target===$("worldModal"))closeModal("worldModal");
  };

  $("accountModal").onclick=e=>{
    if(e.target===$("accountModal"))closeModal("accountModal");
  };

  document.addEventListener("keydown",e=>{
    if(e.key!=="Escape")return;
    closeModal("worldModal");
    closeModal("accountModal");
  });

  $("accountBtn").onclick=accountMenu;
  $("changePhotoBtn").onclick=photoModal;
  $("changePasswordBtn").onclick=passwordModal;
  $("editProfileBtn").onclick=profileModal;
  $("quickPhotoBtn").onclick=photoModal;
  $("quickPasswordBtn").onclick=passwordModal;
  $("quickProfileBtn").onclick=profileModal;
  $("logoutBtn").onclick=logout;

  window.addEventListener("pageshow",()=>{
    if(profile)renderStats();
  });
}

async function boot(){
  if(!TOKEN){
    location.href="student-login.html";
    return;
  }

  try{
    const r=await authFetch("/api/auth/me");
    const data=await r.json();

    if(!r.ok||data.role!=="student"||!data.profile){
      throw new Error("Student login required");
    }

    profile=data.profile;
    const c=Number(profile.class_number||0);

    if(c<7||c>10){
      if(c>=1&&c<=3)location.href="foundation-universe.html";
      else if(c>=4&&c<=6)location.href="advanced-universe.html";
      else location.href="student-profile.html";
      return;
    }

    renderProfile();
    renderStats();
    renderMissions();
    renderWorlds();
    await loadHeroPhoto();

  }catch(error){
    localStorage.removeItem(TOKEN_KEY);
    location.href="student-login.html";
  }
}

bindUi();
boot();

})();
