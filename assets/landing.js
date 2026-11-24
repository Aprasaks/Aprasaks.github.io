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