(()=>{'use strict';
  const CONSULT_URL='https://docs.google.com/forms/d/e/1FAIpQLSdKnGWKXG0t5CmHsU1lTAHrxwjmYV69IshLvb-CDPAtdagPlw/viewform';
  const consultDialog=document.getElementById('consult-dialog');
  const consultFrame=document.getElementById('consult-frame');
  consultDialog?.querySelector('[data-consult-close]')?.addEventListener('click',()=>consultDialog.close());
  consultDialog?.addEventListener('click',event=>{
    if(event.target===consultDialog)consultDialog.close();
  });

  const recordsToggle=document.getElementById('records-toggle');
  const recordsList=document.getElementById('records-list');
  const setRecordsOpen=(open)=>{
    if(!recordsToggle || !recordsList)return;
    recordsList.hidden=!open;
    recordsToggle.setAttribute('aria-expanded',String(open));
  };
  recordsToggle?.addEventListener('click',()=>setRecordsOpen(recordsList.hidden));
  document.addEventListener('click',event=>{
    if(!recordsList?.hidden && !recordsToggle?.contains(event.target) && !recordsList?.contains(event.target)){
      setRecordsOpen(false);
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && !recordsList?.hidden){
      setRecordsOpen(false);
      recordsToggle.focus();
    }
  });

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
      if(key==='consult'){
        if(consultFrame && !consultFrame.hasAttribute('src')){
          consultFrame.src=CONSULT_URL+'?embedded=true';
        }
        consultDialog?.showModal();
      }
    });
  });
})();