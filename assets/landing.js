(()=>{'use strict';
  /* Insert verified, active HTTPS destinations below. No placeholder URLs are opened. */
  const DESTINATIONS={consult:'',newsletter:''};
  const dialog=document.getElementById('destination-notice');
  const noticeCopy=document.getElementById('notice-copy');

  const menuButton=document.querySelector('.menu-trigger');
  const menu=document.getElementById('site-menu');
  const closeMenu=()=>{
    if(!menu||!menuButton)return;
    menu.hidden=true; menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','메뉴 열기');
  };
  menuButton?.addEventListener('click',()=>{
    if(!menu)return;
    const show=menu.hidden;
    menu.hidden=!show;
    menuButton.setAttribute('aria-expanded',String(show));
    menuButton.setAttribute('aria-label',show?'메뉴 닫기':'메뉴 열기');
  });
  document.addEventListener('pointerdown',e=>{
    if(!menu?.hidden && !e.target.closest('.site-header'))closeMenu();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

  const typed=document.getElementById('typed-word');
  if(typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const letters=Array.from('재설계');
    let i=0;
    typed.textContent='';
    const type=()=>{
      if(i<letters.length){
        typed.textContent+=letters[i++];
        window.setTimeout(type,i===letters.length?200:270);
      }
    };
    window.setTimeout(type,630);
  }

  document.querySelectorAll('[data-destination]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=button.dataset.destination;
      const url=DESTINATIONS[key];
      if(url && /^https:\/\//i.test(url)){
        window.open(url,'_blank','noopener,noreferrer');
        return;
      }
      if(noticeCopy)noticeCopy.textContent=key==='consult'
        ? '상담 신청 폼 주소가 연결되기 전입니다.'
        : '뉴스레터 구독 페이지 주소가 연결되기 전입니다.';
      if(dialog?.showModal)dialog.showModal();
    });
  });
  dialog?.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
})();