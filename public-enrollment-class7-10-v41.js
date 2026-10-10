(() => {
"use strict";
/* V41.0 — Extend only the public enrollment form to Class 10.
   Existing Class 1–6 submit logic remains untouched. */
if(window.__TANNU_PUBLIC_CLASS_7_10_V41__)return;
window.__TANNU_PUBLIC_CLASS_7_10_V41__=true;
const API="https://api.tanweer.site";
const select=document.getElementById("contactClassV406");
if(select){
  for(let c=7;c<=10;c++){if(!select.querySelector(`option[value="${c}"]`)){const o=document.createElement("option");o.value=String(c);o.textContent=`Class ${c} • Professional IT & AI`;select.appendChild(o)}}
}
function status(text,kind=""){
 const el=document.getElementById("contactStatusV406");if(!el)return;
 el.textContent=text;el.classList.remove("good","bad");if(kind)el.classList.add(kind);
}
document.addEventListener("submit",async e=>{
 const form=e.target;if(form?.id!=="contactEnrollmentFormV406")return;
 const c=Number(form.classNumber?.value||0);if(c<7||c>10)return; // Class 1–6 uses existing handler.
 e.preventDefault();e.stopImmediatePropagation();
 const parentName=String(form.parentName?.value||"").trim();
 const studentName=String(form.studentName?.value||"").trim();
 const method=String(form.querySelector('input[name="contactMethod"]:checked')?.value||"");
 const value=String(form.contactValue?.value||"").trim();
 const consent=document.getElementById("contactConsentV406")?.checked===true;
 if(parentName.length<2||studentName.length<2){status("Please enter parent/guardian and student names.","bad");return}
 if(!["whatsapp","phone","email"].includes(method)){status("Please choose a contact method.","bad");return}
 if(!consent){status("Please confirm that the academy may contact you about enrollment.","bad");return}
 const btn=document.getElementById("contactSubmitV406");if(btn){btn.disabled=true;btn.textContent="Sending securely…"}
 try{
   let visitorKey="";try{visitorKey=localStorage.getItem("brightbyte_enrollment_visitor")||"";if(!visitorKey){visitorKey="v-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);localStorage.setItem("brightbyte_enrollment_visitor",visitorKey)}}catch{}
   const r=await fetch(API+"/api/enrollment-requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
     visitorKey,parentName,studentName,classNumber:c,
     studentAge:form.studentAge&&form.studentAge.value?Number(form.studentAge.value):null,
     parentLocation:String(form.parentLocation?.value||"").trim(),
     contactMethod:method,contactValue:value,note:String(form.note?.value||"").trim(),
     consent,website:String(form.website?.value||"").trim()
   })});
   const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Could not send request");
   status("✅ Request received. The academy will review it and contact you personally.","good");form.reset();
 }catch(err){status("⚠️ "+(err.message||"Could not send request."),"bad")}
 finally{if(btn){btn.disabled=false;btn.textContent="📩 Send Private Request"}}
},true);
})();
