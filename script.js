// Smooth scroll with header offset
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var id = this.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    var header = document.querySelector('.site-header');
    var offset = header ? header.offsetHeight + 12 : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

// Mobile menu toggle
var navToggle = document.querySelector('.nav-toggle');
var mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '메뉴 열기');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', function () {
    var isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!isOpen));
    this.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });
}
