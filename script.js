// DECHIVE STUDIO — interaction layer

var header = document.querySelector('.site-header');
var navToggle = document.querySelector('.nav-toggle');
var mobileMenu = document.getElementById('mobile-menu');

function setHeaderState() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 10);
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

function closeMobileMenu() {
  if (!navToggle || !mobileMenu) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '메뉴 열기');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
    mobileMenu.setAttribute('aria-hidden', String(isOpen));
    document.body.classList.toggle('menu-open', !isOpen);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    var href = link.getAttribute('href');
    if (!href || href === '#') return;

    var target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMobileMenu();

    var headerHeight = header ? header.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

    window.scrollTo({
      top: top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  });
});

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(function (element) {
    observer.observe(element);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function (element) {
    element.classList.add('visible');
  });
}
