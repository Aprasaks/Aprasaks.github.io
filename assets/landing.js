(()=>{'use strict';
  /* Insert verified, active HTTPS destinations below. No placeholder URLs are opened. */
  const DESTINATIONS={consult:'',newsletter:''};
  const dialog=document.getElementById('destination-notice');
  const noticeCopy=document.getElementById('notice-copy');

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