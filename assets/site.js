/*
 * 상담 신청 채널 설정
 * 사용할 채널의 값만 채우면 상담 섹션 버튼이 자동으로 나타납니다.
 * 비워둔 채널은 화면에 나오지 않습니다.
 */
var DECHIVE_CONTACT = {
  kakao: '',      // 카카오톡 오픈채팅 링크  예: 'https://open.kakao.com/o/xxxx'
  form: '',       // 신청서(구글폼 등) 링크
  email: '',      // 이메일 주소              예: 'hello@dechive.dev'
  instagram: '',  // 인스타그램 링크
  blog: 'https://blog.naver.com/dechive-ai'
};

(function () {
  'use strict';

  // 모바일 메뉴
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
      document.body.classList.toggle('nav-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // 헤더: 히어로를 지나면 배경을 채움
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.4);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 상담 채널 버튼
  var box = document.getElementById('contact-channels');
  if (box) {
    var c = DECHIVE_CONTACT;
    var items = [];
    if (c.kakao) items.push({ href: c.kakao, label: '카카오톡으로 상담 신청', primary: true });
    if (c.form) items.push({ href: c.form, label: '신청서 작성하기', primary: !c.kakao });
    if (c.email) items.push({ href: 'mailto:' + c.email + '?subject=' + encodeURIComponent('[DECHIVE] 수업 상담 신청'), label: c.email, primary: !c.kakao && !c.form });
    if (c.instagram) items.push({ href: c.instagram, label: '인스타그램 DM' });
    var hasDirect = items.length > 0;
    if (c.blog) items.push({ href: c.blog, label: hasDirect ? '블로그 둘러보기' : '블로그에 댓글로 문의하기', primary: !hasDirect });

    items.forEach(function (it) {
      var a = document.createElement('a');
      a.href = it.href;
      a.className = it.primary ? 'btn btn-primary' : 'btn btn-line';
      a.textContent = it.label;
      if (/^https?:/.test(it.href)) { a.target = '_blank'; a.rel = 'noopener'; }
      box.appendChild(a);
    });
  }

  // 글 읽기 진행 표시
  var bar = document.getElementById('reading-progress');
  if (bar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    }, { passive: true });
  }

  // 노트 목록 필터
  var filter = document.getElementById('note-filter');
  if (filter) {
    var cards = document.querySelectorAll('[data-note]');
    var empty = document.getElementById('note-empty');
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (el) {
        var hit = !q || el.textContent.toLowerCase().indexOf(q) > -1;
        el.hidden = !hit;
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }
})();
