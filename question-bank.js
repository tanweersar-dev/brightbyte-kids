(function(){
const categories={
Digital:["monitor","mouse","keyboard","system unit","RAM","SSD","printer","speaker","webcam","router","switch","file","folder","browser","Wi-Fi"],
English:["hello","thank you","please","sorry","family","school","happy","help","repeat","computer","water","friend"],
Safety:["password","unknown link","download","private information","trusted adult","kind online","screen break"],
Healthy:["water","fruit","vegetables","breakfast","sleep","hand washing","teeth","movement","sometimes food"],
Logic:["pattern","sequence","matching","odd one out","memory","observation"],
AI:["clear prompt","private information","check answers","ask clearly","safe AI"]
};
const bank=[];let id=1;
for(const [cat,items] of Object.entries(categories)){for(let round=1;round<=65;round++){for(const item of items){bank.push({id:id++,cat,level:1+(round%3),q:`${cat} practice: choose or explain ${item}.`,a:item,kind:round%5===0?'speaking':round%4===0?'picture':round%3===0?'practical':'mcq'});}}}
while(bank.length<5200){const n=bank.length+1,cat=Object.keys(categories)[n%Object.keys(categories).length],item=categories[cat][n%categories[cat].length];bank.push({id:n,cat,level:1+(n%3),q:`Skill challenge ${n}: what do you know about ${item}?`,a:item,kind:n%4===0?'picture':'mcq'});}
window.TANNU_QUESTION_BANK=bank.slice(0,5200);window.TANNU_QUESTION_COUNT=window.TANNU_QUESTION_BANK.length;

/* Student Galaxy refresh fix */
const GALAXY_API='https://brightbyte-kids-api.tanweerstudy25.workers.dev';
const galaxyEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function galaxyRender(rows){
  const grid=document.getElementById('studentGrid');
  if(!grid)return;
  grid.innerHTML=(rows||[]).map((s,i)=>`<article class="student-card"><div class="student-top"><div class="student-photo" id="galaxy-photo-${i}">${s.photoUrl?`<img src="${galaxyEsc(s.photoUrl)}" alt="${galaxyEsc(s.name)}">`:(s.photo||'🧒')}</div><div><h3>${galaxyEsc(s.name)}</h3><small>${galaxyEsc(s.cls)}</small></div></div><div class="progress"><i style="width:${Math.min(100,Number(s.progress)||0)}%"></i></div><p><b>Progress:</b> ${Number(s.progress)||0}%</p><p><b>Track:</b> ${galaxyEsc(s.focus||'90-Day Digital + English + Confidence Program')}</p>${s.self?'<p><b>🔒 My Private Profile</b></p>':s.admin?'<p><b>🔒 Admin View</b></p>':s.demo?'<p><b>Demo Student</b></p>':'<p><b>🌐 Public</b></p>'}</article>`).join('');
}
async function galaxyPhoto(url,token,index,name){
  try{
    const r=await fetch(url,{headers:{Authorization:'Bearer '+token},cache:'no-store'});
    if(!r.ok)return;
    const objectUrl=URL.createObjectURL(await r.blob());
    const box=document.getElementById('galaxy-photo-'+index);
    if(box)box.innerHTML=`<img src="${objectUrl}" alt="${galaxyEsc(name)}">`;
  }catch{}
}
async function refreshStudentGalaxy(){
  const grid=document.getElementById('studentGrid');
  if(!grid)return;
  const demo={name:'Zen Alpha',cls:'Class 1',progress:20,focus:'90-Day Digital Explorer',photo:'🧒',demo:true};
  const adminToken=localStorage.getItem('brightbyte_admin_token')||'';
  const studentToken=localStorage.getItem('brightbyte_student_token')||'';
  try{
    if(adminToken){
      const r=await fetch(GALAXY_API+'/api/admin/students',{headers:{Authorization:'Bearer '+adminToken},cache:'no-store'});
      if(r.ok){
        const d=await r.json();
        const rows=(d.students||[]).filter(x=>String(x.status||'').toLowerCase()==='active').map(x=>({name:x.display_name||x.username||'Student',cls:'Class '+(x.class_number||1),progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital + English + Confidence Program',photo:'🧒',userId:x.user_id,hasPhoto:!!x.has_photo,admin:true}));
        galaxyRender(rows.length?rows:[demo]);
        rows.forEach((x,i)=>{if(x.hasPhoto&&x.userId)galaxyPhoto(`${GALAXY_API}/api/admin/students/${x.userId}/photo`,adminToken,i,x.name)});
        return;
      }
    }
    if(studentToken){
      const me=await fetch(GALAXY_API+'/api/auth/me',{headers:{Authorization:'Bearer '+studentToken},cache:'no-store'});
      if(me.ok){
        const md=await me.json();
        if(md.role==='student'){
          const r=await fetch(GALAXY_API+'/api/student/roster',{headers:{Authorization:'Bearer '+studentToken},cache:'no-store'});
          if(r.ok){
            const d=await r.json();
            const rows=(d.students||[]).map(x=>({name:x.display_name||'Student',cls:'Class '+(x.class_number||1),progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital + English + Confidence Program',photo:'🧒',userId:x.user_id,hasPhoto:!!x.has_photo,self:!!x.is_self}));
            galaxyRender(rows.length?rows:[demo]);
            rows.forEach((x,i)=>{if(x.hasPhoto&&x.userId)galaxyPhoto(`${GALAXY_API}/api/student/roster/${x.userId}/photo`,studentToken,i,x.name)});
            return;
          }
        }
      }
    }
    const r=await fetch(GALAXY_API+'/api/students/public',{cache:'no-store'});
    if(r.ok){
      const d=await r.json();
      const rows=(d.students||[]).map(x=>({name:x.display_name||'Student',cls:'Class '+(x.class_number||1),progress:x.progress_percent||0,focus:x.training_track||'90-Day Digital + English + Confidence Program',photoUrl:x.photo_url||'',photo:'🧒'}));
      galaxyRender(rows.length?rows:[demo]);
      return;
    }
  }catch{}
  galaxyRender([demo]);
}
window.refreshStudentGalaxy=refreshStudentGalaxy;
window.addEventListener('load',()=>setTimeout(refreshStudentGalaxy,150));
window.addEventListener('focus',refreshStudentGalaxy);
window.addEventListener('pageshow',refreshStudentGalaxy);
window.addEventListener('storage',e=>{if(e.key==='brightbyte_admin_token'||e.key==='brightbyte_student_token')refreshStudentGalaxy()});
document.addEventListener('click',e=>{if(e.target.closest('[data-page="students"]'))setTimeout(refreshStudentGalaxy,120)});
})();
