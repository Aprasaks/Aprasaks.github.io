(()=>{'use strict';
const header=document.getElementById('site-header');
const nav=document.getElementById('site-nav');
const toggle=document.querySelector('.menu-toggle');
const updateHeader=()=>{header?.classList.toggle('is-scrolled',window.scrollY>30)};
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
if(toggle&&nav){const close=()=>{nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','메뉴 열기')};toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
document.querySelectorAll('[data-year]').forEach(e=>e.textContent=String(new Date().getFullYear()));
const cases={failure:{before:'“이번에는 더 열심히 해야지.”',after:'“어느 순간부터 일이 늦어졌을까?”',steps:['시작 시점','막힌 조건','점검 기준'],url:'/notes/repeating-failure/'},goal:{before:'“저 사람처럼 성공하고 싶다.”',after:'“그 과정을 내가 정말 원할까?”',steps:['보이는 결과','치러야 할 과정','내가 선택할 이유'],url:'/notes/whose-goal/'}};
const tabs=[...document.querySelectorAll('[data-case]')];
const before=document.getElementById('case-before'),after=document.getElementById('case-after'),trail=document.getElementById('logic-trail'),link=document.getElementById('case-link');
tabs.forEach(btn=>btn.addEventListener('click',()=>{const s=cases[btn.dataset.case];if(!s)return;tabs.forEach(t=>{const active=t===btn;t.classList.toggle('is-active',active);t.setAttribute('aria-pressed',String(active))});if(before)before.textContent=s.before;if(after)after.textContent=s.after;if(trail){trail.replaceChildren();s.steps.forEach((value,i)=>{if(i){const arrow=document.createElement('i');arrow.textContent='→';trail.append(arrow)}const item=document.createElement('span');item.textContent=value;trail.append(item)})}if(link)link.href=s.url}));
const noteFilter=document.getElementById('note-filter');if(noteFilter){const rows=[...document.querySelectorAll('[data-note]')],empty=document.getElementById('note-empty');noteFilter.addEventListener('input',()=>{const q=noteFilter.value.trim().toLocaleLowerCase('ko-KR');let visible=0;rows.forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase('ko-KR').includes(q);if(!row.hidden)visible++});if(empty)empty.hidden=visible>0})}
const progress=document.getElementById('reading-progress');if(progress){let scheduled=false;const draw=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.transform='scaleX('+Math.max(0,Math.min(1,scrollY/max))+')';scheduled=false};addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(draw);scheduled=true}},{passive:true});addEventListener('resize',draw);draw()}
})();
