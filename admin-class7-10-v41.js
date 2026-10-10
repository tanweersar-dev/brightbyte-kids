(() => {
"use strict";
/* V41.0 — Add Class 7–10 safely to existing Admin UI without replacing admin.html logic. */
if(window.__TANNU_ADMIN_CLASS_7_10_V41__) return;
window.__TANNU_ADMIN_CLASS_7_10_V41__=true;

const GROUPS=[
  ["FOUNDATION",1,3],
  ["FUTURE SKILLS",4,6],
  ["PROFESSIONAL IT & AI",7,10]
];

function trackFor(c){
  c=Number(c||1);
  if(c<=3)return"Foundation Digital Skills Program";
  if(c<=6)return"Future Skills & AI Program";
  return"Professional IT & AI Skills Program";
}
function rebuildClassSelect(select,selected){
  if(!select)return;
  const keep=String(selected??select.value??"1");
  select.innerHTML="";
  GROUPS.forEach(([label,a,b])=>{
    const g=document.createElement("optgroup");g.label=label;
    for(let c=a;c<=b;c++){const o=document.createElement("option");o.value=String(c);o.textContent=`Class ${c}`;g.appendChild(o)}
    select.appendChild(g);
  });
  select.value=keep;
  if(!select.value)select.value="1";
}
function rebuildFilter(select){
  if(!select)return;
  const keep=select.value||"all";select.innerHTML='<option value="all">All Classes</option>';
  GROUPS.forEach(([label,a,b])=>{const g=document.createElement("optgroup");g.label=label;for(let c=a;c<=b;c++){const o=document.createElement("option");o.value=String(c);o.textContent=`Class ${c}`;g.appendChild(o)}select.appendChild(g)});
  select.value=keep;
}
function bindTrack(select,input){
  if(!select||!input||select.dataset.v41Track)return;
  select.dataset.v41Track="1";
  select.addEventListener("change",()=>{const old=String(input.value||"");if(!old||/90-Day Digital|Computer \+ AI Explorer|Foundation Digital|Future Skills|Professional IT/i.test(old))input.value=trackFor(select.value)});
}
function currentEditClass(){
  try{
    if(window.__v41EditStudentId && typeof students!=="undefined"){
      const s=students.find(x=>Number(x.user_id)===Number(window.__v41EditStudentId));return s?.class_number;
    }
  }catch{}
  return null;
}
function currentRecordClass(){
  try{
    if(window.__v41EnrollRecordId && typeof enrollmentRecordsCache!=="undefined"){
      const r=enrollmentRecordsCache.find(x=>Number(x.id)===Number(window.__v41EnrollRecordId));return r?.class_number;
    }
  }catch{}
  return null;
}
function enhance(){
  const c=$id("cClass");if(c&&!c.dataset.v41){rebuildClassSelect(c,c.value);c.dataset.v41="1";bindTrack(c,$id("cTrack"));if($id("cTrack"))$id("cTrack").value=trackFor(c.value)}
  const e=$id("eClass");if(e&&!e.dataset.v41){rebuildClassSelect(e,currentEditClass()??e.value);e.dataset.v41="1";bindTrack(e,$id("eTrack"))}
  const rec=document.querySelector('select[name="classNumber"]');
  if(rec&&!rec.dataset.v41){rebuildClassSelect(rec,currentRecordClass()??rec.value);rec.dataset.v41="1"}
  const filter=$id("enrollClassV407");if(filter&&!filter.dataset.v41){rebuildFilter(filter);filter.dataset.v41="1"}
}
function $id(id){return document.getElementById(id)}
try{
  const oldEdit=window.editStudent;
  if(typeof oldEdit==="function")window.editStudent=async function(id){window.__v41EditStudentId=id;return oldEdit(id)};
  const oldRec=window.openEnrollmentRecordEditorV407;
  if(typeof oldRec==="function")window.openEnrollmentRecordEditorV407=function(id=0){window.__v41EnrollRecordId=Number(id||0);return oldRec(id)};
}catch{}
new MutationObserver(()=>enhance()).observe(document.body,{childList:true,subtree:true});
document.addEventListener("change",e=>{if(e.target?.id==="cClass"&&$id("cTrack"))$id("cTrack").value=trackFor(e.target.value)});
setTimeout(enhance,100);
})();
