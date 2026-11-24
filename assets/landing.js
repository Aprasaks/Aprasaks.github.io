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
  const newsletterFrame=document.getElementById('newsletter-frame');
  const NEWSLETTER_URL='https://letter.dechive.app/subscribe/?source=dechive.app';
  const newsletterTitle=document.getElementById('newsletter-title');
  const newsletterDescription=newsletterDialog?.querySelector('.newsletter-description');
  const newsletterPrivacy=newsletterDialog?.querySelector('.newsletter-privacy');
  const newsletterSuccess=document.getElementById('newsletter-success');
  const newsletterSuccessConfirm=document.getElementById('newsletter-success-confirm');

  const resetNewsletterView=()=>{
    if(newsletterTitle)newsletterTitle.textContent='뉴스레터 구독';
    if(newsletterDescription)newsletterDescription.hidden=false;
    if(newsletterPrivacy)newsletterPrivacy.hidden=false;
    if(newsletterFrame)newsletterFrame.hidden=false;
    if(newsletterSuccess)newsletterSuccess.hidden=true;
  };

  // Only accept success notifications from our own subscription iframe.
  // The message contains no email address or verification token.
  window.addEventListener('message',event=>{
    if(event.origin!=='https://letter.dechive.app'
      ||event.source!==newsletterFrame?.contentWindow
      ||event.data?.type!=='dechive-letter:subscription-received'
      ||!newsletterDialog?.open)return;
    if(newsletterTitle)newsletterTitle.textContent='구독 신청 감사합니다.';
    if(newsletterDescription)newsletterDescription.hidden=true;
    if(newsletterPrivacy)newsletterPrivacy.hidden=true;
    if(newsletterFrame)newsletterFrame.hidden=true;
    if(newsletterSuccess)newsletterSuccess.hidden=false;
    newsletterSuccessConfirm?.focus();
  });
  newsletterSuccessConfirm?.addEventListener('click',()=>newsletterDialog?.close());
  newsletterDialog?.addEventListener('close',resetNewsletterView);

  newsletterDialog?.querySelectorAll('[data-newsletter-close]').forEach(button=>
    button.addEventListener('click',()=>newsletterDialog.close())
  );
  newsletterDialog?.addEventListener('click',event=>{
    if(event.target===newsletterDialog)newsletterDialog.close();
  });

  document.querySelectorAll('[data-destination]').forEach(button=>{
    button.addEventListener('click',()=>{
      const key=button.dataset.destination;
      if(key==='newsletter'){
        resetNewsletterView();
        if(newsletterFrame && !newsletterFrame.hasAttribute('src')){
          newsletterFrame.setAttribute('src',NEWSLETTER_URL);
        }
        newsletterDialog?.showModal();
        newsletterFrame?.focus();
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