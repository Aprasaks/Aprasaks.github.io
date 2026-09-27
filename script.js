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


// Principles typewriter — runs once when the statement enters the viewport.
(function initPrinciplesTypewriter() {
  var lines = document.querySelectorAll('.principles-typing');
  if (!lines.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderFull(line) {
    var output = line.querySelector('.principles-typing-output');
    if (!output) return;
    output.textContent = line.getAttribute('data-typing') || '';
    line.classList.remove('is-typing');
    line.dataset.typed = 'true';
  }

  function typeLine(line) {
    if (line.dataset.typed === 'true') return;

    var output = line.querySelector('.principles-typing-output');
    var text = line.getAttribute('data-typing') || '';
    if (!output) return;

    if (reduceMotion) {
      renderFull(line);
      return;
    }

    line.dataset.typed = 'true';
    line.classList.add('is-typing');
    output.textContent = '';

    var index = 0;
    function tick() {
      output.textContent = text.slice(0, index);
      if (index >= text.length) {
        line.classList.remove('is-typing');
        return;
      }
      index += 1;
      window.setTimeout(tick, 58);
    }

    window.setTimeout(tick, 220);
  }

  if (!('IntersectionObserver' in window)) {
    lines.forEach(typeLine);
    return;
  }

  var typingObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        typeLine(entry.target);
        typingObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  lines.forEach(function (line) {
    typingObserver.observe(line);
  });
})();
