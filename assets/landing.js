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

  const newsletterDialog=document.getElementById('newsletter-dialog');
  const newsletterForm=document.getElementById('newsletter-form');
  const newsletterEmail=document.getElementById('newsletter-email');
  const newsletterStatus=document.getElementById('newsletter-status');
  const newsletterSubmit=newsletterForm?.querySelector('[type="submit"]');
  const NEWSLETTER_ENDPOINT='https://formsubmit.co/ajax/298ea801ae249c951d035afc4174346b';

  newsletterDialog?.querySelectorAll('[data-newsletter-close]').forEach(button=>
    button.addEventListener('click',()=>{if(!newsletterSubmit?.disabled)newsletterDialog.close();})
  );
  newsletterDialog?.addEventListener('click',event=>{
    if(event.target===newsletterDialog&&!newsletterSubmit?.disabled)newsletterDialog.close();
  });
  newsletterForm?.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!newsletterForm.reportValidity()||newsletterSubmit?.disabled)return;
    const email=newsletterEmail.value.trim();
    newsletterStatus.classList.remove('is-error');
    newsletterStatus.textContent='신청을 전송하고 있습니다.';
    newsletterSubmit.disabled=true;
    const controller=new AbortController();
    const timer=window.setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch(NEWSLETTER_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({
          email,
          _subject:'[DECHIVE] 새로운 뉴스레터 구독 신청',
          _template:'table',
          _honey:document.getElementById('newsletter-honey')?.value||'',
          source:'https://dechive.app/',
          type:'newsletter',
        }),
        signal:controller.signal
      });
      const data=await response.json();
      const successful=response.ok&&(data.success===true||data.success==='true');
      if(!successful){
        throw new Error(data?.message||'전송 실패');
      }
      newsletterStatus.textContent='구독 신청이 접수되었습니다.';
      newsletterEmail.value='';
      newsletterForm.querySelector('#newsletter-consent').checked=false;
    }catch(error){
      newsletterStatus.classList.add('is-error');
      newsletterStatus.textContent='신청을 완료하지 못했습니다. 잠시 뒤 다시 시도해주세요.';
      console.warn('Newsletter submission failed:',error);
    }finally{
      window.clearTimeout(timer);
      newsletterSubmit.disabled=false;
    }
  });

  document.querySelectorAll('[data-destination]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=button.dataset.destination;
      if(key==='newsletter'){
        newsletterStatus.textContent='';
        newsletterStatus.classList.remove('is-error');
        newsletterDialog?.showModal();
        newsletterEmail?.focus();
        return;
      }
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