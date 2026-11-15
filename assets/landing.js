(()=>{'use strict';
/* Add the verified destination URLs here once created. No dummy URLs. */
const DESTINATIONS={consult:'',newsletter:''};
const dialog=document.getElementById('destination-notice');
const copy=document.getElementById('notice-copy');
document.querySelectorAll('[data-destination]').forEach(button=>{
 button.addEventListener('click',()=>{
  const key=button.dataset.destination;
  const url=DESTINATIONS[key];
  if(url && /^https:\/\//i.test(url)){window.open(url,'_blank','noopener,noreferrer');return}
  if(copy)copy.textContent=key==='consult'?'구글 상담 신청폼 주소를 연결한 뒤 이용할 수 있습니다.':'뉴스레터 구독 주소를 연결한 뒤 이용할 수 있습니다.';
  if(dialog?.showModal)dialog.showModal();
 });
});
dialog?.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
})();