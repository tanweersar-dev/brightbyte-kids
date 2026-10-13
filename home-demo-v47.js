/* V47.1 – safe isolated upgrade. Keep all original course / home nodes in DOM. */
(()=>{'use strict';
function init(){
  const home=document.getElementById('home');
  const hero=home?.querySelector('.hero');
  if(!home||!hero)return;
  home.classList.add('bb-v471-home');
  let banner=document.getElementById('bbV47Hero');
  if(!banner){
    banner=document.createElement('section');
    banner.id='bbV47Hero';
    banner.setAttribute('aria-label','Look. Listen. Speak. Play. Grow. Explore the BrightByte Kids learning adventure');
    banner.innerHTML=`<img src="assets/brightbyte-hero-v47.webp?v=47.1" alt="BrightByte Kids: Look. Listen. Speak. Play. Grow. Classes 1 to 3, 4 to 6 and 7 to 10. Computer skills, networking, coding, AI, English and practical learning." loading="eager" decoding="async"><div class="bbV47Actions"><a href="academy-demo.html">🚀 Explore Free Demo</a><a href="academy-demo.html#parents">👨‍👩‍👧 Parent Preview</a></div>`;
    hero.before(banner);
  }
  const nav=document.querySelector('.mainnav');
  if(nav&&!document.getElementById('bbV47DemoNav')){
    const btn=document.createElement('button');btn.id='bbV47DemoNav';btn.type='button';
    btn.innerHTML='✨<span>Demo</span>';
    btn.addEventListener('click',()=>{location.href='academy-demo.html'});
    const courseBtn=Array.from(nav.querySelectorAll('button')).find(b=>b.dataset.page==='course');
    if(courseBtn)courseBtn.after(btn);else nav.append(btn);
  }
  const course=document.getElementById('course');
  if(course&&!document.getElementById('bbV47CourseLink')){
    const a=document.createElement('a');a.id='bbV47CourseLink';a.href='academy-demo.html';
    a.textContent='✨ Explore Class, Lab & Exam Demo →';
    const header=course.querySelector('.section-head');(header||course).append(a);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
